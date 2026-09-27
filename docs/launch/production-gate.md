# Expodia production publish gate

Expodia has two operational populations: travelers/customers and authorized human travel professionals. Company administrators are a restricted management role, not a third customer population. Background AI workers are internal infrastructure and are never presented as people or professional agents.

## Publish rule

Do not publish the production application until every blocking item below is verified in the real production environment. A code scaffold, connected ChatGPT plugin, or successful local test is not evidence of production connectivity.

## Blocking checks

- [ ] Cloudflare expodia-flight is deployed from the current GitHub main branch.
- [ ] Cloudflare expodia-agents is deployed and the EXPODIA_AGENTS service binding resolves.
- [ ] Browser Run, Worker Loader, Workers AI and Durable Object resources are live.
- [ ] Supabase production URL/key, Auth redirect URLs and RLS are verified.
- [ ] Traveler email confirmation flow is verified.
- [ ] Google OAuth is configured in Supabase and the callback provisions a traveler profile.
- [ ] Professional registration remains invitation-only and database-authorized.
- [ ] OpenAI production secret is configured for the customer-facing Virtual Agent.
- [ ] Authorized flight-data integration is configured for live flight search/tracking. ChatGPT-connected Skyscanner access alone does not inject credentials into the deployed Expodia application.
- [ ] Authorized accommodation/provider integrations are configured. ChatGPT-connected Booking.com access alone does not inject credentials into the deployed Expodia application.
- [ ] Production email sender/domain is verified through Resend or another company-controlled mail service.
- [ ] Private payment machine endpoint/authentication is connected and payment callbacks are verified.
- [ ] Document verification provider is integrated. Until specialist document-authentication and travel-requirement sources are connected, Expodia must not issue an authenticity or travel-eligibility approval.
- [ ] Apple MapKit JS production token is configured before the live world map is enabled.
- [ ] No test/demo/fabricated travel inventory, flight status, booking status, prices, documents, barcodes or property images are enabled.
- [ ] Production build, typecheck and end-to-end smoke tests complete successfully.
- [ ] Security review confirms RLS, auth boundaries, secrets and internal-worker isolation.

## Safety rule

AI workers may research, extract, compare, classify, route and explain. They may not manufacture official documents, invent travel inventory, override authoritative verification, or convert uncertain evidence into an approval.

Document authenticity and passenger travel eligibility are separate decisions. A document that appears authentic is not automatically proof that a passenger is admissible or boardable for a particular itinerary.

## Current architecture

GitHub is the source of truth. Cloudflare is the application/agent execution layer. Supabase is the auth/data/realtime layer. Specialist providers supply authoritative commercial travel and compliance data. The private payment machine is the payment authority.

Netlify is not a runtime dependency.

## Current state

The GitHub-side Cloudflare service binding and internal Agents worker configuration are prepared. The remaining blocking items require production credentials, provider authorization, account configuration, or runtime verification and must not be represented as complete until tested.
