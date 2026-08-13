# Farm Hand Hub

GO FARM WORK” – Advanced Freelancer Marketplace for Farmers

You are an expert full‑stack product engineer, UX designer, and AI integrator. Your task is to create a new, production‑ready web application called GO FARM WORK: a professional freelancer marketplace exclusively for farmers, farm owners, and farm labour.

This must be built as a new project (not tied to any existing repo). Use a modern, scalable stack (e.g., React + TypeScript + Node/Express or Next.js, PostgreSQL, Prisma/ORM, Tailwind CSS). Design the architecture so it can grow into a real startup product used across Indian villages.

The platform must feel like a serious, advanced freelancer marketplace (like Upwork/Fiverr for farm work) but be extremely simple, icon‑driven, voice‑first, multilingual, and WhatsApp‑friendly, because many users are not highly educated.

1. Product Vision

Build GO FARM WORK as a farmer‑only freelance labour marketplace where:

Landlords / farm owners post farm work (sowing, harvesting, spraying, etc.) and hire workers or crews.

Workers / farmhands browse jobs, apply, get hired, track attendance, and get paid securely.

The experience feels like a professional freelancer platform (escrow, milestones, contracts, ratings, messaging, wallets, analytics), but is extremely simple, icon‑driven, voice‑first, and multilingual, because many users are not highly educated.

Design everything with a low‑literacy‑first mindset.

2. Core Principles (Non‑Negotiable)

Low‑literacy first

Minimize text; maximize icons, photos, and large tap targets.

Use numbers and visuals over paragraphs.

Support voice input and voice output everywhere possible.

Multilingual & local

Support at least: Hindi, Marathi, Tamil, Telugu, Kannada, Punjabi, Bengali, and English.

Language selected once at onboarding, remembered per user.

All key flows (job post, apply, chat, escrow, wallet, contracts) must work in all supported languages.

Voice‑first & WhatsApp‑friendly

Mic button bigger/more prominent than keyboard in key flows.

Allow users to:

Speak to search jobs / workers.

Speak their job post.

Speak their application/proposal.

Get job details and payment confirmations read aloud.

Design flows so they can be mirrored over WhatsApp (OTP, alerts, apply/hire confirmations, receipts, reminders).

Mobile‑first, low‑end device friendly

Optimized for cheap Android phones, 2G/3G networks.

Offline‑tolerant: cached job lists, queued actions that sync when online.

No heavy animations; keep bundle size reasonable.

Trust & safety

KYC/ID verification badges for workers and landlords.

Photo verification of farms and workers.

Clear, simple explanations of escrow, milestones, and dispute resolution in local language + voice.

3. Feature Set to Implement

Build the following features from scratch in this new project.

3.1 Authentication & Onboarding

Phone + OTP login only (no passwords, no email required).

Optional: WhatsApp OTP as an alternative to SMS OTP.

Role selection: Worker or Landlord/Farm Owner (can allow both later).

Simple onboarding:

Name, phone, district/village, primary language, role.

Optional: photo upload, Aadhaar/KYC upload (for verified badge).

Store language preference and use it across the app.

Voice‑guided onboarding:

First‑time users can choose a voice tutorial that explains:

How to find work / workers.

How money and escrow work.

How to use the mic button.

Available as a replayable “Help & Tutorials” section.

Auto‑language detection:

Detect spoken language automatically during onboarding and set it as the app language.

Allow switching language with one tap at any time.

3.2 Dashboard (Role‑Specific)

Worker Dashboard:

Big cards:

“Find Work Near Me”

“My Earnings”

“My Jobs”

“Messages”

“Farmhand AI Assistant”

Quick stats: today’s jobs nearby, total earnings this month, rating.

One‑tap access to:

Browse jobs

Saved jobs

Past jobs & receipts

Optional village hub summary:

“Work happening in your village”

“Workers from your village”

Landlord Dashboard:

Big cards:

“Post New Work”

“Browse Workers”

“My Jobs”

“Messages”

“Farmhand AI Assistant”

Quick stats: active jobs, total spent this season, favourite crews.

Optional bulk operations entry point (for large landlords / FPOs).

Both dashboards must support read‑aloud for all key cards and buttons.

3.3 Job Marketplace (Freelancer Core)

