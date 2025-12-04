import React from 'react';
import { X, Clock, User } from 'lucide-react';
import useStudentActivityLogs from '../../hooks/useStudentActivityLogs';
import useCurrentUserProfile from '../../hooks/useCurrentUserProfile';
import StatusBadge from './StatusBadge';
import './StudentHistoryModal.css';

/**
 * StudentHistoryModal component
 * Displays activity history for a student
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Object} props.student - Student object
 * @param {Function} props.onClose - Function to close modal
 */
const StudentHistoryModal = ({ isOpen, student, onClose }) => {
  const { user, profile: currentUserProfile } = useCurrentUserProfile();
  const { logs, loading, error, refetch } = useStudentActivityLogs(student?.id, {
    currentUser: user,
    currentUserProfile: currentUserProfile
  });

  // Refetch logs when modal opens or student changes
  React.useEffect(() => {
    if (isOpen && student?.id) {
      // Only refetch if modal just opened or student changed
      refetch();
    }
  }, [isOpen, student?.id]); // Removed refetch from dependencies to prevent infinite loop

  if (!isOpen) return null;

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
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

  const getActivityTypeLabel = (type) => {
    const labels = {
      create: 'Tạo mới',
      update: 'Cập nhật',
      checkin: 'Check-in',
      payment_update: 'Cập nhật thanh toán'
    };
    return labels[type] || type;
  };

  const getCheckinDescription = (changedFields) => {
    if (changedFields.sessions_left) {
      const oldVal = changedFields.sessions_left.old;
      const newVal = changedFields.sessions_left.new;
      return `Đã check-in: Số buổi còn lại ${oldVal} → ${newVal}`;
    }
    return 'Đã check-in';
  };

  const renderFieldChange = (fieldName, change) => {
    const fieldLabels = {
      name: 'Tên',
      phone: 'Số điện thoại',
      sessions_left: 'Số buổi còn lại',
      total_paid: 'Tổng đã thanh toán',
      start_date: 'Ngày bắt đầu',
      end_date: 'Ngày kết thúc',
      branch: 'Chi nhánh'
    };

    const label = fieldLabels[fieldName] || fieldName;
    let oldValue = change.old;
    let newValue = change.new;

    // Format values based on field type
    if (fieldName === 'total_paid') {
      oldValue = oldValue === null ? '-' : formatCurrency(oldValue);
      newValue = newValue === null ? '-' : formatCurrency(newValue);
    } else if (fieldName.includes('date')) {
      oldValue = oldValue === null ? '-' : formatDate(oldValue);
      newValue = newValue === null ? '-' : formatDate(newValue);
    } else {
      oldValue = oldValue === null ? '-' : String(oldValue);
      newValue = newValue === null ? '-' : String(newValue);
    }

    return (
      <div key={fieldName} className="history-field-change">
        <span className="field-name">{label}:</span>
        <span className="field-change">
          <span className="old-value">{oldValue}</span>
          <span className="arrow">→</span>
          <span className="new-value">{newValue}</span>
        </span>
      </div>
    );
  };

  return (
    <div className="history-modal-overlay" onClick={onClose}>
      <div className="history-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="history-modal-header">
          <div>
            <h3 className="history-modal-title">Lịch Sử Hoạt Động</h3>
            <p className="history-modal-subtitle">
              {student?.name ? `Học sinh: ${student.name}` : 'Học sinh'}
            </p>
          </div>
          <button className="history-modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="history-modal-body">
          {loading ? (
            <div className="history-loading">
              <div className="loading-spinner"></div>
              <p>Đang tải lịch sử...</p>
            </div>
          ) : error ? (
            <div className="history-error">
              <p>{error}</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="history-empty">
              <p>Chưa có lịch sử hoạt động nào cho học sinh này.</p>
            </div>
          ) : (
            <div className="history-list">
              {logs.map((log) => (
                <div key={log.id} className="history-item">
                  <div className="history-item-header">
                    <div className="history-item-meta">
                      <div className="history-time">
                        <Clock size={16} />
                        <span>{formatDateTime(log.created_at)}</span>
                      </div>
                      <div className="history-teacher">
                        <User size={16} />
                        <span>
                          {log.teacher?.full_name || log.teacher?.email || (log.teacher_id ? `ID: ${log.teacher_id.substring(0, 8)}...` : 'Không xác định')}
                        </span>
                      </div>
                    </div>
                    <div className="history-activity-type">
                      <span className={`activity-badge activity-${log.activity_type}`}>
                        {getActivityTypeLabel(log.activity_type)}
                      </span>
                    </div>
                  </div>
                  
                  {log.activity_type === 'checkin' && log.changed_fields?.sessions_left ? (
                    <div className="history-changes">
                      <div className="checkin-description">
                        {getCheckinDescription(log.changed_fields)}
                      </div>
                    </div>
                  ) : log.changed_fields && Object.keys(log.changed_fields).length > 0 ? (
                    <div className="history-changes">
                      {Object.entries(log.changed_fields).map(([fieldName, change]) =>
                        renderFieldChange(fieldName, change)
                      )}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentHistoryModal;
