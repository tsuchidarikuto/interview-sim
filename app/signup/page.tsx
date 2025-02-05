'use client';
import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Typography, Container, Card, TextField, Button } from '@mui/material';
import { addDataToFirestore, getArrayDataFromFirestore } from '@/utils/handleFirebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase';
import { ResumeTypes, SettingTypes, CompanyTypes } from '@/types';

export default function Page() {
    const { push } = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
          // ユーザー登録成功後の処理
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
          // サンプルのプロフィール登録
          const resumeData: ResumeTypes = {
            uid: "",
            id: "",
            name: "サンプル 太郎",
            birth: "2000-01-01",
            age: "22",
            sex: 0,
            education: "サンプル大学",
            programming: "JavaScript, TypeScript",
            selfPR: "情熱的なエンジニアです。",
            research: "最新技術の習得",
            qualification: "各種資格",
            bestAtStu: "学業・部活両立",
            reason: "チャレンジ精神"
          };
          await addDataToFirestore<ResumeTypes>("resumes", resumeData, userCredential.user.uid);
    
          // 追加した resume を uid で取得し id を取得
          const resumeArray = await getArrayDataFromFirestore<ResumeTypes>("resumes", userCredential.user.uid);
          // 条件により対象のドキュメントを選定（ここでは name を利用）
          const resumeDocId = resumeArray.find(doc => doc.name === "サンプル 太郎")?.id || "";
    
          // サンプルの企業情報登録
          const companyData: CompanyTypes = {
            uid: "",
            id: "",
            name: "サンプル株式会社",
            position: "エンジニア",
            skillset: "フロントエンド, バックエンド",
            mission: "世の中を変える",
            product: "革新的なサービス",
            culture: "オープンで自由",
            others: "未定"
          };
          await addDataToFirestore<CompanyTypes>("company", companyData, userCredential.user.uid);
    
          // 追加した company を uid で取得し id を取得
          const companyArray = await getArrayDataFromFirestore<CompanyTypes>("company", userCredential.user.uid);
          const companyDocId = companyArray.find(doc => doc.name === "サンプル株式会社")?.id || "";
    
          // サンプルの面接設定登録
          const settingData: SettingTypes = {
            uid: "",
            id: "",
            difficulty: "普通",
            duration: 30,
            interviewType: "複合面接",
            interviewMode:"voice"
          };
          await addDataToFirestore<SettingTypes>("setting", settingData, userCredential.user.uid);
    
          // 登録済みの resume と company のドキュメント ID を selectedResume / selectedCompany に書き込み
          const selectedResume = {
            uid: userCredential.user.uid,
            selectedResumeId: resumeDocId
          };
          await addDataToFirestore("selectedResume", selectedResume, userCredential.user.uid);
    
          const selectedCompany = {
            uid: userCredential.user.uid,
            selectedCompanyId: companyDocId
          };
          await addDataToFirestore("selectedCompany", selectedCompany, userCredential.user.uid);
    
          // すべて登録した後、ホームへ遷移
          push('/');
        } catch (error) {
          console.log(error);
          window.alert('登録に失敗しました');
        }
      };

    return (
        <>
            <Container maxWidth="md" sx={{ mt: 3 }}>
                <Typography variant="h4" align="center" gutterBottom>新規登録</Typography>
                <Typography variant="body1" color="text.secondary" align="center">
                    メールアドレスとパスワードを入力して<br />
                    InterviewSimアカウントを作成して下さい
                </Typography>
                <Card sx={{ p: 3 }} variant='outlined'>
                    <form onSubmit={handleSignUp}>
                        <TextField
                            label="メールアドレス"
                            required
                            type="email"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{ mb: 5 }}
                        />
                        <TextField
                            required
                            label="パスワード"
                            type="password"
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{ mb: 5 }}
                        />
                        <Button type="submit" variant='contained' sx={{ mb: 5, height: 55, width: '100%', backgroundColor: '#555' }}>登録</Button>
                    </form>
                    <Card variant='outlined'>
                        <Link href="/login">
                            <Typography variant="body1" align="center" sx={{ textDecoration: 'underline', cursor: "pointer", p: 5 }}>ログインはこちら</Typography>
                        </Link>
                    </Card>
                </Card>
            </Container>
        </>
    );
}
