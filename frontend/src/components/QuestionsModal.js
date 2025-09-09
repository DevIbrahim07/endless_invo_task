import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const QuestionsModal = ({ isOpen, onClose }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const { submitResponses } = useAuth();

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
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSave = async () => {
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

  const isCurrentQuestionAnswered = () => {
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
          <div className="question-container">
            <h3>Loading questions...</h3>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="question-container">
            <h3>No questions available</h3>
            <button className="btn" onClick={onClose}>
              Close
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
        <div className="question-container">
          <h3>
            Question {currentQuestionIndex + 1} of {questions.length}
          </h3>
          <p
            style={{
              marginBottom: "20px",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            {currentQuestion.question}
          </p>

          <ul className="options">
            {currentQuestion.options.map((option, index) => (
              <li key={index}>
                <input
                  type="radio"
                  id={`option-${index}`}
                  name={`question-${currentQuestion._id}`}
                  value={option}
                  checked={responses[currentQuestion._id] === option}
                  onChange={() =>
                    handleOptionSelect(currentQuestion._id, option)
                  }
                />
                <label htmlFor={`option-${index}`}>{option}</label>
              </li>
            ))}
          </ul>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "30px",
            }}
          >
            <button
              className="btn"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              style={{ width: "auto", padding: "10px 20px" }}
            >
              Previous
            </button>

            {currentQuestionIndex < questions.length - 1 ? (
              <button
                className="btn"
                onClick={handleNext}
                disabled={!isCurrentQuestionAnswered()}
                style={{ width: "auto", padding: "10px 20px" }}
              >
                Next
              </button>
            ) : (
              <button
                className="btn"
                onClick={handleSave}
                disabled={!areAllQuestionsAnswered()}
                style={{
                  width: "auto",
                  padding: "10px 20px",
                  backgroundColor: "#28a745",
                }}
              >
                Save
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionsModal;
