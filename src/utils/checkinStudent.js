import { supabase } from '../supabaseClient';
import { logStudentActivity } from './activityLogger';

/**
 * Performs a check-in for a student
 * Decreases sessions_left by 1 and logs the activity
 * 
 * @param {Object} params
 * @param {Object} params.student - Student object
 * @param {string} params.teacherId - Teacher ID (from auth)
 * @returns {Promise<Object>} - Result with updated student or error
 */
export const checkinStudent = async ({ student, teacherId }) => {
  try {
    // Check if student has remaining sessions
    const currentSessions = student.sessions_left !== null && student.sessions_left !== undefined 
      ? student.sessions_left 
      : 0;

    if (currentSessions <= 0) {
      return {
        success: false,
        error: 'Học sinh không còn buổi học nào.'
      };
    }

    // Calculate new sessions_left (clamp at 0)
    const newSessionsLeft = Math.max(0, currentSessions - 1);

    // Update student in database
    const { data: updatedStudent, error: updateError } = await supabase
      .from('students')
      .update({ sessions_left: newSessionsLeft })
      .eq('id', student.id)
      .select()
      .single();

    if (updateError) {
      return {
        success: false,
        error: 'Lỗi khi cập nhật học sinh: ' + updateError.message
      };
    }

    // Log the check-in activity
    const changedFields = {
      sessions_left: {
        old: currentSessions,
        new: newSessionsLeft
      }
    };

    const logResult = await logStudentActivity({
      studentId: student.id,
      teacherId,
      activityType: 'checkin',
      changedFields
    });

    // Even if logging fails, the check-in was successful
    if (logResult.error) {
      console.error('Error logging check-in:', logResult.error);
      // Continue - don't fail the check-in if logging fails
    }

    return {
      success: true,
      data: updatedStudent,
      error: null
    };
  } catch (err) {
    console.error('Exception in checkinStudent:', err);
    return {
      success: false,
      error: 'Đã xảy ra lỗi: ' + err.message
    };
  }
};
