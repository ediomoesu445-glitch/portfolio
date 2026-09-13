import type { ResearchFinding } from "./types";

/**
 * The research through-line.
 *
 * Every project on this site produced a finding about *method* as well as a
 * model — usually a finding that made the headline number smaller. Collected
 * here because that pattern is the actual claim of the researcher identity,
 * and it is only visible when the findings sit together.
 *
 * Each entry is sourced from the same committed result files the case studies
 * use. Nothing here is a summary of a summary.
 */
export const researchFindings: ResearchFinding[] = [
  {
    id: "simulator-artefact",
    question: "Is this model learning fraud, or learning the simulator?",
    finding:
      "A single-feature PR-AUC diagnostic, run before modelling, showed one feature reaching 0.9751 PR-AUC on its own against a 0.2965% base rate. It was encoding the data generator's own signature, not fraudulent behaviour. Deleting it and its collinear twin cost 0.1376 PR-AUC across every supervised model.",
    soWhat:
      "The diagnostic costs minutes and the artefact would have survived every conventional check — the tree models barely moved when it was permuted, because a single split recovers it in full. Any write-up quoting the higher figure would have been reporting the simulator.",
    project: "ghost-transaction-detection",
    projectLabel: "Ghost-transaction detection",
    headline: { value: "0.8619", superseded: "0.9995", label: "PR-AUC, artefact-free" },
  },
  {
    id: "self-graded-thresholds",
    question: "Does a detector's flag rate mean anything on data it has not seen?",
    finding:
      "Scored on their own fitting split, an isolation forest and an LSTM autoencoder both hit a 1% target flag rate exactly. On a held-out slice of normal drilling they flagged 4.21% and 33.44% — a 110-fold spread. Recalibrated against unseen normal operation, all three detectors land within 0.15 pp of target.",
    soWhat:
      "Before recalibration, any weighted combination of those detectors was arithmetic on incomparable numbers. Ensembling unsupervised detectors without calibrating them first is a category error, and the self-graded figures hide it completely.",
    project: "anomaly-detection-predictive-maintenance",
    projectLabel: "Anomaly detection",
    headline: {
      value: "33.44%",
      superseded: "1.00%",
      label: "Autoencoder false-flag rate",
    },
  },
  {
    id: "lab-to-field-gap",
    question: "Does clean-benchmark accuracy predict performance in the field?",
    finding:
      "A classifier at 99.63% accuracy on clean held-out images falls to 67.83% mean accuracy across 21 simulated field conditions — motion blur, defocus, noise, low light — and to 42.96% at severe. Measured as a 22-cell grid rather than a single robustness score.",
    soWhat:
      "The headline accuracy was never the contribution: the dataset is clean enough that high accuracy is expected. The measured size of the lab-to-field gap is the part that transfers to a real inspection workflow, and it is the part most papers on this dataset do not report.",
    project: "pipeline-defect-detection",
    projectLabel: "Pipeline defect detection",
    headline: { value: "31.80 pp", label: "Mean accuracy drop under field conditions" },
  },
  {
    id: "skill-not-r2",
    question: "Is this forecast better than predicting that tomorrow matches today?",
    finding:
      "Persistence already scores R² 0.86 to 0.92 on every well in the field, so R² alone cannot distinguish a model from a naive baseline. Scored on skill — the share of the baseline's squared error removed — two wells produced genuinely useful models and one produced none at all. Its manifest records a null winner rather than naming a least-bad model.",
    soWhat:
      "Read the R² column alone and F-11 looks excellent at 0.882. Read the skill column and it is worse than doing nothing. The same model family is best on three wells and worst on another, which is why each well is fitted separately rather than field-wide.",
    project: "energy-asset-digital-twin",
    projectLabel: "Energy asset digital twin",
    headline: { value: "+0.717", label: "Best one-step skill against baseline" },
  },
  {
    id: "examination-malpractice",
    question:
      "What actually drives examination malpractice in school mathematics, and which situational controls reduce it?",
    finding:
      "TODO(content): the findings from the thesis — which causes the data supported, which it did not, and which situational measures the results pointed to.",
    soWhat:
      "Situational prevention asks which features of the exam setting make malpractice easy, rather than treating it as a discipline problem to punish afterwards. TODO(content): what the results implied for practice.",
    project: "examination-malpractice-study",
    projectLabel: "B.Sc. thesis",
    headline: { value: "TODO(metric)", label: "Respondents" },
  },
];

/** The stance the findings above have in common. */
export const researchStance = {
  title: "How I work",
  body: "Four of the five findings here made a headline number smaller. That is the point: a result that only survives on the split it was fitted to is not a result. I run the diagnostic before the model, calibrate against data the model has not seen, score against the naive baseline, and publish the figure that survives — including when the honest answer is that there was nothing to find.",
};
