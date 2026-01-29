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

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminDashboard = () => {
  const [showNoticeModal, setShowNoticeModal] = React.useState(false);
  const [showEventModal, setShowEventModal] = React.useState(false);

  // Add state for form data
  const [noticeForm, setNoticeForm] = React.useState({
    title: '',
    content: '',
    priority: 'medium',
    date: ''
  });

  const [eventForm, setEventForm] = React.useState({
    title: '',
    datetime: '',
    location: ''
  });

  const [isSubmittingNotice, setIsSubmittingNotice] = React.useState(false);
  const [isSubmittingEvent, setIsSubmittingEvent] = React.useState(false);

  // Add state for data fetching
  const [notices, setNotices] = React.useState([]);
  const [events, setEvents] = React.useState([]);
  const [loadingNotices, setLoadingNotices] = React.useState(true);
  const [loadingEvents, setLoadingEvents] = React.useState(true);
  
  // Sample data
  const stats = {
    totalStudents: 342,
    onCampusStudents: 218,
    offCampusStudents: 124,
    totalStaff: 45
  };

  // Fetch notices
  const fetchNotices = async () => {
    setLoadingNotices(true);
    try {
      const response = await fetch('http://localhost:3001/get-notices');
      const data = await response.json();
      setNotices(data);
    } catch (error) {
      console.error('Error fetching notices:', error);
      toast.error('Failed to load notices', {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoadingNotices(false);
    }
  };

  // Fetch events
  const fetchEvents = async () => {
    setLoadingEvents(true);
    try {
      const response = await fetch('http://localhost:3001/get-events');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events', {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoadingEvents(false);
    }
  };

  // Handle form submission
  // Handle notice submission
  const handleNoticeSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingNotice(true);
    
    try {
      const username = localStorage.getItem('user') || 'Unknown';
      
      const response = await fetch('http://localhost:3001/add-notice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...noticeForm,
          postedBy: username
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Notice published successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setShowNoticeModal(false);
        setNoticeForm({ title: '', content: '', priority: 'medium', date: '' });
        // Optionally refresh notices list here
      } else {
        toast.error('Failed to publish notice', {
          position: "top-right",
          autoClose: 3000,
        });
      }

    } catch (error) {
      console.error(error);
      toast.error('Error publishing notice', {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsSubmittingNotice(false);
    }
  };

  // Handle event submission
  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingEvent(true);
    
    try {
      const username = localStorage.getItem('user') || 'Unknown';
      
      const response = await fetch('https://nursing-school-backend--thomasmethembe4.replit.app/add-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...eventForm,
          postedBy: username
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Event scheduled successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setShowEventModal(false);
        setEventForm({ title: '', datetime: '', location: '' });
        fetchEvents(); // Refresh events
      } else {
        toast.error('Failed to schedule event', {
          position: "top-right",
          autoClose: 3000,
        });
      }

    } catch (error) {
      console.error(error);
      toast.error('Error scheduling event', {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsSubmittingEvent(false);
    }
  };


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

  const loadingContainer = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    color: '#2563EB'
  };

  const emptyStateContainer = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    color: '#6B7280',
    textAlign: 'center'
  };

  React.useEffect(() => {
    fetchNotices();
    fetchEvents();
  }, []);

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
          <div className="col-lg-4 col-md-12 m-4" style={styles.cardBody}>
            {loadingNotices ? (
              <div style={loadingContainer}>
                <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem', color: '#2563EB' }}>
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p style={{ marginTop: '20px', fontSize: '1.1rem', fontWeight: '500' }}>Loading notices...</p>
              </div>
            ) : notices.length === 0 ? (
              <div style={emptyStateContainer}>
                <Bell size={48} color="#93C5FD" style={{ marginBottom: '15px' }} />
                <h5 style={{ color: '#1E40AF', marginBottom: '10px' }}>No Notices Yet</h5>
                <p style={{ color: '#6B7280', margin: 0 }}>
                  There are currently no school notices. Check back later for updates!
                </p>
              </div>
            ) : (
              notices.map((notice) => (
                <div key={notice._id} style={styles.listItem}>
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
                  <small style={{ color: '#9CA3AF', fontSize: '0.75rem', fontStyle: 'italic' }}>
                    Posted by {notice.postedBy}
                  </small>
                </div>
              ))
            )}
          </div>

          {/* Calendar Events Card */}
          <div className="col-lg-4 col-md-12 m-4" style={styles.cardBody}>
            {loadingEvents ? (
              <div style={loadingContainer}>
                <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem', color: '#2563EB' }}>
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p style={{ marginTop: '20px', fontSize: '1.1rem', fontWeight: '500' }}>Loading events...</p>
              </div>
            ) : events.length === 0 ? (
              <div style={emptyStateContainer}>
                <Calendar size={48} color="#93C5FD" style={{ marginBottom: '15px' }} />
                <h5 style={{ color: '#1E40AF', marginBottom: '10px' }}>No Upcoming Events</h5>
                <p style={{ color: '#6B7280', margin: 0 }}>
                  There are no scheduled events at the moment. Stay tuned for announcements!
                </p>
              </div>
            ) : (
              events.map((event) => (
                <div key={event._id} style={styles.listItem}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px'}}>
                    <h6 style={styles.eventTitle}>
                      {event.title}
                    </h6>
                    <span style={{...styles.badge, backgroundColor: '#BFDBFE', color: '#1E3A8A'}}>
                      {formatDate(event.date)}
                    </span>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                    <span style={styles.eventDetail}>
                      <Clock size={16} />
                      {event.time}
                    </span>
                    <span style={styles.eventDetail}>
                      <MapPin size={16} />
                      {event.location}
                    </span>
                  </div>
                  <small style={{ color: '#9CA3AF', fontSize: '0.75rem', fontStyle: 'italic' }}>
                    Posted by {event.postedBy}
                  </small>
                </div>
              ))
            )}
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
                <form onSubmit={handleNoticeSubmit}>
                  <div className="mb-3">
                    <label className="form-label" style={{ color: '#1E3A8A', fontWeight: 'bold' }}>Notice Title</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. Exam Results" 
                      value={noticeForm.title}
                      onChange={(e) => setNoticeForm({...noticeForm, title: e.target.value})}
                      required 
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label" style={{ color: '#1E3A8A', fontWeight: 'bold' }}>Description</label>
                    <textarea 
                      className="form-control" 
                      rows="3" 
                      placeholder="Enter notice details..."
                      value={noticeForm.content}
                      onChange={(e) => setNoticeForm({...noticeForm, content: e.target.value})}
                      required
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label d-block" style={{ color: '#1E3A8A', fontWeight: 'bold' }}>Priority</label>
                    <div className="form-check form-check-inline">
                      <input 
                        className="form-check-input" 
                        type="radio" 
                        name="priority" 
                        value="high"
                        checked={noticeForm.priority === 'high'}
                        onChange={(e) => setNoticeForm({...noticeForm, priority: e.target.value})}
                      />
                      <label className="form-check-label" htmlFor="high">High</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input 
                        className="form-check-input" 
                        type="radio" 
                        name="priority" 
                        value="medium"
                        checked={noticeForm.priority === 'medium'}
                        onChange={(e) => setNoticeForm({...noticeForm, priority: e.target.value})}
                      />
                      <label className="form-check-label" htmlFor="medium">Medium</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input 
                        className="form-check-input" 
                        type="radio" 
                        name="priority" 
                        value="low"
                        checked={noticeForm.priority === 'low'}
                        onChange={(e) => setNoticeForm({...noticeForm, priority: e.target.value})}
                      />
                      <label className="form-check-label" htmlFor="low">Low</label>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label" style={{ color: '#1E3A8A', fontWeight: 'bold' }}>Schedule Date</label>
                    <input 
                      type="date" 
                      className="form-control"
                      value={noticeForm.date}
                      onChange={(e) => setNoticeForm({...noticeForm, date: e.target.value})}
                      required 
                    />
                  </div>

                 <button type="submit" className="btn w-100" 
                    style={{ 
                      backgroundColor: isSubmittingNotice ? '#93C5FD' : '#1E40AF', 
                      color: 'white', 
                      fontWeight: 'bold', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: '8px' 
                    }}
                    disabled={isSubmittingNotice}
                  >
                    {isSubmittingNotice ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Publishing...
                      </>
                    ) : (
                      <>
                        <Megaphone size={20} />
                        Publish Notice
                      </>
                    )}
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
                <form onSubmit={handleEventSubmit}>
                  <div className="mb-3">
                    <label className="form-label" style={{ color: '#1E3A8A', fontWeight: 'bold' }}>Event Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. Clinical Placement"
                      value={eventForm.title}
                      onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                      required 
                    />
                  </div>
                  
                  <div className="row">
                    <div className="col-md-12 mb-3">
                      <label className="form-label" style={{ color: '#1E3A8A', fontWeight: 'bold' }}>Date and Time</label>
                      <input 
                        type="datetime-local" 
                        className="form-control"
                        value={eventForm.datetime}
                        onChange={(e) => setEventForm({...eventForm, datetime: e.target.value})}
                        required 
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label" style={{ color: '#1E3A8A', fontWeight: 'bold' }}>Location</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. Ward B or Zoom"
                      value={eventForm.location}
                      onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                      required 
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn w-100" 
                    style={{ 
                      backgroundColor: isSubmittingEvent ? '#93C5FD' : '#2563EB', 
                      color: 'white', 
                      fontWeight: 'bold', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: '8px' 
                    }}
                    disabled={isSubmittingEvent}
                  >
                    {isSubmittingEvent ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Scheduling...
                      </>
                    ) : (
                      <>
                        <CalendarPlus size={20} />
                        Confirm Event
                      </>
                    )}
                  </button>
                </form>

              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />

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