"use client";

import { useEffect, useMemo, useState } from "react";
import { CardWrapper } from "react-batch-component-library";
import "./train-list.css";
import TrainCard from "@/components/TrainCard/TrainCard";
import TrainSearchBar from "@/components/TrainSearchBar/page";
import { useTrainContext } from "@/app/contexts/TrainContext";
import SortByMenu, { type SortKey } from "@/components/SortByMenu/SortByMenu";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const parseHHMM = (hhmm: string | undefined): number => {
  if (!hhmm) return Number.POSITIVE_INFINITY;
  const [h, m] = hhmm.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
};

const parseDuration = (hhmm: string | undefined): number => {
  if (!hhmm) return Number.POSITIVE_INFINITY;
  const [h, m] = hhmm.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
};

const arrivalEpochMs = (
  journeyDateISO: string | undefined,
  depTime: string | undefined,
  duration: string | undefined,
): number => {
  if (!journeyDateISO || !depTime || !duration) return Number.POSITIVE_INFINITY;
  const dep = new Date(`${journeyDateISO}T${depTime.padStart(5, "0")}:00`);
  if (isNaN(dep.getTime())) return Number.POSITIVE_INFINITY;
  const mins = parseDuration(duration);
  return dep.getTime() + mins * 60_000;
};

const formatHeaderDate = (iso: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
};

const displayStation = (q: string) => {
  if (!q) return "—";
  return q.split("-")[0].trim() || q;
};

export default function TrainListPage() {
  const { trainListData, setTrainListData, searchState, setSearchState } =
    useTrainContext();

  const [sortKey, setSortKey] = useState<SortKey>(() => {
    return (sessionStorage.getItem("sortKey") as SortKey) ?? "DEPARTURE_ASC";
  });

  useEffect(() => {
    if (trainListData.length === 0) {
      const cachedTrains = sessionStorage.getItem("trainListData");
      const cachedSearch = sessionStorage.getItem("searchState");
      if (cachedTrains) setTrainListData(JSON.parse(cachedTrains));
      if (cachedSearch) setSearchState(JSON.parse(cachedSearch));
    }
  }, [trainListData.length, setTrainListData, setSearchState]);

  const sorted = useMemo(() => {
    const out = [...trainListData];

    const depKey = (t: any) => parseHHMM(t.depTime);
    const durKey = (t: any) => parseDuration(t.duration);
    const arrKey = (t: any) =>
      arrivalEpochMs(t.journeyDateISO, t.depTime, t.duration);

    const tie = (a: any, b: any) =>
      String(a.number).localeCompare(String(b.number));

    out.sort((a: any, b: any) => {
      switch (sortKey) {
        case "DEPARTURE_ASC": {
          const d = depKey(a) - depKey(b);
          return d !== 0 ? d : tie(a, b);
        }
        case "DEPARTURE_DESC": {
          const d = depKey(b) - depKey(a);
          return d !== 0 ? d : tie(a, b);
        }

        case "ARRIVAL_ASC": {
          const d = arrKey(a) - arrKey(b);
          return d !== 0 ? d : tie(a, b);
        }
        case "ARRIVAL_DESC": {
          const d = arrKey(b) - arrKey(a);
          return d !== 0 ? d : tie(a, b);
        }

        case "DURATION_ASC": {
          const d = durKey(a) - durKey(b);
          return d !== 0 ? d : tie(a, b);
        }
        case "DURATION_DESC": {
          const d = durKey(b) - durKey(a);
          return d !== 0 ? d : tie(a, b);
        }

        default:
          return tie(a, b);
      }
    });

    return out;
  }, [trainListData, sortKey]);

  const count = sorted.length;
  const headerText = `${count} Results for ${displayStation(
    searchState.fromQuery,
  )} ➜ ${displayStation(searchState.toQuery)} | ${formatHeaderDate(
    searchState.date,
  )}`;

  const shiftDay = async (delta: number) => {
    if (!searchState.date) return;
    const d = new Date(searchState.date);
    d.setDate(d.getDate() + delta);
    const newISO = d.toISOString().slice(0, 10);

    const payload = { ...searchState, date: newISO };
    setSearchState(payload);

    const res = await fetch("/api/TrainSearchApi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data?.error) return;

    setTrainListData(data.trains);
    sessionStorage.setItem("trainListData", JSON.stringify(data.trains));
    sessionStorage.setItem("searchState", JSON.stringify(payload));
  };

  return (
    <section className="train-list">
      <CardWrapper
        height="auto"
        border="1px solid #e5e7eb"
        borderRadius="0px"
        padding="0px"
        overflow="visible"
      >
        <TrainSearchBar />
      </CardWrapper>

      <div className="content-grid">
        <CardWrapper
          height="auto"
          border="1px solid #e5e7eb"
          borderRadius="0px"
        />

        <div className="results-toolbar results-toolbar--tight">
          <div className="results-toolbar__left">
            <div className="results-headline">{headerText}</div>
          </div>

          <div
            className="results-toolbar__right"
            style={{ display: "flex", gap: 12, alignItems: "center" }}
          >
            <SortByMenu value={sortKey} onChange={setSortKey} />

            <div className="previous_next_day">
              <button
                className="btn-irc nav btn-irc--nav"
                onClick={() => shiftDay(-1)}
                aria-label="Previous Day"
              >
                <ChevronRightIcon className="btn-irc__icon btn-irc__icon--left" />
                <span className="btn-irc__label">Previous Day</span>
              </button>

              <button
                className="btn-irc nav btn-irc--nav"
                onClick={() => shiftDay(1)}
                aria-label="Next Day"
              >
                <span className="btn-irc__label">Next Day</span>
                <ChevronRightIcon className="btn-irc__icon" />
              </button>
            </div>
          </div>
        </div>

        <div className="train-results">
          {count === 0 ? (
            <div className="no-results">Not Available</div>
          ) : (
            sorted.map((train: any) => (
              <CardWrapper
                key={train.number}
                className="card-wrapper"
                height="auto"
                border="1px solid #e5e7eb"
                padding="0px"
                borderRadius="0px"
              >
                <TrainCard train={train} />
              </CardWrapper>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
