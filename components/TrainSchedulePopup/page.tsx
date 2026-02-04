"use client";

import React, { useMemo } from "react";
import { PopUp } from "react-batch-component-library";
import "./TrainSchedulePopup.css";

import { trainSchedules } from "../../app/src/data/trainSchedules";
import type { TrainData } from "../TrainCard/TrainCard";

type TrainSchedule = {
  trainNumber: string;
  trainName: string;
  fromStation: string;
  destinationStation: string;
  runsOn: string[];
  rows: {
    sn: number;
    stationCode: string;
    stationName: string;
    routeNumber: number;
    arrivalTime: string;
    departureTime: string;
    haltMin: number;
    distanceKm: number;
    day: number;
  }[];
};

const DAYS = [
  { key: "M", label: "MON" },
  { key: "T", label: "TUE" },
  { key: "W", label: "WED" },
  { key: "Th", label: "THU" },
  { key: "F", label: "FRI" },
  { key: "Sa", label: "SAT" },
  { key: "Su", label: "SUN" },
];

const TrainSchedulePopup = ({
  isOpen,
  setIsOpen,
  train,
}: {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  train: TrainData;
}) => {
  const schedules = trainSchedules as Record<string, TrainSchedule>;
  const schedule = schedules[String(train.number)];

  const runsOnSet = useMemo(() => new Set(schedule?.runsOn ?? []), [schedule]);

  return (
    <PopUp
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      width="95vw"
      minWidth="1100px"
      height="85vh"
      bodyContentHeight={true}
      contentClassName="ts-popupOverride"
    >
      <div className="ts-wrapper">
        <div className="ts-headerBar">
          <span>Train Schedule</span>
          <button
            className="ts-headerClose"
            type="button"
            aria-label="Close"
            onClick={() => setIsOpen(false)}
          >
            ×
          </button>
        </div>

        <div className="ts-gap-xs" />
        <div className="ts-summaryCard">
          <div className="ts-summaryHeader">
            <div>Train Number</div>
            <div>Train Name</div>
            <div>From Station</div>
            <div>Destination Station</div>
            <div>Runs On</div>
          </div>

          <div className="ts-summaryBody">
            <div className="ts-strong">
              {schedule?.trainNumber ?? train.number}
            </div>
            <div className="ts-ucase ts-strong">
              {schedule?.trainName ?? train.name}
            </div>
            <div className="ts-ucase ts-strong">
              {schedule?.fromStation ?? train.depStation}
            </div>
            <div className="ts-ucase ts-strong">
              {schedule?.destinationStation ?? train.arrStation}
            </div>

            <div className="ts-runsOnRow">
              {DAYS.map(({ key, label }) => (
                <span
                  key={key}
                  className={
                    runsOnSet.has(key)
                      ? "ts-badge ts-badge--green"
                      : "ts-badge ts-badge--red"
                  }
                  title={label}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="ts-gap-sm" />

        <div className="ts-tableHeaderRow">
          <div>S.N.</div>
          <div>Station Code</div>
          <div>Station Name</div>
          <div>Route Number</div>
          <div>Arrival Time</div>
          <div>Departure Time</div>
          <div>Halt Time(In minutes)</div>
          <div>Distance</div>
          <div>Day</div>
        </div>

        <div className="ts-tableBody">
          {schedule?.rows?.map((r) => (
            <div className="ts-tableRow" key={r.sn}>
              <div className="ts-td">{r.sn}</div>
              <div className="ts-td">{r.stationCode}</div>
              <div className="ts-td ts-ucase">{r.stationName}</div>
              <div className="ts-td">{r.routeNumber}</div>
              <div className="ts-td">{r.arrivalTime}</div>
              <div className="ts-td">{r.departureTime}</div>
              <div className="ts-td">{r.haltMin}</div>
              <div className="ts-td">{r.distanceKm}</div>
              <div className="ts-td">{r.day}</div>
            </div>
          ))}
        </div>
      </div>
    </PopUp>
  );
};

export default TrainSchedulePopup;
