"use client";

import type SpeedTestEngine from "@cloudflare/speedtest";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  GaugeIcon,
  RotateCcwIcon,
  TimerIcon,
  WavesIcon,
} from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { MEASUREMENTS } from "@/components/speed-test/measurements";
import { SpeedGauge } from "@/components/speed-test/speed-gauge";
import { Button } from "@/components/ui/button";

type Phase = "idle" | "latency" | "download" | "upload" | "done" | "error";

type Results = {
  download?: number;
  upload?: number;
  latency?: number;
  jitter?: number;
  /** Megabytes transferred by the test. */
  dataMb?: number;
};

const mbps = (bps?: number) => (bps === undefined ? undefined : bps / 1e6);

/**
 * Speed test on Cloudflare's open-source engine. The library loads only
 * when the visitor presses Start: nothing is downloaded or measured before.
 */
export function SpeedTest() {
  const t = useTranslations("SpeedTest");
  const format = useFormatter();
  const [phase, setPhase] = useState<Phase>("idle");
  const [results, setResults] = useState<Results>({});
  const engine = useRef<SpeedTestEngine | null>(null);

  useEffect(() => () => engine.current?.pause(), []);

  async function start() {
    engine.current?.pause();
    setResults({});
    setPhase("latency");

    try {
      const { default: SpeedTest } = await import("@cloudflare/speedtest");
      const test = new SpeedTest({
        autoStart: false,
        measurements: MEASUREMENTS,
      });
      engine.current = test;

      test.onPhaseChange = ({ measurement }) => {
        if (["latency", "download", "upload"].includes(measurement.type))
          setPhase(measurement.type as Phase);
      };
      test.onResultsChange = () => {
        const summary = test.results.getSummary();
        setResults({
          download: mbps(summary.download),
          upload: mbps(summary.upload),
          latency: summary.latency,
          jitter: summary.jitter,
        });
      };
      test.onFinish = (final) => {
        const summary = final.getSummary();
        // Downloads: bytes received (transferSize includes headers). Uploads:
        // the payload sent; transferSize there only counts the small reply.
        const received = final
          .getDownloadBandwidthPoints()
          .reduce(
            (total, point) => total + (point.transferSize || point.bytes),
            0,
          );
        const sent = final
          .getUploadBandwidthPoints()
          .reduce((total, point) => total + point.bytes, 0);
        const bytes = received + sent;
        setResults({
          download: mbps(summary.download),
          upload: mbps(summary.upload),
          latency: summary.latency,
          jitter: summary.jitter,
          dataMb: Math.round(bytes / 1e6),
        });
        setPhase(summary.download === undefined ? "error" : "done");
      };
      test.onError = (message) => console.warn("Speed test:", message);
      test.play();
    } catch (error) {
      console.error("Speed test failed to start", error);
      setPhase("error");
    }
  }

  const running =
    phase === "latency" || phase === "download" || phase === "upload";
  // The dial follows what is being measured; afterwards it shows the download.
  const direction = phase === "upload" ? "upload" : "download";
  const gaugeValue = direction === "upload" ? results.upload : results.download;
  const number = (value: number | undefined, digits = 1) =>
    value === undefined
      ? "–"
      : format.number(value, {
          maximumFractionDigits: value < 10 ? digits : 0,
        });

  const status =
    phase === "idle"
      ? t("idle")
      : phase === "done"
        ? t("done")
        : phase === "error"
          ? t("error")
          : t(`phases.${phase}`);

  const metrics = [
    {
      key: "download",
      label: t("download"),
      value: number(results.download),
      unit: t("mbps"),
      Icon: ArrowDownIcon,
    },
    {
      key: "upload",
      label: t("upload"),
      value: number(results.upload),
      unit: t("mbps"),
      Icon: ArrowUpIcon,
    },
    {
      key: "latency",
      label: t("latency"),
      value: number(results.latency, 0),
      unit: t("ms"),
      Icon: TimerIcon,
    },
    {
      key: "jitter",
      label: t("jitter"),
      value: number(results.jitter),
      unit: t("ms"),
      Icon: WavesIcon,
    },
  ];

  return (
    <div className="flex flex-col items-center gap-8 rounded-3xl border bg-card p-6 md:p-10">
      <SpeedGauge
        mbps={gaugeValue ?? 0}
        value={number(gaugeValue)}
        unit={t("mbps")}
        label={t("gaugeLabel", { direction })}
      />

      <p
        aria-live="polite"
        className="min-h-6 text-center font-semibold"
        data-phase={phase}
      >
        {status}
      </p>

      <Button
        type="button"
        variant={phase === "idle" ? "cta" : "outline"}
        size="lg"
        onClick={start}
        disabled={running}
      >
        {phase === "idle" ? (
          <GaugeIcon aria-hidden />
        ) : (
          <RotateCcwIcon aria-hidden />
        )}
        {phase === "idle" ? t("start") : t("restart")}
      </Button>

      <dl className="grid w-full grid-cols-2 gap-px overflow-hidden rounded-2xl border bg-border md:grid-cols-4">
        {metrics.map(({ key, label, value, unit, Icon }) => (
          <div key={key} className="flex flex-col-reverse gap-1 bg-card p-4">
            <dt className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Icon aria-hidden className="size-4" />
              {label}
            </dt>
            <dd className="text-h3 tabular-nums">
              {value}
              <span className="ms-1 text-sm font-semibold text-muted-foreground">
                {unit}
              </span>
            </dd>
          </div>
        ))}
      </dl>

      {phase === "done" && results.dataMb !== undefined && (
        <p className="text-center text-sm text-muted-foreground">
          {t("dataUsed", { mb: results.dataMb })}
        </p>
      )}
    </div>
  );
}
