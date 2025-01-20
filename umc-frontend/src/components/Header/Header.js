import React, { useState, useEffect, useRef } from "react";
import "./Header.css";
import { Link } from "react-router-dom";
import Mainlogo from "../../assets/images/header-img/logo 1.png";
import Headlogo1 from "../../assets/images/header-img/headerlogo1.png";
import Headlogo2 from "../../assets/images/header-img/aaple-sarkar.jpg";
import Headlogo3 from "../../assets/images/header-img/Hindi_logo 1.png";
import Headlogo4 from "../../assets/images/header-img/promotion (1).png";
import AdministrativeStructurePDF from '../../assets/pdfs/Administrative_Structure.pdf';
import AdministrativeWardsPDF from '../../assets/pdfs/Administrative_Wards.pdf';
import CitizenPDF from '../../assets/pdfs/citizen_charter_2024.pdf';
import TopHeader from "../TopHeader/TopHeader";
import { useLocation } from "react-router-dom";

const Navbar = () => {
    const [isNavCollapsed, setIsNavCollapsed] = useState(true);
    const location = useLocation();
    const navRef = useRef(null);

    const toggleNav = () => {
        setIsNavCollapsed(!isNavCollapsed);
    };

    const [activeLink, setActiveLink] = useState(() => {
        return localStorage.getItem("activeLink") || "Home";
    });

    const handleNavClick = (link) => {
        console.log(`Navigating to ${link}`);
        const nonNavigableLinks = [
            "About UMC",
            "Corporation",
            "Administrative Wings",
            "Departments",
            "Online Services",
            "Gallery",
        ];

        // Do not collapse the nav if the link is one of the non-navigable links
        if (!nonNavigableLinks.includes(link)) {
            setIsNavCollapsed(true);
            localStorage.setItem("activeLink", link);
        } else {
            console.log(`Dropdown opened for ${link}, navigation toggle remains open.`);
        }
        setActiveLink(link); // Update the active link
    };

    useEffect(() => {
        if (location.pathname === "/") {
            setActiveLink("Home");
            localStorage.setItem("activeLink", "Home");
        }
    }, [location]);

    useEffect(() => {
        const savedLink = localStorage.getItem("activeLink");
        if (savedLink) {
            setActiveLink(savedLink);
        }
    }, []);

    const handleClickOutside = (event) => {
        if (navRef.current && !navRef.current.contains(event.target)) {
            console.log("Clicked outside the nav");
            setIsNavCollapsed(true);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const openPDF = (pdfURL) => {
        window.open(pdfURL, '_blank');
    };


    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <div className="navbar-container">
            <TopHeader />
            <div className="banner d-flex justify-content-between py-2">
                <Link to="/">
                    <div className="logo d-flex">
                        <img src={Mainlogo} alt="Logo" className="logo-img" />
                        <div className="mt-2">
                            <h1 className="brand-name">ULHASNAGAR MUNICIPAL CORPORATION</h1>
                        </div>
                    </div>
                </Link>
                <div className="banner-image">
                    <img src={Headlogo1} alt="Image1" className="banner-img1" />
                    <Link
                        to="https://aaplesarkar.mahaonline.gov.in/en"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-decoration-none"
                    >
                        <img src={Headlogo2} alt="Image2" className="banner-img2" />
                    </Link>
                    <img src={Headlogo3} alt="Image3" className="banner-img3" />
                    <img src={Headlogo4} alt="Image4" className="banner-img4" />
                </div>
            </div>

            <header className="header-container">
                <div className="nav-menu">
                    <button
                        className="toggle-btn"
                        aria-label="Toggle navigation"
                        onClick={toggleNav}
                    >
                        &#9776;
                    </button>

                    {!isNavCollapsed && <div className="overlay" onClick={toggleNav}></div>}

                    <nav
                        ref={navRef}
                        className={`custom-nav ${isNavCollapsed ? "nav-hidden" : "nav-visible"
                            }`}
                    >
                        <button className="close-btn" onClick={toggleNav} aria-label="Close navigation">
                            &#10005;
                        </button>

                        <ul className="nav-list mb-0 px-4">
                            <li
                                className={`nav-item ${activeLink === "Home" ? "active" : ""}`}
                            >
                                <Link
                                    to="/"
                                    className={`nav-link ${activeLink === "Home" ? "active" : ""
                                        }`}
                                    onClick={() => handleNavClick("Home")}
                                >
                                    Home
                                </Link>
                            </li>

                            <span className="nav-divider"></span>

                            {/* About UMC Section */}
                            <li className={`nav-item dropdown about-dropdown ${activeLink === "About UMC" ? "active" : ""}`}>
                                <Link
                                    to="#"
                                    className={`nav-link dropdown-toggle d-flex align-items-center ${activeLink === "About UMC" ? "active" : ""
                                        }`}
                                    onClick={() => handleNavClick("About UMC")}
                                    id="aboutUMCDropdown"
                                    role="button"
                                    aria-expanded="false"
                                >
                                    <span className="me-1">About UMC</span>
                                    <i className="dropdown-icon"></i>
                                </Link>
                                <ul className="dropdown-menu " aria-labelledby="aboutUMCDropdown">
                                    <li>
                                        <Link
                                            to="/location"
                                            className={`dropdown-item ${activeLink === "Location" ? "active" : ""}`}
                                            onClick={() => handleNavClick("Location")}
                                        >
                                            Location
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/commissioner"
                                            className={`dropdown-item ${activeLink === "Commissioner" ? "active" : ""}`}
                                            onClick={() => handleNavClick("Commissioner")}
                                        >
                                            Commissioner
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/history"
                                            className={`dropdown-item ${activeLink === "History" ? "active" : ""}`}
                                            onClick={() => handleNavClick("History")}
                                        >
                                            History
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/tourism"
                                            className={`dropdown-item ${activeLink === "Tourism" ? "active" : ""}`}
                                            onClick={() => handleNavClick("Tourism")}
                                        >
                                            Tourism
                                        </Link>
                                    </li>
                                </ul>
                            </li>

                            <span className="nav-divider"></span>

                            {/* Administrative Wings Section */}
                            <li className={`nav-item dropdown administartive-dropdown ${activeLink === "Administrative Wings" ? "active" : ""}`} >
                                <Link
                                    to="#"
                                    className={`nav-link dropdown-toggle d-flex align-items-center ${activeLink === "Administrative Wings" ? "active" : ""}`}
                                    onClick={() => handleNavClick("Administrative Wings")}
                                    id="administrativeWingsDropdown"
                                    role="button"
                                    aria-expanded="false"
                                >
                                    <span className="me-1">Administrative Wings</span>
                                    <i className="dropdown-icon"></i>
                                </Link>
                                <ul className="dropdown-menu" aria-labelledby="administrativeWingsDropdown">
                                    <li>
                                        <Link
                                            to="#"
                                            className={`dropdown-item ${activeLink === "Administrative Structure" ? "active" : ""}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleNavClick("Administrative Structure");
                                                openPDF(AdministrativeStructurePDF);
                                            }}
                                        >
                                            Administrative Structure
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="#"
                                            className={`dropdown-item ${activeLink === "Administrative Ward" ? "active" : ""}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleNavClick("Administrative Ward");
                                                openPDF(AdministrativeWardsPDF);
                                            }}
                                        >
                                            Administrative Ward
                                        </Link>
                                    </li>
                                </ul>
                            </li>

                            <span className="nav-divider"></span>

                            {/* Corporation Section */}
                            <li className={`nav-item dropdown corporation-dropdown ${activeLink === "Corporation" ? "active" : ""}`} >
                                <Link
                                    to="#"
                                    className={`nav-link dropdown-toggle d-flex align-items-center ${activeLink === "Corporation" ? "active" : ""}`}
                                    onClick={() => handleNavClick("Corporation")}
                                    id="CorporationDropdown"
                                    role="button"
                                    aria-expanded="false"
                                >
                                    <span className="me-1">Corporation</span>
                                    <i className="dropdown-icon"></i>
                                </Link>
                                <ul className="dropdown-menu custom-dropdown-menu1" aria-labelledby="CorporationDropdown">
                                    <div className="dropdown-container ">
                                        <div className="dropdown-column">
                                            <li>
                                                <Link to="/administration"
                                                    className={`dropdown-item ${activeLink === "Administration" ? "active" : ""}`}
                                                    onClick={() => handleNavClick("Administration")}
                                                >
                                                    Administration
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/annual-financial-statement"
                                                    className={`dropdown-item ${activeLink === "Annual Financial Statement" ? "active" : ""}`}
                                                    onClick={() => handleNavClick("Annual Financial Statement")}
                                                >
                                                    Annual Financial Statement
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/deputy-mayor-office"
                                                    className={`dropdown-item ${activeLink === "Dy. Mayor Office" ? "active" : ""}`}
                                                    onClick={() => handleNavClick("Dy. Mayor Office")}                                        >
                                                    Dy. Mayor Office
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/elected-member"
                                                    className={`dropdown-item ${activeLink === "Elected Members" ? "active" : ""}`}
                                                    onClick={() => handleNavClick("Elected Members")}
                                                >
                                                    Elected Members
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/e-news"
                                                    className={`dropdown-item ${activeLink === "e-News Letter" ? "active" : ""}`}
                                                    onClick={() => handleNavClick("e-News Letter")}
                                                >
                                                    e-News Letter
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/mayor-office"
                                                    className={`dropdown-item ${activeLink === "Mayor Office" ? "active" : ""}`}
                                                    onClick={() => handleNavClick("Mayor Office")}
                                                >
                                                    Mayor Office
                                                </Link>
                                            </li>

                                        </div>

                                        <div className="dropdown-column">
                                            <li>
                                                <Link to="/municipal-meeting"
                                                    className={`dropdown-item ${activeLink === "Municipal Meetings" ? "active" : ""}`}
                                                    onClick={() => handleNavClick("Municipal Meetings")}
                                                >
                                                    Municipal Meetings
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/quotations"
                                                    className={`dropdown-item ${activeLink === "Quotations" ? "active" : ""}`}
                                                    onClick={() => handleNavClick("Quotations")}                                        >
                                                    Quotations
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/standing-committee"
                                                    className={`dropdown-item ${activeLink === "Standing Committee" ? "active" : ""}`}
                                                    onClick={() => handleNavClick("Standing Committee")}
                                                >
                                                    Standing Committee
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/subject-committee"
                                                    className={`dropdown-item ${activeLink === "Subject Committee" ? "active" : ""}`}
                                                    onClick={() => handleNavClick("Subject Committee")}
                                                >
                                                    Subject Committee
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/agenda"
                                                    className={`dropdown-item ${activeLink === "UMC Agenda" ? "active" : ""}`}
                                                    onClick={() => handleNavClick("UMC Agenda")}
                                                >
                                                    UMC Agenda
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/authorities"
                                                    className={`dropdown-item ${activeLink === "UMC Authorities" ? "active" : ""}`}
                                                    onClick={() => handleNavClick("UMC Authorities")}
                                                >
                                                    UMC Authorities
                                                </Link>
                                            </li>

                                        </div>


                                        <div className="dropdown-column">

                                            <li>
                                                <Link to="/budget"
                                                    className={`dropdown-item ${activeLink === "UMC Budget" ? "active" : ""}`}
                                                    onClick={() => handleNavClick("UMC Budget")}
                                                >
                                                    UMC Budget
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/committee"
                                                    className={`dropdown-item ${activeLink === "UMC Committee" ? "active" : ""}`}
                                                    onClick={() => handleNavClick("UMC Committee")}
                                                >
                                                    UMC Committee
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/policies"
                                                    className={`dropdown-item ${activeLink === "UMC Policies" ? "active" : ""}`}
                                                    onClick={() => handleNavClick("UMC Policies")}
                                                >
                                                    UMC Policies
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/resolutions"
                                                    className={`dropdown-item ${activeLink === "UMC Resolutions" ? "active" : ""}`}
                                                    onClick={() => handleNavClick("UMC Resolutions")}
                                                >
                                                    UMC Resolutions
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/ward-committee"
                                                    className={`dropdown-item ${activeLink === "Ward Committee" ? "active" : ""}`}
                                                    onClick={() => handleNavClick("Ward Committee")}
                                                >
                                                    Ward Committee
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/ward-office"
                                                    className={`dropdown-item ${activeLink === "Ward Office" ? "active" : ""}`}
                                                    onClick={() => handleNavClick("Ward Office")}
                                                >
                                                    Ward Office
                                                </Link>
                                            </li>
                                        </div>

                                    </div>
                                </ul>
                            </li>

                            <span className="nav-divider"></span>

                            {/* Departments Section*/}
                            <li
                                className={`nav-item dropdown department-dropdown ${activeLink === "Departments" ? "active" : ""}`}
                            >
                                <Link
                                    to="#"
                                    className={`nav-link dropdown-toggle d-flex align-items-center ${activeLink === "Departments" ? "active" : ""}`}
                                    onClick={() => handleNavClick("Departments")}
                                    id="DepartmentsDropdown"
                                    role="button"
                                    aria-expanded="false"
                                >
                                    <span className="me-1">Departments</span>
                                    <i className="dropdown-icon"></i>
                                </Link>
                                <ul className="dropdown-menu custom-dropdown-menu" aria-labelledby="DepartmentsDropdown">
                                    <div className="dropdown-container">

                                        <div className="dropdown-column">
                                            <li>
                                                <Link to="/accounts-department"
                                                    className={`dropdown-item ${activeLink === "Accounts Department" ? "active" : ""}`}
                                                    onClick={() => handleNavClick("Accounts Department")}
                                                >
                                                    Accounts Department
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/audit-department"
                                                    className={`dropdown-item ${activeLink === "Audit Department" ? "active" : ""}`}
                                                    onClick={() => handleNavClick("Audit Department")}
                                                >
                                                    Audit Department
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/computer-department"
                                                    className={`dropdown-item ${activeLink === "Computer / IT" ? "active" : ""}`}
                                                    onClick={() => handleNavClick("Computer / IT")}
                                                >
                                                    Computer Department
                                                </Link>
                                            </li>
                                            {/* <li>
                                                <Link to="/controller-department"
                                                    className={`dropdown-item ${activeLink === "Controller Of Unauthorized Construction" ? "active" : ""}`}
                                                    onClick={() => handleNavClick("Controller Of Unauthorized Construction")}
                                                >
                                                    Controller Of Unauthorized Construction
                                                </Link>
                                            </li> */}
                                            <li>
                                                <Link to="/disaster-management-department"
                                                    className={`dropdown-item ${activeLink === "Disaster Management" ? "active" : ""}`}
                                                    onClick={() => handleNavClick("Disaster Management")}
                                                >
                                                    Disaster Management
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/education-department"
                                                    className={`dropdown-item ${activeLink === "Education Department" ? "active" : ""}`}
                                                    onClick={() => handleNavClick("Education Department")}
                                                >
                                                    Education Department
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/election-department"
                                                    className={`dropdown-item ${activeLink === "Election Department" ? "active" : ""}`}
                                                    onClick={() => handleNavClick("Election Department")}
                                                >
                                                    Election Department
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/electrical-department"
                                                    className={`dropdown-item ${activeLink === "Electrical Engineering Department" ? "active" : ""}`}
                                                    onClick={() => handleNavClick("Electrical Engineering Department")}
                                                >
                                                    Electrical Engineering Department
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/encroachment-department"
                                                    className={`dropdown-item ${activeLink === "Encroachment Department" ? "active" : ""}`}
                                                    onClick={() => handleNavClick("Encroachment Department")}
                                                >
                                                    Encroachment Department
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/environment-department"
                                                    className={`dropdown-item ${activeLink === "Environment Department" ? "active" : ""}`}
                                                    onClick={() => handleNavClick("Environment Department")}
                                                >
                                                    Environment Department
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/estate-department"
                                                    className={`dropdown-item ${activeLink === "Estate Department" ? "active" : ""}`}
                                                    onClick={() => handleNavClick("Estate Department")}
                                                >
                                                    Estate Department
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/garden-department"
                                                    className={`dropdown-item ${activeLink === "Garden Department" ? "active" : ""}`}
                                                    onClick={() => handleNavClick("Garden Department")}
                                                >
                                                    Garden Department
                                                </Link>
                                            </li>
                                        </div>

                                        <div className="dropdown-column">
                                            <li>
                                                <Link to="/general-administrative-department"
                                                    className={`dropdown-item ${activeLink === "General Administration Dept" ? "active" : ""}`}
                                                    onClick={() => handleNavClick("General Administration Dept")}
                                                >
                                                    General Administrative Department
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/handicap-welfare-scheme"
                                                    className={`dropdown-item ${activeLink === "Handicap Welfare Scheme" ? "active" : ""}`}
                                                    onClick={() => handleNavClick("Handicap Welfare Scheme")}
                                                >
                                                    Handicap Welfare Scheme
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/lbt-department"
                                                    className={`dropdown-item ${activeLink === "LBT Department" ? "active" : ""}`}
                                                    onClick={() => handleNavClick("LBT Department")}
                                                >
                                                    LBT Department
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/legal-department"
                                                    className={`dropdown-item ${activeLink === "Legal Department" ? "active" : ""}`}
                                                    onClick={() => handleNavClick("Legal Department")}
                                                >
                                                    Legal Department
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/market-and-licensing-department"
                                                    className={`dropdown-item ${activeLink === "Market and Licensing Department" ? "active" : ""}`}
                                                    onClick={() => handleNavClick("Market and Licensing Department")}
                                                >
                                                    Market and Licensing Department
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/medical-health-department"
                                                    className={`dropdown-item ${activeLink === "Medical Health Department" ? "active" : ""}`}
                                                    onClick={() => handleNavClick("Medical Health Department")}
                                                >
                                                    Medical Health Department
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/municipal-secretary-department"
                                                    className={`dropdown-item ${activeLink === "Municipal Secretary Department" ? "active" : ""}`}
                                                    onClick={() => handleNavClick("Municipal Secretary Department")}
                                                >
                                                    Municipal Secretary Department
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/nulm-department"
                                                    className={`dropdown-item ${activeLink === "NULM Department" ? "active" : ""}`}
                                                    onClick={() => handleNavClick("NULM Department")}
                                                >
                                                    NULM Department
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/property-tax-department"
                                                    className={`dropdown-item ${activeLink === "Property Tax Department" ? "active" : ""}`}
                                                    onClick={() => handleNavClick("Property Tax Department")}
                                                >
                                                    Property Tax Department
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/public-health-department"
                                                    className={`dropdown-item ${activeLink === "Public Health Department" ? "active" : ""}`}
                                                    onClick={() => handleNavClick("Public Health Department")}
                                                >
                                                    Public Health Department
                                                </Link>
                                            </li>

                                            <li>
                                                <Link to="/public-relationship-department"
                                                    className={`dropdown-item ${activeLink === "Public Relationship Department" ? "active" : ""}`}
                                                    onClick={() => handleNavClick("Public Relationship Department")}
                                                >
                                                    Public Relationship Department
                                                </Link>
                                            </li>
                                        </div>

                                        <div className="dropdown-column">
                                            <li>
                                                <Link to="/public-works-department"
                                                    className={`dropdown-item ${activeLink === "Public Works Department" ? "active" : ""}`}
                                                    onClick={() => handleNavClick("Public Works Department")}
                                                >
                                                    Public Works Department
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/security-department"
                                                    className={`dropdown-item ${activeLink === "Security Department" ? "active" : ""}`}
                                                    onClick={() => handleNavClick("Security Department")}
                                                >
                                                    Security Department
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/solid-waste-management-department"
                                                    className={`dropdown-item ${activeLink === "Solid Waste Management Department" ? "active" : ""}`}
                                                    onClick={() => handleNavClick("Solid Waste Management Department")}
                                                >
                                                    Solid Waste Management Department
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/sports-department"
                                                    className={`dropdown-item ${activeLink === "Sports Department" ? "active" : ""}`}
                                                    onClick={() => handleNavClick("Sports Department")}
                                                >
                                                    Sports Department
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/store-department"
                                                    className={`dropdown-item ${activeLink === "Store Department" ? "active" : ""}`}
                                                    onClick={() => handleNavClick("Store Department")}
                                                >
                                                    Store Department
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/town-planning-department"
                                                    className={`dropdown-item ${activeLink === "Town Planning" ? "active" : ""}`}
                                                    onClick={() => handleNavClick("Town Planning")}
                                                >
                                                    Town Planning Department
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/vehicle-department"
                                                    className={`dropdown-item ${activeLink === "Vehicle Department" ? "active" : ""}`}
                                                    onClick={() => handleNavClick("Vehicle Department")}
                                                >
                                                    Vehicle Department
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/water-supply-department"
                                                    className={`dropdown-item ${activeLink === "Water Supply Department" ? "active" : ""}`}
                                                    onClick={() => handleNavClick("Water Supply Department")}
                                                >
                                                    Water Supply Department
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/women-and-child-department"
                                                    className={`dropdown-item ${activeLink === "Women and child Development" ? "active" : ""}`}
                                                    onClick={() => handleNavClick("Women and child Development")}
                                                >
                                                    Women and child Development
                                                </Link>
                                            </li>
                                            <div>
                                                <Link to="/departments"
                                                    className='view-departments'                                                >
                                                    View All Departments
                                                </Link>
                                            </div>
                                        </div>

                                    </div>
                                </ul>
                            </li>

                            <span className="nav-divider"></span>

                            {/* Circular Section*/}
                            <li
                                className={`nav-item ${activeLink === "Circulars" ? "active" : ""
                                    }`}
                            >
                                <Link
                                    to="/circular"
                                    className={`nav-link ${activeLink === "Circulars" ? "active" : ""
                                        }`}
                                    onClick={() => handleNavClick("Circulars")}
                                >
                                    Circulars
                                </Link>
                            </li>

                            <span className="nav-divider"></span>

                            {/* Online Services Section */}
                            <li
                                className={`nav-item dropdown services-dropdown ${activeLink === "Online Services" ? "active" : ""}`}
                            >
                                <Link
                                    to="#"
                                    className={`nav-link dropdown-toggle d-flex align-items-center ${activeLink === "Online Services" ? "active" : ""}`}
                                    onClick={() => handleNavClick("Online Services")}
                                    id="OnlineServicesDropdown"
                                    role="button"
                                    aria-expanded="false"
                                >
                                    <span className="me-1">Online Services</span>
                                    <i className="dropdown-icon"></i>
                                </Link>
                                <ul className="dropdown-menu" aria-labelledby="OnlineServicesDropdown">
                                    <li>
                                        <Link to="/property-tax-payment"
                                            className={`dropdown-item ${activeLink === "Property Tax" ? "active" : ""}`}
                                            onClick={() => handleNavClick("Property Tax")}
                                        >
                                            Property Tax
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/birth-certificate"
                                            className={`dropdown-item ${activeLink === "Birth Certificate" ? "active" : ""}`}
                                            onClick={() => handleNavClick("Birth Certificate")}
                                        >
                                            Birth Certificate
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/death-certificate"
                                            className={`dropdown-item ${activeLink === "Death Certificate" ? "active" : ""}`}
                                            onClick={() => handleNavClick("Death Certificate")}
                                        >
                                            Death Certificate
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/e-tender"
                                            className={`dropdown-item ${activeLink === "e-Tender" ? "active" : ""}`}
                                            onClick={() => handleNavClick("e-Tender")}                                        >
                                            e-Tender
                                        </Link>
                                    </li>
                                </ul>
                            </li>

                            <span className="nav-divider"></span>

                            {/* Citizen Charter Section */}
                            <li
                                className={`nav-item ${activeLink === "Citizen Charter" ? "active" : ""
                                    }`}
                            >
                                <Link
                                    to="#."
                                    className={`nav-link ${activeLink === "Citizen Charter" ? "active" : ""
                                        }`}

                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleNavClick("Citizen Charter");
                                        openPDF(CitizenPDF);
                                    }}
                                >
                                    Citizen Charter
                                </Link>
                            </li>

                            <span className="nav-divider"></span>

                            {/* Gallery Section */}
                            <li
                                className={`nav-item dropdown gallery-dropdown ${activeLink === "Gallery" ? "active" : ""}`}
                            >
                                <Link
                                    to="#"
                                    className={`nav-link dropdown-toggle d-flex align-items-center ${activeLink === "Gallery" ? "active" : ""}`}
                                    onClick={() => handleNavClick("Gallery")}
                                    id="galleryDropdown"
                                    role="button"
                                    aria-expanded="false"
                                >
                                    <span className="me-1">Gallery</span>
                                    <i className="dropdown-icon"></i>
                                </Link>
                                <ul className="dropdown-menu" aria-labelledby="galleryDropdown">
                                    <li>
                                        <Link
                                            to="/photo-gallery"
                                            className={`dropdown-item ${activeLink === "Photo Gallery" ? "active" : ""}`}
                                            onClick={(e) => {
                                                handleNavClick("Photo Gallery");
                                            }}
                                        >
                                            Photo Gallery
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/video-gallery"
                                            className={`dropdown-item ${activeLink === "Video Gallery" ? "active" : ""}`}
                                            onClick={(e) => {
                                                handleNavClick("Video Gallery");
                                            }}
                                        >
                                            Video Gallery
                                        </Link>
                                    </li>
                                </ul>
                            </li>

                            <span className="nav-divider"></span>

                            {/* Recruitment Section */}
                            <li
                                className={`nav-item ${activeLink === "Recruitment" ? "active" : ""
                                    }`}
                            >
                                <Link
                                    to="/recruitment"
                                    className={`nav-link ${activeLink === "Recruitment" ? "active" : ""
                                        }`}
                                    onClick={() => handleNavClick("Recruitment")}
                                >
                                    Recruitment
                                </Link>
                            </li>

                            <span className="nav-divider"></span>

                            {/* Contact Section */}
                            <li
                                className={`nav-item ${activeLink === "Contact Us" ? "active" : ""
                                    }`}
                            >
                                <Link
                                    to="/contact-us"
                                    className={`nav-link ${activeLink === "Contact Us" ? "active" : ""
                                        }`}
                                    onClick={() => handleNavClick("Contact Us")}
                                >
                                    Contact Us
                                </Link>
                            </li>

                        </ul>
                    </nav>
                </div>
            </header>
        </div>
    );
};

export default Navbar;
