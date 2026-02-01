import React, { useState, useMemo, useEffect } from 'react';
import { Search, Download, Edit2, Trash2, Home, CreditCard, UserCheck ,ArrowRightLeft, UserPlus, UserMinus, X , Upload, Loader } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudentsPage = () => {

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const [activeModal, setActiveModal] = useState(null); // 'move', 'assign', or 'deactivate'
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({ house: '', dormNumber: '' });

  const [showOccupancyModal, setShowOccupancyModal] = useState(false);
  const [occupancyData, setOccupancyData] = useState(null);
  const [selectedHouse, setSelectedHouse] = useState('Adlam House');
  const [occupancySearch, setOccupancySearch] = useState('');

    // Filters state adjusted for Dorms and Rent
  const [filters, setFilters] = useState({
      search: '',
      dormHouse: '',
      rentStatus: '',
      gender: '',
      status: ''
    });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rentFormData, setRentFormData] = useState({
    month: new Date().toISOString().slice(0, 7), // Format: YYYY-MM
    proofOfPayment: null,
    proofOfPaymentPreview: null
  });

  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const fetchOccupancyData = async () => {
    try {
      const response = await fetch('https://nursing-school-backend--thomasmethembe4.replit.app/get-room-occupancy');
      const data = await response.json();
      setOccupancyData(data);
      setShowOccupancyModal(true);
    } catch (error) {
      console.error('Error fetching occupancy:', error);
      alert('Failed to load room occupancy data');
    }
  };

  // Add these handler functions before the return statement:
  const handleAssignStudent = async () => {
  try {
    setIsSubmitting(true);
    const response = await fetch('https://nursing-school-backend--thomasmethembe4.replit.app/assign-student-housing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: selectedStudent.studentId,
        house: formData.house,
        roomNumber: formData.dormNumber,
        performedBy: 'admin'
      })
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message);
      return;
    }

    setStudents(prevStudents => 
      prevStudents.map(s => 
        s.studentId === selectedStudent.studentId 
          ? { ...s, dormHouse: formData.house, dormNumber: formData.dormNumber }
          : s
      )
    );

    toast.success('Student assigned successfully!');
    closeModal();

  } catch (error) {
    console.error('Error assigning student:', error);
    toast.error('Failed to assign student');
  } finally {
    setIsSubmitting(false);
  }
};

  const handleMoveStudent = async () => {
  try {
    setIsSubmitting(true);
    const response = await fetch('https://nursing-school-backend--thomasmethembe4.replit.app/move-student-housing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: selectedStudent.studentId,
        currentHouse: selectedStudent.dormHouse,
        currentRoom: selectedStudent.dormNumber,
        newHouse: formData.house,
        newRoom: formData.dormNumber,
        performedBy: 'admin'
      })
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message);
      return;
    }

    setStudents(prevStudents => 
      prevStudents.map(s => 
        s.studentId === selectedStudent.studentId 
          ? { ...s, dormHouse: formData.house, dormNumber: formData.dormNumber }
          : s
      )
    );

    toast.success('Student moved successfully!');
    closeModal();

  } catch (error) {
    console.error('Error moving student:', error);
    toast.error('Failed to move student');
  } finally {
    setIsSubmitting(false);
  }
};

  const handleDeactivateStudent = async () => {
  try {
    setIsSubmitting(true);
    const response = await fetch('https://nursing-school-backend--thomasmethembe4.replit.app/deactivate-student-housing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: selectedStudent.studentId,
        house: selectedStudent.dormHouse,
        roomNumber: selectedStudent.dormNumber,
        performedBy: 'admin'
      })
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message);
      return;
    }

    setStudents(prevStudents => 
      prevStudents.map(s => 
        s.studentId === selectedStudent.studentId 
          ? { ...s, dormHouse: '', dormNumber: '' }
          : s
      )
    );

    toast.success('Student housing deactivated successfully!');
    closeModal();

  } catch (error) {
    console.error('Error deactivating student:', error);
    toast.error('Failed to deactivate student');
  } finally {
    setIsSubmitting(false);
  }
};

  const handleUpdateRentStatus = async () => {
  try {
    setIsSubmitting(true);

    if (!rentFormData.month) {
      toast.error('Please select a month');
      setIsSubmitting(false);
      return;
    }

    if (!rentFormData.proofOfPayment) {
      toast.error('Please upload proof of payment');
      setIsSubmitting(false);
      return;
    }

    // Upload image to Cloudinary first
    const formData = new FormData();
    formData.append('image', rentFormData.proofOfPayment);

    const uploadResponse = await fetch('https://nursing-school-backend--thomasmethembe4.replit.app/upload', {
      method: 'POST',
      body: formData
    });

    const uploadData = await uploadResponse.json();

    if (!uploadData.success) {
      toast.error('Failed to upload proof of payment');
      setIsSubmitting(false);
      return;
    }

    // Get current user ID (you'll need to pass this from your auth context)
    const currentUserId = 'admin'; // Replace with actual user ID from context

    // Submit rental record
    const response = await fetch('https://nursing-school-backend--thomasmethembe4.replit.app/add-rental-record', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: selectedStudent.studentId,
        month: rentFormData.month,
        proofOfPaymentUrl: uploadData.url,
        approvedBy: currentUserId,
        status: 'Paid'
      })
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message || 'Failed to update rent status');
      setIsSubmitting(false);
      return;
    }

    // Update local state
    setStudents(prevStudents => 
      prevStudents.map(s => 
        s.studentId === selectedStudent.studentId 
          ? { ...s, rentStatus: 'Paid' }
          : s
      )
    );

    toast.success('Rent status updated successfully!');
    closeModal();

  } catch (error) {
    console.error('Error updating rent:', error);
    toast.error('Failed to update rent status');
  } finally {
    setIsSubmitting(false);
  }
};

  const closeModal = () => {
  setActiveModal(null);
  setSelectedStudent(null);
  setFormData({ house: '', dormNumber: '' });
  setRentFormData({
    month: new Date().toISOString().slice(0, 7),
    proofOfPayment: null,
    proofOfPaymentPreview: null
  });
  setIsSubmitting(false);
};

    useEffect(() => {
      const fetchStudents = async () => {
        try {
          const response = await fetch('https://nursing-school-backend--thomasmethembe4.replit.app/get-students-with-housing');
          const data = await response.json();
          setStudents(data);
        } catch (error) {
          console.error('Error fetching students:', error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchStudents();
    }, []);

  // Filter options
  const filterOptions = useMemo(() => ({
    houses: ['Adlam House', 'Nurse Home'],
    rentStatuses: ['Paid', 'Arrears', 'Pending'],
    genders: ['Male', 'Female'],
    statuses: ['Active', 'Inactive']
  }), []);

    const filteredStudents = useMemo(() => {
      return students.filter(student => {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch = 
          (student.name?.toLowerCase() || '').includes(searchTerm) ||
          (student.username?.toLowerCase() || '').includes(searchTerm) ||
          (student.studentId?.toLowerCase() || '').includes(searchTerm) ||
          (student._id?.toString() || '').includes(searchTerm);
        
        return matchesSearch &&
          (filters.dormHouse === '' || student.dormHouse === filters.dormHouse) &&
          (filters.rentStatus === '' || student.rentStatus === filters.rentStatus) &&
          (filters.gender === '' || student.gender === filters.gender) &&
          (filters.status === '' || student.status === filters.status);
      });
    }, [students, filters]);

  // Campus-relevant stats
  const stats = useMemo(() => {
    return {
      totalResidents: filteredStudents.length,
      paidRent: filteredStudents.filter(s => s.rentStatus === 'Paid').length,
      inArrears: filteredStudents.filter(s => s.rentStatus === 'Arrears').length
    };
  }, [filteredStudents]);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const styles = {
    body: { backgroundColor: '#F0F7FF', minHeight: '100vh', padding: '20px', fontFamily: 'Arial, sans-serif' },
    header: { color: '#1E3A8A', fontWeight: 'bold', textAlign: 'center', marginBottom: '30px', fontSize: '2.5rem' },
    card: { border: 'none', borderRadius: '12px', boxShadow: '0 4px 6px rgba(30, 58, 138, 0.1)', marginBottom: '20px', backgroundColor: 'white' },
    statCard: { textAlign: 'center', padding: '25px 20px', color: 'white' },
    statNumber: { fontSize: '2.2rem', fontWeight: 'bold' },
    statLabel: { fontSize: '1rem', opacity: 0.9, marginTop: '5px' },
    filterBar: { backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(30, 58, 138, 0.1)', marginBottom: '20px' },
    tableHeader: { backgroundColor: '#1E3A8A', color: 'white', padding: '15px 20px', borderRadius: '12px 12px 0 0', display: 'flex', justifyContent: 'space-between' },
    th: { backgroundColor: '#3B82F6', color: 'white', padding: '15px 12px', textAlign: 'left', fontSize: '0.9rem' },
    td: { padding: '15px 12px', borderBottom: '1px solid #DBEAFE', fontSize: '0.9rem' },
    input: { border: '2px solid #DBEAFE', borderRadius: '8px', padding: '10px', fontSize: '0.9rem', width: '100%' },
    select: { border: '2px solid #DBEAFE', borderRadius: '8px', padding: '10px', fontSize: '0.9rem', width: '100%', cursor: 'pointer' },
    avatar: { width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' },
    modalOverlay: {
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center',
      alignItems: 'center', zIndex: 1000
    },
    modalContent: {
      backgroundColor: 'white', padding: '30px', borderRadius: '12px',
      width: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
    },
  };

  return (
    <div style={styles.body}>
      <div className="container-fluid">
        <h1 style={styles.header}>Dormitory Residents Management</h1>

        {/* Relevant Stats Cards */}
        <div className="row mb-4">
          <div className="col-md-4">
            <div style={{...styles.card, background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)'}}>
              <div style={styles.statCard}>
                <div style={styles.statNumber}><Home size={28} className="me-2"/> {stats.totalResidents}</div>
                <div style={styles.statLabel}>Total Residents</div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div style={{...styles.card, background: 'linear-gradient(135deg, #10B981, #34D399)'}}>
              <div style={styles.statCard}>
                <div style={styles.statNumber}><UserCheck size={28} className="me-2"/> {stats.paidRent}</div>
                <div style={styles.statLabel}>Paid Rent</div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div style={{...styles.card, background: 'linear-gradient(135deg, #EF4444, #F87171)'}}>
              <div style={styles.statCard}>
                <div style={styles.statNumber}><CreditCard size={28} className="me-2"/> {stats.inArrears}</div>
                <div style={styles.statLabel}>In Arrears</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div style={styles.filterBar}>
          <div className="row g-3">
            <div className="col-lg-4">
              <label className="fw-bold mb-1" style={{color: '#1E3A8A'}}>Search Residents</label>
              <div style={{position: 'relative'}}>
                <Search size={18} style={{position: 'absolute', left: '12px', top: '12px', color: '#3B82F6'}} />
                <input type="text" placeholder="Name or Student ID..." value={filters.search} onChange={(e) => handleFilterChange('search', e.target.value)} style={{...styles.input, paddingLeft: '40px'}} />
              </div>
            </div>
            <div className="col-lg-2">
              <label className="fw-bold mb-1" style={{color: '#1E3A8A'}}>Dorm House</label>
              <select value={filters.dormHouse} onChange={(e) => handleFilterChange('dormHouse', e.target.value)} style={styles.select}>
                <option value="">All Houses</option>
                {filterOptions.houses.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
            <div className="col-lg-2">
              <label className="fw-bold mb-1" style={{color: '#1E3A8A'}}>Rent Status</label>
              <select value={filters.rentStatus} onChange={(e) => handleFilterChange('rentStatus', e.target.value)} style={styles.select}>
                <option value="">All Statuses</option>
                {filterOptions.rentStatuses.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="col-lg-2">
              <label className="fw-bold mb-1" style={{color: '#1E3A8A'}}>Gender</label>
              <select value={filters.gender} onChange={(e) => handleFilterChange('gender', e.target.value)} style={styles.select}>
                <option value="">All Genders</option>
                {filterOptions.genders.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Residents Table */}
        <div style={{backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)'}}>
          <div style={styles.tableHeader}>
            <h5 className="m-0">Resident Database</h5>
            <div className="d-flex align-items-center gap-3">
              <button 
                className="btn btn-sm btn-light d-flex align-items-center gap-2"
                onClick={fetchOccupancyData}
              >
                <Home size={16} /> View Room Occupancy
              </button>
              <small>{filteredStudents.length} Residents Found</small>
            </div>
          </div>
          <div style={{overflowX: 'auto'}}>
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
              <thead>
                <tr>
                  <th style={styles.th}>Resident</th>
                  <th style={styles.th}>Student ID</th>
                  <th style={styles.th}>House</th>
                  <th style={styles.th}>Room</th>
                  <th style={styles.th}>Rent Status</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>



              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" style={{...styles.td, textAlign: 'center', padding: '40px'}}>
                      <Loader size={40} className="spinner-border text-primary" />
                      <p className="mt-3 text-muted">Loading residents...</p>
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{...styles.td, textAlign: 'center', padding: '40px'}}>
                      <p className="text-muted">No residents found</p>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                  <tr key={student.id} style={{backgroundColor: 'white'}}>
                    <td style={styles.td}>
                      <div 
                        className="d-flex align-items-center gap-2" 
                        style={{cursor: 'pointer'}} 
                        onClick={() => navigate("/student-profile", { state: { student } })}
                      >
                        <img src={student.avatar || student.photo || 'https://via.placeholder.com/40'} style={styles.avatar} alt="avatar" />
                        <div>
                          <div className="fw-bold" style={{color: '#1E3A8A'}}>{student.username}</div>
                          <small className="text-muted">{student.firstName} {student.lastName}</small>
                        </div>
                      </div>
                    </td>
                    <td style={{...styles.td, fontWeight: 'bold'}}>{student.studentId}</td>
                    <td style={styles.td}>
                      {student.dormHouse || <span className="text-muted italic">Not Assigned</span>}
                    </td>
                    <td style={styles.td}>
                      {student.dormNumber || <span className="text-muted">-</span>}
                    </td>
                    <td style={styles.td}>
                      <span className={`badge ${student.rentStatus === 'Paid' ? 'bg-success' : 'bg-danger'}`}>
                        {student.rentStatus}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span 
                        className={`badge rounded-pill border ${
                          student.accountStatus ? 'bg-success-subtle text-success border-success' : 'bg-light text-muted border-secondary'
                        }`}
                        style={{ padding: '5px 12px' }}
                      >
                        {student.accountStatus ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div className="d-flex gap-2">
                        {/* If student has no dormHouse or dormNumber, show only Assign */}
                        {(!student.dormHouse || !student.dormNumber) ? (
                          <button 
                            title="Assign"
                            className="btn btn-sm btn-success d-flex align-items-center gap-1"
                            onClick={() => { setSelectedStudent(student); setActiveModal('assign'); }}
                          >
                            <UserPlus size={14}/> Assign Residency
                          </button>
                        ) : (
                          <>
                            {/* If student IS assigned, show Move and Deactivate */}
                            <button 
                              title="Move"
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => { setSelectedStudent(student); setActiveModal('move'); }}
                            >
                              <ArrowRightLeft size={14}/>
                            </button>

                            <button 
                              title="Deactivate"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => { setSelectedStudent(student); setActiveModal('deactivate'); }}
                            >
                              <UserMinus size={14}/>
                            </button>

                            <button 
                              title="Update Rent"
                              className="btn btn-sm btn-outline-success"
                              onClick={() => { 
                                setSelectedStudent(student); 
                                setActiveModal('rent'); 
                                setFormData({ rentStatus: student.rentStatus || 'Pending' }); 
                              }}
                            >
                              <CreditCard size={14}/>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Action Modals */}
        {activeModal && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="m-0" style={{color: '#1E3A8A'}}>
                  {activeModal === 'move' && 'Move Resident'}
                  {activeModal === 'assign' && 'Assign Dorm'}
                  {activeModal === 'deactivate' && 'Confirm Deactivation'}
                </h4>
                <X size={20} style={{cursor: 'pointer'}} onClick={closeModal} />
              </div>

              {activeModal === 'deactivate' ? (
                <div>
                  <p>Are you sure you want to deactivate the residency for <strong>{selectedStudent?.name}</strong>?</p>
                  <div className="d-flex gap-2 mt-4">
                    <button 
                      className="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2" 
                      onClick={handleDeactivateStudent}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader size={16} className="spinner-border spinner-border-sm" />
                          Processing...
                        </>
                      ) : (
                        'Confirm Deactivation'
                      )}
                    </button>
                    <button className="btn btn-light w-100" onClick={closeModal}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-3">
                    <label className="fw-bold mb-1">Select House</label>
                    <select 
                      style={styles.select}
                      value={formData.house}
                      onChange={(e) => setFormData({...formData, house: e.target.value})}
                    >
                      <option value="">Select...</option>
                      <option value="Adlam House">Adlam House</option>
                      <option value="Nurse Home">Nurse Home</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="fw-bold mb-1">Dorm Number</label>
                    <textarea 
                      style={styles.input}
                      rows="2"
                      placeholder="Enter dorm/room number..."
                      value={formData.dormNumber}
                      onChange={(e) => setFormData({...formData, dormNumber: e.target.value})}
                    />
                  </div>
                  <button 
                    className="btn btn-primary w-100 mt-2 d-flex align-items-center justify-content-center gap-2" 
                    onClick={activeModal === 'move' ? handleMoveStudent : handleAssignStudent}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader size={16} className="spinner-border spinner-border-sm" />
                        Processing...
                      </>
                    ) : (
                      `Submit ${activeModal === 'move' ? 'Move' : 'Assignment'}`
                    )}
                  </button>
                </div>
              )}

                {activeModal === 'rent' && (
                  <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 className="m-0" style={{color: '#1E3A8A'}}>Update Rent Payment</h4>
                        <X size={20} style={{cursor: 'pointer'}} onClick={closeModal} />
                      </div>

                      <div className="mb-4 text-center">
                        <h6 className="text-muted">Student:</h6>
                        <h5 style={{color: '#1E3A8A'}}>{selectedStudent?.username}</h5>
                        <small className="text-muted">{selectedStudent?.studentId}</small>
                      </div>

                      <div className="mb-3">
                        <label className="fw-bold mb-1">Payment Month</label>
                        <input 
                          type="month"
                          style={styles.input}
                          value={rentFormData.month}
                          onChange={(e) => setRentFormData({...rentFormData, month: e.target.value})}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="fw-bold mb-1">Proof of Payment</label>
                        <input 
                          type="file"
                          accept="image/*"
                          style={{...styles.input, cursor: 'pointer'}}
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setRentFormData({
                                ...rentFormData, 
                                proofOfPayment: file,
                                proofOfPaymentPreview: URL.createObjectURL(file)
                              });
                            }
                          }}
                        />
                        {rentFormData.proofOfPaymentPreview && (
                          <div className="mt-2">
                            <img 
                              src={rentFormData.proofOfPaymentPreview} 
                              alt="Preview" 
                              style={{width: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '8px'}}
                            />
                          </div>
                        )}
                      </div>

                      <button 
                        className="btn btn-success w-100 mt-2 d-flex align-items-center justify-content-center gap-2" 
                        onClick={handleUpdateRentStatus}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader size={16} className="spinner-border spinner-border-sm" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Upload size={16} />
                            Submit Payment Record
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
            </div>
          </div>
        )}


        {/* Room Occupancy Modal */}
        {showOccupancyModal && occupancyData && (
          <div style={styles.modalOverlay} onClick={() => setShowOccupancyModal(false)}>
            <div 
              style={{
                ...styles.modalContent, 
                width: '90%', 
                maxWidth: '1200px', 
                maxHeight: '90vh', 
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }} 
              onClick={(e) => e.stopPropagation()}
            >
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="m-0" style={{color: '#1E3A8A'}}>
                  <Home size={24} className="me-2" />
                  Room Occupancy Overview
                </h4>
                <X size={24} style={{cursor: 'pointer'}} onClick={() => setShowOccupancyModal(false)} />
              </div>

              {/* House Selector */}
              <div className="mb-3">
                <div className="btn-group w-100" role="group">
                  <button 
                    className={`btn ${selectedHouse === 'Adlam House' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setSelectedHouse('Adlam House')}
                  >
                    Adlam House ({occupancyData.adlamHouse.totalRooms} rooms)
                  </button>
                  <button 
                    className={`btn ${selectedHouse === 'Nurse Home' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setSelectedHouse('Nurse Home')}
                  >
                    Nurse Home ({occupancyData.nurseHome.totalRooms} rooms)
                  </button>
                </div>
              </div>

              {/* Stats Summary */}
              <div className="row mb-3">
                <div className="col-4">
                  <div className="text-center p-2 rounded" style={{backgroundColor: '#DBEAFE'}}>
                    <div className="fw-bold" style={{color: '#1E3A8A', fontSize: '1.5rem'}}>
                      {selectedHouse === 'Adlam House' ? occupancyData.adlamHouse.available : occupancyData.nurseHome.available}
                    </div>
                    <small className="text-muted">Available</small>
                  </div>
                </div>
                <div className="col-4">
                  <div className="text-center p-2 rounded" style={{backgroundColor: '#FEF3C7'}}>
                    <div className="fw-bold" style={{color: '#92400E', fontSize: '1.5rem'}}>
                      {selectedHouse === 'Adlam House' ? occupancyData.adlamHouse.occupied : occupancyData.nurseHome.occupied}
                    </div>
                    <small className="text-muted">Occupied</small>
                  </div>
                </div>
                <div className="col-4">
                  <div className="text-center p-2 rounded" style={{backgroundColor: '#FEE2E2'}}>
                    <div className="fw-bold" style={{color: '#991B1B', fontSize: '1.5rem'}}>
                      {selectedHouse === 'Adlam House' ? occupancyData.adlamHouse.full : occupancyData.nurseHome.full}
                    </div>
                    <small className="text-muted">Full</small>
                  </div>
                </div>
              </div>

              {/* Search */}
              <div className="mb-3">
                <div style={{position: 'relative'}}>
                  <Search size={18} style={{position: 'absolute', left: '12px', top: '12px', color: '#3B82F6'}} />
                  <input 
                    type="text" 
                    placeholder="Search by room number or student..." 
                    value={occupancySearch} 
                    onChange={(e) => setOccupancySearch(e.target.value)} 
                    style={{...styles.input, paddingLeft: '40px'}} 
                  />
                </div>
              </div>

              {/* Rooms Grid */}
              <div style={{flex: 1, overflowY: 'auto'}}>
                <div className="row g-2">
                  {(selectedHouse === 'Adlam House' ? occupancyData.adlamHouse.rooms : occupancyData.nurseHome.rooms)
                    .filter(room => 
                      room.roomNumber.toLowerCase().includes(occupancySearch.toLowerCase()) ||
                      room.residents.some(r => r.username?.toLowerCase().includes(occupancySearch.toLowerCase()))
                    )
                    .map((room) => (
                      <div key={room.roomNumber} className="col-md-4 col-lg-3">
                        <div 
                          className="p-3 rounded border"
                          style={{
                            backgroundColor: room.occupancy === 0 ? '#F0FDF4' : room.occupancy >= 2 ? '#FEE2E2' : '#FEF3C7',
                            borderColor: room.occupancy === 0 ? '#10B981' : room.occupancy >= 2 ? '#EF4444' : '#F59E0B'
                          }}
                        >
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h6 className="m-0 fw-bold" style={{color: '#1E3A8A'}}>{room.roomNumber}</h6>
                            <span className={`badge ${room.occupancy === 0 ? 'bg-success' : room.occupancy >= 2 ? 'bg-danger' : 'bg-warning text-dark'}`}>
                              {room.occupancy}/2
                            </span>
                          </div>
                          
                          {room.occupancy === 0 ? (
                            <small className="text-muted">Empty Room</small>
                          ) : (
                            <div className="mt-2">
                              {room.residents.map((resident, idx) => (
                                <div key={idx} className="d-flex align-items-center gap-2 mb-1">
                                  <img 
                                    src={resident.photo || 'https://via.placeholder.com/30'} 
                                    style={{width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover'}}
                                    alt="resident"
                                  />
                                  <div style={{fontSize: '0.85rem'}}>
                                    <div className="fw-bold" style={{color: '#1E3A8A'}}>{resident.username}</div>
                                    <small className="text-muted">{resident.studentId}</small>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

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

export default StudentsPage;