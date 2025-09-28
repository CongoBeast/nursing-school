import React, { useState, useMemo } from 'react';
import { 
  Users, Heart, AlertCircle, Calendar, Clock, Search, 
  Download, Edit, Eye, Phone, Mail, MapPin, Activity 
} from 'lucide-react';

const DoctorPatientList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedAge, setSelectedAge] = useState('all');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Sample patient data
  const patients = [
    {
      id: 'PAT-001',
      name: 'Tendai Mukamuri',
      age: 45,
      gender: 'Male',
      condition: 'Hypertension',
      status: 'Critical',
      lastVisit: '2024-07-25',
      nextAppointment: '2024-08-05',
      phone: '+263 77 123 4567',
      email: 'tendai.mukamuri@email.com',
      address: 'Harare, Zimbabwe',
      bloodPressure: '180/110',
      heartRate: '95 bpm',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face'
    },
    {
      id: 'PAT-002',
      name: 'Grace Chivanga',
      age: 32,
      gender: 'Female',
      condition: 'Diabetes',
      status: 'Stable',
      lastVisit: '2024-07-28',
      nextAppointment: '2024-08-15',
      phone: '+263 77 234 5678',
      email: 'grace.chivanga@email.com',
      address: 'Bulawayo, Zimbabwe',
      bloodSugar: '140 mg/dL',
      heartRate: '72 bpm',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=50&h=50&fit=crop&crop=face'
    },
    {
      id: 'PAT-003',
      name: 'Michael Sibanda',
      age: 28,
      gender: 'Male',
      condition: 'Asthma',
      status: 'Under Treatment',
      lastVisit: '2024-07-22',
      nextAppointment: '2024-08-01',
      phone: '+263 77 345 6789',
      email: 'michael.sibanda@email.com',
      address: 'Mutare, Zimbabwe',
      peakFlow: '350 L/min',
      heartRate: '78 bpm',
      avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=50&h=50&fit=crop&crop=face'
    },
    {
      id: 'PAT-004',
      name: 'Sarah Moyo',
      age: 67,
      gender: 'Female',
      condition: 'Heart Disease',
      status: 'Critical',
      lastVisit: '2024-07-29',
      nextAppointment: '2024-08-02',
      phone: '+263 77 456 7890',
      email: 'sarah.moyo@email.com',
      address: 'Gweru, Zimbabwe',
      bloodPressure: '165/95',
      heartRate: '105 bpm',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face'
    },
    {
      id: 'PAT-005',
      name: 'James Ndlovu',
      age: 41,
      gender: 'Male',
      condition: 'Depression',
      status: 'Improving',
      lastVisit: '2024-07-26',
      nextAppointment: '2024-08-10',
      phone: '+263 77 567 8901',
      email: 'james.ndlovu@email.com',
      address: 'Masvingo, Zimbabwe',
      lastTherapy: '2024-07-26',
      heartRate: '68 bpm',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face'
    },
    {
      id: 'PAT-006',
      name: 'Patricia Madziva',
      age: 55,
      gender: 'Female',
      condition: 'Arthritis',
      status: 'Stable',
      lastVisit: '2024-07-20',
      nextAppointment: '2024-08-20',
      phone: '+263 77 678 9012',
      email: 'patricia.madziva@email.com',
      address: 'Chitungwiza, Zimbabwe',
      painLevel: '4/10',
      heartRate: '74 bpm',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=50&h=50&fit=crop&crop=face'
    }
  ];

  // Calculate stats
  const stats = useMemo(() => {
    const total = patients.length;
    const critical = patients.filter(p => p.status === 'Critical').length;
    const stable = patients.filter(p => p.status === 'Stable').length;
    const underTreatment = patients.filter(p => p.status === 'Under Treatment').length;
    
    return { total, critical, stable, underTreatment };
  }, [patients]);

  // Filter patients
  const filteredPatients = useMemo(() => {
    return patients.filter(patient => {
      const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          patient.condition.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCondition = selectedCondition === 'all' || patient.condition === selectedCondition;
      const matchesStatus = selectedStatus === 'all' || patient.status === selectedStatus;
      
      let matchesAge = true;
      if (selectedAge !== 'all') {
        const age = patient.age;
        switch (selectedAge) {
          case 'child': matchesAge = age < 18; break;
          case 'adult': matchesAge = age >= 18 && age < 65; break;
          case 'senior': matchesAge = age >= 65; break;
        }
      }
      
      let matchesDate = true;
      if (appointmentDate) {
        matchesDate = patient.nextAppointment === appointmentDate;
      }
      
      return matchesSearch && matchesCondition && matchesStatus && matchesAge && matchesDate;
    });
  }, [searchTerm, selectedCondition, selectedStatus, selectedAge, appointmentDate, patients]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'critical': return '#dc2626';
      case 'stable': return '#059669';
      case 'under treatment': return '#f59e0b';
      case 'improving': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getConditionIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case 'hypertension':
      case 'heart disease':
        return <Heart size={16} />;
      case 'diabetes':
        return <Activity size={16} />;
      case 'asthma':
        return <AlertCircle size={16} />;
      default:
        return <Activity size={16} />;
    }
  };

  const handleSelectPatient = (patientId) => {
    setSelectedPatients(prev => 
      prev.includes(patientId) 
        ? prev.filter(id => id !== patientId)
        : [...prev, patientId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedPatients([]);
    } else {
      setSelectedPatients(filteredPatients.map(p => p.id));
    }
    setSelectAll(!selectAll);
  };

  const downloadCSV = () => {
    const selectedData = selectedPatients.length > 0 
      ? patients.filter(p => selectedPatients.includes(p.id))
      : filteredPatients;

    const headers = ['Patient ID', 'Name', 'Age', 'Gender', 'Condition', 'Status', 'Last Visit', 'Next Appointment', 'Phone', 'Email'];
    const csvContent = [
      headers.join(','),
      ...selectedData.map(p => [
        p.id,
        `"${p.name}"`,
        p.age,
        p.gender,
        `"${p.condition}"`,
        p.status,
        p.lastVisit,
        p.nextAppointment,
        p.phone,
        `"${p.email}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'patient_list.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const customStyles = `
    .patient-bg {
      background-color: #E8F4FD;
      min-height: 100vh;
    }
    .patient-card {
      background-color: white;
      border-radius: 1rem;
    }
    .stat-card {
      background-color: #B8E0FF;
      border-radius: 1rem;
      transition: all 0.3s ease;
    }
    .stat-card:hover {
      transform: scale(1.05);
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    }
    .primary-color { color: #1e3a8a; }
    .secondary-color { color: #2563eb; }
    .icon-bg-primary { background-color: #2563eb; }
    .icon-bg-critical { background-color: #dc2626; }
    .icon-bg-stable { background-color: #059669; }
    .icon-bg-treatment { background-color: #f59e0b; }
    .filter-card {
      background-color: white;
      border-radius: 1rem;
      border: 2px solid #B8E0FF;
    }
    .patient-row {
      background-color: white;
      border-radius: 0.75rem;
      transition: all 0.2s ease;
      border: 1px solid #B8E0FF;
    }
    .patient-row:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      border-color: #2563eb;
    }
    .status-badge {
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 1rem;
      font-weight: 500;
      color: white;
    }
    .form-control-custom, .form-select-custom {
      border-color: #2563eb;
      border-radius: 0.5rem;
    }
    .form-control-custom:focus, .form-select-custom:focus {
      border-color: #1e3a8a;
      box-shadow: 0 0 0 0.2rem rgba(37, 99, 235, 0.25);
    }
    .btn-primary-custom {
      background-color: #2563eb;
      border-color: #2563eb;
      color: white;
    }
    .btn-primary-custom:hover {
      background-color: #1e3a8a;
      border-color: #1e3a8a;
    }
    .btn-outline-custom {
      color: #1e3a8a;
      border-color: #1e3a8a;
    }
    .btn-outline-custom:hover {
      background-color: #1e3a8a;
      border-color: #1e3a8a;
      color: white;
    }
    .checkbox-custom {
      accent-color: #2563eb;
    }
    .vital-info {
      background-color: #f1f5f9;
      border-radius: 0.5rem;
      font-size: 0.8rem;
    }
  `;

  return (
    <>
      <style>{customStyles}</style>
      <div className="patient-bg">
        <div className="container-fluid p-4">
          <div className="row">
            <div className="col-12">
              {/* Header */}
              <div className="mb-4">
                <h1 className="display-4 fw-bold mb-2 primary-color">
                  My Patients
                </h1>
                <p className="fs-5 secondary-color">
                  Manage and monitor your patient records
                </p>
              </div>

              {/* Stats Cards */}
              <div className="row mb-4">
                <div className="col-12 col-sm-6 col-lg-3 mb-3">
                  <div className="stat-card p-4 shadow">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <p className="small fw-medium primary-color mb-1">
                          Total Patients
                        </p>
                        <p className="h2 fw-bold primary-color mb-0">
                          {stats.total}
                        </p>
                      </div>
                      <div className="icon-bg-primary rounded-circle p-3">
                        <Users className="text-white" size={24} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-sm-6 col-lg-3 mb-3">
                  <div className="stat-card p-4 shadow">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <p className="small fw-medium primary-color mb-1">
                          Critical
                        </p>
                        <p className="h2 fw-bold primary-color mb-0">
                          {stats.critical}
                        </p>
                      </div>
                      <div className="icon-bg-critical rounded-circle p-3">
                        <AlertCircle className="text-white" size={24} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-sm-6 col-lg-3 mb-3">
                  <div className="stat-card p-4 shadow">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <p className="small fw-medium primary-color mb-1">
                          Stable
                        </p>
                        <p className="h2 fw-bold primary-color mb-0">
                          {stats.stable}
                        </p>
                      </div>
                      <div className="icon-bg-stable rounded-circle p-3">
                        <Heart className="text-white" size={24} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-sm-6 col-lg-3 mb-3">
                  <div className="stat-card p-4 shadow">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <p className="small fw-medium primary-color mb-1">
                          Under Treatment
                        </p>
                        <p className="h2 fw-bold primary-color mb-0">
                          {stats.underTreatment}
                        </p>
                      </div>
                      <div className="icon-bg-treatment rounded-circle p-3">
                        <Activity className="text-white" size={24} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="filter-card p-4 shadow mb-4">
                <div className="row g-3 align-items-end">
                  <div className="col-12 col-md-3">
                    <label className="form-label fw-medium primary-color">Search</label>
                    <div className="input-group">
                      <span className="input-group-text" style={{ backgroundColor: '#B8E0FF', borderColor: '#2563eb' }}>
                        <Search className="secondary-color" size={16} />
                      </span>
                      <input
                        type="text"
                        className="form-control form-control-custom"
                        placeholder="Search patients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-2">
                    <label className="form-label fw-medium primary-color">Condition</label>
                    <select
                      className="form-select form-select-custom"
                      value={selectedCondition}
                      onChange={(e) => setSelectedCondition(e.target.value)}
                    >
                      <option value="all">All Conditions</option>
                      <option value="Hypertension">Hypertension</option>
                      <option value="Diabetes">Diabetes</option>
                      <option value="Asthma">Asthma</option>
                      <option value="Heart Disease">Heart Disease</option>
                      <option value="Depression">Depression</option>
                      <option value="Arthritis">Arthritis</option>
                    </select>
                  </div>

                  <div className="col-12 col-md-2">
                    <label className="form-label fw-medium primary-color">Status</label>
                    <select
                      className="form-select form-select-custom"
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="Critical">Critical</option>
                      <option value="Stable">Stable</option>
                      <option value="Under Treatment">Under Treatment</option>
                      <option value="Improving">Improving</option>
                    </select>
                  </div>

                  <div className="col-12 col-md-2">
                    <label className="form-label fw-medium primary-color">Age Group</label>
                    <select
                      className="form-select form-select-custom"
                      value={selectedAge}
                      onChange={(e) => setSelectedAge(e.target.value)}
                    >
                      <option value="all">All Ages</option>
                      <option value="child">Child (&lt;18)</option>
                      <option value="adult">Adult (18-64)</option>
                      <option value="senior">Senior (65+)</option>
                    </select>
                  </div>

                  <div className="col-12 col-md-2">
                    <label className="form-label fw-medium primary-color">Appointment Date</label>
                    <input
                      type="date"
                      className="form-control form-control-custom"
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                    />
                  </div>

                  <div className="col-12 col-md-1">
                    <button
                      className="btn btn-primary-custom w-100"
                      onClick={downloadCSV}
                      disabled={selectedPatients.length === 0 && filteredPatients.length === 0}
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Patient List */}
              <div className="patient-card p-4 shadow">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 className="h4 fw-bold primary-color mb-0">
                    Patient List ({filteredPatients.length})
                  </h3>
                  <div className="d-flex align-items-center gap-2">
                    <input
                      type="checkbox"
                      className="form-check-input checkbox-custom"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                    <span className="small secondary-color fw-medium">
                      Select All ({selectedPatients.length} selected)
                    </span>
                  </div>
                </div>

                <div className="d-flex flex-column gap-3">
                  {filteredPatients.map((patient) => (
                    <div key={patient.id} className="patient-row p-3">
                      <div className="row align-items-center">
                        <div className="col-auto">
                          <input
                            type="checkbox"
                            className="form-check-input checkbox-custom"
                            checked={selectedPatients.includes(patient.id)}
                            onChange={() => handleSelectPatient(patient.id)}
                          />
                        </div>
                        
                        <div className="col-auto">
                          <img
                            src={patient.avatar}
                            alt={patient.name}
                            className="rounded-circle"
                            style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                          />
                        </div>

                        <div className="col-12 col-sm">
                          <div className="row">
                            <div className="col-12 col-md-3">
                              <p className="fw-bold primary-color mb-1">{patient.name}</p>
                              <div className="d-flex align-items-center gap-2 mb-1">
                                <span className="small secondary-color">{patient.id}</span>
                                <span className="small text-muted">•</span>
                                <span className="small secondary-color">{patient.age}y, {patient.gender}</span>
                              </div>
                              
                              <div className="vital-info p-2 mb-2">
                                {patient.bloodPressure && (
                                  <div className="small text-muted">BP: {patient.bloodPressure}</div>
                                )}
                                {patient.bloodSugar && (
                                  <div className="small text-muted">Sugar: {patient.bloodSugar}</div>
                                )}
                                {patient.peakFlow && (
                                  <div className="small text-muted">Peak Flow: {patient.peakFlow}</div>
                                )}
                                {patient.painLevel && (
                                  <div className="small text-muted">Pain: {patient.painLevel}</div>
                                )}
                                <div className="small text-muted">HR: {patient.heartRate}</div>
                              </div>
                            </div>
                            
                            <div className="col-12 col-md-2">
                              <div className="d-flex align-items-center gap-2 mb-1">
                                {getConditionIcon(patient.condition)}
                                <span className="small primary-color fw-medium">{patient.condition}</span>
                              </div>
                              <span
                                className="status-badge"
                                style={{ backgroundColor: getStatusColor(patient.status) }}
                              >
                                {patient.status}
                              </span>
                            </div>
                            
                            <div className="col-12 col-md-2">
                              <div className="d-flex align-items-center gap-1 mb-1">
                                <Clock size={12} className="secondary-color" />
                                <span className="small secondary-color">Last Visit</span>
                              </div>
                              <p className="small primary-color fw-medium mb-1">
                                {new Date(patient.lastVisit).toLocaleDateString()}
                              </p>
                              
                              <div className="d-flex align-items-center gap-1">
                                <Calendar size={12} className="secondary-color" />
                                <span className="small secondary-color">Next: {new Date(patient.nextAppointment).toLocaleDateString()}</span>
                              </div>
                            </div>
                            
                            <div className="col-12 col-md-2">
                              <div className="d-flex align-items-center gap-1 mb-1">
                                <Phone size={12} className="secondary-color" />
                                <span className="small secondary-color">{patient.phone}</span>
                              </div>
                              <div className="d-flex align-items-center gap-1 mb-1">
                                <Mail size={12} className="secondary-color" />
                                <span className="small secondary-color">{patient.email}</span>
                              </div>
                              <div className="d-flex align-items-center gap-1">
                                <MapPin size={12} className="secondary-color" />
                                <span className="small secondary-color">{patient.address}</span>
                              </div>
                            </div>
                            
                            <div className="col-12 col-md-3">
                              <div className="d-flex gap-2 justify-content-end">
                                <button className="btn btn-outline-custom btn-sm" title="View Details">
                                  <Eye size={14} />
                                </button>
                                <button className="btn btn-outline-custom btn-sm" title="Edit Patient">
                                  <Edit size={14} />
                                </button>
                                <button className="btn btn-primary-custom btn-sm" title="Contact Patient">
                                  <Phone size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredPatients.length === 0 && (
                  <div className="text-center py-5">
                    <Users className="secondary-color mb-3" size={48} />
                    <p className="h5 secondary-color">No patients found</p>
                    <p className="secondary-color">Try adjusting your search criteria</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorPatientList;