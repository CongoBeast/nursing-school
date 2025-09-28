import React, { useState } from 'react';
import { 
  Map, AlertTriangle, Activity, Pulse, Skull, 
  TrendingUp, Users, Bell, ClipboardList, FileText, HeartPulse
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PandemicManagement = () => {
  // Sample data for Zimbabwe
  const [activeTab, setActiveTab] = useState('national');
  
  // Statistics data
  const stats = [
    { 
      title: "Daily Cases", 
      value: "1,245", 
      change: "+12%", 
      icon: <Activity className="text-white" size={20} />,
      color: "#f59e0b"
    },
    { 
      title: "Mortality Rate", 
      value: "3.2%", 
      change: "-0.4%", 
      icon: <Skull className="text-white" size={20} />,
      color: "#dc2626"
    },
    { 
      title: "Infection Rate", 
      value: "1.8", 
      change: "+0.2", 
      icon: <TrendingUp className="text-white" size={20} />,
      color: "#3b82f6"
    },
    { 
      title: "Vaccination", 
      value: "42%", 
      change: "+3%", 
      icon: <HeartPulse className="text-white" size={20} />,
      color: "#4A9782"
    }
  ];

  // Alerts data
  const alerts = [
    {
      title: "New Variant Detected",
      region: "Harare Province",
      date: "2024-07-28",
      priority: "High",
      description: "New COVID-19 variant detected in 15 samples from Harare hospitals",
      read: false
    },
    {
      title: "Vaccine Shortage",
      region: "Bulawayo",
      date: "2024-07-27",
      priority: "High",
      description: "Stock levels critical for Pfizer vaccines in Bulawayo clinics",
      read: false
    },
    {
      title: "Travel Restrictions",
      region: "National",
      date: "2024-07-25",
      priority: "Medium",
      description: "New travel restrictions implemented for Mashonaland provinces",
      read: true
    },
    {
      title: "Hospital Capacity",
      region: "Manicaland",
      date: "2024-07-24",
      priority: "Medium",
      description: "Hospital bed occupancy reaches 85% in Mutare district",
      read: true
    }
  ];

  // Chart data
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Confirmed Cases',
        data: [1250, 1900, 2100, 2800, 3200, 3800, 4125],
        borderColor: '#004030',
        backgroundColor: 'rgba(0, 64, 48, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Deaths',
        data: [24, 38, 42, 56, 64, 76, 82],
        borderColor: '#dc2626',
        backgroundColor: 'rgba(220, 38, 38, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const customStyles = `
    .pandemic-bg {
      background-color: #FFF9E5;
      min-height: 100vh;
    }
    .pandemic-card {
      background-color: white;
      border-radius: 1rem;
    }
    .primary-color { color: #004030; }
    .secondary-color { color: #4A9782; }
    .icon-bg-primary { background-color: #4A9782; }
    .icon-bg-secondary { background-color: #004030; }
    .stat-card {
      border-radius: 0.5rem;
      transition: all 0.2s ease;
    }
    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .alert-item {
      background-color: #FFF9E5;
      border-radius: 0.5rem;
      transition: all 0.2s ease;
      border-left: 4px solid var(--priority-color);
    }
    .alert-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .status-badge {
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 1rem;
      font-weight: 500;
    }
    .unread-alert {
      position: relative;
    }
    .unread-alert::before {
      content: '';
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      width: 8px;
      height: 8px;
      background-color: #dc2626;
      border-radius: 50%;
    }
    .map-container {
      height: 300px;
      background-color: #f0f0f0;
      border-radius: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }
    .map-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0, 64, 48, 0.8);
      color: white;
      padding: 1rem;
      border-bottom-left-radius: 1rem;
      border-bottom-right-radius: 1rem;
    }
    .nav-tabs .nav-link {
      color: #004030;
      border: none;
      padding: 0.5rem 1rem;
    }
    .nav-tabs .nav-link.active {
      color: #004030;
      border-bottom: 2px solid #004030;
      font-weight: 500;
    }
    .view-all-btn {
      color: #004030;
      font-weight: 500;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
    .view-all-btn:hover {
      text-decoration: underline;
    }
  `;

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return '#dc2626';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#4A9782';
      default:
        return '#4A9782';
    }
  };

  return (
    <>
      <style>{customStyles}</style>
      <div className="pandemic-bg">
        <div className="container-fluid p-4">
          <div className="row justify-content-center">
            <div className="col-12 col-xl-10">
              
              {/* Zimbabwe Map Card */}
              <div className="pandemic-card p-0 shadow mb-4">
                <div className="map-container">
                  <Map size={48} className="text-secondary" />
                  <div className="map-overlay">
                    <h3 className="h4 fw-bold text-white mb-0">
                      Zimbabwe Pandemic Map
                    </h3>
                    <p className="small text-white-50 mb-0">
                      Last updated: {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="p-4">
                  <ul className="nav nav-tabs">
                    <li className="nav-item">
                      <button 
                        className={`nav-link ${activeTab === 'national' ? 'active' : ''}`}
                        onClick={() => setActiveTab('national')}
                      >
                        National View
                      </button>
                    </li>
                    <li className="nav-item">
                      <button 
                        className={`nav-link ${activeTab === 'provincial' ? 'active' : ''}`}
                        onClick={() => setActiveTab('provincial')}
                      >
                        Provincial Breakdown
                      </button>
                    </li>
                    <li className="nav-item">
                      <button 
                        className={`nav-link ${activeTab === 'hospitals' ? 'active' : ''}`}
                        onClick={() => setActiveTab('hospitals')}
                      >
                        Hospital Status
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Stats Row */}
              <div className="row mb-4">
                {stats.map((stat, index) => (
                  <div key={index} className="col-12 col-sm-6 col-lg-3 mb-3 mb-lg-0">
                    <div 
                      className="pandemic-card p-3 shadow stat-card"
                      style={{ borderLeft: `4px solid ${stat.color}` }}
                    >
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <p className="small text-muted mb-1">{stat.title}</p>
                          <h3 className="h4 fw-bold mb-0 primary-color">{stat.value}</h3>
                          <p className="small mb-0" style={{ color: stat.color }}>
                            {stat.change} from yesterday
                          </p>
                        </div>
                        <div 
                          className="rounded-circle d-flex align-items-center justify-content-center"
                          style={{ 
                            width: '48px', 
                            height: '48px',
                            backgroundColor: stat.color
                          }}
                        >
                          {stat.icon}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Alerts and Chart Row */}
              <div className="row mb-4">
                {/* Alerts Card */}
                <div className="col-12 col-lg-6 mb-3 mb-lg-0">
                  <div className="pandemic-card p-4 shadow h-100">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="d-flex align-items-center">
                        <div className="icon-bg-primary rounded-circle p-2 me-3">
                          <AlertTriangle className="text-white" size={20} />
                        </div>
                        <h3 className="h4 fw-bold primary-color mb-0">
                          Pandemic Alerts
                        </h3>
                      </div>
                      <a href="#" className="view-all-btn">
                        View all <span>&rarr;</span>
                      </a>
                    </div>
                    
                    <div className="d-flex flex-column gap-3">
                      {alerts.map((alert, index) => (
                        <div 
                          key={index} 
                          className={`alert-item p-3 ${!alert.read ? 'unread-alert' : ''}`}
                          style={{ '--priority-color': getPriorityColor(alert.priority) }}
                        >
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <p className="fw-medium primary-color mb-1">
                                {alert.title}
                              </p>
                              <p className="small secondary-color mb-1">
                                {alert.region} • {alert.date}
                              </p>
                              <p className="small secondary-color mb-0">
                                {alert.description}
                              </p>
                            </div>
                            <span 
                              className="status-badge text-white"
                              style={{ backgroundColor: getPriorityColor(alert.priority) }}
                            >
                              {alert.priority}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Cases Chart Card */}
                <div className="col-12 col-lg-6">
                  <div className="pandemic-card p-4 shadow h-100">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="d-flex align-items-center">
                        <div className="icon-bg-secondary rounded-circle p-2 me-3">
                          <TrendingUp className="text-white" size={20} />
                        </div>
                        <h3 className="h4 fw-bold primary-color mb-0">
                          Infection Trends
                        </h3>
                      </div>
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-outline-secondary">7d</button>
                        <button className="btn btn-outline-secondary active">30d</button>
                        <button className="btn btn-outline-secondary">90d</button>
                      </div>
                    </div>
                    
                    <div style={{ height: '250px' }}>
                      <Line 
                        data={chartData} 
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'top',
                            },
                          },
                          scales: {
                            y: {
                              beginAtZero: true
                            }
                          }
                        }} 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Data Row */}
              <div className="row">
                {/* Testing Data Card */}
                <div className="col-12 col-lg-6 mb-3 mb-lg-0">
                  <div className="pandemic-card p-4 shadow h-100">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="d-flex align-items-center">
                        <div className="icon-bg-primary rounded-circle p-2 me-3">
                          <ClipboardList className="text-white" size={20} />
                        </div>
                        <h3 className="h4 fw-bold primary-color mb-0">
                          Testing Statistics
                        </h3>
                      </div>
                      <a href="#" className="view-all-btn">
                        View all <span>&rarr;</span>
                      </a>
                    </div>
                    
                    <div className="row">
                      <div className="col-6">
                        <div className="p-3 text-center">
                          <p className="small text-muted mb-1">Tests Today</p>
                          <h3 className="h4 fw-bold mb-0 primary-color">4,328</h3>
                          <p className="small secondary-color">+12% from yesterday</p>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="p-3 text-center">
                          <p className="small text-muted mb-1">Positivity Rate</p>
                          <h3 className="h4 fw-bold mb-0 primary-color">28.7%</h3>
                          <p className="small secondary-color">+2.1% from yesterday</p>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="p-3 text-center">
                          <p className="small text-muted mb-1">7-Day Average</p>
                          <h3 className="h4 fw-bold mb-0 primary-color">3,845</h3>
                          <p className="small secondary-color">+8.4% from last week</p>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="p-3 text-center">
                          <p className="small text-muted mb-1">Total Tests</p>
                          <h3 className="h4 fw-bold mb-0 primary-color">1.24M</h3>
                          <p className="small secondary-color">Since pandemic began</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vaccination Card */}
                <div className="col-12 col-lg-6">
                  <div className="pandemic-card p-4 shadow h-100">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="d-flex align-items-center">
                        <div className="icon-bg-secondary rounded-circle p-2 me-3">
                          <FileText className="text-white" size={20} />
                        </div>
                        <h3 className="h4 fw-bold primary-color mb-0">
                          Vaccination Progress
                        </h3>
                      </div>
                      <a href="#" className="view-all-btn">
                        View all <span>&rarr;</span>
                      </a>
                    </div>
                    
                    <div className="row">
                      <div className="col-6">
                        <div className="p-3 text-center">
                          <p className="small text-muted mb-1">Doses Administered</p>
                          <h3 className="h4 fw-bold mb-0 primary-color">8.2M</h3>
                          <p className="small secondary-color">+124K this week</p>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="p-3 text-center">
                          <p className="small text-muted mb-1">Fully Vaccinated</p>
                          <h3 className="h4 fw-bold mb-0 primary-color">42%</h3>
                          <p className="small secondary-color">Adult population</p>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="p-3 text-center">
                          <p className="small text-muted mb-1">Latest Daily Rate</p>
                          <h3 className="h4 fw-bold mb-0 primary-color">18,245</h3>
                          <p className="small secondary-color">Doses per day</p>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="p-3 text-center">
                          <p className="small text-muted mb-1">Next Shipment</p>
                          <h3 className="h4 fw-bold mb-0 primary-color">500K</h3>
                          <p className="small secondary-color">Expected July 30</p>
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

export default PandemicManagement;