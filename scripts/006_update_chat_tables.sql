-- Update public_chat_messages table to allow anonymous users

-- Make user_id nullable for anonymous users
ALTER TABLE public.public_chat_messages
ALTER COLUMN user_id DROP NOT NULL;

-- Update RLS policy to allow anonymous inserts
DROP POLICY IF EXISTS "Authenticated users can insert public chat messages" ON public.public_chat_messages;

CREATE POLICY "Anyone can insert public chat messages" ON public.public_chat_messages
    FOR INSERT WITH CHECK (true);

-- Allow anonymous users to view messages (already exists)
-- CREATE POLICY "Anyone can view public chat messages" ON public.public_chat_messages
--     FOR SELECT USING (true);
