import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { FFmpegMicroClient } from "./client.js";
import { registerTranscodeVideo } from "./tools/transcodeVideo.js";
import { registerGetTranscode } from "./tools/getTranscode.js";
import { registerListTranscodes } from "./tools/listTranscodes.js";
import { registerCancelTranscode } from "./tools/cancelTranscode.js";
import { registerGetDownloadUrl } from "./tools/getDownloadUrl.js";
import { registerTranscodeAndWait } from "./tools/transcodeAndWait.js";
import { registerTranscribeAudio } from "./tools/transcribeAudio.js";
import { registerGetTranscribe } from "./tools/getTranscribe.js";
import { registerGetTranscribeDownload } from "./tools/getTranscribeDownload.js";
import { registerRequestUploadUrl } from "./tools/requestUploadUrl.js";
import { registerConfirmUpload } from "./tools/confirmUpload.js";
import { registerRunBlueprint } from "./tools/runBlueprint.js";
import { registerGetBlueprintRun } from "./tools/getBlueprintRun.js";
import { registerRunBlueprintAndWait } from "./tools/runBlueprintAndWait.js";
import { registerContinueBlueprintRun } from "./tools/continueBlueprintRun.js";
import { SERVER_VERSION } from "./version.js";

export const SERVER_NAME = "ffmpeg-micro-mcp";

/**
 * Builds the MCP server with every tool registered. Both entry points (stdio in
 * index.ts, hosted HTTP in http.ts) use this, so they cannot drift apart in
 * name, version or tool list.
 */
export function buildMcpServer(client: FFmpegMicroClient): McpServer {
  const server = new McpServer({ name: SERVER_NAME, version: SERVER_VERSION });

  registerTranscodeVideo(server, client);
  registerGetTranscode(server, client);
  registerListTranscodes(server, client);
  registerCancelTranscode(server, client);
  registerGetDownloadUrl(server, client);
  registerTranscodeAndWait(server, client);
  registerTranscribeAudio(server, client);
  registerGetTranscribe(server, client);
  registerGetTranscribeDownload(server, client);
  registerRequestUploadUrl(server, client);
  registerConfirmUpload(server, client);
  registerRunBlueprint(server, client);
  registerGetBlueprintRun(server, client);
  registerRunBlueprintAndWait(server, client);
  registerContinueBlueprintRun(server, client);

  return server;
}
