import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api";
import { Link } from "react-router-dom";

const Celebration = () => {
    const [curtainStatus, setCurtainStatus] = useState("");
    const [ribbonStatus, setRibbonStatus] = useState("");

    useEffect(() => {
        fetchCurtainStatus();
        fetchRibbonStatus();
    }, []);

    const fetchCurtainStatus = async () => {
        try {
            const response = await api.get("/celebration/1");
            setCurtainStatus(response.data.status);
        } catch (error) {
            toast.error("Failed to fetch curtain status!");
        }
    };

    const fetchRibbonStatus = async () => {
        try {
            const response = await api.get("/cutting/1");
            setRibbonStatus(response.data.status);
        } catch (error) {
            toast.error("Failed to fetch ribbon status!");
        }
    };

    const handleCurtainUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.post("/edit-celebration/1", { status: curtainStatus });
            toast.success("Curtain status updated successfully!");
        } catch (error) {
            toast.error("Failed to update curtain status!");
        }
    };

    const handleRibbonUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.post("/edit-cutting/1", { status: ribbonStatus });
            toast.success("Ribbon status updated successfully!");
        } catch (error) {
            toast.error("Failed to update ribbon status!");
        }
    };

    return (
        <div>
            <div className="page-wrapper">
                <div className="content">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link to="#">Home</Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            Celebration
                        </li>
                    </ol>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card-box">
                                <div className="card-block">
                                    <div className="row">
                                        <div className="col-12">
                                            <h4 className="page-title">Celebration Status</h4>
                                        </div>
                                    </div>

                                    <form onSubmit={handleCurtainUpdate}>
                                        <div className="form-group row mt-3">
                                            <label className="col-form-label col-lg-2">
                                                Show Curtain
                                            </label>
                                            <div className="col-md-4">
                                                <div className="form-check">
                                                    <input
                                                        type="radio"
                                                        className="form-check-input"
                                                        id="curtainEnable"
                                                        name="curtain"
                                                        value="Enable"
                                                        checked={curtainStatus === "Enable"}
                                                        onChange={(e) => setCurtainStatus(e.target.value)}
                                                    />
                                                    <label className="form-check-label" htmlFor="curtainEnable">
                                                        Enable
                                                    </label>
                                                </div>
                                                <div className="form-check mt-2">
                                                    <input
                                                        type="radio"
                                                        className="form-check-input"
                                                        id="curtainDisable"
                                                        name="curtain"
                                                        value="Disable"
                                                        checked={curtainStatus === "Disable"}
                                                        onChange={(e) => setCurtainStatus(e.target.value)}
                                                    />
                                                    <label className="form-check-label" htmlFor="curtainDisable">
                                                        Disable
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <input
                                            type="submit"
                                            className="btn btn-primary btn-sm"
                                            value="Update Curtain Status"
                                        />
                                    </form>

                                    <hr />

                                    <form onSubmit={handleRibbonUpdate}>
                                        <div className="form-group row mt-3">
                                            <label className="col-form-label col-lg-2">Cut the Ribbon</label>
                                            <div className="col-md-4">
                                                <div className="form-check">
                                                    <input
                                                        type="radio"
                                                        className="form-check-input"
                                                        id="cutYes"
                                                        name="cut"
                                                        value="Yes"
                                                        checked={ribbonStatus === "Yes"}
                                                        onChange={(e) => setRibbonStatus(e.target.value)}
                                                    />
                                                    <label className="form-check-label" htmlFor="cutYes">
                                                        Yes
                                                    </label>
                                                </div>
                                                <div className="form-check mt-2">
                                                    <input
                                                        type="radio"
                                                        className="form-check-input"
                                                        id="cutNo"
                                                        name="cut"
                                                        value="No"
                                                        checked={ribbonStatus === "No"}
                                                        onChange={(e) => setRibbonStatus(e.target.value)}
                                                    />
                                                    <label className="form-check-label" htmlFor="cutNo">
                                                        No
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn btn-outline-warning text-black btn-sm mt-2 px-3 py-2 fw-bold shadow-sm d-flex align-items-center gap-2"
                                            style={{
                                                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                                                borderRadius: "8px",
                                                transition: "all 0.3s ease-in-out",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: '#333'
                                            }}>
                                            Cut the Ribbon 🎉
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Celebration;
