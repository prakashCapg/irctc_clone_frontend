import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Footer from "./Footer";

test("renders Footer with expected links", () => {
  render(<Footer />);
  expect(screen.getByText(/IRCTC Trains/)).toBeInTheDocument();
  expect(screen.getByText(/General Information/)).toBeInTheDocument();
});
