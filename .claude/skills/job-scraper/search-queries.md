# Search Queries for Job Scraper

Market: **United Kingdom** and **Czech Republic** only — no employer sponsorship needed in either, London first. Hybrid, on-site or remote all accepted. **No Taiwan roles.**

Salary floor: **UK > £80,000**, **Europe (incl. Czech Republic) > €90,000** a year (see "Salary Filter" below).
Function: **Product Manager** (Product Manager / Product Owner / Senior Product Manager / Product Operation Manager / AI Product Manager / Technical Product Manager), with an AI / decisioning focus.

Source of truth for this strategy: the Notion skill page "Job search digest"
(https://app.notion.com/p/40bb07b9915c80ab9fa6e26b570ebff9). If the two disagree, the Notion page wins - tell the user so this file can be updated.

## Installed portal CLIs (primary for `/scrape`)

`/scrape` runs these portal CLIs first:

- **linkedin-search** - in priority order: `--location "London, United Kingdom"`, `"United Kingdom"` (UK-wide and remote-UK), `"Czechia"`. Max 3 searches per run (see its SKILL.md).
- **freehire-search** - pass `--country GB,CZ` (never `--region eu`: `eu` excludes the UK).

**Market priority:** London → rest of UK / remote-UK → Czech Republic. When a run is short on time or volume, cut from the end of that list.

The `site:` query templates in this file are the **WebSearch fallback** and the **broad search** (Step 3 below). Aggregator hits are leads only: confirm every role on the company's own careers site before it counts.

**Language scope:** English and Chinese only. Postings that require another language as a job condition go through `04-job-evaluation.md`'s Language Gate.

## Candidate snapshot (for query design)

- AI Product Manager, ~4.5 years full-time PM. Positioning: "AI Product Manager · Credit Decisioning" - application-layer AI in decisioning / underwriting workflows, not model building.
- Work authorisation without employer sponsorship in the **UK (from January 2027)** and the **Czech Republic**. Open to relocating anywhere in either country. London is first priority.
- Seniority: strong in the mid-level PM pool (2-5 years asked). Senior PM asking 4-6 years is a stretch but allowed. **Skip** Head / Director / Principal / Staff, and Senior roles demanding 6+ years.
- Ideal employer: licensed lender or credit vendor, 50-500 people, with its own credit/underwriting product team, a decisioning team, or document intelligence actively putting AI into document intake or decisioning.
- **Search narrow-to-wide:** run the core ring first; open the wider rings only after the core is exhausted.

## Three target categories

Every role found is tagged with one category. The category picks the resume version (see `05-cv-templates.md`).

| Category | What it covers | Resume version |
|----------|----------------|----------------|
| 1 - Decisioning & document intelligence | Decision engines, workflow re-engineering, document intelligence in highly regulated environments. Lending & fintech first; also legal tech, KYC/KYB & onboarding, insurance underwriting, accounting/tax. | "Decision Engine" or "SME Credit Decision" |
| 2 - Consumer lending growth | Consumer lending PM roles focused on growth and conversion funnels (acquisition, onboarding, originations funnel, engagement, retention). Credit experience usually not required. | "Consumer Lending" |
| 3 - General AI / Technical PM | Strong AI PM and Technical PM roles that fit neither category above. | "General AI Agent (Ship Fast)" |

## Step A - Official careers sweep (run every time)

Check each company's own careers site or ATS board. Look only for product roles (Product Manager / Product Owner / Senior PM) based in the UK or the Czech Republic (any work type). Most companies below are UK-based; a Prague office of the same company counts too. Include any role still live on the official site, **whatever its posting date** (the 14-day window below does not apply to this sweep).

ATS endpoints to try, in order:
- Greenhouse: `https://boards-api.greenhouse.io/v1/boards/<co>/jobs`
- Lever: `https://jobs.lever.co/<co>`
- Ashby: `https://api.ashbyhq.com/posting-api/job-board/<co>`
- Workable: `https://apply.workable.com/api/v1/widget/accounts/<co>`
- Teamtailor, Workday, SmartRecruiters: the company's own careers page links to these

Fallback when the board can't be found or reached: the company's Built In London page, `https://builtinlondon.uk/company/<slug>/jobs`. If both fail, list the company under **"Not reachable"** in the Step 5 report - never guess.

### Core ring

- **AI / data-driven challengers:** iwoca, OakNorth, Capital on Tap, Funding Circle, Uncapped, YouLend, Liberis, Kriya (formerly MarketInvoice), Capify, Tide, Starling (incl. Engine by Starling), Revolut Business
- **Decision engines:** Taktile, Provenir, GDS Link, FICO (FICO Platform), Experian (PowerCurve / decisioning / affordability), CRIF (StrategyOne), ACTICO, Zest AI, Scienaptic, Floowed
- **SME banks & specialist lenders:** Allica Bank, Shawbrook (incl. ThinCats), Aldermore, Paragon, Cynergy Bank, Cambridge & Counties, Secure Trust Bank, Arbuthnot Latham, LendInvest, Triple Point
- **Asset & invoice finance:** Simply Asset Finance, Novuna, Time Finance, Close Brothers, Bibby Financial Services, Skipton Business Finance, eCapital, Premium Credit
- **Consumer lending (Category 2):** Lendable, Zopa, Monzo (Borrowing/Flex), Creditspring, Zilch, ClearScore, Klarna UK, NewDay, Vanquis, Plend, Abound, LoanTube

### Wider ring (only after the core ring is exhausted)

- **Regulated document / workflow AI (Category 1):** Luminance, Legora, Harvey, Juro, Definely, Lawhive, Legal 500, Sumsub, Entrust/Onfido, ComplyAdvantage, Quantexa, Cytora, Sidetrade, Equifax UK, TransUnion UK

## Step B - Broad search for anything the list missed

Run several distinct queries through the Indeed connector (country `GB`), WebSearch, and Built In London product search (`https://builtinlondon.uk/jobs/product-management?search=<term>`) for these terms:

`credit`, `lending`, `underwriting`, `decisioning`, `affordability`, `document`, `KYC`, `legal`, `growth`

Use them to discover new companies that match the ideal-employer profile above. Treat every aggregator listing as a lead: confirm it on the company's own site before it counts.

**Czech Republic** (after the UK searches): run the same terms through the Indeed connector with country `CZ`, and these WebSearch queries:

```
site:jobs.cz "product manager" Praha
site:startupjobs.cz "product manager"
site:linkedin.com/jobs "product manager" fintech OR AI Prague
```

### Priority 1: Decisioning & document intelligence (Category 1)

```
site:linkedin.com/jobs "product manager" credit decisioning London
site:linkedin.com/jobs "product manager" underwriting "United Kingdom"
site:linkedin.com/jobs "product manager" "decision engine" OR "decisioning" UK
site:builtinlondon.uk "product manager" lending
site:builtinlondon.uk "product manager" underwriting
"product manager" "document intelligence" OR "intelligent document processing" London
"product manager" KYC OR KYB OR onboarding fintech London
"product manager" "legal tech" OR legaltech AI London
"product manager" "insurance underwriting" AI UK
```

### Priority 2: Consumer lending growth (Category 2)

```
site:linkedin.com/jobs "product manager" "consumer lending" London
site:linkedin.com/jobs "growth product manager" fintech London
site:builtinlondon.uk "product manager" growth lending
"product manager" originations OR "credit card" OR "personal loans" London
"product manager" acquisition OR onboarding OR conversion fintech London
```

### Priority 3: General AI / Technical PM (Category 3)

```
site:linkedin.com/jobs "AI product manager" London
site:linkedin.com/jobs "technical product manager" AI "United Kingdom"
site:builtinlondon.uk "AI product manager"
"product manager" "LLM" OR "generative AI" OR "AI agents" London
```

Title variants to try in any category: Product Manager, Senior Product Manager, Product Owner, AI Product Manager, Technical Product Manager, Growth Product Manager, Product Manager - Credit / Lending / Risk / Decisioning.

## Location Filter

- **PASS:** anywhere in the UK or the Czech Republic (hybrid, on-site or remote). London ranks first; when two roles score the same, London wins.
- **FAIL:** roles based in any other country (including Taiwan); remote roles restricted to another country; roles that need local visa sponsorship.
- **FLAG:** frequent international travel, or a fully in-office requirement - note it as a caveat, don't exclude.

## Hard exclusions

- US-citizen-only or visa-restricted roles the candidate cannot hold.
- Pure engineering, data-science, or credit-risk-analyst roles (not product roles).
- Head / Director / Principal / Staff roles, and Senior roles demanding 6+ years.
- **Start date (UK roles):** if a UK role says it needs someone to start before January 2027, **flag it, don't exclude it.**

## Salary Filter

Floors (gross annual base):
- UK: **above £80,000**
- Europe (incl. Czech Republic): **above €90,000** (convert a CZK salary to EUR at today's rate and show the conversion)

Rules:
- Salary **stated** and its **top** end is below the floor → **Not suitable**, reason "salary below floor (stated: ...)".
- Salary stated and the floor falls inside the range → keep, note it in caveats.
- Salary **not stated** → keep, record Salary = "Not stated". Never guess or estimate a salary.

## Language Filter

English (fluent) and Mandarin Chinese (native) are her working languages. Czech roles that require Czech fail `04-job-evaluation.md`'s Language Gate.

## Date Filter

- Portal CLI results and broad search: posted within the last 14 days, or with an application deadline that has not passed. If the date can't be determined, include it and flag "date unknown".
- Official careers sweep (Step A): no date limit - any role still live on the official site counts.

## Adapting Queries

If the user names a focus area, run that category's queries plus 2-3 custom queries for it:
- "/scrape decisioning" -> Priority 1 + Step A core ring "Decision engines"
- "/scrape consumer" -> Priority 2 + Step A "Consumer lending"
- "/scrape AI" -> Priority 3
- "/scrape broad" -> all priorities and both rings
- "/scrape uk", "/scrape czech" -> that market only
