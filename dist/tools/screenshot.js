import { z } from "zod";
import { runAdb, runShell } from "../utils/adb.js";
import { join } from "path";
import { tmpdir } from "os";
import { readFile } from "fs/promises";
export function registerScreenshotTools(server) {
    server.tool("take_screenshot", "Take a screenshot of the emulator screen and return it as a base64 image", { serial: z.string().optional() }, async ({ serial }) => {
        const devicePath = "/sdcard/mcp_screenshot.png";
        const localPath = join(tmpdir(), "mcp_screenshot.png");
        await runShell(`screencap ${devicePath}`, serial);
        await runAdb(["pull", devicePath, localPath], serial);
        const imageData = await readFile(localPath);
        const base64 = imageData.toString("base64");
        return {
            content: [
                {
                    type: "image",
                    data: base64,
                    mimeType: "image/png",
                },
            ],
        };
    });
    server.tool("record_screen", "Record the emulator screen for a given number of seconds and save to a local file", {
        outputPath: z.string().describe("Local path to save the .mp4 file e.g. /tmp/recording.mp4"),
        durationSeconds: z.number().min(1).max(60).default(10),
        serial: z.string().optional(),
    }, async ({ outputPath, durationSeconds, serial }) => {
        const devicePath = "/sdcard/mcp_recording.mp4";
        await runShell(`screenrecord --time-limit ${durationSeconds} ${devicePath}`, serial);
        await runAdb(["pull", devicePath, outputPath], serial);
        return { content: [{ type: "text", text: `Recording saved to ${outputPath}` }] };
    });
}
