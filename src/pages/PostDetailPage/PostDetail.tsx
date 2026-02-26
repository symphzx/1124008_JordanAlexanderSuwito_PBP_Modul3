import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Chip,
    Container,
    Divider,
    Stack,
    Typography,
} from "@mui/material";

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
    userID: string;
};

export default function PostDetail() {
    const { id } = useParams();
    const [post, setPost] = useState<Post>();
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            const response = await fetch(`/api/post/${id}`);

            if (!response.ok) {
                setNotFound(true);
                setLoading(false);
                return;
            }

            const data = await response.json();
            setPost(data);
            setLoading(false);
        };
        fetchPost();
    }, [id]);

    useEffect(() => {
        if (notFound) {
            const timer = setTimeout(() => {
                navigate("/post");
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [notFound, navigate]);

    if (loading) {
        return (
            <Container maxWidth="sm" sx={{ mt: 6 }}>
                <Alert severity="info" variant="filled">
                    Loading...
                </Alert>
            </Container>
        );
    }

    if (notFound || !post) {
        return (
            <Container maxWidth="sm" sx={{ mt: 6 }}>
                <Alert severity="error" variant="filled">
                    Post not found. Redirecting...
                </Alert>
            </Container>
        );
    }

    const back = () => {
        navigate(-1);
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

    const getInitials = (name: string) =>
        name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);

    return (
        <Container maxWidth="md" sx={{ mt: 6, mb: 8 }}>
            <Card
                sx={{
                    borderRadius: 4,
                    boxShadow: 4,
                }}
            >
                <CardHeader
                    avatar={
                        <Avatar
                            sx={{
                                bgcolor: "primary.main",
                                fontWeight: 600,
                            }}
                        >
                            {getInitials(post.user.name)}
                        </Avatar>
                    }
                    title={
                        <Typography variant="h4" fontWeight={600}>
                            {post.title}
                        </Typography>
                    }
                    subheader={`By ${post.user.name}`}
                    action={
                        <Chip
                            label={post.status}
                            color={
                                post.status === "published"
                                    ? "success"
                                    : "default"
                            }
                            variant="outlined"
                        />
                    }
                />

                <Divider />

                <CardContent>
                    <Typography
                        variant="body1"
                        sx={{
                            whiteSpace: "pre-line",
                            lineHeight: 1.8,
                            fontSize: "1.05rem",
                        }}
                    >
                        {post.content}
                    </Typography>

                    <Box mt={4}>
                        <Typography variant="caption" color="text.secondary">
                            Created: {formatDate(post.createdAt)}
                        </Typography>
                        <br />
                        <Typography variant="caption" color="text.secondary">
                            Updated: {formatDate(post.updatedAt)}
                        </Typography>
                    </Box>
                </CardContent>
            </Card>

            <Stack direction="row" justifyContent="flex-end" mt={4}>
                <Button variant="contained" size="large" onClick={back}>
                    Back
                </Button>
            </Stack>
        </Container>
    );
}
