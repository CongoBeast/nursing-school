import React, { useState, useEffect } from 'react';
import { 
  Home, ClipboardCheck, AlertCircle, Info, Bed, Trash2, WashingMachine, Zap, Coffee, BookOpen, Wind, Warehouse, Phone, ShieldAlert, ArrowRight
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FacilitiesManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);

  const [showReportModal, setShowReportModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportFormData, setReportFormData] = useState({
    dorm: '',
    facilityType: '',
    title: '',
    description: '',
    discoveryDate: new Date().toISOString().split('T')[0],
    status: 'Pending',
    image: null,
    imagePreview: null
  });

  const [facilityReports, setFacilityReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReportDetailModal, setShowReportDetailModal] = useState(false);

  const colors = {
    primary: '#F0F7FF',    // Very light blue
    secondary: '#DBEAFE',  // Light blue
    tertiary: '#3B82F6',   // Royal blue
    accent: '#1E3A8A'      // Navy blue
  };

  const facilities = [
    {
      id: 1,
      name: 'Nurses Home',
      icon: <Home size={32} />,
      lastInspection: '2026-01-10',
      inspectionScore: 'A-',
      status: 'Good',
      inventory: [
        { item: 'Accommodation Rooms', quantity: 166, condition: 'Mixed (52+70+3)' },
        { item: 'Toilets & Baths', quantity: 28, condition: 'Good' },
        { item: 'Store Rooms', quantity: 6, condition: 'Functional' },
        { item: 'Laundry Rooms', quantity: 3, condition: 'Good' },
        { item: 'Kitchenable Rooms', quantity: 1, condition: 'Operational' },
        { item: 'Electrical Rooms', quantity: 2, condition: 'Regulated' },
        { item: 'Special Rooms (Study/Living)', quantity: 3, condition: 'Good' },
        { item: 'Dining Room (Outside)', quantity: 1, condition: 'Good' }
      ],
      issues: ['Plumbing check required in Block A bath', 'Update lighting in studying room']
    },
    {
      id: 2,
      name: 'Adlam House',
      icon: <Warehouse size={32} />,
      lastInspection: '2026-01-15',
      inspectionScore: 'B+',
      status: 'Good',
      inventory: [
        { item: 'Accommodation Rooms', quantity: 119, condition: 'Good' },
        { item: 'Toilets', quantity: 27, condition: 'Fair' },
        { item: 'Showers', quantity: 24, condition: 'Good' },
        { item: 'Laundry & Ironing Rooms', quantity: 9, condition: 'Excellent' },
        { item: 'Kitchenable Rooms', quantity: 6, condition: 'Operational' },
        { item: 'Studying Rooms', quantity: 3, condition: 'Quiet Zone' },
        { item: 'Elevator Rooms', quantity: 4, condition: 'Service Required' },
        { item: 'Security (Guard/Phone)', quantity: 2, condition: 'Active' }
      ],
      issues: ['Elevator 2 due for annual maintenance', 'Repair shower drain in North Wing']
    }
  ];

  const notices = [
    {
      id: 1,
      type: 'urgent',
      icon: <ShieldAlert size={18} />,
      title: 'Adlam House Elevator Maintenance',
      date: '2026-01-28',
      content: 'Elevator technician arriving Jan 29. Use stairs for North Block.'
    },
    {
      id: 2,
      type: 'info',
      icon: <Info size={18} />,
      title: 'Nurses Home Laundry Update',
      date: '2026-01-25',
      content: 'New industrial washing machines installed in the main laundry room.'
    }
  ];

  const styles = {
    pageContainer: {
      minHeight: '100vh',
      backgroundColor: colors.primary,
      padding: '40px 0'
    },
    facilityCard: {
      backgroundColor: 'white',
      borderLeft: `6px solid ${colors.tertiary}`,
      borderRadius: '15px',
      transition: 'all 0.3s ease',
      border: 'none'
    },
    titleAccent: {
      color: colors.accent,
      fontWeight: '800'
    },
    btnCustom: {
      backgroundColor: colors.accent,
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '10px'
    },
    modalHeader: {
      backgroundColor: colors.accent,
      color: 'white'
    },
    badge: (status) => ({
      backgroundColor: status === 'Good' ? '#D1FAE5' : '#FEF3C7',
      color: status === 'Good' ? '#065F46' : '#92400E',
      fontWeight: 'bold'
    })
  };

  const fetchFacilityReports = async () => {
    try {
      setLoadingReports(true);
      const response = await fetch('https://nursing-school-backend--thomasmethembe4.replit.app/get-facility-reports');
      const data = await response.json();
      setFacilityReports(data);
    } catch (error) {
      console.error('Error fetching facility reports:', error);
      toast.error('Failed to load facility reports');
    } finally {
      setLoadingReports(false);
    }
  };

  // Add this function to handle report submission
  const handleSubmitFacilityReport = async () => {
    try {
      setIsSubmitting(true);

      if (!reportFormData.dorm || !reportFormData.facilityType || !reportFormData.title || !reportFormData.discoveryDate) {
        toast.error('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }

      // Get user from localStorage - handle both JSON and direct string
      let username;
      try {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          toast.error('User not found. Please log in again.');
          setIsSubmitting(false);
          return;
        }
        
        try {
          const userObj = JSON.parse(userStr);
          username = userObj.username || userStr;
        } catch {
          username = userStr;
        }
      } catch (error) {
        console.error('Error getting user from localStorage:', error);
        toast.error('User not found. Please log in again.');
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append('dorm', reportFormData.dorm);
      formData.append('facilityType', reportFormData.facilityType);
      formData.append('title', reportFormData.title);
      formData.append('description', reportFormData.description);
      formData.append('discoveryDate', reportFormData.discoveryDate);
      formData.append('status', reportFormData.status);
      formData.append('reportedBy', username);
      
      if (reportFormData.image) {
        formData.append('image', reportFormData.image);
      }

      const response = await fetch('https://nursing-school-backend--thomasmethembe4.replit.app/add-facility-report', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || 'Failed to submit facility report');
        setIsSubmitting(false);
        return;
      }

      toast.success('Facility report submitted successfully!');
      closeReportModal();
      
      // Refresh the reports list
      fetchFacilityReports();

    } catch (error) {
      console.error('Error submitting facility report:', error);
      toast.error('Failed to submit facility report');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add this function to close modal and reset form
    const closeReportModal = () => {
      setShowReportModal(false);
      setReportFormData({
        dorm: '',
        facilityType: '',
        title: '',
        description: '',
        discoveryDate: new Date().toISOString().split('T')[0],
        status: 'Pending',
        image: null,
        imagePreview: null
      });
      setIsSubmitting(false);
    };

    // Add facility types array
    const facilityTypes = [
      'Toilet/Bathroom',
      'Laundry Room',
      'Kitchen',
      'Study Room',
      'Dining Room',
      'Store Room',
      'Electrical Room',
      'Elevator',
      'Security',
      'Common Area',
      'Other'
    ];

    useEffect(() => {
      fetchFacilityReports();
    }, []);

  return (
    <div style={styles.pageContainer}>
      {/* Bootstrap CSS */}
      <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet" />
      
      <div className="container">
        {/* Header */}

        <div className="row mb-5 text-center">
          <div className="col">
            <h1 style={styles.titleAccent} className="display-5">Dormitory Facilities Management</h1>
            <p className="text-muted">Tracking inventory and maintenance for Adlam House and Nurses Home</p>
            <button 
              className="btn btn-lg mt-3"
              style={styles.btnCustom}
              onClick={() => setShowReportModal(true)}
            >
              <AlertCircle size={20} className="me-2" />
              Report Facility Damage
            </button>
          </div>
        </div>

        <div className="row g-4">
          {/* Facilities Cards */}
          <div className="col-lg-8">
            <div className="row g-4">
              {facilities.map((facility) => (
                <div className="col-md-6" key={facility.id}>
                  <div className="card h-100 shadow-sm" style={styles.facilityCard}>
                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div style={{ color: colors.tertiary }}>{facility.icon}</div>
                        <span className="badge p-2" style={styles.badge(facility.status)}>
                          Grade: {facility.inspectionScore}
                        </span>
                      </div>
                      <h4 style={styles.titleAccent}>{facility.name}</h4>
                      <p className="small text-muted mb-4">Last Inspected: {facility.lastInspection}</p>
                      
                      <div className="mb-4">
                        <h6 className="fw-bold mb-2 small text-uppercase" style={{ letterSpacing: '1px' }}>Core Facilities</h6>
                        {facility.inventory.slice(0, 4).map((item, i) => (
                          <div key={i} className="d-flex justify-content-between border-bottom py-2 small">
                            <span>{item.item}</span>
                            <span className="fw-bold text-primary">{item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <button 
                        className="btn w-100 d-flex align-items-center justify-content-center" 
                        style={styles.btnCustom}
                        onClick={() => { setSelectedFacility(facility); setShowModal(true); }}
                      >
                        View Full Assets <ArrowRight size={16} className="ms-2" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notices Sidebar */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm" style={{ borderRadius: '15px', backgroundColor: colors.secondary }}>
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4 d-flex align-items-center" style={{ color: colors.accent }}>
                  <ClipboardCheck className="me-2" /> Maintenance Notices
                </h5>
                {notices.map((notice) => (
                  <div key={notice.id} className="bg-white p-3 rounded-3 mb-3 shadow-sm border-start border-4 border-primary">
                    <div className="d-flex align-items-center mb-2" style={{ color: colors.tertiary }}>
                      {notice.icon}
                      <span className="ms-2 fw-bold small">{notice.title}</span>
                    </div>
                    <p className="mb-0 text-muted small" style={{ fontSize: '0.8rem' }}>{notice.content}</p>
                    <small className="text-primary fw-bold mt-2 d-block">{notice.date}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Facility Damage Reports Section */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
              <div className="card-header border-0 p-4" style={{ backgroundColor: colors.accent, color: 'white' }}>
                <h5 className="m-0 fw-bold d-flex align-items-center">
                  <AlertCircle className="me-2" /> Facility Damage Reports
                </h5>
              </div>
              <div className="card-body p-4">
                {loadingReports ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted">Loading facility reports...</p>
                  </div>
                ) : facilityReports.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <AlertCircle size={48} className="mb-3" style={{ opacity: 0.3 }} />
                    <p>No facility damage reports found</p>
                  </div>
                ) : (
                  <div className="row g-3">
                    {facilityReports.map((report) => (
                      <div className="col-md-6 col-lg-4" key={report._id}>
                        <div 
                          className="card h-100 border-0 shadow-sm" 
                          style={{ borderRadius: '12px', cursor: 'pointer', transition: 'transform 0.2s' }}
                          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                          onClick={() => { setSelectedReport(report); setShowReportDetailModal(true); }}
                        >
                          {report.imageUrl && (
                            <img 
                              src={report.imageUrl} 
                              className="card-img-top" 
                              alt={report.title}
                              style={{ height: '180px', objectFit: 'cover', borderRadius: '12px 12px 0 0' }}
                            />
                          )}
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <span 
                                className={`badge ${
                                  report.status === 'Fixed' ? 'bg-success' : 
                                  report.status === 'In Progress' ? 'bg-warning text-dark' : 
                                  'bg-danger'
                                }`}
                              >
                                {report.status}
                              </span>
                              <small className="text-muted">{report.facilityReportId}</small>
                            </div>
                            <h6 className="fw-bold mb-2" style={{ color: colors.accent }}>{report.title}</h6>
                            <p className="small text-muted mb-2">
                              <strong>{report.dorm}</strong> - {report.facilityType}
                            </p>
                            <p className="small text-muted mb-2" style={{ 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis', 
                              display: '-webkit-box', 
                              WebkitLineClamp: 2, 
                              WebkitBoxOrient: 'vertical' 
                            }}>
                              {report.description || 'No description provided'}
                            </p>
                            <div className="d-flex justify-content-between align-items-center mt-3">
                              <small className="text-muted">
                                <i className="bi bi-calendar me-1"></i>
                                {new Date(report.discoveryDate).toLocaleDateString()}
                              </small>
                              <small className="text-primary fw-bold">View Details →</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Detail Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0" style={{ borderRadius: '20px', overflow: 'hidden' }}>
              <div className="modal-header border-0 p-4" style={styles.modalHeader}>
                <h5 className="modal-title fw-bold d-flex align-items-center">
                  {selectedFacility.icon} <span className="ms-3">{selectedFacility.name} Inventory Report</span>
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body p-4" style={{ backgroundColor: '#F8FAFC' }}>
                <div className="row g-4">
                  <div className="col-md-7">
                    <div className="bg-white p-3 rounded shadow-sm">
                      <h6 className="fw-bold mb-3 text-primary">Detailed Room Breakdown</h6>
                      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {selectedFacility.inventory.map((item, i) => (
                          <div key={i} className="d-flex justify-content-between p-2 border-bottom">
                            <div>
                              <div className="fw-bold small">{item.item}</div>
                              <div className="text-muted" style={{ fontSize: '0.75rem' }}>Condition: {item.condition}</div>
                            </div>
                            <span className="badge bg-primary align-self-center">{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-5">
                    <div className="bg-white p-3 rounded shadow-sm mb-3">
                      <h6 className="fw-bold text-danger mb-3 d-flex align-items-center">
                        <AlertCircle size={18} className="me-2" /> Pending Issues
                      </h6>
                      {selectedFacility.issues.map((issue, i) => (
                        <div key={i} className="p-2 mb-2 bg-light rounded small border-start border-danger border-3">
                          {issue}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0 bg-light">
                <button className="btn btn-secondary rounded-pill px-4" onClick={() => setShowModal(false)}>Close Report</button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Facility Damage Report Modal */}
{showReportModal && (
  <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
    <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
      <div className="modal-content border-0" style={{ borderRadius: '20px', overflow: 'hidden' }}>
        <div className="modal-header border-0 p-4" style={styles.modalHeader}>
          <h5 className="modal-title fw-bold d-flex align-items-center">
            <AlertCircle className="me-3" size={24} />
            Report Facility Damage
          </h5>
          <button type="button" className="btn-close btn-close-white" onClick={closeReportModal}></button>
        </div>
        <div className="modal-body p-4" style={{ backgroundColor: '#F8FAFC' }}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="fw-bold mb-2 small">Dormitory <span className="text-danger">*</span></label>
              <select 
                className="form-select"
                value={reportFormData.dorm}
                onChange={(e) => setReportFormData({...reportFormData, dorm: e.target.value})}
              >
                <option value="">Select Dormitory...</option>
                <option value="Adlam House">Adlam House</option>
                <option value="Nurses Home">Nurses Home</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="fw-bold mb-2 small">Facility Type <span className="text-danger">*</span></label>
              <select 
                className="form-select"
                value={reportFormData.facilityType}
                onChange={(e) => setReportFormData({...reportFormData, facilityType: e.target.value})}
              >
                <option value="">Select Facility Type...</option>
                {facilityTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="col-12">
              <label className="fw-bold mb-2 small">Title <span className="text-danger">*</span></label>
              <input 
                type="text"
                className="form-control"
                placeholder="Brief title of the damage..."
                value={reportFormData.title}
                onChange={(e) => setReportFormData({...reportFormData, title: e.target.value})}
              />
            </div>

            <div className="col-12">
              <label className="fw-bold mb-2 small">Description</label>
              <textarea 
                className="form-control"
                rows="4"
                placeholder="Detailed description of the damage..."
                value={reportFormData.description}
                onChange={(e) => setReportFormData({...reportFormData, description: e.target.value})}
              />
            </div>

            <div className="col-md-6">
              <label className="fw-bold mb-2 small">Discovery Date <span className="text-danger">*</span></label>
              <input 
                type="date"
                className="form-control"
                value={reportFormData.discoveryDate}
                onChange={(e) => setReportFormData({...reportFormData, discoveryDate: e.target.value})}
              />
            </div>

            <div className="col-md-6">
              <label className="fw-bold mb-2 small">Status</label>
              <select 
                className="form-select"
                value={reportFormData.status}
                onChange={(e) => setReportFormData({...reportFormData, status: e.target.value})}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Fixed">Fixed</option>
              </select>
            </div>

            <div className="col-12">
              <label className="fw-bold mb-2 small">Photo Evidence</label>
              <input 
                type="file"
                accept="image/*"
                className="form-control"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setReportFormData({
                      ...reportFormData,
                      image: file,
                      imagePreview: URL.createObjectURL(file)
                    });
                  }
                }}
              />
              {reportFormData.imagePreview && (
                <div className="mt-3">
                  <img 
                    src={reportFormData.imagePreview} 
                    alt="Preview" 
                    style={{width: '100%', maxHeight: '250px', objectFit: 'contain', borderRadius: '12px'}}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="modal-footer border-0 bg-light p-4">
          <button className="btn btn-secondary rounded-pill px-4" onClick={closeReportModal}>
            Cancel
          </button>
          <button 
            className="btn rounded-pill px-4" 
            style={styles.btnCustom}
            onClick={handleSubmitFacilityReport}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Submitting...
              </>
            ) : (
              'Submit Report'
            )}
          </button>
        </div>
      </div>
    </div>
  </div>
)}

{/* Facility Report Detail Modal */}
{showReportDetailModal && selectedReport && (
  <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
    <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
      <div className="modal-content border-0" style={{ borderRadius: '20px', overflow: 'hidden' }}>
        <div className="modal-header border-0 p-4" style={styles.modalHeader}>
          <h5 className="modal-title fw-bold d-flex align-items-center">
            <AlertCircle className="me-3" size={24} />
            Facility Damage Report Details
          </h5>
          <button 
            type="button" 
            className="btn-close btn-close-white" 
            onClick={() => setShowReportDetailModal(false)}
          ></button>
        </div>
        <div className="modal-body p-4" style={{ backgroundColor: '#F8FAFC' }}>
          {selectedReport.imageUrl && (
            <div className="mb-4">
              <img 
                src={selectedReport.imageUrl} 
                alt={selectedReport.title}
                style={{ width: '100%', borderRadius: '12px', maxHeight: '400px', objectFit: 'cover' }}
              />
            </div>
          )}
          
          <div className="bg-white p-4 rounded shadow-sm mb-3">
            <div className="row g-3">
              <div className="col-12">
                <h4 className="fw-bold" style={{ color: colors.accent }}>{selectedReport.title}</h4>
                <span 
                  className={`badge ${
                    selectedReport.status === 'Fixed' ? 'bg-success' : 
                    selectedReport.status === 'In Progress' ? 'bg-warning text-dark' : 
                    'bg-danger'
                  }`}
                >
                  {selectedReport.status}
                </span>
              </div>
              
              <div className="col-md-6">
                <label className="small text-muted fw-bold">Report ID</label>
                <p className="mb-0">{selectedReport.facilityReportId}</p>
              </div>
              
              <div className="col-md-6">
                <label className="small text-muted fw-bold">Dormitory</label>
                <p className="mb-0">{selectedReport.dorm}</p>
              </div>
              
              <div className="col-md-6">
                <label className="small text-muted fw-bold">Facility Type</label>
                <p className="mb-0">{selectedReport.facilityType}</p>
              </div>
              
              <div className="col-md-6">
                <label className="small text-muted fw-bold">Discovery Date</label>
                <p className="mb-0">{new Date(selectedReport.discoveryDate).toLocaleDateString()}</p>
              </div>
              
              <div className="col-md-6">
                <label className="small text-muted fw-bold">Reported By</label>
                <p className="mb-0">{selectedReport.reportedBy}</p>
              </div>
              
              <div className="col-md-6">
                <label className="small text-muted fw-bold">Reported On</label>
                <p className="mb-0">{new Date(selectedReport.createdAt).toLocaleString()}</p>
              </div>
              
              <div className="col-12">
                <label className="small text-muted fw-bold">Description</label>
                <p className="mb-0">{selectedReport.description || 'No description provided'}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-3 rounded shadow-sm">
            <label className="small text-muted fw-bold mb-2">Update Status</label>
            <select 
              className="form-select"
              value={selectedReport.status}
              onChange={async (e) => {
                const newStatus = e.target.value;
                try {
                  const response = await fetch('https://nursing-school-backend--thomasmethembe4.replit.app/update-facility-report-status', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      facilityReportId: selectedReport._id,
                      status: newStatus
                    })
                  });
                  
                  const data = await response.json();
                  
                  if (response.ok) {
                    toast.success('Status updated successfully!');
                    setSelectedReport({ ...selectedReport, status: newStatus });
                    fetchFacilityReports(); // Refresh the list
                  } else {
                    toast.error(data.message || 'Failed to update status');
                  }
                } catch (error) {
                  console.error('Error updating status:', error);
                  toast.error('Failed to update status');
                }
              }}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Fixed">Fixed</option>
            </select>
          </div>
        </div>
        <div className="modal-footer border-0 bg-light p-4">
          <button 
            className="btn btn-secondary rounded-pill px-4" 
            onClick={() => setShowReportDetailModal(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}

{/* Add ToastContainer at the end */}
<ToastContainer 
  position="top-right"
  autoClose={3000}
  hideProgressBar={false}
  newestOnTop={true}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
/>
    </div>
  );
};

export default FacilitiesManagement;