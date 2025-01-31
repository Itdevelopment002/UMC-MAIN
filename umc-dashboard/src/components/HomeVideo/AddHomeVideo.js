import React, { useState } from "react";
import api from "../api";
//eslint-disable-next-line
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const AddHomeVideo = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [errors, setErrors] = useState({
    videoUrl: "",
  });
  const navigate = useNavigate();


  const validateForm = () => {
    const newErrors = {};
    if (!videoUrl) {
      newErrors.videoUrl = "Video URL is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const videoData = {
      videoUrl,
    };

    try {
      await api.post("/home-video", videoData);
      toast.success("Video added successfully!");
      setErrors({ videoUrl: "" });
      setVideoUrl("");

      navigate("/home-video");
    } catch (error) {
      toast.error("Failed to add video. Please try again.");
    }
  };
  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="#">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/home-video">Home Video</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add Home Video
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-12">
                      <h4 className="page-title">Add Home Video</h4>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group row">
                      <label className="col-form-label col-lg-2">
                        Video URL <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <div className="input-group">
                          <input
                            type="text"
                            className={`form-control col-md-12 col-xs-12 userfile ${
                              errors.videoUrl ? "is-invalid" : ""
                            }`}
                            placeholder=""
                            value={videoUrl}
                            onChange={(e) => {
                              setVideoUrl(e.target.value);
                              if (errors.videoUrl) {
                                setErrors({ ...errors, videoUrl: "" });
                              }
                            }}
                          />
                        </div>
                        {errors.videoUrl && (
                          <small className="text-danger">
                            {errors.videoUrl}
                          </small>
                        )}
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
    </>
  );
};

export default AddHomeVideo;
