#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { buildMcpServer } from "./mcpServer.js";

function readEnv(name: string): string | undefined {
  const value = process.env[name];
  return value && value.length > 0 ? value : undefined;
}

function createServer(): McpServer {
  const apiKey = readEnv("FFMPEG_MICRO_API_KEY");
  if (!apiKey) {
    // Write to stderr so the MCP client can surface the error without
    // corrupting the stdio JSON-RPC stream on stdout.
    process.stderr.write(
      "ffmpeg-micro-mcp: FFMPEG_MICRO_API_KEY environment variable is required. " +
        "Set it in your MCP client configuration (e.g. Claude Desktop `env` block).\n",
    );
    process.exit(1);
  }

  return buildMcpServer({ apiKey, baseUrl: readEnv("FFMPEG_MICRO_API_URL") });
}

async function main(): Promise<void> {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  process.stderr.write(
    `ffmpeg-micro-mcp: fatal error — ${err instanceof Error ? err.stack ?? err.message : String(err)}\n`,
  );
  process.exit(1);
});
