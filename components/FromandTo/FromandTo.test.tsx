import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

// Mock SearchInput from react-batch-component-library used by the component
jest.mock("react-batch-component-library", () => ({
  __esModule: true,
  SearchInput: (props: any) => (
    <div>
      <input
        data-testid={`${props.label}-input`}
        value={props.query}
        onChange={(e: any) => props.onChangeQuery(e.target.value)}
      />
    </div>
  ),
}));

import FromAndToComponent from "./page";

test("swap button swaps from and to values", async () => {
  const setFrom = jest.fn();
  const setTo = jest.fn();

  render(
    <FromAndToComponent
      fromQuery="SRC"
      setFromQuery={setFrom}
      toQuery="DST"
      setToQuery={setTo}
    />,
  );

  const swap = document.querySelector(".fromandtoswap");
  expect(swap).toBeInTheDocument();
  const user = userEvent.setup();
  await user.click(swap!);

  expect(setFrom).toHaveBeenCalledWith("DST");
  expect(setTo).toHaveBeenCalledWith("SRC");
});
