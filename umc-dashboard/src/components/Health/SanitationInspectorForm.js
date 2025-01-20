import React, { useState, useEffect } from "react";

const SanitationInspectorForm = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    zone_no: "",
    names: "",
    mob_no: "",
    ward_no: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        zone_no: "",
        names: "",
        mob_no: "",
        ward_no: "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mob_no") {
      if (!/^\d*$/.test(value)) return;
    }

    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    const { zone_no, names, mob_no, ward_no } = formData;
    if (!zone_no) newErrors.zone_no = "Zone No. is required";
    if (!names) newErrors.names = "Inspector Name is required";
    if (!mob_no) {
      newErrors.mob_no = "Mobile No. is required";
    } else if (!/^\d+$/.test(mob_no)) {
      newErrors.mob_no = "Mobile No. must be numeric";
    } else if (mob_no.length !== 10) {
      newErrors.mob_no = "Mobile No. must be 10 digits long";
    }
    if (!ward_no) newErrors.ward_no = "Ward No. is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="zone_no" className="form-label">
          Zone No.
        </label>
        <input
          type="text"
          className={`form-control ${
            isSubmitted && errors.zone_no ? "is-invalid" : ""
          }`}
          name="zone_no"
          value={formData.zone_no}
          onChange={handleChange}
        />
        {isSubmitted && errors.zone_no && (
          <div className="invalid-feedback">{errors.zone_no}</div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="names" className="form-label">
          Inspector Name
        </label>
        <input
          type="text"
          className={`form-control ${
            isSubmitted && errors.names ? "is-invalid" : ""
          }`}
          name="names"
          value={formData.names}
          onChange={handleChange}
        />
        {isSubmitted && errors.names && (
          <div className="invalid-feedback">{errors.names}</div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="mob_no" className="form-label">
          Mobile No.
        </label>
        <input
          type="text"
          className={`form-control ${
            isSubmitted && errors.mob_no ? "is-invalid" : ""
          }`}
          name="mob_no"
          value={formData.mob_no}
          onChange={handleChange}
        />
        {isSubmitted && errors.mob_no && (
          <div className="invalid-feedback">{errors.mob_no}</div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="ward_no" className="form-label">
          Ward No.
        </label>
        <input
          type="text"
          className={`form-control ${
            isSubmitted && errors.ward_no ? "is-invalid" : ""
          }`}
          name="ward_no"
          value={formData.ward_no}
          onChange={handleChange}
        />
        {isSubmitted && errors.ward_no && (
          <div className="invalid-feedback">{errors.ward_no}</div>
        )}
      </div>

      <div className="modal-footer">
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </div>
    </form>
  );
};

export default SanitationInspectorForm;
