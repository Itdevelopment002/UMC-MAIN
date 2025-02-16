import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Committee.css";
import api, { baseURL } from "../api";
import { useTranslation } from "react-i18next";


const Committee = () => {
    const [selectedButton, setSelectedButton] = useState("Standing Committee");
    const [standingData, setStandingData] = useState([]);
    const [womenData, setWomenData] = useState([]);
    const [wardData, setWardData] = useState([]);
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [bgImage, setBgImage] = useState("");
    const { i18n, t } = useTranslation();


    useEffect(() => {
        fetchHeaderImage();
    }, []);
    const fetchHeaderImage = async () => {
        try {
            const response = await api.get('/banner');

            if (response.data.length > 0) {
                let selectedBanner = response.data.find(banner => banner.banner_name === "Committee");

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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [standingResponse, womenResponse, wardResponse] = await Promise.all([
                    api.get(`/standing-committee?lang=${i18n.language}`),
                    api.get(`/women-committee?lang=${i18n.language}`),
                    api.get(`/ward-committee?lang=${i18n.language}`)
                ]);
                setStandingData(standingResponse.data);
                setWomenData(womenResponse.data);
                const sortedData = wardResponse.data.sort((a, b) => a.ward.localeCompare(b.ward));
                setWardData(sortedData);
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };
        fetchData();
    }, [i18n.language]);

    const handleButtonClick = (buttonName) => {
        setSelectedButton(buttonName);
        setCurrentPage(1);
    };

    const transformWardData = (data) => {
        const wardGroups = {
            "Ward Committee A": [],
            "Ward Committee B": [],
            "Ward Committee C": [],
            "Ward Committee D": []
        };

        data.forEach((item) => {
            wardGroups[item.ward].push(item.heading);
        });

        const maxRows = Math.max(...Object.values(wardGroups).map((list) => list.length));

        Object.keys(wardGroups).forEach((ward) => {
            while (wardGroups[ward].length < maxRows) {
                wardGroups[ward].push("-");
            }
        });

        const transformedData = [];
        for (let i = 0; i < maxRows; i++) {
            transformedData.push({
                id: i + 1,
                "Ward Committee A": wardGroups["Ward Committee A"][i] || "-",
                "Ward Committee B": wardGroups["Ward Committee B"][i] || "-",
                "Ward Committee C": wardGroups["Ward Committee C"][i] || "-",
                "Ward Committee D": wardGroups["Ward Committee D"][i] || "-"
            });
        }

        return transformedData;
    };

    const transformedData = transformWardData(wardData);



    const getCurrentData = (data) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return data.slice(startIndex, startIndex + itemsPerPage);
    };

    const totalEntries = selectedButton === "Standing Committee"
        ? standingData.length
        : selectedButton === "Women and child Welfare Committee"
            ? womenData.length
            : transformedData.length;

    const totalPages = Math.ceil(totalEntries / itemsPerPage);
    const startEntry = (currentPage - 1) * itemsPerPage + 1;
    const endEntry = Math.min(currentPage * itemsPerPage, totalEntries);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <>
            <div
                className="history-header-image"
                style={{
                    backgroundImage: `url(${bgImage})`,

                }}
            ></div>
            <div id="main-content">
                <div className="container-fluid font-location mt-4 mb-5" id="committee-css">
                    <nav className="breadcrumb">
                        <Link to="/" className="breadcrumb-item text-decoration-none">
                            {t('corporation.home')}
                        </Link>
                        <Link to="#" className="breadcrumb-item text-decoration-none">
                            {t('corporation.corporation')}
                        </Link>
                        <span className="breadcrumb-item active1">{t('committee.heading')}</span>
                    </nav>
                    <h2 className="location-title">
                        <span className="highlight">{t('committee.highlight')}</span>
                        <span className="highlighted-text"> {t('committee.highlight-text')}</span>
                        <hr />
                    </h2>

                    <div className="row mt-4 row-styling-3" id="municipal-css">
                        <div className="col-xl-9 col-lg-12 col-md-12 col-sm-12 col-12 ">
                            <div className="button-group mb-4 d-flex justify-content-start">
                                <button className={`btn ${selectedButton === 'Standing Committee' ? "active" : ""}`} onClick={() => handleButtonClick('Standing Committee')}>{t('committee.standingcommittee')}</button>
                                <button className={`btn ${selectedButton === 'Women and child Welfare Committee' ? "active" : ""}`} onClick={() => handleButtonClick('Women and child Welfare Committee')}>{t('committee.womenCommittee')}</button>
                                <button className={`btn ${selectedButton === 'Ward Committee' ? "active" : ""}`} onClick={() => handleButtonClick('Ward Committee')}>{t('committee.wardCommitte')}</button>
                            </div>

                            {selectedButton === "Standing Committee" && (
                                <div className="circular-wrapper mt-5">
                                    <table className="table table-bordered shadow table-responsive">
                                        <thead className="bg-orange text-white">
                                            <tr>
                                                <th className="text-center table-heading-styling" width="8%">Sr No.</th>
                                                <th className="table-heading-styling text-start">Standing Committee Name</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {getCurrentData(standingData).length > 0 ? (
                                                getCurrentData(standingData).map((item, index) => (
                                                    <tr key={item.id}>
                                                        <td className="font-large text-center">{startEntry + index}</td>
                                                        <td
                                                            className="text-start"
                                                            style={{ textWrap: "pretty" }}
                                                        >
                                                            {item.heading}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="100%" className="text-center">
                                                        No data available
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {selectedButton === "Women and child Welfare Committee" && (
                                <div className="circular-wrapper mt-5">
                                    <table className="table table-bordered shadow table-responsive">
                                        <thead className="bg-orange text-white">
                                            <tr>
                                                <th className="text-center table-heading-styling" width="8%">Sr No.</th>
                                                <th className="table-heading-styling text-start">Women and child Welfare Committee Name</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {getCurrentData(womenData).length > 0 ? (
                                                getCurrentData(womenData).map((item, index) => (
                                                    <tr key={item.id}>
                                                        <td className="font-large text-center">{startEntry + index}</td>
                                                        <td
                                                            className="text-start"
                                                            style={{ textWrap: "pretty" }}
                                                        >
                                                            {item.heading}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="100%" className="text-center">
                                                        No data available
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {selectedButton === "Ward Committee" && (
                                <div className="circular-wrapper mt-5">
                                    <table className="table table-bordered shadow table-responsive">
                                        <thead className="bg-orange text-white">
                                            <tr>
                                                <th className="text-center table-heading-styling" width="8%">Sr No.</th>
                                                <th className="table-heading-styling text-start">Ward Committee A</th>
                                                <th className="table-heading-styling text-start">Ward Committee B</th>
                                                <th className="table-heading-styling text-start">Ward Committee C</th>
                                                <th className="table-heading-styling text-start">Ward Committee D</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {getCurrentData(transformedData).length > 0 ? (
                                                getCurrentData(transformedData).map((item) => (
                                                    <tr key={item.id}>
                                                        <td className="font-large text-center">{item.id}</td>
                                                        <td className="text-start" style={{ textWrap: "pretty" }}>{item["Ward Committee A"]}</td>
                                                        <td className="text-start" style={{ textWrap: "pretty" }}>{item["Ward Committee B"]}</td>
                                                        <td className="text-start" style={{ textWrap: "pretty" }}>{item["Ward Committee C"]}</td>
                                                        <td className="text-start" style={{ textWrap: "pretty" }}>{item["Ward Committee D"]}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="text-center">No data available</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}


                            <div className="last-updated-container">
                                <p className="last-updated-text">
                                    <b>Showing {startEntry} to {endEntry} of {totalEntries} entries</b>
                                </p>
                            </div>

                            <nav aria-label="Page navigation" className="d-flex justify-content-start">
                                <ul className="pagination custom-pagination">
                                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                        <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
                                    </li>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                                        <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? "active" : ""}`}>
                                            <button className="page-link" onClick={() => handlePageChange(pageNumber)}>{pageNumber}</button>
                                        </li>
                                    ))}
                                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                        <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Next</button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Committee;
