# Supabase Migration: Student Activity Logs

## Setup Instructions

1. Open your Supabase project dashboard
2. Go to the SQL Editor
3. Copy and paste the contents of `create_student_activity_logs.sql`
4. Run the SQL script

This will create:
- The `student_activity_logs` table
- Necessary indexes for performance
- Row Level Security (RLS) policies for data access control

## Table Structure

The `student_activity_logs` table stores:
- `id`: Primary key
- `student_id`: Foreign key to `students.id`
- `teacher_id`: Foreign key to `profiles.id` (the teacher who performed the action)
- `activity_type`: Type of activity (create, update, checkin, payment_update)
- `changed_fields`: JSONB object storing old → new values for changed fields
- `created_at`: Timestamp of when the activity occurred

## Security

RLS policies ensure:
- Teachers can only view logs for their own students
- Superadmins can view all logs
- Only authenticated users can insert logs
- Teachers can only insert logs for their own students
