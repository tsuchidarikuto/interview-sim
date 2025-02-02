import React from 'react';
import { Card, Box, Typography, Button } from '@mui/material';
import { Edit, Delete, CheckCircle, RadioButtonUnchecked, Business, Work, Build, LocalOffer, Group, Flag, Info } from '@mui/icons-material';
import Link from 'next/link';
import type { CompanyTypes, SelectedCompanyTypes } from '@/types';

interface CompanyCardProps {
    company: CompanyTypes;
    selectedCompany: SelectedCompanyTypes;
    handleDelete: (id: string) => void;
    handleSelect: (id: string) => void;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company, selectedCompany, handleDelete, handleSelect }) => (
    <Card
        variant="outlined"
        sx={{
            display: 'flex',
            flexDirection: 'column',
            border: selectedCompany.selectedCompanyId === company.id ? '2px solid black' : undefined,
            width: '100%',
            height: 200,
        }}
    >
        <Box sx={{ p: 1.5, height: 50 }}>
            <Typography variant="h5"><strong>{company.name || '未記入'}</strong></Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Work sx={{ mx: 2 }} />
                <Typography noWrap variant="body2">
                    {company.position || '未記入'}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Build sx={{ mx: 2 }} />
                <Typography noWrap variant="body2">
                    {company.skillset || '未記入'}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocalOffer sx={{ mx: 2 }} />
                <Typography noWrap variant="body2">
                    {company.product || '未記入'}
                </Typography>
            </Box>            
        </Box>
        <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 1, mr: 1 }}>
            <Link href={`/company/${company.id}`} passHref>
                <Button variant="outlined" size="small" startIcon={<Edit />}>
                    編集
                </Button>
            </Link>
            <Button
                disabled={selectedCompany.selectedCompanyId === company.id}
                variant="outlined"
                size="small"
                startIcon={<Delete />}
                onClick={() => handleDelete(company.id)}
            >
                削除
            </Button>
            <Button
                variant={selectedCompany.selectedCompanyId === company.id ? 'contained' : 'outlined'}
                size="small"
                startIcon={
                    selectedCompany.selectedCompanyId === company.id ? <CheckCircle /> : <RadioButtonUnchecked />
                }
                onClick={() => handleSelect(company.id)}
            >
                {selectedCompany.selectedCompanyId === company.id ? '選択中' : '選択'}
            </Button>
        </Box>
    </Card>
);

export default CompanyCard;