import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import DataTable1 from "./DataTable1";
import DataTable2 from "./DataTable2";
import DataTable3 from "./DataTable3";
import DataTable4 from "./DataTable4";

const Location = () => {
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
                Location
              </li>
            </ol>
          </nav>
          <DataTable1 />
          <DataTable2 />
          <DataTable3 />
          <DataTable4 />
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Location;
