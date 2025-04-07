import React, { useState, useEffect, useRef } from "react";
import "./EServices.css";
import { Link } from "react-router-dom";
import tick from "../../assets/images/info/tick.png";
import api, { baseURL } from "../api";
import { useTranslation } from "react-i18next";

const EServices = () => {
  const [activeTab, setActiveTab] = useState("#umc-news");
  const [activeIndex, setActiveIndex] = useState(null);
  //eslint-disable-next-line
  const [activeInfoIndex, setActiveInfoIndex] = useState(null);
  const [umcnews, setUmcNews] = useState([]);
  const [pressnotes, setPressNotes] = useState([]);
  const [services, setServices] = useState([]);
  const [initiatives, setInitiatives] = useState([]);
  const [information, setInformation] = useState([]);
  const [projects, setProjects] = useState([]);
  const [citzenServices, setCitizenServices] = useState([]);
  const { i18n, t } = useTranslation();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleClick = (index) => {
    setActiveIndex(index);
  };

  //eslint-disable-next-line
  const handleInfoClick = (index) => {
    setActiveInfoIndex(index);
  };

  const fetchNews = async () => {
    try {
      const response = await api.get(`/umc-news?lang=${i18n.language}`);
      const sortedData = response.data.sort((a, b) => {
        const dateA = a.issue_date ? new Date(a.issue_date) : new Date(0);
        const dateB = b.issue_date ? new Date(b.issue_date) : new Date(0);
        return dateB - dateA;
      });
      setUmcNews(sortedData);
    } catch (error) {
      console.error("Error Fetching umc news!", error);
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await api.get(`/press-note?lang=${i18n.language}`);
      const sortedData = response.data.sort((a, b) => {
        const dateA = a.issue_date ? new Date(a.issue_date) : new Date(0);
        const dateB = b.issue_date ? new Date(b.issue_date) : new Date(0);
        return dateB - dateA;
      });
      setPressNotes(sortedData);
    } catch (error) {
      console.error("Error Fetching press notes!", error);
    }
  };

  const fetchcitizenServices = async () => {
    try {
      const response = await api.get(`/citizen-services?lang=${i18n.language}`);
      setCitizenServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await api.get(`/eservices?lang=${i18n.language}`);
      setServices(response.data);
    } catch (error) {
      console.error("Error Fetching services!", error);
    }
  };

  const fetchInitiatives = async () => {
    try {
      const response = await api.get(`/initiatives?lang=${i18n.language}`);
      setInitiatives(response.data);
    } catch (error) {
      console.error("Error Fetching initiatives!", error);
    }
  };

  const fetchInformation = async () => {
    try {
      const response = await api.get(`/information?lang=${i18n.language}`);
      setInformation(response.data.reverse());
    } catch (error) {
      console.error("Error Fetching information!", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await api.get(`/projects?lang=${i18n.language}`);
      setProjects(response.data.reverse());
    } catch (error) {
      console.error("Error Fetching projects!", error);
    }
  };

  useEffect(() => {
    fetchNews();
    fetchNotes();
    fetchServices();
    fetchInitiatives();
    fetchInformation();
    fetchProjects();
    fetchcitizenServices();
    //eslint-disable-next-line
  }, [i18n.language]);

  const tabData = [
    {
      id: "#umc-news",
      name: t("home.UMCNews"),
      items: umcnews,
    },
    {
      id: "#initiatives",
      name: t("home.Initiatives-Programme"),
      layout: true,
    },
    {
      id: "#e-services",
      name: t("home.e-Services"),
      layout: true,
    },
    {
      id: "#press-notes",
      name: t("home.pressNotes"),
      items: pressnotes,
    },
    // {
    //   id: "#election",
    //   name: "Election",
    // },
  ];

  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.animation = "none";
      void scrollContainerRef.current.offsetHeight;
      scrollContainerRef.current.style.animation = "scroll-loop 25s linear infinite";
    }
  }, [information]);

  //eslint-disable-next-line
  const handleMouseEnter = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.animationPlayState = "paused";
    }
  };

  //eslint-disable-next-line
  const handleMouseLeave = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.animationPlayState = "running";
    }
  };

  const projectscrollContainerRef = useRef(null);

  useEffect(() => {
    if (projectscrollContainerRef.current) {
      projectscrollContainerRef.current.style.animation = "none";
      void projectscrollContainerRef.current.offsetHeight;
      projectscrollContainerRef.current.style.animation = "scroll-loop 15s linear infinite";
    }
  }, [projects]);

  //eslint-disable-next-line
  const projectshandleMouseEnter = () => {
    if (projectscrollContainerRef.current) {
      projectscrollContainerRef.current.style.animationPlayState = "paused";
    }
  };

  //eslint-disable-next-line
  const projectshandleMouseLeave = () => {
    if (projectscrollContainerRef.current) {
      projectscrollContainerRef.current.style.animationPlayState = "running";
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="container-fluid mb-4 mt-4">
      <div className="row" style={{ backgroundColor: "#ffffff" }}>
        <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
          <div className="e-services-container p-2">
            <div className="tabs-container right-section-font mb-4">
              <ul className="nav nav-tabs gap-3 custom-nav-border">
                {tabData.map((tab) => (
                  <li className="nav-item" key={tab.id}>
                    <Link
                      className={`nav-link ${activeTab === tab.id ? "active" : ""
                        }`}
                      to={tab.id}
                      onClick={() => handleTabClick(tab.id)}
                    >
                      {tab.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="news-list right-section-font">
              {tabData.find((tab) => tab.id === activeTab)?.layout ? (
                activeTab === "#e-services" ? (
                  <div className="e-services-layout mt-2 p-2">
                    <table className="table">
                      <tbody>
                        {services.reduce((rows, service, index) => {
                          if (index % 2 === 0) {
                            rows.push([service]);
                          } else {
                            rows[rows.length - 1].push(service);
                          }
                          return rows;
                        }, []).map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {row.map((service, colIndex) => (
                              <td key={colIndex}>
                                <div className="service-item">
                                  <img src={tick} alt="Tick" className="tick-icon me-2" />
                                  <Link
                                    to={service.link}
                                    className="text-decoration-none"
                                    style={{ color: "#000000" }}
                                    target="_blank"
                                    aria-label={`Visit ${service.heading} website`}
                                  >
                                    <span className="service-text">{service.heading}</span>
                                  </Link>
                                </div>
                              </td>
                            ))}
                            {row.length === 1 && <td></td>}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="initiatives-layout row mt-3">
                    {initiatives.map((initiative, index) => (
                      <div className="col-md-6 mb-3 initiative-hover">
                        <Link to={initiative.link} className="text-decoration-none" style={{ color: "#000000" }} target="_blank">
                          <div className="initiative-item d-flex align-items-center border rounded">
                            <div className="img-container img-with-border">
                              <img
                                src={`${baseURL}/${initiative.main_icon_path}`}
                                alt={initiative.heading}
                                className="initiative-img"
                                aria-label={`Visit ${initiative.heading} website`}
                              />
                            </div>
                            <span className="initiative-text ms-3">
                              {initiative.heading}
                            </span>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                )
              ) : activeTab === "#election" ? (
                <div className="no-data-message mt-3 text-center">
                  <span>No data available</span>
                </div>
              ) : (
                <ul className="list-unstyled">
                  {tabData
                    .find((tab) => tab.id === activeTab)
                    ?.items?.map((item, index) => (
                      <li key={index}>
                        <img src={tick} className="custom-icons" alt="" />
                        {typeof item === "object" ? (
                          <Link
                            to={item.link}
                            className={`text-decoration-none custom-list-effect ${activeIndex === index ? "active" : ""
                              }`}
                            target="_blank"
                            onClick={() => handleClick(index)}
                          >
                            {item.heading || item.description}
                          </Link>
                        ) : (
                          item
                        )}
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
          <div className="citigen mt-1 mb-1">
            <div className="vertical-line"></div>
            <div className="d-flex">
              <h2 className="section-title">
                {t("home.citizen")} <span className="subtitle">{t("home.services")}</span>
              </h2>
            </div>
          </div>

          <div className="row">
            {citzenServices.map((service, index) => (
              <div className="col-6 col-lg-3 col-md-4 col-sm-6 mb-4 mt-1" key={index}>
                <Link
                  to={service.service_link}
                  className="text-decoration-none"
                  target={service.service_link.startsWith("/") ? "_self" : "_blank"}
                  rel={service.service_link.startsWith("/") ? "" : "noopener noreferrer"}
                >
                  <div className="service-card text-center">
                    <img
                      src={`${baseURL}/${service.main_icon_path}`}
                      alt={service.service_heading}
                      className="service-image mb-3"
                      aria-label={`Visit ${service.service_heading} website`}
                    />
                    <h5 className="service-title">{service.service_heading}</h5>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EServices;
