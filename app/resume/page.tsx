"use client"
import React,{ useState, useEffect, useContext } from "react"
import { Container, Button, TextField, Typography, IconButton, Select, MenuItem, CircularProgress, Box } from "@mui/material"
import { AddCircle, GridView, ViewList, ChevronLeft, ChevronRight, GridViewRounded } from "@mui/icons-material"
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded';
import ViewListOutlinedIcon from '@mui/icons-material/ViewListOutlined';
import Link from "next/link"
import type { ResumeTypes, SelectedResumeTypes } from "@/types"
import { getArrayDataFromFirestore, updateDataOnFirestore } from "@/utils/handleFirebase"
import { AuthContext } from "@/provider/AuthContext"
import Grid from "@mui/material/Grid2"
import ResumeCard from "@/components/ResumeCard"
import ResumeTable from "@/components/ResumeTable"

export default function ResumesPage() {
    const { user } = useContext(AuthContext)
    const [resumes, setResumes] = useState<ResumeTypes[]>([])
    const [selectedResume, setSelectedResume] = useState<SelectedResumeTypes>({
        uid:"",
        id:"",
        selectedResumeId:"",
    })
    const [viewMode, setViewMode] = useState<"card" | "table">("card")
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(9)

    const [isFetchingResumes, setIsFetchingResumes] = useState(true)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const fetchResumes = async () => {
            try {
                if (user) {
                    const resumeDataFromFirestore = await getArrayDataFromFirestore<ResumeTypes>("resumes", user.uid);
                    const selectedResumeFromeFirestore = await getArrayDataFromFirestore<SelectedResumeTypes>("selectedResume",user.uid);
                    setResumes(resumeDataFromFirestore);
                    setSelectedResume(selectedResumeFromeFirestore[0]);
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
            setResumes((prev) => prev.filter((resume) => resume.id !== id))
        } catch (error) {
            console.error("Error deleting resume:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSelect = async (id: string) => {
        setIsLoading(true)
        try {
            const updatedSelectedResume = { ...selectedResume, selectedResumeId: id }
            setSelectedResume(updatedSelectedResume)
            await updateDataOnFirestore<SelectedResumeTypes>("selectedResume", updatedSelectedResume)
        } catch (error) {
            console.error("Error selecting resume:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const filteredResumes = resumes.filter((resume) =>
        [resume.name, resume.education, resume.programming]
            .some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    const pageCount = Math.ceil(filteredResumes.length / itemsPerPage)
    const paginatedResumes = filteredResumes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

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
        <Container sx={{ py: 8 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 6 }}>
                <Typography variant="h4" component="h1" fontWeight="bold">プロフィール一覧</Typography>
                <Link href="/resume/new">
                    <Button variant="contained" startIcon={<AddCircle />} size="large">
                        新規作成
                    </Button>
                </Link>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <TextField
                        placeholder="検索..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ width: '16rem' }}
                    />
                    <Select
                        value={itemsPerPage.toString()}
                        onChange={(e) => setItemsPerPage(Number(e.target.value))}
                        sx={{ width: '11.25rem' }}
                    >
                        <MenuItem value="9">9件表示</MenuItem>
                        <MenuItem value="18">18件表示</MenuItem>
                        <MenuItem value="27">27件表示</MenuItem>
                    </Select>
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton 
                        onClick={() => setViewMode("card")}
                        color={viewMode === "card" ? "primary" : "default"}
                    >
                        {viewMode === "card" ? <GridViewRoundedIcon fontSize="large"/> : <GridView fontSize="medium"/>}
                    </IconButton>
                    <IconButton 
                        onClick={() => setViewMode("table")}
                        color={viewMode === "table" ? "primary" : "default"}
                    >
                        {viewMode === "table" ? <ViewListRoundedIcon fontSize="large"/> : <ViewListOutlinedIcon fontSize="medium"/>}
                    </IconButton>
                </Box>
            </Box>
            {viewMode === "card" ? (
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
            ) : (
                <ResumeTable
                    resumes={paginatedResumes}
                    selectedResume={selectedResume}
                    handleDelete={handleDelete}
                    handleSelect={handleSelect}
                />
            )}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 4 }}>
                <Typography>{currentPage} / {pageCount} ページ</Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft />
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pageCount))}
                        disabled={currentPage === pageCount}
                    >
                        <ChevronRight />
                    </Button>
                </Box>
            </Box>
        </Container>
    )
}
