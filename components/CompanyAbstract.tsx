'use client';
import react from 'react';
import {Box,Stack,CardContent,Container,Divider,Typography,CardActions,Button} from '@mui/material';
import Link from 'next/link';
import { CustomCard } from '@/app/theme';
import { useEffect,useState} from 'react';
import {CompanyTypes} from '@/types';
import {getCompany} from '@/components/getInfo';



import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import Diversity3OutlinedIcon from '@mui/icons-material/Diversity3Outlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
export default function CompanyAbstruct() {
    const [companyInfo ,setCompanyInfo] = useState<CompanyTypes[]>([]);

    useEffect(()=>{
      getCompany(setCompanyInfo);
    },[]);

    return (
        <CustomCard sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        
        <Box sx={{ display: 'flex', alignItems: 'center', margin: 2 }}><Typography variant="h5" sx={{ flexGrow: 2 }}>企業情報</Typography><ApartmentOutlinedIcon sx={{ fontSize: 40 }} /></Box>
        <Divider sx={{width:'100%',bgcolor:'#000000'}}/>                
        <CardContent sx={{mt:2}}>          
        <Stack spacing={3}>
          {companyInfo.length > 0 ? (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center' }}><BusinessOutlinedIcon/><Typography noWrap sx={{ overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', marginLeft: 1 }}>{companyInfo[0].name}</Typography></Box>              
              <Box sx={{ display: 'flex', alignItems: 'center' }}><WorkOutlineOutlinedIcon/><Typography noWrap sx={{overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', marginLeft: 1  }}>{companyInfo[0].position}</Typography></Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}><CodeOutlinedIcon/><Typography noWrap sx={{overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' , marginLeft: 1 }}>{companyInfo[0].skillset}</Typography></Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}><Inventory2OutlinedIcon/><Typography noWrap sx={{overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', marginLeft: 1 }}>{companyInfo[0].product}</Typography></Box>              
              <Box sx={{ display: 'flex', alignItems: 'center' }}><MenuBookOutlinedIcon/><Typography noWrap sx={{overflow: 'hidden', textOverflow: 'ellipsis', webkitLineClamp:2,webkitBoxOrient:'vertical',width: '100%' , marginLeft: 1 }}>{companyInfo[0].mission}</Typography></Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}><Diversity3OutlinedIcon/><Typography noWrap sx={{overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' ,webkitLineClamp:2,webkitBoxOrient:'vertical', marginLeft: 1 }}>{companyInfo[0].culture}</Typography></Box>                            
            </>
          ):(
            <>
              <Box sx={{ display: 'flex', alignItems: 'center' }}><BusinessOutlinedIcon/><Typography noWrap sx={{ overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', marginLeft: 1 }}>未入力</Typography></Box>              
              <Box sx={{ display: 'flex', alignItems: 'center' }}><WorkOutlineOutlinedIcon/><Typography noWrap sx={{overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', marginLeft: 1  }}>未入力</Typography></Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}><CodeOutlinedIcon/><Typography noWrap sx={{overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' , marginLeft: 1 }}>未入力</Typography></Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}><Inventory2OutlinedIcon/><Typography noWrap sx={{overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', marginLeft: 1 }}>未入力</Typography></Box>              
              <Box sx={{ display: 'flex', alignItems: 'center' }}><MenuBookOutlinedIcon/><Typography noWrap sx={{overflow: 'hidden', textOverflow: 'ellipsis', webkitLineClamp:2,webkitBoxOrient:'vertical',width: '100%' , marginLeft: 1 }}>未入力</Typography></Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}><Diversity3OutlinedIcon/><Typography noWrap sx={{overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' ,webkitLineClamp:2,webkitBoxOrient:'vertical', marginLeft: 1 }}>未入力</Typography></Box>                            
            </>
          )}
        </Stack>
        </CardContent>
        <Box sx={{ flexGrow: 1 }} />
        <CardActions >
          <Link href="/company">
            <Button variant="contained" size="medium" sx={{bottom:5 ,marginLeft:1}}>
              編集
            </Button>
          </Link>
        </CardActions>
        
      </CustomCard>
    );
  }

