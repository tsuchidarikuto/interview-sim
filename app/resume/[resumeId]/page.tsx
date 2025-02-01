"use client"

import { useState, useEffect, FormEvent, useContext } from "react"
import { useParams,useRouter } from "next/navigation"
import { Box, CircularProgress, Button, TextField, Container, Stack, MenuItem, Typography } from '@mui/material'
import Grid from "@mui/material/Grid2"
import type { ResumeTypes } from "@/types"
import { getArrayDataFromFirestore, updateDataOnFirestore, addDataToFirestore ,getDataFromFirestoreWithId} from "@/utils/handleFirebase"
import { AuthContext } from "@/provider/AuthContext"
import Link from 'next/link';

export default function ResumeEditPage() {
  const {push} = useRouter()
  const { user } = useContext(AuthContext)
  const params = useParams();
  const resumeId = Array.isArray(params.resumeId) ? params.resumeId[0] : params.resumeId;
  const [resume, setResume] = useState<ResumeTypes>({
    uid: "",
    id: "",
    name: "",
    birth: "",
    age: "",
    sex: 0,
    education: "",
    programming: "",
    selfPR: "",
    research: "",
    qualification: "",
    bestAtStu: "",
    reason: "",
  })
  const [isNew, setIsNew] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingResume, setIsFetchingResume] = useState<boolean>(true)

  useEffect(() => {
    const fetchresume = async () => {
      if (resumeId !== "new" && user&&resumeId) {
        const foundresume = await getDataFromFirestoreWithId<ResumeTypes>("resumes", resumeId)
        if (foundresume) {
          setResume(foundresume)
        } else {
          setIsNew(true)
        }
        setIsFetchingResume(false)
      } else {
        setIsNew(true)
        setIsFetchingResume(false)
      }
    }
    fetchresume()
  }, [resumeId, user])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    try {
      if (user) {
        if (isNew) {
          await addDataToFirestore<ResumeTypes>("resumes", resume, user.uid)
        } else {
          await updateDataOnFirestore<ResumeTypes>("resumes", resume)
        }
        push("/resume");
      }
    } catch (e) {
      console.error('Error updating document:', e)
    }
    setIsLoading(false)
  }

  if (isFetchingResume) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Container className="py-8">
      <Typography variant ="h5" sx={{my:3}}><strong>{resumeId === "new" ? "新規プロフィール作成" : "プロフィール編集"}</strong></Typography>
      <Container maxWidth="md" sx={{ mb: 3, height: '100%' }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 3 }}>
            <Stack spacing={2}>
              <Grid container spacing={2}>
                <Grid size={6}>
                  <TextField sx={{ width: '100%' }}  id="name" label="氏名" variant="outlined" value={resume.name} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setResume({ ...resume, name: event.target.value })} />
                </Grid>
                <Grid size={3}>
                  <TextField fullWidth  size="medium" id="age" label="年齢" variant="outlined" type="number" value={resume.age} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setResume({ ...resume, age: event.target.value })} />
                </Grid>
                <Grid size={3}>
                  <TextField select fullWidth  size="medium" id="sex" label="性別" variant="outlined" value={resume.sex} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setResume({ ...resume, sex: Number(event.target.value) })}>
                    <MenuItem value={1}>男性</MenuItem>
                    <MenuItem value={2}>女性</MenuItem>
                    <MenuItem value={3}>その他</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
              <TextField fullWidth size="medium"  id="最終学歴" label="最終学歴" variant="outlined" value={resume.education} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setResume({ ...resume, education: event.target.value })} />
              <TextField  fullWidth size="medium" id="資格" label="資格" variant="outlined" value={resume.qualification} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setResume({ ...resume, qualification: event.target.value })} />
              <TextField  fullWidth multiline maxRows={4} size="medium" id="研究成果" label="研究成果" variant="outlined" value={resume.research} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setResume({ ...resume, research: event.target.value })} />
              <TextField  fullWidth multiline maxRows={4} size="medium" id="プログラミングの経験・使用言語" label="プログラミングの経験・使用言語" variant="outlined" value={resume.programming} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setResume({ ...resume, programming: event.target.value })} />
              <TextField multiline rows={3}  fullWidth size="medium" id="自己PR" label="自己PR" variant="outlined" value={resume.selfPR} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setResume({ ...resume, selfPR: event.target.value })} />
              <TextField multiline rows={3}  fullWidth size="medium" id="学生時代頑張ったこと" label="学生時代頑張ったこと" variant="outlined" value={resume.bestAtStu} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setResume({ ...resume, bestAtStu: event.target.value })} />
              <TextField multiline rows={3}  fullWidth size="medium" id="志望理由" label="志望理由" variant="outlined" value={resume.reason} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setResume({ ...resume, reason: event.target.value })} />
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
            <Link href="/resume" passHref>
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