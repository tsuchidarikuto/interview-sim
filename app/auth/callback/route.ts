import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import AddSampleData from '../AddSampleData'

export async function GET(request: Request) {
  // デバッグ: リクエストURLをログ出力
  console.log('Request URL:', request.url);
  
  const { searchParams, origin } = new URL(request.url)
  // デバッグ: originの値を確認
  console.log('Origin from URL:', origin);
  
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'
  // デバッグ: パラメータ確認
  console.log('Code exists:', !!code);
  console.log('Next path:', next);

  if (code) {
    const supabase = await createClient();
    
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    // デバッグ: 認証エラー確認
    console.log('Auth error:', error);
    

    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host');
      // デバッグ: 転送されたホスト名を確認
      console.log('x-forwarded-host:', forwardedHost);
      
      const isLocalEnv = process.env.NODE_ENV === 'development';
      // デバッグ: 環境変数確認
      console.log('NODE_ENV:', process.env.NODE_ENV);
      console.log('isLocalEnv:', isLocalEnv);
      
      await AddSampleData();
      
      // デバッグ: リダイレクト先を確認
      let redirectUrl;
      if (isLocalEnv) {
        redirectUrl = `${origin}${next}`;
        console.log('Local redirect to:', redirectUrl);
        return NextResponse.redirect(redirectUrl);
      } else if (forwardedHost) {
        redirectUrl = `https://${forwardedHost}${next}`;
        console.log('Production redirect with forwarded host to:', redirectUrl);
        return NextResponse.redirect(redirectUrl);
      } else {
        redirectUrl = `${origin}${next}`;
        console.log('Fallback redirect to:', redirectUrl);
        return NextResponse.redirect(redirectUrl);
      }
    }
  }

  // エラー時はログインページへリダイレクト
  const errorRedirect = `${origin}/login`;
  console.log('Error redirect to:', errorRedirect);
  return NextResponse.redirect(errorRedirect);
}