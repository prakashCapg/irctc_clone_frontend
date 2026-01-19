"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FromAndToComponent from "../../../components/FromandTo/page";
import {
  Button,
  DatePickerInput,
  DropDown,
} from "react-batch-component-library";
import { useForm } from "react-hook-form";

import { Briefcase } from "react-feather";
import "./trainsearch.css";

export default function TrainSearchPage() {
  const router = useRouter();
  const [fromQuery, setFromQuery] = useState<string>("");
  const [toQuery, setToQuery] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [trainclass, setTrainClass] = useState<string>("all");

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

  type Card = { id: number; label: string };

  const items: Card[] = Array.from({ length: 13 }, (_, i) => ({
    id: i + 1,
    label: `Item ${i + 1}`,
  }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (fromQuery) params.set("from", fromQuery);
    if (toQuery) params.set("to", toQuery);
    if (date) params.set("date", date);
    if (trainclass && trainclass !== "all") params.set("class", trainclass);

    console.log(params.toString());
    router.push(`/train-list?${params.toString()}`);
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
