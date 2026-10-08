<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# VastiSol development pipeline

For every website implementation or bug-fix request, the primary agent is the orchestrator. Use the project-scoped `developer` and `qa` subagents in this order. Keep dependent work sequential because all agents share the same working tree.

1. Read `lessons.md` and inspect the current working tree. Preserve unrelated user changes.
2. Before development starts, freeze a clean-room QA packet containing the user's original request verbatim, acceptance criteria, pre-change baseline, and exact required checks. If no automated check applies, state the manual verification expected. Do not rewrite this packet after seeing the implementation.
3. Turn that packet into a bounded developer brief with relevant files or areas and implementation constraints. Give the developer concrete instructions rather than an open-ended goal.
4. Spawn `developer`. It owns implementation and focused validation. Wait for it to finish.
5. Independently collect the complete change evidence and rerun the required checks. The evidence must include tracked, staged, and untracked file contents; ordinary `git diff` output alone is insufficient because it omits untracked files. Do not rely on or forward the developer's account of what changed or passed.
6. Spawn a fresh `qa` with `fork_turns="none"` so it inherits no conversation history. Give it only the frozen QA packet, complete change evidence, and raw orchestrator-run check output. Never pass developer messages, summaries, rationale, confidence, intended approach, or self-assessment. QA must remain read-only and return `PASS` or `FAIL` with evidence.
7. On `FAIL`, send every actionable finding back to the same developer and wait for the fix. Close the prior QA thread, independently refresh all tracked, staged, and untracked change evidence plus check output, then spawn a new clean-room QA agent with `fork_turns="none"` and the same frozen packet. Repeat until QA passes or a real user decision is required.
8. Independently inspect the final diff and validation evidence. The orchestrator alone reports completion to the user.

## QA independence

- Developer and QA never communicate directly.
- QA is blind to the developer's explanation and sees only requirements fixed before implementation plus primary evidence from the repository and checks.
- Do not tell QA which files the developer says it changed or where the developer expects defects. QA must inspect the complete diff independently.
- Do not reuse a QA thread after it has seen developer feedback or a prior implementation. Each review pass starts with a fresh QA context created with `fork_turns="none"`.
- Keep the developer's completion report in the orchestrator thread only; use it for coordination, never as QA evidence.

## Lessons discipline

- Both subagents must read `lessons.md` before work.
- A lesson is added only when QA or the orchestrator confirms a developer-caused coding mistake. Do not record preferences, task history, or one-off environment failures.
- The orchestrator maintains `lessons.md`; developer and QA must not edit it.
- Keep at most 10 active lessons. Each lesson is one short bullet with the mistake and preventive rule. Merge duplicates and remove obsolete entries so the whole file stays readable in under one minute.
- When a mistake repeats, strengthen the existing lesson instead of adding another entry.

## Completion gate

Do not call work complete until QA passes, required checks pass, the diff contains no unrelated edits, and any confirmed developer mistake has been folded into `lessons.md`.
