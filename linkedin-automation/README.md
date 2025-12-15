# LinkedIn Automation Bot (Experimental)

Hi! This is my submission for the LinkedIn Automation assignment. It's a tool written in Go that automates connection requests and profile searching while trying to avoid bot detection.

> **Note**: This is strictly for educational purposes to demonstrate browser automation skills. Please don't use this on a real account you care about, as it violates LinkedIn's ToS.

## Demo

[Watch the demonstration video](https://drive.google.com/file/d/1Wdo7SBtn-ySSZ_iM17e8cdv41kPLJC5k/view?usp=drivesdk)


## How it Works

I built this using the `go-rod` library because it offers great control over the browser. The main challenge was simulating human behavior so the bot doesn't get blocked immediately.

### Key Features
*   **Stealth Mode**: I used Bézier curves for mouse movements so the cursor doesn't just teleport or move in straight lines.
*   **Human Typing**: The bot types with variable speed and sometimes makes "mistakes" (and corrects them) to look real.
*   **Smart Waiting**: It doesn't just wait X seconds; it waits for random intervals to mimic "thinking" time.

## Setup & Run

1.  **Install Go**: Make sure you have Go installed (I used version 1.25).
2.  **Get the code**:
    ```bash
    git clone <repo-url>
    cd linkedin-automation
    ```
3.  **Config**:
    Rename `.env.example` to `.env` and add your LinkedIn login details.
    ```bash
    cp .env.example .env
    ```
4.  **Run it**:
    ```bash
    go build -o linkedin-bot cmd/linkedin-bot/main.go
    ./linkedin-bot
    ```

## Project Structure

I tried to keep the code modular/clean:

*   `cmd/`: Entry point.
*   `internal/browser`: Handles the browser instance and stealth settings (User-Agent, etc.).
*   `internal/stealth`: This is where the fun math happens for the mouse movements.
*   `internal/automation`: Contains the actual logic for login, searching, and connecting.

## A Note on Anti-Detection

The hardest part was the mouse movement. I implemented a function in `mouse.go` that adds some "noise" to the path so it generates a curve rather than a line. I also disabled the standard `navigator.webdriver` flags so Chrome doesn't shout "I AM A ROBOT" to the website.

Hope you like it!
