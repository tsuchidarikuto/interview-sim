import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import AddSampleData from '../AddSampleData'

export async function GET(request: Request) {
  console.log('Request URL:', request.url);
  
  const { searchParams, origin } = new URL(request.url)
  console.log('Origin from URL:', origin);
  
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host');
      const forwardedProto = request.headers.get('x-forwarded-proto') || 'https';
      const isLocalEnv = process.env.NODE_ENV === 'development';
      
      await AddSampleData();
      
      // リダイレクト先を環境に応じて決定
      let redirectUrl;
      if (isLocalEnv) {
        redirectUrl = `${origin}${next}`;
      } else {
        // 本番環境では x-forwarded-host を使用（Vercelなどで動作）
        const productionOrigin = forwardedHost 
          ? `${forwardedProto}://${forwardedHost}`
          : process.env.NEXT_PUBLIC_SITE_URL || origin;
        
        redirectUrl = `${productionOrigin}${next}`;
      }
      
      console.log('Redirecting to:', redirectUrl);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // エラー時もホスト名を正しく設定
  const forwardedHost = request.headers.get('x-forwarded-host');
  const forwardedProto = request.headers.get('x-forwarded-proto') || 'https';
  const isLocalEnv = process.env.NODE_ENV === 'development';
  
  const baseUrl = isLocalEnv
    ? origin
    : (forwardedHost ? `${forwardedProto}://${forwardedHost}` : process.env.NEXT_PUBLIC_SITE_URL || origin);
  
  const errorRedirect = `${baseUrl}/login?error=auth-code-error`;
  console.log('Error redirect to:', errorRedirect);
  return NextResponse.redirect(errorRedirect);
}