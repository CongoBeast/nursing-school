import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Search, X, ChevronRight, Home, DollarSign, CheckCircle, Clock,
  AlertCircle, RefreshCw, Eye, User, Calendar, CreditCard,
  Banknote, Smartphone, FileText, ArrowLeft, Receipt, TrendingUp,
  Filter, ChevronDown, ExternalLink, Download
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_URL from '../config';

/* ── Design tokens ── */
const T = {
  navy:    '#0F172A',
  blue:    '#1D4ED8',
  indigo:  '#4338CA',
  green:   '#059669',
  amber:   '#D97706',
  red:     '#DC2626',
  violet:  '#7C3AED',
  s50:     '#F8FAFC',
  s100:    '#F1F5F9',
  s200:    '#E2E8F0',
  s300:    '#CBD5E1',
  s400:    '#94A3B8',
  s500:    '#64748B',
  s600:    '#475569',
  s700:    '#334155',
  s800:    '#1E293B',
  white:   '#FFFFFF',
};

const card = {
  backgroundColor: T.white,
  borderRadius: 14,
  boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
  border: `1px solid ${T.s200}`,
};

const pill = (bg, fg) => ({
  display: 'inline-flex', alignItems: 'center', gap: 4,
  backgroundColor: bg, color: fg,
  padding: '3px 10px', borderRadius: 99,
  fontSize: '0.69rem', fontWeight: 700, letterSpacing: '0.05em',
  textTransform: 'uppercase', whiteSpace: 'nowrap',
});

const MONTHS_LIST = Array.from({ length: 24 }, (_, i) => {
  const d = new Date();
  d.setMonth(d.getMonth() - i);
  return d.toISOString().slice(0, 7);
});

const PAYMENT_METHODS = [
  { value: '', label: 'All Methods', icon: <Filter size={13} /> },
  { value: 'bank_eft', label: 'Bank EFT', icon: <Banknote size={13} /> },
  { value: 'ecocash', label: 'EcoCash', icon: <Smartphone size={13} /> },
  { value: 'cash', label: 'Cash', icon: <DollarSign size={13} /> },
];

const METHOD_META = {
  bank_eft: { label: 'Bank EFT', color: T.blue, bg: '#EFF6FF', icon: <Banknote size={12} /> },
  ecocash:  { label: 'EcoCash',  color: T.violet, bg: '#F5F3FF', icon: <Smartphone size={12} /> },
  cash:     { label: 'Cash',     color: T.green, bg: '#F0FDF4', icon: <DollarSign size={12} /> },
};

const fmtMonth = (m) => {
  if (!m) return '—';
  const [y, mo] = m.split('-');
  return new Date(y, mo - 1).toLocaleString('default', { month: 'long', year: 'numeric' });
};

const fmtDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

