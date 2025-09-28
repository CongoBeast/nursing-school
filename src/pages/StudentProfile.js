import React, { useState } from 'react';
import { ChevronRight, Home, Users, User, Mail, Phone, MapPin, Calendar, GraduationCap, DollarSign, CheckCircle, XCircle, TrendingUp, Clock } from 'lucide-react';
import { Link, useLocation, useNavigate } from "react-router-dom";


const StudentProfile = () => {

    const navigate = useNavigate()
  // Sample student data
  const studentData = {
    id: 'ZNS001',
    name: 'Tendai Mukamuri',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    email: 'tendai.mukamuri@student.zns.ac.zw',
    phone: '+263 77 123 4567',
    address: '15 Josiah Tongogara Avenue, Harare, Zimbabwe',
    age: 21,
    program: 'Bachelor of Science in Nursing',
    yearOfStudy: 2,
    studentStatus: 'Active',
    feeStatus: 'Paid',
    dateStarted: '2023-02-15',
    residence: 'On Campus'
  };

  // Academic results data
  const academicResults = [
    {
      year: 1,
      semester: 'Semester 1',
      subjects: [
        { name: 'Anatomy & Physiology I', grade: 'A', points: 85, credits: 3 },
        { name: 'Fundamentals of Nursing', grade: 'B+', points: 78, credits: 4 },
        { name: 'Medical Terminology', grade: 'A-', points: 82, credits: 2 },
        { name: 'Health Psychology', grade: 'B', points: 75, credits: 3 }
      ],
      gpa: 3.5,
      totalCredits: 12
    },
    {
      year: 1,
      semester: 'Semester 2',
      subjects: [
        { name: 'Anatomy & Physiology II', grade: 'A', points: 88, credits: 3 },
        { name: 'Nursing Skills Lab', grade: 'A-', points: 83, credits: 4 },
        { name: 'Pharmacology Basics', grade: 'B+', points: 79, credits: 3 },
        { name: 'Community Health', grade: 'A', points: 86, credits: 3 }
      ],
      gpa: 3.7,
      totalCredits: 13
    },
    {
      year: 2,
      semester: 'Semester 1',
      subjects: [
        { name: 'Pathophysiology', grade: 'A-', points: 81, credits: 4 },
        { name: 'Clinical Nursing I', grade: 'B+', points: 77, credits: 5 },
        { name: 'Pharmacology Advanced', grade: 'B', points: 74, credits: 3 },
        { name: 'Health Assessment', grade: 'A', points: 87, credits: 3 }
      ],
      gpa: 3.4,
      totalCredits: 15
    }
  ];

  // Attendance data
  const attendanceData = {
    currentSemester: {
      totalDays: 120,
      attendedDays: 108,
      absentDays: 12,
      percentage: 90
    },
    monthlyAttendance: [
      { month: 'January', attended: 18, total: 20, percentage: 90 },
      { month: 'February', attended: 19, total: 20, percentage: 95 },
      { month: 'March', attended: 17, total: 20, percentage: 85 },
      { month: 'April', attended: 18, total: 20, percentage: 90 },
      { month: 'May', attended: 16, total: 20, percentage: 80 },
      { month: 'June', attended: 20, total: 20, percentage: 100 }
    ]
  };

  const [activeTab, setActiveTab] = useState('year1');

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return '#28a745';
    if (grade.startsWith('B')) return '#17a2b8';
    if (grade.startsWith('C')) return '#ffc107';
    return '#dc3545';
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 90) return '#28a745';
    if (percentage >= 80) return '#ffc107';
    return '#dc3545';
  };

  const calculateOverallGPA = () => {
    const totalGPA = academicResults.reduce((sum, result) => sum + result.gpa, 0);
    return (totalGPA / academicResults.length).toFixed(2);
  };

  const styles = {
    body: {
      backgroundColor: '#FFEDFA',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    },
    breadcrumb: {
      backgroundColor: 'white',
      padding: '15px 20px',
      borderRadius: '8px',
      marginBottom: '20px',
      boxShadow: '0 2px 4px rgba(190, 89, 133, 0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    breadcrumbLink: {
      color: '#BE5985',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      cursor: 'pointer',
      fontSize: '0.9rem'
    },
    breadcrumbCurrent: {
      color: '#666',
      fontSize: '0.9rem'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(190, 89, 133, 0.1)',
      marginBottom: '20px',
      overflow: 'hidden'
    },
    cardHeader: {
      backgroundColor: '#BE5985',
      color: 'white',
      padding: '20px',
      fontWeight: 'bold',
      fontSize: '1.2rem',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    cardBody: {
      padding: '20px'
    },
    profileSection: {
      display: 'flex',
      gap: '30px',
      alignItems: 'start',
      flexWrap: 'wrap'
    },
    avatarSection: {
      textAlign: 'center',
      minWidth: '200px'
    },
    avatar: {
      width: '150px',
      height: '150px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '4px solid #FFB8E0',
      marginBottom: '15px'
    },
    infoGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      flex: 1
    },
    infoItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px',
      backgroundColor: '#FFEDFA',
      borderRadius: '8px'
    },
    infoLabel: {
      fontWeight: 'bold',
      color: '#BE5985',
      minWidth: '100px'
    },
    infoValue: {
      color: '#333',
      flex: 1
    },
    statusBadge: {
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '0.8rem',
      fontWeight: 'bold'
    },
    tabNav: {
      display: 'flex',
      borderBottom: '2px solid #FFEDFA',
      marginBottom: '20px',
      gap: '5px'
    },
    tabButton: {
      padding: '12px 20px',
      border: 'none',
      backgroundColor: 'transparent',
      color: '#BE5985',
      fontWeight: 'bold',
      cursor: 'pointer',
      borderBottom: '3px solid transparent',
      transition: 'all 0.2s'
    },
    activeTabButton: {
      borderBottomColor: '#BE5985',
      backgroundColor: '#FFEDFA'
    },
    subjectGrid: {
      display: 'grid',
      gap: '15px'
    },
    subjectCard: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px',
      backgroundColor: '#FFEDFA',
      borderRadius: '8px',
      border: '1px solid #FFB8E0'
    },
    gradeInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px'
    },
    grade: {
      padding: '5px 10px',
      borderRadius: '20px',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '0.9rem'
    },
    gpaCard: {
      textAlign: 'center',
      padding: '20px',
      backgroundColor: '#BE5985',
      color: 'white',
      borderRadius: '12px',
      marginBottom: '20px'
    },
    attendanceGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '15px'
    },
    attendanceCard: {
      padding: '15px',
      backgroundColor: '#FFEDFA',
      borderRadius: '8px',
      textAlign: 'center'
    },
    attendancePercentage: {
      fontSize: '2rem',
      fontWeight: 'bold',
      marginBottom: '5px'
    }
  };

  return (
    <div style={styles.body}>
      <div className="container-fluid">
        {/* Breadcrumbs */}
        <nav style={styles.breadcrumb}>
          <a href="/" style={styles.breadcrumbLink}>

            <Home size={16} />
            Dashboard
          </a>
          <ChevronRight size={16} color="#ccc" />
          <a href="/#/students" style={styles.breadcrumbLink}>
            <Users size={16} />
            Students
          </a>
          <ChevronRight size={16} color="#ccc" />
          <span style={styles.breadcrumbCurrent}>Student Profile</span>
        </nav>

        {/* Student Basic Information */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <User size={24} />
            Student Information
          </div>
          <div style={styles.cardBody}>
            <div style={styles.profileSection}>
              <div style={styles.avatarSection}>
                <img
                  src={studentData.avatar}
                  alt={studentData.name}
                  style={styles.avatar}
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(studentData.name)}&size=150&background=FFB8E0&color=BE5985`;
                  }}
                />
                <h3 style={{ color: '#BE5985', margin: '0 0 10px 0' }}>{studentData.name}</h3>
                <p style={{ color: '#EC7FA9', margin: 0 }}>Student ID: {studentData.id}</p>
              </div>
              
              <div style={styles.infoGrid}>
                <div style={styles.infoItem}>
                  <Mail size={20} color="#EC7FA9" />
                  <span style={styles.infoLabel}>Email:</span>
                  <span style={styles.infoValue}>{studentData.email}</span>
                </div>
                
                <div style={styles.infoItem}>
                  <Phone size={20} color="#EC7FA9" />
                  <span style={styles.infoLabel}>Phone:</span>
                  <span style={styles.infoValue}>{studentData.phone}</span>
                </div>
                
                <div style={styles.infoItem}>
                  <MapPin size={20} color="#EC7FA9" />
                  <span style={styles.infoLabel}>Address:</span>
                  <span style={styles.infoValue}>{studentData.address}</span>
                </div>
                
                <div style={styles.infoItem}>
                  <Calendar size={20} color="#EC7FA9" />
                  <span style={styles.infoLabel}>Age:</span>
                  <span style={styles.infoValue}>{studentData.age} years old</span>
                </div>
                
                <div style={styles.infoItem}>
                  <GraduationCap size={20} color="#EC7FA9" />
                  <span style={styles.infoLabel}>Program:</span>
                  <span style={styles.infoValue}>{studentData.program}</span>
                </div>
                
                <div style={styles.infoItem}>
                  <TrendingUp size={20} color="#EC7FA9" />
                  <span style={styles.infoLabel}>Year of Study:</span>
                  <span style={styles.infoValue}>Year {studentData.yearOfStudy}</span>
                </div>
                
                <div style={styles.infoItem}>
                  <CheckCircle size={20} color="#EC7FA9" />
                  <span style={styles.infoLabel}>Status:</span>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: studentData.studentStatus === 'Active' ? '#d4edda' : '#f8d7da',
                    color: studentData.studentStatus === 'Active' ? '#155724' : '#721c24'
                  }}>
                    {studentData.studentStatus}
                  </span>
                </div>
                
                <div style={styles.infoItem}>
                  <DollarSign size={20} color="#EC7FA9" />
                  <span style={styles.infoLabel}>Fee Status:</span>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: studentData.feeStatus === 'Paid' ? '#d4edda' : '#f8d7da',
                    color: studentData.feeStatus === 'Paid' ? '#155724' : '#721c24'
                  }}>
                    {studentData.feeStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Academic Results */}
          <div className="col-lg-8 col-md-12 mb-4">
            <div style={styles.card}>
              <div style={{...styles.cardHeader, backgroundColor: '#EC7FA9'}}>
                <GraduationCap size={24} />
                Academic Results
              </div>
              <div style={styles.cardBody}>
                {/* Overall GPA Card */}
                <div style={styles.gpaCard}>
                  <h4 style={{ margin: '0 0 10px 0' }}>Overall GPA</h4>
                  <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{calculateOverallGPA()}</div>
                  <div style={{ opacity: 0.9 }}>Cumulative Grade Point Average</div>
                </div>

                {/* Tab Navigation */}
                <div style={styles.tabNav}>
                  <button
                    style={{
                      ...styles.tabButton,
                      ...(activeTab === 'year1' ? styles.activeTabButton : {})
                    }}
                    onClick={() => setActiveTab('year1')}
                  >
                    Year 1
                  </button>
                  <button
                    style={{
                      ...styles.tabButton,
                      ...(activeTab === 'year2' ? styles.activeTabButton : {})
                    }}
                    onClick={() => setActiveTab('year2')}
                  >
                    Year 2
                  </button>
                </div>

                {/* Academic Results Content */}
                <div>
                  {academicResults
                    .filter(result => 
                      (activeTab === 'year1' && result.year === 1) || 
                      (activeTab === 'year2' && result.year === 2)
                    )
                    .map((result, index) => (
                      <div key={index} style={{ marginBottom: '30px' }}>
                        <h5 style={{ color: '#BE5985', marginBottom: '15px' }}>
                          {result.semester} - GPA: {result.gpa} ({result.totalCredits} Credits)
                        </h5>
                        <div style={styles.subjectGrid}>
                          {result.subjects.map((subject, subIndex) => (
                            <div key={subIndex} style={styles.subjectCard}>
                              <div>
                                <div style={{ fontWeight: 'bold', color: '#BE5985', marginBottom: '5px' }}>
                                  {subject.name}
                                </div>
                                <div style={{ fontSize: '0.9rem', color: '#666' }}>
                                  {subject.credits} Credits • {subject.points} Points
                                </div>
                              </div>
                              <div style={styles.gradeInfo}>
                                <span 
                                  style={{
                                    ...styles.grade,
                                    backgroundColor: getGradeColor(subject.grade)
                                  }}
                                >
                                  {subject.grade}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Report */}
          <div className="col-lg-4 col-md-12 mb-4">
            <div style={styles.card}>
              <div style={{...styles.cardHeader, backgroundColor: '#FFB8E0', color: '#BE5985'}}>
                <Clock size={24} />
                Attendance Report
              </div>
              <div style={styles.cardBody}>
                {/* Overall Attendance */}
                <div style={{
                  ...styles.attendanceCard,
                  backgroundColor: '#BE5985',
                  color: 'white',
                  marginBottom: '20px'
                }}>
                  <div style={styles.attendancePercentage}>
                    {attendanceData.currentSemester.percentage}%
                  </div>
                  <div style={{ marginBottom: '10px' }}>Overall Attendance</div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                    {attendanceData.currentSemester.attendedDays} of {attendanceData.currentSemester.totalDays} days
                  </div>
                </div>

                {/* Monthly Breakdown */}
                <h6 style={{ color: '#BE5985', marginBottom: '15px' }}>Monthly Breakdown</h6>
                <div style={styles.attendanceGrid}>
                  {attendanceData.monthlyAttendance.map((month, index) => (
                    <div key={index} style={styles.attendanceCard}>
                      <div style={{ fontWeight: 'bold', color: '#BE5985', marginBottom: '8px' }}>
                        {month.month}
                      </div>
                      <div 
                        style={{
                          ...styles.attendancePercentage,
                          fontSize: '1.5rem',
                          color: getAttendanceColor(month.percentage)
                        }}
                      >
                        {month.percentage}%
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#666' }}>
                        {month.attended}/{month.total} days
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .container-fluid {
          max-width: 1400px;
          margin: 0 auto;
        }
        .row {
          margin: 0 -10px;
        }
        .col-lg-8, .col-lg-4, .col-md-12, .mb-4 {
          padding: 0 10px;
        }
        body {
          margin: 0;
          padding: 0;
        }
        * {
          box-sizing: border-box;
        }
        @media (max-width: 768px) {
          .profileSection {
            flex-direction: column;
            text-align: center;
          }
          .infoGrid {
            grid-template-columns: 1fr;
          }
          .tabNav {
            flex-wrap: wrap;
          }
        }
        button:hover {
          opacity: 0.8;
        }
        a:hover {
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
};

export default StudentProfile;