import React, { useState } from 'react';
import { 
  FileText, ClipboardList, Settings, Download, 
  Filter, Printer, RefreshCw, BarChart2,
  Users, Building, Megaphone, DollarSign
} from 'lucide-react';

const AuditReports = () => {
  const [activeFinancialTab, setActiveFinancialTab] = useState('2023');
  const [activeStaffTab, setActiveStaffTab] = useState('performance');

  // Action buttons data
  const actionButtons = [
    {
      title: "Build Report",
      icon: <FileText size={20} />,
      color: "bg-[#004030] hover:bg-[#004030]/90"
    },
    {
      title: "Manage Reports",
      icon: <ClipboardList size={20} />,
      color: "bg-[#4A9782] hover:bg-[#4A9782]/90"
    },
    {
      title: "Export Data",
      icon: <Download size={20} />,
      color: "bg-[#f59e0b] hover:bg-[#f59e0b]/90"
    },
    {
      title: "Settings",
      icon: <Settings size={20} />,
      color: "bg-[#3b82f6] hover:bg-[#3b82f6]/90"
    }
  ];

  // Financial reports data
  const financialReports = {
    '2023': [
      { id: 1, quarter: "Q1", revenue: "$1.2M", expenses: "$850K", profit: "$350K" },
      { id: 2, quarter: "Q2", revenue: "$1.4M", expenses: "$920K", profit: "$480K" },
      { id: 3, quarter: "Q3", revenue: "$1.5M", expenses: "$1.1M", profit: "$400K" },
      { id: 4, quarter: "Q4", revenue: "$1.8M", expenses: "$1.3M", profit: "$500K" }
    ],
    '2022': [
      { id: 1, quarter: "Q1", revenue: "$950K", expenses: "$700K", profit: "$250K" },
      { id: 2, quarter: "Q2", revenue: "$1.1M", expenses: "$800K", profit: "$300K" },
      { id: 3, quarter: "Q3", revenue: "$1.3M", expenses: "$950K", profit: "$350K" },
      { id: 4, quarter: "Q4", revenue: "$1.6M", expenses: "$1.1M", profit: "$500K" }
    ],
    '2021': [
      { id: 1, quarter: "Q1", revenue: "$800K", expenses: "$600K", profit: "$200K" },
      { id: 2, quarter: "Q2", revenue: "$900K", expenses: "$700K", profit: "$200K" },
      { id: 3, quarter: "Q3", revenue: "$1.0M", expenses: "$800K", profit: "$200K" },
      { id: 4, quarter: "Q4", revenue: "$1.2M", expenses: "$900K", profit: "$300K" }
    ]
  };

  // Staff reports data
  const staffReports = {
    performance: [
      { id: 1, name: "Dr. Sarah Johnson", department: "Cardiology", rating: "4.8", patients: 245 },
      { id: 2, name: "Dr. Michael Chen", department: "Pediatrics", rating: "4.6", patients: 198 },
      { id: 3, name: "Nurse Lisa Wong", department: "Emergency", rating: "4.9", patients: 320 }
    ],
    attendance: [
      { id: 1, name: "Dr. Sarah Johnson", present: 98, absent: 2, late: 4 },
      { id: 2, name: "Dr. Michael Chen", present: 95, absent: 5, late: 3 },
      { id: 3, name: "Nurse Lisa Wong", present: 100, absent: 0, late: 1 }
    ],
    training: [
      { id: 1, name: "Dr. Sarah Johnson", completed: 8, pending: 2, certifications: 5 },
      { id: 2, name: "Dr. Michael Chen", completed: 6, pending: 1, certifications: 4 },
      { id: 3, name: "Nurse Lisa Wong", completed: 10, pending: 0, certifications: 6 }
    ]
  };

  // Facilities reports data
  const facilitiesReports = [
    { id: 1, facility: "Main Hospital", maintenance: 12, upgrades: 5, issues: 3 },
    { id: 2, facility: "North Clinic", maintenance: 8, upgrades: 2, issues: 1 },
    { id: 3, facility: "West Wing", maintenance: 15, upgrades: 3, issues: 5 },
    { id: 4, facility: "Pediatric Center", maintenance: 6, upgrades: 4, issues: 0 }
  ];

  // Campaign reports data
  const campaignReports = [
    { id: 1, campaign: "Vaccination Drive", participants: 1250, successRate: "92%", cost: "$25K" },
    { id: 2, campaign: "Diabetes Screening", participants: 850, successRate: "85%", cost: "$18K" },
    { id: 3, campaign: "Mental Health Week", participants: 420, successRate: "78%", cost: "$12K" },
    { id: 4, campaign: "Cancer Awareness", participants: 1500, successRate: "88%", cost: "$30K" }
  ];

  const customStyles = `
    .reports-bg {
      background-color: #FFF9E5;
      min-height: calc(100vh - 64px);
    }
    .reports-card {
      background-color: white;
      border-radius: 1rem;
    }
    .primary-color { color: #004030; }
    .secondary-color { color: #4A9782; }
    .report-item {
      background-color: #FFF9E5;
      border-radius: 0.5rem;
      transition: all 0.2s ease;
    }
    .report-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
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
    .action-btn {
      transition: all 0.2s ease;
      transform: translateY(0);
    }
    .action-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
  `;

  return (
    <>
      <style>{customStyles}</style>
      <div className="reports-bg p-6">
        <div className="container-fluid">
          {/* Action Buttons Row */}
          <div className="row justify-content-center mb-5">
            <div className="col-12 d-flex flex-wrap justify-content-center gap-4">
              {actionButtons.map((button, index) => (
                <button
                  key={index}
                  className={`${button.color} action-btn button btn text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow`}
                >
                  {button.icon}
                  <span>{button.title}</span>
                </button>
              ))}
              <div className="d-flex gap-2">
                <button className="bg-white text-[#004030] px-3 py-2 rounded-lg flex items-center gap-2 shadow border border-[#004030]/20">
                  <Filter size={18} />
                </button>
                <button className="bg-white text-[#004030] px-3 py-2 rounded-lg flex items-center gap-2 shadow border border-[#004030]/20">
                  <Printer size={18} />
                </button>
                <button className="bg-white text-[#004030] px-3 py-2 rounded-lg flex items-center gap-2 shadow border border-[#004030]/20">
                  <RefreshCw size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Financial and Staff Reports Row */}
          <div className="row mb-4">
            {/* Financial Reports Card */}
            <div className="col-12 col-lg-6 mb-4 mb-lg-0">
              <div className="reports-card p-4 shadow h-100">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="d-flex align-items-center">
                    <div className="bg-[#004030] rounded-circle p-2 me-3">
                      <DollarSign className="text-white" size={20} />
                    </div>
                    <h3 className="h4 fw-bold primary-color mb-0">
                      Financial Reports
                    </h3>
                  </div>
                  <button className="text-[#004030] small fw-medium">
                    Export Full Report
                  </button>
                </div>
                
                <ul className="nav nav-tabs mb-3">
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeFinancialTab === '2023' ? 'active' : ''}`}
                      onClick={() => setActiveFinancialTab('2023')}
                    >
                      2023
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeFinancialTab === '2022' ? 'active' : ''}`}
                      onClick={() => setActiveFinancialTab('2022')}
                    >
                      2022
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeFinancialTab === '2021' ? 'active' : ''} button btn`}
                      onClick={() => setActiveFinancialTab('2021')}
                    >
                      2021
                    </button>
                  </li>
                </ul>
                
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr className="secondary-color">
                        <th>Quarter</th>
                        <th>Revenue</th>
                        <th>Expenses</th>
                        <th>Profit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {financialReports[activeFinancialTab].map(report => (
                        <tr key={report.id} className="report-item">
                          <td className="fw-medium primary-color">{report.quarter}</td>
                          <td className="text-success">{report.revenue}</td>
                          <td className="text-danger">{report.expenses}</td>
                          <td className="fw-bold primary-color">{report.profit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Staff Reports Card */}
            <div className="col-12 col-lg-6">
              <div className="reports-card p-4 shadow h-100">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="d-flex align-items-center">
                    <div className="bg-[#4A9782] rounded-circle p-2 me-3">
                      <Users className="text-white" size={20} />
                    </div>
                    <h3 className="h4 fw-bold primary-color mb-0">
                      Staff Reports
                    </h3>
                  </div>
                  <button className="text-[#004030] small fw-medium btn button">
                    View All Staff
                  </button>
                </div>
                
                <ul className="nav nav-tabs mb-3">
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeStaffTab === 'performance' ? 'active' : ''}`}
                      onClick={() => setActiveStaffTab('performance')}
                    >
                      Performance
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeStaffTab === 'attendance' ? 'active' : ''}`}
                      onClick={() => setActiveStaffTab('attendance')}
                    >
                      Attendance
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeStaffTab === 'training' ? 'active' : ''}`}
                      onClick={() => setActiveStaffTab('training')}
                    >
                      Training
                    </button>
                  </li>
                </ul>
                
                <div className="d-flex flex-column gap-3">
                  {staffReports[activeStaffTab].map(staff => (
                    <div key={staff.id} className="report-item p-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <p className="fw-medium primary-color mb-1">{staff.name}</p>
                          <p className="small secondary-color mb-2">{staff.department}</p>
                        </div>
                        <div className="text-end">
                          {activeStaffTab === 'performance' && (
                            <>
                              <p className="small mb-1">Rating: {staff.rating}/5.0</p>
                              <p className="small mb-0">Patients: {staff.patients}</p>
                            </>
                          )}
                          {activeStaffTab === 'attendance' && (
                            <>
                              <p className="small mb-1">Present: {staff.present}%</p>
                              <p className="small mb-0">Absent: {staff.absent} days</p>
                            </>
                          )}
                          {activeStaffTab === 'training' && (
                            <>
                              <p className="small mb-1">Courses: {staff.completed}</p>
                              <p className="small mb-0">Certifications: {staff.certifications}</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Facilities and Campaign Reports Row */}
          <div className="row">
            {/* Facilities Reports Card */}
            <div className="col-12 col-lg-6 mb-4 mb-lg-0">
              <div className="reports-card p-4 shadow h-100">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="d-flex align-items-center">
                    <div className="bg-[#004030] rounded-circle p-2 me-3">
                      <Building className="text-white" size={20} />
                    </div>
                    <h3 className="h4 fw-bold primary-color mb-0">
                      Facilities Reports
                    </h3>
                  </div>
                  <button className="text-[#004030] small fw-medium">
                    Generate Full Report
                  </button>
                </div>
                
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr className="secondary-color">
                        <th>Facility</th>
                        <th>Maintenance</th>
                        <th>Upgrades</th>
                        <th>Issues</th>
                      </tr>
                    </thead>
                    <tbody>
                      {facilitiesReports.map(report => (
                        <tr key={report.id} className="report-item">
                          <td className="fw-medium primary-color">{report.facility}</td>
                          <td>{report.maintenance}</td>
                          <td>{report.upgrades}</td>
                          <td className={report.issues > 0 ? "text-danger fw-bold" : ""}>
                            {report.issues} {report.issues > 0 ? "⚠️" : ""}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Campaign Reports Card */}
            <div className="col-12 col-lg-6">
              <div className="reports-card p-4 shadow h-100">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="d-flex align-items-center">
                    <div className="bg-[#4A9782] rounded-circle p-2 me-3">
                      <Megaphone className="text-white" size={20} />
                    </div>
                    <h3 className="h4 fw-bold primary-color mb-0">
                      Health Campaigns
                    </h3>
                  </div>
                  <button className="text-[#004030] small fw-medium">
                    View All Campaigns
                  </button>
                </div>
                
                <div className="d-flex flex-column gap-3">
                  {campaignReports.map(campaign => (
                    <div key={campaign.id} className="report-item p-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <p className="fw-medium primary-color mb-1">{campaign.campaign}</p>
                          <p className="small secondary-color mb-0">
                            Participants: {campaign.participants}
                          </p>
                        </div>
                        <div className="text-end">
                          <p className="small mb-1">Success: {campaign.successRate}</p>
                          <p className="small mb-0">Cost: {campaign.cost}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuditReports;