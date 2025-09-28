import React, { useState, useMemo } from 'react';
import { Users, Stethoscope, Heart, UserCheck, Search, Download, Edit, Trash2, CheckSquare, Square } from 'lucide-react';

const HRManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [dateStarted, setDateStarted] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Zimbabwe regions
  const zimbabweRegions = [
    'Harare', 'Bulawayo', 'Manicaland', 'Mashonaland Central', 'Mashonaland East', 
    'Mashonaland West', 'Masvingo', 'Matabeleland North', 'Matabeleland South', 'Midlands'
  ];

  // Sample employee data
  const employees = [
    {
      id: 'EMP-001',
      name: 'Dr. John Mukamuri',
      position: 'Cardiologist',
      type: 'Doctor',
      region: 'Harare',
      dateStarted: '2018-03-15',
      yearsEmployed: 6,
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=50&h=50&fit=crop&crop=face'
    },
    {
      id: 'EMP-002',
      name: 'Sister Mary Chivanga',
      position: 'Head Nurse',
      type: 'Nurse',
      region: 'Bulawayo',
      dateStarted: '2019-07-22',
      yearsEmployed: 5,
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=50&h=50&fit=crop&crop=face'
    },
    {
      id: 'EMP-003',
      name: 'Dr. Sarah Moyo',
      position: 'Pediatrician',
      type: 'Doctor',
      region: 'Manicaland',
      dateStarted: '2020-01-10',
      yearsEmployed: 4,
      status: 'Leave',
      avatar: 'https://images.unsplash.com/photo-1594824475550-8a446934d1a1?w=50&h=50&fit=crop&crop=face'
    },
    {
      id: 'EMP-004',
      name: 'James Ndlovu',
      position: 'Administrator',
      type: 'Non-medical',
      region: 'Harare',
      dateStarted: '2017-09-05',
      yearsEmployed: 7,
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face'
    },
    {
      id: 'EMP-005',
      name: 'Grace Sibanda',
      position: 'ICU Nurse',
      type: 'Nurse',
      region: 'Mashonaland East',
      dateStarted: '2021-06-18',
      yearsEmployed: 3,
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face'
    },
    {
      id: 'EMP-006',
      name: 'Dr. Michael Chirwa',
      position: 'Surgeon',
      type: 'Doctor',
      region: 'Masvingo',
      dateStarted: '2016-11-30',
      yearsEmployed: 8,
      status: 'Suspended',
      avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=50&h=50&fit=crop&crop=face'
    },
    {
      id: 'EMP-007',
      name: 'Patricia Madziva',
      position: 'Receptionist',
      type: 'Non-medical',
      region: 'Bulawayo',
      dateStarted: '2022-02-14',
      yearsEmployed: 2,
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=50&h=50&fit=crop&crop=face'
    },
    {
      id: 'EMP-008',
      name: 'Blessing Muzamhindo',
      position: 'Emergency Nurse',
      type: 'Nurse',
      region: 'Midlands',
      dateStarted: '2019-12-03',
      yearsEmployed: 5,
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=50&h=50&fit=crop&crop=face'
    }
  ];

  // Calculate stats
  const stats = useMemo(() => {
    const total = employees.length;
    const doctors = employees.filter(emp => emp.type === 'Doctor').length;
    const nurses = employees.filter(emp => emp.type === 'Nurse').length;
    const nonMedical = employees.filter(emp => emp.type === 'Non-medical').length;
    
    return { total, doctors, nurses, nonMedical };
  }, [employees]);

  // Filter employees
  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => {
      const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          employee.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          employee.position.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRegion = selectedRegion === 'all' || employee.region === selectedRegion;
      const matchesType = selectedType === 'all' || employee.type === selectedType;
      const matchesStatus = selectedStatus === 'all' || employee.status === selectedStatus;
      
      let matchesDate = true;
      if (dateStarted) {
        matchesDate = new Date(employee.dateStarted) >= new Date(dateStarted);
      }
      
      return matchesSearch && matchesRegion && matchesType && matchesStatus && matchesDate;
    });
  }, [searchTerm, selectedRegion, selectedType, selectedStatus, dateStarted, employees]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return '#4A9782';
      case 'leave': return '#f59e0b';
      case 'suspended': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Doctor': return <Stethoscope size={16} />;
      case 'Nurse': return <Heart size={16} />;
      case 'Non-medical': return <UserCheck size={16} />;
      default: return <Users size={16} />;
    }
  };

  const handleSelectEmployee = (employeeId) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId) 
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(filteredEmployees.map(emp => emp.id));
    }
    setSelectAll(!selectAll);
  };

  const downloadCSV = () => {
    const selectedData = selectedEmployees.length > 0 
      ? employees.filter(emp => selectedEmployees.includes(emp.id))
      : filteredEmployees;

    const headers = ['Employee ID', 'Name', 'Position', 'Type', 'Region', 'Date Started', 'Years Employed', 'Status'];
    const csvContent = [
      headers.join(','),
      ...selectedData.map(emp => [
        emp.id,
        `"${emp.name}"`,
        `"${emp.position}"`,
        emp.type,
        `"${emp.region}"`,
        emp.dateStarted,
        emp.yearsEmployed,
        emp.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'employees.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const customStyles = `
    .hr-bg {
      background-color: #FFF9E5;
      min-height: 100vh;
    }
    .hr-card {
      background-color: white;
      border-radius: 1rem;
    }
    .stat-card {
      background-color: #DCD0A8;
      border-radius: 1rem;
      transition: all 0.3s ease;
    }
    .stat-card:hover {
      transform: scale(1.05);
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    }
    .primary-color { color: #004030; }
    .secondary-color { color: #4A9782; }
    .icon-bg-primary { background-color: #4A9782; }
    .icon-bg-secondary { background-color: #004030; }
    .icon-bg-doctors { background-color: #004030; }
    .icon-bg-nurses { background-color: #4A9782; }
    .icon-bg-nonmedical { background-color: #DCD0A8; color: #004030 !important; }
    .filter-card {
      background-color: white;
      border-radius: 1rem;
      border: 2px solid #DCD0A8;
    }
    .employee-row {
      background-color: white;
      border-radius: 0.75rem;
      transition: all 0.2s ease;
      border: 1px solid #DCD0A8;
    }
    .employee-row:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      border-color: #4A9782;
    }
    .status-badge {
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 1rem;
      font-weight: 500;
      color: white;
    }
    .form-control-custom, .form-select-custom {
      border-color: #4A9782;
      border-radius: 0.5rem;
    }
    .form-control-custom:focus, .form-select-custom:focus {
      border-color: #004030;
      box-shadow: 0 0 0 0.2rem rgba(74, 151, 130, 0.25);
    }
    .btn-primary-custom {
      background-color: #4A9782;
      border-color: #4A9782;
      color: white;
    }
    .btn-primary-custom:hover {
      background-color: #004030;
      border-color: #004030;
    }
    .btn-outline-custom {
      color: #004030;
      border-color: #004030;
    }
    .btn-outline-custom:hover {
      background-color: #004030;
      border-color: #004030;
      color: white;
    }
    .checkbox-custom {
      accent-color: #4A9782;
    }
  `;

  return (
    <>
      <style>{customStyles}</style>
      <div className="hr-bg">
        <div className="container-fluid p-4">
          <div className="row">
            <div className="col-12">
              {/* Header */}
              <div className="mb-4">
                <h1 className="display-4 fw-bold mb-2 primary-color">
                  Human Resources Management
                </h1>
                <p className="fs-5 secondary-color">
                  Manage hospital staff and employee records
                </p>
              </div>

              {/* Stats Cards */}
              <div className="row mb-4">
                <div className="col-12 col-sm-6 col-lg-3 mb-3">
                  <div className="stat-card p-4 shadow">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <p className="small fw-medium primary-color mb-1">
                          Total Staff
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
                          Doctors
                        </p>
                        <p className="h2 fw-bold primary-color mb-0">
                          {stats.doctors}
                        </p>
                      </div>
                      <div className="icon-bg-doctors rounded-circle p-3">
                        <Stethoscope className="text-white" size={24} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-sm-6 col-lg-3 mb-3">
                  <div className="stat-card p-4 shadow">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <p className="small fw-medium primary-color mb-1">
                          Nurses
                        </p>
                        <p className="h2 fw-bold primary-color mb-0">
                          {stats.nurses}
                        </p>
                      </div>
                      <div className="icon-bg-nurses rounded-circle p-3">
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
                          Non-medical Staff
                        </p>
                        <p className="h2 fw-bold primary-color mb-0">
                          {stats.nonMedical}
                        </p>
                      </div>
                      <div className="icon-bg-nonmedical rounded-circle p-3">
                        <UserCheck size={24} />
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
                      <span className="input-group-text" style={{ backgroundColor: '#DCD0A8', borderColor: '#4A9782' }}>
                        <Search className="secondary-color" size={16} />
                      </span>
                      <input
                        type="text"
                        className="form-control form-control-custom"
                        placeholder="Search employees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-2">
                    <label className="form-label fw-medium primary-color">Region</label>
                    <select
                      className="form-select form-select-custom"
                      value={selectedRegion}
                      onChange={(e) => setSelectedRegion(e.target.value)}
                    >
                      <option value="all">All Regions</option>
                      {zimbabweRegions.map(region => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-12 col-md-2">
                    <label className="form-label fw-medium primary-color">Staff Type</label>
                    <select
                      className="form-select form-select-custom"
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                    >
                      <option value="all">All Types</option>
                      <option value="Doctor">Doctor</option>
                      <option value="Nurse">Nurse</option>
                      <option value="Non-medical">Non-medical</option>
                    </select>
                  </div>

                  <div className="col-12 col-md-2">
                    <label className="form-label fw-medium primary-color">Date Started</label>
                    <input
                      type="date"
                      className="form-control form-control-custom"
                      value={dateStarted}
                      onChange={(e) => setDateStarted(e.target.value)}
                    />
                  </div>

                  <div className="col-12 col-md-2">
                    <label className="form-label fw-medium primary-color">Status</label>
                    <select
                      className="form-select form-select-custom"
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="Active">Active</option>
                      <option value="Leave">Leave</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>

                  <div className="col-12 col-md-1">
                    <button
                      className="btn btn-primary-custom w-100"
                      onClick={downloadCSV}
                      disabled={selectedEmployees.length === 0 && filteredEmployees.length === 0}
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Employee List */}
              <div className="hr-card p-4 shadow">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 className="h4 fw-bold primary-color mb-0">
                    Employee List ({filteredEmployees.length})
                  </h3>
                  <div className="d-flex align-items-center gap-2">
                    <input
                      type="checkbox"
                      className="form-check-input checkbox-custom"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                    <span className="small secondary-color fw-medium">
                      Select All ({selectedEmployees.length} selected)
                    </span>
                  </div>
                </div>

                <div className="d-flex flex-column gap-3">
                  {filteredEmployees.map((employee) => (
                    <div key={employee.id} className="employee-row p-3">
                      <div className="row align-items-center">
                        <div className="col-auto">
                          <input
                            type="checkbox"
                            className="form-check-input checkbox-custom"
                            checked={selectedEmployees.includes(employee.id)}
                            onChange={() => handleSelectEmployee(employee.id)}
                          />
                        </div>
                        
                        <div className="col-auto">
                          <img
                            src={employee.avatar}
                            alt={employee.name}
                            className="rounded-circle"
                            style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                          />
                        </div>

                        <div className="col-12 col-sm">
                          <div className="row">
                            <div className="col-12 col-md-3">
                              <p className="fw-bold primary-color mb-1">{employee.name}</p>
                              <p className="small secondary-color mb-0">{employee.id}</p>
                            </div>
                            
                            <div className="col-12 col-md-2">
                              <div className="d-flex align-items-center gap-2">
                                {getTypeIcon(employee.type)}
                                <span className="small primary-color">{employee.position}</span>
                              </div>
                              <p className="small secondary-color mb-0">{employee.region}</p>
                            </div>
                            
                            <div className="col-12 col-md-2">
                              <p className="small primary-color mb-1">
                                <strong>{employee.yearsEmployed} years</strong>
                              </p>
                              <p className="small secondary-color mb-0">
                                Since {new Date(employee.dateStarted).toLocaleDateString()}
                              </p>
                            </div>
                            
                            <div className="col-12 col-md-2">
                              <span
                                className="status-badge"
                                style={{ backgroundColor: getStatusColor(employee.status) }}
                              >
                                {employee.status}
                              </span>
                            </div>
                            
                            <div className="col-12 col-md-3">
                              <div className="d-flex gap-2 justify-content-end">
                                <button className="btn btn-outline-custom btn-sm">
                                  <Edit size={14} />
                                </button>
                                <button className="btn btn-outline-danger btn-sm">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredEmployees.length === 0 && (
                  <div className="text-center py-5">
                    <Users className="secondary-color mb-3" size={48} />
                    <p className="h5 secondary-color">No employees found</p>
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

export default HRManagement;