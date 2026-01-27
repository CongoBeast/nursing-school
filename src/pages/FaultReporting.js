import React, { useState } from 'react';
import { Wrench, Plus, Image as ImageIcon, CheckCircle, AlertTriangle } from 'lucide-react';

const FaultReporting = ({ userRole = "staff" }) => { // Set to "admin" to see enabled buttons
  const [showModal, setShowModal] = useState(false);
  
  const faultRecords = [
    { id: 1, building: "Main Hostel", dorm: "B12", item: "Shower Head", date: "2026-01-24", status: "Pending" },
    { id: 2, building: "South Wing", dorm: "A05", item: "Window Latch", date: "2026-01-22", status: "Fixed" },
    { id: 3, building: "Annex", dorm: "C09", item: "Light Switch", date: "2026-01-20", status: "In Progress" },
  ];

  return (
    <div style={{ backgroundColor: '#FFEDFA', minHeight: '100vh', padding: '40px 20px' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 style={{ color: '#BE5985', fontWeight: 'bold' }}>
            <Wrench className="me-2" /> Maintenance & Fault Reports
          </h2>
          <button 
            className="btn d-flex align-items-center" 
            style={{ backgroundColor: '#BE5985', color: 'white', fontWeight: 'bold' }}
            onClick={() => setShowModal(true)}
          >
            <Plus size={20} className="me-1" /> Report New Fault
          </button>
        </div>

        {/* Records Table */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
          <div className="card-body p-4">
            <table className="table">
              <thead>
                <tr style={{ color: '#EC7FA9' }}>
                  <th>Building</th>
                  <th>Dorm #</th>
                  <th>Item</th>
                  <th>Reported Date</th>
                  <th>Status</th>
                  <th>Admin Action</th>
                </tr>
              </thead>
              <tbody>
                {faultRecords.map((fault) => (
                  <tr key={fault.id} className="align-middle">
                    <td>{fault.building}</td>
                    <td><span className="badge bg-light text-dark">{fault.dorm}</span></td>
                    <td>{fault.item}</td>
                    <td>{fault.date}</td>
                    <td>
                      <small className="fw-bold" style={{ color: fault.status === 'Fixed' ? '#28a745' : '#EC7FA9' }}>
                        {fault.status}
                      </small>
                    </td>
                    <td>
                      <button 
                        className="btn btn-sm" 
                        style={{ backgroundColor: '#FFB8E0', color: '#BE5985' }}
                        disabled={userRole !== "admin"}
                      >
                        Update Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- MODAL SECTION --- */}
        {showModal && (
          <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content" style={{ borderRadius: '15px', border: 'none' }}>
                <div className="modal-header" style={{ backgroundColor: '#BE5985', color: 'white' }}>
                  <h5 className="modal-title">Report a Breakage</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold" style={{ color: '#BE5985' }}>Building</label>
                        <select className="form-select">
                          <option>Main Hostel</option>
                          <option>South Wing</option>
                          <option>Annex</option>
                          <option>Staff Quarters</option>
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold" style={{ color: '#BE5985' }}>Dorm Number</label>
                        <input type="text" className="form-control" placeholder="e.g. A12" required />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: '#BE5985' }}>Item Broken</label>
                      <input type="text" className="form-control" placeholder="e.g. Ceiling Fan" required />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: '#BE5985' }}>Details</label>
                      <textarea className="form-control" rows="3" placeholder="Describe the issue..."></textarea>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: '#BE5985' }}>Upload Image</label>
                      <div className="input-group">
                        <span className="input-group-text"><ImageIcon size={18} /></span>
                        <input type="file" className="form-control" accept="image/*" />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-bold" style={{ color: '#BE5985' }}>Discovery Date</label>
                      <input type="date" className="form-control" defaultValue={new Date().toISOString().split('T')[0]} />
                    </div>

                    <button type="submit" className="btn w-100 py-2 fw-bold" style={{ backgroundColor: '#BE5985', color: 'white' }}>
                      Submit Report
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FaultReporting;