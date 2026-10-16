import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { SERVER_VERSION } from "../src/version.js";

describe("SERVER_VERSION", () => {
  it("matches package.json, so initialize reports the published version", () => {
    const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
    expect(SERVER_VERSION).toBe(pkg.version);
  });
});