Job Posting (Landlord)

Fields (voice‑fillable and form):

Job title (e.g., “Paddy transplanting”, “Sugarcane cutting”)

Crop type (icon + text)

Acreage / area

Crew size (men/women; clearly no child labour)

Required skills (e.g., “tractor operator”, “spraying experience”)

Dates (start, end, or “one‑day job”)

Wage: per day / per acre / fixed; show large ₹ amount

Extras: food provided? stay provided? transport provided? tools provided?

Location (auto from GPS, editable)

Urgency: “Need today”, “Need within 3 days”, etc.

AI‑assisted job post:

Landlord speaks: “I need 5 people for paddy transplanting next Monday near Erode, paying 500 per day, food included.”

System auto‑fills the form and shows a preview.

Escrow funding:

Before publishing, landlord must fund the job (or at least a minimum deposit).

Show “Money locked safely” badge once escrowed.

Job Browsing & Search (Worker)

Default view: Jobs near me sorted by distance and date.

Filters as one‑tap chips, not dropdowns:

Near me (5/10/20 km)

Today / This week

High pay

Women‑friendly

Crop type icons

Map view with pins for jobs (simple, not cluttered).

Each job card shows:

Large ₹ amount

Distance (e.g., “4 km away”)

Date(s)

Crop icon

“Food provided” / “Transport provided” icons

“Listen” button to hear job details in local language.

One‑tap “Apply” with optional voice note or short text.

Option to counter‑offer wage.

Applications & Hiring

Worker can:

Apply with a simple profile summary (auto‑generated from their data).

Record a short voice intro.

Propose a different wage.

Landlord sees:

List of applicants with: name, distance, rating, past jobs, skills, voice intro.

One‑tap “Hire” or “Chat”.

Once hired:

Contract created with milestones (see section 3.6).

Both parties get WhatsApp + in‑app notifications.

Talent Directory (Landlord)

Browse/search workers by:

Skill (icon‑based)

Crop experience

Distance

Rating

Landlord can:

Directly invite a worker or crew.

Save favourite workers/crews.

Rehire last season’s crew in one tap.

Crew / Group Hiring

Allow a crew leader (mukadam) to register a team:

Team name, size, typical roles, equipment owned.

Landlord can hire the whole crew as one unit.

Attendance and payment can be per crew or per member (configurable).

Hyperlocal & Community Features

Village / Panchayat hubs:

Group users by village/panchayat.

Show “Work happening in your village” and “Workers from your village”.

Allow local leaders or trusted mukadams to be marked as “Community Verified”.

Local notice board:

A simple feed per village/district:

Govt scheme announcements

Weather alerts

Local market rates for crops

Bulk hiring drives (e.g., “Need 50 workers for 3 days in X village”)

Posts can be text + image + voice; read aloud automatically.

Group bargaining / collective hiring:

Workers in a village can form a “labour group”.

Landlords can post: “Need 30 workers for 5 days” and the group can accept as a block.

Group leader can negotiate wage on behalf of all.

3.4 Profiles & Reputation

Worker Profile

Photo, name, village/district, languages.

Skills (with icons): harvesting, sowing, spraying, tractor, etc.

Equipment owned (tractor, sprayer, etc.).

Experience: years, main crops.

Typical day rate.

Ratings & reviews from landlords.

Jobs completed count.

Verified badge (KYC, photo verification).

Earnings passbook: monthly income summary (useful for informal loans).

Badges & levels:

“10 jobs completed”, “No‑show free for 6 months”, “Top rated worker in your block”.

Simple level system: Bronze → Silver → Gold.

Micro‑learning & certifications:

1–3 minute voice + image lessons:

“Safe pesticide handling”

“Better transplanting techniques”

“How to use a sprayer”

Completion badges shown on profile.

Trust Score:

A simple 1–5 star or 0–100 score based on completed jobs, on‑time arrival, disputes, repayments of advances.

Landlord Profile

Farm name, location, main crops, typical seasonal labour needs.

Ratings & reviews from workers.

Verification badge (land ownership / ID).

Optional analytics preview:

Cost per acre

Labour spend by season

Best‑performing crews

Both profiles must be simple, icon‑heavy, and readable aloud.

3.5 Discovery, Matching & Seasonality

Distance‑first search:

