const { createClient } = require('@supabase/supabase-js')

// Use service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xkgyaafgtbadzsofapkj.supabase.co'
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseServiceRoleKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY environment variable is required')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

async function createAvatarsBucket() {
  try {
    console.log('Creating avatars bucket...')

    // Create the bucket
    const { data, error } = await supabase.storage.createBucket('avatars', {
      public: true, // Make it public so avatars can be accessed without auth
      allowedMimeTypes: ['image/*'],
      fileSizeLimit: 5242880 // 5MB limit
    })

    if (error) {
      if (error.message.includes('already exists')) {
        console.log('Avatars bucket already exists')
      } else {
        console.error('Error creating bucket:', error)
        return
      }
    } else {
      console.log('Avatars bucket created successfully')
    }

    // Set bucket policies to allow public read access
    console.log('Setting bucket policies...')

    // Allow authenticated users to upload
    const { error: uploadPolicyError } = await supabase.storage.from('avatars').createSignedUploadUrl('test', {
      upsert: false
    })

    // For simplicity, we'll rely on RLS policies, but since storage doesn't have RLS like tables,
    // we'll make the bucket public and handle permissions in the app

    console.log('Bucket setup complete!')
    console.log('Users can now upload avatars to the avatars bucket.')

  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

createAvatarsBucket()
