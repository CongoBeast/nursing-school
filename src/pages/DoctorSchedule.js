// DoctorSchedule.js
import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, ButtonGroup, Badge, ProgressBar } from 'react-bootstrap';
import { Calendar, Clock } from 'lucide-react';

const scheduleData = {
  daily: [
    { time: '08:00 AM', title: 'Morning Briefing', type: 'Meeting' },
    { time: '10:30 AM', title: 'Patient Review: Ward 3', type: 'Rounds' },
    { time: '02:00 PM', title: 'Vaccination Campaign Prep', type: 'Campaign' },
  ],
  weekly: [
    { day: 'Monday', events: 4 },
    { day: 'Tuesday', events: 3 },
    { day: 'Wednesday', events: 2 },
    { day: 'Thursday', events: 6 },
    { day: 'Friday', events: 1 },
  ],
  monthly: [
    { week: 'Week 1', events: 10 },
    { week: 'Week 2', events: 15 },
    { week: 'Week 3', events: 8 },
    { week: 'Week 4', events: 5 },
  ]
};

const DoctorSchedule = () => {
  const [view, setView] = useState('daily');

  const styles = {
    bgMain: { backgroundColor: '#FFF9E5', minHeight: '100vh', padding: '2rem 0' },
    card: { border: '1px solid #DCD0A8', borderRadius: '1rem' },
    primary: { color: '#004030' },
    secondary: { color: '#4A9782' },
    badge: { backgroundColor: '#4A9782' },
    btnMain: { backgroundColor: '#004030', borderColor: '#004030' },
    btnToggle: { backgroundColor: '#4A9782', borderColor: '#4A9782' }
  };

  return (
    <div style={styles.bgMain}>
      <Container>
        <h1 className="display-5 fw-bold mb-4" style={styles.primary}>Doctor Schedule Overview</h1>
        <Row className="mb-4">
          <Col>
            <ButtonGroup>
              <Button
                variant="dark"
                style={view === 'daily' ? styles.btnMain : styles.btnToggle}
                onClick={() => setView('daily')}
              >Daily</Button>
              <Button
                variant="dark"
                style={view === 'weekly' ? styles.btnMain : styles.btnToggle}
                onClick={() => setView('weekly')}
              >Weekly</Button>
              <Button
                variant="dark"
                style={view === 'monthly' ? styles.btnMain : styles.btnToggle}
                onClick={() => setView('monthly')}
              >Monthly</Button>
            </ButtonGroup>
          </Col>
        </Row>

        {view === 'daily' && (
          <>
            {scheduleData.daily.map((event, idx) => (
              <Card key={idx} className="mb-3 shadow-sm" style={styles.card}>
                <Card.Body>
                  <Row>
                    <Col md={9}>
                      <h5 style={styles.primary}>{event.title}</h5>
                      <p className="mb-1 text-muted"><Clock size={14} /> {event.time}</p>
                    </Col>
                    <Col md={3} className="text-md-end">
                      <Badge style={styles.badge}>{event.type}</Badge>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}
          </>
        )}

        {view === 'weekly' && (
          <Row>
            {scheduleData.weekly.map((day, idx) => (
              <Col md={4} key={idx} className="mb-3">
                <Card style={styles.card} className="shadow-sm">
                  <Card.Body>
                    <h5 style={styles.primary}>{day.day}</h5>
                    <ProgressBar now={day.events * 10} label={`${day.events} events`} variant="success" />
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {view === 'monthly' && (
          <Row>
            {scheduleData.monthly.map((week, idx) => (
              <Col md={6} key={idx} className="mb-3">
                <Card style={styles.card} className="shadow-sm">
                  <Card.Body>
                    <h5 style={styles.primary}>{week.week}</h5>
                    <ProgressBar now={week.events * 5} label={`${week.events} events`} variant="info" />
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default DoctorSchedule;