“Work within X km of me” as default.

Smart matching:

Rank jobs/workers by skills, crop experience, distance, past hires, ratings.

Season & crop calendar:

Show alerts like: “Sowing season starting in your district; 40 jobs opening.”

Urgent‑today jobs:

Highlight jobs that need workers today or tomorrow.

Saved jobs & workers:

One‑tap rehire of last season’s crew or favourite jobs.

Local wage heatmaps:

Show typical wages for common tasks by district/crop:

“Paddy harvesting: ₹450–₹550/day in your block.”

Visualized as simple bars or color bands, not complex charts.

Used by Farmhand AI to suggest fair wages.

Crop price & mandi links:

Integrate or link to local mandi prices for major crops.

Show in the notice board or a dedicated “Market Rates” screen:

Today’s price for paddy, sugarcane, cotton, etc. in nearby mandis.

Voice summaries: “Today, paddy is ₹1,200 per quintal in Erode market.”

Seasonal income planner:

For workers:

Simple view: “Expected busy months” vs “lean months” based on local crop calendar.

Tips: “Consider saving ₹X per week during harvest for lean season.”

For landlords:

“Expected labour demand” by month.

Suggestions: “Lock in 10 workers for next season now.”

3.6 Contracts, Escrow & Milestones

Every hired job becomes a contract with:

Job details

Agreed wage

Start/end dates

Milestones (e.g., Day 1–3, Day 4–6, or by task).

Escrow:

Landlord funds the job before work starts.

Money shown as “locked” in both dashboards.

Platform fee shown transparently: e.g., “Worker gets ₹480, platform ₹20”.

Milestone releases:

After each milestone, landlord approves → funds released to worker’s wallet.

Worker can request release; landlord has X days to approve/dispute.

Dispute flow:

Either party can raise a dispute.

Escrow freezes.

Simple form + optional voice note explaining issue.

Admin/mediator reviews and decides.

Attendance & work log:

Daily check‑in/check‑out with:

Photo

GPS location

Timestamp

Auto‑matched to payment days.

Photo‑based work verification:

For milestone completion, require:

Before/after photos of the field.

Optional short voice note: “This is the harvested area.”

Simple task checklists:

For each job/milestone, show a 3–5 item checklist in icons + text:

“Field ploughed”

“Seeds sown”

“Water channels cleared”

Worker/landlord can tick items; used for milestone approval.

Productivity estimates:

Based on historical data, show:

“Typically, 1 acre of paddy transplanting takes 5 workers × 2 days in this area.”

Advance / partial payment option for daily‑wage workers who can’t wait till the end.

Micro‑advances against future work:

Workers with good ratings and history can request small advances:

“Get ₹500 now, deducted from your next job payment.”

Risk scored using:

Completed jobs

No‑show rate

Ratings

Clear, voice‑explained terms: when it will be deducted, any fee.

3.7 Wallet, Payments & Financial Tools

In‑app wallet for each user:

Available balance

In‑escrow balance

Lifetime earned/spent

Withdrawal via:

UPI

Bank transfer

Transaction history with simple labels and icons.

Downloadable payment receipts (PDF + image for WhatsApp).

Clear, spoken explanations of:

How to withdraw

When money is released

What happens in disputes.

Savings pots / goal wallets:

Workers can create simple goals:

“School fees”, “Medical”, “Equipment”.

Auto‑round‑up or manual top‑up from earnings.

Visual progress bars with icons.

Insurance & accident cover add‑ons:

Optional, low‑cost daily/weekly insurance:

Accidental injury cover for physically risky work.

Shown as a simple checkbox when accepting a job: “Add ₹5 cover for this job”.

Clear, voice‑explained benefits and claim process.

3.8 Messaging & Communication

In‑app chat per job/contract:

Text + voice notes (critical).

Auto‑translate messages between different languages.

Call button that masks real phone numbers.

Notifications:

In‑app + push + SMS/WhatsApp fallback.

Local language + optional voice summary.

WhatsApp integration:

Job alerts on WhatsApp with photo, wage, distance, and a one‑tap “Apply” link.

Worker can reply “1” to apply; landlord can reply “YES” to hire.

Payment & escrow receipts delivered as WhatsApp messages.

Attendance reminders: daily “mark your check‑in” nudge with a link.

