import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import "./Header.css";
import { Link} from "react-router-dom";
import Mainlogo from "../../assets/images/header-img/logo 1.png";
import Headlogo1 from "../../assets/images/header-img/headerlogo1.png";
import Headlogo2 from "../../assets/images/header-img/aaple-sarkar.jpg";
import Headlogo3 from "../../assets/images/header-img/Hindi_logo 1.png";
import Headlogo4 from "../../assets/images/header-img/promotion (1).png";
import TopHeader from "../TopHeader/TopHeader";
import { useLocation } from "react-router-dom";
import api, { baseURL } from "../api";

const Navbar = () => {
    const [menuData, setMenuData] = useState([]);
    const [isNavCollapsed, setIsNavCollapsed] = useState(true);
    const location = useLocation();
    const navRef = useRef(null);
    const { i18n, t } = useTranslation();


    const toggleNav = () => {
        setIsNavCollapsed(!isNavCollapsed);
    };

    const [activeLink, setActiveLink] = useState(() => {
        return localStorage.getItem("activeLink") || "Home";
    });

    const fetchMenuData = async () => {
        try {
            const response = await api.get(`/main-menus?lang=${i18n.language}`);
            setMenuData(response.data);
        } catch (error) {
            console.error("Error fetching menu data:", error);
        }
    };

    useEffect(() => {
        fetchMenuData();
    }, [i18n.language]);

    const handleNavClick = (link) => {
        const nonNavigableLinks = [
            "About UMC",
            "Corporation",
            "Administrative Wings",
            "Departments",
            "Online Services",
            "Gallery",
        ];

        if (!nonNavigableLinks.includes(link)) {
            setIsNavCollapsed(true);
            localStorage.setItem("activeLink", link);
        }
        setActiveLink(link);
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




    const generateDropdownClass = (mainMenu) => {
        const firstWord = mainMenu.split(' ')[0]; // Extract the first word
        return firstWord.toLowerCase() + '-dropdown'; // Convert to lowercase and append "-dropdown"
    };

    const splitIntoColumns = (subMenus, columns = 3) => {
        const columnSize = Math.ceil(subMenus.length / columns);
        const result = [];
        for (let i = 0; i < columns; i++) {
            result.push(subMenus.slice(i * columnSize, (i + 1) * columnSize));
        }
        return result;
    };



    const renderDropdown = (menu) => {
        const dropdownClass = generateDropdownClass(menu.mainMenu);

        if (menu.mainMenu === "Departments" || menu.mainMenu === "Corporation" || menu.mainMenu === "Online Services" || menu.mainMenu === "विभाग" || menu.mainMenu === "महानगरपालिका" || menu.mainMenu === "ऑनलाइन सेवा") {
            const columnCount = menu.mainMenu === "Online Services" ? 2 : 3;
            const columns = splitIntoColumns(menu.subMenus, columnCount);
            return (
                <li className={`nav-item dropdown ${dropdownClass} ${activeLink === menu.mainMenu ? "active" : ""}`}>
                    <Link
                        to="#"
                        className={`nav-link dropdown-toggle d-flex align-items-center ${activeLink === menu.mainMenu ? "active" : ""}`}
                        onClick={() => handleNavClick(menu.mainMenu)}
                        id={`${menu.mainMenu}Dropdown`}
                        role="button"
                        aria-expanded="false"
                    >
                        <span className="me-1">{menu.mainMenu}</span>
                        <i className="dropdown-icon"></i>
                    </Link>
                    <ul className="dropdown-menu custom-dropdown-menu1" aria-labelledby={`${menu.mainMenu}Dropdown`}>
                        <div className="dropdown-container">
                            {columns.map((column, columnIndex) => (
                                <div className="dropdown-column" key={columnIndex}>
                                    {column.map((subMenu) => (
                                        <li key={subMenu.id}>
                                            <Link
                                                to={subMenu.subLink}
                                                target={subMenu.subLink.includes("http") ? "_blank" : "_self"}
                                                rel={subMenu.subLink.includes("http") ? "noopener noreferrer" : ""}
                                                className={`dropdown-item ${activeLink === subMenu.subMenu ? "active" : ""}`}
                                                onClick={() => handleNavClick(subMenu.subMenu)}
                                            >
                                                {subMenu.subMenu}
                                            </Link>
                                        </li>
                                    ))}
                                    {menu.mainMenu === "Departments" && columnIndex === columns.length - 1 && (
                                        <li>
                                            <div>
                                                <Link to="/departments" className='view-departments'>
                                                {t('viewallDepartment')}
                                                </Link>
                                            </div>
                                        </li>
                                    )}

                                </div>
                            ))}
                        </div>

                    </ul>
                </li>
            );
        } else {
            return (
                <li className={`nav-item dropdown ${dropdownClass} ${activeLink === menu.mainMenu ? "active" : ""}`}>
                    <Link
                        to="#"
                        className={`nav-link dropdown-toggle d-flex align-items-center ${activeLink === menu.mainMenu ? "active" : ""}`}
                        onClick={() => handleNavClick(menu.mainMenu)}
                        id={`dropdown-${menu.id}`}
                        role="button"
                        aria-expanded="false"
                    >
                        <span className="me-1">{menu.mainMenu}</span>
                        <i className="dropdown-icon"></i>
                    </Link>
                    <ul className="dropdown-menu" aria-labelledby={`dropdown-${menu.id}`}>
                        {menu.subMenus.map((subMenu) => (
                            <li key={subMenu.id}>
                                <Link
                                    to={subMenu.subLink}
                                    target={subMenu.subLink.includes("http") ? "_blank" : "_self"}
                                    rel={subMenu.subLink.includes("http") ? "noopener noreferrer" : ""}
                                    className={`dropdown-item ${activeLink === subMenu.subMenu ? "active" : ""}`}
                                    onClick={() => handleNavClick(subMenu.subMenu)}
                                >
                                    {subMenu.subMenu}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </li>
            );
        }
    };


    return (
        <div className="navbar-container">
            <TopHeader />
            <div className="banner d-flex justify-content-between py-2">
                <Link to="/">
                    <div className="logo d-flex">
                        <img src={Mainlogo} alt="Logo" className="logo-img" />
                        <div className="mt-2">
                            <h1 className="brand-name">{t("header.logoTitle")}</h1>
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
                            {menuData.map((menu) => (
                                <React.Fragment key={menu.id}>
                                    {menu.mainMenuLink.startsWith("/") ? (
                                        <li className={`nav-item ${activeLink === menu.mainMenu ? "active" : ""}`}>
                                            <Link
                                                to={menu.mainMenuLink}
                                                target={menu.mainMenuLink.includes("http") ? "_blank" : "_self"}
                                                rel={menu.mainMenuLink.includes("http") ? "noopener noreferrer" : ""}
                                                className={`nav-link ${activeLink === menu.mainMenu ? "active" : ""}`}
                                                onClick={() => handleNavClick(menu.mainMenu)}
                                            >
                                                {menu.mainMenu}
                                            </Link>
                                        </li>
                                    ) : menu.mainMenuLink.startsWith("#") ? (
                                        renderDropdown(menu)
                                    ) : menu.mainMenuLink.includes("http") ? (
                                        <li className={`nav-item ${activeLink === menu.mainMenu ? "active" : ""}`}>
                                            <Link
                                                to={menu.mainMenuLink}
                                                target={menu.mainMenuLink.includes("http") ? "_blank" : "_self"}
                                                rel={menu.mainMenuLink.includes("http") ? "noopener noreferrer" : ""}
                                                className={`nav-link ${activeLink === menu.mainMenu ? "active" : ""}`}
                                                onClick={() => handleNavClick(menu.mainMenu)}
                                            >
                                                {menu.mainMenu}
                                            </Link>
                                        </li>
                                    ) : null}
                                    <span className="nav-divider"></span>
                                </React.Fragment>
                            ))}
                        </ul>

                    </nav>
                </div>
            </header>
        </div>
    );
};

export default Navbar;
