#!/usr/bin/env node
// Starts the pinned Playwright MCP server with limits the model can't lift:
// - runs in a throwaway folder and never learns the project root
// - removes code execution and every caller-chosen file name
// - reaches only local hosts, plus any in GDUI_ALLOWED_ORIGINS (";"-separated)
// - uploads only the generated sample files
import { spawn } from 'node:child_process';
import { createInterface } from 'node:readline';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const SERVER = '@playwright/mcp@0.0.83';
const BLOCKED_TOOLS = new Set(['browser_run_code_unsafe', 'browser_run_code']);
const LOCAL_ORIGINS = ['http://localhost:*', 'https://localhost:*', 'http://127.0.0.1:*', 'https://127.0.0.1:*'];
const LARGE_FILE_BYTES = 12 * 1024 * 1024;
const PNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const SAMPLES = {
  'sample.png': Buffer.from(PNG, 'base64'),
  'sample.txt': 'Sample text file\n',
  'sample.pdf': '%PDF-1.1\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[]/Count 0>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF\n',
  'sample-empty.txt': '',
  'sample-corrupt.png': 'not an image',
  'sample-large.png': Buffer.alloc(LARGE_FILE_BYTES),
};

function allowedOrigins() {
  const extra = (process.env.GDUI_ALLOWED_ORIGINS ?? '').split(';').map(s => s.trim()).filter(Boolean);
  for (const origin of extra) {
    if (!/^https?:\/\/[a-z0-9.-]+(:(\d+|\*))?$/i.test(origin)) throw new Error(`GDUI_ALLOWED_ORIGINS: "${origin}" is not an origin such as https://staging.example.com`);
  }
  return [...LOCAL_ORIGINS, ...extra];
}

function createSandbox(origins) {
  const dir = mkdtempSync(join(tmpdir(), 'gdui-browser-'));
  mkdirSync(join(dir, 'samples'));
  for (const [name, data] of Object.entries(SAMPLES)) writeFileSync(join(dir, 'samples', name), data);
  const hosts = [...new Set(origins.map(o => o.replace(/^https?:\/\//, '').replace(/:.*$/, '')))];
  writeFileSync(join(dir, 'config.json'), JSON.stringify({
    browser: {
      browserName: 'chromium', isolated: true,
      launchOptions: {
        headless: true, channel: 'chromium',
        args: [
          // Chromium itself refuses other hosts, which also covers redirects and sockets.
          `--host-resolver-rules=MAP * ~NOTFOUND,${hosts.map(h => `EXCLUDE ${h}`).join(',')}`,
          '--no-proxy-server',
          '--force-webrtc-ip-handling-policy=disable_non_proxied_udp',
        ],
      },
    },
    network: { allowedOrigins: origins },
    outputDir: join(dir, 'output'),
  }));
  return dir;
}

const reply = (id, text) => process.stdout.write(`${JSON.stringify({ jsonrpc: '2.0', id, result: { isError: true, content: [{ type: 'text', text }] } })}\n`);

const isObject = v => typeof v === 'object' && v !== null && !Array.isArray(v);

// Returns the message to forward, or null if it was answered here.
function filterRequest(msg, dir) {
  if (msg.method === 'initialize') {
    const { roots, ...capabilities } = msg.params?.capabilities ?? {};
    return { ...msg, params: { ...msg.params, capabilities } };
  }
  if (msg.method !== 'tools/call') return msg;
  const { name, arguments: given } = msg.params ?? {};
  if (typeof name !== 'string' || !isObject(given ?? {})) return reply(msg.id, 'Malformed tool call.'), null;
  const { filename, ...args } = given ?? {};
  if (BLOCKED_TOOLS.has(name)) return reply(msg.id, `${name} is not available.`), null;
  if (args.paths === undefined) return { ...msg, params: { ...msg.params, arguments: args } };
  const paths = [].concat(args.paths);
  if (!paths.every(p => typeof p === 'string' && Object.hasOwn(SAMPLES, p))) return reply(msg.id, `Only sample files can be used: ${Object.keys(SAMPLES).join(', ')}`), null;
  return { ...msg, params: { ...msg.params, arguments: { ...args, paths: paths.map(p => join(dir, 'samples', p)) } } };
}

function describeTool(tool) {
  const { filename, ...properties } = tool.inputSchema?.properties ?? {};
  const uploads = 'paths' in properties ? ` Use sample file names only: ${Object.keys(SAMPLES).join(', ')}.` : '';
  return { ...tool, description: `${tool.description ?? ''}${uploads}`, inputSchema: { ...tool.inputSchema, properties } };
}

const filterResponse = msg => Array.isArray(msg.result?.tools)
  ? { ...msg, result: { ...msg.result, tools: msg.result.tools.filter(t => !BLOCKED_TOOLS.has(t.name)).map(describeTool) } }
  : msg;

function pipeLines(input, output, transform) {
  createInterface({ input }).on('line', line => {
    let msg;
    try { msg = JSON.parse(line); } catch { return process.stderr.write('browser: dropped a malformed message\n'); }
    const all = [].concat(msg).filter(isObject).map(transform).filter(Boolean);
    for (const m of all) output.write(`${JSON.stringify(m)}\n`);
  });
}

const dir = createSandbox(allowedOrigins());
process.on('exit', () => rmSync(dir, { recursive: true, force: true, maxRetries: 3 }));
const env = Object.fromEntries(Object.entries(process.env).filter(([k]) => !k.startsWith('PLAYWRIGHT_MCP_')));
const server = spawn('npx', ['-y', SERVER, '--config', 'config.json'], { cwd: dir, env, stdio: ['pipe', 'pipe', 'inherit'], shell: process.platform === 'win32' });
server.on('error', e => { process.stderr.write(`browser: ${e.message}\n`); process.exit(1); });
server.on('exit', code => process.exit(code ?? 1));
server.stdin.on('error', () => {});
pipeLines(process.stdin, server.stdin, m => filterRequest(m, dir));
pipeLines(server.stdout, process.stdout, filterResponse);
process.stdin.on('end', () => server.stdin.end());
// Closing stdin makes the server shut its browser down, on every platform.
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.stdin.end());
