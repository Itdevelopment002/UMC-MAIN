import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AdministrativeStructure.css";
import api, { baseURL } from "../api"
import "../TableCss/TableCss.css";
import { useTranslation } from "react-i18next";

const AdministrativeStructure = () => {
  const [structureData1, setStructureData1] = useState([]);
  const [structureData2, setStructureData2] = useState([]);
  const [structureData3, setStructureData3] = useState([]);
  const [structureData4, setStructureData4] = useState([]);
  const [tableData1, setTableData1] = useState([]);
  const [tableData2, setTableData2] = useState([]);
  const [tableData3, setTableData3] = useState([]);
  const [tableData4, setTableData4] = useState([]);
  const [commissioner, setCommissioner] = useState([]);
  const [bgImage, setBgImage] = useState("");
  const { i18n, t } = useTranslation();

  const fetchHeaderImage = async () => {
    try {
      const response = await api.get("/banner");

      if (response.data.length > 0) {
        let selectedBanner = response.data.find(banner => banner.banner_name === "Administrative Structure");

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

  const fetchCommissioner = async () => {
    try {
      const response = await api.get(`/commissioner-data?lang=${i18n.language}`);
      setCommissioner(response.data);
    } catch (error) {
      console.error("Failed to fetch Commissioner Details data!");
    }
  };

  useEffect(() => {
    fetchStructureData1();
    fetchStructureData2();
    fetchStructureData3();
    fetchStructureData4();
    fetchTableData();
    fetchCommissioner();
    fetchHeaderImage();
    //eslint-disable-next-line
  }, [i18n.language]);

  const fetchStructureData1 = async () => {
    try {
      const response = await api.get(`/structure-tab1?lang=${i18n.language}`);
      setStructureData1(response.data);
    } catch (error) {
      console.error("Failed to fetch data!");
    }
  };

  const fetchStructureData2 = async () => {
    try {
      const response = await api.get(`/structure-tab2?lang=${i18n.language}`);
      setStructureData2(response.data);
    } catch (error) {
      console.error("Failed to fetch data!");
    }
  };

  const fetchStructureData3 = async () => {
    try {
      const response = await api.get(`/structure-tab3?lang=${i18n.language}`);
      setStructureData3(response.data);
    } catch (error) {
      console.error("Failed to fetch data!");
    }
  };

  const fetchStructureData4 = async () => {
    try {
      const response = await api.get(`/structure-tab4?lang=${i18n.language}`);
      setStructureData4(response.data);
    } catch (error) {
      console.error("Failed to fetch data!");
    }
  };

  const fetchTableData = async () => {
    try {
      const response = await api.get(`/table-heading?lang=${i18n.language}`);
      const table1 = response.data.filter((item) => item.tablename === "Departments entrusted to Additional Commissioners");
      const table2 = response.data.filter((item) => item.tablename === "Departments entrusted to the Deputy Commissioner");
      const table3 = response.data.filter((item) => item.tablename === "Departments assigned to Assistant Commissioner");
      const table4 = response.data.filter((item) => item.tablename === "Assistant Commissioner Ward Committee");
      setTableData1(table1);
      setTableData2(table2);
      setTableData3(table3);
      setTableData4(table4);
    } catch (error) {
      console.error("Failed to fetch data!");
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
        <div className="container-fluid font-location mt-4 mb-5" id="administrative-css">
          <nav className="breadcrumb">
            <Link to="/" className="breadcrumb-item text-decoration-none">
              {t("breadcrumbHome")}
            </Link>
            <Link to="#" className="breadcrumb-item text-decoration-none">
              {t('administrative.wings')}
            </Link>
            <span className="breadcrumb-item active1">{t("administrative.breadcrumb")}</span>
          </nav>
          <h2 className="location-title">
            <span className="highlight">{t("administrative.administrative")}</span>
            <span className="highlighted-text"> {t("administrative.structure")}</span>
          </h2>
          <hr />
          <div className="row mt-4">
            {commissioner.map((item, index) => (
              <React.Fragment key={index}>
                <h4 className="text-center fw-semibold">{item.coName}</h4>
                <h5 className="text-center text-muted fw-bold">{item.designation}</h5>
              </React.Fragment>
            ))}
            <div className="col-12 col-xl-12 col-lg-12 col-md-12 col-sm-12">
              <div className="row mt-4">
                <div className="col-12 col-xl-6 col-lg-6 col-md-12 col-sm-12">
                  <div className="system-style-div text-start">
                    <p className="mb-0">
                      <span>{t("administrative.thead1")}</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="circular-wrapper">
                  <table className="table table-bordered table-responsive shadow mt-4">
                    <thead className="bg-orange text-white">
                      <tr>
                        <th className="table-heading-styling" style={{ textAlign: "center" }}>{t("administrative.srNo")}</th>
                        {tableData1.map((item, index) => (
                          <th key={index} className="table-heading-styling text-center" style={{textWrap: "pretty"}} colSpan={2}>{item.heading}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {structureData1.length > 0 ? (
                        structureData1.map((item, index) => (
                          <tr key={index}>
                            <td
                              className="font-large"
                              width="8%"
                              style={{
                                paddingLeft: "10px",
                                paddingRight: "10px",
                                color: "#292D32",
                                textAlign: "center"
                              }}
                            >
                              {(() => {
                                const language = i18n.language;

                                const toMarathiNumbers = (num) => {
                                  const marathiDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
                                  return num
                                    .toString()
                                    .split("")
                                    .map((digit) => marathiDigits[parseInt(digit, 10)])
                                    .join("");
                                };

                                const number = index + 1;
                                return language === "mr" ? toMarathiNumbers(number) : number;
                              })()}
                            </td>
                            <td
                              width="45%"
                              style={{
                                paddingLeft: "10px",
                                paddingRight: "10px",
                                color: "#000000",
                                textAlign: "center"
                              }}
                            >
                              {item.heading1}
                            </td>
                            <td
                              width="45%"
                              style={{
                                paddingLeft: "10px",
                                paddingRight: "10px",
                                color: "#000000",
                                textAlign: "center"
                              }}
                            >
                              {item.heading2}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" style={{ textAlign: "center" }}>
                            {t("administrative.noData")}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="row mt-5">
                <div className="col-12 col-xl-6 col-lg-6 col-md-12 col-sm-12">
                  <div className="system-style-div text-start">
                    <p className="mb-0">
                      <span>{t("administrative.thead2")}</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="circular-wrapper">
                  <table className="table table-bordered table-responsive shadow mt-4">
                    <thead className="bg-orange text-white">
                      <tr>
                        <th className="table-heading-styling" style={{ textAlign: "center" }}>{t("administrative.srNo")}</th>
                        {tableData2.map((item, index) => (
                          <th key={index} className="table-heading-styling text-center" style={{textWrap: "pretty"}}>{item.heading}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {structureData2.length > 0 ? (
                        structureData2.map((item, index) => (
                          <tr key={index}>
                            <td
                              className="font-large"
                              width="8%"
                              style={{
                                paddingLeft: "10px",
                                paddingRight: "10px",
                                color: "#292D32",
                                textAlign: "center"
                              }}
                            >
                              {(() => {
                                const language = i18n.language;

                                const toMarathiNumbers = (num) => {
                                  const marathiDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
                                  return num
                                    .toString()
                                    .split("")
                                    .map((digit) => marathiDigits[parseInt(digit, 10)])
                                    .join("");
                                };

                                const number = index + 1;
                                return language === "mr" ? toMarathiNumbers(number) : number;
                              })()}
                            </td>
                            <td
                              style={{
                                paddingLeft: "10px",
                                paddingRight: "10px",
                                color: "#000000",
                                textAlign: "center"
                              }}
                            >
                              {item.heading1}
                            </td>
                            <td
                              style={{
                                paddingLeft: "10px",
                                paddingRight: "10px",
                                color: "#000000",
                                textAlign: "center"
                              }}
                            >
                              {item.heading2}
                            </td>
                            <td
                              style={{
                                paddingLeft: "10px",
                                paddingRight: "10px",
                                color: "#000000",
                                textAlign: "center"
                              }}
                            >
                              {item.heading3}
                            </td>
                            <td
                              style={{
                                paddingLeft: "10px",
                                paddingRight: "10px",
                                color: "#000000",
                                textAlign: "center"
                              }}
                            >
                              {item.heading4}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" style={{ textAlign: "center" }}>
                            {t("administrative.noData")}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="row mt-5">
                <div className="col-12 col-xl-6 col-lg-6 col-md-12 col-sm-12">
                  <div className="system-style-div text-start">
                    <p className="mb-0">
                      <span>{t("administrative.thead3")}</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="circular-wrapper">
                  <table className="table table-bordered table-responsive shadow mt-4">
                    <thead className="bg-orange text-white">
                      <tr>
                        <th className="table-heading-styling" style={{ textAlign: "center", textWrap: 'pretty' }}>{t("administrative.srNo")}</th>
                        {tableData3.map((item, index) => (
                          <th key={index} className="table-heading-styling text-center" style={{textWrap: "pretty"}}>{item.heading}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {structureData3.length > 0 ? (
                        structureData3.map((item, index) => (
                          <tr key={index}>
                            <td
                              className="font-large"
                              style={{
                                paddingLeft: "5px",
                                paddingRight: "5px",
                                color: "#292D32",
                                textAlign: "center"
                              }}
                            >
                              {(() => {
                                const language = i18n.language;

                                const toMarathiNumbers = (num) => {
                                  const marathiDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
                                  return num
                                    .toString()
                                    .split("")
                                    .map((digit) => marathiDigits[parseInt(digit, 10)])
                                    .join("");
                                };

                                const number = index + 1;
                                return language === "mr" ? toMarathiNumbers(number) : number;
                              })()}
                            </td>
                            <td
                              style={{
                                paddingLeft: "5px",
                                paddingRight: "5px",
                                color: "#000000",
                                textAlign: "center",
                              }}
                            >
                              {item.heading1}
                            </td>
                            <td
                              style={{
                                paddingLeft: "5px",
                                paddingRight: "5px",
                                color: "#000000",
                                textAlign: "center",
                              }}
                            >
                              {item.heading2}
                            </td>
                            <td
                              style={{
                                paddingLeft: "5px",
                                paddingRight: "5px",
                                color: "#000000",
                                textAlign: "center",
                              }}
                            >
                              {item.heading3}
                            </td>
                            <td
                              style={{
                                paddingLeft: "5px",
                                paddingRight: "5px",
                                color: "#000000",
                                textAlign: "center",
                              }}
                            >
                              {item.heading4}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" style={{ textAlign: "center" }}>
                            {t("administrative.noData")}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="row mt-5">
                <div className="col-12 col-xl-6 col-lg-6 col-md-12 col-sm-12">
                  <div className="system-style-div text-start">
                    <p className="mb-0">
                      <span>{t("administrative.thead4")}</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="circular-wrapper">
                  <table className="table table-bordered table-responsive shadow mt-4">
                    <thead className="bg-orange text-white">
                      <tr>
                        {tableData4.map((item, index) => (
                          <th key={index} className="table-heading-styling text-center" style={{textWrap: "pretty"}}>{item.heading}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {structureData4.length > 0 ? (
                        structureData4.map((item, index) => (
                          <tr key={index}>
                            <td
                              width="50%"
                              style={{
                                paddingLeft: "10px",
                                paddingRight: "10px",
                                color: "#000000",
                                textAlign: "center"
                              }}
                            >
                              {item.ward}
                            </td>
                            <td
                              width="50%"
                              style={{
                                paddingLeft: "10px",
                                paddingRight: "10px",
                                color: "#000000",
                                textAlign: "center"
                              }}
                            >
                              {item.officer}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" style={{ textAlign: "center" }}>
                            {t("administrative.noData")}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdministrativeStructure;
