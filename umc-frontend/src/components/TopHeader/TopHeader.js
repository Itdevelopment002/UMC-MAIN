import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import '../Header/Header.css';
import './TopHeader.css';
import { RiArrowDropDownLine, RiSearchLine } from "react-icons/ri";
import phoneicon from "../../assets/images/header-img/telephone.png";
import twitter from '../../assets/images/header-img/twitter.png';
import facebook from '../../assets/images/header-img/facebook.png';
import instagram from '../../assets/images/header-img/instagram (2).png';
import youtube from '../../assets/images/header-img/Youtube.png';
import { useTranslation } from "react-i18next";
import { searchablePages } from "./SearchPages";
// ✅ Import your route titles

const TopHeader = () => {
    const [selectedLanguage, setSelectedLanguage] = useState("mr");
    const { i18n, t } = useTranslation();

    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const navigate = useNavigate(); // ✅ For route navigation

    useEffect(() => {
        const observer = new MutationObserver(() => {
            const translatedText = document.querySelector("html").lang;
            if (translatedText === "mr") {
                applyFontFamily("Mukta, sans-serif");
            } else {
                applyFontFamily("");
            }
        });

        observer.observe(document.documentElement, { attributes: true });
        return () => observer.disconnect();
    }, []);

    const applyFontFamily = (font) => {
        document.documentElement.style.setProperty("--global-font-family", font);
        document.body.style.fontFamily = font;
        let styleTag = document.getElementById("dynamic-font-style");
        if (!styleTag) {
            styleTag = document.createElement("style");
            styleTag.id = "dynamic-font-style";
            document.head.appendChild(styleTag);
        }
        styleTag.innerHTML = `* { font-family: var(--global-font-family) !important; }`;
    };

    const handleLanguageChange = (language) => {
        setSelectedLanguage(language);
        i18n.changeLanguage(language);
    };

    const getLanguageText = () => {
        if (selectedLanguage === "en") return "English";
        if (selectedLanguage === "hi") return "हिंदी";
        if (selectedLanguage === "mr") return "मराठी";
        return "English";
    };

    const [defaultfontSize, setDefaultFontSize] = useState(16);
    const [fontSize, setFontSize] = useState({
        helpline: 14,
        rtsActButton: 13,
        accessibility: 14,
        navItems: 16,
    });

    useEffect(() => {
        document.body.style.fontSize = `${defaultfontSize}px`;
        document.documentElement.style.setProperty("--helpline-font-size", `${fontSize.helpline}px`);
        document.documentElement.style.setProperty("--rts-act-button-font-size", `${fontSize.rtsActButton}px`);
        document.documentElement.style.setProperty("--accessibility-font-size", `${fontSize.accessibility}px`);
        document.documentElement.style.setProperty("--nav-link-font-size", `${fontSize.navItems}px`);
    }, [defaultfontSize, fontSize]);

    const handleIncreaseFontSize = () => {
        setDefaultFontSize((prevSize) => Math.min(prevSize + 2, 50));
        setFontSize((prevSizes) => ({
            helpline: Math.min(prevSizes.helpline + 2, 50),
            rtsActButton: Math.min(prevSizes.rtsActButton + 2, 50),
            accessibility: Math.min(prevSizes.accessibility + 2, 50),
            navItems: Math.min(prevSizes.navItems + 2, 50),
        }));
    };

    const handleDecreaseFontSize = () => {
        setDefaultFontSize((prevSize) => Math.max(prevSize - 2, 10));
        setFontSize((prevSizes) => ({
            helpline: Math.max(prevSizes.helpline - 2, 10),
            rtsActButton: Math.max(prevSizes.rtsActButton - 2, 10),
            accessibility: Math.max(prevSizes.accessibility - 2, 10),
            navItems: Math.max(prevSizes.navItems - 2, 10),
        }));
    };

    // ✅ New search effect based on route titles
    useEffect(() => {
        if (!searchText.trim()) {
            setSearchResults([]);
            return;
        }

        const filtered = searchablePages.filter((page) =>
            page.title.toLowerCase().includes(searchText.toLowerCase())
        );

        setSearchResults(filtered);
    }, [searchText]);

    return (
        <>
            <div className="top-bar">
                <div className="helpline">
                    <div className="helpline-link">
                        <img src={phoneicon} alt="Phone Icon" className="helpline-icon" />
                        {t("header.helpline")}
                    </div>
                </div>

                {/* 🌟 Search */}
                <div className="search-container">
                    <div className="search-bar mt-2">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="search-input"
                            aria-label="Search"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        <button className="search-button" aria-label="Submit search">
                            <RiSearchLine size={18} className="search-icon" />
                        </button>
                    </div>

                    {/* ✅ Route-based results */}
                    {searchText && (
                        <div className="search-suggestions">
                            {searchResults.length > 0 ? (
                                searchResults.map((result, index) => (
                                    <div
                                        key={index}
                                        className="search-suggestion-item"
                                        onClick={() => {
                                            navigate(result.path);
                                            setSearchText('');
                                            setSearchResults([]);
                                        }}
                                    >
                                        {result.title}
                                    </div>
                                ))
                            ) : (
                                <div className="search-no-results">No results found</div>
                            )}
                        </div>
                    )}
                </div>

                <div className="accessibility">
                    <span
                        onClick={() => {
                            const mainContent = document.getElementById("main-content");
                            if (mainContent) {
                                mainContent.scrollIntoView({ behavior: "smooth" });
                            }
                        }}
                        role="button"
                        tabIndex="0"
                        className='text-link-btn'
                    >
                        {t("header.skipContent")}
                    </span>
                    <span className="divider">|</span>
                    <Link to="/screen-reader-access" className='text-link-btn'>
                        <span>{t("header.screenReader")}</span>
                    </Link>
                    <span className="divider">|</span>
                    <button onClick={handleDecreaseFontSize} className="text-link-btn">{t("header.aMinus")}</button>
                    <span className="divider">|</span>
                    <button onClick={handleIncreaseFontSize} className="text-link-btn">{t("header.aPlus")}</button>
                    <span className="divider">|</span>

                    <div className="custom-dropdown" role="button" tabIndex="0">
                        <div className="selected-language">
                            <span>{getLanguageText()}</span>
                            <RiArrowDropDownLine size={25} className="arrow" />
                        </div>
                        <div className="dropdown-options">
                            <div
                                className={`dropdown-option ${selectedLanguage === "en" ? "selected" : ""}`}
                                onClick={() => handleLanguageChange("en")}
                            >
                                English
                            </div>
                            <div
                                className={`dropdown-option ${selectedLanguage === "mr" ? "selected" : ""}`}
                                onClick={() => handleLanguageChange("mr")}
                            >
                                मराठी
                            </div>
                        </div>
                    </div>

                    <div className="social-icons top-bar-social-media d-flex">
                        <Link to="https://twitter.com/my_umcofficial" target="_blank" aria-label="Follow us on Twitter" className="social-link">
                            <img src={twitter} alt="Twitter" className="twitter-icon" />
                        </Link>
                        <span className="divider">|</span>
                        <Link to="https://www.facebook.com/myumc/" target="_blank" aria-label="Follow us on Facebook" className="social-link">
                            <img src={facebook} alt="Facebook" className="facebook-icon" />
                        </Link>
                        <span className="divider">|</span>
                        <Link to="https://www.instagram.com/my_umc/" target="_blank" aria-label="Follow us on Instagram" className="social-link">
                            <img src={instagram} alt="Instagram" className="insta-icon" />
                        </Link>
                        <span className="divider">|</span>
                        <Link to="https://www.youtube.com/channel/UCPZN5zAMeNHt3hTfdCO4n8A" target="_blank" aria-label="Follow us on YouTube" className="social-link">
                            <img src={youtube} alt="YouTube" className="youtube-icon" />
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TopHeader;
