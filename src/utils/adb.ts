import { execa } from "execa";

export async function runAdb(args: string[], serial?: string): Promise<string> {
  const baseArgs = serial ? ["-s", serial, ...args] : args;
  const result = await execa("adb", baseArgs);
  return result.stdout;
}

export async function runShell(command: string, serial?: string): Promise<string> {
  return runAdb(["shell", command], serial);
}

export async function getConnectedDevices(): Promise<string[]> {
  const result = await execa("adb", ["devices"]);
  const lines = result.stdout.split("\n").slice(1);
  return lines
    .filter((line) => line.includes("\tdevice"))
    .map((line) => line.split("\t")[0].trim());
}
