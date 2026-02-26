import {
    Box,
    Button,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
    FormControl,
    InputLabel,
    Paper,
    Snackbar,
    Alert,
    AlertTitle,
    Slide,
    type SlideProps,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function CreatePost() {
    const navigate = useNavigate();

    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [status, setStatus] = useState<string>("draft");
    const [loading, setLoading] = useState<boolean>(false);
    const [openSuccess, setOpenSuccess] = useState(false);

    const handleCreatePost = async () => {
        if (!title.trim() || !content.trim()) {
            alert("Title and content cannot be empty");
            return;
        }

        setLoading(true);

        const response = await fetch("http://localhost:5173/api/post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title,
                content,
                status,
            }),
        });

        setLoading(false);

        if (response.status !== 200) {
            alert("Failed to create post");
            return;
        }

        setOpenSuccess(true);
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(135deg, #e3f2fd 0%, #f5f5f5 100%)",
            }}
        >
            <Paper
                elevation={16}
                sx={{
                    width: 500,
                    padding: 5,
                    borderRadius: 4,
                    backdropFilter: "blur(6px)",
                }}
            >
                <Typography
                    variant="h4"
                    fontWeight={700}
                    textAlign="center"
                    mb={4}
                >
                    Create Post
                </Typography>

                <Stack spacing={3}>
                    <TextField
                        label="Post Title"
                        fullWidth
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <TextField
                        label="Post Content"
                        fullWidth
                        multiline
                        minRows={5}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />

                    <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={status}
                            label="Status"
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <MenuItem value="published">Published</MenuItem>
                            <MenuItem value="draft">Draft</MenuItem>
                        </Select>
                    </FormControl>

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mt: 2,
                        }}
                    >
                        <Button
                            variant="outlined"
                            onClick={() => navigate(-1)}
                            disabled={loading}
                            sx={{ width: "45%" }}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="contained"
                            onClick={handleCreatePost}
                            disabled={loading}
                            sx={{
                                width: "45%",
                                fontWeight: 600,
                            }}
                        >
                            {loading ? "Creating..." : "Create"}
                        </Button>
                    </Box>
                </Stack>
            </Paper>
            <Snackbar
                open={openSuccess}
                autoHideDuration={2000}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                TransitionComponent={(props: SlideProps) => (
                    <Slide {...props} direction="down" />
                )}
                onClose={() => {
                    setOpenSuccess(false);
                    navigate("/");
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
                        Post Created Successfully 🎉
                    </AlertTitle>
                    Your new post has been published.
                </Alert>
            </Snackbar>
        </div>
    );
}
