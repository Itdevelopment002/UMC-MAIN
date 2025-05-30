import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import '../Header/Header.css';
import { RiArrowDropDownLine } from "react-icons/ri";
import phoneicon from "../../assets/images/header-img/telephone.png";
// import flag1 from "../../assets/images/header-img/united-states.png";
// import flag2 from "../../assets/images/header-img/india.png";
// import flag3 from "../../assets/images/header-img/hindu.png";
import twitter from '../../assets/images/header-img/twitter.png';
import facebook from '../../assets/images/header-img/facebook.png';
import instagram from '../../assets/images/header-img/instagram (2).png';
import youtube from '../../assets/images/header-img/Youtube.png';

const TopHeader = () => {
    const [selectedLanguage, setSelectedLanguage] = useState("mar");

    useEffect(() => {
        if (
            !document.querySelector(
                'script[src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"]'
            )
        ) {
            const googleTranslateScript = document.createElement("script");
            googleTranslateScript.src =
                "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
            document.body.appendChild(googleTranslateScript);
        }

        window.googleTranslateElementInit = () => {
            new window.google.translate.TranslateElement(
                {
                    pageLanguage: "en",
                    includedLanguages: "en,hi,mr",
                    layout: window.google.translate.TranslateElement.InlineLayout.HORIZONTAL,
                },
                "google_translate_element"
            );

            setTimeout(() => {
                updateGoogleTranslate("mar");
            }, 1000);
        };
    }, []);

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

        // Add a global CSS rule instead of iterating over all elements
        const styleTag = document.getElementById("dynamic-font-style") || document.createElement("style");
        styleTag.id = "dynamic-font-style";
        styleTag.innerHTML = `* { font-family: var(--global-font-family) !important; }`;
        document.head.appendChild(styleTag);
    };

    const handleLanguageChange = (language) => {
        setSelectedLanguage(language);
        updateGoogleTranslate(language);
    };

    const updateGoogleTranslate = (language) => {
        const googleTranslateDropdown = document.querySelector(".goog-te-combo");

        if (googleTranslateDropdown) {
            const langCode = language === "eng" ? "en" : language === "hin" ? "hi" : "mr";
            googleTranslateDropdown.value = langCode;

            googleTranslateDropdown.dispatchEvent(new Event("change"));

            setTimeout(() => {
                const iframe = document.querySelector("iframe.goog-te-menu-frame");
                if (iframe) {
                    const select = iframe.contentWindow.document.querySelector("select");
                    if (select) {
                        select.value = langCode;
                        select.dispatchEvent(new Event("change"));
                    }
                }
            }, 1000);
        }
    };

    const getLanguageText = () => {
        if (selectedLanguage === "eng") return "English";
        if (selectedLanguage === "hin") return "हिंदी";
        if (selectedLanguage === "mar") return "मराठी";
        return "मराठी";
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

    return (
        <>
            <div className="top-bar">
                <div className="helpline">
                    <Link to="tel:02512720150" className="helpline-link">
                        <img src={phoneicon} alt="Phone Icon" className="helpline-icon" />
                        Helpline No: 0251 2720150
                    </Link>
                </div>

                <div className="accessibility ">
                    <Link to="/rts-act-2015">
                        <button className="rts-act-button">RTS Act 2015</button>
                    </Link>
                    <span className="divider">|</span>
                    <Link to="/screen-reader-access" className='text-decoration-none' style={{ color: "#333" }}>
                        <span>Screen Reader Access</span>
                    </Link>
                    <span className="divider">|</span>
                    <button onClick={handleDecreaseFontSize} className="text-size-btn">A-</button>
                    <span className="divider">|</span>
                    <button onClick={handleIncreaseFontSize} className="text-size-btn">A+</button>
                    <span className="divider">|</span>
                    <div className="custom-dropdown">
                        <div className="selected-language">
                            {/* <img
                                src={
                                    selectedLanguage === "eng"
                                    ? flag1 
                                    : selectedLanguage === "hin"
                                    ? flag2 
                                    : flag3 
                                }
                                alt={getLanguageText()}
                                className="flag-icon"
                            /> */}
                            <span>{getLanguageText()}</span>
                            <RiArrowDropDownLine size={25} />
                        </div>

                        <div className="dropdown-options">
                            <div
                                className={`dropdown-option ${selectedLanguage === "eng" ? "selected" : ""}`}
                                onClick={() => handleLanguageChange("eng")}
                            >
                                {/* <img src={flag1} alt="English" className="flag-icon" /> */}
                                English
                            </div>
                            <div
                                className={`dropdown-option ${selectedLanguage === "hin" ? "selected" : ""}`}
                                onClick={() => handleLanguageChange("hin")}
                            >
                                {/* <img src={flag2} alt="Hindi" className="flag-icon" /> */}
                                हिंदी
                            </div>
                            <div
                                className={`dropdown-option ${selectedLanguage === "mar" ? "selected" : ""}`}
                                onClick={() => handleLanguageChange("mar")}
                            >
                                {/* <img src={flag3} alt="Marathi" className="flag-icon" /> */}
                                मराठी
                            </div>
                        </div>
                    </div>

                    <div id="google_translate_element" style={{ display: "none" }}></div>

                    <div className="social-icons top-bar-social-media d-flex">
                        <Link to="https://twitter.com/my_umcofficial" target="_blank" className="social-link">
                            <img src={twitter} alt="Twitter" className="twitter-icon" />
                        </Link>
                        <span className="divider">|</span>
                        <Link to="https://www.facebook.com/myumc/" target="_blank" className="social-link">
                            <img src={facebook} alt="Facebook" className="facebook-icon" />
                        </Link>
                        <span className="divider">|</span>
                        <Link to="https://www.instagram.com/my_umc/" target="_blank" className="social-link">
                            <img src={instagram} alt="Instagram" className="insta-icon" />
                        </Link>
                        <span className="divider">|</span>
                        <Link to="https://www.youtube.com/channel/UCPZN5zAMeNHt3hTfdCO4n8A" target="_blank" className="social-link">
                            <img src={youtube} alt="YouTube" className="youtube-icon" />
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TopHeader;
