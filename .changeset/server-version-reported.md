---
"@ffmpeg-micro/mcp-server": patch
---

The server now reports its package version in the MCP `initialize` response. Every release so far said `0.1.0`, in the npm package and on the hosted server at mcp.ffmpeg-micro.com. The hosted server deploys from `main`, so between a merge and the next release it reports the last released version.
