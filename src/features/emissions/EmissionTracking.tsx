import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Overview } from "./pages/overview";
import { EmissionSimulation } from "./pages/emissionSimulation";
import { Reports } from "./pages/reports";
import { useLocation, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function EmissionTracking() {
    const location = useLocation();
    const navigate = useNavigate();

    // Get initial tab from URL hash or default to overview
    const getInitialTab = () => {
        const hash = location.hash.replace("#", "");
        const validTabs = ["overview", "simulation", "reports"];
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
            <div className="space-y-2 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Fleet Emissions</h1>
                    <p className="text-muted-foreground">
                        Monitor emission compliance, run simulations, and generate reports for regulatory requirements
                    </p>
                </div>
                {/* Header with Create Button */}
                <div className="flex flex-row items-center">
                    <Button
                        onClick={() => (window.location.href = "/emission#simulation")}
                        className="flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        New Simulation
                    </Button>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-3 h-13">
                    <TabsTrigger className="h-10 rounded-l ml-1" value="overview">
                        Overview
                    </TabsTrigger>
                    <TabsTrigger className="h-10 rounded-l" value="simulation">
                        Emission Simulation
                    </TabsTrigger>
                    <TabsTrigger className="h-10 rounded-l mr-1" value="reports">
                        Reports
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                    <Overview />
                </TabsContent>

                <TabsContent value="simulation" className="mt-6">
                    <EmissionSimulation />
                </TabsContent>

                <TabsContent value="reports" className="mt-6">
                    <Reports />
                </TabsContent>
            </Tabs>
        </div>
    );
}