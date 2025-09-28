import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Users, Building2, FileText, UserCheck, AlertTriangle, Bell, Calendar, Activity } from 'lucide-react';

const AdminDashboard = () => {
  const [selectedFacility, setSelectedFacility] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('current');
  const [animatedStats, setAnimatedStats] = useState({
    facilities: 0,
    staff: 0,
    reports: 0
  });

  // Animation for stats
  useEffect(() => {
    const targets = { facilities: 12, staff: 342, reports: 89 };
    const animateStats = () => {
      setAnimatedStats(prev => ({
        facilities: Math.min(prev.facilities + 1, targets.facilities),
        staff: Math.min(prev.staff + 15, targets.staff),
        reports: Math.min(prev.reports + 4, targets.reports)
      }));
    };

    const interval = setInterval(() => {
      setAnimatedStats(prev => {
        if (prev.facilities < targets.facilities || prev.staff < targets.staff || prev.reports < targets.reports) {
          return {
            facilities: Math.min(prev.facilities + 1, targets.facilities),
            staff: Math.min(prev.staff + 15, targets.staff),
            reports: Math.min(prev.reports + 4, targets.reports)
          };
        }
        return prev;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Sample data for bar chart
  const getChartData = () => {
    const baseData = [
      { name: 'Week 1', admitted: 45, discharged: 38 },
      { name: 'Week 2', admitted: 52, discharged: 43 },
      { name: 'Week 3', admitted: 48, discharged: 51 },
      { name: 'Week 4', admitted: 61, discharged: 47 }
    ];

    // Modify data based on filters
    return baseData.map(item => ({
      ...item,
      admitted: selectedGender === 'male' ? Math.floor(item.admitted * 0.6) : 
                selectedGender === 'female' ? Math.floor(item.admitted * 0.4) : item.admitted,
      discharged: selectedGender === 'male' ? Math.floor(item.discharged * 0.6) : 
                  selectedGender === 'female' ? Math.floor(item.discharged * 0.4) : item.discharged
    }));
  };

  const customStyles = `
    .dashboard-bg {
      background-color: #FFF9E5;
      min-height: 100vh;
    }
    .stat-card {
      background-color: #DCD0A8;
      border-radius: 1rem;
      transition: all 0.3s ease;
    }
    .stat-card:hover {
      transform: scale(1.05);
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    }
    .chart-card {
      background-color: white;
      border-radius: 1rem;
    }
    .notice-card {
      background-color: white;
      border-radius: 1rem;
    }
    .notice-item {
      background-color: #FFF9E5;
      border-left: 4px solid #4A9782;
      border-radius: 0.5rem;
    }
    .alert-item-high {
      background-color: #FFF9E5;
      border-left: 4px solid #dc2626;
      border-radius: 0.5rem;
    }
    .alert-item-medium {
      background-color: #FFF9E5;
      border-left: 4px solid #f59e0b;
      border-radius: 0.5rem;
    }
    .alert-item-info {
      background-color: #FFF9E5;
      border-left: 4px solid #4A9782;
      border-radius: 0.5rem;
    }
    .primary-color { color: #004030; }
    .secondary-color { color: #4A9782; }
    .icon-bg-primary { background-color: #4A9782; }
    .icon-bg-secondary { background-color: #004030; }
    .btn-custom {
      background-color: #4A9782;
      border-color: #4A9782;
      border-radius: 0.5rem;
    }
    .form-select-custom {
      border-color: #4A9782;
      border-radius: 0.5rem;
    }
    .form-select-custom:focus {
      border-color: #4A9782;
      box-shadow: 0 0 0 0.2rem rgba(74, 151, 130, 0.25);
    }
  `;

  return (
    <>
      <style>{customStyles}</style>
      <div className="dashboard-bg">
        <div className="container-fluid p-4">
          <div className="row">
            <div className="col-12">
              {/* Header */}
              <div className="mb-4">
                <h1 className="display-4 fw-bold mb-2 primary-color">
                  Hospital Management Dashboard
                </h1>
                <p className="fs-5 secondary-color">
                  Real-time overview of hospital operations
                </p>
              </div>

              {/* Top Stats Cards */}
              <div className="row mb-4">
                <div className="col-12 col-sm-4 mb-3">
                  <div className="stat-card p-4 shadow">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <p className="small fw-medium primary-color mb-1">
                          Number of Facilities
                        </p>
                        <p className="h2 fw-bold primary-color mb-0">
                          {animatedStats.facilities}
                        </p>
                      </div>
                      <div className="icon-bg-primary rounded-circle p-3">
                        <Building2 className="text-white" size={24} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-sm-4 mb-3">
                  <div className="stat-card p-4 shadow">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <p className="small fw-medium primary-color mb-1">
                          Number of Staff
                        </p>
                        <p className="h2 fw-bold primary-color mb-0">
                          {animatedStats.staff}
                        </p>
                      </div>
                      <div className="icon-bg-primary rounded-circle p-3">
                        <Users className="text-white" size={24} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-sm-4 mb-3">
                  <div className="stat-card p-4 shadow">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <p className="small fw-medium primary-color mb-1">
                          Number of Reports
                        </p>
                        <p className="h2 fw-bold primary-color mb-0">
                          {animatedStats.reports}
                        </p>
                      </div>
                      <div className="icon-bg-primary rounded-circle p-3">
                        <FileText className="text-white" size={24} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Patient Chart Card */}
              <div className="row mb-4">
                <div className="col-12">
                  <div className="chart-card p-4 shadow">
                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4">
                      <h2 className="h3 fw-bold primary-color mb-3 mb-sm-0">
                        Patient Admission & Discharge Trends
                      </h2>
                      
                      {/* Controls */}
                      <div className="d-flex flex-wrap gap-3">
                        <select 
                          value={selectedFacility}
                          onChange={(e) => setSelectedFacility(e.target.value)}
                          className="form-select form-select-sm form-select-custom primary-color"
                          style={{ minWidth: '150px' }}
                        >
                          <option value="all">All Facilities</option>
                          <option value="emergency">Emergency Ward</option>
                          <option value="icu">ICU</option>
                          <option value="general">General Ward</option>
                        </select>

                        <select 
                          value={selectedGender}
                          onChange={(e) => setSelectedGender(e.target.value)}
                          className="form-select form-select-sm form-select-custom primary-color"
                          style={{ minWidth: '130px' }}
                        >
                          <option value="all">All Genders</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>

                        <select 
                          value={selectedMonth}
                          onChange={(e) => setSelectedMonth(e.target.value)}
                          className="form-select form-select-sm form-select-custom primary-color"
                          style={{ minWidth: '150px' }}
                        >
                          <option value="current">Current Month</option>
                          <option value="last">Last Month</option>
                          <option value="2months">2 Months Ago</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ height: '320px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={getChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#DCD0A8" />
                          <XAxis dataKey="name" stroke="#4A9782" />
                          <YAxis stroke="#4A9782" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#DCD0A8', 
                              border: 'none', 
                              borderRadius: '12px',
                              color: '#004030'
                            }} 
                          />
                          <Legend />
                          <Bar 
                            dataKey="admitted" 
                            fill="#4A9782" 
                            name="Admitted Patients"
                            radius={[4, 4, 0, 0]}
                          />
                          <Bar 
                            dataKey="discharged" 
                            fill="#004030" 
                            name="Discharged Patients"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Cards - Notices and Alerts */}
              <div className="row">
                {/* Notices Card */}
                <div className="col-12 col-sm-6 mb-3">
                  <div className="notice-card p-4 shadow">
                    <div className="d-flex align-items-center mb-3">
                      <div className="icon-bg-primary rounded-circle p-2 me-3">
                        <Bell className="text-white" size={20} />
                      </div>
                      <h3 className="h4 fw-bold primary-color mb-0">
                        Recent Notices
                      </h3>
                    </div>
                    
                    <div className="d-flex flex-column gap-3">
                      <div className="notice-item p-3">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <p className="fw-medium primary-color mb-1">
                              New Safety Protocol Update
                            </p>
                            <p className="small secondary-color mb-0">
                              Updated hand hygiene procedures effective immediately
                            </p>
                          </div>
                          <span className="badge rounded-pill" style={{ backgroundColor: '#DCD0A8', color: '#004030' }}>
                            New
                          </span>
                        </div>
                      </div>

                      <div className="notice-item p-3">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <p className="fw-medium primary-color mb-1">
                              Staff Meeting Scheduled
                            </p>
                            <p className="small secondary-color mb-0">
                              Department heads meeting tomorrow at 2 PM
                            </p>
                          </div>
                          <Calendar className="secondary-color" size={16} />
                        </div>
                      </div>

                      <div className="notice-item p-3">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <p className="fw-medium primary-color mb-1">
                              Equipment Maintenance
                            </p>
                            <p className="small secondary-color mb-0">
                              MRI machine scheduled for maintenance this weekend
                            </p>
                          </div>
                          <Activity className="secondary-color" size={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Alerts Card */}
                <div className="col-12 col-sm-6 mb-3">
                  <div className="notice-card p-4 shadow">
                    <div className="d-flex align-items-center mb-3">
                      <div className="icon-bg-secondary rounded-circle p-2 me-3">
                        <AlertTriangle className="text-white" size={20} />
                      </div>
                      <h3 className="h4 fw-bold primary-color mb-0">
                        Priority Alerts
                      </h3>
                    </div>
                    
                    <div className="d-flex flex-column gap-3">
                      <div className="alert-item-high p-3">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <p className="fw-medium text-danger mb-1">
                              ICU Capacity Alert
                            </p>
                            <p className="small secondary-color mb-0">
                              ICU is at 85% capacity - prepare overflow protocols
                            </p>
                          </div>
                          <span className="badge bg-danger">
                            High
                          </span>
                        </div>
                      </div>

                      <div className="alert-item-medium p-3">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <p className="fw-medium text-warning mb-1">
                              Medication Stock Low
                            </p>
                            <p className="small secondary-color mb-0">
                              Critical medications running low - reorder required
                            </p>
                          </div>
                          <span className="badge bg-warning">
                            Medium
                          </span>
                        </div>
                      </div>

                      <div className="alert-item-info p-3">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <p className="fw-medium primary-color mb-1">
                              System Backup Complete
                            </p>
                            <p className="small secondary-color mb-0">
                              Daily backup completed successfully at 3:00 AM
                            </p>
                          </div>
                          <span className="badge rounded-pill" style={{ backgroundColor: '#DCD0A8', color: '#004030' }}>
                            Info
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;