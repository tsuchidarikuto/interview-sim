'use client';
import react from 'react';
import {Box,Stack,CardContent,CardHeader,Divider,Typography,CardActions,Button} from '@mui/material';
import Link from 'next/link';
import { CustomCard } from '@/app/theme';
import { useEffect,useState} from 'react';
import {collection,getDocs,query} from 'firebase/firestore';
import {Resume} from '@/types'
import {firestore} from '@/firebase';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';

export default function ResumeAbstruct() {
    const [resumeInfo ,setResumeInfo] = useState<Resume[]>([]);

    const getResume = async () =>{
      try{
        const q= query(collection(firestore,'resumes'));
        const snapShot = await getDocs(q);
        const data = snapShot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as Resume[];          
        setResumeInfo(data);      
      } catch (e){
        console.error(e);
      }
    };

    useEffect(()=>{
      getResume();
    },[]);
    return (
        <CustomCard sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', margin: 2 }}><Typography variant="h5" sx={{ flexGrow: 1 }}>ES情報</Typography><ListAltOutlinedIcon sx={{ fontSize: 40 }} /></Box>
        <Divider sx={{width:'100%',bgcolor:'#000000'}}/>                
        <CardContent sx={{mt:2}}>          
        <Stack spacing={3}>
          {resumeInfo.length > 0 && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center' }}><Person2OutlinedIcon /><Typography noWrap sx={{ overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', marginLeft: 1 }}>{resumeInfo[0].name} ({resumeInfo[0].age}歳)</Typography></Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}><SchoolOutlinedIcon/><Typography noWrap sx={{overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', marginLeft: 1 }}>{resumeInfo[0].education}</Typography></Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}><CodeOutlinedIcon/><Typography noWrap sx={{overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' , marginLeft: 1 }}>{resumeInfo[0].programming}</Typography></Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}><ClassOutlinedIcon/><Typography noWrap sx={{overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', marginLeft: 1  }}>{resumeInfo[0].qualification}</Typography></Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}><ArticleOutlinedIcon/><Typography noWrap sx={{overflow: 'hidden', textOverflow: 'ellipsis',webkitLineClamp:2,webkitBoxOrient:'vertical', width: '100%' , marginLeft: 1 }}>{resumeInfo[0].selfPR}</Typography></Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}><BusinessOutlinedIcon/><Typography noWrap sx={{overflow: 'hidden', textOverflow: 'ellipsis',webkitLineClamp:2,webkitBoxOrient:'vertical', width: '100%' , marginLeft: 1 }}>{resumeInfo[0].reason}</Typography></Box>
            </>
          )}
        </Stack>
        </CardContent>
        <Box sx={{ flexGrow: 1 }} />
        <CardActions >
          <Link href="/resume">
          <Button variant="contained" size="medium" sx={{bottom:5 ,marginLeft:1}}>
              編集
            </Button>
          </Link>
        </CardActions>
        
      </CustomCard>
    );
  }

