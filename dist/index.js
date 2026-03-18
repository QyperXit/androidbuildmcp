#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerEmulatorTools } from "./tools/emulator.js";
import { registerBuildTools } from "./tools/build.js";
import { registerInstallTools } from "./tools/install.js";
import { registerLogcatTools } from "./tools/logcat.js";
import { registerUiTools } from "./tools/ui.js";
import { registerScreenshotTools } from "./tools/screenshot.js";
const server = new McpServer({
    name: "AndroidBuildMCP",
    version: "1.0.0",
    description: "MCP server for building, running, and debugging Android apps via Gradle and ADB",
});
registerEmulatorTools(server);
registerBuildTools(server);
registerInstallTools(server);
registerLogcatTools(server);
registerUiTools(server);
registerScreenshotTools(server);
const transport = new StdioServerTransport();
await server.connect(transport);
