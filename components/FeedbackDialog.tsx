"use client";
import { useContext, useState } from "react";
import CommentIcon from '@mui/icons-material/Comment';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Snackbar, Alert } from "@mui/material";
import { AuthContext } from "@/provider/AuthContext";
import { addDataToFirestore } from "@/utils/handleFirebase";
import { FeedbackTypes } from "@/types";

export default function FeedBackDialog(){
    const {user} = useContext(AuthContext);
    const[isOpenDialog,setIsOpenDialog ]= useState<boolean>(false);
    const[feedbackMessage,setFeedbackMessage] = useState<FeedbackTypes>({
        uid:"",
        id:"",
        message:"",
    })

    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleClickOpenDialog = () => {
        setIsOpenDialog(true);
    }

    const handleCloseDialog = () => {
        setIsOpenDialog(false);
    }

    const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };


    const handleSubmitFeedBack = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (user) {
            addDataToFirestore("Feedback", feedbackMessage, user.uid);
            setFeedbackMessage({...feedbackMessage,message:""});
            handleCloseDialog();
            setOpenSnackbar(true);
        }
    }

    return (
        <>
            <CommentIcon onClick={handleClickOpenDialog}/>
            <Dialog
                open={isOpenDialog}
                onClose={handleCloseDialog}
                PaperProps={{
                    component:'form',
                    onSubmit:handleSubmitFeedBack
                }}
            >
                <DialogTitle sx={{pb:0}}>フィードバックを投稿</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{p:2}}>
                        どんな細かい意見でも良いです！<br/>
                        気になった点、欲しい機能、こんなあったらおもしろくね？等あれば投稿して欲しいです！<br/>
                        現時点では<br/>
                        - ダークモードへの対応<br/>
                        - デプロイ vercel➡??<br/>
                        - DB firebase ➡ supabase<br/>
                        など検討中です！
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        label="フィードバックを記入"
                        variant = "outlined"
                        multiline
                        rows={5}
                        fullWidth
                        value={feedbackMessage.message}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFeedbackMessage({...feedbackMessage,message:event.target.value} )}

                    />
                </DialogContent>
                <DialogActions sx={{pr:3,pb:3}}>
                    <Button variant="outlined" onClick={handleCloseDialog}> Cancel</Button>
                    <Button variant ="outlined" type="submit">投稿</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    Thank you for your feedback!
                </Alert>
            </Snackbar>
        </>
    )
}