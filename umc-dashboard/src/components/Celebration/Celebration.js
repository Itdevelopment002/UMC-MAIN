import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api";
import { Link } from "react-router-dom";

const Celebration = () => {
    const [celebrationStatus, setCelebrationStatus] = useState("");

    useEffect(() => {
        fetchCelebrationStatus();
    }, []);

    const fetchCelebrationStatus = async () => {
        try {
            const response = await api.get("/celebration/1");
            setCelebrationStatus(response.data.status);
        } catch (error) {
            toast.error("Failed to fetch celebration status!");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put("/celebration/1", { status: celebrationStatus });
            toast.success("Celebration status updated successfully!");
        } catch (error) {
            toast.error("Failed to update celebration status!");
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
                                            <h4 className="page-title">Enable / Disable Celebration</h4>
                                        </div>
                                    </div>
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group row mt-3">
                                            <label className="col-form-label col-lg-2">
                                                Select an option
                                            </label>
                                            <div className="col-md-4">
                                                <div className="form-check">
                                                    <input
                                                        type="radio"
                                                        className="form-check-input"
                                                        id="enable"
                                                        name="celebration"
                                                        value="Enable"
                                                        checked={celebrationStatus === "Enable"}
                                                        onChange={(e) => setCelebrationStatus(e.target.value)}
                                                    />
                                                    <label className="form-check-label" htmlFor="enable">
                                                        Enable
                                                    </label>
                                                </div>
                                                <div className="form-check mt-2">
                                                    <input
                                                        type="radio"
                                                        className="form-check-input"
                                                        id="disable"
                                                        name="celebration"
                                                        value="Disable"
                                                        checked={celebrationStatus === "Disable"}
                                                        onChange={(e) => setCelebrationStatus(e.target.value)}
                                                    />
                                                    <label className="form-check-label" htmlFor="disable">
                                                        Disable
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <input
                                            type="submit"
                                            className="btn btn-primary btn-sm"
                                            value="Submit"
                                        />
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