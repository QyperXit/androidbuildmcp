import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { runShell, runAdb } from "../utils/adb.js";
import { join } from "path";
import { tmpdir } from "os";
import { readFile } from "fs/promises";

export function registerUiTools(server: McpServer) {
  server.tool(
    "tap",
    "Tap at a specific coordinate on the emulator screen",
    {
      x: z.number().describe("X coordinate"),
      y: z.number().describe("Y coordinate"),
      serial: z.string().optional(),
    },
    async ({ x, y, serial }) => {
      await runShell(`input tap ${x} ${y}`, serial);
      return { content: [{ type: "text", text: `Tapped at (${x}, ${y})` }] };
    },
  );

  server.tool(
    "swipe",
    "Swipe from one coordinate to another",
    {
      x1: z.number(),
      y1: z.number(),
      x2: z.number(),
      y2: z.number(),
      durationMs: z.number().default(300).describe("Swipe duration in milliseconds"),
      serial: z.string().optional(),
    },
    async ({ x1, y1, x2, y2, durationMs, serial }) => {
      await runShell(`input swipe ${x1} ${y1} ${x2} ${y2} ${durationMs}`, serial);
      return { content: [{ type: "text", text: `Swiped (${x1},${y1}) → (${x2},${y2})` }] };
    },
  );

  server.tool(
    "type_text",
    "Type text into the currently focused input field",
    {
      text: z.string().describe("Text to type. Spaces must be entered as %s"),
      serial: z.string().optional(),
    },
    async ({ text, serial }) => {
      const escaped = text.replace(/ /g, "%s");
      await runShell(`input text "${escaped}"`, serial);
      return { content: [{ type: "text", text: `Typed: ${text}` }] };
    },
  );

  server.tool(
    "press_key",
    "Press an Android keycode",
    {
      keycode: z.string().describe("Android keycode e.g. KEYCODE_BACK, KEYCODE_HOME, KEYCODE_ENTER"),
      serial: z.string().optional(),
    },
    async ({ keycode, serial }) => {
      await runShell(`input keyevent ${keycode}`, serial);
      return { content: [{ type: "text", text: `Pressed key: ${keycode}` }] };
    },
  );

  server.tool(
    "dump_ui",
    "Dump the UI hierarchy as XML so you can find element coordinates and resource IDs",
    { serial: z.string().optional() },
    async ({ serial }) => {
      await runShell("uiautomator dump /sdcard/ui_dump.xml", serial);
      const localPath = join(tmpdir(), "ui_dump.xml");
      await runAdb(["pull", "/sdcard/ui_dump.xml", localPath], serial);
      const xml = await readFile(localPath, "utf-8");
      return { content: [{ type: "text", text: xml }] };
    },
  );
}
