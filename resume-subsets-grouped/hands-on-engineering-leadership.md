# Hands-on Engineering Leadership

This copy targets hands-on engineering manager and small-team head of engineering roles, particularly teams building AI-enabled products. It emphasizes hiring and team building, delivery improvement, coordination, technical ownership, and production operations alongside direct implementation and AI architecture. The focus is a player-coach scope, with earlier lab leadership providing additional evidence of managing a technical team.

> Grouped contribution draft for review. Bullets retain the master source’s wording and bolding. IDs, selection notes, trimming priorities, and reserve bullets are planning material. The complete career timeline and final page layout are pending.

Source: `../resume_source.md` · Previous selection: `../resume-subsets/hands-on-engineering-leadership.md`

Source SHA-256: `9199f58526e75d07ec696c144bea6872c3afa5f2f0de3d8ee06dbfdefa426903`

**8 primary bullets in 3 contribution groups; 2 reserve bullets.** Eight is a starting selection, not a verified page-capacity limit. IDs are positional; verify source hash and text after source edits.

Selection rationale: TPT-HPT-06 replaces TPT-HPT-02 in the primary selection. The older RadiusAI lab-team bullet remains as earlier leadership evidence; this deliberately uses a second attribution within the team-building group. The production group combines two Pause roles without merging their titles.

## Primary contributions

Attribution carries across consecutive groups until a new employer/role or project line appears. Exact titles and dates will remain in the career timeline.

### Building Teams & Improving Delivery

*The Pause Technologies, Inc. · Head of Product & Technology*

Bullet IDs, in order: `TPT-HPT-00` · `TPT-HPT-01`

- Built and led the company’s **first in-house engineering team**, managing up to six people across engineering and design with engineers across three continents. Led hiring across four roles, serving as the main technical interviewer and setting technical hiring standards.

- Established the team’s delivery practices and led **18 versioned feature releases in under a year**, compared with roughly 1–2 releases per quarter under the previous external teams; the in-house team operated at a lower monthly cost.

*RadiusAI · Data Scientist*

Bullet IDs, in order: `RAI-DS-00`

- Designed and established a mock convenience-store lab to collect the system’s initial training dataset under representative retail conditions. Led lab operations and its five-person team.

### Building AI Features Hands-on

*The Pause Technologies, Inc. · Founding Engineer & Data Scientist*

Bullet IDs, in order: `TPT-FEDS-02` · `TPT-FEDS-00`

- Architected the product’s **core LLM companion** across the mobile application, AWS-hosted Django backend, and Azure AI services. Connected model deployment through Azure AI Studio with conversation history and recall in Azure Cosmos DB and application data for personalized interactions, designing the system to support changing the underlying model.

- Developed a guided menopause-stage assessment as an alternative to user self-identification, securing medical advisory board approval for an approach based on published clinical criteria. Personally implemented the **classifier in Python/Django** using rules and a light statistical model for edge cases.

### Stabilizing Production & Reducing Technical Debt

Bullet IDs, in order: `TPT-FEDS-06`

- Led the technical takeover and stabilization of an inherited live production system with minimal handoff, assuming responsibility for production access and CI/CD infrastructure. Remediated security vulnerabilities, resolved API access and authentication problems, reviewed AWS access, rotated exposed credentials, and hardened unstable code while maintaining **zero user-facing downtime** during the handoffs.

*The Pause Technologies, Inc. · Head of Product & Technology*

Bullet IDs, in order: `TPT-HPT-06` · `TPT-HPT-08`

- Led remediation of technical debt in the AWS/Django platform while continuing feature delivery, addressing unreliable infrastructure, poorly documented integrations, and business logic and data models that did not match product requirements.

- Built and repaired **CI/CD infrastructure** and owned production deployments, release operations, and monitoring. Investigated user reports, triaged issues in Sentry, and directed fixes.

## Reserve bullets

These are alternatives to the primary set, retained for tailoring rather than included by default.

*The Pause Technologies, Inc. · Head of Product & Technology*

Bullet IDs, in order: `TPT-HPT-02`

- Implemented a **cross-functional project-management workflow** across engineering, design, and marketing, linking tasks, release plans, and product documentation in Notion. Automated Slack reporting to give developers and executives visibility into progress, dependencies, and blockers.

Reserve rationale: Use when cross-functional coordination and workflow automation are central to the role. It moves out of the primary set in favor of TPT-HPT-06.

*The Pause Technologies, Inc. · Head of Product & Technology*

Bullet IDs, in order: `TPT-HPT-05`

- Owned technical direction across Flutter, Python/Django, Amazon Web Services (AWS), and Firebase, including serverless services, mobile notifications, and Apple Health integration.

Reserve rationale: Use when broader stack/platform ownership needs explicit coverage; the timeline and skills may carry this scope instead.

## Trimming priorities

First consider RAI-DS-00 if recent team-building evidence is sufficient, then TPT-HPT-08 if the production takeover already supplies enough operational detail. Keep both management and direct technical evidence. For a management-first role, Building AI Features Hands-on is the first whole group to shorten, but retain at least one direct contribution elsewhere before removing it.
