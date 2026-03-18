import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { execa } from "execa";

export function registerBuildTools(server: McpServer) {
  server.tool(
    "build_debug",
    "Build a debug APK using Gradle",
    { projectPath: z.string().describe("Absolute path to the Android project root (where gradlew lives)") },
    async ({ projectPath }) => {
      const result = await execa("./gradlew", ["assembleDebug"], { cwd: projectPath });
      return {
        content: [{ type: "text", text: result.stdout + "\n" + result.stderr }],
      };
    },
  );

  server.tool(
    "build_variant",
    "Build a specific Gradle variant (e.g. stagingDebug, productionRelease)",
    {
      projectPath: z.string().describe("Absolute path to the Android project root"),
      variant: z.string().describe("The Gradle variant to build e.g. stagingDebug"),
    },
    async ({ projectPath, variant }) => {
      const task = `assemble${variant.charAt(0).toUpperCase()}${variant.slice(1)}`;
      const result = await execa("./gradlew", [task], { cwd: projectPath });
      return {
        content: [{ type: "text", text: result.stdout + "\n" + result.stderr }],
      };
    },
  );

  server.tool(
    "clean_build",
    "Run Gradle clean to delete all build outputs",
    { projectPath: z.string().describe("Absolute path to the Android project root") },
    async ({ projectPath }) => {
      const result = await execa("./gradlew", ["clean"], { cwd: projectPath });
      return {
        content: [{ type: "text", text: result.stdout }],
      };
    },
  );
}
