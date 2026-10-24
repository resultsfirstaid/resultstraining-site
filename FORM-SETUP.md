# Contact form — Cloudflare Pages setup

The contact form is a real server-side form using a Cloudflare Pages Function (`functions/api/enquiry.js`) and Resend for email delivery. It will **not send** until configured. The function returns an explicit error if configuration is missing.

1. Verify a sending domain with [Resend](https://resend.com/domains) and create an API key.
2. In **Cloudflare Pages → project → Settings → Variables and Secrets**, configure:
   - `RESEND_API_KEY`: Resend API key (**secret**, never commit it).
   - `ENQUIRY_FROM_EMAIL`: verified sender address, e.g. `Results Training <enquiries@YOUR-VERIFIED-DOMAIN>`.
   - `ENQUIRY_TO_EMAIL`: recipient inbox; multiple recipients can be separated by commas.
3. Configure variables for the Production environment and redeploy. Add Preview variables separately if desired.
4. Submit a test enquiry from the deployed site and confirm delivery and reply-to behaviour.
5. Add spam/rate-limit protection (such as Cloudflare Turnstile and a WAF rate-limit rule) before promoting the form widely. The form includes a honeypot but is not a substitute for server-side abuse protection.

**Important:** Cloudflare Pages Functions require the `functions/` directory at the repository root, not inside `dist/`. The existing `npm run build` command and `dist` output directory stay unchanged.

## Source
The HQ address is listed as **70 Foundation Road, Truganina VIC 3029** on the Results First Aid website. Some pages display VIC 3020 in the footer; confirm postcode and suite/unit formatting with the business before final production sign-off.
