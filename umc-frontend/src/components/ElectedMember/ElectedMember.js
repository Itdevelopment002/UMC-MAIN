import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./ElectedMember.css";
import pdficon from '../../assets/images/Departments/document 1.png'
import "../TableCss/TableCss.css";
import Swal from "sweetalert2";

const ElectedMember = () => {
    const members = [
        { name: "List of Mayor and Standing Committee Chairman", link: "https://drive.google.com/file/d/1ob1fdk3qSlJgVL7xQburZStYMLbIJpeJ/view?usp=drive_link", action: "View PDF" },
        { name: "List of Corporators from 2017-2022", link: "https://drive.google.com/file/d/1rB22H63Ot5AWHlFtxkK3czsKQMD5fYQ_/view?usp=drive_link", action: "View PDF" },
        { name: "List of Corporators from 2012-2017", link: "https://drive.google.com/file/d/163tNag7AktKF6tEej9Tue1MZ0Q6M3nR4/view?usp=drive_link", action: "View PDF" },
        { name: "List of Corporators from 2002-2007", link: "https://drive.google.com/file/d/1N-pEUAc3_eEHV37jdqJU_fTy66miPHk3/view?usp=drive_link", action: "View PDF" },
        { name: "List of Corporators from 1997-2002", link: "https://drive.google.com/file/d/1LRzO5_Y61SS5mWOdb1bmxE5133eYour9/view?usp=drive_link", action: "View PDF" },
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
                <div className="container-fluid font-location mt-4 mb-2" id="elected-css">
                    <nav className="breadcrumb">
                        <Link to="/" className="breadcrumb-item text-decoration-none">
                            Home
                        </Link>
                        <Link to="#" className="breadcrumb-item text-decoration-none">
                            Corporation
                        </Link>
                        <span className="breadcrumb-item active1">Elected Members</span>
                    </nav>
                    <h2 className="location-title">
                        <span className="highlight">Elected</span>
                        <span className="highlighted-text"> Members</span>
                        <hr />
                    </h2>

                    <div className="row mt-4">
                        <div className="col-12 col-xl-6 col-lg-12 col-md-12 col-sm-12">
                            <div className="circular-wrapper">
                                <table className="table table-bordered table-responsive shadow">
                                    <thead className="bg-orange text-white">
                                        <tr>
                                            <th className="table-heading-styling" style={{ textAlign: "center" }}>
                                                Sr. No.
                                            </th>
                                            <th className="table-heading-styling">
                                                Name
                                            </th>
                                            <th className="table-heading-styling" style={{ textAlign: "center" }}>
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {members.map((item, index) => (
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
                                                    {item.name}
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

export default ElectedMember;