import { NextResponse } from "next/server";
import { trains } from "../../src/data/trains";

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const date = searchParams.get("date");
  const quota = searchParams.get("quota") || "GN";

  const results = trains.filter((t) => {
    const matchRoute =
      (!from || t.from.code === from) && (!to || t.to.code === to);
    const matchQuota = !quota || (t.quotaSupported || []).includes(quota);
    return matchRoute && matchQuota;
  });

  return NextResponse.json({
    query: { from, to, date, quota },
    total: results.length,
    trains: results,
  });
}
