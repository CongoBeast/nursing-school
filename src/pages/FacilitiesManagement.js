import React, { useState, useMemo } from 'react';
import { Building2, Hospital, Heart, MapPin, Search, Download, Edit, Trash2, Users, Calendar, Activity, Phone } from 'lucide-react';
import { Link, useLocation, useNavigate } from "react-router-dom";


const FacilitiesManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const navigate = useNavigate()

  // Zimbabwe regions
  const zimbabweRegions = [
    'Harare', 'Bulawayo', 'Manicaland', 'Mashonaland Central', 'Mashonaland East', 
    'Mashonaland West', 'Masvingo', 'Matabeleland North', 'Matabeleland South', 'Midlands'
  ];

  // Sample facilities data
  const facilities = [
    {
      id: 'FAC-001',
      name: 'Parirenyatwa Group of Hospitals',
      type: 'Hospital',
      level: 'Tertiary',
      region: 'Harare',
      address: '1 Mazowe Street, Harare',
      capacity: 1200,
      currentOccupancy: 890,
      staffCount: 2500,
      established: '1962',
      status: 'Operational',
      phone: '+263-4-791631',
      services: ['Emergency', 'Surgery', 'Maternity', 'ICU', 'Oncology'],
      director: 'Dr. James Hakim'
    },
    {
      id: 'FAC-002',
      name: 'Mpilo Central Hospital',
      type: 'Hospital',
      level: 'Tertiary',
      region: 'Bulawayo',
      address: 'Vera Road, Bulawayo',
      capacity: 1000,
      currentOccupancy: 750,
      staffCount: 1800,
      established: '1952',
      status: 'Operational',
      phone: '+263-9-72911',
      services: ['Emergency', 'Surgery', 'Maternity', 'ICU', 'Cardiology'],
      director: 'Dr. Narcisius Dzvanga'
    },
    {
      id: 'FAC-003',
      name: 'Chitungwiza Central Hospital',
      type: 'Hospital',
      level: 'Secondary',
      region: 'Harare',
      address: 'Chitungwiza, Harare',
      capacity: 600,
      currentOccupancy: 480,
      staffCount: 900,
      established: '1978',
      status: 'Operational',
      phone: '+263-4-2912345',
      services: ['Emergency', 'Surgery', 'Maternity', 'Pediatrics'],
      director: 'Dr. Margaret Mukamuri'
    },
    {
      id: 'FAC-004',
      name: 'Mutare Provincial Hospital',
      type: 'Hospital',
      level: 'Secondary',
      region: 'Manicaland',
      address: 'Aerodrome Road, Mutare',
      capacity: 450,
      currentOccupancy: 320,
      staffCount: 650,
      established: '1965',
      status: 'Operational',
      phone: '+263-20-64775',
      services: ['Emergency', 'Surgery', 'Maternity', 'General Medicine'],
      director: 'Dr. Peter Zhuwao'
    },
    {
      id: 'FAC-005',
      name: 'Bindura Provincial Hospital',
      type: 'Hospital',
      level: 'Secondary',
      region: 'Mashonaland Central',
      address: 'Bindura Town',
      capacity: 300,
      currentOccupancy: 180,
      staffCount: 420,
      established: '1980',
      status: 'Under Renovation',
      phone: '+263-71-6234',
      services: ['Emergency', 'General Medicine', 'Maternity'],
      director: 'Dr. Susan Chigumba'
    },
    {
      id: 'FAC-006',
      name: 'Avenues Clinic',
      type: 'Clinic',
      level: 'Primary',
      region: 'Harare',
      address: 'Baines Avenue, Harare',
      capacity: 50,
      currentOccupancy: 35,
      staffCount: 80,
      established: '1995',
      status: 'Operational',
      phone: '+263-4-794451',
      services: ['General Medicine', 'Dental', 'Pharmacy'],
      director: 'Dr. Takudzwa Mandaza'
    },
    {
      id: 'FAC-007',
      name: 'Mabvuku Polyclinic',
      type: 'Clinic',
      level: 'Primary',
      region: 'Harare',
      address: 'Mabvuku, Harare',
      capacity: 80,
      currentOccupancy: 60,
      staffCount: 120,
      established: '1985',
      status: 'Operational',
      phone: '+263-4-487234',
      services: ['General Medicine', 'Maternity', 'Pharmacy'],
      director: 'Dr. Grace Nyamurowa'
    },
    {
      id: 'FAC-008',
      name: 'Masvingo Provincial Hospital',
      type: 'Hospital',
      level: 'Secondary',
      region: 'Masvingo',
      address: 'Victoria Range Road, Masvingo',
      capacity: 400,
      currentOccupancy: 290,
      staffCount: 580,
      established: '1970',
      status: 'Operational',
      phone: '+263-39-62646',
      services: ['Emergency', 'Surgery', 'Maternity', 'Pediatrics'],
      director: 'Dr. Emmanuel Mubaiwa'
    },
    {
      id: 'FAC-009',
      name: 'Gweru Provincial Hospital',
      type: 'Hospital',
      level: 'Secondary',
      region: 'Midlands',
      address: 'Gweru',
      capacity: 350,
      currentOccupancy: 280,
      staffCount: 520,
      established: '1968',
      status: 'Operational',
      phone: '+263-54-21841',
      services: ['Emergency', 'Surgery', 'Maternity', 'General Medicine'],
      director: 'Dr. Blessing Mukamuri'
    },
    {
      id: 'FAC-010',
      name: 'Hwange District Hospital',
      type: 'Hospital',
      level: 'District',
      region: 'Matabeleland North',
      address: 'Hwange',
      capacity: 200,
      currentOccupancy: 150,
      staffCount: 280,
      established: '1975',
      status: 'Operational',
      phone: '+263-281-2234',
      services: ['Emergency', 'General Medicine', 'Maternity'],
      director: 'Dr. Nyaradzo Sibanda'
    }
  ];

  const handleClick = () => {
    navigate("/managefacility")
  }

  // Calculate stats
  const stats = useMemo(() => {
    const total = facilities.length;
    const hospitals = facilities.filter(fac => fac.type === 'Hospital').length;
    const clinics = facilities.filter(fac => fac.type === 'Clinic').length;
    const totalCapacity = facilities.reduce((sum, fac) => sum + fac.capacity, 0);
    const totalOccupancy = facilities.reduce((sum, fac) => sum + fac.currentOccupancy, 0);
    const occupancyRate = Math.round((totalOccupancy / totalCapacity) * 100);
    
    return { total, hospitals, clinics, totalCapacity, totalOccupancy, occupancyRate };
  }, [facilities]);

  // Filter facilities
  const filteredFacilities = useMemo(() => {
    return facilities.filter(facility => {
      const matchesSearch = facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          facility.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          facility.address.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRegion = selectedRegion === 'all' || facility.region === selectedRegion;
      const matchesType = selectedType === 'all' || facility.type === selectedType;
      const matchesLevel = selectedLevel === 'all' || facility.level === selectedLevel;
      const matchesStatus = selectedStatus === 'all' || facility.status === selectedStatus;
      
      return matchesSearch && matchesRegion && matchesType && matchesLevel && matchesStatus;
    });
  }, [searchTerm, selectedRegion, selectedType, selectedLevel, selectedStatus, facilities]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'operational': return '#4A9782';
      case 'under renovation': return '#f59e0b';
      case 'closed': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Hospital': return <Hospital size={16} className="text-white" />;
      case 'Clinic': return <Heart size={16} className="text-white" />;
      default: return <Building2 size={16} className="text-white" />;
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Tertiary': return '#004030';
      case 'Secondary': return '#4A9782';
      case 'Primary': return '#DCD0A8';
      case 'District': return '#8B9A2B';
      default: return '#6b7280';
    }
  };

  const getOccupancyColor = (facility) => {
    const rate = (facility.currentOccupancy / facility.capacity) * 100;
    if (rate >= 90) return '#dc2626';
    if (rate >= 75) return '#f59e0b';
    return '#4A9782';
  };

  const handleSelectFacility = (facilityId) => {
    setSelectedFacilities(prev => 
      prev.includes(facilityId) 
        ? prev.filter(id => id !== facilityId)
        : [...prev, facilityId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedFacilities([]);
    } else {
      setSelectedFacilities(filteredFacilities.map(fac => fac.id));
    }
    setSelectAll(!selectAll);
  };

  const downloadCSV = () => {
    const selectedData = selectedFacilities.length > 0 
      ? facilities.filter(fac => selectedFacilities.includes(fac.id))
      : filteredFacilities;

    const headers = ['Facility ID', 'Name', 'Type', 'Level', 'Region', 'Address', 'Capacity', 'Occupancy', 'Staff Count', 'Status', 'Director'];
    const csvContent = [
      headers.join(','),
      ...selectedData.map(fac => [
        fac.id,
        `"${fac.name}"`,
        fac.type,
        fac.level,
        `"${fac.region}"`,
        `"${fac.address}"`,
        fac.capacity,
        fac.currentOccupancy,
        fac.staffCount,
        fac.status,
        `"${fac.director}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'health_facilities.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const customStyles = `
    .facilities-bg {
      background-color: #FFF9E5;
      min-height: 100vh;
    }
    .facilities-card {
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
    .icon-bg-hospitals { background-color: #004030; }
    .icon-bg-clinics { background-color: #4A9782; }
    .icon-bg-capacity { background-color: #DCD0A8; color: #004030 !important; }
    .icon-bg-occupancy { background-color: #4A9782; }
    .filter-card {
      background-color: white;
      border-radius: 1rem;
      border: 2px solid #DCD0A8;
    }
    .facility-row {
      background-color: white;
      border-radius: 0.75rem;
      transition: all 0.2s ease;
      border: 1px solid #DCD0A8;
    }
    .facility-row:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      border-color: #4A9782;
    }
    .status-badge, .level-badge {
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 1rem;
      font-weight: 500;
      color: white;
    }
    .occupancy-bar {
      height: 6px;
      background-color: #e5e7eb;
      border-radius: 3px;
      overflow: hidden;
    }
    .occupancy-fill {
      height: 100%;
      transition: width 0.3s ease;
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
    .service-tag {
      background-color: #4A9782;
      color: white;
      font-size: 0.7rem;
      padding: 0.15rem 0.4rem;
      border-radius: 0.75rem;
      display: inline-block;
      margin: 0.1rem;
    }
  `;

  return (
    <>
      <style>{customStyles}</style>
      <div className="facilities-bg">
        <div className="container-fluid p-4">
          <div className="row">
            <div className="col-12">
              {/* Header */}
              <div className="mb-4">
                <h1 className="display-4 fw-bold mb-2 primary-color">
                  Health Facilities Management
                </h1>
                <p className="fs-5 secondary-color">
                  Manage hospitals, clinics and healthcare facilities across Zimbabwe
                </p>
              </div>

              {/* Stats Cards */}
              <div className="row mb-4">
                <div className="col-12 col-sm-6 col-lg-3 mb-3">
                  <div className="stat-card p-4 shadow">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <p className="small fw-medium primary-color mb-1">
                          Total Facilities
                        </p>
                        <p className="h2 fw-bold primary-color mb-0">
                          {stats.total}
                        </p>
                      </div>
                      <div className="icon-bg-primary rounded-circle p-3">
                        <Building2 className="text-white" size={24} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-sm-6 col-lg-3 mb-3">
                  <div className="stat-card p-4 shadow">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <p className="small fw-medium primary-color mb-1">
                          Hospitals
                        </p>
                        <p className="h2 fw-bold primary-color mb-0">
                          {stats.hospitals}
                        </p>
                      </div>
                      <div className="icon-bg-hospitals rounded-circle p-3">
                        <Hospital className="text-white" size={24} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-sm-6 col-lg-3 mb-3">
                  <div className="stat-card p-4 shadow">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <p className="small fw-medium primary-color mb-1">
                          Clinics
                        </p>
                        <p className="h2 fw-bold primary-color mb-0">
                          {stats.clinics}
                        </p>
                      </div>
                      <div className="icon-bg-clinics rounded-circle p-3">
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
                          Occupancy Rate
                        </p>
                        <p className="h2 fw-bold primary-color mb-0">
                          {stats.occupancyRate}%
                        </p>
                      </div>
                      <div className="icon-bg-occupancy rounded-circle p-3">
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
                      <span className="input-group-text" style={{ backgroundColor: '#DCD0A8', borderColor: '#4A9782' }}>
                        <Search className="secondary-color" size={16} />
                      </span>
                      <input
                        type="text"
                        className="form-control form-control-custom"
                        placeholder="Search facilities..."
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
                    <label className="form-label fw-medium primary-color">Type</label>
                    <select
                      className="form-select form-select-custom"
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                    >
                      <option value="all">All Types</option>
                      <option value="Hospital">Hospital</option>
                      <option value="Clinic">Clinic</option>
                    </select>
                  </div>

                  <div className="col-12 col-md-2">
                    <label className="form-label fw-medium primary-color">Level</label>
                    <select
                      className="form-select form-select-custom"
                      value={selectedLevel}
                      onChange={(e) => setSelectedLevel(e.target.value)}
                    >
                      <option value="all">All Levels</option>
                      <option value="Tertiary">Tertiary</option>
                      <option value="Secondary">Secondary</option>
                      <option value="Primary">Primary</option>
                      <option value="District">District</option>
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
                      <option value="Operational">Operational</option>
                      <option value="Under Renovation">Under Renovation</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>

                  <div className="col-12 col-md-1">
                    <button
                      className="btn btn-primary-custom w-100"
                      onClick={downloadCSV}
                      disabled={selectedFacilities.length === 0 && filteredFacilities.length === 0}
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Facilities List */}
              <div className="facilities-card p-4 shadow">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 className="h4 fw-bold primary-color mb-0">
                    Facilities List ({filteredFacilities.length})
                  </h3>
                  <div className="d-flex align-items-center gap-2">
                    <input
                      type="checkbox"
                      className="form-check-input checkbox-custom"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                    <span className="small secondary-color fw-medium">
                      Select All ({selectedFacilities.length} selected)
                    </span>
                  </div>
                </div>

                <div className="d-flex flex-column gap-3">
                  {filteredFacilities.map((facility) => {
                    const occupancyRate = Math.round((facility.currentOccupancy / facility.capacity) * 100);
                    
                    return (
                      <div key={facility.id} className="facility-row p-4">
                        <div className="row align-items-center">
                          <div className="col-auto">
                            <input
                              type="checkbox"
                              className="form-check-input checkbox-custom"
                              checked={selectedFacilities.includes(facility.id)}
                              onChange={() => handleSelectFacility(facility.id)}
                            />
                          </div>
                          
                          <div className="col-auto" onClick={handleClick}>
                            <div 
                              className="rounded-circle p-3 d-flex align-items-center justify-content-center"
                              style={{ backgroundColor: getLevelColor(facility.level), width: '60px', height: '60px' }}
                            >
                              {getTypeIcon(facility.type)}
                            </div>
                          </div>

                          <div className="col-12 col-sm">
                            <div className="row">
                              <div className="col-12 col-md-4 mb-3 mb-md-0">
                                <p className="fw-bold primary-color mb-1 h6">{facility.name}</p>
                                <p className="small secondary-color mb-1">{facility.id} • Est. {facility.established}</p>
                                <div className="d-flex align-items-center gap-1 mb-2">
                                  <MapPin size={12} className="secondary-color" />
                                  <span className="small secondary-color">{facility.address}</span>
                                </div>
                                <div className="d-flex gap-2">
                                  <span
                                    className="level-badge"
                                    style={{ backgroundColor: getLevelColor(facility.level) }}
                                  >
                                    {facility.level}
                                  </span>
                                  <span
                                    className="status-badge"
                                    style={{ backgroundColor: getStatusColor(facility.status) }}
                                  >
                                    {facility.status}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="col-12 col-md-3 mb-3 mb-md-0">
                                <div className="row g-2">
                                  <div className="col-6">
                                    <p className="small primary-color mb-1">
                                      <strong>Capacity</strong>
                                    </p>
                                    <p className="small secondary-color mb-0">{facility.capacity} beds</p>
                                  </div>
                                  <div className="col-6">
                                    <p className="small primary-color mb-1">
                                      <strong>Staff</strong>
                                    </p>
                                    <p className="small secondary-color mb-0">{facility.staffCount} staff</p>
                                  </div>
                                </div>
                                <div className="mt-2">
                                  <div className="d-flex justify-content-between align-items-center mb-1">
                                    <span className="small primary-color">Occupancy</span>
                                    <span className="small fw-bold primary-color">{occupancyRate}%</span>
                                  </div>
                                  <div className="occupancy-bar">
                                    <div 
                                      className="occupancy-fill"
                                      style={{ 
                                        width: `${occupancyRate}%`,
                                        backgroundColor: getOccupancyColor(facility)
                                      }}
                                    ></div>
                                  </div>
                                  <p className="small secondary-color mt-1 mb-0">
                                    {facility.currentOccupancy}/{facility.capacity}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="col-12 col-md-3 mb-3 mb-md-0">
                                <p className="small primary-color mb-2">
                                  <strong>Director:</strong> {facility.director}
                                </p>
                                <div className="d-flex align-items-center gap-1 mb-2">
                                  <Phone size={12} className="secondary-color" />
                                  <span className="small secondary-color">{facility.phone}</span>
                                </div>
                                <div className="d-flex flex-wrap gap-1">
                                  {facility.services.slice(0, 3).map((service, index) => (
                                    <span key={index} className="service-tag">
                                      {service}
                                    </span>
                                  ))}
                                  {facility.services.length > 3 && (
                                    <span className="service-tag" style={{ backgroundColor: '#DCD0A8', color: '#004030' }}>
                                      +{facility.services.length - 3}
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              <div className="col-12 col-md-2">
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
                    );
                  })}
                </div>

                {filteredFacilities.length === 0 && (
                  <div className="text-center py-5">
                    <Building2 className="secondary-color mb-3" size={48} />
                    <p className="h5 secondary-color">No facilities found</p>
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

export default FacilitiesManagement;