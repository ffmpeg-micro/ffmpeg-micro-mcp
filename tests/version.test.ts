import { describe, it, expect, afterAll } from "vitest";
import { readFileSync } from "node:fs";
import type http from "node:http";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { SERVER_VERSION } from "../src/version.js";
import { buildMcpServer, SERVER_NAME } from "../src/mcpServer.js";
import { FFmpegMicroClient } from "../src/client.js";
import { createApp } from "../src/http.js";

const pkgVersion: string = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
).version;

describe("server version", () => {
  it("SERVER_VERSION matches package.json", () => {
    expect(SERVER_VERSION).toBe(pkgVersion);
  });

  it("the shared server reports package.json's version in initialize", async () => {
    const server = buildMcpServer(new FFmpegMicroClient({ apiKey: "test" }));
    const client = new Client({ name: "version-test", version: "1.0.0" });
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);

    expect(client.getServerVersion()).toEqual({ name: SERVER_NAME, version: pkgVersion });

    await client.close();
  });

  describe("hosted HTTP server", () => {
    const listener: http.Server = createApp().listen(0);
    afterAll(() => listener.close());

    it("reports package.json's version in initialize", async () => {
      const { port } = listener.address() as { port: number };
      const res = await fetch(`http://127.0.0.1:${port}/`, {
        method: "POST",
        headers: {
          Authorization: "Bearer test",
          "Content-Type": "application/json",
          Accept: "application/json, text/event-stream",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "initialize",
          params: {
            protocolVersion: "2025-06-18",
            capabilities: {},
            clientInfo: { name: "version-test", version: "1.0.0" },
          },
        }),
      });
      expect(res.status).toBe(200);

      // The streamable HTTP transport may answer as plain JSON or as SSE.
      const text = await res.text();
      const payload = text.trimStart().startsWith("{")
        ? text
        : text.split("\n").find((l) => l.startsWith("data: "))!.slice("data: ".length);
      expect(JSON.parse(payload).result.serverInfo).toEqual({
        name: SERVER_NAME,
        version: pkgVersion,
      });
    });
  });
});
