import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./BirthCertificate.css";
import PropertyTaximg from "../../assets/images/online-services/property.png";
import BirthCertificateimg from "../../assets/images/online-services/birth.png";
import DeathCertificateimg from "../../assets/images/online-services/death.png";
import eTenderimg from "../../assets/images/online-services/tender.png";
import api, { baseURL } from "../api";
import { useTranslation } from 'react-i18next';

const BirthCertificate = () => {
  const [activeTab, setActiveTab] = useState("#birth-certificate");
  const [bgImage, setBgImage] = useState("");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const { t, i18n } = useTranslation();

  const fetchHeaderImage = async () => {
    try {
      const response = await api.get("/banner");

      if (response.data.length > 0) {
        let selectedBanner = response.data.find(banner => banner.banner_name === "Birth-Certificate");

        if (selectedBanner) {
          setBgImage(`${baseURL}${selectedBanner.file_path}`);
        } else {
          console.error("Banner with specified name not found.");
        }
      } else {
        console.error("No banner image found.");
      }
    } catch (error) {
      console.error("Error fetching header image:", error);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const initializeTabData = () => [
    {
      id: "#property-tax-payment",
      link: "/property-tax-payment",
      name: t('propertyTaxPayment.name'),
      description: t('propertyTaxPayment.description', { returnObjects: true }),
      url: "",
      image: PropertyTaximg,
    },
    {
      id: "#birth-certificate",
      link: "/birth-certificate",
      name: t('birthCertificate.name'),
      description: t('birthCertificate.description', { returnObjects: true }),
      url: "",
      image: BirthCertificateimg,
    },
    {
      id: "#death-certificate",
      link: "/death-certificate",
      name: t('deathCertificate.name'),
      description: t('deathCertificate.description', { returnObjects: true }),
      url: "",
      image: DeathCertificateimg,
    },
    {
      id: "#e-tender",
      link: "/e-tender",
      name: t('eTender.name'),
      description: t('eTender.description', { returnObjects: true }),
      url: "",
      image: eTenderimg,
    },
  ];

  const [tabData, setTabData] = useState(initializeTabData());

  useEffect(() => {
    setTabData(initializeTabData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const fetchServices = async () => {
    try {
      const response = await api.get(`/online-services-home?lang=${i18n.language}`);
      const serviceData = response.data;
      const updatedTabData = tabData.map((tab) => {
        const matchingService = serviceData.find(
          (service) => service.heading === tab.name
        );
        return matchingService
          ? { ...tab, url: matchingService.link }
          : tab;
      });

      setTabData(updatedTabData);
    } catch (error) {
      console.error("Error fetching service data", error);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchHeaderImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeTabData = tabData.find((tab) => tab.id === activeTab);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      <div
        className="history-header-image"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      ></div>

      <div id="main-content">
        <div
          className="container-fluid font-location mt-4 mb-5"
          id="birth-css"
        >
          <nav className="breadcrumb">
            <Link to="/" className="breadcrumb-item text-decoration-none">
              {t('home1')}
            </Link>
            <Link to="#" className="breadcrumb-item text-decoration-none">
              {t('onlineServices')}
            </Link>
            <span className="breadcrumb-item active1">{t('birthCertificate.name')}</span>
          </nav>
          <h2 className="location-title"><span className="highlight">{t('birthCertificate.name1')}</span><span className="highlighted-text"> {t('birthCertificate.name2')}</span></h2>
          <div className="row mt-4 row-styling-3">
            <div className="col-xl-9 col-lg-12 col-md-12 col-sm-12">
              <div className="e-services-container p-2">
                <div className="content">
                  <div className="tabs-container roboto-font">
                    <ul className="nav nav-tabs custom-nav-border gap-2">
                      {tabData.map((tab) => (
                        <li className="nav-item" key={tab.id}>
                          <Link
                            className={`nav-link ${activeTab === tab.id ? "active" : ""}`}
                            to={tab.link}
                            onClick={() => handleTabClick(tab.id)}
                          >
                            {tab.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="roboto-font p-3">
                    {activeTabData && (
                      <div className="row d-flex align-items-center mt-4">
                        <div className="col-md-6 col-sm-12 d-flex align-items-center justify-content-start">
                          <div className="tab-description">
                            {activeTabData.description.map((desc, index) => (
                              <p key={index}>
                                {desc} {index === 0 && <Link to={activeTabData.url} target="_blank">{t('clickHere')}</Link>}
                              </p>
                            ))}
                          </div>
                        </div>
                        <div
                          className="col-md-6 col-sm-12 d-flex align-items-center justify-content-start"
                        >
                          <img
                            src={activeTabData.image}
                            alt={activeTabData.name}
                            className="service-image"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="background-img"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BirthCertificate;