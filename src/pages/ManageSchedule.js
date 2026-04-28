import React, { useState, useEffect } from 'react';
import { Home, ChevronRight, Calendar, Clock, Save, X, Moon, Sun, Users } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_URL from '../config';

const ManageSchedule = () => {
  const [wardens, setWardens] = useState([]);
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('set'); // 'set' or 'change'
  const [selectedSlot, setSelectedSlot] = useState({ wardenId: null, day: null });
  const [shiftForm, setShiftForm] = useState({
    house: '',
    shift: '',
    status: 'active' // 'active', 'off', 'leave'
  });
  const [serverSchedule, setServerSchedule] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Shift capacity rules
  const SHIFT_RULES = {
    'Adlam House': { day: 3, night: 1 },
    'Nurse Home': { day: 2, night: 1 }
  };

  useEffect(() => {
    fetchWardens();
  }, []);

  useEffect(() => {
    if (wardens.length > 0) {
      fetchScheduleFromServer();
    }
  }, [wardens]);



  const fetchWardens = async () => {
    try {
      const response = await fetch(`${API_URL}/get-all-employees`);
      const data = await response.json();
      
      // Filter only Wardens
      const wardensOnly = data.filter(user => user.position === 'Warden' && user.accountStatus === true);
      setWardens(wardensOnly);
      
      // Initialize empty schedule
      const emptySchedule = {};
      wardensOnly.forEach(warden => {
        emptySchedule[warden._id] = {};
        daysOfWeek.forEach(day => {
          emptySchedule[warden._id][day] = null;
        });
      });
      setSchedule(emptySchedule);
      
    } catch (error) {
      console.error('Error fetching wardens:', error);
      toast.error('Failed to load wardens');
    } finally {
      setLoading(false);
    }
  };

    const fetchScheduleFromServer = async () => {
      try {
        const response = await fetch(`${API_URL}/get-warden-schedule`);
        
        if (!response.ok) return;

        const data = await response.json();

        if (!data || !data.schedule) return;

        setServerSchedule(data.schedule);

        const convertedSchedule = {};

        wardens.forEach(warden => {
          convertedSchedule[warden._id] = {};

          daysOfWeek.forEach(day => {
            let assignment = null;

            const dayData = data.schedule[day];

            if (dayData) {
              Object.keys(dayData).forEach(house => {
                const houseData = dayData[house];

                ['day', 'night'].forEach(shift => {
                  if (
                    houseData?.[shift]?.includes(warden.staffId)
                  ) {
                    assignment = {
                      wardenId: warden._id,
                      house,
                      shift,
                      status: 'active'
                    };
                  }
                });
              });
            }

            convertedSchedule[warden._id][day] = assignment;
          });
        });

        setSchedule(convertedSchedule);

      } catch (error) {
        console.error('Error fetching schedule:', error);
        toast.error('Failed to load schedule');
      }
    };

  const openSetModal = (wardenId, day) => {
    setSelectedSlot({ wardenId, day });
    setModalMode('set');
    setShiftForm({ house: '', shift: '', status: 'active' });
    setShowModal(true);
  };

  const openChangeModal = (wardenId, day) => {
    setSelectedSlot({ wardenId, day });
    setModalMode('change');
    const currentShift = schedule[wardenId]?.[day];
    if (currentShift) {
      setShiftForm({
        house: currentShift.house || '',
        shift: currentShift.shift || '',
        status: currentShift.status || 'active'
      });
    }
    setShowModal(true);
  };

  const validateShiftCapacity = (day, house, shift, excludeWardenId = null) => {
  // Count current assignments for this day/house/shift
  const currentAssignments = Object.keys(schedule)
    .filter(wardenId => wardenId !== excludeWardenId)
    .filter(wardenId => {
      const assignment = schedule[wardenId]?.[day];
      return assignment?.house === house && 
             assignment?.shift === shift && 
             assignment?.status === 'active';
    }).length;

  const maxCapacity = SHIFT_RULES[house]?.[shift] || 0;
  
  return {
    current: currentAssignments,
    max: maxCapacity,
    canAdd: currentAssignments < maxCapacity,
    isFull: currentAssignments >= maxCapacity
  };
};


const handleSubmitShift = () => {
  if (shiftForm.status === 'active' && (!shiftForm.house || !shiftForm.shift)) {
    toast.error('Please select house and shift');
    return;
  }

  // ✅ VALIDATE CAPACITY
  if (shiftForm.status === 'active') {
    const validation = validateShiftCapacity(
      selectedSlot.day,
      shiftForm.house,
      shiftForm.shift,
      selectedSlot.wardenId
    );

    if (!validation.canAdd) {
      toast.error(
        `${shiftForm.house} ${shiftForm.shift} shift is at full capacity (${validation.max}/${validation.max})`
      );
      return;
    }

    // ✅ SPECIAL CHECK: Night shift cannot be empty
    if (shiftForm.shift === 'night') {
      // This is being added, so it's fine
    }
  }

  // Rest of your existing code...
  setSchedule(prev => ({
    ...prev,
    [selectedSlot.wardenId]: {
      ...prev[selectedSlot.wardenId],
      [selectedSlot.day]: {
        wardenId: selectedSlot.wardenId,
        house: shiftForm.house,
        shift: shiftForm.shift,
        status: shiftForm.status
      }
    }
  }));

  toast.success('Shift assigned successfully');
  closeModal();
};



  const closeModal = () => {
    setShowModal(false);
    setSelectedSlot({ wardenId: null, day: null });
    setShiftForm({ house: '', shift: '', status: 'active' });
  };

  const getShiftDisplay = (shift) => {
    if (!shift) return null;
    
    if (shift.status === 'off') {
      return { label: 'Day off', color: '#FCA5A5', bgColor: '#FEE2E2', time: '' };
    }
    
    if (shift.status === 'leave') {
      return { label: 'On Leave', color: '#FCD34D', bgColor: '#FEF3C7', time: '' };
    }

    const times = shift.shift === 'day' 
      ? '08:00 - 17:00' 
      : '17:00 - 08:00';

    return {
      label: shift.house === 'Adlam House' ? 'Adlam House' : 'Nurse Home',
      color: shift.shift === 'day' ? '#10B981' : '#3B82F6',
      bgColor: shift.shift === 'day' ? '#D1FAE5' : '#DBEAFE',
      time: times,
      shiftType: shift.shift
    };
  };

 const handleSaveSchedule = async () => {
  // ✅ VALIDATE BEFORE SAVING
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const houses = ['Adlam House', 'Nurse Home'];
  
  for (const day of daysOfWeek) {
    for (const house of houses) {
      // Check night shift - must have at least 1 warden
      const nightValidation = validateShiftCapacity(day, house, 'night');
      if (nightValidation.current === 0) {
        toast.error(`${house} must have at least 1 night shift warden on ${day}`);
        return;
      }

      // Check day shift - must not exceed capacity
      const dayValidation = validateShiftCapacity(day, house, 'day');
      if (!dayValidation.canAdd && dayValidation.current > dayValidation.max) {
        toast.error(`${house} day shift on ${day} exceeds capacity`);
        return;
      }
    }
  }

  // Convert component schedule to server format
  const serverFormat = {};
  daysOfWeek.forEach(day => {
    serverFormat[day] = {};
    houses.forEach(house => {
      serverFormat[day][house] = {
        day: [],
        night: []
      };
    });
  });

  // Populate server format
  Object.keys(schedule).forEach(wardenId => {
    const warden = wardens.find(w => w._id === wardenId);
    if (!warden) return;

    daysOfWeek.forEach(day => {
      const assignment = schedule[wardenId][day];
      if (assignment && assignment.status === 'active') {
        serverFormat[day][assignment.house][assignment.shift].push(warden.staffId);
      }
    });
  });

  // Save to database
  setIsSaving(true);
  try {
    const response = await fetch(`${API_URL}/save-warden-schedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        schedule: serverFormat,
        updatedBy: localStorage.getItem('user') || 'admin'
      })
    });

    const data = await response.json();

    if (response.ok) {
      toast.success('Schedule saved successfully!');
    } else {
      toast.error(data.message || 'Failed to save schedule');
    }
  } catch (error) {
    console.error('Error saving schedule:', error);
    toast.error('Failed to save schedule');
  } finally {
    setIsSaving(false);
  }
};

  const styles = {
    body: { 
      backgroundColor: '#F0F7FF', 
      minHeight: '100vh', 
      padding: '20px', 
      fontFamily: 'system-ui, sans-serif' 
    },
    headerSection: { 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      marginBottom: '30px' 
    },
    card: { 
      backgroundColor: 'white', 
      borderRadius: '12px', 
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)', 
      padding: '20px', 
      border: '1px solid #E1E8F0' 
    },
    scheduleGrid: {
      display: 'grid',
      gridTemplateColumns: '200px repeat(7, 1fr)',
      gap: '2px',
      backgroundColor: '#E1E8F0',
      border: '2px solid #E1E8F0',
      borderRadius: '12px',
      overflow: 'hidden'
    },
    headerCell: {
      backgroundColor: '#1E3A8A',
      color: 'white',
      padding: '15px 10px',
      fontWeight: '600',
      textAlign: 'center',
      fontSize: '0.9rem'
    },
    wardenCell: {
      backgroundColor: 'white',
      padding: '15px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: '4px'
    },
    shiftCell: {
      backgroundColor: 'white',
      padding: '10px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100px'
    },
    shiftBox: (bgColor) => ({
      width: '100%',
      padding: '12px 8px',
      borderRadius: '8px',
      backgroundColor: bgColor,
      textAlign: 'center',
      border: '2px solid',
      display: 'flex',
      flexDirection: 'column',
      gap: '6px'
    }),
    notSetBox: {
      padding: '10px',
      border: '2px dashed #CBD5E1',
      borderRadius: '8px',
      color: '#94A3B8',
      fontSize: '0.85rem',
      fontStyle: 'italic',
      textAlign: 'center',
      width: '100%'
    },
    buttonGroup: {
      display: 'flex',
      gap: '6px',
      marginTop: '8px',
      width: '100%'
    },
    btn: (bg, color) => ({
      padding: '6px 12px',
      borderRadius: '6px',
      border: 'none',
      backgroundColor: bg,
      color: color,
      fontSize: '0.75rem',
      fontWeight: '600',
      cursor: 'pointer',
      flex: 1,
      transition: 'all 0.2s'
    }),
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.6)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '30px',
      width: '90%',
      maxWidth: '500px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
    },
    input: {
      width: '100%',
      padding: '12px',
      borderRadius: '8px',
      border: '2px solid #DBEAFE',
      fontSize: '0.9rem',
      marginBottom: '15px'
    },
    avatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      objectFit: 'cover'
    }
  };

  return (
    <div style={styles.body}>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div style={styles.headerSection}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Home size={18} color="#3B82F6" />
          <ChevronRight size={16} color="#94A3B8" />
          <span style={{ fontWeight: '600', color: '#1E293B' }}>Warden Schedule</span>
        </div>
        <button 
          onClick={handleSaveSchedule}
          disabled={isSaving}
          style={{
            ...styles.card,
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: isSaving ? 'not-allowed' : 'pointer',
            backgroundColor: isSaving ? '#9CA3AF' : '#10B981',
            color: 'white',
            border: 'none',
            fontWeight: '600',
            opacity: isSaving ? 0.6 : 1
          }}
        >
          {isSaving ? (
            <>
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Saving...</span>
              </div>
              Saving...
            </>
          ) : (
            <>
              <Save size={18} /> Save Schedule
            </>
          )}
        </button>
      </div>

      <h1 style={{ color: '#1E3A8A', fontWeight: '800', marginBottom: '25px' }}>
        <Calendar className="d-inline me-2" size={32} />
        Weekly Warden Schedule
      </h1>

      {/* Shift Capacity Legend */}
      <div style={{ ...styles.card, marginBottom: '20px' }}>
        <div className="row">
          <div className="col-md-6">
            <h6 style={{ color: '#1E3A8A', fontWeight: '700', marginBottom: '10px' }}>
              <Users size={18} className="me-2" />
              Adlam House Requirements
            </h6>
            <div style={{ fontSize: '0.9rem', color: '#64748B' }}>
              <div>• Day Shift (08:00-17:00): <strong>3 Wardens</strong></div>
              <div>• Night Shift (17:00-08:00): <strong>1 Warden</strong></div>
            </div>
          </div>
          <div className="col-md-6">
            <h6 style={{ color: '#1E3A8A', fontWeight: '700', marginBottom: '10px' }}>
              <Users size={18} className="me-2" />
              Nurse Home Requirements
            </h6>
            <div style={{ fontSize: '0.9rem', color: '#64748B' }}>
              <div>• Day Shift (08:00-17:00): <strong>2 Wardens</strong></div>
              <div>• Night Shift (17:00-08:00): <strong>1 Warden</strong></div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Grid */}
      {loading ? (
        <div style={{ ...styles.card, textAlign: 'center', padding: '60px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading schedule...</p>
        </div>
      ) : (
        <div style={styles.scheduleGrid}>
          {/* Header Row */}
          <div style={{ ...styles.headerCell, textAlign: 'left' }}>
            <div style={{ fontWeight: '700', fontSize: '1rem' }}>WARDEN</div>
          </div>
          {daysOfWeek.map(day => (
            <div key={day} style={styles.headerCell}>
              {day.toUpperCase()}
            </div>
          ))}

          {/* Warden Rows */}
          {wardens.map(warden => (
            <React.Fragment key={warden._id}>
              {/* Warden Info Column */}
              <div style={styles.wardenCell}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img 
                    src={warden.photo || warden.avatar || 'https://via.placeholder.com/40'} 
                    style={styles.avatar}
                    alt={warden.username}
                  />
                  <div>
                    <div style={{ fontWeight: '700', color: '#1E293B', fontSize: '0.9rem' }}>
                      {warden.firstName} {warden.lastName}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                      {warden.staffId}
                    </div>
                  </div>
                </div>
              </div>

              {/* Day Cells */}
              {daysOfWeek.map(day => {
                const shift = schedule[warden._id]?.[day];
                const display = getShiftDisplay(shift);

                return (
                  <div key={`${warden._id}-${day}`} style={styles.shiftCell}>
                    {!shift ? (
                      <>
                        <div style={styles.notSetBox}>Not Set</div>
                        <button
                          onClick={() => openSetModal(warden._id, day)}
                          style={styles.btn('#3B82F6', 'white')}
                        >
                          Set Shift
                        </button>
                      </>
                    ) : (
                      <>
                        <div style={{
                          ...styles.shiftBox(display.bgColor),
                          borderColor: display.color
                        }}>
                          <div style={{ 
                            fontWeight: '700', 
                            fontSize: '0.85rem',
                            color: display.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px'
                          }}>
                            {display.shiftType === 'day' && <Sun size={14} />}
                            {display.shiftType === 'night' && <Moon size={14} />}
                            {display.label}
                          </div>
                          {display.time && (
                            <div style={{ 
                              fontSize: '0.75rem', 
                              color: '#64748B',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px'
                            }}>
                              <Clock size={12} />
                              {display.time}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => openChangeModal(warden._id, day)}
                          style={styles.btn('#F59E0B', 'white')}
                        >
                          Change
                        </button>
                      </>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Shift Assignment Modal */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h4 style={{ color: '#1E3A8A', margin: 0 }}>
                {modalMode === 'set' ? 'Assign Shift' : 'Modify Shift'}
              </h4>
              <X style={{ cursor: 'pointer' }} onClick={closeModal} />
            </div>

            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#F0F9FF', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.85rem', color: '#64748B' }}>
                <strong style={{ color: '#1E3A8A' }}>
                  {wardens.find(w => w._id === selectedSlot.wardenId)?.firstName}{' '}
                  {wardens.find(w => w._id === selectedSlot.wardenId)?.lastName}
                </strong>
                <div>{selectedSlot.day}</div>
              </div>
            </div>

            {/* Status Selection */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontWeight: '600', color: '#1E3A8A', marginBottom: '8px', display: 'block' }}>
                Status
              </label>
              <select
                value={shiftForm.status}
                onChange={(e) => setShiftForm({ ...shiftForm, status: e.target.value })}
                style={styles.input}
              >
                <option value="active">Active - Assign Shift</option>
                <option value="off">Day Off</option>
                <option value="leave">On Leave</option>
              </select>
            </div>

            {shiftForm.status === 'active' && (
              <>
                {/* House Selection */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontWeight: '600', color: '#1E3A8A', marginBottom: '8px', display: 'block' }}>
                    House Assignment
                  </label>
                  <select
                    value={shiftForm.house}
                    onChange={(e) => setShiftForm({ ...shiftForm, house: e.target.value })}
                    style={styles.input}
                  >
                    <option value="">Select House...</option>
                    <option value="Adlam House">Adlam House</option>
                    <option value="Nurse Home">Nurse Home</option>
                  </select>
                </div>

                {/* Shift Selection */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontWeight: '600', color: '#1E3A8A', marginBottom: '8px', display: 'block' }}>
                    Shift Time
                  </label>
                  <select
                    value={shiftForm.shift}
                    onChange={(e) => setShiftForm({ ...shiftForm, shift: e.target.value })}
                    style={styles.input}
                  >
                    <option value="">Select Shift...</option>
                    <option value="day">Day Shift (08:00 - 17:00)</option>
                    <option value="night">Night Shift (17:00 - 08:00)</option>
                  </select>
                </div>
              </>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleSubmitShift}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#10B981',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Confirm
              </button>
              <button
                onClick={closeModal}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #E1E8F0',
                  backgroundColor: 'white',
                  color: '#64748B',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSchedule;