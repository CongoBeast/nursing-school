import React, { useState } from 'react';
import { 
  Building, Users, Bell, Activity, ClipboardList, 
  Truck, Package, FileText, MapPin, Phone, 
  Mail, Clock, User, Shield, FirstAid, PlusCircle, 
  Thermometer, Syringe, Pill, HeartPulse, Home, ChevronRight,
  Calendar, AlertTriangle, CheckCircle, XCircle, Settings,
  Eye, Edit, Trash2, Plus, Filter, Search, MoreVertical,
  Bed, Monitor, Stethoscope, Zap, Wrench, BarChart3
} from 'lucide-react';

const FacilityResourceManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedResource, setSelectedResource] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Resource categories with detailed information
  const resourceCategories = {
    medical: {
      name: "Medical Equipment",
      icon: <Stethoscope size={20} />,
      color: "#dc2626",
      total: 127,
      available: 98,
      inUse: 24,
      maintenance: 5
    },
    surgical: {
      name: "Surgical Equipment",
      icon: <PlusCircle size={20} />,
      color: "#7c3aed",
      total: 45,
      available: 32,
      inUse: 10,
      maintenance: 3
    },
    monitoring: {
      name: "Monitoring Systems",
      icon: <Monitor size={20} />,
      color: "#059669",
      total: 89,
      available: 67,
      inUse: 20,
      maintenance: 2
    },
    beds: {
      name: "Beds & Furniture",
      icon: <Bed size={20} />,
      color: "#dc7c00",
      total: 892,
      available: 123,
      inUse: 745,
      maintenance: 24
    }
  };

  // Detailed resources data
  const resources = [
    {
      id: "RES-001",
      name: "Operating Theater 1",
      category: "surgical",
      type: "Operating Room",
      status: "Available",
      location: "Surgical Wing - Floor 2",
      capacity: "1 patient",
      lastMaintenance: "2024-07-15",
      nextMaintenance: "2024-10-15",
      utilization: 85,
      equipment: ["Anesthesia Machine", "Surgical Lights", "Operating Table", "Ventilator"],
      assignedStaff: ["Dr. Tendai Mukamuri", "Sister Chipo Mangwende"],
      bookings: [
        { date: "2024-07-30", time: "08:00-12:00", procedure: "Cardiac Surgery", surgeon: "Dr. Farai Nyamukapa" },
        { date: "2024-07-30", time: "14:00-17:00", procedure: "Orthopedic Surgery", surgeon: "Dr. Tendai Mukamuri" }
      ]
    },
    {
      id: "RES-002",
      name: "ICU Bed 12",
      category: "beds",
      type: "Critical Care Bed",
      status: "Occupied",
      location: "ICU Ward - Floor 3",
      capacity: "1 patient",
      lastMaintenance: "2024-07-10",
      nextMaintenance: "2024-08-10",
      utilization: 92,
      equipment: ["Ventilator", "Heart Monitor", "Defibrillator", "IV Pump"],
      assignedStaff: ["Sister Chipo Mangwende", "Nurse Tatenda Chinembiri"],
      currentPatient: {
        id: "PAT-456",
        admissionDate: "2024-07-25",
        condition: "Post-operative monitoring"
      }
    },
    {
      id: "RES-003",
      name: "Dialysis Machine 3",
      category: "medical",
      type: "Hemodialysis Unit",
      status: "Available",
      location: "Nephrology Unit - Floor 1",
      capacity: "1 patient",
      lastMaintenance: "2024-07-20",
      nextMaintenance: "2024-09-20",
      utilization: 75,
      equipment: ["Blood Pump", "Dialyzer", "Water Treatment System"],
      assignedStaff: ["Dr. Farai Nyamukapa", "Technician Moses Ndovu"],
      schedule: [
        { time: "08:00-12:00", patient: "PAT-123", status: "Scheduled" },
        { time: "14:00-18:00", patient: "PAT-789", status: "Scheduled" }
      ]
    },
    {
      id: "RES-004",
      name: "X-ray Machine 2",
      category: "medical",
      type: "Digital Radiography",
      status: "Maintenance",
      location: "Radiology Department - Ground Floor",
      capacity: "Multiple patients/day",
      lastMaintenance: "2024-07-28",
      nextMaintenance: "2024-08-15",
      utilization: 0,
      equipment: ["Digital Detector", "X-ray Tube", "Control Console"],
      assignedStaff: ["Radiographer Jane Mutamba"],
      maintenanceIssue: "Detector calibration required"
    },
    {
      id: "RES-005",
      name: "Ventilator V-08",
      category: "medical",
      type: "Mechanical Ventilator",
      status: "In Use",
      location: "ICU Ward - Floor 3",
      capacity: "1 patient",
      lastMaintenance: "2024-07-01",
      nextMaintenance: "2024-10-01",
      utilization: 100,
      equipment: ["Breathing Circuit", "Humidifier", "Monitoring System"],
      assignedStaff: ["Sister Chipo Mangwende"],
      currentPatient: {
        id: "PAT-321",
        startDate: "2024-07-26",
        condition: "Respiratory support"
      }
    },
    {
      id: "RES-006",
      name: "MRI Scanner",
      category: "medical",
      type: "Magnetic Resonance Imaging",
      status: "Available",
      location: "Radiology Department - Basement",
      capacity: "12 patients/day",
      lastMaintenance: "2024-06-15",
      nextMaintenance: "2024-09-15",
      utilization: 68,
      equipment: ["Magnet", "RF System", "Gradient Coils", "Computer System"],
      assignedStaff: ["Dr. Tendai Mukamuri", "Technician Peter Mazondo"],
      todaySchedule: [
        { time: "09:00", patient: "PAT-111", type: "Brain MRI" },
        { time: "11:00", patient: "PAT-222", type: "Spine MRI" },
        { time: "14:00", patient: "PAT-333", type: "Knee MRI" }
      ]
    }
  ];

  // Maintenance schedule
  const maintenanceSchedule = [
    {
      id: "MAIN-001",
      resourceId: "RES-001",
      resourceName: "Operating Theater 1",
      type: "Routine Maintenance",
      scheduledDate: "2024-10-15",
      estimatedDuration: "4 hours",
      technician: "Engineer Robert Chikwanha",
      priority: "Medium",
      status: "Scheduled"
    },
    {
      id: "MAIN-002",
      resourceId: "RES-004",
      resourceName: "X-ray Machine 2",
      type: "Repair - Detector Issue",
      scheduledDate: "2024-07-30",
      estimatedDuration: "6 hours",
      technician: "Technician Sarah Mapfumo",
      priority: "High",
      status: "In Progress"
    },
    {
      id: "MAIN-003",
      resourceId: "RES-006",
      resourceName: "MRI Scanner",
      type: "Preventive Maintenance",
      scheduledDate: "2024-09-15",
      estimatedDuration: "8 hours",
      technician: "External Contractor",
      priority: "High",
      status: "Scheduled"
    }
  ];

  // Filter resources based on status and search term
  const filteredResources = resources.filter(resource => {
    const matchesStatus = filterStatus === 'all' || resource.status.toLowerCase().includes(filterStatus.toLowerCase());
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'available':
        return '#059669';
      case 'occupied':
      case 'in use':
        return '#dc7c00';
      case 'maintenance':
        return '#dc2626';
      case 'scheduled':
        return '#7c3aed';
      case 'in progress':
        return '#0ea5e9';
      default:
        return '#6b7280';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return '#dc2626';
      case 'medium':
        return '#dc7c00';
      case 'low':
        return '#059669';
      default:
        return '#6b7280';
    }
  };

  const customStyles = `
    .facility-bg {
      background-color: #FFF9E5;
      min-height: 100vh;
    }
    .facility-card {
      background-color: white;
      border-radius: 1rem;
    }
    .primary-color { color: #004030; }
    .secondary-color { color: #4A9782; }
    .icon-bg-primary { background-color: #4A9782; }
    .icon-bg-secondary { background-color: #004030; }
    .resource-item, .maintenance-item, .category-card {
      background-color: #FFF9E5;
      border-radius: 0.5rem;
      transition: all 0.2s ease;
      cursor: pointer;
    }
    .resource-item:hover, .maintenance-item:hover, .category-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .resource-item { border-left: 4px solid #4A9782; }
    .maintenance-item { border-left: 4px solid #dc2626; }
    .category-card { border-left: 4px solid var(--category-color); }
    .status-badge {
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 1rem;
      font-weight: 500;
    }
    .breadcrumb {
      background-color: transparent;
      padding: 0;
      margin-bottom: 1rem;
    }
    .breadcrumb-item {
      font-size: 0.875rem;
    }
    .breadcrumb-item + .breadcrumb-item::before {
      content: none;
    }
    .breadcrumb-item a {
      color: #4A9782;
      text-decoration: none;
    }
    .breadcrumb-item a:hover {
      color: #004030;
      text-decoration: underline;
    }
    .breadcrumb-item.active {
      color: #004030;
      font-weight: 500;
    }
    .nav-tabs .nav-link {
      color: #004030;
      border: none;
      padding: 0.75rem 1.5rem;
      font-weight: 500;
    }
    .nav-tabs .nav-link.active {
      color: #004030;
      border-bottom: 3px solid #004030;
      background-color: transparent;
    }
    .filter-select, .search-input {
      border: 2px solid #e5e7eb;
      border-radius: 0.5rem;
      padding: 0.5rem 0.75rem;
    }
    .filter-select:focus, .search-input:focus {
      outline: none;
      border-color: #4A9782;
    }
    .btn-primary-custom {
      background-color: #004030;
      border: none;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      font-weight: 500;
    }
    .btn-primary-custom:hover {
      background-color: #4A9782;
    }
    .utilization-bar {
      height: 6px;
      background-color: #e5e7eb;
      border-radius: 3px;
      overflow: hidden;
    }
    .utilization-fill {
      height: 100%;
      background-color: #059669;
      transition: width 0.3s ease;
    }
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .modal-content {
      background-color: white;
      border-radius: 1rem;
      max-width: 800px;
      width: 90vw;
      max-height: 90vh;
      overflow-y: auto;
    }
  `;

  const ResourceDetailModal = ({ resource, onClose }) => {
    if (!resource) return null;

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="p-4">
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div>
                <h2 className="h3 fw-bold primary-color mb-2">{resource.name}</h2>
                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-secondary">{resource.type}</span>
                  <span 
                    className="status-badge text-white"
                    style={{ backgroundColor: getStatusColor(resource.status) }}
                  >
                    {resource.status}
                  </span>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="btn-close"
                aria-label="Close"
              ></button>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="mb-4">
                  <h4 className="h5 primary-color mb-3">Resource Information</h4>
                  <div className="d-flex flex-column gap-2">
                    <div><strong>Location:</strong> {resource.location}</div>
                    <div><strong>Capacity:</strong> {resource.capacity}</div>
                    <div><strong>Utilization:</strong> {resource.utilization}%</div>
                    <div className="utilization-bar">
                      <div 
                        className="utilization-fill"
                        style={{ width: `${resource.utilization}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="h5 primary-color mb-3">Maintenance</h4>
                  <div className="d-flex flex-column gap-2">
                    <div><strong>Last Maintenance:</strong> {resource.lastMaintenance}</div>
                    <div><strong>Next Maintenance:</strong> {resource.nextMaintenance}</div>
                    {resource.maintenanceIssue && (
                      <div className="text-danger">
                        <strong>Current Issue:</strong> {resource.maintenanceIssue}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-4">
                  <h4 className="h5 primary-color mb-3">Equipment</h4>
                  <ul className="list-unstyled">
                    {resource.equipment.map((item, index) => (
                      <li key={index} className="d-flex align-items-center gap-2 mb-1">
                        <CheckCircle size={16} className="text-success" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4">
                  <h4 className="h5 primary-color mb-3">Assigned Staff</h4>
                  <ul className="list-unstyled">
                    {resource.assignedStaff.map((staff, index) => (
                      <li key={index} className="d-flex align-items-center gap-2 mb-1">
                        <User size={16} className="secondary-color" />
                        {staff}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {resource.bookings && (
              <div className="mb-4">
                <h4 className="h5 primary-color mb-3">Today's Schedule</h4>
                {resource.bookings.map((booking, index) => (
                  <div key={index} className="resource-item p-3 mb-2">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{booking.time}</strong> - {booking.procedure}
                      </div>
                      <div className="small secondary-color">
                        {booking.surgeon}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {resource.currentPatient && (
              <div className="mb-4">
                <h4 className="h5 primary-color mb-3">Current Patient</h4>
                <div className="resource-item p-3">
                  <div><strong>Patient ID:</strong> {resource.currentPatient.id}</div>
                  <div><strong>Admission Date:</strong> {resource.currentPatient.admissionDate}</div>
                  <div><strong>Condition:</strong> {resource.currentPatient.condition}</div>
                </div>
              </div>
            )}

            <div className="d-flex gap-2 justify-content-end">
              <button className="btn btn-outline-secondary">
                <Edit size={16} className="me-1" />
                Edit Resource
              </button>
              <button className="btn btn-primary-custom">
                <Settings size={16} className="me-1" />
                Schedule Maintenance
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{customStyles}</style>
      <div className="facility-bg">
        <div className="container-fluid p-4">
          <div className="row justify-content-center">
            <div className="col-12 col-xl-10">
              
              {/* Breadcrumbs */}
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="/#/" className="d-flex align-items-center gap-1">
                      <Home size={14} />
                      Home
                    </a>
                  </li>
                  <li className="breadcrumb-item">
                    <ChevronRight size={14} className="text-muted" />
                  </li>
                  <li className="breadcrumb-item">
                    <a href="/#/facilitiesmanagement" className="d-flex align-items-center gap-1">
                      <Building size={14} />
                      Manage Facilities
                    </a>
                  </li>
                  <li className="breadcrumb-item">
                    <ChevronRight size={14} className="text-muted" />
                  </li>
                  <li className="breadcrumb-item">
                    <a href="/#/managefacility" className="d-flex align-items-center gap-1">
                      Parirenyatwa Hospital
                    </a>
                  </li>
                  <li className="breadcrumb-item">
                    <ChevronRight size={14} className="text-muted" />
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Facility Resources
                  </li>
                </ol>
              </nav>

              {/* Page Header */}
              <div className="facility-card p-4 shadow mb-4">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="icon-bg-primary rounded-circle p-3 me-3">
                      <PlusCircle className="text-white" size={24} />
                    </div>
                    <div>
                      <h1 className="h2 fw-bold primary-color mb-1">
                        Facility Resource Management
                      </h1>
                      <p className="secondary-color mb-0">
                        Parirenyatwa Hospital - Central Referral Hospital
                      </p>
                    </div>
                  </div>
                  <button className="btn btn-primary-custom">
                    <Plus size={16} className="me-1" />
                    Add Resource
                  </button>
                </div>
              </div>

              {/* Resource Categories Overview */}
              <div className="row mb-4">
                {Object.entries(resourceCategories).map(([key, category]) => (
                  <div key={key} className="col-lg-3 col-md-6 mb-3">
                    <div 
                      className="category-card p-4 shadow h-100"
                      style={{ '--category-color': category.color }}
                    >
                      <div className="d-flex align-items-start justify-content-between mb-3">
                        <div 
                          className="rounded-circle p-2 text-white"
                          style={{ backgroundColor: category.color }}
                        >
                          {category.icon}
                        </div>
                        <div className="text-end">
                          <div className="h3 fw-bold primary-color mb-0">
                            {category.total}
                          </div>
                          <div className="small secondary-color">Total</div>
                        </div>
                      </div>
                      <h4 className="h5 primary-color mb-3">{category.name}</h4>
                      <div className="row text-center">
                        <div className="col-4">
                          <div className="fw-bold text-success">{category.available}</div>
                          <div className="small secondary-color">Available</div>
                        </div>
                        <div className="col-4">
                          <div className="fw-bold text-warning">{category.inUse}</div>
                          <div className="small secondary-color">In Use</div>
                        </div>
                        <div className="col-4">
                          <div className="fw-bold text-danger">{category.maintenance}</div>
                          <div className="small secondary-color">Maintenance</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Tabs */}
              <div className="facility-card shadow mb-4">
                <ul className="nav nav-tabs">
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                      onClick={() => setActiveTab('overview')}
                    >
                      <BarChart3 size={16} className="me-1" />
                      Overview
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'resources' ? 'active' : ''}`}
                      onClick={() => setActiveTab('resources')}
                    >
                      <Package size={16} className="me-1" />
                      All Resources
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'maintenance' ? 'active' : ''}`}
                      onClick={() => setActiveTab('maintenance')}
                    >
                      <Wrench size={16} className="me-1" />
                      Maintenance
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'schedule' ? 'active' : ''}`}
                      onClick={() => setActiveTab('schedule')}
                    >
                      <Calendar size={16} className="me-1" />
                      Schedule
                    </button>
                  </li>
                </ul>

                <div className="p-4">
                  {activeTab === 'overview' && (
                    <div>
                      <h3 className="h4 fw-bold primary-color mb-4">Resource Overview</h3>
                      <div className="row">
                        <div className="col-md-8">
                          <div className="facility-card p-4 mb-4" style={{ backgroundColor: '#f8f9fa' }}>
                            <h4 className="h5 primary-color mb-3">Key Metrics</h4>
                            <div className="row">
                              <div className="col-sm-3 mb-3">
                                <div className="text-center">
                                  <div className="h2 fw-bold text-success">87%</div>
                                  <div className="small secondary-color">Overall Utilization</div>
                                </div>
                              </div>
                              <div className="col-sm-3 mb-3">
                                <div className="text-center">
                                  <div className="h2 fw-bold text-warning">12</div>
                                  <div className="small secondary-color">Resources in Maintenance</div>
                                </div>
                              </div>
                              <div className="col-sm-3 mb-3">
                                <div className="text-center">
                                  <div className="h2 fw-bold text-info">45</div>
                                  <div className="small secondary-color">Scheduled Procedures</div>
                                </div>
                              </div>
                              <div className="col-sm-3 mb-3">
                                <div className="text-center">
                                  <div className="h2 fw-bold text-danger">3</div>
                                  <div className="small secondary-color">Critical Issues</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="facility-card p-4" style={{ backgroundColor: '#fef3c7' }}>
                            <h4 className="h5 primary-color mb-3">
                              <AlertTriangle size={20} className="text-warning me-1" />
                              Alerts & Notifications
                            </h4>
                            <div className="d-flex flex-column gap-2">
                              <div className="small">
                                <span className="fw-medium text-danger">High Priority:</span> 
                                X-ray Machine 2 requires immediate attention
                              </div>
                              <div className="small">
                                <span className="fw-medium text-warning">Medium Priority:</span> 
                                3 resources due for maintenance this week
                              </div>
                              <div className="small">
                                <span className="fw-medium text-info">Info:</span> 
                                New equipment delivery scheduled for next week
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'resources' && (
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h3 className="h4 fw-bold primary-color mb-0">All Resources</h3>
                        <div className="d-flex gap-2">
                          <div className="d-flex align-items-center gap-2">
                            <Filter size={16} className="secondary-color" />
                            <select 
                              className="filter-select"
                              value={filterStatus}
                              onChange={(e) => setFilterStatus(e.target.value)}
                            >
                              <option value="all">All Status</option>
                              <option value="available">Available</option>
                              <option value="occupied">Occupied</option>
                              <option value="in use">In Use</option>
                              <option value="maintenance">Maintenance</option>
                            </select>
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <Search size={16} className="secondary-color" />
                            <input
                              type="text"
                              className="search-input"
                              placeholder="Search resources..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        {filteredResources.map((resource) => (
                          <div key={resource.id} className="col-lg-6 mb-3">
                            <div 
                              className="resource-item p-4 h-100"
                              onClick={() => setSelectedResource(resource)}
                            >
                              <div className="d-flex justify-content-between align-items-start mb-3">
                                <div className="flex-grow-1">
                                  <h4 className="h5 fw-bold primary-color mb-1">
                                    {resource.name}
                                  </h4>
                                  <p className="small secondary-color mb-1">
                                    {resource.type} • {resource.location}
                                  </p>
                                  <p className="small secondary-color mb-2">
                                    Capacity: {resource.capacity}
                                  </p>
                                  <div className="mb-2">
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                      <span className="small secondary-color">Utilization</span>
                                      <span className="small fw-medium">{resource.utilization}%</span>
                                    </div>
                                    <div className="utilization-bar">
                                      <div 
                                        className="utilization-fill"
                                        style={{ width: `${resource.utilization}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                                <div className="d-flex flex-column align-items-end gap-2">
                                  <span 
                                    className="status-badge text-white"
                                    style={{ backgroundColor: getStatusColor(resource.status) }}
                                  >
                                    {resource.status}
                                  </span>
                                  <button className="btn btn-sm btn-outline-secondary">
                                    <Eye size={14} />
                                  </button>
                                </div>
                              </div>
                              
                              <div className="row">
                                <div className="col-6">
                                  <div className="small">
                                    <strong>Last Maintenance:</strong><br />
                                    {resource.lastMaintenance}
                                  </div>
                                </div>
                                <div className="col-6">
                                  <div className="small">
                                    <strong>Next Maintenance:</strong><br />
                                    {resource.nextMaintenance}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'maintenance' && (
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h3 className="h4 fw-bold primary-color mb-0">Maintenance Schedule</h3>
                        <button className="btn btn-primary-custom">
                          <Plus size={16} className="me-1" />
                          Schedule Maintenance
                        </button>
                      </div>

                      <div className="d-flex flex-column gap-3">
                        {maintenanceSchedule.map((maintenance) => (
                          <div key={maintenance.id} className="maintenance-item p-4">
                            <div className="row align-items-center">
                              <div className="col-md-4">
                                <h4 className="h5 fw-bold primary-color mb-1">
                                  {maintenance.resourceName}
                                </h4>
                                <p className="small secondary-color mb-1">
                                  {maintenance.type}
                                </p>
                                <div className="d-flex align-items-center gap-2">
                                  <Calendar size={14} className="secondary-color" />
                                  <span className="small">{maintenance.scheduledDate}</span>
                                </div>
                              </div>
                              
                              <div className="col-md-3">
                                <div className="small">
                                  <strong>Duration:</strong> {maintenance.estimatedDuration}<br />
                                  <strong>Technician:</strong> {maintenance.technician}
                                </div>
                              </div>
                              
                              <div className="col-md-3">
                                <div className="d-flex flex-column gap-2">
                                  <span 
                                    className="status-badge text-white"
                                    style={{ backgroundColor: getPriorityColor(maintenance.priority) }}
                                  >
                                    {maintenance.priority} Priority
                                  </span>
                                  <span 
                                    className="status-badge text-white"
                                    style={{ backgroundColor: getStatusColor(maintenance.status) }}
                                  >
                                    {maintenance.status}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="col-md-2 text-end">
                                <div className="dropdown">
                                  <button 
                                    className="btn btn-sm btn-outline-secondary dropdown-toggle" 
                                    data-bs-toggle="dropdown"
                                  >
                                    <MoreVertical size={14} />
                                  </button>
                                  <ul className="dropdown-menu">
                                    <li><a className="dropdown-item" href="#">View Details</a></li>
                                    <li><a className="dropdown-item" href="#">Reschedule</a></li>
                                    <li><a className="dropdown-item" href="#">Cancel</a></li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'schedule' && (
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h3 className="h4 fw-bold primary-color mb-0">Resource Schedule</h3>
                        <div className="d-flex gap-2">
                          <button className="btn btn-outline-secondary">
                            <Calendar size={16} className="me-1" />
                            Today
                          </button>
                          <button className="btn btn-outline-secondary">
                            <Calendar size={16} className="me-1" />
                            This Week
                          </button>
                          <button className="btn btn-primary-custom">
                            <Plus size={16} className="me-1" />
                            New Booking
                          </button>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-8">
                          <div className="facility-card p-4" style={{ backgroundColor: '#f8f9fa' }}>
                            <h4 className="h5 primary-color mb-3">Today's Schedule Overview</h4>
                            
                            {/* Operating Theaters */}
                            <div className="mb-4">
                              <h5 className="h6 fw-bold primary-color mb-3">Operating Theaters</h5>
                              <div className="resource-item p-3 mb-2">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                  <strong>Operating Theater 1</strong>
                                  <span className="status-badge text-white bg-success">Available</span>
                                </div>
                                <div className="d-flex flex-column gap-1">
                                  <div className="d-flex justify-content-between">
                                    <span className="small">08:00-12:00</span>
                                    <span className="small">Cardiac Surgery - Dr. Farai Nyamukapa</span>
                                  </div>
                                  <div className="d-flex justify-content-between">
                                    <span className="small">14:00-17:00</span>
                                    <span className="small">Orthopedic Surgery - Dr. Tendai Mukamuri</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* ICU Beds */}
                            <div className="mb-4">
                              <h5 className="h6 fw-bold primary-color mb-3">ICU Beds</h5>
                              <div className="resource-item p-3 mb-2">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                  <strong>ICU Bed 12</strong>
                                  <span className="status-badge text-white bg-warning">Occupied</span>
                                </div>
                                <div className="small">
                                  Patient: PAT-456 | Admitted: 2024-07-25 | Post-operative monitoring
                                </div>
                              </div>
                            </div>

                            {/* Dialysis */}
                            <div className="mb-4">
                              <h5 className="h6 fw-bold primary-color mb-3">Dialysis Machines</h5>
                              <div className="resource-item p-3 mb-2">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                  <strong>Dialysis Machine 3</strong>
                                  <span className="status-badge text-white bg-success">Available</span>
                                </div>
                                <div className="d-flex flex-column gap-1">
                                  <div className="d-flex justify-content-between">
                                    <span className="small">08:00-12:00</span>
                                    <span className="small">Patient: PAT-123</span>
                                  </div>
                                  <div className="d-flex justify-content-between">
                                    <span className="small">14:00-18:00</span>
                                    <span className="small">Patient: PAT-789</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* MRI Scanner */}
                            <div className="mb-4">
                              <h5 className="h6 fw-bold primary-color mb-3">MRI Scanner</h5>
                              <div className="resource-item p-3 mb-2">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                  <strong>MRI Scanner</strong>
                                  <span className="status-badge text-white bg-success">Available</span>
                                </div>
                                <div className="d-flex flex-column gap-1">
                                  <div className="d-flex justify-content-between">
                                    <span className="small">09:00</span>
                                    <span className="small">Brain MRI - PAT-111</span>
                                  </div>
                                  <div className="d-flex justify-content-between">
                                    <span className="small">11:00</span>
                                    <span className="small">Spine MRI - PAT-222</span>
                                  </div>
                                  <div className="d-flex justify-content-between">
                                    <span className="small">14:00</span>
                                    <span className="small">Knee MRI - PAT-333</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-4">
                          <div className="facility-card p-4" style={{ backgroundColor: '#fef3c7' }}>
                            <h4 className="h5 primary-color mb-3">
                              <Clock size={16} className="me-1" />
                              Upcoming Events
                            </h4>
                            <div className="d-flex flex-column gap-3">
                              <div className="d-flex flex-column">
                                <div className="fw-medium">08:00 AM</div>
                                <div className="small secondary-color">Cardiac Surgery begins - OT1</div>
                              </div>
                              <div className="d-flex flex-column">
                                <div className="fw-medium">09:00 AM</div>
                                <div className="small secondary-color">MRI scan - Brain imaging</div>
                              </div>
                              <div className="d-flex flex-column">
                                <div className="fw-medium">10:00 AM</div>
                                <div className="small secondary-color">Equipment maintenance check</div>
                              </div>
                              <div className="d-flex flex-column">
                                <div className="fw-medium">02:00 PM</div>
                                <div className="small secondary-color">Orthopedic Surgery - OT1</div>
                              </div>
                            </div>
                          </div>

                          <div className="facility-card p-4 mt-3" style={{ backgroundColor: '#f3f4f6' }}>
                            <h4 className="h5 primary-color mb-3">
                              <AlertTriangle size={16} className="text-warning me-1" />
                              Resource Conflicts
                            </h4>
                            <div className="small">
                              <div className="text-warning mb-2">
                                <strong>Warning:</strong> X-ray Machine 2 scheduled for maintenance during peak hours
                              </div>
                              <div className="text-info">
                                <strong>Note:</strong> ICU at 92% capacity - consider overflow protocols
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resource Detail Modal */}
      {selectedResource && (
        <ResourceDetailModal 
          resource={selectedResource} 
          onClose={() => setSelectedResource(null)} 
        />
      )}
    </>
  );
};

export default FacilityResourceManagement;