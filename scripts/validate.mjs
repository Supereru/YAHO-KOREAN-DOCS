#!/usr/bin/env node
// 저장소 일관성 검사. 의존성 없이 Node.js 18 이상에서 실행합니다.
//   node scripts/validate.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skillDir = path.join(root, 'skills', 'yaho-korean-docs');
const errors = [];
const fail = (msg) => errors.push(msg);
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8').replace(/\r\n/g, '\n');
const pad = (n, width) => String(n).padStart(width, '0');

// 1. JSON 매니페스트: 구문과 버전 일치
const manifests = [
  'plugin.json',
  '.claude-plugin/plugin.json',
  '.codex-plugin/plugin.json',
  'gemini-extension.json',
];
const versions = new Map();
for (const rel of [...manifests, '.claude-plugin/marketplace.json', '.agents/plugins/marketplace.json']) {
  try {
    const json = JSON.parse(read(rel));
    if (manifests.includes(rel)) versions.set(rel, json.version);
  } catch (e) {
    fail(`${rel}: JSON을 읽을 수 없습니다 (${e.message})`);
  }
}
const version = versions.get('plugin.json');
for (const [rel, v] of versions) {
  if (!/^\d+\.\d+\.\d+$/.test(v ?? '')) fail(`${rel}: version "${v}"이 x.y.z 형식이 아닙니다`);
  if (v !== version) fail(`${rel}: version ${v}이 plugin.json의 ${version}과 다릅니다`);
}

