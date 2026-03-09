import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Home, ChevronRight, ArrowLeft, BedDouble, Users, Wrench,
  BookOpen, Droplets, Package, CheckCircle2, AlertTriangle,
  Calendar, Clock, User, ClipboardList, RefreshCw, Edit3,
  Save, X, History, ShieldCheck, Building2, Hash
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_URL from '../config';

/* ── Design tokens (matches existing app palette) ── */
const T = {
  navy:   '#0F172A',
  blue:   '#1D4ED8',
  blueL:  '#3B82F6',
  green:  '#059669',
  amber:  '#D97706',
  red:    '#DC2626',
  slate50:  '#F8FAFC',
  slate100: '#F1F5F9',
  slate200: '#E2E8F0',
  slate300: '#CBD5E1',
  slate400: '#94A3B8',
  slate500: '#64748B',
  slate600: '#475569',
  slate700: '#334155',
  slate800: '#1E293B',
  white:  '#FFFFFF',
};

const card = {
  backgroundColor: T.white,
  borderRadius: 14,
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
  border: `1px solid ${T.slate200}`,
};

const pill = (bg, fg) => ({
  display: 'inline-flex', alignItems: 'center', gap: 4,
  backgroundColor: bg, color: fg,
  padding: '3px 10px', borderRadius: 99,
  fontSize: '0.69rem', fontWeight: 700,
  letterSpacing: '0.05em', textTransform: 'uppercase',
  whiteSpace: 'nowrap',
});

const fmtDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
};

const fmtDateTime = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

/* ── Avatar ── */
const Av = ({ src, name, size = 38 }) => {
  const init = (name || '?').split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
  const palette = ['#1D4ED8','#059669','#D97706','#7C3AED','#0891B2','#DC2626'];
  const bg = palette[(name?.charCodeAt(0) || 0) % palette.length];
  return src
    ? <img src={src} alt={name} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
    : <div style={{ width: size, height: size, borderRadius: '50%', backgroundColor: bg, color: T.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.33, fontWeight: 700, flexShrink: 0 }}>{init}</div>;
};

/* ── Inventory item icons ── */
const ITEM_META = {
  wardrobe:   { label: 'Wardrobe',    icon: Package,  color: T.blue   },
  book_shelf: { label: 'Book Shelf',  icon: BookOpen, color: '#7C3AED' },
  sink:       { label: 'Sink',        icon: Droplets, color: T.blueL  },
};

