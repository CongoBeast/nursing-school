import React, { useState } from 'react';
import { 
  Home, 
  ClipboardCheck, 
  AlertCircle, 
  Info, 
  Bed, 
  Trash2, 
  WashingMachine, 
  Zap, 
  Coffee, 
  BookOpen, 
  Wind,
  Warehouse,
  Phone,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

const FacilitiesManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);

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
    </div>
  );
};

export default FacilitiesManagement;