import { supabase } from '../supabaseClient';

/**
 * Computes the difference between old and new student data
 * Returns an object with changed fields showing old → new values
 * 
 * @param {Object} oldData - Previous student data
 * @param {Object} newData - New student data
 * @returns {Object} - Object with changed fields
 */
export const computeStudentDiff = (oldData, newData) => {
  const changedFields = {};
  
  // Fields to track for changes
  const fieldsToTrack = [
    'sessions_left',
    'total_paid',
    'start_date',
    'end_date',
    'branch',
    'name',
    'phone'
  ];

  fieldsToTrack.forEach(field => {
    const oldValue = oldData?.[field];
    const newValue = newData[field];

    // Handle null/undefined comparisons
    const oldVal = oldValue === null || oldValue === undefined ? null : oldValue;
    const newVal = newValue === null || newValue === undefined ? null : newValue;

    // Check if value actually changed
    if (oldVal !== newVal) {
      // For dates, convert to ISO string for consistency
      if (field.includes('date') && oldVal) {
        changedFields[field] = {
          old: oldVal instanceof Date ? oldVal.toISOString() : oldVal,
          new: newVal instanceof Date ? newVal.toISOString() : newVal
        };
      } else {
        changedFields[field] = {
          old: oldVal,
          new: newVal
        };
      }
    }
  });

  return changedFields;
};

/**
 * Determines activity type based on changed fields
 * 
 * @param {Object} changedFields - Object with changed fields
 * @param {boolean} isNewStudent - Whether this is a new student creation
 * @returns {string} - Activity type
 */
export const determineActivityType = (changedFields, isNewStudent = false) => {
  if (isNewStudent) {
    return 'create';
  }

  // Check if it's a check-in (sessions_left decreased)
  if (changedFields.sessions_left) {
    const oldSessions = changedFields.sessions_left.old;
    const newSessions = changedFields.sessions_left.new;
    
    if (oldSessions !== null && newSessions !== null && newSessions < oldSessions) {
      return 'checkin';
    }
  }

  // Check if it's a payment update
  if (changedFields.total_paid) {
    return 'payment_update';
  }

  // Default to update
  return 'update';
};

/**
 * Logs student activity to the database
 * 
 * @param {Object} params
 * @param {string} params.studentId - Student ID
 * @param {string} params.teacherId - Teacher ID (from auth)
 * @param {string} params.activityType - Type of activity
 * @param {Object} params.changedFields - Changed fields object
 * @returns {Promise<Object>} - Result from Supabase insert
 */
export const logStudentActivity = async ({ studentId, teacherId, activityType, changedFields }) => {
  try {
    // Only log if there are actual changes (or it's a create)
    if (activityType === 'create' || Object.keys(changedFields).length > 0) {
      const { data, error } = await supabase
        .from('student_activity_logs')
        .insert([
          {
            student_id: studentId,
            teacher_id: teacherId,
            activity_type: activityType,
            changed_fields: Object.keys(changedFields).length > 0 ? changedFields : null
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error logging student activity:', error);
        // Check if table doesn't exist
        if (error.message && error.message.includes('does not exist')) {
          console.warn('student_activity_logs table does not exist. Please run the SQL migration.');
        }
        // Don't throw - logging failure shouldn't break the main operation
        return { data: null, error };
      }

      return { data, error: null };
    }

    return { data: null, error: null };
  } catch (err) {
    console.error('Exception logging student activity:', err);
    return { data: null, error: err };
  }
};

/**
 * Helper function to log student update
 * 
 * @param {Object} params
 * @param {Object} params.oldStudent - Previous student data
 * @param {Object} params.newStudent - New student data
 * @param {string} params.teacherId - Teacher ID
 * @returns {Promise<Object>} - Result from logging
 */
export const logStudentUpdate = async ({ oldStudent, newStudent, teacherId }) => {
  const changedFields = computeStudentDiff(oldStudent, newStudent);
  const activityType = determineActivityType(changedFields, false);

  return await logStudentActivity({
    studentId: newStudent.id || oldStudent.id,
    teacherId,
    activityType,
    changedFields
  });
};

/**
 * Helper function to log student creation
 * 
 * @param {Object} params
 * @param {Object} params.newStudent - New student data
 * @param {string} params.teacherId - Teacher ID
 * @returns {Promise<Object>} - Result from logging
 */
export const logStudentCreate = async ({ newStudent, teacherId }) => {
  // For creation, log all initial values
  const initialFields = {};
  const fieldsToTrack = ['sessions_left', 'total_paid', 'start_date', 'end_date', 'branch', 'name', 'phone'];
  
  fieldsToTrack.forEach(field => {
    if (newStudent[field] !== null && newStudent[field] !== undefined) {
      initialFields[field] = {
        old: null,
        new: newStudent[field]
      };
    }
  });

  return await logStudentActivity({
    studentId: newStudent.id,
    teacherId,
    activityType: 'create',
    changedFields: initialFields
  });
};
