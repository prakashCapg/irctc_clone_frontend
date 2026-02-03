"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FromAndToComponent from "../../../components/FromandTo/page";
import {
  Button,
  DatePickerInput,
  DropDown,
} from "react-batch-component-library";
import { Briefcase } from "react-feather";
import "./trainsearch.css";
import { useTrainContext } from "@/app/contexts/TrainContext";

export default function TrainSearchPage() {
  const router = useRouter();
  const [fromQuery, setFromQuery] = useState<string>("");
  const [toQuery, setToQuery] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [trainclass, setTrainClass] = useState<string>("all");
  const { setTrainListData } = useTrainContext();

  type DropDownOption = {
    label: string;
    value: string;
    icon?: React.ReactNode;
  };

  const options: DropDownOption[] = [
    { label: "AC First Class (1A)", value: "AC First Class (1A)" },
    { label: "AC 2 Tier (2A)", value: "AC 2 Tier (2A)" },
    { label: "AC 3 Tier (3A)", value: "AC 3 Tier (3A)" },
    { label: "Sleeper (SL)", value: "Sleeper (SL)" },
    { label: "General (GN)", value: "General (GN)" },
    { label: "AC 3 Economy (3E)", value: "AC 3 Economy (3E)" },
    { label: "First Class (FC)", value: "First Class (FC)" },
  ];

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("api/TrainSearchApi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fromQuery: fromQuery,
        toQuery: toQuery,
        date: date,
        trainclass: trainclass,
      }),
    });
    const data = await res.json();
    console.log(data.trains);
    setTrainListData(data.trains);
    {
      data.error ? "" : router.push(`/train-list`);
    }
  };

  return (
    <section>
      <form onSubmit={onSubmit} className="grid gap-3 max-w-2xl">
        <div className="trainsearchcard">
          <div className="book-ticket-heading">
            <h1>BOOK TICKET</h1>
          </div>
          <FromAndToComponent
            fromQuery={fromQuery}
            setFromQuery={setFromQuery}
            toQuery={toQuery}
            setToQuery={setToQuery}
          />
          <div className="date-dropdown">
            <DatePickerInput
              date={date}
              setDateInput={setDate}
              allowPastDates={false}
            />
            <DropDown
              options={options}
              selectedValue={trainclass}
              onSelect={setTrainClass}
              placeholder="All Classes"
              leftIcon={<Briefcase size={16} color="#2f80ed" />}
            />
          </div>
          <div className="Form-submit">
            <Button label="Search Trains" type="secondary" />
          </div>
        </div>
      </form>
    </section>
  );
}
