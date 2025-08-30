import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Overview } from "./pages/overview";
import { DailyReportingSection } from "./pages/submitReport";
import { useLocation, useNavigate } from "react-router";
import { Voyages } from "./pages/voyages";
import { ReportsLog } from "./pages/reportsLog";

export default function DailyReporting() {
    const location = useLocation();
    const navigate = useNavigate();

    // Get initial tab from URL hash or default to overview
    const getInitialTab = () => {
        const hash = location.hash.replace("#", "");
        const validTabs = ["overview", "voyages", "daily-reporting", "logs"];
        return validTabs.includes(hash) ? hash : "overview";
    };

    const [activeTab, setActiveTab] = useState(getInitialTab());

    // Update URL hash when tab changes
    const handleTabChange = (value: string) => {
        setActiveTab(value);
        navigate(`#${value}`, { replace: true });
    };

    // Listen for hash changes (back/forward navigation)
    useEffect(() => {
        const handleHashChange = () => {
            const newTab = getInitialTab();
            setActiveTab(newTab);
        };

        window.addEventListener("hashchange", handleHashChange);
        return () => window.removeEventListener("hashchange", handleHashChange);
    });
    return (
        <div className="container mx-auto px-4 py-6 space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-foreground">Voyage Management</h1>
                <p className="text-muted-foreground">
                    Monitor vessel operations, submit daily reports, and track performance metrics
                </p>
            </div>

            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-4 h-13">
                    <TabsTrigger className="h-10 rounded-l ml-1" value="overview">
                        Overview
                    </TabsTrigger>
                    <TabsTrigger className="h-10 rounded-l" value="voyages">
                        Voyages
                    </TabsTrigger>
                    <TabsTrigger className="h-10 rounded-l" value="daily-reporting">
                        Daily Reporting
                    </TabsTrigger>
                    <TabsTrigger className="h-10 rounded-l mr-1" value="logs">
                        Anomalies & Logs
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                    <Overview />
                </TabsContent>

                <TabsContent value="voyages" className="mt-6">
                    <Voyages />
                </TabsContent>

                <TabsContent value="daily-reporting" className="mt-6">
                    <DailyReportingSection />
                </TabsContent>

                <TabsContent value="logs" className="mt-6">
                    <ReportsLog />
                </TabsContent>
            </Tabs>
        </div>
    );
}
