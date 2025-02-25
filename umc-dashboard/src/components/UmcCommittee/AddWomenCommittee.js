// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import api from "../api";
// import { useNavigate } from "react-router-dom";

// const AddWomenCommittee = () => {
//   const [heading, setHeading] = useState("");
//   const navigate = useNavigate();
//   const [error, setError] = useState("")

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "heading") setHeading(value);
//     setError("");
//   };


//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!heading.trim()) {
//       setError("Member Name is required.");
//       return;
//     }

//     try {
//       await api.post("/women-committee", { heading });
//       navigate("/umc-committee");
//     } catch (error) {
//       console.error("Error submitting women committee data:", error);
//     }
//   };
//   return (
//     <div>
//       <div className="page-wrapper">
//         <div className="content">
//           <ol className="breadcrumb">
//             <li className="breadcrumb-item">
//               <Link to="#">Corporation</Link>
//             </li>
//             <li className="breadcrumb-item">
//               <Link to="/umc-committee">UMC Committee</Link>
//             </li>
//             <li className="breadcrumb-item active" aria-current="page">
//               Add Women and child Welfare Committee
//             </li>
//           </ol>
//           <div className="row">
//             <div className="col-lg-12">
//               <div className="card-box">
//                 <div className="card-block">
//                   <div className="row">
//                     <div className="col-12">
//                       <h4 className="page-title">Add Women and child Welfare Committee</h4>
//                     </div>
//                   </div>
//                   <form onSubmit={handleSubmit}>
//                     <div className="form-group row">
//                       <label className="col-form-label col-md-2">
//                         Member Name <span className="text-danger">*</span>
//                       </label>
//                       <div className="col-md-4">
//                         <input
//                           type="text"
//                           className={`form-control form-control-md ${error ? "is-invalid" : ""
//                             }`}
//                           name="heading"
//                           value={heading}
//                           onChange={handleChange}
//                           placeholder="Enter Member Name"
//                         />
//                         {error && <div className="invalid-feedback">{error}</div>}
//                       </div>
//                     </div>
//                     <input
//                       type="submit"
//                       className="btn btn-primary btn-sm"
//                       value="Submit"
//                     />
//                   </form>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddWomenCommittee;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useNavigate } from "react-router-dom";

const AddWomenCommittee = () => {
  const [heading, setHeading] = useState("");
  const [language, setLanguage] = useState("");
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const validationErrors = {};
    if (!language) {
      validationErrors.language = "Language selection is required";
    }

    if (!heading) {
      validationErrors.heading = "Member Name is required.";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      //eslint-disable-next-line
      const response = await api.post("/women-committee", {
        heading: heading,
        language_code: language,
      });
      setHeading("");
      setLanguage("");
      navigate("/umc-committee");
    } catch (error) {
      console.error("Error submitting women committee data:", error);
    }
  };
  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="#">Corporation</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/umc-committee">UMC Committee</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
            Add Women and child Welfare Committee
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-12">
                      <h4 className="page-title">Add Women and child Welfare Committee</h4>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Select Language <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <select
                          className={`form-control form-control-md ${errors.language ? "is-invalid" : ""}`}
                          value={language}
                          onChange={(e) => {
                            setLanguage(e.target.value);
                            if (errors.language) {
                              setErrors({ ...errors, language: "" });
                            }
                          }}
                        >
                          <option value="">Select Language</option>
                          <option value="en">English</option>
                          <option value="mr">Marathi</option>
                        </select>
                        {errors.language && <div className="invalid-feedback">{errors.language}</div>}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-md-2">
                        Member Name <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control form-control-md ${errors.heading ? "is-invalid" : ""}`}
                          value={heading}
                          onChange={(e) => {
                            setHeading(e.target.value);
                            if (errors.heading) {
                              setErrors({ ...errors, heading: "" });
                            }
                          }}
                          placeholder="Enter Member Name"
                        />
                        {errors.heading && <div className="invalid-feedback">{errors.heading}</div>}
                      </div>
                    </div>
                    <input
                      type="submit"
                      className="btn btn-primary btn-sm"
                      value="Submit"
                    />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddWomenCommittee;

