import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock PopUp from react-batch-component-library
jest.mock("react-batch-component-library", () => ({
  __esModule: true,
  PopUp: ({ isOpen, children }: any) => (isOpen ? <div>{children}</div> : null),
}));

// Mock trainSchedules module used by the component
jest.mock("../../app/src/data/trainSchedules", () => ({
  trainSchedules: {
    12345: {
      trainNumber: "12345",
      trainName: "Test Express",
      fromStation: "SRC",
      destinationStation: "DST",
      runsOn: ["M", "T"],
      rows: [
        {
          sn: 1,
          stationCode: "SRC",
          stationName: "Source",
          routeNumber: 1,
          arrivalTime: "—",
          departureTime: "10:00",
          haltMin: 0,
          distanceKm: 0,
          day: 1,
        },
      ],
    },
  },
}));

import TrainSchedulePopup from "./page";

test("renders schedule popup when open and shows schedule details", () => {
  const setOpen = jest.fn();
  const train = {
    number: "12345",
    name: "Test Express",
    depStation: "SRC",
    arrStation: "DST",
  } as any;

  render(
    <TrainSchedulePopup isOpen={true} setIsOpen={setOpen} train={train} />,
  );

  expect(screen.getByText(/Train Schedule/)).toBeInTheDocument();
  expect(screen.getByText(/Train Number/)).toBeInTheDocument();
  expect(screen.getByText(/Test Express/)).toBeInTheDocument();
});
