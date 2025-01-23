import React, { useState, useEffect, useRef } from "react";
import "./EServices.css";
import { Link } from "react-router-dom";
import img1 from "../../assets/images/project/img1 (1).png";
import img2 from "../../assets/images/project/img1 (2).png";
import img3 from "../../assets/images/project/img1 (3).png";
import img4 from "../../assets/images/project/img1 (4).png";
import tick from "../../assets/images/info/tick.png";
import plasticWaste from "../../assets/images/e-services/waste 1.png";
import swachhBharat from "../../assets/images/e-services/dustbin 1.png";
import airQuality from "../../assets/images/e-services/air-quality 1.png";
import rti from "../../assets/images/e-services/survey 2.png";
import employeeInfo from "../../assets/images/e-services/personal 1.png";
import api, { baseURL } from "../api";

const EServices = () => {
  const [activeTab, setActiveTab] = useState("#umc-news");
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeInfoIndex, setActiveInfoIndex] = useState(null);
  const [umcnews, setUmcNews] = useState([]);
  const [services, setServices] = useState([]);
  const [initiatives, setInitiatives] = useState([]);
  const [information, setInformation] = useState([]);
  const [projects, setProjects] = useState([]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleClick = (index) => {
    setActiveIndex(index);
  };
  const handleInfoClick = (index) => {
    setActiveInfoIndex(index);
  };

  const fetchNews = async () => {
    try {
      const response = await api.get("/umc-news");
      setUmcNews(response.data.reverse());
    } catch (error) {
      console.error("Error Fetching umc news!", error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await api.get("/eservices");
      setServices(response.data);
    } catch (error) {
      console.error("Error Fetching services!", error);
    }
  };

  const fetchInitiatives = async () => {
    try {
      const response = await api.get("/initiatives");
      setInitiatives(response.data);
    } catch (error) {
      console.error("Error Fetching initiatives!", error);
    }
  };

  const fetchInformation = async () => {
    try {
      const response = await api.get("/information");
      setInformation(response.data.reverse());
    } catch (error) {
      console.error("Error Fetching information!", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await api.get("/projects");
      setProjects(response.data.reverse());
    } catch (error) {
      console.error("Error Fetching projects!", error);
    }
  };

  useEffect(() => {
    fetchNews();
    fetchServices();
    fetchInitiatives();
    fetchInformation();
    fetchProjects();
  }, []);

  const tabData = [
    {
      id: "#umc-news",
      name: "UMC News",
      items: umcnews,
    },
    {
      id: "#initiatives",
      name: "Initiatives-Programme",
      layout: true,
    },
    {
      id: "#e-services",
      name: "e-Services",
      layout: true,
    },
    {
      id: "#election",
      name: "Election",
    },
  ];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  // const information = [
  //   { description: "Action Against Illegal Construction (1st July to 31st December 2020)", link: "https://drive.google.com/file/d/18MZleh2FJBHXdJBQqPcS1HJgggkHZqhK/view?usp=drive_link" },
  //   { description: "Regularization of Unauthorized Structures", link: "https://drive.google.com/file/d/1jg9u-D3BwFP0k6w26gjAt0DDq4s9ScW1/view?usp=drive_link" },
  //   { description: "Pollution Control Helpline: 18002331103", link: "https://drive.google.com/file/d/18mMgTmGmafEl8YyxciRTsu1T1nwCOAGP/view?usp=drive_link" },
  //   { description: "Recycle Water Provision in DCR", link: "https://drive.google.com/file/d/11wcT95cXSkFskkSJ4zmlJUymmEp_3gUk/view?usp=drive_link" },
  //   { description: "Assessment Guidelines", link: "https://drive.google.com/file/d/1f5goiw1ml4vh1zHeb34wkeHLQXgW8vTD/view?usp=drive_link" },
  //   { description: "List of Dangerous Buildings Notice - 27th October 2021", link: "https://drive.google.com/file/d/1jVcPAW3VKT523Mz5bnrDdbN7gJlCfADa/view?usp=drive_link" },
  //   { description: "Report - Illegal Banners, Hoardings, Notice Boards", link: "https://drive.google.com/file/d/1kBGXBm2efETEBsGLCogZWi7ZhIchOaYa/view?usp=drive_link" },
  //   { description: "Dangerous Building Notice", link: "https://drive.google.com/file/d/1XAffoqCHoAGdyk_lfPHYENQsvKeww9K4/view?usp=drive_link" },
  //   { description: "Dangerous Building Report", link: "https://drive.google.com/file/d/1R0wfxUWhd9SrU7_CZStuuYy0gGDlnwTt/view?usp=drive_link" },
  //   { description: "Action Against Illegal Construction (1st July to 31st December 2020)", link: "https://drive.google.com/file/d/1fGNHCg1NZUfM2sUGvKG8k786hMpME4Mw/view?usp=drive_link" },
  //   { description: "Action Against Illegal Banners and Posters", link: "https://drive.google.com/file/d/1j7mHse3Z6w4OACKmj7V5Ge40RzkQ4P0a/view?usp=drive_link" },
  //   { description: "Dangerous Building List - 2020", link: "https://drive.google.com/file/d/1YJMRioRzRUEokt4R96VaYUGAB-7EHfhW/view?usp=drive_link" },
  //   { description: "List of Illegal Constructions", link: "https://drive.google.com/file/d/18yXiPsFoDn28gksxE5QWrGEcBEPoofJ_/view?usp=drive_link" },
  //   { description: "UMC Disaster Management Plan - 2020", link: "https://drive.google.com/file/d/1OHrYPZ5mmc6SYpOSAowv_JZM14Z-9wL8/view?usp=drive_link" },
  //   { description: "Drainage Cleaning Report", link: "https://drive.google.com/file/d/1C2VlzaEDkf3wHy39Rcp24cur7Ge2v42t/view?usp=drive_link" },
  //   { description: "List of Modifications to Town Planning (TP/DP)", link: "https://drive.google.com/file/d/1V7ZswSp4VZjuDfpBiYeqjJ-Fi31RVfj2/view?usp=drive_link" },
  //   { description: "Public Notice Under Section 28(4) of Development Plan (DP)", link: "https://drive.google.com/file/d/1XIaZpCF-BqewxVbToKaShprMDafpSw1n/view?usp=drive_link" },
  //   { description: "Citizen Charter", link: "https://drive.google.com/file/d/1ggzzeGO1_p-Py_6vipha9izHYoP39p2X/view?usp=drive_link" },
  //   { description: "Property Tax Demand & Collection Book", link: "https://drive.google.com/file/d/1BHZK6UyeIZJ8YBSCXytCAci5PE8OAjOC/view?usp=drive_link" },
  //   { description: "Action Report Against Unauthorized Posters, Banners, Hoardings, Flags, Arches, and Advertisement Boards in Ulhasnagar Municipal Corporation Area", link: "#" },
  //   { description: "Budget Estimates for the Year 2022-2023", link: "#" },
  //   { description: "Dismissal Order - 7th December 2021", link: "#" },
  //   { description: "Pandal Permission", link: "#" },
  //   { description: "List of Dangerous Buildings - 2019", link: "#" },
  //   { description: "Click Here for Illegal Construction Complaint Status", link: "#" },
  //   { description: "Revised Dismissal Order - 6th January 2022", link: "#" },
  //   { description: "Demolition Action Report (1st January 2021 to 30th June 2021)", link: "#" },
  //   { description: "Blood Donation", link: "#" },
  //   { description: "Silence Zone List", link: "#" },
  // ];

  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.animation = "none";
      void scrollContainerRef.current.offsetHeight;
      scrollContainerRef.current.style.animation = "scroll-loop 25s linear infinite";
    }
  }, [information]);

  const handleMouseEnter = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.animationPlayState = "paused";
    }
  };

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
  const projectshandleMouseEnter = () => {
    if (projectscrollContainerRef.current) {
      projectscrollContainerRef.current.style.animationPlayState = "paused";
    }
  };

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
      <div className="row">
        <div className="col-xl-6 col-lg-12 col-md-12 col-sm-12">
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
                      <div className="col-md-6 mb-3">
                        <Link to={initiative.link} className="text-decoration-none" style={{ color: "#000000" }} target="_blank">
                          <div className="initiative-item d-flex align-items-center border rounded">
                            <div className="img-container img-with-border">
                              <img
                                src={`${baseURL}/${initiative.main_icon_path}`}
                                alt={initiative.heading}
                                className="initiative-img"
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
                            {item.heading}
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
        <div className="col-xl-3 col-lg-6 col-md-6 col-sm-12 e-services-margin right-section-font">
          <div className="upcoming-projects bg-white p-2">
            <h5 className="p-2 h5-styling-div">Information</h5>
            <div className="scroll-wrapper">
              <div
                className="info-scroll-container"
                ref={scrollContainerRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <ul>
                  {information.map((info, index) => (
                    <li key={index} className="para-style1">
                      <Link
                        to={info.link}
                        className={`text-decoration-none custom-list-effect ${activeInfoIndex === index ? "active" : ""
                          }`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleInfoClick(index)}

                      >
                        {info.heading}
                      </Link>
                    </li>
                  ))}
                </ul>
                <ul>
                  {information.map((info, index) => (
                    <li key={`duplicate-${index}`} className="para-style1">
                      <Link
                        to={info.link}
                        className={`text-decoration-none custom-list-effect ${activeInfoIndex === index ? "active" : ""
                          }`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleInfoClick(index)}

                      >
                        {info.heading}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-lg-6 col-md-6 col-sm-12 e-services-margin right-section-font">
          <div className="upcoming-projects bg-white p-2">
            <h5 className="p-2 h5-styling-5">Upcoming Projects</h5>
            <div className="scroll-wrapper">
              <div
                className="scroll-container"
                ref={projectscrollContainerRef}
                onMouseEnter={projectshandleMouseEnter}
                onMouseLeave={projectshandleMouseLeave}
              >
                {projects.map((project, index) => (
                  <div key={index}>
                    <div className="project-item">
                      <img
                        src={`${baseURL}/${project.main_icon_path}`}
                        alt={project.heading}
                        className="e-services-img me-3"
                      />
                      <div>
                        <p className="para-style">
                          <b>{project.heading}, </b>
                          {project.description}
                        </p>
                      </div>
                    </div>
                    <hr className="mt-1" />
                  </div>
                ))}
                {projects.map((project, index) => (
                  <div key={`duplicate-${index}`}>
                    <div className="project-item">
                      <img
                        src={`${baseURL}/${project.main_icon_path}`}
                        alt={project.heading}
                        className="e-services-img me-3"
                      />
                      <div>
                        <p className="para-style">
                          <b>{project.heading}, </b>
                          {project.description}
                        </p>
                      </div>
                    </div>
                    <hr className="mt-1" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EServices;
