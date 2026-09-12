import type { Project } from "./types";

/**
 * The four portfolio projects.
 *
 * Every figure here is transcribed from a committed result file in the source
 * repository — `reports/` CSVs, per-well `manifest.json` files, or `reports/REPORT.md`.
 * The machine-readable versions live in ./metrics/ and drive the charts.
 * Nothing is estimated. Where a claim could not be sourced it is a TODO.
 *
 * Screen recordings are the one asset class that cannot be produced from the
 * repos: they are marked `TODO(media)` and must be captured by running each app.
 */
export const projects: Project[] = [
  {
    slug: "ghost-transaction-detection",
    title: "Ghost Transaction Detection for Energy-Sector Finance",
    tagline:
      "Ranking reconciliation records so limited investigative capacity goes to the ones most worth opening.",
    identities: ["data-scientist", "ai-engineer"],
    summary:
      "Detection of fraudulent and ghost transactions in energy-sector financial flows. The method is developed and validated on labelled synthetic data, and designed to run unsupervised on the real, unlabelled deployment target. Every output is an investigative lead for human review, never a determination of fraud.",
    problem:
      "Energy-sector revenue flows pass through a reconciliation chain — operator declarations, regulator records, remittances to government. Gaps in that chain can be benign (timing, classification, exchange-rate treatment) or can indicate transactions that never corresponded to real economic activity. The aim is to point limited investigative capacity at the records most worth examining.",
    approach:
      "Two tracks in parallel: a supervised model for method development where labels exist, and label-free detectors (autoencoder, explainable rules, LOF, isolation forest) for the unlabelled target. A single-feature PR-AUC diagnostic exposed a simulator artefact that was inflating every supervised score.",
    outcome:
      "Deleting that artefact and its collinear twin cost 0.1376 PR-AUC — 0.9995 down to 0.8619. That deletion is the single most important result in the project: the higher number was measuring the simulator's own generator signature, not fraudulent behaviour. The label-free ghost-destination rule is the most transferable result, because the deployment target has no labels to train against.",
    stack: ["Python", "XGBoost", "scikit-learn", "SHAP", "pandas", "Streamlit"],
    metrics: [
      {
        label: "PR-AUC, artefact-free",
        value: "0.8619",
        method: "XGBoost on the held-out PaySim test split, artefact features removed.",
      },
      {
        label: "Recall @ precision ≥ 0.90",
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
    media: [
      {
        kind: "image",
        src: "/images/projects/ghost-transaction-detection/pr-curves-ablated.png",
        alt: "Precision-recall curves for XGBoost, Random Forest and Logistic Regression after the simulator artefact was removed.",
      },
      {
        kind: "image",
        src: "/images/projects/ghost-transaction-detection/ghost-destination-lift.png",
        alt: "Lift chart for the label-free ghost-destination rule against the base fraud rate.",
      },
      {
        kind: "image",
        src: "/images/projects/ghost-transaction-detection/shap-beeswarm.png",
        alt: "SHAP beeswarm plot showing which features drive individual fraud scores.",
      },
      {
        kind: "image",
        src: "/images/projects/ghost-transaction-detection/feature-importance.png",
        alt: "XGBoost feature importance ranking for the artefact-free model.",
      },
      {
        kind: "video",
        src: "TODO(media): capture a ~20s recording of the Streamlit review queue (app.py)",
        alt: "Screen recording of the analyst review queue, ranking transactions by fraud score.",
      },
    ],
    status: "research",
    date: "2026-09",
    started: "2026-08",
    featured: true,
    caveat:
      "All reported figures are synthetic-proxy performance on PaySim, an upper bound on method quality rather than a claim about energy-sector data. PaySim is synthetic mobile-money data and does not become energy-sector data by being used here. Transfer to real regulator records has not been attempted, and the deployment target has no labels, so precision and recall can never be computed there.",
  },

  {
    slug: "pipeline-defect-detection",
    title: "Steel Surface Defect Classifier for Pipeline Visual Inspection",
    tagline:
      "Six-class defect classification with Grad-CAM, measured against simulated field-imaging conditions.",
    identities: ["ai-engineer"],
    summary:
      "A ResNet18 classifier that assigns a steel surface image to one of six defect classes, with Grad-CAM saliency overlays and a corruption-robustness evaluation. Built as a proof-of-concept for the visual-inspection layer of a pipeline-integrity workflow.",
    problem:
      "Pipeline integrity management relies on in-line inspection — magnetic flux leakage and ultrasonic testing — as the authoritative source for wall loss and defect depth. Separately, operators run visual surveys: right-of-way patrols, drone and CCTV footage, station and riser inspections. Those surveys generate far more imagery than anyone can review.",
    approach:
      "Leakage-controlled splits committed to configs/splits.json so results reproduce across machines, 5-fold cross-validation, ONNX export for CPU inference, Grad-CAM including failure cases, and a 22-cell corruption grid covering seven corruptions at three severities.",
    outcome:
      "The headline accuracy is not the contribution — the dataset is small and clean enough that high accuracy is expected. The contribution is the measured lab-to-field gap: a model at 99.63% clean accuracy falls to 67.83% mean accuracy across 21 simulated corrupted conditions, and to 42.96% at severe. In-distribution accuracy on a clean benchmark does not predict field performance.",
    stack: ["Python", "PyTorch", "ResNet18", "Grad-CAM", "ONNX", "Gradio"],
    metrics: [
      {
        label: "Held-out test accuracy",
        value: "0.9963",
        method: "270-image test split, leakage-controlled.",
      },
      {
        label: "5-fold cross-validation",
        value: "0.9987 ± 0.0029",
        method: "Mean ± standard deviation of validation accuracy across folds.",
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
          "Halted by available compute, not method. Scripts resume from partial progress.",
      },
    ],
    links: [
      {
        label: "Repository",
        href: "https://github.com/ediomoesu445-glitch/AI-Powered-Pipeline-Defect-Detection-System",
        kind: "repo",
      },
    ],
    media: [
      {
        kind: "image",
        src: "/images/projects/pipeline-defect-detection/gradcam-by-class.png",
        alt: "Grad-CAM saliency overlays for each of the six defect classes, showing where the model attends.",
      },
      {
        kind: "image",
        src: "/images/projects/pipeline-defect-detection/gradcam-failures.png",
        alt: "Grad-CAM overlays for misclassified images, showing where the model attended when it was wrong.",
      },
      {
        kind: "image",
        src: "/images/projects/pipeline-defect-detection/robustness-heatmap.png",
        alt: "Heatmap of classification accuracy across seven corruption types at three severities.",
      },
      {
        kind: "image",
        src: "/images/projects/pipeline-defect-detection/confusion-matrix.png",
        alt: "Confusion matrix for the six defect classes on the held-out test set.",
      },
      {
        kind: "image",
        src: "/images/projects/pipeline-defect-detection/robustness-examples.png",
        alt: "Example images under each simulated corruption, from mild to severe.",
      },
      {
        kind: "video",
        src: "TODO(media): capture a ~20s recording of the Gradio demo (app/app.py) — see docs/SCREENSHOTS.md for the shot list",
        alt: "Screen recording of the demo classifying an image and showing its Grad-CAM overlay.",
      },
    ],
    status: "in-progress",
    date: "2026-09",
    started: "2026-08",
    featured: true,
    caveat:
      "Trained on the NEU surface-defect dataset, which is steel surface imagery rather than pipeline imagery. Visual inspection complements in-line inspection (MFL, ultrasonic) and does not replace it for wall-thickness or defect-depth assessment. The backbone benchmark is 2 of 5 complete and the cross-backbone robustness comparison has not been run.",
  },

  {
    slug: "core-anomaly-detection",
    title: "CORE — Anomaly Detection for Petroleum Process Facilities",
    tagline:
      "A two-tier screener and classifier watching 52 process variables across 20 fault types.",
    identities: ["data-scientist", "ai-engineer"],
    summary:
      "Fault detection built on the Tennessee Eastman Process benchmark, which simulates a chemical and petroleum process plant. A PCA-MSPC screener flags any deviation from normal operation in real time; a LightGBM classifier then confirms whether the deviation is a real fault, which is what keeps the false-alarm rate low enough for an operator to trust.",
    problem:
      "Process plants generate continuous multivariate sensor data in which faults are rare, varied and easy to miss. A detector that alarms too often is switched off by the people it is meant to help, so the operating constraint is false-alarm rate, not raw accuracy.",
    approach:
      "Two tiers. Tier one is PCA-based multivariate statistical process control — Hotelling's T² and Q statistics with control limits — which needs no fault labels and reacts immediately. Tier two is a LightGBM classifier that confirms the deviation. Four model families were compared, and per-fault detection rates were measured across all 20 fault types rather than reported as a single average.",
    outcome:
      "The LightGBM tier raises an alarm that is correct 99.50% of the time, at a 1.32% false-alarm rate. Detection rate across all faults is 65.77%, and the per-fault breakdown shows why an average would mislead: several faults are near-undetectable in this benchmark while most are caught reliably.",
    stack: ["Python", "LightGBM", "scikit-learn", "SciPy", "Streamlit", "Matplotlib"],
    metrics: [
      {
        label: "Alarm precision",
        value: "99.50%",
        method: "LightGBM tier; proportion of raised alarms that were real faults.",
      },
      {
        label: "Fault detection rate",
        value: "65.77%",
        method: "Recall across all 20 fault types.",
      },
      {
        label: "False alarm rate",
        value: "1.32%",
        method: "Proportion of fault-free samples that raised an alarm.",
      },
      {
        label: "ROC-AUC",
        value: "0.8497",
        method: "LightGBM tier on the TEP test split.",
      },
    ],
    links: [
      {
        label: "Repository",
        href: "https://github.com/ediomoesu445-glitch/CORE-ANOMALY-DETECTION-DEMO",
        kind: "repo",
      },
    ],
    media: [
      {
        kind: "image",
        src: "/images/projects/core-anomaly-detection/live-simulation-alarm.png",
        alt: "The live simulation dashboard with an active alarm indicator and animated sensor charts.",
      },
      {
        kind: "image",
        src: "/images/projects/core-anomaly-detection/mspc-control-charts.png",
        alt: "Hotelling's T-squared and Q control charts with upper control limits marked.",
      },
      {
        kind: "image",
        src: "/images/projects/core-anomaly-detection/mspc-heatmap-all.png",
        alt: "Heatmap of detection rate for every model across all 20 fault types.",
      },
      {
        kind: "image",
        src: "/images/projects/core-anomaly-detection/model-performance.png",
        alt: "Model comparison view of the dashboard, contrasting four model families.",
      },
      {
        kind: "image",
        src: "/images/projects/core-anomaly-detection/dashboard-overview.png",
        alt: "Overview panel of the CORE monitoring dashboard.",
      },
      {
        kind: "video",
        src: "TODO(media): capture a ~30s recording of the live simulation replaying a fault until the alarm fires",
        alt: "Screen recording of a fault scenario replaying until the detector raises an alarm.",
      },
    ],
    status: "shipped",
    date: "2026-09",
    started: "2026-06",
    featured: true,
    caveat:
      "Built on the Tennessee Eastman Process simulation benchmark, not on data from a live facility. TEP is an industry-standard proxy for process-plant behaviour; transfer to a specific plant would require re-fitting to that plant's normal operating envelope.",
    attribution:
      "Tennessee Eastman Process simulation data: Rieth, C.A., Amsel, B.D., Tran, R., & Cook, M.B. (2017), Harvard Dataverse. Not redistributed here.",
  },

  {
    slug: "energy-asset-digital-twin",
    title: "Energy Asset Digital Twin & Monitoring Platform",
    tagline:
      "Production forecasting, drilling anomaly detection and a replay dashboard over one real field dataset.",
    identities: ["data-scientist", "ai-engineer"],
    summary:
      "Three modules on the Equinor Volve field dataset: per-well oil-rate forecasting evaluated against naive baselines, unsupervised anomaly detection on a drilling log, and a digital-twin dashboard with a documented health index and a historical replay simulator. Everything produces decision support for a human, never an automated verdict.",
    problem:
      "Production and drilling data are abundant, but a forecast that looks accurate can be worthless: predicting that tomorrow matches today already scores R² 0.86–0.92 on every well in this field. Any model that reports R² alone will look competent while adding nothing.",
    approach:
      "Five forecasting families per well — Arps decline-curve, ARIMA, Prophet, XGBoost and LSTM — fitted separately and scored on skill against the regime's naive baseline, not on R². Anomaly detection combines an isolation forest, an LSTM autoencoder, SPC charts and a stuck-pipe heuristic into a single reviewable event list.",
    outcome:
      "Reporting skill instead of R² changed the conclusion. Two wells produced genuinely useful models (+0.72 and +0.66 skill one step ahead); on one well no model beat persistence at all, so its manifest records a null winner rather than naming a least-bad model. On the drilling log, seven anomaly events survived review, totalling 5.5 minutes, all during genuine drilling.",
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
    media: [
      {
        kind: "image",
        src: "/images/projects/energy-asset-digital-twin/dashboard-field-overview.png",
        alt: "Field overview panel of the digital-twin dashboard, showing per-well production and condition indicators.",
      },
      {
        kind: "image",
        src: "/images/projects/energy-asset-digital-twin/forecast-f12.png",
        alt: "Actual versus forecast oil rate for well 15/9-F-12.",
      },
      {
        kind: "image",
        src: "/images/projects/energy-asset-digital-twin/dashboard-drilling-anomaly.png",
        alt: "Drilling anomaly panel with flagged channels and an anomaly banner.",
      },
      {
        kind: "image",
        src: "/images/projects/energy-asset-digital-twin/anomaly-event.png",
        alt: "The highest-scoring drilling anomaly event, shown against the surrounding channel data.",
      },
      {
        kind: "video",
        src: "TODO(media): capture a ~30s recording of the replay simulator jumping to an anomaly event",
        alt: "Screen recording of the replay simulator seeking to a flagged drilling event.",
      },
    ],
    status: "shipped",
    date: "2026-09",
    started: "2026-08",
    featured: true,
    caveat:
      "A non-commercial learning proof-of-concept. Forecast quality varies sharply by well: the same model family is best on three wells and worst on another, which is why each well is fitted separately rather than field-wide.",
    attribution:
      "Built on the Volve dataset, released by Equinor Energy AS, ExxonMobil Exploration and Production Norway AS and Bayerngas Norge AS under non-commercial CC BY-NC-SA-style terms. Not affiliated with or endorsed by Equinor or the Volve licence partners. No dataset files are redistributed.",
  },
];

export const featuredProjects = projects.filter((project) => project.featured);
