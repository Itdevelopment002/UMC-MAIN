import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import './RTS.css';
import pdficon from '../../assets/images/Departments/document 1.png'
import exticon from '../../assets/images/extIcon.png'
import api, { baseURL } from "../api"

const RTS = () => {
    const [bgImage, setBgImage] = useState("");
    const [rts, setRts] = useState([]);

    const fetchHeaderImage = async () => {
        try {
            const response = await api.get("/banner");

            if (response.data.length > 0) {
                let selectedBanner = response.data.find(banner => banner.banner_name === "Right to Service");

                if (selectedBanner) {
                    setBgImage(`${baseURL}${selectedBanner.file_path}`);
                } else {
                    console.error("Banner with specified name not found.");
                }
            } else {
                console.error("No banner image found.");
            }
        } catch (error) {
            console.error("Error fetching header image:", error);
        }
    };

    const fetchRts = async () => {
        try {
            const response = await api.get("/rts");
            setRts(response.data);
        } catch (error) {
            console.error("Error fetching rts data", error);
        }
    };

    useEffect(() => {
        fetchRts();
        fetchHeaderImage();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <>
            <div
                className="history-header-image"
                style={{
                    backgroundImage: `url(${bgImage})`,

                }}
            ></div>

            <div id="main-content">
                <div className="container-fluid font-location mt-2 mb-5" id='rts-css'>
                    <nav className="breadcrumb">
                        <Link to="/" className="breadcrumb-item text-decoration-none">
                            Home
                        </Link>
                        <span className="breadcrumb-item active1">Right to Service Act 2015</span>
                    </nav>
                    <h2 className="location-title">
                        <span className="highlight">Right to Service </span>
                        <span className="highlighted-text">Act 2015</span>
                    </h2>
                    <hr />
                    <p>
                        The Maharashtra Right to Public Services Act, 2015 has been passed to provide the notified services provided by the government and all public authorities under the government to the citizens of the state of Maharashtra in a transparent, dynamic and prescribed time frame and it has come into force from 28.04.2015. Its objective is to provide services to the citizens in an easy and time-bound manner. To monitor, coordinate, and monitor whether the notified services are being provided to the citizens or not and to suggest improvements in this regard, the Maharashtra State Right to Public Services Commission has been constituted under the above Act and there is a Chief Commissioner and six Commissioners working in the Commission. The headquarters of the Commission is at New Administrative Building, opposite the Ministry, Mumbai and there are offices of the Commissioners at the headquarters of the six divisions. If the eligible citizens do not get the service within the prescribed time or if it is denied without proper reason, the concerned can file a first and second appeal against such decision with their superiors and if still not satisfied, a third appeal can be filed with the Commission. The guilty officer will be charged a counter-charge of Rs. A fine of up to Rs. 5000/- may be imposed. The list of notified services provided by this department is given in the attached form. The website of Maharashtra State Right to Services Commission is as follows:- <Link to='https://aaplesarkar.mahaonline.gov.in/' target="_blank" style={{ color: '#4674D9' }}>https://aaplesarkar.mahaonline.gov.in</Link>
                    </p>
                    <div className="row">
                        <div className="col-12 col-xl-12 col-lg-12 col-md-12 col-sm-12">
                            <div className='circular-wrapper'>
                                <table className="table table-bordered table-responsive shadow">
                                    <thead className="bg-orange text-white">
                                        <tr>
                                            <th className="table-heading-styling" style={{ textAlign: "center" }}>
                                                Sr. No.
                                            </th>
                                            <th className="table-heading-styling">
                                                Right to Service Act 2015
                                            </th>
                                            <th className="table-heading-styling" style={{ textAlign: "center" }}>
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rts.map((item, index) => (
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
                                                    {item.heading}
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
                                                        target="_blank"
                                                        style={{ color: "#292D32" }}
                                                    >
                                                        {item.link.endsWith("drive_link") ? (
                                                            <>
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
                                                                View PDF
                                                            </>
                                                        ) : (
                                                            <>
                                                                Open Link
                                                                <img
                                                                    src={exticon}
                                                                    alt="PDF Icon"
                                                                    style={{
                                                                        width: "18px",
                                                                        height: "18px",
                                                                        marginLeft: "8px",
                                                                        verticalAlign: "middle",
                                                                    }}
                                                                />
                                                            </>
                                                        )}
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

export default RTS