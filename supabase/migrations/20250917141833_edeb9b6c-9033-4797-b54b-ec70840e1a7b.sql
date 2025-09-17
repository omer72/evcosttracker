-- Fix security vulnerability: Remove public access to profiles table
-- Drop the existing public SELECT policy that exposes email addresses
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;

-- Create a new policy that only allows authenticated users to view profiles
-- This prevents unauthorized access to email addresses while maintaining functionality
CREATE POLICY "Authenticated users can view profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (true);

-- Ensure users can still update their own profiles (policy already exists but keeping for clarity)
-- The existing "Users can update their own profile." policy remains unchanged