/* ── Edit Inventory Modal ── */
const EditInventoryModal = ({ roomNumber, inventory, onClose, onSaved }) => {
  const [form, setForm] = useState({
    wardrobe:   inventory?.wardrobe?.status   || 'normal',
    book_shelf: inventory?.book_shelf?.status || 'normal',
    sink:       inventory?.sink?.status       || 'normal',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(form).map(([item, status]) =>
        fetch(`${API_URL}/update-room-inventory-item`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomNumber, item, status }),
        })
      );
      const results = await Promise.all(updates);
      const failed = results.filter(r => !r.ok);
      if (failed.length) throw new Error('Some updates failed');
      toast.success('Inventory updated successfully');
      onSaved(form);
      onClose();
    } catch {
      toast.error('Failed to update inventory');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)', padding: 16 }}
      onClick={onClose}>
      <div style={{ ...card, width: '100%', maxWidth: 440, padding: 28 }} onClick={e => e.stopPropagation()}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Edit3 size={18} color={T.blue} />
          </div>
          <div>
            <div style={{ fontWeight: 800, color: T.navy, fontSize: '1rem' }}>Edit Inventory</div>
            <div style={{ fontSize: '0.75rem', color: T.slate400 }}>Room {roomNumber.toUpperCase()}</div>
          </div>
          <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: T.slate400 }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {Object.entries(ITEM_META).map(([key, meta]) => {
            const Icon = meta.icon;
            const isDamaged = form[key] === 'damaged';
            return (
              <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: 10, border: `1.5px solid ${isDamaged ? '#FEE2E2' : T.slate200}`, backgroundColor: isDamaged ? '#FFF5F5' : T.slate50 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 8, backgroundColor: isDamaged ? '#FEE2E2' : '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={16} color={isDamaged ? T.red : meta.color} />
                  </div>
                  <span style={{ fontWeight: 600, color: T.slate800, fontSize: '0.88rem' }}>{meta.label}</span>
                </div>
                {/* Toggle */}
                <div style={{ display: 'flex', gap: 6 }}>
                  {['normal', 'damaged'].map(s => (
                    <button key={s} onClick={() => setForm(p => ({ ...p, [key]: s }))}
                      style={{
                        padding: '6px 14px', borderRadius: 7, fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
                        border: `1.5px solid ${form[key] === s ? (s === 'normal' ? T.green : T.red) : T.slate200}`,
                        backgroundColor: form[key] === s ? (s === 'normal' ? '#F0FDF4' : '#FEF2F2') : T.white,
                        color: form[key] === s ? (s === 'normal' ? T.green : T.red) : T.slate400,
                        textTransform: 'capitalize', transition: 'all 0.12s',
                      }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '9px 20px', borderRadius: 8, border: `1.5px solid ${T.slate200}`, backgroundColor: T.white, color: T.slate600, fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving} style={{ padding: '9px 20px', borderRadius: 8, border: 'none', backgroundColor: T.blue, color: T.white, fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 7, opacity: saving ? 0.7 : 1 }}>
            {saving ? <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={14} />}
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Section header ── */
const SectionHeader = ({ icon: Icon, title, color = T.blue, action }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 20px', borderBottom: `1px solid ${T.slate100}` }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
      <Icon size={17} color={color} />
      <span style={{ fontWeight: 700, color: T.slate800, fontSize: '0.92rem' }}>{title}</span>
    </div>
    {action}
  </div>
);

/* ── Action badge for history ── */
const ActionBadge = ({ action }) => {
  const map = {
    assigned: { bg: '#F0FDF4', fg: T.green, label: 'Assigned' },
    moved:    { bg: '#EFF6FF', fg: T.blue,  label: 'Moved In' },
    deactivated: { bg: '#FEF2F2', fg: T.red, label: 'Moved Out' },
  };
  const m = map[action] || { bg: T.slate100, fg: T.slate500, label: action };
  return <span style={pill(m.bg, m.fg)}>{m.label}</span>;
};

/* ════════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════════ */
const RoomPage = () => {
  const { roomNumber } = useParams(); // e.g. "a04"
  const navigate = useNavigate();

  // Derive uppercase version for routes that need it
  const roomUpper = roomNumber?.toUpperCase(); // "A04"
  const roomLower = roomNumber?.toLowerCase(); // "a04"

  // Derive house from prefix
  const houseName = roomLower?.startsWith('a') ? 'Adlam House' : 'Nurse Home';

  const [loading, setLoading] = useState(true);
  const [inventory, setInventory]   = useState(null);
  const [housing, setHousing]       = useState(null);
  const [faults, setFaults]         = useState([]);
  const [roomHistory, setRoomHistory] = useState([]);
  const [editOpen, setEditOpen]     = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [invRes, housingRes, faultRes, historyRes] = await Promise.allSettled([
        fetch(`${API_URL}/get-room-inventory/${roomLower}`),
        fetch(`${API_URL}/get-room-housing/${roomUpper}`),
        fetch(`${API_URL}/get-room-faults/${encodeURIComponent(houseName)}/${roomUpper}`),
        fetch(`${API_URL}/get-room-history/${roomUpper}`),
      ]);

      if (invRes.status === 'fulfilled') {
        const d = await invRes.value.json();
        if (!invRes.value.ok) throw new Error(d.message);
        setInventory(d);
      }
      if (housingRes.status === 'fulfilled' && housingRes.value.ok) {
        setHousing(await housingRes.value.json());
      }
      if (faultRes.status === 'fulfilled' && faultRes.value.ok) {
        setFaults(await faultRes.value.json());
      }
      if (historyRes.status === 'fulfilled' && historyRes.value.ok) {
        setRoomHistory(await historyRes.value.json());
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load room data');
    } finally {
      setLoading(false);
    }
  }, [roomLower, roomUpper, houseName]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleInventorySaved = (updatedForm) => {
    setInventory(prev => ({
      ...prev,
      inventory: {
        wardrobe:   { ...prev.inventory?.wardrobe,   status: updatedForm.wardrobe,   lastUpdated: new Date() },
        book_shelf: { ...prev.inventory?.book_shelf, status: updatedForm.book_shelf, lastUpdated: new Date() },
        sink:       { ...prev.inventory?.sink,       status: updatedForm.sink,       lastUpdated: new Date() },
      }
    }));
  };

  /* ── Derived stats ── */
  const occupancy  = housing?.residents?.length || 0;
  const capacity   = 2;
  const invItems   = inventory?.inventory || {};
  const damagedCount = Object.values(invItems).filter(v => v.status === 'damaged').length;
  const openFaults   = faults.filter(f => f.status === 'Pending' || f.status === 'In Progress').length;

  if (loading) {
    return (
      <div style={{ backgroundColor: '#F0F7FF', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap'); @keyframes spin{to{transform:rotate(360deg);}}`}</style>
        <div style={{ textAlign: 'center', color: T.slate400 }}>
          <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite', display: 'block', margin: '0 auto 12px' }} />
          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Loading room {roomUpper}…</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#F0F7FF', minHeight: '100vh', padding: '24px 20px', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      {/* ── Breadcrumb ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
        <Home size={15} color={T.blue} />
        <ChevronRight size={13} color={T.slate400} />
        <span style={{ color: T.blue, fontWeight: 600, fontSize: '0.84rem', cursor: 'pointer' }} onClick={() => navigate(-1)}>Rooms</span>
        <ChevronRight size={13} color={T.slate400} />
        <span style={{ fontWeight: 700, color: T.slate800, fontSize: '0.84rem' }}>Room {roomUpper}</span>
      </div>

      {/* ── Hero banner ── */}
      <div style={{
        background: `linear-gradient(135deg, ${T.navy} 0%, #1E3A8A 55%, #1D4ED8 100%)`,
        borderRadius: 16, padding: '26px 28px', marginBottom: 24,
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', right: -50, top: -50, width: 220, height: 220, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'absolute', right: 80, bottom: -80, width: 280, height: 280, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.03)' }} />

        <button onClick={() => navigate(-1)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8, border: '1.5px solid rgba(255,255,255,0.18)', backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.85)', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', marginBottom: 18, width: 'fit-content' }}>
          <ArrowLeft size={13} /> Back
        </button>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            {/* Big room number badge */}
            <div style={{ width: 72, height: 72, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.15)', flexShrink: 0 }}>
              <span style={{ fontWeight: 900, fontSize: '1.6rem', color: T.white, letterSpacing: '-0.03em', fontFamily: 'monospace' }}>
                {roomUpper}
              </span>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.5rem', color: T.white, letterSpacing: '-0.02em' }}>
                Room {roomUpper}
              </div>
              <div style={{ fontSize: '0.84rem', color: 'rgba(255,255,255,0.6)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Building2 size={13} />
                {houseName}
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                <span style={pill(
                  occupancy === 0 ? '#F0FDF4' : occupancy >= capacity ? '#FEF2F2' : '#FEF3C7',
                  occupancy === 0 ? T.green : occupancy >= capacity ? T.red : T.amber
                )}>
                  <Users size={9} /> {occupancy}/{capacity} Occupied
                </span>
                {damagedCount > 0 && (
                  <span style={pill('#FEF2F2', T.red)}>
                    <AlertTriangle size={9} /> {damagedCount} Item{damagedCount > 1 ? 's' : ''} Damaged
                  </span>
                )}
                {openFaults > 0 && (
                  <span style={pill('#FEF3C7', T.amber)}>
                    <Wrench size={9} /> {openFaults} Open Fault{openFaults > 1 ? 's' : ''}
                  </span>
                )}
                {damagedCount === 0 && openFaults === 0 && (
                  <span style={pill('#F0FDF4', T.green)}>
                    <ShieldCheck size={9} /> All Clear
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick stats on the right */}
          <div style={{ display: 'flex', gap: 16 }}>
            {[
              { label: 'Fault Reports', val: faults.length, color: 'rgba(255,255,255,0.8)' },
              { label: 'History Events', val: roomHistory.length, color: 'rgba(255,255,255,0.8)' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: T.white, lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          Main 2-column grid
      ══════════════════════════════════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>

        {/* ── LEFT COLUMN ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* CURRENT OCCUPANTS */}
          <div style={{ ...card, overflow: 'hidden', animation: 'fadeUp 0.3s ease 0.05s both' }}>
            <SectionHeader icon={Users} title="Current Occupants" color={T.blue} />
            <div style={{ padding: '4px 0' }}>
              {!housing || housing.residentDetails?.length === 0 ? (
                <div style={{ padding: '32px 20px', textAlign: 'center', color: T.slate300 }}>
                  <BedDouble size={28} style={{ display: 'block', margin: '0 auto 8px', opacity: 0.4 }} />
                  <div style={{ fontSize: '0.84rem', fontWeight: 600 }}>Room is unoccupied</div>
                </div>
              ) : (
                housing.residentDetails.map((resident, i) => {
                  const name = resident.firstName
                    ? `${resident.firstName} ${resident.lastName || ''}`.trim()
                    : resident.username;
                  return (
                    <div key={i}
                      onClick={() => navigate(`/student-profile/${resident.studentId}`)}
                      style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderBottom: i < housing.residentDetails.length - 1 ? `1px solid ${T.slate100}` : 'none', cursor: 'pointer', transition: 'background 0.12s' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = T.slate50}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = T.white}>
                      <Av src={resident.photo || resident.avatar} name={name} size={44} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: T.slate800, fontSize: '0.9rem' }}>{name}</div>
                        <div style={{ fontSize: '0.74rem', color: T.slate400, fontFamily: 'monospace', marginTop: 1 }}>{resident.studentId}</div>
                        <div style={{ fontSize: '0.73rem', color: T.slate500, marginTop: 3 }}>{resident.email}</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                        <span style={pill('#F0FDF4', T.green)}>Active</span>
                        <span style={{ fontSize: '0.7rem', color: T.slate400 }}>{resident.gender}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ROOM INVENTORY */}
          <div style={{ ...card, overflow: 'hidden', animation: 'fadeUp 0.3s ease 0.1s both' }}>
            <SectionHeader
              icon={Package}
              title="Room Inventory"
              color="#7C3AED"
              action={
                <button onClick={() => setEditOpen(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 14px', borderRadius: 8, border: `1.5px solid ${T.slate200}`, backgroundColor: T.white, color: T.blue, fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer' }}>
                  <Edit3 size={12} /> Update
                </button>
              }
            />

            {!inventory ? (
              <div style={{ padding: '32px 20px', textAlign: 'center', color: T.slate300 }}>
                <Package size={28} style={{ display: 'block', margin: '0 auto 8px', opacity: 0.4 }} />
                <div style={{ fontSize: '0.84rem' }}>No inventory data found</div>
              </div>
            ) : (
              <div style={{ padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {Object.entries(ITEM_META).map(([key, meta]) => {
                  const Icon = meta.icon;
                  const item = invItems[key];
                  const isDamaged = item?.status === 'damaged';
                  return (
                    <div key={key} style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '13px 16px', borderRadius: 10,
                      border: `1.5px solid ${isDamaged ? '#FEE2E2' : T.slate100}`,
                      backgroundColor: isDamaged ? '#FFF8F8' : T.slate50,
                      transition: 'all 0.15s',
                    }}>
                      <div style={{ width: 38, height: 38, borderRadius: 9, backgroundColor: isDamaged ? '#FEE2E2' : '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={17} color={isDamaged ? T.red : meta.color} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: T.slate800, fontSize: '0.88rem' }}>{meta.label}</div>
                        <div style={{ fontSize: '0.71rem', color: T.slate400, marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Clock size={10} />
                          Updated {fmtDate(item?.lastUpdated)}
                        </div>
                      </div>
                      <span style={pill(isDamaged ? '#FEF2F2' : '#F0FDF4', isDamaged ? T.red : T.green)}>
                        {isDamaged ? <AlertTriangle size={9} /> : <CheckCircle2 size={9} />}
                        {isDamaged ? 'Damaged' : 'Normal'}
                      </span>
                    </div>
                  );
                })}

                <div style={{ marginTop: 4, padding: '10px 12px', borderRadius: 8, backgroundColor: T.slate50, border: `1px solid ${T.slate200}`, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Clock size={12} color={T.slate400} />
                  <span style={{ fontSize: '0.72rem', color: T.slate400 }}>
                    Inventory last seeded: {fmtDate(inventory?.createdAt)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* FAULT REPORTS */}
          <div style={{ ...card, overflow: 'hidden', animation: 'fadeUp 0.3s ease 0.15s both' }}>
            <SectionHeader icon={Wrench} title={`Fault Reports (${faults.length})`} color={T.amber} />
            <div>
              {faults.length === 0 ? (
                <div style={{ padding: '32px 20px', textAlign: 'center', color: T.slate300 }}>
                  <CheckCircle2 size={28} style={{ display: 'block', margin: '0 auto 8px', color: T.green, opacity: 0.5 }} />
                  <div style={{ fontSize: '0.84rem', fontWeight: 600 }}>No fault reports for this room</div>
                </div>
              ) : (
                faults.map((fault, i) => {
                  const statusMeta = {
                    Pending:     { bg: '#FEF3C7', fg: T.amber },
                    'In Progress': { bg: '#EFF6FF', fg: T.blue },
                    Fixed:       { bg: '#F0FDF4', fg: T.green },
                    Closed:      { bg: T.slate100, fg: T.slate500 },
                  };
                  const sm = statusMeta[fault.status] || { bg: T.slate100, fg: T.slate500 };
                  return (
                    <div key={i} style={{ padding: '14px 20px', borderBottom: i < faults.length - 1 ? `1px solid ${T.slate100}` : 'none' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <span style={{ fontWeight: 700, color: T.slate800, fontSize: '0.88rem' }}>{fault.item}</span>
                            <span style={pill(sm.bg, sm.fg)}>{fault.status}</span>
                          </div>
                          <div style={{ fontSize: '0.78rem', color: T.slate500, lineHeight: 1.5 }}>
                            {fault.details || 'No details provided'}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6 }}>
                            <span style={{ fontSize: '0.71rem', color: T.slate400, display: 'flex', alignItems: 'center', gap: 3 }}>
                              <Calendar size={10} /> {fmtDate(fault.discoveryDate)}
                            </span>
                            <span style={{ fontSize: '0.71rem', color: T.slate400, display: 'flex', alignItems: 'center', gap: 3 }}>
                              <User size={10} /> {fault.reportedBy}
                            </span>
                          </div>
                        </div>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.68rem', color: T.slate400, backgroundColor: T.slate100, padding: '2px 6px', borderRadius: 4, flexShrink: 0 }}>
                          {fault.faultReportId}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ROOM HISTORY */}
          <div style={{ ...card, overflow: 'hidden', animation: 'fadeUp 0.3s ease 0.2s both' }}>
            <SectionHeader icon={History} title={`Occupancy History (${roomHistory.length})`} color={T.blueL} />
            <div style={{ maxHeight: 380, overflowY: 'auto' }}>
              {roomHistory.length === 0 ? (
                <div style={{ padding: '32px 20px', textAlign: 'center', color: T.slate300 }}>
                  <ClipboardList size={28} style={{ display: 'block', margin: '0 auto 8px', opacity: 0.4 }} />
                  <div style={{ fontSize: '0.84rem', fontWeight: 600 }}>No history records yet</div>
                </div>
              ) : (
                <div style={{ padding: '8px 0' }}>
                  {roomHistory.map((record, i) => {
                    // Determine if student was moved in or out of THIS room
                    const isThisRoomDestination = record.roomNumber === roomUpper || record.newRoom === roomUpper;
                    return (
                      <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 20px', borderBottom: i < roomHistory.length - 1 ? `1px solid ${T.slate100}` : 'none' }}>
                        {/* Timeline dot */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, flexShrink: 0 }}>
                          <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: isThisRoomDestination ? T.green : T.red, marginTop: 3, flexShrink: 0 }} />
                          {i < roomHistory.length - 1 && <div style={{ width: 2, flex: 1, backgroundColor: T.slate100, marginTop: 4 }} />}
                        </div>
                        <div style={{ flex: 1, paddingBottom: 4 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                            <span style={{ fontFamily: 'monospace', fontWeight: 700, color: T.slate800, fontSize: '0.84rem' }}>{record.studentId}</span>
                            <ActionBadge action={record.action} />
                          </div>
                          <div style={{ fontSize: '0.75rem', color: T.slate500, lineHeight: 1.5 }}>{record.description}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 4 }}>
                            <Clock size={10} color={T.slate300} />
                            <span style={{ fontSize: '0.7rem', color: T.slate400 }}>{fmtDateTime(record.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* ── Edit Inventory Modal ── */}
      {editOpen && (
        <EditInventoryModal
          roomNumber={roomLower}
          inventory={invItems}
          onClose={() => setEditOpen(false)}
          onSaved={handleInventorySaved}
        />
      )}

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick />
    </div>
  );
};

export default RoomPage;