// npx jest "app/(public)/train-list/page.test.tsx" --runInBand --color
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

const setTrainListDataMock = jest.fn();
const setSearchStateMock = jest.fn();

jest.mock("@/app/contexts/TrainContext", () => ({
  useTrainContext: () => ({
    trainListData: mockedTrainList,
    setTrainListData: setTrainListDataMock,
    searchState: mockedSearchState,
    setSearchState: setSearchStateMock,
  }),
}));

// Provide placeholders that will be replaced in tests
let mockedTrainList: any[] = [];
let mockedSearchState: any = {
  fromQuery: "",
  toQuery: "",
  date: "",
  trainclass: "all",
};

// Mock child components and libraries used by the page
jest.mock("react-batch-component-library", () => ({
  __esModule: true,
  CardWrapper: (props: any) => (
    <div data-testid={props.className ?? "card-wrapper"}>{props.children}</div>
  ),
}));

jest.mock("@/components/TrainCard/TrainCard", () => ({
  __esModule: true,
  default: ({ train }: any) => (
    <div data-testid="train-card">{train.number}</div>
  ),
}));

jest.mock("@/components/TrainSearchBar/page", () => ({
  __esModule: true,
  default: () => <div data-testid="train-search-bar" />,
}));

jest.mock("@/components/SortByMenu/SortByMenu", () => ({
  __esModule: true,
  default: ({ value, onChange }: any) => (
    <div data-testid="sortby">
      <button
        data-testid="sort-dep-asc"
        onClick={() => onChange("DEPARTURE_ASC")}
      >
        dep asc
      </button>
      <button
        data-testid="sort-dep-desc"
        onClick={() => onChange("DEPARTURE_DESC")}
      >
        dep desc
      </button>
    </div>
  ),
}));

jest.mock("@mui/icons-material/ChevronRight", () => ({
  __esModule: true,
  default: () => <span data-testid="chev">&gt;</span>,
}));

import TrainListPage from "./page";

beforeEach(() => {
  jest.clearAllMocks();
  mockedTrainList = [];
  mockedSearchState = {
    fromQuery: "",
    toQuery: "",
    date: "",
    trainclass: "all",
  };
  // reset sessionStorage
  sessionStorage.clear();
  // ensure fetch is defined
  // @ts-ignore
  global.fetch = jest.fn();
});

describe("TrainListPage", () => {
  test("renders header with count, stations and formatted date", () => {
    mockedTrainList = [{ number: "1" }, { number: "2" }];
    mockedSearchState = {
      fromQuery: "SRC-ABC",
      toQuery: "DST-XYZ",
      date: "2026-02-15",
      trainclass: "all",
    };

    render(<TrainListPage />);

    expect(screen.getByTestId("train-search-bar")).toBeInTheDocument();
    expect(screen.getByText(/2 Results for/)).toBeInTheDocument();
    expect(screen.getByText(/SRC/)).toBeInTheDocument();
    expect(screen.getByText(/DST/)).toBeInTheDocument();
    expect(screen.getByText(/15 Feb 2026/)).toBeInTheDocument();
  });

  test("shows Not Available when no trains", () => {
    mockedTrainList = [];
    mockedSearchState = {
      fromQuery: "A",
      toQuery: "B",
      date: "2026-02-15",
      trainclass: "all",
    };

    render(<TrainListPage />);

    expect(screen.getByText("Not Available")).toBeInTheDocument();
  });

  test("renders trains and sorts by departure when sort key changes", async () => {
    mockedTrainList = [
      {
        number: "1",
        depTime: "10:00",
        duration: "02:00",
        journeyDateISO: "2026-02-15",
        depDate: "15 Feb",
      },
      {
        number: "2",
        depTime: "09:00",
        duration: "03:00",
        journeyDateISO: "2026-02-15",
        depDate: "15 Feb",
      },
    ];
    mockedSearchState = {
      fromQuery: "A",
      toQuery: "B",
      date: "2026-02-15",
      trainclass: "all",
    };

    // default to departure asc
    sessionStorage.setItem("sortKey", "DEPARTURE_ASC");

    render(<TrainListPage />);

    const cards = screen.getAllByTestId("train-card");
    // DEPARTURE_ASC -> earlier time (09:00) first -> number 2 then 1
    expect(cards[0]).toHaveTextContent("2");
    expect(cards[1]).toHaveTextContent("1");

    // switch to DEPARTURE_DESC
    const user = userEvent.setup();
    await user.click(screen.getByTestId("sort-dep-desc"));

    const cardsAfter = screen.getAllByTestId("train-card");
    expect(cardsAfter[0]).toHaveTextContent("1");
    expect(cardsAfter[1]).toHaveTextContent("2");
  });

  test("clicking next/previous day calls API and updates state & sessionStorage", async () => {
    mockedTrainList = [];
    mockedSearchState = {
      fromQuery: "A",
      toQuery: "B",
      date: "2026-02-15",
      trainclass: "all",
    };

    const fakeResponse = { trains: [{ number: "10" }], error: false };
    // @ts-ignore
    global.fetch = jest
      .fn()
      .mockResolvedValue({ json: jest.fn().mockResolvedValue(fakeResponse) });

    render(<TrainListPage />);
    const user = userEvent.setup();

    // Click next day button (it is the button with aria-label Next Day)
    const nextBtn = screen
      .getAllByRole("button", { name: /Next Day|Previous Day/ })
      .find((b) => b.getAttribute("aria-label") === "Next Day");
    expect(nextBtn).toBeTruthy();
    await user.click(nextBtn!);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/TrainSearchApi",
        expect.any(Object),
      );
      const call = (global.fetch as jest.Mock).mock.calls[0];
      const opts = call[1];
      const body = JSON.parse(opts.body);
      expect(body.date).toBe("2026-02-16");
      expect(setTrainListDataMock).toHaveBeenCalledWith(fakeResponse.trains);
      expect(sessionStorage.getItem("trainListData")).toBe(
        JSON.stringify(fakeResponse.trains),
      );
      expect(sessionStorage.getItem("searchState")).toBe(
        JSON.stringify({ ...mockedSearchState, date: "2026-02-16" }),
      );
    });
  });
});
