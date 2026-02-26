import { useCallback, useEffect, useMemo, useState } from "react";
// import "../../App.css";
// import "./PostsList.css";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Avatar, Box, Button, CardHeader, Chip, Container, Divider, Grid, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router";

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

type SortKey = "title" | "userName" | "createdAt"

export default function PostList() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [sortBy, setSortBy] = useState<SortKey | undefined>();
    const [isSortAscending, setSortAscending] = useState<boolean>(true);
    const [search, setSearch] = useState<string>("");
    const navigate = useNavigate();
    const goToPost = (id: string) => {
        navigate(`/post/${id}`);
    };

    const filteredPosts = useMemo(() => {
        if (!search.trim()) {
            return posts;
        }
        const lowerCaseSearch = search.toLowerCase();

        return posts.filter(
            (post) =>
                post.title.toLowerCase().includes(lowerCaseSearch) ||
                post.content.toLowerCase().includes(lowerCaseSearch) ||
                post.user.name.toLowerCase().includes(lowerCaseSearch),
        );
    }, [posts, search]);

    const sortedPosts = useMemo(() => {
        if (sortBy === undefined) {
            return filteredPosts;
        }
        const result = [...filteredPosts];
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
    }, [filteredPosts, sortBy, isSortAscending]);


    const reloadPosts = useCallback(async () => {
        const response = await fetch("http://localhost:5173/api/post");
        if (response.status != 200) {
            alert("Failed to reload post");
            return;
        }
        const data = await response.json();

        setPosts(data.records);
    }, []);

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
                Post List
            </Typography>

            <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                alignItems="center"
                mb={4}
            >
                <TextField
                    fullWidth
                    label="Search post by title, content, or user name"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

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
                            onClick={() => goToPost(post.id)}
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
                            {/* Header */}
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

                            {/* Body */}
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

                            {/* Footer */}
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
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
