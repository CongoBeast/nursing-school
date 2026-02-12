import React from 'react';
import { 
  Megaphone,
  Calendar,
  AlertTriangle,
  AlertCircle,
  Info,
  Bell,
  Clock,
  MapPin,
  Edit2,
  Trash2,
  Plus,
  Search,
  Filter
} from 'lucide-react';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_URL from '../config';

const ManageNoticesEvents = () => {
  const [activeTab, setActiveTab] = React.useState('notices'); // 'notices' or 'events'
  const [notices, setNotices] = React.useState([]);
  const [events, setEvents] = React.useState([]);
  const [loadingNotices, setLoadingNotices] = React.useState(true);
  const [loadingEvents, setLoadingEvents] = React.useState(true);
  
  const [searchTerm, setSearchTerm] = React.useState('');
  const [priorityFilter, setPriorityFilter] = React.useState('all');
  
  const [showNoticeModal, setShowNoticeModal] = React.useState(false);
  const [showEventModal, setShowEventModal] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const [currentItem, setCurrentItem] = React.useState(null);

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

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Fetch notices
  const fetchNotices = async () => {
    setLoadingNotices(true);
    try {
      const response = await fetch(`${API_URL}/get-notices`);
      const data = await response.json();
      setNotices(data);
    } catch (error) {
      console.error('Error fetching notices:', error);
      toast.error('Failed to load notices');
    } finally {
      setLoadingNotices(false);
    }
  };

  // Fetch events
  const fetchEvents = async () => {
    setLoadingEvents(true);
    try {
      const response = await fetch(`${API_URL}/get-events`);
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoadingEvents(false);
    }
  };

  // Open edit modal for notice
const handleEditNotice = (notice) => {
  setEditMode(true);
  setCurrentItem(notice);
  setNoticeForm({
    title: notice.title,
    content: notice.content,
    priority: notice.priority,
    date: notice.date
  });
  setShowNoticeModal(true);
};

// Open edit modal for event
const handleEditEvent = (event) => {
  setEditMode(true);
  setCurrentItem(event);
  
  // Combine date and time back to datetime-local format
  const datetime = `${event.date}T${event.time.replace(/\s*(AM|PM)/i, '')}`;
  
  setEventForm({
    title: event.title,
    datetime: datetime,
    location: event.location
  });
  setShowEventModal(true);
};


  React.useEffect(() => {
    fetchNotices();
    fetchEvents();
  }, []);

  // Update the handleNoticeSubmit function:
    const handleNoticeSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
        const username = localStorage.getItem('user') || 'Unknown';
        
        const url = editMode 
        ? `${API_URL}/update-notice/${currentItem._id}`
        : `${API_URL}/add-notice`;
        
        const method = editMode ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
        method: method,
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
        toast.success(editMode ? 'Notice updated successfully!' : 'Notice published successfully!');
        setShowNoticeModal(false);
        setNoticeForm({ title: '', content: '', priority: 'medium', date: '' });
        setEditMode(false);
        setCurrentItem(null);
        fetchNotices();
        } else {
        toast.error(editMode ? 'Failed to update notice' : 'Failed to publish notice');
        }
    } catch (error) {
        console.error(error);
        toast.error(editMode ? 'Error updating notice' : 'Error publishing notice');
    } finally {
        setIsSubmitting(false);
    }
    };

  // Update the handleEventSubmit function:
    const handleEventSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
        const username = localStorage.getItem('user') || 'Unknown';
        
        const url = editMode 
        ? `${API_URL}/update-event/${currentItem._id}`
        : `${API_URL}/add-event`;
        
        const method = editMode ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
        method: method,
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
        toast.success(editMode ? 'Event updated successfully!' : 'Event scheduled successfully!');
        setShowEventModal(false);
        setEventForm({ title: '', datetime: '', location: '' });
        setEditMode(false);
        setCurrentItem(null);
        fetchEvents();
        } else {
        toast.error(editMode ? 'Failed to update event' : 'Failed to schedule event');
        }
    } catch (error) {
        console.error(error);
        toast.error(editMode ? 'Error updating event' : 'Error scheduling event');
    } finally {
        setIsSubmitting(false);
    }
    };

  // Delete notice
  const handleDeleteNotice = async (noticeId) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) return;

    try {
      // You'll need to add this endpoint to your backend
      const response = await fetch(`${API_URL}/delete-notice/${noticeId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Notice deleted successfully');
        fetchNotices();
      } else {
        toast.error('Failed to delete notice');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error deleting notice');
    }
  };

  // Delete event
  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      // You'll need to add this endpoint to your backend
      const response = await fetch(`${API_URL}/delete-event/${eventId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Event deleted successfully');
        fetchEvents();
      } else {
        toast.error('Failed to delete event');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error deleting event');
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

  const formatDate = (dateString) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Filter notices
  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || notice.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  // Filter events
  const filteredEvents = events.filter(event => {
    return event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           event.location.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Add reset function when closing modals:
    const closeNoticeModal = () => {
    setShowNoticeModal(false);
    setEditMode(false);
    setCurrentItem(null);
    setNoticeForm({ title: '', content: '', priority: 'medium', date: '' });
    };

    const closeEventModal = () => {
    setShowEventModal(false);
    setEditMode(false);
    setCurrentItem(null);
    setEventForm({ title: '', datetime: '', location: '' });
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
      marginBottom: '30px',
      fontSize: '2rem'
    },
    tabContainer: {
      display: 'flex',
      gap: '10px',
      marginBottom: '30px',
      borderBottom: '2px solid #E0E7FF'
    },
    tab: {
      padding: '12px 24px',
      backgroundColor: 'transparent',
      border: 'none',
      borderBottom: '3px solid transparent',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '1rem',
      color: '#6B7280',
      transition: 'all 0.3s ease'
    },
    activeTab: {
      color: '#1E40AF',
      borderBottomColor: '#1E40AF'
    },
    searchBar: {
      display: 'flex',
      gap: '15px',
      marginBottom: '30px',
      flexWrap: 'wrap',
      alignItems: 'center'
    },
    searchInput: {
      flex: '1',
      minWidth: '250px',
      padding: '12px 15px',
      border: '2px solid #E0E7FF',
      borderRadius: '8px',
      fontSize: '1rem'
    },
    filterSelect: {
      padding: '12px 15px',
      border: '2px solid #E0E7FF',
      borderRadius: '8px',
      fontSize: '1rem',
      backgroundColor: 'white'
    },
    addButton: {
      padding: '12px 24px',
      backgroundColor: '#1E40AF',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: 'bold',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '15px',
      boxShadow: '0 2px 8px rgba(30, 58, 138, 0.1)',
      transition: 'all 0.3s ease'
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'start',
      marginBottom: '12px'
    },
    cardTitle: {
      color: '#1E3A8A',
      fontSize: '1.1rem',
      fontWeight: 'bold',
      margin: 0
    },
    cardActions: {
      display: 'flex',
      gap: '8px'
    },
    iconButton: {
      padding: '8px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    badge: {
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '0.75rem',
      fontWeight: 'bold',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px'
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      color: '#6B7280'
    }
  };

  return (
    <div style={styles.body}>
      <div className="container-fluid">
        <h1 style={styles.header}>Manage Notices & Events</h1>

        {/* Tabs */}
        <div style={styles.tabContainer}>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'notices' ? styles.activeTab : {})
            }}
            onClick={() => setActiveTab('notices')}
          >
            <Megaphone size={18} style={{ display: 'inline', marginRight: '8px' }} />
            Notices ({notices.length})
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'events' ? styles.activeTab : {})
            }}
            onClick={() => setActiveTab('events')}
          >
            <Calendar size={18} style={{ display: 'inline', marginRight: '8px' }} />
            Events ({events.length})
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div style={styles.searchBar}>
          <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
            <Search 
              size={20} 
              style={{ 
                position: 'absolute', 
                left: '15px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: '#6B7280'
              }} 
            />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ ...styles.searchInput, paddingLeft: '45px' }}
            />
          </div>

          {activeTab === 'notices' && (
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              style={styles.filterSelect}
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          )}

          <button
            onClick={() => activeTab === 'notices' ? setShowNoticeModal(true) : setShowEventModal(true)}
            style={styles.addButton}
          >
            <Plus size={20} />
            Add {activeTab === 'notices' ? 'Notice' : 'Event'}
          </button>
        </div>

        {/* Content */}
        {activeTab === 'notices' ? (
          <div>
            {loadingNotices ? (
              <div style={{ textAlign: 'center', padding: '60px' }}>
                <div className="spinner-border" style={{ width: '3rem', height: '3rem', color: '#2563EB' }}>
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : filteredNotices.length === 0 ? (
              <div style={styles.emptyState}>
                <Bell size={48} color="#93C5FD" style={{ marginBottom: '15px' }} />
                <h5 style={{ color: '#1E40AF' }}>No Notices Found</h5>
                <p>No notices match your search criteria.</p>
              </div>
            ) : (
              filteredNotices.map((notice) => (
                <div key={notice._id} style={styles.card}>
                  <div style={styles.cardHeader}>
                    <div style={{ flex: 1 }}>
                      <h5 style={styles.cardTitle}>{notice.title}</h5>
                      <p style={{ color: '#4B5563', margin: '8px 0' }}>{notice.content}</p>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '12px' }}>
                        <span 
                          style={{
                            ...styles.badge,
                            backgroundColor: getPriorityColor(notice.priority),
                            color: 'white'
                          }}
                        >
                          {getPriorityIcon(notice.priority)}
                          {notice.priority.toUpperCase()}
                        </span>
                        <small style={{ color: '#6B7280' }}>
                          {formatDate(notice.date)}
                        </small>
                        <small style={{ color: '#9CA3AF', fontStyle: 'italic' }}>
                          by {notice.postedBy}
                        </small>
                      </div>
                    </div>
                    <div style={styles.cardActions}>
                      <button
                        onClick={() => handleEditNotice(notice)}
                        style={{
                            ...styles.iconButton,
                            backgroundColor: '#DBEAFE',
                            color: '#1E40AF'
                        }}
                        title="Edit"
                        >
                        <Edit2 size={18} />
                      </button>

                      <button
                        onClick={() => handleDeleteNotice(notice._id)}
                        style={{
                          ...styles.iconButton,
                          backgroundColor: '#FEE2E2',
                          color: '#DC2626'
                        }}
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div>
            {loadingEvents ? (
              <div style={{ textAlign: 'center', padding: '60px' }}>
                <div className="spinner-border" style={{ width: '3rem', height: '3rem', color: '#2563EB' }}>
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div style={styles.emptyState}>
                <Calendar size={48} color="#93C5FD" style={{ marginBottom: '15px' }} />
                <h5 style={{ color: '#1E40AF' }}>No Events Found</h5>
                <p>No events match your search criteria.</p>
              </div>
            ) : (
              filteredEvents.map((event) => (
                <div key={event._id} style={styles.card}>
                  <div style={styles.cardHeader}>
                    <div style={{ flex: 1 }}>
                      <h5 style={styles.cardTitle}>{event.title}</h5>
                      <div style={{ display: 'flex', gap: '20px', marginTop: '12px', flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2563EB' }}>
                          <Calendar size={16} />
                          {formatDate(event.date)}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2563EB' }}>
                          <Clock size={16} />
                          {event.time}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2563EB' }}>
                          <MapPin size={16} />
                          {event.location}
                        </span>
                      </div>
                      <small style={{ color: '#9CA3AF', fontStyle: 'italic', marginTop: '8px', display: 'block' }}>
                        Posted by {event.postedBy}
                      </small>
                    </div>
                    <div style={styles.cardActions}>
                      <button
                        onClick={() => handleEditEvent(event)}
                        style={{
                            ...styles.iconButton,
                            backgroundColor: '#DBEAFE',
                            color: '#1E40AF'
                        }}
                        title="Edit"
                        >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event._id)}
                        style={{
                          ...styles.iconButton,
                          backgroundColor: '#FEE2E2',
                          color: '#DC2626'
                        }}
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Add Notice Modal */}
      {showNoticeModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: '15px', border: 'none' }}>
              <div className="modal-header" style={{ backgroundColor: '#1E40AF', color: 'white', borderRadius: '15px 15px 0 0' }}>
                <h5 className="modal-title">
                    <Megaphone size={20} style={{ display: 'inline', marginRight: '10px' }} />
                    {editMode ? 'Edit Notice' : 'Add New Notice'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={closeNoticeModal}></button>
              </div>
              <div className="modal-body">
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
                      <label className="form-check-label">High</label>
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
                      <label className="form-check-label">Medium</label>
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
                      <label className="form-check-label">Low</label>
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
                        backgroundColor: isSubmitting ? '#93C5FD' : '#1E40AF', 
                        color: 'white', 
                        fontWeight: 'bold'
                    }}
                    disabled={isSubmitting}
                    >
                    {isSubmitting 
                        ? (editMode ? 'Updating...' : 'Publishing...') 
                        : (editMode ? 'Update Notice' : 'Publish Notice')
                    }
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
              <div className="modal-header" style={{ backgroundColor: '#2563EB', color: 'white', borderRadius: '15px 15px 0 0' }}>
                <h5 className="modal-title">
                    <Calendar size={20} style={{ display: 'inline', marginRight: '10px' }} />
                    {editMode ? 'Edit Event' : 'Schedule New Event'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={closeEventModal}></button>
              </div>
              <div className="modal-body">
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
                  
                  <div className="mb-3">
                    <label className="form-label" style={{ color: '#1E3A8A', fontWeight: 'bold' }}>Date and Time</label>
                    <input 
                      type="datetime-local" 
                      className="form-control"
                      value={eventForm.datetime}
                      onChange={(e) => setEventForm({...eventForm, datetime: e.target.value})}
                      required 
                    />
                  </div>

                  <div className="mb-3">
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
                        backgroundColor: isSubmitting ? '#93C5FD' : '#2563EB', 
                        color: 'white', 
                        fontWeight: 'bold'
                    }}
                    disabled={isSubmitting}
                    >
                    {isSubmitting 
                        ? (editMode ? 'Updating...' : 'Scheduling...') 
                        : (editMode ? 'Update Event' : 'Confirm Event')
                    }
                    </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />

      <style>{`
        .card:hover {
          box-shadow: 0 4px 12px rgba(30, 58, 138, 0.15);
          transform: translateY(-2px);
        }
        .form-control:focus {
          border-color: #3B82F6;
          box-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.25);
        }
        button:hover {
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
};

export default ManageNoticesEvents;