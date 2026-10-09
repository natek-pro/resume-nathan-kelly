# Applied AI Engineering

This copy targets applied AI engineer, AI integration engineer, and backend engineering roles focused on LLM-enabled products and features. It emphasizes application architecture, personalization, conversational evaluation, pragmatic launch decisions, hands-on implementation, and reliable integration with production systems. Selected data-quality and applied-ML work adds evidence beyond the LLM application itself.

> Grouped contribution draft for review. Bullets retain the master source’s wording and bolding. IDs, selection notes, trimming priorities, and reserve bullets are planning material. The complete career timeline and final page layout are pending.

Source: `../resume_source.md` · Previous selection: `../resume-subsets/applied-ai-engineering.md`

Source SHA-256: `9199f58526e75d07ec696c144bea6872c3afa5f2f0de3d8ee06dbfdefa426903`

**8 primary bullets in 3 contribution groups; 2 reserve bullets.** Eight is a starting selection, not a verified page-capacity limit. IDs are positional; verify source hash and text after source edits.

Selection rationale: The primary set uses the agreed eight-bullet grouping. Older RadiusAI work supplies measured recognition improvement; the ASU tool remains available in reserve.

## Primary contributions

Attribution carries across consecutive groups until a new employer/role or project line appears. Exact titles and dates will remain in the career timeline.

### Building an LLM Companion & Clinical Assessment

*The Pause Technologies, Inc. · Founding Engineer & Data Scientist*

Bullet IDs, in order: `TPT-FEDS-02` · `TPT-FEDS-03` · `TPT-FEDS-05` · `TPT-FEDS-00`

- Architected the product’s **core LLM companion** across the mobile application, AWS-hosted Django backend, and Azure AI services. Connected model deployment through Azure AI Studio with conversation history and recall in Azure Cosmos DB and application data for personalized interactions, designing the system to support changing the underlying model.

- Designed the LLM companion’s **personalization system** to build health profiles through ongoing product engagement, transform health and activity data into contextual observations for model prompts, and let users control which information the companion could use.

- Evaluated and refined the companion’s instructions and context injection through repeated test conversations, checking for regressions across interactions. Used focus groups and stakeholder feedback to guide its conversational behavior and capabilities.

- Developed a guided menopause-stage assessment as an alternative to user self-identification, securing medical advisory board approval for an approach based on published clinical criteria. Personally implemented the **classifier in Python/Django** using rules and a light statistical model for edge cases.

### Launching & Stabilizing the Product

Bullet IDs, in order: `TPT-FEDS-04` · `TPT-FEDS-06`

- Chose an existing web-app template embedded in a mobile webview to launch the LLM companion quickly and test **product-market fit** with limited upfront investment. The companion later moved to direct Flutter integration while retaining its Azure backend services.

- Led the technical takeover and stabilization of an inherited live production system with minimal handoff, assuming responsibility for production access and CI/CD infrastructure. Remediated security vulnerabilities, resolved API access and authentication problems, reviewed AWS access, rotated exposed credentials, and hardened unstable code while maintaining **zero user-facing downtime** during the handoffs.

### Improving Retail Recognition

*RadiusAI · Data Scientist*

Bullet IDs, in order: `RAI-DS-04` · `RAI-DS-05`

- Traced recognition failures in field deployment to annotation errors and inconsistent retailer catalog data. Designed a **ground-truth product index** covering more than 3,000 products, reconciling changing UPCs, SKUs, and descriptions while supporting integration with other retailers’ catalog structures and POS systems.

- Improved recognition by **approximately 10 F-score points** by correcting errors affecting more than 33% of SKUs, enabling pilot expansion. Integrated the product index with annotation workflows and redesigned data models and training-data tracking.

## Reserve bullets

These are alternatives to the primary set, retained for tailoring rather than included by default.

*The Pause Technologies, Inc. · Head of Product & Technology*

Bullet IDs, in order: `TPT-HPT-05`

- Owned technical direction across Flutter, Python/Django, Amazon Web Services (AWS), and Firebase, including serverless services, mobile notifications, and Apple Health integration.

Reserve rationale: Use for roles emphasizing broader mobile/backend/cloud ownership; it adds stack coverage rather than a new accomplishment.

*Arizona State University · Applied Research and Summer Internship · Salt River Project*

Bullet IDs, in order: `ASU-ARSI-03`

- Implemented **diagnostic models in PyTorch** and built an application that let power-plant engineers without machine-learning or computer-science backgrounds process datasets and train multiple model types.

Reserve rationale: Use for applied-ML tooling or domain-user enablement roles. This older implementation evidence can replace a less relevant primary bullet.

## Trimming priorities

First consider TPT-FEDS-04 (webview launch), then TPT-FEDS-00 (assessment classifier), when the target prioritizes LLM architecture and evaluation. If a whole group must go, remove Improving Retail Recognition before the central companion work; remove RAI-DS-04 and RAI-DS-05 together. Keep the zero-downtime takeover as production evidence where relevant.
