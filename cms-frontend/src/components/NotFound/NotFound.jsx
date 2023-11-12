import React from "react";
import "./NotFound.scss";

const NotFound = ({ isTopLevel }) => {
  return (
    <div className={`not-found-parent ${isTopLevel ? "fart" : ""}`}>
      <main>
        <div className="tab-top">
          <h2>Nothing Here</h2>
          <div className="action-group">
            <span>_</span>
            <span>O</span>
            <span>X</span>
          </div>
        </div>
        <p>404 :(</p>
      </main>
    </div>
  );
};

export default NotFound;
