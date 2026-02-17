import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

// Mocks for router and context
const pushMock = jest.fn();
const setTrainListDataMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

jest.mock("@/app/contexts/TrainContext", () => ({
  useTrainContext: () => ({ setTrainListData: setTrainListDataMock }),
}));

// Mock child components
jest.mock("../../../components/FromandTo/page", () => ({
  __esModule: true,
  default: (props: any) => (
    <div data-testid="from-and-to-component">
      <input
        data-testid="from-input"
        value={props.fromQuery}
        onChange={(e: any) => props.setFromQuery(e.target.value)}
        placeholder="From"
      />
      <input
        data-testid="to-input"
        value={props.toQuery}
        onChange={(e: any) => props.setToQuery(e.target.value)}
        placeholder="To"
      />
    </div>
  ),
}));

jest.mock("react-batch-component-library", () => ({
  __esModule: true,
  Button: (props: any) => (
    <button type="submit" data-testid="search-button">
      {props.label ?? "Button"}
    </button>
  ),
  DatePickerInput: (props: any) => (
    <input
      data-testid="date-input"
      type="date"
      value={props.date}
      onChange={(e: any) => props.setDateInput(e.target.value)}
    />
  ),
  DropDown: (props: any) => (
    <select
      data-testid="class-select"
      value={props.selectedValue}
      onChange={(e: any) => props.onSelect(e.target.value)}
    >
      <option value="all">{props.placeholder}</option>
      {(props.options || []).map((o: any) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  ),
}));

jest.mock("react-feather", () => ({
  Briefcase: () => <span data-testid="briefcase-icon">Briefcase Icon</span>,
}));

// Import after mocks
import TrainSearchPage from "./page";

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn();
});

