-- Create chat tables for AI Assistant and Public Chat features

-- AI Chat History Table
CREATE TABLE IF NOT EXISTS public.ai_chat_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    message TEXT NOT NULL,
    response TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Public Chat Messages Table
CREATE TABLE IF NOT EXISTS public.public_chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NULL,
    username TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_moderated BOOLEAN DEFAULT FALSE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ai_chat_history_user_id ON public.ai_chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_history_session_id ON public.ai_chat_history(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_history_created_at ON public.ai_chat_history(created_at);

CREATE INDEX IF NOT EXISTS idx_public_chat_messages_created_at ON public.public_chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_public_chat_messages_user_id ON public.public_chat_messages(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.ai_chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for AI Chat History
CREATE POLICY "Users can view their own AI chat history" ON public.ai_chat_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own AI chat history" ON public.ai_chat_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for Public Chat Messages
CREATE POLICY "Anyone can view public chat messages" ON public.public_chat_messages
    FOR SELECT USING (true);

CREATE POLICY "Anyone can insert public chat messages" ON public.public_chat_messages
    FOR INSERT WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for ai_chat_history
CREATE TRIGGER update_ai_chat_history_updated_at
    BEFORE UPDATE ON public.ai_chat_history
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
