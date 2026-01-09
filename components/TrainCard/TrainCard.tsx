"use client";

import "./TrainCard.css";
import { Button } from "react-batch-component-library";

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

export default function TrainCard({ train }: { train: TrainData }) {
  return (
    <div className="train-card">
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
        Train Schedule
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

      <div className="train-card__classes">
        {train.classes.map((cls) => (
          <div className="chip" key={cls.code}>
            <div className="chip__title">{cls.label}</div>
            <button
              className="link refresh"
              type="button"
              aria-label={`Refresh ${cls.code}`}
            >
              Refresh ↻
            </button>
          </div>
        ))}
      </div>

      <p className="notice notice--plain">
        <strong>Please check</strong> NTES website or NTES app for actual time
        before boarding
      </p>

      <div className="train-card__actions">
        <Button type="secondary" label="Book Now" />
        <Button type="tertiary" label="OTHER DATES" />
      </div>
    </div>
  );
}
