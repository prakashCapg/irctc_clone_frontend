"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TrainSearchPage() {
  const router = useRouter();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (date) params.set("date", date);

    router.push(`/train-list?${params.toString()}`);
  };

  return (
    <section>
      <h1 className="text-2xl font-semibold">Train Search</h1>
      <p className="text-gray-600 mb-4">Find trains between stations.</p>

      <form onSubmit={onSubmit} className="grid gap-3 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            className="border rounded px-3 py-2"
            placeholder="From (e.g., NDLS)"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="To (e.g., BCT)"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
          <input
            className="border rounded px-3 py-2"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded w-fit">
          Search Trains
        </button>
      </form>
    </section>
  );
}
