"use client"
import React, { useState, useEffect, useContext } from "react"
import { Container, Button, TextField, Typography, Select, MenuItem, CircularProgress, Box } from "@mui/material"
import { AddCircle, ChevronLeft, ChevronRight } from "@mui/icons-material"
import Link from "next/link"
import Grid from "@mui/material/Grid2"
import { AuthContext } from "@/provider/AuthContext"
import type { ResumeTypes, SelectedResumeTypes } from "@/types"
import { deleteDataOnFirestore, getArrayDataFromFirestore, updateDataOnFirestore } from "@/utils/handleFirebase"
import ResumeCard from "@/components/ResumeCard"

export default function ResumesPage() {
    const { user } = useContext(AuthContext)
    const [resumes, setResumes] = useState<ResumeTypes[]>([])
    const [selectedResume, setSelectedResume] = useState<SelectedResumeTypes>({
        uid: "",
        id: "",
        selectedResumeId: "",
    })
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(9)
    const [isFetchingResumes, setIsFetchingResumes] = useState(true)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const fetchResumes = async () => {
            try {
                if (user) {
                    const resumeData = await getArrayDataFromFirestore<ResumeTypes>("resumes", user.uid)
                    const selectedData = await getArrayDataFromFirestore<SelectedResumeTypes>("selectedResume", user.uid)
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
        setIsLoading(true)
        try {
            if (user) {
                await deleteDataOnFirestore("resumes", id)
                const resumeData = await getArrayDataFromFirestore<ResumeTypes>("resumes", user.uid)
                setResumes(resumeData)
            }
        } catch (error) {
            console.error("Error deleting resume:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSelect = async (id: string) => {
        setIsLoading(true)
        try {
            const updated = { ...selectedResume, selectedResumeId: id }
            setSelectedResume(updated)
            await updateDataOnFirestore<SelectedResumeTypes>("selectedResume", updated)
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

    if (isFetchingResumes) {
        return (
            <Container sx={{ py: 8 }}>
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                    <CircularProgress />
                </Box>
            </Container>
        )
    }

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
                    <Link href="/resume/new">
                        <Button
                            variant="contained"
                            startIcon={<AddCircle />}
                            sx={{ fontSize: { sm: "1.25rem", xs: "1rem" }, width: { xs: "100%", sm: "auto" } }}
                        >
                            新規作成
                        </Button>
                    </Link>
                </Box>
            </Box>
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
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 4 }}>
                <Typography>{currentPage} / {pageCount} ページ</Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
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
