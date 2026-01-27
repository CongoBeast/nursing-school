import React, { useState } from 'react';
import { User, Lock, Mail, Phone, UserCheck, GraduationCap, Shield, BookOpen, Eye, EyeOff, Upload, Calendar, MapPin, Users, Building, AlertTriangle, AlertCircle, Info, Clock } from 'lucide-react';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from "react-router-dom";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    confirmPassword: '',
    phoneNumber: { countryCode: '+263', number: '' },
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'male',
    userType: 'student',
    course: '',
    studentId: '',
    staffId: '',
    department: '',
    nationalId: '',
    address: '',
    emergencyContact: { name: '', phone: '' },
    avatar: '',
    accountStatus: true
  });

  const userTypes = [
    { value: 'student', label: 'Student', icon: <GraduationCap size={20} />, color: '#3B82F6' },
    { value: 'staff', label: 'Staff', icon: <Users size={20} />, color: '#2563EB' },
    { value: 'admin', label: 'Administrator', icon: <Shield size={20} />, color: '#1E40AF' }
  ];

  const courses = [
    'General Nursing',
    'Midwifery',
    'Mental Health Nursing',
    'Community Health Nursing',
    'Critical Care Nursing',
    'Pediatric Nursing'
  ];

  const departments = [
    'Nursing Sciences',
    'Clinical Practice',
    'Community Health',
    'Administration',
    'Research & Development',
    'Student Affairs'
  ];

  const countryCodes = [
    { value: '+263', label: '+263 (Zimbabwe)' },
    { value: '+27', label: '+27 (South Africa)' },
    { value: '+260', label: '+260 (Zambia)' },
    { value: '+1', label: '+1 (USA)' },
    { value: '+44', label: '+44 (UK)' }
  ];

  const handleToggle = (loginState) => {
    setIsLogin(loginState);
    setError('');
    setMessage('');
    if (loginState) {
      setFormData(prev => ({
        ...prev,
        email: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        course: '',
        studentId: '',
        staffId: '',
        department: '',
        nationalId: '',
        address: '',
        emergencyContact: { name: '', phone: '' }
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'countryCode' || name === 'number') {
      setFormData(prev => ({
        ...prev,
        phoneNumber: { ...prev.phoneNumber, [name]: value }
      }));
    } else if (name === 'emergencyName' || name === 'emergencyPhone') {
      const field = name === 'emergencyName' ? 'name' : 'phone';
      setFormData(prev => ({
        ...prev,
        emergencyContact: { ...prev.emergencyContact, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (!formData.username || !formData.password) {
      setError('Username and password are required');
      return false;
    }

    if (!formData.userType) {
      setError('Please select an account type');
      return false;
    }

    if (!isLogin) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return false;
      }
      if (!formData.firstName || !formData.lastName) {
        setError('First name and last name are required');
        return false;
      }
      if (formData.userType === 'student' && (!formData.course || !formData.studentId)) {
        setError('Course and student ID are required for students');
        return false;
      }
      if (formData.userType === 'staff' && (!formData.department || !formData.staffId)) {
        setError('Department and staff ID are required for staff members');
        return false;
      }
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

    try {
      let avatarUrl = '';

      if (!isLogin && avatarFile) {
        const formDataImage = new FormData();
        formDataImage.append('image', avatarFile);

        const uploadRes = await fetch('https://nursing-school-backend-vu0d.onrender.com/upload', {
          method: 'POST',
          body: formDataImage,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          avatarUrl = uploadData.url;
        }
      }

      const endpoint = isLogin ? 'login' : 'register';
      const requestData = {
        ...formData,
        avatar: avatarUrl,
        phoneNumber: `${formData.phoneNumber.countryCode}${formData.phoneNumber.number}`,
        registrationDate: !isLogin ? new Date().toISOString() : formData.registrationDate,
        lastLoggedIn: new Date().toISOString(),
      };

      const response = await fetch(`https://nursing-school-backend--thomasmethembe4.replit.app/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        const authData = {
          token: data.token,
          user: formData.username,
          userType: formData.userType
        };

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', formData.username);
        localStorage.setItem('userType', formData.userType);
        
        setMessage('Authentication successful! Redirecting...');
        
        setTimeout(() => {
          console.log('Redirecting based on user type:', authData.userType);
          navigate("/");
        }, 1500);
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Auth error:', error);
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
    toggleBtn: {
      backgroundColor: 'transparent',
      border: '2px solid #93C5FD',
      color: '#1E40AF',
      padding: '0.5rem 1.5rem',
      borderRadius: '2rem',
      fontWeight: '500',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      margin: '0 0.5rem'
    },
    toggleBtnActive: {
      backgroundColor: '#3B82F6',
      borderColor: '#3B82F6',
      color: 'white'
    },
    userTypeCard: {
      border: '2px solid #93C5FD',
      borderRadius: '0.75rem',
      padding: '1rem',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      backgroundColor: 'white',
      marginBottom: '1rem'
    },
    userTypeCardSelected: {
      borderColor: '#2563EB',
      backgroundColor: '#2563EB',
      color: 'white'
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
    },
    avatarUpload: {
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      border: '3px dashed #93C5FD',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 1rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      overflow: 'hidden',
      position: 'relative'
    },
    avatarPreview: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      borderRadius: '50%'
    }
  };

  return (
    <div style={customStyles.authBg}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={8} xl={6}>
            <Card style={customStyles.authCard}>
              {/* Header */}
              <div style={customStyles.authHeader}>
                <h1 className="h2 fw-bold mb-2">
                  Zimbabwe School of Nursing
                </h1>
                <p className="mb-4 opacity-90">
                  Excellence in Nursing Education & Training
                </p>
                
                {/* Toggle Buttons */}
                <div className="d-flex justify-content-center">
                  <Button
                    style={{
                      ...customStyles.toggleBtn,
                      ...(isLogin ? customStyles.toggleBtnActive : {})
                    }}
                    onClick={() => handleToggle(true)}
                  >
                    Sign In
                  </Button>
                  <Button
                    style={{
                      ...customStyles.toggleBtn,
                      ...(!isLogin ? customStyles.toggleBtnActive : {})
                    }}
                    onClick={() => handleToggle(false)}
                  >
                    Sign Up
                  </Button>
                </div>
              </div>

              {/* Form */}
              <Card.Body className="p-4">
                {error && (
                  <Alert variant="danger" className="border-0" style={{ backgroundColor: '#fef2f2', color: '#dc2626', borderLeft: '4px solid #dc2626' }}>
                    {error}
                  </Alert>
                )}
                {message && (
                  <Alert variant="success" className="border-0" style={{ backgroundColor: '#f0fdf4', color: '#16a34a', borderLeft: '4px solid #16a34a' }}>
                    {message}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  {/* Account Type Dropdown */}
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-medium" style={{ color: '#1E3A8A' }}>
                      Account Type
                    </Form.Label>
                    <div className="position-relative">
                      <UserCheck style={customStyles.inputIcon} size={18} />
                      <Form.Select
                        name="userType"
                        value={formData.userType}
                        onChange={handleChange}
                        style={{ ...customStyles.formControl, paddingLeft: '3rem' }}
                        required
                      >
                        <option value="">Select Account Type</option>
                        <option value="student">Student</option>
                        <option value="staff">Staff</option>
                        <option value="admin">Administrator</option>
                      </Form.Select>
                    </div>
                  </Form.Group>

                  {/* User Type Cards (Registration Only) */}
                  {!isLogin && (
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-medium mb-3" style={{ color: '#1E3A8A' }}>
                        I am registering as:
                      </Form.Label>
                      <Row>
                        {userTypes.map((type) => (
                          <Col key={type.value} md={4} className="mb-3">
                            <div
                              style={{
                                ...customStyles.userTypeCard,
                                ...(formData.userType === type.value ? customStyles.userTypeCardSelected : {})
                              }}
                              onClick={() => setFormData(prev => ({ ...prev, userType: type.value }))}
                            >
                              <div className="mb-2" style={{ color: formData.userType === type.value ? 'white' : type.color }}>
                                {type.icon}
                              </div>
                              <div className="fw-medium">{type.label}</div>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </Form.Group>
                  )}

                  {/* Avatar Upload (Registration Only) */}
                  {!isLogin && (
                    <Form.Group className="mb-4 text-center">
                      <Form.Label className="fw-medium d-block mb-2" style={{ color: '#1E3A8A' }}>
                        Profile Picture
                      </Form.Label>
                      <div style={customStyles.avatarUpload} onClick={() => document.getElementById('avatar-input').click()}>
                        {avatarPreview ? (
                          <img src={avatarPreview} alt="Avatar preview" style={customStyles.avatarPreview} />
                        ) : (
                          <Upload style={{ color: '#2563EB' }} size={24} />
                        )}
                      </div>
                      <Form.Control
                        id="avatar-input"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        style={{ display: 'none' }}
                      />
                      <small className="text-muted">Click to upload profile picture</small>
                    </Form.Group>
                  )}

                  {/* Name Fields (Registration Only) */}
                  {!isLogin && (
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group className="position-relative">
                          <User style={customStyles.inputIcon} size={18} />
                          <Form.Control
                            type="text"
                            placeholder="First Name"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            style={{ ...customStyles.formControl, paddingLeft: '3rem' }}
                            required={!isLogin}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="position-relative">
                          <User style={customStyles.inputIcon} size={18} />
                          <Form.Control
                            type="text"
                            placeholder="Last Name"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            style={{ ...customStyles.formControl, paddingLeft: '3rem' }}
                            required={!isLogin}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  )}

                  {/* Email (Registration Only) */}
                  {!isLogin && (
                    <Form.Group className="mb-3 position-relative">
                      <Mail style={customStyles.inputIcon} size={18} />
                      <Form.Control
                        type="email"
                        placeholder="Email Address"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        style={{ ...customStyles.formControl, paddingLeft: '3rem' }}
                        required={!isLogin}
                      />
                    </Form.Group>
                  )}

                  {/* Username */}
                  <Form.Group className="mb-3 position-relative">
                    <UserCheck style={customStyles.inputIcon} size={18} />
                    <Form.Control
                      type="text"
                      placeholder="Username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      style={{ ...customStyles.formControl, paddingLeft: '3rem' }}
                      required
                    />
                  </Form.Group>

                  {/* Password */}
                  <Form.Group className="mb-3 position-relative">
                    <Lock style={customStyles.inputIcon} size={18} />
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      style={{ ...customStyles.formControl, paddingLeft: '3rem', paddingRight: '3rem' }}
                      required
                    />
                    <Button
                      variant="link"
                      style={customStyles.passwordToggle}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </Button>
                  </Form.Group>

                  {/* Confirm Password (Registration Only) */}
                  {!isLogin && (
                    <Form.Group className="mb-3 position-relative">
                      <Lock style={customStyles.inputIcon} size={18} />
                      <Form.Control
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        style={{ ...customStyles.formControl, paddingLeft: '3rem', paddingRight: '3rem' }}
                        required={!isLogin}
                      />
                      <Button
                        variant="link"
                        style={customStyles.passwordToggle}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </Button>
                    </Form.Group>
                  )}

                  {/* Additional Registration Fields */}
                  {!isLogin && (
                    <>
                      {/* Phone Number */}
                      <Row className="mb-3">
                        <Col md={4}>
                          <Form.Group className="position-relative">
                            <Phone style={customStyles.inputIcon} size={18} />
                            <Form.Select
                              name="countryCode"
                              value={formData.phoneNumber.countryCode}
                              onChange={handleChange}
                              style={{ ...customStyles.formControl, paddingLeft: '3rem' }}
                            >
                              {countryCodes.map((code) => (
                                <option key={code.value} value={code.value}>
                                  {code.label}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={8}>
                          <Form.Group>
                            <Form.Control
                              type="tel"
                              placeholder="Phone Number"
                              name="number"
                              value={formData.phoneNumber.number}
                              onChange={handleChange}
                              style={customStyles.formControl}
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      {/* Date of Birth and Gender */}
                      <Row className="mb-3">
                        <Col md={6}>
                          <Form.Group className="position-relative">
                            <Calendar style={customStyles.inputIcon} size={18} />
                            <Form.Control
                              type="date"
                              name="dateOfBirth"
                              value={formData.dateOfBirth}
                              onChange={handleChange}
                              style={{ ...customStyles.formControl, paddingLeft: '3rem' }}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Select
                              name="gender"
                              value={formData.gender}
                              onChange={handleChange}
                              style={customStyles.formControl}
                            >
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>

                      {/* National ID */}
                      <Form.Group className="mb-3 position-relative">
                        <UserCheck style={customStyles.inputIcon} size={18} />
                        <Form.Control
                          type="text"
                          placeholder="National ID Number"
                          name="nationalId"
                          value={formData.nationalId}
                          onChange={handleChange}
                          style={{ ...customStyles.formControl, paddingLeft: '3rem' }}
                        />
                      </Form.Group>

                      {/* Address */}
                      <Form.Group className="mb-3 position-relative">
                        <MapPin style={customStyles.inputIcon} size={18} />
                        <Form.Control
                          as="textarea"
                          rows={2}
                          placeholder="Home Address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          style={{ ...customStyles.formControl, paddingLeft: '3rem' }}
                        />
                      </Form.Group>

                      {/* Student-specific fields */}
                      {formData.userType === 'student' && (
                        <Row className="mb-3">
                          <Col md={6}>
                            <Form.Group className="position-relative">
                              <GraduationCap style={customStyles.inputIcon} size={18} />
                              <Form.Select
                                name="course"
                                value={formData.course}
                                onChange={handleChange}
                                style={{ ...customStyles.formControl, paddingLeft: '3rem' }}
                                required
                              >
                                <option value="">Select Course</option>
                                {courses.map((course) => (
                                  <option key={course} value={course}>
                                    {course}
                                  </option>
                                ))}
                              </Form.Select>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group>
                              <Form.Control
                                type="text"
                                placeholder="Student ID"
                                name="studentId"
                                value={formData.studentId}
                                onChange={handleChange}
                                style={customStyles.formControl}
                                required
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      )}

                      {/* Staff-specific fields */}
                      {formData.userType === 'staff' && (
                        <Row className="mb-3">
                          <Col md={6}>
                            <Form.Group className="position-relative">
                              <Users style={customStyles.inputIcon} size={18} />
                              <Form.Select
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                style={{ ...customStyles.formControl, paddingLeft: '3rem' }}
                                required
                              >
                                <option value="">Select Department</option>
                                {departments.map((dept) => (
                                  <option key={dept} value={dept}>
                                    {dept}
                                  </option>
                                ))}
                              </Form.Select>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group>
                              <Form.Control
                                type="text"
                                placeholder="Staff ID"
                                name="staffId"
                                value={formData.staffId}
                                onChange={handleChange}
                                style={customStyles.formControl}
                                required
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      )}

                      {/* Emergency Contact */}
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-medium mb-2" style={{ color: '#1E3A8A' }}>
                          Emergency Contact
                        </Form.Label>
                        <Row>
                          <Col md={6}>
                            <Form.Group className="position-relative">
                              <User style={customStyles.inputIcon} size={18} />
                              <Form.Control
                                type="text"
                                placeholder="Contact Name"
                                name="emergencyName"
                                value={formData.emergencyContact.name}
                                onChange={handleChange}
                                style={{ ...customStyles.formControl, paddingLeft: '3rem' }}
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="position-relative">
                              <Phone style={customStyles.inputIcon} size={18} />
                              <Form.Control
                                type="tel"
                                placeholder="Contact Phone"
                                name="emergencyPhone"
                                value={formData.emergencyContact.phone}
                                onChange={handleChange}
                                style={{ ...customStyles.formControl, paddingLeft: '3rem' }}
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </Form.Group>
                    </>
                  )}

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
                        Processing...
                      </div>
                    ) : (
                      isLogin ? 'Sign In' : 'Create Account'
                    )}
                  </Button>

                  {/* Additional Links */}
                  <div className="text-center">
                    {isLogin ? (
                      <p className="small mb-0" style={{ color: '#2563EB' }}>
                        Don't have an account?{' '}
                        <Button
                          variant="link"
                          className="p-0 fw-medium text-decoration-none"
                          style={{ color: '#2563EB' }}
                          onClick={() => handleToggle(false)}
                        >
                          Sign up here
                        </Button>
                      </p>
                    ) : (
                      <p className="small mb-0" style={{ color: '#2563EB' }}>
                        Already have an account?{' '}
                        <Button
                          variant="link"
                          className="p-0 fw-medium text-decoration-none"
                          style={{ color: '#2563EB' }}
                          onClick={() => handleToggle(true)}
                        >
                          Sign in here
                        </Button>
                      </p>
                    )}
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

export default AuthPage;