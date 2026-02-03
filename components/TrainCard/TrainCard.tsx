"use client";

import { useMemo, useState } from "react";
import "./TrainCard.css";
import { Button, Slider } from "react-batch-component-library";
import Availability, { AvailabilityPick } from "../Availability/Availability";

export type TrainClass = { code: string; label: string };
export type RunsOnItem = string | { key: string; label: string };

export type TrainData = {
  number: string;
  name: string;
  runsOn: RunsOnItem[];
  depTime: string;
  depStation: string;
  depDate: string;
  duration: string;
  arrTime: string;
  arrStation: string;
  arrDate: string;
  classes: TrainClass[];
};

function runsOnKeyLabel(item: RunsOnItem, i: number) {
  return typeof item === "string"
    ? { key: `${item}-${i}`, label: item }
    : {
        key: item.key ?? `day-${i}`,
        label: item.label ?? String(item.key ?? ""),
      };
}

type StatusType = "AVAILABLE" | "WL" | "REGRET" | "NOT_AVAILABLE" | "OTHER";

function getStatusType(text?: string): StatusType {
  if (!text) return "OTHER";
  const t = text.toUpperCase().trim();
  if (t.startsWith("AVAILABLE")) return "AVAILABLE";
  if (t.startsWith("WL")) return "WL";
  if (t.includes("REGRET")) return "REGRET";
  if (t.includes("NOT AVAILABLE") || t.includes("NOTAVAILABLE"))
    return "NOT_AVAILABLE";
  return "OTHER";
}

function statusClass(type: StatusType) {
  switch (type) {
    case "AVAILABLE":
      return "status status--available";
    case "WL":
      return "status status--wl";
    case "REGRET":
    case "NOT_AVAILABLE":
      return "status status--blocked";
    default:
      return "status status--other";
  }
}

function isBookable(text?: string) {
  const type = getStatusType(text);
  return type === "AVAILABLE" || type === "WL";
}

export default function TrainCard({ train }: { train: TrainData }) {
  const [openClass, setOpenClass] = useState<string | null>(null);

  const [pickedByClass, setPickedByClass] = useState<
    Record<string, AvailabilityPick | undefined>
  >({});

  const [lastSelectedClass, setLastSelectedClass] = useState<string | null>(
    null,
  );

  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    window.clearTimeout((showToast as { _t?: number })._t);
    (showToast as { _t?: number })._t = window.setTimeout(
      () => setToast(null),
      2500,
    );
  };

  const anySelected = useMemo(
    () => Object.values(pickedByClass).some(Boolean),
    [pickedByClass],
  );

  const selectedPick = lastSelectedClass
    ? pickedByClass[lastSelectedClass]
    : undefined;

  const handleRefresh = (clsCode: string) => setOpenClass(clsCode);

  const handleCloseAvailability = () => setOpenClass(null);

  const handlePick = (clsCode: string, pick: AvailabilityPick) => {
    setPickedByClass((prev) => ({ ...prev, [clsCode]: pick }));
    setLastSelectedClass(clsCode);
  };

  const handleBookNow = () => {
    if (!anySelected) return;
    if (!selectedPick) {
      showToast("Please select journey class");
      return;
    }
    if (!isBookable(selectedPick.statusText)) {
      showToast("Booking is not allowed for selected class");
      return;
    }
    showToast(
      `Proceed booking: ${selectedPick.classCode} ${selectedPick.statusText}`,
    );
  };

  const handleOtherDates = () => {
    const cls = lastSelectedClass ?? train.classes?.[0]?.code ?? null;
    if (!cls) return;
    setOpenClass(cls);
  };

  return (
    <div className="train-card">
      {toast && <div className="toast">{toast}</div>}

      <div className="train-card__topbar">
        <div className="train-card__title">
          <span className="train-card__corner" />
          <h3 className="train-card__name">
            {train.name} <span className="muted">({train.number})</span>
          </h3>
        </div>

        <div className="train-card__meta">
          <span className="muted">Runs On:</span>
          <ul className="train-card__runs-on">
            {train.runsOn.map((d, i) => {
              const { key, label } = runsOnKeyLabel(d, i);
              return <li key={key}>{label}</li>;
            })}
          </ul>
        </div>

        <div className="train-card__schedule">Train Schedule</div>
      </div>

      <div className="train-card__times-inline">
        <div className="time time--strong">
          {train.depTime} <span className="pipe">|</span>{" "}
          <span className="station">
            {train.depStation} <span className="muted">| {train.depDate}</span>
          </span>
        </div>

        <div className="duration-inline">
          <span className="dash" />
          <span className="muted">{train.duration}</span>
          <span className="dash" />
        </div>

        <div className="time time--strong">
          {train.arrTime} <span className="pipe">|</span>{" "}
          <span className="station">
            {train.arrStation} <span className="muted">| {train.arrDate}</span>
          </span>
        </div>
      </div>

      {openClass ? (
        <Availability
          trainNumber={train.number}
          initialClassCode={openClass}
          pickedByClass={pickedByClass}
          onPick={handlePick}
          onClose={handleCloseAvailability}
        />
      ) : (
        <Slider<TrainClass>
          items={train.classes}
          renderItem={(cls: TrainClass, indexOnPage: number) => {
            const picked = pickedByClass[cls.code];
            const isPicked = !!picked;

            const showGetAvailability = anySelected && !isPicked;

            const type = getStatusType(picked?.statusText);
            const statCls = statusClass(type);

            const openSelected = () => {
              if (isPicked) setOpenClass(cls.code);
            };

            return (
              <div
                key={`${cls.code}-${indexOnPage}`}
                className={`class-card ${isPicked ? "class-card--picked" : ""}`}
                role={isPicked ? "button" : undefined}
                tabIndex={isPicked ? 0 : -1}
                onClick={openSelected}
                onKeyDown={(e) => {
                  if (!isPicked) return;
                  if (e.key === "Enter" || e.key === " ")
                    setOpenClass(cls.code);
                }}
              >
                <div className="class-card__title">
                  <strong>{cls.label}</strong>
                </div>

                {showGetAvailability && (
                  <div className="get-availability">Get Availability</div>
                )}

                {isPicked && (
                  <div className="picked-info">
                    <div className={statCls}>{picked!.statusText}</div>
                    {picked!.fare !== undefined && (
                      <div className="picked-fare">₹ {picked!.fare}</div>
                    )}
                  </div>
                )}

                {!isPicked && (
                  <button
                    className="link refresh"
                    type="button"
                    onClick={() => handleRefresh(cls.code)}
                  >
                    Refresh ↻
                  </button>
                )}
              </div>
            );
          }}
          style={{ backgroundColor: "#f3f4f6" }}
        />
      )}

      <p className="notice notice--plain">
        <strong>Please check</strong> NTES website or NTES app for actual time
        before boarding
      </p>

      <div className="train-card__actions">
        <Button
          type="secondary"
          label="Book Now"
          borderRadius="12px"
          padding="12px"
          disabled={!anySelected}
          onClick={!anySelected ? undefined : handleBookNow}
        />

        <Button
          type="tertiary"
          label="OTHER DATES"
          onClick={handleOtherDates}
        />
      </div>
    </div>
  );
}
