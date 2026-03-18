import { z } from "zod";
import { execa } from "execa";
import { runShell, getConnectedDevices } from "../utils/adb.js";
export function registerEmulatorTools(server) {
    server.tool("list_emulators", "List all available Android Virtual Devices (AVDs) and currently running emulators", {}, async () => {
        const avdResult = await execa("emulator", ["-list-avds"]);
        const devices = await getConnectedDevices();
        return {
            content: [
                {
                    type: "text",
                    text: `Available AVDs:\n${avdResult.stdout}\n\nRunning devices:\n${devices.join("\n") || "None"}`,
                },
            ],
        };
    });
    server.tool("start_emulator", "Start an Android emulator by AVD name", {
        avdName: z.string().describe("The name of the AVD to start (from list_emulators)"),
    }, async ({ avdName }) => {
        const child = execa("emulator", ["-avd", avdName], { detached: true, stdio: "ignore" });
        child.unref();
        return {
            content: [
                {
                    type: "text",
                    text: `Starting emulator: ${avdName}. Use wait_for_boot to confirm it is ready.`,
                },
            ],
        };
    });
    server.tool("wait_for_boot", "Wait until the emulator has fully booted. Polls every 3 seconds up to 120 seconds.", {
        serial: z
            .string()
            .optional()
            .describe("Emulator serial (e.g. emulator-5554). Omit to use the only connected device."),
    }, async ({ serial }) => {
        const maxAttempts = 40;
        for (let i = 0; i < maxAttempts; i += 1) {
            try {
                const result = await runShell("getprop sys.boot_completed", serial);
                if (result.trim() === "1") {
                    return { content: [{ type: "text", text: "Emulator is fully booted and ready." }] };
                }
            }
            catch {
                // not ready yet
            }
            await new Promise((resolve) => setTimeout(resolve, 3000));
        }
        return { content: [{ type: "text", text: "Timed out waiting for emulator to boot." }] };
    });
}
