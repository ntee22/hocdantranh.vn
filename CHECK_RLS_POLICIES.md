# Check RLS Policies in Supabase

## The issue: Profile query is hanging

The logs show the profile fetch starts but never completes. This is likely because:
1. RLS policies are blocking the query
2. The policies haven't been applied in Supabase

## To fix this, run these SQL commands in Supabase SQL Editor:

### 1. Check if RLS is enabled:
```sql
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('profiles', 'students');
```

### 2. Check existing policies:
```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('profiles', 'students')
ORDER BY tablename, policyname;
```

### 3. If policies are missing or wrong, apply them:

Run the full SQL file:
```bash
# Copy the contents of supabase_migrations/rls_policies_profiles_students.sql
# and paste it into Supabase SQL Editor, then run it
```

### 4. Test the profile query directly in Supabase:

Go to Supabase SQL Editor and run:
```sql
-- This should return YOUR profile
SELECT * FROM profiles WHERE id = auth.uid();
```

If this returns your profile, the policies are working.
If it returns nothing or an error, the policies need to be fixed.

## Quick Fix: Disable RLS temporarily (NOT recommended for production)

If you just want to test if this is the issue:

```sql
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE students DISABLE ROW LEVEL SECURITY;
```

⚠️ **This makes your data public! Only use for testing!**

After testing, re-enable it:
```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
```

## Alternative: Make profiles readable by all authenticated users

If you want teachers to be able to see each other's profiles:

```sql
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON profiles;

-- Create new policy: all authenticated users can view all profiles
CREATE POLICY "Authenticated users can view all profiles"
    ON profiles
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- Keep the update policy restricted
CREATE POLICY "Users can update their own profile"
    ON profiles
    FOR UPDATE
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());
```

This allows:
- ✅ All logged-in users can VIEW all profiles
- ✅ Users can only UPDATE their own profile
