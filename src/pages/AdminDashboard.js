import React from 'react';

const AdminDashboard = () => {
  // Sample data
  const stats = {
    totalStudents: 342,
    onCampusStudents: 218,
    offCampusStudents: 124,
    totalStaff: 45
  };

  const notices = [
    {
      id: 1,
      title: "Final Examination Schedule Released",
      date: "2025-08-01",
      priority: "high",
      content: "Final examinations for Semester 2 will commence on August 15th, 2025. Please check your individual timetables."
    },
    {
      id: 2,
      title: "Library Extended Hours",
      date: "2025-07-30",
      priority: "medium",
      content: "The library will be open 24/7 during examination period starting August 10th."
    },
    {
      id: 3,
      title: "Student Health Insurance Renewal",
      date: "2025-07-28",
      priority: "medium",
      content: "All students must renew their health insurance before August 20th, 2025."
    },
    {
      id: 4,
      title: "Campus WiFi Maintenance",
      date: "2025-07-25",
      priority: "low",
      content: "Network maintenance scheduled for August 5th from 2:00 AM to 6:00 AM."
    }
  ];

  const events = [
    {
      id: 1,
      title: "Nursing Skills Assessment",
      date: "2025-08-08",
      time: "09:00 AM",
      location: "Clinical Skills Lab"
    },
    {
      id: 2,
      title: "Guest Lecture: Modern Healthcare Technology",
      date: "2025-08-12",
      time: "02:00 PM",
      location: "Main Auditorium"
    },
    {
      id: 3,
      title: "Student Council Meeting",
      date: "2025-08-15",
      time: "04:00 PM",
      location: "Conference Room A"
    },
    {
      id: 4,
      title: "Clinical Placement Orientation",
      date: "2025-08-20",
      time: "10:00 AM",
      location: "Lecture Hall 1"
    },
    {
      id: 5,
      title: "Annual Nursing Conference",
      date: "2025-08-25",
      time: "08:00 AM",
      location: "Convention Center"
    }
  ];

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#BE5985';
      case 'medium': return '#EC7FA9';
      case 'low': return '#FFB8E0';
      default: return '#FFEDFA';
    }
  };

  const getPriorityTextColor = (priority) => {
    return priority === 'low' ? '#BE5985' : 'white';
  };

  const formatDate = (dateString) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const styles = {
    body: {
      backgroundColor: '#FFEDFA',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    },
    header: {
      color: '#BE5985',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '30px',
      fontSize: '2.5rem'
    },
    card: {
      border: 'none',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(190, 89, 133, 0.1)',
      marginBottom: '20px',
      overflow: 'hidden'
    },
    statCard: {
      textAlign: 'center',
      padding: '30px 20px',
      color: 'white'
    },
    statNumber: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      marginBottom: '10px'
    },
    statLabel: {
      fontSize: '1.1rem',
      opacity: 0.9
    },
    cardHeader: {
      padding: '15px 20px',
      fontWeight: 'bold',
      fontSize: '1.2rem',
      color: 'white'
    },
    cardBody: {
      padding: '0',
      maxHeight: '400px',
      overflowY: 'auto'
    },
    listItem: {
      padding: '15px 20px',
      borderBottom: '1px solid #FFEDFA',
      backgroundColor: 'white'
    },
    noticeTitle: {
      color: '#BE5985',
      margin: '0 0 8px 0',
      fontWeight: 'bold',
      fontSize: '1rem'
    },
    noticeContent: {
      color: '#666',
      margin: 0,
      fontSize: '0.9rem',
      lineHeight: '1.4'
    },
    badge: {
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '0.75rem',
      fontWeight: 'bold',
      marginRight: '8px'
    },
    dateText: {
      color: '#EC7FA9',
      fontSize: '0.8rem'
    },
    eventTitle: {
      color: '#BE5985',
      margin: '0 0 8px 0',
      fontWeight: 'bold',
      fontSize: '1rem'
    },
    eventDetail: {
      color: '#EC7FA9',
      fontSize: '0.9rem',
      margin: '4px 0'
    }
  };

  return (
    <div style={styles.body}>
      <div className="container-fluid">
        {/* Header */}
        <h1 style={styles.header}>
          Zimbabwe Nursing School - Admin Dashboard
        </h1>

        {/* Stats Cards Row */}
        <div className="row mb-4">
          <div className="col-xl-3 col-lg-6 col-md-6 col-sm-12 mb-3">
            <div style={{...styles.card, background: 'linear-gradient(135deg, #BE5985, #EC7FA9)'}}>
              <div style={styles.statCard}>
                <div style={styles.statNumber}>{stats.totalStudents}</div>
                <div style={styles.statLabel}>Total Students</div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-lg-6 col-md-6 col-sm-12 mb-3">
            <div style={{...styles.card, background: 'linear-gradient(135deg, #EC7FA9, #FFB8E0)'}}>
              <div style={styles.statCard}>
                <div style={styles.statNumber}>{stats.onCampusStudents}</div>
                <div style={styles.statLabel}>On Campus Students</div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-lg-6 col-md-6 col-sm-12 mb-3">
            <div style={{...styles.card, background: 'linear-gradient(135deg, #FFB8E0, #FFEDFA)', color: '#BE5985'}}>
              <div style={{...styles.statCard, color: '#BE5985'}}>
                <div style={styles.statNumber}>{stats.offCampusStudents}</div>
                <div style={{...styles.statLabel, opacity: 0.8}}>Off Campus Students</div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-lg-6 col-md-6 col-sm-12 mb-3">
            <div style={{...styles.card, background: 'linear-gradient(135deg, #FFEDFA, #FFB8E0)', color: '#BE5985'}}>
              <div style={{...styles.statCard, color: '#BE5985'}}>
                <div style={styles.statNumber}>{stats.totalStaff}</div>
                <div style={{...styles.statLabel, opacity: 0.8}}>Total Staff</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Cards Row */}
        <div className="row">
          {/* Notices Card */}
          <div className="col-lg-6 col-md-12 mb-4">
            <div style={{...styles.card, height: '500px'}}>
              <div style={{...styles.cardHeader, backgroundColor: '#BE5985'}}>
                📢 School Notices
              </div>
              <div style={styles.cardBody}>
                {notices.map((notice) => (
                  <div key={notice.id} style={styles.listItem}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px'}}>
                      <h6 style={styles.noticeTitle}>
                        {notice.title}
                      </h6>
                      <div style={{display: 'flex', alignItems: 'center'}}>
                        <span 
                          style={{
                            ...styles.badge,
                            backgroundColor: getPriorityColor(notice.priority),
                            color: getPriorityTextColor(notice.priority)
                          }}
                        >
                          {notice.priority.toUpperCase()}
                        </span>
                        <small style={styles.dateText}>
                          {formatDate(notice.date)}
                        </small>
                      </div>
                    </div>
                    <p style={styles.noticeContent}>
                      {notice.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Calendar Events Card */}
          <div className="col-lg-6 col-md-12 mb-4">
            <div style={{...styles.card, height: '500px'}}>
              <div style={{...styles.cardHeader, backgroundColor: '#EC7FA9'}}>
                📅 Upcoming Events
              </div>
              <div style={styles.cardBody}>
                {events.map((event) => (
                  <div key={event.id} style={styles.listItem}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px'}}>
                      <h6 style={styles.eventTitle}>
                        {event.title}
                      </h6>
                      <span style={{...styles.badge, backgroundColor: '#FFB8E0', color: '#BE5985'}}>
                        {formatDate(event.date)}
                      </span>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <span style={styles.eventDetail}>
                        🕐 {event.time}
                      </span>
                      <span style={styles.eventDetail}>
                        📍 {event.location}
                      </span>
                    </div>
                  </div>
                ))}
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
        .col-xl-3, .col-lg-6, .col-md-6, .col-sm-12, .col-lg-6, .col-md-12 {
          padding: 0 10px;
        }
        body {
          margin: 0;
          padding: 0;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;