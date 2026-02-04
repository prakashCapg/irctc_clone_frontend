"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FromAndToComponent from "@/components/FromandTo/page";
import {
  Button,
  DatePickerInput,
  DropDown,
} from "react-batch-component-library";
import { Briefcase } from "react-feather";
import "./TrainSearchBar.css";

export default function TrainSearchBar() {
  const router = useRouter();
  const sp = useSearchParams();

  const [fromQuery, setFromQuery] = useState("");
  const [toQuery, setToQuery] = useState("");
  const [date, setDate] = useState("");
  const [trainclass, setTrainClass] = useState("all");

  useEffect(() => {
    setFromQuery(sp.get("from") ?? "");
    setToQuery(sp.get("to") ?? "");
    setDate(sp.get("date") ?? "");
    setTrainClass(sp.get("class") ?? "all");
  }, [sp]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (fromQuery) params.set("from", fromQuery);
    if (toQuery) params.set("to", toQuery);
    if (date) params.set("date", date);
    if (trainclass !== "all") params.set("class", trainclass);

    router.push(`/train-list?${params.toString()}`);
  };

  const classOptions = [
    { label: "All Classes", value: "all" },
    { label: "AC First Class (1A)", value: "AC First Class (1A)" },
    { label: "AC 2 Tier (2A)", value: "AC 2 Tier (2A)" },
    { label: "AC 3 Tier (3A)", value: "AC 3 Tier (3A)" },
    { label: "Sleeper (SL)", value: "Sleeper (SL)" },
  ];

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
            label="Modify Search"
            type="secondary"
            className="modify-btn"
          />
        </div>
      </div>
    </form>
  );
}
