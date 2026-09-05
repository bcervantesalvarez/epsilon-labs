import { spawnSync } from 'node:child_process';
// Local review output includes explicitly labeled drafts. Never a deploy command.
const result = spawnSync(process.execPath, ['node_modules/astro/astro.js', 'build'], {
  stdio: 'inherit', env: { ...process.env, PREVIEW_DRAFTS: '1' }
});
if (result.status !== 0) process.exit(result.status ?? 1);
const index = spawnSync(process.execPath, ['node_modules/pagefind/lib/runner/bin.cjs', '--site', 'dist'], { stdio: 'inherit' });
process.exit(index.status ?? 1);
