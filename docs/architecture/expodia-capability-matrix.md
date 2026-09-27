# Expodia capability matrix

Status meanings: LIVE = implemented and backed by real data/infrastructure; PARTIAL = code exists but a required provider/configuration is still missing; READY = architecture/scaffold exists and needs external credentials/deployment; PLANNED = not implemented.

| Capability | Current status | Correct runtime / integration | Remaining work |
|---|---|---|---|
| Public-first traveler experience | PARTIAL | Next.js/OpenNext on Cloudflare | Finish navigation and route consistency |
| Traveler authentication | PARTIAL | Supabase Auth | Verify Site URL, redirect allowlist and confirmation flow |
| Branded confirmation email | PARTIAL | Supabase Auth email templates / SMTP | Configure production sender/SMTP and test redirect |
| Traveler profile/settings | PARTIAL | Next.js + Supabase | Finish settings surface and profile data |
| Traveler PIN lock | PARTIAL | Supabase RPC + local lock state | Verify first-login and recovery flows |
| Virtual Agent chat | PARTIAL | OpenAI Responses API | Persisted history now added; end-to-end API/credential test required |
| AI web research | PARTIAL | OpenAI web_search | Configure key and production model; validate citations |
| Persistent AI conversation | READY | Supabase traveler_ai_conversations/messages | Migration applied live; add history UI |
| Realtime human support | PARTIAL | Supabase Realtime + support tables | Verify RLS/RPC and realtime subscriptions end-to-end |
| Internal browser research workers | READY | Separate Cloudflare Agents worker | Worker is configured with Browser Run, Worker Loader, Workers AI and Durable Object storage; deployment/account binding still requires Cloudflare credentials |
| Long-running research | READY | Cloudflare Agents Durable Objects/fibers | Durable Agent class is configured; add scheduled/background jobs as workflows mature |
| Provider browser workflows | READY | Cloudflare Browser Run + human approval | Provider-specific workflows and explicit human authorization |
| Group travel chat | PARTIAL | Supabase groups/messages | Add realtime, research persistence and richer sourced cards |
| Travel images from research | PLANNED | Authorized source feeds / image search | Add source-aware image retrieval; never invent property images |
| Generated travel imagery | PLANNED | OpenAI/Adobe/OpenArt/Runway as appropriate | Add generation service and generated-content labeling |
| Document upload/reading | PARTIAL | Supabase Storage + OpenAI File Search / Adobe | Add upload pipeline, metadata, access control |
| PDF generation | PARTIAL | PDF service / Adobe / Cloudflare Browser Run | Connect canonical document templates and storage |
| OCR | PLANNED | Adobe OCR or equivalent | Integrate into document ingestion |
| Flight tracking | PARTIAL | Dedicated authorized aviation-data provider | Provider adapter and credentials required; no fake fallback |
| Apple world map | PARTIAL | Apple MapKit JS | Apple Maps token and real airport/flight data layer required |
| Flight route overlays | PLANNED | MapKit JS + verified aviation data | Connect live positions/routes |
| Marketplace registry | PARTIAL | Supabase | Provider feeds/referral integrations required for live inventory |
| Hotels/stays | PARTIAL | Authorized provider API/feed | Partner approval/credentials and inventory normalization |
| Vacation rentals | PARTIAL | Authorized provider/referral feed | Partner access and lawful image/availability source |
| Cars | PLANNED | Authorized car provider | Integration |
| Activities | PLANNED | Authorized activities provider | Integration |
| Bus/rail/transfers | PLANNED | Authorized transport providers | Integrations by market |
| Visas/entry requirements | PLANNED | Government/official sources + research agent | Country-by-country source registry |
| Travel insurance | PLANNED | Authorized insurer/broker integrations | Provider integration |
| Cargo/shipping | PLANNED | Carrier/forwarder integrations | Provider integration |
| Booking cart | PLANNED | Expodia application + provider APIs | Normalize offers, hold/booking semantics, payment |
| Payments | PLANNED | Payment processor | Select provider and implement server-side checkout |
| Booking documents | PARTIAL | Supabase Storage + canonical templates | Connect real booking events to document generation |
| Ticket/PNR tracking | PARTIAL | Expodia booking DB + authorized provider data | Real booking reference/serial registry and status transitions |
| Internal management | PARTIAL | Supabase + Next.js admin | Finish operational controls and audits |
| Provider onboarding | PARTIAL | Supabase + browser agent + human approval | Provider-specific onboarding playbooks |
| Agent email | READY | AgentMail or company-controlled mailbox | Decide mailbox architecture and connect |
| Voice agent | PLANNED | Cloudflare voice/OpenAI/voice provider | Add realtime voice channel |
| Video/avatar content | PLANNED | HeyGen/Runway/Higgsfield | Use for content/education, not operational truth |
| Design system | PARTIAL | Existing Next.js UI + Figma/Canva | Consolidate components and responsive states |
| Deployment | READY | Cloudflare Workers | Verify main worker build/deploy; Netlify remains optional |
| CI | PARTIAL | GitHub Actions | Agents Worker typecheck workflow added; current run still needs to execute |

## Architectural rule

GitHub is the source of truth. Cloudflare is the execution layer for the application and durable agents. Supabase is the data/auth/realtime layer. Specialized services are used only for capabilities they actually provide. Netlify is not a dependency for AI, browsing, documents, maps or agent execution.

No component may manufacture commercial travel inventory, flight status, prices, booking status, ticket/barcode data, property imagery or provider policies.
