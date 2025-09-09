import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import QuestionsModal from "../components/QuestionsModal";

const Home = () => {
  const { user, logout } = useAuth();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user && user.status === "new") {
      setShowModal(true);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  // Pending Review Status Page
  if (user?.status === "pending") {
    return (
      <div className="pending-review-container">
        <div className="pending-review-content">
          <button className="pending-close" onClick={handleLogout}>
            ×
          </button>

          <div className="pending-icon"></div>

          <h1 className="pending-title">
            Please Wait Your Profile Is Under Review
          </h1>

          <p className="pending-description">
            Our team is carefully reviewing your information. You'll be notified
            once the process is complete or any extra information is needed.
          </p>
        </div>
      </div>
    );
  }

  // Rejected Status Page
  if (user?.status === "rejected") {
    return (
      <div className="pending-review-container">
        <div className="pending-review-content">
          <button className="pending-close" onClick={handleLogout}>
            ×
          </button>

          <div className="pending-icon" style={{ background: "#fee2e2" }}>
            <span style={{ fontSize: "48px" }}>❌</span>
          </div>

          <h1 className="pending-title">Account Rejected</h1>

          <p className="pending-description">
            Unfortunately, your account has been rejected by an administrator.
            Please contact support for more information.
          </p>
        </div>
      </div>
    );
  }

  // Simple Home Page
  return (
    <div className="simple-home">
      {/* Simple Header */}
      <div className="simple-header">
        <h1>Welcome!</h1>
        <div className="header-buttons">
          <span>Hello, {user?.email}</span>
          {user?.role === "admin" && (
            <a href="/admin" className="admin-button">
              Admin Dashboard
            </a>
          )}
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="simple-content">
        <div className="welcome-box">
          <h2>Dashboard</h2>
          {user?.status === "approved" && (
            <p>Your account is approved! You can use the website now.</p>
          )}
          {user?.status === "new" && (
            <p>Please complete your questions to continue.</p>
          )}
          {user?.status === "pending" && (
            <p>Your account is under review. Please wait for admin approval.</p>
          )}
          {user?.status === "rejected" && (
            <p>Your account has been rejected. Contact support for help.</p>
          )}
        </div>

        <div className="info-box">
          <h3>Your Information</h3>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
          <p>
            <strong>Status:</strong>
            {user?.status === "approved" && (
              <span className="green">Approved</span>
            )}
            {user?.status === "pending" && (
              <span className="yellow">Pending</span>
            )}
            {user?.status === "rejected" && (
              <span className="red">Rejected</span>
            )}
            {user?.status === "new" && <span className="blue">New</span>}
          </p>
        </div>

        {user?.responses && user.responses.length > 0 && (
          <div className="answers-box">
            <h3>Your Answers</h3>
            {user.responses.map((response, index) => (
              <div key={index} className="answer-item">
                <p>
                  <strong>Q:</strong> {response.question}
                </p>
                <p>
                  <strong>A:</strong> {response.answer}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <QuestionsModal isOpen={showModal} onClose={handleModalClose} />
    </div>
  );
};

export default Home;
