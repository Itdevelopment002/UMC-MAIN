import React, { useState, useEffect } from "react";
import "./Celebration.css";
import Confetti from "react-confetti";
import celebrationSound from "../../../src/assets/applause-01-253125.mp3";
import ribbon from "../../assets/ribbon.png";
import api from "../api";

const Celebration = ({ onStart }) => {
    const [animationStarted, setAnimationStarted] = useState(false);
    const [cut, setCut] = useState(false);
    const [showEffects, setShowEffects] = useState(false);
    const [fallingItems, setFallingItems] = useState([]);
    const [status, setStatus] = useState("Disable");

    useEffect(() => {
        const fetchStatuses = async () => {
            try {
                const [celebrationRes, cuttingRes] = await Promise.all([
                    api.get("/celebration/1"),
                    api.get("/cutting/1"),
                ]);

                const celebrationStatus = celebrationRes.data.status;
                setStatus(celebrationStatus);

                if (celebrationStatus === "Enable" && cuttingRes.data.status === "Yes") {
                    handleCut();
                }
            } catch (error) {
                console.error("Error fetching statuses:", error);
            }
        };

        const intervalId = setInterval(fetchStatuses, 1000);
        return () => clearInterval(intervalId);
        //eslint-disable-next-line
    }, []);

    const playSound = () => {
        const audio = new Audio(celebrationSound);
        audio.play().catch(error => console.error("Sound play failed:", error));
    };

    const handleCut = async () => {
        setAnimationStarted(true);
        playSound();

        setTimeout(() => {
            setCut(true);
            setShowEffects(true);
            generateFallingItems();

            setTimeout(async () => {
                setShowEffects(false);
                try {
                    await Promise.all([
                        api.put("/celebration/1", { status: "Disable" }),
                        api.put("/cutting/1", { status: "No" })
                    ]);
                    setStatus("Disable");
                    onStart();
                } catch (error) {
                    console.error("Error updating celebration status:", error);
                }
            }, 2000);
        }, 2000);
    };

    const generateFallingItems = () => {
        setFallingItems(
            Array.from({ length: 50 }, (_, i) => ({
                id: i,
                left: `${Math.random() * 100}%`,
                type: Math.random() > 0.3 ? "star" : "ribbon",
                delay: `${Math.random() * 2}s`,
            }))
        );
    };

    if (status === "Disable") return null;

    return (
        <div className={`celebration-container ${status === "Enable" ? "intro-page" : ""} ${cut ? "cut" : ""}`}>
            {showEffects && <Confetti numberOfPieces={2000} tweenDuration={5000} />}

            {showEffects && (
                <>
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="firework" style={{ left: `${20 + i * 15}%`, top: `${20 + i * 10}%` }}></div>
                    ))}
                </>
            )}

            {showEffects && (
                <div className="falling-container">
                    {fallingItems.map((item) => (
                        <div key={item.id} className={`falling-item ${item.type}`} style={{ left: item.left, animationDelay: item.delay }}></div>
                    ))}
                </div>
            )}

            {status === "Enable" && (
                <div className={`ribbon ${animationStarted ? "animate" : ""}`}>
                    <div className="ribbon-left"></div>
                    <div className="ribbon-right"></div>
                </div>
            )}

            {!animationStarted && status === "Enable" && (
                <img src={ribbon} alt="Cut the Ribbon" className="scissor-img" />
            )}
        </div>
    );
};

export default Celebration;
