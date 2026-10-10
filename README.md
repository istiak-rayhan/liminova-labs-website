# Liminova Labs

Digital transformation partner site: Next.js App Router, Tailwind CSS v4, Framer Motion.

## Scripts

```bash
npm install
npm run dev
npm run build
```

## Content

Edit shared copy in `src/data/`:

- `site.ts` — brand, email, and env-driven booking / marketplace URLs
- `projects.ts` — case studies (single source for list + detail)
- `services.ts`, `testimonials.ts`, `faqs.ts`, `proof.ts`, `process.ts`

Swap project screenshots in `public/projects/`. Paths are referenced from `projects.ts`.

## Environment

Copy `.env.example` to `.env.local`.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical domain for sitemap and metadata |
| `NEXT_PUBLIC_CALENDLY_URL` | Embeds Calendly / Cal.com on `/book` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Shows the corner WhatsApp button (`wa.me`) |
| `NEXT_PUBLIC_LINKEDIN_URL` | Footer “Also on” |
| `NEXT_PUBLIC_FIVERR_URL` | Footer only — never in the header |
| `NEXT_PUBLIC_UPWORK_URL` | Footer only |
| `EMAIL_USER` / `EMAIL_PASS` | Contact form SMTP (Gmail app password) |
| `EMAIL_TO` | Inbox that receives inquiries (defaults to `liminovalabs@gmail.com`) |

Marketplace links stay in the footer on purpose. Direct booking is the primary path.

## Contact form

`POST /api/contact` validates with Zod, ignores honeypot spam, rate-limits per IP, emails the studio, and sends a short auto-reply to the sender.
