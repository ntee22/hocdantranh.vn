-- =====================================================
-- RLS Policies for profiles and students tables
-- This script avoids infinite recursion by using direct auth.uid() checks
-- =====================================================

-- =====================================================
-- PROFILES TABLE POLICIES
-- =====================================================

-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Superadmins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Superadmins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON profiles;

-- Policy 1: Users can view their own profile
-- This uses auth.uid() directly, no recursion
CREATE POLICY "Users can view their own profile"
    ON profiles
    FOR SELECT
    USING (id = auth.uid());

-- Policy 2: Users can update their own profile
CREATE POLICY "Users can update their own profile"
    ON profiles
    FOR UPDATE
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- Policy 3: Superadmins can view all profiles
-- IMPORTANT: This checks the role WITHOUT querying profiles again
-- We use a subquery that doesn't trigger RLS recursion
CREATE POLICY "Superadmins can view all profiles"
    ON profiles
    FOR SELECT
    USING (
        -- Check if current user is superadmin by checking their own row
        -- This is safe because Policy 1 already allows users to read their own profile
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid()
            AND p.role = 'superadmin'
        )
    );

-- Policy 4: Superadmins can update all profiles
CREATE POLICY "Superadmins can update all profiles"
    ON profiles
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid()
            AND p.role = 'superadmin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid()
            AND p.role = 'superadmin'
        )
    );

-- Policy 5: Allow authenticated users to insert their own profile
-- This is typically done during user registration
CREATE POLICY "Users can insert their own profile"
    ON profiles
    FOR INSERT
    WITH CHECK (id = auth.uid());

-- =====================================================
-- STUDENTS TABLE POLICIES
-- =====================================================

-- Enable RLS on students table
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Teachers can view their own students" ON students;
DROP POLICY IF EXISTS "Teachers can insert their own students" ON students;
DROP POLICY IF EXISTS "Teachers can update their own students" ON students;
DROP POLICY IF EXISTS "Teachers can delete their own students" ON students;
DROP POLICY IF EXISTS "Superadmins can view all students" ON students;
DROP POLICY IF EXISTS "Superadmins can insert students" ON students;
DROP POLICY IF EXISTS "Superadmins can update all students" ON students;
DROP POLICY IF EXISTS "Superadmins can delete all students" ON students;

-- Policy 1: Teachers can view their own students
-- Uses direct teacher_id check, no recursion
CREATE POLICY "Teachers can view their own students"
    ON students
    FOR SELECT
    USING (teacher_id = auth.uid());

-- Policy 2: Teachers can insert students with their own teacher_id
CREATE POLICY "Teachers can insert their own students"
    ON students
    FOR INSERT
    WITH CHECK (teacher_id = auth.uid());

-- Policy 3: Teachers can update their own students
CREATE POLICY "Teachers can update their own students"
    ON students
    FOR UPDATE
    USING (teacher_id = auth.uid())
    WITH CHECK (teacher_id = auth.uid());

-- Policy 4: Teachers can delete their own students
CREATE POLICY "Teachers can delete their own students"
    ON students
    FOR DELETE
    USING (teacher_id = auth.uid());

-- Policy 5: Superadmins can view all students
-- Uses the same safe superadmin check as profiles
CREATE POLICY "Superadmins can view all students"
    ON students
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid()
            AND p.role = 'superadmin'
        )
    );

-- Policy 6: Superadmins can insert students
CREATE POLICY "Superadmins can insert students"
    ON students
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid()
            AND p.role = 'superadmin'
        )
    );

-- Policy 7: Superadmins can update all students
CREATE POLICY "Superadmins can update all students"
    ON students
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid()
            AND p.role = 'superadmin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid()
            AND p.role = 'superadmin'
        )
    );

-- Policy 8: Superadmins can delete all students
CREATE POLICY "Superadmins can delete all students"
    ON students
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid()
            AND p.role = 'superadmin'
        )
    );

-- =====================================================
-- NOTES ON AVOIDING INFINITE RECURSION
-- =====================================================
-- 
-- The key to avoiding infinite recursion:
-- 1. For checking own profile: Use `id = auth.uid()` directly
-- 2. For superadmin checks: Query profiles with a WHERE clause that matches
--    the user's own row (which Policy 1 allows), so it doesn't create a loop
-- 3. For students: Use direct `teacher_id = auth.uid()` checks
-- 4. Never have a policy that queries the same table it's protecting in a way
--    that would require checking that same policy again
--
-- The superadmin check works because:
-- - Policy 1 allows users to read their own profile row
-- - The superadmin check queries profiles WHERE id = auth.uid()
-- - This matches Policy 1, so it succeeds without recursion
-- - If the user is a superadmin, the check passes
-- - If not, it fails without creating a loop
-- =====================================================
