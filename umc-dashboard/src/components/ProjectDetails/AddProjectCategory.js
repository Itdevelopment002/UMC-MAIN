// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import api from "../api";
// import { useNavigate } from "react-router-dom";

// const AddProjectCategory = () => {
//   const [categoryName, setCategoryName] = useState("");
//   const navigate = useNavigate();
//   const [error, setError] = useState("")

//   const handleChange = (e) => {
//     setCategoryName(e.target.value);
//     setError("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!categoryName.trim()) {
//       setError("Project Heading is required.");
//       return;
//     }

//     try {
//       await api.post("/project-categories", { categoryName });
//       navigate("/project-details");
//     } catch (error) {
//       console.error("Error submitting project data:", error);
//     }
//   };
//   return (
//     <div>
//       <div className="page-wrapper">
//         <div className="content">
//           <ol className="breadcrumb">
//             <li className="breadcrumb-item">
//               <Link to="#">Upcoming Projects</Link>
//             </li>
//             <li className="breadcrumb-item">
//               <Link to="/project-details">Project Categories</Link>
//             </li>
//             <li className="breadcrumb-item active" aria-current="page">
//               Add Project Category
//             </li>
//           </ol>
//           <div className="row">
//             <div className="col-lg-12">
//               <div className="card-box">
//                 <div className="card-block">
//                   <div className="row">
//                     <div className="col-12">
//                       <h4 className="page-title">Add Category</h4>
//                     </div>
//                   </div>
//                   <form onSubmit={handleSubmit}>
//                     <div className="form-group row">
//                       <label className="col-form-label col-md-2">
//                         Project Heading <span className="text-danger">*</span>
//                       </label>
//                       <div className="col-md-4">
//                        <input
//                           type="text"
//                           className={`form-control form-control-md ${
//                             error ? "is-invalid" : ""
//                           }`}
//                           name="categoryName"
//                           value={categoryName}
//                           onChange={handleChange}
//                           placeholder="Enter Category Name"
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

// export default AddProjectCategory;
