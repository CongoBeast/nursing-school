import React from 'react';
import { 
  Users, 
  Home, 
  Building, 
  UserCog, 
  PlusCircle, 
  CalendarPlus, 
  Megaphone,
  Bell,
  Calendar,
  AlertTriangle,
  AlertCircle,
  Info,
  Clock,
  MapPin
} from 'lucide-react';

const AdminDashboard = () => {
  const [showNoticeModal, setShowNoticeModal] = React.useState(false);
  const [showEventModal, setShowEventModal] = React.useState(false);
  
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

  const getPriorityIcon = (priority) => {
    switch(priority) {
      case 'high': return <AlertTriangle size={16} />;
      case 'medium': return <AlertCircle size={16} />;
      case 'low': return <Info size={16} />;
      default: return <Bell size={16} />;
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#1E40AF';
      case 'medium': return '#2563EB';
      case 'low': return '#3B82F6';
      default: return '#60A5FA';
    }
  };

  const getPriorityTextColor = (priority) => {
    return priority === 'low' ? '#1E3A8A' : '#FFFFFF';
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
      backgroundColor: '#F0F9FF',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    },
    header: {
      color: '#1E3A8A',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '30px',
      fontSize: '2.5rem'
    },
    card: {
      border: 'none',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(30, 58, 138, 0.1)',
      marginBottom: '20px',
      overflow: 'hidden'
    },
    statCard: {
      textAlign: 'center',
      padding: '30px 20px',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    statIcon: {
      marginBottom: '15px',
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.2)'
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
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    cardBody: {
      padding: '0',
      maxHeight: '400px',
      overflowY: 'auto'
    },
    listItem: {
      padding: '15px 20px',
      borderBottom: '1px solid #EFF6FF',
      backgroundColor: 'white'
    },
    noticeTitle: {
      color: '#1E3A8A',
      margin: '0 0 8px 0',
      fontWeight: 'bold',
      fontSize: '1rem'
    },
    noticeContent: {
      color: '#4B5563',
      margin: 0,
      fontSize: '0.9rem',
      lineHeight: '1.4'
    },
    badge: {
      padding: '6px 10px',
      borderRadius: '20px',
      fontSize: '0.75rem',
      fontWeight: 'bold',
      marginRight: '8px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px'
    },
    dateText: {
      color: '#3B82F6',
      fontSize: '0.8rem'
    },
    eventTitle: {
      color: '#1E3A8A',
      margin: '0 0 8px 0',
      fontWeight: 'bold',
      fontSize: '1rem'
    },
    eventDetail: {
      color: '#2563EB',
      fontSize: '0.9rem',
      margin: '4px 0',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    actionButton: {
      padding: '12px 24px',
      borderRadius: '8px',
      border: 'none',
      fontWeight: 'bold',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
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
        {localStorage.userType === 'admin' && (
          <div className="row mb-4">
            <div className="col-xl-3 col-lg-6 col-md-6 col-sm-12 mb-3">
              <div style={{...styles.card, background: 'linear-gradient(135deg, #1E40AF, #2563EB)'}}>
                <div style={styles.statCard}>
                  <div style={styles.statIcon}>
                    <Users size={24} color="white" />
                  </div>
                  <div style={styles.statNumber}>{stats.totalStudents}</div>
                  <div style={styles.statLabel}>Total Students</div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-lg-6 col-md-6 col-sm-12 mb-3">
              <div style={{...styles.card, background: 'linear-gradient(135deg, #2563EB, #3B82F6)'}}>
                <div style={styles.statCard}>
                  <div style={styles.statIcon}>
                    <Home size={24} color="white" />
                  </div>
                  <div style={styles.statNumber}>{stats.onCampusStudents}</div>
                  <div style={styles.statLabel}>On Campus Students</div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-lg-6 col-md-6 col-sm-12 mb-3">
              <div style={{...styles.card, background: 'linear-gradient(135deg, #3B82F6, #60A5FA)', color: '#1E3A8A'}}>
                <div style={{...styles.statCard, color: '#1E3A8A'}}>
                  <div style={styles.statIcon}>
                    <Building size={24} color="#1E3A8A" />
                  </div>
                  <div style={styles.statNumber}>{stats.offCampusStudents}</div>
                  <div style={{...styles.statLabel, opacity: 0.8}}>Off Campus Students</div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-lg-6 col-md-6 col-sm-12 mb-3">
              <div style={{...styles.card, background: 'linear-gradient(135deg, #93C5FD, #BFDBFE)', color: '#1E3A8A'}}>
                <div style={{...styles.statCard, color: '#1E3A8A'}}>
                  <div style={styles.statIcon}>
                    <UserCog size={24} color="#1E3A8A" />
                  </div>
                  <div style={styles.statNumber}>{stats.totalStaff}</div>
                  <div style={{...styles.statLabel, opacity: 0.8}}>Total Staff</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {localStorage.userType === 'admin' && (
          <div className="row mb-4">
            <div className="col-12" style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className='btn' style={{
                ...styles.actionButton,
                backgroundColor: '#1E40AF',
                color: 'white'
              }}>
                <PlusCircle size={20} />
                Add Staff
              </button>
              <button className='btn' onClick={() => setShowEventModal(true)}
                style={{
                  ...styles.actionButton,
                  backgroundColor: '#2563EB',
                  color: 'white'
                }}>
                <CalendarPlus size={20} />
                Add Event
              </button>
              <button className='btn' onClick={() => setShowNoticeModal(true)}
                style={{
                  ...styles.actionButton,
                  backgroundColor: '#3B82F6',
                  color: 'white'
                }}>
                <Megaphone size={20} />
                Add Notice
              </button>
            </div>
          </div>
        )}

        {/* Content Cards Row */}
        <div className="row">
          {/* Notices Card */}
          <div className="col-lg-6 col-md-12 mb-4">
            <div style={{...styles.card, height: '500px'}}>
              <div style={{...styles.cardHeader, backgroundColor: '#1E40AF'}}>
                <Bell size={20} />
                School Notices
              </div>
              <div style={styles.cardBody}>
                {notices.map((notice) => (
                  <div key={notice.id} style={styles.listItem}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px'}}>
                      <h6 style={styles.noticeTitle}>
                        {notice.title}
                      </h6>
                      <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <span 
                          style={{
                            ...styles.badge,
                            backgroundColor: getPriorityColor(notice.priority),
                            color: getPriorityTextColor(notice.priority)
                          }}
                        >
                          {getPriorityIcon(notice.priority)}
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
              <div style={{...styles.cardHeader, backgroundColor: '#2563EB'}}>
                <Calendar size={20} />
                Upcoming Events
              </div>
              <div style={styles.cardBody}>
                {events.map((event) => (
                  <div key={event.id} style={styles.listItem}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px'}}>
                      <h6 style={styles.eventTitle}>
                        {event.title}
                      </h6>
                      <span style={{...styles.badge, backgroundColor: '#BFDBFE', color: '#1E3A8A'}}>
                        {formatDate(event.date)}
                      </span>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <span style={styles.eventDetail}>
                        <Clock size={16} />
                        {event.time}
                      </span>
                      <span style={styles.eventDetail}>
                        <MapPin size={16} />
                        {event.location}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Notice Modal */}
      {showNoticeModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: '15px', border: 'none' }}>
              <div className="modal-header" style={{ backgroundColor: '#1E40AF', color: 'white', borderRadius: '15px 15px 0 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Megaphone size={20} />
                <h5 className="modal-title">Add New School Notice</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowNoticeModal(false)}></button>
              </div>
              <div className="modal-body" style={{ backgroundColor: 'white' }}>
                <form>
                  <div className="mb-3">
                    <label className="form-label" style={{ color: '#1E3A8A', fontWeight: 'bold' }}>Notice Title</label>
                    <input type="text" className="form-control" placeholder="e.g. Exam Results" required />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label" style={{ color: '#1E3A8A', fontWeight: 'bold' }}>Description</label>
                    <textarea className="form-control" rows="3" placeholder="Enter notice details..." required></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label d-block" style={{ color: '#1E3A8A', fontWeight: 'bold' }}>Priority</label>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="radio" name="priority" id="high" value="high" />
                      <label className="form-check-label" htmlFor="high" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <AlertTriangle size={16} /> High
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="radio" name="priority" id="medium" value="medium" defaultChecked />
                      <label className="form-check-label" htmlFor="medium" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <AlertCircle size={16} /> Medium
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="radio" name="priority" id="low" value="low" />
                      <label className="form-check-label" htmlFor="low" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Info size={16} /> Low
                      </label>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label" style={{ color: '#1E3A8A', fontWeight: 'bold' }}>Schedule Date</label>
                    <input type="date" className="form-control" required />
                  </div>

                  <button type="submit" className="btn w-100" style={{ backgroundColor: '#1E40AF', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Megaphone size={20} />
                    Publish Notice
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {showEventModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: '15px', border: 'none' }}>
              <div className="modal-header" style={{ backgroundColor: '#2563EB', color: 'white', borderRadius: '15px 15px 0 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CalendarPlus size={20} />
                <h5 className="modal-title">Schedule New Event</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowEventModal(false)}></button>
              </div>
              <div className="modal-body" style={{ backgroundColor: 'white' }}>
                <form>
                  <div className="mb-3">
                    <label className="form-label" style={{ color: '#1E3A8A', fontWeight: 'bold' }}>Event Name</label>
                    <input type="text" className="form-control" placeholder="e.g. Clinical Placement" required />
                  </div>
                  
                  <div className="row">
                    <div className="col-md-12 mb-3">
                      <label className="form-label" style={{ color: '#1E3A8A', fontWeight: 'bold' }}>Date and Time</label>
                      <input type="datetime-local" className="form-control" required />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label" style={{ color: '#1E3A8A', fontWeight: 'bold' }}>Location</label>
                    <input type="text" className="form-control" placeholder="e.g. Ward B or Zoom" required />
                  </div>

                  <button type="submit" className="btn w-100" style={{ backgroundColor: '#2563EB', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <CalendarPlus size={20} />
                    Confirm Event
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

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
        .modal-content {
          box-shadow: 0 10px 25px rgba(30, 58, 138, 0.2);
        }
        .form-control:focus {
          border-color: #3B82F6;
          box-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.25);
        }
        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;