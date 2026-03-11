import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

// Mock Slider from react-batch-component-library so renderItem outputs are used
jest.mock("react-batch-component-library", () => ({
  __esModule: true,
  Slider: ({ items, renderItem }: any) => (
    <div>
      {items.map((it: any, i: number) => (
        <div key={i}>{renderItem(it, i)}</div>
      ))}
    </div>
  ),
}));

import Availability from "./Availability.tsx";

test("renders availability and allows picking a date", async () => {
  const onPick = jest.fn();
  const onClose = jest.fn();

  render(
    <Availability
      trainNumber="20503"
      initialClassCode="SL"
      pickedByClass={{}}
      onPick={onPick}
      onClose={onClose}
      useApi={false}
    />,
  );

  // availability renders buttons for dates; pick the first button
  const buttons = Array.from(document.querySelectorAll(".date-card"));
  expect(buttons.length).toBeGreaterThan(0);
  const user = userEvent.setup();
  await user.click(buttons[0]);

  expect(onPick).toHaveBeenCalled();
});
