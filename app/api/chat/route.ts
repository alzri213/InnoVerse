import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Basic message validation (length, content filtering)
    if (message.length > 500) {
      return NextResponse.json(
        { error: 'Message too long (max 500 characters)' },
        { status: 400 }
      )
    }

    // Simple content filtering (can be enhanced)
    const forbiddenWords = ['spam', 'offensive', 'inappropriate']
    const lowerMessage = message.toLowerCase()
    if (forbiddenWords.some(word => lowerMessage.includes(word))) {
      return NextResponse.json(
        { error: 'Message contains inappropriate content' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    let username = 'Anonymous User'
    let user_id = null

    if (user && !authError) {
      // User is logged in, get their profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('username, full_name')
        .eq('id', user.id)
        .single()

      if (profile) {
        // Use full_name if available, otherwise username
        username = profile.full_name || profile.username
        user_id = user.id
      }
    }

    const { data: newMessage, error: insertError } = await supabase
      .from('public_chat_messages')
      .insert({
        user_id: user_id,
        username: username,
        message: message.trim(),
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error saving message:', insertError)
      return NextResponse.json(
        { error: 'Failed to save message' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: newMessage
    })

  } catch (error) {
    console.error('Public Chat API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100) // Max 100 messages
    const offset = parseInt(searchParams.get('offset') || '0')

    // Get recent messages with user profile data
    const { data: messages, error: fetchError } = await supabase
      .from('public_chat_messages')
      .select(`
        id,
        username,
        message,
        created_at,
        user_id
      `)
      .eq('is_moderated', false)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // If we have messages with user_ids, fetch their profile data separately
    let messagesWithProfiles = messages || []

    if (messagesWithProfiles.length > 0) {
      const userIds = messagesWithProfiles
        .map(msg => msg.user_id)
        .filter(id => id !== null)

      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, avatar_url')
          .in('id', userIds)

        // Merge profile data into messages
        messagesWithProfiles = messagesWithProfiles.map(message => {
          const profile = profiles?.find(p => p.id === message.user_id)
          return {
            ...message,
            avatar_url: profile?.avatar_url || null
          }
        })
      }
    }

    if (fetchError) {
      console.error('Error fetching messages:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch messages' },
        { status: 500 }
      )
    }

    // Reverse to show oldest first for chat UI
    const reversedMessages = messages?.reverse() || []

    return NextResponse.json({
      messages: reversedMessages
    })

  } catch (error) {
    console.error('Public Chat GET API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
