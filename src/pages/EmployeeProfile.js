import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, Home, Users, User, Mail, Phone, MapPin, 
  Calendar, ShieldCheck, Briefcase, Clock, CheckCircle, LogOut, Coffee, AlertCircle, FileText, Plus, XCircle
} from 'lucide-react';
import { useNavigate, useLocation } from "react-router-dom";
import API_URL from '../config';

const EmployeeProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const employeeFromState = location.state?.employee;

  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const [staffRequests, setStaffRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestForm, setRequestForm] = useState({ type: '', description: '' });
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);

  // Updated Data for Employee Focus
  const employeeData = employeeFromState ? {
        id: employeeFromState.employeeId || employeeFromState._id || 'EMP-9921',
        name: employeeFromState.username || employeeFromState.firstName || 'N/A', // Use username first
        avatar: employeeFromState.avatar || employeeFromState.photo || 'https://via.placeholder.com/150',
        email: employeeFromState.email || 'N/A',
        phone: employeeFromState.phoneNumber || employeeFromState.phone || 'N/A',
        department: employeeFromState.position || 'Nursing Faculty',
        designation: employeeFromState.designation || employeeFromState.position || 'Senior Instructor',
        status: employeeFromState.accountStatus ? 'Active' : 'Inactive',
        joinDate: employeeFromState.joinDate || employeeFromState.signupTimestamp?.split('T')[0] || '2022-05-10',
        workShift: employeeFromState.shift || 'Day Shift (08:00 - 17:00)',
        username: employeeFromState.username // Add username explicitly
        } : {
        id: 'EMP-4055',
        name: 'Dr. Sarah Chen',
        username: 'sarah.chen', // Add default username
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?w=150&h=150&fit=crop',
        email: 's.chen@nursing-institute.ac.zw',
        phone: '+263 78 987 6543',
        department: 'Clinical Medicine',
        designation: 'Department Head',
        status: 'Active',
        joinDate: '2021-11-01',
        workShift: 'Morning (07:00 - 16:00)'
        };
      
    const fetchStaffRequests = async () => {
      try {
        setLoadingRequests(true);
        const username = employeeData.name;
        const response = await fetch(`${API_URL}/get-staff-requests/${username}`);
        const data = await response.json();
        setStaffRequests(data);
      } catch (error) {
        console.error('Error fetching staff requests:', error);
        setStaffRequests([]);
      } finally {
        setLoadingRequests(false);
      }
    };

    const handleRequestSubmit = async (e) => {
      e.preventDefault();
      setIsSubmittingRequest(true);
      try {
        const response = await fetch(`${API_URL}/add-staff-request`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: employeeData.name,
            type: requestForm.type,
            description: requestForm.description
          })
        });

        const data = await response.json();
        if (data.success) {
          setShowRequestModal(false);
          setRequestForm({ type: '', description: '' });
          fetchStaffRequests();
        }
      } catch (error) {
        console.error('Error submitting request:', error);
      } finally {
        setIsSubmittingRequest(false);
      }
    };

    useEffect(() => {
    const fetchAttendance = async () => {
        try {
        setLoading(true);
        
        // Get the username from the employee data
        const username = employeeData.name || employeeFromState?.username;
        
        if (!username) {
            console.error('No username available');
            setLoading(false);
            return;
        }

        const response = await fetch(
            `${API_URL}/get-employee-timesheet/${username}`
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch attendance');
        }
        
        const data = await response.json();
        setAttendanceRecords(data);
        
        } catch (error) {
        console.error("Error fetching attendance:", error);
        setAttendanceRecords([]);
        } finally {
        setLoading(false);
        }
    };

    fetchAttendance();
    fetchStaffRequests(); 
    }, [employeeData.name, employeeFromState?.username]);

  const colors = {
    primary: '#0F172A',    // Slate Dark
    secondary: '#2563EB',  // Strong Blue
    tertiary: '#F1F5F9',   // Light Slate
    success: '#10B981',
    warning: '#F59E0B',
    background: '#F8FAFC'
  };

  const styles = {
    body: { backgroundColor: colors.background, minHeight: '100vh', padding: '20px', fontFamily: 'Inter, sans-serif' },
    breadcrumb: { backgroundColor: 'white', padding: '15px 20px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
    card: { backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', marginBottom: '20px', overflow: 'hidden', border: '1px solid #E2E8F0' },
    cardHeader: { backgroundColor: colors.primary, color: 'white', padding: '15px 20px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px' },
    profileSection: { display: 'flex', gap: '30px', alignItems: 'start', flexWrap: 'wrap', padding: '25px' },
    avatar: { width: '120px', height: '120px', borderRadius: '12px', objectFit: 'cover', border: `3px solid ${colors.tertiary}` },
    infoItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: colors.tertiary, borderRadius: '8px' },
    attendanceRow: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', padding: '15px', borderBottom: '1px solid #EDF2F7', alignItems: 'center' }
  };

  return (
    <div style={styles.body}>
      <div className="container-fluid">
        {/* Breadcrumbs */}
        <nav style={styles.breadcrumb}>
          <div onClick={() => navigate("/")} className="cursor-pointer d-flex align-items-center gap-1 text-primary small">
            <Home size={14} /> HR Dashboard
          </div>
          <ChevronRight size={14} color="#CBD5E1" />
          <div onClick={() => navigate("/staff")} className="cursor-pointer d-flex align-items-center gap-1 text-primary small">
            <Users size={14} /> Directory
          </div>
          <ChevronRight size={14} color="#CBD5E1" />
          <span className="small text-muted">Employee Profile</span>
        </nav>

        {/* Employee Identity Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <Briefcase size={18} /> Professional Profile
          </div>
          <div style={styles.profileSection}>
            <img src={employeeData.avatar} alt={employeeData.name} style={styles.avatar} />
            <div className="flex-grow-1">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h3 className="mb-1" style={{ fontWeight: '700', color: colors.primary }}>{employeeData.name}</h3>
                  <p className="text-primary fw-medium mb-3">{employeeData.designation} • {employeeData.department}</p>
                </div>
                <span style={{ backgroundColor: '#D1FAE5', color: '#065F46', padding: '5px 15px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700' }}>
                  {employeeData.status.toUpperCase()}
                </span>
              </div>
              
              <div className="row g-3">
                <div className="col-md-4">
                  <div style={styles.infoItem}><Mail size={16} color={colors.secondary} /><span className="small text-truncate">{employeeData.email}</span></div>
                </div>
                <div className="col-md-4">
                  <div style={styles.infoItem}><Phone size={16} color={colors.secondary} /><span className="small">{employeeData.phone}</span></div>
                </div>
                <div className="col-md-4">
                  <div style={styles.infoItem}><Calendar size={16} color={colors.secondary} /><span className="small">Joined: {employeeData.joinDate}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Activity Table */}
        {/* Attendance Activity Table */}
        <div style={styles.card}>
        <div style={{...styles.cardHeader, backgroundColor: colors.secondary}}>
            <Clock size={18} /> Recent Attendance & Timekeeping Activity
        </div>
        <div className="table-responsive">
            <div style={{...styles.attendanceRow, backgroundColor: '#F8FAFC', fontWeight: '700', fontSize: '0.8rem', color: '#64748B'}}>
            <span>DATE</span>
            <span>CLOCK IN</span>
            <span>CLOCK OUT</span>
            <span>TOTAL HOURS</span>
            <span>STATUS</span>
            </div>
            
            {loading ? (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
                </div>
                <p className="text-muted mt-3">Loading attendance records...</p>
            </div>
            ) : attendanceRecords.length === 0 ? (
            <div className="text-center py-5">
                <AlertCircle size={48} color="#CBD5E1" className="mb-3" />
                <p className="text-muted">No attendance records found for this employee</p>
                <small className="text-muted">Records will appear once the employee starts clocking in</small>
            </div>
            ) : (
            attendanceRecords.map((log, index) => (
                <div key={log._id || index} style={styles.attendanceRow} className="small">
                <span className="fw-bold">
                    {new Date(log.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                    })}
                </span>
                <span className="text-success d-flex align-items-center gap-1">
                    <LogOut size={14} /> {log.clockIn || 'N/A'}
                </span>
                <span className="text-danger d-flex align-items-center gap-1">
                    <LogOut size={14} /> {log.clockOut || 'Not clocked out'}
                </span>
                <span className="text-muted">{log.duration || 'N/A'}</span>
                <span>
                    <span style={{
                    padding: '3px 10px', 
                    borderRadius: '12px', 
                    fontSize: '0.7rem',
                    backgroundColor: log.status === 'Present' ? '#DCFCE7' : '#FEF3C7',
                    color: log.status === 'Present' ? '#166534' : '#92400E'
                    }}>
                    {log.status || 'N/A'}
                    </span>
                </span>
                </div>
            ))
            )}
        </div>
        <div className="p-3 bg-light border-top text-center">
            <button className="btn btn-sm btn-outline-primary fw-bold px-4">
            View Full Timesheet History
            </button>
        </div>
        </div>

        {/* Staff Requests Card */}
        <div style={styles.card}>
          <div style={{
            ...styles.cardHeader,
            backgroundColor: '#0F172A',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileText size={18} /> Staff Requests
            </span>
          </div>

          <div className="p-3">
            {loadingRequests ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="text-muted mt-2 small">Loading requests...</p>
              </div>
            ) : staffRequests.length === 0 ? (
              <div className="text-center py-4">
                <FileText size={40} color="#CBD5E1" />
                <p className="text-muted mt-2 small">No requests submitted yet</p>
              </div>
            ) : (
              staffRequests.map((request, index) => (
                <div
                  key={request._id || index}
                  style={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '10px',
                    padding: '15px',
                    marginBottom: '12px',
                    borderLeft: `4px solid ${
                      request.status === 'Approved' ? '#10B981' :
                      request.status === 'Rejected' ? '#EF4444' : '#F59E0B'
                    }`
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ flex: 1 }}>
                      {/* Type Badge */}
                      <span style={{
                        backgroundColor: '#EFF6FF',
                        color: '#2563EB',
                        padding: '3px 10px',
                        borderRadius: '12px',
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        marginBottom: '8px',
                        display: 'inline-block'
                      }}>
                        {request.type}
                      </span>

                      <p style={{
                        color: '#334155',
                        fontSize: '0.875rem',
                        margin: '8px 0 10px 0',
                        lineHeight: '1.5'
                      }}>
                        {request.description}
                      </p>

                      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                        <small style={{ color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} />
                          {new Date(request.createdAt).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric'
                          })}
                        </small>
                        {request.statusUpdatedBy && (
                          <small style={{ color: '#94A3B8' }}>
                            Reviewed by: <strong>{request.statusUpdatedBy}</strong>
                          </small>
                        )}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '5px 12px',
                      borderRadius: '20px',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      marginLeft: '15px',
                      whiteSpace: 'nowrap',
                      backgroundColor:
                        request.status === 'Approved' ? '#DCFCE7' :
                        request.status === 'Rejected' ? '#FEE2E2' : '#FEF3C7',
                      color:
                        request.status === 'Approved' ? '#065F46' :
                        request.status === 'Rejected' ? '#991B1B' : '#92400E'
                    }}>
                      {request.status === 'Approved' && <CheckCircle size={12} />}
                      {request.status === 'Rejected' && <XCircle size={12} />}
                      {request.status === 'Pending' && <AlertCircle size={12} />}
                      {request.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Weekly Stats Summary */}
        <div className="row">
          <div className="col-md-4">
            <div className="p-4 rounded-3 text-white mb-3" style={{ background: 'linear-gradient(135deg, #1E293B, #334155)' }}>
              <p className="small mb-1 opacity-75">Work Shift</p>
              <h5 className="mb-0">{employeeData.workShift}</h5>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-4 rounded-3 text-white mb-3" style={{ background: 'linear-gradient(135deg, #2563EB, #3B82F6)' }}>
              <p className="small mb-1 opacity-75">Attendance Rate</p>
              <h5 className="mb-0">98.4% This Month</h5>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-4 rounded-3 text-white mb-3" style={{ background: 'linear-gradient(135deg, #059669, #10B981)' }}>
              <p className="small mb-1 opacity-75">Leave Balance</p>
              <h5 className="mb-0">14 Days Available</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;