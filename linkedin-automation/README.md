# LinkedIn Automation Tool (PoC)

A sophisticated Go-based automation tool for LinkedIn, designed for educational purposes to demonstrate advanced browser automation, stealth techniques, and clean architecture.

> **Disclaimer**: This tool is for **educational purposes only**. Automating LinkedIn violates their Terms of Service. Do not use on production accounts.

## Features

- **Stealth Automation**:
  - **Human-like Mouse Movement**: Implements Bézier curves with overshoot and micro-corrections (`internal/stealth/mouse.go`).
  - **Randomized Timing**: Variable delays for typing, clicking, and scrolling (`internal/stealth/human.go`).
  - **Fingerprint Masking**: Uses `go-rod/stealth` to mask WebDriver signals and randomize User-Agent/Viewport.

- **Core Functionality**:
  - **Authentication**: Secure login flow with 2FA handling and session persistence (`internal/automation/auth.go`).
  - **Search & Collect**: targeted searching and profile URL extraction (`internal/automation/search.go`).
  - **Smart Actions**: Connect with personalized notes (`internal/automation/actions.go`).

- **Architecture**:
  - Modular Go design (`cmd`, `internal`, `pkg`).
  - Structured Logging (`pkg/logger`).
  - Environemnt-based Configuration (`pkg/config`).

## Installation

1.  **Prerequisites**:
    - Go 1.20+
    - Google Chrome installed

2.  **Clone & Build**:
    ```bash
    git clone <repo-url>
    cd linkedin-automation
    go mod tidy
    go build -o linkedin-bot cmd/linkedin-bot/main.go
    ```

3.  **Configuration**:
    Copy the example env file and update your credentials:
    ```bash
    cp .env.example .env
    # Edit .env with your details
    ```

## Usage

Run the bot:
```bash
./linkedin-bot
```

### Configuration Options (.env)
- `HEADLESS_MODE`: Set to `false` to see the browser in action (recommended for verification).
- `SLOW_MOTION_MS`: Add internal rod delay (e.g. `10`).
- `MAX_CONNECTS_PER_DAY`: Safety limit.

## Directory Structure

```
├── cmd
│   └── linkedin-bot    # Main Entry Point
├── internal
│   ├── automation      # Auth, Search, Connect Logic
│   ├── browser         # Rod Browser Wrapper + Stealth Init
│   └── stealth         # Mouse, Typing, Scroll Algorithms
├── pkg
│   ├── config          # Config Loader
│   └── logger          # Structured Logger
└── ...
```

## Anti-Detection Implementation Details

- **Mouse**: We calculate a chaotic path using randomization and linear interpolation with overshoot to mimic hand jitter.
- **Typing**: We simulate typing speed variations and occasional errors (typing wrong char, then backspacing).
- **Session**: Cookies are saved to `user_data` directory to avoid repeated logins.
