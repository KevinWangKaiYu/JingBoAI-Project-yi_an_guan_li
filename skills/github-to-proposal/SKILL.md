---
name: github-to-proposal
description: Restore the fixed 议案智能管理 prototype from its GitHub handoff repository into the current Make workspace. Use when the user asks to download or continue this proposal project from another computer.
---

# Github To Proposal

Use this skill only for the fixed proposal-management prototype, not for other Make projects.

- Workspace source: discover the current Make repository root with `git rev-parse --show-toplevel`.
- Restore scope: `src/prototypes/proposal-intelligent-management/` and `src/common/useHashPage.ts` only.
- GitHub repository: `KevinWangKaiYu/JingBoAI-Project-yi_an_guan_li`, branch `main`.
- Remote layout: repository root `src/prototypes/proposal-intelligent-management/`, `src/common/useHashPage.ts`, paired skill source under `skills/`, and `proposal-sync-manifest.json`. The repository is dedicated to this editable source only.

Run `scripts/download-proposal.ps1` from the Make workspace root. The script validates the downloaded source, backs up the exact local target files under `.codex-sync-backups/`, then replaces the whole prototype directory and the fixed shared hook. Do not merge individual files or leave an incoming copy alongside the live directory. Report the backup location and remote commit hash.
