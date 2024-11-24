import react from 'react';
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Tutorial from '@/components/Tutorial'
import ResumeAbstruct from '@/components/ResumeAbstruct';
import InterviewSetting from '@/components/InterviewSetting';
import { Container,Box,Paper } from '@mui/material';
import Grid from '@mui/material/Grid2';
import CompanyAbstruct from '@/components/CompanyAbstract';


export default function Page() {
    return (
    <Box sx={{display:'flex', flexDirection:'column', minHeight:'90vh'}}>        
    <Container maxWidth='xl' sx={{ mt: 4, mb: 4, flexGrow: 1, display: 'flex' }}>
      <Grid container spacing={3} sx={{flexGrow: 1}}>
        <Grid size={{xs:12, md:6}} sx={{ display: 'flex' }}>            
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <Tutorial />            
          </Box>
        </Grid>
        
  
        <Grid size={{xs:12, md:6}} sx={{ display: 'flex', flexDirection: 'column' }}>            
            <Box sx={{ display: 'flex', flexGrow: 5, mb: 3,width:'100%' }}>
              <Grid container spacing={3}sx={{flexGrow:1}}>
                <Grid size={{xs:12, md:6}} sx={{ display: 'flex' }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <ResumeAbstruct/>
                  </Box>
                </Grid>
                <Grid size={{xs:12, md:6}} sx={{ display: 'flex' }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <CompanyAbstruct/>
                  </Box>
                </Grid>
              </Grid>
            </Box>
            
            <Box sx={{ display: 'flex', flexGrow: 1 }}>
              <Box sx={{ flexGrow: 1 }}>
                <InterviewSetting/>
              </Box>
            </Box>
          </Grid>
        
      </Grid> 
    </Container>
    </Box>
    );
}