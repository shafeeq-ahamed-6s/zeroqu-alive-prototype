import { createBrowserRouter } from "react-router";
import MainLayout from "@/layouts/MainLayout";
import NotFound from "@/pages/NotFound";
import HomePage from "@/pages/HomePage";
import ComingSoonPage from "@/pages/ComingSoonPage";

const routes = [
    {
        path: "/",
        element: <MainLayout />,
        errorElement: <NotFound />,
        children: [
            { index: true, element: <HomePage /> },
            { path: "*", element: <NotFound /> },
            {
                path: "coming-soon",
                children: [
                    { path: "*", element: <NotFound /> },
                    {
                        index: true,
                        element: <ComingSoonPage />,
                    },
                ],
            },
        ],
    },
];

const router = createBrowserRouter(routes);

export { routes };
export default router;
