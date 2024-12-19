'use client';
import {useState, FormEvent} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import { Typography,Container,Card,TextField,Button } from '@mui/material';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase';

export default function Page() {
    const {push} = useRouter();

    const [email,setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = async (e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        try{
            await createUserWithEmailAndPassword(auth,email,password);
            push('/');            
        } catch (error){
            console.log(error);
            window.alert('登録に失敗しました');
        }
    };

    return (
        <>        
        
            <Container maxWidth="md" sx={{mt:3}}>
            <Typography variant = "h4" align = "center" gutterBottom>新規登録</Typography>
            <Typography variant="body1" color="text.secondary" align="center">
                メールアドレスとパスワードを入力して<br/>
                InterviewSimアカウントを作成して下さい
            </Typography>
            <Card sx={{p:3}}>
            <form onSubmit = {handleSignUp}>
                <TextField
                    label="メールアドレス"
                    required
                    type="email"
                    fullWidth
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    sx={{mb:5}}
                />
                <TextField
                    required
                    label="パスワード"
                    type="password"
                    fullWidth
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    sx={{mb:5}}
                />
                <Button type="submit" variant='contained' sx={{mb:5,height:55,width:'100%', backgroundColor:'#555'}}>登録</Button>
            </form>
            <Card variant='outlined'>
            <Link href="/login">
                <Typography variant="body1" align = "center" sx={{textDecoration: 'underline' ,cursor:"pointer",p:5}}>ログインはこちら</Typography>
            </Link>
            </Card>
            </Card>
            </Container>                  
        </>
    )
}