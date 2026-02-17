import React, { useState, useEffect, useMemo } from 'react';
import { Wrench, Plus, Image as ImageIcon, CheckCircle, AlertTriangle, X, Search, Filter, Loader } from 'lucide-react';
import API_URL from '../config';

const FaultReporting = () => {
  const [showModal, setShowModal] = useState(false);
  const [faultRecords, setFaultRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [submitting, setSubmitting] = useState(false); // New state for submission loading
  
  const [formData, setFormData] = useState({
    house: '',
    roomNumber: '',
    item: '',
    details: '',
    discoveryDate: new Date().toISOString().split('T')[0],
    reportedBy: localStorage.getItem('user') || 'Anonymous'
  });

  const [filters, setFilters] = useState({
    search: '',
    house: '',
    status: ''
  });

  const userRole = localStorage.getItem('userType');

  // Generate room numbers based on house selection
  const roomNumbers = useMemo(() => {
    if (!formData.house) return [];
    
    if (formData.house === 'Adlam House') {
      return Array.from({ length: 119 }, (_, i) => `A${String(i + 1).padStart(2, '0')}`);
    } else if (formData.house === 'Nurse Home') {
      return Array.from({ length: 122 }, (_, i) => `N${String(i + 1).padStart(2, '0')}`);
    }
    return [];
  }, [formData.house]);

  // Fetch fault reports
  useEffect(() => {
    fetchFaultReports();
  }, []);

  const fetchFaultReports = async () => {
    try {
      const response = await fetch(`${API_URL}/get-fault-reports`);
      const data = await response.json();
      setFaultRecords(data);
    } catch (error) {
      console.error('Error fetching fault reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true); // Set submitting to true

    const formDataToSend = new FormData();
    formDataToSend.append('house', formData.house);
    formDataToSend.append('roomNumber', formData.roomNumber);
    formDataToSend.append('item', formData.item);
    formDataToSend.append('details', formData.details);
    formDataToSend.append('discoveryDate', formData.discoveryDate);
    formDataToSend.append('reportedBy', formData.reportedBy);
    
    if (selectedImage) {
      formDataToSend.append('image', selectedImage);
    }

    try {
      const response = await fetch(`${API_URL}/add-fault-report`, {
        method: 'POST',
        body: formDataToSend
      });

      const data = await response.json();

      if (response.ok) {
        alert('Fault report submitted successfully!');
        setShowModal(false);
        fetchFaultReports();
        // Reset form
        setFormData({
          house: '',
          roomNumber: '',
          item: '',
          details: '',
          discoveryDate: new Date().toISOString().split('T')[0],
          reportedBy: localStorage.getItem('username') || 'Anonymous'
        });
        setImagePreview(null);
        setSelectedImage(null);
      } else {
        alert(data.message || 'Failed to submit report');
      }
    } catch (error) {
      console.error('Error submitting fault report:', error);
      alert('Failed to submit fault report');
    } finally {
      setSubmitting(false); // Set submitting back to false regardless of outcome
    }
  };

  const handleStatusUpdate = async (reportId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/update-fault-status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          faultReportId: reportId,
          status: newStatus
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Status updated successfully!');
        fetchFaultReports();
      } else {
        alert(data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  // Filtered records
  const filteredRecords = useMemo(() => {
    return faultRecords.filter(record => {
      const matchesSearch = 
        (record.item?.toLowerCase() || '').includes(filters.search.toLowerCase()) ||
        (record.roomNumber?.toLowerCase() || '').includes(filters.search.toLowerCase()) ||
        (record.faultReportId?.toLowerCase() || '').includes(filters.search.toLowerCase());
      
      return matchesSearch &&
        (filters.house === '' || record.house === filters.house) &&
        (filters.status === '' || record.status === filters.status);
    });
  }, [faultRecords, filters]);

  const stats = useMemo(() => ({
    total: faultRecords.length,
    pending: faultRecords.filter(r => r.status === 'Pending').length,
    inProgress: faultRecords.filter(r => r.status === 'In Progress').length,
    fixed: faultRecords.filter(r => r.status === 'Fixed').length
  }), [faultRecords]);

  const styles = {
    body: { backgroundColor: '#F0F7FF', minHeight: '100vh', padding: '20px', fontFamily: 'Arial, sans-serif' },
    header: { color: '#1E3A8A', fontWeight: 'bold', marginBottom: '30px', fontSize: '2.5rem', textAlign: 'center' },
    card: { border: 'none', borderRadius: '12px', boxShadow: '0 4px 6px rgba(30, 58, 138, 0.1)', marginBottom: '20px', backgroundColor: 'white' },
    statCard: { textAlign: 'center', padding: '20px', color: 'white', borderRadius: '12px' },
    statNumber: { fontSize: '2rem', fontWeight: 'bold' },
    statLabel: { fontSize: '0.9rem', opacity: 0.9, marginTop: '5px' },
    filterBar: { backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(30, 58, 138, 0.1)', marginBottom: '20px' },
    input: { border: '2px solid #DBEAFE', borderRadius: '8px', padding: '10px', fontSize: '0.9rem', width: '100%' },
    select: { border: '2px solid #DBEAFE', borderRadius: '8px', padding: '10px', fontSize: '0.9rem', width: '100%', cursor: 'pointer' },
    modalOverlay: {
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center',
      alignItems: 'center', zIndex: 1000
    },
    modalContent: {
      backgroundColor: 'white', padding: '30px', borderRadius: '12px',
      width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto',
      boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
    },
    loadingOverlay: {
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(255,255,255,0.8)', display: 'flex',
      justifyContent: 'center', alignItems: 'center', borderRadius: '12px',
      zIndex: 10
    },
    spinner: {
      animation: 'spin 1s linear infinite'
    }
  };

  // Add keyframes for spinner animation
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  return (
    <div style={styles.body}>
      <div className="container-fluid">
        <h1 style={styles.header}>
          <Wrench size={40} className="me-2" />
          Maintenance & Fault Reports
        </h1>

        {/* Stats Cards */}
        <div className="row mb-4">
          <div className="col-md-3">
            <div style={{...styles.statCard, background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)'}}>
              <div style={styles.statNumber}>{stats.total}</div>
              <div style={styles.statLabel}>Total Reports</div>
            </div>
          </div>
          <div className="col-md-3">
            <div style={{...styles.statCard, background: 'linear-gradient(135deg, #F59E0B, #FBBF24)'}}>
              <div style={styles.statNumber}>{stats.pending}</div>
              <div style={styles.statLabel}>Pending</div>
            </div>
          </div>
          <div className="col-md-3">
            <div style={{...styles.statCard, background: 'linear-gradient(135deg, #3B82F6, #60A5FA)'}}>
              <div style={styles.statNumber}>{stats.inProgress}</div>
              <div style={styles.statLabel}>In Progress</div>
            </div>
          </div>
          <div className="col-md-3">
            <div style={{...styles.statCard, background: 'linear-gradient(135deg, #10B981, #34D399)'}}>
              <div style={styles.statNumber}>{stats.fixed}</div>
              <div style={styles.statLabel}>Fixed</div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div style={styles.filterBar}>
          <div className="row g-3 align-items-end">
            <div className="col-lg-5">
              <label className="fw-bold mb-1" style={{color: '#1E3A8A'}}>Search Reports</label>
              <div style={{position: 'relative'}}>
                <Search size={18} style={{position: 'absolute', left: '12px', top: '12px', color: '#3B82F6'}} />
                <input 
                  type="text" 
                  placeholder="Search by item, room, or ID..." 
                  value={filters.search} 
                  onChange={(e) => setFilters({...filters, search: e.target.value})} 
                  style={{...styles.input, paddingLeft: '40px'}} 
                />
              </div>
            </div>
            <div className="col-lg-2">
              <label className="fw-bold mb-1" style={{color: '#1E3A8A'}}>House</label>
              <select value={filters.house} onChange={(e) => setFilters({...filters, house: e.target.value})} style={styles.select}>
                <option value="">All Houses</option>
                <option value="Adlam House">Adlam House</option>
                <option value="Nurse Home">Nurse Home</option>
              </select>
            </div>
            <div className="col-lg-2">
              <label className="fw-bold mb-1" style={{color: '#1E3A8A'}}>Status</label>
              <select value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})} style={styles.select}>
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Fixed">Fixed</option>
              </select>
            </div>
            <div className="col-lg-3">
              <button 
                className="btn w-100 d-flex align-items-center justify-content-center gap-2" 
                style={{ backgroundColor: '#1E3A8A', color: 'white', fontWeight: 'bold', padding: '10px' }}
                onClick={() => setShowModal(true)}
              >
                <Plus size={20} /> Report New Fault
              </button>
            </div>
          </div>
        </div>

        {/* Reports Table */}
        <div style={styles.card}>
          <div style={{backgroundColor: '#1E3A8A', color: 'white', padding: '15px 20px', borderRadius: '12px 12px 0 0'}}>
            <h5 className="m-0">Fault Reports Database</h5>
          </div>
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead style={{backgroundColor: '#3B82F6', color: 'white'}}>
                <tr>
                  <th style={{padding: '15px'}}>Report ID</th>
                  <th>House</th>
                  <th>Room</th>
                  <th>Item</th>
                  <th>Reported Date</th>
                  <th>Status</th>
                  <th>Image</th>
                  {userRole === 'admin' && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((fault) => (
                  <tr key={fault._id}>
                    <td style={{padding: '15px'}}>
                      <span className="badge bg-secondary">{fault.faultReportId}</span>
                    </td>
                    <td>{fault.house}</td>
                    <td><span className="badge bg-light text-dark">{fault.roomNumber}</span></td>
                    <td>{fault.item}</td>
                    <td>{new Date(fault.discoveryDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${
                        fault.status === 'Fixed' ? 'bg-success' : 
                        fault.status === 'In Progress' ? 'bg-primary' : 
                        'bg-warning text-dark'
                      }`}>
                        {fault.status}
                      </span>
                    </td>
                    <td>
                      {fault.imageUrl ? (
                        <a href={fault.imageUrl} target="_blank" rel="noopener noreferrer">
                          <ImageIcon size={20} style={{color: '#3B82F6'}} />
                        </a>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                    {userRole === 'admin' && (
                      <td>
                        <select 
                          className="form-select form-select-sm" 
                          value={fault.status}
                          onChange={(e) => handleStatusUpdate(fault._id, e.target.value)}
                          style={{width: '140px'}}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Fixed">Fixed</option>
                        </select>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div style={styles.modalOverlay}>
            <div style={{...styles.modalContent, position: 'relative'}}>
              {/* Loading overlay */}
              {submitting && (
                <div style={styles.loadingOverlay}>
                  <div className="text-center">
                    <Loader size={48} style={{...styles.spinner, color: '#1E3A8A'}} />
                    <p style={{color: '#1E3A8A', fontWeight: 'bold', marginTop: '10px'}}>Submitting report...</p>
                  </div>
                </div>
              )}
              
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="m-0" style={{color: '#1E3A8A'}}>Report a Fault</h4>
                <X size={24} style={{cursor: 'pointer', opacity: submitting ? 0.5 : 1, pointerEvents: submitting ? 'none' : 'auto'}} onClick={() => setShowModal(false)} />
              </div>

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold" style={{color: '#1E3A8A'}}>House *</label>
                    <select 
                      className="form-select" 
                      style={styles.select}
                      value={formData.house}
                      onChange={(e) => setFormData({...formData, house: e.target.value, roomNumber: ''})}
                      required
                      disabled={submitting}
                    >
                      <option value="">Select House...</option>
                      <option value="Adlam House">Adlam House</option>
                      <option value="Nurse Home">Nurse Home</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold" style={{color: '#1E3A8A'}}>Room Number *</label>
                    <select 
                      className="form-select" 
                      style={styles.select}
                      value={formData.roomNumber}
                      onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
                      disabled={!formData.house || submitting}
                      required
                    >
                      <option value="">Select Room...</option>
                      {roomNumbers.map(room => (
                        <option key={room} value={room}>{room}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold" style={{color: '#1E3A8A'}}>Item Broken *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    style={styles.input}
                    placeholder="e.g. Ceiling Fan, Window Latch" 
                    value={formData.item}
                    onChange={(e) => setFormData({...formData, item: e.target.value})}
                    required 
                    disabled={submitting}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold" style={{color: '#1E3A8A'}}>Details</label>
                  <textarea 
                    className="form-control" 
                    style={styles.input}
                    rows="3" 
                    placeholder="Describe the issue..."
                    value={formData.details}
                    onChange={(e) => setFormData({...formData, details: e.target.value})}
                    disabled={submitting}
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold" style={{color: '#1E3A8A'}}>Upload Image</label>
                  <input 
                    type="file" 
                    className="form-control" 
                    style={styles.input}
                    accept="image/*" 
                    onChange={handleImageChange}
                    disabled={submitting}
                  />
                  {imagePreview && (
                    <img src={imagePreview} alt="Preview" style={{width: '100%', marginTop: '10px', borderRadius: '8px'}} />
                  )}
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold" style={{color: '#1E3A8A'}}>Discovery Date *</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    style={styles.input}
                    value={formData.discoveryDate}
                    onChange={(e) => setFormData({...formData, discoveryDate: e.target.value})}
                    required
                    disabled={submitting}
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2" 
                  style={{
                    backgroundColor: submitting ? '#6B7280' : '#1E3A8A', 
                    color: 'white',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    opacity: submitting ? 0.7 : 1
                  }}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader size={20} style={styles.spinner} />
                      Submitting...
                    </>
                  ) : (
                    'Submit Report'
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FaultReporting;