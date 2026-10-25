import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(readFileSync(resolve(root, '.codex-plugin/plugin.json'), 'utf8'));
const skill = readFileSync(resolve(root, 'skills/bilingual-interface-gate/SKILL.md'), 'utf8');

const checks = [
  () => assert.equal(manifest.name, 'interface-quality-pilot'),
  () => assert.match(manifest.version, /^\d+\.\d+\.\d+$/),
  () => assert.equal(manifest.skills, './skills/'),
  () => assert.deepEqual(manifest.interface.capabilities, ['Read']),
  () => assert.match(skill, /^---\nname: bilingual-interface-gate\ndescription: [^\n]+\n---\n/),
  () => ['T1_INTERFACE', 'T2_LAYOUT', 'T3_ACCESSIBILITY', 'T4_WRITING', 'T5_CHANGE'].forEach(t => assert.match(skill, new RegExp(t))),
  () => ['zh-CN', 'en', 'both'].forEach(l => assert.ok(skill.includes(l))),
  () => ['PASS', 'FAIL', 'HOLD', 'NOT_RUN', 'LIGHTWEIGHT_REVIEW'].forEach(s => assert.ok(skill.includes(s))),
  () => assert.match(skill, /403\/NO_ACCESS/),
  () => assert.match(skill, /never auto-follow `main`/),
  () => assert.match(skill, /copies \*\*no third-party skill body/),
  () => assert.match(skill, /feature\/i18n-zh-en-20261025/)
];

let passed = 0;
for (const check of checks) { check(); passed++; }
console.log(`PASS ${passed}/${checks.length} structure and safety assertions`);