/* ── Avatar ── */
const Av = ({ src, name, size = 36 }) => {
  const init = (name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const palette = ['#1D4ED8','#059669','#D97706','#7C3AED','#0891B2','#DC2626'];
  const bg = palette[(name?.charCodeAt(0) || 0) % palette.length];
  return src
    ? <img src={src} alt={name} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
    : <div style={{ width: size, height: size, borderRadius: '50%', backgroundColor: bg, color: T.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.33, fontWeight: 700, flexShrink: 0 }}>{init}</div>;
};

/* ── Transaction Detail Modal ── */
const TransactionModal = ({ record, student, onClose, onViewStudent }) => {
  const method = METHOD_META[record.paymentMethod] || null;
  const isImage = record.proofOfPaymentUrl && /\.(jpg|jpeg|png|webp|gif)/i.test(record.proofOfPaymentUrl);

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)', padding: 16 }}
      onClick={onClose}>
      <div style={{ ...card, width: '100%', maxWidth: 560, maxHeight: '92vh', overflowY: 'auto', position: 'relative' }}
        onClick={e => e.stopPropagation()}>

        {/* Header gradient */}
        <div style={{ background: `linear-gradient(135deg, ${T.navy}, #1E3A8A)`, padding: '22px 24px', borderRadius: '14px 14px 0 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Receipt size={20} color="white" />
              </div>
              <div>
                <div style={{ fontWeight: 800, color: 'white', fontSize: '1rem' }}>Transaction Details</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>
                  {fmtMonth(record.month)}
                </div>
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={16} color="white" />
            </button>
          </div>
        </div>

        <div style={{ padding: 24 }}>
          {/* Student row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', backgroundColor: T.s50, borderRadius: 10, marginBottom: 20, border: `1px solid ${T.s200}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Av src={student?.photo || student?.avatar} name={student?.username || record.studentId} size={40} />
              <div>
                <div style={{ fontWeight: 700, color: T.s800, fontSize: '0.92rem' }}>
                  {student ? `${student.firstName || ''} ${student.lastName || student.username}`.trim() : record.studentId}
                </div>
                <div style={{ fontSize: '0.72rem', color: T.s400, fontFamily: 'monospace' }}>{record.studentId}</div>
              </div>
            </div>
            <button onClick={() => onViewStudent(student || { studentId: record.studentId })}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: `1.5px solid ${T.s200}`, backgroundColor: T.white, color: T.blue, fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer' }}>
              <User size={12} /> View Profile
            </button>
          </div>

          {/* Details grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
            {[
              { label: 'Month', value: fmtMonth(record.month), icon: <Calendar size={14} color={T.blue} /> },
              { label: 'Status', value: (
                <span style={pill(record.status === 'Paid' ? '#F0FDF4' : '#FEF2F2', record.status === 'Paid' ? T.green : T.red)}>
                  {record.status === 'Paid' ? <CheckCircle size={10} /> : <AlertCircle size={10} />}
                  {record.status || 'Paid'}
                </span>
              ), icon: null },
              { label: 'Payment Method', value: method
                ? <span style={pill(method.bg, method.color)}>{method.icon}{method.label}</span>
                : <span style={{ color: T.s400, fontSize: '0.82rem' }}>—</span>,
                icon: <CreditCard size={14} color={T.violet} /> },
              { label: 'Approved By', value: record.approvedBy || '—', icon: <User size={14} color={T.green} /> },
              { label: 'Date Submitted', value: fmtDate(record.createdAt), icon: <Calendar size={14} color={T.amber} /> },
              { label: 'Reference', value: record._id ? record._id.toString().slice(-8).toUpperCase() : '—', icon: <FileText size={14} color={T.s400} /> },
            ].map(({ label, value, icon }) => (
              <div key={label} style={{ padding: '12px 14px', backgroundColor: T.s50, borderRadius: 10, border: `1px solid ${T.s100}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  {icon}
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: T.s400, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: T.s700 }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Proof of payment */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: T.s400, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
              Proof of Payment
            </div>
            {record.proofOfPaymentUrl ? (
              isImage ? (
                <div style={{ borderRadius: 10, overflow: 'hidden', border: `1px solid ${T.s200}` }}>
                  <img src={record.proofOfPaymentUrl} alt="Proof of payment"
                    style={{ width: '100%', maxHeight: 340, objectFit: 'contain', backgroundColor: T.s50, display: 'block' }} />
                  <div style={{ padding: '10px 14px', display: 'flex', justifyContent: 'flex-end', borderTop: `1px solid ${T.s100}` }}>
                    <a href={record.proofOfPaymentUrl} target="_blank" rel="noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 7, backgroundColor: T.blue, color: T.white, fontSize: '0.78rem', fontWeight: 600, textDecoration: 'none' }}>
                      <ExternalLink size={12} /> Open Full Size
                    </a>
                  </div>
                </div>
              ) : (
                <a href={record.proofOfPaymentUrl} target="_blank" rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', borderRadius: 10, border: `1.5px solid ${T.s200}`, backgroundColor: T.s50, textDecoration: 'none', color: T.s700 }}>
                  <FileText size={20} color={T.blue} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>View Document</div>
                    <div style={{ fontSize: '0.72rem', color: T.s400 }}>Click to open</div>
                  </div>
                  <ExternalLink size={14} color={T.s400} style={{ marginLeft: 'auto' }} />
                </a>
              )
            ) : (
              <div style={{ padding: '20px', borderRadius: 10, border: `1.5px dashed ${T.s300}`, textAlign: 'center', color: T.s400, fontSize: '0.84rem' }}>
                No proof of payment uploaded
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Student Payment History Page ── */
const StudentPaymentHistory = ({ student, onBack }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await fetch(`${API_URL}/get-rental-records/${student.studentId}`);
        const data = await res.json();
        setRecords(data);
      } catch {
        toast.error('Failed to load payment history');
      } finally {
        setLoading(false);
      }
    };
    fetch_();
  }, [student.studentId]);

  const totalPaid = records.filter(r => r.status === 'Paid').length;
  const displayName = student.firstName
    ? `${student.firstName} ${student.lastName || ''}`.trim()
    : student.username || student.studentId;

  return (
    <div style={{ backgroundColor: '#F0F7FF', minHeight: '100vh', padding: '24px 20px', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap'); @keyframes spin{to{transform:rotate(360deg);}}`}</style>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
        <Home size={15} color={T.blue} />
        <ChevronRight size={13} color={T.s400} />
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: T.blue, fontWeight: 600, fontSize: '0.84rem', cursor: 'pointer', padding: 0 }}>
          Payment Records
        </button>
        <ChevronRight size={13} color={T.s400} />
        <span style={{ fontWeight: 700, color: T.s800, fontSize: '0.84rem' }}>{displayName}</span>
      </div>

      {/* Student hero card */}
      <div style={{ ...card, padding: '24px 28px', marginBottom: 22, background: `linear-gradient(135deg, ${T.navy}, #1E3A8A)`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -30, top: -30, width: 160, height: 160, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.04)' }} />
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: '1.5px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.08)', color: 'white', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', marginBottom: 18 }}>
          <ArrowLeft size={14} /> Back
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Av src={student.photo || student.avatar} name={displayName} size={56} />
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'white' }}>{displayName}</div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)', marginTop: 3, fontFamily: 'monospace' }}>{student.studentId}</div>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              {student.dormHouse && <span style={pill('rgba(255,255,255,0.12)', 'rgba(255,255,255,0.8)')}>{student.dormHouse} · {student.dormNumber}</span>}
              <span style={pill(student.accountStatus ? '#F0FDF4' : '#FEF2F2', student.accountStatus ? T.green : T.red)}>
                {student.accountStatus ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'white' }}>{loading ? '…' : totalPaid}</div>
            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)' }}>Payments on record</div>
          </div>
        </div>
      </div>

      {/* Info strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 22 }}>
        {[
          { label: 'Total Records', val: loading ? '…' : records.length, color: T.blue, bg: '#EFF6FF' },
          { label: 'Paid', val: loading ? '…' : totalPaid, color: T.green, bg: '#F0FDF4' },
          { label: 'Latest Month', val: loading || !records.length ? '—' : fmtMonth(records[0]?.month), color: T.amber, bg: '#FFFBEB' },
        ].map((s, i) => (
          <div key={i} style={{ ...card, padding: '14px 18px' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: '0.74rem', color: T.s400, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Records list */}
      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${T.s100}`, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Receipt size={16} color={T.blue} />
          <span style={{ fontWeight: 700, color: T.s800, fontSize: '0.92rem' }}>Payment History</span>
        </div>

        {loading ? (
          <div style={{ padding: 48, textAlign: 'center', color: T.s400 }}>
            <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite', display: 'block', margin: '0 auto 10px' }} />
            <div style={{ fontSize: '0.84rem' }}>Loading records…</div>
          </div>
        ) : records.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: T.s400 }}>
            <Receipt size={28} style={{ display: 'block', margin: '0 auto 10px', opacity: 0.3 }} />
            <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>No payment records found</div>
          </div>
        ) : (
          <div>
            {records.map((rec, i) => {
              const method = METHOD_META[rec.paymentMethod] || null;
              return (
                <div key={rec._id || i}
                  onClick={() => setSelected(rec)}
                  style={{ padding: '14px 20px', borderBottom: i < records.length - 1 ? `1px solid ${T.s100}` : 'none', cursor: 'pointer', transition: 'background 0.12s', display: 'flex', alignItems: 'center', gap: 14 }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = T.s50}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = T.white}>

                  <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Receipt size={18} color={T.blue} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: T.s800, fontSize: '0.9rem' }}>{fmtMonth(rec.month)}</div>
                    <div style={{ fontSize: '0.75rem', color: T.s400, marginTop: 2 }}>Submitted {fmtDate(rec.createdAt)}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {method && <span style={pill(method.bg, method.color)}>{method.icon}{method.label}</span>}
                    <span style={pill(rec.status === 'Paid' ? '#F0FDF4' : '#FEF2F2', rec.status === 'Paid' ? T.green : T.red)}>
                      {rec.status || 'Paid'}
                    </span>
                    {rec.proofOfPaymentUrl && (
                      <div style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: T.s100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Eye size={13} color={T.s400} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selected && (
        <TransactionModal
          record={selected}
          student={student}
          onClose={() => setSelected(null)}
          onViewStudent={() => {}}
        />
      )}
    </div>
  );
};

/* ── Main Page ── */
const PaymentRecordsPage = () => {
  const [view, setView] = useState('main'); // 'main' | 'student'
  const [selectedStudentProfile, setSelectedStudentProfile] = useState(null);

  const [students, setStudents] = useState([]);
  const [allRecords, setAllRecords] = useState([]);
  const [studentMap, setStudentMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [filters, setFilters] = useState({
    search: '',
    method: '',
    month: '',
    status: '',
  });

  /* ── Fetch students + all rental records ── */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/get-students-with-housing`);
        const studs = await res.json();
        setStudents(studs);

        const map = {};
        studs.forEach(s => { map[s.studentId] = s; });
        setStudentMap(map);

        // Fetch rental records for all students in parallel (batched)
        const BATCH = 10;
        let records = [];
        for (let i = 0; i < studs.length; i += BATCH) {
          const batch = studs.slice(i, i + BATCH);
          const results = await Promise.allSettled(
            batch.map(s => fetch(`${API_URL}/get-rental-records/${s.studentId}`).then(r => r.json()))
          );
          results.forEach(r => {
            if (r.status === 'fulfilled' && Array.isArray(r.value)) {
              records = records.concat(r.value);
            }
          });
        }
        // Sort newest first
        records.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setAllRecords(records);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load payment data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFilterChange = useCallback((k, v) => setFilters(p => ({ ...p, [k]: v })), []);

  /* ── Stats ── */
  const stats = useMemo(() => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const thisMonth = allRecords.filter(r => r.month === currentMonth);
    const uniqueMonths = [...new Set(allRecords.map(r => r.month))];
    const byMethod = {};
    PAYMENT_METHODS.slice(1).forEach(m => {
      byMethod[m.value] = allRecords.filter(r => r.paymentMethod === m.value).length;
    });
    return {
      total: allRecords.length,
      thisMonth: thisMonth.length,
      paid: allRecords.filter(r => r.status === 'Paid').length,
      months: uniqueMonths.length,
      byMethod,
    };
  }, [allRecords]);

  /* ── Filtered records ── */
  const filteredRecords = useMemo(() => {
    const q = filters.search.toLowerCase();
    return allRecords.filter(r => {
      const student = studentMap[r.studentId];
      const name = student
        ? `${student.firstName || ''} ${student.lastName || ''} ${student.username || ''}`.toLowerCase()
        : '';
      const idMatch = (r.studentId || '').toLowerCase().includes(q);
      const matchSearch = !q || name.includes(q) || idMatch;
      const matchMethod = !filters.method || r.paymentMethod === filters.method;
      const matchMonth = !filters.month || r.month === filters.month;
      const matchStatus = !filters.status || r.status === filters.status;
      return matchSearch && matchMethod && matchMonth && matchStatus;
    });
  }, [allRecords, filters, studentMap]);

  /* ── Grouped by month for the month-column view ── */
  const groupedByMonth = useMemo(() => {
    const groups = {};
    filteredRecords.forEach(r => {
      if (!groups[r.month]) groups[r.month] = [];
      groups[r.month].push(r);
    });
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filteredRecords]);

  const availableMonths = useMemo(() => {
    return [...new Set(allRecords.map(r => r.month))].sort((a, b) => b.localeCompare(a));
  }, [allRecords]);

  /* ── Render student profile page ── */
  if (view === 'student' && selectedStudentProfile) {
    return (
      <StudentPaymentHistory
        student={selectedStudentProfile}
        onBack={() => { setView('main'); setSelectedStudentProfile(null); }}
      />
    );
  }

  const thStyle = {
    padding: '11px 14px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700,
    color: T.s400, letterSpacing: '0.06em', textTransform: 'uppercase',
    borderBottom: `2px solid ${T.s100}`, backgroundColor: T.s50, whiteSpace: 'nowrap',
  };

  const inputBase = {
    padding: '9px 12px', borderRadius: 8, border: `1.5px solid ${T.s200}`,
    fontSize: '0.84rem', color: T.s800, backgroundColor: T.white,
    outline: 'none', width: '100%', boxSizing: 'border-box',
  };

  return (
    <div style={{ backgroundColor: '#F0F7FF', minHeight: '100vh', padding: '24px 20px', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        .pr-sel:focus, .pr-inp:focus { border-color: #1D4ED8 !important; outline: none; box-shadow: 0 0 0 3px rgba(29,78,216,0.08); }
        .pr-row:hover td { background: #F8FAFC !important; }
      `}</style>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
        <Home size={15} color={T.blue} />
        <ChevronRight size={13} color={T.s400} />
        <span style={{ fontWeight: 700, color: T.s800, fontSize: '0.88rem' }}>Payment Records</span>
      </div>

      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${T.navy} 0%, #1E3A8A 60%, #1D4ED8 100%)`, borderRadius: 16, padding: '24px 28px', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -40, top: -50, width: 200, height: 200, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'absolute', right: 60, bottom: -80, width: 260, height: 260, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.03)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative' }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={24} color="white" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>Hostel Payment Records</h1>
            <p style={{ margin: '3px 0 0', fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)' }}>
              All student rent submissions — search, filter and verify transactions
            </p>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 13, marginBottom: 22 }}>
        {[
          { label: 'Total Records', val: stats.total, icon: <Receipt size={18} />, color: T.navy, bg: '#EFF6FF' },
          { label: 'This Month', val: stats.thisMonth, icon: <Calendar size={18} />, color: T.blue, bg: '#EFF6FF' },
          { label: 'Confirmed Paid', val: stats.paid, icon: <CheckCircle size={18} />, color: T.green, bg: '#F0FDF4' },
          { label: 'Bank EFT', val: stats.byMethod.bank_eft || 0, icon: <Banknote size={18} />, color: T.blue, bg: '#EFF6FF' },
          { label: 'EcoCash', val: stats.byMethod.ecocash || 0, icon: <Smartphone size={18} />, color: T.violet, bg: '#F5F3FF' },
        ].map((s, i) => (
          <div key={i} style={{ ...card, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, animation: `fadeIn 0.3s ease ${i * 0.06}s both` }}>
            <div style={{ width: 38, height: 38, borderRadius: 9, backgroundColor: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {React.cloneElement(s.icon, { color: s.color })}
            </div>
            <div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>{loading ? '…' : s.val}</div>
              <div style={{ fontSize: '0.7rem', color: T.s400, fontWeight: 500, marginTop: 2 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ ...card, padding: '16px 20px', marginBottom: 18 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 12 }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: T.s400, pointerEvents: 'none' }} />
            <input className="pr-inp" placeholder="Search student name or ID…"
              style={{ ...inputBase, paddingLeft: 36 }}
              value={filters.search}
              onChange={e => handleFilterChange('search', e.target.value)} />
          </div>

          {/* Payment method filter - styled buttons */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {PAYMENT_METHODS.map(m => (
              <button key={m.value} onClick={() => handleFilterChange('method', m.value === filters.method ? '' : m.value)}
                style={{
                  flex: 1, padding: '8px 4px', borderRadius: 8, cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700,
                  border: `1.5px solid ${filters.method === m.value ? T.blue : T.s200}`,
                  backgroundColor: filters.method === m.value ? '#EFF6FF' : T.white,
                  color: filters.method === m.value ? T.blue : T.s500,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, transition: 'all 0.12s',
                  whiteSpace: 'nowrap',
                }}>
                {React.cloneElement(m.icon, { color: filters.method === m.value ? T.blue : T.s400 })}
              </button>
            ))}
          </div>

          <select className="pr-sel" style={inputBase} value={filters.month} onChange={e => handleFilterChange('month', e.target.value)}>
            <option value="">All Months</option>
            {availableMonths.map(m => (
              <option key={m} value={m}>{fmtMonth(m)}</option>
            ))}
          </select>

          <select className="pr-sel" style={inputBase} value={filters.status} onChange={e => handleFilterChange('status', e.target.value)}>
            <option value="">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
          <span style={{ fontSize: '0.78rem', color: T.s400 }}>
            Showing <strong style={{ color: T.s700 }}>{filteredRecords.length}</strong> of {allRecords.length} records
          </span>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {/* Method filter label */}
            {filters.method && (
              <span style={pill('#EFF6FF', T.blue)}>
                {METHOD_META[filters.method]?.label}
                <X size={10} style={{ cursor: 'pointer', marginLeft: 2 }} onClick={() => handleFilterChange('method', '')} />
              </span>
            )}
            {Object.values(filters).some(v => v) && (
              <button onClick={() => setFilters({ search: '', method: '', month: '', status: '' })}
                style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 6, border: `1.5px solid ${T.s200}`, backgroundColor: T.white, color: T.s600, fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>
                <X size={12} /> Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Records table */}
      <div style={{ ...card, overflowX: 'auto' }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center', color: T.s400 }}>
            <RefreshCw size={26} style={{ animation: 'spin 1s linear infinite', display: 'block', margin: '0 auto 12px' }} />
            <div style={{ fontSize: '0.88rem' }}>Fetching all payment records…</div>
            <div style={{ fontSize: '0.76rem', color: T.s300, marginTop: 4 }}>This may take a moment</div>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', color: T.s400 }}>
            <Receipt size={30} style={{ display: 'block', margin: '0 auto 10px', opacity: 0.25 }} />
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>No payment records match your filters</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Student', 'Student ID', 'Month', 'Method', 'Status', 'Submitted', 'Proof', 'Actions'].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((rec, i) => {
                const student = studentMap[rec.studentId];
                const displayName = student?.firstName
                  ? `${student.firstName} ${student.lastName || ''}`.trim()
                  : student?.username || rec.studentId;
                const method = METHOD_META[rec.paymentMethod] || null;
                const tdBase = { padding: '12px 14px', borderBottom: `1px solid ${T.s100}`, backgroundColor: T.white, transition: 'background 0.1s' };

                return (
                  <tr key={rec._id || i} className="pr-row">
                    <td style={tdBase}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Av src={student?.photo || student?.avatar} name={displayName} size={34} />
                        <div>
                          <div style={{ fontWeight: 600, color: T.s800, fontSize: '0.86rem' }}>{displayName}</div>
                          {student?.dormHouse && (
                            <div style={{ fontSize: '0.7rem', color: T.s400 }}>{student.dormHouse} · {student.dormNumber}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={tdBase}>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.79rem', color: T.s600, backgroundColor: T.s100, padding: '3px 7px', borderRadius: 5 }}>
                        {rec.studentId}
                      </span>
                    </td>
                    <td style={tdBase}>
                      <div style={{ fontWeight: 600, color: T.s700, fontSize: '0.84rem' }}>{fmtMonth(rec.month)}</div>
                    </td>
                    <td style={tdBase}>
                      {method
                        ? <span style={pill(method.bg, method.color)}>{method.icon}{method.label}</span>
                        : <span style={{ color: T.s300, fontSize: '0.8rem' }}>—</span>}
                    </td>
                    <td style={tdBase}>
                      <span style={pill(rec.status === 'Paid' ? '#F0FDF4' : '#FEF3C7', rec.status === 'Paid' ? T.green : T.amber)}>
                        {rec.status === 'Paid' ? <CheckCircle size={9} /> : <Clock size={9} />}
                        {rec.status || 'Paid'}
                      </span>
                    </td>
                    <td style={tdBase}>
                      <div style={{ fontSize: '0.79rem', color: T.s500 }}>{fmtDate(rec.createdAt)}</div>
                    </td>
                    <td style={tdBase}>
                      {rec.proofOfPaymentUrl ? (
                        <div style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <CheckCircle size={14} color={T.green} />
                        </div>
                      ) : (
                        <div style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: T.s100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <AlertCircle size={14} color={T.s300} />
                        </div>
                      )}
                    </td>
                    <td style={tdBase}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => setSelectedRecord(rec)}
                          title="View transaction"
                          style={{ width: 30, height: 30, borderRadius: 7, border: `1.5px solid ${T.s200}`, backgroundColor: T.white, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.12s' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = T.blue; e.currentTarget.style.backgroundColor = '#EFF6FF'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = T.s200; e.currentTarget.style.backgroundColor = T.white; }}>
                          <Eye size={13} color={T.blue} />
                        </button>
                        {student && (
                          <button onClick={() => { setSelectedStudentProfile(student); setView('student'); }}
                            title="View student history"
                            style={{ width: 30, height: 30, borderRadius: 7, border: `1.5px solid ${T.s200}`, backgroundColor: T.white, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.12s' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = T.violet; e.currentTarget.style.backgroundColor = '#F5F3FF'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = T.s200; e.currentTarget.style.backgroundColor = T.white; }}>
                            <User size={13} color={T.violet} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Transaction modal */}
      {selectedRecord && (
        <TransactionModal
          record={selectedRecord}
          student={studentMap[selectedRecord.studentId]}
          onClose={() => setSelectedRecord(null)}
          onViewStudent={(student) => {
            setSelectedRecord(null);
            setSelectedStudentProfile(student);
            setView('student');
          }}
        />
      )}

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick />
    </div>
  );
};

export default PaymentRecordsPage;