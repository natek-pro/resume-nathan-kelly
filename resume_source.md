# Nate Kelly

**Product & Engineering Leader | Applied AI & Machine Learning**

Phoenix, AZ  
[linkedin.com/in/natejkelly](https://www.linkedin.com/in/natejkelly/)

## Summary

Hands-on product and engineering leader with experience in applied machine learning, computer-vision systems, and large language model (LLM) application architecture. Led the initial build and launch of a consumer-health platform, then established its first in-house engineering team. Named inventor on a computer-vision assisted-checkout patent.

## Core Competencies

**Engineering Leadership:** Team Building & Technical Hiring · Engineer Development & Coaching · Engineering Delivery · Production Operations

**Applied AI & Technical Systems:** Deep Learning & Predictive Modeling · LLM Application Architecture · Computer Vision & Imaging Systems · Training-Data & Annotation Systems · Software & Cloud Architecture

**Product Strategy & Execution:** Product Strategy & Roadmapping · User Research & Product Iteration · Requirements Definition · Customer & Investor Communication

## Professional Experience

### The Pause Technologies, Inc. — Scottsdale, AZ

*Women’s health technology*

#### Head of Product & Technology — January 2025–April 2026

Served as the company’s sole product-and-technology leader, reporting to the CEO and owning product and technical roadmaps, architecture, team performance and development, delivery, and production operations. Served on the executive leadership team and presented roadmap, progress, and technical guidance to investors.

- Built and led the company’s **first in-house engineering team**, managing up to six people across engineering and design with engineers across three continents. Led hiring across four roles, serving as the main technical interviewer and setting technical hiring standards.
- Established the team’s delivery practices and led **18 versioned feature releases in under a year**, compared with roughly 1–2 releases per quarter under the previous external teams; the in-house team operated at a lower monthly cost.
- Implemented a **cross-functional project-management workflow** across engineering, design, and marketing, linking tasks, release plans, and product documentation in Notion. Automated Slack reporting to give developers and executives visibility into progress, dependencies, and blockers.
- Led **weekly user research** across the product and used findings to guide product and UX direction, including refinement of symptom tracking to reduce friction and encourage consistent engagement while collecting meaningful health data.
- Partnered with the medical advisory board to turn clinical requirements into product decisions. Developed a board-approved concept for a clinician-facing platform that would exchange data with the consumer app through its chat companion.
- Owned technical direction across Flutter, Python/Django, Amazon Web Services (AWS), and Firebase, including serverless services, mobile notifications, and Apple Health integration.
- Led remediation of technical debt in the AWS/Django platform while continuing feature delivery, addressing unreliable infrastructure, poorly documented integrations, and business logic and data models that did not match product requirements.
- Designed the target Azure architecture and a phased AWS-to-Azure cloud migration plan covering deployment alongside live services and retirement of existing components.
- Built and repaired **CI/CD infrastructure** and owned production deployments, release operations, and monitoring. Investigated user reports, triaged issues in Sentry, and directed fixes.
- Authored the company’s privacy policy and led App Store and Google Play review work, resolving a recurring release blocker by identifying and correcting a mismatch between privacy disclosures and backend behavior.

#### Founding Engineer & Data Scientist — April 2024–January 2025

As the company’s first technical hire, led the initial build of a women’s health platform with an overseas engineering team, launching a minimum marketable product within three months. Combined hands-on software development with clinical product design and applied-AI architecture.

- Developed a guided menopause-stage assessment as an alternative to user self-identification, securing medical advisory board approval for an approach based on published clinical criteria. Personally implemented the **classifier in Python/Django** using rules and a light statistical model for edge cases.
- Designed a symptom-tracking experience that replaced long questionnaires with a dynamically generated deck of **swipeable visual cards**. Consistently positive focus-group feedback supported its adoption as a core product interaction.
- Architected the product’s **core LLM companion** across the mobile application, AWS-hosted Django backend, and Azure AI services. Connected model deployment through Azure AI Studio with conversation history and recall in Azure Cosmos DB and application data for personalized interactions, designing the system to support changing the underlying model.
- Designed the LLM companion’s **personalization system** to build health profiles through ongoing product engagement, transform health and activity data into contextual observations for model prompts, and let users control which information the companion could use.
- Chose an existing web-app template embedded in a mobile webview to launch the LLM companion quickly and test **product-market fit** with limited upfront investment. The companion later moved to direct Flutter integration while retaining its Azure backend services.
- Evaluated and refined the companion’s instructions and context injection through repeated test conversations, checking for regressions across interactions. Used focus groups and stakeholder feedback to guide its conversational behavior and capabilities.
- Led the technical takeover and stabilization of an inherited live production system with minimal handoff, assuming responsibility for production access and CI/CD infrastructure. Remediated security vulnerabilities, resolved API access and authentication problems, reviewed AWS access, rotated exposed credentials, and hardened unstable code while maintaining **zero user-facing downtime** during the handoffs.

### RadiusAI — Tempe, AZ

*Retail computer vision*

#### Data Scientist — June 2021–March 2024

Helped develop **ShopAssist**, a computer-vision assisted-checkout system, from concept through live deployment and expansion to 10 retail locations with 20 checkout devices. Built training-data and annotation systems, designed capture hardware, and established and led the data-collection lab.

- Designed and established a mock convenience-store lab to collect the system’s initial training dataset under representative retail conditions. Led lab operations and its five-person team.
- Engineered the **checkout imaging system** to capture discriminative visual features for product classification, selecting cameras, lenses, and viewing angles within edge-device USB bandwidth and power limits. The system ran recognition at 6 frames per second with live visual feedback.
- Built the **end-to-end data-collection pipeline**, from capture software and operator interface to storage and data modeling. Standardized capture procedures and tracked product identity through barcode scanning and automated metadata collection.
- Developed a versioned, queryable training-data system linking captures and their metadata to hardware configurations. Enabled composite datasets to reuse compatible captures across hardware changes instead of discarding entire prior datasets.
- Traced recognition failures in field deployment to annotation errors and inconsistent retailer catalog data. Designed a **ground-truth product index** covering more than 3,000 products, reconciling changing UPCs, SKUs, and descriptions while supporting integration with other retailers’ catalog structures and POS systems.
- Improved recognition by **approximately 10 F-score points** by correcting errors affecting more than 33% of SKUs, enabling pilot expansion. Integrated the product index with annotation workflows and redesigned data models and training-data tracking.
- Defined recognition classes to reconcile visual appearance with retail product identity, handling identical products sold under different identifiers, customizable products, and personal objects such as phones and wallets.
- Reverse-engineered undocumented retailer POS records into structured checkout events and built a **sequence-alignment algorithm** to associate them with noisy, asynchronous customer tracks independently captured by the computer-vision system. Tuned the matching cost to handle transient tracks and spurious POS events while allowing unmatched tracks and multiple plausible transaction candidates.
- Streamlined field-data annotation by using transaction candidates to prepopulate image annotations with plausible SKUs, replacing searches across thousands of similar catalog entries with review and correction. The workflow required only a **few hours of developer review per week**, without a dedicated labeling team.
- Served as a primary technical demonstrator for customers and investors, explaining system behavior and deployment constraints. Used technical constraints, customer input, and field feedback to shape product requirements, data models, recognition classes, and hardware configuration.

**Patent: Point of Sale Station for Assisted Checkout System**

*U.S. Patent 12,236,662 B2 · Issued February 25, 2025 · Named inventor*

Contributed system design, imaging geometry for capturing visual features needed for product recognition, and data-collection pipelines for a computer-vision assisted-checkout system.

### Arizona State University — Tempe, AZ

Conducted applied machine-learning and robotics research and co-developed graduate-level AI course material. Research and teaching appointments fully funded the master’s program.

#### Applied Research and Summer Internship — August 2019–August 2020

*Salt River Project*

- Trained a feedforward neural network to estimate fuel rate from plant sensor readings, improving accuracy over the plant’s existing formula.
- Developed **LSTM models** to forecast fuel rate across multiple time horizons. In project testing, these forecasts outperformed the plant’s existing formula even when the formula used sensor readings from the time being predicted.
- Applied PCA and autoencoders to time series of **more than 2,000 plant metrics**, narrowing investigation of fuel-rate prediction errors to a few anomalous sensor readings. Presented these to plant engineers for investigation of possible sensor faults or operating conditions.
- Implemented **diagnostic models in PyTorch** and built an application that let power-plant engineers without machine-learning or computer-science backgrounds process datasets and train multiple model types.

#### Research Assistant — 2019–2021

*Interactive Robotics Lab*

- Designed a quadcopter simulation and trained an **internal dynamics model** to predict the robot’s motion. Used deviations between predicted and observed motion to model functional pain and distinguish collisions from abrupt, self-generated movement.
- Developed and trained ConvLSTM models for **self-supervised visual collision avoidance**, using collision labels generated by the simulated robot’s functional pain model independently of the simulator’s collision flags.
- Implemented central pattern generators for leg-joint control in a MuJoCo simulation of Agility Robotics’ Cassie biped, producing initial standing and basic stepping behavior. Explored evolutionary algorithms for optimizing the generators.
- Compiled and deployed **custom movement-control code** on a physical Ghost Robotics Minitaur quadruped.

#### Teaching Assistant — January–July 2020

*ASU Online · CSE 571 — Artificial Intelligence · Graduate course*

- Co-developed and wrote the course’s **deep-learning section**, covering multilayer perceptrons, convolutional and recurrent neural networks, LSTMs, stochastic architectures, and gradient-descent methods.
- Built a neural-network assignment covering data collection, training-data distribution, and next-step collision prediction. Students collected distance-sensor and action data from a simulated robot and trained a feedforward model. Implemented automated grading in Docker.
- Created instructional animations illustrating gradient descent, convolutional neural networks, and several optimization algorithms for the graduate deep-learning material.

#### Undergraduate Research

- **National Science Foundation REU recipient** — Fall 2017: Applied optical-flow methods to traffic video for autonomous-driving research.
- Undergraduate robotics research: Built a robot-navigation simulation exploring adaptive behavior and exploration–exploitation tradeoffs; implemented hardware controls for exoskeleton research using surface EMG.

## Education

- Arizona State University — Master of Science in Computer Science, 2021
- Arizona State University — Bachelor of Science in Computer Science, 2019

## Additional Skills

Software Engineering · Engineering Management · Technical Product Management · Stakeholder Management · Backlog Prioritization · Product Requirements Documents (PRDs) · User Stories · Acceptance Criteria · Generative AI (GenAI) · Conversational AI · AI Agents · Tool Calling · Prompt Engineering · Context Engineering · LLM Evaluation · Model Evaluation · AI-Assisted Software Development · Cursor · Claude Code · OpenAI Codex · Workflow Automation · Data Engineering · Data Pipelines · Data Quality · Backend Development · API Integration · REST APIs · SQL · PostgreSQL · scikit-learn · OpenCV · NumPy · pandas · Git · Linux · Microsoft Azure · Azure OpenAI · Amazon Web Services (AWS) · Continuous Integration and Continuous Delivery (CI/CD)
