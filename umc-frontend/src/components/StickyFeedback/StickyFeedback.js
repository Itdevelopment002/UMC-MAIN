import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import "./StickyFeedback.css";
import api from "../api";
import { useTranslation } from "react-i18next";

function StickyFeedback() {
    const [isOpen, setIsOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [opinion, setOpinion] = useState("");
    const [comments, setComments] = useState("");
    const [charCount, setCharCount] = useState(0);
    const [errors, setErrors] = useState({});
    const feedbackRef = useRef(null);
    const { t } = useTranslation();
    const MAX_CHARS = 200;

    const toggleFeedback = () => {
        setIsOpen(!isOpen);
    };

    const handleStarClick = (index) => {
        setRating(index + 1);
        clearError("rating");
    };

    const handleOpinionChange = (value) => {
        setOpinion(value);
        clearError("opinion");
    };

    const handleCommentsChange = (e) => {
        const inputValue = e.target.value;
        const filteredValue = inputValue.replace(/[^a-zA-Z0-9\s.,!?'"-]/g, '');
        const limitedValue = filteredValue.slice(0, MAX_CHARS);

        setComments(limitedValue);
        setCharCount(limitedValue.length);
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
        if (!opinion) validationErrors.opinion = "Please select an option.";
        if (!comments.trim()) validationErrors.comments = "Comments are required.";
        else if (comments.length < 10) validationErrors.comments = "Comments must be at least 10 characters.";
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const sendFeedbackToBackend = async (feedbackData) => {
        try {
            // eslint-disable-next-line
            const response = await api.post("/email", feedbackData);
            Swal.fire({
                title: "Thank You!",
                text: "Your feedback has been successfully submitted.",
                icon: "success",
                confirmButtonText: "OK",
            });
        } catch (error) {
            console.error("Error submitting feedback:", error);
            Swal.fire({
                title: "Error",
                text: "There was an error submitting your feedback. Please try again later.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

    const handleSubmit = () => {
        if (validateFields()) {
            const feedbackData = {
                rating: rating,
                opinion: opinion,
                comment: comments,
            };

            sendFeedbackToBackend(feedbackData);

            setRating(0);
            setOpinion("");
            setComments("");
            setCharCount(0);
            setErrors({});
            setIsOpen(false);
        }
    };

    return (
        <div className="App">
            <div ref={feedbackRef} className={`feedback-container ${isOpen ? "open" : ""}`}>
                <div className="feedback-tab" role="button" tabIndex="0" onClick={toggleFeedback}>
                    {t('feedback.title')}
                </div>
                <div className="feedback-panel">
                    <h1>{t('feedback.heading')}</h1>
                    <p>{t('feedback.rate')} <span className="required">*</span></p>
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

                    <p>{t('feedback.like')} <span className="required">*</span></p>
                    <div className="radio-buttons">
                        <label>
                            <input
                                type="radio"
                                name="opinion"
                                value="Yes"
                                checked={opinion === "Yes"}
                                onChange={(e) => handleOpinionChange(e.target.value)}
                            /> {t('feedback.yes')}
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="opinion"
                                value="No"
                                checked={opinion === "No"}
                                onChange={(e) => handleOpinionChange(e.target.value)}
                            /> {t('feedback.no')}
                        </label>
                    </div>
                    {errors.opinion && <p className="error-message">{errors.opinion}</p>}

                    <p>{t('feedback.comment')} <span className="required">*</span></p>
                    <div className="textarea-container">
                        <textarea
                            rows="3"
                            placeholder={t('feedback.comment_placeholder')}
                            value={comments}
                            onChange={handleCommentsChange}
                        ></textarea>
                        <span className={`char-counter-inside ${charCount >= MAX_CHARS ? 'error' :
                                charCount >= MAX_CHARS - 20 ? 'warning' : ''
                            }`}>
                            {charCount}/{MAX_CHARS}
                        </span>
                    </div>
                    {errors.comments && <p className="error-message">{errors.comments}</p>}

                    <button
                        type="button"
                        className="submit-button"
                        onClick={handleSubmit}
                    >
                        {t('feedback.submit')}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default StickyFeedback;