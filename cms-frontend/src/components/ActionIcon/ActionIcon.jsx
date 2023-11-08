import React from "react";
import "./ActionIcon.scss";

const ActionIcon = ({ onClick, icon, name }) => {
  return (
    <div onClick={onClick} className="action-button">
      <img src={icon} alt="post action icon" />
      <p>{name}</p>
    </div>
  );
};

export default ActionIcon;
