import React, { useState } from 'react';
import { Users, Settings, PlusCircle, Save } from 'lucide-react';
import API_URL from '../config';

const ManageSchedule = () => {
  const colors = { primary: '#1E3A8A', secondary: '#3B82F6', bg: '#F0F7FF' };

  // Organize by House for clarity
  const houses = [
    { 
      name: "Adlam House", 
      dayReq: 3, 
      nightReq: 1, 
      staff: ["Warden Phiri", "Warden Dube", "Warden Sibanda", "Warden Zhou"] 
    },
    { 
      name: "Nurses Home", 
      dayReq: 2, 
      nightReq: 1, 
      staff: ["Warden Musoni", "Warden Gumbo", "Warden Nyoni"] 
    }
  ];

  return (
    <div style={{ backgroundColor: colors.bg, minHeight: '100vh', padding: '30px' }}>
      <div className="container-fluid" style={{ maxWidth: '1200px' }}>
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div>
            <h2 className="fw-bold" style={{ color: colors.primary }}>Matron's Master Rota</h2>
            <p className="text-muted">Week 4: Jan 26 - Feb 01, 2026</p>
          </div>
          <div className="btn-group shadow-sm">
            <button className="btn btn-white border">Export PDF</button>
            <button className="btn text-white" style={{ backgroundColor: colors.primary }}>
              <Save size={18} className="me-2" /> Save Changes
            </button>
          </div>
        </div>

        <div className="row">
          {houses.map((house, idx) => (
            <div key={idx} className="col-lg-6 mb-4">
              <div className="card border-0 shadow-sm" style={{ borderRadius: '20px' }}>
                <div className="card-header border-0 p-4" style={{ backgroundColor: colors.primary, borderRadius: '20px 20px 0 0' }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <h4 className="text-white mb-0">{house.name}</h4>
                    <span className="badge bg-light text-primary">{house.staff.length} Wardens Assigned</span>
                  </div>
                </div>
                
                <div className="card-body p-4">
                  <h6 className="fw-bold mb-3" style={{ color: colors.secondary }}>Day Shift (Required: {house.dayReq})</h6>
                  <div className="list-group mb-4">
                    {house.staff.slice(0, house.dayReq).map((s, i) => (
                      <div key={i} className="list-group-item d-flex justify-content-between border-0 bg-light mb-2 rounded shadow-sm">
                        <span>{s}</span>
                        <Settings size={16} className="text-muted cursor-pointer" />
                      </div>
                    ))}
                  </div>

                  <h6 className="fw-bold mb-3" style={{ color: colors.primary }}>Night Shift (Required: {house.nightReq})</h6>
                  <div className="list-group">
                    <div className="list-group-item d-flex justify-content-between border-0 text-white mb-2 rounded shadow-sm" style={{ backgroundColor: colors.secondary }}>
                      <span>{house.staff[house.staff.length - 1]}</span>
                      <Settings size={16} className="text-white opacity-75" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Assignment Panel */}
        <div className="card border-0 shadow-sm mt-4" style={{ borderRadius: '15px' }}>
          <div className="card-body d-flex align-items-center justify-content-between p-4">
            <div className="d-flex align-items-center">
              <Users size={32} color={colors.secondary} className="me-3" />
              <div>
                <h6 className="mb-0 fw-bold">Unassigned/Off-Duty Wardens</h6>
                <small className="text-muted">Automatic rotation has rested 2 staff members today.</small>
              </div>
            </div>
            <button className="btn btn-outline-primary rounded-pill px-4">Rotate Schedule</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageSchedule;