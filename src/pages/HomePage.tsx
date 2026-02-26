import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Chip,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Grid,
    MenuItem,
    Select,
    Stack,
    Typography,
    Snackbar,
    Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useAppSelector } from "../hooks/useAppSelector";

type Post = {
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    id: string;
    title: string;
    content: string;
    status: string;
    user: {
        name: string;
    };
    userId: string;
};

type SortKey = "title" | "userName" | "createdAt";

export default function HomePage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [sortBy, setSortBy] = useState<SortKey | undefined>();
    const [isSortAscending, setSortAscending] = useState<boolean>(true);
    const [deletePostId, setDeletePostId] = useState<string>("");
    const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const myUserId = useAppSelector((state) => state.auth.userInfo?.user.id);

    const navigate = useNavigate();

    console.log("myUserId:", myUserId);
    console.log("posts:", posts);

    const sortedPosts = useMemo(() => {
        if (sortBy === undefined) {
            return posts;
        }
        const result = [...posts];
        const directionMultiplier = isSortAscending ? 1 : -1;
        result.sort((a, b) => {
            switch (sortBy) {
                case "title":
                    return a.title > b.title
                        ? directionMultiplier
                        : -directionMultiplier;
                case "userName":
                    return a.user.name > b.user.name
                        ? directionMultiplier
                        : -directionMultiplier;
                case "createdAt":
                    return a.createdAt > b.createdAt
                        ? directionMultiplier
                        : -directionMultiplier;
                default:
            }
            return 0;
        });
        return result;
    }, [posts, sortBy, isSortAscending]);

    const reloadPosts = useCallback(async () => {
        const response = await fetch("http://localhost:5173/api/post/");
        if (response.status != 200) {
            alert("Failed to reload post");
            return;
        }
        const data = await response.json();

        // const filteredPosts = data.records.filter((post: Post) => post.userID === myUserId);
        const filteredPosts = data.records.filter(
            (post: Post) => post.userId == myUserId,
        );

        setPosts(filteredPosts);
    }, [myUserId]);

    const handleDeletePost = useCallback(async () => {
        const response = await fetch(
            "http://localhost:5173/api/post/" + deletePostId,
            {
                method: "DELETE",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    deletePostId,
                }),
            },
        );

        if (response.status != 200) {
            alert("Failed to delete post");
            return;
        }
        setDeleteDialog(false);
        setDeleteSuccess(true);
        reloadPosts();
    }, [deletePostId, reloadPosts]);

    const stringToColor = (string: string) => {
        let hash = 0;

        for (let i = 0; i < string.length; i++) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        const colors = [
            "#1976d2", // blue
            "#9c27b0", // purple
            "#2e7d32", // green
            "#ed6c02", // orange
            "#d32f2f", // red
            "#0288d1", // light blue
            "#7b1fa2", // deep purple
            "#c2185b", // pink
            "#00796b", // teal
            "#5d4037", // brown
        ];

        return colors[Math.abs(hash) % colors.length];
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        reloadPosts();
    }, [reloadPosts]);

    return (
        <Container maxWidth="lg" sx={{ mt: 5, mb: 6 }}>
            <Typography variant="h4" fontWeight={600} gutterBottom>
                Welcome to Jordan Post page
            </Typography>

            <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                alignItems="center"
                mb={4}
            >
                <Select
                    value={sortBy ?? ""}
                    displayEmpty
                    sx={{ minWidth: 180 }}
                    onChange={(e) => {
                        const value = e.target.value;

                        if (!value) {
                            setSortBy(undefined);
                            setSortAscending(true);
                        } else {
                            setSortBy(value as SortKey);
                            setSortAscending(true);
                        }
                    }}
                >
                    <MenuItem value="">No Sort</MenuItem>
                    <MenuItem value="title">Title</MenuItem>
                    <MenuItem value="userName">User Name</MenuItem>
                    <MenuItem value="createdAt">Created Date</MenuItem>
                </Select>

                <Button
                    variant="outlined"
                    disabled={!sortBy}
                    onClick={() => setSortAscending((prev) => !prev)}
                >
                    {isSortAscending ? "Ascending ↑" : "Descending ↓"}
                </Button>

                <Button variant="contained" onClick={reloadPosts}>
                    Reload
                </Button>
            </Stack>

            <Grid container spacing={3}>
                {sortedPosts.map((post) => (
                    <Grid key={post.id}>
                        <Card
                            onClick={() => {
                                navigate(`post/${post.id}`);
                            }}
                            sx={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                borderRadius: 3,
                                transition: "0.2s ease",
                                cursor: "pointer",
                                "&:hover": {
                                    boxShadow: 6,
                                    transform: "translateY(-4px)",
                                },
                            }}
                        >
                            <CardHeader
                                avatar={
                                    <Avatar
                                        sx={{
                                            bgcolor: stringToColor(
                                                post.user.name,
                                            ),
                                            color: "#fff",
                                            fontWeight: 600,
                                        }}
                                    >
                                        {getInitials(post.user.name)}
                                    </Avatar>
                                }
                                title={
                                    <Typography
                                        variant="h6"
                                        fontWeight={600}
                                        noWrap
                                    >
                                        {post.title}
                                    </Typography>
                                }
                                subheader={`by ${post.user.name}`}
                                action={
                                    <Chip
                                        label={post.status}
                                        size="small"
                                        color={
                                            post.status === "published"
                                                ? "success"
                                                : "default"
                                        }
                                    />
                                }
                            />

                            <Divider />

                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        display: "-webkit-box",
                                        overflow: "hidden",
                                        WebkitLineClamp: 4,
                                        WebkitBoxOrient: "vertical",
                                    }}
                                >
                                    {post.content}
                                </Typography>
                            </CardContent>

                            <Divider />

                            <Box
                                sx={{
                                    px: 2,
                                    py: 1.5,
                                    bgcolor: "grey.50",
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    display="block"
                                >
                                    Created: {formatDate(post.createdAt)}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    display="block"
                                >
                                    Updated: {formatDate(post.updatedAt)}
                                </Typography>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<DeleteIcon />}
                                    sx={{ marginTop: 2 }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setDeletePostId(post.id);
                                        setDeleteDialog(true);
                                    }}
                                >
                                    Delete
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    startIcon={<EditIcon />}
                                    sx={{ marginTop: 2, marginLeft: 2 }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`post/edit/${post.id}`);
                                    }}
                                >
                                    Edit
                                </Button>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
                <DialogTitle>Delete Post?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        This action cannot be undone. Are you sure you want to
                        delete this post?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialog(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDeletePost()}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={deleteSuccess}
                autoHideDuration={3000}
                onClose={() => setDeleteSuccess(false)}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert
                    onClose={() => setDeleteSuccess(false)}
                    severity="success"
                    variant="filled"
                >
                    Post berhasil dihapus
                </Alert>
            </Snackbar>
        </Container>
    );
}
