import { useState } from "react";
import { isEmail } from "./utils/isEmail";
import { PostList } from "./pages/PostsList";
import "./App.css";

function App() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(false);
    const logout = () => {
        setIsLogin(false);
        setEmail("");
        setPassword("");
    };

    const handleLogin = async () => {
        if (!isEmail(email)) {
            alert("Email is not valid");
            return;
        }
        // if(password.length < 6) {
        //   alert("Password must be at least 6 characters");
        //   return
        // }
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
        alert(`Logging in for ${email}`);
        setIsLogin(true);
    };

    return <PostList></PostList>;

    if (isLogin) {
        return (
            <div>
                <div>Hello, {email}</div>
                <PostList />
                <div>
                    <button onClick={logout}>Logout</button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h2>Login</h2>
            <div>
                <p>Email</p>
                <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div>
                <p>Password</p>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <br />
            <button onClick={handleLogin}>Login</button>
            <br />
            <br />
            <div>Email: {email}</div>
            <div>Password: {password}</div>
        </div>
    );
}

export default App;
