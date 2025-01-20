import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import "./StickyFeedback.css";

function StickyFeedback() {
    const [isOpen, setIsOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [like, setLike] = useState("");
    const [comments, setComments] = useState("");
    const [errors, setErrors] = useState({});
    const feedbackRef = useRef(null);

    const toggleFeedback = () => {
        setIsOpen(!isOpen);
    };

    const handleStarClick = (index) => {
        setRating(index + 1);
        clearError("rating");
    };

    const handleLikeChange = (value) => {
        setLike(value);
        clearError("like");
    };

    const handleCommentsChange = (value) => {
        setComments(value);
        clearError("comments");
    };

    const clearError = (field) => {
        setErrors((prevErrors) => {
            const updatedErrors = { ...prevErrors };
            delete updatedErrors[field];
            return updatedErrors;
        });
    };

    const handleClickOutside = (event) => {
        if (feedbackRef.current && !feedbackRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const validateFields = () => {
        const validationErrors = {};
        if (rating === 0) validationErrors.rating = "Rating is required.";
        if (!like) validationErrors.like = "Please select an option.";
        if (!comments.trim()) validationErrors.comments = "Comments are required.";
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateFields()) {
            Swal.fire({
                title: "Thank You!",
                text: "Your feedback has been successfully submitted.",
                icon: "success",
                confirmButtonText: "OK",
            });
            setRating(0);
            setLike("");
            setComments("");
            setErrors({});
            setIsOpen(false);
        }
    };

    return (
        <div className="App">
            <div ref={feedbackRef} className={`feedback-container ${isOpen ? "open" : ""}`}>
                <div className="feedback-tab" onClick={toggleFeedback}>
                    FEEDBACK
                </div>
                <div className="feedback-panel">
                    <h3>Feedback</h3>
                    <p>Rate <span className="required">*</span></p>
                    <div className="feedback-stars">
                        {Array(5)
                            .fill()
                            .map((_, index) => (
                                <span
                                    key={index}
                                    className={`star ${index < rating ? "selected" : ""}`}
                                    onClick={() => handleStarClick(index)}
                                >
                                    &#9733;
                                </span>
                            ))}
                    </div>
                    {errors.rating && <p className="error-message">{errors.rating}</p>}

                    <p>Did you like the website <span className="required">*</span></p>
                    <div className="radio-buttons">
                        <label>
                            <input
                                type="radio"
                                name="like"
                                value="yes"
                                checked={like === "yes"}
                                onChange={(e) => handleLikeChange(e.target.value)}
                            /> Yes
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="like"
                                value="no"
                                checked={like === "no"}
                                onChange={(e) => handleLikeChange(e.target.value)}
                            /> No
                        </label>
                    </div>
                    {errors.like && <p className="error-message">{errors.like}</p>}

                    <p>Additional Comments <span className="required">*</span></p>
                    <textarea
                        rows="3"
                        placeholder="Your comments"
                        value={comments}
                        onChange={(e) => handleCommentsChange(e.target.value)}
                    ></textarea>
                    {errors.comments && <p className="error-message">{errors.comments}</p>}

                    <button
                        type="button"
                        className="submit-button"
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}

export default StickyFeedback;
