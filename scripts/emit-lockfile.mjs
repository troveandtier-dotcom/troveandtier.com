import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const lock = readFileSync('package-lock.json');
const encoded = lock.toString('base64');
const chunkSize = 1800;
const total = Math.ceil(encoded.length / chunkSize);
const digest = createHash('sha256').update(lock).digest('hex');

console.log(`LOCKFILE_META bytes=${lock.length} chunks=${total} sha256=${digest}`);
for (let index = 0; index < total; index += 1) {
  const part = encoded.slice(index * chunkSize, (index + 1) * chunkSize);
  console.log(`LOCKFILE_CHUNK ${String(index + 1).padStart(4, '0')}/${total} ${part}`);
}
console.log('LOCKFILE_END');
