"use client"
import React, { useState, useEffect, useContext } from "react"
import { Container, Button, TextField, Typography, Select, MenuItem, CircularProgress, Box } from "@mui/material"
import { AddCircle, ChevronLeft, ChevronRight } from "@mui/icons-material"
import Link from "next/link"
import Grid from "@mui/material/Grid2"
import { AuthContext } from "@/provider/AuthContext"
import type { CompanyTypes, SelectedCompanyTypes } from "@/types"

import CompanyCard from "@/components/CompanyCard"
import { useAtom } from "jotai"
import { userAtom } from "@/atoms/state"
import { SupabaseDatabase } from "@/utils/supabase/database"
import { createClient } from "@/utils/supabase/client"

export default function CompanysPage() {
    const supabase = createClient();
    const [user,] = useAtom(userAtom)
    const [companys, setCompanys] = useState<CompanyTypes[]>([])
    const [selectedCompany, setSelectedCompany] = useState<SelectedCompanyTypes>({
        uid: "",
        id: "",
        companyId: "",
    })
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(9)
    const [isFetchingCompanys, setIsFetchingCompanys] = useState(true)
    const [, setIsLoading] = useState(false)
    const companyTable = new SupabaseDatabase<CompanyTypes>("companies",supabase);
    const selectedCompanyTable = new SupabaseDatabase<SelectedCompanyTypes>("selectedCompanies",supabase);

    useEffect(() => {
        const fetchCompanys = async () => {
            try {
                if (user) {
                    const companyData = await companyTable.getArrayDataByUserId(user.uid)
                    const selectedData = await selectedCompanyTable.getArrayDataByUserId(user.uid)
                    setCompanys(companyData)
                    setSelectedCompany(selectedData[0])
                }
            } catch (error) {
                console.error("Error fetching companys:", error)
            } finally {
                setIsFetchingCompanys(false)
            }
        }
        fetchCompanys()
    }, [user])

    const handleDelete = async (id: string) => {
        setIsLoading(true)
        try {
            if (user) {
                await companyTable.deleteData(id)
                const companyData = await companyTable.getArrayDataByUserId(user.uid)
                setCompanys(companyData)
            }
        } catch (error) {
            console.error("Error deleting company:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSelect = async (id: string) => {
        setIsLoading(true)
        try {
            const updated = { ...selectedCompany, selectedCompanyId: id }
            setSelectedCompany(updated)
            await selectedCompanyTable.updateData(id,updated)
        } catch (error) {
            console.error("Error selecting company:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const filteredCompanys = companys.filter((r) =>
        [r.name].some((field) =>
            field.toLowerCase().includes(searchTerm.toLowerCase())
        )
    )
    const pageCount = Math.ceil(filteredCompanys.length / itemsPerPage)
    const paginatedCompanys = filteredCompanys.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

   

    return (
        <Container sx={{ py: 5 }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 6,
                    alignItems: "center",                    
                }}
            >
                <Typography
                    variant="h4"
                    component="h1"
                    fontWeight="bold"
                    sx={{
                        fontSize:"2rem",
                    }}
                >
                    会社情報一覧
                </Typography>                
            </Box>
            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "center", mb: 4, alignItems: "center" }}>
                <Box sx={{ display: "flex", width: "100%", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
                    <TextField
                        placeholder="検索..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        
                    />
                    <Select
                        value={itemsPerPage.toString()}
                        onChange={(e) => setItemsPerPage(Number(e.target.value))}                        
                    >
                        <MenuItem value="9">9件表示</MenuItem>
                        <MenuItem value="18">18件表示</MenuItem>
                        <MenuItem value="27">27件表示</MenuItem>
                    </Select>
                    <div style={{ flexGrow: 1 }} />                    
                    <Typography sx={{ p: 2 }}>{currentPage} / {pageCount}</Typography>
                </Box>
            </Box>
            {isFetchingCompanys ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={2}>
                    {paginatedCompanys.map((company) => (
                        <Grid size={{xs:12,sm:6,md:4}} key={company.id}>
                            <CompanyCard
                                company={company}
                                selectedCompany={selectedCompany}
                                handleDelete={handleDelete}
                                handleSelect={handleSelect}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}
            <Box sx={{ display: "flex", justifyContent: "space-between", my: 2, alignItems: "center", gap: 1 }}>         
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>         
                <Link href="/" passHref>
                        <Button variant="contained" >ホームへ</Button>
                </Link>
                <Link href="/company/new">
                        <Button
                            variant="contained"
                            startIcon={<AddCircle />}                            
                        >
                            新規作成
                        </Button>
                </Link>
            </Box>       
                <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft />
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, pageCount))}
                        disabled={currentPage === pageCount}
                    >
                        <ChevronRight />
                    </Button>
                </Box>
            </Box>
            
            
        </Container>
    )
}
