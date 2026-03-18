import { execa } from "execa";
export async function runAdb(args, serial) {
    const baseArgs = serial ? ["-s", serial, ...args] : args;
    const result = await execa("adb", baseArgs);
    return result.stdout;
}
export async function runShell(command, serial) {
    return runAdb(["shell", command], serial);
}
export async function getConnectedDevices() {
    const result = await execa("adb", ["devices"]);
    const lines = result.stdout.split("\n").slice(1);
    return lines
        .filter((line) => line.includes("\tdevice"))
        .map((line) => line.split("\t")[0].trim());
}