Crew broadcast: mukadam can send one WhatsApp message to their whole team.

Click‑to‑chat: every job card has a “Chat on WhatsApp” button to the landlord.

3.9 Farmhand AI Assistant (Chatbot)

Integrate and fully develop the Farmhand AI chatbot as a core feature:

Accessible from:

A dedicated “Assistant” page

A floating button on key pages

WhatsApp (same assistant logic).

Capabilities:

Conversational job search / worker search:

Worker: “I need work near Erode next week, I know paddy and sugarcane.”

Landlord: “I need 5 people for paddy transplanting next Monday near Erode, paying 500 per day, food included.”

Job post writer:

From a spoken sentence, generate a complete, professional job post with all fields filled.

Application writer:

Turn “I’ve cut sugarcane for 6 years, I have my own sickle” into a proper proposal.

Explain the app:

“How do I get my money?”

“Why is my payment locked?”

“What is a milestone?”

Fair wage advice:

Suggest going rate for that work in that district and season, using local wage heatmaps.

Farming guidance:

Crop, pest, fertilizer advice (optionally with photo diagnosis).

Weather and sowing/harvest window alerts.

Government scheme pointers (PM‑KISAN, MGNREGA, etc.).

Multilingual & voice:

Accept text or voice in any supported language.

Reply in the same language, with optional voice output.

Context‑aware:

Remember past conversations per user.

Know the user’s role, location, and past jobs to give relevant suggestions.

Income & planning advice:

Simple tips based on seasonal income planner:

“You usually earn more during harvest; consider saving ₹X per week.”

Implement this as /assistant and /api/chat routes, integrated with your backend and database.

3.10 Safety, Women & Vulnerable Worker Support

Women‑only / women‑friendly job tags:

Landlords can mark jobs as:

“Women‑only crew”

“Women‑friendly (safe transport, daytime work)”

Workers can filter specifically for these.

Safety checklist & SOS:

Before accepting a job, show a simple safety checklist:

Daytime work?

Group work?

Known landlord / repeat hire?

In‑app SOS button:

Sends location + job details to a trusted contact or local helpline via SMS/WhatsApp.

Anonymous reporting:

Workers can report:

Underpayment

Harassment

Unsafe conditions

Report can be voice + optional photo; identity hidden from the landlord.

Policy & rules center:

Simple, voice‑explained rules:

No child labour

No forced overtime

Minimum rest breaks

Users must acknowledge in onboarding; violations can lead to bans.

3.11 Equipment, Inputs & Side Marketplace

Equipment rental marketplace:

Tractors, sprayers, threshers, harvesters listed by owners.

Same escrow + milestone logic:

Book for X days

Deposit locked

Release after use confirmation.

Icons for each equipment type; voice descriptions.

Input & service referrals:

Trusted local providers for:

Seeds, fertilizers, pesticides

Soil testing, veterinary services

Simple listings with ratings; can be monetized later via referrals.

Tool & PPE kit suggestions:

For workers:

Recommended basic kit: sickle, gloves, boots, hat.

Option to buy via partner links or local shops.

For landlords:

Safety gear recommendations for workers.

3.12 Gamification, Referrals & Growth

Badges & levels:

Badges for:

“10 jobs completed”

“No‑show free for 6 months”

“Top rated worker in your block”

Simple level system: Bronze → Silver → Gold, shown on profile.

Referral programs (both sides):

Workers refer other workers:

Both get fee discount or small bonus after first completed job.

Landlords refer other landlords:

Discount on platform fees for first N jobs.

Challenges & drives:

Time‑bound campaigns:

“Harvest drive: complete 5 jobs this month, get a special badge.”

Promoted on the notice board and via WhatsApp.

3.13 Offline & Low‑Connectivity Enhancements

Offline job queue & sync:

Users can:

Browse cached jobs

Fill forms (apply, post job)

Record voice notes

Actions sync automatically when network returns, with clear status: “Will send when online”.

SMS fallback for critical actions:

If data is unavailable:

OTP via SMS

Job alerts via SMS

Payment confirmations via SMS

Keep content minimal and in local language.

Offline mode:

Cached job lists, profile summaries, and recent chats.

Clear UI indicators when offline.

3.14 Admin, Ops & Fraud Prevention

