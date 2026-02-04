// components/TrainCard/TrainCard.tsx
"use client";

import { useMemo, useState } from "react";
import "./TrainCard.css";
import { Button, Slider } from "react-batch-component-library";
import Availability, { AvailabilityPick } from "../Availability/Availability";
import TrainSchedulePopup from "../TrainSchedulePopup/page";

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

const CANONICAL_DAYS: { key: string; label: string }[] = [
  { key: "M", label: "M" },
  { key: "T", label: "T" },
  { key: "W", label: "W" },
  { key: "Th", label: "T" },
  { key: "F", label: "F" },
  { key: "Sa", label: "S" },
  { key: "Su", label: "S" },
];

function normalizeRunsOnSet(items: RunsOnItem[]): Set<string> {
  const set = new Set<string>();

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    if (typeof item === "string") {
      const raw = item.trim().toUpperCase();

      if (["M", "T", "W", "F"].includes(raw)) {
        set.add(raw);
        continue;
      }
      if (raw === "TH") {
        set.add("Th");
        continue;
      }
      if (raw === "SA") {
        set.add("Sa");
        continue;
      }
      if (raw === "SU") {
        set.add("Su");
        continue;
      }

      if (/^MON/.test(raw)) {
        set.add("M");
        continue;
      }
      if (/^TUE/.test(raw)) {
        set.add("T");
        continue;
      }
      if (/^WED/.test(raw)) {
        set.add("W");
        continue;
      }
      if (/^THU/.test(raw)) {
        set.add("Th");
        continue;
      }
      if (/^FRI/.test(raw)) {
        set.add("F");
        continue;
      }
      if (/^SAT/.test(raw)) {
        set.add("Sa");
        continue;
      }
      if (/^SUN/.test(raw)) {
        set.add("Su");
        continue;
      }

      if (raw === "T") {
        set.add("T");
        set.add("Th");
        continue;
      }
      if (raw === "S") {
        set.add("Sa");
        set.add("Su");
        continue;
      }
    } else {
      const fromKeyOrLabel = (item.key ?? item.label ?? "")
        .trim()
        .toUpperCase();
      if (!fromKeyOrLabel) continue;

      if (["M", "T", "W", "F"].includes(fromKeyOrLabel)) {
        set.add(fromKeyOrLabel);
        continue;
      }
      if (fromKeyOrLabel === "TH") {
        set.add("Th");
        continue;
      }
      if (fromKeyOrLabel === "SA") {
        set.add("Sa");
        continue;
      }
      if (fromKeyOrLabel === "SU") {
        set.add("Su");
        continue;
      }

      if (/^MON/.test(fromKeyOrLabel)) {
        set.add("M");
        continue;
      }
      if (/^TUE/.test(fromKeyOrLabel)) {
        set.add("T");
        continue;
      }
      if (/^WED/.test(fromKeyOrLabel)) {
        set.add("W");
        continue;
      }
      if (/^THU/.test(fromKeyOrLabel)) {
        set.add("Th");
        continue;
      }
      if (/^FRI/.test(fromKeyOrLabel)) {
        set.add("F");
        continue;
      }
      if (/^SAT/.test(fromKeyOrLabel)) {
        set.add("Sa");
        continue;
      }
      if (/^SUN/.test(fromKeyOrLabel)) {
        set.add("Su");
        continue;
      }

      if (fromKeyOrLabel === "T") {
        set.add("T");
        set.add("Th");
        continue;
      }
      if (fromKeyOrLabel === "S") {
        set.add("Sa");
        set.add("Su");
        continue;
      }
    }
  }

  return set;
}

export default function TrainCard({ train }: { train: TrainData }) {
  const [openClass, setOpenClass] = useState<string | null>(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  const [pickedByClass, setPickedByClass] = useState<
    Record<string, AvailabilityPick | undefined>
  >({});

  const [lastSelectedClass, setLastSelectedClass] = useState<string | null>(
    null
  );

  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    window.clearTimeout((showToast as { _t?: number })._t);
    (showToast as { _t?: number })._t = window.setTimeout(
      () => setToast(null),
      2500
    );
  };

  const anySelected = useMemo(
    () => Object.values(pickedByClass).some(Boolean),
    [pickedByClass]
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
      `Proceed booking: ${selectedPick.classCode} ${selectedPick.statusText}`
    );
  };

  const handleOtherDates = () => {
    const cls = lastSelectedClass ?? train.classes?.[0]?.code ?? null;
    if (!cls) return;
    setOpenClass(cls);
  };

  const runsOnSet = useMemo(
    () => normalizeRunsOnSet(train.runsOn),
    [train.runsOn]
  );

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

        <div
          className="train-card__meta"
          aria-label="Train runs on days of the week"
        >
          <span className="muted">Runs On:</span>
          <ul className="train-card__runs-on" role="list">
            {CANONICAL_DAYS.map(({ key, label }) => {
              const active = runsOnSet.has(key);
              return (
                <li
                  key={key}
                  className={`runs-on__day ${
                    active ? "runs-on__day--active" : "runs-on__day--muted"
                  }`}
                >
                  {label}
                </li>
              );
            })}
          </ul>
        </div>

        <div
          className="train-card__schedule"
          onClick={() => setIsScheduleOpen(true)}
          style={{ cursor: "pointer", fontWeight: "700", color: "#478be3" }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setIsScheduleOpen(true);
          }}
        >
          Train Schedule
        </div>
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
                    onClick={() => setOpenClass(cls.code)}
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

      {/* Train Schedule Popup */}
      <TrainSchedulePopup
        isOpen={isScheduleOpen}
        setIsOpen={setIsScheduleOpen}
        train={train}
      />
    </div>
  );
}
