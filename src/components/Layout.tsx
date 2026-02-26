import { Toolbar, AppBar, Button, Box, Stack } from "@mui/material";
import type { PropsWithChildren } from "react";
import { useAppSelector } from "../hooks/useAppSelector";
import { Link } from "react-router";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { authActions } from "../store/authSlice";

export function Layout(props: PropsWithChildren) {
    const userInfo = useAppSelector((state) => state.auth.userInfo);
    const dispatch = useAppDispatch();

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

                    {/* RIGHT SIDE */}
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
                                <Button
                                    color="inherit"
                                    sx={{ textTransform: "none" }}
                                >
                                    {userInfo.user.name}
                                </Button>

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
