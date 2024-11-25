import { FunctionComponent } from "react";
import Link from 'next/link';
import { Box, Button, TextField, Typography, Container, Stack, Card, Divider, Select, MenuItem } from '@mui/material';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Grid from "@mui/material/Grid2";

export default function Resume() {
    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 5, pb: 10 }}>
            <Typography variant="h4" component="h1">エントリーシート</Typography>
            <Divider sx={{ width: '100%', bgcolor: 'primary.main' }} />
            <Container maxWidth="md" sx={{ mt: 3, mb: 3, height: '100%' }}>
                <Stack spacing={2}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 6, md: 8 }}>
                            <Stack spacing={2}>
                                <TextField id="name" label="氏名" variant="filled" />
                                <TextField fullWidth size="medium" id="birth" label="生年月日" variant="filled" type="date" slotProps={{ inputLabel: { shrink: true } }} />
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 6, md: 6 }}>
                                        <TextField fullWidth size="medium" id="age" label="年齢" variant="filled" type="number" />
                                    </Grid>
                                    <Grid size={{ xs: 6, md: 6 }}>
                                        <TextField select fullWidth size="medium" id="sex" label="性別" variant="filled">
                                            <MenuItem value={1}>男性</MenuItem>
                                            <MenuItem value={2}>女性</MenuItem>
                                            <MenuItem value={3}>その他</MenuItem>
                                        </TextField>
                                    </Grid>
                                </Grid>
                                <TextField fullWidth size="medium" id="最終学歴" label="最終学歴" variant="filled" />
                            </Stack>
                        </Grid>
                        <Grid size={{ xs: 6, md: 4 }}>
                            <Card sx={{ bgcolor: "#555555", width: "100%", aspectRatio: "1 / 1" }} />
                        </Grid>
                    </Grid>
                    <TextField fullWidth multiline maxRows={4} size="medium" id="プログラミングの経験・使用言語" label="プログラミングの経験・使用言語" variant="filled" />
                    <TextField fullWidth multiline maxRows={4} size="medium" id="自己PR" label="自己PR" variant="filled" />
                    <TextField fullWidth multiline maxRows={4} size="medium" id="研究成果" label="研究成果" variant="filled" />
                    <TextField fullWidth multiline maxRows={4} size="medium" id="資格" label="資格" variant="filled" />
                    <TextField fullWidth multiline maxRows={4} size="medium" id="学生時代頑張ったこと" label="学生時代頑張ったこと" variant="filled" />
                    <TextField fullWidth multiline maxRows={4} size="medium" id="志望理由" label="志望理由" variant="filled" />
                </Stack>
            </Container>
            <Divider sx={{ width: '100%', bgcolor: 'primary.main' }} />
            <Box sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                    <Grid>
                        <Link href='/'>
                            <Button variant="contained" size='small'>
                                戻る
                            </Button>
                        </Link>
                    </Grid>
                    <Grid>
                        <Link href='/company'>
                            <Button variant="contained" size='small'>
                                会社情報を編集する
                            </Button>
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}
