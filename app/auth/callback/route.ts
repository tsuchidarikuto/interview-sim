import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import AddSampleData from '../AddSampleData'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient();
    
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    

    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host') // リクエストヘッダーからホストを取得
      const isLocalEnv = process.env.NODE_ENV === 'development'
      await AddSampleData();
      
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // エラー時はログインページへリダイレクト
  return NextResponse.redirect(`${origin}/login`)
}