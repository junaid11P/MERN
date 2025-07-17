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
    if (lower.includes("which is my college")) return "M S Ramaiah University of Applied Sciences"; 
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
    return `Jarvis: I heard you say "${query}"`;
  };

  const response = getResponse(transcript);

  useEffect(() => {
    const synth = window.speechSynthesis;

    const speak = () => {
      const voices = synth.getVoices();
      const jarvisVoice = voices.find((voice) =>
        voice.name.includes("Daniel")
      );
      const utter = new SpeechSynthesisUtterance(response);
      utter.lang = "en-GB";
      if (jarvisVoice) {
        utter.voice = jarvisVoice;
      }
      synth.speak(utter);

      // If user said their name, go back to home after response
      if (
        transcript.toLowerCase().includes("my name is") ||
        transcript.toLowerCase().includes("who am i")
      ) {
        utter.onend = () => {
          navigate("/");
        };
      }
    };

    if (synth.getVoices().length === 0) {
      synth.onvoiceschanged = speak;
    } else {
      speak();
    }
  }, [response, transcript, navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url('/assets/3ZSH.gif')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    />
  );
};

export default Talk;