import React, { useState, useMemo } from 'react';
import { Search, Download, Edit2, Trash2, Filter, ChevronDown } from 'lucide-react';
import { Link, useLocation, useNavigate } from "react-router-dom";

const StudentsPage = () => {
  // Sample student data
  const [students] = useState([
    {
      id: 1,
      studentId: 'ZNS001',
      name: 'Tendai Mukamuri',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
      dateStarted: '2023-02-15',
      class: 'Nursing 2A',
      department: 'General Nursing',
      yearOfStudy: 2,
      status: 'Active',
      residence: 'On Campus',
      gender: 'Female'
    },
    {
      id: 2,
      studentId: 'ZNS002',
      name: 'Blessing Chiweshe',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
      dateStarted: '2023-02-15',
      class: 'Nursing 2A',
      department: 'General Nursing',
      yearOfStudy: 2,
      status: 'Active',
      residence: 'Off Campus',
      gender: 'Male'
    },
    {
      id: 3,
      studentId: 'ZNS003',
      name: 'Chipo Nyamayaro',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
      dateStarted: '2024-02-10',
      class: 'Nursing 1B',
      department: 'Mental Health Nursing',
      yearOfStudy: 1,
      status: 'Active',
      residence: 'On Campus',
      gender: 'Female'
    },
    {
      id: 4,
      studentId: 'ZNS004',
      name: 'Tatenda Moyo',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
      dateStarted: '2022-02-20',
      class: 'Nursing 3A',
      department: 'Pediatric Nursing',
      yearOfStudy: 3,
      status: 'Active',
      residence: 'Off Campus',
      gender: 'Male'
    },
    {
      id: 5,
      studentId: 'ZNS005',
      name: 'Priscilla Sithole',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&h=50&fit=crop&crop=face',
      dateStarted: '2022-02-20',
      class: 'Nursing 3B',
      department: 'General Nursing',
      yearOfStudy: 3,
      status: 'Active',
      residence: 'On Campus',
      gender: 'Female'
    },
    {
      id: 6,
      studentId: 'ZNS006',
      name: 'Tapiwa Ndoro',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face',
      dateStarted: '2024-02-10',
      class: 'Nursing 1A',
      department: 'General Nursing',
      yearOfStudy: 1,
      status: 'Inactive',
      residence: 'Off Campus',
      gender: 'Male'
    },
    {
      id: 7,
      studentId: 'ZNS007',
      name: 'Grace Chimwemwe',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop&crop=face',
      dateStarted: '2023-02-15',
      class: 'Nursing 2B',
      department: 'Mental Health Nursing',
      yearOfStudy: 2,
      status: 'Active',
      residence: 'On Campus',
      gender: 'Female'
    },
    {
      id: 8,
      studentId: 'ZNS008',
      name: 'Joshua Madziva',
      avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=50&h=50&fit=crop&crop=face',
      dateStarted: '2022-02-20',
      class: 'Nursing 3A',
      department: 'General Nursing',
      yearOfStudy: 3,
      status: 'Active',
      residence: 'On Campus',
      gender: 'Male'
    }
  ]);

  const navigate = useNavigate();

  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    class: '',
    department: '',
    gender: '',
    status: '',
    residence: ''
  });

  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Get unique values for filter options
  const filterOptions = useMemo(() => ({
    classes: [...new Set(students.map(s => s.class))],
    departments: [...new Set(students.map(s => s.department))],
    genders: [...new Set(students.map(s => s.gender))],
    statuses: [...new Set(students.map(s => s.status))],
    residences: [...new Set(students.map(s => s.residence))]
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
      (filters.residence === '' || student.residence === filters.residence);
    });
  }, [students, filters]);

  // Calculate stats
  const stats = useMemo(() => {
    const activeStudents = filteredStudents.filter(s => s.status === 'Active');
    return {
      total: activeStudents.length,
      onCampus: activeStudents.filter(s => s.residence === 'On Campus').length,
      offCampus: activeStudents.filter(s => s.residence === 'Off Campus').length
    };
  }, [filteredStudents]);

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

  const handleStudentClick = () => {
    navigate("/student-profile")
  }

  // Handle download
  const handleDownload = () => {
    const dataToDownload = selectedStudents.length > 0 
      ? students.filter(s => selectedStudents.includes(s.id))
      : filteredStudents;
    
    const csvContent = [
      ['Student ID', 'Name', 'Date Started', 'Class', 'Department', 'Year', 'Status', 'Residence', 'Gender'],
      ...dataToDownload.map(s => [
        s.studentId, s.name, s.dateStarted, s.class, s.department, 
        s.yearOfStudy, s.status, s.residence, s.gender
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students_data.csv';
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
      backgroundColor: '#FFEDFA',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    },
    header: {
      color: '#BE5985',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '30px',
      fontSize: '2.5rem'
    },
    card: {
      border: 'none',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(190, 89, 133, 0.1)',
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
      boxShadow: '0 4px 6px rgba(190, 89, 133, 0.1)',
      marginBottom: '20px'
    },
    tableContainer: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(190, 89, 133, 0.1)',
      overflow: 'hidden'
    },
    tableHeader: {
      backgroundColor: '#BE5985',
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
      backgroundColor: '#EC7FA9',
      color: 'white',
      padding: '15px 12px',
      textAlign: 'left',
      fontWeight: 'bold',
      fontSize: '0.9rem'
    },
    td: {
      padding: '15px 12px',
      borderBottom: '1px solid #FFEDFA',
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
      border: '2px solid #FFB8E0',
      borderRadius: '8px',
      padding: '10px 12px',
      fontSize: '0.9rem',
      outline: 'none',
      transition: 'border-color 0.2s'
    },
    select: {
      border: '2px solid #FFB8E0',
      borderRadius: '8px',
      padding: '10px 12px',
      fontSize: '0.9rem',
      outline: 'none',
      backgroundColor: 'white',
      cursor: 'pointer'
    },
    button: {
      backgroundColor: '#BE5985',
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
    }
  };

  return (
    <div style={styles.body}>
      <div className="container-fluid">
        {/* Header */}
        <h1 style={styles.header}>
          Students Management
        </h1>

        {/* Stats Cards Row */}
        <div className="row mb-4">
          <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
            <div style={{...styles.card, background: 'linear-gradient(135deg, #BE5985, #EC7FA9)'}}>
              <div style={styles.statCard}>
                <div style={styles.statNumber}>{stats.total}</div>
                <div style={styles.statLabel}>Active Students</div>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
            <div style={{...styles.card, background: 'linear-gradient(135deg, #EC7FA9, #FFB8E0)'}}>
              <div style={styles.statCard}>
                <div style={styles.statNumber}>{stats.onCampus}</div>
                <div style={styles.statLabel}>On Campus</div>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
            <div style={{...styles.card, background: 'linear-gradient(135deg, #FFB8E0, #FFEDFA)', color: '#BE5985'}}>
              <div style={{...styles.statCard, color: '#BE5985'}}>
                <div style={styles.statNumber}>{stats.offCampus}</div>
                <div style={{...styles.statLabel, opacity: 0.8}}>Off Campus</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div style={styles.filterBar}>
          <div className="row align-items-end">
            <div className="col-lg-3 col-md-6 mb-3">
              <label style={{color: '#BE5985', fontWeight: 'bold', marginBottom: '8px', display: 'block'}}>
                Search Students
              </label>
              <div style={{position: 'relative'}}>
                <Search size={18} style={{position: 'absolute', left: '12px', top: '12px', color: '#EC7FA9'}} />
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
              <label style={{color: '#BE5985', fontWeight: 'bold', marginBottom: '8px', display: 'block'}}>
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
              <label style={{color: '#BE5985', fontWeight: 'bold', marginBottom: '8px', display: 'block'}}>
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
              <label style={{color: '#BE5985', fontWeight: 'bold', marginBottom: '8px', display: 'block'}}>
                Gender
              </label>
              <select
                value={filters.gender}
                onChange={(e) => handleFilterChange('gender', e.target.value)}
                style={{...styles.select, width: '100%'}}
              >
                <option value="">All Genders</option>
                {filterOptions.genders.map(gender => (
                  <option key={gender} value={gender}>{gender}</option>
                ))}
              </select>
            </div>

            <div className="col-lg-2 col-md-6 mb-3">
              <label style={{color: '#BE5985', fontWeight: 'bold', marginBottom: '8px', display: 'block'}}>
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
                  <th style={styles.th}>Year</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} style={{backgroundColor: selectedStudents.includes(student.id) ? '#FFEDFA' : 'white'}}>
                    <td style={styles.td}>
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => handleSelectStudent(student.id)}
                      />
                    </td>
                    <td style={styles.td}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '12px'}} onClick={handleStudentClick}>
                        <img
                          src={student.avatar}
                          alt={student.name}
                          style={styles.avatar}
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&size=40&background=FFB8E0&color=BE5985`;
                          }}
                        />
                        <div>
                          <div style={{fontWeight: 'bold', color: '#BE5985'}}>{student.name}</div>
                          <div style={{fontSize: '0.8rem', color: '#EC7FA9'}}>{student.residence}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{...styles.td, fontWeight: 'bold', color: '#BE5985'}}>{student.studentId}</td>
                    <td style={styles.td}>{formatDate(student.dateStarted)}</td>
                    <td style={styles.td}>{student.class}</td>
                    <td style={styles.td}>{student.department}</td>
                    <td style={styles.td}>Year {student.yearOfStudy}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: student.status === 'Active' ? '#d4edda' : '#f8d7da',
                        color: student.status === 'Active' ? '#155724' : '#721c24'
                      }}>
                        {student.status}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <button
                        style={{...styles.actionButton, color: '#EC7FA9'}}
                        title="Edit Student"
                        onMouseOver={(e) => e.target.style.backgroundColor = '#FFEDFA'}
                        onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        style={{...styles.actionButton, color: '#BE5985'}}
                        title="Delete Student"
                        onMouseOver={(e) => e.target.style.backgroundColor = '#FFEDFA'}
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
        .col-lg-4, .col-lg-3, .col-lg-2, .col-lg-1, .col-md-6, .col-sm-12 {
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
          border-color: #BE5985 !important;
        }
        button:hover {
          background-color: #a04a73 !important;
        }
        tr:hover {
          background-color: #FFEDFA !important;
        }
      `}</style>
    </div>
  );
};

export default StudentsPage;