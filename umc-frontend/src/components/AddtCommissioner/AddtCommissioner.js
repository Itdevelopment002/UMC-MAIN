import React, { useEffect, useState } from "react";
import "../Commissioner/Commissioner.css";
import { Link } from "react-router-dom";
import cicon1 from "../../assets/images/commissioner/Vector.png";
import cicon2 from "../../assets/images/commissioner/Vector (1).png";
import cicon3 from "../../assets/images/commissioner/Vector (3).png";
import cicon4 from "../../assets/images/commissioner/Vector (5).png";
import cicon5 from "../../assets/images/commissioner/Vector (6).png";
import cicon6 from "../../assets/images/commissioner/Vector (7).png";
import api, { baseURL } from "../api";
import { useTranslation } from "react-i18next";

const AddtCommissioner = () => {
  const [commissioners, setCommissioners] = useState([]);
  const [descriptions, setDescriptions] = useState([]);
  const [bgImage, setBgImage] = useState("");
  const { i18n, t } = useTranslation();

  useEffect(() => {
    fetchCommissionerData();
    fetchHeaderImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const fetchCommissionerData = async () => {
    try {
      const [detailsResponse, descResponse] = await Promise.all([
        api.get(`/addt-commissioner-details?lang=${i18n.language}`),
        api.get(`/addt-commissioner-desc?lang=${i18n.language}`)
      ]);

      setCommissioners(detailsResponse.data);
      setDescriptions(descResponse.data);
    } catch (error) {
      console.error("Failed to fetch Commissioner data!", error);
    }
  };

  const fetchHeaderImage = async () => {
    try {
      const response = await api.get("/banner");
      const selectedBanner = response.data.find(banner => banner.banner_name === "Additional Commissioner");
      if (selectedBanner) {
        setBgImage(`${baseURL}${selectedBanner.file_path}`);
      }
    } catch (error) {
      console.error("Error fetching header image:", error);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const getDescriptionForCommissioner = (commissionerName) => {
    return descriptions.filter(desc => desc.commissioner_name === commissionerName);
  };

  return (
    <>
      <div
        className="history-header-image"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      ></div>

      <div id="main-content">
        <div className="container-fluid font-location mt-2 mb-5" id="commissioner-css">
          <nav className="breadcrumb">
            <Link to="/" className="breadcrumb-item text-decoration-none">
              {t('location.home')}
            </Link>
            <span className="breadcrumb-item text-decoration-none">
              {t('location.aboutumc')}
            </span>
            <span className="breadcrumb-item active1">{t('addt-commissioner.commissionerText')}</span>
          </nav>
          <h2 className="location-title">
            <span className="highlight">{t('addt-commissioner.highlight1')}</span>
            <span className="highlighted-text"> {t('addt-commissioner.highlight-text')}</span>
          </h2>

          {commissioners.map((commissioner, index) => {
            const descriptionsForThisCommissioner = getDescriptionForCommissioner(commissioner.coName);
            return (
              <React.Fragment key={index}>
                <div className="row mt-4">
                  <div className="col-lg-3 col-md-4 col-sm-12 col-12">
                    <div className="commison-profile-card text-center">
                      <img
                        src={`${baseURL}${commissioner?.image_path}`}
                        alt="Commissioner_img"
                        className="commison-profile-image"
                      />
                    </div>
                  </div>

                  <div className="col-lg-9 col-md-8 col-sm-12 col-12">
                    <div className="details-card">
                      <div className="commissioner-row">
                        <div className="commissioner-col">
                          <div className="commissioner-item">
                            <div className="icon-box">
                              <img src={cicon1} alt="icon" className="icon-image" />
                            </div>
                            <div className="text-box">
                              <strong className="label">{t('addt-commissioner.name')} :</strong>
                              <span className="value"> {commissioner?.coName}</span>
                            </div>
                          </div>
                          <div className="commissioner-item">
                            <div className="icon-box">
                              <img src={cicon2} alt="icon" className="icon-image" />
                            </div>
                            <div className="text-box">
                              <strong className="label">{t('commissioner.designation')} :</strong>
                              <span className="value">
                                {commissioner?.designation}{t('commissioner.designationText')}
                              </span>
                            </div>
                          </div>
                          <div className="commissioner-item">
                            <div className="icon-box">
                              <img src={cicon3} alt="icon" className="icon-image" />
                            </div>
                            <div className="text-box">
                              <strong className="label">
                                {t('commissioner.qualification')} :
                              </strong>
                              <span className="value">
                                {commissioner?.qualification}
                              </span>
                            </div>
                          </div>
                          <div className="commissioner-item">
                            <div className="icon-box">
                              <img src={cicon4} alt="icon" className="icon-image" />
                            </div>
                            <div className="text-box">
                              <strong className="label">{t('commissioner.address')} :</strong>
                              <span className="value">
                                {commissioner?.address}
                              </span>
                            </div>
                          </div>
                          <div className="commissioner-item">
                            <div className="icon-box">
                              <img src={cicon5} alt="icon" className="icon-image" />
                            </div>
                            <div className="text-box">
                              <strong className="label">{t('commissioner.phoneNumber')} :</strong>
                              <span className="value"> {commissioner?.number}</span>
                            </div>
                          </div>
                          <div className="commissioner-item">
                            <div className="icon-box">
                              <img src={cicon6} alt="icon" className="icon-image" />
                            </div>
                            <div className="text-box">
                              <strong className="label">{t('commissioner.email')} :</strong>
                              <span className="value"> {commissioner?.email}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {descriptionsForThisCommissioner.length > 0 && (
                  <div className="row mt-2">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                      <div className="commisioner-overview">
                        <h4>{t("asst-commisioner-overview")}</h4>
                      </div>

                      {descriptionsForThisCommissioner.map((item, idx) => (
                        <p key={idx} className="custom-commissioner-data" style={{ color: "#666565" }}>
                          {item.description}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {index < commissioners.length - 1 && (
                  <hr className="my-4" style={{ borderTop: '2px solid #666565' }} />
                )}
              </React.Fragment>
            );
          })}

          {commissioners.length === 0 && (
            <div className="row mt-4">
              <div className="col-12 text-center">
                <p>No commissioner data available</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AddtCommissioner;