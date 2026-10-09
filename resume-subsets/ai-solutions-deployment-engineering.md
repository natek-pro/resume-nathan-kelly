# AI Solutions & Deployment Engineering

This copy targets forward-deployed engineer, AI deployment engineer, implementation-focused solutions engineer, and solutions architect roles. It emphasizes translating stakeholder needs and domain constraints into working systems, explaining technical tradeoffs, integrating unfamiliar systems, and carrying work through deployment and stabilization. Customer-facing RadiusAI work and tools built for domain experts complement the Pause product and cloud architecture experience.

> Bullet-selection draft for review, not a complete resume. Bullet wording and bolding are copied verbatim from the master source; groups are ordered for this career direction. Role descriptions, patent, education, skills, and the final timeline will be considered separately.

Source: `../resume_source.md`

Source SHA-256: `9199f58526e75d07ec696c144bea6872c3afa5f2f0de3d8ee06dbfdefa426903`

10 selected bullets. Catalog IDs are positional; verify the source hash and text before reusing a selection after source edits.

### RadiusAI — Tempe, AZ

#### Data Scientist — June 2021–March 2024

Selected IDs, in bullet order: `RAI-DS-09` · `RAI-DS-07` · `RAI-DS-04` · `RAI-DS-05`

- Served as a primary technical demonstrator for customers and investors, explaining system behavior and deployment constraints. Used technical constraints, customer input, and field feedback to shape product requirements, data models, recognition classes, and hardware configuration.

- Reverse-engineered undocumented retailer POS records into structured checkout events and built a **sequence-alignment algorithm** to associate them with noisy, asynchronous customer tracks independently captured by the computer-vision system. Tuned the matching cost to handle transient tracks and spurious POS events while allowing unmatched tracks and multiple plausible transaction candidates.

- Traced recognition failures in field deployment to annotation errors and inconsistent retailer catalog data. Designed a **ground-truth product index** covering more than 3,000 products, reconciling changing UPCs, SKUs, and descriptions while supporting integration with other retailers’ catalog structures and POS systems.

- Improved recognition by **approximately 10 F-score points** by correcting errors affecting more than 33% of SKUs, enabling pilot expansion. Integrated the product index with annotation workflows and redesigned data models and training-data tracking.

### The Pause Technologies, Inc. — Scottsdale, AZ

#### Founding Engineer & Data Scientist — April 2024–January 2025

Selected IDs, in bullet order: `TPT-FEDS-02` · `TPT-FEDS-04` · `TPT-FEDS-06`

- Architected the product’s **core LLM companion** across the mobile application, AWS-hosted Django backend, and Azure AI services. Connected model deployment through Azure AI Studio with conversation history and recall in Azure Cosmos DB and application data for personalized interactions, designing the system to support changing the underlying model.

- Chose an existing web-app template embedded in a mobile webview to launch the LLM companion quickly and test **product-market fit** with limited upfront investment. The companion later moved to direct Flutter integration while retaining its Azure backend services.

- Led the technical takeover and stabilization of an inherited live production system with minimal handoff, assuming responsibility for production access and CI/CD infrastructure. Remediated security vulnerabilities, resolved API access and authentication problems, reviewed AWS access, rotated exposed credentials, and hardened unstable code while maintaining **zero user-facing downtime** during the handoffs.

### The Pause Technologies, Inc. — Scottsdale, AZ

#### Head of Product & Technology — January 2025–April 2026

Selected IDs, in bullet order: `TPT-HPT-04` · `TPT-HPT-07`

- Partnered with the medical advisory board to turn clinical requirements into product decisions. Developed a board-approved concept for a clinician-facing platform that would exchange data with the consumer app through its chat companion.

- Designed the target Azure architecture and a phased AWS-to-Azure cloud migration plan covering deployment alongside live services and retirement of existing components.

### Arizona State University — Tempe, AZ

#### Applied Research and Summer Internship — August 2019–August 2020

*Salt River Project*

Selected IDs, in bullet order: `ASU-ARSI-03`

- Implemented **diagnostic models in PyTorch** and built an application that let power-plant engineers without machine-learning or computer-science backgrounds process datasets and train multiple model types.
