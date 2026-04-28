import React, { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, Bell } from 'lucide-react';
import API_URL from '../config';

const WardenSchedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  const colors = { primary: '#1E3A8A', secondary: '#3B82F6', light: '#DBEAFE' };

  console.log(localStorage.getItem("userId"));

  useEffect(() => {
    fetchMySchedule();
  }, []);

  const fetchMySchedule = async () => {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) return;

      const res = await fetch(`${API_URL}/get-warden-schedule-by-id/${userId}`);
      const data = await res.json();

      console.log(data)

      if (!res.ok) {
        console.error(data.message);
        return;
      }

      const formatted = formatSchedule(data.schedule, data.user);
      setSchedule(formatted);

    } catch (error) {
      console.error("Error fetching schedule:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Convert backend → UI format
  const formatSchedule = (scheduleData, user) => {
    const daysOfWeek = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
    const result = [];

    daysOfWeek.forEach(day => {
      let foundShift = null;

      Object.keys(scheduleData[day] || {}).forEach(house => {
        const dayList = scheduleData[day][house].day || [];
        const nightList = scheduleData[day][house].night || [];

        // ⚠️ IMPORTANT: backend uses username
        if (dayList.includes(user.staffId)) {
          foundShift = { shift: 'Day', location: house };
        }

        if (nightList.includes(user.staffId)) {
          foundShift = { shift: 'Night', location: house };
        }
      });

      if (!foundShift) {
        foundShift = { shift: 'OFF', location: '-' };
      }

      result.push({
        day,
        ...foundShift
      });
    });

    return result;
  };

  return (
    <div style={{ backgroundColor: '#F0F7FF', minHeight: '100vh', padding: '30px' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 style={{ color: colors.primary, fontWeight: 'bold' }}>
            My Duty Rota
          </h2>

          <button className="btn text-white shadow-sm" style={{ backgroundColor: colors.secondary }}>
            <Bell size={18} className="me-2" /> Request Swap
          </button>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center p-5">
            <div className="spinner-border text-primary" />
          </div>
        ) : (
          schedule.map((item, index) => (
            <div key={index} className="card border-0 shadow-sm mb-3" style={{ borderRadius: '15px' }}>
              
              <div className="card-body d-flex align-items-center p-3">
                
                {/* Day */}
                <div className="text-center px-3 border-end" style={{ minWidth: '100px' }}>
                  <div className="fw-bold text-uppercase small" style={{ color: colors.secondary }}>
                    {item.day}
                  </div>
                </div>

                {/* Shift + Location */}
                <div className="ps-4 flex-grow-1">
                  
                  <div className="d-flex align-items-center mb-1">
                    <Clock size={16} className="me-2 text-muted" />

                    <span
                      className={`badge ${
                        item.shift === 'Night'
                          ? 'bg-dark'
                          : item.shift === 'Day'
                          ? 'bg-primary'
                          : 'bg-secondary'
                      }`}
                    >
                      {item.shift}
                    </span>
                  </div>

                  <div className="d-flex align-items-center">
                    <MapPin size={16} className="me-2 text-muted" />
                    <span className="fw-bold" style={{ color: '#475569' }}>
                      {item.location}
                    </span>
                  </div>

                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WardenSchedule;