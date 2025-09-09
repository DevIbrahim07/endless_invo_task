import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const QuestionsModal = ({ isOpen, onClose }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const { submitResponses } = useAuth();

  const steps = [
    { id: 1, label: "Question 1" },
    { id: 2, label: "Question 2" },
    { id: 3, label: "Question 3" },
    { id: 4, label: "Review" },
    { id: 5, label: "Complete" },
  ];

  useEffect(() => {
    if (isOpen) {
      fetchQuestions();
    }
  }, [isOpen]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get("/api/questions");
      setQuestions(response.data.questions);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setLoading(false);
    }
  };

  const handleOptionSelect = (questionId, option) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Move to review step
      setCurrentQuestionIndex(questions.length);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    const formattedResponses = Object.entries(responses).map(
      ([questionId, answer]) => ({
        questionId,
        answer,
      })
    );

    const result = await submitResponses(formattedResponses);
    if (result.success) {
      onClose();
    } else {
      alert(result.error);
    }
  };

  const getCurrentStepStatus = (stepIndex) => {
    const currentStep = currentQuestionIndex + 1;
    if (stepIndex < currentStep) return "completed";
    if (stepIndex === currentStep) return "active";
    return "inactive";
  };

  const isCurrentQuestionAnswered = () => {
    if (currentQuestionIndex >= questions.length) return true;
    const currentQuestion = questions[currentQuestionIndex];
    return currentQuestion && responses[currentQuestion._id];
  };

  const areAllQuestionsAnswered = () => {
    return questions.every((question) => responses[question._id]);
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
          <div className="modal-header">
            <h2 className="modal-title">Loading...</h2>
            <p className="modal-subtitle">
              Please wait while we load the questions.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
          <div className="modal-header">
            <h2 className="modal-title">No Questions Available</h2>
            <p className="modal-subtitle">
              There are no questions to display at this time.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Review step
  if (currentQuestionIndex >= questions.length) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="modal-close" onClick={onClose}>
            ×
          </button>

          <div className="modal-header">
            <h2 className="modal-title">Complete your onboarding</h2>
            <p className="modal-subtitle">
              Review your answers before submitting.
            </p>
          </div>

          <div className="progress-container">
            <div className="progress-steps">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="progress-step">
                    <div
                      className={`step-circle ${getCurrentStepStatus(
                        index + 1
                      )}`}
                    >
                      {getCurrentStepStatus(index + 1) === "completed"
                        ? "✓"
                        : step.id}
                    </div>
                    <div
                      className={`step-label ${getCurrentStepStatus(
                        index + 1
                      )}`}
                    >
                      {step.label}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`step-connector ${
                        getCurrentStepStatus(index + 1) === "completed"
                          ? "completed"
                          : ""
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="question-container">
            <h3 className="question-title">Review Your Answers</h3>

            <div style={{ textAlign: "left", marginBottom: "24px" }}>
              {questions.map((question, index) => (
                <div key={question._id} className="form-group">
                  <label className="form-label">
                    {index + 1}. {question.question}
                  </label>
                  <div className="radio-option selected">
                    <span>{responses[question._id] || "Not answered"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="modal-buttons">
            <button className="btn btn-secondary" onClick={handlePrevious}>
              Back
            </button>
            <button
              className="btn btn-success"
              onClick={handleSubmit}
              disabled={!areAllQuestionsAnswered()}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <div className="modal-header">
          <h2 className="modal-title">Complete your onboarding</h2>
          <p className="modal-subtitle">
            Provide your complete detail to proceed.
          </p>
        </div>

        <div className="progress-container">
          <div className="progress-steps">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="progress-step">
                  <div
                    className={`step-circle ${getCurrentStepStatus(index + 1)}`}
                  >
                    {getCurrentStepStatus(index + 1) === "completed"
                      ? "✓"
                      : step.id}
                  </div>
                  <div
                    className={`step-label ${getCurrentStepStatus(index + 1)}`}
                  >
                    {step.label}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`step-connector ${
                      getCurrentStepStatus(index + 1) === "completed"
                        ? "completed"
                        : ""
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="question-container">
          <div className="form-group">
            <label className="form-label">{currentQuestion.question}</label>
            <div className="radio-group">
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className={`radio-option ${
                    responses[currentQuestion._id] === option ? "selected" : ""
                  }`}
                  onClick={() =>
                    handleOptionSelect(currentQuestion._id, option)
                  }
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion._id}`}
                    value={option}
                    checked={responses[currentQuestion._id] === option}
                    onChange={() =>
                      handleOptionSelect(currentQuestion._id, option)
                    }
                  />
                  <label>{option}</label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-buttons">
          <button
            className="btn btn-secondary"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            Back
          </button>
          <button
            className="btn btn-primary"
            onClick={handleNext}
            disabled={!isCurrentQuestionAnswered()}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionsModal;
