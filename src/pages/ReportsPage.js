import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Table, Form, 
  Button, Badge, InputGroup, Spinner, Tabs, Tab, Modal
} from 'react-bootstrap';
import { 
  Search, Filter, Edit3, Eye, Calendar, 
  AlertTriangle, CheckCircle, Clock, MapPin , Wrench
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';

const ReportsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('faults');
  
  // Data States
  const [faults, setFaults] = useState([]);
  const [facilities, setFacilities] = useState([]);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [noticeData, setNoticeData] = useState({
      plannedDate: '',
      status: 'Scheduled',
      notes: ''
    });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [faultRes, facilityRes] = await Promise.all([
        fetch(`${API_URL}/get-fault-reports`),
        fetch(`${API_URL}/get-facility-reports`)
      ]);
      
      const faultData = await faultRes.json();
      const facilityData = await facilityRes.json();
      
      setFaults(faultData);
      setFacilities(facilityData);
      setLoading(false);
    } catch (error) {
      console.error("Error loading reports:", error);
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      'Pending': 'warning',
      'In Progress': 'primary',
      'Fixed': 'success',
      'Completed': 'success',
      'Under Review': 'info'
    };
    return <Badge bg={colors[status] || 'secondary'}>{status}</Badge>;
  };

  // Filter Logic
  const filteredFaults = faults.filter(item => {
    const matchesSearch = item.item?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredFacilities = facilities.filter(item => {
    const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.dorm?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: faults.length + facilities.length,
    pending: [...faults, ...facilities].filter(i => i.status === 'Pending').length,
    completed: [...faults, ...facilities].filter(i => i.status === 'Fixed' || i.status === 'Completed').length
  };

    const handleOpenModal = (report, type) => {
    setSelectedReport({
      id: report._id,
      house: type === 'fault' ? report.house : report.dorm,
      title: type === 'fault' ? report.item : report.title,
      type: type,
      reportedBy: report.reportedBy
    });
    setShowModal(true);
  };

  const handleCreateNotice = async () => {
    const payload = {
      reportId: selectedReport.id,
      houseName: selectedReport.house,
      problemTitle: selectedReport.title,
      maintenanceDate: noticeData.plannedDate,
      status: noticeData.status,
      additionalNotes: noticeData.notes,
      reportedBy: selectedReport.reportedBy
    };

    console.log(payload)

    try {
      const response = await fetch(`${API_URL}/add-maintenance-notice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Maintenance notice created successfully!");
        setShowModal(false);
        fetchData(); // Refresh data
      }
    } catch (error) {
      console.error("Error creating notice:", error);
    }
  };


  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
      <Spinner animation="border" variant="success" />
    </div>
  );

  return (
    <div style={{ backgroundColor: '#F0FDF4', minHeight: '100vh', padding: '2rem 0' }}>
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold" style={{ color: '#15803D' }}>Maintenance Central</h2>
          <Button variant="success" onClick={() => navigate('/maintenance-dashboard')}>Back to Dashboard</Button>
        </div>

        {/* Stats Row */}
        <Row className="mb-4">
          {[
            { label: 'Total Reports', value: stats.total, icon: <Eye />, color: '#3B82F6' },
            { label: 'Pending Action', value: stats.pending, icon: <AlertTriangle />, color: '#EF4444' },
            { label: 'Resolved', value: stats.completed, icon: <CheckCircle />, color: '#10B981' }
          ].map((stat, i) => (
            <Col md={4} key={i}>
              <Card className="border-0 shadow-sm p-3">
                <div className="d-flex align-items-center">
                  <div className="p-3 rounded-circle me-3" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-muted mb-0 small">{stat.label}</p>
                    <h3 className="fw-bold mb-0">{stat.value}</h3>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Filters Section */}
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body>
            <Row className="g-3">
              <Col md={6}>
                <InputGroup>
                  <InputGroup.Text className="bg-white border-end-0">
                    <Search size={18} className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control 
                    className="border-start-0 ps-0"
                    placeholder="Search by item, room, or title..." 
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={3}>
                <Form.Select onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Fixed">Fixed/Completed</option>
                </Form.Select>
              </Col>
              <Col md={3}>
                <Button variant="outline-success" className="w-100 d-flex align-items-center justify-content-center">
                  <Filter size={18} className="me-2" /> Export CSV
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Tables Section */}
        <Card className="border-0 shadow-sm overflow-hidden" style={{ borderRadius: '1rem' }}>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="custom-tabs bg-light px-3 pt-2"
          >
            <Tab eventKey="faults" title="Dorm Faults">
              <Table responsive hover className="mb-0 align-middle">
                <thead className="bg-light">
                  <tr>
                    <th>Image</th>
                    <th>Report Detail</th>
                    <th>Location</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFaults.map(fault => (
                    <tr key={fault._id}>
                      <td>
                        <img 
                          src={fault.imageUrl || 'https://via.placeholder.com/50'} 
                          alt="fault" 
                          style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                      </td>
                      <td>
                        <div className="fw-bold">{fault.item}</div>
                        <div className="small text-muted text-truncate" style={{maxWidth: '200px'}}>{fault.details}</div>
                      </td>
                      <td>
                        <div className="small"><MapPin size={12} /> {fault.house}</div>
                        <div className="fw-bold small">Room: {fault.roomNumber}</div>
                      </td>
                      <td className="small text-muted">
                        {new Date(fault.discoveryDate).toLocaleDateString()}
                      </td>
                      <td>{getStatusBadge(fault.status)}</td>
                      <td className="text-center">
                        <div className="d-flex gap-2 justify-content-center">
                            {/* View Details remains always active */}
                            <Button size="sm" variant="outline-primary" onClick={() => navigate(`/reports/${fault._id}`)}>
                            <Eye size={14} />
                            </Button>

                            {/* Schedule Notice is disabled if status is Fixed/Completed */}
                            <Button 
                            size="sm" 
                            variant={fault.status === 'Fixed' || fault.status === 'Completed' ? "outline-secondary" : "outline-success"}
                            disabled={fault.status === 'Fixed' || fault.status === 'Completed'}
                            onClick={() => handleOpenModal(fault, 'fault')} // or 'facility' for the other table
                            title={fault.status === 'Fixed' ? "Job already finished" : "Schedule Maintenance"}
                            >
                            <Calendar size={14} />
                            </Button>
                        </div>
                       </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Tab>
            
            <Tab eventKey="facilities" title="Facility Damage">
              <Table responsive hover className="mb-0 align-middle">
                <thead className="bg-light">
                  <tr>
                    <th>Image</th>
                    <th>Title & Type</th>
                    <th>Dorm</th>
                    <th>Reported By</th>
                    <th>Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFacilities.map(fac => (
                    <tr key={fac._id}>
                      <td>
                        <img 
                          src={fac.imageUrl || 'https://via.placeholder.com/50'} 
                          alt="facility" 
                          style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                      </td>
                      <td>
                        <div className="fw-bold">{fac.title}</div>
                        <Badge bg="secondary" className="fw-normal">{fac.facilityType}</Badge>
                      </td>
                      <td>{fac.dorm}</td>
                      <td className="small">{fac.reportedBy}</td>
                      <td>{getStatusBadge(fac.status)}</td>
                      <td className="text-center">
                        <div className="d-flex gap-2 justify-content-center">
                            {/* View Details remains always active */}
                            <Button size="sm" variant="outline-primary" onClick={() => navigate(`/reports/${fac._id}`)}>
                            <Eye size={14} />
                            </Button>

                            {/* Schedule Notice is disabled if status is Fixed/Completed */}
                            <Button 
                            size="sm" 
                            variant={fac.status === 'Fixed' || fac.status === 'Completed' ? "outline-secondary" : "outline-success"}
                            disabled={fac.status === 'Fixed' || fac.status === 'Completed'}
                            onClick={() => handleOpenModal(fac, 'facility')} // or 'facility' for the other table
                            title={fac.status === 'Fixed' ? "Job already finished" : "Schedule Maintenance"}
                            >
                            <Calendar size={14} />
                            </Button>
                        </div>
                       </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Tab>
          </Tabs>
        </Card>
      </Container>

      <style>{`
        .custom-tabs .nav-link {
          color: #666;
          border: none;
          padding: 1rem 1.5rem;
          font-weight: 500;
        }
        .custom-tabs .nav-link.active {
          color: #15803D !important;
          background: white !important;
          border-bottom: 3px solid #15803D !important;
        }
        tr:hover { background-color: #F9FAFB; }
      `}</style>

      {/* Maintenance Notice Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton style={{ background: '#15803D', color: 'white' }}>
          <Modal.Title className="h5">
            <Wrench size={20} className="me-2" />
            Create Maintenance Notice
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Row className="mb-4">
            <Col md={6}>
              <label className="text-muted small mb-1">Target Location</label>
              <div className="fw-bold p-2 bg-light rounded border">
                <MapPin size={14} className="me-2 text-success" />
                {selectedReport?.house}
              </div>
            </Col>
            <Col md={6}>
              <label className="text-muted small mb-1">Issue Reference</label>
              <div className="fw-bold p-2 bg-light rounded border text-truncate">
                {selectedReport?.title}
              </div>
            </Col>
          </Row>

          <Form>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label className="fw-bold small">Planned Maintenance Date</Form.Label>
                  <Form.Control 
                    type="date" 
                    required
                    onChange={(e) => setNoticeData({...noticeData, plannedDate: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label className="fw-bold small">Work Status</Form.Label>
                  <Form.Select 
                    onChange={(e) => setNoticeData({...noticeData, status: e.target.value})}
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Urgent">Urgent</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Awaiting Parts">Awaiting Parts</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-bold small">Maintenance Details/Notes</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={3} 
                    placeholder="E.g., Electrician will arrive at 10 AM. Please ensure room access."
                    onChange={(e) => setNoticeData({...noticeData, notes: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="light" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button 
            style={{ backgroundColor: '#15803D', border: 'none' }}
            onClick={handleCreateNotice}
          >
            Publish Notice
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default ReportsPage;