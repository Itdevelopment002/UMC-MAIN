import React, { useState, useEffect } from "react";
import "./Celebration.css";
import Confetti from "react-confetti";
import celebrationSound from "../../../src/assets/applause-01-253125.mp3";
import ribbon from "../../assets/ribbon.png"
import api from "../api";

const Celebration = ({ onStart }) => {
    const [animationStarted, setAnimationStarted] = useState(false);
    const [cut, setCut] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showFireworks, setShowFireworks] = useState(false);
    //eslint-disable-next-line
    const [showGif, setShowGif] = useState(false);
    const [showFallingItems, setShowFallingItems] = useState(false);
    const [fallingItems, setFallingItems] = useState([]);
    const [status, setStatus] = useState("disable");

    useEffect(() => {
        const fetchStatuses = async () => {
            try {
                const celebrationResponse = await api.get("/celebration/1");
                const celebrationStatus = celebrationResponse.data.status;
                setStatus(celebrationStatus);
                const cuttingResponse = await api.get("/cutting/1");
                const cuttingStatus = cuttingResponse.data.status;

                if (celebrationStatus === "Enable" && cuttingStatus === "Yes") {
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
        setTimeout(async () => {
            setCut(true);
            setShowConfetti(true);
            setShowFireworks(true);
            setShowGif(true);
            setShowFallingItems(true);

            generateFallingItems();

            setTimeout(async () => {
                setShowConfetti(false);
                setShowFireworks(false);
                setShowGif(false);
                setShowFallingItems(false);

                try {
                    await api.put("/celebration/1", { status: "Disable" });
                    await api.put("/cutting/1", { status: "No" });
                    setStatus("Disable");
                    onStart();
                } catch (error) {
                    console.error("Error updating celebration status:", error);
                }
            }, 2000);
        }, 2000);
    };

    const generateFallingItems = () => {
        const items = [];
        for (let i = 0; i < 50; i++) {
            items.push({
                id: i,
                left: `${Math.random() * 100}%`,
                type: Math.random() > 0.3 ? "star" : "ribbon",
                delay: `${Math.random() * 2}s`,
            });
        }
        setFallingItems(items);
    };

    if (status === "Disable") {
        return null;
    }

    return (
        <div className={`${status === "Enable" ? "intro-page" : ""} ${cut ? "cut" : ""}`}>
            {showConfetti && <Confetti numberOfPieces={2000} tweenDuration={5000} />}
            {showFireworks && (
                <>
                    <div className="firework" style={{ left: "20%", top: "30%" }}></div>
                    <div className="firework" style={{ left: "50%", top: "40%" }}></div>
                    <div className="firework" style={{ left: "80%", top: "30%" }}></div>
                    <div className="firework" style={{ left: "40%", top: "20%" }}></div>
                    <div className="firework" style={{ left: "70%", top: "50%" }}></div>
                </>
            )}

            {showFallingItems && (
                <div className="falling-container">
                    {fallingItems.map((item) => (
                        <div
                            key={item.id}
                            className={`falling-item ${item.type}`}
                            style={{ left: item.left, animationDelay: item.delay }}
                        ></div>
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
                <img
                    src={ribbon}
                    alt="Cut the Ribbon"
                    className="scissor-img"
                />
            )}

        </div>
    );
};

export default Celebration;