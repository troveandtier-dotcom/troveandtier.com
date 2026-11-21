import { execFileSync } from 'node:child_process';

let raw = '';
try {
  raw = execFileSync('npm', ['audit', '--json'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: 20 * 1024 * 1024,
  });
} catch (error) {
  raw = String(error?.stdout ?? '');
}

let report;
try {
  report = JSON.parse(raw);
} catch {
  console.error('[dependency-audit] npm did not return valid JSON.');
  process.exit(0);
}

const vulnerabilities = Object.entries(report.vulnerabilities ?? {}).map(([name, item]) => ({
  name,
  severity: item.severity,
  direct: item.isDirect,
  range: item.range,
  fixAvailable: item.fixAvailable,
  advisories: (item.via ?? [])
    .filter((entry) => typeof entry === 'object')
    .map(({ title, url, range }) => ({ title, url, range })),
}));

console.log('[dependency-audit] Summary:', JSON.stringify(report.metadata?.vulnerabilities ?? {}));
console.log('[dependency-audit] Findings:', JSON.stringify(vulnerabilities));
