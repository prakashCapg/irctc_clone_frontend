import { NextResponse } from "next/server";
import { stations } from "../../src/data/stations";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").toLowerCase();

  const filtered = q
    ? stations.filter(
        (s) =>
          s.code.toLowerCase().includes(q) ||
          s.name.toLowerCase().includes(q) ||
          s.city.toLowerCase().includes(q)
      )
    : stations;

  return NextResponse.json({ count: filtered.length, stations: filtered });
}
