# AI Voice Bot (Jarvis 2.0)

This is a simple AI voice assistant web app built with React. It uses browser Speech Recognition and Speech Synthesis APIs to listen to your voice, process your query, and respond with both text and speech. The assistant is named **Jarvis**.

## Features

- Click anywhere on the home screen to start voice recording.
- Supports queries like:
  - Greetings ("hello", "how are you")
  - Date, time, and day
  - Weather (static response)
  - Telling jokes
  - Opening Google or YouTube
  - Saying its name
  - News (static response)
  - Thank you/help/exit
- Displays both your transcript and Jarvis's response at the bottom left.
- Jarvis responds with voice and text.

## Getting Started

### Prerequisites

- Node.js and npm installed
- Modern browser (Chrome, Edge, Safari) with Speech Recognition and Speech Synthesis support

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/aivoicebot.git
    cd aivoicebot
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

### Running the App

Start the development server:
```bash
npm start
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Usage

- On the home page, **click anywhere** to start recording your voice.
- Speak your query.
- You will be redirected to the response page, where Jarvis will display and speak the response.
- Both your transcript and Jarvis's response appear at the bottom left.

### Project Structure

```
public/
  assets/           # GIFs and logo
  index.html
src/
  pages/
    home.js         # Home page with voice recording
    talk.js         # Response page with speech synthesis
  App.js            # Routing setup
  index.js          # Entry point
  App.css           # Global styles
```

### Customization

- To change the background GIFs, replace files in `public/assets/`.
- To add more responses or commands, edit the `getResponse` function in `src/pages/talk.js`.

### Limitations

- Speech Recognition and Synthesis may not work on all browsers or devices.
- Speech Synthesis may require user interaction to play audio (browser security).
- Responses are mostly static and for demo purposes.

### License

This project is for educational/demo use.

---

**Enjoy
