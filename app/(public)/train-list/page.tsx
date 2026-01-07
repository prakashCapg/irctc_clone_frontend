"use client";

import { CardWrapper } from "react-batch-component-library";
import "./train-list.css";
import TrainCard, { TrainData } from "@/components/TrainCard/TrainCard";

const train: TrainData = {
  number: "20503",
  name: "RAJDHANI EXP",
  runsOn: ["M", "T", "W", "T", "F", "S", "S"],
  depTime: "01:40",
  depStation: "VARANASI JN",
  depDate: "Mon, 05 Jan",
  duration: "11:58",
  arrTime: "13:38",
  arrStation: "NEW DELHI",
  arrDate: "Mon, 05 Jan",

  classes: [
    { code: "3A", label: "AC 3 Tier (3A)" },
    { code: "2A", label: "AC 2 Tier (2A)" },
    { code: "1A", label: "AC First Class (1A)" },
  ],
};

export default function TrainListPage() {
  return (
    <section className="train-list">
      <CardWrapper height="auto" border="1px solid #e5e7eb"></CardWrapper>

      <div className="content-grid">
        <CardWrapper height="auto" border="1px solid #e5e7eb"></CardWrapper>

        <CardWrapper
          className="card-wrapper"
          height="auto"
          border="1px solid #e5e7eb"
        >
          <TrainCard train={train} />
        </CardWrapper>
      </div>
    </section>
  );
}
