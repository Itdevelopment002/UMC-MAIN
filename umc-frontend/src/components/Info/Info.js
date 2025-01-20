import React, { useEffect, useState } from "react";
import "./Info.css";
import { Link } from "react-router-dom";
import Commissioner from "../../assets/images/commissioner/Commissioner.png";
import info1 from "../../assets/images/info/vector1.png";
import info2 from "../../assets/images/info/vector2.png";
import info3 from "../../assets/images/info/vector3.png";
import info4 from "../../assets/images/info/vector4.png";
import info5 from "../../assets/images/info/vector5.png";
import AOS from 'aos';
import 'aos/dist/aos.css';

const Info = () => {
  const [activeButton, setActiveButton] = useState(1);
  useEffect(() => {
    AOS.init({
      duration: 400,
      delay: 400,
    });
  }, []);

  const buttons = [
    {
      id: 1,
      label: "e-Tender",
      icon: info1,
      color: "#42B8F9",
      link: "https://mahatenders.gov.in/nicgep/app"
    },
    {
      id: 2,
      label: "Complaint Portal",
      icon: info2,
      color: "#F8D05C",
      link: "https://aaplesarkar.mahaonline.gov.in/en"
    },
    {
      id: 3,
      label: "Online Payment",
      icon: info3,
      color: "#5FD35F",
      link: "https://www.umconlineservices.in/Payment/"
    },
    {
      id: 4,
      label: "RTS 2015",
      icon: info4,
      color: "#F5507A",
      link: "http://rtsumc.org.in/"
    },
    {
      id: 5,
      label: "Solid Waste Management",
      icon: info5,
      color: "#A57BF6",
      link: "/solid-waste-management-system"
    },
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="container-fluid mt-5">
      <div className="row align-items-center">
        <div className="col-lg-3 col-md-12 profile-div" data-aos="fade-right">
          <div className="profile-card">
            <img
              src={Commissioner}
              alt="Commissioner"
              className="profile-image"
            />
            <h5 className="custom-name">Ms. Manisha Awhale </h5>
            <p className="custom-title">Commissioner</p>
            <p className="organization">Ulhasnagar Municipal Corporation</p>
          </div>
        </div>

        <div className="col-lg-6 col-md-12 welcome-section" data-aos="fade-down">
          <div className="heading">
            <h1 data-aos="fade-up" className="info-heading1">Welcome to <span className="info-heading2 fw-bold">Ulhasnagar Municipal Corporation</span></h1>
          </div>
          <p className="description">
            Ulhasnagar is a municipal town and the headquarters of the Tahsil bearing the same name. It is a railway station on the Mumbai-Pune route of the Central Railway. Ulhasnagar, a colony of migrants in the aftermath of Partition, is 43 years old. Situated 58 Kms from Mumbai, the once-barren land has developed into a rich town of Thane district. Originally, known as Kalyan Military transit camp, Ulhasnagar was set up especially to accommodate 6,000 soldiers and 30,000 others during World War II. There were 2,126 barracks and about 1,173 housed personals.
          </p>
          <Link to="/history" className="see-more-btn">
            Read More...
          </Link>
        </div>

        <div className="col-lg-3 col-md-12" id="info-section" data-aos="fade-top">
          {buttons.map((button) => (
            <Link
              to={button.link}
              key={button.id}
              className={`custom-btn ${activeButton === button.id ? "active" : ""} text-decoration-none`}
              onClick={() => setActiveButton(button.id)}
              {...(button.link.startsWith("http") ? { target: "_blank" } : {})}
            >
              <div
                className="button-icon-section"
                style={{ backgroundColor: button.color }}
              >
                <img
                  src={button.icon}
                  alt={button.label}
                  className="btn-icon"
                />
              </div>

              <span className="nav-divider"></span>

              <div className="button-label">
                {button.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Info;
