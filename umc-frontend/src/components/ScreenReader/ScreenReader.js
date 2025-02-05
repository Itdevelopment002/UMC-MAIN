import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './ScreenReader.css';
import "../TableCss/TableCss.css";
import api from "../api";

const ScreenReader = () => {
    const [reader, setReader] = useState([]);

    const fetchReader = async ()=>{
        try{
            const response = await api.get("/screen-reader");
            setReader(response.data);
        } catch(error){
            console.error("Error fetching reader data");
        }
    };

    useEffect(()=>{
        fetchReader();
    },[]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <>
            <div className="history-header-image"></div>
            <div id="main-content">
                <div className="container-fluid font-location mt-4 mb-2" id="reader-css">
                    <nav className="breadcrumb">
                        <Link to="/" className="breadcrumb-item text-decoration-none">
                            Home
                        </Link>
                        <span className="breadcrumb-item active1">Screen Reader Access</span>
                    </nav>
                    <h2 className="location-title">
                        <span className="highlight">Screen</span>
                        <span className="highlighted-text"> Reader Access</span>
                        <hr />
                    </h2>
                    <div className="row mt-4">
                        <div className="col-12 col-xl-9 col-lg-12 col-md-12 col-sm-12">
                            <div className="system-style-div text-start">
                                <p className="mb-0">
                                    <span className="span-system1">Below are the various screen readers to choose from</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="col-12">
                            <div className="circular-wrapper">
                                <table className="table table-bordered table-responsive shadow">
                                    <thead className="bg-orange text-white">
                                        <tr>
                                            <th className="table-heading-styling text-center" >
                                                Sr. No.
                                            </th>
                                            <th className="table-heading-styling">
                                                Screen Reader Name
                                            </th>
                                            <th className="table-heading-styling">
                                                Website
                                            </th>
                                            <th className="table-heading-styling text-center" >
                                                Free / Commercial
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reader.map((item, index) => (
                                            <tr key={index}>
                                                <td
                                                    className="font-large"
                                                    width="8%"
                                                    style={{
                                                        paddingLeft: "10px",
                                                        paddingRight: "10px",
                                                        color: "#292D32",
                                                        textAlign: "center"
                                                    }}
                                                >
                                                    {index + 1}
                                                </td>
                                                <td
                                                    width="35%"
                                                    style={{
                                                        paddingLeft: "10px",
                                                        paddingRight: "10px",
                                                        color: "#292D32",
                                                    }}
                                                >
                                                    {item.name}
                                                </td>
                                                <td
                                                    width="35%"
                                                    style={{
                                                        paddingLeft: "10px",
                                                        paddingRight: "10px",
                                                    }}
                                                >
                                                    <Link to={item.website} className="text-decoration-none custom-list-effect" target="_blank">
                                                        {item.website}
                                                    </Link>
                                                </td>
                                                <td
                                                    width="15%"
                                                    style={{
                                                        paddingLeft: "10px",
                                                        paddingRight: "10px",
                                                        color: "#292D32",
                                                        textAlign: "center"
                                                    }}
                                                >
                                                    {item.available}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ScreenReader;