# Expodia Agents

This is a separate Cloudflare Workers agent runtime for capabilities that should not be forced into the main Next.js application.

Current worker: ExpodiaResearchAgent.

Capabilities:
- persistent agent state through Cloudflare Durable Objects
- streaming chat
- rendered web browsing through Cloudflare Browser Run
- screenshots, DOM inspection and structured extraction
- human-in-the-loop browser sessions when sensitive provider workflows require approval
- source-grounded travel research

This worker is intentionally separate from the main expodia-flight Next.js/OpenNext worker.

Deployment is intentionally not triggered by repository changes. Configure and deploy it only after Cloudflare account resources and production bindings have been verified.

The agent must never fabricate commercial inventory or bypass provider authentication, MFA, CAPTCHA, terms, or ownership controls.
