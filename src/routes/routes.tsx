import { createBrowserRouter } from "react-router";
import MainLayout from "@/layouts/MainLayout";
import NotFound from "@/pages/NotFound";
import ComingSoonPage from "@/pages/ComingSoonPage";
import Dashboard from "@/features/homepage/Dashboard";

const routes = [
    {
        path: "/",
        element: <MainLayout />,
        errorElement: <NotFound />,
        children: [
            { index: true, element: <Dashboard /> },
            { path: "*", element: <NotFound /> },
            {
                path: "coming-soon",
                children: [
                    { path: "*", element: <NotFound /> },
                    {
                        index: true,
                        element: <ComingSoonPage featureName="Coming Soon" />,
                    },
                ],
            },
            {
                path: "emission",
                children: [
                    { path: "*", element: <NotFound /> },
                    {
                        index: true,
                        element: <ComingSoonPage featureName="Emission" />,
                    },
                ],
            },
            {
                path: "performance",
                children: [
                    { path: "*", element: <NotFound /> },
                    {
                        path: "daily-reporting",
                        element: <ComingSoonPage featureName="Daily Reporting" />,
                    },
                    {
                        index: true,
                        element: <ComingSoonPage featureName="Performance" />,
                    },
                ],
            },
        ],
    },
];

const router = createBrowserRouter(routes);

export { routes };
export default router;