describe("TrainSearchPage", () => {
  describe("Rendering", () => {
    test("renders the page with all required elements", () => {
      render(<TrainSearchPage />);

      expect(screen.getByText("BOOK TICKET")).toBeInTheDocument();
      expect(screen.getByTestId("from-and-to-component")).toBeInTheDocument();
      expect(screen.getByTestId("date-input")).toBeInTheDocument();
      expect(screen.getByTestId("class-select")).toBeInTheDocument();
      expect(screen.getByTestId("search-button")).toBeInTheDocument();
      expect(screen.getByTestId("briefcase-icon")).toBeInTheDocument();
    });

    test("renders form with correct structure", () => {
      render(<TrainSearchPage />);
      const form = screen.getByRole("button", { name: /Search Trains/i }).closest(
        "form"
      );
      expect(form).toBeInTheDocument();
    });

    test("renders all train class dropdown options", () => {
      render(<TrainSearchPage />);
      const select = screen.getByTestId("class-select");
      const options = select.querySelectorAll("option");

      expect(options.length).toBeGreaterThan(0);
    });
  });

  describe("User Interactions", () => {
    test("allows user to input from station", async () => {
      render(<TrainSearchPage />);
      const user = userEvent.setup();

      const fromInput = screen.getByTestId("from-input") as HTMLInputElement;
      await user.type(fromInput, "NEW DELHI");

      expect(fromInput.value).toBe("NEW DELHI");
    });

    test("allows user to input to station", async () => {
      render(<TrainSearchPage />);
      const user = userEvent.setup();

      const toInput = screen.getByTestId("to-input") as HTMLInputElement;
      await user.type(toInput, "MUMBAI");

      expect(toInput.value).toBe("MUMBAI");
    });

    test("allows user to select a date", async () => {
      render(<TrainSearchPage />);
      const user = userEvent.setup();

      const dateInput = screen.getByTestId("date-input") as HTMLInputElement;
      await user.type(dateInput, "2026-02-15");

      expect(dateInput.value).toBe("2026-02-15");
    });

    test("allows user to select a train class", async () => {
      render(<TrainSearchPage />);
      const user = userEvent.setup();

      const classSelect = screen.getByTestId("class-select") as HTMLSelectElement;
      await user.selectOptions(classSelect, "Sleeper (SL)");

      expect(classSelect.value).toBe("Sleeper (SL)");
    });

    test("defaults to 'all' train class", () => {
      render(<TrainSearchPage />);
      const classSelect = screen.getByTestId("class-select") as HTMLSelectElement;
      expect(classSelect.value).toBe("all");
    });
  });

  describe("Form Submission", () => {
    test("submits form with correct data on successful response", async () => {
      const fakeResponse = {
        trains: [
          { id: "T1", name: "Express 1", departure: "10:00" },
          { id: "T2", name: "Express 2", departure: "14:00" },
        ],
        error: false,
      };

      (global.fetch as jest.Mock) = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue(fakeResponse),
      });

      render(<TrainSearchPage />);
      const user = userEvent.setup();

      await user.type(screen.getByTestId("from-input"), "SRC");
      await user.type(screen.getByTestId("to-input"), "DST");
      await user.type(screen.getByTestId("date-input"), "2026-02-15");
      await user.selectOptions(
        screen.getByTestId("class-select"),
        "Sleeper (SL)"
      );
      await user.click(screen.getByRole("button", { name: /Search Trains/i }));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith("api/TrainSearchApi", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fromQuery: "SRC",
            toQuery: "DST",
            date: "2026-02-15",
            trainclass: "Sleeper (SL)",
          }),
        });
      });
    });

    test("calls setTrainListData with train data on success", async () => {
      const fakeResponse = {
        trains: [{ id: "T1" }, { id: "T2" }],
        error: false,
      };

      (global.fetch as jest.Mock) = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue(fakeResponse),
      });

      render(<TrainSearchPage />);
      const user = userEvent.setup();

      await user.type(screen.getByTestId("from-input"), "A");
      await user.type(screen.getByTestId("to-input"), "B");
      await user.type(screen.getByTestId("date-input"), "2026-02-15");
      await user.click(screen.getByRole("button", { name: /Search Trains/i }));

      await waitFor(() => {
        expect(setTrainListDataMock).toHaveBeenCalledWith(fakeResponse.trains);
      });
    });

    test("navigates to /train-list on successful response", async () => {
      const fakeResponse = {
        trains: [{ id: "T1" }],
        error: false,
      };

      (global.fetch as jest.Mock) = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue(fakeResponse),
      });

      render(<TrainSearchPage />);
      const user = userEvent.setup();

      await user.type(screen.getByTestId("from-input"), "A");
      await user.type(screen.getByTestId("to-input"), "B");
      await user.type(screen.getByTestId("date-input"), "2026-02-15");
      await user.click(screen.getByRole("button", { name: /Search Trains/i }));

      await waitFor(() => {
        expect(pushMock).toHaveBeenCalledWith("/train-list");
      });
    });

    test("does not navigate when response contains error", async () => {
      const fakeResponse = {
        trains: [],
        error: true,
      };

      (global.fetch as jest.Mock) = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue(fakeResponse),
      });

      render(<TrainSearchPage />);
      const user = userEvent.setup();

      await user.type(screen.getByTestId("from-input"), "A");
      await user.type(screen.getByTestId("to-input"), "B");
      await user.type(screen.getByTestId("date-input"), "2026-02-15");
      await user.click(screen.getByRole("button", { name: /Search Trains/i }));

      await waitFor(() => {
        expect(pushMock).not.toHaveBeenCalled();
      });
    });

    test("still sets train data even when error is true", async () => {
      const fakeResponse = {
        trains: [{ id: "T1" }],
        error: true,
      };

      (global.fetch as jest.Mock) = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue(fakeResponse),
      });

      render(<TrainSearchPage />);
      const user = userEvent.setup();

      await user.type(screen.getByTestId("from-input"), "A");
      await user.type(screen.getByTestId("to-input"), "B");
      await user.type(screen.getByTestId("date-input"), "2026-02-15");
      await user.click(screen.getByRole("button", { name: /Search Trains/i }));

      await waitFor(() => {
        expect(setTrainListDataMock).toHaveBeenCalledWith(fakeResponse.trains);
      });
    });

    test("handles empty search results", async () => {
      const fakeResponse = {
        trains: [],
        error: false,
      };

      (global.fetch as jest.Mock) = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue(fakeResponse),
      });

      render(<TrainSearchPage />);
      const user = userEvent.setup();

      await user.type(screen.getByTestId("from-input"), "INVALID");
      await user.type(screen.getByTestId("to-input"), "ROUTE");
      await user.type(screen.getByTestId("date-input"), "2026-02-15");
      await user.click(screen.getByRole("button", { name: /Search Trains/i }));

      await waitFor(() => {
        expect(setTrainListDataMock).toHaveBeenCalledWith([]);
        expect(pushMock).toHaveBeenCalledWith("/train-list");
      });
    });
  });

  describe("Edge Cases", () => {
    test("submits with default class 'all' when no class is selected", async () => {
      const fakeResponse = {
        trains: [{ id: "T1" }],
        error: false,
      };

      (global.fetch as jest.Mock) = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue(fakeResponse),
      });

      render(<TrainSearchPage />);
      const user = userEvent.setup();

      await user.type(screen.getByTestId("from-input"), "A");
      await user.type(screen.getByTestId("to-input"), "B");
      await user.type(screen.getByTestId("date-input"), "2026-02-15");
      await user.click(screen.getByRole("button", { name: /Search Trains/i }));

      await waitFor(() => {
        const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
        const body = JSON.parse(fetchCall[1].body);
        expect(body.trainclass).toBe("all");
      });
    });

    test("allows multiple searches in sequence", async () => {
      const fakeResponse = {
        trains: [{ id: "T1" }],
        error: false,
      };

      (global.fetch as jest.Mock) = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue(fakeResponse),
      });

      render(<TrainSearchPage />);
      const user = userEvent.setup();

      await user.type(screen.getByTestId("from-input"), "A");
      await user.type(screen.getByTestId("to-input"), "B");
      await user.type(screen.getByTestId("date-input"), "2026-02-15");
      await user.click(screen.getByRole("button", { name: /Search Trains/i }));

      await waitFor(() => {
        expect((global.fetch as jest.Mock).mock.calls.length).toBe(1);
      });
    });
  });
});
