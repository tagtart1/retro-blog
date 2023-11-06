import React from "react";
import "./ErrorPopUp.css";
import { useState, useRef } from "react";

const ErrorPopUp = ({ isVisible, message, onClose }) => {
  const [position, setPosition] = useState({ x: `40%`, y: `30%` });

  const isDragging = useRef(false); // Use useRef instead of useState
  const offsetPos = useRef({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;

    setPosition({
      x: e.clientX - offsetPos.current.x + "px",
      y: e.clientY - offsetPos.current.y + "px",
    });
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleMouseDown = (e) => {
    const rect = e.target.getBoundingClientRect();

    offsetPos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    isDragging.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const closePopUp = () => {
    onClose();
    setPosition({ x: `40%`, y: `30%` });
  };

  if (!isVisible) {
    return null;
  }

  // HANDLE FOR LIST OF MESSAGES and stuff

  return (
    <div className="error-pop-up-wrapper">
      <div
        className="error-pop-up-window"
        style={{ left: `${position.x}`, top: `${position.y}` }}
      >
        <div className="header-bar" onMouseDown={handleMouseDown}>
          <span>Error</span>
          <span className="close-x" onClick={closePopUp}>
            X
          </span>
        </div>
        <div className="main-content">
          <div className="error-info">
            <div className="red-x">
              <span>X</span>
            </div>
            <p>{message}</p>
          </div>
          <button className="ok-btn" onClick={closePopUp}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPopUp;
