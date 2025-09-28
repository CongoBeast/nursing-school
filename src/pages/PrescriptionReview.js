// PrescriptionReview.js
import React, { useState, useMemo } from 'react';
import { FileText, User, Calendar, Search, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { Container, Row, Col, Card, Button, InputGroup, Form, Badge } from 'react-bootstrap';

const prescriptions = [
  {
    id: 'RX-001',
    patientId: 'PAT-001',
    patientName: 'Tendai Mukamuri',
    dateIssued: '2024-07-20',
    physician: 'Dr. Chikomo',
    notes: 'Take 1 tablet twice daily after meals.',
    medications: [
      { name: 'Amoxicillin', dosage: '500mg', frequency: '2x/day' },
      { name: 'Paracetamol', dosage: '500mg', frequency: '3x/day' }
    ]
  },
  {
    id: 'RX-002',
    patientId: 'PAT-002',
    patientName: 'Grace Chivanga',
    dateIssued: '2024-07-22',
    physician: 'Dr. Chikomo',
    notes: 'Avoid driving after taking medication.',
    medications: [
      { name: 'Diazepam', dosage: '5mg', frequency: '1x/day' }
    ]
  }
];

const PrescriptionReview = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expanded, setExpanded] = useState(null);

  const filteredPrescriptions = useMemo(() => {
    return prescriptions.filter(p =>
      p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const styles = {
    bgMain: { backgroundColor: '#FFF9E5', minHeight: '100vh', padding: '2rem 0' },
    card: { border: '1px solid #DCD0A8', borderRadius: '1rem' },
    primary: { color: '#004030' },
    secondary: { color: '#4A9782' },
    badge: { backgroundColor: '#4A9782' },
    btnMain: { backgroundColor: '#004030', borderColor: '#004030' },
    btnMainHover: { backgroundColor: '#002820' }
  };

  return (
    <div style={styles.bgMain}>
      <Container>
        <h1 className="display-5 fw-bold mb-4" style={styles.primary}>Prescriptions Review</h1>
        <Row className="mb-4">
          <Col md={10}>
            <InputGroup>
              <InputGroup.Text className="bg-light">
                <Search size={16} style={styles.primary} />
              </InputGroup.Text>
              <Form.Control
                placeholder="Search prescriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={2}>
            <Button style={styles.btnMain} className="w-100" onClick={() => setSearchTerm('')}>
              <Download size={16} />
            </Button>
          </Col>
        </Row>

        {filteredPrescriptions.map((p) => (
          <Card key={p.id} className="mb-3 shadow-sm" style={styles.card}>
            <Card.Body>
              <Row className="align-items-center">
                <Col md={9}>
                  <h5 style={styles.primary}>{p.patientName}</h5>
                  <div className="text-muted small mb-1">
                    <span>{p.id}</span> • <span>{p.patientId}</span>
                  </div>
                  <div className="text-muted small mb-1">
                    <User size={12} /> Prescribed by {p.physician}
                  </div>
                  <div className="text-muted small">
                    <Calendar size={12} /> {new Date(p.dateIssued).toLocaleDateString()}
                  </div>
                </Col>
                <Col md={3} className="text-md-end">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => setExpanded(expanded === p.id ? null : p.id)}
                  >
                    {expanded === p.id ? <><ChevronUp size={14} /> Hide</> : <><ChevronDown size={14} /> View</>}
                  </Button>
                </Col>
              </Row>
              {expanded === p.id && (
                <div className="mt-3">
                  <p className="mb-1"><strong style={styles.primary}>Notes:</strong> {p.notes}</p>
                  <p className="mb-1"><strong style={styles.primary}>Medications:</strong></p>
                  <ul className="mb-0">
                    {p.medications.map((m, i) => (
                      <li key={i} className="small">{m.name} - {m.dosage} ({m.frequency})</li>
                    ))}
                  </ul>
                </div>
              )}
            </Card.Body>
          </Card>
        ))}

        {filteredPrescriptions.length === 0 && (
          <div className="text-center py-5">
            <FileText size={48} style={styles.secondary} className="mb-3" />
            <p className="h5" style={styles.secondary}>No prescriptions found</p>
            <p style={styles.secondary}>Try a different search term</p>
          </div>
        )}
      </Container>
    </div>
  );
};

export default PrescriptionReview;
