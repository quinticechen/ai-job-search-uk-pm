# Search Queries for Job Scraper

Market, in priority order (Hybrid, on-site or remote all accepted; **no Taiwan roles**):
1. **United Kingdom** - London first. No sponsorship needed.
2. **Czech Republic** - no sponsorship needed.
3. **Other EU countries** - only roles that offer visa sponsorship (see "Visa sponsorship rule" below).
4. **United States** - only roles that offer visa sponsorship.

Target salary band (gross annual base): **UK £70,000-£110,000**, **Europe (EU incl. Czech Republic) €80,000-€115,000**, **US $140,000-$200,000** (see "Salary Filter" below).
Function: **Product Manager** (Product Manager / Product Owner / Senior Product Manager / Product Operation Manager / AI Product Manager / Technical Product Manager), with an AI / decisioning focus.

Source of truth for this strategy: the Notion skill page "Job search digest"
(https://app.notion.com/p/40bb07b9915c80ab9fa6e26b570ebff9). If the two disagree, the Notion page wins - tell the user so this file can be updated.

## Installed portal CLIs (primary for `/scrape`)

`/scrape` runs these portal CLIs first:

- **freehire-search** - the main tool for the visa markets. Its "This fork: standard searches" table runs UK + CZ (`--country GB,CZ`), then EU and US with sponsorship filters (`--facet visa_sponsorship=true` for "posting says it sponsors", `--facet collections=us-h1b-sponsor` / `nl-recognised-sponsor` for "company is a known sponsor").
- **linkedin-search** - in priority order: `--location "London, United Kingdom"`, `"United Kingdom"` (UK-wide and remote-UK), `"Czechia"`, then optionally one EU and one US search with "visa sponsorship" in the query. Max 5 searches per run (see its SKILL.md).

**Market priority:** London → rest of UK / remote-UK → Czech Republic → EU with sponsorship → US with sponsorship. When a run is short on time or volume, cut from the end of that list.

## Visa sponsorship rule (EU outside CZ, and US)

UK and Czech Republic roles never need this check. For every other EU role and every US role, record a **Sponsorship** value from the official posting and public registers:

| Sponsorship | Evidence | Result |
|---|---|---|
| **Stated** | The posting says it sponsors visas, supports work permits / EU Blue Card / H-1B (incl. transfer), or offers relocation with visa support | PASS |
| **Likely** | The posting is silent, but the company is on a public sponsor register: US - [USCIS H-1B Employer Data Hub](https://www.uscis.gov/tools/reports-and-studies/h-1b-employer-data-hub) approvals in the last 3 years (freehire collection `us-h1b-sponsor`); Netherlands - [IND public register of recognised sponsors](https://ind.nl/en/public-register-recognised-sponsors) (freehire collection `nl-recognised-sponsor`) | PASS, with caveat "sponsorship likely (register), not stated - confirm with the recruiter" |
| **None** | The posting says no sponsorship, "must already have the right to work in <country>", citizens / green-card holders only, or security clearance required; or it is silent and the company is on no register | FAIL (deal-breaker) |

- freehire's `visa_sponsorship=true` comes from an AI reading of the posting. Confirm the wording in the official posting before recording **Stated**; if the posting doesn't say it, fall back to the register check.
- Other EU countries have no public sponsor register, so only **Stated** passes there.
- US caveat: most first-time H-1B visas go through the March registration lottery with an October start. Note it in caveats for US roles that don't name another route.
- Write the Sponsorship value in the row's `## Fit score` caveats (e.g. "Sponsorship: Stated - 'we sponsor visas' in posting").

The `site:` query templates in this file are the **WebSearch fallback** and the **broad search** (Step 3 below). Aggregator hits are leads only: confirm every role on the company's own careers site before it counts.

**Language scope:** English and Chinese only. Postings that require another language as a job condition go through `04-job-evaluation.md`'s Language Gate.

## Candidate snapshot (for query design)

- AI Product Manager, ~4.5 years full-time PM. Positioning: "AI Product Manager · Credit Decisioning" - application-layer AI in decisioning / underwriting workflows, not model building.
- Work authorisation without employer sponsorship in the **UK (from January 2027)** and the **Czech Republic**. Open to relocating anywhere in either country. London is first priority. Also open to other EU countries and the US **when the employer sponsors the visa**.
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

Check each company's own careers site or ATS board. Look only for product roles (Product Manager / Product Owner / Senior PM) based in the UK or the Czech Republic (any work type). Most companies below are UK-based; a Prague office of the same company counts too. Roles at these companies in other EU countries or the US (e.g. Taktile Berlin / New York, Zest AI, FICO, Experian US) count only if they pass the Visa sponsorship rule. Include any role still live on the official site, **whatever its posting date** (the 14-day window below does not apply to this sweep).

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

**EU and US with sponsorship** (after the UK and Czech searches): run freehire's visa searches first, then these:

```
"product manager" "visa sponsorship" fintech OR lending OR AI Berlin OR Amsterdam OR Dublin
"product manager" "relocation" "visa" fintech Europe
site:linkedin.com/jobs "product manager" "visa sponsorship" Germany OR Netherlands OR Ireland
"product manager" "H-1B" OR "visa sponsorship" fintech OR lending OR "credit decisioning"
site:linkedin.com/jobs "product manager" "will sponsor" "United States"
```

Then check each lead against the Visa sponsorship rule above.

### Job sites to search

Cover every group below in each run (narrow-to-wide, London first). All of them are **leads only**: confirm each role on the company's own careers site or ATS before it counts, and record that official URL. Search them through WebSearch with `site:` queries (or the Indeed connector where noted); never log in, create accounts or scrape behind a login.

**United Kingdom - mainstream boards**

| Site | `site:` / how | Notes |
|------|---------------|-------|
| LinkedIn Jobs | `site:linkedin.com/jobs` (or the low-volume `linkedin-search` CLI) | Largest UK board |
| Indeed UK | Indeed connector, country `GB` | |
| Reed | `site:reed.co.uk` | |
| Totaljobs | `site:totaljobs.com` | |
| CV-Library | `site:cv-library.co.uk` | |
| Glassdoor UK | `site:glassdoor.co.uk` | Also for company reviews |
| Adzuna UK | `site:adzuna.co.uk` | Aggregator |
| Guardian Jobs | `site:jobs.theguardian.com` | |
| Find a Job (GOV.UK) | `site:findajob.dwp.gov.uk` | Government board |
| Built In London | `https://builtinlondon.uk/jobs/product-management?search=<term>` | Tech and fintech |
| eFinancialCareers | `site:efinancialcareers.co.uk` | Finance and fintech |
| Welcome to the Jungle (formerly Otta) | `site:welcometothejungle.com` | Tech and startups |
| Escape the City | `site:escapethecity.org` | Mission-driven / startups |

**Czech Republic - mainstream boards**

| Site | `site:` / how | Notes |
|------|---------------|-------|
| Jobs.cz | `site:jobs.cz` | Largest Czech board |
| Prace.cz | `site:prace.cz` | Same group as Jobs.cz |
| StartupJobs.cz | `site:startupjobs.cz` | Czech startups |
| Profesia.cz | `site:profesia.cz` | |
| LinkedIn Jobs | `site:linkedin.com/jobs` with Prague / Brno / Czechia | |
| Indeed CZ | Indeed connector, country `CZ` | |
| Jobstack.it | `site:jobstack.it` | Tech roles |
| Built In (Prague) | `site:builtin.com` "Prague" OR "Czechia" | |

Czech postings are often in Czech: also search `produktový manažer`, `product owner`, `produktový vlastník`. A posting that requires Czech fails the Language Gate.

**Startups and venture-backed companies**

| Site | `site:` / how | Notes |
|------|---------------|-------|
| Y Combinator - Work at a Startup | `site:workatastartup.com` and `site:ycombinator.com/companies` "jobs" | Filter to London / UK / remote-UK / Europe |
| Wellfound (formerly AngelList Talent) | `site:wellfound.com/jobs` | |
| Seedtable | `site:seedtable.com/jobs` | European startups |
| VC portfolio job boards | `site:talent.seedcamp.com`, `site:talent.octopusventures.com`, `site:jobs.balderton.com`, `site:indexventures.com/startup-jobs` | UK/European portfolios; many fintechs |
| Hacker News "Who is hiring" | `site:news.ycombinator.com "Who is hiring"` + "London" OR "remote (UK)" | Monthly thread |

**Visa sponsorship boards and registers (EU and US)**

| Site | `site:` / how | Notes |
|------|---------------|-------|
| freehire.me | `freehire-search` CLI with the visa filters (see its SKILL.md) | Main source; tags register sponsors |
| Arbeitnow | Public API: `https://www.arbeitnow.com/api/job-board-api?visa_sponsorship=true` (filter titles for "product") | Mostly Germany; free API, link back to the site |
| Relocate.me | `site:relocate.me` "product manager" | Tech roles with relocation and visa support |
| Indeed (other countries) | Indeed connector with country `US`, `DE`, `NL`, `IE`, plus "visa sponsorship" in the query | |
| USCIS H-1B Employer Data Hub | https://www.uscis.gov/tools/reports-and-studies/h-1b-employer-data-hub | Register check only, not a job board |
| MyVisaJobs / H1BGrader | `site:myvisajobs.com` / `site:h1bgrader.com` <company> | Leads for a US company's H-1B history; confirm on the USCIS hub |
| IND recognised sponsors (NL) | https://ind.nl/en/public-register-recognised-sponsors | Register check only |

**Worldwide remote boards**

| Site | `site:` / how |
|------|---------------|
| We Work Remotely | `site:weworkremotely.com` |
| Remote OK | `site:remoteok.com` |
| Remotive | `site:remotive.com` |
| Working Nomads | `site:workingnomads.com` |
| Himalayas | `site:himalayas.app` |
| Remote.co | `site:remote.co` |
| JustRemote | `site:justremote.co` |
| EU Remote Jobs | `site:euremotejobs.com` |
| Jobgether | `site:jobgether.com` OR `site:jobs.lever.co/jobgether` |

**Remote roles must allow employment from the UK or the Czech Republic**, or else pass the Visa sponsorship rule for the EU country or US where they employ. "Remote" does not mean worldwide: check the posting's allowed countries or time zones. A Jobgether or aggregator listing is a lead to the real employer, never the posting itself.

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
- **PASS with sponsorship:** other EU countries and the US, when the role's Sponsorship is **Stated** or **Likely** (see "Visa sponsorship rule"). Ranked after UK and Czech roles of the same score.
- **FAIL:** EU (outside CZ) or US roles with Sponsorship = **None**; roles in any other country (including Taiwan, and non-EU Europe such as Switzerland, Norway or Ukraine); remote roles restricted to a country she can't work in.
- **FLAG:** frequent international travel, or a fully in-office requirement - note it as a caveat, don't exclude.

## Hard exclusions

- US-citizen-only, green-card-only or security-clearance roles; any EU or US role that says it won't sponsor.
- Pure engineering, data-science, or credit-risk-analyst roles (not product roles).
- Head / Director / Principal / Staff roles, and Senior roles demanding 6+ years.
- **Start date (UK roles):** if a UK role says it needs someone to start before January 2027, **flag it, don't exclude it.**

## Salary Filter

Target bands (gross annual base):
- UK: **£70,000-£110,000**
- Europe (EU incl. Czech Republic): **€80,000-€115,000** (convert a CZK or other local salary to EUR at today's rate and show the conversion)
- United States: **$140,000-$200,000**

Rules:
- Stated range **overlaps** the band → keep.
- Stated **top** end is below the band's minimum → **Not suitable**, reason "salary below band (stated: ...)".
- Stated **bottom** end is above the band's maximum → keep, but add the caveat "pays above target band - check seniority" (it often signals a Senior / Lead role; apply the Seniority Gate strictly).
- Salary **not stated** → keep, record Salary = "Not stated". Never guess or estimate a salary.

What she **asks for** on application forms is separate: see `personal-form-defaults.local.md`.

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
- "/scrape eu", "/scrape us" -> that market only, sponsored roles only (freehire visa searches + "EU and US with sponsorship" queries)
