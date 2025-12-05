import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, History, Search, CheckCircle } from 'lucide-react';
import { supabase } from '../supabaseClient';
import useCurrentUserProfile from '../hooks/useCurrentUserProfile';
import Button from '../components/UI/Button';
import StatusBadge from '../components/UI/StatusBadge';
import StudentHistoryModal from '../components/UI/StudentHistoryModal';
import { computeStudentStatus, filterStudentsByStatus, sortStudentsByStatus } from '../utils/studentStatus';
import { logStudentUpdate, logStudentCreate } from '../utils/activityLogger';
import { checkinStudent } from '../utils/checkinStudent';
import SEO from '../components/SEO/SEO';
import './TeacherDashboard.css';

const TeacherDashboard = () => {
  const { user, profile, loading: profileLoading, error: profileError, isSuperAdmin } = useCurrentUserProfile();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkinLoading, setCheckinLoading] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedStudentForHistory, setSelectedStudentForHistory] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    start_date: '',
    end_date: '',
    sessions_left: '',
    total_paid: '',
    branch: ''
  });
  const [endDateWarning, setEndDateWarning] = useState('');
  const navigate = useNavigate();

  const fetchStudents = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const userIsSuperAdmin = profile?.role === 'superadmin';

      // Only select needed columns for faster query
      let query = supabase
        .from('students')
        .select('id, name, phone, start_date, end_date, sessions_left, total_paid, branch, teacher_id');

      // Filter by teacher_id unless superadmin
      if (!userIsSuperAdmin) {
        query = query.eq('teacher_id', user.id);
      }

      const { data, error: studentsError } = await query
        .order('start_date', { ascending: false })
        .limit(100); // Limit to 100 students for faster initial load

      if (studentsError) {
        console.error('Error fetching students:', studentsError);
        setError('Lỗi khi tải danh sách học sinh: ' + studentsError.message);
        setStudents([]);
        return;
      }

      setStudents(data || []);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Đã xảy ra lỗi khi tải danh sách học sinh');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, [user, profile]);

  useEffect(() => {
    // Wait for profile to load, then fetch students
    if (!profileLoading && user) {
      fetchStudents();
    } else if (!profileLoading && !user) {
      setLoading(false);
    }
    // Note: fetchStudents is NOT in dependencies to avoid infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileLoading, user, profile?.role]);

  // Apply status filter and search when they change
  useEffect(() => {
    let filtered = filterStudentsByStatus(students, statusFilter);

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      filtered = filtered.filter(student => {
        const name = student.name || '';
        return name.toLowerCase().includes(query);
      });
    }

    // Sort by status priority (critical first)
    const sorted = sortStudentsByStatus(filtered);
    setFilteredStudents(sorted);
  }, [students, statusFilter, searchQuery]);

  const handleLogout = async () => {
    try {
      console.log('Logout: Attempting to sign out...');
      
      // Clear local session data first
      if (typeof window !== 'undefined') {
        localStorage.removeItem('sb-auth-token');
      }
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
        // Even if signOut fails, clear local storage and redirect
        if (typeof window !== 'undefined') {
          localStorage.clear();
        }
        navigate('/login', { replace: true });
      } else {
        console.log('Logout: Successfully signed out');
        // Clear any remaining session data
        if (typeof window !== 'undefined') {
          localStorage.clear();
        }
        navigate('/login', { replace: true });
      }
    } catch (err) {
      console.error('Error signing out:', err);
      // On error, still try to clear and redirect
      if (typeof window !== 'undefined') {
        localStorage.clear();
      }
      navigate('/login', { replace: true });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '-';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const openAddModal = () => {
    setEditingStudent(null);
    setFormData({
      name: '',
      phone: '',
      start_date: '',
      end_date: '',
      sessions_left: '',
      total_paid: '',
      branch: profile?.branch || ''
    });
    setFormError('');
    setEndDateWarning('');
    setShowModal(true);
  };

  const openEditModal = (student) => {
    setEditingStudent(student);
    const endDateValue = student.end_date ? student.end_date.split('T')[0] : '';
    setFormData({
      name: student.name || '',
      phone: student.phone || '',
      start_date: student.start_date ? student.start_date.split('T')[0] : '',
      end_date: endDateValue,
      sessions_left: student.sessions_left !== null && student.sessions_left !== undefined ? student.sessions_left : '',
      total_paid: student.total_paid !== null && student.total_paid !== undefined ? student.total_paid : '',
      branch: student.branch || ''
    });
    setFormError('');
    
    // Validate end_date if it exists and is in the past
    if (endDateValue) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(endDateValue);
      selectedDate.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        setEndDateWarning('Cảnh báo: Ngày kết thúc đã qua. Vui lòng chọn ngày trong tương lai.');
      } else {
        setEndDateWarning('');
      }
    } else {
      setEndDateWarning('');
    }
    
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingStudent(null);
    setFormError('');
    setEndDateWarning('');
  };

  const openHistoryModal = (student) => {
    setSelectedStudentForHistory(student);
    setShowHistoryModal(true);
  };

  const closeHistoryModal = () => {
    setShowHistoryModal(false);
    setSelectedStudentForHistory(null);
  };

  const handleCheckin = async (student) => {
    // Check if student has remaining sessions
    const currentSessions = student.sessions_left !== null && student.sessions_left !== undefined
      ? student.sessions_left
      : 0;

    if (currentSessions <= 0) {
      setError('Học sinh không còn buổi học nào để check-in.');
      return;
    }

    // Confirm check-in
    const confirmed = window.confirm(
      `Xác nhận check-in cho học sinh "${student.name || 'N/A'}"?\n\n` +
      `Số buổi còn lại sẽ giảm từ ${currentSessions} xuống ${Math.max(0, currentSessions - 1)}.`
    );

    if (!confirmed) {
      return;
    }

    // Set loading state for this specific student
    setCheckinLoading(prev => ({ ...prev, [student.id]: true }));
    setError('');

    try {
      if (!user) {
        setError('Không tìm thấy thông tin người dùng');
        setCheckinLoading(prev => ({ ...prev, [student.id]: false }));
        return;
      }

      const result = await checkinStudent({
        student,
        teacherId: user.id
      });

      if (result.success) {
        // Refresh student list
        await fetchStudents();
        // If history modal is open for this student, refresh it
        if (selectedStudentForHistory?.id === student.id && showHistoryModal) {
          // The history will auto-refresh when the modal re-renders
          // But we can force a refetch by closing and reopening if needed
        }
      } else {
        setError(result.error || 'Lỗi khi check-in học sinh');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi: ' + err.message);
    } finally {
      setCheckinLoading(prev => ({ ...prev, [student.id]: false }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setFormError('');
    
    // Validate end_date if it's being changed
    if (name === 'end_date' && value) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(value);
      selectedDate.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        setEndDateWarning('Cảnh báo: Ngày kết thúc đã qua. Vui lòng chọn ngày trong tương lai.');
      } else {
        setEndDateWarning('');
      }
    } else if (name === 'end_date' && !value) {
      setEndDateWarning('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');

    try {
      if (!user) {
        setFormError('Không tìm thấy thông tin người dùng');
        setFormLoading(false);
        return;
      }

      const studentData = {
        teacher_id: user.id,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        sessions_left: formData.sessions_left ? parseInt(formData.sessions_left) : null,
        total_paid: formData.total_paid ? parseFloat(formData.total_paid) : null,
        branch: formData.branch.trim() || null
      };

      if (editingStudent) {
        // Update existing student - fetch current data first for logging
        const { data: currentStudentData } = await supabase
          .from('students')
          .select('*')
          .eq('id', editingStudent.id)
          .single();

        // Update existing student
        let updateQuery = supabase
          .from('students')
          .update(studentData)
          .eq('id', editingStudent.id);

        // If not superadmin, ensure they can only update their own students
        if (!isSuperAdmin) {
          updateQuery = updateQuery.eq('teacher_id', user.id);
        }

        const { data: updatedStudent, error: updateError } = await updateQuery.select().single();

        if (updateError) {
          setFormError('Lỗi khi cập nhật học sinh: ' + updateError.message);
          setFormLoading(false);
          return;
        }

        // Log the activity
        if (currentStudentData && updatedStudent) {
          await logStudentUpdate({
            oldStudent: currentStudentData,
            newStudent: updatedStudent,
            teacherId: user.id
          });
        }
      } else {
        // Insert new student
        const { data: newStudent, error: insertError } = await supabase
          .from('students')
          .insert([studentData])
          .select()
          .single();

        if (insertError) {
          setFormError('Lỗi khi thêm học sinh: ' + insertError.message);
          setFormLoading(false);
          return;
        }

        // Log the creation
        if (newStudent) {
          await logStudentCreate({
            newStudent,
            teacherId: user.id
          });
        }
      }

      // Refresh student list
      await fetchStudents();
      closeModal();
    } catch (err) {
      setFormError('Đã xảy ra lỗi: ' + err.message);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Trang Giáo Viên - Học Đàn Tranh"
        description="Trang quản lý dành cho giáo viên"
      />
      <div className="teacher-dashboard-page">
        <div className="teacher-dashboard-container">
          <div className="teacher-dashboard-header">
            <div>
              <h1 className="teacher-dashboard-title">
                {isSuperAdmin ? 'Trang Quản Trị' : 'Trang Giáo Viên'}
              </h1>
              <p className="teacher-dashboard-subtitle">
                {profile?.full_name
                  ? `Xin chào, ${profile.full_name}${profile.role ? ` - ${profile.role === 'teacher' ? 'Giáo viên' : profile.role === 'superadmin' ? 'Quản trị viên' : profile.role}` : ''}`
                  : user?.email
                    ? `Xin chào, ${user.email}`
                    : 'Chào mừng bạn đến với trang quản lý'}
              </p>
            </div>
            <Button onClick={handleLogout} variant="outline" className="logout-button">
              Đăng xuất
            </Button>
          </div>

          {(profileLoading || loading) && (
            <div className="teacher-dashboard-content">
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Đang tải dữ liệu...</p>
              </div>
            </div>
          )}

          {!profileLoading && !loading && (profileError || error) && (
            <div className="error-message">
              {profileError || error}
            </div>
          )}

          {!profileLoading && !loading && !user && (
            <div className="teacher-dashboard-content">
              <div className="loading-state">
                <div className="error-message" style={{ maxWidth: '600px', margin: '2rem auto' }}>
                  <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
                    Không tìm thấy phiên đăng nhập. Vui lòng đăng nhập lại.
                  </p>
                  <Button 
                    onClick={() => navigate('/login', { replace: true })} 
                    variant="primary"
                  >
                    Đăng nhập
                  </Button>
                </div>
              </div>
            </div>
          )}

          {!profileLoading && !loading && user && (
            <div className="teacher-dashboard-content">
              <>
                <div className="students-header">
                  <div>
                    <h2 className="students-title">Danh Sách Học Sinh</h2>
                    <p className="students-count">
                      Hiển thị: {filteredStudents.length} / {students.length} học sinh
                    </p>
                  </div>
                  <Button onClick={openAddModal} variant="primary" className="add-student-button">
                    + Thêm học sinh
                  </Button>
                </div>

                <div className="filters-section">
                  <div className="search-section">
                    <div className="search-input-wrapper">
                      <Search size={20} className="search-icon" />
                      <input
                        type="text"
                        placeholder="Tìm kiếm theo tên học sinh..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="search-clear"
                          title="Xóa tìm kiếm"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="status-filter-section">
                    <label htmlFor="status-filter" className="filter-label">Lọc theo trạng thái:</label>
                    <select
                      id="status-filter"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="status-filter-select"
                    >
                      <option value="all">Tất cả</option>
                      <option value="critical">Cần chú ý</option>
                      <option value="warning">Cảnh báo</option>
                      <option value="normal">Bình thường</option>
                    </select>
                  </div>
                </div>

                {filteredStudents.length === 0 ? (
                  <div className="empty-state">
                    <p>
                      {students.length === 0
                        ? 'Chưa có học sinh nào trong danh sách.'
                        : searchQuery.trim()
                          ? `Không tìm thấy học sinh nào với từ khóa "${searchQuery}".`
                          : 'Không tìm thấy học sinh nào với bộ lọc đã chọn.'}
                    </p>
                  </div>
                ) : (
                  <div className="table-container">
                    <table className="students-table">
                      <thead>
                        <tr>
                          <th className="col-name">Tên</th>
                          <th className="col-phone">Số điện thoại</th>
                          <th className="col-date">Ngày bắt đầu</th>
                          <th className="col-date">Ngày kết thúc</th>
                          <th className="col-sessions">Số buổi còn lại</th>
                          <th className="col-paid">Tổng đã thanh toán</th>
                          <th className="col-branch">Chi nhánh</th>
                          <th className="col-status">Trạng thái</th>
                          <th className="col-actions">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.map((student) => {
                          const { status, reason } = computeStudentStatus(student);
                          return (
                            <tr key={student.id}>
                              <td className="col-name">{student.name || '-'}</td>
                              <td className="col-phone">{student.phone || '-'}</td>
                              <td className="col-date">{formatDate(student.start_date)}</td>
                              <td className="col-date">{formatDate(student.end_date)}</td>
                              <td className="col-sessions">{student.sessions_left !== null && student.sessions_left !== undefined ? student.sessions_left : '-'}</td>
                              <td className="col-paid">{formatCurrency(student.total_paid)}</td>
                              <td className="col-branch">{student.branch || '-'}</td>
                              <td className="col-status">
                                <StatusBadge status={status} reason={reason} />
                              </td>
                              <td className="col-actions">
                                <div className="action-buttons">
                                  <Button
                                    onClick={() => openHistoryModal(student)}
                                    variant="text"
                                    className="history-button"
                                    title="Xem lịch sử"
                                  >
                                    <History size={18} />
                                  </Button>
                                  <Button
                                    onClick={() => handleCheckin(student)}
                                    variant="text"
                                    className="checkin-button"
                                    disabled={
                                      (student.sessions_left !== null && student.sessions_left !== undefined && student.sessions_left <= 0) ||
                                      checkinLoading[student.id]
                                    }
                                    title={
                                      student.sessions_left <= 0
                                        ? 'Học sinh không còn buổi học'
                                        : 'Check-in học sinh'
                                    }
                                  >
                                    {checkinLoading[student.id] ? (
                                      '...'
                                    ) : (
                                      <>
                                        <CheckCircle size={18} />
                                        <span className="checkin-button-text">Check-in</span>
                                      </>
                                    )}
                                  </Button>
                                  <Button
                                    onClick={() => openEditModal(student)}
                                    variant="text"
                                    className="edit-button"
                                  >
                                    Sửa
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            </div>
          )}

          {/* Student History Modal */}
          <StudentHistoryModal
            isOpen={showHistoryModal}
            student={selectedStudentForHistory}
            onClose={closeHistoryModal}
          />

          {/* Student Form Modal */}
          {showModal && (
            <div className="modal-overlay" onClick={closeModal}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3 className="modal-title">
                    {editingStudent ? 'Sửa thông tin học sinh' : 'Thêm học sinh mới'}
                  </h3>
                  <button className="modal-close" onClick={closeModal}>
                    <X size={24} />
                  </button>
                </div>

                {formError && (
                  <div className="error-message">
                    {formError}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="student-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Tên học sinh *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                        disabled={formLoading}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="phone">Số điện thoại</label>
                      <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="form-input"
                        disabled={formLoading}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="start_date">Ngày bắt đầu</label>
                      <input
                        type="date"
                        id="start_date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleInputChange}
                        className="form-input"
                        disabled={formLoading}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="end_date">Ngày kết thúc</label>
                      <input
                        type="date"
                        id="end_date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleInputChange}
                        className={`form-input ${endDateWarning ? 'form-input-warning' : ''}`}
                        disabled={formLoading}
                      />
                      {endDateWarning && (
                        <div className="form-warning-message">
                          {endDateWarning}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="sessions_left">Số buổi còn lại</label>
                      <input
                        type="number"
                        id="sessions_left"
                        name="sessions_left"
                        value={formData.sessions_left}
                        onChange={handleInputChange}
                        min="0"
                        className="form-input"
                        disabled={formLoading}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="total_paid">Tổng đã thanh toán</label>
                      <input
                        type="number"
                        id="total_paid"
                        name="total_paid"
                        value={formData.total_paid}
                        onChange={handleInputChange}
                        min="0"
                        step="1000"
                        className="form-input"
                        disabled={formLoading}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="branch">Chi nhánh</label>
                    <input
                      type="text"
                      id="branch"
                      name="branch"
                      value={formData.branch}
                      onChange={handleInputChange}
                      className="form-input"
                      disabled={formLoading}
                    />
                  </div>

                  <div className="modal-actions">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={closeModal}
                      disabled={formLoading}
                    >
                      Hủy
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={formLoading}
                    >
                      {formLoading ? 'Đang xử lý...' : editingStudent ? 'Cập nhật' : 'Thêm mới'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TeacherDashboard;
