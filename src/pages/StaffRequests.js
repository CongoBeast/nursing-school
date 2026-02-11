import React, { useState, useEffect } from 'react';
import { PlusCircle, Filter, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';

const StaffRequests = () => {
  const colors = { primary: '#1E3A8A', secondary: '#3B82F6', light: '#DBEAFE' };

  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

//   const requests = [
//     { id: 1, date: 'Jan 12, 2026', type: 'Leave', subject: 'Annual Leave Request', status: 'Pending' },
//     { id: 2, date: 'Jan 15, 2026', type: 'Maintenance', subject: 'Broken Door Lock', status: 'Approved' },
//     { id: 3, date: 'Jan 18, 2026', type: 'Shift Swap', subject: 'Night Duty Swap', status: 'Rejected' },
//     { id: 4, date: 'Jan 20, 2026', type: 'Accommodation', subject: 'Room Change Request', status: 'Pending' },
//   ];

    const [showModal, setShowModal] = useState(false);
    const [requestType, setRequestType] = useState('');
    const [description, setDescription] = useState('');

    const API_BASE = "https://nursing-school-backend-dev.replit.app";

    const username = localStorage.getItem("user");

    const fetchMyRequests = async () => {
    setLoading(true);
    try {
        const res = await fetch(`${API_BASE}/get-staff-requests/${username}`);
        const data = await res.json();
        setRequests(data);
    } catch (err) {
        console.error("Failed to fetch requests", err);
    } finally {
        setLoading(false);
    }
    };

    useEffect(() => {
    fetchMyRequests();
    }, []);


    const handleSubmitRequest = async () => {
    try {
        const payload = {
        username: localStorage.getItem("user"),
        type: requestType,
        description: description.trim(),
        };

        const res = await fetch(`${API_BASE}/add-staff-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Request failed");

        setShowModal(false);
        setRequestType("");
        setDescription("");

        // refresh table
        fetchMyRequests();
    } catch (err) {
        console.error(err);
        alert("Failed to submit request");
    }
    };


  const filteredRequests = requests.filter(req => {
    return (
      (statusFilter === 'all' || req.status === statusFilter) &&
      (typeFilter === 'all' || req.type === typeFilter)
    );
  });

  const statusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return <span className="badge bg-success"><CheckCircle size={14} className="me-1" /> Approved</span>;
      case 'Rejected':
        return <span className="badge bg-danger"><XCircle size={14} className="me-1" /> Rejected</span>;
      default:
        return <span className="badge bg-warning text-dark"><Clock size={14} className="me-1" /> Pending</span>;
    }
  };

  return (
    <div style={{ backgroundColor: '#F0F7FF', minHeight: '100vh', padding: '30px' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 style={{ color: colors.primary, fontWeight: 'bold' }}>
            My Requests
          </h2>
          <button
            className="btn text-white shadow-sm"
            style={{ backgroundColor: colors.secondary }}
            onClick={() => setShowModal(true)}
            >
            <PlusCircle size={18} className="me-2" />
            New Request
           </button>
        </div>

        {/* Filters */}
        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '15px' }}>
          <div className="card-body d-flex flex-wrap gap-3 align-items-center">
            <Filter size={18} className="text-muted" />
            
            <select
              className="form-select w-auto"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="Leave">Leave</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Shift Swap">Shift Swap</option>
              <option value="Accommodation">Accommodation</option>
            </select>

            <select
              className="form-select w-auto"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Requests Table */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
          <div className="card-body p-0">
            <table className="table table-hover align-middle">
                <thead className="table-light">
                    <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {loading && (
                    <tr>
                        <td colSpan="4" className="text-center py-4">
                        Loading...
                        </td>
                    </tr>
                    )}

                    {!loading && requests.length === 0 && (
                    <tr>
                        <td colSpan="4" className="text-center text-muted py-4">
                        No requests submitted
                        </td>
                    </tr>
                    )}

                    {requests.map((req) => (
                    <tr key={req._id}>
                        <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                        <td>
                        <span className="badge bg-secondary text-uppercase">
                            {req.type}
                        </span>
                        </td>
                        <td style={{ maxWidth: "350px" }}>{req.description}</td>
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
                            {req.status}
                        </span>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>

          </div>
        </div>

      </div>

      {showModal && (
        <div
            className="modal fade show"
            style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.4)' }}
        >
            <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: '15px' }}>
                
                <div className="modal-header">
                <h5 className="modal-title fw-bold">New Request</h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
                </div>

                <div className="modal-body">
                <div className="mb-3">
                    <label className="form-label fw-medium">Request Type</label>
                    <select
                    className="form-select"
                    value={requestType}
                    onChange={(e) => setRequestType(e.target.value)}
                    >
                    <option value="">Select type</option>
                    <option value="Notice">Notice</option>
                    <option value="Leave">Leave</option>
                    <option value="Swap">Swap</option>
                    <option value="Maintenance">Maintenance</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label fw-medium">Description</label>
                    <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Describe your request..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <small className="text-muted">
                    Submitted as <strong>{localStorage.getItem('user')}</strong>
                </small>
                </div>

                <div className="modal-footer">
                <button className="btn btn-light" onClick={() => setShowModal(false)}>
                    Cancel
                </button>
                <button
                    className="btn text-white"
                    style={{ backgroundColor: colors.secondary }}
                    disabled={!requestType || !description.trim()}
                    onClick={handleSubmitRequest}
                >
                    Submit Request
                </button>
                </div>

            </div>
            </div>
        </div>
        )}

    </div>
  );
};

export default StaffRequests;
