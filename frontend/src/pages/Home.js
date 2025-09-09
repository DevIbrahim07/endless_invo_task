import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import QuestionsModal from "../components/QuestionsModal";

const Home = () => {
  const { user, logout } = useAuth();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Show modal if user hasn't answered questions yet
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

  if (user?.status === "pending") {
    return (
      <div className="pending-container">
        <h2>Account Pending Approval</h2>
        <p>Your account is currently under review by an administrator.</p>
        <p>
          You will be able to access the website once your account is approved.
        </p>
        <button className="btn logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    );
  }

  if (user?.status === "rejected") {
    return (
      <div className="pending-container">
        <h2>Account Rejected</h2>
        <p>
          Unfortunately, your account has been rejected by an administrator.
        </p>
        <p>Please contact support for more information.</p>
        <button className="btn logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="header">
        <h1>Welcome to Simple Web App</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <span>Hello, {user?.email}</span>
          {user?.role === "admin" && (
            <a
              href="/admin"
              style={{
                padding: "8px 16px",
                backgroundColor: "#6c757d",
                color: "white",
                textDecoration: "none",
                borderRadius: "5px",
              }}
            >
              Admin Dashboard
            </a>
          )}
          <button className="btn logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div>
        <h2>Dashboard</h2>
        <p>
          Congratulations! Your account has been approved and you now have full
          access to the website.
        </p>

        <div style={{ marginTop: "30px" }}>
          <h3>Account Status</h3>
          <div className="status-badge status-approved">Approved</div>
        </div>

        {user?.responses && user.responses.length > 0 && (
          <div style={{ marginTop: "30px" }}>
            <h3>Your Responses</h3>
            {user.responses.map((response, index) => (
              <div key={index} className="response-item">
                <strong>Q:</strong> {response.question}
                <br />
                <strong>A:</strong> {response.answer}
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
