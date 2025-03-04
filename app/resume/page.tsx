"use client"
import React, { useState, useEffect, useContext } from "react"
import { Container, Button, TextField, Typography, Select, MenuItem, CircularProgress, Box } from "@mui/material"
import { AddCircle, ChevronLeft, ChevronRight } from "@mui/icons-material"
import Link from "next/link"
import Grid from "@mui/material/Grid2"
import type { ResumeTypes, SelectedResumeTypes } from "@/types"
import ResumeCard from "@/components/ResumeCard"
import { useAtom } from "jotai"
import { userAtom } from "@/atoms/state"
import { createClient } from "@/utils/supabase/client"
import {SupabaseDatabase} from "@/utils/supabase/database";

export default function ResumesPage() {
    const supabase = createClient();
    const [user,] =useAtom(userAtom);
    const [resumes, setResumes] = useState<ResumeTypes[]>([])
    const [selectedResume, setSelectedResume] = useState<SelectedResumeTypes>({
        uid: "",
        id: "",
        resumeId: "",
    })
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(9)
    const [isFetchingResumes, setIsFetchingResumes] = useState(true)
    const [, setIsLoading] = useState(false)
    const resumeTable = new SupabaseDatabase<ResumeTypes>("resumes",supabase);
    const selectedResumeTable = new SupabaseDatabase<SelectedResumeTypes>("selectedResumes",supabase);

    useEffect(() => {
        const fetchResumes = async () => {
            try {
                if (user) {
                    const resumeData = await resumeTable.getArrayDataByUserId(user.uid);
                    const selectedData = await selectedResumeTable.getArrayDataByUserId(user.uid);
                    setResumes(resumeData)
                    setSelectedResume(selectedData[0])
                }
            } catch (error) {
                console.error("Error fetching resumes:", error)
            } finally {
                setIsFetchingResumes(false)
            }
        }
        fetchResumes()
    }, [user])

    const handleDelete = async (id: string) => {
        setIsLoading(true);
        try {
            if (user) {
                await resumeTable.deleteData(id);
                const resumeData = await resumeTable.getArrayDataByUserId(user.uid);
                setResumes(resumeData);
            }
        } catch (error) {
            console.error("Error deleting resume:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleSelect = async (id: string) => {
        setIsLoading(true)
        try {
            const updated = { ...selectedResume, selectedResumeId: id }
            setSelectedResume(updated)
            await selectedResumeTable.updateData(id,updated)
        } catch (error) {
            console.error("Error selecting resume:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const filteredResumes = resumes.filter((r) =>
        [r.name, r.education, r.programming].some((field) =>
            field.toLowerCase().includes(searchTerm.toLowerCase())
        )
    )
    const pageCount = Math.ceil(filteredResumes.length / itemsPerPage)
    const paginatedResumes = filteredResumes.slice(
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
                    プロフィール一覧
                </Typography>                
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },                    
                    mb: 4,
                    alignItems: "flex-start",
                }}
            >
                <Box
                    sx={{
                        display: "flex",                        
                        gap: 2,
                        flexDirection: { xs: "column", sm: "row" },
                        width:"50%"
                    }}
                >
                    <TextField
                        fullWidth
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
                </Box>
            </Box>
            {isFetchingResumes ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={2}>
                    {paginatedResumes.map((resume) => (
                        <Grid size={{xs:12,sm:6,md:4}} key={resume.id}>
                            <ResumeCard
                                resume={resume}
                                selectedResume={selectedResume}
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
                <Link href="/resume/new">
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
