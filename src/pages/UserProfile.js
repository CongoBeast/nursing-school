import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Fingerprint, MapPin, Edit3, Camera, ShieldCheck } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [editForm, setEditForm] = useState({
    email: '',
    phone: '',
    address: ''
  });

  // Fetch user data from database
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const username = localStorage.getItem('user');
      
      if (!username) {
        toast.error('No user logged in');
        return;
      }

      const response = await fetch(`https://nursing-school-backend--thomasmethembe4.replit.app/get-user/${username}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      setUser(data);
      
      // Populate edit form with current data
      setEditForm({
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || ''
      });

    } catch (error) {
      console.error('Error fetching user:', error);
      toast.error('Failed to load user profile', {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const username = localStorage.getItem('user');

      console.log(username)

      const response = await fetch(`https://nursing-school-backend--thomasmethembe4.replit.app/update-user/${username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm)
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Profile updated successfully!', {
          position: "top-right",
          autoClose: 3000,
        });
        setShowEditModal(false);
        fetchUserData(); // Refresh user data
      } else {
        toast.error('Failed to update profile', {
          position: "top-right",
          autoClose: 3000,
        });
      }

    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile', {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const colors = {
    primary: '#1E3A8A',
    secondary: '#3B82F6',
    accent: '#DBEAFE',
    text: '#1E293B'
  };

  // Loading state
  if (loading) {
    return (
      <div style={{ 
        backgroundColor: '#F0F7FF', 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexDirection: 'column'
      }}>
        <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem', color: colors.primary }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p style={{ marginTop: '20px', fontSize: '1.1rem', fontWeight: '500', color: colors.primary }}>
          Loading profile...
        </p>
      </div>
    );
  }

  // No user found state
  if (!user) {
    return (
      <div style={{ 
        backgroundColor: '#F0F7FF', 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexDirection: 'column',
        padding: '20px'
      }}>
        <User size={64} color="#93C5FD" style={{ marginBottom: '20px' }} />
        <h4 style={{ color: colors.primary, marginBottom: '10px' }}>User Not Found</h4>
        <p style={{ color: '#6B7280' }}>Unable to load user profile. Please try logging in again.</p>
      </div>
    );
  }

  // Helper to get user role display
  const getUserRole = () => {
    const userType = localStorage.getItem('userType') || 'student';
    return userType.charAt(0).toUpperCase() + userType.slice(1);
  };

  // Helper to get user ID format
  const getUserIdFormat = () => {
    const userType = localStorage.getItem('userType') || 'student';
    if (userType === 'admin') return user.adminId || user._id;
    if (userType === 'staff') return user.staffId || user._id;
    return user.studentId || user._id;
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
                src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} 
                alt="Profile" 
                className="rounded-circle border border-4 border-white shadow-sm" 
                style={{ width: '120px', height: '120px', backgroundColor: 'white' }} 
              />
              <button className="btn btn-sm btn-light position-absolute bottom-0 end-0 rounded-circle shadow-sm">
                <Camera size={16} />
              </button>
            </div>
            <h3 className="mt-3 fw-bold" style={{ color: colors.primary }}>
              {user.fullName || user.username}
            </h3>
            <span className="badge px-3 py-2" style={{ backgroundColor: colors.accent, color: colors.primary, borderRadius: '20px' }}>
              <ShieldCheck size={14} className="me-1" /> {getUserRole()}
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
                <InfoItem 
                  icon={<User size={20} />} 
                  label="Username" 
                  value={user.username} 
                />
                <InfoItem 
                  icon={<Fingerprint size={20} />} 
                  label="ID Number" 
                  value={getUserIdFormat()} 
                />
                <InfoItem 
                  icon={<Mail size={20} />} 
                  label="Email Address" 
                  value={user.email || 'Not provided'} 
                />
                <InfoItem 
                  icon={<Phone size={20} />} 
                  label="Phone Number" 
                  value={user.phoneNumber || 'Not provided'} 
                />
                <InfoItem 
                  icon={<User size={20} />} 
                  label="Gender" 
                  value={user.gender || 'Not specified'} 
                />
                <InfoItem 
                  icon={<MapPin size={20} />} 
                  label="Address" 
                  value={user.address || 'Not provided'} 
                />
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
                <span className="badge bg-success">
                  {user.isLoggedOn ? 'Active' : 'Full Access'}
                </span>
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
                  <form onSubmit={handleUpdateProfile}>
                    <div className="mb-3">
                      <label className="form-label small fw-bold">Email Address</label>
                      <input 
                        type="email" 
                        className="form-control" 
                        value={editForm.email}
                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-bold">Phone Number</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={editForm.phone}
                        onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="form-label small fw-bold">Current Address (Optional)</label>
                      <textarea 
                        className="form-control" 
                        rows="2"
                        value={editForm.address}
                        onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                      ></textarea>
                    </div>
                    <button 
                      type="submit" 
                      className="btn w-100 py-2 fw-bold" 
                      style={{ 
                        backgroundColor: isUpdating ? '#93C5FD' : colors.primary, 
                        color: 'white' 
                      }}
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <ToastContainer />
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