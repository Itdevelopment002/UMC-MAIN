import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import Logo from "../../assets/images/logo 1.png";
import api, { baseURL } from "../api";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";


const Footer = () => {
  const [contacts, setContacts] = useState([]);
  const [quicklinks, setQuickLinks] = useState([]);
  const [helplinks, setHelpLinks] = useState([]);
  const [onlineservices, setOnlineServices] = useState([]);
  const [visitorCount, setVisitorCount] = useState(null);
  const [error, setError] = useState(null);
  const hasRunOnce = useRef(false);
  const { i18n, t } = useTranslation();

  useEffect(() => {
    if (hasRunOnce.current) return;
    hasRunOnce.current = true;

    const fetchVisitorCount = async () => {
      try {
        const response = await api.get("/visitor-count");
        if (!response.status === 200) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        setVisitorCount(response.data.count);
      } catch (err) {
        console.error("Error fetching visitor count:", err);
        setError("Failed to load visitor count.");
      }
    };

    const incrementVisitorCountOnce = async () => {
      if (!sessionStorage.getItem("visitorCounted")) {
        try {
          const response = await api.post("/increment-visitor-count");
          if (response.status === 200) {
            sessionStorage.setItem("visitorCounted", "true");
            Cookies.set("visitorCounted", "true", { expires: 1 });
          }
        } catch (err) {
          console.error("Error incrementing visitor count:", err);
        }
      }
    };

    const removeCookieOnClose = () => {
      Cookies.remove("visitorCounted");
    };

    fetchVisitorCount();
    incrementVisitorCountOnce();

    window.addEventListener("beforeunload", removeCookieOnClose);

    return () => {
      window.removeEventListener("beforeunload", removeCookieOnClose);
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchQuickLinks();
    fetchHelpLinks();
    fetchOnlineServices();
    fetchContacts();


  }, [i18n.language]);

  const fetchQuickLinks = async () => {
    try {
      const response = await api.get(`/quick-link?lang=${i18n.language}`);
      setQuickLinks(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };
  const fetchHelpLinks = async () => {
    try {
      const response = await api.get(`/helps?lang=${i18n.language}`);
      setHelpLinks(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };
  const fetchOnlineServices = async () => {
    try {
      const response = await api.get(`/online_service?lang=${i18n.language}`);
      setOnlineServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };
  const fetchContacts = () => {
    api
      .get(`/contacts-info?lang=${i18n.language}`)
      .then((response) => setContacts(response.data))
      .catch((error) => {
        console.error("Error fetching contact info details!", error);
      });
  };


  return (
    <footer className="footer" id="footer">
      <div className="container-fluid">
        <div className="row ">
          <div className="col-lg-5 col-md-8 col-12 mb-4">
            <div className="footer-logo-section">
              <img src={Logo} alt="Ulhasnagar Logo" className="footer-logo" />
              <div>
                <h2 className="footer-title text-uppercase">{t("footer.title")}</h2>
                <p className="footer-subtitle">{t("footer.subtitle")}</p>
              </div>
            </div>
            <ul className="contact-list">
              {contacts.map((contact, index) => (
                <li key={index}>
                  <div className="d-flex align-items-start">
                    <img
                      src={`${baseURL}${contact.image_path}`}
                      alt={`${contact.type} Icon`}
                      className="icon-img"
                      width="20"
                      height="20"
                    />
                    <div className="contact-text">
                      <p className="contact-title">{contact.heading}</p>
                      <span className="contact-detail">{contact.description}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-lg-2 col-md-4 col-sm-4 mb-4">
            <h4 className="footer-heading">{t("footer.quickLinks")}</h4>
            <ul className="footer-links">
              {quicklinks.length > 0 ? (
                quicklinks.map((data, index) => (
                  <li key={index}>
                    <Link to={data.link} target="_blank" rel="noopener noreferrer">
                      {data.heading}
                    </Link>
                  </li>
                ))
              ) : (
                <li>{t("footer.loading")}</li>
              )}
            </ul>
          </div>

          <div className="col-lg-2 col-md-8 col-sm-4 mb-4 mx-auto">
            <h4 className="footer-heading">{t("footer.help")}</h4>
            <ul className="footer-links">
              {helplinks.map((data, index) => (
                <li key={index}>
                  <Link to={data.link}>{data.heading}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-lg-2 col-md-4 col-sm-4 mb-4">
            <h4 className="footer-heading">{t("footer.onlineServices")}</h4>
            <ul className="footer-links">
              {onlineservices.length > 0 ? (
                onlineservices.map((data, index) => (
                  <li key={index}>
                    <Link to={data.link} target={data.link.startsWith("/") ? "_self" : "_blank"} rel="noopener noreferrer">
                      {data.heading}
                    </Link>
                  </li>
                ))
              ) : (
                <li>{t("footer.loading")}</li>
              )}
            </ul>
          </div>

        </div>
        <hr className="footer-divider" />
        <div className="footer-bottom p-0">
          <span className="footer-sapn1">
            &copy; {new Date().toLocaleString(i18n.language === "mr" ? "mr-IN" : "en-US", { year: "numeric" })}
            {" "}{t("footer.copyWrite")}
          </span>

          <span className="fw-bold ">
            {t("footer.totalVisitors")}:{" "}
            {visitorCount !== null ? (
              <Link to="#." className="count-style">
                {i18n.language === "mr"
                  ? new Intl.NumberFormat("mr-IN").format(visitorCount)
                  : visitorCount}
              </Link>
            ) : error ? (
              <span>{error}</span>
            ) : (
              t("footer.loading")
            )}
          </span>

          {/* <span className="footer-sapn2">{t("footer.designBy")}</span> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;




