<p align="center">
  <img src="assets/yaho-korean-docs.png" width="260" alt="YAHO KOREAN DOCS RED">
</p>

<h1 align="center">YAHO KOREAN DOCS</h1>

<p align="center">
  Claude Code, Codex, Gemini CLI용 한국어 기술 문서 스킬
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.1.0-111111?style=flat-square" alt="Version 1.1.0">
  <img src="https://img.shields.io/badge/rules-36-E60012?style=flat-square" alt="Rules 36">
  <img src="https://img.shields.io/badge/terms-140-E60012?style=flat-square" alt="Terms 140">
  <img src="https://img.shields.io/badge/works%20with-Claude%20Code%20%7C%20Codex%20%7C%20Gemini%20CLI-111111?style=flat-square" alt="Works with Claude Code, Codex, Gemini CLI">
  <img src="https://img.shields.io/badge/license-MIT-111111?style=flat-square" alt="MIT license">
</p>

---

한국어 기술 문서용 에이전트 스킬. 설명서, 설계서, 기능 설명서, 연구 및 과제 보고서의 문장 길이를 줄이고 용어를 통일합니다. 수치, 조건, 예외, 부정, 순서, 책임 주체는 바꾸지 않습니다.

## 설치

에이전트마다 명령 한 줄로 설치합니다.

**Claude Code** (v2.1.275 이상)

```text
/plugin install yaho-korean-docs --marketplace Supereru/YAHO-KOREAN-DOCS
```

**Codex**

```bash
npx skills add Supereru/YAHO-KOREAN-DOCS -g -a codex
```

**Gemini CLI**

```bash
gemini extensions install https://github.com/Supereru/YAHO-KOREAN-DOCS
```

**그 밖의 에이전트** (GitHub Copilot, Cursor 등)

```bash
npx skills add Supereru/YAHO-KOREAN-DOCS -g
```

`npx`로 시작하는 명령은 Node.js가 필요합니다. 깔린 에이전트를 찾아서 각자 스킬 폴더에 넣습니다.

### 다른 설치 방법

**Claude Code 버전이 낮을 때**: 두 명령을 따로 보냅니다.

```text
/plugin marketplace add Supereru/YAHO-KOREAN-DOCS
```

```text
/plugin install yaho-korean-docs@yaho-korean-docs
```

**Claude Code를 터미널에서 설치**: Claude Code 밖의 터미널에서 실행합니다.

```bash
claude plugin install yaho-korean-docs --marketplace Supereru/YAHO-KOREAN-DOCS
```

**Claude Code에 스킬만 설치**: 플러그인 없이 스킬 폴더만 넣습니다.

```bash
npx skills add Supereru/YAHO-KOREAN-DOCS -g -a claude-code
```

**Codex 플러그인으로 설치**: 마켓을 추가한 뒤 플러그인을 설치합니다. Codex의 `/plugins` 화면에서 설치해도 됩니다.

```bash
codex plugin marketplace add Supereru/YAHO-KOREAN-DOCS
codex plugin add yaho-korean-docs@yaho-korean-docs
```

### 설치 확인

| 에이전트 | 명령 | 정상 결과 |
| --- | --- | --- |
| Claude Code | `claude plugin list` | `yaho-korean-docs@yaho-korean-docs`가 `enabled`로 표시됩니다 |
| Codex | `codex plugin list` | `yaho-korean-docs@yaho-korean-docs`가 `installed, enabled`로 표시됩니다 |
| Gemini CLI | `gemini skills list` | `yaho-korean-docs [Enabled]`가 표시됩니다 |

`npx skills`로 설치했다면 아래 수동 설치 표의 경로에 `yaho-korean-docs` 폴더가 생겼는지 확인합니다.

위 명령은 2026년 11월 12일에 Windows 11의 Claude Code 2.1.322, Codex CLI 0.167.2, Gemini CLI 0.58.0에서 설치되는 것을 확인했습니다.

### 수동 설치

`skills/yaho-korean-docs` 폴더를 통째로 아래 위치에 복사합니다.

| 에이전트 | 경로 |
| --- | --- |
| Claude Code | `~/.claude/skills/` |
| Codex | `~/.agents/skills/` (`CODEX_HOME`이 있으면 그 아래 `skills/`) |
| Gemini CLI | `~/.gemini/skills/` |

`SKILL.md`만 복사하면 규칙집과 용어집을 쓸 수 없습니다. `references` 폴더까지 같이 복사합니다.

### 웹 ChatGPT, Gemini

명령어 설치는 안 됩니다. GPT 만들기나 Gem의 지침에 `SKILL.md` 본문을 넣고, `references`의 파일 3개를 지식 파일로 올립니다.

## 사용

