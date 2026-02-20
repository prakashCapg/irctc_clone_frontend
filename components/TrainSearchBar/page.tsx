"use client";

import { useEffect, useState } from "react";
import FromAndToComponent from "@/components/FromandTo/page";
import {
  Button,
  DatePickerInput,
  DropDown,
} from "react-batch-component-library";
import { Briefcase } from "react-feather";
import "./TrainSearchBar.css";
import { useTrainContext } from "@/app/contexts/TrainContext";

export default function TrainSearchBar() {
  const { trainListData, setTrainListData, searchState, setSearchState } =
    useTrainContext();

  const [fromQuery, setFromQuery] = useState("");
  const [toQuery, setToQuery] = useState("");
  const [date, setDate] = useState("");
  const [trainclass, setTrainClass] = useState("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const hasContext =
      searchState.fromQuery || searchState.toQuery || searchState.date;

    if (hasContext) {
      setFromQuery(searchState.fromQuery ?? "");
      setToQuery(searchState.toQuery ?? "");
      setDate(searchState.date ?? "");
      setTrainClass(searchState.trainclass ?? "all");
      return;
    }

    const cached = sessionStorage.getItem("searchState");
    if (cached) {
      const parsed = JSON.parse(cached);
      setSearchState(parsed);
      setFromQuery(parsed.fromQuery ?? "");
      setToQuery(parsed.toQuery ?? "");
      setDate(parsed.date ?? "");
      setTrainClass(parsed.trainclass ?? "all");
    }
  }, [searchState, setSearchState]);

  const classOptions = [
    { label: "All Classes", value: "all" },
    { label: "AC First Class (1A)", value: "AC First Class (1A)" },
    { label: "AC 2 Tier (2A)", value: "AC 2 Tier (2A)" },
    { label: "AC 3 Tier (3A)", value: "AC 3 Tier (3A)" },
    { label: "Sleeper (SL)", value: "Sleeper (SL)" },
  ];

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = { fromQuery, toQuery, date, trainclass };

    try {
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="compact-searchbar">
      <div className="cs-row">
        <div className="cs-item">
          <FromAndToComponent
            fromQuery={fromQuery}
            setFromQuery={setFromQuery}
            toQuery={toQuery}
            setToQuery={setToQuery}
          />
        </div>

        <div className="cs-item">
          <DatePickerInput
            date={date}
            setDateInput={setDate}
            allowPastDates={false}
          />
        </div>

        <div className="cs-item">
          <DropDown
            options={classOptions}
            selectedValue={trainclass}
            onSelect={setTrainClass}
            placeholder="All Classes"
            leftIcon={<Briefcase size={16} color="#2f80ed" />}
          />
        </div>

        <div className="cs-btn">
          <Button
            label={loading ? "Modifying..." : "Modify Search"}
            type="secondary"
            className="modify-btn"
          />
        </div>
      </div>
    </form>
  );
}
