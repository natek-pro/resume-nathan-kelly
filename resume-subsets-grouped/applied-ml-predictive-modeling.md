# Applied ML & Predictive Modeling

This copy targets applied ML engineer, predictive-modeling data scientist, and industrial or time-series ML roles. It emphasizes neural-network and LSTM modeling, comparison with existing prediction methods, PCA and autoencoder diagnostics, and tools that make models usable by domain experts. The Pause assessment classifier adds recent hands-on implementation, while RadiusAI training-data and ground-truth work and ASU learned dynamics support the model-development and error-investigation story.

> Grouped contribution draft for review. Bullets retain the master source’s wording and bolding. IDs, selection notes, trimming priorities, and reserve bullets are planning material. The complete career timeline and final page layout are pending.

Source: `../resume_source.md` · Previous selection: `../resume-subsets/applied-ml-predictive-modeling.md`

Source SHA-256: `9199f58526e75d07ec696c144bea6872c3afa5f2f0de3d8ee06dbfdefa426903`

**8 primary bullets in 3 contribution groups; 1 reserve bullet.** Eight is a starting selection, not a verified page-capacity limit. IDs are positional; verify source hash and text after source edits.

Selection rationale: This remains the fifth career direction. The strongest directly relevant modeling and diagnostics evidence leads regardless of age. The clinical classifier adds a more recent implementation contribution, with its rules/light-statistical-model qualification intact.

## Primary contributions

Attribution carries across consecutive groups until a new employer/role or project line appears. Exact titles and dates will remain in the career timeline.

### Forecasting & Diagnosing Power-Plant Behavior

*Arizona State University · Salt River Project*

Bullet IDs, in order: `ASU-ARSI-00` · `ASU-ARSI-01` · `ASU-ARSI-02` · `ASU-ARSI-03`

- Trained a feedforward neural network to estimate fuel rate from plant sensor readings, improving accuracy over the plant’s existing formula.

- Developed **LSTM models** to forecast fuel rate across multiple time horizons. In project testing, these forecasts outperformed the plant’s existing formula even when the formula used sensor readings from the time being predicted.

- Applied PCA and autoencoders to time series of **more than 2,000 plant metrics**, narrowing investigation of fuel-rate prediction errors to a few anomalous sensor readings. Presented these to plant engineers for investigation of possible sensor faults or operating conditions.

- Implemented **diagnostic models in PyTorch** and built an application that let power-plant engineers without machine-learning or computer-science backgrounds process datasets and train multiple model types.

### Improving Retail Training Data & Recognition

*RadiusAI · Data Scientist*

Bullet IDs, in order: `RAI-DS-03` · `RAI-DS-04` · `RAI-DS-05`

- Developed a versioned, queryable training-data system linking captures and their metadata to hardware configurations. Enabled composite datasets to reuse compatible captures across hardware changes instead of discarding entire prior datasets.

- Traced recognition failures in field deployment to annotation errors and inconsistent retailer catalog data. Designed a **ground-truth product index** covering more than 3,000 products, reconciling changing UPCs, SKUs, and descriptions while supporting integration with other retailers’ catalog structures and POS systems.

- Improved recognition by **approximately 10 F-score points** by correcting errors affecting more than 33% of SKUs, enabling pilot expansion. Integrated the product index with annotation workflows and redesigned data models and training-data tracking.

### Implementing a Clinical Assessment

*The Pause Technologies, Inc. · Founding Engineer & Data Scientist*

Bullet IDs, in order: `TPT-FEDS-00`

- Developed a guided menopause-stage assessment as an alternative to user self-identification, securing medical advisory board approval for an approach based on published clinical criteria. Personally implemented the **classifier in Python/Django** using rules and a light statistical model for edge cases.

## Reserve bullets

These are alternatives to the primary set, retained for tailoring rather than included by default.

*Arizona State University · Interactive Robotics Lab*

Bullet IDs, in order: `ASU-RA-00`

- Designed a quadcopter simulation and trained an **internal dynamics model** to predict the robot’s motion. Used deviations between predicted and observed motion to model functional pain and distinguish collisions from abrupt, self-generated movement.

Reserve rationale: Use for dynamics modeling, robotics, or model-based diagnostics roles; it adds another modeled domain rather than another forecasting result.

## Trimming priorities

First consider ASU-ARSI-00 when the LSTM forecasting bullet already supplies sufficient modeling evidence, then RAI-DS-03 when dataset infrastructure is secondary. For an exclusively industrial/time-series role, the clinical-assessment group is the first whole group to reconsider. Keep RAI-DS-04 with RAI-DS-05. Keep the power-plant work prominent despite its age.
