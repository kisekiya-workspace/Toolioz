# SEO, AEO, & GEO Master Skill for Antigravity & Agentic Tools

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Antigravity Skill](https://img.shields.io/badge/Antigravity-Skill-blue.svg)](SKILL.md)
[![Cursor Ready](https://img.shields.io/badge/Cursor-.cursorrules-purple.svg)](.cursorrules)
[![Universal AI](https://img.shields.io/badge/Agentic-Universal%20AGENTS.md-green.svg)](AGENTS.md)

A complete, production-ready, open-source **Universal AI Skill** providing full reference documentation, actionable micro-tips, audit frameworks, and AI-native workflows for **Search Engine Optimization (SEO)**, **Answer Engine Optimization (AEO)**, and **Generative Engine Optimization (GEO)**.

---

## 🌟 Architectural Rating: Why This Structure Wins

This skill uses a **Progressive Disclosure Architecture**:
1. **Token Efficiency**: The AI agent loads `SKILL.md` first (a lightweight entrypoint with frontmatter, decision matrix, and cheatsheet). It consumes minimal tokens upfront.
2. **Deep Modular Retrieval**: Detailed rules and code schemas are isolated in `references/*.md`. The agent only reads specific reference files relevant to the task (e.g. reading `03_aeo...` only when optimizing for AI Overviews).
3. **No Collision**: Separating technical, editorial, AEO, GEO, and practitioner hacks prevents context overload and hallucination.

---

## 🤖 Cross-Tool Agent Compatibility Matrix

This skill is 100% compliant and auto-integrates with major AI coding assistants and agentic platforms:

| AI Tool / Agent | Native Integration File | How It Works |
|---|---|---|
| **Google Antigravity / AGY** | `SKILL.md` | Native skill execution via frontmatter & relative sitemap navigation. |
| **Cursor IDE** | `.cursorrules` / `@SKILL.md` | Auto-detected via `.cursorrules` or tagged via `@` symbol in chat. |
| **Claude Code (CLI) / Anthropic** | `AGENTS.md` / `SKILL.md` | Reads `AGENTS.md` automatically during repository context indexing. |
| **OpenAI Codex / Custom GPTs** | `AGENTS.md` / `SKILL.md` | Ingests `SKILL.md` and `AGENTS.md` standard markdown instructions. |
| **Windsurf / Cascade** | `.windsurfrules` / `AGENTS.md` | Vector-indexed via RAG file search; reads instructions from `AGENTS.md`. |
| **Aider / GitHub Copilot** | `AGENTS.md` / `README.md` | Automatically scanned as project context documentation. |

---

## 📁 Skill Architecture & Directory Tree

```
seo-aeo-geo-skill/                          # Skill Root Directory
├── SKILL.md                                 # Core Antigravity Skill entrypoint & sitemap
├── AGENTS.md                                # Universal AI agent instructions (Codex, Claude, Windsurf)
├── .cursorrules                             # Cursor IDE rule file
├── README.md                                # Skill documentation & compatibility matrix
├── LICENSE                                  # MIT License
├── .gitignore                               # Clean git filter rules
└── references/                              # Modular reference guides
    ├── 01_foundational_seo_strategy.md       # Technical audits, Core Web Vitals (<2s), local SEO
    ├── 02_onpage_editorial_content_seo.md   # Heading hierarchy, titles (<60c), meta (<150c), images
    ├── 03_aeo_answer_engine_optimization.md  # Lead-with-answer (25-45w), AI Overviews, JSON-LD
    ├── 04_geo_generative_engine_optimization.md # LLM citations (4.4x conversion), Reddit/Quora
    ├── 05_unified_triad_framework_and_checklists.md # 5-Step AI workflow & 67-point checklist
    ├── 06_tools_and_ai_agents_playbook.md   # Audit tools directory & autonomous AI agent workflows
    ├── 07_real_world_practitioner_tips_and_hacks.md # SSR, Atomic Answers, GSC hacks, SoM metric
    └── 08_optional_mcp_integrations.md     # Optional Google Search Console & Analytics MCP setups
```

---

## 🚀 Installation & Usage

### Installing in Antigravity / Gemini CLI
Copy this entire `seo-aeo-geo-skill` folder into your custom Antigravity skills directory or clone it directly:

```bash
cp -r seo-aeo-geo-skill ~/.gemini/antigravity/skills/
```

### Installing in Cursor / Windsurf / VS Code
Drop the `seo-aeo-geo-skill` folder anywhere in your repository workspace. Cursor and Windsurf will automatically read `.cursorrules` and `AGENTS.md`.

---

## 🔌 Optional MCP Integrations

This skill includes directives for reading AI Agents to suggest optional **Google Search Console** and **Google Analytics** Model Context Protocol (MCP) servers. When connected, the agent can query real-time clicks, impressions, CTR, and indexing errors directly.

---

## 📜 License

Distributed under the [MIT License](LICENSE).
