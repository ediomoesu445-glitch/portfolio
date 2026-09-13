import type { MotionAssetId } from "@/content/types";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { Overline } from "@/components/ui/Heading";
import { TodoChip } from "@/components/ui/TodoChip";
import { AnomalyEventTimeline } from "./AnomalyEventTimeline";
import { AnomalyTimeSeries } from "./AnomalyTimeSeries";
import { DashboardMock } from "./DashboardMock";
import { TransactionGraph } from "./TransactionGraph";

/**
 * The comparison the corruption study is actually about: the same input clean
 * and under severe motion blur.
 *
 * The brief asks for a raw-versus-Grad-CAM wipe. The repository has Grad-CAM
 * overlays only inside composite figures, not as a standalone pair, so this
 * shows the pair that does exist and flags the export that would be needed.
 */
function CorruptionSlider() {
  return (
    <figure className="border-line bg-surface border">
      <div className="border-line border-b px-5 py-3">
        <Overline>Clean input · severe motion blur</Overline>
      </div>

      <div className="p-5">
        <BeforeAfterSlider
          aspect="1 / 1"
          label="Reveal the motion-blurred input"
          className="mx-auto max-w-md"
          before={{
            src: "/images/projects/pipeline-defect-detection/input-crazing-clean.jpg",
            alt: "A crazing defect on a clean, sharply imaged steel surface.",
            label: "clean",
          }}
          after={{
            src: "/images/projects/pipeline-defect-detection/input-crazing-motion-blur-severe.png",
            alt: "The same crazing defect under severe simulated motion blur.",
            label: "motion blur, severe",
          }}
        />
      </div>

      <figcaption className="border-line space-y-3 border-t px-5 py-4">
        <p className="text-ink-subtle text-[13px] leading-relaxed">
          Drag the handle, or focus it and use the arrow keys. Accuracy across all
          corrupted conditions falls to 67.83% from 99.63% clean.
        </p>
        <TodoChip value="TODO(media): export a raw ↔ Grad-CAM overlay pair from viz_gradcam.py for a second wipe" />
      </figcaption>
    </figure>
  );
}

/** A placeholder until the thesis figures are supplied. */
function FindingsChart() {
  return (
    <figure className="border-alarm/40 bg-alarm-soft/30 border border-dashed p-10 text-center">
      <p aria-hidden className="text-alarm font-mono text-2xl">
        ◌
      </p>
      <p className="text-ink-muted mt-4 text-sm">
        An animated reveal of the study&rsquo;s key findings goes here.
      </p>
      <div className="mt-4 flex justify-center">
        <TodoChip value="TODO(metric): supply the results table — per-hypothesis test statistics and the response counts to chart" />
      </div>
    </figure>
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
      return <CorruptionSlider />;
    case "transaction-graph":
      return <TransactionGraph />;
    case "dashboard-mock":
      return <DashboardMock />;
    case "findings-chart":
      return <FindingsChart />;
  }
}
