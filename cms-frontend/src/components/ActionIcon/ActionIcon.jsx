import React from "react";
import "./ActionIcon.scss";

const ActionIcon = ({ onClick, icon, name, className }) => {
  return (
    <div
      onClick={onClick}
      className={`action-button ${!className ? "" : className}`}
    >
      <img src={icon} alt="post action icon" />
      <p>{name}</p>
    </div>
  );
};

export default ActionIcon;
