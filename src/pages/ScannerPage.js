import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import jsQR from 'jsqr';
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

/* ── Utility: stop all tracks on a MediaStream ─────────────────── */
const stopStream = (stream) => {
  if (!stream) return;
  stream.getTracks().forEach(t => { try { t.stop(); } catch {} });
};

/* ── Load external script (returns promise) ────────────────────── */
const loadScript = (src, globalKey) => new Promise((resolve, reject) => {
  if (window[globalKey]) { resolve(window[globalKey]); return; }
  const existing = document.querySelector(`script[src="${src}"]`);
  if (existing) {
    existing.addEventListener('load', () => resolve(window[globalKey]));
    existing.addEventListener('error', reject);
    return;
  }
  const s = document.createElement('script');
  s.src = src;
  s.onload = () => resolve(window[globalKey]);
  s.onerror = reject;
  document.head.appendChild(s);
});

/* ══════════════════════════════════════════════════════════════════
   QR SCANNER
   Uses jsQR + getUserMedia. Fully cleans up on unmount / close.
══════════════════════════════════════════════════════════════════ */
const QRScanner = ({ onResult, onClose }) => {
  const videoRef  = useRef(null);
  const canvasRef = useRef(null);
  const mountedRef = useRef(true);    // flipped false on cleanup
  const streamRef  = useRef(null);    // MediaStream
  const rafRef     = useRef(null);    // requestAnimationFrame id
  const [status, setStatus] = useState('loading'); // loading | active | error
  const [errorMsg, setErrorMsg] = useState('');

  /* ── Full teardown ── */
  const teardown = useCallback(() => {
    mountedRef.current = false;
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    stopStream(streamRef.current);
    streamRef.current = null;
    const v = videoRef.current;
    if (v) { v.pause(); v.srcObject = null; }
  }, []);

  const handleClose = useCallback(() => {
    teardown();
    onClose();
  }, [teardown, onClose]);

  /* ── Start camera + scan loop ── */
  useEffect(() => {
    mountedRef.current = true;
    let cancelled = false;

    const start = async () => {
      // 1. Get camera
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }
        });
      } catch (e) {
        if (!cancelled) {
          setStatus('error');
          setErrorMsg(e.name === 'NotAllowedError'
            ? 'Camera access denied. Please allow camera permissions and try again.'
            : 'Could not access camera. Please check your device.');
        }
        return;
      }
      if (cancelled) { stopStream(stream); return; }

      streamRef.current = stream;

      // 3. Attach to video element
      const video = videoRef.current;
      if (!video || cancelled) { stopStream(stream); return; }
      video.srcObject = stream;

      try {
        await video.play();
      } catch (e) {
        if (!cancelled && e.name !== 'AbortError') {
          setStatus('error'); setErrorMsg('Could not start camera preview.');
        }
        return;
      }
      if (cancelled) return;

      setStatus('active');

      // 4. Scan loop
      const tick = () => {
        if (cancelled || !mountedRef.current) return;
        const v = videoRef.current;
        const c = canvasRef.current;
        if (!v || !c || v.readyState < HTMLVideoElement.HAVE_ENOUGH_DATA) {
          rafRef.current = requestAnimationFrame(tick);
          return;
        }
        c.width  = v.videoWidth;
        c.height = v.videoHeight;
        const ctx = c.getContext('2d');
        ctx.drawImage(v, 0, 0);
        const imageData = ctx.getImageData(0, 0, c.width, c.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'attemptBoth' });
        if (code?.data) {
          teardown();
          onResult(code.data);
          return;
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    start();

    return () => {
      cancelled = true;
      teardown();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(6px)', padding: 16 }}>
      <div style={{ ...card, width: '100%', maxWidth: 480, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ background: `linear-gradient(135deg, ${T.navy}, #1E3A8A)`, padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <QrCode size={20} color={T.white} />
            <span style={{ fontWeight: 800, color: T.white, fontSize: '1rem' }}>QR Code Scanner</span>
          </div>
          <button onClick={handleClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        {/* Camera view */}
        <div style={{ position: 'relative', backgroundColor: '#000', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <video ref={videoRef} style={{ width: '100%', height: '100%', objectFit: 'cover', display: status === 'active' ? 'block' : 'none' }} muted playsInline />
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {/* Loading state */}
          {status === 'loading' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <RefreshCw size={28} color={T.blueL} style={{ animation: 'spin 1s linear infinite' }} />
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem' }}>Starting camera…</span>
            </div>
          )}

          {/* Scanning overlay */}
          {status === 'active' && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
              <div style={{ width: 220, height: 220, position: 'relative' }}>
                {/* Corner brackets */}
                {[
                  { top: 0, left: 0 },
                  { top: 0, right: 0 },
                  { bottom: 0, left: 0 },
                  { bottom: 0, right: 0 },
                ].map((pos, i) => (
                  <div key={i} style={{
                    position: 'absolute', width: 30, height: 30,
                    borderColor: T.blueL, borderStyle: 'solid', borderWidth: 0,
                    ...(pos.top    !== undefined ? { top:    pos.top,    borderTopWidth:    3 } : { bottom: pos.bottom, borderBottomWidth: 3 }),
                    ...(pos.left   !== undefined ? { left:   pos.left,   borderLeftWidth:   3 } : { right:  pos.right,  borderRightWidth:  3 }),
                  }} />
                ))}
                {/* Animated scan line */}
                <div style={{
                  position: 'absolute', left: 0, right: 0, height: 2,
                  backgroundColor: T.blueL, opacity: 0.85,
                  animation: 'scanLine 2s ease-in-out infinite',
                  boxShadow: `0 0 8px ${T.blueL}`,
                }} />
              </div>
            </div>
          )}

          {/* Error state */}
          {status === 'error' && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.7)', padding: 24 }}>
              <div style={{ textAlign: 'center', color: T.white }}>
                <Camera size={36} style={{ display: 'block', margin: '0 auto 12px', opacity: 0.5 }} />
                <div style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>{errorMsg}</div>
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

/* ══════════════════════════════════════════════════════════════════
   BARCODE SCANNER
   Uses getUserMedia + canvas-based BarcodeDetector (native browser API)
   with jsQR fallback for 1D barcodes via ZXing-js.
   Falls back gracefully to manual entry.
══════════════════════════════════════════════════════════════════ */
const BarcodeScanner = ({ onResult, onClose }) => {
  const videoRef   = useRef(null);
  const canvasRef  = useRef(null);
  const mountedRef = useRef(true);
  const streamRef  = useRef(null);
  const rafRef     = useRef(null);
  const lastCodeRef = useRef(null);
  const hitCountRef = useRef(0);

  const [tab, setTab]         = useState('camera');
  const [status, setStatus]   = useState('loading'); // loading | active | error
  const [errorMsg, setErrorMsg] = useState('');
  const [detected, setDetected] = useState(null);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  /* ── Full teardown ── */
  const teardown = useCallback(() => {
    mountedRef.current = false;
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    stopStream(streamRef.current);
    streamRef.current = null;
    const v = videoRef.current;
    if (v) { v.pause(); v.srcObject = null; }
  }, []);

  const handleClose = useCallback(() => {
    teardown();
    onClose();
  }, [teardown, onClose]);

  /* ── Camera scan loop using native BarcodeDetector or ZXing ── */
  useEffect(() => {
    if (tab !== 'camera') return;
    mountedRef.current = true;
    let cancelled = false;
    lastCodeRef.current = null;
    hitCountRef.current = 0;

    const start = async () => {
      // Get camera
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }
        });
      } catch (e) {
        if (!cancelled) {
          setStatus('error');
          setErrorMsg(e.name === 'NotAllowedError'
            ? 'Camera access denied. Switch to Manual Entry.'
            : 'Could not access camera. Switch to Manual Entry.');
        }
        return;
      }
      if (cancelled) { stopStream(stream); return; }
      streamRef.current = stream;

      const video = videoRef.current;
      if (!video || cancelled) { stopStream(stream); return; }
      video.srcObject = stream;
      try { await video.play(); } catch (e) {
        if (!cancelled && e.name !== 'AbortError') {
          setStatus('error'); setErrorMsg('Could not start camera preview.');
        }
        return;
      }
      if (cancelled) return;
      setStatus('active');

      // Try native BarcodeDetector first (Chrome 83+, Edge, Safari 17+)
      const hasNativeDetector = 'BarcodeDetector' in window;
      let detector = null;
      if (hasNativeDetector) {
        try {
          detector = new window.BarcodeDetector({
            formats: ['code_128', 'code_39', 'ean_13', 'ean_8', 'upc_a', 'upc_e', 'qr_code', 'data_matrix', 'aztec']
          });
        } catch { detector = null; }
      }

      // Load ZXing as fallback
      let ZXing = null;
      if (!detector) {
        try {
          await loadScript('https://unpkg.com/@zxing/library@0.19.1/umd/index.min.js', 'ZXing');
          ZXing = window.ZXing;
        } catch {
          if (!cancelled) {
            setStatus('error');
            setErrorMsg('Barcode library failed to load. Please use Manual Entry.');
          }
          return;
        }
        if (cancelled) return;
      }

      // ZXing reader instance
      let zxingReader = null;
      if (ZXing) {
        try {
          const hints = new Map();
          const formats = [
            ZXing.BarcodeFormat.CODE_128,
            ZXing.BarcodeFormat.CODE_39,
            ZXing.BarcodeFormat.EAN_13,
            ZXing.BarcodeFormat.EAN_8,
            ZXing.BarcodeFormat.UPC_A,
            ZXing.BarcodeFormat.UPC_E,
          ];
          hints.set(ZXing.DecodeHintType.POSSIBLE_FORMATS, formats);
          hints.set(ZXing.DecodeHintType.TRY_HARDER, true);
          zxingReader = new ZXing.MultiFormatReader();
          zxingReader.setHints(hints);
        } catch {
          // If ZXing init fails, still try with canvas fallback
        }
      }

      /* ── Tick: decode one frame ── */
      const tick = async () => {
        if (cancelled || !mountedRef.current) return;
        const v = videoRef.current;
        const c = canvasRef.current;
        if (!v || !c || v.readyState < HTMLVideoElement.HAVE_ENOUGH_DATA) {
          rafRef.current = requestAnimationFrame(tick);
          return;
        }

        const w = v.videoWidth;
        const h = v.videoHeight;
        c.width  = w;
        c.height = h;
        const ctx = c.getContext('2d');
        ctx.drawImage(v, 0, 0, w, h);

        let code = null;

        try {
          if (detector) {
            // Native BarcodeDetector
            const results = await detector.detect(c);
            if (results.length > 0) code = results[0].rawValue;
          } else if (zxingReader) {
            // ZXing fallback
            const imageData = ctx.getImageData(0, 0, w, h);
            const luminance = new ZXing.RGBLuminanceSource(imageData.data, w, h);
            const binaryBitmap = new ZXing.BinaryBitmap(new ZXing.HybridBinarizer(luminance));
            const result = zxingReader.decode(binaryBitmap);
            if (result) code = result.getText();
          }
        } catch {
          // No barcode found this frame — normal, keep scanning
        }

        if (code && cancelled === false) {
          // Require 2 consistent reads to avoid false positives
          if (code === lastCodeRef.current) {
            hitCountRef.current++;
            if (hitCountRef.current >= 2) {
              teardown();
              onResult(code.trim().toUpperCase());
              return;
            }
          } else {
            lastCodeRef.current = code;
            hitCountRef.current = 1;
            setDetected(code);
          }
        }

        rafRef.current = requestAnimationFrame(tick);
      };

      rafRef.current = requestAnimationFrame(tick);
    };

    start();

    return () => {
      cancelled = true;
      teardown();
      // Reset status for if user switches tabs and comes back
      setStatus('loading');
      setDetected(null);
    };
  }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  // Focus manual input when switching to manual tab
  useEffect(() => {
    if (tab === 'manual') {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [tab]);

  const handleManualSubmit = async () => {
    const code = input.trim().toUpperCase();
    if (!code) return;
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
          <button onClick={handleClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', padding: 4 }}>
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
            <div style={{ position: 'relative', backgroundColor: '#000', aspectRatio: '4/3', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <video ref={videoRef} style={{ width: '100%', height: '100%', objectFit: 'cover', display: status === 'active' ? 'block' : 'none' }} muted playsInline />
              <canvas ref={canvasRef} style={{ display: 'none' }} />

              {/* Loading */}
              {status === 'loading' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                  <RefreshCw size={28} color={T.violet} style={{ animation: 'spin 1s linear infinite' }} />
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem' }}>Starting camera…</span>
                </div>
              )}

              {/* Targeting overlay for 1D barcodes */}
              {status === 'active' && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                  <div style={{ width: '80%', height: 80, position: 'relative' }}>
                    {[
                      { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3 },
                      { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3 },
                      { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3 },
                      { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3 },
                    ].map((s, i) => (
                      <div key={i} style={{
                        position: 'absolute', width: 24, height: 24,
                        borderColor: detected ? T.green : T.violet,
                        borderStyle: 'solid', borderWidth: 0,
                        ...s,
                        transition: 'border-color 0.2s',
                      }} />
                    ))}
                    <div style={{
                      position: 'absolute', top: '50%', left: 0, right: 0, height: 2,
                      backgroundColor: detected ? T.green : T.violet,
                      boxShadow: `0 0 10px ${detected ? T.green : T.violet}`,
                      transition: 'background-color 0.2s',
                    }} />
                  </div>
                </div>
              )}

              {/* Detected flash */}
              {detected && status === 'active' && (
                <div style={{ position: 'absolute', bottom: 12, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
                  <div style={{ backgroundColor: 'rgba(5,150,105,0.92)', color: T.white, padding: '6px 16px', borderRadius: 99, fontSize: '0.78rem', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.08em' }}>
                    ✓ {detected}
                  </div>
                </div>
              )}

              {/* Error */}
              {status === 'error' && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.75)', padding: 24 }}>
                  <div style={{ textAlign: 'center', color: T.white }}>
                    <Camera size={36} style={{ display: 'block', margin: '0 auto 12px', opacity: 0.5 }} />
                    <div style={{ fontSize: '0.85rem', lineHeight: 1.5, marginBottom: 14 }}>{errorMsg}</div>
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
              Barcode
            </label>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && input.trim() && handleManualSubmit()}
              placeholder="Scan or type barcode…"
              style={{ width: '100%', padding: '11px 14px', borderRadius: 9, border: `1.5px solid ${T.slate200}`, fontSize: '1rem', fontFamily: 'monospace', letterSpacing: '0.1em', outline: 'none', backgroundColor: T.slate50, color: T.slate800, boxSizing: 'border-box' }}
            />
            <div style={{ marginTop: 5, fontSize: '0.72rem', color: T.slate400, textAlign: 'right', marginBottom: 16 }}>
              {input.length} chars
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={handleClose} style={{ padding: '9px 20px', borderRadius: 8, border: `1.5px solid ${T.slate200}`, backgroundColor: T.white, color: T.slate600, fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>
                Cancel
              </button>
              <button onClick={handleManualSubmit} disabled={!input.trim() || loading}
                style={{ padding: '9px 20px', borderRadius: 8, border: 'none', backgroundColor: input.trim() ? T.violet : T.slate300, color: T.white, fontWeight: 700, cursor: input.trim() ? 'pointer' : 'not-allowed', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 7 }}>
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

/* ══════════════════════════════════════════════════════════════════
   ITEM DETAIL MODAL
══════════════════════════════════════════════════════════════════ */
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
            {[
              { label: 'Barcode',      val: item.barcode,    mono: true },
              { label: 'Room',         val: item.roomNumber, mono: true },
              { label: 'House',        val: item.house,      mono: false },
              { label: 'Capacity',     val: `${item.capacity} person${item.capacity > 1 ? 's' : ''}`, mono: false },
              { label: 'Slot',         val: `Item ${item.slot} of ${item.capacity}`, mono: false },
              { label: 'Last Updated', val: fmtDate(item.updatedAt), mono: false },
            ].map(({ label, val, mono }, i) => (
              <div key={i} style={{ padding: '11px 14px', borderRadius: 9, backgroundColor: T.slate50, border: `1px solid ${T.slate100}` }}>
                <div style={{ fontSize: '0.68rem', color: T.slate400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{label}</div>
                <div style={{ fontWeight: 700, color: T.slate800, fontSize: '0.85rem', fontFamily: mono ? 'monospace' : 'inherit' }}>{val}</div>
              </div>
            ))}
          </div>

          {item.notes && !editing && (
            <div style={{ padding: '12px 14px', borderRadius: 9, backgroundColor: '#FFFBEB', border: `1px solid #FDE68A`, marginBottom: 16 }}>
              <div style={{ fontSize: '0.68rem', color: T.amber, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Notes</div>
              <div style={{ fontSize: '0.84rem', color: T.slate700, lineHeight: 1.5 }}>{item.notes}</div>
            </div>
          )}

          {editing ? (
            <div style={{ border: `1.5px solid ${T.slate200}`, borderRadius: 10, padding: 16, marginBottom: 16 }}>
              <div style={{ fontWeight: 700, color: T.slate800, fontSize: '0.88rem', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 7 }}>
                <Edit3 size={14} color={T.blue} /> Update Item
              </div>

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

/* ══════════════════════════════════════════════════════════════════
   MAIN SCANNER PAGE
══════════════════════════════════════════════════════════════════ */
const ScannerPage = () => {
  const navigate = useNavigate();

  const [mode, setMode]           = useState(null);
  const [itemModal, setItemModal] = useState(null);
  const [recentScans, setRecentScans] = useState([]);
  const [lookingUp, setLookingUp] = useState(false);

  const addScan = useCallback((scan) => {
    setRecentScans(prev => [scan, ...prev].slice(0, 10));
  }, []);

  /* ── QR result handler ── */
  const handleQRResult = useCallback((data) => {
    setMode(null);
    console.log(data)
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
  }, [navigate, addScan]);

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
  }, [addScan]);

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

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
        <Home size={15} color={T.blue} />
        <ChevronRight size={13} color={T.slate400} />
        <span style={{ fontWeight: 700, color: T.slate800, fontSize: '0.84rem' }}>Scanner</span>
      </div>

      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, ${T.navy} 0%, #1E3A8A 55%, ${T.blue} 100%)`,
        borderRadius: 16, padding: '26px 28px', marginBottom: 24,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: -60, top: -60, width: 240, height: 240, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ fontWeight: 900, fontSize: '1.6rem', color: T.white, letterSpacing: '-0.02em', marginBottom: 6 }}>
            Scanner
          </div>
          <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <ScanLine size={14} style={{ animation: 'pulse 2s ease infinite' }} />
            Scan QR codes for rooms · Scan barcodes for items
          </div>
          {recentScans.length > 0 && (
            <div style={{ marginTop: 14 }}>
              <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Clock size={11} /> Last scan: {recentScans[0].result}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Mode cards */}
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

      {/* Loading lookup */}
      {lookingUp && (
        <div style={{ ...card, padding: '20px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 14, animation: 'fadeUp 0.2s ease both' }}>
          <RefreshCw size={20} color={T.blue} style={{ animation: 'spin 1s linear infinite', flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 700, color: T.slate800, fontSize: '0.88rem' }}>Looking up item…</div>
            <div style={{ fontSize: '0.75rem', color: T.slate400, marginTop: 2 }}>Fetching item details from database</div>
          </div>
        </div>
      )}

      {/* Recent Scans */}
      {recentScans.length > 0 && (
        <div style={{ ...card, overflow: 'hidden', animation: 'fadeUp 0.3s ease 0.1s both' }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${T.slate100}`, display: 'flex', alignItems: 'center', gap: 9 }}>
            <Clock size={16} color={T.slate400} />
            <span style={{ fontWeight: 700, color: T.slate800, fontSize: '0.88rem' }}>Recent Scans</span>
            <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: T.slate400 }}>Last {recentScans.length}</span>
          </div>
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
      )}

      {/* Empty state */}
      {recentScans.length === 0 && (
        <div style={{ ...card, padding: '40px 20px', textAlign: 'center', animation: 'fadeUp 0.3s ease 0.15s both' }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, backgroundColor: T.slate100, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <ScanLine size={28} color={T.slate300} />
          </div>
          <div style={{ fontWeight: 700, color: T.slate500, fontSize: '0.9rem', marginBottom: 6 }}>No scans yet</div>
          <div style={{ fontSize: '0.8rem', color: T.slate400 }}>Choose a scan mode above to get started</div>
        </div>
      )}

      {/* Modals */}
      {mode === 'qr'      && <QRScanner      onResult={handleQRResult}      onClose={() => setMode(null)} />}
      {mode === 'barcode' && <BarcodeScanner onResult={handleBarcodeResult} onClose={() => setMode(null)} />}
      {itemModal && (
        <ItemModal
          item={itemModal}
          onClose={() => setItemModal(null)}
          onUpdated={(updated) => {
            setRecentScans(prev => prev.map(s =>
              s.item?.barcode === updated.barcode
                ? { ...s, item: updated, result: `${updated.itemName} · ${updated.roomNumber}` }
                : s
            ));
          }}
        />
      )}

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick />
    </div>
  );
};

export default ScannerPage;