| 에이전트 | 호출 |
| --- | --- |
| Codex | `$yaho-korean-docs` |
| Claude Code | `/yaho-korean-docs` (플러그인 설치 시 `/yaho-korean-docs:yaho-korean-docs`) |
| 공통 | "이 기술 문서 다듬어 줘"처럼 요청하면 자동으로 적용됩니다 |

```text
$yaho-korean-docs 다음 설명서를 원문의 의미와 수치를 유지하면서 쉽게 다듬어 줘.
```

```text
$yaho-korean-docs 다음 문서의 용어를 통일하고, 변경 전후 비교표도 보여 줘.
```

```text
$yaho-korean-docs 다음 사실을 바탕으로 초보자용 사용 안내문을 작성해 줘.
```

호출한 뒤 검토할 문서나 사실 정보를 붙여 넣습니다.

### 적용 예

규칙이 어떻게 적용되는지 보여 주는 예시입니다. 실제 결과의 표현은 에이전트와 모델에 따라 다를 수 있습니다.

원문:

```text
설정 변경의 경우 Apply 버튼 클릭 후 디폴트 값에 대한 확인을 수행하십시오.
디스크 사용량이 80%를 초과하면 경고가 표시됩니다.
오류 발생 시 적절히 조치하십시오.
```

결과:

```text
설정을 변경할 때는 다음 순서로 작업하십시오.

1. Apply(적용) 버튼을 클릭하십시오.
2. 기본값을 확인하십시오.

디스크 사용량이 80%를 초과하면 경고가 표시됩니다.

오류가 발생하면 적절히 조치하십시오.

확인 필요 사항
- "적절히 조치": 어떤 오류에 어떤 조치를 해야 하는지 원문에 없어 그대로 두었습니다.
```

| 바뀐 곳 | 이유 |
| --- | --- |
| 한 문장을 두 단계로 나눔 | 따로 수행하는 작업은 단계로 나눕니다 |
| `Apply` → `Apply(적용)` | 화면에 표시되는 이름은 유지하고 설명만 덧붙입니다 |
| 디폴트 값에 대한 확인을 수행 → 기본값을 확인 | 용어를 통일하고 명사+동사 구성을 줄입니다 |
| 80%를 초과 (그대로) | "이상"으로 바꾸면 경계값이 달라집니다 |
| 적절히 조치 (그대로) | 원문에 없는 조치를 지어내지 않습니다 |

## 구성

```text
skills/yaho-korean-docs/
├── SKILL.md             작업 유형, 적용 방법, 결과 형식
├── agents/openai.yaml
└── references/
    ├── rules.md          규칙 36개
    ├── glossary.md       용어 140개
    └── guidelines.txt    적용 순서, 핵심 규칙 20개, 출력 형식
```

`references`의 세 파일은 한 세트로 사용합니다. 원본 초안에서 파일명, 제목, 문서 간 링크를 바꾸고 `[cite: 숫자]` 표식을 지웠습니다. 규칙과 용어의 내용은 원본과 같습니다.

원본에 적힌 출처 확인 내용은 다시 검증하지 않았습니다.

## 출처와 한계

ASD-STE100(Simplified Technical English)의 통제 언어 방식을 참고해 한국어 실무에 맞게 다시 구성했습니다. 작성 규칙과 용어집을 함께 관리하는 구조를 가져왔고, 규칙과 용어의 내용은 국립국어원의 공공언어 자료와 TTA 정보통신용어사전을 참고해 새로 썼습니다.

- ASD와 관련이 없는 비공식 자료입니다. ASD-STE100의 한국어판, 번역본, 인증 기준이 아닙니다.
- 이 스킬로 다듬은 문서를 ASD-STE100 적합 문서로 표시해서는 안 됩니다.
- 문서의 표현만 정리합니다. 기술 내용의 검토나 안전성 검증을 대신하지 않습니다.
- 출처별 확인 범위는 [규칙집](skills/yaho-korean-docs/references/rules.md)의 "출처와 확인 범위" 절에 있습니다.

## 수정

- 규칙과 용어를 수정하려면 `skills/yaho-korean-docs/references`의 해당 파일을 편집하고 세 파일을 함께 공유합니다.
- 용어를 추가할 때는 용어집의 "새 용어를 추가할 때 기록할 항목" 양식을 사용합니다.
- 플러그인 버전을 올릴 때는 `plugin.json`, `.claude-plugin/plugin.json`, `.codex-plugin/plugin.json`, `gemini-extension.json`의 `version`과 README의 버전 배지를 같이 올리고 [CHANGELOG.md](CHANGELOG.md)에 변경 내용을 적습니다.
- 수정한 뒤에는 검사를 실행합니다. 버전, 규칙 수, 용어 수, 번호 순서, 문서 링크가 서로 맞는지 확인합니다. GitHub에 올리면 같은 검사가 자동으로 실행됩니다.

```bash
node scripts/validate.mjs
```

## 라이선스

MIT. [LICENSE](LICENSE) 참고.