Admin console:

Verification queue (KYC, land docs).

Dispute desk.

Wage‑fraud detection (e.g., abnormally low wages, repeated disputes).

Payout management.

Fraud & anomaly detection:

Flag:

Abnormally low wages for a region/crop.

Repeated disputes from same user.

Suspicious attendance patterns (same time, far locations).

Admin dashboard to review and act.

Bulk operations for large landlords:

Upload multiple jobs via:

Simple CSV/Sheet (for NGOs, FPOs, big farms).

Or via WhatsApp conversation with the bot.

View analytics across all jobs/crews.

Analytics for NGOs & govt pilots:

Aggregated, anonymized dashboards:

Jobs created

Earnings distributed

Women participation

Exportable reports for partners.

Integration hooks (future‑proofing):

Placeholders for:

Aadhaar e‑KYC flow

Linking to PM‑KISAN, MGNREGA job cards (read‑only, with consent).

FPO / cooperative mode:

Farmer Producer Organizations can:

Post bulk jobs

Manage multiple landlords/workers under one umbrella.

Simple sub‑accounts or roles.

4. UX & UI Guidelines

Big, thumb‑friendly controls:

Primary actions (Apply, Post Job, Chat, Pay) must be large, high‑contrast buttons.

Icon + photo driven navigation:

Crop/tool pictures instead of text‑only menus.

Use consistent icons for: harvesting, sowing, spraying, tractor, irrigation, etc.

Minimal text per screen:

3–5 key elements per screen; avoid dense tables.

Read‑aloud everywhere:

Each job card, contract summary, wallet screen, and notification should have a “listen” button.

Numbers over text:

Show ₹500/day as a large amount with a coin icon.

Dates as calendar pictures with highlighted days.

Progressive disclosure:

Advanced options (e.g., detailed contract terms) hidden behind “More details” with voice explanation.

Safety & clarity:

Clear, simple language for money, escrow, and disputes.

No financial jargon without a voice explanation.

5. Technical Requirements

Build this as a new project from scratch.

Suggested stack (adjust as needed for your environment):

Frontend: React + TypeScript + Tailwind CSS (mobile‑first, PWA‑ready)

Backend: Node.js + Express or Next.js API routes

Database: PostgreSQL (or similar relational DB) with Prisma/ORM

Auth: Phone + OTP (via SMS/WhatsApp gateway)

File storage: For photos, KYC docs, voice notes

AI: Integration with an LLM provider for Farmhand AI

Payments: UPI / payment gateway integration (mockable for demo)

Notifications: Push + SMS + WhatsApp webhooks

Implement:

Clean folder structure (frontend, backend, shared types, DB schema)

Environment variables for:

Database URL

AI provider keys

WhatsApp/SMS gateway keys

Payment gateway keys

Seed data and sample flows for demo purposes.

6. Deliverables

Produce a complete, runnable application with:

A fully working MVP including:

Auth (phone/OTP, optional WhatsApp OTP)

Role‑based dashboards

Job posting, browsing, applications, hiring

Contracts, escrow, milestones, wallet

Messaging (text + voice notes)

Farmhand AI assistant (chat + job/application generation + advice + planning tips)

Equipment rental marketplace (basic)

Savings pots, micro‑advances, insurance add‑on (basic flows)

Safety features (women‑friendly tags, SOS, anonymous reporting)

Notice board, market rates, seasonal planner (basic)

Badges, levels, referrals (basic)

Basic admin screens (verification, disputes, payouts)

Clean, typed, and documented code.

Seed data and sample flows for demo purposes.

README with:

How to run locally

How to configure env vars

Overview of key features and architecture.

Your priority is to make GO FARM WORK feel like a professional, advanced freelancer marketplace, but radically simple and accessible for farmers and farm labourers, built as a new, standalone product.

I need to add the database for long term use like for another 10 years, sending the Emails sms messages on WhatsApp, Payment gateway and All  Essential Backend system

This project was built with [Project](https://app.dev).

## Build with Project

Continue developing this project in the [Project editor](https://app.dev/projects/c17d3c25-cb15-45b6-990f-1082587b91a6).

- **Ship faster**: describe what you want to build and Project handles the code.
- **Stay in sync**: every change made in Project is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Project, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
