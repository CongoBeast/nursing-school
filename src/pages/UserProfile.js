import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Fingerprint, MapPin, Edit3, Camera, ShieldCheck } from 'lucide-react';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Load user data based on type
  useEffect(() => {
    const type = localStorage.getItem('userType') || 'student'; // Default to student
    const mockData = {
      name: "Tariro Moyo",
      role: type.charAt(0).toUpperCase() + type.slice(1),
      id: type === 'admin' ? 'ADM-9920' : type === 'staff' ? 'STF-4412' : 'STD-2024-088',
      email: "t.moyo@zimnursing.ac.zw",
      phone: "+263 77 123 4567",
      gender: "Female",
      nationalId: "63-228491-X-45",
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tariro"
    };
    setUser(mockData);
  }, []);

  if (!user) return null;

  const colors = {
    primary: '#1E3A8A', // Navy Blue
    secondary: '#3B82F6', // Royal Blue
    accent: '#DBEAFE', // Sky Blue
    text: '#1E293B'
  };

  return (
    <div style={{ backgroundColor: '#F0F7FF', minHeight: '100vh', padding: '40px 20px' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        
        {/* Profile Header Card */}
        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '20px', overflow: 'hidden' }}>
          <div style={{ height: '120px', background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})` }}></div>
          <div className="card-body text-center position-relative" style={{ marginTop: '-60px' }}>
            <div className="position-relative d-inline-block">
              <img 
                src={user.photo} 
                alt="Profile" 
                className="rounded-circle border border-4 border-white shadow-sm" 
                style={{ width: '120px', height: '120px', backgroundColor: 'white' }} 
              />
              <button className="btn btn-sm btn-light position-absolute bottom-0 end-0 rounded-circle shadow-sm">
                <Camera size={16} />
              </button>
            </div>
            <h3 className="mt-3 fw-bold" style={{ color: colors.primary }}>{user.name}</h3>
            <span className="badge px-3 py-2" style={{ backgroundColor: colors.accent, color: colors.primary, borderRadius: '20px' }}>
              <ShieldCheck size={14} className="me-1" /> {user.role}
            </span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="row g-4">
          <div className="col-md-8">
            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '15px' }}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0" style={{ color: colors.primary }}>Personal Information</h5>
                <button 
                  className="btn btn-sm d-flex align-items-center" 
                  style={{ color: colors.secondary, fontWeight: '600' }}
                  onClick={() => setShowEditModal(true)}
                >
                  <Edit3 size={16} className="me-1" /> Edit Profile
                </button>
              </div>

              <div className="row">
                <InfoItem icon={<Fingerprint size={20} />} label="ID Number" value={user.id} />
                <InfoItem icon={<Mail size={20} />} label="Email Address" value={user.email} />
                <InfoItem icon={<Phone size={20} />} label="Phone Number" value={user.phone} />
                <InfoItem icon={<User size={20} />} label="Gender" value={user.gender} />
                <InfoItem icon={<MapPin size={20} />} label="National ID" value={user.nationalId} />
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm p-4 text-white" style={{ borderRadius: '15px', background: colors.primary }}>
              <h6>Account Status</h6>
              <p className="small opacity-75">Your account is verified and active within the Zimbabwe Nursing School portal.</p>
              <hr className="opacity-25" />
              <div className="d-flex justify-content-between align-items-center">
                <span>Portal Access</span>
                <span className="badge bg-success">Full Access</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- EDIT MODAL --- */}
        {showEditModal && (
          <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content" style={{ borderRadius: '15px', border: 'none' }}>
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title fw-bold" style={{ color: colors.primary }}>Edit Personal Details</h5>
                  <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                </div>
                <div className="modal-body p-4">
                  <form>
                    <div className="mb-3">
                      <label className="form-label small fw-bold">Email Address</label>
                      <input type="email" className="form-control" defaultValue={user.email} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-bold">Phone Number</label>
                      <input type="text" className="form-control" defaultValue={user.phone} />
                    </div>
                    <div className="mb-4">
                      <label className="form-label small fw-bold">Current Address (Optional)</label>
                      <textarea className="form-control" rows="2"></textarea>
                    </div>
                    <button type="button" className="btn w-100 py-2 fw-bold" style={{ backgroundColor: colors.primary, color: 'white' }}>
                      Save Changes
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper Component for Info Rows
const InfoItem = ({ icon, label, value }) => (
  <div className="col-sm-6 mb-4">
    <div className="d-flex align-items-center">
      <div className="me-3 p-2 rounded-3" style={{ backgroundColor: '#F0F7FF', color: '#3B82F6' }}>
        {icon}
      </div>
      <div>
        <label className="d-block small text-muted mb-0">{label}</label>
        <span className="fw-bold text-dark">{value}</span>
      </div>
    </div>
  </div>
);

export default UserProfile;