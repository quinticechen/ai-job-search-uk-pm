---
name: linkedin-search
version: 1.0.0
description: >
  Use this skill to search LinkedIn's public job listings for Product Manager
  roles (Product Manager, Product Owner, Senior PM, AI PM, Technical PM, Product
  Operations) with an AI, credit-decisioning, lending or fintech focus, or to look
  up a specific LinkedIn job posting. Markets: London and the rest of the United
  Kingdom first (including remote-UK), then the Czech Republic, then EU countries
  and the United States for roles that offer visa sponsorship. Always
  pass the location explicitly. Low volume only: it reads LinkedIn without login,
  which breaks LinkedIn's terms, so run a few searches per /scrape and treat every
  result as a lead to confirm on the company's own careers site. Trigger phrases:
  find PM jobs, product manager jobs in London/UK, search LinkedIn jobs, any new
  PM roles, look up this LinkedIn job posting.
context: fork
enabled: true  # set to false to keep this portal installed but have /scrape skip it
allowed-tools: Bash(bun run .agents/skills/linkedin-search/cli/src/cli.ts *)
---

# LinkedIn Search Skill

Searches LinkedIn's public job listings for **Product Manager roles**: London and the UK first, then the Czech Republic, then EU countries and the US for roles that sponsor visas. No other markets. No login or API key; it runs with `bun`.

LinkedIn has no visa-sponsorship filter, so for the EU and US prefer `freehire-search` (it has one) and use LinkedIn only to top up. Every EU / US hit must pass the "Visa sponsorship rule" in `.claude/skills/job-scraper/search-queries.md`.

What to search for and which companies matter are defined in `.claude/skills/job-scraper/search-queries.md`. This file only covers how to run the tool.

## ⚠️ Low volume, personal use only

The tool reads LinkedIn without logging in, which breaks LinkedIn's terms of service. Too many requests can get your network temporarily blocked.

- At most **5 searches per `/scrape` run** (3 for UK / CZ, up to 2 for EU / US), and `detail` only for roles that look promising.
- Always pass `--limit 20` or lower.
- If LinkedIn returns a rate-limit error, stop for this run. Don't retry in a loop.
- A LinkedIn result is a **lead, not a confirmed role.** Confirm it on the company's own careers page and store that official URL (see `job-scraper/SKILL.md`).

## Standard searches (in priority order)

Run these in order and stop early when the run already has enough leads.

| # | Market | `--location` | `--query` |
|---|--------|--------------|-----------|
| 1 | London | `"London, United Kingdom"` | `"product manager"` (category keywords below) |
| 2 | Rest of UK / remote-UK | `"United Kingdom"` | `"product manager"` |
| 3 | Czech Republic | `"Czechia"` (or `"Prague, Czechia"`) | `"product manager"` |
| 4 | EU, sponsored (optional) | `"European Union"` (or a city, e.g. `"Berlin, Germany"`, `"Amsterdam, Netherlands"`, `"Dublin, Ireland"`) | `"product manager visa sponsorship"` |
| 5 | US, sponsored (optional) | `"United States"` (or e.g. `"New York, United States"`) | `"product manager visa sponsorship"` |

Run 4 and 5 only when `freehire-search` returned few EU / US leads. The keyword match is loose: open the posting and confirm the sponsorship wording before keeping it.

Narrow the query to the target category when focusing:
- Category 1 (decisioning & document intelligence): `"product manager credit"`, `"product manager lending"`, `"product manager underwriting"`, `"product manager decisioning"`
- Category 2 (consumer lending growth): `"growth product manager"`, `"product manager consumer lending"`
- Category 3 (general AI / technical PM): `"AI product manager"`, `"technical product manager"`

Default to `--jobage 14` to match the 14-day window in `search-queries.md`.

## Running without Bun (this fork)

If `bun` isn't installed, Node 22.6+ runs the same CLI with no extra packages. Replace `bun run` with the Node prefix; everything after it stays the same:

