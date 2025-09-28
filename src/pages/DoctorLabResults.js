import React, { useState, useMemo } from 'react';
import { 
  FlaskConical, FileText, Calendar, Clock, Search, 
  Download, Filter, AlertCircle, CheckCircle, Clock4, 
  ChevronDown, ChevronUp, User, TestTube2, Activity
} from 'lucide-react';

const DoctorLabResults = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedTestType, setSelectedTestType] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [expandedResult, setExpandedResult] = useState(null);
  const [selectedResults, setSelectedResults] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Sample lab results data
  const labResults = [
    {
      id: 'LAB-001',
      patientId: 'PAT-001',
      patientName: 'Tendai Mukamuri',
      testType: 'Complete Blood Count',
      status: 'Completed',
      dateRequested: '2024-07-20',
      dateCompleted: '2024-07-22',
      orderingPhysician: 'Dr. Chikomo',
      labTechnician: 'Lab Tech Moyo',
      results: {
        hemoglobin: '14.2 g/dL',
        hematocrit: '42%',
        wbc: '6.5 x 10^3/μL',
        rbc: '4.8 x 10^6/μL',
        platelets: '250 x 10^3/μL',
        notes: 'Results within normal range'
      },
      critical: false,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face'
    },
    {
      id: 'LAB-002',
      patientId: 'PAT-002',
      patientName: 'Grace Chivanga',
      testType: 'Lipid Panel',
      status: 'Completed',
      dateRequested: '2024-07-22',
      dateCompleted: '2024-07-23',
      orderingPhysician: 'Dr. Chikomo',
      labTechnician: 'Lab Tech Sibanda',
      results: {
        cholesterol: '190 mg/dL',
        triglycerides: '150 mg/dL',
        hdl: '45 mg/dL',
        ldl: '120 mg/dL',
        vldl: '25 mg/dL',
        notes: 'Slightly elevated LDL, recommend dietary changes'
      },
      critical: false,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=50&h=50&fit=crop&crop=face'
    },
    {
      id: 'LAB-003',
      patientId: 'PAT-004',
      patientName: 'Sarah Moyo',
      testType: 'Comprehensive Metabolic Panel',
      status: 'Critical',
      dateRequested: '2024-07-25',
      dateCompleted: '2024-07-26',
      orderingPhysician: 'Dr. Chikomo',
      labTechnician: 'Lab Tech Ndlovu',
      results: {
        glucose: '320 mg/dL',
        calcium: '8.5 mg/dL',
        sodium: '135 mEq/L',
        potassium: '5.8 mEq/L',
        bun: '28 mg/dL',
        creatinine: '1.8 mg/dL',
        notes: 'Critical values detected - elevated glucose and potassium. Please review immediately.'
      },
      critical: true,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face'
    },
    {
      id: 'LAB-004',
      patientId: 'PAT-003',
      patientName: 'Michael Sibanda',
      testType: 'Thyroid Function Tests',
      status: 'Pending',
      dateRequested: '2024-07-28',
      dateCompleted: null,
      orderingPhysician: 'Dr. Chikomo',
      labTechnician: null,
      results: null,
      critical: false,
      avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=50&h=50&fit=crop&crop=face'
    },
    {
      id: 'LAB-005',
      patientId: 'PAT-005',
      patientName: 'James Ndlovu',
      testType: 'Liver Function Tests',
      status: 'Completed',
      dateRequested: '2024-07-26',
      dateCompleted: '2024-07-27',
      orderingPhysician: 'Dr. Chikomo',
      labTechnician: 'Lab Tech Madziva',
      results: {
        ast: '35 U/L',
        alt: '40 U/L',
        alkalinePhosphatase: '110 U/L',
        bilirubin: '1.2 mg/dL',
        albumin: '3.8 g/dL',
        notes: 'Mild elevation in bilirubin, otherwise normal'
      },
      critical: false,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face'
    },
    {
      id: 'LAB-006',
      patientId: 'PAT-006',
      patientName: 'Patricia Madziva',
      testType: 'Urinalysis',
      status: 'Completed',
      dateRequested: '2024-07-27',
      dateCompleted: '2024-07-28',
      orderingPhysician: 'Dr. Chikomo',
      labTechnician: 'Lab Tech Chivanga',
      results: {
        color: 'Yellow',
        appearance: 'Clear',
        specificGravity: '1.015',
        pH: '6.0',
        protein: 'Negative',
        glucose: 'Negative',
        ketones: 'Negative',
        notes: 'Normal urinalysis results'
      },
      critical: false,
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=50&h=50&fit=crop&crop=face'
    }
  ];

  // Calculate stats
  const stats = useMemo(() => {
    const total = labResults.length;
    const completed = labResults.filter(r => r.status === 'Completed').length;
    const pending = labResults.filter(r => r.status === 'Pending').length;
    const critical = labResults.filter(r => r.critical).length;
    
    return { total, completed, pending, critical };
  }, [labResults]);

  // Filter lab results
  const filteredResults = useMemo(() => {
    return labResults.filter(result => {
      const matchesSearch = result.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          result.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          result.testType.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = selectedStatus === 'all' || result.status === selectedStatus;
      const matchesTestType = selectedTestType === 'all' || result.testType === selectedTestType;
      
      let matchesDate = true;
      if (dateRange !== 'all') {
        const today = new Date();
        const resultDate = new Date(result.dateRequested);
        const diffTime = Math.abs(today - resultDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        switch (dateRange) {
          case 'today': matchesDate = diffDays === 0; break;
          case 'week': matchesDate = diffDays <= 7; break;
          case 'month': matchesDate = diffDays <= 30; break;
        }
      }
      
      return matchesSearch && matchesStatus && matchesTestType && matchesDate;
    });
  }, [searchTerm, selectedStatus, selectedTestType, dateRange, labResults]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return '#4A9782';
      case 'pending': return '#DCD0A8';
      case 'critical': return '#A83232';
      default: return '#004030';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return <CheckCircle size={16} />;
      case 'pending': return <Clock4 size={16} />;
      case 'critical': return <AlertCircle size={16} />;
      default: return <FileText size={16} />;
    }
  };

  const getTestTypeIcon = (testType) => {
    if (testType.includes('Blood')) return <Activity size={16} />;
    if (testType.includes('Urine')) return <TestTube2 size={16} />;
    return <FlaskConical size={16} />;
  };

  const toggleExpandResult = (resultId) => {
    setExpandedResult(expandedResult === resultId ? null : resultId);
  };

  const handleSelectResult = (resultId) => {
    setSelectedResults(prev => 
      prev.includes(resultId) 
        ? prev.filter(id => id !== resultId)
        : [...prev, resultId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedResults([]);
    } else {
      setSelectedResults(filteredResults.map(r => r.id));
    }
    setSelectAll(!selectAll);
  };

  const downloadCSV = () => {
    const selectedData = selectedResults.length > 0 
      ? labResults.filter(r => selectedResults.includes(r.id))
      : filteredResults;

    const headers = ['Lab ID', 'Patient', 'Test Type', 'Status', 'Date Requested', 'Date Completed', 'Ordering Physician'];
    const csvContent = [
      headers.join(','),
      ...selectedData.map(r => [
        r.id,
        `"${r.patientName} (${r.patientId})"`,
        `"${r.testType}"`,
        r.status,
        r.dateRequested,
        r.dateCompleted || 'N/A',
        `"${r.orderingPhysician}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'lab_results.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const customStyles = `
    .lab-bg {
      background-color: #FFF9E5;
      min-height: 100vh;
    }
    .lab-card {
      background-color: white;
      border-radius: 1rem;
      border: 1px solid #DCD0A8;
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
    .light-color { color: #DCD0A8; }
    .bg-primary { background-color: #004030; }
    .bg-secondary { background-color: #4A9782; }
    .bg-light { background-color: #DCD0A8; }
    .bg-very-light { background-color: #FFF9E5; }
    .icon-bg-primary { background-color: #004030; }
    .icon-bg-secondary { background-color: #4A9782; }
    .icon-bg-light { background-color: #DCD0A8; }
    .filter-card {
      background-color: white;
      border-radius: 1rem;
      border: 2px solid #DCD0A8;
    }
    .result-row {
      background-color: white;
      border-radius: 0.75rem;
      transition: all 0.2s ease;
      border: 1px solid #DCD0A8;
    }
    .result-row:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      border-color: #4A9782;
    }
    .critical-row {
      border-left: 4px solid #A83232;
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
      background-color: #004030;
      border-color: #004030;
      color: white;
    }
    .btn-primary-custom:hover {
      background-color: #002820;
      border-color: #002820;
    }
    .btn-secondary-custom {
      background-color: #4A9782;
      border-color: #4A9782;
      color: white;
    }
    .btn-secondary-custom:hover {
      background-color: #3A8069;
      border-color: #3A8069;
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
    .result-details {
      background-color: #FFF9E5;
      border-radius: 0.5rem;
    }
    .result-param {
      background-color: white;
      border-radius: 0.25rem;
      border: 1px solid #DCD0A8;
    }
    .nav-pills-custom .nav-link.active {
      background-color: #004030;
      color: white;
    }
    .nav-pills-custom .nav-link {
      color: #004030;
    }
  `;

  return (
    <>
      <style>{customStyles}</style>
      <div className="lab-bg">
        <div className="container-fluid p-4">
          <div className="row">
            <div className="col-12">
              {/* Header */}
              <div className="mb-4">
                <h1 className="display-4 fw-bold mb-2 primary-color">
                  Laboratory Results
                </h1>
                <p className="fs-5 secondary-color">
                  Review and manage patient lab test results
                </p>
              </div>

              {/* Stats Cards */}
              <div className="row mb-4">
                <div className="col-12 col-sm-6 col-lg-3 mb-3">
                  <div className="stat-card p-4 shadow">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <p className="small fw-medium primary-color mb-1">
                          Total Tests
                        </p>
                        <p className="h2 fw-bold primary-color mb-0">
                          {stats.total}
                        </p>
                      </div>
                      <div className="icon-bg-primary rounded-circle p-3">
                        <FlaskConical className="text-white" size={24} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-sm-6 col-lg-3 mb-3">
                  <div className="stat-card p-4 shadow">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <p className="small fw-medium primary-color mb-1">
                          Completed
                        </p>
                        <p className="h2 fw-bold primary-color mb-0">
                          {stats.completed}
                        </p>
                      </div>
                      <div className="icon-bg-secondary rounded-circle p-3">
                        <CheckCircle className="text-white" size={24} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-sm-6 col-lg-3 mb-3">
                  <div className="stat-card p-4 shadow">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <p className="small fw-medium primary-color mb-1">
                          Pending
                        </p>
                        <p className="h2 fw-bold primary-color mb-0">
                          {stats.pending}
                        </p>
                      </div>
                      <div className="icon-bg-light rounded-circle p-3">
                        <Clock4 className="text-white" size={24} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-sm-6 col-lg-3 mb-3">
                  <div className="stat-card p-4 shadow">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <p className="small fw-medium primary-color mb-1">
                          Critical Results
                        </p>
                        <p className="h2 fw-bold primary-color mb-0">
                          {stats.critical}
                        </p>
                      </div>
                      <div className="icon-bg-primary rounded-circle p-3" style={{ backgroundColor: '#A83232' }}>
                        <AlertCircle className="text-white" size={24} />
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
                      <span className="input-group-text bg-light">
                        <Search className="primary-color" size={16} />
                      </span>
                      <input
                        type="text"
                        className="form-control form-control-custom"
                        placeholder="Search tests or patients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-2">
                    <label className="form-label fw-medium primary-color">Status</label>
                    <select
                      className="form-select form-select-custom"
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="Completed">Completed</option>
                      <option value="Pending">Pending</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>

                  <div className="col-12 col-md-2">
                    <label className="form-label fw-medium primary-color">Test Type</label>
                    <select
                      className="form-select form-select-custom"
                      value={selectedTestType}
                      onChange={(e) => setSelectedTestType(e.target.value)}
                    >
                      <option value="all">All Tests</option>
                      <option value="Complete Blood Count">Complete Blood Count</option>
                      <option value="Lipid Panel">Lipid Panel</option>
                      <option value="Comprehensive Metabolic Panel">Metabolic Panel</option>
                      <option value="Thyroid Function Tests">Thyroid Tests</option>
                      <option value="Liver Function Tests">Liver Tests</option>
                      <option value="Urinalysis">Urinalysis</option>
                    </select>
                  </div>

                  <div className="col-12 col-md-2">
                    <label className="form-label fw-medium primary-color">Date Range</label>
                    <select
                      className="form-select form-select-custom"
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                    </select>
                  </div>

                  <div className="col-12 col-md-2">
                    <button
                      className="btn btn-outline-custom w-100"
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedStatus('all');
                        setSelectedTestType('all');
                        setDateRange('all');
                      }}
                    >
                      <Filter size={16} className="me-1" />
                      Clear Filters
                    </button>
                  </div>

                  <div className="col-12 col-md-1">
                    <button
                      className="btn btn-primary-custom w-100"
                      onClick={downloadCSV}
                      disabled={selectedResults.length === 0 && filteredResults.length === 0}
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Results List */}
              <div className="lab-card p-4 shadow">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 className="h4 fw-bold primary-color mb-0">
                    Test Results ({filteredResults.length})
                  </h3>
                  <div className="d-flex align-items-center gap-2">
                    <input
                      type="checkbox"
                      className="form-check-input checkbox-custom"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                    <span className="small secondary-color fw-medium">
                      Select All ({selectedResults.length} selected)
                    </span>
                  </div>
                </div>

                <div className="d-flex flex-column gap-3">
                  {filteredResults.map((result) => (
                    <div 
                      key={result.id} 
                      className={`result-row p-3 ${result.critical ? 'critical-row' : ''}`}
                    >
                      <div className="row align-items-center">
                        <div className="col-auto">
                          <input
                            type="checkbox"
                            className="form-check-input checkbox-custom"
                            checked={selectedResults.includes(result.id)}
                            onChange={() => handleSelectResult(result.id)}
                          />
                        </div>
                        
                        <div className="col-auto">
                          <img
                            src={result.avatar}
                            alt={result.patientName}
                            className="rounded-circle"
                            style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                          />
                        </div>

                        <div className="col-12 col-sm">
                          <div className="row">
                            <div className="col-12 col-md-3">
                              <p className="fw-bold primary-color mb-1">{result.patientName}</p>
                              <div className="d-flex align-items-center gap-2 mb-1">
                                <span className="small secondary-color">{result.id}</span>
                                <span className="small text-muted">•</span>
                                <span className="small secondary-color">{result.patientId}</span>
                              </div>
                              
                              <div className="d-flex align-items-center gap-1">
                                <User size={12} className="secondary-color" />
                                <span className="small secondary-color">Ordered by: {result.orderingPhysician}</span>
                              </div>
                            </div>
                            
                            <div className="col-12 col-md-3">
                              <div className="d-flex align-items-center gap-2 mb-1">
                                {getTestTypeIcon(result.testType)}
                                <span className="small primary-color fw-medium">{result.testType}</span>
                              </div>
                              <span
                                className="status-badge"
                                style={{ backgroundColor: getStatusColor(result.status) }}
                              >
                                <div className="d-flex align-items-center gap-1">
                                  {getStatusIcon(result.status)}
                                  <span>{result.status}</span>
                                </div>
                              </span>
                            </div>
                            
                            <div className="col-12 col-md-3">
                              <div className="d-flex align-items-center gap-1 mb-1">
                                <Calendar size={12} className="secondary-color" />
                                <span className="small secondary-color">Requested: {new Date(result.dateRequested).toLocaleDateString()}</span>
                              </div>
                              
                              {result.dateCompleted ? (
                                <div className="d-flex align-items-center gap-1">
                                  <Clock size={12} className="secondary-color" />
                                  <span className="small secondary-color">Completed: {new Date(result.dateCompleted).toLocaleDateString()}</span>
                                </div>
                              ) : (
                                <div className="d-flex align-items-center gap-1">
                                  <Clock4 size={12} className="secondary-color" />
                                  <span className="small secondary-color">Pending completion</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="col-12 col-md-3">
                              <div className="d-flex gap-2 justify-content-end">
                                <button 
                                  className="btn btn-outline-custom btn-sm" 
                                  onClick={() => toggleExpandResult(result.id)}
                                >
                                  {expandedResult === result.id ? (
                                    <>
                                      <ChevronUp size={14} className="me-1" />
                                      Hide Details
                                    </>
                                  ) : (
                                    <>
                                      <ChevronDown size={14} className="me-1" />
                                      View Details
                                    </>
                                  )}
                                </button>
                                <button className="btn btn-secondary-custom btn-sm">
                                  <FileText size={14} />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Expanded Results */}
                          {expandedResult === result.id && result.results && (
                            <div className="result-details mt-3 p-3">
                              <h6 className="fw-bold primary-color mb-3">Test Results Details</h6>
                              <div className="row g-2">
                                {Object.entries(result.results).map(([key, value]) => (
                                  <div key={key} className="col-12 col-sm-6 col-md-4 col-lg-3">
                                    <div className="result-param p-2">
                                      <div className="small text-muted">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</div>
                                      <div className="fw-medium primary-color">{value}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              {result.critical && (
                                <div className="alert alert-danger mt-3 mb-0" role="alert">
                                  <AlertCircle className="me-2" size={16} />
                                  <strong>Critical Result:</strong> This requires immediate attention and follow-up.
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredResults.length === 0 && (
                  <div className="text-center py-5">
                    <FlaskConical className="secondary-color mb-3" size={48} />
                    <p className="h5 secondary-color">No lab results found</p>
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

export default DoctorLabResults;