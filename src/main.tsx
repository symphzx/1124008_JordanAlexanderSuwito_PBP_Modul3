// import { ThemeProvider } from "@emotion/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
// import { TestUi } from "./TestUi.tsx";
// import './index.css'
// import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { store } from "./redux/store";
import { CssBaseline } from "@mui/material";
import { AppRoutes } from "./config/AppRoutes";
import { Layout } from "./components/Layout";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <CssBaseline />
        {/* <ThemeProvider theme={{theme}}> */}
        <Provider store={store}>
            <BrowserRouter>
                <Layout>
                    <AppRoutes />
                </Layout>
            </BrowserRouter>
        </Provider>
    </StrictMode>,
);
