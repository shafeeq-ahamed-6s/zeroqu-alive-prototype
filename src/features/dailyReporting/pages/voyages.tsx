import { useState, useEffect } from "react";
import {
    Ship,
    Plus,
    Calendar,
    MapPin,
    Edit,
    Trash2,
    Eye,
    ChevronDown,
    Anchor,
    Wrench,
    Droplets,
    Clock,
    Gauge,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface VoyageFormData {
    // Voyage Information
    voyageId: string;
    vesselId: string;
    voyageName: string;
    startDate: string;
    estimatedEndDate: string;

    // Route Information
    originPort: string;
    destinationPort: string;
    plannedRoute: string;
    estimatedDistance: string;

    // Cargo Information
    cargoType: string;
    cargoWeight: string;
    cargoValue: string;

    // Operational Details
    plannedSpeed: string;
    estimatedFuelConsumption: string;
    crewCount: string;

    // Additional Information
    notes: string;
}

interface PortActivity {
    id: string;
    activityType:
        | "Maintenance"
        | "Refueling"
        | "Cargo Loading"
        | "Cargo Discharge"
        | "Inspection"
        | "Crew Change";
    portCode: string;
    portName: string;
    arrivalDate: string;
    departureDate: string;
    status: "Scheduled" | "In Progress" | "Completed" | "Cancelled";
    estimatedCost?: number;
    notes: string;
}

interface Voyage {
    id: string;
    voyageId: string;
    vesselId: string;
    voyageName: string;
    status: "Planning" | "Active" | "Completed" | "Cancelled";
    startDate: string;
    estimatedEndDate: string;
    originPort: string;
    destinationPort: string;
    progress: number;
    portActivities: PortActivity[];
    dailyReports: {
        submitted: number;
        total: number;
        lastSubmitted?: string;
    };
}

export function Voyages() {
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showViewDialog, setShowViewDialog] = useState(false);
    const [selectedVoyage, setSelectedVoyage] = useState<Voyage | null>(null);
    const [editingVoyage, setEditingVoyage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [openSections, setOpenSections] = useState({
        voyage: true,
        route: false,
        cargo: false,
        operational: false,
        additional: false,
    });

    const [formData, setFormData] = useState<VoyageFormData>({
        voyageId: "",
        vesselId: "",
        voyageName: "",
        startDate: new Date().toISOString().split("T")[0],
        estimatedEndDate: "",
        originPort: "",
        destinationPort: "",
        plannedRoute: "",
        estimatedDistance: "",
        cargoType: "",
        cargoWeight: "",
        cargoValue: "",
        plannedSpeed: "",
        estimatedFuelConsumption: "",
        crewCount: "",
        notes: "",
    });

    const [voyages] = useState<Voyage[]>([
        {
            id: "1",
            voyageId: "VOY-2025-001",
            vesselId: "MV Sea Pioneer",
            voyageName: "Singapore to New York",
            status: "Active",
            startDate: "2025-01-15",
            estimatedEndDate: "2025-02-10",
            originPort: "SGSIN - Singapore",
            destinationPort: "USNYC - New York",
            progress: 35,
            dailyReports: {
                submitted: 8,
                total: 12,
                lastSubmitted: "2025-01-22",
            },
            portActivities: [
                {
                    id: "pa1",
                    activityType: "Refueling",
                    portCode: "SGSIN",
                    portName: "Singapore",
                    arrivalDate: "2025-01-15",
                    departureDate: "2025-01-16",
                    status: "Completed",
                    estimatedCost: 125000,
                    notes: "Bunker fuel and fresh water supply",
                },
                {
                    id: "pa2",
                    activityType: "Maintenance",
                    portCode: "AEDXB",
                    portName: "Dubai",
                    arrivalDate: "2025-01-28",
                    departureDate: "2025-01-30",
                    status: "Scheduled",
                    estimatedCost: 85000,
                    notes: "Scheduled engine inspection",
                },
            ],
        },
        {
            id: "2",
            voyageId: "VOY-2025-002",
            vesselId: "MV Aurora",
            voyageName: "Rotterdam to Dubai",
            status: "Planning",
            startDate: "2025-02-01",
            estimatedEndDate: "2025-02-20",
            originPort: "NLRTM - Rotterdam",
            destinationPort: "AEDXB - Dubai",
            progress: 0,
            dailyReports: {
                submitted: 0,
                total: 0,
            },
            portActivities: [
                {
                    id: "pa3",
                    activityType: "Cargo Loading",
                    portCode: "NLRTM",
                    portName: "Rotterdam",
                    arrivalDate: "2025-02-01",
                    departureDate: "2025-02-02",
                    status: "Scheduled",
                    estimatedCost: 45000,
                    notes: "Container loading operations",
                },
            ],
        },
        {
            id: "3",
            voyageId: "VOY-2025-003",
            vesselId: "MV Orion",
            voyageName: "Hamburg to Boston",
            status: "Completed",
            startDate: "2024-12-15",
            estimatedEndDate: "2025-01-05",
            originPort: "DEHAM - Hamburg",
            destinationPort: "USBOS - Boston",
            progress: 100,
            dailyReports: {
                submitted: 22,
                total: 22,
                lastSubmitted: "2025-01-05",
            },
            portActivities: [
                {
                    id: "pa4",
                    activityType: "Cargo Discharge",
                    portCode: "USBOS",
                    portName: "Boston",
                    arrivalDate: "2025-01-05",
                    departureDate: "2025-01-06",
                    status: "Completed",
                    estimatedCost: 15000,
                    notes: "Container discharge completed successfully",
                },
            ],
        },
    ]);

    const toggleSection = (section: keyof typeof openSections) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    // Progressive section opening logic
    useEffect(() => {
        const { voyageId, vesselId, voyageName, startDate, estimatedEndDate } = formData;

        // If voyage section is filled, open route section
        if (
            voyageId &&
            vesselId &&
            voyageName &&
            startDate &&
            estimatedEndDate &&
            !openSections.route
        ) {
            setOpenSections(prev => ({ ...prev, route: true }));
        }

        // If route section is filled, open cargo section
        if (
            formData.originPort &&
            formData.destinationPort &&
            formData.estimatedDistance &&
            !openSections.cargo
        ) {
            setOpenSections(prev => ({ ...prev, cargo: true }));
        }

        // If cargo section is filled, open operational section
        if (formData.cargoType && formData.cargoWeight && !openSections.operational) {
            setOpenSections(prev => ({ ...prev, operational: true }));
        }

        // If operational section is filled, open additional section
        if (
            formData.plannedSpeed &&
            formData.estimatedFuelConsumption &&
            formData.crewCount &&
            !openSections.additional
        ) {
            setOpenSections(prev => ({ ...prev, additional: true }));
        }
    }, [formData, openSections]);

    const handleInputChange = (field: keyof VoyageFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            if (editingVoyage) {
                toast.success("Voyage updated successfully!", {
                    description: `${formData.voyageName} has been updated`,
                });
            } else {
                toast.success("Voyage created successfully!", {
                    description: `${formData.voyageName} has been created and is ready for daily reporting`,
                });
            }

            // Reset form
            setFormData({
                voyageId: "",
                vesselId: "",
                voyageName: "",
                startDate: new Date().toISOString().split("T")[0],
                estimatedEndDate: "",
                originPort: "",
                destinationPort: "",
                plannedRoute: "",
                estimatedDistance: "",
                cargoType: "",
                cargoWeight: "",
                cargoValue: "",
                plannedSpeed: "",
                estimatedFuelConsumption: "",
                crewCount: "",
                notes: "",
            });

            // Reset sections to initial state
            setOpenSections({
                voyage: true,
                route: false,
                cargo: false,
                operational: false,
                additional: false,
            });

            setShowCreateDialog(false);
            setEditingVoyage(null);
        } catch {
            toast.error("Failed to save voyage", {
                description: "Please try again or contact support",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleViewVoyage = (voyage: Voyage) => {
        setSelectedVoyage(voyage);
        setShowViewDialog(true);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Active":
                return "bg-green-500/10 text-green-500 border-green-500/20";
            case "Planning":
                return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            case "Completed":
                return "bg-gray-500/10 text-gray-500 border-gray-500/20";
            case "Cancelled":
                return "bg-destructive/10 text-destructive border-destructive/20";
            default:
                return "bg-muted/10 text-muted-foreground border-muted/20";
        }
    };

    const getActivityStatusColor = (status: string) => {
        switch (status) {
            case "In Progress":
                return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            case "Scheduled":
                return "bg-orange-500/10 text-orange-500 border-orange-500/20";
            case "Completed":
                return "bg-green-500/10 text-green-500 border-green-500/20";
            case "Cancelled":
                return "bg-destructive/10 text-destructive border-destructive/20";
            default:
                return "bg-muted/10 text-muted-foreground border-muted/20";
        }
    };

    const getActivityIcon = (activityType: string) => {
        switch (activityType) {
            case "Maintenance":
                return Wrench;
            case "Refueling":
                return Droplets;
            case "Cargo Loading":
            case "Cargo Discharge":
                return Anchor;
            case "Inspection":
                return Eye;
            case "Crew Change":
                return Clock;
            default:
                return Anchor;
        }
    };

    const getActivityColor = (activityType: string) => {
        switch (activityType) {
            case "Maintenance":
                return "text-orange-500";
            case "Refueling":
                return "text-blue-500";
            case "Cargo Loading":
            case "Cargo Discharge":
                return "text-green-500";
            case "Inspection":
                return "text-purple-500";
            case "Crew Change":
                return "text-indigo-500";
            default:
                return "text-muted-foreground";
        }
    };

    return (
        <div className="space-y-6">
            {/* Voyages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {voyages.map(voyage => (
                    <div
                        key={voyage.id}
                        className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-2">
                                <Ship className="h-5 w-5 text-primary" />
                                <span className="font-mono text-sm text-muted-foreground">
                                    {voyage.voyageId}
                                </span>
                            </div>
                            <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(voyage.status)}`}
                            >
                                {voyage.status}
                            </span>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <h3 className="font-semibold text-card-foreground">
                                    {voyage.voyageName}
                                </h3>
                                <p className="text-sm text-muted-foreground">{voyage.vesselId}</p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center space-x-2 text-sm">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">From:</span>
                                    <span className="text-card-foreground">
                                        {voyage.originPort}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">To:</span>
                                    <span className="text-card-foreground">
                                        {voyage.destinationPort}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Duration:</span>
                                    <span className="text-card-foreground">
                                        {new Date(voyage.startDate).toLocaleDateString()} -{" "}
                                        {new Date(voyage.estimatedEndDate).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            {/* Daily Reports Progress */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Daily Reports</span>
                                    <span className="text-card-foreground">
                                        {voyage.dailyReports.submitted}/{voyage.dailyReports.total}
                                    </span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                    <div
                                        className="bg-primary h-2 rounded-full transition-all duration-300"
                                        style={{
                                            width:
                                                voyage.dailyReports.total > 0
                                                    ? `${(voyage.dailyReports.submitted / voyage.dailyReports.total) * 100}%`
                                                    : "0%",
                                        }}
                                    />
                                </div>
                                {voyage.dailyReports.lastSubmitted && (
                                    <p className="text-xs text-muted-foreground">
                                        Last:{" "}
                                        {new Date(
                                            voyage.dailyReports.lastSubmitted
                                        ).toLocaleDateString()}
                                    </p>
                                )}
                            </div>

                            {/* Voyage Progress */}
                            {voyage.status === "Active" && (
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Voyage Progress
                                        </span>
                                        <span className="text-card-foreground">
                                            {voyage.progress}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2">
                                        <div
                                            className="bg-secondary h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${voyage.progress}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Port Activities Summary */}
                            <div className="space-y-2">
                                <h4 className="text-sm font-medium text-card-foreground">
                                    Port Activities ({voyage.portActivities.length})
                                </h4>
                                <div className="flex flex-wrap gap-1">
                                    {voyage.portActivities.slice(0, 3).map(activity => {
                                        const ActivityIcon = getActivityIcon(activity.activityType);
                                        const activityColor = getActivityColor(
                                            activity.activityType
                                        );

                                        return (
                                            <div
                                                key={activity.id}
                                                className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs bg-current/10 ${activityColor}`}
                                            >
                                                <ActivityIcon
                                                    className={`h-3 w-3 ${activityColor}`}
                                                />
                                                <span>{activity.activityType}</span>
                                            </div>
                                        );
                                    })}
                                    {voyage.portActivities.length > 3 && (
                                        <div className="px-2 py-1 rounded-full text-xs bg-muted/20 text-muted-foreground">
                                            +{voyage.portActivities.length - 3} more
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex space-x-2 pt-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => handleViewVoyage(voyage)}
                                >
                                    <Eye className="h-4 w-4 mr-1" />
                                    View
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1">
                                    <Edit className="h-4 w-4 mr-1" />
                                    Edit
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-destructive hover:text-destructive"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create/Edit Voyage Dialog */}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center">
                            <Ship className="h-5 w-5 mr-2" />
                            {editingVoyage ? "Edit Voyage" : "Create New Voyage"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingVoyage
                                ? "Update voyage details"
                                : "Create a new voyage to enable daily reporting and port tracking"}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Voyage Information Section */}
                        <Collapsible
                            open={openSections.voyage}
                            onOpenChange={() => toggleSection("voyage")}
                        >
                            <CollapsibleTrigger className="w-full">
                                <div
                                    className="flex items-center justify-between p-4 bg-accent/10 rounded-lg hover:bg-accent/20 hover:scale-[1.02] transition-all duration-200 group"
                                    title={
                                        !openSections.voyage
                                            ? "Click to open Voyage Information"
                                            : ""
                                    }
                                >
                                    <h3 className="text-lg font-medium text-card-foreground flex items-center">
                                        <Ship className="h-4 w-4 mr-2" />
                                        Voyage Information
                                        {!openSections.voyage && (
                                            <span className="ml-2 text-xs text-muted-foreground/70 group-hover:text-muted-foreground transition-colors">
                                                (Click to open)
                                            </span>
                                        )}
                                    </h3>
                                    <ChevronDown
                                        className={`h-4 w-4 text-card-foreground transition-transform ${openSections.voyage ? "rotate-180" : ""}`}
                                    />
                                </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="voyageId">Voyage ID *</Label>
                                        <Input
                                            id="voyageId"
                                            value={formData.voyageId}
                                            onChange={e =>
                                                handleInputChange("voyageId", e.target.value)
                                            }
                                            placeholder="e.g., VOY-2025-001"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="vesselId">Vessel ID *</Label>
                                        <Input
                                            id="vesselId"
                                            value={formData.vesselId}
                                            onChange={e =>
                                                handleInputChange("vesselId", e.target.value)
                                            }
                                            placeholder="e.g., MV Sea Pioneer"
                                        />
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="voyageName">Voyage Name *</Label>
                                        <Input
                                            id="voyageName"
                                            value={formData.voyageName}
                                            onChange={e =>
                                                handleInputChange("voyageName", e.target.value)
                                            }
                                            placeholder="e.g., Singapore to New York"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="startDate">Start Date *</Label>
                                        <Input
                                            id="startDate"
                                            type="date"
                                            value={formData.startDate}
                                            onChange={e =>
                                                handleInputChange("startDate", e.target.value)
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="estimatedEndDate">
                                            Estimated End Date *
                                        </Label>
                                        <Input
                                            id="estimatedEndDate"
                                            type="date"
                                            value={formData.estimatedEndDate}
                                            onChange={e =>
                                                handleInputChange(
                                                    "estimatedEndDate",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>

                        {/* Route Information Section */}
                        <Collapsible
                            open={openSections.route}
                            onOpenChange={() => toggleSection("route")}
                        >
                            <CollapsibleTrigger className="w-full">
                                <div
                                    className="flex items-center justify-between p-4 bg-accent/10 rounded-lg hover:bg-accent/20 hover:scale-[1.02] transition-all duration-200 group"
                                    title={
                                        !openSections.route ? "Click to open Route Information" : ""
                                    }
                                >
                                    <h3 className="text-lg font-medium text-card-foreground flex items-center">
                                        <MapPin className="h-4 w-4 mr-2" />
                                        Route Information
                                        {!openSections.route && (
                                            <span className="ml-2 text-xs text-muted-foreground/70 group-hover:text-muted-foreground transition-colors">
                                                (Click to open)
                                            </span>
                                        )}
                                    </h3>
                                    <ChevronDown
                                        className={`h-4 w-4 text-card-foreground transition-transform ${openSections.route ? "rotate-180" : ""}`}
                                    />
                                </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="originPort">Origin Port *</Label>
                                        <Input
                                            id="originPort"
                                            value={formData.originPort}
                                            onChange={e =>
                                                handleInputChange("originPort", e.target.value)
                                            }
                                            placeholder="e.g., SGSIN - Singapore"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="destinationPort">Destination Port *</Label>
                                        <Input
                                            id="destinationPort"
                                            value={formData.destinationPort}
                                            onChange={e =>
                                                handleInputChange("destinationPort", e.target.value)
                                            }
                                            placeholder="e.g., USNYC - New York"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="estimatedDistance">
                                            Estimated Distance (nm) *
                                        </Label>
                                        <Input
                                            id="estimatedDistance"
                                            type="number"
                                            value={formData.estimatedDistance}
                                            onChange={e =>
                                                handleInputChange(
                                                    "estimatedDistance",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="e.g., 8500"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="plannedRoute">Planned Route</Label>
                                        <Input
                                            id="plannedRoute"
                                            value={formData.plannedRoute}
                                            onChange={e =>
                                                handleInputChange("plannedRoute", e.target.value)
                                            }
                                            placeholder="e.g., Via Suez Canal"
                                        />
                                    </div>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>

                        {/* Cargo Information Section */}
                        <Collapsible
                            open={openSections.cargo}
                            onOpenChange={() => toggleSection("cargo")}
                        >
                            <CollapsibleTrigger className="w-full">
                                <div
                                    className="flex items-center justify-between p-4 bg-accent/10 rounded-lg hover:bg-accent/20 hover:scale-[1.02] transition-all duration-200 group"
                                    title={
                                        !openSections.cargo ? "Click to open Cargo Information" : ""
                                    }
                                >
                                    <h3 className="text-lg font-medium text-card-foreground flex items-center">
                                        <Ship className="h-4 w-4 mr-2" />
                                        Cargo Information
                                        {!openSections.cargo && (
                                            <span className="ml-2 text-xs text-muted-foreground/70 group-hover:text-muted-foreground transition-colors">
                                                (Click to open)
                                            </span>
                                        )}
                                    </h3>
                                    <ChevronDown
                                        className={`h-4 w-4 text-card-foreground transition-transform ${openSections.cargo ? "rotate-180" : ""}`}
                                    />
                                </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="cargoType">Cargo Type *</Label>
                                        <Input
                                            id="cargoType"
                                            value={formData.cargoType}
                                            onChange={e =>
                                                handleInputChange("cargoType", e.target.value)
                                            }
                                            placeholder="e.g., Container, Bulk, Tanker"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="cargoWeight">Cargo Weight (MT) *</Label>
                                        <Input
                                            id="cargoWeight"
                                            type="number"
                                            value={formData.cargoWeight}
                                            onChange={e =>
                                                handleInputChange("cargoWeight", e.target.value)
                                            }
                                            placeholder="e.g., 25000"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="cargoValue">Cargo Value (USD)</Label>
                                        <Input
                                            id="cargoValue"
                                            type="number"
                                            value={formData.cargoValue}
                                            onChange={e =>
                                                handleInputChange("cargoValue", e.target.value)
                                            }
                                            placeholder="e.g., 5000000"
                                        />
                                    </div>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>

                        {/* Operational Details Section */}
                        <Collapsible
                            open={openSections.operational}
                            onOpenChange={() => toggleSection("operational")}
                        >
                            <CollapsibleTrigger className="w-full">
                                <div
                                    className="flex items-center justify-between p-4 bg-accent/10 rounded-lg hover:bg-accent/20 hover:scale-[1.02] transition-all duration-200 group"
                                    title={
                                        !openSections.operational
                                            ? "Click to open Operational Details"
                                            : ""
                                    }
                                >
                                    <h3 className="text-lg font-medium text-card-foreground flex items-center">
                                        <Gauge className="h-4 w-4 mr-2" />
                                        Operational Details
                                        {!openSections.operational && (
                                            <span className="ml-2 text-xs text-muted-foreground/70 group-hover:text-muted-foreground transition-colors">
                                                (Click to open)
                                            </span>
                                        )}
                                    </h3>
                                    <ChevronDown
                                        className={`h-4 w-4 text-card-foreground transition-transform ${openSections.operational ? "rotate-180" : ""}`}
                                    />
                                </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="plannedSpeed">
                                            Planned Speed (knots) *
                                        </Label>
                                        <Input
                                            id="plannedSpeed"
                                            type="number"
                                            step="0.1"
                                            value={formData.plannedSpeed}
                                            onChange={e =>
                                                handleInputChange("plannedSpeed", e.target.value)
                                            }
                                            placeholder="e.g., 18.5"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="estimatedFuelConsumption">
                                            Est. Fuel Consumption (MT) *
                                        </Label>
                                        <Input
                                            id="estimatedFuelConsumption"
                                            type="number"
                                            step="0.1"
                                            value={formData.estimatedFuelConsumption}
                                            onChange={e =>
                                                handleInputChange(
                                                    "estimatedFuelConsumption",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="e.g., 450"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="crewCount">Crew Count *</Label>
                                        <Input
                                            id="crewCount"
                                            type="number"
                                            value={formData.crewCount}
                                            onChange={e =>
                                                handleInputChange("crewCount", e.target.value)
                                            }
                                            placeholder="e.g., 22"
                                        />
                                    </div>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>

                        {/* Additional Information */}
                        <Collapsible
                            open={openSections.additional}
                            onOpenChange={() => toggleSection("additional")}
                        >
                            <CollapsibleTrigger className="w-full">
                                <div
                                    className="flex items-center justify-between p-4 bg-accent/10 rounded-lg hover:bg-accent/20 hover:scale-[1.02] transition-all duration-200 group"
                                    title={
                                        !openSections.additional
                                            ? "Click to open Additional Information"
                                            : ""
                                    }
                                >
                                    <h3 className="text-lg font-medium text-card-foreground">
                                        Additional Information
                                        {!openSections.additional && (
                                            <span className="ml-2 text-xs text-muted-foreground/70 group-hover:text-muted-foreground transition-colors">
                                                (Click to open)
                                            </span>
                                        )}
                                    </h3>
                                    <ChevronDown
                                        className={`h-4 w-4 text-card-foreground transition-transform ${openSections.additional ? "rotate-180" : ""}`}
                                    />
                                </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="notes">Notes & Special Instructions</Label>
                                    <Textarea
                                        id="notes"
                                        value={formData.notes}
                                        onChange={e => handleInputChange("notes", e.target.value)}
                                        placeholder="Any special instructions, cargo handling notes, or voyage-specific information..."
                                        rows={3}
                                    />
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    </form>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting
                                ? "Saving..."
                                : editingVoyage
                                  ? "Update Voyage"
                                  : "Create Voyage"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* View Voyage Details Dialog */}
            <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center">
                            <Ship className="h-5 w-5 mr-2" />
                            {selectedVoyage?.voyageName}
                        </DialogTitle>
                        <DialogDescription>
                            Voyage details and port activities for {selectedVoyage?.voyageId}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedVoyage && (
                        <div className="space-y-6">
                            {/* Voyage Overview */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-card-foreground">
                                        Voyage Details
                                    </h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Vessel:</span>
                                            <span className="text-card-foreground font-medium">
                                                {selectedVoyage.vesselId}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Route:</span>
                                            <span className="text-card-foreground">
                                                {selectedVoyage.originPort} →{" "}
                                                {selectedVoyage.destinationPort}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Duration:</span>
                                            <span className="text-card-foreground">
                                                {new Date(
                                                    selectedVoyage.startDate
                                                ).toLocaleDateString()}{" "}
                                                -{" "}
                                                {new Date(
                                                    selectedVoyage.estimatedEndDate
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Status:</span>
                                            <span
                                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedVoyage.status)}`}
                                            >
                                                {selectedVoyage.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-card-foreground">
                                        Daily Reports Progress
                                    </h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">
                                                Reports Submitted:
                                            </span>
                                            <span className="text-card-foreground font-medium">
                                                {selectedVoyage.dailyReports.submitted}/
                                                {selectedVoyage.dailyReports.total}
                                            </span>
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-3">
                                            <div
                                                className="bg-primary h-3 rounded-full transition-all duration-300"
                                                style={{
                                                    width:
                                                        selectedVoyage.dailyReports.total > 0
                                                            ? `${(selectedVoyage.dailyReports.submitted / selectedVoyage.dailyReports.total) * 100}%`
                                                            : "0%",
                                                }}
                                            />
                                        </div>
                                        {selectedVoyage.dailyReports.lastSubmitted && (
                                            <p className="text-sm text-muted-foreground">
                                                Last submitted:{" "}
                                                {new Date(
                                                    selectedVoyage.dailyReports.lastSubmitted
                                                ).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Port Activities */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-card-foreground">
                                        Port Activities
                                    </h3>
                                    <Button variant="outline" size="sm">
                                        <Plus className="h-4 w-4 mr-1" />
                                        Add Activity
                                    </Button>
                                </div>

                                <div className="space-y-3">
                                    {selectedVoyage.portActivities.map(activity => {
                                        const ActivityIcon = getActivityIcon(activity.activityType);
                                        const activityColor = getActivityColor(
                                            activity.activityType
                                        );

                                        return (
                                            <div
                                                key={activity.id}
                                                className="border border-border rounded-lg p-4 hover:bg-accent/10 transition-colors"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-start space-x-3">
                                                        <div
                                                            className={`p-2 rounded-lg bg-current/10 ${activityColor}`}
                                                        >
                                                            <ActivityIcon
                                                                className={`h-4 w-4 ${activityColor}`}
                                                            />
                                                        </div>

                                                        <div className="space-y-1">
                                                            <div className="flex items-center space-x-2">
                                                                <h4 className="font-medium text-card-foreground">
                                                                    {activity.activityType}
                                                                </h4>
                                                                <span
                                                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getActivityStatusColor(activity.status)}`}
                                                                >
                                                                    {activity.status}
                                                                </span>
                                                            </div>

                                                            <div className="text-sm space-y-1">
                                                                <div className="flex items-center space-x-2">
                                                                    <MapPin className="h-3 w-3 text-muted-foreground" />
                                                                    <span className="text-muted-foreground">
                                                                        Port:
                                                                    </span>
                                                                    <span className="text-card-foreground">
                                                                        {activity.portCode} -{" "}
                                                                        {activity.portName}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <Calendar className="h-3 w-3 text-muted-foreground" />
                                                                    <span className="text-muted-foreground">
                                                                        Period:
                                                                    </span>
                                                                    <span className="text-card-foreground">
                                                                        {new Date(
                                                                            activity.arrivalDate
                                                                        ).toLocaleDateString()}{" "}
                                                                        -{" "}
                                                                        {new Date(
                                                                            activity.departureDate
                                                                        ).toLocaleDateString()}
                                                                    </span>
                                                                </div>
                                                                {activity.estimatedCost && (
                                                                    <div className="flex items-center space-x-2">
                                                                        <span className="text-muted-foreground">
                                                                            Cost:
                                                                        </span>
                                                                        <span className="text-card-foreground font-medium">
                                                                            $
                                                                            {activity.estimatedCost.toLocaleString()}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                {activity.notes && (
                                                                    <p className="text-muted-foreground text-xs">
                                                                        {activity.notes}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex space-x-1">
                                                        <Button variant="outline" size="sm">
                                                            <Edit className="h-3 w-3" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-destructive hover:text-destructive"
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowViewDialog(false)}>
                            Close
                        </Button>
                        <Button
                            onClick={() => {
                                setEditingVoyage(selectedVoyage?.id || null);
                                setShowViewDialog(false);
                                setShowCreateDialog(true);
                            }}
                        >
                            Edit Voyage
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
