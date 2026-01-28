import React, { useState, useMemo } from 'react';
import { Search, Download, Edit2, Trash2, Home, Users, ChevronRight, Phone, Mail, Calendar } from 'lucide-react';

const StaffManagementPage = () => {
  // Sample staff data with comprehensive information
  const [staff] = useState([
    {
      id: 1,
      staffId: 'ZNS-STF-001',
      name: 'Dr. Margaret Chinyoka',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=50&h=50&fit=crop&crop=face',
      position: 'Principal',
      department: 'Administration',
      qualification: 'PhD Nursing Administration',
      dateJoined: '2020-01-15',
      employmentType: 'Permanent',
      status: 'Active',
      email: 'm.chinyoka@zns.ac.zw',
      phone: '+263 77 123 4567',
      gender: 'Female',
      dateOfBirth: '1975-03-20',
      salary: 2500,
      workLocation: 'Main Campus'
    },
    {
      id: 2,
      staffId: 'ZNS-STF-002',
      name: 'Prof. James Mutamba',
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=50&h=50&fit=crop&crop=face',
      position: 'Dean of Nursing',
      department: 'Academic Affairs',
      qualification: 'PhD Clinical Nursing',
      dateJoined: '2019-08-01',
      employmentType: 'Permanent',
      status: 'Active',
      email: 'j.mutamba@zns.ac.zw',
      phone: '+263 77 234 5678',
      gender: 'Male',
      dateOfBirth: '1970-07-15',
      salary: 2200,
      workLocation: 'Main Campus'
    },
    {
      id: 3,
      staffId: 'ZNS-STF-003',
      name: 'Sr. Patricia Mpofu',
      avatar: 'https://images.unsplash.com/photo-1594824407107-4e9806603e4a?w=50&h=50&fit=crop&crop=face',
      position: 'Senior Lecturer',
      department: 'General Nursing',
      qualification: 'MSc Nursing Education',
      dateJoined: '2021-02-10',
      employmentType: 'Permanent',
      status: 'Active',
      email: 'p.mpofu@zns.ac.zw',
      phone: '+263 77 345 6789',
      gender: 'Female',
      dateOfBirth: '1982-11-08',
      salary: 1800,
      workLocation: 'Main Campus'
    },
    {
      id: 4,
      staffId: 'ZNS-STF-004',
      name: 'Mr. Tinashe Nyandoro',
      avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=50&h=50&fit=crop&crop=face',
      position: 'Lecturer',
      department: 'Mental Health Nursing',
      qualification: 'BSc Mental Health Nursing',
      dateJoined: '2022-03-15',
      employmentType: 'Permanent',
      status: 'Active',
      email: 't.nyandoro@zns.ac.zw',
      phone: '+263 77 456 7890',
      gender: 'Male',
      dateOfBirth: '1985-05-22',
      salary: 1500,
      workLocation: 'Main Campus'
    },
    {
      id: 5,
      staffId: 'ZNS-STF-005',
      name: 'Mrs. Chipo Mandebvu',
      avatar: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=50&h=50&fit=crop&crop=face',
      position: 'Clinical Instructor',
      department: 'Pediatric Nursing',
      qualification: 'Diploma in Pediatric Nursing',
      dateJoined: '2023-01-08',
      employmentType: 'Contract',
      status: 'Active',
      email: 'c.mandebvu@zns.ac.zw',
      phone: '+263 77 567 8901',
      gender: 'Female',
      dateOfBirth: '1988-09-14',
      salary: 1200,
      workLocation: 'Clinical Site'
    },
    {
      id: 6,
      staffId: 'ZNS-STF-006',
      name: 'Mr. Nelson Sibanda',
      avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=50&h=50&fit=crop&crop=face',
      position: 'Registrar',
      department: 'Student Services',
      qualification: 'MBA Education Management',
      dateJoined: '2020-09-01',
      employmentType: 'Permanent',
      status: 'Active',
      email: 'n.sibanda@zns.ac.zw',
      phone: '+263 77 678 9012',
      gender: 'Male',
      dateOfBirth: '1978-12-03',
      salary: 1600,
      workLocation: 'Main Campus'
    },
    {
      id: 7,
      staffId: 'ZNS-STF-007',
      name: 'Mrs. Faith Makoni',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=50&h=50&fit=crop&crop=face',
      position: 'Librarian',
      department: 'Library Services',
      qualification: 'MSc Information Science',
      dateJoined: '2021-05-20',
      employmentType: 'Permanent',
      status: 'Active',
      email: 'f.makoni@zns.ac.zw',
      phone: '+263 77 789 0123',
      gender: 'Female',
      dateOfBirth: '1980-04-18',
      salary: 1300,
      workLocation: 'Main Campus'
    },
    {
      id: 8,
      staffId: 'ZNS-STF-008',
      name: 'Dr. Moses Chakanyuka',
      avatar: 'https://images.unsplash.com/photo-1559038441-5c94b5b2e675?w=50&h=50&fit=crop&crop=face',
      position: 'Medical Officer',
      department: 'Student Health',
      qualification: 'MBChB',
      dateJoined: '2022-07-01',
      employmentType: 'Part-time',
      status: 'Active',
      email: 'm.chakanyuka@zns.ac.zw',
      phone: '+263 77 890 1234',
      gender: 'Male',
      dateOfBirth: '1972-01-25',
      salary: 800,
      workLocation: 'Health Center'
    },
    {
      id: 9,
      staffId: 'ZNS-STF-009',
      name: 'Mr. Blessing Hove',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
      position: 'IT Technician',
      department: 'IT Services',
      qualification: 'Diploma Computer Science',
      dateJoined: '2023-04-15',
      employmentType: 'Contract',
      status: 'Active',
      email: 'b.hove@zns.ac.zw',
      phone: '+263 77 901 2345',
      gender: 'Male',
      dateOfBirth: '1990-08-10',
      salary: 900,
      workLocation: 'Main Campus'
    },
    {
      id: 10,
      staffId: 'ZNS-STF-010',
      name: 'Mrs. Rosemary Chikomo',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=50&h=50&fit=crop&crop=face',
      position: 'Matron',
      department: 'Student Affairs',
      qualification: 'Diploma in Nursing',
      dateJoined: '2018-06-01',
      employmentType: 'Permanent',
      status: 'On Leave',
      email: 'r.chikomo@zns.ac.zw',
      phone: '+263 77 012 3456',
      gender: 'Female',
      dateOfBirth: '1965-02-28',
      salary: 1400,
      workLocation: 'Dormitories'
    },
    {
      id: 11,
      staffId: 'ZNS-STF-011',
      name: 'Mr. Tafadzwa Moyo',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
      position: 'Accountant',
      department: 'Finance',
      qualification: 'ACCA',
      dateJoined: '2021-11-10',
      employmentType: 'Permanent',
      status: 'Active',
      email: 't.moyo@zns.ac.zw',
      phone: '+263 77 123 4567',
      gender: 'Male',
      dateOfBirth: '1986-10-12',
      salary: 1700,
      workLocation: 'Main Campus'
    },
    {
      id: 12,
      staffId: 'ZNS-STF-012',
      name: 'Ms. Vimbai Dube',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
      position: 'Security Supervisor',
      department: 'Security',
      qualification: 'Certificate in Security Management',
      dateJoined: '2019-12-01',
      employmentType: 'Permanent',
      status: 'Inactive',
      email: 'v.dube@zns.ac.zw',
      phone: '+263 77 234 5678',
      gender: 'Female',
      dateOfBirth: '1983-06-05',
      salary: 600,
      workLocation: 'Campus Wide'
    }
  ]);

  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    position: '',
    employmentType: '',
    status: '',
    workLocation: '',
    gender: ''
  });

  const [selectedStaff, setSelectedStaff] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Get unique values for filter options
  const filterOptions = useMemo(() => ({
    departments: [...new Set(staff.map(s => s.department))],
    positions: [...new Set(staff.map(s => s.position))],
    employmentTypes: [...new Set(staff.map(s => s.employmentType))],
    statuses: [...new Set(staff.map(s => s.status))],
    workLocations: [...new Set(staff.map(s => s.workLocation))],
    genders: [...new Set(staff.map(s => s.gender))]
  }), [staff]);

  // Filter staff based on current filters
  const filteredStaff = useMemo(() => {
    return staff.filter(member => {
      return (
        member.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        member.staffId.toLowerCase().includes(filters.search.toLowerCase()) ||
        member.email.toLowerCase().includes(filters.search.toLowerCase())
      ) &&
      (filters.department === '' || member.department === filters.department) &&
      (filters.position === '' || member.position === filters.position) &&
      (filters.employmentType === '' || member.employmentType === filters.employmentType) &&
      (filters.status === '' || member.status === filters.status) &&
      (filters.workLocation === '' || member.workLocation === filters.workLocation) &&
      (filters.gender === '' || member.gender === filters.gender);
    });
  }, [staff, filters]);

  // Calculate stats
  const stats = useMemo(() => {
    const activeStaff = filteredStaff.filter(s => s.status === 'Active');
    const totalSalary = activeStaff.reduce((sum, s) => sum + s.salary, 0);
    return {
      total: activeStaff.length,
      permanent: activeStaff.filter(s => s.employmentType === 'Permanent').length,
      contract: activeStaff.filter(s => s.employmentType === 'Contract').length,
      partTime: activeStaff.filter(s => s.employmentType === 'Part-time').length,
      totalSalary: totalSalary
    };
  }, [filteredStaff]);

  // Handle individual checkbox
  const handleSelectStaff = (staffId) => {
    setSelectedStaff(prev => 
      prev.includes(staffId) 
        ? prev.filter(id => id !== staffId)
        : [...prev, staffId]
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedStaff([]);
    } else {
      setSelectedStaff(filteredStaff.map(s => s.id));
    }
    setSelectAll(!selectAll);
  };

  // Handle filter change
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  // Handle download
  const handleDownload = () => {
    const dataToDownload = selectedStaff.length > 0 
      ? staff.filter(s => selectedStaff.includes(s.id))
      : filteredStaff;
    
    const csvContent = [
      ['Staff ID', 'Name', 'Position', 'Department', 'Qualification', 'Date Joined', 'Employment Type', 'Status', 'Email', 'Phone', 'Gender', 'Work Location', 'Salary'],
      ...dataToDownload.map(s => [
        s.staffId, s.name, s.position, s.department, s.qualification, 
        s.dateJoined, s.employmentType, s.status, s.email, s.phone, 
        s.gender, s.workLocation, s.salary
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'staff_data.csv';
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

  // Format salary
  const formatSalary = (amount) => {
    return `$${amount.toLocaleString()}`;
  };

  // Calculate age
  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const styles = {
    body: {
      backgroundColor: '#E3F2FD',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    },
    breadcrumb: {
      backgroundColor: 'white',
      padding: '15px 20px',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(21, 101, 192, 0.1)',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    breadcrumbLink: {
      color: '#1565C0',
      textDecoration: 'none',
      fontWeight: 'bold',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '5px'
    },
    breadcrumbSeparator: {
      color: '#42A5F5'
    },
    breadcrumbCurrent: {
      color: '#42A5F5',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      gap: '5px'
    },
    header: {
      color: '#1565C0',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '30px',
      fontSize: '2.5rem'
    },
    card: {
      border: 'none',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(21, 101, 192, 0.1)',
      marginBottom: '20px',
      overflow: 'hidden',
      backgroundColor: 'white'
    },
    statCard: {
      textAlign: 'center',
      padding: '25px 15px',
      color: 'white'
    },
    statNumber: {
      fontSize: '2.2rem',
      fontWeight: 'bold',
      marginBottom: '8px'
    },
    statLabel: {
      fontSize: '1rem',
      opacity: 0.9
    },
    filterBar: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(21, 101, 192, 0.1)',
      marginBottom: '20px'
    },
    tableContainer: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(21, 101, 192, 0.1)',
      overflow: 'hidden'
    },
    tableHeader: {
      backgroundColor: '#1565C0',
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
      backgroundColor: '#42A5F5',
      color: 'white',
      padding: '15px 12px',
      textAlign: 'left',
      fontWeight: 'bold',
      fontSize: '0.9rem'
    },
    td: {
      padding: '15px 12px',
      borderBottom: '1px solid #E3F2FD',
      fontSize: '0.9rem',
      verticalAlign: 'top'
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
    employmentBadge: {
      padding: '4px 10px',
      borderRadius: '15px',
      fontSize: '0.75rem',
      fontWeight: 'bold',
      marginTop: '4px'
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
      border: '2px solid #90CAF9',
      borderRadius: '8px',
      padding: '10px 12px',
      fontSize: '0.9rem',
      outline: 'none',
      transition: 'border-color 0.2s'
    },
    select: {
      border: '2px solid #90CAF9',
      borderRadius: '8px',
      padding: '10px 12px',
      fontSize: '0.9rem',
      outline: 'none',
      backgroundColor: 'white',
      cursor: 'pointer'
    },
    button: {
      backgroundColor: '#1565C0',
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
    contactInfo: {
      fontSize: '0.8rem',
      color: '#42A5F5',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      marginTop: '2px'
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return { backgroundColor: '#d4edda', color: '#155724' };
      case 'On Leave': return { backgroundColor: '#fff3cd', color: '#856404' };
      case 'Inactive': return { backgroundColor: '#f8d7da', color: '#721c24' };
      default: return { backgroundColor: '#e2e3e5', color: '#383d41' };
    }
  };

  const getEmploymentColor = (type) => {
    switch (type) {
      case 'Permanent': return { backgroundColor: '#d1ecf1', color: '#0c5460' };
      case 'Contract': return { backgroundColor: '#d4edda', color: '#155724' };
      case 'Part-time': return { backgroundColor: '#fff3cd', color: '#856404' };
      default: return { backgroundColor: '#e2e3e5', color: '#383d41' };
    }
  };

  return (
    <div style={styles.body}>
      <div className="container-fluid">
        {/* Breadcrumb */}
        <div style={styles.breadcrumb}>
          <a href="#" style={styles.breadcrumbLink}>
            <Home size={16} />
            Dashboard
          </a>
          <ChevronRight size={16} style={styles.breadcrumbSeparator} />
          <span style={styles.breadcrumbCurrent}>
            <Users size={16} />
            Staff Management
          </span>
        </div>

        {/* Header */}
        <h1 style={styles.header}>
          Staff Management
        </h1>

        {/* Stats Cards Row */}
        <div className="row mb-4">
          <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
            <div style={{...styles.card, background: 'linear-gradient(135deg, #1565C0, #42A5F5)'}}>
              <div style={styles.statCard}>
                <div style={styles.statNumber}>{stats.total}</div>
                <div style={styles.statLabel}>Active Staff</div>
              </div>
            </div>
          </div>

          <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
            <div style={{...styles.card, background: 'linear-gradient(135deg, #42A5F5, #90CAF9)'}}>
              <div style={styles.statCard}>
                <div style={styles.statNumber}>{stats.permanent}</div>
                <div style={styles.statLabel}>Permanent</div>
              </div>
            </div>
          </div>

          <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
            <div style={{...styles.card, background: 'linear-gradient(135deg, #90CAF9, #E3F2FD)', color: '#1565C0'}}>
              <div style={{...styles.statCard, color: '#1565C0'}}>
                <div style={styles.statNumber}>{stats.contract}</div>
                <div style={{...styles.statLabel, opacity: 0.8}}>Contract</div>
              </div>
            </div>
          </div>

          <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
            <div style={{...styles.card, background: 'linear-gradient(135deg, #1565C0, #42A5F5)'}}>
              <div style={styles.statCard}>
                <div style={styles.statNumber}>{stats.partTime}</div>
                <div style={styles.statLabel}>Part-time</div>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-8 col-sm-12 mb-3">
            <div style={{...styles.card, background: 'linear-gradient(135deg, #42A5F5, #90CAF9)'}}>
              <div style={styles.statCard}>
                <div style={styles.statNumber}>{formatSalary(stats.totalSalary)}</div>
                <div style={styles.statLabel}>Total Monthly Salary</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div style={styles.filterBar}>
          <div className="row align-items-end">
            <div className="col-lg-3 col-md-6 mb-3">
              <label style={{color: '#1565C0', fontWeight: 'bold', marginBottom: '8px', display: 'block'}}>
                Search Staff
              </label>
              <div style={{position: 'relative'}}>
                <Search size={18} style={{position: 'absolute', left: '12px', top: '12px', color: '#42A5F5'}} />
                <input
                  type="text"
                  placeholder="Name, ID, or Email..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  style={{...styles.input, paddingLeft: '40px', width: '100%'}}
                />
              </div>
            </div>

            <div className="col-lg-2 col-md-6 mb-3">
              <label style={{color: '#1565C0', fontWeight: 'bold', marginBottom: '8px', display: 'block'}}>
                Department
              </label>
              <select
                value={filters.department}
                onChange={(e) => handleFilterChange('department', e.target.value)}
                style={{...styles.select, width: '100%'}}
              >
                <option value="">All Departments</option>
                {filterOptions.departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div className="col-lg-2 col-md-6 mb-3">
              <label style={{color: '#1565C0', fontWeight: 'bold', marginBottom: '8px', display: 'block'}}>
                Position
              </label>
              <select
                value={filters.position}
                onChange={(e) => handleFilterChange('position', e.target.value)}
                style={{...styles.select, width: '100%'}}
              >
                <option value="">All Positions</option>
                {filterOptions.positions.map(pos => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
            </div>

            <div className="col-lg-2 col-md-6 mb-3">
              <label style={{color: '#1565C0', fontWeight: 'bold', marginBottom: '8px', display: 'block'}}>
                Employment
              </label>
              <select
                value={filters.employmentType}
                onChange={(e) => handleFilterChange('employmentType', e.target.value)}
                style={{...styles.select, width: '100%'}}
              >
                <option value="">All Types</option>
                {filterOptions.employmentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="col-lg-2 col-md-6 mb-3">
              <label style={{color: '#1565C0', fontWeight: 'bold', marginBottom: '8px', display: 'block'}}>
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                style={{...styles.select, width: '100%'}}
              >
                <option value="">All Status</option>
                {filterOptions.statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div className="col-lg-1 col-md-6 mb-3">
              <button
                onClick={handleDownload}
                style={styles.button}
                title="Download Selected"
              >
                <Download size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={styles.tableContainer}>
          <div style={styles.tableHeader}>
            <h3 style={{margin: 0, fontSize: '1.3rem'}}>
              Staff List ({filteredStaff.length} members)
            </h3>
            <span style={{fontSize: '0.9rem'}}>
              {selectedStaff.length} selected
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
                  <th style={styles.th}>Staff Member</th>
                  <th style={styles.th}>Staff ID</th>
                  <th style={styles.th}>Position & Department</th>
                  <th style={styles.th}>Contact Info</th>
                  <th style={styles.th}>Employment Details</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Salary</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map((member) => (
                  <tr key={member.id} style={{backgroundColor: selectedStaff.includes(member.id) ? '#E3F2FD' : 'white'}}>
                    <td style={styles.td}>
                      <input
                        type="checkbox"
                        checked={selectedStaff.includes(member.id)}
                        onChange={() => handleSelectStaff(member.id)}
                      />
                    </td>
                    <td style={styles.td}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                        <img
                          src={member.avatar}
                          alt={member.name}
                          style={styles.avatar}
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&size=40&background=90CAF9&color=1565C0`;
                          }}
                        />
                        <div>
                          <div style={{fontWeight: 'bold', color: '#1565C0'}}>{member.name}</div>
                          <div style={{fontSize: '0.8rem', color: '#42A5F5'}}>{member.qualification}</div>
                          <div style={{fontSize: '0.8rem', color: '#999'}}>Age: {calculateAge(member.dateOfBirth)}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{...styles.td, fontWeight: 'bold', color: '#1565C0'}}>{member.staffId}</td>
                    <td style={styles.td}>
                      <div style={{fontWeight: 'bold', color: '#1565C0', marginBottom: '4px'}}>{member.position}</div>
                      <div style={{fontSize: '0.85rem', color: '#42A5F5'}}>{member.department}</div>
                      <div style={{fontSize: '0.8rem', color: '#999', marginTop: '4px'}}>{member.workLocation}</div>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.contactInfo}>
                        <Mail size={12} />
                        {member.email}
                      </div>
                      <div style={styles.contactInfo}>
                        <Phone size={12} />
                        {member.phone}
                      </div>
                      <div style={styles.contactInfo}>
                        <Calendar size={12} />
                        Joined: {formatDate(member.dateJoined)}
                      </div>
                    </td>
                    <td style={styles.td}>
                      <div style={{
                        ...styles.employmentBadge,
                        ...getEmploymentColor(member.employmentType)
                      }}>
                        {member.employmentType}
                      </div>
                      <div style={{fontSize: '0.8rem', color: '#999', marginTop: '8px'}}>
                        {member.gender}
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.statusBadge,
                        ...getStatusColor(member.status)
                      }}>
                        {member.status}
                      </span>
                    </td>
                    <td style={{...styles.td, fontWeight: 'bold', color: '#1565C0'}}>
                      {formatSalary(member.salary)}
                    </td>
                    <td style={styles.td}>
                      <button
                        style={{...styles.actionButton, color: '#42A5F5'}}
                        title="Edit Staff Member"
                        onMouseOver={(e) => e.target.style.backgroundColor = '#E3F2FD'}
                        onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        style={{...styles.actionButton, color: '#1565C0'}}
                        title="Delete Staff Member"
                        onMouseOver={(e) => e.target.style.backgroundColor = '#E3F2FD'}
                        onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        .container-fluid {
          max-width: 1400px;
          margin: 0 auto;
        }
        .row {
          margin: 0 -10px;
        }
        .col-lg-4, .col-lg-3, .col-lg-2, .col-lg-1, .col-md-8, .col-md-6, .col-md-4, .col-sm-12, .col-sm-6 {
          padding: 0 10px;
        }
        body {
          margin: 0;
          padding: 0;
        }
        * {
          box-sizing: border-box;
        }
        input:focus, select:focus {
          border-color: #1565C0 !important;
        }
        button:hover {
          background-color: #0d47a1 !important;
        }
        tr:hover {
          background-color: #E3F2FD !important;
        }
        a:hover {
          color: #0d47a1 !important;
          text-decoration: underline !important;
        }
        
        /* Responsive adjustments */
        @media (max-width: 1200px) {
          .table-responsive {
            font-size: 0.85rem;
          }
        }
        
        @media (max-width: 768px) {
          .container-fluid {
            padding: 10px;
          }
          
          .row {
            margin: 0 -5px;
          }
          
          .col-lg-4, .col-lg-3, .col-lg-2, .col-lg-1, .col-md-8, .col-md-6, .col-md-4, .col-sm-12, .col-sm-6 {
            padding: 0 5px;
          }
          
          .table th, .table td {
            padding: 8px 6px;
            font-size: 0.8rem;
          }
          
          .stat-number {
            font-size: 1.8rem !important;
          }
          
          .stat-label {
            font-size: 0.9rem !important;
          }
        }
        
        /* Table scroll styling */
        .table-container::-webkit-scrollbar {
          height: 8px;
        }
        
        .table-container::-webkit-scrollbar-track {
          background: #E3F2FD;
        }
        
        .table-container::-webkit-scrollbar-thumb {
          background: #90CAF9;
          border-radius: 4px;
        }
        
        .table-container::-webkit-scrollbar-thumb:hover {
          background: #42A5F5;
        }
      `}</style>
    </div>
  );
};

export default StaffManagementPage;