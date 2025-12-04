-- Create student_activity_logs table
CREATE TABLE IF NOT EXISTS student_activity_logs (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    activity_type TEXT NOT NULL,
    changed_fields JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_student_activity_logs_student_id ON student_activity_logs(student_id);
CREATE INDEX IF NOT EXISTS idx_student_activity_logs_created_at ON student_activity_logs(created_at DESC);

-- Add comment to table
COMMENT ON TABLE student_activity_logs IS 'Stores activity history for students including updates, check-ins, and payment changes';

-- Enable Row Level Security (RLS)
ALTER TABLE student_activity_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Teachers can view logs for their own students
CREATE POLICY "Teachers can view their own student logs"
    ON student_activity_logs
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM students
            WHERE students.id = student_activity_logs.student_id
            AND students.teacher_id = auth.uid()
        )
    );

-- Policy: Superadmins can view all logs
CREATE POLICY "Superadmins can view all logs"
    ON student_activity_logs
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'superadmin'
        )
    );

-- Policy: Teachers can insert logs for their own students
CREATE POLICY "Teachers can insert logs for their own students"
    ON student_activity_logs
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM students
            WHERE students.id = student_activity_logs.student_id
            AND students.teacher_id = auth.uid()
        )
        AND teacher_id = auth.uid()
    );

-- Policy: Superadmins can insert logs
CREATE POLICY "Superadmins can insert logs"
    ON student_activity_logs
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'superadmin'
        )
    );
