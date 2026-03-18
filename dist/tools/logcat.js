import { z } from "zod";
import { execa } from "execa";
import { runAdb } from "../utils/adb.js";
export function registerLogcatTools(server) {
    server.tool("clear_logs", "Clear the logcat buffer on the emulator", { serial: z.string().optional() }, async ({ serial }) => {
        await runAdb(["logcat", "-c"], serial);
        return { content: [{ type: "text", text: "Logcat buffer cleared." }] };
    });
    server.tool("capture_logs", "Capture logcat output for 5 seconds, optionally filtered by tag or priority", {
        serial: z.string().optional(),
        tag: z.string().optional().describe("Filter by tag e.g. MyApp"),
        priority: z.enum(["V", "D", "I", "W", "E"]).optional().describe("Minimum priority level"),
    }, async ({ serial, tag, priority }) => {
        const filter = tag ? `${tag}:${priority ?? "D"} *:S` : `*:${priority ?? "W"}`;
        const baseArgs = serial ? ["-s", serial] : [];
        const args = [...baseArgs, "logcat", "-d", filter];
        const result = await execa("adb", args);
        return {
            content: [{ type: "text", text: result.stdout || "No logs found for this filter." }],
        };
    });
    server.tool("get_crash_log", "Capture any FATAL EXCEPTION crash logs from logcat", { serial: z.string().optional() }, async ({ serial }) => {
        const baseArgs = serial ? ["-s", serial] : [];
        const result = await execa("adb", [...baseArgs, "logcat", "-d", "AndroidRuntime:E", "*:S"]);
        return {
            content: [
                {
                    type: "text",
                    text: result.stdout || "No crash logs found.",
                },
            ],
        };
    });
}
