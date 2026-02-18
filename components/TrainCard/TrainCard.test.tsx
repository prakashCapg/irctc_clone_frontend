import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

// Mock Slider, Availability, Button and TrainSchedulePopup
jest.mock("react-batch-component-library", () => ({
  __esModule: true,
  Slider: ({ items, renderItem }: any) => (
    <div>
      {items.map((it: any, i: number) => (
        <div key={i}>{renderItem(it, i)}</div>
      ))}
    </div>
  ),
  Button: (props: any) => (
    <button
      data-testid={`btn-${props.label}`}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.label}
    </button>
  ),
}));

jest.mock("../TrainSchedulePopup/page", () => ({
  __esModule: true,
  default: (props: any) => (
    <div data-testid="train-schedule" data-open={String(!!props.isOpen)} />
  ),
}));

jest.mock("../Availability/Availability", () => ({
  __esModule: true,
  default: () => <div data-testid="availability-mock" />,
}));

import TrainCard from "./TrainCard";

const sampleTrain = {
  number: "12345",
  name: "Express",
  runsOn: ["M", "T"],
  depTime: "10:00",
  depStation: "SRC",
  depDate: "15 Feb",
  duration: "02:00",
  arrTime: "12:00",
  arrStation: "DST",
  arrDate: "15 Feb",
  classes: [{ code: "SL", label: "Sleeper (SL)" }],
};

test("renders TrainCard and schedule popup toggles on click", async () => {
  render(<TrainCard train={sampleTrain} />);
  expect(screen.getByText(/Express/)).toBeInTheDocument();

  const schedule = screen.getByText(/Train Schedule/i);
  const user = userEvent.setup();
  await user.click(schedule);

  // mocked TrainSchedulePopup should now be rendered with isOpen true
  const popup = screen.getByTestId("train-schedule");
  expect(popup).toBeInTheDocument();
  expect(popup).toHaveAttribute("data-open", "true");

  // Book Now button should be present and disabled (no selection)
  const bookBtn = screen.getByTestId("btn-Book Now");
  expect(bookBtn).toBeInTheDocument();
  expect(bookBtn).toBeDisabled();
});
