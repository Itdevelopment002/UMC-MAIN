import React from "react";
//eslint-disable-next-line
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import QuickLinks from "./QuickLinks";
import Help from "./Help";
import OnlineServices from "./OnlineServices";
import ContactInfo from "./ContactInfo";

const Footer = () => {

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="#">Home</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Footer
              </li>
            </ol>
          </nav>

          <ContactInfo />
          <QuickLinks />
          <Help />
          <OnlineServices />
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Footer;
