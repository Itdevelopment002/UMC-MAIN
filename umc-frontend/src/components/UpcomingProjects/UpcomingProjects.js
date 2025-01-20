import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./UpcomingProjects.css";

import img1 from "../../assets/images/project/img1.png";
import img2 from "../../assets/images/project/img2.png";
import img3 from "../../assets/images/project/img3.png";
import img4 from "../../assets/images/project/img4.png";

const UpcomingProjects = () => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <>
            <div className="history-header-image"></div>

            <div className="container-fluid font-location mt-4 mb-2" id="project-css">
                <nav className="breadcrumb">
                    <Link to="/" className="breadcrumb-item text-decoration-none">
                        Home
                    </Link>
                    <span className="breadcrumb-item active1">Upcoming Projects</span>
                </nav>
                <h2 className="location-title">
                    <span className="highlight">Upcoming</span>
                    <span className="highlighted-text"> Projects</span>
                </h2>
                <div className="row mt-4">
                    <div className="col-12">
                        <h3 className="text-danger mb-4">
                            Construction of cement concrete road from Netaji Chowk in Ulhasnagar-4
                            to Kailash Colony, via Kurla Camp.
                        </h3>
                        <hr />
                        <div className="work-details mb-4">
                            <h5 className="project-work-style-h5">Work Details:</h5>
                            <ul className="project-work-style">
                                <li>
                                    Drainage work on both sides has been completed, road concreting from
                                    Bhatia Chowk to Kailas Colony has been completed. Usage is in
                                    progress. Work is in progress near Samata Nagar Arch and near
                                    Gurunnanak School.
                                </li>
                                <li>
                                    Kali Mata Chowk, Sainath Colony, Lalsai Bungalow Chowk is pending.
                                    Bhatia Chowk to Netaji Chowk work is pending. Sewage channel work is
                                    in progress.
                                </li>
                            </ul>
                            <ol type="1" className="project-work-style">
                                <li>
                                    Encroachments on both sides of the road have been removed by
                                    giving notice from the ward office.
                                </li>
                                <li>Work near Swargdwar crematorium needs to be completed and made proper soon.</li>
                                <li>The work of the divider is incomplete.</li>
                            </ol>
                            <p className="project-work-style">
                                The length of the proposed road is 2000 meters and the width is 24 meters.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="row mb-4">
                    <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 sizing-image-col">
                        <div className="card2 rounded-2">
                            <img src={img1} className="card-img-top" alt="" />
                        </div>
                    </div>
                    <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 sizing-image-col">
                        <div className="card2 rounded-2">
                            <img src={img2} className="card-img-top" alt="" />
                        </div>
                    </div>
                    <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 sizing-image-col">
                        <div className="card2 rounded-2">
                            <img src={img3} className="card-img-top" alt="" />
                        </div>
                    </div><div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 sizing-image-col">
                        <div className="card2 rounded-2">
                            <img src={img4} className="card-img-top" alt="" />
                        </div>
                    </div>
                </div>
                <hr />
                <hr />

                <div className="row mt-4">
                    <div className="col-12">
                        <h3 className="text-danger mb-4">
                            Construction of cement concrete road from A-Block at Ulhasnagar-1 to Saibaba Temple, Dolphin Club and Century Ground.
                        </h3>
                        <hr />
                        <div className="work-details mb-4">
                            <h5 className="project-work-style-h5">Work Details:</h5>
                            <ul className="project-work-style">
                                <li>
                                    The drainage work on both sides has been completed, concreting of the road from Jai Babadham Chowk to Nijdham Ashram and Ration Office in front of Petrol Pump on the left side has been completed. Usage is in progress.
                                </li>
                                <li>
                                    Road work from Netaji School to New English School Road and Ration Office to Lalchakki Chowk is pending.
                                </li>
                                <li>
                                    The affected encroachment has been removed by giving a notice from the Ward Office. The work of sewage channel is in progress.
                                </li>
                            </ul>
                            <ol type="1" className="project-work-style">
                                <li>
                                    The work of divider is incomplete.
                                </li>
                                <li>The work of main Chowk is pending</li>
                            </ol>
                            <p className="project-work-style">
                                The length of the proposed road is 1100 meters and the width is 24 x 36 meters.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="row mb-4">
                    <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 sizing-image-col">
                        <div className="card2 rounded-2">
                            <img src={img1} className="card-img-top" alt="" />
                        </div>
                    </div>
                    <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 sizing-image-col">
                        <div className="card2 rounded-2">
                            <img src={img2} className="card-img-top" alt="" />
                        </div>
                    </div>
                    <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 sizing-image-col">
                        <div className="card2 rounded-2">
                            <img src={img3} className="card-img-top" alt="" />
                        </div>
                    </div><div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 sizing-image-col">
                        <div className="card2 rounded-2">
                            <img src={img4} className="card-img-top" alt="" />
                        </div>
                    </div>
                </div>
                <hr />
                <hr />

                <div className="row mt-4">
                    <div className="col-12">
                        <h3 className="text-danger mb-4">
                            Construction of cement concrete road from A-Block at Ulhasnagar-1 to Saibaba Temple, Dolphin Club and Century Ground.
                        </h3>
                        <hr />
                        <div className="work-details mb-4">
                            <h5 className="project-work-style-h5">Work Details:</h5>
                            <ul className="project-work-style">
                                <li>
                                    The drainage work on both sides has been completed, concreting of the road from Jai Babadham Chowk to Nijdham Ashram and Ration Office in front of Petrol Pump on the left side has been completed. Usage is in progress.
                                </li>
                                <li>
                                    Road work from Netaji School to New English School Road and Ration Office to Lalchakki Chowk is pending.
                                </li>
                                <li>
                                    The affected encroachment has been removed by giving a notice from the Ward Office. The work of sewage channel is in progress.
                                </li>
                            </ul>
                            <ol type="1" className="project-work-style">
                                <li>
                                    The work of divider is incomplete.
                                </li>
                                <li>The work of main Chowk is pending</li>
                            </ol>
                            <p className="project-work-style">
                                The length of the proposed road is 1100 meters and the width is 24 x 36 meters.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
};

export default UpcomingProjects;