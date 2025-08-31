import { Leaf, TrendingDown, AlertCircle, Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmissionTrendsChart } from "../components/EmissionTrendsChart";

export function Overview() {
    const summaryCards = [
        {
            title: "Fleet CII Rating",
            value: "B",
            subtitle: "Average rating",
            icon: Target,
            color: "bg-green-500/10 border-green-500/20",
            iconColor: "text-green-500",
            trend: "Improved from C last quarter",
        },
        {
            title: "Total CO₂ Emissions",
            value: "2,847",
            subtitle: "MT this month",
            icon: Leaf,
            color: "bg-blue-500/10 border-blue-500/20",
            iconColor: "text-blue-500",
            trend: "-12.4% vs last month",
        },
        {
            title: "EU ETS Compliance",
            value: "94%",
            subtitle: "Fleet compliance",
            icon: TrendingDown,
            color: "bg-purple-500/10 border-purple-500/20",
            iconColor: "text-purple-500",
            trend: "+3% improvement",
        },
        {
            title: "Vessels at Risk",
            value: "2",
            subtitle: "CII threshold risk",
            icon: AlertCircle,
            color: "bg-orange-500/10 border-orange-500/20",
            iconColor: "text-orange-500",
            trend: "MV Aurora, MV Phoenix",
        },
    ];

    const fleetStatus = [
        { vessel: "MV Aurora", cii: "C", emissions: 342, status: "At Risk", trend: "↗️" },
        { vessel: "MV Vega", cii: "A", emissions: 287, status: "Excellent", trend: "↘️" },
        { vessel: "MV Orion", cii: "B", emissions: 298, status: "Good", trend: "→" },
        { vessel: "MV Phoenix", cii: "C", emissions: 356, status: "At Risk", trend: "↗️" },
        { vessel: "MV Titan", cii: "B", emissions: 312, status: "Good", trend: "↘️" },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Excellent":
                return "text-green-500 bg-green-500/10";
            case "Good":
                return "text-blue-500 bg-blue-500/10";
            case "At Risk":
                return "text-orange-500 bg-orange-500/10";
            default:
                return "text-muted-foreground bg-muted/10";
        }
    };

    const getCIIColor = (cii: string) => {
        switch (cii) {
            case "A":
                return "text-green-600 bg-green-100 border-green-200";
            case "B":
                return "text-blue-600 bg-blue-100 border-blue-200";
            case "C":
                return "text-orange-600 bg-orange-100 border-orange-200";
            case "D":
                return "text-red-600 bg-red-100 border-red-200";
            case "E":
                return "text-red-800 bg-red-200 border-red-300";
            default:
                return "text-muted-foreground bg-muted border-border";
        }
    };

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {summaryCards.map((card, index) => (
                    <div
                        key={index}
                        className={`p-6 rounded-xl border ${card.color} hover:scale-105 transition-all duration-300`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <div
                                        className={`p-2 rounded-lg ${card.iconColor} bg-current/10`}
                                    >
                                        <card.icon className={`h-5 w-5 ${card.iconColor}`} />
                                    </div>
                                    <h3 className="font-medium text-card-foreground text-sm">
                                        {card.title}
                                    </h3>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-baseline space-x-2">
                                        <span className="text-2xl font-bold text-card-foreground">
                                            {card.value}
                                        </span>
                                        <span className="text-sm text-muted-foreground">
                                            {card.subtitle}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{card.trend}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts and Fleet Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Emission Trends Chart */}
                <div className="lg:col-span-2">
                    <EmissionTrendsChart />
                </div>

                {/* Fleet Status */}
                <Card>
                    <CardHeader>
                        <CardTitle>Fleet Status</CardTitle>
                        <CardDescription>Current CII ratings and emission levels</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {fleetStatus.map((vessel, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/5 transition-colors"
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center space-x-2">
                                            <span className="font-medium text-card-foreground">
                                                {vessel.vessel}
                                            </span>
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-bold border ${getCIIColor(vessel.cii)}`}
                                            >
                                                {vessel.cii}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-3 text-sm">
                                            <span className="text-muted-foreground">
                                                {vessel.emissions} MT CO₂
                                            </span>
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vessel.status)}`}
                                            >
                                                {vessel.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-lg">{vessel.trend}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}