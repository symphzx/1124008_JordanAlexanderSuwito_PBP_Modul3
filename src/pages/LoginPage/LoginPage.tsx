import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { Button, TextField, Typography } from "@mui/material";
import {
    Snackbar,
    Alert,
    AlertTitle,
    Slide,
    type SlideProps,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useState } from "react";
import { isEmail } from "../../utils/isEmail";
import { authActions } from "../../store/authSlice";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useNavigate } from "react-router";

export default function LoginPage() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [openSuccess, setOpenSuccess] = useState(false);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleLogin = async () => {
        if (!isEmail(email)) {
            alert("Email is not valid");
            return;
        }
        if (password.length < 6) {
            alert("Password must be at least 6 characters");
            return;
        }
        const response = await fetch("http://localhost:5173/api/auth/login", {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
                email,
                password,
            }),
        });
        if (response.status != 200) {
            const data = await response.json();
            alert(`Login failed for ${email}` + data);
            return;
        }

        setOpenSuccess(true);

        setTimeout(async () => {
            await setUserInfo();
            navigate("/");
        }, 1000);

    };

    function SlideTransition(props: SlideProps) {
        return <Slide {...props} direction="down" />;
    }

    const setUserInfo = async () => {
        const response = await fetch("http://localhost:5173/api/auth/me", {
            headers: {
                "Content-Type": "application/json",
            },
            method: "GET",
        });
        const data = await response.json();
        dispatch(authActions.setUserInfo(data));
    };

    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    "& > :not(style)": {
                        m: 1,
                        width: 600,
                        height: 600,
                    },
                }}
            >
                <Paper
                    elevation={16}
                    sx={{
                        width: 300,
                        height: 300,
                    }}
                >
                    <Typography
                        variant="h3"
                        sx={{
                            alignItems: "center",
                            display: "flex",
                            justifyContent: "center",
                            m: 3,
                            mb: 10,
                        }}
                    >
                        Login
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            alignItems: "left",
                            display: "flex",
                            justifyContent: "left",
                            m: 3,
                        }}
                    >
                        Email
                    </Typography>

                    <TextField
                        id="outlined-basic"
                        label="Enter Email"
                        variant="outlined"
                        type="email"
                        sx={{
                            alignItems: "left",
                            display: "flex",
                            justifyContent: "left",
                            m: 3,
                        }}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Typography
                        variant="h6"
                        sx={{
                            alignItems: "left",
                            display: "flex",
                            justifyContent: "left",
                            m: 3,
                        }}
                    >
                        Password
                    </Typography>
                    <TextField
                        id="outlined-basic"
                        label="Enter Password"
                        variant="outlined"
                        type="password"
                        sx={{
                            alignItems: "left",
                            display: "flex",
                            justifyContent: "left",
                            m: 3,
                        }}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Button
                            variant="contained"
                            sx={{ m: 3, mt: 5, width: 200, fontSize: 20 }}
                            onClick={handleLogin}
                        >
                            Login
                        </Button>
                    </div>
                </Paper>
            </Box>

            <Snackbar
                open={openSuccess}
                autoHideDuration={2000}
                onClose={async () => {
                    setOpenSuccess(false);
                }}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                TransitionComponent={SlideTransition}
            >
                <Alert
                    severity="success"
                    variant="filled"
                    icon={<CheckCircleOutlineIcon fontSize="inherit" />}
                    sx={{
                        width: "100%",
                        boxShadow: 6,
                        borderRadius: 3,
                        fontSize: 16,
                    }}
                >
                    <AlertTitle sx={{ fontWeight: "bold" }}>
                        Login Successful 🚀
                    </AlertTitle>
                    Welcome back, <b>{email}</b>
                </Alert>
            </Snackbar>
        </div>
    );
}
