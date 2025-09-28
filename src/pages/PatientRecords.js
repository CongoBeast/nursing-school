// PatientRecords.js
import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Table } from 'react-bootstrap';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const visitData = [
  {
    date: new Date(2025, 6, 10),
    doctor: 'Dr. Susan Patel',
    diagnosis: 'Hypertension',
    notes: 'Advised lifestyle changes and prescribed medication.'
  },
  {
    date: new Date(2025, 6, 15),
    doctor: 'Dr. James Lin',
    diagnosis: 'Seasonal Flu',
    notes: 'Recommended rest and hydration.'
  },
  {
    date: new Date(2025, 6, 20),
    doctor: 'Dr. Aisha Gomez',
    diagnosis: 'Allergic Rhinitis',
    notes: 'Prescribed antihistamines.'
  },
];

const PatientRecords = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  const styles = {
    bgMain: { backgroundColor: '#FFF9E5', minHeight: '100vh', padding: '2rem 0' },
    card: { border: '1px solid #DCD0A8', borderRadius: '1rem' },
    primary: { color: '#004030' },
    secondary: { color: '#4A9782' },
    highlight: { backgroundColor: '#4A9782', color: 'white' },
  };

  const tileClassName = ({ date, view }) => {
    if (visitData.find(v => v.date.toDateString() === date.toDateString())) {
      return 'highlight';
    }
    return null;
  };

  const filteredVisits = selectedDate
    ? visitData.filter(v => v.date.toDateString() === selectedDate.toDateString())
    : visitData;

  return (
    <div style={styles.bgMain}>
      <Container>
        <h1 className="display-5 fw-bold mb-4" style={styles.primary}>Your Hospital Records</h1>
        <Row>
          <Col md={5} className="mb-4">
            <Card style={styles.card} className="shadow-sm p-3">
              <h5 style={styles.secondary}>Visit Calendar</h5>
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileClassName={tileClassName}
              />
            </Card>
          </Col>
          <Col md={7}>
            <Card style={styles.card} className="shadow-sm p-3">
              <h5 style={styles.secondary}>Visit Details</h5>
              {filteredVisits.length === 0 ? (
                <p className="text-muted">No visit found for the selected date.</p>
              ) : (
                <Table bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Doctor</th>
                      <th>Diagnosis</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVisits.map((visit, idx) => (
                      <tr key={idx}>
                        <td>{visit.date.toDateString()}</td>
                        <td>{visit.doctor}</td>
                        <td>{visit.diagnosis}</td>
                        <td>{visit.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
              <Button variant="outline-success" onClick={() => setSelectedDate(null)} className="mt-2">
                Show All Records
              </Button>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PatientRecords;
