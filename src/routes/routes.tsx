import { createBrowserRouter } from "react-router";
import MainLayout from "@/layouts/MainLayout";
import NotFound from "@/pages/NotFound";
import ComingSoonPage from "@/pages/ComingSoonPage";
import Dashboard from "@/features/homepage/Dashboard";
import DailyReporting from "@/features/dailyReporting/DailyReporting";
import EmissionTracking from "@/features/emissions/EmissionTracking";

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
                        element: <EmissionTracking />,
                    },
                ],
            },
            {
                path: "performance",
                children: [
                    { path: "*", element: <NotFound /> },
                    {
                        path: "voyage-management",
                        element: <DailyReporting />,
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
