import { z } from "zod";
import { runAdb, runShell } from "../utils/adb.js";
export function registerInstallTools(server) {
    server.tool("install_apk", "Install an APK on a connected emulator", {
        apkPath: z.string().describe("Absolute path to the APK file"),
        serial: z.string().optional().describe("Emulator serial. Omit if only one device is connected."),
    }, async ({ apkPath, serial }) => {
        const result = await runAdb(["install", "-r", apkPath], serial);
        return { content: [{ type: "text", text: result }] };
    });
    server.tool("launch_app", "Launch an installed app on the emulator", {
        packageName: z.string().describe("The app package name e.g. com.example.myapp"),
        activityName: z
            .string()
            .describe("The fully qualified main activity e.g. com.example.myapp.MainActivity"),
        serial: z.string().optional(),
    }, async ({ packageName, activityName, serial }) => {
        const result = await runShell(`am start -n ${packageName}/${activityName}`, serial);
        return { content: [{ type: "text", text: result }] };
    });
    server.tool("stop_app", "Force stop a running app", {
        packageName: z.string().describe("The app package name"),
        serial: z.string().optional(),
    }, async ({ packageName, serial }) => {
        await runShell(`am force-stop ${packageName}`, serial);
        return { content: [{ type: "text", text: `Stopped ${packageName}` }] };
    });
    server.tool("uninstall_app", "Uninstall an app from the emulator", {
        packageName: z.string().describe("The app package name"),
        serial: z.string().optional(),
    }, async ({ packageName, serial }) => {
        const result = await runAdb(["uninstall", packageName], serial);
        return { content: [{ type: "text", text: result }] };
    });
}
