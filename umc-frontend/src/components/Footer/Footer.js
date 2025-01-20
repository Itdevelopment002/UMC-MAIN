import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import Logo from "../../assets/images/logo 1.png";
import Phone from "../../assets/images/Call.png";
import Email from "../../assets/images/Message.png";
import Location from "../../assets/images/Location.png";
import NCAP from '../../assets/pdfs/NCAP_Report-1.pdf';

const Footer = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  const openPDF = (pdfURL) => {
    window.open(pdfURL, '_blank');
  };
  return (
    <footer className="footer" id="footer">
      <div className="container-fluid">
        <div className="row ">
          <div className="col-lg-5 col-md-8 col-12 mb-4">
            <div className="footer-logo-section">
              <img src={Logo} alt="Ulhasnagar Logo" className="footer-logo" />
              <div>
                <h2 className="footer-title text-uppercase">Ulhasnagar</h2>
                <p className="footer-subtitle">Municipal Corporation</p>
              </div>
            </div>
            <ul className="contact-list">
              <li>
                <div className="d-flex align-items-start">
                  <img
                    src={Phone}
                    alt="Phone Icon"
                    className="icon-img"
                    width="20"
                    height="20"
                  />
                  <div className="contact-text">
                    <p className="contact-title">Phone</p>
                    <span className="contact-detail">(0251) 2720150</span>
                  </div>
                </div>
              </li>
              <li>
                <div className="d-flex align-items-start">
                  <img
                    src={Email}
                    alt="Email Icon"
                    className="icon-img"
                    width="20"
                    height="20"
                  />
                  <div className="contact-text">
                    <p className="contact-title">Email</p>
                    <span className="contact-detail">cfcumc@gmail.com</span>
                  </div>
                </div>
              </li>
              <li>
                <div className="d-flex align-items-start">
                  <img
                    src={Location}
                    alt="Location Icon"
                    className="icon-img"
                    width="18"
                    height="18"
                  />
                  <div className="contact-text">
                    <p className="contact-title">Address</p>
                    <span className="contact-detail">
                      Ulhasnagar Municipal Corporation, Near Chopda Court,{" "}
                      <br />
                      Ulhasnagar-3, Maharashtra, INDIA.
                    </span>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-4 col-sm-4 mb-4">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li>
                <Link to="https://www.umconlineservices.in/Payment/" target="_blank">Pay Property Tax</Link>
              </li>
              <li>
                <Link to="https://aaplesarkar.mahaonline.gov.in/en" target="_blank">Register Complaint</Link>
              </li>
              <li>
                <Link to="https://pmaymis.gov.in/" target="_blank">PMAY</Link>
              </li>
              <li>
                <Link to="https://swachhbharat.mygov.in/" target="_blank">Swachh Bharat</Link>
              </li>
              <li>
                <Link to="#" target="_blank"
                  onClick={(e) => {
                    e.preventDefault();
                    openPDF(NCAP);
                  }}
                >NCAP</Link>
              </li>
              <li>
                <Link to="https://nulm.gov.in/" target="_blank">DAY-NULM</Link>
              </li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-8 col-sm-4 mb-4 mx-auto">
            <h4 className="footer-heading">Help</h4>
            <ul className="footer-links">
              <li>
                <Link to="/customer-support">Customer Support</Link>
              </li>
              <li>
                <Link to="/terms-and-conditions">Terms & Conditions</Link>
              </li>
              <li>
                <Link to="/privacy-policy">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/contact-us">Contact Us</Link>
              </li>
              <li>
                <Link to="/hyperlink-policy">Hyperlink Policy</Link>
              </li>
              <li>
                <Link to="/accessibility-statement">Accessibility Statement</Link>
              </li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-4 col-sm-4 mb-4">
            <h4 className="footer-heading">Online Services</h4>
            <ul className="footer-links">
              <li>
                <Link to="/property-tax-payment">Property Tax</Link>
              </li>
              <li>
                <Link to="/birth-certificate">Birth Certificate</Link>
              </li>
              <li>
                <Link to="/death-certificate">Death Certificate</Link>
              </li>
              <li>
                <Link to="/e-tender">e-Tender</Link>
              </li>
              <li>
                <Link to="http://water.umcgov.in/ViewConsumerDetails.aspx" target="_blank">Water Tax</Link>
              </li>
            </ul>
          </div>

        </div>
        <hr className="footer-divider" />
        <div className="footer-bottom p-0">
          <span className="footer-sapn1">
            &copy; {new Date().getFullYear()} Ulhasnagar Municipal Corporation. All Rights Reserved.
          </span>
          <span className="fw-bold">Total Visitors: 18243</span>
          <span className="footer-sapn2">Design & Developed by Infoigy</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
