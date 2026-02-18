import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock child components used inside the TrainSearchBar
jest.mock("react-batch-component-library", () => ({
  __esModule: true,
  Button: (props: any) => <button>{props.label}</button>,
  DatePickerInput: (props: any) => <input data-testid="date-input" />,
  DropDown: (props: any) => <select data-testid="class-select" />,
}));

// Mock FromAndTo child component
jest.mock("@/components/FromandTo/page", () => ({
  __esModule: true,
  default: (props: any) => (
    <div data-testid="from-and-to-component">
      <input
        data-testid="from-input"
        value={props.fromQuery}
        onChange={(e: any) => props.setFromQuery(e.target.value)}
      />
      <input
        data-testid="to-input"
        value={props.toQuery}
        onChange={(e: any) => props.setToQuery(e.target.value)}
      />
    </div>
  ),
}));

// Mock useTrainContext
jest.mock("@/app/contexts/TrainContext", () => ({
  useTrainContext: () => ({
    trainListData: [],
    setTrainListData: jest.fn(),
    searchState: { fromQuery: "", toQuery: "", date: "", trainclass: "all" },
    setSearchState: jest.fn(),
  }),
}));

import TrainSearchBar from "./page";

test("renders TrainSearchBar placeholder", () => {
  render(<TrainSearchBar />);
  expect(screen.getByTestId("date-input")).toBeInTheDocument();
  expect(screen.getByTestId("class-select")).toBeInTheDocument();
});
