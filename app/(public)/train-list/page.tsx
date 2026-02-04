"use client";

import { useMemo, useState } from "react";
import { CardWrapper, Button } from "react-batch-component-library";
import "./train-list.css";
import TrainCard from "@/components/TrainCard/TrainCard";
import { trains as ALL_TRAINS } from "@/data/trains";
import TrainSearchBar from "@/components/TrainSearchBar/page";
import { useTrainContext } from "@/app/contexts/TrainContext";

const toISO = (d: Date) => d.toISOString().slice(0, 10);
const parseHHMM = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + (m || 0);
};
const addDays = (d: Date, n: number) => {
  const nd = new Date(d);
  nd.setDate(nd.getDate() + n);
  return nd;
};
const formatHeaderDate = (d: Date) =>
  new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);

type SortKey = "DEPARTURE_ASC" | "DEPARTURE_DESC";

export default function TrainListPage() {
  const earliestISO =
    ALL_TRAINS.map((t: any) => t.journeyDateISO)
      .filter(Boolean)
      .sort()[0] ?? toISO(new Date());

  const { trainListData } = useTrainContext();
  console.log("TrainListPage trainListData:", trainListData);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date(earliestISO));
  const [sortKey, setSortKey] = useState<SortKey>("DEPARTURE_ASC");

  const fromStation = trainListData[0]?.depStation || "VARANASI JN";
  const toStation = trainListData[0]?.arrStation || "NEW DELHI";
  const quotaLabel = "General";

  const filtered = useMemo(() => {
    const iso = toISO(selectedDate);
    return ALL_TRAINS.filter((t: any) => t.journeyDateISO === iso);
  }, [selectedDate]);

  const sorted = useMemo(() => {
    const out = [...filtered];
    if (sortKey === "DEPARTURE_ASC") {
      out.sort((a: any, b: any) => parseHHMM(a.depTime) - parseHHMM(b.depTime));
    } else {
      out.sort((a: any, b: any) => parseHHMM(b.depTime) - parseHHMM(a.depTime));
    }
    return out;
  }, [filtered, sortKey]);

  const count = sorted.length;
  const headerText = `${count} Results for ${fromStation} ➜ ${toStation} | ${formatHeaderDate(
    selectedDate,
  )} For Quota | ${quotaLabel}`;
  )}`;

  const toggleSort = () =>
    setSortKey((k) =>
      k === "DEPARTURE_ASC" ? "DEPARTURE_DESC" : "DEPARTURE_ASC",
    );
  const nextDay = () => setSelectedDate((d) => addDays(d, 1));
  const prevDay = () => setSelectedDate((d) => addDays(d, -1));

  return (
    <section className="train-list">
      <CardWrapper
        height="auto"
        border="1px solid #e5e7eb"
        borderRadius="0px"
        padding="0px"
        overflow="hidden"
      >
        <TrainSearchBar />
      </CardWrapper>

      <div className="content-grid">
        <CardWrapper
          height="auto"
          border="1px solid #e5e7eb"
          borderRadius="0px"
        />

            <div className="results-toolbar__right">
              <div className="sort-by_departure">
                <Button
                  type="primary"
                  label="Sort By | Departure"
                  onClick={toggleSort}
                  className="btn-irc sort"
                  borderRadius="2px"
                  padding="10px 14px"
                  backgroundColor="#193c73"
                  color="#ffffff"
                />
              </div>

              <div className="previous_next_day">
                <Button
                  type="tertiary"
                  label="‹ Previous Day"
                  onClick={prevDay}
                  className="btn-irc nav"
                  borderRadius="2px"
                  padding="10px 14px"
                  backgroundColor="#ffffff"
                  color="#111111"
                  border="1px solid #cfd4dc"
                />
                <Button
                  type="tertiary"
                  label="Next Day ›"
                  onClick={nextDay}
                  className="btn-irc nav"
                  borderRadius="2px"
                  padding="10px 14px"
                  backgroundColor="#ffffff"
                  color="#111111"
                  border="1px solid #cfd4dc"
                />
              </div>
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
