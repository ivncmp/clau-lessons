import { describe, it, expect } from "vitest";

describe("App", () => {
  it("theme module loads correctly", async () => {
    const { theme } = await import("./theme");
    expect(theme).toBeDefined();
    expect(theme.palette.primary.main).toBe("#2E86C1");
    expect(theme.palette.secondary.main).toBe("#E67E22");
  });

  it("routes module loads correctly", async () => {
    const { router } = await import("./routes");
    expect(router).toBeDefined();
  });
});