// 2. 규칙집: R01부터 끊김과 중복 없이 이어지는지
const rules = read('skills/yaho-korean-docs/references/rules.md');
const ruleIds = [...rules.matchAll(/^- \*\*R(\d{2}) /gm)].map((m) => Number(m[1]));
ruleIds.forEach((id, i) => {
  if (id !== i + 1) fail(`rules.md: ${i + 1}번째 규칙의 번호가 R${pad(id, 2)}입니다`);
});
const ruleCount = ruleIds.length;
const ruleHeading = rules.match(/^## 작성 규칙 (\d+)개$/m);
if (!ruleHeading) fail('rules.md: "## 작성 규칙 N개" 제목이 없습니다');
else if (Number(ruleHeading[1]) !== ruleCount) fail(`rules.md: 제목은 ${ruleHeading[1]}개인데 규칙은 ${ruleCount}개입니다`);

// 3. 용어집: T001부터 끊김과 중복 없이 이어지는지, 절별 개수, 열 개수
const glossary = read('skills/yaho-korean-docs/references/glossary.md');
const termIds = [];
let section = null;
const closeSection = () => {
  if (section && section.declared !== section.actual) {
    fail(`glossary.md: "${section.title}" 절의 제목은 ${section.declared}개인데 항목은 ${section.actual}개입니다`);
  }
};
for (const line of glossary.split('\n')) {
  const heading = line.match(/^## (.+?)(?: \((\d+)개\))?$/);
  if (heading) {
    closeSection();
    section = heading[2] ? { title: heading[1], declared: Number(heading[2]), actual: 0 } : null;
    continue;
  }
  const row = line.match(/^\| T(\d{3}) \|/);
  if (!row) continue;
  termIds.push(Number(row[1]));
  if (section) section.actual += 1;
  else fail(`glossary.md: T${row[1]}이 개수를 적은 절 밖에 있습니다`);
  const cells = line.split('|').length - 2;
  if (cells !== 5) fail(`glossary.md: T${row[1]} 행의 열이 ${cells}개입니다 (5개여야 함)`);
}
closeSection();
termIds.forEach((id, i) => {
  if (id !== i + 1) fail(`glossary.md: ${i + 1}번째 항목의 번호가 T${pad(id, 3)}입니다`);
});
const termCount = termIds.length;

// 4. 개수와 버전을 적은 문서가 실제 값과 맞는지
const expectText = (rel, pattern, expected, label) => {
  const text = read(rel);
  // g 플래그가 없으면 첫 번째 표기만 확인합니다.
  const matches = pattern.global ? [...text.matchAll(pattern)] : [text.match(pattern)].filter(Boolean);
  const found = matches.map((m) => m[1]);
  if (found.length === 0) fail(`${rel}: ${label} 표기를 찾을 수 없습니다`);
  for (const value of found) {
    if (value !== String(expected)) fail(`${rel}: ${label} 표기가 ${value}입니다 (실제 값 ${expected})`);
  }
};
expectText('README.md', /badge\/version-([\d.]+)-/g, version, '버전 배지');
expectText('README.md', /badge\/rules-(\d+)-/g, ruleCount, '규칙 수 배지');
expectText('README.md', /badge\/terms-(\d+)-/g, termCount, '용어 수 배지');
expectText('README.md', /(?<!핵심 )규칙 (\d+)개/g, ruleCount, '규칙 수');
expectText('README.md', /용어 (\d+)개/g, termCount, '용어 수');
expectText('skills/yaho-korean-docs/SKILL.md', /규칙집 (\d+)개/g, ruleCount, '규칙 수');
expectText('skills/yaho-korean-docs/SKILL.md', /용어집 (\d+)개/g, termCount, '용어 수');
expectText('skills/yaho-korean-docs/SKILL.md', /R01부터 R(\d+)까지/g, pad(ruleCount, 2), '마지막 규칙 번호');
expectText('skills/yaho-korean-docs/SKILL.md', /T001부터 T(\d+)까지/g, pad(termCount, 3), '마지막 용어 번호');
expectText('skills/yaho-korean-docs/references/rules.md', /용어집 (\d+)개/g, termCount, '용어 수');
expectText('skills/yaho-korean-docs/references/glossary.md', /핵심 용어와 표현 (\d+)개/g, termCount, '용어 수');
expectText('.claude-plugin/marketplace.json', /규칙 (\d+)개/g, ruleCount, '규칙 수');
expectText('.claude-plugin/marketplace.json', /용어 (\d+)개/g, termCount, '용어 수');
expectText('CHANGELOG.md', /^## (\d+\.\d+\.\d+)/m, version, '최신 버전');

// 5. SKILL.md 머리말
const skill = read('skills/yaho-korean-docs/SKILL.md');
const front = skill.match(/^---\n([\s\S]*?)\n---\n/);
if (!front) fail('SKILL.md: 머리말(frontmatter)이 없습니다');
else {
  const name = front[1].match(/^name: (.+)$/m)?.[1];
  const description = front[1].match(/^description: (.+)$/m)?.[1] ?? '';
  if (name !== path.basename(skillDir)) fail(`SKILL.md: name "${name}"이 폴더 이름과 다릅니다`);
  if (!description) fail('SKILL.md: description이 없습니다');
  if (description.length > 1024) fail(`SKILL.md: description이 ${description.length}자입니다 (1024자 이하여야 함)`);
}

// 6. 문서 안의 상대 링크와 참조 링크
const docs = [
  'README.md',
  'CHANGELOG.md',
  'skills/yaho-korean-docs/SKILL.md',
  'skills/yaho-korean-docs/references/rules.md',
  'skills/yaho-korean-docs/references/glossary.md',
];
for (const rel of docs) {
  const text = read(rel).replace(/```[\s\S]*?```/g, '');
  const targets = [
    ...[...text.matchAll(/\]\(([^)\s]+)\)/g)].map((m) => m[1]),
    ...[...text.matchAll(/\ssrc="([^"]+)"/g)].map((m) => m[1]),
  ];
  for (const target of targets) {
    if (/^(https?:|mailto:|#)/.test(target)) continue;
    const file = path.join(root, path.dirname(rel), target.split('#')[0]);
    if (!fs.existsSync(file)) fail(`${rel}: 링크 대상 ${target}이 없습니다`);
  }
  const defined = new Set([...text.matchAll(/^\[([^\]]+)\]: \S+/gm)].map((m) => m[1]));
  for (const m of text.matchAll(/\]\[(S\d+)\]/g)) {
    if (!defined.has(m[1])) fail(`${rel}: 참조 링크 [${m[1]}]의 주소 정의가 없습니다`);
  }
}

// 7. 참고 자료에 남으면 안 되는 흔적
for (const name of fs.readdirSync(path.join(skillDir, 'references'))) {
  const rel = `skills/yaho-korean-docs/references/${name}`;
  const text = read(rel);
  if (/\[cite: ?\d+\]/.test(text)) fail(`${rel}: [cite: 숫자] 표식이 남아 있습니다`);
  if (/;(front|jsessionid)=/i.test(text)) fail(`${rel}: 링크에 세션 ID가 들어 있습니다`);
}

if (errors.length > 0) {
  console.error(`검사 실패 ${errors.length}건`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`검사 통과: 버전 ${version}, 규칙 ${ruleCount}개, 용어 ${termCount}개`);
