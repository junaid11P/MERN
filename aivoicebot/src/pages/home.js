import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    setTimeout(() => {
      navigate("/talk");
    }, 5000); // 10 seconds delay
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        backgroundImage: "url('/assets/loading.gif')",
        backgroundSize: "cover",
        backgroundColor: "black",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        cursor: "pointer",
      }}
      onClick={handleClick}
      title="Click to start talking"
    >

    </div>
  );
};

export default Home;