import React, { useEffect, useState } from "react";
import {
  Home,
  FileText,
  User,
  Calendar,
  CreditCard,
} from "lucide-react";

const API_BASE =
  "https://nursing-school-backend--thomasmethembe4.replit.app";

export default function StudentRecords() {
  const [student, setStudent] = useState(null);
  const [housingHistory, setHousingHistory] = useState([]);
  const [rentalRecords, setRentalRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const username = localStorage.getItem("user");

  useEffect(() => {
    if (!username) return;

    const fetchData = async () => {
      try {
        // 1️⃣ Fetch student info
        const userRes = await fetch(`${API_BASE}/get-user/${username}`);
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
  }, [username]);

  if (loading) {
    return (
      <div className="container py-5 text-center text-primary">
        Loading student dashboard…
      </div>
    );
  }

  if (!student) {
    return (
      <div className="container py-5 text-danger text-center">
        Student not found
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* =====================
          Student Header
      ====================== */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body d-flex align-items-center gap-3">
          <User size={32} className="text-primary" />
          <div>
            <h5 className="mb-0 text-primary">
              {student.username}
            </h5>
            <small className="text-muted">
              Student ID: {student.studentId || "—"}
            </small>
          </div>

          <span
            className={`ms-auto badge ${
              (student.rentStatus || "Unpaid") === "Paid"
                ? "bg-success"
                : "bg-danger"
            }`}
          >
            {student.rentStatus || "Unpaid"}
          </span>
        </div>
      </div>

      {/* =====================
          Cards Row
      ====================== */}
      <div className="row g-4">
        {/* =====================
            Housing Records
        ====================== */}
        <div className="col-md-6">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-header bg-primary text-white d-flex align-items-center gap-2">
              <Home size={18} />
              Housing History
            </div>

            <div className="card-body p-0">
              {housingHistory.length === 0 ? (
                <div className="p-3 text-muted text-center">
                  No housing records found
                </div>
              ) : (
                <ul className="list-group list-group-flush">
                  {housingHistory.map((record) => (
                    <li
                      key={record._id}
                      className="list-group-item"
                    >
                      <div className="fw-semibold text-primary">
                        {record.action.toUpperCase()}
                      </div>
                      <div className="small text-muted">
                        {record.description}
                      </div>
                      <div className="small">
                        <Calendar size={14} />{" "}
                        {new Date(
                          record.timestamp,
                        ).toLocaleDateString()}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* =====================
            Rental Records
        ====================== */}
        <div className="col-md-6">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-header bg-primary text-white d-flex align-items-center gap-2">
              <CreditCard size={18} />
              Rental Payments
            </div>

            <div className="card-body p-0">
              {rentalRecords.length === 0 ? (
                <div className="p-3 text-muted text-center">
                  No rental records found
                </div>
              ) : (
                <ul className="list-group list-group-flush">
                  {rentalRecords.map((record) => (
                    <li
                      key={record._id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <div className="fw-semibold text-primary">
                          {record.month}
                        </div>
                        <small className="text-muted">
                          Approved by: {record.approvedBy}
                        </small>
                      </div>

                      <span
                        className={`badge ${
                          record.status === "Paid"
                            ? "bg-success"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {record.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
