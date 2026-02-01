import React, { useState, useMemo , useEffect } from 'react';
import { Search, Download, Edit2, Trash2, Home, Users, ChevronRight, Phone, Mail, Calendar, X, Network, UserCheck, Shield } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const StaffManagementPage = () => {
  // Roles as per requirement
  const ADMIN_ROLES = ["Principal Tutor", "Head Matron", "Chairperson of School Improvement Committee", "Allocation Officer"];
  const STAFF_ROLES = ["Warden"];

  const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);

  // Refactored Staff Data for Hostel Management
  // const [staff] = useState([
  //   { id: 1, staffId: 'ZNS-ADM-001', name: 'Dr. Margaret Chinyoka', avatar: '', position: 'Principal Tutor', qualification: 'PhD Nursing', dateJoined: '2020-01-15', status: 'Active', email: 'm.chinyoka@zns.ac.zw', phone: '+263 77 123 4567', gender: 'Female' },
  //   { id: 2, staffId: 'ZNS-ADM-002', name: 'Sr. Patricia Mpofu', avatar: '', position: 'Head Matron', qualification: 'MSc Nursing', dateJoined: '2019-08-01', status: 'Active', email: 'p.mpofu@zns.ac.zw', phone: '+263 77 234 5678', gender: 'Female' },
  //   { id: 3, staffId: 'ZNS-ADM-003', name: 'Mr. Nelson Sibanda', avatar: '', position: 'Allocation Officer', qualification: 'BSc Admin', dateJoined: '2021-02-10', status: 'Active', email: 'n.sibanda@zns.ac.zw', phone: '+263 77 345 6789', gender: 'Male' },
  //   { id: 4, staffId: 'ZNS-ADM-004', name: 'Mrs. Faith Makoni', avatar: '', position: 'Chairperson of School Improvement Committee', qualification: 'MA Leadership', dateJoined: '2022-03-15', status: 'Active', email: 'f.makoni@zns.ac.zw', phone: '+263 77 456 7890', gender: 'Female' },
  //   // 7 Wardens
  //   ...Array.from({ length: 7 }).map((_, i) => ({
  //     id: 5 + i,
  //     staffId: `ZNS-WDN-00${i + 1}`,
  //     name: `Warden Name ${i + 1}`,
  //     avatar: '',
  //     position: 'Warden',
  //     qualification: 'Diploma in Nursing',
  //     dateJoined: '2023-01-08',
  //     status: 'Active',
  //     email: `warden${i + 1}@zns.ac.zw`,
  //     phone: `+263 77 000 000${i}`,
  //     gender: i % 2 === 0 ? 'Female' : 'Male'
  //   }))
  // ]);
  const navigate = useNavigate(); // Ensure this is initialized
  const [staff, setStaff] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({ search: '', position: '', status: '', gender: '' });
  const [selectedStaff, setSelectedStaff] = useState([]);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        // const response = await fetch('https://nursing-school-backend--thomasmethembe4.replit.app/get-all-employees');
        const response = await fetch('http://localhost:4000/get-all-employees');

        const data = await response.json();
        
        // FILTER: Only include users where userType is NOT "student"
        const employeesOnly = data.filter(user => user.userType !== 'student');

        console.log(employeesOnly)
        setStaff(employeesOnly);
      } catch (error) {
        console.error("Error fetching staff:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, []);

  const filteredStaff = useMemo(() => {
    return staff.filter(member => {
      return (
        member.firstName.toLowerCase().includes(filters.search.toLowerCase()) ||
        member.staffId.toLowerCase().includes(filters.search.toLowerCase())
      ) &&
      (filters.position === '' || member.position === filters.position) &&
      (filters.status === '' || member.status === filters.status) &&
      (filters.gender === '' || member.gender === filters.gender);
    });
  }, [staff, filters]);

  const stats = useMemo(() => ({
    total: staff.length,
    admins: staff.filter(s => ADMIN_ROLES.includes(s.position)).length,
    wardens: staff.filter(s => STAFF_ROLES.includes(s.position)).length,
  }), [staff]);

  const handleFilterChange = (name, value) => setFilters(prev => ({ ...prev, [name]: value }));

  const styles = {
    body: { backgroundColor: '#F0F7FF', minHeight: '100vh', padding: '20px', fontFamily: 'system-ui, sans-serif' },
    headerSection: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    card: { backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', padding: '20px', border: '1px solid #E1E8F0' },
    statCard: { textAlign: 'center', padding: '15px', borderRadius: '12px', color: 'white' },
    table: { width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' },
    th: { padding: '12px', color: '#64748B', fontWeight: '600', textAlign: 'left', borderBottom: '2px solid #EDF2F7' },
    td: { padding: '16px 12px', backgroundColor: 'white', borderTop: '1px solid #EDF2F7', borderBottom: '1px solid #EDF2F7' },
    badge: (bg, color) => ({ backgroundColor: bg, color: color, padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700' }),
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modalContent: { backgroundColor: 'white', borderRadius: '16px', padding: '30px', width: '90%', maxWidth: '800px', position: 'relative' },
    orgBox: { border: '2px solid #3B82F6', padding: '10px', borderRadius: '8px', textAlign: 'center', width: '200px', margin: '0 auto', backgroundColor: '#EFF6FF' }
  };

  return (
    <div style={styles.body}>
      {/* Breadcrumb & Org Button */}
      <div style={styles.headerSection}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Home size={18} color="#3B82F6" />
          <ChevronRight size={16} color="#94A3B8" />
          <span style={{ fontWeight: '600', color: '#1E293B' }}>Hostel Staff Management</span>
        </div>
        <button 
          onClick={() => setIsOrgModalOpen(true)}
          style={{ ...styles.card, padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', backgroundColor: '#1E3A8A', color: 'white' }}
        >
          <Network size={18} /> Organizational Structure
        </button>
      </div>

      <h1 style={{ color: '#1E3A8A', fontWeight: '800', marginBottom: '25px' }}>Staff Directory</h1>

      {/* Stats */}
      <div className="row mb-4">
        {[
          { label: 'Total Personnel', val: stats.total, color: '#1E3A8A', icon: <Users /> },
          { label: 'Admin Executives', val: stats.admins, color: '#3B82F6', icon: <Shield /> },
          { label: 'Hostel Wardens', val: stats.wardens, color: '#10B981', icon: <UserCheck /> },
        ].map((s, i) => (
          <div key={i} className="col-md-4 mb-3">
            <div style={{ ...styles.statCard, backgroundColor: s.color, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{s.val}</div>
                <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>{s.label}</div>
              </div>
              {s.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ ...styles.card, marginBottom: '25px' }}>
        <div className="row">
          <div className="col-md-4 mb-2">
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94A3B8' }} />
              <input 
                type="text" 
                placeholder="Search by name or ID..." 
                style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-3 mb-2">
            <select 
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
              onChange={(e) => handleFilterChange('position', e.target.value)}
            >
              <option value="">All Positions</option>
              {[...ADMIN_ROLES, ...STAFF_ROLES].map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="col-md-3 mb-2">
            <select 
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>
          <div className="col-md-2 mb-2 text-end">
            <button style={{ padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: 'white' }}>
              <Download size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Staff Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Member</th>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Designation</th>
              <th style={styles.th}>Contact Details</th>
              <th style={styles.th}>Joined</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.map((member) => (
              <tr 
                key={member._id} // Use MongoDB _id
                onClick={() => navigate(`/employee-profile/${member._id}`, { state: { employee: member } })}
                style={{ cursor: 'pointer' }} // Visual cue for clickability
                className="hover-row" // Optional: add a hover effect in your CSS
              >
                <td style={{ ...styles.td, borderLeft: '1px solid #EDF2F7', borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img 
                      src={member.photo || member.avatar || 'https://via.placeholder.com/40'} 
                      style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} 
                      alt="profile"
                    />
                    <div>
                      <div style={{ fontWeight: '700', color: '#1E293B' }}>{member.name || member.username}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{member.gender}</div>
                    </div>
                  </div>
                </td>
                <td style={styles.td}>{member.staffId || member.employeeId || 'N/A'}</td>
                <td style={styles.td}>
                  <span style={ADMIN_ROLES.includes(member.position) ? { color: '#1E3A8A', fontWeight: 'bold' } : { color: '#64748B' }}>
                    {member.position || member.role} 
                  </span>
                </td>
                <td style={styles.td}>
                  <div style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Mail size={12} /> {member.email}
                  </div>
                  <div style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Phone size={12} /> {member.phoneNumber || member.phone}
                  </div>
                </td>
                <td style={styles.td}>{new Date(member.registrationDate).toLocaleDateString()}</td>
                <td style={styles.td}>
                  <span style={styles.badge(member.accountStatus === 'Active' ? '#DCFCE7' : '#FEF3C7', member.accountStatus === 'Active' ? '#166534' : '#854D0E')}>
                    {member.accountStatus}
                  </span>
                </td>
                <td style={{ ...styles.td, borderRight: '1px solid #EDF2F7', borderTopRightRadius: '10px', borderBottomRightRadius: '10px' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Edit2 size={16} color="#3B82F6" style={{ cursor: 'pointer' }} />
                    <Trash2 size={16} color="#EF4444" style={{ cursor: 'pointer' }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Organizational Structure Modal */}
      {isOrgModalOpen && (
        <div style={styles.modalOverlay} onClick={() => setIsOrgModalOpen(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: '#1E3A8A' }}>Hostel Hierarchy</h2>
              <X style={{ cursor: 'pointer' }} onClick={() => setIsOrgModalOpen(false)} />
            </div>
            
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
              {/* Hierarchical Diagram */}
              <div style={styles.orgBox}>
                <strong>Principal Tutor</strong>
                <div style={{ fontSize: '0.7rem' }}>Overall Oversight</div>
              </div>
              <div style={{ height: '30px', borderLeft: '2px dashed #CBD5E1' }}></div>
              <div style={styles.orgBox}>
                <strong>Head Matron</strong>
                <div style={{ fontSize: '0.7rem' }}>Clinical & Welfare Lead</div>
              </div>
              <div style={{ height: '30px', borderLeft: '2px dashed #CBD5E1' }}></div>
              <div style={{ display: 'flex', gap: '40px' }}>
                <div style={styles.orgBox}>
                  <strong>Allocation Officer</strong>
                  <div style={{ fontSize: '0.7rem' }}>Room Assignments</div>
                </div>
                <div style={styles.orgBox}>
                  <strong>SIC Chairperson</strong>
                  <div style={{ fontSize: '0.7rem' }}>Infrastructure & Facilities</div>
                </div>
              </div>
              <div style={{ height: '30px', borderLeft: '2px dashed #CBD5E1' }}></div>
              <div style={{ ...styles.orgBox, width: '450px', backgroundColor: '#F0FDFA', border: '2px solid #10B981' }}>
                <strong>Hostel Wardens (x7)</strong>
                <div style={{ fontSize: '0.7rem' }}>Daily Student Supervision & Reporting</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagementPage;