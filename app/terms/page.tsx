'use client'

import { Box, Container, Typography, Paper, Breadcrumbs } from '@mui/material'
import Link from 'next/link'

export default function TermsPage() {
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link href="/" passHref style={{ color: 'inherit', textDecoration: 'none' }}>
          ホーム
        </Link>
        <Typography color="text.primary">利用規約</Typography>
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
          利用規約
        </Typography>
        
        <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 3 }}>
          最終更新日: 2025年3月6日
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          1. サービスの概要
        </Typography>
        <Typography variant="body1" paragraph>
          MENTRYは、AIを活用した面接シミュレーションサービスです。本サービスは、ユーザーが就職活動や転職活動における面接の練習を行うことを目的としています。
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          2. 利用条件
        </Typography>
        <Typography variant="body1" paragraph>
          本サービスを利用するにはGoogleアカウントによるログインが必要です。ユーザーは正確な情報を提供し、アカウント情報を最新の状態に保つ責任があります。
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          3. 禁止事項
        </Typography>
        <Typography variant="body1" paragraph>
          以下の行為は禁止されています：
        </Typography>
        <Typography component="ul" sx={{ pl: 4 }}>
          <li>サービスの不正利用または悪用</li>
          <li>他のユーザーのアカウントへの不正アクセス</li>
          <li>サービスのセキュリティを妨害する行為</li>
          <li>違法、有害、脅迫的、虐待的、嫌がらせ、または差別的なコンテンツの投稿</li>
          <li>サービスの運営を妨害する行為</li>
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          4. 免責事項
        </Typography>
        <Typography variant="body1" paragraph>
          本サービスは「現状のまま」提供されており、特定の目的への適合性、商品性、非侵害性の保証を含め、明示的または暗示的を問わずいかなる保証も行いません。当社は、サービスの中断、エラー、またはデータの損失に対して責任を負いません。
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          5. 変更・終了
        </Typography>
        <Typography variant="body1" paragraph>
          当社は、予告なく本サービスや本規約を変更、または終了する権利を有します。重要な変更がある場合は、合理的な方法でユーザーに通知します。
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          6. お問い合わせ
        </Typography>
        <Typography variant="body1" paragraph>
          本利用規約に関するご質問やご意見は、tsuchidarikuto@gmail.com までご連絡ください。
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