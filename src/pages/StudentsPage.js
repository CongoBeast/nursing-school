import React, { useState, useMemo } from 'react';
import { Search, Download, Edit2, Trash2, Home, CreditCard, UserCheck } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const StudentsPage = () => {
  // Restructured student data for Dormitory Management
  const [students] = useState([
    {
      id: 1,
      studentId: 'ZNS001',
      name: 'Tendai Mukamuri',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
      dateStarted: '2023-02-15',
      dormHouse: 'Nurse Home',
      dormNumber: 'A12',
      rentStatus: 'Paid',
      yearOfStudy: 2,
      status: 'Active',
      gender: 'Female'
    },
    {
      id: 2,
      studentId: 'ZNS002',
      name: 'Blessing Chiweshe',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
      dateStarted: '2023-02-15',
      dormHouse: 'Adlam House',
      dormNumber: 'B05',
      rentStatus: 'Arrears',
      yearOfStudy: 2,
      status: 'Active',
      gender: 'Male'
    },
    {
      id: 3,
      studentId: 'ZNS003',
      name: 'Chipo Nyamayaro',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
      dateStarted: '2024-02-10',
      dormHouse: 'Nurse Home',
      dormNumber: 'C09',
      rentStatus: 'Paid',
      yearOfStudy: 1,
      status: 'Active',
      gender: 'Female'
    },
    {
      id: 4,
      studentId: 'ZNS004',
      name: 'Tatenda Moyo',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
      dateStarted: '2022-02-20',
      dormHouse: 'Adlam House',
      dormNumber: 'D14',
      rentStatus: 'Paid',
      yearOfStudy: 3,
      status: 'Active',
      gender: 'Male'
    }
  ]);

  const navigate = useNavigate();

  // Filters state adjusted for Dorms and Rent
  const [filters, setFilters] = useState({
    search: '',
    dormHouse: '',
    rentStatus: '',
    gender: '',
    status: ''
  });

  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Filter options
  const filterOptions = useMemo(() => ({
    houses: ['Adlam House', 'Nurse Home'],
    rentStatuses: ['Paid', 'Arrears', 'Pending'],
    genders: ['Male', 'Female'],
    statuses: ['Active', 'Inactive']
  }), []);

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      return (
        student.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        student.studentId.toLowerCase().includes(filters.search.toLowerCase())
      ) &&
      (filters.dormHouse === '' || student.dormHouse === filters.dormHouse) &&
      (filters.rentStatus === '' || student.rentStatus === filters.rentStatus) &&
      (filters.gender === '' || student.gender === filters.gender) &&
      (filters.status === '' || student.status === filters.status);
    });
  }, [students, filters]);

  // Campus-relevant stats
  const stats = useMemo(() => {
    return {
      totalResidents: filteredStudents.length,
      paidRent: filteredStudents.filter(s => s.rentStatus === 'Paid').length,
      inArrears: filteredStudents.filter(s => s.rentStatus === 'Arrears').length
    };
  }, [filteredStudents]);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const styles = {
    body: { backgroundColor: '#F0F7FF', minHeight: '100vh', padding: '20px', fontFamily: 'Arial, sans-serif' },
    header: { color: '#1E3A8A', fontWeight: 'bold', textAlign: 'center', marginBottom: '30px', fontSize: '2.5rem' },
    card: { border: 'none', borderRadius: '12px', boxShadow: '0 4px 6px rgba(30, 58, 138, 0.1)', marginBottom: '20px', backgroundColor: 'white' },
    statCard: { textAlign: 'center', padding: '25px 20px', color: 'white' },
    statNumber: { fontSize: '2.2rem', fontWeight: 'bold' },
    statLabel: { fontSize: '1rem', opacity: 0.9, marginTop: '5px' },
    filterBar: { backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(30, 58, 138, 0.1)', marginBottom: '20px' },
    tableHeader: { backgroundColor: '#1E3A8A', color: 'white', padding: '15px 20px', borderRadius: '12px 12px 0 0', display: 'flex', justifyContent: 'space-between' },
    th: { backgroundColor: '#3B82F6', color: 'white', padding: '15px 12px', textAlign: 'left', fontSize: '0.9rem' },
    td: { padding: '15px 12px', borderBottom: '1px solid #DBEAFE', fontSize: '0.9rem' },
    input: { border: '2px solid #DBEAFE', borderRadius: '8px', padding: '10px', fontSize: '0.9rem', width: '100%' },
    select: { border: '2px solid #DBEAFE', borderRadius: '8px', padding: '10px', fontSize: '0.9rem', width: '100%', cursor: 'pointer' },
    avatar: { width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }
  };

  return (
    <div style={styles.body}>
      <div className="container-fluid">
        <h1 style={styles.header}>Dormitory Residents Management</h1>

        {/* Relevant Stats Cards */}
        <div className="row mb-4">
          <div className="col-md-4">
            <div style={{...styles.card, background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)'}}>
              <div style={styles.statCard}>
                <div style={styles.statNumber}><Home size={28} className="me-2"/> {stats.totalResidents}</div>
                <div style={styles.statLabel}>Total Residents</div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div style={{...styles.card, background: 'linear-gradient(135deg, #10B981, #34D399)'}}>
              <div style={styles.statCard}>
                <div style={styles.statNumber}><UserCheck size={28} className="me-2"/> {stats.paidRent}</div>
                <div style={styles.statLabel}>Paid Rent</div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div style={{...styles.card, background: 'linear-gradient(135deg, #EF4444, #F87171)'}}>
              <div style={styles.statCard}>
                <div style={styles.statNumber}><CreditCard size={28} className="me-2"/> {stats.inArrears}</div>
                <div style={styles.statLabel}>In Arrears</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div style={styles.filterBar}>
          <div className="row g-3">
            <div className="col-lg-4">
              <label className="fw-bold mb-1" style={{color: '#1E3A8A'}}>Search Residents</label>
              <div style={{position: 'relative'}}>
                <Search size={18} style={{position: 'absolute', left: '12px', top: '12px', color: '#3B82F6'}} />
                <input type="text" placeholder="Name or Student ID..." value={filters.search} onChange={(e) => handleFilterChange('search', e.target.value)} style={{...styles.input, paddingLeft: '40px'}} />
              </div>
            </div>
            <div className="col-lg-2">
              <label className="fw-bold mb-1" style={{color: '#1E3A8A'}}>Dorm House</label>
              <select value={filters.dormHouse} onChange={(e) => handleFilterChange('dormHouse', e.target.value)} style={styles.select}>
                <option value="">All Houses</option>
                {filterOptions.houses.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
            <div className="col-lg-2">
              <label className="fw-bold mb-1" style={{color: '#1E3A8A'}}>Rent Status</label>
              <select value={filters.rentStatus} onChange={(e) => handleFilterChange('rentStatus', e.target.value)} style={styles.select}>
                <option value="">All Statuses</option>
                {filterOptions.rentStatuses.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="col-lg-2">
              <label className="fw-bold mb-1" style={{color: '#1E3A8A'}}>Gender</label>
              <select value={filters.gender} onChange={(e) => handleFilterChange('gender', e.target.value)} style={styles.select}>
                <option value="">All Genders</option>
                {filterOptions.genders.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Residents Table */}
        <div style={{backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)'}}>
          <div style={styles.tableHeader}>
            <h5 className="m-0">Resident Database</h5>
            <small>{filteredStudents.length} Residents Found</small>
          </div>
          <div style={{overflowX: 'auto'}}>
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
              <thead>
                <tr>
                  <th style={styles.th}>Resident</th>
                  <th style={styles.th}>Student ID</th>
                  <th style={styles.th}>House</th>
                  <th style={styles.th}>Room</th>
                  <th style={styles.th}>Rent Status</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} style={{backgroundColor: 'white'}}>
                    <td style={styles.td}>
                      <div className="d-flex align-items-center gap-2" style={{cursor: 'pointer'}} onClick={() => navigate("/student-profile")}>
                        <img src={student.avatar} style={styles.avatar} alt="avatar" />
                        <div>
                          <div className="fw-bold" style={{color: '#1E3A8A'}}>{student.name}</div>
                          <small className="text-muted">{student.gender}</small>
                        </div>
                      </div>
                    </td>
                    <td style={{...styles.td, fontWeight: 'bold'}}>{student.studentId}</td>
                    <td style={styles.td}>{student.dormHouse}</td>
                    <td style={styles.td}>{student.dormNumber}</td>
                    <td style={styles.td}>
                      <span className={`badge ${student.rentStatus === 'Paid' ? 'bg-success' : 'bg-danger'}`}>
                        {student.rentStatus}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span className="badge rounded-pill bg-light text-dark border">{student.status}</span>
                    </td>
                    <td style={styles.td}>
                      <button className="btn btn-sm btn-outline-primary me-1"><Edit2 size={14}/></button>
                      <button className="btn btn-sm btn-outline-danger"><Trash2 size={14}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentsPage;