import React, { useEffect, useState } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Filter,
} from "lucide-react";
import { toast } from "react-toastify";
import API_URL from "../config";

const AdminStaffRequests = () => {
  const colors = { primary: "#1E3A8A", secondary: "#3B82F6" };

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const adminUser = localStorage.getItem("user");

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/get-all-staff-requests`);
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (requestId, newStatus) => {
    try {
      const res = await fetch(
        `${API_URL}/update-staff-request-status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            requestId,
            status: newStatus,
            updatedBy: adminUser,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      toast.success(`Request ${newStatus}`);
      fetchRequests();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update request");
    }
  };

  const filteredRequests =
    statusFilter === "all"
      ? requests
      : requests.filter((r) => r.status === statusFilter);

  return (
    <div style={{ background: "#F0F7FF", minHeight: "100vh", padding: 30 }}>
      <div className="container" style={{ maxWidth: 1100 }}>
        <h2
          className="mb-4 fw-bold"
          style={{ color: colors.primary }}
        >
          Staff Requests (Admin)
        </h2>

        {/* Filter */}
        <div className="card shadow-sm mb-4">
          <div className="card-body d-flex align-items-center gap-3">
            <Filter size={18} />
            <select
              className="form-select w-auto"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="card shadow-sm">
          <div className="card-body p-0">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Date</th>
                  <th>User</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th width="180">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                )}

                {!loading && filteredRequests.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">
                      No requests found
                    </td>
                  </tr>
                )}

                {filteredRequests.map((req) => (
                  <tr key={req._id}>
                    <td>
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>
                    <td>{req.username}</td>
                    <td>
                      <span className="badge bg-secondary text-uppercase">
                        {req.type}
                      </span>
                    </td>
                    <td style={{ maxWidth: 300 }}>
                      {req.description}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          req.status === "Approved"
                            ? "bg-success"
                            : req.status === "Rejected"
                            ? "bg-danger"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {req.status || "Pending"}
                      </span>
                    </td>

                    <td>
                      {req.status === "Pending" && (
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() =>
                              updateStatus(req._id, "Approved")
                            }
                          >
                            <CheckCircle size={16} />
                          </button>

                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() =>
                              updateStatus(req._id, "Rejected")
                            }
                          >
                            <XCircle size={16} />
                          </button>
                        </div>
                      )}

                      {req.status !== "Pending" && (
                        <span className="text-muted small">
                          Updated by {req.statusUpdatedBy || "-"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStaffRequests;
