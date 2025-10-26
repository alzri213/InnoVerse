import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId } = await request.json()

    if (!message || !sessionId) {
      return NextResponse.json(
        { error: 'Message and sessionId are required' },
        { status: 400 }
      )
    }

    // Skip authentication for now - allow anonymous users
    // const supabase = createClient()
    // const { data: { user }, error: authError } = await supabase.auth.getUser()

    // if (authError || !user) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   )
    // }

    // Skip database saving for now to avoid auth issues
    // const { error: insertError } = await supabase
    //   .from('ai_chat_history')
    //   .insert({
    //     user_id: user.id,
    //     session_id: sessionId,
    //     message: message,
    //   })

    // if (insertError) {
    //   console.error('Error saving message:', insertError)
    // }

    // Create system prompt for InnoVerse AI assistant
    const systemPrompt = `You are InnoVerse AI Assistant, a helpful chatbot for the InnoVerse technology education platform.

About InnoVerse:
- A technology education platform for Indonesian digital generation
- Offers interactive courses, quizzes, and achievements
- Covers subjects like DKV (Design Komunikasi Visual), TKJ (Teknik Komputer Jaringan), RPL (Rekayasa Perangkat Lunak), and TRANS (Telekomunikasi)
- Features include materials, quizzes, news, and community chat

Your role:
- Help users with questions about the platform, courses, and features
- Provide guidance on learning paths and study tips
- Answer questions about technology topics covered in the platform
- Be friendly, helpful, and encouraging
- Respond in Indonesian when appropriate, but can use English for technical terms

Keep responses concise but informative. If you don't know something specific about the platform, suggest contacting support.`

    // Get AI response
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      max_tokens: 500,
      temperature: 0.7,
    })

    const aiResponse = completion.choices[0]?.message?.content || 'Maaf, saya tidak dapat memproses permintaan Anda saat ini.'

    // Skip database saving for now to avoid auth issues
    // const { error: responseInsertError } = await supabase
    //   .from('ai_chat_history')
    //   .insert({
    //     user_id: user.id,
    //     session_id: sessionId,
    //     message: message,
    //     response: aiResponse,
    //   })

    // if (responseInsertError) {
    //   console.error('Error saving response:', responseInsertError)
    // }

    return NextResponse.json({
      response: aiResponse,
      sessionId: sessionId
    })

  } catch (error) {
    console.error('AI Chat API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Skip authentication for now - allow anonymous users
    // const supabase = createClient()
    // const { data: { user }, error: authError } = await supabase.auth.getUser()

    // if (authError || !user) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   )
    // }

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Skip database fetching for now to avoid auth issues
    // const { data: chatHistory, error: fetchError } = await supabase
    //   .from('ai_chat_history')
    //   .select('message, response, created_at')
    //   .eq('user_id', user.id)
    //   .eq('session_id', sessionId)
    //   .order('created_at', { ascending: true })

    // if (fetchError) {
    //   console.error('Error fetching chat history:', fetchError)
    //   return NextResponse.json(
    //     { error: 'Failed to fetch chat history' },
    //     { status: 500 }
    //   )
    // }

    // Return empty chat history for now
    return NextResponse.json({ chatHistory: [] })

  } catch (error) {
    console.error('AI Chat History API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
