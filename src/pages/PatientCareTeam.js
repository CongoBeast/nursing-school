// PatientCareTeam.js
import React from 'react';
import { Container, Row, Col, Card, Image, Badge, Button } from 'react-bootstrap';
import { Bell, Calendar, Clock, Mail, Phone, MapPin, Star } from 'lucide-react';

const careTeam = [
  {
    name: 'Dr. Linda Mazibuko',
    role: 'Primary Care Physician',
    specialty: 'Internal Medicine',
    image: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZG9jdG9yfGVufDB8fDB8fHww',
    email: 'susan.patel@hospital.org',
    phone: '+1 (555) 123-4567',
    rating: 4.9,
    nextAvailable: '2024-08-15',
    status: 'Available'
  },
  {
    name: 'Dr. Martin Ndebele',
    role: 'Pulmonologist',
    specialty: 'Respiratory Specialist',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGRvY3RvcnxlbnwwfHwwfHx8MA%3D%3D',
    email: 'james.lin@hospital.org',
    phone: '+1 (555) 123-4568',
    rating: 4.8,
    nextAvailable: '2024-08-20',
    status: 'Busy'
  },
  {
    name: 'Dr. Ashley Tshuma',
    role: 'Allergist',
    specialty: 'Immunology',
    image: 'https://images.unsplash.com/photo-1550831107-1553da8c8464?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGRvY3RvcnxlbnwwfHwwfHx8MA%3D%3D',
    email: 'aisha.gomez@hospital.org',
    phone: '+1 (555) 123-4569',
    rating: 4.7,
    nextAvailable: '2024-08-18',
    status: 'Available'
  },
];

const notices = [
  {
    type: 'appointment',
    title: 'Upcoming Appointment Reminder',
    message: 'You have an appointment with Dr. Susan Patel on August 15th at 2:00 PM for your routine checkup.',
    date: '2024-08-10',
    priority: 'high'
  },
  {
    type: 'prescription',
    title: 'Prescription Ready',
    message: 'Your prescription from Dr. James Lin is ready for pickup at the main pharmacy.',
    date: '2024-08-09',
    priority: 'medium'
  },
  {
    type: 'test',
    title: 'Lab Results Available',
    message: 'New lab results from your recent blood work are now available in your patient portal.',
    date: '2024-08-08',
    priority: 'low'
  }
];

const recentVisits = [
  {
    date: '2024-07-25',
    doctor: 'Dr. Susan Patel',
    type: 'Routine Checkup',
    department: 'General Medicine',
    status: 'Completed'
  },
  {
    date: '2024-07-10',
    doctor: 'Dr. James Lin',
    type: 'Follow-up Visit',
    department: 'Pulmonology',
    status: 'Completed'
  },
  {
    date: '2024-06-28',
    doctor: 'Dr. Aisha Gomez',
    type: 'Allergy Testing',
    department: 'Immunology',
    status: 'Completed'
  }
];

