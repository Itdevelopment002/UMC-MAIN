import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import '../Header/Header.css'
import phoneicon from "../../assets/images/header-img/telephone.png";
import flag1 from "../../assets/images/header-img/united-states.png";
import flag2 from "../../assets/images/header-img/india.png";
import flag3 from "../../assets/images/header-img/hindu.png";
import twitter from '../../assets/images/header-img/twitter.png';
import facebook from '../../assets/images/header-img/facebook.png';
import instagram from '../../assets/images/header-img/instagram (2).png';
import youtube from '../../assets/images/header-img/Youtube.png';

const TopHeader = () => {
    const [selectedLanguage, setSelectedLanguage] = useState("eng");


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
            if (
                !document.getElementById("google_translate_element").childNodes.length
            ) {
                new window.google.translate.TranslateElement(
                    {
                        pageLanguage: "en",
                        includedLanguages: "en,hi,mr",
                        layout:
                            window.google.translate.TranslateElement.InlineLayout.HORIZONTAL,
                    },
                    "google_translate_element"
                );
            }
        };
    }, []);

    const handleLanguageChange = (language) => {
        setSelectedLanguage(language);
        const googleTranslateDropdown = document.querySelector(".goog-te-combo");
        if (googleTranslateDropdown) {
            googleTranslateDropdown.value =
                language === "eng" ? "en" : language === "hin" ? "hi" : "mr";
            googleTranslateDropdown.dispatchEvent(new Event("change"));
        }
    };


    // size of font incease and descraes functionality
    const [defaultfontSize, setDefaultFontSize] = useState(16);//this is use for jime font-size nahi diya gaya hai external css file me 
    const [fontSize, setFontSize] = useState({

        helpline: 14,
        rtsActButton: 13,
        accessibility: 14,
        navItems: 16,
    });

    // Update the font size globally for all variables
    useEffect(() => {
        document.body.style.fontSize = `${defaultfontSize}px`;
        document.documentElement.style.setProperty("--helpline-font-size", `${fontSize.helpline}px`);
        document.documentElement.style.setProperty("--rts-act-button-font-size", `${fontSize.rtsActButton}px`);
        document.documentElement.style.setProperty("--accessibility-font-size", `${fontSize.accessibility}px`);
        document.documentElement.style.setProperty("--nav-link-font-size", `${fontSize.navItems}px`);
    }, [defaultfontSize, fontSize]);

    // Increase font size for all variables
    const handleIncreaseFontSize = () => {
        setDefaultFontSize((prevSize) => Math.min(prevSize + 2, 50));
        setFontSize((prevSizes) => ({
            helpline: Math.min(prevSizes.helpline + 2, 50),
            rtsActButton: Math.min(prevSizes.rtsActButton + 2, 50),
            accessibility: Math.min(prevSizes.accessibility + 2, 50),
            navItems: Math.min(prevSizes.navItems + 2, 50),
        }));
    };

    // Decrease font size for all variables
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
                    <span
                        onClick={() => {
                            const mainContent = document.getElementById("main-content");
                            if (mainContent) {
                                mainContent.scrollIntoView({ behavior: "smooth" });
                            }
                        }}
                        style={{ cursor: "pointer" }}
                    >
                        Skip to main content
                    </span>
                    <span className="divider">|</span>
                    <Link to="/screen-reader-access" className='text-decoration-none' style={{color: "#333"}}>
                        <span>Screen Reader Access</span>
                    </Link>
                    <span className="divider">|</span>
                    <button onClick={handleDecreaseFontSize} className="text-size-btn">A-</button>
                    <span className="divider">|</span>
                    <button onClick={handleIncreaseFontSize} className="text-size-btn">A+</button>
                    <span className="divider">|</span>
                    <div className="custom-dropdown">
                        <div className="selected-language">
                            {selectedLanguage === "eng" ? (
                                <img src={flag1} alt="English" className="flag-icon" />
                            ) : selectedLanguage === "hin" ? (
                                <img src={flag2} alt="Hindi" className="flag-icon" />
                            ) : (
                                <img src={flag3} alt="Marathi" className="flag-icon" />
                            )}
                            {selectedLanguage === "eng"
                                ? "English"
                                : selectedLanguage === "hin"
                                    ? "हिंदी"
                                    : "मराठी"}
                        </div>
                        <div className="dropdown-options">
                            <div
                                className="dropdown-option"
                                onClick={() => handleLanguageChange("eng")}
                            >
                                <img src={flag1} alt="English" className="flag-icon" />
                                English
                            </div>
                            <div
                                className="dropdown-option"
                                onClick={() => handleLanguageChange("hin")}
                            >
                                <img src={flag2} alt="Hindi" className="flag-icon" />
                                हिंदी
                            </div>
                            <div
                                className="dropdown-option"
                                onClick={() => handleLanguageChange("mar")}
                            >
                                <img src={flag3} alt="Marathi" className="flag-icon" />
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
    )
}

export default TopHeader