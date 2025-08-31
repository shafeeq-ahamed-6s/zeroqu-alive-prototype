import { useState } from "react";
import { FileText, Download, Eye, Calendar, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface EmissionReport {
    id: string;
    title: string;
    type: "CII" | "EU ETS" | "Fuel EU GHG" | "Comprehensive";
    vessel: string;
    period: string;
    generatedDate: string;
    status: "Draft" | "Final" | "Submitted";
    size: string;
    ciiRating?: string;
    co2Emissions: number;
    complianceStatus: "Compliant" | "Non-Compliant" | "At Risk";
}

export function Reports() {
    const [reports] = useState<EmissionReport[]>([
        {
            id: "RPT-CII-001",
            title: "Q4 2024 CII Assessment",
            type: "CII",
            vessel: "MV Aurora",
            period: "Q4 2024",
            generatedDate: "2025-01-15",
            status: "Final",
            size: "2.3 MB",
            ciiRating: "C",
            co2Emissions: 1247.5,
            complianceStatus: "At Risk",
        },
        {
            id: "RPT-ETS-002",
            title: "EU ETS Compliance Report",
            type: "EU ETS",
            vessel: "MV Vega",
            period: "2024",
            generatedDate: "2025-01-14",
            status: "Submitted",
            size: "1.8 MB",
            co2Emissions: 987.2,
            complianceStatus: "Compliant",
        },
        {
            id: "RPT-GHG-003",
            title: "Fuel EU GHG Analysis",
            type: "Fuel EU GHG",
            vessel: "MV Orion",
            period: "2024",
            generatedDate: "2025-01-13",
            status: "Final",
            size: "1.5 MB",
            co2Emissions: 1156.8,
            complianceStatus: "Compliant",
        },
        {
            id: "RPT-COMP-004",
            title: "Fleet Emission Overview",
            type: "Comprehensive",
            vessel: "All Vessels",
            period: "Q4 2024",
            generatedDate: "2025-01-12",
            status: "Draft",
            size: "4.7 MB",
            co2Emissions: 5234.1,
            complianceStatus: "Compliant",
        },
        {
            id: "RPT-CII-005",
            title: "CII Performance Review",
            type: "CII",
            vessel: "MV Phoenix",
            period: "Q4 2024",
            generatedDate: "2025-01-11",
            status: "Final",
            size: "2.1 MB",
            ciiRating: "B",
            co2Emissions: 1089.3,
            complianceStatus: "Compliant",
        },
        {
            id: "RPT-ETS-006",
            title: "EU ETS Quarterly Report",
            type: "EU ETS",
            vessel: "MV Titan",
            period: "Q4 2024",
            generatedDate: "2025-01-10",
            status: "Submitted",
            size: "1.9 MB",
            co2Emissions: 1345.7,
            complianceStatus: "Non-Compliant",
        },
    ]);

    const [filters, setFilters] = useState({
        type: "all",
        vessel: "all",
        status: "all",
        period: "all",
    });

    const [searchQuery, setSearchQuery] = useState("");

    const filteredReports = reports.filter(report => {
        const matchesSearch =
            report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            report.vessel.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filters.type === "all" || report.type === filters.type;
        const matchesVessel = filters.vessel === "all" || report.vessel === filters.vessel;
        const matchesStatus = filters.status === "all" || report.status === filters.status;
        const matchesPeriod = filters.period === "all" || report.period === filters.period;

        return matchesSearch && matchesType && matchesVessel && matchesStatus && matchesPeriod;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Final":
                return "bg-green-500/10 text-green-500 border-green-500/20";
            case "Draft":
                return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
            case "Submitted":
                return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            default:
                return "bg-muted/10 text-muted-foreground border-muted/20";
        }
    };

    const getComplianceColor = (status: string) => {
        switch (status) {
            case "Compliant":
                return "bg-green-500/10 text-green-500 border-green-500/20";
            case "At Risk":
                return "bg-orange-500/10 text-orange-500 border-orange-500/20";
            case "Non-Compliant":
                return "bg-destructive/10 text-destructive border-destructive/20";
            default:
                return "bg-muted/10 text-muted-foreground border-muted/20";
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case "CII":
                return "bg-blue-500/10 text-blue-500";
            case "EU ETS":
                return "bg-purple-500/10 text-purple-500";
            case "Fuel EU GHG":
                return "bg-green-500/10 text-green-500";
            case "Comprehensive":
                return "bg-orange-500/10 text-orange-500";
            default:
                return "bg-muted/10 text-muted-foreground";
        }
    };

    const handleDownload = (reportId: string) => {
        toast.success("Download started", {
            description: `Report ${reportId} is being downloaded`,
        });
    };

    const handleView = (reportId: string) => {
        toast.info("Opening report", {
            description: `Report ${reportId} is being opened`,
        });
    };

    const generateNewReport = () => {
        toast.success("Report generation started", {
            description: "Your new emission report is being generated",
        });
    };

    const uniqueVessels = [...new Set(reports.map(r => r.vessel))];
    const uniquePeriods = [...new Set(reports.map(r => r.period))];

    return (
        <div className="space-y-6">
            {/* Report Generation */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <FileText className="h-5 w-5 mr-2" />
                        Generate New Report
                    </CardTitle>
                    <CardDescription>
                        Create comprehensive emission reports for compliance and analysis
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label>Report Type</Label>
                            <Select defaultValue="comprehensive">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cii">CII Assessment</SelectItem>
                                    <SelectItem value="eu-ets">EU ETS Compliance</SelectItem>
                                    <SelectItem value="fuel-eu-ghg">Fuel EU GHG</SelectItem>
                                    <SelectItem value="comprehensive">Comprehensive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Vessel</Label>
                            <Select defaultValue="all">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Vessels</SelectItem>
                                    <SelectItem value="mv-aurora">MV Aurora</SelectItem>
                                    <SelectItem value="mv-vega">MV Vega</SelectItem>
                                    <SelectItem value="mv-orion">MV Orion</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Period</Label>
                            <Select defaultValue="q4-2024">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="q4-2024">Q4 2024</SelectItem>
                                    <SelectItem value="q3-2024">Q3 2024</SelectItem>
                                    <SelectItem value="2024">Full Year 2024</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-end">
                            <Button onClick={generateNewReport} className="w-full">
                                Generate Report
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Filters and Search */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Filter className="h-5 w-5 mr-2" />
                        Filter Reports
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="space-y-2">
                            <Label>Search</Label>
                            <Input
                                placeholder="Search reports..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Type</Label>
                            <Select
                                value={filters.type}
                                onValueChange={value =>
                                    setFilters(prev => ({ ...prev, type: value }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="CII">CII</SelectItem>
                                    <SelectItem value="EU ETS">EU ETS</SelectItem>
                                    <SelectItem value="Fuel EU GHG">Fuel EU GHG</SelectItem>
                                    <SelectItem value="Comprehensive">Comprehensive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Vessel</Label>
                            <Select
                                value={filters.vessel}
                                onValueChange={value =>
                                    setFilters(prev => ({ ...prev, vessel: value }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Vessels</SelectItem>
                                    {uniqueVessels.map(vessel => (
                                        <SelectItem key={vessel} value={vessel}>
                                            {vessel}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select
                                value={filters.status}
                                onValueChange={value =>
                                    setFilters(prev => ({ ...prev, status: value }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="Draft">Draft</SelectItem>
                                    <SelectItem value="Final">Final</SelectItem>
                                    <SelectItem value="Submitted">Submitted</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Period</Label>
                            <Select
                                value={filters.period}
                                onValueChange={value =>
                                    setFilters(prev => ({ ...prev, period: value }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Periods</SelectItem>
                                    {uniquePeriods.map(period => (
                                        <SelectItem key={period} value={period}>
                                            {period}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Reports List */}
            <Card>
                <CardHeader>
                    <CardTitle>Emission Reports ({filteredReports.length})</CardTitle>
                    <CardDescription>
                        Generated emission reports and compliance documentation
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {filteredReports.map(report => (
                            <div
                                key={report.id}
                                className="p-6 border border-border rounded-xl hover:bg-accent/5 transition-all duration-200"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-4">
                                        <div
                                            className={`p-3 rounded-lg ${getTypeColor(report.type)}`}
                                        >
                                            <FileText className="h-6 w-6" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-3">
                                                <h3 className="text-lg font-semibold text-card-foreground">
                                                    {report.title}
                                                </h3>
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}
                                                >
                                                    {report.status}
                                                </span>
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium border ${getComplianceColor(report.complianceStatus)}`}
                                                >
                                                    {report.complianceStatus}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                                <div>
                                                    <span className="text-muted-foreground">
                                                        Vessel:
                                                    </span>
                                                    <span className="text-card-foreground ml-2 font-medium">
                                                        {report.vessel}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">
                                                        Period:
                                                    </span>
                                                    <span className="text-card-foreground ml-2">
                                                        {report.period}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">
                                                        CO₂ Emissions:
                                                    </span>
                                                    <span className="text-card-foreground ml-2">
                                                        {report.co2Emissions.toLocaleString()} MT
                                                    </span>
                                                </div>
                                                {report.ciiRating && (
                                                    <div>
                                                        <span className="text-muted-foreground">
                                                            CII Rating:
                                                        </span>
                                                        <span className="text-card-foreground ml-2 font-bold">
                                                            {report.ciiRating}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                                <div className="flex items-center space-x-1">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>
                                                        Generated:{" "}
                                                        {new Date(
                                                            report.generatedDate
                                                        ).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div>Size: {report.size}</div>
                                                <div>ID: {report.id}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col space-y-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleView(report.id)}
                                            className="flex items-center gap-2"
                                        >
                                            <Eye className="h-4 w-4" />
                                            View
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDownload(report.id)}
                                            className="flex items-center gap-2"
                                        >
                                            <Download className="h-4 w-4" />
                                            Download
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {filteredReports.length === 0 && (
                            <div className="text-center py-12">
                                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-card-foreground mb-2">
                                    No Reports Found
                                </h3>
                                <p className="text-muted-foreground">
                                    No reports match your current filter criteria.
                                </p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
