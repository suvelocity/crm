import React from "react";
import girl from "../assets/girl.png";
import wave from "../assets/the-wave.png";

export default function Landing() {
  return (
    <div
      //@ts-ignore
      style={containerStyle}
    >
      <div style={waveStyle}>
        <img
          src={girl}
          style={{ position: "absolute", bottom: "13vh", right: "19.5vw" }}
          height="60%"
        />
        <div
          style={{
            paddingLeft: 30,
            position: "relative",
            width: "fit-content",
          }}
        >
          <p style={qouteStyle}>
            “There are those who dream,
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp; and there are those who wake
            <br />
            &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;up and make their
            dream come true.”
          </p>
          {/* @ts-ignore */}
          <span style={authorStyle}>{"S.E & N.L"}</span>
        </div>
        <br />
        <br />
      </div>
    </div>
  );
}

const containerStyle = {
  overflowY: "hidden",
  maxHeight: "calc(100vh-500px)",
  width: "100vw",
  userSelect: "none",
};

const waveStyle = {
  backgroundImage: `url(${wave})`,
  height: "95vh",
  paddingTop: 50,
  marginTop: 50,
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  width: "100vw",
};

const qouteStyle = {
  fontWeight: 900,
  fontSize: 40,
  lineHeight: "1.5em",
  textShadow: " -3px 4px 3px rgba(150, 150, 150, 1)",
};

const authorStyle = {
  position: "absolute",
  right: "5vh",
  bottom: "-5vh",
  fontStyle: "italic",
  fontSize: "1.6em",
};
