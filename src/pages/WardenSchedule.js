import React from 'react';
import { Calendar, Clock, MapPin, Bell } from 'lucide-react';

const WardenSchedule = () => {
  // Mock data for a single warden
  const mySchedule = [
    { day: "Monday", date: "Jan 26", shift: "Day", location: "Adlam House", role: "Primary Responder" },
    { day: "Tuesday", date: "Jan 27", shift: "Night", location: "Nurses Home", role: "Floor Patrol" },
    { day: "Wednesday", date: "Jan 28", shift: "Day", location: "Adlam House", role: "Primary Responder" },
    { day: "Thursday", date: "Jan 29", shift: "OFF", location: "N/A", role: "Rest Day" },
    { day: "Friday", date: "Jan 30", shift: "Day", location: "Nurses Home", role: "Entrance Security" },
  ];

  const colors = { primary: '#1E3A8A', secondary: '#3B82F6', light: '#DBEAFE' };

  return (
    <div style={{ backgroundColor: '#F0F7FF', minHeight: '100vh', padding: '30px' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 style={{ color: colors.primary, fontWeight: 'bold' }}>My Duty Rota</h2>
          <button className="btn text-white shadow-sm" style={{ backgroundColor: colors.secondary }}>
            <Bell size={18} className="me-2" /> Request Swap
          </button>
        </div>

        {mySchedule.map((item, index) => (
          <div key={index} className="card border-0 shadow-sm mb-3" style={{ borderRadius: '15px' }}>
            <div className="card-body d-flex align-items-center p-3">
              <div className="text-center px-3 border-end" style={{ minWidth: '100px' }}>
                <div className="fw-bold text-uppercase small" style={{ color: colors.secondary }}>{item.day}</div>
                <div className="h5 mb-0 fw-bold" style={{ color: colors.primary }}>{item.date}</div>
              </div>
              
              <div className="ps-4 flex-grow-1">
                <div className="d-flex align-items-center mb-1">
                  <Clock size={16} className="me-2 text-muted" />
                  <span className={`badge ${item.shift === 'Night' ? 'bg-dark' : 'bg-primary'}`}>
                    {item.shift} Shift
                  </span>
                </div>
                <div className="d-flex align-items-center">
                  <MapPin size={16} className="me-2 text-muted" />
                  <span className="fw-bold" style={{ color: '#475569' }}>{item.location}</span>
                </div>
              </div>

              <div className="text-end pe-3">
                <small className="d-block text-muted">Assignment</small>
                <span className="fw-bold" style={{ color: colors.primary }}>{item.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WardenSchedule;