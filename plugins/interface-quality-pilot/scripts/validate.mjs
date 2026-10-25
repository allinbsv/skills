import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(readFileSync(resolve(root, '.codex-plugin/plugin.json'), 'utf8'));
const skill = readFileSync(resolve(root, 'skills/bilingual-interface-gate/SKILL.md'), 'utf8');
const mathSkill = readFileSync(resolve(root, 'skills/mml-math-companion/SKILL.md'), 'utf8');
const mathMap = readFileSync(resolve(root, 'skills/mml-math-companion/references/source-map.md'), 'utf8');

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
  () => assert.match(skill, /feature\/i18n-zh-en-20261025/),
  () => assert.equal(manifest.version, '0.2.0'),
  () => assert.match(manifest.description, /Mathematics for Machine Learning/),
  () => assert.match(skill, /mml-math-companion/),
  () => assert.match(mathSkill, /^---\nname: mml-math-companion\ndescription: [^\n]+\n---\n/),
  () => ['zh-CN', 'en', 'both', 'SOURCE_PINNED_ONLY'].forEach(s => assert.ok(mathSkill.includes(s))),
  () => ['BLOCKED_PENDING_RIGHTS', 'NOT_VERIFIED', 'HOLD', 'NOT_EXECUTED'].forEach(s => assert.ok(mathSkill.includes(s))),
  () => assert.match(mathSkill, /does not show a LICENSE file/),
  () => assert.match(mathMap, /01fe947328b2ffcf9a7b7b1f2be65a3c355d22cd/),
  () => assert.match(mathMap, /0 commits ahead, 0 behind/),
  () => [2, 4, 6, 9, 10, 11, 12].forEach(n => assert.match(mathMap, new RegExp(`\\| ${n} \\|`))),
  () => ['tutorial_linear_regression.ipynb', 'tutorial_pca.ipynb', 'tutorial_gmm.ipynb'].forEach(n => assert.ok(mathMap.includes(n))),
  () => assert.match(mathMap, /no PDF, notebook, book text, illustration, or source code is redistributed/)
];

let passed = 0;
for (const check of checks) { check(); passed++; }
console.log(`PASS ${passed}/${checks.length} structure and safety assertions`);
