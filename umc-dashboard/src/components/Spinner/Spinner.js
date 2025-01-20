import React from "react";
import "./Spinner.css"; 
import { HashLoader } from "react-spinners";

const Spinner = () => {
  return (
    <div className="spinner-container">
      <HashLoader color="#007bff" size={50} />
      <p className="spinner-text">KBMC</p>
    </div>
  );
};

export default Spinner;
