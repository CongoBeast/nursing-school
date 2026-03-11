import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  QrCode, Barcode, X, RefreshCw, CheckCircle2, AlertTriangle,
  Package, BedDouble, Armchair, Monitor, Building2, Hash,
  ChevronRight, Home, Save, Edit3, Layers, ScanLine,
  ArrowRight, Wrench, ShieldAlert, HelpCircle, Clock,
  User, Keyboard, Camera
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_URL from '../config';

/* ── Design tokens ─────────────────────────────────────────────── */
const T = {
  navy:     '#0F172A',
  blue:     '#1D4ED8',
  blueL:    '#3B82F6',
  green:    '#059669',
  amber:    '#D97706',
  red:      '#DC2626',
  violet:   '#7C3AED',
  slate50:  '#F8FAFC',
  slate100: '#F1F5F9',
  slate200: '#E2E8F0',
  slate300: '#CBD5E1',
  slate400: '#94A3B8',
  slate500: '#64748B',
  slate600: '#475569',
  slate700: '#334155',
  slate800: '#1E293B',
  white:    '#FFFFFF',
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
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

/* ── Item metadata ─────────────────────────────────────────────── */
const ITEM_ICONS = {
  desk:  Monitor,
  chair: Armchair,
  bed:   BedDouble,
};

const STATUS_META = {
  normal:       { label: 'Normal',       bg: '#F0FDF4', fg: T.green,  icon: CheckCircle2  },
  damaged:      { label: 'Damaged',      bg: '#FEF2F2', fg: T.red,    icon: AlertTriangle },
  missing:      { label: 'Missing',      bg: '#FFF7ED', fg: T.amber,  icon: HelpCircle    },
  under_repair: { label: 'Under Repair', bg: '#EFF6FF', fg: T.blue,   icon: Wrench        },
};

/* ── QR Scanner using jsQR via camera ─────────────────────────── */
const QRScanner = ({ onResult, onClose }) => {
  const videoRef  = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef    = useRef(null);
  const [error, setError]   = useState(null);
  const [active, setActive] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) return;

      // Detach any previous source before assigning the new stream
      video.srcObject = null;
      video.srcObject = stream;

      // Wait for metadata before calling play() — prevents
      // "play() interrupted by new load request" browser error
      await new Promise((resolve) => {
        video.onloadedmetadata = () => resolve();
      });

      try {
        await video.play();
        setActive(true);
      } catch (playErr) {
        // AbortError is harmless if component unmounted before play finished
        if (playErr.name !== 'AbortError') throw playErr;
      }
    } catch {
      setError('Camera access denied. Please allow camera permissions.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setActive(false);
  }, []);

  // Load jsQR dynamically
  useEffect(() => {
    let jsQR;
    let cancelled = false;
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jsQR/1.4.0/jsQR.min.js';
    script.onload = () => { if (!cancelled) jsQR = window.jsQR; };
    document.head.appendChild(script);

    startCamera();

    const tick = () => {
      const video  = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || !jsQR) { rafRef.current = requestAnimationFrame(tick); return; }
      if (video.readyState !== video.HAVE_ENOUGH_DATA) { rafRef.current = requestAnimationFrame(tick); return; }

      canvas.width  = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      const img  = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(img.data, img.width, img.height, { inversionAttempts: 'dontInvert' });
      if (code?.data) { stopCamera(); onResult(code.data); return; }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      stopCamera();
      try { document.head.removeChild(script); } catch {}
    };
  }, [startCamera, stopCamera, onResult]);

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(6px)', padding: 16 }}>
      <div style={{ ...card, width: '100%', maxWidth: 480, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ background: `linear-gradient(135deg, ${T.navy}, #1E3A8A)`, padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <QrCode size={20} color={T.white} />
            <span style={{ fontWeight: 800, color: T.white, fontSize: '1rem' }}>QR Code Scanner</span>
          </div>
          <button onClick={() => { stopCamera(); onClose(); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', padding: 4 }}><X size={20} /></button>
        </div>

        {/* Camera view */}
        <div style={{ position: 'relative', backgroundColor: '#000', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <video ref={videoRef} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted playsInline />
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {/* Scanning overlay */}
          {active && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 220, height: 220, position: 'relative' }}>
                {/* Corner brackets */}
                {[{t:0,l:0},{t:0,r:0},{b:0,l:0},{b:0,r:0}].map((pos, i) => (
                  <div key={i} style={{
                    position: 'absolute', width: 30, height: 30,
                    borderColor: T.blueL, borderStyle: 'solid', borderWidth: 0,
                    ...(pos.t !== undefined ? { top: 0, borderTopWidth: 3 } : { bottom: 0, borderBottomWidth: 3 }),
                    ...(pos.l !== undefined ? { left: 0, borderLeftWidth: 3 } : { right: 0, borderRightWidth: 3 }),
                  }} />
                ))}
                {/* Scan line */}
                <div style={{
                  position: 'absolute', left: 0, right: 0, height: 2,
                  backgroundColor: T.blueL, opacity: 0.8,
                  animation: 'scanLine 2s ease-in-out infinite',
                  boxShadow: `0 0 8px ${T.blueL}`,
                }} />
              </div>
            </div>
          )}

          {error && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.7)', padding: 24 }}>
              <div style={{ textAlign: 'center', color: T.white }}>
                <Camera size={36} style={{ display: 'block', margin: '0 auto 12px', opacity: 0.5 }} />
                <div style={{ fontSize: '0.85rem', lineHeight: 1.5 }}>{error}</div>
              </div>
            </div>
          )}
        </div>

        <div style={{ padding: '14px 20px', textAlign: 'center', backgroundColor: T.slate50 }}>
          <div style={{ fontSize: '0.8rem', color: T.slate500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <ScanLine size={14} color={T.blueL} />
            Point the camera at a QR code — it will be detected automatically
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Barcode camera scanner using QuaggaJS ────────────────────── */
const BarcodeScanner = ({ onResult, onClose }) => {
  const scannerRef  = useRef(null);
  const [error, setError]     = useState(null);
  const [detected, setDetected] = useState(null); // last detected code for visual feedback
  const [tab, setTab]         = useState('camera'); // 'camera' | 'manual'
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const quaggaRef = useRef(null);
  const lastResult = useRef(null);
  const resultCount = useRef({});

  useEffect(() => {
    if (tab !== 'camera') return;

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/quagga/0.12.1/quagga.min.js';
    script.onload = () => {
      quaggaRef.current = window.Quagga;
      window.Quagga.init({
        inputStream: {
          name: 'Live',
          type: 'LiveStream',
          target: scannerRef.current,
          constraints: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        },
        decoder: {
          // CODE_128 handles uppercase letters + digits — matches our barcode format
          readers: ['code_128_reader', 'code_39_reader'],
          multiple: false,
        },
        locate: true,
        frequency: 10,
      }, (err) => {
        if (err) {
          setError('Camera access denied or not available.');
          return;
        }
        window.Quagga.start();
      });

      // Debounce: require the same code 3 times in a row before accepting
      window.Quagga.onDetected((result) => {
        const code = result.codeResult?.code?.toUpperCase();
        if (!code || code.length !== 13) return;

        resultCount.current[code] = (resultCount.current[code] || 0) + 1;
        setDetected(code);

        if (resultCount.current[code] >= 3) {
          window.Quagga.stop();
          onResult(code);
        }
      });
    };
    script.onerror = () => setError('Failed to load barcode library.');
    document.head.appendChild(script);

    return () => {
      try { window.Quagga?.stop(); } catch {}
      try { document.head.removeChild(script); } catch {}
    };
  }, [tab, onResult]);

  // Manual tab — focus input, USB scanners auto-fill
  useEffect(() => {
    if (tab === 'manual') inputRef.current?.focus();
  }, [tab]);

  const handleManualSubmit = async () => {
    const code = input.trim().toUpperCase();
    if (code.length !== 13) return;
    setLoading(true);
    await onResult(code);
    setLoading(false);
    setInput('');
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(6px)', padding: 16 }}>
      <div style={{ ...card, width: '100%', maxWidth: 480, overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ background: `linear-gradient(135deg, ${T.navy}, #1E3A8A)`, padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Barcode size={20} color={T.white} />
            <span style={{ fontWeight: 800, color: T.white, fontSize: '1rem' }}>Barcode Scanner</span>
          </div>
          <button onClick={() => { try { window.Quagga?.stop(); } catch {} onClose(); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${T.slate100}` }}>
          {[
            { key: 'camera', label: 'Camera', icon: Camera },
            { key: 'manual', label: 'Manual / USB', icon: Keyboard },
          ].map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setTab(key)}
              style={{
                flex: 1, padding: '12px 0', border: 'none', cursor: 'pointer',
                backgroundColor: tab === key ? T.white : T.slate50,
                color: tab === key ? T.blue : T.slate400,
                fontWeight: tab === key ? 700 : 500,
                fontSize: '0.82rem',
                borderBottom: tab === key ? `2.5px solid ${T.blue}` : '2.5px solid transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                transition: 'all 0.15s',
              }}>
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {/* Camera tab */}
        {tab === 'camera' && (
          <>
            <div style={{ position: 'relative', backgroundColor: '#000', aspectRatio: '4/3', overflow: 'hidden' }}>
              {/* Quagga mounts its own video+canvas here */}
              <div ref={scannerRef} style={{ width: '100%', height: '100%' }} />

              {/* Targeting overlay — wide rectangle for 1D barcodes */}
              {!error && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                  <div style={{ width: '80%', height: 80, position: 'relative' }}>
                    {/* Long horizontal brackets */}
                    {[
                      { top: 0, left: 0, borderTop: 3, borderLeft: 3 },
                      { top: 0, right: 0, borderTop: 3, borderRight: 3 },
                      { bottom: 0, left: 0, borderBottom: 3, borderLeft: 3 },
                      { bottom: 0, right: 0, borderBottom: 3, borderRight: 3 },
                    ].map((s, i) => (
                      <div key={i} style={{
                        position: 'absolute', width: 24, height: 24,
                        borderColor: detected ? T.green : T.violet,
                        borderStyle: 'solid', borderWidth: 0,
                        ...(s.top    !== undefined ? { top:    s.top,    borderTopWidth:    s.borderTop    } : {}),
                        ...(s.bottom !== undefined ? { bottom: s.bottom, borderBottomWidth: s.borderBottom } : {}),
                        ...(s.left   !== undefined ? { left:   s.left,   borderLeftWidth:   s.borderLeft   } : {}),
                        ...(s.right  !== undefined ? { right:  s.right,  borderRightWidth:  s.borderRight  } : {}),
                        transition: 'border-color 0.2s',
                      }} />
                    ))}
                    {/* Scan line */}
                    <div style={{
                      position: 'absolute', top: '50%', left: 0, right: 0, height: 2,
                      backgroundColor: detected ? T.green : T.violet,
                      opacity: 0.9,
                      boxShadow: `0 0 10px ${detected ? T.green : T.violet}`,
                      transition: 'background-color 0.2s',
                    }} />
                  </div>
                </div>
              )}

              {/* Detected flash */}
              {detected && (
                <div style={{ position: 'absolute', bottom: 12, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
                  <div style={{ backgroundColor: 'rgba(5,150,105,0.9)', color: T.white, padding: '6px 16px', borderRadius: 99, fontSize: '0.78rem', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.1em' }}>
                    ✓ {detected}
                  </div>
                </div>
              )}

              {error && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.75)', padding: 24 }}>
                  <div style={{ textAlign: 'center', color: T.white }}>
                    <Camera size={36} style={{ display: 'block', margin: '0 auto 12px', opacity: 0.5 }} />
                    <div style={{ fontSize: '0.85rem', lineHeight: 1.5, marginBottom: 12 }}>{error}</div>
                    <button onClick={() => setTab('manual')} style={{ padding: '8px 18px', borderRadius: 8, border: 'none', backgroundColor: T.blue, color: T.white, fontWeight: 700, cursor: 'pointer', fontSize: '0.82rem' }}>
                      Use Manual Entry
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div style={{ padding: '12px 20px', backgroundColor: T.slate50, textAlign: 'center' }}>
              <div style={{ fontSize: '0.78rem', color: T.slate500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <ScanLine size={13} color={T.violet} />
                Hold the barcode horizontally within the box — auto-detects
              </div>
            </div>
          </>
        )}

        {/* Manual / USB tab */}
        {tab === 'manual' && (
          <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderRadius: 10, backgroundColor: '#EFF6FF', border: `1px solid #BFDBFE`, marginBottom: 20 }}>
              <Keyboard size={15} color={T.blue} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '0.77rem', color: T.blue, lineHeight: 1.5 }}>
                USB scanner? Just scan directly — it auto-submits on Enter.
              </span>
            </div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: T.slate600, marginBottom: 7 }}>
              Barcode (13 characters)
            </label>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && input.length === 13 && handleManualSubmit()}
              placeholder="Scan or type barcode…"
              maxLength={13}
              style={{ width: '100%', padding: '11px 14px', borderRadius: 9, border: `1.5px solid ${T.slate200}`, fontSize: '1rem', fontFamily: 'monospace', letterSpacing: '0.1em', outline: 'none', backgroundColor: T.slate50, color: T.slate800, boxSizing: 'border-box' }}
            />
            <div style={{ marginTop: 5, fontSize: '0.72rem', color: T.slate400, textAlign: 'right', marginBottom: 16 }}>
              {input.length}/13
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={onClose} style={{ padding: '9px 20px', borderRadius: 8, border: `1.5px solid ${T.slate200}`, backgroundColor: T.white, color: T.slate600, fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>
                Cancel
              </button>
              <button onClick={handleManualSubmit} disabled={input.length !== 13 || loading}
                style={{ padding: '9px 20px', borderRadius: 8, border: 'none', backgroundColor: input.length === 13 ? T.violet : T.slate300, color: T.white, fontWeight: 700, cursor: input.length === 13 ? 'pointer' : 'not-allowed', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 7 }}>
                {loading ? <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <ArrowRight size={14} />}
                {loading ? 'Looking up…' : 'Look Up Item'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

/* ── Item Detail Modal ─────────────────────────────────────────── */
const ItemModal = ({ item: initialItem, onClose, onUpdated }) => {
  const [item, setItem]       = useState(initialItem);
  const [editing, setEditing] = useState(false);
  const [form, setForm]       = useState({ status: initialItem.status, notes: initialItem.notes || '' });
  const [saving, setSaving]   = useState(false);

  const sm    = STATUS_META[item.status] || STATUS_META.normal;
  const Icon  = ITEM_ICONS[item.itemName] || Package;
  const SIcon = sm.icon;

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/update-item-status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          barcode:   item.barcode,
          status:    form.status,
          notes:     form.notes,
          updatedBy: localStorage.getItem('username') || 'admin',
        }),
      });
      if (!res.ok) throw new Error();
      const updated = { ...item, status: form.status, notes: form.notes, updatedAt: new Date() };
      setItem(updated);
      onUpdated?.(updated);
      setEditing(false);
      toast.success('Item updated successfully');
    } catch {
      toast.error('Failed to update item');
    } finally {
      setSaving(false);
    }
  };

  const statusColor = {
    normal:       T.green,
    damaged:      T.red,
    missing:      T.amber,
    under_repair: T.blue,
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, backdropFilter: 'blur(6px)', padding: 16 }}
      onClick={onClose}>
      <div style={{ ...card, width: '100%', maxWidth: 500, overflow: 'hidden', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>

        {/* Gradient header */}
        <div style={{
          background: `linear-gradient(135deg, ${T.navy} 0%, #1E3A8A 60%, ${T.blue} 100%)`,
          padding: '22px 24px', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', right: -40, top: -40, width: 180, height: 180, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.04)' }} />
          <button onClick={onClose} style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8, padding: 6, cursor: 'pointer', color: T.white }}>
            <X size={16} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative' }}>
            <div style={{ width: 58, height: 58, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.15)', flexShrink: 0 }}>
              <Icon size={26} color={T.white} />
            </div>
            <div>
              <div style={{ fontWeight: 900, fontSize: '1.3rem', color: T.white, textTransform: 'capitalize', letterSpacing: '-0.02em' }}>
                {item.itemName} {item.slot > 1 ? `#${item.slot}` : ''}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginTop: 3, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Building2 size={12} /> {item.house}
                <span style={{ opacity: 0.4 }}>·</span>
                <Hash size={12} /> Room {item.roomNumber}
              </div>
              <div style={{ marginTop: 8 }}>
                <span style={pill(sm.bg, sm.fg)}>
                  <SIcon size={9} /> {sm.label}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px' }}>

          {/* Info grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
            {[
              { label: 'Barcode',     val: item.barcode,    mono: true },
              { label: 'Room',        val: item.roomNumber, mono: true },
              { label: 'House',       val: item.house,      mono: false },
              { label: 'Capacity',    val: `${item.capacity} person${item.capacity > 1 ? 's' : ''}`, mono: false },
              { label: 'Slot',        val: `Item ${item.slot} of ${item.capacity}`, mono: false },
              { label: 'Last Updated', val: fmtDate(item.updatedAt), mono: false },
            ].map(({ label, val, mono }, i) => (
              <div key={i} style={{ padding: '11px 14px', borderRadius: 9, backgroundColor: T.slate50, border: `1px solid ${T.slate100}` }}>
                <div style={{ fontSize: '0.68rem', color: T.slate400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{label}</div>
                <div style={{ fontWeight: 700, color: T.slate800, fontSize: '0.85rem', fontFamily: mono ? 'monospace' : 'inherit' }}>{val}</div>
              </div>
            ))}
          </div>

          {/* Notes display */}
          {item.notes && !editing && (
            <div style={{ padding: '12px 14px', borderRadius: 9, backgroundColor: '#FFFBEB', border: `1px solid #FDE68A`, marginBottom: 16 }}>
              <div style={{ fontSize: '0.68rem', color: T.amber, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Notes</div>
              <div style={{ fontSize: '0.84rem', color: T.slate700, lineHeight: 1.5 }}>{item.notes}</div>
            </div>
          )}

          {/* Edit form */}
          {editing ? (
            <div style={{ border: `1.5px solid ${T.slate200}`, borderRadius: 10, padding: 16, marginBottom: 16 }}>
              <div style={{ fontWeight: 700, color: T.slate800, fontSize: '0.88rem', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 7 }}>
                <Edit3 size={14} color={T.blue} /> Update Item
              </div>

              {/* Status selector */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: T.slate600, marginBottom: 8 }}>Status</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {Object.entries(STATUS_META).map(([key, meta]) => {
                    const SI = meta.icon;
                    const selected = form.status === key;
                    return (
                      <button key={key} onClick={() => setForm(p => ({ ...p, status: key }))}
                        style={{
                          padding: '10px 12px', borderRadius: 9, cursor: 'pointer', textAlign: 'left',
                          border: `2px solid ${selected ? statusColor[key] : T.slate200}`,
                          backgroundColor: selected ? meta.bg : T.white,
                          transition: 'all 0.12s',
                          display: 'flex', alignItems: 'center', gap: 8,
                        }}>
                        <SI size={14} color={selected ? meta.fg : T.slate400} />
                        <span style={{ fontSize: '0.8rem', fontWeight: selected ? 700 : 500, color: selected ? meta.fg : T.slate500 }}>
                          {meta.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: T.slate600, marginBottom: 7 }}>Notes (optional)</label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                  rows={3}
                  placeholder="Add any details about this item's condition…"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: `1.5px solid ${T.slate200}`, fontSize: '0.84rem', resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', color: T.slate800 }}
                />
              </div>

              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button onClick={() => { setEditing(false); setForm({ status: item.status, notes: item.notes || '' }); }}
                  style={{ padding: '8px 18px', borderRadius: 8, border: `1.5px solid ${T.slate200}`, backgroundColor: T.white, color: T.slate600, fontWeight: 600, cursor: 'pointer', fontSize: '0.82rem' }}>
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving}
                  style={{ padding: '8px 18px', borderRadius: 8, border: 'none', backgroundColor: T.blue, color: T.white, fontWeight: 700, cursor: 'pointer', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: 7, opacity: saving ? 0.7 : 1 }}>
                  {saving ? <RefreshCw size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={13} />}
                  {saving ? 'Saving…' : 'Save'}
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setEditing(true)}
              style={{ width: '100%', padding: '11px', borderRadius: 9, border: `1.5px solid ${T.slate200}`, backgroundColor: T.white, color: T.blue, fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.12s' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#EFF6FF'; e.currentTarget.style.borderColor = T.blueL; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = T.white; e.currentTarget.style.borderColor = T.slate200; }}>
              <Edit3 size={14} /> Update Status / Notes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════
   MAIN SCANNER PAGE
════════════════════════════════════════════════ */
const ScannerPage = () => {
  const navigate = useNavigate();

  const [mode, setMode]               = useState(null);      // 'qr' | 'barcode' | null
  const [itemModal, setItemModal]     = useState(null);      // item object
  const [recentScans, setRecentScans] = useState([]);        // last 10 scans
  const [lookingUp, setLookingUp]     = useState(false);

  /* ── QR result handler ── */
  const handleQRResult = useCallback((data) => {
    setMode(null);
    // QR codes contain a URL → navigate to it
    // Expected format: https://domain.com/room/a04  OR  just  /room/a04
    try {
      let path = data;
      if (data.startsWith('http')) {
        const url = new URL(data);
        path = url.pathname;
      }
      addScan({ type: 'QR', value: data, result: 'Navigating to room…', ts: new Date() });
      navigate(path);
    } catch {
      toast.error('Invalid QR code format');
    }
  }, [navigate]);

  /* ── Barcode result handler ── */
  const handleBarcodeResult = useCallback(async (barcode) => {
    setMode(null);
    setLookingUp(true);
    try {
      const res  = await fetch(`${API_URL}/api/get-item-by-barcode/${barcode}`);
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || 'Item not found');
        addScan({ type: 'Barcode', value: barcode, result: 'Not found', ts: new Date(), error: true });
        return;
      }
      addScan({ type: 'Barcode', value: barcode, result: `${data.itemName} · ${data.roomNumber}`, ts: new Date(), item: data });
      setItemModal(data);
    } catch {
      toast.error('Failed to look up item');
    } finally {
      setLookingUp(false);
    }
  }, []);

  const addScan = (scan) => {
    setRecentScans(prev => [scan, ...prev].slice(0, 10));
  };

  const MODE_CARDS = [
    {
      key: 'qr',
      icon: QrCode,
      title: 'Scan QR Code',
      desc: 'Scan a room QR code to jump directly to the Room Information page.',
      color: T.blue,
      bg: '#EFF6FF',
      border: '#BFDBFE',
    },
    {
      key: 'barcode',
      icon: Barcode,
      title: 'Scan Item Barcode',
      desc: 'Scan a 13-character item barcode using your camera or type it manually.',
      color: T.violet,
      bg: '#F5F3FF',
      border: '#DDD6FE',
    },
  ];

  return (
    <div style={{ backgroundColor: '#F0F7FF', minHeight: '100vh', padding: '24px 20px', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes scanLine {
          0%   { top: 0; }
          50%  { top: calc(100% - 2px); }
          100% { top: 0; }
        }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
      `}</style>

      {/* ── Breadcrumb ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
        <Home size={15} color={T.blue} />
        <ChevronRight size={13} color={T.slate400} />
        <span style={{ fontWeight: 700, color: T.slate800, fontSize: '0.84rem' }}>Scanner</span>
      </div>

      {/* ── Hero ── */}
      <div style={{
        background: `linear-gradient(135deg, ${T.navy} 0%, #1E3A8A 55%, ${T.blue} 100%)`,
        borderRadius: 16, padding: '26px 28px', marginBottom: 24,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: -60, top: -60, width: 240, height: 240, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'absolute', right: 100, bottom: -80, width: 280, height: 280, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.03)' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ fontWeight: 900, fontSize: '1.6rem', color: T.white, letterSpacing: '-0.02em', marginBottom: 6 }}>
            Scanner
          </div>
          <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <ScanLine size={14} style={{ animation: 'pulse 2s ease infinite' }} />
            Scan QR codes for rooms · Scan barcodes for items
          </div>
          {recentScans.length > 0 && (
            <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
              <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Clock size={11} /> Last scan: {recentScans[0].result}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Two mode cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        {MODE_CARDS.map(({ key, icon: Icon, title, desc, color, bg, border }) => (
          <button key={key} onClick={() => setMode(key)}
            style={{
              ...card, padding: '22px 20px', cursor: 'pointer', border: `1.5px solid ${border}`,
              backgroundColor: bg, textAlign: 'left', display: 'block', width: '100%',
              animation: 'fadeUp 0.3s ease both', transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = card.boxShadow; }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: T.white, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <Icon size={22} color={color} />
            </div>
            <div style={{ fontWeight: 800, color: T.slate800, fontSize: '0.95rem', marginBottom: 6 }}>{title}</div>
            <div style={{ fontSize: '0.78rem', color: T.slate500, lineHeight: 1.55 }}>{desc}</div>
            <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 4, color, fontWeight: 700, fontSize: '0.78rem' }}>
              Open Scanner <ArrowRight size={13} />
            </div>
          </button>
        ))}
      </div>

      {/* ── Loading state ── */}
      {lookingUp && (
        <div style={{ ...card, padding: '20px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 14, animation: 'fadeUp 0.2s ease both' }}>
          <RefreshCw size={20} color={T.blue} style={{ animation: 'spin 1s linear infinite', flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 700, color: T.slate800, fontSize: '0.88rem' }}>Looking up item…</div>
            <div style={{ fontSize: '0.75rem', color: T.slate400, marginTop: 2 }}>Fetching item details from database</div>
          </div>
        </div>
      )}

      {/* ── Recent Scans ── */}
      {recentScans.length > 0 && (
        <div style={{ ...card, overflow: 'hidden', animation: 'fadeUp 0.3s ease 0.1s both' }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${T.slate100}`, display: 'flex', alignItems: 'center', gap: 9 }}>
            <Clock size={16} color={T.slate400} />
            <span style={{ fontWeight: 700, color: T.slate800, fontSize: '0.88rem' }}>Recent Scans</span>
            <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: T.slate400 }}>Last {recentScans.length}</span>
          </div>
          <div>
            {recentScans.map((scan, i) => {
              const isError = scan.error;
              const isQR    = scan.type === 'QR';
              return (
                <div key={i}
                  onClick={() => scan.item && setItemModal(scan.item)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px',
                    borderBottom: i < recentScans.length - 1 ? `1px solid ${T.slate100}` : 'none',
                    cursor: scan.item ? 'pointer' : 'default',
                    transition: 'background 0.12s',
                  }}
                  onMouseEnter={e => scan.item && (e.currentTarget.style.backgroundColor = T.slate50)}
                  onMouseLeave={e => scan.item && (e.currentTarget.style.backgroundColor = T.white)}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, backgroundColor: isError ? '#FEF2F2' : isQR ? '#EFF6FF' : '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {isQR
                      ? <QrCode size={15} color={isError ? T.red : T.blue} />
                      : <Barcode size={15} color={isError ? T.red : T.violet} />
                    }
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: isError ? T.red : T.slate800, fontSize: '0.84rem' }}>{scan.result}</div>
                    <div style={{ fontSize: '0.71rem', color: T.slate400, fontFamily: 'monospace', marginTop: 1 }}>{scan.value}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    <span style={pill(isQR ? '#EFF6FF' : '#F5F3FF', isQR ? T.blue : T.violet)}>{scan.type}</span>
                    <span style={{ fontSize: '0.68rem', color: T.slate400 }}>
                      {new Date(scan.ts).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {scan.item && <ChevronRight size={14} color={T.slate300} />}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Empty state ── */}
      {recentScans.length === 0 && (
        <div style={{ ...card, padding: '40px 20px', textAlign: 'center', animation: 'fadeUp 0.3s ease 0.15s both' }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, backgroundColor: T.slate100, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <ScanLine size={28} color={T.slate300} />
          </div>
          <div style={{ fontWeight: 700, color: T.slate500, fontSize: '0.9rem', marginBottom: 6 }}>No scans yet</div>
          <div style={{ fontSize: '0.8rem', color: T.slate400 }}>Choose a scan mode above to get started</div>
        </div>
      )}

      {/* ── Modals ── */}
      {mode === 'qr'      && <QRScanner      onResult={handleQRResult}      onClose={() => setMode(null)} />}
      {mode === 'barcode' && <BarcodeScanner onResult={handleBarcodeResult} onClose={() => setMode(null)} />}
      {itemModal          && (
        <ItemModal
          item={itemModal}
          onClose={() => setItemModal(null)}
          onUpdated={(updated) => {
            setRecentScans(prev => prev.map(s => s.item?.barcode === updated.barcode ? { ...s, item: updated, result: `${updated.itemName} · ${updated.roomNumber}` } : s));
          }}
        />
      )}

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick />
    </div>
  );
};

export default ScannerPage;