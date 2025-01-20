import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddPondsAndTalaoImages = () => {
  const [formData, setFormData] = useState({
    pondImage: null,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      pondImage: files[0],
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.pondImage) {
      setError("Please select an image to upload.");
      return;
    }

    const data = new FormData();
    data.append("pondImage", formData.pondImage);

    setIsUploading(true);
    try {
      const response = await api.post("/pond-images", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast.success("Image uploaded successfully!");
        navigate("/ponds-talao");
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Image upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="page-wrapper">
        <div className="content">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="#">City Profile</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/ponds-talao">Ponds and Talao</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add Ponds and Talao Image
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Add Ponds and Talao Image</h4>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group row">
                      <label className="col-form-label col-lg-2">
                        Upload Pond Image
                      </label>
                      <div className="col-md-4">
                        <input
                          type="file"
                          id="pondImage"
                          name="pondImage"
                          className={`form-control ${
                            error ? "is-invalid" : ""
                          }`}
                          onChange={handleChange}
                          accept="image/*"
                        />
                        {error && (
                          <div className="text-danger mt-2">{error}</div>
                        )}
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary btn-sm"
                      disabled={isUploading}
                    >
                      {isUploading ? "Uploading..." : "Submit"}
                    </button>
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

export default AddPondsAndTalaoImages;
