import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { baseURL } from "../api";
import image from "../../assets/img/profile-image.jpg"
import { jwtDecode } from "jwt-decode";

const ViewProfile = ({ onLogout }) => {
    const [user, setUser] = useState(null);
    const token = localStorage.getItem("authToken");
    const userData = token ? jwtDecode(token) : null;
    const id = userData?.userId;

    const fetchUser = async () => {
        try {
            const response = await api.get(`/users/${id}`);
            setUser(response.data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    useEffect(() => {
        fetchUser();
        //eslint-disable-next-line
    }, [id]);

    return (
        <div className="page-wrapper">
            <div className="content">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link to="/home">Home</Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            View Profile
                        </li>
                    </ol>
                </nav>
                <div className="card mb-4 p-4">
                    <div className="row align-items-center">
                        <div className="col-md-4 text-center">
                            <img
                                src={image}
                                alt="User Avatar"
                                className="rounded-circle img-fluid"
                                style={{ width: "150px" }}
                            />
                            <h5 className="mt-3">{user?.username || "User"}</h5>
                            <h6 className="text-muted">{user?.role || "User"}</h6>
                        </div>
                        <div className="col-md-8 mt-2">
                            <div className="row">
                                <div className="col-sm-4"><strong>Full Name:</strong></div>
                                <div className="col-sm-8 text-muted">{user?.fullname || "N/A"}</div>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-sm-4"><strong>Email:</strong></div>
                                <div className="col-sm-8 text-muted">{user?.email || "example@example.com"}</div>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-sm-4"><strong>Status:</strong></div>
                                <div className="col-sm-8 text-muted">{user?.status || "N/A"}</div>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-sm-4"><strong>Permission:</strong></div>
                                <div className="col-sm-8 text-muted">{user?.permission || "N/A"}</div>
                            </div>
                            <hr />
                            <div className="mt-3 d-flex justify-content-end">
                                <Link to={`/edit-profile`} className="btn btn-outline-success mx-2 btn-sm">
                                    Edit Profile
                                </Link>
                                <button className="btn btn-outline-primary mx-2 btn-sm" onClick={onLogout}>
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ViewProfile;
