import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Users,
  Shield,
  UserCheck,
  UserX,
  Edit2,
  Trash2,
  Filter,
} from "lucide-react";
import API_URL from "../config";

const SuperUserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    role: "",
    status: "",
  });

  const [selectedUser, setSelectedUser] = useState(null);
  const [editData, setEditData] = useState({ username: "", email: "" });
  const [showEditModal, setShowEditModal] = useState(false);

  /* =========================
     Fetch All Users
  ========================= */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const [studentsRes, staffRes] = await Promise.all([
          fetch(`${API_URL}/get-students-with-housing`),
          fetch(`${API_URL}/get-all-employees`),
        ]);

        const students = await studentsRes.json();
        const staff = await staffRes.json();

        const formattedStudents = students.map((u) => ({
          ...u,
          role: "Student",
          id: u.studentId,
        }));

        const formattedStaff = staff.map((u) => ({
          ...u,
          role: u.userType === "admin" ? "Admin" : "Staff",
          id: u.staffId,
        }));

        setUsers([...formattedStudents, ...formattedStaff]);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  /* =========================
     Filtering Logic
  ========================= */
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchTerm = filters.search.toLowerCase();

      const matchesSearch =
        user.username?.toLowerCase().includes(searchTerm) ||
        user.email?.toLowerCase().includes(searchTerm) ||
        user.id?.toLowerCase().includes(searchTerm);

      return (
        matchesSearch &&
        (filters.role === "" || user.role === filters.role) &&
        (filters.status === "" ||
          (filters.status === "Active"
            ? user.accountStatus === true
            : user.accountStatus === false))
      );
    });
  }, [users, filters]);

  /* =========================
     Stats
  ========================= */
  const stats = useMemo(() => {
    return {
      total: users.length,
      students: users.filter((u) => u.role === "Student").length,
      staff: users.filter((u) => u.role === "Staff").length,
      inactive: users.filter((u) => u.accountStatus === false).length,
    };
  }, [users]);

  /* =========================
     Delete User
  ========================= */
  const handleDelete = async (user) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to deactivate ${user.username}?`
    );
    if (!confirmDelete) return;

    try {
      await fetch(`${API_URL}/delete-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filter: { _id: user._id },
          update: { accountStatus: false },
        }),
      });

      setUsers((prev) =>
        prev.map((u) =>
          u._id === user._id ? { ...u, accountStatus: false } : u
        )
      );
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  /* =========================
     Edit User
  ========================= */
  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditData({
      username: user.username || "",
      email: user.email || "",
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      await fetch(`${API_URL}/update-user/${selectedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });

      setUsers((prev) =>
        prev.map((u) =>
          u._id === selectedUser._id ? { ...u, ...editData } : u
        )
      );

      setShowEditModal(false);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  /* =========================
     Styles
  ========================= */
  const badgeStyle = (bg, color) => ({
    backgroundColor: bg,
    color,
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "0.75rem",
    fontWeight: "600",
  });

  return (
    <div style={{ backgroundColor: "#F0F7FF", minHeight: "100vh", padding: "20px" }}>
      <div className="container-fluid">
        <h1 className="mb-4 fw-bold text-primary">
          <Shield className="me-2" /> Super User Management
        </h1>

        {/* ================= Stats ================= */}
        <div className="row mb-4">
          {[
            { label: "Total Users", value: stats.total, icon: <Users />, color: "#1E3A8A" },
            { label: "Students", value: stats.students, icon: <UserCheck />, color: "#10B981" },
            { label: "Staff/Admin", value: stats.staff, icon: <Shield />, color: "#3B82F6" },
            { label: "Inactive", value: stats.inactive, icon: <UserX />, color: "#EF4444" },
          ].map((card, index) => (
            <div key={index} className="col-md-3 mb-3">
              <div
                className="p-4 rounded shadow-sm text-white d-flex justify-content-between align-items-center"
                style={{ backgroundColor: card.color }}
              >
                <div>
                  <h4 className="fw-bold">{card.value}</h4>
                  <small>{card.label}</small>
                </div>
                {card.icon}
              </div>
            </div>
          ))}
        </div>

        {/* ================= Filters ================= */}
        <div className="card shadow-sm mb-4 p-3">
          <div className="row">
            <div className="col-md-4 mb-2">
              <div className="position-relative">
                <Search size={16} className="position-absolute" style={{ top: 12, left: 12 }} />
                <input
                  type="text"
                  className="form-control ps-5"
                  placeholder="Search by name, email, ID..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="col-md-3 mb-2">
              <select
                className="form-select"
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, role: e.target.value }))
                }
              >
                <option value="">All Roles</option>
                <option value="Student">Student</option>
                <option value="Staff">Staff</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div className="col-md-3 mb-2">
              <select
                className="form-select"
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, status: e.target.value }))
                }
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* ================= Table ================= */}
        <div className="card shadow-sm">
          <div className="card-body table-responsive">
            <table className="table align-middle">
              <thead className="table-light">
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>ID</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      Loading users...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td className="fw-semibold">{user.username}</td>
                      <td>{user.email}</td>
                      <td>{user.id}</td>
                      <td>
                        <span
                          style={
                            user.role === "Admin"
                              ? badgeStyle("#EDE9FE", "#5B21B6")
                              : user.role === "Staff"
                              ? badgeStyle("#DBEAFE", "#1E40AF")
                              : badgeStyle("#DCFCE7", "#166534")
                          }
                        >
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span
                          style={
                            user.accountStatus === true
                              ? badgeStyle("#DCFCE7", "#166534")
                              : badgeStyle("#FEE2E2", "#991B1B")
                          }
                        >
                          {user.accountStatus === true ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="text-end">
                        <Edit2
                          size={16}
                          className="me-3 text-primary"
                          style={{ cursor: "pointer" }}
                          onClick={() => openEditModal(user)}
                        />
                        <Trash2
                          size={16}
                          className="text-danger"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleDelete(user)}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ================= Edit Modal ================= */}
      {showEditModal && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit User</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                />
              </div>
              <div className="modal-body">
                <input
                  className="form-control mb-3"
                  placeholder="Username"
                  value={editData.username}
                  onChange={(e) =>
                    setEditData({ ...editData, username: e.target.value })
                  }
                />
                <input
                  className="form-control"
                  placeholder="Email"
                  value={editData.email}
                  onChange={(e) =>
                    setEditData({ ...editData, email: e.target.value })
                  }
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleUpdate}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperUserManagementPage;