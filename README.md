# Mojo Petroleum

Production website for Mojo Petroleum Services, Inc., built with Next.js 15 and the App Router.

## Deploy to Vercel

1. Put this repository in GitHub, GitLab, or Bitbucket.
2. Import the repository at [vercel.com/new](https://vercel.com/new). Vercel detects Next.js automatically.
3. Add these environment variables in **Project Settings → Environment Variables**:
   - `INSPECTION_RECIPIENT=info@mojopetroinc.com`
   - `EMAIL_FROM=Mojo Petroleum <inspections@your-verified-domain.com>`
   - `RESEND_API_KEY=<your Resend API key>`
   - `NEXT_PUBLIC_SITE_URL=https://www.mojopetroleum.com`
   - `NEXT_PUBLIC_TURNSTILE_SITE_KEY=<your Cloudflare Turnstile site key>`
   - `TURNSTILE_SECRET_KEY=<your Cloudflare Turnstile secret key>`
4. Verify the domain used in `EMAIL_FROM` in Resend, then attach `www.mojopetroleum.com` in Vercel.

The inspection workflow sends an internal notification to `info@mojopetroinc.com` and a confirmation to the requester. It also requires a successful Cloudflare Turnstile verification in production. `RESEND_API_KEY` is required for production email delivery.

## Verification

Run `npm run build` before deployment. The project completes an optimized production build using Next.js.

Additional production notes
- **Start in production**: After `npm run build` run `npm start` (or let your platform run the `start` script). This runs the compiled Next.js server and avoids HMR/chunk reload issues seen in development.
- **Healthcheck**: A lightweight health endpoint is available at `/api/health` (returns 200) — useful for monitoring and platform readiness checks.
- **Environment variables**: Ensure the variables listed above are set in your hosting provider for the `production` environment. The server will reject inspection requests if `TURNSTILE_SECRET_KEY` is missing in production.

Troubleshooting
- If you see a runtime chunk/HMR error while developing, stop the dev server, remove the `.next` directory, and restart with `npm run dev`. In production this does not occur when using `npm run build` + `npm start`.

