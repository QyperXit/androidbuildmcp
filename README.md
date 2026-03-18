# AndroidBuildMCP

An MCP (Model Context Protocol) server for building, running, and debugging Android apps via Gradle and ADB.

The Android equivalent of [XcodeBuildMCP](https://github.com/cameroncooke/XcodeBuildMCP) — gives AI coding agents like Codex and Claude direct control over your Android emulator, build system, and app lifecycle.

Works with any MCP-compatible AI agent including GitHub Copilot (Codex), Claude, and Cursor.

---

## What It Does

Instead of you manually running Gradle commands and ADB in a terminal, your AI agent can do it directly:

- 🔨 **Build** your app via Gradle
- 📱 **Launch** it on an emulator
- 👆 **Interact** with the UI (tap, swipe, type)
- 📸 **Screenshot** the screen so the agent can see what's happening
- 📋 **Read logs** and capture crash stack traces
- 🔍 **Inspect** the UI hierarchy to find element coordinates

---

## Requirements

- Node.js 18+
- Android SDK installed with `adb` and `emulator` on your PATH
- At least one AVD configured in Android Studio
- An MCP-compatible AI agent (Codex, Claude, Cursor)

Verify your setup:
```bash
node --version     # should be 18+
adb --version      # should return Android Debug Bridge version
emulator -list-avds  # should list your AVDs
```

---

## Installation

### Option 1 — Run directly with npx (recommended)
```bash
npx androidbuildmcp@latest
```

### Option 2 — Install globally
```bash
npm install -g androidbuildmcp
androidbuildmcp
```

### Option 3 — Clone and build locally
```bash
git clone https://github.com/QyperXit/androidbuildmcp.git
cd androidbuildmcp
npm install
npm run build
node dist/index.js
```

---

## Setup in VS Code (Codex)

Add this to your `.vscode/mcp.json`:

```json
{
  "mcpServers": {
    "AndroidBuildMCP": {
      "command": "npx",
      "args": ["-y", "androidbuildmcp@latest"]
    }
  }
}
```

Or if running locally from a cloned build:

```json
{
  "mcpServers": {
    "AndroidBuildMCP": {
      "command": "node",
      "args": ["/absolute/path/to/androidbuildmcp/dist/index.js"]
    }
  }
}
```

Restart VS Code after adding the config.

---

## Setup in Claude Desktop

Add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "AndroidBuildMCP": {
      "command": "npx",
      "args": ["-y", "androidbuildmcp@latest"]
    }
  }
}
```

---

## Available Tools

### Emulator

| Tool | Description |
|------|-------------|
| `list_emulators` | List all AVDs and currently running devices |
| `start_emulator` | Start an AVD by name |
| `wait_for_boot` | Wait until the emulator has fully booted |

### Build

| Tool | Description |
|------|-------------|
| `build_debug` | Assemble a debug APK via Gradle |
| `build_variant` | Assemble a specific Gradle variant |
| `clean_build` | Run Gradle clean |

### Install & Launch

| Tool | Description |
|------|-------------|
| `install_apk` | Install an APK on the emulator |
| `launch_app` | Launch an installed app by package + activity |
| `stop_app` | Force stop a running app |
| `uninstall_app` | Uninstall an app from the emulator |

### Logs

| Tool | Description |
|------|-------------|
| `clear_logs` | Clear the logcat buffer |
| `capture_logs` | Capture logcat output filtered by tag/priority |
| `get_crash_log` | Extract FATAL EXCEPTION crash stack traces |

### UI Interaction

| Tool | Description |
|------|-------------|
| `tap` | Tap at screen coordinates |
| `swipe` | Swipe between two coordinates |
| `type_text` | Type text into the focused input field |
| `press_key` | Press an Android keycode (BACK, HOME, ENTER, etc.) |
| `dump_ui` | Dump the full UI hierarchy as XML |

### Screenshots

| Tool | Description |
|------|-------------|
| `take_screenshot` | Take a screenshot and return it as an image |
| `record_screen` | Record the screen for N seconds and save as MP4 |

---

## Example Usage

Once connected, ask your AI agent naturally:

```
"List available emulators"
"Start the Pixel_8_API_35 emulator and wait for it to boot"
"Build a debug APK for the project at /home/qyper/AndroidStudioProjects/MyApp"
"Install the APK and launch com.example.myapp"
"Take a screenshot so I can see the current state"
"Tap the login button at the bottom of the screen"
"Show me any crash logs"
```

The agent handles the tool calls automatically — you just describe what you want in plain English.

---

## How It Works

AndroidBuildMCP runs as a local process that communicates with your AI agent over stdin/stdout using the MCP protocol. It wraps standard Android tooling:

- **Gradle** — for building APKs (`./gradlew assembleDebug`)
- **ADB** — for everything device-related (install, launch, logs, UI, screenshots)
- **Emulator** — for AVD discovery and startup

No cloud connection required. Everything runs locally on your machine.

---

## Pairing with android-skills

This MCP server works best alongside the [android-skills](https://github.com/QyperXit/android-skills) repo — a collection of Codex skills for Jetpack Compose development.

Point your agent at a skill file for code quality guidance, then use AndroidBuildMCP to build and test the result on a real emulator.

---

## Contributing

Contributions welcome. If you add a new tool, follow the existing pattern:

1. Create or update the relevant file in `src/tools/`
2. Register it in `src/index.ts`
3. Use `zod` for input validation
4. Use `execa` for shell commands
5. Never use `console.log` — it corrupts the MCP stdio transport. Use `console.error` for debug output only.

---

## Licence

MIT
