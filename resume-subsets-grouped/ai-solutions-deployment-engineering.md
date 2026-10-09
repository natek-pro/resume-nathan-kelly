# AI Solutions & Deployment Engineering

This copy targets forward-deployed engineer, AI deployment engineer, implementation-focused solutions engineer, and solutions architect roles. It emphasizes translating stakeholder needs and domain constraints into working systems, explaining technical tradeoffs, integrating unfamiliar systems, and carrying work through deployment and stabilization. Customer-facing RadiusAI work and tools built for domain experts complement the Pause product and cloud architecture experience.

> Grouped contribution draft for review. Bullets retain the master source’s wording and bolding. IDs, selection notes, trimming priorities, and reserve bullets are planning material. The complete career timeline and final page layout are pending.

Source: `../resume_source.md` · Previous selection: `../resume-subsets/ai-solutions-deployment-engineering.md`

Source SHA-256: `9199f58526e75d07ec696c144bea6872c3afa5f2f0de3d8ee06dbfdefa426903`

**8 primary bullets in 2 contribution groups; 2 reserve bullets.** Eight is a starting selection, not a verified page-capacity limit. IDs are positional; verify source hash and text after source edits.

Selection rationale: The default leads with AI architecture and live-system stabilization. Each group stays within one employer; the Pause group explicitly distinguishes the two source roles. For vision or edge deployment, move the retail group first. The clinical concept retains its original unshipped-concept wording.

## Primary contributions

Attribution carries across consecutive groups until a new employer/role or project line appears. Exact titles and dates will remain in the career timeline.

### Designing LLM Integrations & Stabilizing Production

*The Pause Technologies, Inc. · Founding Engineer & Data Scientist*

Bullet IDs, in order: `TPT-FEDS-02` · `TPT-FEDS-04` · `TPT-FEDS-06`

- Architected the product’s **core LLM companion** across the mobile application, AWS-hosted Django backend, and Azure AI services. Connected model deployment through Azure AI Studio with conversation history and recall in Azure Cosmos DB and application data for personalized interactions, designing the system to support changing the underlying model.

- Chose an existing web-app template embedded in a mobile webview to launch the LLM companion quickly and test **product-market fit** with limited upfront investment. The companion later moved to direct Flutter integration while retaining its Azure backend services.

- Led the technical takeover and stabilization of an inherited live production system with minimal handoff, assuming responsibility for production access and CI/CD infrastructure. Remediated security vulnerabilities, resolved API access and authentication problems, reviewed AWS access, rotated exposed credentials, and hardened unstable code while maintaining **zero user-facing downtime** during the handoffs.

*The Pause Technologies, Inc. · Head of Product & Technology*

Bullet IDs, in order: `TPT-HPT-04`

- Partnered with the medical advisory board to turn clinical requirements into product decisions. Developed a board-approved concept for a clinician-facing platform that would exchange data with the consumer app through its chat companion.

### Integrating Retail Systems & Improving Recognition

*RadiusAI · Data Scientist*

Bullet IDs, in order: `RAI-DS-09` · `RAI-DS-07` · `RAI-DS-04` · `RAI-DS-05`

- Served as a primary technical demonstrator for customers and investors, explaining system behavior and deployment constraints. Used technical constraints, customer input, and field feedback to shape product requirements, data models, recognition classes, and hardware configuration.

- Reverse-engineered undocumented retailer POS records into structured checkout events and built a **sequence-alignment algorithm** to associate them with noisy, asynchronous customer tracks independently captured by the computer-vision system. Tuned the matching cost to handle transient tracks and spurious POS events while allowing unmatched tracks and multiple plausible transaction candidates.

- Traced recognition failures in field deployment to annotation errors and inconsistent retailer catalog data. Designed a **ground-truth product index** covering more than 3,000 products, reconciling changing UPCs, SKUs, and descriptions while supporting integration with other retailers’ catalog structures and POS systems.

- Improved recognition by **approximately 10 F-score points** by correcting errors affecting more than 33% of SKUs, enabling pilot expansion. Integrated the product index with annotation workflows and redesigned data models and training-data tracking.

## Reserve bullets

These are alternatives to the primary set, retained for tailoring rather than included by default.

*The Pause Technologies, Inc. · Head of Product & Technology*

Bullet IDs, in order: `TPT-HPT-07`

- Designed the target Azure architecture and a phased AWS-to-Azure cloud migration plan covering deployment alongside live services and retirement of existing components.

Reserve rationale: Use instead of TPT-HPT-04 for cloud/solutions-architecture roles. This describes a migration plan, not a completed migration.

*Arizona State University · Applied Research and Summer Internship · Salt River Project*

Bullet IDs, in order: `ASU-ARSI-03`

- Implemented **diagnostic models in PyTorch** and built an application that let power-plant engineers without machine-learning or computer-science backgrounds process datasets and train multiple model types.

Reserve rationale: Use for solutions involving tools for nontechnical domain experts; swap it in only when that evidence justifies another attribution line.

## Trimming priorities

First consider TPT-HPT-04 (clinician-platform concept), then TPT-FEDS-04 (webview launch), before cutting delivered integrations or production stabilization. Keep RAI-DS-04 with RAI-DS-05 while the latter refers to the product index. Retain both core groups where possible; for a narrowly AI-only application, the retail group is the first whole group to reconsider.
