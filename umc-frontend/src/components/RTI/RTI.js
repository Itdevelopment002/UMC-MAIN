import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import pdficon from '../../assets/images/Departments/document 1.png';
import "../TableCss/TableCss.css";
import Swal from "sweetalert2";

const RTI = () => {
    const rtis = [
        { description: "RTI Disclosure for Year 2017", link: "#", action: "View PDF" },
        { description: "Proactive Disclosure under Section 4", link: "#", action: "View PDF" },
        { description: "Appeal Form", link: "https://drive.google.com/file/d/14sIcVim6AeER5tXC9IzR94UzkG9dD6mz/view?usp=drive_link", action: "View PDF" },
        { description: "RTI Officers", link: "https://drive.google.com/file/d/1m5FfuBATBYngrJCvKHdH0BnxGNuC3e-e/view?usp=drive_link", action: "View PDF" },
        { description: "RTI Application", link: "https://drive.google.com/file/d/1c5Oc-Fokl4q0y53SzQ25mE8Hd5P-fw69/view?usp=drive_link", action: "View PDF" },
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
                <div className="container-fluid font-location mt-4 mb-2" id="rti-css">
                    <nav className="breadcrumb">
                        <Link to="/" className="breadcrumb-item text-decoration-none">
                            Home
                        </Link>
                        <span className="breadcrumb-item active1">Right to Information</span>
                    </nav>
                    <h2 className="location-title">
                        <span className="highlight">Right</span>
                        <span className="highlighted-text"> to Information</span>
                        <hr />
                    </h2>
                    <div className="row mt-4">
                        <div className="col-12 col-xl-9 col-lg-12 col-md-12 col-sm-12">
                            <div className="circular-wrapper">
                                <table className="table table-bordered table-responsive shadow">
                                    <thead className="bg-orange text-white">
                                        <tr>
                                            <th className="table-heading-styling" style={{ textAlign: "center" }}>
                                                Sr. No.
                                            </th>
                                            <th className="table-heading-styling">
                                                Description
                                            </th>
                                            <th className="table-heading-styling" style={{ textAlign: "center" }}>
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rtis.map((item, index) => (
                                            <tr key={index}>
                                                <td
                                                    className="font-large"
                                                    width="10%"
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
                                                    width="70%"
                                                    style={{
                                                        paddingLeft: "10px",
                                                        paddingRight: "10px",
                                                        color: "#292D32",
                                                    }}
                                                >
                                                    {item.description}
                                                </td>
                                                <td
                                                    width="20%"
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
                                                        {item.action}
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

export default RTI;