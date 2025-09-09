import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/admin/users");
      setUsers(response.data.users);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await axios.patch(`/api/admin/users/${userId}/approve`);
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, status: "approved" } : user
        )
      );
    } catch (error) {
      console.error("Error approving user:", error);
      alert("Failed to approve user");
    }
  };

  const handleReject = async (userId) => {
    try {
      await axios.patch(`/api/admin/users/${userId}/reject`);
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, status: "rejected" } : user
        )
      );
    } catch (error) {
      console.error("Error rejecting user:", error);
      alert("Failed to reject user");
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "status-badge status-pending";
      case "approved":
        return "status-badge status-approved";
      case "rejected":
        return "status-badge status-rejected";
      default:
        return "status-badge status-pending";
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div>Loading users...</div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="header">
        <h1>Admin Dashboard</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <a
            href="/home"
            style={{
              padding: "8px 16px",
              backgroundColor: "#6c757d",
              color: "white",
              textDecoration: "none",
              borderRadius: "5px",
            }}
          >
            Back to Home
          </a>
          <button className="btn logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      <div>
        <h2>User Management</h2>
        <p>Total Users: {users.length}</p>

        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <div>
            {users.map((user) => (
              <div key={user._id} className="user-card">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h4>{user.email}</h4>
                  <span className={getStatusBadgeClass(user.status)}>
                    {user.status.toUpperCase()}
                  </span>
                </div>

                <p>
                  <strong>Created:</strong>{" "}
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>

                {user.responses && user.responses.length > 0 && (
                  <div className="user-responses">
                    <h5>Responses:</h5>
                    {user.responses.map((response, index) => (
                      <div key={index} className="response-item">
                        <strong>Q:</strong> {response.question}
                        <br />
                        <strong>A:</strong> {response.answer}
                      </div>
                    ))}
                  </div>
                )}

                {user.status === "pending" && (
                  <div className="action-buttons">
                    <button
                      className="btn approve-btn"
                      onClick={() => handleApprove(user._id)}
                    >
                      Approve
                    </button>
                    <button
                      className="btn reject-btn"
                      onClick={() => handleReject(user._id)}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
