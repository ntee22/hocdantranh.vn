import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { History } from 'lucide-react';
import { supabase } from '../supabaseClient';
import useCurrentUserProfile from '../hooks/useCurrentUserProfile';
import Button from '../components/UI/Button';
import StatusBadge from '../components/UI/StatusBadge';
import StudentHistoryModal from '../components/UI/StudentHistoryModal';
import { computeStudentStatus, filterStudentsByStatus, sortStudentsByStatus } from '../utils/studentStatus';
import SEO from '../components/SEO/SEO';
import './SuperAdminDashboard.css';

const SuperAdminDashboard = () => {
  const { user, profile, loading: profileLoading } = useCurrentUserProfile();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedStudentForHistory, setSelectedStudentForHistory] = useState(null);
  const [filters, setFilters] = useState({
    branch: '',
    teacher: '',
    status: 'all'
  });
  const navigate = useNavigate();

  // Fetch all students with teacher information
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch all students
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('*')
        .order('start_date', { ascending: false });

      if (studentsError) {
        setError('Lỗi khi tải danh sách học sinh: ' + studentsError.message);
        setLoading(false);
        return;
      }

      // Fetch all teacher profiles
      const teacherIds = [...new Set(studentsData?.map(s => s.teacher_id).filter(Boolean) || [])];
      let teacherProfilesMap = {};

      if (teacherIds.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, email, branch')
          .in('id', teacherIds);

        if (!profilesError && profilesData) {
          teacherProfilesMap = profilesData.reduce((acc, profile) => {
            acc[profile.id] = profile;
            return acc;
          }, {});
        }
      }

      // Combine students with teacher information
      const studentsWithTeachers = (studentsData || []).map(student => ({
        ...student,
        teacher: teacherProfilesMap[student.teacher_id] || null
      }));

      setStudents(studentsWithTeachers);

      // Extract unique branches and teachers
      const uniqueBranches = [...new Set(studentsWithTeachers.map(s => s.branch).filter(Boolean))].sort();
      const uniqueTeachers = [...new Set(
        studentsWithTeachers
          .map(s => s.teacher?.full_name || s.teacher?.email)
          .filter(Boolean)
      )].sort();

      setBranches(uniqueBranches);
      setTeachers(uniqueTeachers);
    } catch (err) {
      setError('Đã xảy ra lỗi: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!profileLoading && user) {
      fetchStudents();
    }
  }, [user, profileLoading]);

  // Apply filters
  useEffect(() => {
    let filtered = [...students];

    // Filter by branch
    if (filters.branch) {
      filtered = filtered.filter(s => s.branch === filters.branch);
    }

    // Filter by teacher
    if (filters.teacher) {
      filtered = filtered.filter(s => {
        const teacherName = s.teacher?.full_name || s.teacher?.email || '';
        return teacherName === filters.teacher;
      });
    }

    // Filter by status
    filtered = filterStudentsByStatus(filtered, filters.status);

    // Sort by status priority (critical first)
    const sorted = sortStudentsByStatus(filtered);
    setFilteredStudents(sorted);
  }, [students, filters]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      } else {
        navigate('/login');
      }
    } catch (err) {
      console.error('Error signing out:', err);
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

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      branch: '',
      teacher: '',
      status: 'all'
    });
  };

  const openHistoryModal = (student) => {
    setSelectedStudentForHistory(student);
    setShowHistoryModal(true);
  };

  const closeHistoryModal = () => {
    setShowHistoryModal(false);
    setSelectedStudentForHistory(null);
  };

  return (
    <>
      <SEO
        title="Trang Quản Trị - Học Đàn Tranh"
        description="Trang quản lý dành cho quản trị viên"
      />
      <div className="superadmin-dashboard-page">
        <div className="superadmin-dashboard-container">
          <div className="superadmin-dashboard-header">
            <div>
              <h1 className="superadmin-dashboard-title">Trang Quản Trị</h1>
              <p className="superadmin-dashboard-subtitle">
                {profile?.full_name 
                  ? `Xin chào, ${profile.full_name}${profile.branch ? ` (${profile.branch})` : ''}`
                  : user?.email 
                    ? `Xin chào, ${user.email}`
                    : 'Chào mừng bạn đến với trang quản lý'}
              </p>
            </div>
            <div className="header-actions">
              <Button 
                onClick={() => navigate('/teacher')} 
                variant="outline" 
                className="nav-button"
              >
                Trang Giáo Viên
              </Button>
              <Button onClick={handleLogout} variant="outline" className="logout-button">
                Đăng xuất
              </Button>
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {(profileLoading || loading) && !students.length && (
            <div className="superadmin-dashboard-content">
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Đang tải dữ liệu...</p>
              </div>
            </div>
          )}

          {!(profileLoading || loading) && (
            <div className="superadmin-dashboard-content">
              <div className="filters-section">
                <div className="filters-header">
                  <h2 className="filters-title">Bộ lọc</h2>
                  <Button onClick={clearFilters} variant="text" className="clear-filters-button">
                    Xóa bộ lọc
                  </Button>
                </div>
                <div className="filters-row">
                  <div className="filter-group">
                    <label htmlFor="branch-filter">Chi nhánh</label>
                    <select
                      id="branch-filter"
                      value={filters.branch}
                      onChange={(e) => handleFilterChange('branch', e.target.value)}
                      className="filter-select"
                    >
                      <option value="">Tất cả chi nhánh</option>
                      {branches.map(branch => (
                        <option key={branch} value={branch}>{branch}</option>
                      ))}
                    </select>
                  </div>

                  <div className="filter-group">
                    <label htmlFor="teacher-filter">Giáo viên</label>
                    <select
                      id="teacher-filter"
                      value={filters.teacher}
                      onChange={(e) => handleFilterChange('teacher', e.target.value)}
                      className="filter-select"
                    >
                      <option value="">Tất cả giáo viên</option>
                      {teachers.map(teacher => (
                        <option key={teacher} value={teacher}>{teacher}</option>
                      ))}
                    </select>
                  </div>

                  <div className="filter-group">
                    <label htmlFor="status-filter">Trạng thái</label>
                    <select
                      id="status-filter"
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="filter-select"
                    >
                      <option value="all">Tất cả</option>
                      <option value="critical">Cần chú ý</option>
                      <option value="warning">Cảnh báo</option>
                      <option value="normal">Bình thường</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="students-section">
                <div className="students-header">
                  <div>
                    <h2 className="students-title">Danh Sách Học Sinh</h2>
                    <p className="students-count">
                      Tổng số: {filteredStudents.length} / {students.length} học sinh
                    </p>
                  </div>
                </div>

                {filteredStudents.length === 0 ? (
                  <div className="empty-state">
                    <p>{students.length === 0 ? 'Chưa có học sinh nào trong danh sách.' : 'Không tìm thấy học sinh nào với bộ lọc đã chọn.'}</p>
                  </div>
                ) : (
                  <div className="table-container">
                    <table className="students-table">
                      <thead>
                        <tr>
                          <th className="col-name">Tên</th>
                          <th className="col-phone">Số điện thoại</th>
                          <th className="col-branch">Chi nhánh</th>
                          <th className="col-teacher">Giáo viên</th>
                          <th className="col-date">Ngày bắt đầu</th>
                          <th className="col-date">Ngày kết thúc</th>
                          <th className="col-sessions">Số buổi còn lại</th>
                          <th className="col-paid">Tổng đã thanh toán</th>
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
                              <td className="col-branch">{student.branch || '-'}</td>
                              <td className="col-teacher">{student.teacher?.full_name || student.teacher?.email || '-'}</td>
                              <td className="col-date">{formatDate(student.start_date)}</td>
                              <td className="col-date">{formatDate(student.end_date)}</td>
                              <td className="col-sessions">{student.sessions_left !== null && student.sessions_left !== undefined ? student.sessions_left : '-'}</td>
                              <td className="col-paid">{formatCurrency(student.total_paid)}</td>
                              <td className="col-status">
                                <StatusBadge status={status} reason={reason} />
                              </td>
                              <td className="col-actions">
                                <Button 
                                  onClick={() => openHistoryModal(student)} 
                                  variant="text" 
                                  className="history-button"
                                  title="Xem lịch sử"
                                >
                                  <History size={18} />
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Student History Modal */}
          <StudentHistoryModal
            isOpen={showHistoryModal}
            student={selectedStudentForHistory}
            onClose={closeHistoryModal}
          />
        </div>
      </div>
    </>
  );
};

export default SuperAdminDashboard;
