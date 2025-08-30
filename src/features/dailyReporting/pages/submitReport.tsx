import { useState, useEffect } from "react";
import { Upload, Ship, Navigation, Droplets, Gauge, AlertTriangle } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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

interface ReportFormData {
    // Vessel Information
    vesselId: string;
    date: string;
    route: string;
    originPort: string;
    destinationPort: string;

    // Navigation & Position
    currentLocation: string;
    weatherConditions: string;
    distanceTraveled: string;
    averageSpeed: string;
    maxSpeed: string;

    // Fuel & Energy
    fuelType: string;
    fuelConsumption: string;

    // Operational / Cargo
    cargoWeight: string;
    shaftRpm: string;
    shaftTorque: string;
    mcr: string;

    // Additional
    notes: string;
}

interface ValidationErrors {
    [key: string]: string;
}

interface AnomalyData {
    field: string;
    value: string;
    expected: string;
    severity: "high" | "medium";
    reason: string;
}

export function DailyReportingSection() {
    const [formData, setFormData] = useState<ReportFormData>({
        vesselId: "",
        date: new Date().toISOString().split("T")[0],
        route: "",
        originPort: "",
        destinationPort: "",
        currentLocation: "",
        weatherConditions: "",
        distanceTraveled: "",
        averageSpeed: "",
        maxSpeed: "",
        fuelType: "HFO (Heavy Fuel Oil)",
        fuelConsumption: "",
        cargoWeight: "",
        shaftRpm: "",
        shaftTorque: "",
        mcr: "",
        notes: "",
    });

    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<FileList | null>(null);
    const [showAnomalyDialog, setShowAnomalyDialog] = useState(false);
    const [anomalies, setAnomalies] = useState<AnomalyData[]>([]);
    const [openSections, setOpenSections] = useState({
        vessel: false,
        navigation: true, // Start with navigation open
        fuel: false,
        operational: false,
        additional: false,
    });

    const toggleSection = (section: keyof typeof openSections) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    // Progressive section opening logic
    useEffect(() => {
        const { currentLocation, distanceTraveled, averageSpeed, maxSpeed } = formData;

        // If navigation section is filled, open fuel section
        if (currentLocation && distanceTraveled && averageSpeed && maxSpeed && !openSections.fuel) {
            setOpenSections(prev => ({ ...prev, fuel: true }));
        }

        // If fuel section is filled, open operational section
        if (formData.fuelConsumption && !openSections.operational) {
            setOpenSections(prev => ({ ...prev, operational: true }));
        }

        // If operational section is filled, open additional section
        if (
            formData.cargoWeight &&
            formData.shaftRpm &&
            formData.shaftTorque &&
            !openSections.additional
        ) {
            setOpenSections(prev => ({ ...prev, additional: true }));
        }
    }, [formData, openSections]);

    // Auto-fill weather based on coordinates
    useEffect(() => {
        if (formData.currentLocation && formData.currentLocation.includes(",")) {
            // Simulate weather API call based on coordinates
            setTimeout(() => {
                const weatherOptions = ["Calm seas", "Moderate seas", "Rough seas", "Heavy seas"];
                const randomWeather =
                    weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
                setFormData(prev => ({ ...prev, weatherConditions: randomWeather }));
            }, 500);
        }
    }, [formData.currentLocation]);

    const handleInputChange = (field: keyof ReportFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Clear validation error when user starts typing
        if (validationErrors[field]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        console.log(files);
        if (files) {
            setUploadedFile(files);
            toast.success("File uploaded successfully! Auto-filling form data...");

            // Simulate auto-filling form from uploaded file
            setTimeout(() => {
                setFormData(prev => ({
                    ...prev,
                    vesselId: "MV Sea Pioneer",
                    route: "SGSIN-USNYC",
                    originPort: "SGSIN - Singapore, Singapore",
                    destinationPort: "USNYC - New York, USA",
                    currentLocation: "1.3521° N, 103.8198° E",
                    distanceTraveled: "10",
                    averageSpeed: "21",
                    maxSpeed: "21",
                    fuelConsumption: "10",
                    cargoWeight: "10",
                    shaftRpm: "10",
                    shaftTorque: "10",
                    weatherConditions: "Moderate",
                }));
                toast.success("Form auto-filled from uploaded data!");
            }, 1500);
        }
    };

    const validateForm = (): boolean => {
        const errors: ValidationErrors = {};
        // Only validate fields that are not auto-derived (exclude vessel info section)
        const requiredFields = [
            "currentLocation",
            "distanceTraveled",
            "averageSpeed",
            "maxSpeed",
            "fuelConsumption",
            "cargoWeight",
            "shaftRpm",
            "shaftTorque",
        ];

        requiredFields.forEach(field => {
            if (!formData[field as keyof ReportFormData]) {
                errors[field] = "This field is required";
            }
        });

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const detectAnomalies = (): AnomalyData[] => {
        const detectedAnomalies: AnomalyData[] = [];

        // Check fuel consumption anomaly
        const fuelConsumption = parseFloat(formData.fuelConsumption);
        if (fuelConsumption > 25) {
            detectedAnomalies.push({
                field: "Fuel Consumption",
                value: `${fuelConsumption} MT`,
                expected: "15-25 MT",
                severity: fuelConsumption > 30 ? "high" : "medium",
                reason: "Consumption exceeds normal range for vessel type",
            });
        }

        // Check speed anomaly
        const avgSpeed = parseFloat(formData.averageSpeed);
        if (avgSpeed > 25 || avgSpeed < 8) {
            detectedAnomalies.push({
                field: "Average Speed",
                value: `${avgSpeed} knots`,
                expected: "8-25 knots",
                severity: avgSpeed > 30 || avgSpeed < 5 ? "high" : "medium",
                reason:
                    avgSpeed > 25
                        ? "Speed exceeds efficient range"
                        : "Speed below operational minimum",
            });
        }

        // Check cargo weight anomaly
        const cargoWeight = parseFloat(formData.cargoWeight);
        if (cargoWeight > 50000) {
            detectedAnomalies.push({
                field: "Cargo Weight",
                value: `${cargoWeight} MT`,
                expected: "< 50,000 MT",
                severity: "medium",
                reason: "Cargo weight exceeds typical capacity",
            });
        }

        return detectedAnomalies;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fill in all required fields");
            return;
        }

        const detectedAnomalies = detectAnomalies();

        if (detectedAnomalies.length > 0) {
            setAnomalies(detectedAnomalies);
            setShowAnomalyDialog(true);
            return;
        }

        await submitReport();
    };

    const submitReport = async (forceSubmit = false) => {
        setIsSubmitting(true);
        setShowAnomalyDialog(false);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            if (forceSubmit) {
                toast.warning("Report submitted with anomalies", {
                    description: "Please review the anomalies before finalizing.",
                });
            } else {
                toast.success("Report submitted successfully!", {
                    description: `Report for ${formData.vesselId} has been processed`,
                });
            }

            // Reset form
            setFormData({
                vesselId: "",
                date: new Date().toISOString().split("T")[0],
                route: "",
                originPort: "",
                destinationPort: "",
                currentLocation: "",
                weatherConditions: "",
                distanceTraveled: "",
                averageSpeed: "",
                maxSpeed: "",
                fuelType: "HFO (Heavy Fuel Oil)",
                fuelConsumption: "",
                cargoWeight: "",
                shaftRpm: "",
                shaftTorque: "",
                mcr: "",
                notes: "",
            });
            setUploadedFile(null);

            // Reset sections to initial state
            setOpenSections({
                vessel: false,
                navigation: true,
                fuel: false,
                operational: false,
                additional: false,
            });
        } catch {
            toast.error("Failed to submit report", {
                description: "Please try again or contact support",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const getFieldClassName = (fieldName: string, isGrayedOut = false) => {
        const hasError = validationErrors[fieldName];
        const baseClasses = "transition-colors";

        if (isGrayedOut) {
            return `${baseClasses} bg-muted/50 text-muted-foreground`;
        }

        if (hasError) {
            return `${baseClasses} border-destructive focus-visible:ring-destructive/20`;
        }

        return baseClasses;
    };

    return (
        <div className="flex justify-between flex-col md:flex-row gap-5">
            {/* File Upload Section */}
            <div className="bg-card w-1/4 rounded-xl border border-border p-6 h-fit">
                <h2 className="text-xl font-semibold text-card-foreground mb-4 flex items-center">
                    <Upload className="h-5 w-5 mr-2" />
                    Upload Reports
                </h2>
                <div className="min-h-[500px] border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors flex flex-col justify-center items-center">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-card-foreground">
                            Upload Excel, PDF file or Images
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Drag and drop your file here, or click to browse
                        </p>
                    </div>
                    <div className="relative mt-4">
                        <label
                            htmlFor="file-upload"
                            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors cursor-pointer"
                        >
                            <Upload className="h-4 w-4 mr-2" />
                            Choose Files
                        </label>
                        <input
                            type="file"
                            accept=".csv,.xlsx,.xls,.png,.jpg,.jpeg,.pdf,.docx"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="file-upload"
                            multiple={true}
                        />
                    </div>
                    {uploadedFile && (
                        <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                            <p className="text-sm text-primary font-medium">File uploaded:</p>
                            <ul className="list-disc list-inside text-sm mt-2">
                                {uploadedFile &&
                                    Array.from(uploadedFile).map((file, idx) => (
                                        <li key={idx}>{file.name}</li>
                                    ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Manual Report Form */}
            <div className="bg-card w-3/4 rounded-xl border border-border p-6">
                <h2 className="text-xl font-semibold text-card-foreground mb-6 flex items-center">
                    <Ship className="h-5 w-5 mr-2" />
                    Manual Report Entry
                </h2>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Vessel Information Section - Grayed out as it can be derived */}
                    <Collapsible
                        open={openSections.vessel}
                        onOpenChange={() => toggleSection("vessel")}
                    >
                        <CollapsibleTrigger className="w-full">
                            <div
                                className="flex items-center justify-between p-4 bg-muted/20 rounded-lg hover:bg-muted/30 hover:scale-[1.02] transition-all duration-200 group"
                                title={
                                    !openSections.vessel ? "Click to open Vessel Information" : ""
                                }
                            >
                                <h3 className="text-lg font-medium text-muted-foreground flex items-center">
                                    <Ship className="h-4 w-4 mr-2" />
                                    Vessel Information
                                    <span className="ml-2 text-xs bg-muted/50 px-2 py-1 rounded-full">
                                        Auto-derived
                                    </span>
                                    {!openSections.vessel && (
                                        <span className="ml-2 text-xs text-muted-foreground/70 group-hover:text-muted-foreground transition-colors">
                                            (Click to open)
                                        </span>
                                    )}
                                </h3>
                                <ChevronDown
                                    className={`h-4 w-4 text-muted-foreground transition-transform ${openSections.vessel ? "rotate-180" : ""}`}
                                />
                            </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="vesselId" className="text-muted-foreground">
                                        Vessel ID
                                    </Label>
                                    <Input
                                        id="vesselId"
                                        value={"MV Sea Pioneer"}
                                        onChange={e =>
                                            handleInputChange("vesselId", e.target.value)
                                        }
                                        placeholder="e.g., MV Sea Pioneer"
                                        className={getFieldClassName("vesselId", true)}
                                        disabled
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="date" className="text-muted-foreground">
                                        Date
                                    </Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={formData.date}
                                        onChange={e => handleInputChange("date", e.target.value)}
                                        className={getFieldClassName("date", true)}
                                        disabled
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="originPort" className="text-muted-foreground">
                                        Origin Port
                                    </Label>
                                    <Input
                                        id="originPort"
                                        value={"SGSIN - Singapore, Singapore"}
                                        onChange={e =>
                                            handleInputChange("originPort", e.target.value)
                                        }
                                        placeholder="e.g., SGSIN - Singapore, Singapore"
                                        className={getFieldClassName("originPort", true)}
                                        disabled
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="destinationPort"
                                        className="text-muted-foreground"
                                    >
                                        Destination Port
                                    </Label>
                                    <Input
                                        id="destinationPort"
                                        value={"USNYC - New York, USA"}
                                        onChange={e =>
                                            handleInputChange("destinationPort", e.target.value)
                                        }
                                        placeholder="e.g., USNYC - New York, USA"
                                        className={getFieldClassName("destinationPort", true)}
                                        disabled
                                    />
                                </div>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>

                    {/* Navigation & Position Section */}
                    <Collapsible
                        open={openSections.navigation}
                        onOpenChange={() => toggleSection("navigation")}
                    >
                        <CollapsibleTrigger className="w-full">
                            <div
                                className="flex items-center justify-between p-4 bg-accent/10 rounded-lg hover:bg-accent/20 hover:scale-[1.02] transition-all duration-200 group"
                                title={
                                    !openSections.navigation
                                        ? "Click to open Navigation & Position"
                                        : ""
                                }
                            >
                                <h3 className="text-lg font-medium text-card-foreground flex items-center">
                                    <Navigation className="h-4 w-4 mr-2" />
                                    Navigation & Position
                                    {!openSections.navigation && (
                                        <span className="ml-2 text-xs text-muted-foreground/70 group-hover:text-muted-foreground transition-colors">
                                            (Click to open)
                                        </span>
                                    )}
                                </h3>
                                <ChevronDown
                                    className={`h-4 w-4 text-card-foreground transition-transform ${openSections.navigation ? "rotate-180" : ""}`}
                                />
                            </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="currentLocation">
                                        Current Location (Coords) *
                                    </Label>
                                    <Input
                                        id="currentLocation"
                                        value={formData.currentLocation}
                                        onChange={e =>
                                            handleInputChange("currentLocation", e.target.value)
                                        }
                                        placeholder="e.g., 1.3521° N, 103.8198° E"
                                        className={getFieldClassName("currentLocation")}
                                    />
                                    {validationErrors.currentLocation && (
                                        <p className="text-xs text-destructive">
                                            {validationErrors.currentLocation}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="weatherConditions">
                                        Weather Conditions
                                        <span className="ml-1 text-xs text-muted-foreground">
                                            (Auto-recommended)
                                        </span>
                                    </Label>
                                    <Input
                                        id="weatherConditions"
                                        value={formData.weatherConditions}
                                        onChange={e =>
                                            handleInputChange("weatherConditions", e.target.value)
                                        }
                                        placeholder="e.g., Moderate seas, 15 knot winds"
                                        className={getFieldClassName("weatherConditions")}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="distanceTraveled">
                                        Distance Traveled (nm) *{" "}
                                        <span className="ml-1 text-xs text-muted-foreground">
                                            (Auto-Calculated)
                                        </span>
                                    </Label>
                                    <Input
                                        id="distanceTraveled"
                                        type="number"
                                        step="0.1"
                                        value={formData.distanceTraveled}
                                        onChange={e =>
                                            handleInputChange("distanceTraveled", e.target.value)
                                        }
                                        placeholder="e.g., 10"
                                        className={getFieldClassName("distanceTraveled")}
                                    />
                                    {validationErrors.distanceTraveled && (
                                        <p className="text-xs text-destructive">
                                            {validationErrors.distanceTraveled}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="averageSpeed">Average Speed (knots) *</Label>
                                    <Input
                                        id="averageSpeed"
                                        type="number"
                                        step="0.1"
                                        value={formData.averageSpeed}
                                        onChange={e =>
                                            handleInputChange("averageSpeed", e.target.value)
                                        }
                                        placeholder="e.g., 21"
                                        className={getFieldClassName("averageSpeed")}
                                    />
                                    {validationErrors.averageSpeed && (
                                        <p className="text-xs text-destructive">
                                            {validationErrors.averageSpeed}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="maxSpeed">Max Speed (knots) *</Label>
                                    <Input
                                        id="maxSpeed"
                                        type="number"
                                        step="0.1"
                                        value={formData.maxSpeed}
                                        onChange={e =>
                                            handleInputChange("maxSpeed", e.target.value)
                                        }
                                        placeholder="e.g., 21"
                                        className={getFieldClassName("maxSpeed")}
                                    />
                                    {validationErrors.maxSpeed && (
                                        <p className="text-xs text-destructive">
                                            {validationErrors.maxSpeed}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>

                    {/* Fuel & Energy Section */}
                    <Collapsible
                        open={openSections.fuel}
                        onOpenChange={() => toggleSection("fuel")}
                    >
                        <CollapsibleTrigger className="w-full">
                            <div
                                className="flex items-center justify-between p-4 bg-accent/10 rounded-lg hover:bg-accent/20 hover:scale-[1.02] transition-all duration-200 group"
                                title={!openSections.fuel ? "Click to open Fuel & Energy" : ""}
                            >
                                <h3 className="text-lg font-medium text-card-foreground flex items-center">
                                    <Droplets className="h-4 w-4 mr-2" />
                                    Fuel & Energy
                                    {!openSections.fuel && (
                                        <span className="ml-2 text-xs text-muted-foreground/70 group-hover:text-muted-foreground transition-colors">
                                            (Click to open)
                                        </span>
                                    )}
                                </h3>
                                <ChevronDown
                                    className={`h-4 w-4 text-card-foreground transition-transform ${openSections.fuel ? "rotate-180" : ""}`}
                                />
                            </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fuelType">Fuel Type</Label>
                                    <Input
                                        id="fuelType"
                                        value={formData.fuelType}
                                        onChange={e =>
                                            handleInputChange("fuelType", e.target.value)
                                        }
                                        placeholder="e.g., HFO (Heavy Fuel Oil)"
                                        className={getFieldClassName("fuelType")}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="fuelConsumption">Fuel Consumption (MT) *</Label>
                                    <Input
                                        id="fuelConsumption"
                                        type="number"
                                        step="0.1"
                                        value={formData.fuelConsumption}
                                        onChange={e =>
                                            handleInputChange("fuelConsumption", e.target.value)
                                        }
                                        placeholder="e.g., 10"
                                        className={getFieldClassName("fuelConsumption")}
                                    />
                                    {validationErrors.fuelConsumption && (
                                        <p className="text-xs text-destructive">
                                            {validationErrors.fuelConsumption}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>

                    {/* Operational / Cargo Section */}
                    <Collapsible
                        open={openSections.operational}
                        onOpenChange={() => toggleSection("operational")}
                    >
                        <CollapsibleTrigger className="w-full">
                            <div
                                className="flex items-center justify-between p-4 bg-accent/10 rounded-lg hover:bg-accent/20 hover:scale-[1.02] transition-all duration-200 group"
                                title={
                                    !openSections.operational
                                        ? "Click to open Operational / Cargo"
                                        : ""
                                }
                            >
                                <h3 className="text-lg font-medium text-card-foreground flex items-center">
                                    <Gauge className="h-4 w-4 mr-2" />
                                    Operational / Cargo
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="cargoWeight">Cargo Weight (MT) *</Label>
                                    <Input
                                        id="cargoWeight"
                                        type="number"
                                        step="0.1"
                                        value={formData.cargoWeight}
                                        onChange={e =>
                                            handleInputChange("cargoWeight", e.target.value)
                                        }
                                        placeholder="e.g., 10"
                                        className={getFieldClassName("cargoWeight")}
                                    />
                                    {validationErrors.cargoWeight && (
                                        <p className="text-xs text-destructive">
                                            {validationErrors.cargoWeight}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="shaftRpm">Shaft RPM *</Label>
                                    <Input
                                        id="shaftRpm"
                                        type="number"
                                        value={formData.shaftRpm}
                                        onChange={e =>
                                            handleInputChange("shaftRpm", e.target.value)
                                        }
                                        placeholder="e.g., 10"
                                        className={getFieldClassName("shaftRpm")}
                                    />
                                    {validationErrors.shaftRpm && (
                                        <p className="text-xs text-destructive">
                                            {validationErrors.shaftRpm}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="shaftTorque">Shaft Torque (kNm) *</Label>
                                    <Input
                                        id="shaftTorque"
                                        type="number"
                                        step="0.1"
                                        value={formData.shaftTorque}
                                        onChange={e =>
                                            handleInputChange("shaftTorque", e.target.value)
                                        }
                                        placeholder="e.g., 10"
                                        className={getFieldClassName("shaftTorque")}
                                    />
                                    {validationErrors.shaftTorque && (
                                        <p className="text-xs text-destructive">
                                            {validationErrors.shaftTorque}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="mcr">MCR (kW)</Label>
                                    <Input
                                        id="mcr"
                                        type="number"
                                        value={formData.mcr}
                                        onChange={e => handleInputChange("mcr", e.target.value)}
                                        placeholder="Maximum Continuous Rating"
                                        className={getFieldClassName("mcr")}
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
                                <Label htmlFor="notes">Additional Notes</Label>
                                <Textarea
                                    id="notes"
                                    value={formData.notes}
                                    onChange={e => handleInputChange("notes", e.target.value)}
                                    placeholder="Any additional observations or notes..."
                                    rows={3}
                                    className={getFieldClassName("notes")}
                                />
                            </div>
                        </CollapsibleContent>
                    </Collapsible>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <Button type="submit" disabled={isSubmitting} className="px-8">
                            {isSubmitting ? "Submitting..." : "Submit Report"}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Anomaly Detection Dialog */}
            <Dialog open={showAnomalyDialog} onOpenChange={setShowAnomalyDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center text-destructive">
                            <AlertTriangle className="h-5 w-5 mr-2" />
                            Anomalies Detected
                        </DialogTitle>
                        <DialogDescription>
                            The following anomalies were detected in your report. Please review
                            before submitting.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {anomalies.map((anomaly, index) => (
                            <div
                                key={index}
                                className={`p-4 rounded-lg border ${
                                    anomaly.severity === "high"
                                        ? "bg-destructive/10 border-destructive/20"
                                        : "bg-orange-500/10 border-orange-500/20"
                                }`}
                            >
                                <div className="flex items-start space-x-3">
                                    <AlertTriangle
                                        className={`h-5 w-5 mt-0.5 ${
                                            anomaly.severity === "high"
                                                ? "text-destructive"
                                                : "text-orange-500"
                                        }`}
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-medium text-card-foreground mb-1">
                                            {anomaly.field} Anomaly
                                        </h4>
                                        <div className="text-sm space-y-1">
                                            <p>
                                                <span className="text-muted-foreground">
                                                    Current Value:
                                                </span>{" "}
                                                <span className="font-medium">{anomaly.value}</span>
                                            </p>
                                            <p>
                                                <span className="text-muted-foreground">
                                                    Expected Range:
                                                </span>{" "}
                                                <span className="font-medium">
                                                    {anomaly.expected}
                                                </span>
                                            </p>
                                            <p>
                                                <span className="text-muted-foreground">
                                                    Reason:
                                                </span>{" "}
                                                <span>{anomaly.reason}</span>
                                            </p>
                                        </div>
                                        <div className="mt-2">
                                            <span
                                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                    anomaly.severity === "high"
                                                        ? "bg-destructive/20 text-destructive"
                                                        : "bg-orange-500/20 text-orange-500"
                                                }`}
                                            >
                                                {anomaly.severity.toUpperCase()} SEVERITY
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <DialogFooter className="flex justify-between">
                        <Button variant="outline" onClick={() => setShowAnomalyDialog(false)}>
                            Review Data
                        </Button>
                        <Button
                            onClick={() => submitReport(true)}
                            disabled={isSubmitting}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            {isSubmitting ? "Submitting..." : "Submit Anyway"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
