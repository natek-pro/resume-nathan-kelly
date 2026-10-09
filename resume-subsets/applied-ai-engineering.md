# Applied AI Engineering

This copy targets applied AI engineer, AI integration engineer, and backend engineering roles focused on LLM-enabled products and features. It emphasizes application architecture, personalization, conversational evaluation, pragmatic launch decisions, hands-on implementation, and reliable integration with production systems. Selected data-quality and applied-ML work adds evidence beyond the LLM application itself.

> Bullet-selection draft for review, not a complete resume. Bullet wording and bolding are copied verbatim from the master source; groups are ordered for this career direction. Role descriptions, patent, education, skills, and the final timeline will be considered separately.

Source: `../resume_source.md`

Source SHA-256: `9199f58526e75d07ec696c144bea6872c3afa5f2f0de3d8ee06dbfdefa426903`

10 selected bullets. Catalog IDs are positional; verify the source hash and text before reusing a selection after source edits.

### The Pause Technologies, Inc. — Scottsdale, AZ

#### Founding Engineer & Data Scientist — April 2024–January 2025

Selected IDs, in bullet order: `TPT-FEDS-02` · `TPT-FEDS-03` · `TPT-FEDS-05` · `TPT-FEDS-00` · `TPT-FEDS-04` · `TPT-FEDS-06`

- Architected the product’s **core LLM companion** across the mobile application, AWS-hosted Django backend, and Azure AI services. Connected model deployment through Azure AI Studio with conversation history and recall in Azure Cosmos DB and application data for personalized interactions, designing the system to support changing the underlying model.

- Designed the LLM companion’s **personalization system** to build health profiles through ongoing product engagement, transform health and activity data into contextual observations for model prompts, and let users control which information the companion could use.

- Evaluated and refined the companion’s instructions and context injection through repeated test conversations, checking for regressions across interactions. Used focus groups and stakeholder feedback to guide its conversational behavior and capabilities.

- Developed a guided menopause-stage assessment as an alternative to user self-identification, securing medical advisory board approval for an approach based on published clinical criteria. Personally implemented the **classifier in Python/Django** using rules and a light statistical model for edge cases.

- Chose an existing web-app template embedded in a mobile webview to launch the LLM companion quickly and test **product-market fit** with limited upfront investment. The companion later moved to direct Flutter integration while retaining its Azure backend services.

- Led the technical takeover and stabilization of an inherited live production system with minimal handoff, assuming responsibility for production access and CI/CD infrastructure. Remediated security vulnerabilities, resolved API access and authentication problems, reviewed AWS access, rotated exposed credentials, and hardened unstable code while maintaining **zero user-facing downtime** during the handoffs.

### The Pause Technologies, Inc. — Scottsdale, AZ

#### Head of Product & Technology — January 2025–April 2026

Selected IDs, in bullet order: `TPT-HPT-05`

- Owned technical direction across Flutter, Python/Django, Amazon Web Services (AWS), and Firebase, including serverless services, mobile notifications, and Apple Health integration.

### RadiusAI — Tempe, AZ

#### Data Scientist — June 2021–March 2024

Selected IDs, in bullet order: `RAI-DS-04` · `RAI-DS-05`

- Traced recognition failures in field deployment to annotation errors and inconsistent retailer catalog data. Designed a **ground-truth product index** covering more than 3,000 products, reconciling changing UPCs, SKUs, and descriptions while supporting integration with other retailers’ catalog structures and POS systems.

- Improved recognition by **approximately 10 F-score points** by correcting errors affecting more than 33% of SKUs, enabling pilot expansion. Integrated the product index with annotation workflows and redesigned data models and training-data tracking.

### Arizona State University — Tempe, AZ

#### Applied Research and Summer Internship — August 2019–August 2020

*Salt River Project*

Selected IDs, in bullet order: `ASU-ARSI-03`

- Implemented **diagnostic models in PyTorch** and built an application that let power-plant engineers without machine-learning or computer-science backgrounds process datasets and train multiple model types.
