import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Navbar from "./Navbar";

test("renders Navbar with brand and menu button", () => {
  render(<Navbar />);
  expect(screen.getAllByText(/Logo/).length).toBeGreaterThan(0);
  expect(screen.getByRole("button", { name: /Menu/i })).toBeInTheDocument();
});
