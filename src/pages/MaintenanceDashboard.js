import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Button, Badge, Spinner, Alert, ProgressBar 
} from 'react-bootstrap';
import { 
  Wrench, AlertTriangle, Calendar, CheckCircle, Clock, 
  Eye, XCircle, Activity, TrendingUp, FileText,
  ChevronRight, MapPin, User, Bell
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';


const MaintenanceDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState({
    faults: 0,
    maintenance: 0,
    damage: 0,
    total: 0
  });
  
  const [faultReports, setFaultReports] = useState([]);
  const [maintenanceItems, setMaintenanceItems] = useState([]);
  const [facilityReports, setFacilityReports] = useState([]);



  useEffect(() => {
    // Get user info from localStorage
    const user = localStorage.getItem('user');
    setUserName(user || 'Maintenance Crew');

    // Fetch dashboard data
    fetchDashboardData();
  }, []);


  // 1. UPDATE THE fetchDashboardData FUNCTION

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch fault reports
        const faultResponse = await fetch(`${API_URL}/get-fault-reports`);
        const faultData = await faultResponse.json();
        
        // Fetch facility damage reports
        const facilityResponse = await fetch(`${API_URL}/get-facility-reports`);
        const facilityData = await facilityResponse.json();
        
        // Transform fault reports
        const transformedFaults = faultData.map(fault => ({
          id: fault._id,
          title: `${fault.item} - ${fault.roomNumber}`,
          description: fault.details || `Fault reported in ${fault.house}`,
          location: `${fault.house} - ${fault.roomNumber}`,
          reportedBy: fault.reportedBy,
          reportedDate: fault.discoveryDate,
          priority: fault.status === 'Pending' ? 'High' : fault.status === 'In Progress' ? 'Medium' : 'Low',
          status: fault.status,
          image: fault.imageUrl || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400',
          type: 'fault'
        }));
        
        // Transform facility reports
        const transformedFacilities = facilityData.map(facility => ({
          id: facility._id,
          title: facility.title,
          description: facility.description || `Facility damage in ${facility.dorm}`,
          location: `${facility.dorm} - ${facility.facilityType}`,
          reportedBy: facility.reportedBy,
          reportedDate: facility.discoveryDate,
          severity: facility.status === 'Pending' ? 'High' : facility.status === 'In Progress' ? 'Medium' : 'Low',
          status: facility.status,
          image: facility.imageUrl || 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400',
          type: 'facility',
          facilityType: facility.facilityType,
          progress: facility.status === 'Fixed' ? 100 : facility.status === 'In Progress' ? 50 : 0
        }));
        
        setFaultReports(transformedFaults);
        setFacilityReports(transformedFacilities);
        
        // Calculate stats
        setStats({
          faults: transformedFaults.length,
          maintenance: 0, // No longer used
          damage: transformedFacilities.length,
          total: transformedFaults.length + transformedFacilities.length
        });
        
        setLoading(false);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return '#DC2626';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return '#10B981';
      case 'in progress':
        return '#3B82F6';
      case 'scheduled':
        return '#8B5CF6';
      case 'pending':
        return '#F59E0B';
      case 'under review':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  const customStyles = {
    dashboardBg: {
      background: 'linear-gradient(135deg, #F0FDF4 0%, #E8F5E9 100%)',
      minHeight: '100vh',
      padding: '2rem 0'
    },
    welcomeCard: {
      background: 'linear-gradient(135deg, #15803D 0%, #16A34A 100%)',
      color: 'white',
      borderRadius: '1.5rem',
      padding: '2rem',
      marginBottom: '2rem',
      boxShadow: '0 10px 30px rgba(20, 83, 45, 0.2)'
    },
    statCard: {
      borderRadius: '1rem',
      padding: '1.5rem',
      border: 'none',
      boxShadow: '0 4px 15px rgba(20, 83, 45, 0.1)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      height: '100%'
    },
    badge: {
      padding: '0.35rem 0.75rem',
      borderRadius: '0.5rem',
      fontWeight: '500',
      fontSize: '0.75rem'
    }
  };

  if (loading) {
    return (
      <div style={customStyles.dashboardBg} className="d-flex justify-content-center align-items-center">
        <div className="text-center">
          <Spinner animation="border" style={{ color: '#16A34A' }} />
          <p className="mt-3" style={{ color: '#15803D' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={customStyles.dashboardBg}>
      <Container>
        {/* Welcome Section */}
        <Card style={customStyles.welcomeCard} className="mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h2 fw-bold mb-2">Welcome back, {userName}! 👋</h1>
              <p className="mb-0 opacity-90">
                Here's an overview of your maintenance tasks and reports
              </p>
            </div>
            <div className="d-none d-md-block">
              <Wrench size={60} style={{ opacity: 0.3 }} />
            </div>
          </div>
        </Card>

        {/* Stats Cards */}
        <Row className="mb-4">
          <Col md={6} className="mb-3">
            <Card 
              style={{...customStyles.statCard, borderLeft: '4px solid #DC2626'}}
              onClick={() => navigate('/fault-reports')}
            >
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1 small">Fault Reports</p>
                  <h2 className="fw-bold mb-0" style={{ color: '#15803D' }}>{stats.faults}</h2>
                  <small className="text-muted">Pending attention</small>
                </div>
                <div style={{ 
                  backgroundColor: '#FEE2E2', 
                  padding: '1rem', 
                  borderRadius: '0.75rem' 
                }}>
                  <AlertTriangle size={24} color="#DC2626" />
                </div>
              </div>
            </Card>
          </Col>

          <Col md={6} className="mb-3">
            <Card 
              style={{...customStyles.statCard, borderLeft: '4px solid #F59E0B'}}
              onClick={() => navigate('/facility-reports')}
            >
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1 small">Facility Damage Reports</p>
                  <h2 className="fw-bold mb-0" style={{ color: '#15803D' }}>{stats.damage}</h2>
                  <small className="text-muted">Under review</small>
                </div>
                <div style={{ 
                  backgroundColor: '#FEF3C7', 
                  padding: '1rem', 
                  borderRadius: '0.75rem' 
                }}>
                  <XCircle size={24} color="#F59E0B" />
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Fault Reports Card */}
        <div className='row'>

        <Col md={6} className="mb-4">
          <Card style={{ 
            borderRadius: '1.5rem', 
            border: 'none', 
            boxShadow: '0 10px 30px rgba(20, 83, 45, 0.15)',
            overflow: 'hidden'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
              color: 'white',
              padding: '1.5rem'
            }}>
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <AlertTriangle size={32} className="me-3" />
                  <div>
                    <h3 className="mb-0 fw-bold">Dorm Fault Reports</h3>
                    <p className="mb-0 small opacity-90">{faultReports.length} pending issues requiring attention</p>
                  </div>
                </div>
                <Button 
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    border: '2px solid white',
                    borderRadius: '0.5rem',
                    color: 'white',
                    fontWeight: '500'
                  }}
                  onClick={() => navigate('/reports-page')}
                >
                  View All <ChevronRight size={16} className="ms-1" />
                </Button>
              </div>
            </div>

            <Card.Body style={{ padding: '1.5rem' }}>
              {faultReports.length === 0 ? (
                <div className="text-center py-5">
                  <CheckCircle size={48} color="#10B981" className="mb-3" />
                  <p className="text-muted">No pending fault reports</p>
                </div>
              ) : (
                <div>
                  {faultReports.map((report, index) => (
                    <div 
                      key={report.id}
                      style={{
                        borderBottom: index !== faultReports.length - 1 ? '1px solid #E5E7EB' : 'none',
                        padding: '1.25rem 0'
                      }}
                    >
                      <Row className="align-items-center">
                        <Col md={3} className="mb-3 mb-md-0">
                          <img 
                            src={report.image} 
                            alt={report.title}
                            style={{
                              width: '100%',
                              height: '120px',
                              objectFit: 'cover',
                              borderRadius: '0.75rem'
                            }}
                          />
                        </Col>
                        <Col md={6} className="mb-3 mb-md-0">
                          <div className="mb-2">
                            <Badge 
                              style={{ 
                                backgroundColor: getPriorityColor(report.priority),
                                ...customStyles.badge,
                                marginRight: '0.5rem'
                              }}
                            >
                              {report.priority} Priority
                            </Badge>
                            <Badge 
                              style={{ 
                                backgroundColor: getStatusColor(report.status),
                                ...customStyles.badge
                              }}
                            >
                              {report.status}
                            </Badge>
                          </div>
                          <h5 className="fw-bold mb-2" style={{ color: '#15803D' }}>
                            {report.title}
                          </h5>
                          <p className="text-muted small mb-2">
                            {report.description}
                          </p>
                          <div className="d-flex flex-wrap gap-3">
                            <div className="d-flex align-items-center small text-muted">
                              <MapPin size={14} className="me-1" />
                              {report.location}
                            </div>
                            <div className="d-flex align-items-center small text-muted">
                              <User size={14} className="me-1" />
                              {report.reportedBy}
                            </div>
                            <div className="d-flex align-items-center small text-muted">
                              <Calendar size={14} className="me-1" />
                              {new Date(report.reportedDate).toLocaleDateString()}
                            </div>
                          </div>
                        </Col>
                        {/* <Col md={3} className="text-md-end">
                          <Button 
                            style={{
                              background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
                              border: 'none',
                              borderRadius: '0.5rem',
                              padding: '0.5rem 1.5rem',
                              color: 'white',
                              fontWeight: '500',
                              width: '100%'
                            }}
                            onClick={() => navigate(`/fault-reports/${report.id}`)}
                          >
                            <Eye size={16} className="me-2" />
                            View Details
                          </Button>
                        </Col> */}
                      </Row>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Maintenance Tasks Card */}
        <Col lg={6} className="mb-4">
            <Card style={{ 
              borderRadius: '1.5rem', 
              border: 'none', 
              boxShadow: '0 10px 30px rgba(20, 83, 45, 0.15)',
              overflow: 'hidden',
              height: '100%'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                color: 'white',
                padding: '1.5rem'
              }}>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <XCircle size={32} className="me-3" />
                    <div>
                      <h3 className="mb-0 fw-bold">Facility Damage Reports</h3>
                      <p className="mb-0 small opacity-90">{facilityReports.length} facility issues reported</p>
                    </div>
                  </div>
                  <Button 
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      border: '2px solid white',
                      borderRadius: '0.5rem',
                      color: 'white',
                      fontWeight: '500'
                    }}
                    onClick={() => navigate('/reports-page')}
                  >
                    View All <ChevronRight size={16} className="ms-1" />
                  </Button>
                </div>
              </div>

              <Card.Body style={{ padding: '1.5rem', maxHeight: '600px', overflowY: 'auto' }}>
                {facilityReports.length === 0 ? (
                  <div className="text-center py-5">
                    <CheckCircle size={48} color="#10B981" className="mb-3" />
                    <p className="text-muted">No facility damage reports</p>
                  </div>
                ) : (
                  <div>
                    {facilityReports.map((report, index) => (
                      <div 
                        key={report.id}
                        style={{
                          borderBottom: index !== facilityReports.length - 1 ? '1px solid #E5E7EB' : 'none',
                          padding: '1.25rem 0'
                        }}
                      >
                        <Row className="align-items-center">
                          <Col xs={12} md={4} className="mb-3 mb-md-0">
                            <img 
                              src={report.image} 
                              alt={report.title}
                              style={{
                                width: '100%',
                                height: '120px',
                                objectFit: 'cover',
                                borderRadius: '0.75rem'
                              }}
                            />
                          </Col>
                          <Col xs={12} md={8}>
                            <div className="mb-2">
                              <Badge 
                                style={{ 
                                  backgroundColor: '#F59E0B',
                                  ...customStyles.badge,
                                  marginRight: '0.5rem'
                                }}
                              >
                                {report.facilityType}
                              </Badge>
                              <Badge 
                                style={{ 
                                  backgroundColor: getStatusColor(report.status),
                                  ...customStyles.badge
                                }}
                              >
                                {report.status}
                              </Badge>
                            </div>
                            <h6 className="fw-bold mb-2" style={{ color: '#15803D' }}>
                              {report.title}
                            </h6>
                            <p className="text-muted small mb-2">
                              {report.description}
                            </p>
                            
                            {/* Progress Bar */}
                            {/* <div className="mb-2">
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                <small className="text-muted">Progress</small>
                                <small className="fw-bold" style={{ color: '#15803D' }}>{report.progress}%</small>
                              </div>
                              <div style={{
                                width: '100%',
                                height: '8px',
                                backgroundColor: '#E5E7EB',
                                borderRadius: '10px',
                                overflow: 'hidden'
                              }}>
                                <div style={{
                                  width: `${report.progress}%`,
                                  height: '100%',
                                  background: 'linear-gradient(90deg, #F59E0B 0%, #FBBF24 100%)',
                                  borderRadius: '10px',
                                  transition: 'width 0.3s ease'
                                }} />
                              </div>
                            </div> */}

                            <div className="d-flex flex-wrap gap-3">
                              <div className="d-flex align-items-center small text-muted">
                                <MapPin size={14} className="me-1" />
                                {report.location}
                              </div>
                              <div className="d-flex align-items-center small text-muted">
                                <User size={14} className="me-1" />
                                {report.reportedBy}
                              </div>
                              <div className="d-flex align-items-center small text-muted">
                                <Calendar size={14} className="me-1" />
                                {new Date(report.reportedDate).toLocaleDateString()}
                              </div>
                            </div>

                            {/* <Button 
                              className="mt-3"
                              style={{
                                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                                border: 'none',
                                borderRadius: '0.5rem',
                                padding: '0.5rem 1.5rem',
                                color: 'white',
                                fontWeight: '500',
                                width: '100%'
                              }}
                              onClick={() => navigate(`/facility-reports/${report.id}`)}
                            >
                              <Eye size={16} className="me-2" />
                              View Details
                            </Button> */}
                          </Col>
                        </Row>
                      </div>
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

        </div>
      </Container>

    </div>
  );
};

export default MaintenanceDashboard;