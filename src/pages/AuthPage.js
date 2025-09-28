// import React, { useState } from 'react';
// import { User, Lock, Mail, Phone, UserCheck, Stethoscope, Shield, Heart, Eye, EyeOff, Upload, Calendar, MapPin } from 'lucide-react';

// const AuthPage = () => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [avatarFile, setAvatarFile] = useState(null);
//   const [avatarPreview, setAvatarPreview] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [message, setMessage] = useState('');

//   const [formData, setFormData] = useState({
//     username: '',
//     password: '',
//     email: '',
//     confirmPassword: '',
//     phoneNumber: { countryCode: '+263', number: '' },
//     firstName: '',
//     lastName: '',
//     dateOfBirth: '',
//     gender: 'male',
//     userType: 'patient',
//     specialization: '',
//     licenseNumber: '',
//     department: '',
//     nationalId: '',
//     address: '',
//     emergencyContact: { name: '', phone: '' },
//     avatar: '',
//     accountStatus: true
//   });

//   const userTypes = [
//     { value: 'patient', label: 'Patient', icon: <Heart size={20} />, color: '#4A9782' },
//     { value: 'doctor', label: 'Doctor', icon: <Stethoscope size={20} />, color: '#004030' },
//     { value: 'admin', label: 'Administrator', icon: <Shield size={20} />, color: '#DCD0A8' }
//   ];

//   const countryCodes = [
//     { value: '+263', label: '+263 (Zimbabwe)' },
//     { value: '+27', label: '+27 (South Africa)' },
//     { value: '+260', label: '+260 (Zambia)' },
//     { value: '+1', label: '+1 (USA)' },
//     { value: '+44', label: '+44 (UK)' }
//   ];

