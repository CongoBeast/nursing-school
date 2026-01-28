import React, { useState, useMemo } from 'react';
import { Search, Download, Edit2, Trash2, Users, User, UserCheck, Bed, Home, Filter } from 'lucide-react';

const AccomodationManagement = () => {
  // Color palette
  const colors = {
    primary: '#E3F2FD',
    secondary: '#90CAF9', 
    tertiary: '#42A5F5',
    accent: '#1565C0'
  };

  // Sample student data with accommodation details
  const [students] = useState([
    {
      id: 1,
      studentId: 'ZNS001',
      name: 'Chipo Mukamuri',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
      dateStarted: '2023-02-15',
      class: 'Nursing 2A',
      department: 'General Nursing',
      yearOfStudy: 2,
      status: 'Active',
      gender: 'Female',
      dorm: 'Block A',
      room: 'A101',
      bedNumber: 1,
      phone: '+263 77 123 4567',
      emergencyContact: 'Mary Mukamuri - +263 77 765 4321'
    },
    {
      id: 2,
      studentId: 'ZNS002',
      name: 'Tendai Mapfumo',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
      dateStarted: '2023-02-15',
      class: 'Nursing 2A',
      department: 'General Nursing',
      yearOfStudy: 2,
      status: 'Active',
      gender: 'Male',
      dorm: 'Block B',
      room: 'B203',
      bedNumber: 2,
      phone: '+263 77 234 5678',
      emergencyContact: 'John Mapfumo - +263 77 876 5432'
    },
    {
      id: 3,
      studentId: 'ZNS003',
      name: 'Grace Nhongo',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
      dateStarted: '2024-02-10',
      class: 'Nursing 1B',
      department: 'Mental Health Nursing',
      yearOfStudy: 1,
      status: 'Active',
      gender: 'Female',
      dorm: 'Block A',
      room: 'A205',
      bedNumber: 1,
      phone: '+263 77 345 6789',
      emergencyContact: 'Sarah Nhongo - +263 77 987 6543'
    },
    {
      id: 4,
      studentId: 'ZNS004',
      name: 'Takudzwa Mutasa',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
      dateStarted: '2022-02-20',
      class: 'Nursing 3A',
      department: 'Pediatric Nursing',
      yearOfStudy: 3,
      status: 'Active',
      gender: 'Male',
      dorm: 'Block C',
      room: 'C104',
      bedNumber: 1,
      phone: '+263 77 456 7890',
      emergencyContact: 'Peter Mutasa - +263 77 098 7654'
    },
    {
      id: 5,
      studentId: 'ZNS005',
      name: 'Faith Sibanda',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&h=50&fit=crop&crop=face',
      dateStarted: '2022-02-20',
      class: 'Nursing 3B',
      department: 'General Nursing',
      yearOfStudy: 3,
      status: 'Active',
      gender: 'Female',
      dorm: 'Block A',
      room: 'A101',
      bedNumber: 2,
      phone: '+263 77 567 8901',
      emergencyContact: 'Joyce Sibanda - +263 77 109 8765'
    },
    {
      id: 6,
      studentId: 'ZNS006',
      name: 'Blessing Moyo',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face',
      dateStarted: '2024-02-10',
      class: 'Nursing 1A',
      department: 'General Nursing',
      yearOfStudy: 1,
      status: 'Inactive',
      gender: 'Male',
      dorm: 'Block B',
      room: 'B107',
      bedNumber: 1,
      phone: '+263 77 678 9012',
      emergencyContact: 'David Moyo - +263 77 210 9876'
    },
    {
      id: 7,
      studentId: 'ZNS007',
      name: 'Praise Chigumira',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop&crop=face',
      dateStarted: '2023-02-15',
      class: 'Nursing 2B',
      department: 'Mental Health Nursing',
      yearOfStudy: 2,
      status: 'Active',
      gender: 'Female',
      dorm: 'Block A',
      room: 'A205',
      bedNumber: 2,
      phone: '+263 77 789 0123',
      emergencyContact: 'Ruth Chigumira - +263 77 321 0987'
    },
    {
      id: 8,
      studentId: 'ZNS008',
      name: 'Marshal Zvobgo',
      avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=50&h=50&fit=crop&crop=face',
      dateStarted: '2022-02-20',
      class: 'Nursing 3A',
      department: 'General Nursing',
      yearOfStudy: 3,
      status: 'Active',
      gender: 'Male',
      dorm: 'Block C',
      room: 'C201',
      bedNumber: 1,
      phone: '+263 77 890 1234',
      emergencyContact: 'James Zvobgo - +263 77 432 1098'
    },
    {
      id: 9,
      studentId: 'ZNS009',
      name: 'Memory Ncube',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&h=50&fit=crop&crop=face',
      dateStarted: '2023-02-15',
      class: 'Nursing 2A',
      department: 'Pediatric Nursing',
      yearOfStudy: 2,
      status: 'Active',
      gender: 'Female',
      dorm: 'Block A',
      room: 'A304',
      bedNumber: 1,
      phone: '+263 77 901 2345',
      emergencyContact: 'Alice Ncube - +263 77 543 2109'
    },
    {
      id: 10,
      studentId: 'ZNS010',
      name: 'Tinashe Mubvumbi',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
      dateStarted: '2022-02-20',
      class: 'Nursing 3B',
      department: 'General Nursing',
      yearOfStudy: 3,
      status: 'Active',
      gender: 'Male',
      dorm: 'Block B',
      room: 'B203',
      bedNumber: 1,
      phone: '+263 77 012 3456',
      emergencyContact: 'Thomas Mubvumbi - +263 77 654 3210'
    }
  ]);

  // Dormitory data
  const dormitories = [
    { id: 'Block A', name: 'Block A - Female Wing', totalBeds: 60, occupiedBeds: 6 },
    { id: 'Block B', name: 'Block B - Male Wing', totalBeds: 50, occupiedBeds: 3 },
    { id: 'Block C', name: 'Block C - Mixed Wing', totalBeds: 40, occupiedBeds: 2 }
  ];

  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    class: '',
    department: '',
    gender: '',
    status: '',
    dorm: '',
    yearOfStudy: ''
  });

  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Get unique values for filter options
  const filterOptions = useMemo(() => ({
    classes: [...new Set(students.map(s => s.class))],
    departments: [...new Set(students.map(s => s.department))],
    genders: [...new Set(students.map(s => s.gender))],
    statuses: [...new Set(students.map(s => s.status))],
    dorms: [...new Set(students.map(s => s.dorm))],
    years: [...new Set(students.map(s => s.yearOfStudy))]
  }), [students]);

  // Filter students based on current filters
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      return (
        student.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        student.studentId.toLowerCase().includes(filters.search.toLowerCase())
      ) &&
      (filters.class === '' || student.class === filters.class) &&
      (filters.department === '' || student.department === filters.department) &&
      (filters.gender === '' || student.gender === filters.gender) &&
      (filters.status === '' || student.status === filters.status) &&
      (filters.dorm === '' || student.dorm === filters.dorm) &&
      (filters.yearOfStudy === '' || student.yearOfStudy.toString() === filters.yearOfStudy);
    });
  }, [students, filters]);

  // Calculate accommodation statistics
  const accommodationStats = useMemo(() => {
    const totalBeds = dormitories.reduce((sum, dorm) => sum + dorm.totalBeds, 0);
    const occupiedBeds = dormitories.reduce((sum, dorm) => sum + dorm.occupiedBeds, 0);
    const totalStudents = filteredStudents.length;
    const maleStudents = filteredStudents.filter(s => s.gender === 'Male').length;
    const femaleStudents = filteredStudents.filter(s => s.gender === 'Female').length;
    const activeStudents = filteredStudents.filter(s => s.status === 'Active').length;
    const occupancyPercentage = Math.round((occupiedBeds / totalBeds) * 100);

    return {
      totalStudents,
      maleStudents,
      femaleStudents,
      activeStudents,
      occupancyPercentage,
      totalBeds,
      occupiedBeds
    };
  }, [filteredStudents, dormitories]);

  // Handle individual checkbox
  const handleSelectStudent = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(s => s.id));
    }
    setSelectAll(!selectAll);
  };

  // Handle filter change
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: '',
      class: '',
      department: '',
      gender: '',
      status: '',
      dorm: '',
      yearOfStudy: ''
    });
  };

  // Handle download
  const handleDownload = () => {
    const dataToDownload = selectedStudents.length > 0 
      ? students.filter(s => selectedStudents.includes(s.id))
      : filteredStudents;
    
    const csvContent = [
      ['Student ID', 'Name', 'Date Started', 'Class', 'Department', 'Year', 'Status', 'Gender', 'Dorm', 'Room', 'Bed', 'Phone', 'Emergency Contact'],
      ...dataToDownload.map(s => [
        s.studentId, s.name, s.dateStarted, s.class, s.department, 
        s.yearOfStudy, s.status, s.gender, s.dorm, s.room, s.bedNumber, s.phone, s.emergencyContact
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students_accommodation_data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const styles = {
    body: {
      backgroundColor: colors.primary,
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    },
    header: {
      color: colors.accent,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '30px',
      fontSize: '2.5rem'
    },
    card: {
      border: 'none',
      borderRadius: '12px',
      boxShadow: `0 4px 6px rgba(21, 101, 192, 0.1)`,
      marginBottom: '20px',
      overflow: 'hidden',
      backgroundColor: 'white'
    },
    statCard: {
      textAlign: 'center',
      padding: '30px 20px',
      color: 'white'
    },
    statNumber: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      marginBottom: '10px'
    },
    statLabel: {
      fontSize: '1.1rem',
      opacity: 0.9
    },
    filterBar: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: `0 4px 6px rgba(21, 101, 192, 0.1)`,
      marginBottom: '20px'
    },
    tableContainer: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: `0 4px 6px rgba(21, 101, 192, 0.1)`,
      overflow: 'hidden'
    },
    tableHeader: {
      backgroundColor: colors.accent,
      color: 'white',
      padding: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    th: {
      backgroundColor: colors.tertiary,
      color: 'white',
      padding: '15px 12px',
      textAlign: 'left',
      fontWeight: 'bold',
      fontSize: '0.9rem'
    },
    td: {
      padding: '15px 12px',
      borderBottom: `1px solid ${colors.primary}`,
      fontSize: '0.9rem'
    },
    avatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      objectFit: 'cover'
    },
    statusBadge: {
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '0.8rem',
      fontWeight: 'bold'
    },
    actionButton: {
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      padding: '5px',
      margin: '0 2px',
      borderRadius: '4px',
      transition: 'background-color 0.2s'
    },
    input: {
      border: `2px solid ${colors.secondary}`,
      borderRadius: '8px',
      padding: '10px 12px',
      fontSize: '0.9rem',
      outline: 'none',
      transition: 'border-color 0.2s'
    },
    select: {
      border: `2px solid ${colors.secondary}`,
      borderRadius: '8px',
      padding: '10px 12px',
      fontSize: '0.9rem',
      outline: 'none',
      backgroundColor: 'white',
      cursor: 'pointer'
    },
    button: {
      backgroundColor: colors.accent,
      color: 'white',
      border: 'none',
      padding: '10px 16px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'background-color 0.2s'
    },
    clearButton: {
      backgroundColor: colors.secondary,
      color: colors.accent,
      border: 'none',
      padding: '10px 16px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'background-color 0.2s'
    }
  };

  return (
    <>
      {/* Bootstrap CSS CDN */}
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" 
        rel="stylesheet" 
      />
      
      <div style={styles.body}>
        <div className="container-fluid">
          {/* Header */}
          <h1 style={styles.header}>
            <Users className="me-3" size={48} />
            Student Accommodation Management
          </h1>

          {/* Accommodation Stats Cards Row */}
          <div className="row mb-4">
            <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
              <div style={{...styles.card, background: `linear-gradient(135deg, ${colors.accent}, ${colors.tertiary})`}}>
                <div style={styles.statCard}>
                  <Users size={32} className="mb-2" style={{opacity: 0.9}} />
                  <div style={styles.statNumber}>{accommodationStats.totalStudents}</div>
                  <div style={styles.statLabel}>Total Students</div>
                </div>
              </div>
            </div>

            <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
              <div style={{...styles.card, background: `linear-gradient(135deg, ${colors.tertiary}, ${colors.secondary})`}}>
                <div style={styles.statCard}>
                  <User size={32} className="mb-2" style={{opacity: 0.9}} />
                  <div style={styles.statNumber}>{accommodationStats.maleStudents}</div>
                  <div style={styles.statLabel}>Male Students</div>
                </div>
              </div>
            </div>

            <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
              <div style={{...styles.card, background: `linear-gradient(135deg, ${colors.secondary}, ${colors.primary})`, color: colors.accent}}>
                <div style={{...styles.statCard, color: colors.accent}}>
                  <User size={32} className="mb-2" style={{opacity: 0.8}} />
                  <div style={styles.statNumber}>{accommodationStats.femaleStudents}</div>
                  <div style={{...styles.statLabel, opacity: 0.8}}>Female Students</div>
                </div>
              </div>
            </div>

            <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
              <div style={{...styles.card, background: `linear-gradient(135deg, ${colors.accent}, ${colors.tertiary})`}}>
                <div style={styles.statCard}>
                  <UserCheck size={32} className="mb-2" style={{opacity: 0.9}} />
                  <div style={styles.statNumber}>{accommodationStats.activeStudents}</div>
                  <div style={styles.statLabel}>Active Students</div>
                </div>
              </div>
            </div>

            <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
              <div style={{...styles.card, background: `linear-gradient(135deg, ${colors.tertiary}, ${colors.secondary})`}}>
                <div style={styles.statCard}>
                  <Bed size={32} className="mb-2" style={{opacity: 0.9}} />
                  <div style={styles.statNumber}>{accommodationStats.occupancyPercentage}%</div>
                  <div style={styles.statLabel}>Bed Occupancy</div>
                </div>
              </div>
            </div>

            <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
              <div style={{...styles.card, background: `linear-gradient(135deg, ${colors.secondary}, ${colors.primary})`, color: colors.accent}}>
                <div style={{...styles.statCard, color: colors.accent}}>
                  <Home size={32} className="mb-2" style={{opacity: 0.8}} />
                  <div style={styles.statNumber}>{accommodationStats.occupiedBeds}/{accommodationStats.totalBeds}</div>
                  <div style={{...styles.statLabel, opacity: 0.8}}>Beds Used</div>
                </div>
              </div>
            </div>
          </div>

          

          {/* Dormitory Information Section */}
          <div className="row mt-4">
            <div className="col-12">
              <div style={styles.card}>
                <div style={{
                  ...styles.tableHeader,
                  backgroundColor: colors.secondary,
                  color: colors.accent
                }}>
                  <h3 style={{margin: 0, fontSize: '1.3rem'}}>
                    <Home className="me-2" size={24} />
                    Dormitory Information
                  </h3>
                </div>
                <div style={{padding: '20px'}}>
                  <div className="row">
                    {dormitories.map((dorm) => (
                      <div key={dorm.id} className="col-lg-4 col-md-6 mb-3">
                        <div style={{
                          border: `2px solid ${colors.secondary}`,
                          borderRadius: '8px',
                          padding: '16px',
                          backgroundColor: colors.primary
                        }}>
                          <h5 style={{color: colors.accent, marginBottom: '12px'}}>
                            <Bed className="me-2" size={20} />
                            {dorm.name}
                          </h5>
                          <div style={{fontSize: '0.9rem', color: colors.tertiary}}>
                            <div style={{marginBottom: '8px'}}>
                              <strong>Total Beds:</strong> {dorm.totalBeds}
                            </div>
                            <div style={{marginBottom: '8px'}}>
                              <strong>Occupied:</strong> {dorm.occupiedBeds}
                            </div>
                            <div>
                              <strong>Available:</strong> {dorm.totalBeds - dorm.occupiedBeds}
                            </div>
                          </div>
                          <div style={{
                            width: '100%',
                            height: '8px',
                            backgroundColor: '#e0e0e0',
                            borderRadius: '4px',
                            marginTop: '12px',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: `${(dorm.occupiedBeds / dorm.totalBeds) * 100}%`,
                              height: '100%',
                              backgroundColor: colors.accent,
                              borderRadius: '4px'
                            }}></div>
                          </div>
                          <div style={{
                            fontSize: '0.8rem',
                            color: colors.tertiary,
                            marginTop: '4px',
                            textAlign: 'center'
                          }}>
                            {Math.round((dorm.occupiedBeds / dorm.totalBeds) * 100)}% Occupied
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div style={styles.filterBar}>
            <div className="row align-items-end">
              <div className="col-lg-3 col-md-6 mb-3">
                <label style={{color: colors.accent, fontWeight: 'bold', marginBottom: '8px', display: 'block'}}>
                  Search Students
                </label>
                <div style={{position: 'relative'}}>
                  <Search size={18} style={{position: 'absolute', left: '12px', top: '12px', color: colors.tertiary}} />
                  <input
                    type="text"
                    placeholder="Name or Student ID..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    style={{...styles.input, paddingLeft: '40px', width: '100%'}}
                  />
                </div>
              </div>

              <div className="col-lg-2 col-md-6 mb-3">
                <label style={{color: colors.accent, fontWeight: 'bold', marginBottom: '8px', display: 'block'}}>
                  Class
                </label>
                <select
                  value={filters.class}
                  onChange={(e) => handleFilterChange('class', e.target.value)}
                  style={{...styles.select, width: '100%'}}
                >
                  <option value="">All Classes</option>
                  {filterOptions.classes.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>

              <div className="col-lg-2 col-md-6 mb-3">
                <label style={{color: colors.accent, fontWeight: 'bold', marginBottom: '8px', display: 'block'}}>
                  Dormitory
                </label>
                <select
                  value={filters.dorm}
                  onChange={(e) => handleFilterChange('dorm', e.target.value)}
                  style={{...styles.select, width: '100%'}}
                >
                  <option value="">All Dorms</option>
                  {filterOptions.dorms.map(dorm => (
                    <option key={dorm} value={dorm}>{dorm}</option>
                  ))}
                </select>
              </div>

              <div className="col-lg-1 col-md-6 mb-3">
                <label style={{color: colors.accent, fontWeight: 'bold', marginBottom: '8px', display: 'block'}}>
                  Gender
                </label>
                <select
                  value={filters.gender}
                  onChange={(e) => handleFilterChange('gender', e.target.value)}
                  style={{...styles.select, width: '100%'}}
                >
                  <option value="">All</option>
                  {filterOptions.genders.map(gender => (
                    <option key={gender} value={gender}>{gender}</option>
                  ))}
                </select>
              </div>

              <div className="col-lg-1 col-md-6 mb-3">
                <label style={{color: colors.accent, fontWeight: 'bold', marginBottom: '8px', display: 'block'}}>
                  Year
                </label>
                <select
                  value={filters.yearOfStudy}
                  onChange={(e) => handleFilterChange('yearOfStudy', e.target.value)}
                  style={{...styles.select, width: '100%'}}
                >
                  <option value="">All</option>
                  {filterOptions.years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div className="col-lg-1 col-md-6 mb-3">
                <label style={{color: colors.accent, fontWeight: 'bold', marginBottom: '8px', display: 'block'}}>
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  style={{...styles.select, width: '100%'}}
                >
                  <option value="">All</option>
                  {filterOptions.statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div className="col-lg-2 col-md-6 mb-3">
                <div className="d-flex gap-2">
                  <button
                    onClick={handleDownload}
                    style={styles.button}
                    title="Download Selected"
                  >
                    <Download size={16} />
                    Download ({selectedStudents.length || filteredStudents.length})
                  </button>
                  <button
                    onClick={clearFilters}
                    style={styles.clearButton}
                    title="Clear Filters"
                  >
                    <Filter size={16} />
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>


          {/* Table */}
          <div style={styles.tableContainer}>
            <div style={styles.tableHeader}>
              <h3 style={{margin: 0, fontSize: '1.3rem'}}>
                Students List ({filteredStudents.length} students)
              </h3>
              <span style={{fontSize: '0.9rem'}}>
                {selectedStudents.length} selected
              </span>
            </div>

            <div style={{overflowX: 'auto'}}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                        style={{marginRight: '8px'}}
                      />
                      Select
                    </th>
                    <th style={styles.th}>Student</th>
                    <th style={styles.th}>Student ID</th>
                    <th style={styles.th}>Date Started</th>
                    <th style={styles.th}>Class</th>
                    <th style={styles.th}>Department</th>
                    <th style={styles.th}>Accommodation</th>
                    <th style={styles.th}>Year</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id} style={{backgroundColor: selectedStudents.includes(student.id) ? colors.primary : 'white'}}>
                      <td style={styles.td}>
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.id)}
                          onChange={() => handleSelectStudent(student.id)}
                        />
                      </td>
                      <td style={styles.td}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                          <img
                            src={student.avatar}
                            alt={student.name}
                            style={styles.avatar}
                            onError={(e) => {
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&size=40&background=90CAF9&color=1565C0`;
                            }}
                          />
                          <div>
                            <div style={{fontWeight: 'bold', color: colors.accent}}>{student.name}</div>
                            <div style={{fontSize: '0.8rem', color: colors.tertiary}}>{student.gender}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{...styles.td, fontWeight: 'bold', color: colors.accent}}>{student.studentId}</td>
                      <td style={styles.td}>{formatDate(student.dateStarted)}</td>
                      <td style={styles.td}>{student.class}</td>
                      <td style={styles.td}>{student.department}</td>
                      <td style={styles.td}>
                        <div>
                          <div style={{fontWeight: 'bold', color: colors.accent}}>{student.dorm}</div>
                          <div style={{fontSize: '0.8rem', color: colors.tertiary}}>Room {student.room} - Bed {student.bedNumber}</div>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.statusBadge,
                          backgroundColor: student.yearOfStudy === 1 ? colors.primary : 
                                          student.yearOfStudy === 2 ? colors.secondary : colors.tertiary,
                          color: student.yearOfStudy === 1 ? colors.accent : 'white'
                        }}>
                          Year {student.yearOfStudy}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.statusBadge,
                          backgroundColor: student.status === 'Active' ? '#28a745' : '#dc3545',
                          color: 'white'
                        }}>
                          {student.status}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <div style={{display: 'flex', gap: '5px'}}>
                          <button
                            style={{
                              ...styles.actionButton,
                              color: colors.tertiary
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = colors.primary}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            title="Edit Student"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            style={{
                              ...styles.actionButton,
                              color: '#dc3545'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#ffebee'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            title="Delete Student"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {filteredStudents.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: colors.tertiary
              }}>
                <Users size={48} style={{marginBottom: '16px', opacity: 0.5}} />
                <h4 style={{color: colors.accent, marginBottom: '8px'}}>No students found</h4>
                <p style={{margin: 0}}>Try adjusting your search criteria or filters</p>
              </div>
            )}
          </div>

          {/* Footer Summary */}
          <div className="row mt-4">
            <div className="col-12">
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: `0 4px 6px rgba(21, 101, 192, 0.1)`,
                textAlign: 'center',
                color: colors.tertiary
              }}>
                <p style={{margin: 0, fontSize: '0.9rem'}}>
                  Showing {filteredStudents.length} of {students.length} students | 
                  {selectedStudents.length > 0 && ` ${selectedStudents.length} selected |`}
                  {' '}Total Accommodation Capacity: {accommodationStats.totalBeds} beds | 
                  Current Occupancy: {accommodationStats.occupancyPercentage}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccomodationManagement;