import React, { useState, useEffect, useRef } from 'react';
import {
  Container, Row, Col, Card, Table, Form,
  Button, Badge, InputGroup, Spinner, Modal
} from 'react-bootstrap';
import {
  Search, Filter, Edit3, Eye, Camera,
  CheckCircle, Clock, MapPin, Wrench, Plus,
  RefreshCw, AlertTriangle, XCircle, RotateCcw,
  ChevronDown, X, Upload, Calendar, FileText
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_URL from '../config';

/* ─────────────────────────────────────────
   STATUS CONFIG
───────────────────────────────────────── */
const STATUS_CONFIG = {
  'Completed':      { color: '#059669', bg: '#D1FAE5', icon: <CheckCircle  size={12} /> },
  'In Progress':    { color: '#2563EB', bg: '#DBEAFE', icon: <Clock        size={12} /> },
  'Re-Scheduled':   { color: '#D97706', bg: '#FEF3C7', icon: <RotateCcw   size={12} /> },
  'Pending':        { color: '#6B7280', bg: '#F3F4F6', icon: <Clock        size={12} /> },
  'Urgent':         { color: '#DC2626', bg: '#FEE2E2', icon: <AlertTriangle size={12} /> },
  'Awaiting Parts': { color: '#7C3AED', bg: '#EDE9FE', icon: <XCircle     size={12} /> },
  'Cancelled':      { color: '#374151', bg: '#E5E7EB', icon: <X           size={12} /> },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG['Pending'];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '4px 10px', borderRadius: '20px', fontSize: '0.72rem',
      fontWeight: '700', backgroundColor: cfg.bg, color: cfg.color,
      whiteSpace: 'nowrap'
    }}>
      {cfg.icon}{status}
    </span>
  );
};

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
const MaintenanceReportsPage = () => {
  /* ── state ── */
  const [reports,       setReports]       = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [searchTerm,    setSearchTerm]    = useState('');
  const [statusFilter,  setStatusFilter]  = useState('All');
  const [houseFilter,   setHouseFilter]   = useState('All');
  const [dateFrom,      setDateFrom]      = useState('');
  const [dateTo,        setDateTo]        = useState('');
  const [showFilters,   setShowFilters]   = useState(false);

  /* ── modals ── */
  const [showAddModal,  setShowAddModal]  = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selected,      setSelected]      = useState(null);
  const [submitting,    setSubmitting]    = useState(false);

  /* ── form ── */
  const emptyForm = {
    house: '', roomNumber: '', item: '', details: '',
    technicianName: '', workDone: '', status: 'In Progress',
    visitDate: '', imageUrl: '', nextVisitDate: ''
  };
  const [form,        setForm]        = useState(emptyForm);
  const [imageFile,   setImageFile]   = useState(null);
  const [imagePreview,setImagePreview]= useState('');
  const fileRef = useRef();

  /* ─── fetch ─── */
  const fetchReports = async () => {
    try {
      setLoading(true);
      const res  = await fetch(`${API_URL}/get-maintenance-reports`);
      const data = await res.json();
      setReports(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReports(); }, []);

  /* ─── image handler ─── */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  /* ─── submit add ─── */
  const handleAdd = async () => {
    if (!form.house || !form.item || !form.visitDate || !form.technicianName) {
      toast.warning('Please fill in all required fields');
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append('reportedBy', localStorage.getItem('user') || 'Technician');
      if (imageFile) fd.append('image', imageFile);

      const res = await fetch(`${API_URL}/add-maintenance-report`, {
        method: 'POST', body: fd
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Maintenance report submitted!');
        setShowAddModal(false);
        setForm(emptyForm);
        setImageFile(null);
        setImagePreview('');
        fetchReports();
      } else {
        toast.error(data.message || 'Failed to submit');
      }
    } catch (e) {
      console.error(e);
      toast.error('Error submitting report');
    } finally {
      setSubmitting(false);
    }
  };

  /* ─── submit edit ─── */
  const handleEdit = async () => {
    if (!selected) return;
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);

      const res = await fetch(`${API_URL}/update-maintenance-report/${selected._id}`, {
        method: 'PUT', body: fd
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Report updated!');
        setShowEditModal(false);
        setSelected(null);
        setForm(emptyForm);
        setImageFile(null);
        setImagePreview('');
        fetchReports();
      } else {
        toast.error(data.message || 'Failed to update');
      }
    } catch (e) {
      console.error(e);
      toast.error('Error updating report');
    } finally {
      setSubmitting(false);
    }
  };

  /* ─── open edit ─── */
  const openEdit = (report) => {
    setSelected(report);
    setForm({
      house:          report.house          || '',
      roomNumber:     report.roomNumber     || '',
      item:           report.item           || '',
      details:        report.details        || '',
      technicianName: report.technicianName || '',
      workDone:       report.workDone       || '',
      status:         report.status         || 'In Progress',
      visitDate:      report.visitDate      || '',
      imageUrl:       report.imageUrl       || '',
      nextVisitDate:  report.nextVisitDate  || '',
    });
    setImagePreview(report.imageUrl || '');
    setImageFile(null);
    setShowEditModal(true);
  };

  /* ─── open view ─── */
  const openView = (report) => { setSelected(report); setShowViewModal(true); };

  /* ─── filter ─── */
  const filtered = reports.filter(r => {
    const s = searchTerm.toLowerCase();
    const matchSearch = !s ||
      r.item?.toLowerCase().includes(s) ||
      r.house?.toLowerCase().includes(s) ||
      r.roomNumber?.toLowerCase().includes(s) ||
      r.technicianName?.toLowerCase().includes(s);
    const matchStatus = statusFilter === 'All' || r.status === statusFilter;
    const matchHouse  = houseFilter  === 'All' || r.house  === houseFilter;
    const matchFrom   = !dateFrom || new Date(r.visitDate) >= new Date(dateFrom);
    const matchTo     = !dateTo   || new Date(r.visitDate) <= new Date(dateTo);
    return matchSearch && matchStatus && matchHouse && matchFrom && matchTo;
  });

  /* ─── stats ─── */
  const stats = {
    total:      reports.length,
    inProgress: reports.filter(r => r.status === 'In Progress').length,
    completed:  reports.filter(r => r.status === 'Completed').length,
    urgent:     reports.filter(r => r.status === 'Urgent').length,
  };

  const houses = ['All', ...new Set(reports.map(r => r.house).filter(Boolean))];

  /* ────────────────────────────────────────
     RENDER
  ──────────────────────────────────────── */
  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', padding: '24px 0', fontFamily: 'system-ui, sans-serif' }}>
      <Container fluid="xl">

        {/* ── Header ── */}
        <div className="d-flex justify-content-between align-items-center mb-4" style={{ flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontWeight: '800', color: '#0F172A', margin: 0, fontSize: '1.75rem' }}>
              <Wrench size={22} style={{ marginRight: '10px', color: '#059669' }} />
              Maintenance Reports
            </h2>
            <p style={{ color: '#64748B', margin: '4px 0 0', fontSize: '0.9rem' }}>
              Log and track all maintenance visits and repairs
            </p>
          </div>
          <button
            onClick={() => { setForm(emptyForm); setImageFile(null); setImagePreview(''); setShowAddModal(true); }}
            style={{
              backgroundColor: '#059669', color: 'white', border: 'none',
              borderRadius: '10px', padding: '10px 20px', fontWeight: '700',
              fontSize: '0.9rem', cursor: 'pointer', display: 'flex',
              alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(5,150,105,0.3)'
            }}
          >
            <Plus size={18} /> Log New Report
          </button>
        </div>

        {/* ── Stats ── */}
        <Row className="mb-4 g-3">
          {[
            { label: 'Total Reports',  value: stats.total,      color: '#2563EB', bg: '#EFF6FF', icon: <FileText size={20} /> },
            { label: 'In Progress',    value: stats.inProgress, color: '#D97706', bg: '#FFFBEB', icon: <Clock    size={20} /> },
            { label: 'Completed',      value: stats.completed,  color: '#059669', bg: '#ECFDF5', icon: <CheckCircle size={20} /> },
            { label: 'Urgent',         value: stats.urgent,     color: '#DC2626', bg: '#FEF2F2', icon: <AlertTriangle size={20} /> },
          ].map((s, i) => (
            <Col xs={6} md={3} key={i}>
              <div style={{
                backgroundColor: 'white', borderRadius: '12px', padding: '18px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)', border: `1px solid ${s.bg}`,
                display: 'flex', alignItems: 'center', gap: '14px'
              }}>
                <div style={{ backgroundColor: s.bg, color: s.color, padding: '10px', borderRadius: '10px' }}>
                  {s.icon}
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748B', fontWeight: '600' }}>{s.label}</p>
                  <p style={{ margin: 0, fontSize: '1.6rem', fontWeight: '800', color: s.color, lineHeight: 1.2 }}>{s.value}</p>
                </div>
              </div>
            </Col>
          ))}
        </Row>

        {/* ── Filters ── */}
        <div style={{
          backgroundColor: 'white', borderRadius: '12px', padding: '16px 20px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* search */}
            <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input
                type="text"
                placeholder="Search item, room, technician..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  width: '100%', padding: '9px 12px 9px 36px', border: '2px solid #E2E8F0',
                  borderRadius: '8px', fontSize: '0.875rem', outline: 'none'
                }}
              />
            </div>

            {/* status */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              style={{ padding: '9px 12px', border: '2px solid #E2E8F0', borderRadius: '8px', fontSize: '0.875rem', backgroundColor: 'white', outline: 'none', minWidth: '150px' }}
            >
              <option value="All">All Statuses</option>
              {Object.keys(STATUS_CONFIG).map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            {/* house */}
            <select
              value={houseFilter}
              onChange={e => setHouseFilter(e.target.value)}
              style={{ padding: '9px 12px', border: '2px solid #E2E8F0', borderRadius: '8px', fontSize: '0.875rem', backgroundColor: 'white', outline: 'none', minWidth: '150px' }}
            >
              {houses.map(h => <option key={h} value={h}>{h === 'All' ? 'All Houses' : h}</option>)}
            </select>

            {/* date range toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                padding: '9px 14px', border: '2px solid #E2E8F0', borderRadius: '8px',
                backgroundColor: showFilters ? '#EFF6FF' : 'white', color: showFilters ? '#2563EB' : '#64748B',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', fontWeight: '600'
              }}
            >
              <Calendar size={15} /> Date Range <ChevronDown size={14} />
            </button>

            {/* refresh */}
            <button
              onClick={fetchReports}
              style={{
                padding: '9px 12px', border: '2px solid #E2E8F0', borderRadius: '8px',
                backgroundColor: 'white', color: '#64748B', cursor: 'pointer'
              }}
              title="Refresh"
            >
              <RefreshCw size={15} />
            </button>
          </div>

          {/* date range row */}
          {showFilters && (
            <div style={{ display: 'flex', gap: '12px', marginTop: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#374151' }}>From:</label>
                <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                  style={{ padding: '7px 10px', border: '2px solid #E2E8F0', borderRadius: '8px', fontSize: '0.85rem', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#374151' }}>To:</label>
                <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                  style={{ padding: '7px 10px', border: '2px solid #E2E8F0', borderRadius: '8px', fontSize: '0.85rem', outline: 'none' }} />
              </div>
              {(dateFrom || dateTo) && (
                <button onClick={() => { setDateFrom(''); setDateTo(''); }}
                  style={{ padding: '7px 12px', border: 'none', backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}>
                  Clear Dates
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── Table ── */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <Spinner animation="border" style={{ color: '#059669' }} />
              <p style={{ marginTop: '16px', color: '#64748B' }}>Loading reports...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#94A3B8' }}>
              <Wrench size={48} style={{ marginBottom: '16px', opacity: 0.4 }} />
              <p style={{ fontSize: '1rem', fontWeight: '600' }}>No maintenance reports found</p>
              <p style={{ fontSize: '0.85rem' }}>Adjust your filters or log a new report</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
                    {['Photo', 'Item / Issue', 'Location', 'Technician', 'Visit Date', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '14px 16px', fontSize: '0.72rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <tr key={r._id || i} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}>

                      {/* photo */}
                      <td style={{ padding: '12px 16px' }}>
                        <img
                          src={r.imageUrl || 'https://via.placeholder.com/50x50?text=No+Img'}
                          alt="report"
                          style={{ width: '52px', height: '52px', borderRadius: '8px', objectFit: 'cover', border: '2px solid #E2E8F0' }}
                        />
                      </td>

                      {/* item */}
                      <td style={{ padding: '12px 16px', maxWidth: '200px' }}>
                        <div style={{ fontWeight: '700', color: '#0F172A', fontSize: '0.9rem' }}>{r.item}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {r.workDone || r.details || '—'}
                        </div>
                      </td>

                      {/* location */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#374151', fontSize: '0.85rem', fontWeight: '600' }}>
                          <MapPin size={13} color="#059669" />{r.house}
                        </div>
                        {r.roomNumber && <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>Room: {r.roomNumber}</div>}
                      </td>

                      {/* technician */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>{r.technicianName || '—'}</div>
                      </td>

                      {/* date */}
                      <td style={{ padding: '12px 16px', fontSize: '0.83rem', color: '#64748B', whiteSpace: 'nowrap' }}>
                        {r.visitDate ? new Date(r.visitDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                      </td>

                      {/* status */}
                      <td style={{ padding: '12px 16px' }}>
                        <StatusBadge status={r.status} />
                      </td>

                      {/* actions */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => openView(r)}
                            title="View Details"
                            style={{ padding: '7px', backgroundColor: '#EFF6FF', color: '#2563EB', border: 'none', borderRadius: '7px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => openEdit(r)}
                            title="Edit Report"
                            style={{ padding: '7px', backgroundColor: '#F0FDF4', color: '#059669', border: 'none', borderRadius: '7px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                          >
                            <Edit3 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* footer count */}
          {!loading && (
            <div style={{ padding: '12px 20px', borderTop: '1px solid #F1F5F9', backgroundColor: '#F8FAFC', fontSize: '0.8rem', color: '#64748B', fontWeight: '500' }}>
              Showing <strong>{filtered.length}</strong> of <strong>{reports.length}</strong> reports
            </div>
          )}
        </div>
      </Container>

      {/* ════════════════════════════
          ADD / EDIT MODAL (shared form)
      ════════════════════════════ */}
      {(showAddModal || showEditModal) && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)', zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', width: '100%', maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>

            {/* header */}
            <div style={{ backgroundColor: '#059669', color: 'white', padding: '20px 24px', borderRadius: '16px 16px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '700', fontSize: '1.05rem' }}>
                <Wrench size={20} />
                {showAddModal ? 'Log New Maintenance Report' : 'Edit Maintenance Report'}
              </div>
              <button onClick={() => { setShowAddModal(false); setShowEditModal(false); }}
                style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', borderRadius: '8px', padding: '6px', cursor: 'pointer', display: 'flex' }}>
                <X size={18} />
              </button>
            </div>

            {/* body */}
            <div style={{ padding: '24px' }}>

              {/* image upload */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontWeight: '700', color: '#374151', fontSize: '0.875rem', display: 'block', marginBottom: '8px' }}>
                  <Camera size={14} style={{ marginRight: '6px' }} /> Site Photo
                </label>
                <div
                  onClick={() => fileRef.current.click()}
                  style={{
                    border: '2px dashed #CBD5E1', borderRadius: '10px', padding: '20px',
                    textAlign: 'center', cursor: 'pointer', backgroundColor: '#F8FAFC',
                    transition: 'border-color 0.2s'
                  }}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="preview" style={{ maxHeight: '160px', borderRadius: '8px', objectFit: 'cover' }} />
                  ) : (
                    <>
                      <Upload size={28} color="#94A3B8" style={{ marginBottom: '8px' }} />
                      <p style={{ margin: 0, color: '#64748B', fontSize: '0.85rem' }}>Click to upload a photo from site</p>
                    </>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
              </div>

              {/* form grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

                <div>
                  <label style={labelStyle}>House / Dorm <span style={{ color: 'red' }}>*</span></label>
                  <select value={form.house} onChange={e => setForm({ ...form, house: e.target.value })} style={inputStyle}>
                    <option value="">Select house...</option>
                    <option value="Adlam House">Adlam House</option>
                    <option value="Nurse Home">Nurse Home</option>
                    <option value="General Facilities">General Facilities</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Room Number</label>
                  <input type="text" placeholder="e.g. A12" value={form.roomNumber}
                    onChange={e => setForm({ ...form, roomNumber: e.target.value })} style={inputStyle} />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Item / Issue <span style={{ color: 'red' }}>*</span></label>
                  <input type="text" placeholder="e.g. Leaking Tap, Broken Window" value={form.item}
                    onChange={e => setForm({ ...form, item: e.target.value })} style={inputStyle} />
                </div>

                <div>
                  <label style={labelStyle}>Technician Name <span style={{ color: 'red' }}>*</span></label>
                  <input type="text" placeholder="Full name" value={form.technicianName}
                    onChange={e => setForm({ ...form, technicianName: e.target.value })} style={inputStyle} />
                </div>

                <div>
                  <label style={labelStyle}>Visit Date <span style={{ color: 'red' }}>*</span></label>
                  <input type="date" value={form.visitDate}
                    onChange={e => setForm({ ...form, visitDate: e.target.value })} style={inputStyle} />
                </div>

                <div>
                  <label style={labelStyle}>Current Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={inputStyle}>
                    {Object.keys(STATUS_CONFIG).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Next Visit Date (if re-scheduled)</label>
                  <input type="date" value={form.nextVisitDate}
                    onChange={e => setForm({ ...form, nextVisitDate: e.target.value })} style={inputStyle} />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Problem Details</label>
                  <textarea rows={2} placeholder="Describe the issue found..." value={form.details}
                    onChange={e => setForm({ ...form, details: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Work Done / Notes</label>
                  <textarea rows={3} placeholder="Describe what was done, parts replaced, notes for next visit..." value={form.workDone}
                    onChange={e => setForm({ ...form, workDone: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} />
                </div>
              </div>
            </div>

            {/* footer */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => { setShowAddModal(false); setShowEditModal(false); }}
                style={{ padding: '10px 20px', border: '2px solid #E2E8F0', borderRadius: '8px', backgroundColor: 'white', cursor: 'pointer', fontWeight: '600', color: '#374151' }}>
                Cancel
              </button>
              <button onClick={showAddModal ? handleAdd : handleEdit} disabled={submitting}
                style={{ padding: '10px 24px', backgroundColor: submitting ? '#6EE7B7' : '#059669', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: submitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {submitting ? <><Spinner animation="border" size="sm" /> Saving...</> : <><CheckCircle size={16} /> {showAddModal ? 'Submit Report' : 'Save Changes'}</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════
          VIEW MODAL
      ════════════════════════════ */}
      {showViewModal && selected && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)', zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', width: '100%', maxWidth: '620px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>

            {/* header */}
            <div style={{ background: 'linear-gradient(135deg, #0F172A, #1E293B)', color: 'white', padding: '20px 24px', borderRadius: '16px 16px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginBottom: '4px', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Maintenance Report</div>
                <h5 style={{ margin: 0, fontWeight: '800' }}>{selected.item}</h5>
                <div style={{ marginTop: '8px' }}><StatusBadge status={selected.status} /></div>
              </div>
              <button onClick={() => setShowViewModal(false)}
                style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', borderRadius: '8px', padding: '6px', cursor: 'pointer', display: 'flex' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              {/* image */}
              {selected.imageUrl && (
                <img src={selected.imageUrl} alt="site" style={{ width: '100%', maxHeight: '220px', objectFit: 'cover', borderRadius: '10px', marginBottom: '20px', border: '1px solid #E2E8F0' }} />
              )}

              {/* detail rows */}
              {[
                { label: 'Location',        value: `${selected.house}${selected.roomNumber ? ' — Room ' + selected.roomNumber : ''}` },
                { label: 'Technician',      value: selected.technicianName || '—' },
                { label: 'Visit Date',      value: selected.visitDate ? new Date(selected.visitDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '—' },
                { label: 'Next Visit',      value: selected.nextVisitDate ? new Date(selected.nextVisitDate + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—' },
                { label: 'Reported By',     value: selected.reportedBy || '—' },
                { label: 'Logged On',       value: selected.createdAt ? new Date(selected.createdAt).toLocaleString() : '—' },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F1F5F9', fontSize: '0.875rem' }}>
                  <span style={{ color: '#64748B', fontWeight: '600', minWidth: '130px' }}>{label}</span>
                  <span style={{ color: '#0F172A', fontWeight: '500', textAlign: 'right' }}>{value}</span>
                </div>
              ))}

              {/* problem details */}
              {selected.details && (
                <div style={{ marginTop: '16px' }}>
                  <p style={{ fontWeight: '700', color: '#374151', fontSize: '0.85rem', marginBottom: '6px' }}>Problem Details</p>
                  <div style={{ backgroundColor: '#FEF9EC', border: '1px solid #FDE68A', borderRadius: '8px', padding: '12px', fontSize: '0.875rem', color: '#374151', lineHeight: 1.6 }}>
                    {selected.details}
                  </div>
                </div>
              )}

              {/* work done */}
              {selected.workDone && (
                <div style={{ marginTop: '14px' }}>
                  <p style={{ fontWeight: '700', color: '#374151', fontSize: '0.85rem', marginBottom: '6px' }}>Work Done / Notes</p>
                  <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: '8px', padding: '12px', fontSize: '0.875rem', color: '#374151', lineHeight: 1.6 }}>
                    {selected.workDone}
                  </div>
                </div>
              )}
            </div>

            <div style={{ padding: '16px 24px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => { setShowViewModal(false); openEdit(selected); }}
                style={{ padding: '9px 18px', backgroundColor: '#F0FDF4', color: '#059669', border: '2px solid #86EFAC', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.875rem' }}>
                <Edit3 size={14} /> Edit Report
              </button>
              <button onClick={() => setShowViewModal(false)}
                style={{ padding: '9px 18px', backgroundColor: '#0F172A', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '0.875rem' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />

      <style>{`
        input:focus, select:focus, textarea:focus { border-color: #059669 !important; outline: none; box-shadow: 0 0 0 3px rgba(5,150,105,0.1); }
      `}</style>
    </div>
  );
};

/* ── shared input styles ── */
const labelStyle = { fontWeight: '700', color: '#374151', fontSize: '0.8rem', display: 'block', marginBottom: '5px' };
const inputStyle = {
  width: '100%', padding: '9px 12px', border: '2px solid #E2E8F0',
  borderRadius: '8px', fontSize: '0.875rem', backgroundColor: 'white',
  transition: 'border-color 0.2s', outline: 'none'
};

export default MaintenanceReportsPage;