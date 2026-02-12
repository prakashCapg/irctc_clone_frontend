"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Slider } from "react-batch-component-library";
import "./Availability.css";
import { availabilityDb } from "@/data/availability";
import CloseIcon from "@mui/icons-material/Close";

export type AvailabilityPick = {
  classCode: string;
  dateLabel: string;
  statusText: string;
  fare?: number;
};

type DateOption = {
  dateLabel: string;
  statusText: string;
  fare?: number;
};

function getClassCodeFromTabLabel(label: string) {
  const match = label.match(/\(([^)]+)\)/);
  return match?.[1] ?? label;
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

const CLASS_LABEL_MAP: Record<string, string> = {
  "3A": "AC 3 Tier (3A)",
  "2A": "AC 2 Tier (2A)",
  "1A": "AC First Class (1A)",
  SL: "Sleeper (SL)",
  "2S": "Second Sitting (2S)",
  CC: "Chair Car (CC)",
  EC: "Executive Chair Car (EC)",
};

export default function Availability({
  trainNumber,
  initialClassCode,
  pickedByClass,
  onPick,
  onClose,
  useApi = false, // optional: future API support
}: {
  trainNumber: string;
  initialClassCode: string;
  pickedByClass: Record<string, AvailabilityPick | undefined>;
  onPick: (classCode: string, pick: AvailabilityPick) => void;
  onClose: () => void;
  useApi?: boolean;
}) {
  const availabilityStore = availabilityDb as Record<
    string,
    Record<string, DateOption[]>
  >;

  // Local fallback dataset
  const rawLocal = useMemo(
    () => availabilityStore[trainNumber] ?? {},
    [trainNumber],
  );

  // If useApi=true, we load remote into rawRemote
  const [rawRemote, setRawRemote] = useState<Record<string, DateOption[]>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!useApi) return;
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/availability?trainNo=${trainNumber}`);
        const json = await res.json();
        if (!alive) return;

        // Expecting { availability: { "3A": [...], "2A": [...] } }
        setRawRemote(json?.availability ?? {});
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [useApi, trainNumber]);

  const rawData = useApi ? rawRemote : rawLocal;

  const tabData = useMemo(() => {
    const result: Record<string, DateOption[]> = {};
    Object.entries(rawData).forEach(([cls, dates]) => {
      const tabLabel = CLASS_LABEL_MAP[cls] ?? cls;
      result[tabLabel] = dates as DateOption[];
    });
    return result;
  }, [rawData]);

  const tabs = Object.keys(tabData);

  const initialTab =
    tabs.find((t) => t.includes(initialClassCode)) ??
    CLASS_LABEL_MAP[initialClassCode] ??
    initialClassCode;

  const [activeTab, setActiveTab] = useState<string>(initialTab);

  const classCode = getClassCodeFromTabLabel(activeTab);
  const picked = pickedByClass[classCode];

  return (
    <div className="availability-panel">
      <div className="availability-panel__top">
        <div className="availability-tabs" role="tablist" aria-label="Classes">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              className={`availability-tab ${tab === activeTab ? "is-active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="availability-close"
          aria-label="Close availability"
          onClick={onClose}
        >
          {/* Normalize the icon via CSS classes instead of inline styles */}
          <CloseIcon className="availability-close__icon" />
        </button>
      </div>

      <div className="availability-panel__content">
        {loading ? (
          <div style={{ padding: 16 }}>Loading availability...</div>
        ) : tabs.length === 0 ? (
          <div style={{ padding: 16 }}>
            Availability data not found for train {trainNumber}.
          </div>
        ) : (
          <Slider<DateOption>
            items={tabData[activeTab]}
            renderItem={(opt: DateOption, idx: number) => {
              const type = getStatusType(opt.statusText);
              const statCls = statusClass(type);

              const isPicked =
                picked?.dateLabel === opt.dateLabel &&
                picked?.statusText.toUpperCase() ===
                  opt.statusText.toUpperCase();

              return (
                <button
                  key={`${opt.dateLabel}-${idx}`}
                  type="button"
                  className={`date-card ${isPicked ? "date-card--picked" : ""}`}
                  onClick={() =>
                    onPick(classCode, {
                      classCode,
                      dateLabel: opt.dateLabel,
                      statusText: opt.statusText,
                      fare: opt.fare,
                    })
                  }
                >
                  <div className="date-card__date">{opt.dateLabel}</div>
                  <div className={`date-card__status ${statCls}`}>
                    {opt.statusText}
                  </div>
                </button>
              );
            }}
            style={{ backgroundColor: "white" }}
          />
        )}
      </div>

      <div className="availability-footer">
        Dynamic Pricing is applicable in this train. Fare may increase at the
        time of booking.
      </div>
    </div>
  );
}
