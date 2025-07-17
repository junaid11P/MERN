import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Talk = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const transcript = location.state?.transcript || "No query received.";

  // Enhanced response logic for personal assistant
  const getResponse = (query) => {
    const lower = query.toLowerCase();

    if (lower.includes("hello")) return "Hello! How can I assist you today?";
    if (lower.includes("weather")) return "Today's weather is sunny and pleasant.";
    if (lower.includes("time")) return `The current time is ${new Date().toLocaleTimeString()}.`;
    if (lower.includes("date")) return `Today's date is ${new Date().toLocaleDateString()}.`;
    if (lower.includes("day")) return `Today is ${new Date().toLocaleDateString('en-US', { weekday: 'long' })}.`;
    if (lower.includes("your name")) return "My name is Jarvis, your personal assistant.";
    if (lower.includes("who am i") || lower.includes("my name is")) {
      // Extract name from query
      const match = query.match(/my name is (\w+)/i);
      if (match && match[1]) {
        return `Nice to meet you, ${match[1]}!`;
      }
      return "I didn't catch your name. Could you repeat it?";
    }
    if (lower.includes("how are you")) return "I'm doing well, thank you!";
    if (lower.includes("thank you")) return "You're welcome!";
    if (lower.includes("open google")) {
      window.open("https://www.google.com", "_blank");
      return "Opening Google for you.";
    }
    if (lower.includes("open youtube")) {
      window.open("https://www.youtube.com", "_blank");
      return "Opening YouTube for you.";
    }
    if (lower.includes("joke")) return "Why did the computer show up at work late? It had a hard drive!";
    if (lower.includes("news")) return "Here is the latest news: Stay positive and keep learning!";
    if (lower.includes("help")) return "I'm here to assist you. What do you need help with?";
    if (lower.includes("exit") || lower.includes("quit")) {
      return "Goodbye! Have a great day!";
    }
  };

  const response = getResponse(transcript);

  useEffect(() => {
    const synth = window.speechSynthesis;
    let utter;

    const speak = () => {
      const voices = synth.getVoices();
      // Try to find a UK English voice, fallback to any English voice
      let jarvisVoice = voices.find((voice) => voice.lang === "en-GB");
      if (!jarvisVoice) {
        jarvisVoice = voices.find((voice) => voice.lang.startsWith("en"));
      }
      utter = new SpeechSynthesisUtterance(response);
      utter.lang = "en-GB";
      if (jarvisVoice) {
        utter.voice = jarvisVoice;
      }
      synth.speak(utter);

      utter.onend = () => {
        navigate("/");
      };
    };

    if (synth.getVoices().length === 0) {
      const timer = setTimeout(speak, 500); // Slightly longer delay
      synth.onvoiceschanged = () => {
        clearTimeout(timer);
        speak();
      };
      return () => {
        clearTimeout(timer);
        synth.cancel();
      };
    } else {
      speak();
      return () => synth.cancel();
    }
  }, [response, navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url('/assets/3ZSH.gif')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontSize: "1.5rem"
      }}
    >
      <div>Transcript: {transcript}</div>
      <div>Response: {response}</div>
      {/* Optional: Button for user-triggered speech */}
      {/* <button onClick={speak}>Hear Response</button> */}
    </div>
  );
};

export default Talk;