```bash
node --experimental-strip-types --disable-warning=ExperimentalWarning --import ./tools/node_ts_loader.mjs .agents/skills/linkedin-search/cli/src/cli.ts search ...
```

Run it from the repo root. `tools/node_ts_loader.mjs` only maps the CLI's `./x.js` imports to the `.ts` files on disk.

## Commands

### Search job listings

```bash
bun run .agents/skills/linkedin-search/cli/src/cli.ts search --location "<place>" [flags]
```

Flags:
- `--location <text>` / `-l <text>` — **required.** A LinkedIn place string, e.g. `"London, United Kingdom"`, `"United Kingdom"`, `"Czechia"`, `"European Union"`, `"United States"`.
- `--query <text>` / `-q <text>` — keyword search (title, skill, domain).
- `--jobage <days>` — posted within N days: `1`, `7`, `14`, `30`. Omit for all postings.
- `--jobage-minutes <n>` — posted within N minutes. Conflicts with `--jobage`; pass only one.
- `--remote <mode>` — `remote`, `hybrid`, or `onsite`.
- `--page <n>` — page number (1-indexed, 10 results per page).
- `--limit <n>` / `-n <n>` — cap total results (client-side). Keep it at 20 or lower.
- `--format json|table|plain` — default `json`. `/scrape` uses `json`.

### Fetch full job detail

```bash
bun run .agents/skills/linkedin-search/cli/src/cli.ts detail <id|url> [--format json|plain]
```

`id` is the numeric job ID from `search` results (e.g. `4426311357`). A full LinkedIn `jobs/view/...` URL or a `urn:li:jobPosting:...` URN also works. Returns the full description, seniority, employment type, job function, industries, and `isActive` (`false` means LinkedIn shows "No longer accepting applications").

Use the returned seniority and description to apply the Seniority Gate in `04-job-evaluation.md` (skip Head / Director / Principal / Staff and Senior roles asking 6+ years).

## Usage examples

```bash
# PM roles in London, last 14 days
bun run .agents/skills/linkedin-search/cli/src/cli.ts search -q "product manager" -l "London, United Kingdom" --jobage 14 --limit 20 --format json

# Credit / lending PM roles anywhere in the UK
bun run .agents/skills/linkedin-search/cli/src/cli.ts search -q "product manager lending" -l "United Kingdom" --jobage 14 --limit 20 --format json

# Remote-UK AI PM roles
bun run .agents/skills/linkedin-search/cli/src/cli.ts search -q "AI product manager" -l "United Kingdom" --remote remote --jobage 14 --limit 20 --format table

# PM roles in Prague
bun run .agents/skills/linkedin-search/cli/src/cli.ts search -q "product manager" -l "Prague, Czechia" --jobage 14 --limit 20 --format table

# EU PM roles mentioning visa sponsorship (confirm the wording in each posting)
bun run .agents/skills/linkedin-search/cli/src/cli.ts search -q "product manager visa sponsorship" -l "European Union" --jobage 14 --limit 20 --format json

# US PM roles mentioning visa sponsorship
bun run .agents/skills/linkedin-search/cli/src/cli.ts search -q "product manager visa sponsorship" -l "United States" --jobage 14 --limit 20 --format json

# Full details for one job
bun run .agents/skills/linkedin-search/cli/src/cli.ts detail 4426311357 --format plain
```

## Output formats

| Format | Best for |
|--------|----------|
| `json` | Default — `/scrape` and passing IDs to `detail` |
| `table` | Quick human-readable scanning |
| `plain` | Reading one job's full detail (`detail` command) |

Errors go to **stderr** as `{ "error": "...", "code": "..." }` and the process exits with code `1`. `/scrape` logs the error and carries on with the other sources.

## Notes

- Data comes from LinkedIn's public `jobs-guest` endpoints; no credentials are used.
- Page size is fixed at 10 results per page.
- The CLI retries 429/5xx with exponential backoff. If it still fails, treat LinkedIn as unavailable for this run.
- Job IDs are numeric (e.g. `4426311357`); pass them as-is to `detail`.
