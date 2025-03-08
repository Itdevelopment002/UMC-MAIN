import React, { useEffect, useState, useRef } from "react";
import "./CitizenServices.css";
import { Link } from "react-router-dom";
import vector from "../../assets/images/citizen-services/vector-1.png";
import AOS from 'aos';
import 'aos/dist/aos.css';
import api, { baseURL } from "../api";
import { useTranslation } from "react-i18next";

const CitizenServices = () => {
  const [homeservices1, setHomeServices1] = useState([]);
  const [videos, setVideos] = useState([]);
  const [information, setInformation] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activeInfoIndex, setActiveInfoIndex] = useState(null);
  const { i18n, t } = useTranslation();

  useEffect(() => {
    fetchVideos();
    fetchHomeServices1();
    fetchInformation();
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.animation = "none";
      void scrollContainerRef.current.offsetHeight;
      scrollContainerRef.current.style.animation = "scroll-loop 25s linear infinite";
    }
  }, [information]);

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
  const handleInfoClick = (index) => {
    setActiveInfoIndex(index);
  };
  const fetchInformation = async () => {
    try {
      const response = await api.get(`/information?lang=${i18n.language}`);
      const sortedData = response.data.sort((a, b) => {
        const dateA = a.issue_date ? new Date(a.issue_date) : new Date(0);
        const dateB = b.issue_date ? new Date(b.issue_date) : new Date(0);
        return dateB - dateA;
      });
      setInformation(sortedData);
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

  const fetchVideos = async () => {
    try {
      const response = await api.get("/home-video");
      setVideos(response.data);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  const fetchHomeServices1 = async () => {
    try {
      const response = await api.get(`/home-services2?lang=${i18n.language}`);
      setHomeServices1(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const getYouTubeVideoId = (url) => {
    const regExp =
      // eslint-disable-next-line
      /^.*(youtu.be\/|v\/|\/u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  useEffect(() => {
    AOS.init({
      duration: 450,
      delay: 100,
      once: true,
    });
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const colors = ["#1EB174", "#FA5F68", "#F8C437", "#898989", "#F37F1B", "#0C8DD4"];

  return (
    <div className="background-container" id="citizen-section">
      <div className="container-fluid citigen-section">
        <div className="row py-2 d-flex flex-wrap justify-content-between" >
          <div className="col-xl-3 col-lg-6 col-md-6 col-sm-12 e-services-margin right-section-font">
            <div className="upcoming-projects bg-white p-2">
              <h5 className="p-2 h5-styling-div">{t("home.information")}</h5>
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
              <h5 className="p-2 h5-styling-5">{t("home.upcomingProjects")}</h5>
              <div className="scroll-wrapper">
                <div
                  className="scroll-container"
                  ref={projectscrollContainerRef}
                  onMouseEnter={projectshandleMouseEnter}
                  onMouseLeave={projectshandleMouseLeave}
                >
                  {projects.map((project, index) => (
                    <div key={index}>
                      <Link to={project.link} className="text-decoartion-none" style={{ color: "black" }}>
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
                      </Link>
                      <hr className="mt-1" />
                    </div>
                  ))}
                  {projects.map((project, index) => (
                    <div key={`duplicate-${index}`}>
                      <Link to={project.link} className="text-decoartion-none" style={{ color: "black" }}>
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
                      </Link>
                      <hr className="mt-1" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-2 col-lg-4 col-md-4 col-sm-5">
            <div className="citigen">
              <div className="vertical-line"></div>
              <div className="d-flex">
                <h2 className="section-title">
                  {t("home.video")} <span className="subtitle">{t("home.gallery")}</span>
                </h2>
              </div>
            </div>

            <div id="citizen-section" className="row">
              {videos.length > 0 ? (
                videos.map((video, index) => (
                  <div key={index} className="col-12 video-wrapper">
                    <div className="video-container">
                      <iframe
                        src={`https://www.youtube.com/embed/${getYouTubeVideoId(
                          video.video_url
                        )}`}
                        title={`YouTube video ${index + 1}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12">
                  <p>{t("home.loadingVideos")}</p>
                </div>
              )}
            </div>
          </div>

          <div className="col-xl-4 col-lg-8 col-md-8 col-sm-7">
            <div className="menu-list">
              {homeservices1.map((item, index) => (
                <Link to={item.link} className="text-decoration-none">
                  <div
                    key={index}
                    className="menu-item mb-3"
                    data-aos="fade-right"
                    data-aos-delay={`${index * 100}`}
                    data-aos-duration="500"
                    style={{
                      borderLeft: `4px solid ${colors[index % colors.length]}`,
                    }}
                  >
                    <span className="menu-text">{item.heading}</span>
                    <span className="menu-image">
                      <img src={vector} alt="arrow" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenServices;
