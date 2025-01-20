import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import pdficon from '../../assets/images/Departments/document 1.png';
import './Policies.css';
import "../TableCss/TableCss.css"
import Swal from 'sweetalert2';

const Policies = () => {

    const policies = [
        { description: "test", link: "https://drive.google.com/file/d/1lekTKfmp6V6xG9VSvVjjzDbtPjFUKwp9/view?usp=drive_link", posting: "View PDF" },
    ];

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleClick = (link, e) => {
        if (link === "#") {
            e.preventDefault();
            Swal.fire({
                title: 'Information',
                text: 'The PDF will be available soon.',
                icon: 'info',
                confirmButtonText: 'Ok'
            });
        }
    };

    return (
        <>
            <div className="history-header-image"></div>

            <div id="main-content">
                <div className="container-fluid font-location mt-4 mb-2" id="policies-css">
                    <nav className="breadcrumb">
                        <Link to="/" className="breadcrumb-item text-decoration-none">
                            Home
                        </Link>
                        <Link to="#" className="breadcrumb-item text-decoration-none">
                            Corporation
                        </Link>
                        <span className="breadcrumb-item active1">Policies</span>
                    </nav>
                    <h2 className="location-title">
                        <span className="highlight">Policies</span>
                        <span className="highlighted-text"> of UMC</span>
                        <hr />
                    </h2>

                    <div className="row mt-4">
                        <div className="col-12 col-xl-6 col-lg-6">
                            <div className="circular-wrapper">
                                <table className="table table-bordered table-responsive shadow">
                                    <thead className="bg-orange text-white">
                                        <tr>
                                            <th className="table-heading-styling" style={{ textAlign: "center" }}>
                                                Sr. No.
                                            </th>
                                            <th className="table-heading-styling">
                                                Policies
                                            </th>
                                            <th className="table-heading-styling" style={{ textAlign: "center" }}>
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {policies.map((item, index) => (
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
                                                    style={{
                                                        paddingLeft: "10px",
                                                        paddingRight: "10px",
                                                        color: "#292D32",
                                                        textWrap: "pretty",
                                                    }}
                                                >
                                                    {item.description}
                                                </td>
                                                <td
                                                    width="10%"
                                                    style={{
                                                        paddingLeft: "10px",
                                                        paddingRight: "10px",
                                                        color: "#292D32",
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    <Link
                                                        to={item.link}
                                                        className="text-decoration-none"
                                                        target={item.link === "#" ? "" : "_blank"}
                                                        style={{ color: "#333333" }}
                                                        onClick={(e) => handleClick(item.link, e)}
                                                    >
                                                        <img
                                                            src={pdficon}
                                                            alt="PDF Icon"
                                                            style={{
                                                                width: "18px",
                                                                height: "18px",
                                                                marginRight: "8px",
                                                                verticalAlign: "middle",
                                                            }}
                                                        />
                                                        {item.posting}
                                                    </Link>
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

export default Policies;