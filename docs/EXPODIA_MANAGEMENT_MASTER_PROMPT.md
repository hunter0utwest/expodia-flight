EXPODIA MANAGEMENT SYSTEM — MASTER IMPLEMENTATION PROMPT

Work on the existing iamtheoracle/expodia-flight repository. Preserve all working functionality. Do not rebuild, replace, or redesign existing working modules merely to implement management. Do not deploy to Netlify. Work in GitHub and the required Supabase workspace only.

OBJECTIVE
Build a production-grade Company Management system that controls professional invitations, users, agents, travelers, bookings, passengers, documents, tickets, verification, flight operations, notifications, audit records, and other existing Expodia operational data through one protected management workspace.

ACCOUNT MODEL
PUBLIC → no privileged access
TRAVELER → traveler workspace only
AGENT → professional workspace only
COMPANY_ADMIN → management workspace
Never determine authorization from editable client metadata. Supabase RLS/database authorization is authoritative.

FIRST COMPANY ADMIN
The first Company Admin is the existing Expodia account whose email is already supplied to the implementation owner. Link that existing auth.users account to company_admins. Do not create a password, alter credentials, or expose secrets. If the auth user does not yet exist, show a clear setup state rather than creating credentials.

ACCESS
/ access remains the public authentication entry.
After password authentication, determine the account type from authoritative database records.
COMPANY_ADMIN → /admin
AGENT → professional workspace
TRAVELER → /traveler
Unknown → safe access error and sign out.
Do not expose management links to ordinary public users.

MANAGEMENT WORKSPACE
Create a protected /admin area with:
Overview
Professional invitations
Agent applications
Agents
Travelers
Customers
Bookings
Passengers
Tickets
Documents
Verification
Flight tracking
Aviation intelligence
Notifications
Audit log
System/database health
Management users
Settings

Only expose modules that already have real backend data. Never populate empty sections with fake/demo records.

REFERRAL INVITATION SYSTEM
Management can:
- generate secure six-digit professional invitation codes;
- optionally bind a code to an intended email;
- choose expiry;
- choose maximum redemptions;
- view active, used, expired and revoked invitations;
- revoke invitations;
- see redemption timestamps and invited account where available;
- issue a replacement;
- never retrieve the original plaintext code after issuance.

Store only a cryptographic hash of the code.
Use cryptographically secure randomness, not Math.random or PostgreSQL random() for security-sensitive code generation.
Default to one redemption and a short expiry.
Require intended email whenever practical.
Rate-limit verification attempts.
Do not expose codes through public APIs, logs, analytics, URLs or client-side database queries.

REFERRAL REDEMPTION
Do not consume an invitation merely because a user typed the code.
Use an atomic reservation/claim workflow:
1. Validate code.
2. Validate intended email.
3. Validate expiry/revocation/redemption limit.
4. Create a short-lived reservation.
5. Complete auth signup.
6. Atomically redeem the reservation and create the professional account.
7. If signup fails, allow the reservation to expire without consuming the invitation.
Prevent race conditions and double redemption.

AGENT SIGNUP
Normal Sign Up is traveler-only.
Professional signup is available only after the user explicitly indicates they have an Expodia invitation/referral code.
A valid invitation identifies the person as an invited professional.
Create the professional account only through the controlled workflow.
Do not let a traveler change their own role to AGENT or COMPANY_ADMIN.

AGENT SECURITY
Professional accounts use:
- password authentication;
- four-digit security PIN;
- configurable application session duration;
- automatic expiry;
- logout when the configured application session expires;
- reauthentication where required.
Do not describe the four-digit PIN as cryptographically equivalent to a strong second factor. Protect it using salted hashing and rate-limited verification.

MANAGEMENT USERS
Company Admins can invite additional management users through a separate secure workflow.
Do not let ordinary agents create administrators.
Every management privilege change must be audited.
Support revocation/deactivation without deleting historical records.

AUDIT
Create an append-only management audit trail covering:
admin login/access;
invitation creation;
invitation revocation;
invitation redemption;
agent approval/review;
role changes;
management-user changes;
booking/document/ticket administrative changes;
security changes;
important database/system operations.
Record actor, action, target, timestamp, result and safe metadata.
Never record passwords, PINs, referral plaintext codes, auth tokens or service-role keys.

DATABASE
Inspect the existing Supabase schema before changing it.
Reuse existing tables and relationships.
Do not duplicate existing booking, passenger, document, ticket, verification or agent tables.
Every new table must have:
- primary key;
- foreign-key integrity where applicable;
- timestamps;
- appropriate indexes;
- RLS;
- least-privilege grants;
- safe security-definer functions where necessary.
Do not expose service-role credentials to browser code.
Do not grant broad authenticated access merely because an admin UI exists.

EXISTING DOCUMENT/TICKET RULES
Preserve the existing distinction between BOOKED, TICKETED, CHECKED IN and BOARDING PASS ISSUED.
Never fabricate boarding passes, BCBP barcodes, ticket numbers or airline-issued documents.
Management can review provenance, status and versions but cannot manufacture official third-party credentials.

OPERATIONS
Management should be able to search and filter real records.
Destructive operations require confirmation and appropriate authorization.
Prefer reversible status changes over deletion.
Show empty states honestly.
Show errors honestly.
No demo users, fake bookings, fake airlines, fake tickets or placeholder operational records.

UI
Use the existing Expodia visual language and preserve working screens.
Management UI should be professional, dense enough for operations, mobile-capable and readable.
Do not expose internal AI worker identities, prompts, routing, chain-of-thought, hidden agents or implementation hierarchy.

FAILURE-SAFE IMPLEMENTATION
Before modifying anything:
- inspect current branch and migrations;
- inspect current authentication;
- inspect existing RLS;
- inspect current /access flow;
- inspect current agent/traveler tables;
- inspect existing admin/role structures;
- identify conflicts and duplicate migrations.

Do not overwrite working files unnecessarily.
Make small isolated commits.
Run type checks/build checks where available.
If one new management component fails, it must not break public traveler access, agent access, flight search, flight tracking, documents, bookings or other existing functionality.

GITHUB WORKFLOW
Work from the current Expodia repository and preserve main.
Create an isolated management branch.
Open a PR rather than merging automatically.
Do not deploy to Netlify.
Do not claim success unless the relevant code/database change has actually been completed and verified.

FINAL ACCEPTANCE TEST
Verify:
1. Public user can access public pages.
2. Traveler signs in and reaches traveler workspace.
3. Agent signs in and reaches agent workspace.
4. Company Admin signs in and reaches /admin.
5. Non-admin cannot access /admin even by manually entering the URL.
6. Admin can issue a six-digit referral.
7. Admin can revoke it.
8. Expired/revoked/used code cannot be redeemed.
9. Intended-email mismatch cannot redeem it.
10. Failed signup does not unnecessarily consume an invitation.
11. Successful professional signup creates the correct professional account.
12. Traveler cannot self-promote to agent/admin.
13. Admin actions are audited.
14. Existing Expodia functionality remains intact.
15. No fake/demo operational data is introduced.
16. No secrets are committed to GitHub.
