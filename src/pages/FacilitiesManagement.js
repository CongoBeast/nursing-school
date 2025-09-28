import React, { useState } from 'react';

const FacilitiesManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);

  // Color palette
  const colors = {
    primary: '#FFEDFA',
    secondary: '#FFB8E0', 
    tertiary: '#EC7FA9',
    accent: '#BE5985'
  };

  // Facilities data
  const facilities = [
    {
      id: 1,
      name: 'Dining Hall',
      icon: '🍽️',
      lastInspection: '2024-07-15',
      inspectionScore: 'A',
      status: 'Good',
      inventory: [
        { item: 'Dining Tables', quantity: 25, condition: 'Good' },
        { item: 'Chairs', quantity: 200, condition: 'Good' },
        { item: 'Kitchen Equipment', quantity: 15, condition: 'Excellent' },
        { item: 'Serving Counters', quantity: 3, condition: 'Good' },
        { item: 'Refrigeration Units', quantity: 4, condition: 'Fair' }
      ],
      issues: ['Minor plumbing leak in kitchen', 'Replace 2 broken chairs']
    },
    {
      id: 2,
      name: 'Student Dormitory',
      icon: '🏠',
      lastInspection: '2024-07-20',
      inspectionScore: 'B+',
      status: 'Good',
      inventory: [
        { item: 'Bed Frames', quantity: 120, condition: 'Good' },
        { item: 'Mattresses', quantity: 120, condition: 'Good' },
        { item: 'Study Desks', quantity: 120, condition: 'Fair' },
        { item: 'Wardrobes', quantity: 60, condition: 'Good' },
        { item: 'Common Room Furniture', quantity: 25, condition: 'Excellent' }
      ],
      issues: ['Replace 5 worn mattresses', 'Repair heating system in Block B']
    },
    {
      id: 3,
      name: 'Sports Field',
      icon: '⚽',
      lastInspection: '2024-07-10',
      inspectionScore: 'A-',
      status: 'Excellent',
      inventory: [
        { item: 'Football Goals', quantity: 2, condition: 'Good' },
        { item: 'Basketball Hoops', quantity: 4, condition: 'Excellent' },
        { item: 'Tennis Net', quantity: 2, condition: 'Fair' },
        { item: 'Changing Room Benches', quantity: 10, condition: 'Good' },
        { item: 'Sports Equipment Storage', quantity: 1, condition: 'Good' }
      ],
      issues: ['Resurface tennis court', 'Replace damaged goal post padding']
    },
    {
      id: 4,
      name: 'Lecture Rooms',
      icon: '📚',
      lastInspection: '2024-07-25',
      inspectionScore: 'A',
      status: 'Excellent',
      inventory: [
        { item: 'Student Desks', quantity: 480, condition: 'Good' },
        { item: 'Projectors', quantity: 12, condition: 'Excellent' },
        { item: 'Whiteboards', quantity: 12, condition: 'Good' },
        { item: 'Audio Systems', quantity: 8, condition: 'Fair' },
        { item: 'Air Conditioning Units', quantity: 12, condition: 'Good' }
      ],
      issues: ['Update projector in Room 204', 'Service AC units before summer']
    },
    {
      id: 5,
      name: 'Examination Halls',
      icon: '📝',
      lastInspection: '2024-07-18',
      inspectionScore: 'A+',
      status: 'Excellent',
      inventory: [
        { item: 'Exam Desks', quantity: 300, condition: 'Excellent' },
        { item: 'Chairs', quantity: 300, condition: 'Good' },
        { item: 'Clock Systems', quantity: 6, condition: 'Excellent' },
        { item: 'Ventilation Fans', quantity: 12, condition: 'Good' },
        { item: 'Emergency Lighting', quantity: 18, condition: 'Excellent' }
      ],
      issues: ['All systems functioning optimally']
    }
  ];

  const notices = [
    {
      id: 1,
      type: 'urgent',
      title: 'Scheduled Maintenance - Dining Hall',
      date: '2024-08-05',
      content: 'Kitchen deep cleaning scheduled for this weekend. Alternative meal arrangements in place.'
    },
    {
      id: 2,
      type: 'info',
      title: 'New Equipment Installation',
      date: '2024-08-03',
      content: 'New projectors installed in Lecture Rooms 101-104. Training session for faculty scheduled.'
    },
    {
      id: 3,
      type: 'warning',
      title: 'Dormitory Block B Heating',
      date: '2024-08-01',
      content: 'Heating system repair in progress. Temporary heaters provided to affected rooms.'
    }
  ];

  const handleShowDetails = (facility) => {
    setSelectedFacility(facility);
    setShowModal(true);
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'Excellent': return 'badge bg-success';
      case 'Good': return 'badge bg-primary';
      case 'Fair': return 'badge bg-warning text-dark';
      default: return 'badge bg-secondary';
    }
  };

  const getNoticeClass = (type) => {
    switch(type) {
      case 'urgent': return 'alert alert-danger';
      case 'warning': return 'alert alert-warning';
      case 'info': return 'alert alert-info';
      default: return 'alert alert-light';
    }
  };

  const styles = {
    pageContainer: {
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
      padding: '20px 0'
    },
    facilityCard: {
      background: `linear-gradient(135deg, ${colors.primary} 0%, white 100%)`,
      borderLeft: `5px solid ${colors.accent}`,
      transition: 'transform 0.2s ease',
      border: 'none'
    },
    facilityCardHover: {
      transform: 'translateY(-5px)'
    },
    facilityHeader: {
      backgroundColor: colors.secondary,
      border: 'none'
    },
    noticesCard: {
      background: `linear-gradient(135deg, ${colors.tertiary} 0%, ${colors.secondary} 100%)`,
      color: 'white',
      border: 'none'
    },
    noticesHeader: {
      backgroundColor: colors.accent,
      border: 'none'
    },
    titleAccent: {
      color: colors.accent
    },
    btnOutlineCustom: {
      borderColor: colors.accent,
      color: colors.accent,
      backgroundColor: 'transparent'
    },
    btnOutlineCustomHover: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
      color: 'white'
    },
    modalHeader: {
      backgroundColor: colors.secondary,
      borderBottom: `3px solid ${colors.accent}`
    },
    modalBody: {
      backgroundColor: colors.primary
    },
    inventoryHeader: {
      backgroundColor: colors.secondary
    },
    issuesHeader: {
      backgroundColor: colors.tertiary,
      color: 'white'
    }
  };

  return (
    <>
      {/* Bootstrap CSS CDN */}
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" 
        rel="stylesheet" 
      />
      
      <div style={styles.pageContainer}>
        <div className="container-fluid">
          {/* Header */}
          <div className="row mb-4">
            <div className="col">
              <div className="text-center" style={styles.titleAccent}>
                <h1 className="display-4 fw-bold mb-2">🏥 Zimbabwe Nursing School</h1>
                <h2 className="h3">Facilities Management Dashboard</h2>
                <p className="lead">Monitor and manage all campus facilities</p>
              </div>
            </div>
          </div>

          {/* Facilities Cards */}
          <div className="row">
            {facilities.map((facility) => (
              <div className="col-lg-4 col-md-6 mb-4" key={facility.id}>
                <div 
                  className="card h-100 shadow-sm"
                  style={styles.facilityCard}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div className="card-header text-center" style={styles.facilityHeader}>
                    <div style={{ fontSize: '2rem' }}>{facility.icon}</div>
                    <h5 className="mb-0" style={styles.titleAccent}>
                      {facility.name}
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="row mb-3">
                      <div className="col">
                        <small className="text-muted">Last Inspection</small>
                        <div className="fw-bold">{facility.lastInspection}</div>
                      </div>
                      <div className="col">
                        <small className="text-muted">Grade</small>
                        <div>
                          <span className={getStatusBadgeClass(facility.status)} style={{ fontSize: '0.9rem' }}>
                            {facility.inspectionScore}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <small className="text-muted">Status</small>
                      <div>
                        <span className={getStatusBadgeClass(facility.status)}>
                          {facility.status}
                        </span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <small className="text-muted">Key Inventory</small>
                      <div className="mt-1">
                        {facility.inventory.slice(0, 3).map((item, index) => (
                          <div key={index} className="d-flex justify-content-between py-1" style={{ fontSize: '0.85rem' }}>
                            <span>{item.item}</span>
                            <span className="text-muted">{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button 
                      className="btn btn-sm w-100"
                      style={styles.btnOutlineCustom}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = colors.accent;
                        e.target.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = colors.accent;
                      }}
                      onClick={() => handleShowDetails(facility)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Notices Card */}
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="card h-100 shadow-sm" style={styles.noticesCard}>
                <div className="card-header text-center" style={styles.noticesHeader}>
                  <div style={{ fontSize: '2rem' }}>📢</div>
                  <h5 className="mb-0">Important Notices</h5>
                </div>
                <div className="card-body">
                  {notices.map((notice) => (
                    <div key={notice.id} className={getNoticeClass(notice.type) + ' mb-2 p-2'} style={{ fontSize: '0.85rem' }}>
                      <div className="fw-bold">{notice.title}</div>
                      <small className="text-muted d-block mb-1">{notice.date}</small>
                      <div>{notice.content}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Modal */}
        {showModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header" style={styles.modalHeader}>
                  <h5 className="modal-title" style={styles.titleAccent}>
                    {selectedFacility?.icon} {selectedFacility?.name} - Detailed View
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body" style={styles.modalBody}>
                  {selectedFacility && (
                    <>
                      <div className="row mb-4">
                        <div className="col-md-4">
                          <div className="card text-center border-0" style={{ backgroundColor: 'white' }}>
                            <div className="card-body">
                              <h6>Inspection Score</h6>
                              <span className={getStatusBadgeClass(selectedFacility.status)} style={{ fontSize: '1.2rem' }}>
                                {selectedFacility.inspectionScore}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="card text-center border-0" style={{ backgroundColor: 'white' }}>
                            <div className="card-body">
                              <h6>Last Inspection</h6>
                              <div className="fw-bold">{selectedFacility.lastInspection}</div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="card text-center border-0" style={{ backgroundColor: 'white' }}>
                            <div className="card-body">
                              <h6>Overall Status</h6>
                              <span className={getStatusBadgeClass(selectedFacility.status)}>
                                {selectedFacility.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-8">
                          <div className="card border-0" style={{ backgroundColor: 'white' }}>
                            <div className="card-header" style={styles.inventoryHeader}>
                              <h6 className="mb-0">Complete Inventory</h6>
                            </div>
                            <div className="card-body">
                              <div className="list-group">
                                {selectedFacility.inventory.map((item, index) => (
                                  <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                      <div className="fw-bold">{item.item}</div>
                                      <small className="text-muted">Condition: {item.condition}</small>
                                    </div>
                                    <span className="badge bg-primary rounded-pill">{item.quantity}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="card border-0" style={{ backgroundColor: 'white' }}>
                            <div className="card-header" style={styles.issuesHeader}>
                              <h6 className="mb-0">Issues & Notes</h6>
                            </div>
                            <div className="card-body">
                              {selectedFacility.issues.map((issue, index) => (
                                <div key={index} className="alert alert-light mb-2 p-2">
                                  <small>{issue}</small>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="modal-footer" style={styles.modalBody}>
                  <button 
                    type="button" 
                    className="btn"
                    style={{ backgroundColor: colors.accent, borderColor: colors.accent, color: 'white' }}
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FacilitiesManagement;