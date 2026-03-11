import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import SortByMenu, { type SortKey } from "./SortByMenu";

beforeAll(() => {
  // provide a stable getBoundingClientRect for the trigger button
  HTMLElement.prototype.getBoundingClientRect = function () {
    return {
      left: 10,
      bottom: 20,
      right: 100,
      top: 0,
      width: 90,
      height: 20,
    } as DOMRect;
  };
});

test("opens menu and selects a sort option", async () => {
  const onChange = jest.fn();
  render(<SortByMenu value={"DEPARTURE_ASC" as SortKey} onChange={onChange} />);

  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: /Sort By/i }));

  // the menu should appear in document body; query by role
  const menu = await screen.findByRole("menu");
  expect(menu).toBeInTheDocument();

  // pick a Duration option (DURATION_DESC)
  const radios = screen.getAllByRole("menuitemradio");
  const durationLate = radios.find(
    (r) =>
      (r.textContent || "").includes("Duration") &&
      (r.textContent || "").includes("Late First"),
  );
  expect(durationLate).toBeTruthy();
  await user.click(durationLate!);

  expect(onChange).toHaveBeenCalled();
});
