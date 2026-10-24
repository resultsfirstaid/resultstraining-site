# Results Training — Parent Website

Single-page routing website for **resultstraining.com.au**.

## Destinations
- Public course bookings: https://resultsfirstaid.com/
- Workplace training: https://resultsworkplacetraining.com/
- First aid equipment & servicing: https://resultsfirstaidservices.com/

## Build / Cloudflare Pages
- Framework preset: None
- Build command: `npm run build`
- Output directory: `dist`
- Production branch: `main`
- No secrets or Supabase connection required.

The build fetches pinned shared Results Design System CSS from the public `resultsfirstaid/results-design-system` GitHub repository at **v0.6.0**. This keeps layout components consistent without depending on an unpinned main branch. `assets/site.css` owns only parent-site-specific presentation.

For offline testing, set `RESULTS_DESIGN_SYSTEM_LOCAL_DIR` to a local checkout of the design-system repository containing the CSS files listed in `scripts/build.mjs`.

## Edit points
- Content and destination links: `index.html`
- Parent theme and page composition: `assets/site.css`
- Mobile navigation and edge-aware corner behaviour: `assets/site.js`
- Shared version pin: `scripts/build.mjs`

## Deployment
Create a new GitHub repository for this website, upload these files preserving their paths, connect it to Cloudflare Pages and add `resultstraining.com.au` as a custom domain. Configure `www.resultstraining.com.au` as a redirect to the root domain if desired.

## QA
Check desktop, tablet, and mobile navigation; all three outbound pathways; click-to-call/email; edge-aware hero/contact corners; keyboard navigation; and HTTPS canonical hostname. Verify copy, contact details, and photography with the Results team before promoting.
