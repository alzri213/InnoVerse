-- Add missing RLS DELETE and UPDATE policies for admin users
-- Using DROP IF EXISTS to recreate policies if they already exist

-- RLS DELETE Policy for materials
DROP POLICY IF EXISTS "materials_delete_admin" ON public.materials;
CREATE POLICY "materials_delete_admin" ON public.materials FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS DELETE Policy for quizzes
DROP POLICY IF EXISTS "quizzes_delete_admin" ON public.quizzes;
CREATE POLICY "quizzes_delete_admin" ON public.quizzes FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS UPDATE Policy for public_chat_messages (admin can moderate messages)
DROP POLICY IF EXISTS "public_chat_messages_update_admin" ON public.public_chat_messages;
CREATE POLICY "public_chat_messages_update_admin" ON public.public_chat_messages FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS DELETE Policy for public_chat_messages (admin can delete any message)
DROP POLICY IF EXISTS "public_chat_messages_delete_admin" ON public.public_chat_messages;
CREATE POLICY "public_chat_messages_delete_admin" ON public.public_chat_messages FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS DELETE Policy for messages (admin can delete any message)
DROP POLICY IF EXISTS "messages_delete_admin" ON public.messages;
CREATE POLICY "messages_delete_admin" ON public.messages FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
