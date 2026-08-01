# Abhishek Kumar T — Portfolio

Full-stack developer portfolio built with **Next.js 16 (Turbopack)**, **React 19**, **Tailwind CSS 4**, and **TypeScript**.

## Features

- Responsive single-page portfolio with sections: About, Experience, Projects, Skills, Education, Certifications, Contact.
- SEO-ready: metadata, Open Graph / Twitter cards, `sitemap.xml`, `robots.txt`, JSON-LD.
- Contact form backed by a hardened API route (zod validation, rate limiting, honeypot + spam/disposable-email checks) that sends email via Nodemailer.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **UI:** React 19, Tailwind CSS 4
- **Language:** TypeScript
- **Contact backend:** zod, nodemailer
- **Testing:** Vitest

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Production Build

```bash
npm run build
npm start
```

## Tests

```bash
npm test
npm run lint
```

## Deployment

Deployed to Vercel (see https://vercel.com). Environment variables required:

- `EMAIL_USER` — the Gmail address used to send contact-form emails
- `EMAIL_PASS` — the corresponding Gmail App Password
