import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
export async function POST(req: Request) {
  try {
    const { username } = await req.json();
    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }
    // Call TikTok RapidAPI endpoint
    const response = await fetch(`https://tiktok-api23.p.rapidapi.com/api/user/info?uniqueId=${username}`, {
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY!,
        'x-rapidapi-host': 'tiktok-api23.p.rapidapi.com',
      },
    });
    const apiData = await response.json();
    console.log('RapidAPI response:', JSON.stringify(apiData));
    const stats = apiData?.userInfo?.stats;
    if (!stats) {
      return NextResponse.json({ error: 'User stats not found' }, { status: 404 });
    }
    const followers = stats.followerCount || 0;
    const likes = stats.heartCount || 0;
    const videos = stats.videoCount || 0;
    const engagement = followers > 0 ? parseFloat(((likes / followers) * 100).toFixed(2)) : 0;
    // Save fetched record to Supabase database
    const { data, error } = await supabaseAdmin.from('tiktok_analytics').insert([
      {
        username,
        followers_count: followers,
        total_likes: likes,
        video_count: videos,
        engagement_rate: engagement,
      },
    ]).select().single();
    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
