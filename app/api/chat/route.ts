import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')

    const { data: messages, error } = await supabase
      .from('public_chat_messages')
      .select(`
        id,
        user_id,
        username,
        message,
        created_at
      `)
      .eq('is_moderated', false)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching messages:', error)
      return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
    }

    // Get avatar URLs for users who have them
    const userIds = messages?.filter(msg => msg.user_id).map(msg => msg.user_id) || []
    let avatars: { [key: string]: string } = {}

    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, avatar_url')
        .in('id', userIds)

      if (profiles) {
        profiles.forEach(profile => {
          if (profile.avatar_url) {
            avatars[profile.id] = profile.avatar_url
          }
        })
      }
    }

    // Transform the data to include avatar_url
    const transformedMessages = messages?.map(msg => ({
      id: msg.id,
      username: msg.username,
      message: msg.message,
      created_at: msg.created_at,
      user_id: msg.user_id,
      avatar_url: msg.user_id ? avatars[msg.user_id] || null : null
    })) || []

    return NextResponse.json({ messages: transformedMessages.reverse() }) // Reverse to get chronological order
  } catch (error) {
    console.error('Error in GET /api/chat:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { message } = await request.json()

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    if (message.length > 500) {
      return NextResponse.json({ error: 'Message too long' }, { status: 400 })
    }

    let username = 'Anonymous'
    let user_id = null

    if (user) {
      user_id = user.id
      // Get username from profiles
      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single()

      if (profile?.username) {
        username = profile.username
      } else {
        // Fallback to email prefix
        username = user.email?.split('@')[0] || 'User'
      }
    }

    const { error } = await supabase
      .from('public_chat_messages')
      .insert({
        user_id,
        username,
        message: message.trim(),
        is_moderated: false
      })

    if (error) {
      console.error('Error inserting message:', error)
      return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in POST /api/chat:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
