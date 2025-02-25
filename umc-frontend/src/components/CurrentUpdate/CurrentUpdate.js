import React, { useEffect, useState } from "react";
import "./CurrentUpdate.css";
import api from "../api"
import { useTranslation } from "react-i18next";

const CurrentUpdate = () => {
  const [animationState, setAnimationState] = useState({});
  const [updates, setUpdates] = useState([]);
  const { i18n, t } = useTranslation();

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

  const fetchUpdates = async () => {
    try {
      const response = await api.get(`/current-update?lang=${i18n.language}`);
      setUpdates(response.data);
    } catch (error) {
      console.error("Error Fetching updates!", error);
    }
  };

  useEffect(() => {
    fetchUpdates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  return (
    <section className="update-section" id="main-content">
      <div className="container-fluid">
        <div
          className="marquee"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <span className="marquee-label">{t("home.currentUpdates")}</span>
          <div
            className="marquee-content"
            style={{
              animationPlayState: animationState.paused ? "paused" : "running",
              transform: animationState.paused
                ? `translateX(${animationState.translateX}px)`
                : "",
            }}
          >
            {updates.concat(updates).map((item, index) => (
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
