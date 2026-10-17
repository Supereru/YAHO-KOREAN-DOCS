<p align="center">
  <img src="assets/yaho-korean-docs.png" width="260" alt="YAHO KOREAN DOCS RED">
</p>

<h1 align="center">YAHO KOREAN DOCS</h1>

<p align="center">
  Claude Code, Codex, Gemini CLI용 한국어 기술 문서 스킬
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-111111?style=flat-square" alt="Version 1.0.0">
  <img src="https://img.shields.io/badge/rules-36-E60012?style=flat-square" alt="Rules 36">
  <img src="https://img.shields.io/badge/terms-140-E60012?style=flat-square" alt="Terms 140">
  <img src="https://img.shields.io/badge/works%20with-Claude%20Code%20%7C%20Codex%20%7C%20Gemini%20CLI-111111?style=flat-square" alt="Works with Claude Code, Codex, Gemini CLI">
  <img src="https://img.shields.io/badge/license-MIT-111111?style=flat-square" alt="MIT license">
</p>

---

한국어 기술 문서용 에이전트 스킬. 설명서, 설계서, 기능 설명서, 연구 및 과제 보고서의 문장 길이를 줄이고 용어를 통일합니다. 수치, 조건, 예외, 부정, 순서, 책임 주체는 바꾸지 않습니다.

## 설치

에이전트마다 스크립트로 설치가 가능합니다. 


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


**Codex 플러그인으로 설치**: 마켓을 추가한 뒤 Codex의 `/plugins` 화면에서 설치합니다.

```bash
codex plugin marketplace add Supereru/YAHO-KOREAN-DOCS
```

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

## 구성

```text
skills/yaho-korean-docs/
├── SKILL.md
├── agents/openai.yaml
└── references/
    ├── rules.md          규칙 36개
    ├── glossary.md       용어 140개
    └── guidelines.txt    적용 순서, 핵심 규칙 20개, 출력 형식
```

`references`의 세 파일은 한 세트로 사용합니다. 파일명, 제목, 문서 간 링크를 제외한 본문은 원본과 같습니다.

본문의 `[cite: 숫자]` 표식은 원본에 남아 있는 것입니다. 스킬은 이 표식을 새 결과에 복제하지 않습니다. 원본에 적힌 출처 확인 내용은 다시 검증하지 않았습니다.

## 출처와 한계

ASD-STE100의 작성 규칙 살짝 우라까이 해서 한국식으로 맞추어서 제작하였습니다.
공식 ASD와는 관련없으며 영감 비스무리한것만 얻었습니다. 

## 수정

- 규칙과 용어를 수정하려면 `skills/yaho-korean-docs/references`의 해당 파일을 편집하고 세 파일을 함께 공유합니다.
- 용어를 추가할 때는 용어집의 "새 용어를 추가할 때 기록할 항목" 양식을 사용합니다.
- 플러그인 버전을 올릴 때는 `plugin.json`, `.claude-plugin/plugin.json`, `.codex-plugin/plugin.json`, `gemini-extension.json`의 `version`을 같이 올립니다.

## 라이선스

MIT. [LICENSE](LICENSE) 참고.
