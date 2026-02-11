import React, { useState, useEffect } from 'react';
import { LogOut, Clock, User, CheckCircle, Calendar, Filter, TrendingUp } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_URL from '../config';

const StaffAttendance = () => {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [filter, setFilter] = useState('month');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todayRecord, setTodayRecord] = useState(null);
  const [stats, setStats] = useState({
    present: 0,
    late: 0,
    absent: 0,
    total: 0
  });

  

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch attendance status when signed in
  useEffect(() => {
    if (isSignedIn) {
      checkAttendanceStatus();
      fetchAttendanceRecords();
    }
  }, [isSignedIn, filter]);

  const checkAttendanceStatus = async () => {
    try {
      const storedUsername = localStorage.getItem('user');
      const response = await fetch(`${API_URL}/get-attendance-status/${storedUsername}`);
      const data = await response.json();
      
      setIsClockedIn(data.isClockedIn);
      setTodayRecord(data.todayRecord);
    } catch (error) {
      console.error('Error checking attendance status:', error);
    }
  };

  const fetchAttendanceRecords = async () => {
    try {
      setIsLoading(true);
      const storedUsername = localStorage.getItem('user');
      const response = await fetch(
        `${API_URL}/get-attendance/${storedUsername}?filter=${filter}`
      );
      const data = await response.json();
      
      setAttendanceData(data);
      
      // Calculate stats
      const present = data.filter(r => r.status === 'Present').length;
      const late = data.filter(r => r.status === 'Late').length;
      const absent = data.filter(r => r.status === 'Absent' || r.status === 'On Leave').length;
      
      setStats({
        present,
        late,
        absent,
        total: data.length
      });
    } catch (error) {
      console.error('Error fetching attendance:', error);
      toast.error('Failed to load attendance records');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClockIn = async () => {
    try {
      setIsLoading(true);
      const storedUsername = localStorage.getItem('user');
      
      const response = await fetch(`${API_URL}/clock-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: storedUsername })
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message);
        return;
      }

      setIsClockedIn(true);
      toast.success(data.message);
      checkAttendanceStatus();
      fetchAttendanceRecords();

    } catch (error) {
      console.error('Error clocking in:', error);
      toast.error('Failed to clock in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClockOut = async () => {
    try {
      setIsLoading(true);
      const storedUsername = localStorage.getItem('user');
      
      const response = await fetch(`${API_URL}/clock-out`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: storedUsername })
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message);
        return;
      }

      setIsClockedIn(false);
      toast.success(data.message);
      checkAttendanceStatus();
      fetchAttendanceRecords();

    } catch (error) {
      console.error('Error clocking out:', error);
      toast.error('Failed to clock out');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error('Invalid credentials');
        return;
      }

      localStorage.setItem('user', username);
      localStorage.setItem('token', data.token);
      setIsSignedIn(true);
      toast.success('Signed in successfully!');

    } catch (error) {
      console.error('Error signing in:', error);
      toast.error('Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setIsSignedIn(false);
    setUsername('');
    setPassword('');
    toast.info('Logged out successfully');
  };

  const styles = {
    container: {
      backgroundColor: '#EFF6FF',
      minHeight: '100vh',
      padding: '40px 20px'
    },
    card: {
      borderRadius: '15px',
      border: 'none',
      boxShadow: '0 4px 6px rgba(59, 130, 246, 0.1)'
    },
    primaryBtn: {
      backgroundColor: '#2563EB',
      color: 'white',
      border: 'none',
      borderRadius: '30px',
      fontWeight: 'bold',
      padding: '12px 30px'
    },
    secondaryBtn: {
      backgroundColor: '#60A5FA',
      color: 'white',
      border: 'none',
      borderRadius: '30px',
      fontWeight: 'bold',
      padding: '12px 30px'
    },
    outlineBtn: {
      border: '2px solid #2563EB',
      color: '#2563EB',
      backgroundColor: 'transparent',
      borderRadius: '30px',
      fontWeight: 'bold',
      padding: '8px 20px'
    },
    statCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '20px',
      textAlign: 'center',
      boxShadow: '0 2px 4px rgba(59, 130, 246, 0.1)'
    },
    filterBtn: (active) => ({
      backgroundColor: active ? '#2563EB' : 'white',
      color: active ? 'white' : '#2563EB',
      border: `2px solid ${active ? '#2563EB' : '#DBEAFE'}`,
      borderRadius: '8px',
      padding: '8px 16px',
      fontSize: '0.9rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s'
    })
  };

  return (
    <div style={styles.container}>
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
      
      <div className="container" style={{ maxWidth: '1100px' }}>
        
        {!isSignedIn ? (
          /* Sign In Card */
          <div className="card shadow-sm mx-auto" style={{ ...styles.card, maxWidth: '400px' }}>
            <div className="card-body p-5 text-center">
              <div className="mb-4" style={{ 
                width: '80px', 
                height: '80px', 
                backgroundColor: '#DBEAFE', 
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto'
              }}>
                <User size={40} color="#2563EB" />
              </div>
              <h3 style={{ color: '#1E3A8A', fontWeight: 'bold', marginBottom: '10px' }}>Staff Attendance</h3>
              <p className="text-muted mb-4">Sign in to manage your attendance</p>
              
              <form onSubmit={handleSignIn}>
                <div className="mb-3">
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required 
                    style={{ borderRadius: '10px', padding: '12px' }}
                  />
                </div>
                <div className="mb-4">
                  <input 
                    type="password" 
                    className="form-control" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    style={{ borderRadius: '10px', padding: '12px' }}
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn w-100" 
                  style={styles.primaryBtn}
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Attendance Dashboard */
          <>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 style={{ color: '#1E3A8A', fontWeight: 'bold', marginBottom: '5px' }}>
                  Welcome, {localStorage.getItem('user')}
                </h2>
                <p className="text-muted mb-0">Track your attendance and work hours</p>
              </div>
              <button 
                className="btn btn-outline-danger btn-sm d-flex align-items-center gap-2" 
                onClick={handleLogout}
                style={{ borderRadius: '20px', padding: '8px 20px' }}
              >
                <LogOut size={16} /> Logout
              </button>
            </div>

            {/* Stats Cards */}
            <div className="row mb-4">
              <div className="col-md-3">
                <div style={styles.statCard}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10B981' }}>
                    {stats.present}
                  </div>
                  <div style={{ color: '#6B7280', fontSize: '0.9rem', marginTop: '5px' }}>
                    Present
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div style={styles.statCard}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#F59E0B' }}>
                    {stats.late}
                  </div>
                  <div style={{ color: '#6B7280', fontSize: '0.9rem', marginTop: '5px' }}>
                    Late Arrivals
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div style={styles.statCard}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#EF4444' }}>
                    {stats.absent}
                  </div>
                  <div style={{ color: '#6B7280', fontSize: '0.9rem', marginTop: '5px' }}>
                    Absent
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div style={styles.statCard}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563EB' }}>
                    {stats.total}
                  </div>
                  <div style={{ color: '#6B7280', fontSize: '0.9rem', marginTop: '5px' }}>
                    Total Days
                  </div>
                </div>
              </div>
            </div>

            {/* Clock In/Out Card */}
            <div className="card border-0 shadow-sm mb-4" style={styles.card}>
              <div className="card-body text-center p-5">
                <div className="mb-3" style={{
                  width: '120px',
                  height: '120px',
                  backgroundColor: isClockedIn ? '#DBEAFE' : '#EFF6FF',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  border: `4px solid ${isClockedIn ? '#2563EB' : '#BFDBFE'}`
                }}>
                  <Clock size={60} color={isClockedIn ? '#2563EB' : '#60A5FA'} />
                </div>
                
                <h4 style={{ color: '#1E3A8A', marginBottom: '10px' }}>
                  {isClockedIn ? "You're Currently Clocked In" : "Ready to Start Your Shift?"}
                </h4>
                
                <div style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 'bold', 
                  color: '#2563EB',
                  marginBottom: '20px'
                }}>
                  {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
                </div>

                {todayRecord && (
                  <div className="mb-3">
                    <div className="d-inline-block px-4 py-2" style={{
                      backgroundColor: '#F0F9FF',
                      borderRadius: '10px',
                      border: '2px solid #BFDBFE'
                    }}>
                      <small style={{ color: '#1E3A8A', fontWeight: '500' }}>
                        Clocked In: {todayRecord.clockIn}
                        {todayRecord.clockOut && ` • Clocked Out: ${todayRecord.clockOut}`}
                      </small>
                    </div>
                  </div>
                )}
                
                <button 
                  onClick={isClockedIn ? handleClockOut : handleClockIn}
                  className="btn btn-lg px-5 mt-3" 
                  style={isClockedIn ? styles.outlineBtn : styles.primaryBtn}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : (isClockedIn ? 'Clock Out' : 'Clock In Now')}
                </button>
              </div>
            </div>

            {/* Attendance Table */}
            <div className="card border-0 shadow-sm" style={styles.card}>
              <div className="card-header bg-white border-0 pt-4 px-4">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                  <h5 style={{ color: '#1E3A8A', fontWeight: 'bold', marginBottom: 0 }}>
                    <Calendar size={20} className="me-2" /> 
                    Attendance History
                  </h5>
                  
                  <div className="btn-group" role="group">
                    <button 
                      style={styles.filterBtn(filter === 'week')}
                      onClick={() => setFilter('week')}
                    >
                      This Week
                    </button>
                    <button 
                      style={styles.filterBtn(filter === 'month')}
                      onClick={() => setFilter('month')}
                    >
                      This Month
                    </button>
                    <button 
                      style={styles.filterBtn(filter === '3months')}
                      onClick={() => setFilter('3months')}
                    >
                      Last 3 Months
                    </button>
                    <button 
                      style={styles.filterBtn(filter === 'all')}
                      onClick={() => setFilter('all')}
                    >
                      All Time
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="card-body px-4 pb-4">
                {isLoading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted mt-3">Loading attendance records...</p>
                  </div>
                ) : attendanceData.length === 0 ? (
                  <div className="text-center py-5">
                    <Calendar size={48} color="#BFDBFE" className="mb-3" />
                    <p className="text-muted">No attendance records found</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover mt-2">
                      <thead style={{ backgroundColor: '#F0F9FF', color: '#1E3A8A' }}>
                        <tr>
                          <th style={{ borderRadius: '8px 0 0 8px', padding: '15px' }}>Date</th>
                          <th style={{ padding: '15px' }}>Clock In</th>
                          <th style={{ padding: '15px' }}>Clock Out</th>
                          <th style={{ borderRadius: '0 8px 8px 0', padding: '15px' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendanceData.map((row) => (
                          <tr key={row._id}>
                            <td style={{ padding: '15px', color: '#374151' }}>
                              {new Date(row.date).toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </td>
                            <td style={{ padding: '15px', color: '#374151', fontWeight: '500' }}>
                              {row.clockIn || '---'}
                            </td>
                            <td style={{ padding: '15px', color: '#374151', fontWeight: '500' }}>
                              {row.clockOut || '---'}
                            </td>
                            <td style={{ padding: '15px' }}>
                              <span className={`badge ${
                                row.status === 'Present' ? 'bg-success' : 
                                row.status === 'Late' ? 'bg-warning text-dark' : 
                                'bg-secondary'
                              }`} style={{ padding: '6px 12px', borderRadius: '6px' }}>
                                {row.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StaffAttendance;