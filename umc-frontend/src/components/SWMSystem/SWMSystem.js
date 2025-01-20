import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import pdficon from '../../assets/images/Departments/document 1.png';
import './SWMSystem.css';
import "../TableCss/TableCss.css"
import Swal from 'sweetalert2';

const SWMSystem = () => {
    const solidWaste = [
        { description: "Micro Plan Solid Waste Management System Agreement Copy", link: "https://drive.google.com/file/d/1TtsmgRnAqdlDZpP97cShfzOPddFnDobI/view?usp=drive_link", posting: "View PDF" },
        { description: "Micro Plan Solid Waste Management System for Ward Committee / Zone No.1", link: "https://drive.google.com/file/d/1AwO2J44SiUmek1xuLZB3RelO01KLJnCS/view?usp=drive_link", posting: "View PDF" },
        { description: "Micro Plan Solid Waste Management System for Ward Committee / Zone No.2", link: "https://drive.google.com/file/d/1P24327j-LPAC_ljq_s0TAg0S_Y1-SKlq/view?usp=drive_link", posting: "View PDF" },
        { description: "Micro Plan Solid Waste Management System for Ward Committee / Zone No.3", link: "https://drive.google.com/file/d/1VpRqYBTNi1PzbRwnpcHK_prfyKSRaJOe/view?usp=drive_link", posting: "View PDF" },
        { description: "Micro Plan Solid Waste Management System for Ward Committee / Zone No.4", link: "https://drive.google.com/file/d/1Oxf3oI7DgF261VN6vUOw0CGvG6ZLZGaW/view?usp=drive_link", posting: "View PDF" },
        { description: "Solid Waste Management System Contractor Representative Contact Numbers for complaints", link: "#", posting: "View PDF" },
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
                <div className="container-fluid font-location mt-4 mb-2" id="solid-system-css">
                    <nav className="breadcrumb">
                        <Link to="/" className="breadcrumb-item text-decoration-none">
                            Home
                        </Link>
                        <span className="breadcrumb-item active1">Solid Waste Management System</span>
                    </nav>
                    <h2 className="location-title">
                        <span className="highlight">Solid Waste</span>
                        <span className="highlighted-text"> Management System</span>
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
                                        {solidWaste.map((item, index) => (
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
                    <div className="row mt-4">
                        <div className="col-12 col-xl-9 col-lg-12 col-md-12 col-sm-12">
                            <div className="system-style-div text-start">
                                <p className="mb-0">
                                    <span className="span-system1">GPS Live Tracking</span><span className='mx-1 span-system1'>-</span>
                                    <span className="span-system2"> Garbage Vehicle <Link to="http://maptronicz.in/jsp/login.jsp" target="_blank">Click Here for Live View</Link> | Username : user | Password: 123456</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SWMSystem;