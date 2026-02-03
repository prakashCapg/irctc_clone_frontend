import { NextRequest, NextResponse } from "next/server";
import { trains } from "@/data/trains";

interface TrainSearch {
  fromQuery: string;
  toQuery: string;
  date: string;
  trainclass: object | string;
}

export async function POST(request: NextRequest) {
  try {
    const body: TrainSearch = await request.json();
    const { fromQuery, toQuery, date, trainclass } = body;
    const stationcoderegex = / - ([A-Z]+)/i;
    const fromStationCode = fromQuery.match(stationcoderegex);
    const toStationCode = toQuery.match(stationcoderegex);
    console.log(
      fromStationCode?.[1]?.toLowerCase(),
      toStationCode?.[1]?.toLowerCase(),
    );

    if (!fromQuery || !toQuery || !date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const availableTrains = trains.filter((train) => {
      return (
        train.depStation?.toLowerCase() ===
          fromQuery.split("-")[0].trim().toLowerCase() &&
        train.arrStation?.toLowerCase() ===
          toQuery.split("-")[0].trim().toLowerCase() &&
        train.depStationCode?.toLowerCase() ===
          fromStationCode?.[1]?.toLowerCase() &&
        train.arrStationCode?.toLowerCase() ===
          toStationCode?.[1]?.toLowerCase() &&
        train.journeyDateISO === date &&
        (trainclass === "all" ||
          train.classes.find((classItem) => classItem.label === trainclass))
      );
    });

    return NextResponse.json(
      {
        success: true,
        trains: availableTrains,
        query: { fromQuery, toQuery, date, trainclass },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Internal Server Error ${error}` },
      { status: 500 },
    );
  }
}
