import React from "react";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import HistoryImage from "./HistoryImage";
import HistoryContent from "./HistoryContent";


const UmcHistory = () => {

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="#">About UMC</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                History
              </li>
            </ol>
          </nav>
          <HistoryImage />
          <HistoryContent />
        </div>
      </div>
    </>
  );
};

export default UmcHistory;
