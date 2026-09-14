import type { Project } from "./types";

/**
 * The five portfolio case studies.
 *
 * Every figure is transcribed from a committed result file in the source
 * repository — a CSV under `reports/`, a per-well manifest, or `REPORT.md`.
 * The machine-readable versions live in ./metrics/ and drive the charts.
 * Nothing is estimated.
 *
 * Where the project brief and the repository disagree about a detail, the
 * repository wins and the difference is flagged with a TODO, because the
 * repository is the part a reader can check.
 */
const ASSETS = "/media";

export const projects: Project[] = [
  /* 1 ------------------------------------------------------------------ */
  {
    slug: "anomaly-detection-predictive-maintenance",
    order: 1,
    title: "Anomaly Detection & Predictive Maintenance for Energy Infrastructure",
    tagline:
      "Unsupervised detection on a real drilling log — and the calibration step that decided whether any of it meant anything.",
    identities: ["researcher", "data-scientist", "ai-engineer"],
    objective:
      "Flag early signs of equipment and process anomalies in oil and gas infrastructure, supporting a shift from reactive to predictive maintenance. Built alongside the Energy Asset Digital Twin on the same Volve dataset, so detection and monitoring share one view of the asset.",
    summary:
      "Unsupervised anomaly detection over the 15/9-F-9 A drilling log: an isolation forest, an LSTM autoencoder, SPC control charts and a stuck-pipe heuristic, combined into a single reviewable event list. The detectors are the easy part. Calibrating them so their flag rates mean the same thing is where the work was.",
    problem:
      "Operational sensor data is abundant and unlabelled, so there is no ground truth to score against. A detector can hit its target flag rate on the data it was fitted to and be wildly off on data it has not seen — and without noticing that, any combination of detectors is arithmetic on incomparable numbers.",
    approach:
      "Detection runs in two tiers, because two of the eight requested channels — standpipe pressure and surface torque — exist for only 15.7% of the log, in twelve contiguous blocks. Flags are confined to on-bottom rotary drilling, the regime the detectors were fitted on: scored against tripping and circulating they fire on three quarters of the log, correctly but uselessly. Thresholds are then calibrated on a held-out slice of normal drilling, never on the fitting split.",
    method:
      "Operational sensor time-series were curated and preprocessed — pressure, flow, hookload, RPM and rate-of-penetration channels — then scored by four independent detectors. Each detector's threshold was recalibrated against unseen normal drilling, and the surviving flags were merged into contiguous events with a combined score, a detector-agreement matrix and a duration, so a human reviews events rather than points.",
    outcome:
      "Judged on their own fitting split, the isolation forest and the autoencoder both hit their 1% target exactly. On unseen normal drilling they flagged 4.21% and 33.44% — a 110-fold spread that made any weighted combination of them meaningless. Recalibrated, all three land within 0.15 pp of target. Seven events then survive across a 19-day section of hole, totalling 5.5 minutes, all during genuine drilling; the largest reads as a connection, not a fault. The honest conclusion is that there is very little here for these detectors to find — which is a result, not a failure to report one.",
    nextSteps: [
      "Run the same calibrated pipeline over a section of hole with a known incident in it, to test whether the detectors catch something that matters and not just something unfamiliar.",
      "Fold the surviving events into the twin's health index, so detection feeds the monitoring view rather than sitting beside it.",
      "Extend beyond drilling to the midstream and downstream assets the objective names — tanks, pipelines, processing units — which needs operational data the Volve set does not contain.",
    ],
    stack: [
      "Python",
      "pandas",
      "scikit-learn",
      "Isolation Forest",
      "LSTM autoencoder (Keras)",
      "SPC control charts",
      "Time-series analysis",
    ],
    dataset: {
      name: "Volve field dataset — 15/9-F-9 A drilling log",
      source: "Equinor and the Volve licence partners — North Sea, 2008-2016",
      note: "A WITSML export of 419,747 rows and 237 curves across 19 days of hole. Real well-sensor time-series, released for research and study under non-commercial terms; no dataset files are redistributed.",
    },
    metrics: [
      {
        label: "Autoencoder false-flag rate",
        value: "33.44%",
        superseded: "1.00%",
        caveat:
          "The 1% was self-graded on the data it was fitted to. On unseen normal drilling it flagged a third of everything.",
        method: "Isolation forest moved 1.00% to 4.21% on the same test.",
      },
      {
        label: "After recalibration",
        value: "within 0.15 pp",
        method: "All three detectors, against target, on held-out normal drilling.",
      },
      {
        label: "Events surviving review",
        value: "7 events, 5.5 min",
        method:
          "Across a 19-day section of hole, all during on-bottom rotary drilling.",
      },
      {
        label: "Channel coverage",
        value: "15.7%",
        method:
          "Standpipe pressure and surface torque, present in only 12 contiguous blocks — hence two-tier detection.",
      },
    ],
    links: [
      {
        label: "Repository",
        href: "https://github.com/ediomoesu445-glitch/energy-asset-digital-twin",
        kind: "repo",
      },
    ],
    motionAsset: "anomaly-events",
    media: [
      {
        kind: "image",
        src: `${ASSETS}/anomaly-detection-predictive-maintenance/drilling-channels-flagged.png`,
        alt: "Drilling channels over time with the surviving flagged events marked.",
      },
      {
        kind: "image",
        src: `${ASSETS}/anomaly-detection-predictive-maintenance/top-anomaly-event.png`,
        alt: "The highest-scoring event, shown against hookload, RPM and mud flow — a connection rather than a fault.",
      },
      {
        kind: "image",
        src: `${ASSETS}/anomaly-detection-predictive-maintenance/detector-score-distributions.png`,
        alt: "Score distributions for each detector, before and after threshold calibration.",
      },
      {
        kind: "image",
        src: `${ASSETS}/anomaly-detection-predictive-maintenance/reconstruction-error-distribution.png`,
        alt: "Autoencoder reconstruction-error distribution on normal drilling.",
      },
      {
        kind: "image",
        src: `${ASSETS}/anomaly-detection-predictive-maintenance/stuck-pipe-signature.png`,
        alt: "The stuck-pipe heuristic signature across the drilling log.",
      },
      {
        kind: "video",
        src: "TODO(media): /media/anomaly-detection-predictive-maintenance/demo.mp4",
        srcWebm: "/media/anomaly-detection-predictive-maintenance/demo.webm",
        poster: "/media/anomaly-detection-predictive-maintenance/demo-poster.jpg",
        alt: "Screen recording of the drilling anomaly panel seeking to a flagged event.",
        shot: "8-15s screen recording. Run the digital-twin dashboard, open the Drilling anomaly panel, and use the jump-to-event selector to seek to event 7 (2009-07-07 21:37, the 2.17-minute one). Capture the anomaly banner appearing and the channel traces redrawing around it. Export MP4 + WebM under 3 MB plus a poster still as demo-poster.jpg, into /public/media/anomaly-detection-predictive-maintenance/.",
      },
    ],
    status: "shipped",
    date: "2026-09",
    started: "2026-08",
    featured: true,
    caveat:
      "Unsupervised detection finds the unfamiliar; a human decides whether unfamiliar means wrong. There are no labels in this data, so none of these figures is a detection rate against known faults — they are flag rates, and the calibration result is what makes them comparable at all. The drilling log is also upstream data standing in for the midstream and downstream assets the objective describes.",
    attribution:
      "Built on the Volve dataset, released by Equinor Energy AS, ExxonMobil Exploration and Production Norway AS and Bayerngas Norge AS under non-commercial CC BY-NC-SA-style terms. Not affiliated with or endorsed by Equinor or the Volve licence partners. No dataset files are redistributed.",
  },

  /* 2 ------------------------------------------------------------------ */
  {
    slug: "pipeline-defect-detection",
    order: 2,
    title: "AI-Based Pipeline Defect Detection",
    tagline:
      "Six-class surface-defect classification with Grad-CAM, measured against simulated field-imaging conditions.",
    identities: ["researcher", "ai-engineer"],
    objective:
      "Detect and classify surface defects from inspection imagery, so the volume of footage a visual survey produces stops being the bottleneck. The point is triage: put the frames most likely to matter in front of an inspector first.",
    summary:
      "A ResNet18 classifier that assigns a steel surface image to one of six defect classes, with Grad-CAM saliency overlays and a corruption-robustness evaluation. Built as a proof of concept for the visual-inspection layer of a pipeline-integrity workflow.",
    problem:
      "Pipeline integrity management relies on in-line inspection — magnetic flux leakage and ultrasonic testing — as the authoritative source for wall loss and defect depth. Separately, operators run visual surveys: right-of-way patrols, drone and CCTV footage, station and riser inspections. Those surveys generate far more imagery than anyone can review by eye.",
    approach:
      "Transfer learning from ImageNet backbones, with leakage-controlled splits committed to the repository so results reproduce across machines. Grad-CAM was run on correct and incorrect predictions alike, because a saliency map over a failure says more about a model than one over a success. A 22-cell corruption grid then measured what happens when the image stops being clean.",
    method:
      "Images were preprocessed and augmented, then used to fine-tune a ResNet18 backbone; 5-fold cross-validation confirmed the split was not doing the work. Models were exported to ONNX for CPU inference and served through a Gradio demo. Robustness was measured across seven corruptions at three severities — motion blur, defocus, noise, low light and others — against a clean baseline.",
    outcome:
      "The headline accuracy is not the contribution: the dataset is small and clean enough that high accuracy is expected. The contribution is the measured lab-to-field gap. A model at 99.63% clean accuracy falls to 67.83% mean accuracy across 21 simulated corrupted conditions, and to 42.96% at severe. In-distribution accuracy on a clean benchmark does not predict field performance.",
    nextSteps: [
      "Finish the backbone benchmark — three of five are outstanding, halted by available compute rather than by method. The scripts resume from partial progress.",
      "Run the cross-backbone robustness comparison, so the corruption grid covers more than ResNet18.",
      "Fine-tune on real pipeline imagery once a labelled set exists. Everything here is steel surface imagery standing in for it.",
      "Add the severity-ranking workflow and the corrosion imagery. Both are designed and neither is built, for the same reason as the benchmark.",
    ],
    stack: ["Python", "PyTorch", "ResNet18", "OpenCV", "Grad-CAM", "ONNX", "Gradio"],
    dataset: {
      name: "NEU Surface Defect Database",
      source: "Northeastern University — six defect classes of steel surface imagery",
      note: "A proxy: no labelled Nigerian pipeline inspection dataset exists publicly. The transferable claim is the method and the robustness finding, not the class labels.",
    },
    metrics: [
      {
        label: "Held-out test accuracy",
        value: "0.9963",
        method: "270-image test split, leakage-controlled.",
      },
      {
        label: "5-fold cross-validation",
        value: "0.9987 ± 0.0029",
        method: "Mean and standard deviation of validation accuracy across folds.",
      },
      {
        label: "Mean corruption drop",
        value: "31.80 pp",
        method: "Across 21 corrupted conditions; mean corrupted accuracy 0.6783.",
      },
      {
        label: "Backbone benchmark",
        value: "2 of 5 complete",
        method:
          "Paused at the limit of an 8 GB CPU-only laptop. The splits are committed and both scripts resume from partial progress, so this finishes on better hardware without repeating finished work.",
      },
    ],
    links: [
      {
        label: "Repository",
        href: "https://github.com/ediomoesu445-glitch/AI-Powered-Pipeline-Defect-Detection-System",
        kind: "repo",
      },
    ],
    motionAsset: "gradcam-slider",
    media: [
      {
        kind: "image",
        src: `${ASSETS}/pipeline-defect-detection/gradcam-by-class.png`,
        alt: "Grad-CAM saliency overlays for each of the six defect classes, showing where the model attends.",
      },
      {
        kind: "image",
        src: `${ASSETS}/pipeline-defect-detection/gradcam-failures.png`,
        alt: "Grad-CAM overlays for misclassified images, showing where the model attended when it was wrong.",
      },
      {
        kind: "image",
        src: `${ASSETS}/pipeline-defect-detection/robustness-heatmap.png`,
        alt: "Heatmap of classification accuracy across seven corruption types at three severities.",
      },
      {
        kind: "image",
        src: `${ASSETS}/pipeline-defect-detection/confusion-matrix.png`,
        alt: "Confusion matrix for the six defect classes on the held-out test set.",
      },
      {
        kind: "image",
        src: `${ASSETS}/pipeline-defect-detection/robustness-examples.png`,
        alt: "Example images under each simulated corruption, from mild to severe.",
      },
      {
        kind: "video",
        src: "TODO(media): /media/pipeline-defect-detection/demo.mp4",
        srcWebm: "/media/pipeline-defect-detection/demo.webm",
        poster: "/media/pipeline-defect-detection/demo-poster.jpg",
        alt: "Screen recording of the demo classifying an image and rendering its Grad-CAM overlay.",
        shot: "8-15s screen recording. Launch the Gradio app, drag in one of the six example images, and capture the moment the prediction and confidence appear alongside the Grad-CAM overlay. A crazing or scratches sample reads best. Export MP4 + WebM under 3 MB plus a poster still as demo-poster.jpg, into /public/media/pipeline-defect-detection/.",
      },
    ],
    status: "in-progress",
    date: "2026-09",
    started: "2026-08",
    featured: true,
    caveat:
      "Trained on the NEU surface-defect dataset, which is steel surface imagery rather than pipeline imagery. Visual inspection complements in-line inspection and does not replace it for wall-thickness or defect-depth assessment. The backbone benchmark is 2 of 5 complete and the cross-backbone robustness comparison has not been run.",
  },

  /* 3 ------------------------------------------------------------------ */
  {
    slug: "ghost-transaction-detection",
    order: 3,
    title: "AI-Based Fraud & Ghost-Transaction Detection for Energy-Sector Finance",
    tagline:
      "Ranking reconciliation records so limited investigative capacity goes to the ones most worth opening.",
    identities: ["researcher", "data-scientist", "ai-engineer"],
    objective:
      "Detect fraudulent and ghost transactions in energy-sector financial flows — records that never corresponded to real economic activity. The output has to be reviewable by a finance or audit team, which rules out a model that cannot say why it flagged something.",
    summary:
      "A detection method developed and validated on labelled synthetic data, designed to run unsupervised on the real, unlabelled deployment target. Informed by hands-on exposure to budget and account system control at Nigeria's midstream and downstream petroleum regulator. Every output is an investigative lead for human review, never a determination of fraud.",
    problem:
      "Energy-sector revenue flows pass through a reconciliation chain — operator declarations, regulator records, remittances to government. Gaps in that chain can be benign (timing, classification, exchange-rate treatment) or can indicate transactions that never happened. Investigative capacity is finite, so the task is ranking, not classification.",
    approach:
      "Two tracks in parallel. A supervised track for method development where labels exist, and label-free detectors — an autoencoder, explainable rules, local outlier factor, isolation forest — for the unlabelled target. A single-feature PR-AUC diagnostic was run before modelling, and it caught a simulator artefact that was inflating every supervised score.",
    method:
      "Transactional and account data were profiled for duplicates, ghost destinations and structuring patterns. Features were built in one module used as the single source of truth by both tracks. Models were scored on PR-AUC and on recall at fixed precision rather than accuracy, since the base rate is 0.77%. SHAP was used throughout, so a flagged record arrives with its reasons attached rather than as a bare score.",
    outcome:
      "Deleting the artefact and its collinear twin cost 0.1376 PR-AUC — 0.9995 down to 0.8619. That deletion is the most important result in the project: the higher number was measuring the simulator's own generator signature, not fraudulent behaviour. The label-free ghost-destination rule is the most transferable result, at 93.63% precision with no labels used at any point.",
    nextSteps: [
      "Attempt transfer to real reconciliation records. Nothing here has touched them, and the method's value is unproven until it does.",
      "Build the reviewer feedback loop: a flagged record an analyst clears is training signal the unlabelled target otherwise never produces.",
      "Calibrate the alert threshold to actual review capacity rather than to a fixed precision, since queue length is the real constraint.",
    ],
    stack: ["Python", "pandas", "XGBoost", "scikit-learn", "SHAP", "Streamlit"],
    dataset: {
      name: "PaySim synthetic transactions, with NEITI reports for context",
      source: "Kaggle (PaySim); NEITI oil & gas audit reports",
      note: "PaySim is the only source here with ground truth, which is what makes honest evaluation possible. NEITI reports are aggregate PDFs used for domain framing — they hold no transaction-level records and never train or score a model.",
    },
    metrics: [
      {
        label: "PR-AUC, artefact-free",
        value: "0.8619",
        method: "XGBoost on the held-out test split, artefact features removed.",
      },
      {
        label: "Recall at precision ≥ 0.90",
        value: "0.7811",
        method: "Same model and split.",
      },
      {
        label: "Ghost-destination rule precision",
        value: "93.63%",
        method: "Label-free rule; recall 29.51%. No labels used at any point.",
      },
      {
        label: "Cost of deleting the artefact",
        value: "−0.1376 PR-AUC",
        method: "0.9995 → 0.8619 after removing is_full_drain and its collinear twin.",
      },
    ],
    links: [
      {
        label: "Repository",
        href: "https://github.com/ediomoesu445-glitch/ghost-transaction-detection",
        kind: "repo",
      },
    ],
    motionAsset: "transaction-graph",
    media: [
      {
        kind: "image",
        src: `${ASSETS}/ghost-transaction-detection/pr-curves-ablated.png`,
        alt: "Precision-recall curves for three models after the simulator artefact was removed.",
      },
      {
        kind: "image",
        src: `${ASSETS}/ghost-transaction-detection/ghost-destination-lift.png`,
        alt: "Lift chart for the label-free ghost-destination rule against the base fraud rate.",
      },
      {
        kind: "image",
        src: `${ASSETS}/ghost-transaction-detection/shap-beeswarm.png`,
        alt: "SHAP beeswarm plot showing which features drive individual fraud scores.",
      },
      {
        kind: "image",
        src: `${ASSETS}/ghost-transaction-detection/feature-importance.png`,
        alt: "XGBoost feature importance ranking for the artefact-free model.",
      },
      {
        kind: "video",
        src: "TODO(media): /media/ghost-transaction-detection/demo.mp4",
        srcWebm: "/media/ghost-transaction-detection/demo.webm",
        poster: "/media/ghost-transaction-detection/demo-poster.jpg",
        alt: "Screen recording of the analyst review queue, ranked by fraud score.",
        shot: "8-15s screen recording. Run the Streamlit review queue, show the alert list sorted by score, then open the top record so the SHAP reason panel renders. The reasons panel is the point - make sure it is on screen. Export MP4 + WebM under 3 MB plus a poster still as demo-poster.jpg, into /public/media/ghost-transaction-detection/.",
      },
    ],
    status: "research",
    date: "2026-09",
    started: "2026-08",
    featured: true,
    caveat:
      "All reported figures are synthetic-proxy performance on PaySim — an upper bound on method quality, not a claim about energy-sector data. PaySim is synthetic mobile-money data and does not become energy-sector data by being used here. Transfer to real regulator records has not been attempted, and the deployment target has no labels, so precision and recall can never be computed there.",
  },

  /* 4 ------------------------------------------------------------------ */
  {
    slug: "energy-asset-digital-twin",
    order: 4,
    title: "Energy Asset Digital Twin & Monitoring Platform",
    tagline:
      "Production forecasting, drilling anomaly detection and a replay dashboard over one real field dataset.",
    identities: ["researcher", "data-scientist", "ai-engineer", "project-manager"],
    objective:
      "Prototype a near-real-time monitoring twin for energy assets, to cut the lag between what the field knows and what a decision-maker sees. Everything it produces is decision support for a person, never an automated verdict.",
    summary:
      "Three modules on the Equinor Volve field dataset: per-well oil-rate forecasting evaluated against naive baselines, unsupervised anomaly detection on a drilling log, and a digital-twin dashboard with a documented health index and a historical replay simulator.",
    problem:
      "Production and drilling data are abundant, but a forecast that looks accurate can be worthless. Predicting that tomorrow matches today already scores R² 0.86–0.92 on every well in this field, so any model reporting R² alone will look competent while adding nothing.",
    approach:
      "Five forecasting families per well — Arps decline-curve, ARIMA, Prophet, XGBoost and an LSTM — fitted separately and scored on skill against the regime's naive baseline rather than on R². Anomaly detection combines an isolation forest, an LSTM autoencoder, SPC charts and a stuck-pipe heuristic into a single reviewable event list.",
    method:
      "Well and asset state were modelled as objects carrying operational state, throughput and condition indicators, with a documented 0–100 health index. A replay simulator streams historical data through the same path a live feed would take, so the dashboard is exercised end to end. The service is containerised, and no dataset files are committed.",
    outcome:
      "Reporting skill instead of R² changed the conclusion. Two wells produced genuinely useful models, at +0.72 and +0.66 skill one step ahead; on well 15/9-F-11 no model beat persistence at all, so its manifest records a null winner rather than naming a least-bad model. On the drilling log, seven anomaly events survived review, totalling 5.5 minutes, all during genuine drilling.",
    nextSteps: [
      "Connect a live feed. Everything is replay today, and the lag this project exists to close is only really closed by streaming ingestion.",
      "Publish the health index as a versioned, auditable definition — it drives attention, so it needs to be arguable.",
      "Re-fit per well on a schedule. The same model family is best on three wells and worst on another, so one field-wide fit would be wrong.",
    ],
    stack: [
      "Python",
      "XGBoost",
      "LSTM (Keras)",
      "Prophet",
      "ARIMA",
      "Isolation Forest",
      "Streamlit",
      "Plotly",
      "Docker",
    ],
    dataset: {
      name: "Volve field dataset",
      source: "Equinor and the Volve licence partners — North Sea, 2008–2016",
      note: "Production data across seven wellbores plus a WITSML drilling log of 419,747 rows and 237 curves. Released for research and study under non-commercial terms; no dataset files are redistributed.",
    },
    metrics: [
      {
        label: "Best one-step skill",
        value: "+0.717",
        method:
          "Well 15/9-F-15 D, XGBoost. Skill is the fraction of the persistence baseline's squared error removed.",
      },
      {
        label: "Wells beating the baseline",
        value: "4 of 5",
        method:
          "One-step regime. On 15/9-F-11 no model beat persistence, recorded as a null winner.",
      },
      {
        label: "Anomaly events after review",
        value: "7 events, 5.5 min",
        method:
          "Combined detector score on the 15/9-F-9 A drilling log, all during genuine drilling.",
      },
      {
        label: "Persistence baseline R²",
        value: "0.86 – 0.92",
        method: "Why skill, not R², is the figure reported throughout.",
      },
    ],
    links: [
      {
        label: "Repository",
        href: "https://github.com/ediomoesu445-glitch/energy-asset-digital-twin",
        kind: "repo",
      },
    ],
    motionAsset: "dashboard-mock",
    media: [
      {
        kind: "image",
        src: `${ASSETS}/energy-asset-digital-twin/dashboard-field-overview.png`,
        alt: "Field overview panel of the digital-twin dashboard, showing per-well production and condition indicators.",
      },
      {
        kind: "image",
        src: `${ASSETS}/energy-asset-digital-twin/forecast-f12.png`,
        alt: "Actual versus forecast oil rate for well 15/9-F-12.",
      },
      {
        kind: "image",
        src: `${ASSETS}/energy-asset-digital-twin/dashboard-drilling-anomaly.png`,
        alt: "Drilling anomaly panel with flagged channels and an anomaly banner.",
      },
      {
        kind: "image",
        src: `${ASSETS}/energy-asset-digital-twin/anomaly-event.png`,
        alt: "The highest-scoring drilling anomaly event, shown against the surrounding channel data.",
      },
      {
        kind: "video",
        src: "TODO(media): /media/energy-asset-digital-twin/demo.mp4",
        srcWebm: "/media/energy-asset-digital-twin/demo.webm",
        poster: "/media/energy-asset-digital-twin/demo-poster.jpg",
        alt: "Screen recording of the replay simulator streaming historical data through the dashboard.",
        shot: "8-15s screen recording. Start the replay simulator on the field overview and let it run so the clock advances, the per-well tiles update and the health index moves. Steady state sells this one - no clicking. Export MP4 + WebM under 3 MB plus a poster still as demo-poster.jpg, into /public/media/energy-asset-digital-twin/.",
      },
    ],
    status: "shipped",
    date: "2026-09",
    started: "2026-08",
    featured: true,
    caveat:
      "A non-commercial learning proof of concept. Forecast quality varies sharply by well: the same model family is best on three wells and worst on another, which is why each well is fitted separately rather than field-wide.",
    attribution:
      "Built on the Volve dataset, released by Equinor Energy AS, ExxonMobil Exploration and Production Norway AS and Bayerngas Norge AS under non-commercial CC BY-NC-SA-style terms. Not affiliated with or endorsed by Equinor or the Volve licence partners. No dataset files are redistributed.",
  },

  /* 5 ------------------------------------------------------------------ */
  {
    slug: "core-anomaly-detection",
    order: 5,
    title: "CORE — Anomaly Detection for Petroleum Process Facilities",
    tagline:
      "A two-tier screener and classifier watching 52 process variables across 20 fault types.",
    identities: ["researcher", "data-scientist", "ai-engineer"],
    objective:
      "Detect process faults early enough to act on, at a false-alarm rate an operator will tolerate. A detector that cries wolf gets switched off by the people it was built for, so the binding constraint is false alarms rather than accuracy.",
    summary:
      "Fault detection for petroleum process facilities on the Tennessee Eastman Process benchmark. A PCA-MSPC screener flags any departure from normal operation without needing labels; a LightGBM classifier then confirms whether the departure is a real fault. Built separately from the Volve work and on a different dataset, which is why it stands as its own project rather than folding into the drilling-log one.",
    problem:
      "Process plants generate continuous multivariate sensor data in which faults are rare, varied and easy to miss among normal operating drift. Unlike the drilling log, this benchmark has ground-truth labels — which is exactly what makes it useful for measuring whether a detection method works at all.",
    approach:
      "Two tiers. Tier one is unsupervised and statistical: PCA-based multivariate statistical process control, using Hotelling's T-squared and Q statistics against limits learned from fault-free operation. Tier two is a LightGBM classifier that confirms the deviation, which is what keeps the false-alarm rate low.",
    method:
      "Sensor time-series were standardised and reduced with PCA, with control limits fitted on fault-free runs only. Four model families were compared on the same split — logistic regression, random forest, LightGBM and an MLP — scored on detection rate, false-alarm rate and precision rather than accuracy, which is misleading on imbalanced fault data. Per-fault detection rates were computed for all 20 faults rather than averaged.",
    outcome:
      "The LightGBM tier raises an alarm that is correct 99.50% of the time, at a 1.32% false-alarm rate, with detection across all faults at 65.77%. The per-fault breakdown is the useful part: most faults are caught reliably while a few are close to undetectable in this benchmark for every model tried, which an average would have hidden.",
    nextSteps: [
      "Decide whether the MLP should be the headline model — it beats LightGBM on both precision (0.9958) and detection rate (0.6799) in tep_model_summary.csv.",
      "Re-fit the control limits to a specific facility's own normal operating envelope. The TEP limits describe a simulator, not a plant.",
      "Add remaining-useful-life estimation on top of detection — the step that turns an alarm into a maintenance schedule.",
    ],
    stack: [
      "Python",
      "pandas",
      "scikit-learn",
      "SciPy",
      "LightGBM",
      "Streamlit",
      "Matplotlib",
    ],
    dataset: {
      name: "Tennessee Eastman Process simulation data",
      source: "Harvard Dataverse — Rieth, Amsel, Tran & Cook (2017)",
      note: "The standard benchmark for process fault detection: 52 process variables, 20 fault types, with ground-truth labels that make honest evaluation possible.",
    },
    metrics: [
      {
        label: "Alarm precision",
        value: "99.50%",
        method: "LightGBM tier — share of raised alarms that were real faults.",
      },
      {
        label: "Fault detection rate",
        value: "65.77%",
        method: "Recall across all 20 fault types.",
      },
      {
        label: "False alarm rate",
        value: "1.32%",
        method: "Share of fault-free samples that raised an alarm.",
      },
      {
        label: "ROC-AUC",
        value: "0.8497",
        method: "LightGBM tier on the held-out TEP test split.",
      },
    ],
    links: [
      {
        label: "Repository",
        href: "https://github.com/ediomoesu445-glitch/CORE-ANOMALY-DETECTION-DEMO",
        kind: "repo",
      },
    ],
    motionAsset: "anomaly-timeseries",
    media: [
      {
        kind: "image",
        src: `${ASSETS}/core-anomaly-detection/mspc-control-charts.png`,
        alt: "Hotelling T-squared and Q control charts with upper control limits marked.",
      },
      {
        kind: "image",
        src: `${ASSETS}/core-anomaly-detection/mspc-heatmap-all.png`,
        alt: "Heatmap of detection rate for every model across all 20 fault types.",
      },
      {
        kind: "image",
        src: `${ASSETS}/core-anomaly-detection/live-simulation-alarm.png`,
        alt: "The live simulation dashboard with an active alarm indicator and animated sensor charts.",
      },
      {
        kind: "image",
        src: `${ASSETS}/core-anomaly-detection/model-performance.png`,
        alt: "Model comparison view contrasting four model families.",
      },
      {
        kind: "image",
        src: `${ASSETS}/core-anomaly-detection/dashboard-overview.png`,
        alt: "Overview panel of the CORE monitoring dashboard.",
      },
      {
        kind: "video",
        src: "TODO(media): /media/core-anomaly-detection/demo.mp4",
        srcWebm: "/media/core-anomaly-detection/demo.webm",
        poster: "/media/core-anomaly-detection/demo-poster.jpg",
        alt: "Screen recording of a fault replaying until the detector raises an alarm.",
        shot: "8-15s screen recording. Open the CORE live simulation, pick fault 1 or 4 (both detect reliably), and capture from normal operation through to the alarm indicator firing. Start a couple of seconds before onset so the change is visible. Export MP4 + WebM under 3 MB plus a poster still as demo-poster.jpg, into /public/media/core-anomaly-detection/.",
      },
    ],
    status: "shipped",
    date: "2026-09",
    started: "2026-06",
    featured: true,
    caveat:
      "Built on a simulation benchmark, not on data from a live facility. TEP is a standard proxy for process-plant behaviour; transfer to a specific plant would require re-fitting to that plant's normal operating envelope, and none of these figures should be read as performance on Nigerian infrastructure.",
    attribution:
      "Tennessee Eastman Process simulation data: Rieth, C.A., Amsel, B.D., Tran, R., & Cook, M.B. (2017), Harvard Dataverse. Not redistributed here.",
  },

  /* 6 ------------------------------------------------------------------ */
  {
    slug: "examination-malpractice-study",
    order: 6,
    title: "Causes and Situational Prevention of Examination Malpractice",
    tagline:
      "A B.Sc. research study on examination malpractice in school mathematics, using survey data and inferential statistics.",
    identities: ["researcher", "educator", "data-scientist"],
    objective:
      "Identify what actually drives examination malpractice in school mathematics, and which situational controls plausibly reduce it — grounded in primary data from the people involved rather than in assertion.",
    summary:
      "An undergraduate research study combining instrument design, primary data collection and inferential testing to examine the causes of examination malpractice in school mathematics across Nsit Ibom Local Government Area, and the situational measures that might prevent it. Submitted for the B.Sc. (Ed.) Mathematics degree at the University of Uyo.",
    problem:
      "Examination malpractice is usually treated as a discipline problem to be punished after the fact. Situational prevention asks a different question: which features of the exam setting itself make malpractice easy, and which of those can be changed? TODO(content): add the framing your literature review actually used.",
    approach:
      "A survey study across schools in Nsit Ibom Local Government Area, Akwa Ibom State: an instrument designed for the population, primary data collected directly, and inferential tests applied to the hypotheses. TODO(content): sampling frame, sample size, and how the instrument was validated.",
    method:
      "TODO(content): instrument design, administration and response rate, then the specific tests applied (chi-square, t-test, ANOVA, correlation — whichever you actually ran) and the significance level.",
    outcome:
      "TODO(content): the findings, and the recommendations drawn from them. This is the section a reader will care about most.",
    nextSteps: [
      "TODO(content): what you would change about the study design if you ran it again.",
      "TODO(content): whether any recommendation was adopted, or could be tested in practice.",
    ],
    stack: [
      "Survey design",
      "Inferential statistics",
      "Hypothesis testing",
      "TODO(content): analysis tool — SPSS, Excel, Python?",
    ],
    dataset: {
      name: "Primary survey data",
      source: "Schools in Nsit Ibom Local Government Area, Akwa Ibom State",
      note: "Collected directly for the study. TODO(content): sampling frame and sample size, and whether the responses can be shared in aggregate.",
    },
    metrics: [
      { label: "Respondents", value: "TODO(metric)" },
      { label: "Instrument reliability", value: "TODO(metric)" },
      { label: "Significance level", value: "TODO(metric)" },
      { label: "Hypotheses tested", value: "TODO(metric)" },
    ],
    links: [],
    motionAsset: "findings-chart",
    media: [
      {
        kind: "image",
        src: "TODO(media): /media/examination-malpractice-study/findings-table.png",
        alt: "The study results table, showing each hypothesis and its test statistic.",
        shot: "A clean capture of the results table from the thesis - a screenshot of the typeset table, or a flat evenly lit scan. Crop to the table itself. Save as findings-table.png in /public/media/examination-malpractice-study/. Supplying the underlying numbers too would let the findings chart become real rather than a placeholder.",
      },
    ],
    status: "archived",
    date: "2025-07",
    started: "2024-09",
    featured: false,
    caveat:
      "Undergraduate research. The findings describe the sampled population and should not be generalised beyond it without replication.",
  },
];

export const featuredProjects = projects.filter((project) => project.featured);
