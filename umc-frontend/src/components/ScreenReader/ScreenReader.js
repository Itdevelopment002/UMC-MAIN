import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import './ScreenReader.css';
import "../TableCss/TableCss.css";

const ScreenReader = () => {
    const readers = [
        {
            "name": "Screen Access For All (SAFA)",
            "link": "http://safa-reader.software.informer.com/download/",
            "available": "Free"
        },
        {
            "name": "Non Visual Desktop Access (NVDA)",
            "link": "http://www.nvda-project.org/",
            "available": "Free"
        },
        {
            "name": "System Access To Go",
            "link": "http://www.satogo.com/",
            "available": "Free"
        },
        {
            "name": "Thunder",
            "link": "http://www.screenreader.net/index.php?pageid=11",
            "available": "Free"
        },
        {
            "name": "Web any where",
            "link": "http://webanywhere.cs.washington.edu/wa.php",
            "available": "Free"
        },
        {
            "name": "Hal",
            "link": "http://www.yourdolphin.co.uk/productdetail.asp?id=5",
            "available": "Commercial"
        },
        {
            "name": "JAWS",
            "link": "http://www.freedomscientific.com/Products/Blindness/JAWS",
            "available": "Commercial"
        },
        {
            "name": "Supernova",
            "link": "http://www.yourdolphin.co.uk/productdetail.asp?id=1",
            "available": "Commercial"
        },
        {
            "name": "Window-Eyes",
            "link": "http://www.gwmicro.com/Window-Eyes/",
            "available": "Commercial"
        }
    ];

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
                                            <th className="table-heading-styling" style={{ textAlign: "center" }}>
                                                Sr. No.
                                            </th>
                                            <th className="table-heading-styling">
                                                Screen Reader Name
                                            </th>
                                            <th className="table-heading-styling">
                                                Website
                                            </th>
                                            <th className="table-heading-styling" style={{ textAlign: "center" }}>
                                                Free / Commercial
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {readers.map((item, index) => (
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
                                                    <Link to={item.link} className="text-decoration-none custom-list-effect" target="_blank">
                                                        {item.link}
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