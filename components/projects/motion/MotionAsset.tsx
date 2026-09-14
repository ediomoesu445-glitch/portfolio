import type { MotionAssetId } from "@/content/types";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { Overline } from "@/components/ui/Heading";
import { AblationChart } from "./AblationChart";
import { AnomalyEventTimeline } from "./AnomalyEventTimeline";
import { AnomalyTimeSeries } from "./AnomalyTimeSeries";
import { DashboardMock } from "./DashboardMock";
import { FindingsChart } from "./FindingsChart";
import { TransactionGraph } from "./TransactionGraph";

const PIPELINE = "/media/pipeline-defect-detection";

/**
 * Two wipes for the defect classifier.
 *
 * The first is the one that matters for explainability: the raw input against
 * the Grad-CAM overlay, so a reader can see whether the model attended to the
 * defect or to the background. The second is the robustness story - the same
 * input clean and under severe motion blur.
 *
 * Both are real crops from the project's own committed figures.
 */
function GradCamSliders() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <figure className="border-line bg-surface border">
        <div className="border-line border-b px-5 py-3">
          <Overline>Raw input · Grad-CAM overlay</Overline>
        </div>
        <div className="p-5">
          <BeforeAfterSlider
            aspect="1 / 1"
            label="Reveal the Grad-CAM overlay"
            before={{
              src: `${PIPELINE}/gradcam-raw.png`,
              alt: "A crazing defect on a steel surface, as the model receives it.",
              label: "raw",
            }}
            after={{
              src: `${PIPELINE}/gradcam-overlay.png`,
              alt: "The same image with a Grad-CAM heatmap showing where the model attended.",
              label: "Grad-CAM",
            }}
          />
        </div>
        <figcaption className="border-line text-ink-subtle border-t px-5 py-4 text-[13px] leading-relaxed">
          Drag the handle, or focus it and use the arrow keys. Classified as crazing at
          0.95 confidence, with the heat over the defect rather than the background -
          which is what the saliency check is for.
        </figcaption>
      </figure>

      <figure className="border-line bg-surface border">
        <div className="border-line border-b px-5 py-3">
          <Overline>Clean input · severe motion blur</Overline>
        </div>
        <div className="p-5">
          <BeforeAfterSlider
            aspect="1 / 1"
            label="Reveal the motion-blurred input"
            before={{
              src: `${PIPELINE}/input-crazing-clean.jpg`,
              alt: "A crazing defect on a clean, sharply imaged steel surface.",
              label: "clean",
            }}
            after={{
              src: `${PIPELINE}/input-crazing-motion-blur-severe.png`,
              alt: "The same crazing defect under severe simulated motion blur.",
              label: "motion blur, severe",
            }}
          />
        </div>
        <figcaption className="border-line text-ink-subtle border-t px-5 py-4 text-[13px] leading-relaxed">
          The same input under one of the 21 simulated field conditions. Accuracy across
          all of them falls to 67.83% from 99.63% clean.
        </figcaption>
      </figure>
    </div>
  );
}

/** Resolves a project's declared motion asset to its component. */
export function MotionAsset({ id }: { id: MotionAssetId }) {
  switch (id) {
    case "anomaly-events":
      return <AnomalyEventTimeline />;
    case "anomaly-timeseries":
      return <AnomalyTimeSeries />;
    case "gradcam-slider":
      return <GradCamSliders />;
    case "transaction-graph":
      return (
        <div className="grid gap-6">
          <AblationChart />
          <TransactionGraph />
        </div>
      );
    case "dashboard-mock":
      return <DashboardMock />;
    case "findings-chart":
      return <FindingsChart />;
  }
}
