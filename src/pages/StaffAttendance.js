import React, { useState } from 'react';
import { LogOut, Clock, User, CheckCircle, Calendar } from 'lucide-react';



const StaffAttendance = () => {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  // Placeholder Attendance Data
  const attendanceData = [
    { id: 1, date: '2026-01-20', clockIn: '08:00 AM', clockOut: '04:30 PM', status: 'Present' },
    { id: 2, date: '2026-01-21', clockIn: '07:55 AM', clockOut: '04:15 PM', status: 'Present' },
    { id: 3, date: '2026-01-22', clockIn: '---', clockOut: '---', status: 'On Leave' },
    { id: 4, date: '2026-01-23', clockIn: '08:10 AM', clockOut: '05:00 PM', status: 'Late' },
  ];

  const handleClockToggle = () => {
    setIsClockedIn(!isClockedIn);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000); // Hide toast after 3s
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    setIsSignedIn(true);
  };

  return (
    <div style={{ backgroundColor: '#FFEDFA', minHeight: '100vh', padding: '40px 20px' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        
        {!isSignedIn ? (
          /* Sign In Card */
          <div className="card shadow-sm mx-auto" style={{ maxWidth: '400px', borderRadius: '15px' }}>
            <div className="card-body p-4 text-center">
              <User size={48} color="#BE5985" className="mb-3" />
              <h3 style={{ color: '#BE5985', fontWeight: 'bold' }}>Staff Sign In</h3>
              <form onSubmit={handleSignIn} className="mt-4">
                <input type="text" className="form-control mb-3" placeholder="Staff ID" required />
                <input type="password" className="form-control mb-4" placeholder="Password" required />
                <button type="submit" className="btn w-100" style={{ backgroundColor: '#BE5985', color: 'white' }}>
                  Sign In
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Attendance Dashboard */
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 style={{ color: '#BE5985', fontWeight: 'bold' }}>Welcome, Nurse Chimanda</h2>
              <button className="btn btn-outline-danger btn-sm" onClick={() => setIsSignedIn(false)}>
                <LogOut size={16} className="me-2" /> Logout
              </button>
            </div>

            {/* Clock In Action Card */}
            <div className="card border-0 shadow-sm mb-5" style={{ borderRadius: '15px' }}>
              <div className="card-body text-center p-5">
                <div className="mb-3">
                  <Clock size={60} color={isClockedIn ? '#EC7FA9' : '#BE5985'} />
                </div>
                <h4>{isClockedIn ? "You are currently Clocked In" : "Ready to start your shift?"}</h4>
                <p className="text-muted">Current Time: {new Date().toLocaleTimeString()}</p>
                <button 
                  onClick={handleClockToggle}
                  className="btn btn-lg px-5 mt-3" 
                  style={{ 
                    backgroundColor: isClockedIn ? '#FFB8E0' : '#BE5985', 
                    color: isClockedIn ? '#BE5985' : 'white',
                    fontWeight: 'bold',
                    borderRadius: '30px'
                  }}
                >
                  {isClockedIn ? 'Clock Out' : 'Clock In Now'}
                </button>
              </div>
            </div>

            {/* Attendance Table */}
            <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
              <div className="card-header bg-white border-0 pt-4 px-4">
                <h5 style={{ color: '#BE5985', fontWeight: 'bold' }}>
                  <Calendar size={20} className="me-2" /> Attendance Record - Past Month
                </h5>
              </div>
              <div className="card-body px-4">
                <table className="table table-hover mt-2">
                  <thead style={{ color: '#EC7FA9' }}>
                    <tr>
                      <th>Date</th>
                      <th>Clock In</th>
                      <th>Clock Out</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceData.map((row) => (
                      <tr key={row.id}>
                        <td>{row.date}</td>
                        <td>{row.clockIn}</td>
                        <td>{row.clockOut}</td>
                        <td>
                          <span className={`badge ${row.status === 'Present' ? 'bg-success' : 'bg-warning'}`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Floating Toast Notification */}
        {showToast && (
          <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 11 }}>
            <div className="toast show align-items-center text-white border-0" style={{ backgroundColor: '#BE5985' }}>
              <div className="d-flex">
                <div className="toast-body d-flex align-items-center">
                  <CheckCircle size={18} className="me-2" />
                  Successfully {isClockedIn ? 'Clocked In' : 'Clocked Out'}!
                </div>
                <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setShowToast(false)}></button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffAttendance;