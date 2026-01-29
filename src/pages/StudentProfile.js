import React, { useState } from 'react';
import { 
  ChevronRight, Home, Users, User, Mail, Phone, MapPin, 
  Calendar, ShieldCheck, DollarSign, CheckCircle, Clock, 
  Wrench, AlertTriangle, Bed, Hash
} from 'lucide-react';
import { useNavigate , useLocation } from "react-router-dom";

const StudentProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const studentFromState = location.state?.student;

  // Updated Student Data for Dormitory Focus
  const studentData = studentFromState ? {
      id: studentFromState.studentId || studentFromState._id?.toString().slice(-6).toUpperCase() || 'N/A',
      name: studentFromState.name || studentFromState.username || 'N/A',
      avatar: studentFromState.avatar || studentFromState.photo || 'https://via.placeholder.com/150',
      email: studentFromState.email || 'N/A',
      phone: studentFromState.phone || 'N/A',
      address: studentFromState.address || 'N/A',
      age: studentFromState.age || 'N/A',
      dormHouse: studentFromState.dormHouse || 'Not Assigned',
      roomNumber: studentFromState.dormNumber || 'N/A',
      studentStatus: studentFromState.accountStatus ? 'Active' : 'Inactive',
      rentStatus: studentFromState.rentStatus || 'N/A',
      dateStarted: studentFromState.dateStarted || studentFromState.signupTimestamp || 'N/A',
      gender: studentFromState.gender || 'N/A'
    } : {
      id: 'ZNS001',
      name: 'Tendai Mukamuri',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      email: 'tendai.mukamuri@student.zns.ac.zw',
      phone: '+263 77 123 4567',
      address: '15 Josiah Tongogara Avenue, Harare, Zimbabwe',
      age: 21,
      dormHouse: 'Nurse Home',
      roomNumber: 'A12',
      studentStatus: 'Active',
      rentStatus: 'Paid',
      dateStarted: '2023-02-15',
      gender: 'Female'
    };

  // Maintenance/Breakage Records
  const breakageRecords = [
    {
      id: 1,
      item: 'Window Latch',
      dateReported: '2026-01-10',
      status: 'Fixed',
      priority: 'Low',
      description: 'Latch was loose and wouldn’t lock properly.'
    },
    {
      id: 2,
      item: 'Shower Head',
      dateReported: '2026-01-22',
      status: 'Pending',
      priority: 'Medium',
      description: 'Low water pressure due to calcium buildup.'
    },
    {
      id: 3,
      item: 'Study Desk Light',
      dateReported: '2026-01-27',
      status: 'In Progress',
      priority: 'High',
      description: 'Electrical flickering; needs wiring check.'
    }
  ];

  // Attendance data
  const attendanceData = {
    percentage: 92,
    attendedDays: 110,
    totalDays: 120,
    status: 'Excellent'
  };

  const colors = {
    primary: '#1E3A8A',    // Navy Blue
    secondary: '#3B82F6',  // Royal Blue
    tertiary: '#DBEAFE',   // Sky Blue
    background: '#F0F7FF', // Light Blue Tint
    accent: '#10B981'      // Success Green
  };

  const styles = {
    body: { backgroundColor: colors.background, minHeight: '100vh', padding: '20px', fontFamily: 'Arial, sans-serif' },
    breadcrumb: { backgroundColor: 'white', padding: '15px 20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(30, 58, 138, 0.05)', display: 'flex', alignItems: 'center', gap: '8px' },
    breadcrumbLink: { color: colors.secondary, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem' },
    card: { backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(30, 58, 138, 0.1)', marginBottom: '20px', overflow: 'hidden' },
    cardHeader: { backgroundColor: colors.primary, color: 'white', padding: '15px 20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' },
    profileSection: { display: 'flex', gap: '30px', alignItems: 'start', flexWrap: 'wrap', padding: '25px' },
    avatar: { width: '130px', height: '130px', borderRadius: '50%', objectFit: 'cover', border: `4px solid ${colors.tertiary}`, marginBottom: '15px' },
    infoGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px', flex: 1 },
    infoItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 15px', backgroundColor: colors.tertiary, borderRadius: '8px' },
    statusBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' },
    breakageCard: { padding: '15px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', marginBottom: '10px' }
  };

  return (
    <div style={styles.body}>
      <div className="container-fluid">
        {/* Breadcrumbs */}
        <nav style={styles.breadcrumb}>
          <div style={styles.breadcrumbLink} onClick={() => navigate("/")} className="cursor-pointer">
            <Home size={16} /> Dashboard
          </div>
          <ChevronRight size={16} color="#ccc" />
          <div style={styles.breadcrumbLink} onClick={() => navigate("/students")} className="cursor-pointer">
            <Users size={16} /> Students
          </div>
          <ChevronRight size={16} color="#ccc" />
          <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Student Profile</span>
        </nav>

        {/* Student Profile Overview */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <User size={20} /> Resident Overview
          </div>
          <div style={styles.profileSection}>
            <div className="text-center" style={{ minWidth: '180px' }}>
              <img src={studentData.avatar} alt={studentData.name} style={styles.avatar} />
              <h4 style={{ color: colors.primary, marginBottom: '5px' }}>{studentData.name}</h4>
              <p className="text-muted small">ID: {studentData.id}</p>
            </div>
            
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}><Mail size={18} color={colors.secondary} /><span className="small">{studentData.email}</span></div>
              <div style={styles.infoItem}><Phone size={18} color={colors.secondary} /><span className="small">{studentData.phone}</span></div>
              <div style={styles.infoItem}><Bed size={18} color={colors.secondary} /><span className="small">{studentData.dormHouse}</span></div>
              <div style={styles.infoItem}><Hash size={18} color={colors.secondary} /><span className="small">Room: {studentData.roomNumber}</span></div>
              <div style={styles.infoItem}>
                <ShieldCheck size={18} color={colors.secondary} />
                <span style={{
                  ...styles.statusBadge,
                  backgroundColor: studentData.studentStatus === 'Active' ? '#D1FAE5' : '#FEE2E2',
                  color: studentData.studentStatus === 'Active' ? '#065F46' : '#991B1B'
                }}> {studentData.studentStatus} </span>
              </div>
              <div style={styles.infoItem}>
                <DollarSign size={18} color={colors.secondary} />
                <span style={{
                  ...styles.statusBadge,
                  backgroundColor: studentData.rentStatus === 'Paid' ? '#D1FAE5' : '#FEF3C7',
                  color: studentData.rentStatus === 'Paid' ? '#065F46' : '#92400E'
                }}> Rent: {studentData.rentStatus} </span>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Room Breakage Records */}
          <div className="col-lg-8">
            <div style={styles.card}>
              <div style={{...styles.cardHeader, backgroundColor: colors.secondary}}>
                <Wrench size={20} /> Room Breakage & Maintenance Logs
              </div>
              <div style={{ padding: '20px' }}>
                {breakageRecords.map((record) => (
                  <div key={record.id} style={styles.breakageCard}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="fw-bold m-0" style={{ color: colors.primary }}>{record.item}</h6>
                      <span className={`badge ${record.status === 'Fixed' ? 'bg-success' : record.status === 'In Progress' ? 'bg-primary' : 'bg-warning text-dark'}`}>
                        {record.status}
                      </span>
                    </div>
                    <p className="small text-muted mb-2">{record.description}</p>
                    <div className="d-flex gap-3 small text-muted">
                      <span className="d-flex align-items-center"><Calendar size={14} className="me-1" /> {record.dateReported}</span>
                      <span className="d-flex align-items-center"><AlertTriangle size={14} className="me-1" /> Priority: {record.priority}</span>
                    </div>
                  </div>
                ))}
                <button className="btn btn-primary w-100 mt-2 py-2 fw-bold" style={{ backgroundColor: colors.primary }}>
                  Report New Issue
                </button>
              </div>
            </div>
          </div>

          {/* Attendance & Curfew Card */}
          <div className="col-lg-4">
            <div style={styles.card}>
              <div style={{...styles.cardHeader, backgroundColor: '#64748b'}}>
                <Clock size={20} /> Resident Attendance
              </div>
              <div style={{ padding: '25px', textAlign: 'center' }}>
                <div style={{ 
                  width: '120px', height: '120px', borderRadius: '50%', 
                  border: `8px solid ${colors.accent}`, display: 'flex', 
                  alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px'
                }}>
                  <div className="h3 fw-bold m-0" style={{ color: colors.accent }}>{attendanceData.percentage}%</div>
                </div>
                <h5 className="fw-bold" style={{ color: colors.primary }}>{attendanceData.status}</h5>
                <p className="text-muted small">Overall Attendance Record</p>
                <div className="mt-3 p-3 rounded" style={{ backgroundColor: colors.tertiary }}>
                  <div className="d-flex justify-content-between small mb-1">
                    <span>Days Attended:</span>
                    <span className="fw-bold">{attendanceData.attendedDays}</span>
                  </div>
                  <div className="d-flex justify-content-between small">
                    <span>Total Days:</span>
                    <span className="fw-bold">{attendanceData.totalDays}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;