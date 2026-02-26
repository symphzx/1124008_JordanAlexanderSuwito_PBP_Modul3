import { Toolbar, AppBar, Button, Box, Stack, Avatar } from "@mui/material";
import type { PropsWithChildren } from "react";
import { useAppSelector } from "../hooks/useAppSelector";
import { Link } from "react-router";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { authActions } from "../store/authSlice";

export function Layout(props: PropsWithChildren) {
    const userInfo = useAppSelector((state) => state.auth.userInfo);
    const dispatch = useAppDispatch();

    function stringToColor(string: string) {
        let hash = 0;
        let i;

        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color = "#";

        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }

        return color;
    }

    function getInitials(name: string) {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    }

    return (
        <Stack>
            <AppBar position="static">
                <Toolbar>
                    <Box flex={1}></Box>

                    <Box
                        flex={1}
                        display="flex"
                        justifyContent="center"
                        gap={2}
                    >
                        {userInfo && (
                            <>
                                <Button color="inherit" component={Link} to="/">
                                    Home
                                </Button>

                                <Button
                                    color="inherit"
                                    component={Link}
                                    to="/post"
                                >
                                    Post List
                                </Button>

                                <Button
                                    variant="contained"
                                    color="secondary"
                                    component={Link}
                                    to="/post/create"
                                >
                                    Create Post
                                </Button>
                            </>
                        )}
                    </Box>


                    <Box
                        flex={1}
                        display="flex"
                        justifyContent="flex-end"
                        gap={2}
                    >
                        {!userInfo && (
                            <Button
                                variant="contained"
                                color="secondary"
                                component={Link}
                                to="/login"
                            >
                                Login
                            </Button>
                        )}

                        {userInfo && (
                            <>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <Avatar
                                        sx={{
                                            bgcolor: stringToColor(
                                                userInfo.user.name,
                                            ),
                                            color: "#fff",
                                            fontWeight: 600,
                                            width: 36,
                                            height: 36,
                                        }}
                                    >
                                        {getInitials(userInfo.user.name)}
                                    </Avatar>

                                    <Button
                                        color="inherit"
                                        sx={{ textTransform: "none" }}
                                    >
                                        {userInfo.user.name}
                                    </Button>
                                </Box>

                                <Button
                                    color="error"
                                    variant="contained"
                                    startIcon={<LogoutIcon />}
                                    onClick={() => {
                                        dispatch(
                                            authActions.setUserInfo(undefined),
                                        );
                                    }}
                                >
                                    Logout
                                </Button>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>
            {props.children}
        </Stack>
    );
}
