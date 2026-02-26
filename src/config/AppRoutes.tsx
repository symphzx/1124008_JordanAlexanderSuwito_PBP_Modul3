import { lazy } from "react";
import { useAppSelector } from "../hooks/useAppSelector";
import { Route, Routes } from "react-router";

const HomePage = lazy(() => import("../pages/HomePage"));
const PostListPage = lazy(() => import("../pages/PostListPage/PostsList"));
const CreatePost = lazy(() => import("../pages/CreatePostPage/CreatePost"));
const EditPostPage = lazy(() => import("../pages/EditPostPage/EditPost"));
const PostDetailPage = lazy(() => import("../pages/PostDetailPage/PostDetail"));
const LoginPage = lazy(() => import("../pages/LoginPage/LoginPage"));

export const AppRoutes = () => {
    const { isLoading, userInfo } = useAppSelector((state) => state.auth);

    if (!userInfo) {
        return (
            <Routes>
                <Route path="/login" element={<LoginPage />} />
            </Routes>
        );
    }

    // if (isLoading || !userInfo){
    //     return null;
    // }

    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/post" element={<PostListPage />} />
            <Route path="/post/create" element={<CreatePost />} />
            <Route path="/post/:id" element={<PostDetailPage />} />
            <Route path="/post/edit/:id" element={<EditPostPage />} />
            {!userInfo && <Route path="/login" element={<LoginPage />} />}
        </Routes>
    );
};
