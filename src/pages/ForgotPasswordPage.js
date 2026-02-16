import React, { useState } from 'react';
import { Lock, Mail, User, Shield, Eye, EyeOff, KeyRound } from 'lucide-react';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import logo from "./pari-logo.png";
import API_URL from '../config';

const ForgotPasswordPage = () => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    staffId: '',
    email: '',
    newPassword: '',
    confirmPassword: ''
  });

  const positions = [
    'Warden',
    'Allocation Officer',
    'Principal Tutor',
    'Chairperson of School Improvement Committee'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setMessage('');
  };

  const validateForm = () => {
    // if (!formData.staffId || !formData.email || !formData.position) {
    //   setError('All fields are required');
    //   return false;
    // }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: formData.staffId.trim(),
          email: formData.email.trim(),
          newPassword: formData.newPassword.trim(),
          confirmPassword: formData.confirmPassword.trim()
        }),
      });

      const data = await response.json();

      const backendUserType = data.userType;

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", data.username);
      localStorage.setItem("userType", backendUserType);
      localStorage.setItem("userId", data.userId);


      if (response.ok) {
        setMessage('Password reset successful! Redirecting to login...');
        
        // Reset form
        setFormData({
          staffId: '',
          email: '',
          newPassword: '',
          confirmPassword: ''
        });

        // Redirect after 2 seconds
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setError(data.message || 'Password reset failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Password reset error:', error);
    } finally {
      setLoading(false);
    }
  };

  const customStyles = {
    authBg: {
      background: 'linear-gradient(135deg, #F0F9FF 0%, #BFDBFE 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 0'
    },
    authCard: {
      borderRadius: '1.5rem',
      boxShadow: '0 20px 40px rgba(30, 58, 138, 0.15)',
      overflow: 'hidden',
      border: 'none'
    },
    authHeader: {
      background: 'linear-gradient(135deg, #1E40AF 0%, #2563EB 100%)',
      color: 'white',
      padding: '2rem',
      textAlign: 'center'
    },
    formControl: {
      border: '2px solid #93C5FD',
      borderRadius: '0.75rem',
      padding: '0.75rem 1rem',
      transition: 'all 0.3s ease'
    },
    btnPrimary: {
      background: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)',
      border: 'none',
      borderRadius: '0.75rem',
      padding: '0.75rem 2rem',
      color: 'white',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      width: '100%'
    },
    inputIcon: {
      position: 'absolute',
      left: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#2563EB',
      zIndex: 10
    },
    passwordToggle: {
      position: 'absolute',
      right: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      color: '#2563EB',
      cursor: 'pointer',
      zIndex: 10
    }
  };

  return (
    <div style={customStyles.authBg}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={6} xl={5}>
            <Card style={customStyles.authCard}>
              {/* Header */}
              <div style={customStyles.authHeader}>
                <div className="d-flex justify-content-center mb-3">
                  <div style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <KeyRound size={40} />
                  </div>
                </div>
                <h1 className="h2 fw-bold mb-2">
                  Reset Your Password
                </h1>
                <p className="mb-0 opacity-90">
                  Staff & Administrator Password Recovery
                </p>
              </div>

              {/* Form */}
              <Card.Body className="p-4">
                {error && (
                  <Alert variant="danger" className="border-0" style={{ 
                    backgroundColor: '#fef2f2', 
                    color: '#dc2626', 
                    borderLeft: '4px solid #dc2626' 
                  }}>
                    {error}
                  </Alert>
                )}
                {message && (
                  <Alert variant="success" className="border-0" style={{ 
                    backgroundColor: '#f0fdf4', 
                    color: '#16a34a', 
                    borderLeft: '4px solid #16a34a' 
                  }}>
                    {message}
                  </Alert>
                )}

                <div className="mb-4 p-3 rounded" style={{ 
                  backgroundColor: '#EFF6FF', 
                  border: '1px solid #BFDBFE' 
                }}>
                  <div className="d-flex align-items-start">
                    <Shield size={20} className="me-2 mt-1" style={{ color: '#2563EB' }} />
                    <div>
                      <p className="mb-1 fw-bold" style={{ color: '#1E40AF', fontSize: '0.9rem' }}>
                        Verification Required
                      </p>
                      <p className="mb-0 small text-muted">
                        Please provide your Staff ID, registered email, and position to reset your password.
                      </p>
                    </div>
                  </div>
                </div>

                <Form onSubmit={handleSubmit}>
                  {/* Staff ID */}
                  <Form.Group className="mb-3 position-relative">
                    <Form.Label className="fw-medium small" style={{ color: '#1E3A8A' }}>
                      Staff or Student ID
                    </Form.Label>
                    <User style={customStyles.inputIcon} size={18} />
                    <Form.Control
                      type="text"
                      placeholder="Enter your Staff or Student ID"
                      name="staffId"
                      value={formData.staffId}
                      onChange={handleChange}
                      style={{ ...customStyles.formControl, paddingLeft: '3rem' }}
                      required
                    />
                  </Form.Group>

                  {/* Email */}
                  <Form.Group className="mb-3 position-relative">
                    <Form.Label className="fw-medium small" style={{ color: '#1E3A8A' }}>
                      Email Address
                    </Form.Label>
                    <Mail style={customStyles.inputIcon} size={18} />
                    <Form.Control
                      type="email"
                      placeholder="Enter your registered email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      style={{ ...customStyles.formControl, paddingLeft: '3rem' }}
                      required
                    />
                  </Form.Group>

                  {/* Position */}
                  {/* <Form.Group className="mb-3 position-relative">
                    <Form.Label className="fw-medium small" style={{ color: '#1E3A8A' }}>
                      Position
                    </Form.Label>
                    <Shield style={customStyles.inputIcon} size={18} />
                    <Form.Select
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      style={{ ...customStyles.formControl, paddingLeft: '3rem' }}
                      required
                    >
                      <option value="">Select your position</option>
                      {positions.map((pos) => (
                        <option key={pos} value={pos}>
                          {pos}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group> */}

                  <hr className="my-4" />

                  {/* New Password */}
                  <Form.Group className="mb-3 position-relative">
                    <Form.Label className="fw-medium small" style={{ color: '#1E3A8A' }}>
                      New Password
                    </Form.Label>
                    <Lock style={customStyles.inputIcon} size={18} />
                    <Form.Control
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      style={{ ...customStyles.formControl, paddingLeft: '3rem', paddingRight: '3rem' }}
                      required
                    />
                    <Button
                      variant="link"
                      style={customStyles.passwordToggle}
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      type="button"
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </Button>
                  </Form.Group>

                  {/* Confirm Password */}
                  <Form.Group className="mb-4 position-relative">
                    <Form.Label className="fw-medium small" style={{ color: '#1E3A8A' }}>
                      Confirm New Password
                    </Form.Label>
                    <Lock style={customStyles.inputIcon} size={18} />
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      style={{ ...customStyles.formControl, paddingLeft: '3rem', paddingRight: '3rem' }}
                      required
                    />
                    <Button
                      variant="link"
                      style={customStyles.passwordToggle}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      type="button"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </Button>
                  </Form.Group>

                  <div className="mb-3 p-2 rounded" style={{ 
                    backgroundColor: '#FEF3C7', 
                    border: '1px solid #FCD34D' 
                  }}>
                    <p className="mb-0 small" style={{ color: '#92400E' }}>
                      <strong>Password Requirements:</strong> Minimum 6 characters
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    style={customStyles.btnPrimary}
                    disabled={loading}
                    className="mb-3"
                  >
                    {loading ? (
                      <div className="d-flex align-items-center justify-content-center">
                        <Spinner size="sm" className="me-2" />
                        Resetting Password...
                      </div>
                    ) : (
                      'Reset Password'
                    )}
                  </Button>

                  {/* Back to Login Link */}
                  <div className="text-center">
                    <p className="small mb-0" style={{ color: '#2563EB' }}>
                      Remember your password?{' '}
                      <Button
                        variant="link"
                        className="p-0 fw-medium text-decoration-none"
                        style={{ color: '#2563EB' }}
                        onClick={() => navigate('/auth')}
                        type="button"
                      >
                        Back to login
                      </Button>
                    </p>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ForgotPasswordPage;
