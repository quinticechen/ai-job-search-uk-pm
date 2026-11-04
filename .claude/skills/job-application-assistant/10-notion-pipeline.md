# Notion Pipeline - how the repo and Notion work together

**The Notion Applications DB is the system of record** for every application. The repo holds the instructions (skills and commands). Each step reads rows in one state, does its work, and moves them to the next state. A step never touches rows outside its own entry state.

Do not use `/notion-sync`, `job_search_tracker.csv` or `documents/applications/` as the record of applications in this fork; they are the upstream framework's local tracker. `job_scraper/seen_jobs.json` is still used by `/scrape` for de-duplication of roles that never reached Notion.

## Notion IDs

| What | ID / URL |
|------|----------|
| Applications DB (data source) | `collection://e1070253-2220-462c-8bf0-e22b893c42da` |
| Job Hunting page (digest pages live here) | https://app.notion.com/p/06a0203cfe64449e888ba97d1f3d7186 |
| Job search digest skill (source of truth for step 1) | https://app.notion.com/p/40bb07b9915c80ab9fa6e26b570ebff9 |
| Canva Resume update skill (source of truth for steps 3-4) | https://app.notion.com/p/40bb07b9915c808bac45e98e9a58e083 |
| Resume STAR Stories | Notion page `3ebb07b9915c807eb520c7ac2d12c794` |
| Resume pages | linked in `04-job-evaluation.md` under "Resume versions" |

## The five steps

| # | Step | Command | Picks up rows where | Moves row to |
|---|------|---------|---------------------|--------------|
| 1 | Find roles, record suitable ones | `/scrape` (job-scraper Step 6b) | - (creates new rows) | Stage = `Ready to Apply`, Status = `In Progress 🏃` |
| 2 | Tailor resume content | `/tailor` | Stage = `Ready to Apply`, Status empty | Status = `CV Drafted 📝` (or `Needs Input ✋`) |
| - | **She reviews and edits the draft in Notion** | (manual) | Status = `CV Drafted 📝` | Status = `CV Approved ✅` (she sets it) |
| 3 | Canva resume + PDF | `/canva` | Status = `CV Approved ✅` | Status = `CV Ready 📄` (or `Blocked`) |
| 4 | Fill the application (never submit) | `/submit` | Status = `CV Ready 📄` | Status = `Ready to Submit` / `Needs Input ✋` / `Blocked` |
| - | **She submits and tells the agent** | (manual, then `/submit confirm <company>`) | Status = `Ready to Submit` | Stage = `Sent CV 💌`, Status = `In Progress 🏃` |
| 5 | Interview prep | `/interview` | Stage = `1 - Interview 🙂` / `2 - Interview 🙂` / `3 - Interview 🙂` | unchanged |

Rows with any other Status (e.g. `Rejected 😭`, `Hiring Closed 🛑`, `No Response 🤷`) are left alone by every step.

## Row page body layout

Each step appends its own section to the row's page body and never edits another step's section. Re-running a step replaces only its own section.

1. `## Fit score` - written by step 1 (category, score table, conclusion, caveats)
2. `## Tailored CV` - written by step 2, edited by her, read by step 3. Her edits are final: step 3 uses this section exactly as it stands.
3. `## Application log` - written by step 4 (tab state, PDF used, unanswered questions verbatim)
4. `## Interview prep - <stage>` - written by step 5, one section per stage

## Write limits (all steps)

- Only the properties named in that step's command, plus its own page-body section.
- Never edit or delete rows outside the step's entry state; never delete any row.
- Never change Stage, except `/submit confirm` setting `Sent CV 💌` after she confirms she submitted.
- Never click a final Submit / Apply / Send button. Never email or message anyone. Never create accounts on job sites.
- Never invent experience, postings, salaries or dates. Report what could not be reached.
