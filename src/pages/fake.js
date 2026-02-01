              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} style={{backgroundColor: 'white'}}>
                    <td style={styles.td}>
                      <div 
                        className="d-flex align-items-center gap-2" 
                        style={{cursor: 'pointer'}} 
                        onClick={() => navigate("/student-profile", { state: { student } })}
                      >
                        <img src={student.avatar || student.photo || 'https://via.placeholder.com/40'} style={styles.avatar} alt="avatar" />
                        <div>
                          <div className="fw-bold" style={{color: '#1E3A8A'}}>{student.username}</div>
                          <small className="text-muted">{student.gender}</small>
                        </div>
                      </div>
                    </td>
                    <td style={{...styles.td, fontWeight: 'bold'}}>{student.studentId}</td>
                    <td style={styles.td}>
                      {student.dormHouse || <span className="text-muted italic">Not Assigned</span>}
                    </td>
                    <td style={styles.td}>
                      {student.dormNumber || <span className="text-muted">-</span>}
                    </td>
                    <td style={styles.td}>
                      <span className={`badge ${student.rentStatus === 'Paid' ? 'bg-success' : 'bg-danger'}`}>
                        {student.rentStatus}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span 
                        className={`badge rounded-pill border ${
                          student.accountStatus ? 'bg-success-subtle text-success border-success' : 'bg-light text-muted border-secondary'
                        }`}
                        style={{ padding: '5px 12px' }}
                      >
                        {student.accountStatus ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div className="d-flex gap-2">
                        {/* If student has no dormHouse or dormNumber, show only Assign */}
                        {(!student.dormHouse || !student.dormNumber) ? (
                          <button 
                            title="Assign"
                            className="btn btn-sm btn-success d-flex align-items-center gap-1"
                            onClick={() => { setSelectedStudent(student); setActiveModal('assign'); }}
                          >
                            <UserPlus size={14}/> Assign Residency
                          </button>
                        ) : (
                          <>
                            {/* If student IS assigned, show Move and Deactivate */}
                            <button 
                              title="Move"
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => { setSelectedStudent(student); setActiveModal('move'); }}
                            >
                              <ArrowRightLeft size={14}/>
                            </button>

                            <button 
                              title="Deactivate"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => { setSelectedStudent(student); setActiveModal('deactivate'); }}
                            >
                              <UserMinus size={14}/>
                            </button>

                            <button 
                              title="Update Rent"
                              className="btn btn-sm btn-outline-success"
                              onClick={() => { 
                                setSelectedStudent(student); 
                                setActiveModal('rent'); 
                                setFormData({ rentStatus: student.rentStatus || 'Pending' }); 
                              }}
                            >
                              <CreditCard size={14}/>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>