import { NextResponse } from "next/server";
import { availabilityDb } from "@/data/availability";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const trainNo = searchParams.get("trainNo");
  const date = searchParams.get("date");

  if (!trainNo || !date) {
    return NextResponse.json(
      { error: "trainNo and date are required" },
      { status: 400 }
    );
  }

  const data = availabilityDb?.[trainNo]?.[date] ?? {};

  return NextResponse.json({
    trainNo,
    date,
    availability: data,
  });
}