const PatientCareTeam = () => {
  const styles = {
    bgMain: { 
      backgroundColor: '#FFF9E5', 
      minHeight: '100vh', 
      padding: '2rem 0' 
    },
    noticeCard: { 
      border: '1px solid #DCD0A8', 
      borderRadius: '1rem', 
      padding: '1.5rem',
      height: '100%',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)'
    },
    doctorCard: { 
      border: '1px solid #DCD0A8', 
      borderRadius: '1rem', 
      padding: '1.5rem', 
      textAlign: 'center',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    },
    primary: { color: '#004030' },
    secondary: { color: '#4A9782' },
    accent: { color: '#DCD0A8' },
    noticeItem: {
      padding: '0.75rem 0',
      borderBottom: '1px solid #e9ecef'
    },
    visitItem: {
      padding: '0.75rem 0',
      borderBottom: '1px solid #e9ecef',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status) => {
    return status === 'Available' ? 'success' : 'warning';
  };

  return (
    <div style={styles.bgMain}>
      <Container>
        <div className="mb-5 text-center">
          <h1 className="display-5 fw-bold mb-2" style={styles.primary}>
            Your Healthcare Dashboard
          </h1>
          <p className="lead" style={styles.secondary}>
            Stay connected with your care team and track your health journey
          </p>
        </div>

        {/* Top Row - Notices and Recent Visits */}
        <Row className="mb-5">
          <Col lg={6} className="mb-4">
            <Card style={styles.noticeCard}>
              <div className="d-flex align-items-center mb-3">
                <Bell size={24} style={styles.secondary} className="me-2" />
                <h4 className="mb-0" style={styles.primary}>Care Team Notices</h4>
              </div>
              <div>
                {notices.map((notice, idx) => (
                  <div key={idx} style={styles.noticeItem} className={idx === notices.length - 1 ? 'border-0' : ''}>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6 className="mb-1" style={styles.secondary}>{notice.title}</h6>
                      <Badge bg={getPriorityColor(notice.priority)} className="ms-2">
                        {notice.priority}
                      </Badge>
                    </div>
                    <p className="mb-1 text-muted small">{notice.message}</p>
                    <div className="d-flex align-items-center text-muted small">
                      <Clock size={14} className="me-1" />
                      {notice.date}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Col>

          <Col lg={6} className="mb-4">
            <Card style={styles.noticeCard}>
              <div className="d-flex align-items-center mb-3">
                <Calendar size={24} style={styles.secondary} className="me-2" />
                <h4 className="mb-0" style={styles.primary}>Recent Visits</h4>
              </div>
              <div>
                {recentVisits.map((visit, idx) => (
                  <div key={idx} style={styles.visitItem} className={idx === recentVisits.length - 1 ? 'border-0' : ''}>
                    <div>
                      <h6 className="mb-1" style={styles.secondary}>{visit.type}</h6>
                      <p className="mb-1 text-muted small">{visit.doctor} • {visit.department}</p>
                      <div className="d-flex align-items-center text-muted small">
                        <Clock size={14} className="me-1" />
                        {visit.date}
                      </div>
                    </div>
                    <Badge bg="success">{visit.status}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        </Row>

        {/* Care Team Section */}
        <div className="mb-4">
          <h2 className="fw-bold mb-4" style={styles.primary}>Your Care Team</h2>
        </div>

        <Row>
          {careTeam.map((doc, idx) => (
            <Col lg={4} md={6} sm={12} className="mb-4" key={idx}>
              <Card 
                style={styles.doctorCard} 
                className="h-100"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.07)';
                }}
              >
                <div className="position-relative mb-3">
                  <Image 
                    src={doc.image} 
                    roundedCircle 
                    width={100} 
                    height={100} 
                    className="border border-3"
                    style={{ borderColor: '#DCD0A8' }}
                  />
                  <Badge 
                    bg={getStatusColor(doc.status)} 
                    className="position-absolute top-0 end-0"
                    style={{ transform: 'translate(25%, -25%)' }}
                  >
                    {doc.status}
                  </Badge>
                </div>

                <h5 className="mb-2" style={styles.primary}>{doc.name}</h5>
                <p className="mb-1 fw-semibold" style={styles.secondary}>{doc.role}</p>
                <p className="mb-3 text-muted">{doc.specialty}</p>

                <div className="mb-3">
                  <div className="d-flex align-items-center justify-content-center mb-2">
                    <Star size={16} className="text-warning me-1" fill="currentColor" />
                    <span className="fw-bold">{doc.rating}</span>
                    <span className="text-muted ms-1">/5.0</span>
                  </div>
                  <p className="small text-muted mb-0">
                    <Calendar size={14} className="me-1" />
                    Next available: {doc.nextAvailable}
                  </p>
                </div>

                <div className="d-flex flex-column gap-2 mb-3">
                  <div className="d-flex align-items-center justify-content-center text-muted small">
                    <Mail size={14} className="me-2" />
                    <span className="text-truncate">{doc.email}</span>
                  </div>
                  <div className="d-flex align-items-center justify-content-center text-muted small">
                    <Phone size={14} className="me-2" />
                    <span>{doc.phone}</span>
                  </div>
                </div>

                <div className="d-grid gap-2">
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    style={{ 
                      borderColor: '#4A9782', 
                      color: '#4A9782',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#4A9782';
                      e.target.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#4A9782';
                    }}
                  >
                    Book Appointment
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    size="sm"
                    style={{ 
                      borderColor: '#004030', 
                      color: '#004030',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#004030';
                      e.target.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#004030';
                    }}
                  >
                    Send Message
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default PatientCareTeam;