# Candy English Daily

A candy-colored personal English learning web app for daily BBC Learning English practice, with both easy and standard sources.

web：candy-english-daily.vercel.app

## Features

- Next.js 15 App Router with TypeScript
- TailwindCSS candy visual system
- Framer Motion page and card animations
- Lucide React icons
- Home page source chooser for easy or standard lessons
- Daily lesson card and LocalStorage stats
- Lesson page with audio, vocabulary, article, dictation, scoring, and result card
- `/api/update` endpoint that fetches both BBC Learning Easy English and BBC 6 Minute English podcast RSS feeds
- GitHub Action that updates `data/lessons.json` every day and commits changes
- Vercel Cron schedule in `vercel.json`

## Local Development

Install dependencies, then run:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Data

Static lesson data lives in:

```text
data/lessons.json
```

Learning progress is stored in the browser:

```text
candy-english-progress
```

## BBC Update Endpoint

```text
GET /api/update
```

The endpoint fetches both sources:

```text
Learning Easy English: https://podcasts.files.bbci.co.uk/p0hsrwv5.rss
6 Minute English: https://podcasts.files.bbci.co.uk/p02pc9tn.rss
```

In local development it attempts to write the newest item into `data/lessons.json`. On Vercel, filesystem writes are not durable, so the endpoint returns the normalized lesson payload for cron monitoring.

## GitHub Action Auto Updates

The production update path is:

```text
BBC RSS -> GitHub Action -> data/lessons.json commit -> Vercel redeploy
```

The workflow lives in:

```text
.github/workflows/update-lessons.yml
```

It runs every day at `00:10 UTC` and can also be triggered manually from the GitHub Actions tab.

Run the same update script locally:

```bash
npm run lessons:update:dry-run
npm run lessons:update
```

For GitHub to push the updated JSON, enable write access:

```text
GitHub repository -> Settings -> Actions -> General -> Workflow permissions -> Read and write permissions
```

After Vercel is connected to the GitHub repository, every Action commit to the production branch will trigger a Vercel redeploy automatically.
