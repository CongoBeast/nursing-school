import React, { useState, useMemo } from 'react';
import {
  CalendarCheck,
  User,
  UserPlus,
  Stethoscope,
  Users,
  Search,
  Plus,
  Calendar,
  Clock,
  Filter,
  Eye,
  Edit,
  Trash2,
  Download,
  RefreshCw,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Table, Badge, Dropdown, Modal, ProgressBar } from 'react-bootstrap';

const PatientBookings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Sample bookings with more details
  const bookings = [
    {
      id: 'BK-001',
      patient: 'Tariro Ndlovu',
      patientId: 'PT-2024-001',
      doctor: 'Dr. John Mukamuri',
      department: 'Cardiology',
      date: '2025-08-10',
      time: '10:00 AM',
      duration: '30 min',
      status: 'Upcoming',
      type: 'Consultation',
      notes: 'Follow-up for chest pain evaluation',
      phone: '+263 77 123 4567',
      email: 'tariro.ndlovu@email.com'
    },
    {
      id: 'BK-002',
      patient: 'Blessing Chikomo',
      patientId: 'PT-2024-002',
      doctor: 'Dr. Sarah Moyo',
      department: 'Pediatrics',
      date: '2025-07-15',
      time: '02:00 PM',
      duration: '45 min',
      status: 'Completed',
      type: 'Check-up',
      notes: 'Routine pediatric examination',
      phone: '+263 77 234 5678',
      email: 'blessing.chikomo@email.com'
    },
    {
      id: 'BK-003',
      patient: 'Patrick Mavhunga',
      patientId: 'PT-2024-003',
      doctor: 'Dr. Michael Chirwa',
      department: 'Surgery',
      date: '2025-07-20',
      time: '01:00 PM',
      duration: '60 min',
      status: 'Cancelled',
      type: 'Pre-surgery',
      notes: 'Pre-operative consultation cancelled by patient',
      phone: '+263 77 345 6789',
      email: 'patrick.mavhunga@email.com'
    },
    {
      id: 'BK-004',
      patient: 'Tinashe Chirwa',
      patientId: 'PT-2024-004',
      doctor: 'Dr. Sarah Moyo',
      department: 'Pediatrics',
      date: '2025-08-01',
      time: '11:30 AM',
      duration: '30 min',
      status: 'Upcoming',
      type: 'Vaccination',
      notes: 'Routine vaccination schedule',
      phone: '+263 77 456 7890',
      email: 'tinashe.chirwa@email.com'
    },
    {
      id: 'BK-005',
      patient: 'Grace Mutindi',
      patientId: 'PT-2024-005',
      doctor: 'Dr. James Banda',
      department: 'Orthopedics',
      date: '2025-08-05',
      time: '09:00 AM',
      duration: '45 min',
      status: 'Confirmed',
      type: 'Follow-up',
      notes: 'Post-surgery follow-up appointment',
      phone: '+263 77 567 8901',
      email: 'grace.mutindi@email.com'
    }
  ];

  const departments = [...new Set(bookings.map(booking => booking.department))];

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const searchMatch =
        booking.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.patientId.toLowerCase().includes(searchTerm.toLowerCase());

      const statusMatch =
        statusFilter === 'all' || booking.status === statusFilter;

      const departmentMatch =
        departmentFilter === 'all' || booking.department === departmentFilter;

      return searchMatch && statusMatch && departmentMatch;
    });
  }, [searchTerm, statusFilter, departmentFilter, bookings]);

  const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
      case 'upcoming':
        return 'primary';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'danger';
      case 'confirmed':
        return 'info';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'upcoming':
        return <Clock size={14} />;
      case 'completed':
        return <CheckCircle size={14} />;
      case 'cancelled':
        return <XCircle size={14} />;
      case 'confirmed':
        return <AlertCircle size={14} />;
      default:
        return <Clock size={14} />;
    }
  };

  const getStats = () => {
    const total = bookings.length;
    const upcoming = bookings.filter(b => b.status === 'Upcoming').length;
    const completed = bookings.filter(b => b.status === 'Completed').length;
    const cancelled = bookings.filter(b => b.status === 'Cancelled').length;
    const confirmed = bookings.filter(b => b.status === 'Confirmed').length;

    return { total, upcoming, completed, cancelled, confirmed };
  };

  const stats = getStats();

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const styles = {
    bgMain: { backgroundColor: '#FFF9E5', minHeight: '100vh', paddingTop: '2rem', paddingBottom: '2rem' },
    primary: { color: '#004030' },
    secondary: { color: '#4A9782' },
    accent: { color: '#DCD0A8' },
    card: {
      border: '1px solid #DCD0A8',
      borderRadius: '1rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
    },
    statCard: {
      border: '1px solid #DCD0A8',
      borderRadius: '1rem',
      padding: '1.5rem',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
      transition: 'all 0.3s ease'
    },
    actionButton: {
      border: 'none',
      padding: '0.25rem 0.5rem',
      borderRadius: '0.375rem',
      marginRight: '0.25rem',
      transition: 'all 0.3s ease'
    }
  };

  return (
    <div style={styles.bgMain}>
      <Container fluid className="px-4">
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex align-items-center mb-2">
              <CalendarCheck size={32} style={styles.primary} className="me-3" />
              <div>
                <h1 className="display-5 fw-bold mb-0" style={styles.primary}>
                  Patient Bookings Management
                </h1>
                <p className="fs-6 mb-0" style={styles.secondary}>
                  Comprehensive appointment scheduling and management system
                </p>
              </div>
            </div>
          </Col>
          <Col xs="auto" className="d-flex align-items-center gap-2">
            <Button 
              variant="outline-secondary" 
              className="d-flex align-items-center gap-2"
              style={{ borderColor: '#4A9782', color: '#4A9782' }}
            >
              <Download size={16} />
              Export
            </Button>
            <Button 
              variant="outline-secondary" 
              className="d-flex align-items-center gap-2"
              style={{ borderColor: '#4A9782', color: '#4A9782' }}
            >
              <RefreshCw size={16} />
              Refresh
            </Button>
            <Button 
              style={{ backgroundColor: '#4A9782', borderColor: '#4A9782' }}
              className="d-flex align-items-center gap-2"
            >
              <Plus size={16} />
              New Booking
            </Button>
          </Col>
        </Row>

        {/* Statistics Cards */}
        <Row className="mb-4">
          <Col xl={3} lg={6} md={6} className="mb-3">
            <Card style={styles.statCard}>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h3 className="fw-bold mb-1" style={styles.primary}>{stats.total}</h3>
                  <p className="mb-0 text-muted small">Total Bookings</p>
                </div>
                <div className="p-3 rounded-circle" style={{ backgroundColor: 'rgba(74, 151, 130, 0.1)' }}>
                  <Calendar size={24} style={styles.secondary} />
                </div>
              </div>
            </Card>
          </Col>
          <Col xl={3} lg={6} md={6} className="mb-3">
            <Card style={styles.statCard}>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h3 className="fw-bold mb-1 text-primary">{stats.upcoming + stats.confirmed}</h3>
                  <p className="mb-0 text-muted small">Upcoming</p>
                </div>
                <div className="p-3 rounded-circle" style={{ backgroundColor: 'rgba(13, 110, 253, 0.1)' }}>
                  <Clock size={24} className="text-primary" />
                </div>
              </div>
            </Card>
          </Col>
          <Col xl={3} lg={6} md={6} className="mb-3">
            <Card style={styles.statCard}>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h3 className="fw-bold mb-1 text-success">{stats.completed}</h3>
                  <p className="mb-0 text-muted small">Completed</p>
                </div>
                <div className="p-3 rounded-circle" style={{ backgroundColor: 'rgba(25, 135, 84, 0.1)' }}>
                  <CheckCircle size={24} className="text-success" />
                </div>
              </div>
            </Card>
          </Col>
          <Col xl={3} lg={6} md={6} className="mb-3">
            <Card style={styles.statCard}>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h3 className="fw-bold mb-1 text-danger">{stats.cancelled}</h3>
                  <p className="mb-0 text-muted small">Cancelled</p>
                </div>
                <div className="p-3 rounded-circle" style={{ backgroundColor: 'rgba(220, 53, 69, 0.1)' }}>
                  <XCircle size={24} className="text-danger" />
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Filters */}
        <Card style={styles.card} className="mb-4">
          <Card.Body>
            <div className="d-flex align-items-center mb-3">
              <Filter size={20} style={styles.secondary} className="me-2" />
              <h5 className="mb-0" style={styles.primary}>Search & Filter</h5>
            </div>
            <Row className="g-3">
              <Col lg={4} md={6}>
                <Form.Label className="fw-semibold" style={styles.secondary}>Search</Form.Label>
                <InputGroup>
                  <InputGroup.Text style={{ backgroundColor: '#DCD0A8', borderColor: '#DCD0A8' }}>
                    <Search size={16} style={styles.primary} />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search by patient, doctor, or ID"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ borderColor: '#DCD0A8' }}
                  />
                </InputGroup>
              </Col>

              <Col lg={3} md={6}>
                <Form.Label className="fw-semibold" style={styles.secondary}>Status</Form.Label>
                <Form.Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ borderColor: '#DCD0A8' }}
                >
                  <option value="all">All Status</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </Form.Select>
              </Col>

              <Col lg={3} md={6}>
                <Form.Label className="fw-semibold" style={styles.secondary}>Department</Form.Label>
                <Form.Select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  style={{ borderColor: '#DCD0A8' }}
                >
                  <option value="all">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </Form.Select>
              </Col>

              <Col lg={2} md={6} className="d-flex align-items-end">
                <Button 
                  variant="outline-secondary"
                  className="w-100"
                  style={{ borderColor: '#4A9782', color: '#4A9782' }}
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setDepartmentFilter('all');
                  }}
                >
                  Clear Filters
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Bookings Table */}
        <Card style={styles.card}>
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-bold mb-0" style={styles.primary}>
                Booking Records ({filteredBookings.length})
              </h4>
              <div className="d-flex align-items-center gap-2">
                <small className="text-muted">
                  Showing {filteredBookings.length} of {bookings.length} bookings
                </small>
              </div>
            </div>
            
            {filteredBookings.length > 0 ? (
              <div className="table-responsive">
                <Table hover className="align-middle mb-0">
                  <thead style={{ backgroundColor: '#f8f9fa' }}>
                    <tr>
                      <th className="border-0 fw-semibold" style={styles.primary}>#</th>
                      <th className="border-0 fw-semibold" style={styles.primary}>Patient Details</th>
                      <th className="border-0 fw-semibold" style={styles.primary}>Doctor & Department</th>
                      <th className="border-0 fw-semibold" style={styles.primary}>Appointment</th>
                      <th className="border-0 fw-semibold" style={styles.primary}>Type</th>
                      <th className="border-0 fw-semibold" style={styles.primary}>Status</th>
                      <th className="border-0 fw-semibold" style={styles.primary}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking, idx) => (
                      <tr key={booking.id}>
                        <td className="fw-medium">{idx + 1}</td>
                        <td>
                          <div>
                            <div className="fw-semibold" style={styles.primary}>{booking.patient}</div>
                            <small className="text-muted">{booking.patientId}</small>
                          </div>
                        </td>
                        <td>
                          <div>
                            <div className="fw-medium">{booking.doctor}</div>
                            <small style={styles.secondary}>{booking.department}</small>
                          </div>
                        </td>
                        <td>
                          <div>
                            <div className="d-flex align-items-center mb-1">
                              <Calendar size={14} className="me-1" style={styles.secondary} />
                              <span className="fw-medium">{booking.date}</span>
                            </div>
                            <div className="d-flex align-items-center">
                              <Clock size={14} className="me-1" style={styles.secondary} />
                              <small className="text-muted">{booking.time} ({booking.duration})</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="fw-medium">{booking.type}</span>
                        </td>
                        <td>
                          <Badge 
                            bg={getStatusVariant(booking.status)} 
                            className="d-flex align-items-center gap-1 w-fit"
                          >
                            {getStatusIcon(booking.status)}
                            {booking.status}
                          </Badge>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button
                              variant="outline-info"
                              size="sm"
                              style={styles.actionButton}
                              onClick={() => handleViewDetails(booking)}
                              title="View Details"
                            >
                              <Eye size={14} />
                            </Button>
                            <Button
                              variant="outline-warning"
                              size="sm"
                              style={styles.actionButton}
                              title="Edit Booking"
                            >
                              <Edit size={14} />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              style={styles.actionButton}
                              title="Cancel Booking"
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-5">
                <CalendarCheck size={64} className="text-muted mb-3" />
                <h5 className="text-muted mb-2">No bookings found</h5>
                <p className="text-muted">Try adjusting your search criteria or add a new booking</p>
                <Button style={{ backgroundColor: '#4A9782', borderColor: '#4A9782' }}>
                  <Plus size={16} className="me-2" />
                  Create New Booking
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>

      {/* Booking Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton style={{ backgroundColor: '#f8f9fa' }}>
          <Modal.Title style={styles.primary}>
            <CalendarCheck size={24} className="me-2" />
            Booking Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBooking && (
            <Row>
              <Col md={6}>
                <h6 style={styles.secondary}>Patient Information</h6>
                <div className="mb-3">
                  <p className="mb-1"><strong>Name:</strong> {selectedBooking.patient}</p>
                  <p className="mb-1"><strong>Patient ID:</strong> {selectedBooking.patientId}</p>
                  <p className="mb-1"><strong>Phone:</strong> {selectedBooking.phone}</p>
                  <p className="mb-1"><strong>Email:</strong> {selectedBooking.email}</p>
                </div>
              </Col>
              <Col md={6}>
                <h6 style={styles.secondary}>Appointment Details</h6>
                <div className="mb-3">
                  <p className="mb-1"><strong>Doctor:</strong> {selectedBooking.doctor}</p>
                  <p className="mb-1"><strong>Department:</strong> {selectedBooking.department}</p>
                  <p className="mb-1"><strong>Date:</strong> {selectedBooking.date}</p>
                  <p className="mb-1"><strong>Time:</strong> {selectedBooking.time}</p>
                  <p className="mb-1"><strong>Duration:</strong> {selectedBooking.duration}</p>
                  <p className="mb-1"><strong>Type:</strong> {selectedBooking.type}</p>
                  <p className="mb-1">
                    <strong>Status:</strong>{' '}
                    <Badge bg={getStatusVariant(selectedBooking.status)}>
                      {selectedBooking.status}
                    </Badge>
                  </p>
                </div>
              </Col>
              <Col xs={12}>
                <h6 style={styles.secondary}>Notes</h6>
                <p className="text-muted">{selectedBooking.notes}</p>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button style={{ backgroundColor: '#4A9782', borderColor: '#4A9782' }}>
            Edit Booking
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PatientBookings;