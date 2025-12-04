import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

/**
 * Custom hook to fetch activity logs for a student
 * 
 * @param {string|number} studentId - Student ID
 * @param {Object} options - Optional parameters
 * @param {Object} options.currentUser - Current user object (from auth)
 * @param {Object} options.currentUserProfile - Current user profile object
 * @returns {Object} { logs, loading, error, refetch }
 */
const useStudentActivityLogs = (studentId, options = {}) => {
  const { currentUser, currentUserProfile } = options;
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLogs = async () => {
    if (!studentId) {
      setLogs([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch logs
      const { data: logsData, error: logsError } = await supabase
        .from('student_activity_logs')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });

      if (logsError) {
        // Check if table doesn't exist
        if (logsError.message && logsError.message.includes('does not exist')) {
          throw new Error('Bảng lịch sử hoạt động chưa được tạo. Vui lòng chạy SQL migration trong Supabase.');
        }
        throw logsError;
      }

      // Fetch teacher profiles separately
      let logsWithTeachers = logsData || [];
      
      // Get unique teacher IDs
      const teacherIds = [...new Set(logsWithTeachers.map(log => log.teacher_id).filter(Boolean))];
      
      if (teacherIds.length > 0) {
        const { data: teachersData, error: teachersError } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', teacherIds);

        if (teachersError) {
          console.error('Error fetching teacher profiles:', teachersError);
        }

        if (teachersData && teachersData.length > 0) {
          const teachersMap = teachersData.reduce((acc, teacher) => {
            acc[teacher.id] = teacher;
            return acc;
          }, {});

          logsWithTeachers = logsWithTeachers.map(log => {
            let teacher = teachersMap[log.teacher_id];
            
            // Fallback: if teacher not found but teacher_id matches current user, use current user profile
            if (!teacher && log.teacher_id && currentUser && log.teacher_id === currentUser.id && currentUserProfile) {
              teacher = currentUserProfile;
            }
            
            if (!teacher && log.teacher_id) {
              console.warn(`Teacher profile not found for ID: ${log.teacher_id} in log ${log.id}`);
            }
            
            return {
              ...log,
              teacher: teacher || null
            };
          });
        } else if (teacherIds.length > 0) {
          // If no teachers found, log a warning with more details
          console.warn('No teacher profiles found for teacher IDs:', teacherIds);
          console.warn('This might mean:');
          console.warn('1. The teachers do not have profiles in the profiles table');
          console.warn('2. The teacher_id format does not match (UUID mismatch)');
          console.warn('3. RLS policies might be blocking the query');
        }
      }

      setLogs(logsWithTeachers);
    } catch (err) {
      console.error('Error fetching activity logs:', err);
      setError(err.message || 'Lỗi khi tải lịch sử hoạt động');
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [studentId]);

  return {
    logs,
    loading,
    error,
    refetch: fetchLogs
  };
};

export default useStudentActivityLogs;
