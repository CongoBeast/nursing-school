import React, { useEffect, useState } from "react";
import {
  Home,
  FileText,
  User,
  Calendar,
  CreditCard,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import "./StudentRecords.css"; // We'll add custom CSS

import API_URL from '../config';


const API_BASE =
  "https://nursing-school-backend--thomasmethembe4.replit.app";

export default function StudentRecords() {
  const [student, setStudent] = useState(null);
  const [housingHistory, setHousingHistory] = useState([]);
  const [rentalRecords, setRentalRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        // 1️⃣ Fetch student info
        const userRes = await fetch(`${API_URL}/get-user/${userId}`);
        const userData = await userRes.json();
        setStudent(userData);

        // 2️⃣ Fetch housing history
        if (userData.studentId) {
          const housingRes = await fetch(
            `${API_BASE}/get-housing-history/${userData.studentId}`,
          );
          const housingData = await housingRes.json();
          setHousingHistory(housingData);

          // 3️⃣ Fetch rental records
          const rentalRes = await fetch(
            `${API_BASE}/get-rental-records/${userData.studentId}`,
          );
          const rentalData = await rentalRes.json();
          setRentalRecords(rentalData);
        }
      } catch (err) {
        console.error("Failed to load student data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <div className="student-records-container">
        <div className="loading-spinner">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-primary fw-semibold">Loading student dashboard…</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="student-records-container">
        <div className="error-message">
          <XCircle size={48} className="text-danger mb-3" />
          <h4 className="text-danger">Student not found</h4>
        </div>
      </div>
    );
  }

  return (
    <div className="student-records-container">
      <div className="container-fluid py-4 px-lg-5">
        {/* =====================
            Page Header
        ====================== */}
        <div className="page-header mb-4">
          <h2 className="page-title">
            <FileText size={28} className="me-2" />
            My Records
          </h2>
          <p className="text-muted">View your housing history and payment records</p>
        </div>

        {/* =====================
            Student Info Card
        ====================== */}
        <div className="student-info-card mb-4">
          <div className="card-content">
            <div className="student-avatar">
              <User size={40} />
            </div>
            <div className="student-details">
              <h4 className="student-name">{student.username}</h4>
              <p className="student-id">
                <span className="label">Student ID:</span> 
                <span className="value">{student.studentId || "—"}</span>
              </p>
              <p className="student-email mb-0">
                <span className="label">Email:</span> 
                <span className="value">{student.email || "—"}</span>
              </p>
            </div>
            <div className="student-status">
              <div className={`status-badge ${
                (student.rentStatus || "Unpaid") === "Paid"
                  ? "status-paid"
                  : "status-unpaid"
              }`}>
                {(student.rentStatus || "Unpaid") === "Paid" ? (
                  <CheckCircle size={18} className="me-2" />
                ) : (
                  <XCircle size={18} className="me-2" />
                )}
                {student.rentStatus || "Unpaid"}
              </div>
            </div>
          </div>
        </div>

        {/* =====================
            Records Grid
        ====================== */}
        <div className="row g-4">
          {/* =====================
              Housing History
          ====================== */}
          <div className="col-lg-6">
            <div className="records-card housing-card">
              <div className="card-header-custom">
                <div className="header-icon">
                  <Home size={20} />
                </div>
                <h5 className="header-title">Housing History</h5>
                <span className="record-count">{housingHistory.length}</span>
              </div>

              <div className="card-body-custom">
                {housingHistory.length === 0 ? (
                  <div className="empty-state">
                    <Home size={48} className="empty-icon" />
                    <p className="empty-text">No housing records found</p>
                  </div>
                ) : (
                  <div className="records-list">
                    {housingHistory.map((record, index) => (
                      <div key={record._id} className="record-item">
                        <div className="record-timeline">
                          <div className="timeline-dot"></div>
                          {index !== housingHistory.length - 1 && (
                            <div className="timeline-line"></div>
                          )}
                        </div>
                        <div className="record-content">
                          <div className="record-header">
                            <span className={`action-badge action-${record.action}`}>
                              {record.action.toUpperCase()}
                            </span>
                            <span className="record-date">
                              <Calendar size={14} className="me-1" />
                              {new Date(record.timestamp).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                          <p className="record-description">{record.description}</p>
                          {record.house && (
                            <p className="record-location">
                              <MapPin size={14} className="me-1" />
                              {record.house} - Room {record.roomNumber || record.newRoom}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* =====================
              Rental Payments
          ====================== */}
          <div className="col-lg-6">
            <div className="records-card rental-card">
              <div className="card-header-custom">
                <div className="header-icon">
                  <CreditCard size={20} />
                </div>
                <h5 className="header-title">Rental Payments</h5>
                <span className="record-count">{rentalRecords.length}</span>
              </div>

              <div className="card-body-custom">
                {rentalRecords.length === 0 ? (
                  <div className="empty-state">
                    <CreditCard size={48} className="empty-icon" />
                    <p className="empty-text">No rental records found</p>
                  </div>
                ) : (
                  <div className="records-list">
                    {rentalRecords.map((record) => (
                      <div key={record._id} className="payment-item">
                        <div className="payment-icon">
                          <CreditCard size={20} />
                        </div>
                        <div className="payment-details">
                          <h6 className="payment-month">{record.month}</h6>
                          <p className="payment-approver">
                            Approved by: <span>{record.approvedBy}</span>
                          </p>
                          {record.createdAt && (
                            <p className="payment-date">
                              <Clock size={14} className="me-1" />
                              {new Date(record.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                          )}
                        </div>
                        <div className="payment-status">
                          <span className={`status-pill ${
                            record.status === "Paid"
                              ? "status-pill-paid"
                              : "status-pill-pending"
                          }`}>
                            {record.status === "Paid" ? (
                              <CheckCircle size={16} className="me-1" />
                            ) : (
                              <Clock size={16} className="me-1" />
                            )}
                            {record.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}