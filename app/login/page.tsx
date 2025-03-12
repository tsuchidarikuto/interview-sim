'use client'

import { useState, Suspense } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useSearchParams, useRouter } from 'next/navigation'
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Paper, 
  Alert, 
  CircularProgress
} from '@mui/material'
import Link from 'next/link'
import {FcGoogle} from 'react-icons/fc'

const getErrorMessage = (error: string) => {
  switch (error) {
    case 'auth-code-error':
      return '認証に失敗しました。もう一度お試しください。'        
    default:
      return '予期せぬエラーが発生しました。'
  }
}

function LoginContent() {
  const supabase = createClient()
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const { push } = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignInWithGoogle = async () => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          // 環境に依存しないリダイレクトパスを使用
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      
      if (error) {
        console.error('ログインエラー:', error)
        push(`/login?error=auth-code-error`)
      }
    } catch (err) {
      console.error('認証エラー:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          borderRadius: 2
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Box
            sx={{
              my: 2,
              backgroundImage: 'url(/homeLogo.svg)',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              height: 120,
              width: 350,
            }}
          />
        </Box>
        
        
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
            {getErrorMessage(error)}
          </Alert>
        )}
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
          MENTRYは面接練習のためのAIシミュレーターです。<br />
          ログインして面接の練習を始めましょう。
        </Typography>
        
        <Button
          fullWidth
          variant="contained"
          startIcon={<FcGoogle />}
          onClick={handleSignInWithGoogle}
          disabled={isLoading}
          sx={{ py: 1.5 }}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Googleでログイン'}
        </Button>
        
        <Box sx={{ mt: 4, width: '100%', textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            ログインすることで、<Link href="/terms" passHref style={{ textDecoration: 'underline' }}>利用規約</Link>と
            <Link href="/privacy" passHref style={{ textDecoration: 'underline' }}>プライバシーポリシー</Link>に同意したことになります。
          </Typography>
        </Box>
      </Paper>
    </Container>
  )
}

export default function SignIn() {
  return (
    <Suspense fallback={
      <Container maxWidth="sm" sx={{ mt: 8, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    }>
      <LoginContent />
    </Suspense>
  )
}