import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Supabaseクライアントを作成する非同期関数。
 * 
 * この関数は、クッキーストアを取得し、Supabaseクライアントを作成して返します。
 * クッキーの取得と設定のためのカスタムロジックを含んでいます。
 * 
 * @returns {Promise<any>} Supabaseクライアントを含むPromise。
 * 
 * @throws 環境変数 `NEXT_PUBLIC_SUPABASE_URL` または `NEXT_PUBLIC_SUPABASE_ANON_KEY` が設定されていない場合。
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}