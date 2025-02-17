'use client';
import {useState, FormEvent} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Container,Typography,TextField,Card,Button } from '@mui/material';
import {login,signup} from './actions';
import { auth } from '@/firebase';

export default function Page() {
    const {push} = useRouter();

    const [email,setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        try{
            await signInWithEmailAndPassword(auth,email,password);
            push('/');            
        } catch (error){
            console.log(error);
            window.alert('ログインに失敗しました');
        }
    };

    return (
        <>
        
        <Container maxWidth="md" sx={{mt:5}}>
        <Typography variant = "h4" align = "center" gutterBottom>ログイン・新規登録</Typography>
        <Typography variant="body1" color="text.secondary" align="center">
            InterviewSimを始めるには<br/>
            InterviewSimアカウントにログインして下さい
        </Typography>
        <Card sx={{p:3}} variant='outlined'>
            <form >
                <TextField
                    required
                    label="メールアドレス"
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
                <Button 
                    formAction ={login}
                    type="submit" 
                    variant='contained' 
                    sx={{
                        mb:5,
                        height:55,
                        width:'100%', 
                        backgroundColor:'#555'
                    }}
                >
                        ログイン
                </Button>

                <Button 
                    formAction ={signup}
                    variant='contained' 
                    sx={{
                        mb:5,
                        height:55,
                        width:'100%', 
                        backgroundColor:'#555'
                    }}
                >
                        新規登録
                </Button>
                
            </form>            
            </Card>
        </Container>

        </>
    )
}