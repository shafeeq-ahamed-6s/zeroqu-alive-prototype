import { useState } from "react";
import {
    AlertTriangle,
    Eye,
    CheckCircle,
    XCircle,
    FileText,
    ChevronDown,
    Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";

interface Anomaly {
    id: string;
    vesselId: string;
    voyageId: string;
    type: "Fuel Consumption" | "Speed" | "Emissions" | "Engine Performance" | "Route Deviation";
    severity: "High" | "Medium" | "Low";
    detectedAt: string;
    description: string;
    expectedValue: string;
    actualValue: string;
    deviation: number;
    status: "New" | "Under Review" | "Resolved" | "False Positive";
    assignedTo?: string;
    notes?: string;
}

interface Report {
    id: string;
    vesselId: string;
    route: string;
    date: string;
    fuelConsumption: number;
    co2Emissions: number;
    status: "Normal" | "Outlier" | "Pending";
    submittedBy: string;
    submittedAt: string;
}

export function ReportsLog() {
    const [openSections, setOpenSections] = useState({
        anomalies: false,
        reportsLog: false,
    });

    const toggleSection = (section: keyof typeof openSections) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const [anomalies] = useState<Anomaly[]>([
        {
            id: "ANO-001",
            vesselId: "MV Aurora",
            voyageId: "VOY-2025-001",
            type: "Fuel Consumption",
            severity: "High",
            detectedAt: "2025-01-15T14:30:00Z",
            description:
                "Fuel consumption 35% above expected range during normal weather conditions",
            expectedValue: "22-26 MT/day",
            actualValue: "35.2 MT/day",
            deviation: 35.4,
            status: "New",
            assignedTo: "Chief Engineer",
        },
        {
            id: "ANO-002",
            vesselId: "MV Vega",
            voyageId: "VOY-2025-002",
            type: "Engine Performance",
            severity: "High",
            detectedAt: "2025-01-14T09:15:00Z",
            description:
                "Main engine efficiency dropped significantly below normal operating parameters",
            expectedValue: "85-92%",
            actualValue: "68%",
            deviation: -22.4,
            status: "Under Review",
            assignedTo: "Fleet Manager",
            notes: "Scheduled for maintenance at next port",
        },
        {
            id: "ANO-003",
            vesselId: "MV Orion",
            voyageId: "VOY-2024-045",
            type: "Speed",
            severity: "Medium",
            detectedAt: "2025-01-13T16:45:00Z",
            description: "Average speed consistently below optimal range for current route",
            expectedValue: "18-22 knots",
            actualValue: "14.2 knots",
            deviation: -21.1,
            status: "Resolved",
            assignedTo: "Navigation Officer",
            notes: "Weather conditions caused temporary speed reduction",
        },
        {
            id: "ANO-004",
            vesselId: "MV Phoenix",
            voyageId: "VOY-2025-003",
            type: "Route Deviation",
            severity: "Medium",
            detectedAt: "2025-01-12T11:20:00Z",
            description: "Vessel deviated from planned route by more than 50 nautical miles",
            expectedValue: "±25 nm from planned route",
            actualValue: "78 nm deviation",
            deviation: 212.0,
            status: "Under Review",
            assignedTo: "Captain",
        },
        {
            id: "ANO-005",
            vesselId: "MV Titan",
            voyageId: "VOY-2024-089",
            type: "Emissions",
            severity: "Low",
            detectedAt: "2025-01-11T08:30:00Z",
            description: "CO₂ emissions slightly above expected range for current cargo load",
            expectedValue: "75-85 MT/day",
            actualValue: "89.3 MT/day",
            deviation: 5.1,
            status: "False Positive",
            assignedTo: "Environmental Officer",
            notes: "Within acceptable variance for heavy cargo load",
        },
    ]);

    const [reports] = useState<Report[]>([
        {
            id: "RPT-001",
            vesselId: "MV Aurora",
            route: "Rotterdam - Singapore",
            date: "2024-01-15",
            fuelConsumption: 28.5,
            co2Emissions: 89.2,
            status: "Outlier",
            submittedBy: "Capt. Johnson",
            submittedAt: "2024-01-15 14:30",
        },
        {
            id: "RPT-002",
            vesselId: "MV Orion",
            route: "Hamburg - New York",
            date: "2024-01-15",
            fuelConsumption: 22.1,
            co2Emissions: 69.8,
            status: "Normal",
            submittedBy: "Capt. Smith",
            submittedAt: "2024-01-15 16:45",
        },
        {
            id: "RPT-003",
            vesselId: "MV Phoenix",
            route: "Shanghai - Los Angeles",
            date: "2024-01-14",
            fuelConsumption: 25.3,
            co2Emissions: 79.1,
            status: "Normal",
            submittedBy: "Capt. Chen",
            submittedAt: "2024-01-14 18:20",
        },
        {
            id: "RPT-004",
            vesselId: "MV Vega",
            route: "Dubai - Mumbai",
            date: "2024-01-14",
            fuelConsumption: 31.2,
            co2Emissions: 98.7,
            status: "Outlier",
            submittedBy: "Capt. Patel",
            submittedAt: "2024-01-14 12:15",
        },
        {
            id: "RPT-005",
            vesselId: "MV Titan",
            route: "London - Boston",
            date: "2024-01-13",
            fuelConsumption: 19.8,
            co2Emissions: 62.4,
            status: "Normal",
            submittedBy: "Capt. Williams",
            submittedAt: "2024-01-13 20:30",
        },
        {
            id: "RPT-006",
            vesselId: "MV Odyssey",
            route: "Tokyo - Vancouver",
            date: "2024-01-13",
            fuelConsumption: 26.9,
            co2Emissions: 84.3,
            status: "Pending",
            submittedBy: "Capt. Tanaka",
            submittedAt: "2024-01-13 09:45",
        },
    ]);

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case "High":
                return "bg-destructive/10 text-destructive border-destructive/20";
            case "Medium":
                return "bg-orange-500/10 text-orange-500 border-orange-500/20";
            case "Low":
                return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
            default:
                return "bg-muted/10 text-muted-foreground border-muted/20";
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "New":
                return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            case "Under Review":
                return "bg-orange-500/10 text-orange-500 border-orange-500/20";
            case "Resolved":
                return "bg-green-500/10 text-green-500 border-green-500/20";
            case "False Positive":
                return "bg-gray-500/10 text-gray-500 border-gray-500/20";
            case "Outlier":
                return "bg-destructive/10 text-destructive border-destructive/20";
            case "Normal":
                return "bg-green-500/10 text-green-500 border-green-500/20";
            case "Pending":
                return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
            default:
                return "bg-muted/10 text-muted-foreground border-muted/20";
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "Fuel Consumption":
                return "🛢️";
            case "Speed":
                return "⚡";
            case "Emissions":
                return "🌱";
            case "Engine Performance":
                return "⚙️";
            case "Route Deviation":
                return "🗺️";
            default:
                return "⚠️";
        }
    };

    const handleAnomalyAction = (anomalyId: string, action: string) => {
        switch (action) {
            case "review":
                toast.info("Anomaly marked for review", {
                    description: `${anomalyId} has been assigned for detailed review`,
                });
                break;
            case "false":
                toast.success("Marked as false positive", {
                    description: `${anomalyId} has been marked as a false positive`,
                });
                break;
            case "suggest":
                toast.info("AI suggestions generated", {
                    description: `Recommended actions have been generated for ${anomalyId}`,
                });
                break;
            case "report":
                toast.success("Report generated", {
                    description: `Detailed report created for ${anomalyId}`,
                });
                break;
        }
    };

    // Calculate anomaly stats
    const anomalyStats = {
        total: anomalies.length,
        new: anomalies.filter(a => a.status === "New").length,
        underReview: anomalies.filter(a => a.status === "Under Review").length,
        high: anomalies.filter(a => a.severity === "High").length,
        needsAttention: anomalies.filter(
            a => a.status === "New" || (a.status === "Under Review" && a.severity === "High")
        ).length,
        mostRecent:
            anomalies.length > 0
                ? new Date(Math.max(...anomalies.map(a => new Date(a.detectedAt).getTime())))
                : null,
    };

    // Calculate report stats
    const reportStats = {
        total: reports.length,
        outliers: reports.filter(r => r.status === "Outlier").length,
        normal: reports.filter(r => r.status === "Normal").length,
        pending: reports.filter(r => r.status === "Pending").length,
        mostRecent:
            reports.length > 0
                ? new Date(Math.max(...reports.map(r => new Date(r.submittedAt).getTime())))
                : null,
    };

    return (
        <div className="space-y-6">
            {/* Anomalies Section */}
            <Collapsible
                open={openSections.anomalies}
                onOpenChange={() => toggleSection("anomalies")}
            >
                <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between p-6 bg-card rounded-xl border border-border hover:bg-accent/5 hover:scale-[1.01] transition-all duration-200 group">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-destructive/10 rounded-lg">
                                <AlertTriangle className="h-6 w-6 text-destructive" />
                            </div>
                            <div className="text-left">
                                <h2 className="text-xl font-semibold text-card-foreground flex items-center">
                                    Anomalies Detection
                                    {!openSections.anomalies && (
                                        <span className="ml-2 text-sm text-muted-foreground/70 group-hover:text-muted-foreground transition-colors">
                                            (Click to expand)
                                        </span>
                                    )}
                                </h2>
                                <div className="flex items-center space-x-4 mt-1">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
                                        <span className="text-sm text-muted-foreground">
                                            {anomalyStats.needsAttention} need attention
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Clock className="h-3 w-3 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">
                                            Last:{" "}
                                            {anomalyStats.mostRecent?.toLocaleDateString() || "N/A"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Status Counts */}
                            <div className="flex items-center space-x-3">
                                <div className="text-center">
                                    <div className="text-lg font-bold text-destructive">
                                        {anomalyStats.high}
                                    </div>
                                    <div className="text-xs text-muted-foreground">High</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-bold text-blue-500">
                                        {anomalyStats.new}
                                    </div>
                                    <div className="text-xs text-muted-foreground">New</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-bold text-orange-500">
                                        {anomalyStats.underReview}
                                    </div>
                                    <div className="text-xs text-muted-foreground">Review</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-bold text-card-foreground">
                                        {anomalyStats.total}
                                    </div>
                                    <div className="text-xs text-muted-foreground">Total</div>
                                </div>
                            </div>

                            <ChevronDown
                                className={`h-5 w-5 text-card-foreground transition-transform ${openSections.anomalies ? "rotate-180" : ""}`}
                            />
                        </div>
                    </div>
                </CollapsibleTrigger>

                <CollapsibleContent className="mt-4">
                    <div className="space-y-6">
                        {/* Anomalies List */}
                        <div className="space-y-4">
                            {anomalies.map(anomaly => (
                                <div
                                    key={anomaly.id}
                                    className={`bg-card rounded-xl border p-6 ${anomaly.severity === "High" ? "border-destructive/30 bg-destructive/5" : anomaly.severity === "Medium" ? "border-orange-500/30 bg-orange-500/5" : "border-border"}`}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-start space-x-4">
                                            <div className="text-2xl">
                                                {getTypeIcon(anomaly.type)}
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center space-x-3">
                                                    <h3 className="text-lg font-semibold text-card-foreground">
                                                        {anomaly.type} Anomaly
                                                    </h3>
                                                    <span
                                                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(anomaly.severity)}`}
                                                    >
                                                        {anomaly.severity} Severity
                                                    </span>
                                                    <span
                                                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(anomaly.status)}`}
                                                    >
                                                        {anomaly.status}
                                                    </span>
                                                </div>

                                                <div className="text-sm space-y-1">
                                                    <p className="text-card-foreground">
                                                        {anomaly.description}
                                                    </p>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                                                        <div>
                                                            <span className="text-muted-foreground">
                                                                Expected:
                                                            </span>
                                                            <span className="text-card-foreground ml-2 font-medium">
                                                                {anomaly.expectedValue}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="text-muted-foreground">
                                                                Actual:
                                                            </span>
                                                            <span className="text-card-foreground ml-2 font-medium">
                                                                {anomaly.actualValue}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="text-muted-foreground">
                                                                Vessel:
                                                            </span>
                                                            <span className="text-card-foreground ml-2">
                                                                {anomaly.vesselId}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="text-muted-foreground">
                                                                Voyage:
                                                            </span>
                                                            <span className="text-card-foreground ml-2">
                                                                {anomaly.voyageId}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="text-muted-foreground">
                                                                Detected:
                                                            </span>
                                                            <span className="text-card-foreground ml-2">
                                                                {new Date(
                                                                    anomaly.detectedAt
                                                                ).toLocaleString()}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="text-muted-foreground">
                                                                Assigned to:
                                                            </span>
                                                            <span className="text-card-foreground ml-2">
                                                                {anomaly.assignedTo || "Unassigned"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {anomaly.notes && (
                                                        <div className="mt-3 p-3 bg-accent/10 rounded-lg">
                                                            <span className="text-muted-foreground text-xs">
                                                                Notes:
                                                            </span>
                                                            <p className="text-card-foreground text-sm mt-1">
                                                                {anomaly.notes}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col space-y-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    handleAnomalyAction(anomaly.id, "review")
                                                }
                                                className="flex items-center gap-2"
                                            >
                                                <Eye className="h-4 w-4" />
                                                Review
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    handleAnomalyAction(anomaly.id, "false")
                                                }
                                                className="flex items-center gap-2"
                                            >
                                                <XCircle className="h-4 w-4" />
                                                Mark False
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    handleAnomalyAction(anomaly.id, "suggest")
                                                }
                                                className="flex items-center gap-2"
                                            >
                                                <CheckCircle className="h-4 w-4" />
                                                Suggest Action
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    handleAnomalyAction(anomaly.id, "report")
                                                }
                                                className="flex items-center gap-2"
                                            >
                                                <FileText className="h-4 w-4" />
                                                Report
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {anomalies.length === 0 && (
                                <div className="bg-card rounded-xl border border-border p-8 text-center">
                                    <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-card-foreground mb-2">
                                        No Anomalies Found
                                    </h3>
                                    <p className="text-muted-foreground">
                                        No anomalies match your current filter criteria.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </CollapsibleContent>
            </Collapsible>

            {/* Reports Log Section */}
            <Collapsible
                open={openSections.reportsLog}
                onOpenChange={() => toggleSection("reportsLog")}
            >
                <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between p-6 bg-card rounded-xl border border-border hover:bg-accent/5 hover:scale-[1.01] transition-all duration-200 group">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-primary/10 rounded-lg">
                                <FileText className="h-6 w-6 text-primary" />
                            </div>
                            <div className="text-left">
                                <h2 className="text-xl font-semibold text-card-foreground flex items-center">
                                    Reports Log
                                    {!openSections.reportsLog && (
                                        <span className="ml-2 text-sm text-muted-foreground/70 group-hover:text-muted-foreground transition-colors">
                                            (Click to expand)
                                        </span>
                                    )}
                                </h2>
                                <div className="flex items-center space-x-4 mt-1">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-destructive rounded-full"></div>
                                        <span className="text-sm text-muted-foreground">
                                            {reportStats.outliers} outliers detected
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Clock className="h-3 w-3 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">
                                            Last:{" "}
                                            {reportStats.mostRecent?.toLocaleDateString() || "N/A"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Status Counts */}
                            <div className="flex items-center space-x-3">
                                <div className="text-center">
                                    <div className="text-lg font-bold text-destructive">
                                        {reportStats.outliers}
                                    </div>
                                    <div className="text-xs text-muted-foreground">Outliers</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-bold text-green-500">
                                        {reportStats.normal}
                                    </div>
                                    <div className="text-xs text-muted-foreground">Normal</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-bold text-yellow-500">
                                        {reportStats.pending}
                                    </div>
                                    <div className="text-xs text-muted-foreground">Pending</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-bold text-card-foreground">
                                        {reportStats.total}
                                    </div>
                                    <div className="text-xs text-muted-foreground">Total</div>
                                </div>
                            </div>

                            <ChevronDown
                                className={`h-5 w-5 text-card-foreground transition-transform ${openSections.reportsLog ? "rotate-180" : ""}`}
                            />
                        </div>
                    </div>
                </CollapsibleTrigger>

                <CollapsibleContent className="mt-4">
                    <div className="space-y-6">
                        {/* Reports Table */}
                        <div className="bg-card rounded-xl border border-border overflow-hidden">
                            <div className="p-6 border-b border-border">
                                <h3 className="text-lg font-semibold text-card-foreground">
                                    Reports History ({reports.length} reports)
                                </h3>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-accent/20">
                                        <tr>
                                            <th className="text-left p-4 text-sm font-medium text-card-foreground">
                                                Report ID
                                            </th>
                                            <th className="text-left p-4 text-sm font-medium text-card-foreground">
                                                Vessel
                                            </th>
                                            <th className="text-left p-4 text-sm font-medium text-card-foreground">
                                                Route
                                            </th>
                                            <th className="text-left p-4 text-sm font-medium text-card-foreground">
                                                Date
                                            </th>
                                            <th className="text-left p-4 text-sm font-medium text-card-foreground">
                                                Fuel (MT)
                                            </th>
                                            <th className="text-left p-4 text-sm font-medium text-card-foreground">
                                                CO₂ (MT)
                                            </th>
                                            <th className="text-left p-4 text-sm font-medium text-card-foreground">
                                                Status
                                            </th>
                                            <th className="text-left p-4 text-sm font-medium text-card-foreground">
                                                Submitted By
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reports.map(report => (
                                            <tr
                                                key={report.id}
                                                className={`border-b border-border hover:bg-accent/10 transition-colors ${
                                                    report.status === "Outlier"
                                                        ? "bg-destructive/5"
                                                        : ""
                                                }`}
                                            >
                                                <td className="p-4 text-sm text-card-foreground font-mono">
                                                    {report.id}
                                                </td>
                                                <td className="p-4 text-sm text-card-foreground font-medium">
                                                    {report.vesselId}
                                                </td>
                                                <td className="p-4 text-sm text-muted-foreground">
                                                    {report.route}
                                                </td>
                                                <td className="p-4 text-sm text-muted-foreground">
                                                    {new Date(report.date).toLocaleDateString()}
                                                </td>
                                                <td className="p-4 text-sm text-card-foreground">
                                                    {report.fuelConsumption}
                                                </td>
                                                <td className="p-4 text-sm text-card-foreground">
                                                    {report.co2Emissions}
                                                </td>
                                                <td className="p-4">
                                                    <span
                                                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}
                                                    >
                                                        {report.status === "Outlier" && (
                                                            <AlertTriangle className="h-3 w-3 mr-1" />
                                                        )}
                                                        {report.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-sm text-muted-foreground">
                                                    <div>
                                                        <div className="font-medium text-card-foreground">
                                                            {report.submittedBy}
                                                        </div>
                                                        <div className="text-xs">
                                                            {new Date(
                                                                report.submittedAt
                                                            ).toLocaleString()}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {reports.length === 0 && (
                                <div className="p-8 text-center">
                                    <p className="text-muted-foreground">
                                        No reports found for the selected date range.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
}
