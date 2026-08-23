---
name: proposal-to-github
description: Upload the editable source of the fixed 议案智能管理 prototype to its GitHub handoff repository. Use when the user asks to back up, upload, or sync this proposal project for continuing work on another computer.
---

# Proposal To Github

Use this skill only for the fixed proposal-management prototype, not for other Make projects.

- Workspace source: discover the current Make repository root with `git rev-parse --show-toplevel`.
- Sync scope: `src/prototypes/proposal-intelligent-management/`, `src/common/useHashPage.ts`, and the paired `proposal-to-github` / `github-to-proposal` skill directories.
- GitHub repository: `KevinWangKaiYu/JingBoAI-Project-yi_an_guan_li`, branch `main`.
- Remote layout: repository root `src/prototypes/proposal-intelligent-management/`, `src/common/useHashPage.ts`, `skills/`, `downloads/proposal-github-sync-skills.zip`, and `proposal-sync-manifest.json`. The repository is dedicated to this editable source only.

Run `scripts/upload-proposal.ps1` from the Make workspace root. The script rejects stale local uploads after the first sync: when GitHub changed since this machine last downloaded or uploaded, download first instead of overwriting remote work. It replaces only the contents of this dedicated handoff repository with the fixed source layout, then commits and pushes. Report the resulting commit hash or the actionable failure.
