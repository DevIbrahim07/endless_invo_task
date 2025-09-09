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

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: "status-badge-pending",
      approved: "status-badge-approved",
      rejected: "status-badge-rejected",
      new: "status-badge-new",
    };

    return (
      <span
        className={`status-badge ${statusClasses[status] || statusClasses.new}`}
      >
        {status.toUpperCase()}
      </span>
    );
  };

  const getResponseAnswer = (responses, questionText) => {
    const response = responses?.find((r) =>
      r.question?.toLowerCase().includes(questionText.toLowerCase())
    );
    return response?.answer || "N/A";
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div>Loading users...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-left">
          <h1 className="admin-title">Admin Dashboard</h1>
          <p className="admin-subtitle">
            Manage user registrations and approvals
          </p>
        </div>
        <div className="admin-header-right">
          <button
            className="btn-secondary-outline"
            onClick={() => (window.location.href = "/home")}
          >
            Back to Home
          </button>
          <button className="btn-danger" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-number">{users.length}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {users.filter((u) => u.status === "pending").length}
          </div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {users.filter((u) => u.status === "approved").length}
          </div>
          <div className="stat-label">Approved</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {users.filter((u) => u.status === "rejected").length}
          </div>
          <div className="stat-label">Rejected</div>
        </div>
      </div>

      {/* User Management Table */}
      <div className="table-container">
        <div className="table-header">
          <h2>User Management</h2>
        </div>

        {users.length === 0 ? (
          <div className="empty-state">
            <p>No users found.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Created Date</th>
                  <th>Status</th>
                  <th>Programming Language</th>
                  <th>Experience</th>
                  <th>Development Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="user-email">
                        <div className="email-primary">{user.email}</div>
                      </div>
                    </td>
                    <td>
                      <span className="date-text">
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </td>
                    <td>{getStatusBadge(user.status)}</td>
                    <td>
                      <span className="response-text">
                        {getResponseAnswer(
                          user.responses,
                          "programming language"
                        )}
                      </span>
                    </td>
                    <td>
                      <span className="response-text">
                        {getResponseAnswer(user.responses, "experience")}
                      </span>
                    </td>
                    <td>
                      <span className="response-text">
                        {getResponseAnswer(user.responses, "development")}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons-table">
                        {user.status === "pending" ? (
                          <>
                            <button
                              className="btn-approve-sm"
                              onClick={() => handleApprove(user._id)}
                              title="Approve"
                            >
                              ✓
                            </button>
                            <button
                              className="btn-reject-sm"
                              onClick={() => handleReject(user._id)}
                              title="Reject"
                            >
                              ✕
                            </button>
                          </>
                        ) : (
                          <div className="action-disabled">
                            <span className="action-text">
                              {user.status === "approved"
                                ? "Approved"
                                : "Rejected"}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
