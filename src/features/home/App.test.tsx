import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders Hola Mundo", () => {
    render(<App />);
    expect(screen.getByText("Hola Mundo")).toBeInTheDocument();
  });

  it("renders welcome message", () => {
    render(<App />);
    expect(screen.getByText("Bienvenido a Clau Lessons")).toBeInTheDocument();
  });
});
