import {
    Box,
    Button,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    TextField,
    Typography,
    Divider,
    Chip,
    AlertTitle,
    Alert,
    Snackbar,
    type SlideProps,
    Slide,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

export default function EditPostPage() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [status, setStatus] = useState("draft");
    const [openSuccess, setOpenSuccess] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            const response = await fetch(`/api/post/${id}`);
            if (response.status != 200) {
                alert("Post not found");
                return;
            }

            const data = await response.json();

            setTitle(data.title);
            setContent(data.content);
            setStatus(data.status);
        };
        fetchPost();
    }, [id]);

    const handleEdit = async () => {
        const response = await fetch(`/api/post/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title,
                status,
            }),
        });

        if (response.status != 200) {
            alert("Failed to update post");
            return;
        }
        setOpenSuccess(true);
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "linear-gradient(180deg,#f8fafc 0%,#eef2f7 100%)",
                py: 6,
            }}
        >
            <Container maxWidth="xl">
                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        mb: 4,
                        borderRadius: 4,
                        border: "1px solid #e0e0e0",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backdropFilter: "blur(6px)",
                    }}
                >
                    <Box>
                        <Typography variant="h4" fontWeight={800}>
                            Edit Post
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Post ID: {id}
                        </Typography>
                    </Box>

                    <Chip
                        label={status.toUpperCase()}
                        color={status === "published" ? "success" : "default"}
                        sx={{
                            fontWeight: 700,
                            letterSpacing: 1,
                        }}
                    />
                </Paper>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
                        gap: 5,
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            p: 5,
                            borderRadius: 5,
                            border: "1px solid #e5e7eb",
                            backgroundColor: "#ffffff",
                        }}
                    >
                        <Stack spacing={4}>
                            <TextField
                                label="Post Title"
                                fullWidth
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        fontSize: "1.2rem",
                                        fontWeight: 600,
                                    },
                                }}
                            />

                            <TextField
                                label="Post Content"
                                fullWidth
                                multiline
                                minRows={10}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        fontSize: "1rem",
                                    },
                                }}
                            />

                            <FormControl fullWidth>
                                <InputLabel shrink>Status</InputLabel>
                                <Select
                                    value={status}
                                    label="Status"
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <MenuItem value="draft">Draft</MenuItem>
                                    <MenuItem value="published">
                                        Published
                                    </MenuItem>
                                </Select>
                            </FormControl>

                            <Divider sx={{ my: 2 }} />

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    gap: 2,
                                }}
                            >
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate(-1)}
                                    sx={{
                                        px: 4,
                                        borderRadius: 3,
                                    }}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    variant="contained"
                                    sx={{
                                        px: 5,
                                        borderRadius: 3,
                                        fontWeight: 700,
                                    }}
                                    onClick={handleEdit}
                                >
                                    Save Changes
                                </Button>
                            </Box>
                        </Stack>
                    </Paper>

                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
                            borderRadius: 5,
                            border: "1px solid #e5e7eb",
                            backgroundColor: "#fafafa",
                            height: "fit-content",
                        }}
                    >
                        <Typography
                            variant="overline"
                            sx={{
                                letterSpacing: 2,
                                fontWeight: 700,
                            }}
                            color="text.secondary"
                        >
                            LIVE PREVIEW
                        </Typography>

                        <Typography
                            variant="h5"
                            fontWeight={800}
                            mt={2}
                            gutterBottom
                        >
                            {title || "Post Title Preview"}
                        </Typography>

                        <Divider sx={{ mb: 2 }} />

                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{
                                whiteSpace: "pre-line",
                                lineHeight: 1.8,
                            }}
                        >
                            {content || "Content preview will appear here..."}
                        </Typography>
                    </Paper>
                </Box>
            </Container>
            <Snackbar
                open={openSuccess}
                autoHideDuration={2000}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                TransitionComponent={(props: SlideProps) => (
                    <Slide {...props} direction="down" />
                )}
                onClose={() => {
                    setOpenSuccess(false);
                    navigate(`/post/${id}`);
                }}
            >
                <Alert
                    severity="success"
                    variant="filled"
                    icon={<CheckCircleOutlineIcon fontSize="inherit" />}
                    sx={{
                        width: "100%",
                        borderRadius: 3,
                        boxShadow: 6,
                    }}
                >
                    <AlertTitle sx={{ fontWeight: 700 }}>
                        Post Updated Successfully
                    </AlertTitle>
                    Your changes have been saved.
                </Alert>
            </Snackbar>
        </Box>
    );
}
