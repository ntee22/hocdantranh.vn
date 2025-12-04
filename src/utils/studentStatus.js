/**
 * Utility functions for computing and working with student status
 */

/**
 * Computes the status of a student based on end_date and sessions_left
 * 
 * @param {Object} student - Student object
 * @param {string|null} student.end_date - End date string (ISO format) or null
 * @param {number|null} student.sessions_left - Number of sessions left or null
 * @returns {string} - Status: 'critical', 'warning', or 'normal'
 */
export const computeStudentStatus = (student) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison

  // Check sessions_left
  const sessionsLeft = student.sessions_left;
  if (sessionsLeft !== null && sessionsLeft !== undefined) {
    if (sessionsLeft <= 0) {
      return 'critical';
    }
    if (sessionsLeft >= 1 && sessionsLeft <= 2) {
      // If sessions_left is warning, but we still need to check end_date
      // We'll check end_date below and return the more critical status
    }
  }

  // Check end_date
  if (student.end_date) {
    try {
      const endDate = new Date(student.end_date);
      endDate.setHours(0, 0, 0, 0); // Reset time to start of day

      // Calculate days until end date
      const daysUntilEnd = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

      // Critical: end_date is in the past
      if (daysUntilEnd < 0) {
        return 'critical';
      }

      // Warning: end_date is within next 7 days
      if (daysUntilEnd >= 0 && daysUntilEnd <= 7) {
        // If sessions_left is also warning, return warning
        // If sessions_left is critical (already handled above), return critical
        return 'warning';
      }
    } catch (error) {
      console.error('Error parsing end_date:', error);
      // If date parsing fails, continue with other checks
    }
  }

  // Check sessions_left for warning (if end_date didn't trigger warning)
  if (sessionsLeft !== null && sessionsLeft !== undefined) {
    if (sessionsLeft >= 1 && sessionsLeft <= 2) {
      return 'warning';
    }
  }

  // Default: normal status
  return 'normal';
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
    const status = computeStudentStatus(student);
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
    const statusA = computeStudentStatus(a);
    const statusB = computeStudentStatus(b);
    return statusPriority[statusA] - statusPriority[statusB];
  });
};
