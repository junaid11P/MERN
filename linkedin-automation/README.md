# LinkedIn Automation Engineering Proof-of-Concept

A sophisticated Go-based LinkedIn automation tool demonstrating advanced browser automation, anti-detection techniques, and human-like behavior simulation. Built with the `go-rod` library.

> [!IMPORTANT]
> **Educational Purpose Only**: This project is for technical evaluation and demonstrating automation engineering skills. Automating LinkedIn violates their Terms of Service. Do not use this on live accounts.

## Technical Demonstration: Stealth & Anti-Detection

This tool implements 8+ distinct stealth techniques to mimic authentic human behavior:

1.  **Human-like Mouse Movement**: Uses Bézier curves with randomized control points, variable speed, and micro-corrections to avoid robotic straight-line trajectories.
2.  **Realistic Typing Simulation**: Implements variable keystroke intervals and introduces/corrections occasional "typos" to simulate human typing rhythm.
3.  **Randomized Timing Patterns**: Adds realistic, randomized "think time" and delays between actions.
4.  **Browser Fingerprint Masking**: Injects `stealth.JS`, randomizes User-Agent strings, and hides the `navigator.webdriver` flag.
5.  **Random Scrolling Behavior**: Simulates natural page reading with variable scroll speeds and pauses.
6.  **Activity Scheduling**: Bot activity is restricted to business hours (9 AM - 5 PM, Mon-Fri) to mimic professional usage patterns. Can be bypassed via `BYPASS_SCHEDULER=true` for testing.
7.  **Rate Limiting & Throttling**: Enforces daily quotas for connection requests and messages, tracked via persistent storage.
8.  **Mouse Hovering**: Intelligent cursor positioning and hovering over elements before interaction.

## Architecture

*   **Modular Design**: Clean separation between `automation`, `stealth`, `browser`, and `persistence` layers.
*   **State Persistence**: Tracks activity in `user_data/storage.json` to prevent duplicates and enforce daily limits across sessions.
*   **Robust Selectors**: Uses prioritized fallback selectors to handle LinkedIn's dynamic UI updates.
*   **Structured Logging**: Detailed leveled logging for observability and debugging.

## Setup Instructions

1.  **Environment Setup**:
    ```bash
    cp .env.example .env
    # Add your credentials and tune limits in .env
    ```
2.  **Build & Run**:
    ```bash
    go build -o main cmd/linkedin-bot/main.go
    ./main
    ```

## Features Demonstrated

*   **Automated Login**: Handles session persistence and detects security checkpoints.
*   **Targeted Search**: Keyword-based search with pagination support.
*   **Connection Workflow**: Sends personalized connection notes with character limit awareness.
*   **Messaging System**: Automatically follows up with newly accepted connections using dynamic templates.

## Demonstration

[Watch the Technical Walkthrough](https://drive.google.com/file/d/1Wdo7SBtn-ySSZ_iM17e8cdv41kPLJC5k/view?usp=drivesdk)
