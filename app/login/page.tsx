'use client'

import { createClient } from '@/utils/supabase/client'

import { useSearchParams } from 'next/navigation'


const getErrorMessage = (error: string) => {
    switch (error) {
        case 'auth-code-error':
            return '認証に失敗しました。もう一度お試しください。'        
        default:
            return '予期せぬエラーが発生しました。'
    }
}

export default function SignIn() {
    const supabase = createClient()
    const searchParams = useSearchParams()
    const error = searchParams.get('error')

    const handleSignInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
                redirectTo: 'http://localhost:3000/auth/callback',
            },
        })
        
    }

    return (
        
        <div className="flex min-h-screen flex-col items-center justify-center">
        
            <div className="w-full max-w-md space-y-8">
        
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {getErrorMessage(error)}
                    </div>
                )}
                
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold tracking-tight">
                        Sign in to your account
                    </h2>
                </div>
                <div className="mt-8 space-y-6">
                    <button
                        onClick={handleSignInWithGoogle}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                        Sign in with Google
                    </button>
                </div>                
            </div>
        </div>
    )
}
