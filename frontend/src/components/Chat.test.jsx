import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Chat from "./Chat";

test("renders chat heading", () => {
  render(<Chat />);
  expect(screen.getByText("LangGraph Chat")).toBeInTheDocument();
});
