# /canva - Build the approved resume in Canva and export the PDF (pipeline step 3)

Puts each approved `## Tailored CV` from Notion into a copy of the right Canva master, exports the PDF, saves it locally, and uploads it to the row's Resume column. Pipeline rules, IDs and write limits: `.claude/skills/job-application-assistant/10-notion-pipeline.md`. Canva details (master IDs, element IDs, layout checks, file path): "Primary template: Canva resume" in `.claude/skills/job-application-assistant/05-cv-templates.md`.

`$ARGUMENTS` may name one company to limit the run, e.g. `/canva iwoca`.

## Step 1: Pick rows

Query the Applications DB for rows where Status = `CV Approved ✅`. If `$ARGUMENTS` names a company, keep only its rows. If none, say "No approved CVs to build" and stop.

## Step 2: Per row - build

1. Read the row's `## Tailored CV` section. Her edits are final - use the text exactly as it stands. If the section is missing or empty, set Status = `Needs Input ✋` and move on.
2. Follow steps 1-6 of the Canva workflow in `05-cv-templates.md`: copy the master for the row's Resume Version, open a transaction, set the headline, replace the Summary and experience bullets with the Tailored CV text, check the thumbnail fits, commit, export the PDF.
3. If text does not fit, change the layout, never the text. Her approved wording is what the ATS reads, so the template adapts to the text, not the other way round. Follow the overflow steps in `05-cv-templates.md` (step 5). Set Status = `Needs Input ✋` only if the content still won't fit in 2 pages after those steps, and report how much is over.
4. After export, run `python3 tools/verify_pdf.py <pdf> --dump-text <txt>` and confirm the ATS text layer contains the headline, the full summary, every bullet, the email and the phone number, in reading order. If no extractor is installed, say so in the report and don't count it as a failure.

## Step 3: Per row - record

1. Save the PDF to `/Users/littleqing/Documents/Work & Side project/Resumes/Quintice Chen - {Company} - {Position}.pdf` (replace `/` and `:` with `-`).
2. Upload the same PDF to the row's **Resume** file property (Notion file upload, then update the page).
3. Set Status = `CV Ready 📄`. Change nothing else on the row.

If the export or upload is blocked (network, permissions), keep the Canva copy, set Status = `Blocked`, and tell her to export it from the Canva copy herself (link it).

## Step 4: Report

Per row: company, position, Canva copy link, PDF path, whether the upload succeeded, Status set. End with: "Run /submit to fill the applications."
