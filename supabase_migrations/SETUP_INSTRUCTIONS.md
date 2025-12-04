# Setup Instructions for Student Activity Logs

## ⚠️ IMPORTANT: Run this SQL in Supabase

The error "Could not find the table 'public.student_activity_logs'" means the table hasn't been created yet.

## Steps to Fix:

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Copy and Run the SQL**
   - Open the file: `supabase_migrations/create_student_activity_logs.sql`
   - Copy ALL the contents
   - Paste into the SQL Editor
   - Click "Run" or press Ctrl/Cmd + Enter

4. **Verify the Table was Created**
   - Go to "Table Editor" in the left sidebar
   - You should see `student_activity_logs` in the list
   - If you see it, the setup is complete!

## If You Get Errors:

### Error: "relation 'students' does not exist"
- Make sure your `students` table exists first
- Check that the table name is exactly `students` (case-sensitive)

### Error: "relation 'profiles' does not exist"
- Make sure your `profiles` table exists first
- Check that the table name is exactly `profiles` (case-sensitive)

### Error: "permission denied"
- Make sure you're running the SQL as a database admin
- Try running it in the SQL Editor (which has admin privileges)

## Quick Test:

After running the SQL, you can test if it works by running this query in the SQL Editor:

```sql
SELECT * FROM student_activity_logs LIMIT 1;
```

If it runs without error, the table exists and is ready to use!
