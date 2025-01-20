import React, { useState } from "react";
import api from "../api";
//eslint-disable-next-line
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import { Link } from "react-router-dom";

const AddHomeVideos = () => {
  const [description, setDescription] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [errors, setErrors] = useState({
    description: "",
    publishDate: "",
    videoUrl: "",
  });
  const navigate = useNavigate();

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!description) {
      newErrors.description = "Home Video Description is required.";
    }
    if (!publishDate) {
      newErrors.publishDate = "Publish Date is required.";
    }
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

    const formattedDate = formatDate(publishDate);

    const videoData = {
      description,
      publishDate: formattedDate,
      videoUrl,
    };

    try {
      await api.post("/home-videos", videoData);
      toast.success("Video added successfully!");
      setDescription("");
      setErrors({ description: "", publishDate: "", videoUrl: "" });
      setPublishDate("");
      setVideoUrl("");

      navigate("/home-videos");
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
              <Link to="/home">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/home-videos">Home Video</Link>
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
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Add Home Video</h4>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group row">
                      <label className="col-form-label col-md-3">
                        Home Video Description{" "}
                        <span className="text-danger">*</span>
                      </label>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className={`form-control ${
                            errors.description ? "is-invalid" : ""
                          }`}
                          placeholder=""
                          value={description}
                          onChange={(e) => {
                            setDescription(e.target.value);
                            if (errors.description) {
                              setErrors({ ...errors, description: "" });
                            }
                          }}
                        />
                        {errors.description && (
                          <small className="text-danger">
                            {errors.description}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-md-3">
                        Publish Date <span className="text-danger">*</span>
                      </label>
                      <div className="cal-icon col-md-4">
                        <Flatpickr
                          id="startDatePicker"
                          className={`form-control ${
                            errors.publishDate ? "is-invalid" : ""
                          }`}
                          placeholder="Select Publish Date"
                          value={publishDate}
                          onChange={(date) => {
                            setPublishDate(date[0]);
                            if (errors.publishDate) {
                              setErrors({ ...errors, publishDate: "" });
                            }
                          }}
                          options={{
                            dateFormat: "d-m-Y",
                            monthSelectorType: "dropdown",
                            prevArrow:
                              '<svg><path d="M10 5L5 10L10 15"></path></svg>',
                            nextArrow:
                              '<svg><path d="M5 5L10 10L5 15"></path></svg>',
                          }}
                        />
                        {errors.publishDate && (
                          <small className="text-danger">
                            {errors.publishDate}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-form-label col-lg-3">
                        Upload URL <span className="text-danger">*</span>
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
                      className="btn btn-primary"
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

export default AddHomeVideos;
