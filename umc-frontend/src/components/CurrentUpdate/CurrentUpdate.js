import React, { useState } from "react";
import "./CurrentUpdate.css";

const CurrentUpdate = () => {
  const [animationState, setAnimationState] = useState({});
  const manualUpdates = [
    { description: "Welcome to Ulhasnagar Municipal Corporation Web Portal" },
    { description: "Pollution Control Helpline:18002331103" },
    { description: "Illegal Hoarding Complaint Toll Free No. 1800-233-1107/ Noise Pollution & Temporary Tent / Stage Complaint Toll Free No. : 1800-233-1101" },
  ];

  const handleMouseEnter = () => {
    const marquee = document.querySelector(".marquee-content");
    const computedStyle = window.getComputedStyle(marquee);
    const transform = computedStyle.transform;

    let translateX = 0;
    if (transform !== "none") {
      const matrix =
        transform.match(/matrix\((.+)\)/) ||
        transform.match(/matrix3d\((.+)\)/);
      if (matrix) {
        const values = matrix[1].split(", ");
        translateX = parseFloat(values[4]);
      }
    }

    setAnimationState({
      paused: true,
      translateX,
    });
  };

  const handleMouseLeave = () => {
    setAnimationState((prevState) => ({
      ...prevState,
      paused: false,
    }));
  };

  return (
    <section className="update-section" id="main-content">
      <div className="container-fluid">
        <div
          className="marquee"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className="marquee-content"
            style={{
              animationPlayState: animationState.paused ? "paused" : "running",
              transform: animationState.paused
                ? `translateX(${animationState.translateX}px)`
                : "",
            }}
          >
            {manualUpdates.concat(manualUpdates).map((item, index) => (
              <div className="marquee-item" key={index}>
                <span className="circle"></span>
                {item.description}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CurrentUpdate;
