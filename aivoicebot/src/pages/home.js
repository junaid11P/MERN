import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [recording, setRecording] = useState(false);

  const handleRecord = () => {
    setRecording(true);
    let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      setRecording(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setRecording(false);
      navigate("/talk", { state: { transcript } });
    };

    recognition.onerror = () => {
      setRecording(false);
      alert("Voice recognition failed. Try again.");
    };
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        backgroundImage: "url('/assets/loading.gif')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
      onClick={handleRecord}
      title="Click to record your query"
    >
      <div style={{ color: "#fff", fontSize: "2rem", textShadow: "0 0 10px #000" }}>
        {recording ? "Listening..." : " "}
      </div>
    </div>
  );
};

export default Home;