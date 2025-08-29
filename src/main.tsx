import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@/lib/theme-provider.tsx";
import "@/styles/index.css";
import { RouterProvider } from "react-router";
import router from "./routes/routes.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider defaultTheme="dark" storageKey="dewdrop-ui-theme">
            <RouterProvider router={router} />
        </ThemeProvider>
    </StrictMode>
);
