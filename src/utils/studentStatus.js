/**
 * Utility functions for computing and working with student status
 */

/**
 * Computes the status of a student based on end_date and sessions_left
 * 
 * @param {Object} student - Student object
 * @param {string|null} student.end_date - End date string (ISO format) or null
 * @param {number|null} student.sessions_left - Number of sessions left or null
 * @returns {Object} - { status: 'critical'|'warning'|'normal', reason: string }
 */
export const computeStudentStatus = (student) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison

  let daysUntilEnd = null;
  let sessionsLeft = student.sessions_left !== null && student.sessions_left !== undefined 
    ? student.sessions_left 
    : null;

  // Calculate days until end date
  if (student.end_date) {
    try {
      const endDate = new Date(student.end_date);
      // Check if date is valid
      if (isNaN(endDate.getTime())) {
        console.warn('Invalid end_date:', student.end_date);
        daysUntilEnd = null;
      } else {
        endDate.setHours(0, 0, 0, 0); // Reset time to start of day
        daysUntilEnd = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
        
        // Debug logging for troubleshooting - log all cases to help diagnose
        console.log('Student status calculation:', {
          studentName: student.name,
          end_date: student.end_date,
          parsedEndDate: endDate.toISOString(),
          today: today.toISOString(),
          daysUntilEnd,
          sessionsLeft,
          willBeCritical: daysUntilEnd <= 1 || (sessionsLeft !== null && sessionsLeft <= 1)
        });
      }
    } catch (error) {
      console.error('Error parsing end_date:', error, student.end_date);
      daysUntilEnd = null;
    }
  }

  // Check for critical status: daysUntilEnd <= 1 OR sessionsLeft <= 1
  // Note: daysUntilEnd can be negative (past date), which should also be critical
  const isCriticalDays = daysUntilEnd !== null && daysUntilEnd <= 1;
  const isCriticalSessions = sessionsLeft !== null && sessionsLeft <= 1;
  
  if (isCriticalDays || isCriticalSessions) {
    // If both are critical, show the most urgent one
    if (isCriticalDays && isCriticalSessions) {
      // Show the one with lower value
      if (daysUntilEnd <= sessionsLeft) {
        return {
          status: 'critical',
          reason: `Còn ${daysUntilEnd} ngày đến ngày kết thúc`
        };
      } else {
        return {
          status: 'critical',
          reason: `Còn ${sessionsLeft} buổi học`
        };
      }
    } else if (isCriticalDays) {
      return {
        status: 'critical',
        reason: `Còn ${daysUntilEnd} ngày đến ngày kết thúc`
      };
    } else {
      return {
        status: 'critical',
        reason: `Còn ${sessionsLeft} buổi học`
      };
    }
  }

  // Check for warning status: daysUntilEnd <= 3 OR sessionsLeft <= 3
  const isWarningDays = daysUntilEnd !== null && daysUntilEnd <= 3;
  const isWarningSessions = sessionsLeft !== null && sessionsLeft <= 3;
  
  if (isWarningDays || isWarningSessions) {
    // If both are warning, show the most urgent one
    if (isWarningDays && isWarningSessions) {
      // Show the one with lower value
      if (daysUntilEnd <= sessionsLeft) {
        return {
          status: 'warning',
          reason: `Còn ${daysUntilEnd} ngày đến ngày kết thúc`
        };
      } else {
        return {
          status: 'warning',
          reason: `Còn ${sessionsLeft} buổi học`
        };
      }
    } else if (isWarningDays) {
      return {
        status: 'warning',
        reason: `Còn ${daysUntilEnd} ngày đến ngày kết thúc`
      };
    } else {
      return {
        status: 'warning',
        reason: `Còn ${sessionsLeft} buổi học`
      };
    }
  }

  // Default: normal status
  return {
    status: 'normal',
    reason: null
  };
};

/**
 * Gets the display label for a status
 * 
 * @param {string} status - Status: 'critical', 'warning', or 'normal'
 * @returns {string} - Display label
 */
export const getStatusLabel = (status) => {
  const labels = {
    critical: 'Cần chú ý',
    warning: 'Cảnh báo',
    normal: 'Bình thường'
  };
  return labels[status] || 'Bình thường';
};

/**
 * Filters students by status
 * 
 * @param {Array} students - Array of student objects
 * @param {string|null} statusFilter - Status to filter by ('critical', 'warning', 'normal') or null for all
 * @returns {Array} - Filtered array of students
 */
export const filterStudentsByStatus = (students, statusFilter) => {
  if (!statusFilter || statusFilter === 'all') {
    return students;
  }

  return students.filter(student => {
    const { status } = computeStudentStatus(student);
    return status === statusFilter;
  });
};

/**
 * Sorts students by status priority (critical first, then warning, then normal)
 * 
 * @param {Array} students - Array of student objects
 * @returns {Array} - Sorted array of students
 */
export const sortStudentsByStatus = (students) => {
  const statusPriority = {
    critical: 1,
    warning: 2,
    normal: 3
  };

  return [...students].sort((a, b) => {
    const { status: statusA } = computeStudentStatus(a);
    const { status: statusB } = computeStudentStatus(b);
    return statusPriority[statusA] - statusPriority[statusB];
  });
};
