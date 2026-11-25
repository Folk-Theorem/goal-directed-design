// Runs the real pinned browser server through the launcher. Needs Chromium installed.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { createInterface } from 'node:readline';
import { mkdtempSync, writeFileSync, readFileSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const LAUNCHER = fileURLToPath(new URL('../scripts/browser.mjs', import.meta.url));
const project = mkdtempSync(join(tmpdir(), 'gdui-project-'));
const victim = join(project, 'victim.md');
const sandboxesBefore = readdirSync(tmpdir()).filter(n => n.startsWith('gdui-browser-'));
let site, other, hits = 0, child, port, otherPort, nextId = 0;
const waiting = new Map();

const PAGE = () => `<h1>Home</h1><input type=file aria-label=Receipt onchange="out.textContent=[...this.files].map(f=>f.name+':'+f.size).join()"><p id=out></p>
<a href="http://127.0.0.2:${otherPort}/">away</a>`;
const listen = (server, host) => new Promise(r => server.listen(0, host, () => r(server.address().port)));
const rpc = (method, params) => new Promise(resolve => {
  const id = ++nextId;
  waiting.set(id, resolve);
  child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n');
});
const tool = async (name, args = {}) => JSON.stringify(await rpc('tools/call', { name, arguments: args }));
const home = () => tool('browser_navigate', { url: `http://127.0.0.1:${port}/` });

before(async () => {
  writeFileSync(victim, 'original');
  other = createServer((_, res) => { hits++; res.setHeader('access-control-allow-origin', '*'); res.end('<h1>Elsewhere</h1>'); });
  otherPort = await listen(other, '127.0.0.2');
  site = createServer((req, res) => {
    if (req.url === '/redirect') { res.writeHead(302, { location: `http://127.0.0.2:${otherPort}/` }); return res.end(); }
    res.setHeader('content-type', 'text/html');
    res.end(PAGE());
  });
  port = await listen(site, '127.0.0.1');
  child = spawn(process.execPath, [LAUNCHER], { cwd: project, stdio: ['pipe', 'pipe', 'inherit'],
    env: { ...process.env, HTTP_PROXY: `http://127.0.0.2:${otherPort}`, PLAYWRIGHT_MCP_ALLOW_UNRESTRICTED_FILE_ACCESS: 'true' } });
  createInterface({ input: child.stdout }).on('line', line => {
    const msg = JSON.parse(line);
    if (msg.method) return child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id: msg.id, result: { roots: [{ uri: pathToFileURL(project).href }] } }) + '\n');
    waiting.get(msg.id)?.(msg);
  });
  await rpc('initialize', { protocolVersion: '2024-11-05', capabilities: { roots: {} }, clientInfo: { name: 't', version: '1' } });
  child.stdin.write('{"jsonrpc":"2.0","method":"notifications/initialized"}\n');
});
after(async () => {
  const exited = new Promise(r => child.on('exit', r));
  child.stdin.end();
  await exited;
  site.close();
  other.close();
  assert.deepEqual(readdirSync(tmpdir()).filter(n => n.startsWith('gdui-browser-') && !sandboxesBefore.includes(n)), []);
});

test('local pages work and snapshots come back inline', async () => {
  await home();
  assert.match(await tool('browser_snapshot'), /heading \\"Home\\"/);
});

test('code execution is neither listed nor callable', async () => {
  const { result } = await rpc('tools/list', {});
  assert.ok(!result.tools.some(t => t.name === 'browser_run_code_unsafe'));
  assert.ok(result.tools.every(t => !('filename' in (t.inputSchema.properties ?? {}))));
  assert.match(await tool('browser_run_code_unsafe', { code: `async p => { await p.screenshot({path:'${victim}'}) }` }), /not available/);
});

test('no tool writes into the project', async () => {
  await home();
  for (const filename of ['victim.md', victim, '../victim.md']) {
    for (const name of ['browser_snapshot', 'browser_take_screenshot', 'browser_console_messages', 'browser_network_requests'])
      await tool(name, { filename, type: 'png', level: 'info', static: true });
    await tool('browser_evaluate', { function: '() => 1', filename });
  }
  assert.equal(readFileSync(victim, 'utf8'), 'original');
  assert.deepEqual(readdirSync(project), ['victim.md']);
});

test('other hosts are unreachable by navigation, redirect, link, fetch, or file URL', async () => {
  await tool('browser_navigate', { url: `http://127.0.0.2:${otherPort}/` });
  await tool('browser_navigate', { url: `http://127.0.0.1:${port}/redirect` });
  await home();
  await tool('browser_evaluate', { function: "() => document.querySelector('a').click()" });
  await home();
  await tool('browser_evaluate', { function: `() => fetch('http://127.0.0.2:${otherPort}/').catch(e => String(e))` });
  await tool('browser_evaluate', { function: `() => new Promise(r => { const w = new WebSocket('ws://127.0.0.2:${otherPort}/'); w.onerror = w.onclose = () => r('closed'); })` });
  assert.equal(hits, 0);
  assert.doesNotMatch(await tool('browser_navigate', { url: pathToFileURL(victim).href }), /original/);
});

test('uploads accept bundled samples only', async () => {
  await home();
  await tool('browser_click', { element: 'Receipt', target: 'input' });
  await tool('browser_file_upload', { paths: ['sample.png'] });
  assert.match(await tool('browser_snapshot'), /sample\.png:\d+/);
  await tool('browser_click', { element: 'Receipt', target: 'input' });
  for (const path of [victim, '../victim.md', 'samples/../../victim.md'])
    assert.match(await tool('browser_file_upload', { paths: [path] }), /Only sample files/);
  assert.match(await tool('browser_drop', { target: 'input', paths: [victim] }), /Only sample files/);
  assert.doesNotMatch(await tool('browser_snapshot'), /victim/);
});
