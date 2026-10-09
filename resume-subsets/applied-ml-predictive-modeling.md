# Applied ML & Predictive Modeling

This copy targets applied ML engineer, predictive-modeling data scientist, and industrial or time-series ML roles. It emphasizes neural-network and LSTM modeling, comparison with existing prediction methods, PCA and autoencoder diagnostics, and tools that make models usable by domain experts. The Pause assessment classifier adds recent hands-on implementation, while RadiusAI training-data and ground-truth work and ASU learned dynamics support the model-development and error-investigation story.

> Bullet-selection draft for review, not a complete resume. Bullet wording and bolding are copied verbatim from the master source; groups are ordered for this career direction. Role descriptions, patent, education, skills, and the final timeline will be considered separately.

Source: `../resume_source.md`

Source SHA-256: `9199f58526e75d07ec696c144bea6872c3afa5f2f0de3d8ee06dbfdefa426903`

9 selected bullets. Catalog IDs are positional; verify the source hash and text before reusing a selection after source edits.

### Arizona State University — Tempe, AZ

#### Applied Research and Summer Internship — August 2019–August 2020

*Salt River Project*

Selected IDs, in bullet order: `ASU-ARSI-00` · `ASU-ARSI-01` · `ASU-ARSI-02` · `ASU-ARSI-03`

- Trained a feedforward neural network to estimate fuel rate from plant sensor readings, improving accuracy over the plant’s existing formula.

- Developed **LSTM models** to forecast fuel rate across multiple time horizons. In project testing, these forecasts outperformed the plant’s existing formula even when the formula used sensor readings from the time being predicted.

- Applied PCA and autoencoders to time series of **more than 2,000 plant metrics**, narrowing investigation of fuel-rate prediction errors to a few anomalous sensor readings. Presented these to plant engineers for investigation of possible sensor faults or operating conditions.

- Implemented **diagnostic models in PyTorch** and built an application that let power-plant engineers without machine-learning or computer-science backgrounds process datasets and train multiple model types.

### The Pause Technologies, Inc. — Scottsdale, AZ

#### Founding Engineer & Data Scientist — April 2024–January 2025

Selected IDs, in bullet order: `TPT-FEDS-00`

- Developed a guided menopause-stage assessment as an alternative to user self-identification, securing medical advisory board approval for an approach based on published clinical criteria. Personally implemented the **classifier in Python/Django** using rules and a light statistical model for edge cases.

### RadiusAI — Tempe, AZ

#### Data Scientist — June 2021–March 2024

Selected IDs, in bullet order: `RAI-DS-03` · `RAI-DS-04` · `RAI-DS-05`

- Developed a versioned, queryable training-data system linking captures and their metadata to hardware configurations. Enabled composite datasets to reuse compatible captures across hardware changes instead of discarding entire prior datasets.

- Traced recognition failures in field deployment to annotation errors and inconsistent retailer catalog data. Designed a **ground-truth product index** covering more than 3,000 products, reconciling changing UPCs, SKUs, and descriptions while supporting integration with other retailers’ catalog structures and POS systems.

- Improved recognition by **approximately 10 F-score points** by correcting errors affecting more than 33% of SKUs, enabling pilot expansion. Integrated the product index with annotation workflows and redesigned data models and training-data tracking.

### Arizona State University — Tempe, AZ

#### Research Assistant — August 2019–May 2021

*Interactive Robotics Lab*

Selected IDs, in bullet order: `ASU-RA-00`

- Designed a quadcopter simulation and trained an **internal dynamics model** to predict the robot’s motion. Used deviations between predicted and observed motion to model functional pain and distinguish collisions from abrupt, self-generated movement.