//   const handleToggle = (loginState) => {
//     setIsLogin(loginState);
//     setError('');
//     setMessage('');
//     if (loginState) {
//       // Reset registration-specific fields when switching to login
//       setFormData(prev => ({
//         ...prev,
//         email: '',
//         confirmPassword: '',
//         firstName: '',
//         lastName: '',
//         dateOfBirth: '',
//         specialization: '',
//         licenseNumber: '',
//         department: '',
//         nationalId: '',
//         address: '',
//         emergencyContact: { name: '', phone: '' }
//       }));
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name === 'countryCode' || name === 'number') {
//       setFormData(prev => ({
//         ...prev,
//         phoneNumber: { ...prev.phoneNumber, [name]: value }
//       }));
//     } else if (name === 'emergencyName' || name === 'emergencyPhone') {
//       const field = name === 'emergencyName' ? 'name' : 'phone';
//       setFormData(prev => ({
//         ...prev,
//         emergencyContact: { ...prev.emergencyContact, [field]: value }
//       }));
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleAvatarChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setAvatarFile(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setAvatarPreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const validateForm = () => {
//     if (!formData.username || !formData.password) {
//       setError('Username and password are required');
//       return false;
//     }

//     if (!isLogin) {
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!emailRegex.test(formData.email)) {
//         setError('Please enter a valid email address');
//         return false;
//       }
//       if (formData.password !== formData.confirmPassword) {
//         setError('Passwords do not match');
//         return false;
//       }
//       if (formData.password.length < 6) {
//         setError('Password must be at least 6 characters long');
//         return false;
//       }
//       if (!formData.firstName || !formData.lastName) {
//         setError('First name and last name are required');
//         return false;
//       }
//       if (formData.userType === 'doctor' && (!formData.specialization || !formData.licenseNumber)) {
//         setError('Specialization and license number are required for doctors');
//         return false;
//       }
//     }
//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       let avatarUrl = '';

//       // Upload avatar if present and registering
//       if (!isLogin && avatarFile) {
//         const formDataImage = new FormData();
//         formDataImage.append('image', avatarFile);

//         // Replace with your upload endpoint
//         const uploadRes = await fetch('http://localhost:3001/upload', {
//           method: 'POST',
//           body: formDataImage,
//         });

//         if (uploadRes.ok) {
//           const uploadData = await uploadRes.json();
//           avatarUrl = uploadData.url;
//         }
//       }

//       const endpoint = isLogin ? 'login' : 'register';
//       const requestData = {
//         ...formData,
//         avatar: avatarUrl,
//         phoneNumber: `${formData.phoneNumber.countryCode}${formData.phoneNumber.number}`,
//         registrationDate: !isLogin ? new Date().toISOString() : formData.registrationDate,
//         lastLoggedIn: new Date().toISOString(),
//       };

//       const response = await fetch(`http://localhost:3001/${endpoint}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(requestData),
//       });

//       const data = await response.json();

//       if (response.ok && data.token) {
//         localStorage.setItem('token', data.token);
//         localStorage.setItem('user', formData.username);
//         localStorage.setItem('userType', formData.userType);
//         setMessage('Authentication successful! Redirecting...');
        
//         // Simulate navigation - replace with your routing solution
//         setTimeout(() => {
//           console.log('Redirecting to dashboard...');
//         }, 2000);
//       } else {
//         setError(data.message || 'Authentication failed');
//       }
//     } catch (error) {
//       setError('Network error. Please try again.');
//       console.error('Auth error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const customStyles = `
//     .auth-bg {
//       background: linear-gradient(135deg, #FFF9E5 0%, #DCD0A8 100%);
//       min-height: 100vh;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//     }
//     .auth-container {
//       background-color: white;
//       border-radius: 1.5rem;
//       box-shadow: 0 20px 40px rgba(0,0,0,0.1);
//       overflow: hidden;
//       max-width: 900px;
//       width: 100%;
//       margin: 2rem;
//     }
//     .auth-header {
//       background: linear-gradient(135deg, #004030 0%, #4A9782 100%);
//       color: white;
//       padding: 2rem;
//       text-align: center;
//     }
//     .auth-form {
//       padding: 2rem;
//     }
//     .primary-color { color: #004030; }
//     .secondary-color { color: #4A9782; }
//     .form-control-custom {
//       border: 2px solid #DCD0A8;
//       border-radius: 0.75rem;
//       padding: 0.75rem 1rem;
//       transition: all 0.3s ease;
//     }
//     .form-control-custom:focus {
//       border-color: #4A9782;
//       box-shadow: 0 0 0 0.2rem rgba(74, 151, 130, 0.25);
//       outline: none;
//     }
//     .btn-auth {
//       background: linear-gradient(135deg, #4A9782 0%, #004030 100%);
//       border: none;
//       border-radius: 0.75rem;
//       padding: 0.75rem 2rem;
//       color: white;
//       font-weight: 600;
//       transition: all 0.3s ease;
//       width: 100%;
//     }
//     .btn-auth:hover:not(:disabled) {
//       transform: translateY(-2px);
//       box-shadow: 0 8px 25px rgba(74, 151, 130, 0.3);
//       color: white;
//     }
//     .btn-auth:disabled {
//       opacity: 0.7;
//       cursor: not-allowed;
//     }
//     .toggle-btn {
//       background-color: transparent;
//       border: 2px solid #DCD0A8;
//       color: #004030;
//       padding: 0.5rem 1.5rem;
//       border-radius: 2rem;
//       font-weight: 500;
//       transition: all 0.3s ease;
//       cursor: pointer;
//     }
//     .toggle-btn.active {
//       background-color: #4A9782;
//       border-color: #4A9782;
//       color: white;
//     }
//     .toggle-btn:hover {
//       border-color: #4A9782;
//       color: #4A9782;
//     }
//     .toggle-btn.active:hover {
//       color: white;
//     }
//     .user-type-card {
//       border: 2px solid #DCD0A8;
//       border-radius: 0.75rem;
//       padding: 1rem;
//       text-align: center;
//       cursor: pointer;
//       transition: all 0.3s ease;
//       background-color: white;
//     }
//     .user-type-card:hover {
//       border-color: #4A9782;
//       transform: translateY(-2px);
//       box-shadow: 0 8px 25px rgba(0,0,0,0.1);
//     }
//     .user-type-card.selected {
//       border-color: #4A9782;
//       background-color: #4A9782;
//       color: white;
//     }
//     .input-group-custom {
//       position: relative;
//     }
//     .input-icon {
//       position: absolute;
//       left: 1rem;
//       top: 50%;
//       transform: translateY(-50%);
//       color: #4A9782;
//       z-index: 10;
//     }
//     .input-with-icon {
//       padding-left: 3rem;
//     }
//     .password-toggle {
//       position: absolute;
//       right: 1rem;
//       top: 50%;
//       transform: translateY(-50%);
//       background: none;
//       border: none;
//       color: #4A9782;
//       cursor: pointer;
//       z-index: 10;
//     }
//     .avatar-upload {
//       width: 100px;
//       height: 100px;
//       border-radius: 50%;
//       border: 3px dashed #DCD0A8;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       margin: 0 auto 1rem;
//       cursor: pointer;
//       transition: all 0.3s ease;
//       overflow: hidden;
//       position: relative;
//     }
//     .avatar-upload:hover {
//       border-color: #4A9782;
//     }
//     .avatar-preview {
//       width: 100%;
//       height: 100%;
//       object-fit: cover;
//       border-radius: 50%;
//     }
//     .alert-custom {
//       border-radius: 0.75rem;
//       border: none;
//       padding: 1rem 1.5rem;
//       margin-bottom: 1rem;
//     }
//     .alert-danger-custom {
//       background-color: #fef2f2;
//       color: #dc2626;
//       border-left: 4px solid #dc2626;
//     }
//     .alert-success-custom {
//       background-color: #f0fdf4;
//       color: #16a34a;
//       border-left: 4px solid #16a34a;
//     }
//     .form-row {
//       display: grid;
//       grid-template-columns: 1fr 1fr;
//       gap: 1rem;
//     }
//     @media (max-width: 768px) {
//       .form-row {
//         grid-template-columns: 1fr;
//       }
//       .auth-container {
//         margin: 1rem;
//       }
//       .auth-form {
//         padding: 1.5rem;
//       }
//     }
//   `;

//   return (
//     <>
//       <style>{customStyles}</style>
//       <div className="auth-bg">
//         <div className="auth-container">
//           {/* Header */}
//           <div className="auth-header">
//             <h1 className="h2 fw-bold mb-2">
//               Zimbabwe National Health System
//             </h1>
//             <p className="mb-4 opacity-90">
//               Secure access to healthcare management platform
//             </p>
            
//             {/* Toggle Buttons */}
//             <div className="d-flex justify-content-center gap-3">
//               <button
//                 className={`toggle-btn ${isLogin ? 'active' : ''}`}
//                 onClick={() => handleToggle(true)}
//               >
//                 Sign In
//               </button>
//               <button
//                 className={`toggle-btn ${!isLogin ? 'active' : ''}`}
//                 onClick={() => handleToggle(false)}
//               >
//                 Sign Up
//               </button>
//             </div>
//           </div>

//           {/* Form */}
//           <div className="auth-form">
//             {error && (
//               <div className="alert-custom alert-danger-custom">
//                 {error}
//               </div>
//             )}
//             {message && (
//               <div className="alert-custom alert-success-custom">
//                 {message}
//               </div>
//             )}

//             <form onSubmit={handleSubmit}>
//               {/* User Type Selection (Registration Only) */}
//               {!isLogin && (
//                 <div className="mb-4">
//                   <label className="form-label fw-medium primary-color mb-3">
//                     I am registering as:
//                   </label>
//                   <div className="row g-3">
//                     {userTypes.map((type) => (
//                       <div key={type.value} className="col-12 col-md-4">
//                         <div
//                           className={`user-type-card ${formData.userType === type.value ? 'selected' : ''}`}
//                           onClick={() => setFormData(prev => ({ ...prev, userType: type.value }))}
//                         >
//                           <div className="mb-2" style={{ color: formData.userType === type.value ? 'white' : type.color }}>
//                             {type.icon}
//                           </div>
//                           <div className="fw-medium">{type.label}</div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Avatar Upload (Registration Only) */}
//               {!isLogin && (
//                 <div className="mb-4 text-center">
//                   <label className="form-label fw-medium primary-color d-block mb-2">
//                     Profile Picture
//                   </label>
//                   <div className="avatar-upload" onClick={() => document.getElementById('avatar-input').click()}>
//                     {avatarPreview ? (
//                       <img src={avatarPreview} alt="Avatar preview" className="avatar-preview" />
//                     ) : (
//                       <Upload className="secondary-color" size={24} />
//                     )}
//                   </div>
//                   <input
//                     id="avatar-input"
//                     type="file"
//                     accept="image/*"
//                     onChange={handleAvatarChange}
//                     style={{ display: 'none' }}
//                   />
//                   <small className="text-muted">Click to upload profile picture</small>
//                 </div>
//               )}

//               {/* Name Fields (Registration Only) */}
//               {!isLogin && (
//                 <div className="form-row mb-3">
//                   <div className="input-group-custom">
//                     <User className="input-icon" size={18} />
//                     <input
//                       type="text"
//                       className="form-control form-control-custom input-with-icon"
//                       placeholder="First Name"
//                       name="firstName"
//                       value={formData.firstName}
//                       onChange={handleChange}
//                       required={!isLogin}
//                     />
//                   </div>
//                   <div className="input-group-custom">
//                     <User className="input-icon" size={18} />
//                     <input
//                       type="text"
//                       className="form-control form-control-custom input-with-icon"
//                       placeholder="Last Name"
//                       name="lastName"
//                       value={formData.lastName}
//                       onChange={handleChange}
//                       required={!isLogin}
//                     />
//                   </div>
//                 </div>
//               )}

//               {/* Email (Registration Only) */}
//               {!isLogin && (
//                 <div className="mb-3">
//                   <div className="input-group-custom">
//                     <Mail className="input-icon" size={18} />
//                     <input
//                       type="email"
//                       className="form-control form-control-custom input-with-icon"
//                       placeholder="Email Address"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleChange}
//                       required={!isLogin}
//                     />
//                   </div>
//                 </div>
//               )}

//               {/* Username */}
//               <div className="mb-3">
//                 <div className="input-group-custom">
//                   <UserCheck className="input-icon" size={18} />
//                   <input
//                     type="text"
//                     className="form-control form-control-custom input-with-icon"
//                     placeholder="Username"
//                     name="username"
//                     value={formData.username}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Password */}
//               <div className="mb-3">
//                 <div className="input-group-custom">
//                   <Lock className="input-icon" size={18} />
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     className="form-control form-control-custom input-with-icon"
//                     placeholder="Password"
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     required
//                     style={{ paddingRight: '3rem' }}
//                   />
//                   <button
//                     type="button"
//                     className="password-toggle"
//                     onClick={() => setShowPassword(!showPassword)}
//                   >
//                     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                   </button>
//                 </div>
//               </div>

//               {/* Confirm Password (Registration Only) */}
//               {!isLogin && (
//                 <div className="mb-3">
//                   <div className="input-group-custom">
//                     <Lock className="input-icon" size={18} />
//                     <input
//                       type={showConfirmPassword ? "text" : "password"}
//                       className="form-control form-control-custom input-with-icon"
//                       placeholder="Confirm Password"
//                       name="confirmPassword"
//                       value={formData.confirmPassword}
//                       onChange={handleChange}
//                       required={!isLogin}
//                       style={{ paddingRight: '3rem' }}
//                     />
//                     <button
//                       type="button"
//                       className="password-toggle"
//                       onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     >
//                       {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {/* Additional Registration Fields */}
//               {!isLogin && (
//                 <>
//                   {/* Phone Number */}
//                   <div className="mb-3">
//                     <div className="form-row">
//                       <div className="input-group-custom">
//                         <Phone className="input-icon" size={18} />
//                         <select
//                           className="form-control form-control-custom input-with-icon"
//                           name="countryCode"
//                           value={formData.phoneNumber.countryCode}
//                           onChange={handleChange}
//                         >
//                           {countryCodes.map((code) => (
//                             <option key={code.value} value={code.value}>
//                               {code.label}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                       <div className="input-group-custom">
//                         <input
//                           type="tel"
//                           className="form-control form-control-custom"
//                           placeholder="Phone Number"
//                           name="number"
//                           value={formData.phoneNumber.number}
//                           onChange={handleChange}
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   {/* Date of Birth and Gender */}
//                   <div className="form-row mb-3">
//                     <div className="input-group-custom">
//                       <Calendar className="input-icon" size={18} />
//                       <input
//                         type="date"
//                         className="form-control form-control-custom input-with-icon"
//                         name="dateOfBirth"
//                         value={formData.dateOfBirth}
//                         onChange={handleChange}
//                       />
//                     </div>
//                     <div className="input-group-custom">
//                       <select
//                         className="form-control form-control-custom"
//                         name="gender"
//                         value={formData.gender}
//                         onChange={handleChange}
//                       >
//                         <option value="male">Male</option>
//                         <option value="female">Female</option>
//                         <option value="other">Other</option>
//                       </select>
//                     </div>
//                   </div>

//                   {/* National ID */}
//                   <div className="mb-3">
//                     <div className="input-group-custom">
//                       <UserCheck className="input-icon" size={18} />
//                       <input
//                         type="text"
//                         className="form-control form-control-custom input-with-icon"
//                         placeholder="National ID Number"
//                         name="nationalId"
//                         value={formData.nationalId}
//                         onChange={handleChange}
//                       />
//                     </div>
//                   </div>

//                   {/* Address */}
//                   <div className="mb-3">
//                     <div className="input-group-custom">
//                       <MapPin className="input-icon" size={18} />
//                       <textarea
//                         className="form-control form-control-custom input-with-icon"
//                         placeholder="Home Address"
//                         name="address"
//                         value={formData.address}
//                         onChange={handleChange}
//                         rows="2"
//                       />
//                     </div>
//                   </div>

//                   {/* Doctor-specific fields */}
//                   {formData.userType === 'doctor' && (
//                     <>
//                       <div className="form-row mb-3">
//                         <div className="input-group-custom">
//                           <Stethoscope className="input-icon" size={18} />
//                           <input
//                             type="text"
//                             className="form-control form-control-custom input-with-icon"
//                             placeholder="Specialization"
//                             name="specialization"
//                             value={formData.specialization}
//                             onChange={handleChange}
//                             required
//                           />
//                         </div>
//                         <div className="input-group-custom">
//                           <input
//                             type="text"
//                             className="form-control form-control-custom"
//                             placeholder="License Number"
//                             name="licenseNumber"
//                             value={formData.licenseNumber}
//                             onChange={handleChange}
//                             required
//                           />
//                         </div>
//                       </div>
//                       <div className="mb-3">
//                         <div className="input-group-custom">
//                           <input
//                             type="text"
//                             className="form-control form-control-custom"
//                             placeholder="Department"
//                             name="department"
//                             value={formData.department}
//                             onChange={handleChange}
//                           />
//                         </div>
//                       </div>
//                     </>
//                   )}

//                   {/* Emergency Contact */}
//                   <div className="mb-3">
//                     <label className="form-label fw-medium primary-color mb-2">
//                       Emergency Contact
//                     </label>
//                     <div className="form-row">
//                       <div className="input-group-custom">
//                         <User className="input-icon" size={18} />
//                         <input
//                           type="text"
//                           className="form-control form-control-custom input-with-icon"
//                           placeholder="Contact Name"
//                           name="emergencyName"
//                           value={formData.emergencyContact.name}
//                           onChange={handleChange}
//                         />
//                       </div>
//                       <div className="input-group-custom">
//                         <Phone className="input-icon" size={18} />
//                         <input
//                           type="tel"
//                           className="form-control form-control-custom input-with-icon"
//                           placeholder="Contact Phone"
//                           name="emergencyPhone"
//                           value={formData.emergencyContact.phone}
//                           onChange={handleChange}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </>
//               )}

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 className="btn-auth"
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <div className="d-flex align-items-center justify-content-center">
//                     <div className="spinner-border spinner-border-sm me-2" role="status">
//                       <span className="visually-hidden">Loading...</span>
//                     </div>
//                     Processing...
//                   </div>
//                 ) : (
//                   isLogin ? 'Sign In' : 'Create Account'
//                 )}
//               </button>

//               {/* Additional Links */}
//               <div className="text-center mt-3">
//                 {isLogin ? (
//                   <p className="small secondary-color mb-0">
//                     Don't have an account?{' '}
//                     <button
//                       type="button"
//                       className="btn btn-link p-0 secondary-color fw-medium text-decoration-none"
//                       onClick={() => handleToggle(false)}
//                     >
//                       Sign up here
//                     </button>
//                   </p>
//                 ) : (
//                   <p className="small secondary-color mb-0">
//                     Already have an account?{' '}
//                     <button
//                       type="button"
//                       className="btn btn-link p-0 secondary-color fw-medium text-decoration-none"
//                       onClick={() => handleToggle(true)}
//                     >
//                       Sign in here
//                     </button>
//                   </p>
//                 )}
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default AuthPage;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Mail, Phone, UserCheck, Stethoscope, Shield, Heart, Eye, EyeOff, Upload, Calendar, MapPin } from 'lucide-react';

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    confirmPassword: '',
    phoneNumber: { countryCode: '+263', number: '' },
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'male',
    userType: 'patient',
    specialization: '',
    licenseNumber: '',
    department: '',
    nationalId: '',
    address: '',
    emergencyContact: { name: '', phone: '' },
    avatar: '',
    accountStatus: true
  });

  const userTypes = [
    { value: 'patient', label: 'Patient', icon: <Heart size={20} />, color: '#4A9782' },
    { value: 'doctor', label: 'Doctor', icon: <Stethoscope size={20} />, color: '#004030' },
    { value: 'admin', label: 'Administrator', icon: <Shield size={20} />, color: '#DCD0A8' }
  ];

  const countryCodes = [
    { value: '+263', label: '+263 (Zimbabwe)' },
    { value: '+27', label: '+27 (South Africa)' },
    { value: '+260', label: '+260 (Zambia)' },
    { value: '+1', label: '+1 (USA)' },
    { value: '+44', label: '+44 (UK)' }
  ];

  const handleToggle = (loginState) => {
    setIsLogin(loginState);
    setError('');
    setMessage('');
    if (loginState) {
      // Reset registration-specific fields when switching to login
      setFormData(prev => ({
        ...prev,
        email: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        specialization: '',
        licenseNumber: '',
        department: '',
        nationalId: '',
        address: '',
        emergencyContact: { name: '', phone: '' }
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'countryCode' || name === 'number') {
      setFormData(prev => ({
        ...prev,
        phoneNumber: { ...prev.phoneNumber, [name]: value }
      }));
    } else if (name === 'emergencyName' || name === 'emergencyPhone') {
      const field = name === 'emergencyName' ? 'name' : 'phone';
      setFormData(prev => ({
        ...prev,
        emergencyContact: { ...prev.emergencyContact, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (!formData.username || !formData.password) {
      setError('Username and password are required');
      return false;
    }

    if (!formData.userType) {
      setError('Please select an account type');
      return false;
    }

    if (!isLogin) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return false;
      }
      if (!formData.firstName || !formData.lastName) {
        setError('First name and last name are required');
        return false;
      }
      if (formData.userType === 'doctor' && (!formData.specialization || !formData.licenseNumber)) {
        setError('Specialization and license number are required for doctors');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      let avatarUrl = '';

      // Upload avatar if present and registering
      if (!isLogin && avatarFile) {
        const formDataImage = new FormData();
        formDataImage.append('image', avatarFile);

        // Replace with your upload endpoint
        const uploadRes = await fetch('https://national-health-system-backend.onrender.com/upload', {
          method: 'POST',
          body: formDataImage,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          avatarUrl = uploadData.url;
        }
      }

      const endpoint = isLogin ? 'login' : 'register';
      const requestData = {
        ...formData,
        avatar: avatarUrl,
        phoneNumber: `${formData.phoneNumber.countryCode}${formData.phoneNumber.number}`,
        registrationDate: !isLogin ? new Date().toISOString() : formData.registrationDate,
        lastLoggedIn: new Date().toISOString(),
      };

      const response = await fetch(`https://national-health-system-backend.onrender.com/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Store authentication data in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', formData.username);
        localStorage.setItem('userType', formData.userType);
        
        setMessage('Authentication successful! Redirecting...');
        
        // Navigate to home route after successful authentication
        setTimeout(() => {
          if(localStorage.userType === "patient"){
              navigate('/patient');
          }
          else if(localStorage.userType === "admin"){
              navigate('/');
          }
          else{
              navigate('/doctor');
          }
          
        }, 1500);
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const customStyles = `
    .auth-bg {
      background: linear-gradient(135deg, #FFF9E5 0%, #DCD0A8 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .auth-container {
      background-color: white;
      border-radius: 1.5rem;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      overflow: hidden;
      max-width: 900px;
      width: 100%;
      margin: 2rem;
    }
    .auth-header {
      background: linear-gradient(135deg, #004030 0%, #4A9782 100%);
      color: white;
      padding: 2rem;
      text-align: center;
    }
    .auth-form {
      padding: 2rem;
    }
    .primary-color { color: #004030; }
    .secondary-color { color: #4A9782; }
    .form-control-custom {
      border: 2px solid #DCD0A8;
      border-radius: 0.75rem;
      padding: 0.75rem 1rem;
      transition: all 0.3s ease;
    }
    .form-control-custom:focus {
      border-color: #4A9782;
      box-shadow: 0 0 0 0.2rem rgba(74, 151, 130, 0.25);
      outline: none;
    }
    .btn-auth {
      background: linear-gradient(135deg, #4A9782 0%, #004030 100%);
      border: none;
      border-radius: 0.75rem;
      padding: 0.75rem 2rem;
      color: white;
      font-weight: 600;
      transition: all 0.3s ease;
      width: 100%;
    }
    .btn-auth:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(74, 151, 130, 0.3);
      color: white;
    }
    .btn-auth:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    .toggle-btn {
      background-color: transparent;
      border: 2px solid #DCD0A8;
      color: #004030;
      padding: 0.5rem 1.5rem;
      border-radius: 2rem;
      font-weight: 500;
      transition: all 0.3s ease;
      cursor: pointer;
    }
    .toggle-btn.active {
      background-color: #4A9782;
      border-color: #4A9782;
      color: white;
    }
    .toggle-btn:hover {
      border-color: #4A9782;
      color: #4A9782;
    }
    .toggle-btn.active:hover {
      color: white;
    }
    .user-type-card {
      border: 2px solid #DCD0A8;
      border-radius: 0.75rem;
      padding: 1rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      background-color: white;
    }
    .user-type-card:hover {
      border-color: #4A9782;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.1);
    }
    .user-type-card.selected {
      border-color: #4A9782;
      background-color: #4A9782;
      color: white;
    }
    .input-group-custom {
      position: relative;
    }
    .input-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #4A9782;
      z-index: 10;
    }
    .input-with-icon {
      padding-left: 3rem;
    }
    .password-toggle {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: #4A9782;
      cursor: pointer;
      z-index: 10;
    }
    .avatar-upload {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      border: 3px dashed #DCD0A8;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      overflow: hidden;
      position: relative;
    }
    .avatar-upload:hover {
      border-color: #4A9782;
    }
    .avatar-preview {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }
    .alert-custom {
      border-radius: 0.75rem;
      border: none;
      padding: 1rem 1.5rem;
      margin-bottom: 1rem;
    }
    .alert-danger-custom {
      background-color: #fef2f2;
      color: #dc2626;
      border-left: 4px solid #dc2626;
    }
    .alert-success-custom {
      background-color: #f0fdf4;
      color: #16a34a;
      border-left: 4px solid #16a34a;
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    .account-type-dropdown {
      background-color: white;
      border: 2px solid #DCD0A8;
      border-radius: 0.75rem;
      padding: 0.75rem 1rem;
      transition: all 0.3s ease;
      appearance: none;
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%234A9782' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
      background-position: right 0.75rem center;
      background-repeat: no-repeat;
      background-size: 1.5em 1.5em;
      padding-right: 3rem;
    }
    .account-type-dropdown:focus {
      border-color: #4A9782;
      box-shadow: 0 0 0 0.2rem rgba(74, 151, 130, 0.25);
      outline: none;
    }
    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }
      .auth-container {
        margin: 1rem;
      }
      .auth-form {
        padding: 1.5rem;
      }
    }
  `;

  return (
    <>
      <style>{customStyles}</style>
      <div className="auth-bg">
        <div className="auth-container">
          {/* Header */}
          <div className="auth-header">
            <h1 className="h2 fw-bold mb-2">
              Zimbabwe National Health System
            </h1>
            <p className="mb-4 opacity-90">
              Secure access to healthcare management platform
            </p>
            
            {/* Toggle Buttons */}
            <div className="d-flex justify-content-center gap-3">
              <button
                className={`toggle-btn ${isLogin ? 'active' : ''}`}
                onClick={() => handleToggle(true)}
              >
                Sign In
              </button>
              <button
                className={`toggle-btn ${!isLogin ? 'active' : ''}`}
                onClick={() => handleToggle(false)}
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="auth-form">
            {error && (
              <div className="alert-custom alert-danger-custom">
                {error}
              </div>
            )}
            {message && (
              <div className="alert-custom alert-success-custom">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Account Type Dropdown - Always visible */}
              <div className="mb-4">
                <label className="form-label fw-medium primary-color mb-2">
                  Account Type
                </label>
                <div className="input-group-custom">
                  <UserCheck className="input-icon" size={18} />
                  <select
                    className="form-control account-type-dropdown input-with-icon"
                    name="userType"
                    value={formData.userType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Account Type</option>
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>

              {/* User Type Selection Cards (Registration Only) */}
              {!isLogin && (
                <div className="mb-4">
                  <label className="form-label fw-medium primary-color mb-3">
                    I am registering as:
                  </label>
                  <div className="row g-3">
                    {userTypes.map((type) => (
                      <div key={type.value} className="col-12 col-md-4">
                        <div
                          className={`user-type-card ${formData.userType === type.value ? 'selected' : ''}`}
                          onClick={() => setFormData(prev => ({ ...prev, userType: type.value }))}
                        >
                          <div className="mb-2" style={{ color: formData.userType === type.value ? 'white' : type.color }}>
                            {type.icon}
                          </div>
                          <div className="fw-medium">{type.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Avatar Upload (Registration Only) */}
              {!isLogin && (
                <div className="mb-4 text-center">
                  <label className="form-label fw-medium primary-color d-block mb-2">
                    Profile Picture
                  </label>
                  <div className="avatar-upload" onClick={() => document.getElementById('avatar-input').click()}>
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar preview" className="avatar-preview" />
                    ) : (
                      <Upload className="secondary-color" size={24} />
                    )}
                  </div>
                  <input
                    id="avatar-input"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }}
                  />
                  <small className="text-muted">Click to upload profile picture</small>
                </div>
              )}

              {/* Name Fields (Registration Only) */}
              {!isLogin && (
                <div className="form-row mb-3">
                  <div className="input-group-custom">
                    <User className="input-icon" size={18} />
                    <input
                      type="text"
                      className="form-control form-control-custom input-with-icon"
                      placeholder="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required={!isLogin}
                    />
                  </div>
                  <div className="input-group-custom">
                    <User className="input-icon" size={18} />
                    <input
                      type="text"
                      className="form-control form-control-custom input-with-icon"
                      placeholder="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              {/* Email (Registration Only) */}
              {!isLogin && (
                <div className="mb-3">
                  <div className="input-group-custom">
                    <Mail className="input-icon" size={18} />
                    <input
                      type="email"
                      className="form-control form-control-custom input-with-icon"
                      placeholder="Email Address"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              {/* Username */}
              <div className="mb-3">
                <div className="input-group-custom">
                  <UserCheck className="input-icon" size={18} />
                  <input
                    type="text"
                    className="form-control form-control-custom input-with-icon"
                    placeholder="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-3">
                <div className="input-group-custom">
                  <Lock className="input-icon" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control form-control-custom input-with-icon"
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    style={{ paddingRight: '3rem' }}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (Registration Only) */}
              {!isLogin && (
                <div className="mb-3">
                  <div className="input-group-custom">
                    <Lock className="input-icon" size={18} />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="form-control form-control-custom input-with-icon"
                      placeholder="Confirm Password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required={!isLogin}
                      style={{ paddingRight: '3rem' }}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              )}

              {/* Additional Registration Fields */}
              {!isLogin && (
                <>
                  {/* Phone Number */}
                  <div className="mb-3">
                    <div className="form-row">
                      <div className="input-group-custom">
                        <Phone className="input-icon" size={18} />
                        <select
                          className="form-control form-control-custom input-with-icon"
                          name="countryCode"
                          value={formData.phoneNumber.countryCode}
                          onChange={handleChange}
                        >
                          {countryCodes.map((code) => (
                            <option key={code.value} value={code.value}>
                              {code.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="input-group-custom">
                        <input
                          type="tel"
                          className="form-control form-control-custom"
                          placeholder="Phone Number"
                          name="number"
                          value={formData.phoneNumber.number}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Date of Birth and Gender */}
                  <div className="form-row mb-3">
                    <div className="input-group-custom">
                      <Calendar className="input-icon" size={18} />
                      <input
                        type="date"
                        className="form-control form-control-custom input-with-icon"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="input-group-custom">
                      <select
                        className="form-control form-control-custom"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* National ID */}
                  <div className="mb-3">
                    <div className="input-group-custom">
                      <UserCheck className="input-icon" size={18} />
                      <input
                        type="text"
                        className="form-control form-control-custom input-with-icon"
                        placeholder="National ID Number"
                        name="nationalId"
                        value={formData.nationalId}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="mb-3">
                    <div className="input-group-custom">
                      <MapPin className="input-icon" size={18} />
                      <textarea
                        className="form-control form-control-custom input-with-icon"
                        placeholder="Home Address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="2"
                      />
                    </div>
                  </div>

                  {/* Doctor-specific fields */}
                  {formData.userType === 'doctor' && (
                    <>
                      <div className="form-row mb-3">
                        <div className="input-group-custom">
                          <Stethoscope className="input-icon" size={18} />
                          <input
                            type="text"
                            className="form-control form-control-custom input-with-icon"
                            placeholder="Specialization"
                            name="specialization"
                            value={formData.specialization}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="input-group-custom">
                          <input
                            type="text"
                            className="form-control form-control-custom"
                            placeholder="License Number"
                            name="licenseNumber"
                            value={formData.licenseNumber}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="input-group-custom">
                          <input
                            type="text"
                            className="form-control form-control-custom"
                            placeholder="Department"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Emergency Contact */}
                  <div className="mb-3">
                    <label className="form-label fw-medium primary-color mb-2">
                      Emergency Contact
                    </label>
                    <div className="form-row">
                      <div className="input-group-custom">
                        <User className="input-icon" size={18} />
                        <input
                          type="text"
                          className="form-control form-control-custom input-with-icon"
                          placeholder="Contact Name"
                          name="emergencyName"
                          value={formData.emergencyContact.name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="input-group-custom">
                        <Phone className="input-icon" size={18} />
                        <input
                          type="tel"
                          className="form-control form-control-custom input-with-icon"
                          placeholder="Contact Phone"
                          name="emergencyPhone"
                          value={formData.emergencyContact.phone}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="btn-auth"
                disabled={loading}
              >
                {loading ? (
                  <div className="d-flex align-items-center justify-content-center">
                    <div className="spinner-border spinner-border-sm me-2" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    Processing...
                  </div>
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </button>

              {/* Additional Links */}
              <div className="text-center mt-3">
                {isLogin ? (
                  <p className="small secondary-color mb-0">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      className="btn btn-link p-0 secondary-color fw-medium text-decoration-none"
                      onClick={() => handleToggle(false)}
                    >
                      Sign up here
                    </button>
                  </p>
                ) : (
                  <p className="small secondary-color mb-0">
                    Already have an account?{' '}
                    <button
                      type="button"
                      className="btn btn-link p-0 secondary-color fw-medium text-decoration-none"
                      onClick={() => handleToggle(true)}
                    >
                      Sign in here
                    </button>
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPage;