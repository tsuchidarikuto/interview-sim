"use client"

import { useState, useEffect, FormEvent } from "react"
import { useParams,useRouter } from "next/navigation"
import { Box, CircularProgress, Button, TextField, Container, Stack, Typography } from '@mui/material'
import Grid from "@mui/material/Grid2"
import type { CompanyTypes } from "@/types"
import Link from 'next/link';
import { useAtom } from "jotai"
import { userAtom } from "@/atoms/state"
import { SupabaseDatabase } from "@/utils/supabase/database"
import { createClient } from "@/utils/supabase/client"

export default function CompanyEditPage() {
  const supabase = createClient();
  const {push} = useRouter()
  const [user,] = useAtom(userAtom);  
  const params = useParams();
  const companyId = Array.isArray(params.companyId) ? params.companyId[0] : params.companyId;
  const [company, setCompany] = useState<CompanyTypes>({          
          name: "",
          position: "",
          skillset: "",
          mission: "",
          product: "",
          culture: "",
          others: ""
      });
  const [isNew, setIsNew] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingCompany, setIsFetchingCompany] = useState<boolean>(true)
  const companyTable = new SupabaseDatabase<CompanyTypes>("companies",supabase);
  
  //IDから会社情報を取得
  useEffect(() => {
    const fetchcompany = async () => {      
      if (companyId !== "new" && user&&companyId) {
        const foundcompany = await companyTable.getDataById(companyId)
        if (foundcompany) {
          setCompany(foundcompany)
        } else {
          setIsNew(true)
        }
        setIsFetchingCompany(false)
      } else {
        setIsNew(true)
        setIsFetchingCompany(false)
      }
    }
    fetchcompany()
  }, [companyId, user])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    try {
      if (user) {
        if (isNew) {
          await companyTable.addData(company,user.uid);
        } else if (company.id) {
          await companyTable.updateData(company.id, company);
        }
        push("/company");
      }
    } catch (e) {
      console.error('Error updating document:', e)
    }
    setIsLoading(false)
  }

  if (isFetchingCompany) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Container className="py-8">          
      <Container maxWidth="md" sx={{ mb: 3, height: '100%' }}>
      <Typography variant ="h5" sx={{my:3}}><strong>{companyId === "new" ? "新規作成" : "会社情報編集"}</strong></Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 3 }}>
            <Stack spacing={2}>
              <Grid container spacing={2}>
                <Grid size={6}>
                  <TextField sx={{ width: '100%' }}  id="name" label="会社名" variant="outlined" value={company.name} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setCompany({ ...company, name: event.target.value })} />
                </Grid>
                <Grid size={6}>
                  <TextField fullWidth  size="medium" id="position" label="採用ポジション" variant="outlined" value={company.position} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setCompany({ ...company, position: event.target.value })} />
                </Grid>
              </Grid>
              <TextField fullWidth size="medium"  id="skillset" label="必須スキルセット" variant="outlined" value={company.skillset} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setCompany({ ...company, skillset: event.target.value })} />
              <TextField  fullWidth size="medium" id="product" label="主力製品・サービス" variant="outlined" value={company.product} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setCompany({ ...company, product: event.target.value })} />
              <TextField  fullWidth multiline maxRows={4} size="medium" id="culture" label="社風" variant="outlined" value={company.culture} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setCompany({ ...company, culture: event.target.value })} />
              <TextField  fullWidth multiline maxRows={4} size="medium" id="mission" label="会社のミッション・ビジョン" variant="outlined" value={company.mission} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setCompany({ ...company, mission: event.target.value })} />
              <TextField multiline rows={3}  fullWidth size="medium" id="others" label="その他特記事項" variant="outlined" value={company.others} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setCompany({ ...company, others: event.target.value })} />
            </Stack>
          </Box>
            <Stack direction="row" spacing={2}>
            {isLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100px' }}>
              <CircularProgress />
              </Box>
            ) : (
              <Button type="submit" disabled={isLoading} variant="outlined" sx={{ width: '100px' }}>保存する</Button>
            )}
            <Link href="/company" passHref>
              <Button variant="contained">一覧に戻る</Button>
            </Link>
            <Link href="/" passHref>
              <Button variant="contained">ホームへ</Button>
            </Link>
            </Stack>
        </form>
      </Container>
    </Container>
  )
}
