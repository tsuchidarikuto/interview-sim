'use client'

import { Box, Container, Typography, Paper, Breadcrumbs } from '@mui/material'
import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link href="/" passHref style={{ color: 'inherit', textDecoration: 'none' }}>
          ホーム
        </Link>
        <Typography color="text.primary">プライバシーポリシー</Typography>
      </Breadcrumbs>

      <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <Box
            sx={{
              backgroundImage: 'url(/homeLogo.svg)',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              height: 80,
              width: 240,
            }}
          />
        </Box>
        
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          プライバシーポリシー
        </Typography>
        
        <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 3 }}>
          最終更新日: 2023年12月1日
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          1. 収集する情報
        </Typography>
        <Typography variant="body1" paragraph>
          当サービスでは、以下の情報を収集することがあります：
        </Typography>
        <Typography component="ul" sx={{ pl: 4 }}>
          <li>アカウント情報（名前、メールアドレス）</li>
          <li>プロフィール情報（経歴、学歴、スキル等）</li>
          <li>面接シミュレーションのデータ（質問と回答）</li>
          <li>利用状況データ（アクセス日時、利用頻度等）</li>
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          2. 情報の利用目的
        </Typography>
        <Typography variant="body1" paragraph>
          収集した情報は、以下の目的で利用します：
        </Typography>
        <Typography component="ul" sx={{ pl: 4 }}>
          <li>サービスの提供と改善</li>
          <li>パーソナライズされた面接体験の提供</li>
          <li>サービスに関する通知の送信</li>
          <li>サポートの提供</li>
          <li>サービスの分析と向上</li>
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          3. 情報の共有
        </Typography>
        <Typography variant="body1" paragraph>
          当社は、以下の場合を除き、ユーザーの個人情報を第三者と共有しません：
        </Typography>
        <Typography component="ul" sx={{ pl: 4 }}>
          <li>ユーザーの同意がある場合</li>
          <li>法的要件に従う必要がある場合</li>
          <li>サービス提供のために必要なパートナー企業（データ処理等）</li>
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          4. データの保管
        </Typography>
        <Typography variant="body1" paragraph>
          ユーザーデータは安全なサーバーに保管され、不正アクセスや漏洩を防ぐための適切なセキュリティ対策が講じられています。データは、サービス提供に必要な期間、または法的要件に従って保持されます。
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          5. ユーザーの権利
        </Typography>
        <Typography variant="body1" paragraph>
          ユーザーには以下の権利があります：
        </Typography>
        <Typography component="ul" sx={{ pl: 4 }}>
          <li>個人情報へのアクセス</li>
          <li>個人情報の訂正</li>
          <li>個人情報の削除</li>
          <li>データの処理に対する異議申し立て</li>
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          6. Cookieの使用
        </Typography>
        <Typography variant="body1" paragraph>
          当サービスでは、ユーザー体験の向上とサービス提供のためにCookieを使用しています。ブラウザの設定によりCookieの使用を制限することができますが、一部の機能が正常に動作しなくなる可能性があります。
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          7. ポリシーの変更
        </Typography>
        <Typography variant="body1" paragraph>
          当社は、このプライバシーポリシーを随時更新することがあります。変更があった場合は、サービス上で通知または更新日の表示を行います。
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          8. お問い合わせ
        </Typography>
        <Typography variant="body1" paragraph>
          プライバシーポリシーに関するご質問やご意見は、tsuchidarikuto@gmail.com までご連絡ください。
        </Typography>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Link href="/login" passHref style={{ textDecoration: 'underline', color: 'primary.main' }}>
            ログイン画面に戻る
          </Link>
        </Box>
      </Paper>
    </Container>
  )
}