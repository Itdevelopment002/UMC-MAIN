import React, { useEffect, useState } from "react";
import "./Commissioner.css";
import { Link } from "react-router-dom";
import cicon1 from "../../assets/images/commissioner/Vector.png";
import cicon2 from "../../assets/images/commissioner/Vector (1).png";
import cicon3 from "../../assets/images/commissioner/Vector (3).png";
import cicon4 from "../../assets/images/commissioner/Vector (5).png";
import cicon5 from "../../assets/images/commissioner/Vector (6).png";
import cicon6 from "../../assets/images/commissioner/Vector (7).png";
import api, { baseURL } from "../api";
import { useTranslation } from "react-i18next";

const Commissioner = () => {
  const [coData, setCoData] = useState([]);
  const [coDesc, setCoDesc] = useState([]);
  const [bgImage, setBgImage] = useState("");
  const { i18n, t } = useTranslation();

  useEffect(() => {
    fetchCoData();
    fetchCoDesc();
    fetchHeaderImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const fetchCoData = async () => {
    try {
      const response = await api.get(`/commissioner-data?lang=${i18n.language}`);
      setCoData(response.data);
    } catch (error) {
      console.error("Failed to fetch Commissioner Details data!");
    }
  };

  const fetchCoDesc = async () => {
    try {
      const response = await api.get(`/commissioner-desc?lang=${i18n.language}`);
      setCoDesc(response.data);
    } catch (error) {
      console.error("Failed to fetch Commissioner Description data!");
    }
  };

  const fetchHeaderImage = async () => {
    try {
      const response = await api.get("/banner");

      if (response.data.length > 0) {
        let selectedBanner = response.data.find(banner => banner.banner_name === "Commissioner");

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
          className="container-fluid font-location mt-2 mb-5"
          id="commissioner-css"
        >
          <nav className="breadcrumb">
            <Link to="/" className="breadcrumb-item text-decoration-none">
              {t('location.home')}
            </Link>
            <Link to="#" className="breadcrumb-item text-decoration-none">
              {t('location.aboutumc')}
            </Link>
            <span className="breadcrumb-item active1">{t('commissioner.commissionerText')}</span>
          </nav>
          <h2 className="location-title">
            <span className="highlight">{t('commissioner.highlight1')}</span>
            <span className="highlighted-text"> {t('commissioner.highlight-text')}</span>
          </h2>

          <div className="row mt-4">

            <div className="col-lg-3 col-md-4 col-sm-12 col-12">
              <div className="commison-profile-card text-center">
                <img
                  src={`${baseURL}${coData[0]?.image_path}`}
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
                        <strong className="label">{t('commissioner.name')} :</strong>
                        <span className="value"> {coData[0]?.coName}</span>
                      </div>
                    </div>
                    <div className="commissioner-item">
                      <div className="icon-box">
                        <img src={cicon2} alt="icon" className="icon-image" />
                      </div>
                      <div className="text-box">
                        <strong className="label">{t('commissioner.designation')} :</strong>
                        <span className="value">
                          {" "}
                          {coData[0]?.designation} {t('commissioner.designationText')}
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
                          {" "}
                          {coData[0]?.qualification}
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
                          {" "}
                          {coData[0]?.address}
                        </span>
                      </div>
                    </div>
                    <div className="commissioner-item">
                      <div className="icon-box">
                        <img src={cicon5} alt="icon" className="icon-image" />
                      </div>
                      <div className="text-box">
                        <strong className="label">{t('commissioner.phoneNumber')} :</strong>
                        <span className="value"> {coData[0]?.number}</span>
                      </div>
                    </div>
                    <div className="commissioner-item">
                      <div className="icon-box">
                        <img src={cicon6} alt="icon" className="icon-image" />
                      </div>
                      <div className="text-box">
                        <strong className="label">{t('commissioner.email')} :</strong>
                        <span className="value"> {coData[0]?.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-lg-12 col-md-12 col-sm-12 col-12">
              <div className="commisioner-overview">
                <h4>{t("commisioner-overview")}</h4>
              </div>
              {coDesc.length > 0 ? (
                coDesc.map((policy) => (
                  <React.Fragment key={policy.id}>
                    <p style={{ color: "#666565" }}>{policy.description}</p>
                  </React.Fragment>
                ))
              ) : (
                <p style={{ color: "#666565" }}>Loading data...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Commissioner;
