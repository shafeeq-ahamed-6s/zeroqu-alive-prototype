import { useState, useEffect } from "react";
import { Calculator, Ship, Fuel, Target, Leaf, Euro, Zap, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface VesselData {
    imo: string;
    name: string;
    type: string;
    deadWeight: string;
    originPort: string;
    destinationPort: string;
    totalDistance: string;
    seaHours: string;
    portHours: string;
    fuelTypeAtSea: string;
    amountAtSea: string;
    fuelTypeAtPort: string;
    amountAtPort: string;
}

interface PlannedVoyage {
    id: string;
    name: string;
    vessel: VesselData;
}

interface SimulationResults {
    estimatedCII: {
        attainedCII: string;
        totalFOCSea: string;
        totalFOCPort: string;
        totalCO2: string;
    };
    bioCII: {
        correctedCII: string;
        totalFOC: string;
        totalCO2: string;
        originalCII: string;
    };
    euETS: {
        euasExposure: string;
        co2EmissionSea: string;
        co2EmissionPort: string;
        coverageRequired: string;
    };
    fuelEUGHG: {
        ghgIntensity: string;
        complianceBalance: string;
    };
}

type SimulatorType = "estimated-cii" | "bio-cii" | "eu-ets" | "fuel-eu-ghg";

export function EmissionSimulation() {
    const [voyageSource, setVoyageSource] = useState<"new" | "planned">("new");
    const [selectedPlannedVoyage, setSelectedPlannedVoyage] = useState<string>("");

    const [vesselData, setVesselData] = useState<VesselData>({
        imo: "",
        name: "",
        type: "",
        deadWeight: "",
        originPort: "",
        destinationPort: "",
        totalDistance: "",
        seaHours: "",
        portHours: "",
        fuelTypeAtSea: "",
        amountAtSea: "",
        fuelTypeAtPort: "",
        amountAtPort: "",
    });

    const [simulationInputs, setSimulationInputs] = useState({
        // Estimated CII
        desiredCII: "",

        // Bio CII
        biofuelSupply: "",
        biofuelDesiredCII: "",
        ei: "85.2",
        lcv: "42.7",

        // EU ETS
        reportingYear: "2024",
        euRelevanceSea: "Non EU",
        euRelevancePort: "Non EU",

        // Fuel EU GHG
        anticipatedFuelType: "HFO",
        rfWind: "0",
        rfOps: "0",
    });

    const [results, setResults] = useState<SimulationResults>({
        estimatedCII: {
            attainedCII: "-",
            totalFOCSea: "-",
            totalFOCPort: "-",
            totalCO2: "-",
        },
        bioCII: {
            correctedCII: "-",
            totalFOC: "-",
            totalCO2: "-",
            originalCII: "-",
        },
        euETS: {
            euasExposure: "-",
            co2EmissionSea: "-",
            co2EmissionPort: "-",
            coverageRequired: "-",
        },
        fuelEUGHG: {
            ghgIntensity: "-",
            complianceBalance: "-",
        },
    });

    const [isSimulating, setIsSimulating] = useState(false);
    const [activeSimulator, setActiveSimulator] = useState<SimulatorType>("estimated-cii");

    // Mock planned voyages data
    const plannedVoyages: PlannedVoyage[] = [
        {
            id: "voyage-001",
            name: "Singapore to Rotterdam - MV Aurora",
            vessel: {
                imo: "9000001",
                name: "MV Aurora",
                type: "Container Ship",
                deadWeight: "75000",
                originPort: "SGSIN",
                destinationPort: "NLRTM",
                totalDistance: "12500",
                seaHours: "850",
                portHours: "120",
                fuelTypeAtSea: "HFO (Heavy Fuel Oil)",
                amountAtSea: "2.8",
                fuelTypeAtPort: "MGO (Marine Gas Oil)",
                amountAtPort: "0.5",
            },
        },
        {
            id: "voyage-002",
            name: "Hamburg to New York - MV Vega",
            vessel: {
                imo: "9000002",
                name: "MV Vega",
                type: "Bulk Carrier",
                deadWeight: "55000",
                originPort: "DEHAM",
                destinationPort: "USNYC",
                totalDistance: "3800",
                seaHours: "280",
                portHours: "72",
                fuelTypeAtSea: "MGO (Marine Gas Oil)",
                amountAtSea: "1.9",
                fuelTypeAtPort: "MGO (Marine Gas Oil)",
                amountAtPort: "0.3",
            },
        },
        {
            id: "voyage-003",
            name: "Shanghai to Los Angeles - MV Orion",
            vessel: {
                imo: "9000003",
                name: "MV Orion",
                type: "Tanker",
                deadWeight: "120000",
                originPort: "CNSHA",
                destinationPort: "USLAX",
                totalDistance: "6200",
                seaHours: "420",
                portHours: "96",
                fuelTypeAtSea: "LNG (Liquefied Natural Gas)",
                amountAtSea: "3.2",
                fuelTypeAtPort: "MGO (Marine Gas Oil)",
                amountAtPort: "0.4",
            },
        },
    ];

    // Handle voyage source change
    useEffect(() => {
        if (voyageSource === "planned" && selectedPlannedVoyage) {
            const selectedVoyage = plannedVoyages.find(v => v.id === selectedPlannedVoyage);
            if (selectedVoyage) {
                setVesselData(selectedVoyage.vessel);
            }
        } else if (voyageSource === "new") {
            // Reset to empty form for new voyage
            setVesselData({
                imo: "",
                name: "",
                type: "",
                deadWeight: "",
                originPort: "",
                destinationPort: "",
                totalDistance: "",
                seaHours: "",
                portHours: "",
                fuelTypeAtSea: "",
                amountAtSea: "",
                fuelTypeAtPort: "",
                amountAtPort: "",
            });
        }
    }, [voyageSource, selectedPlannedVoyage]);

    // Auto-calculate when key inputs change
    useEffect(() => {
        if (vesselData.deadWeight && vesselData.totalDistance && vesselData.amountAtSea) {
            simulateResults();
        }
    }, [vesselData.deadWeight, vesselData.totalDistance, vesselData.amountAtSea]);

    const handleVesselInputChange = (field: keyof VesselData, value: string) => {
        setVesselData(prev => ({ ...prev, [field]: value }));
    };

    const handleSimulationInputChange = (field: string, value: string) => {
        setSimulationInputs(prev => ({ ...prev, [field]: value }));
    };

    const simulateResults = async () => {
        setIsSimulating(true);

        // Simulate API call with realistic calculations
        await new Promise(resolve => setTimeout(resolve, 1500));

        const deadWeight = parseFloat(vesselData.deadWeight) || 0;
        const distance = parseFloat(vesselData.totalDistance) || 0;
        const fuelAtSea = parseFloat(vesselData.amountAtSea) || 0;
        const seaHours = parseFloat(vesselData.seaHours) || 0;

        // Mock calculations based on real formulas
        const totalFuelSea = fuelAtSea * seaHours;
        const totalCO2 = totalFuelSea * 3.114; // CO2 factor for HFO
        const attainedCII = (totalCO2 * 1000000) / (deadWeight * distance);

        setResults({
            estimatedCII: {
                attainedCII: attainedCII.toFixed(2),
                totalFOCSea: totalFuelSea.toFixed(1),
                totalFOCPort: (
                    parseFloat(vesselData.amountAtPort) * parseFloat(vesselData.portHours)
                ).toFixed(1),
                totalCO2: totalCO2.toFixed(1),
            },
            bioCII: {
                correctedCII: (attainedCII * 0.85).toFixed(2),
                totalFOC: (totalFuelSea * 1.1).toFixed(1),
                totalCO2: (totalCO2 * 0.8).toFixed(1),
                originalCII: attainedCII.toFixed(2),
            },
            euETS: {
                euasExposure: (totalCO2 * 0.4).toFixed(1),
                co2EmissionSea: (totalCO2 * 0.7).toFixed(1),
                co2EmissionPort: (totalCO2 * 0.3).toFixed(1),
                coverageRequired: "40%",
            },
            fuelEUGHG: {
                ghgIntensity: (
                    91.16 -
                    (parseFloat(simulationInputs.rfWind) + parseFloat(simulationInputs.rfOps)) * 0.5
                ).toFixed(2),
                complianceBalance: ((91.16 - 89.34) * totalCO2).toFixed(1),
            },
        });

        setIsSimulating(false);
        toast.success("Simulation completed successfully!");
    };

    const fuelTypes = [
        "HFO (Heavy Fuel Oil)",
        "MGO (Marine Gas Oil)",
        "LNG (Liquefied Natural Gas)",
        "Methanol",
        "Ammonia",
        "Hydrogen",
    ];

    const vesselTypes = [
        "Bulk Carrier",
        "Container Ship",
        "Tanker",
        "General Cargo",
        "RoRo Ship",
        "Cruise Ship",
    ];

    const biofuelTypes = [
        "FAME (Fatty Acid Methyl Ester)",
        "HVO (Hydrotreated Vegetable Oil)",
        "Bio-LNG",
        "Bio-Methanol",
        "Sustainable Aviation Fuel",
    ];

    const simulators = [
        {
            id: "estimated-cii" as SimulatorType,
            title: "Estimated CII",
            icon: Target,
            color: "bg-blue-500/10 border-blue-500/20",
            iconColor: "text-blue-500",
            description: "Calculate Carbon Intensity Indicator",
            primaryMetric: results.estimatedCII.attainedCII,
            primaryLabel: "Attained CII",
        },
        {
            id: "bio-cii" as SimulatorType,
            title: "Bio CII",
            icon: Leaf,
            color: "bg-green-500/10 border-green-500/20",
            iconColor: "text-green-500",
            description: "Plan biofuel integration for CII improvement",
            primaryMetric: results.bioCII.correctedCII,
            primaryLabel: "Corrected CII",
        },
        {
            id: "eu-ets" as SimulatorType,
            title: "EU ETS",
            icon: Euro,
            color: "bg-purple-500/10 border-purple-500/20",
            iconColor: "text-purple-500",
            description: "European Union Emissions Trading System",
            primaryMetric: results.euETS.euasExposure,
            primaryLabel: "EUAs Exposure",
        },
        {
            id: "fuel-eu-ghg" as SimulatorType,
            title: "Fuel EU GHG",
            icon: Zap,
            color: "bg-orange-500/10 border-orange-500/20",
            iconColor: "text-orange-500",
            description: "Fuel EU Greenhouse Gas regulation",
            primaryMetric: results.fuelEUGHG.ghgIntensity,
            primaryLabel: "GHG Intensity",
        },
    ];

    const isFieldDisabled = voyageSource === "planned";

    const renderDetailView = () => {
        const simulator = simulators.find(s => s.id === activeSimulator);
        if (!simulator) return null;

        switch (activeSimulator) {
            case "estimated-cii":
                return (
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-card-foreground">
                                Input Parameters
                            </h3>
                            <div className="space-y-2">
                                <Label htmlFor="desiredCII">Desired CII (optional)</Label>
                                <Input
                                    id="desiredCII"
                                    value={simulationInputs.desiredCII}
                                    onChange={e =>
                                        handleSimulationInputChange("desiredCII", e.target.value)
                                    }
                                    placeholder="Enter target CII (e.g., A)"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-card-foreground">Results</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-accent/10 rounded-lg">
                                    <div className="text-sm text-muted-foreground">
                                        Attained CII
                                    </div>
                                    <div className="text-xl font-bold text-card-foreground">
                                        {results.estimatedCII.attainedCII}
                                    </div>
                                </div>
                                <div className="p-4 bg-accent/10 rounded-lg">
                                    <div className="text-sm text-muted-foreground">
                                        Total FOC at Sea
                                    </div>
                                    <div className="text-xl font-bold text-card-foreground">
                                        {results.estimatedCII.totalFOCSea}
                                    </div>
                                </div>
                                <div className="p-4 bg-accent/10 rounded-lg">
                                    <div className="text-sm text-muted-foreground">
                                        Total FOC at Port
                                    </div>
                                    <div className="text-xl font-bold text-card-foreground">
                                        {results.estimatedCII.totalFOCPort}
                                    </div>
                                </div>
                                <div className="p-4 bg-accent/10 rounded-lg">
                                    <div className="text-sm text-muted-foreground">
                                        Total CO₂ Emission
                                    </div>
                                    <div className="text-xl font-bold text-card-foreground">
                                        {results.estimatedCII.totalCO2}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case "bio-cii":
                return (
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-card-foreground">
                                Bio Fuel Parameters
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Select Biofuel Supply</Label>
                                    <Select
                                        value={simulationInputs.biofuelSupply}
                                        onValueChange={value =>
                                            handleSimulationInputChange("biofuelSupply", value)
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select biofuel" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {biofuelTypes.map(fuel => (
                                                <SelectItem key={fuel} value={fuel}>
                                                    {fuel}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Desired CII</Label>
                                    <Input
                                        value={simulationInputs.biofuelDesiredCII}
                                        onChange={e =>
                                            handleSimulationInputChange(
                                                "biofuelDesiredCII",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter target CII value"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>EI (gCO2e/MJ)</Label>
                                    <Input
                                        type="number"
                                        step="0.1"
                                        value={simulationInputs.ei}
                                        onChange={e =>
                                            handleSimulationInputChange("ei", e.target.value)
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>LCV (MJ/kg)</Label>
                                    <Input
                                        type="number"
                                        step="0.1"
                                        value={simulationInputs.lcv}
                                        onChange={e =>
                                            handleSimulationInputChange("lcv", e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-card-foreground">
                                Bio CII Results
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-green-500/10 rounded-lg">
                                    <div className="text-sm text-muted-foreground">
                                        Corrected CII
                                    </div>
                                    <div className="text-xl font-bold text-green-600">
                                        {results.bioCII.correctedCII}
                                    </div>
                                </div>
                                <div className="p-4 bg-accent/10 rounded-lg">
                                    <div className="text-sm text-muted-foreground">Total FOC</div>
                                    <div className="text-xl font-bold text-card-foreground">
                                        {results.bioCII.totalFOC}
                                    </div>
                                </div>
                                <div className="p-4 bg-accent/10 rounded-lg">
                                    <div className="text-sm text-muted-foreground">Total CO₂</div>
                                    <div className="text-xl font-bold text-card-foreground">
                                        {results.bioCII.totalCO2}
                                    </div>
                                </div>
                                <div className="p-4 bg-accent/10 rounded-lg">
                                    <div className="text-sm text-muted-foreground">
                                        Original CII
                                    </div>
                                    <div className="text-xl font-bold text-card-foreground">
                                        {results.bioCII.originalCII}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case "eu-ets":
                return (
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-card-foreground">
                                EU ETS Parameters
                            </h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Reporting Year</Label>
                                    <Select
                                        value={simulationInputs.reportingYear}
                                        onValueChange={value =>
                                            handleSimulationInputChange("reportingYear", value)
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="2024">2024</SelectItem>
                                            <SelectItem value="2025">2025</SelectItem>
                                            <SelectItem value="2026">2026</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>EU Relevance at Sea</Label>
                                        <Select
                                            value={simulationInputs.euRelevanceSea}
                                            onValueChange={value =>
                                                handleSimulationInputChange("euRelevanceSea", value)
                                            }
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="EU">EU</SelectItem>
                                                <SelectItem value="Non EU">Non EU</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>EU Relevance at Port</Label>
                                        <Select
                                            value={simulationInputs.euRelevancePort}
                                            onValueChange={value =>
                                                handleSimulationInputChange(
                                                    "euRelevancePort",
                                                    value
                                                )
                                            }
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="EU">EU</SelectItem>
                                                <SelectItem value="Non EU">Non EU</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-card-foreground">
                                EU ETS Results
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-blue-500/10 rounded-lg">
                                    <div className="text-sm text-muted-foreground">
                                        EUAs Exposure
                                    </div>
                                    <div className="text-xl font-bold text-blue-600">
                                        {results.euETS.euasExposure}
                                    </div>
                                </div>
                                <div className="p-4 bg-accent/10 rounded-lg">
                                    <div className="text-sm text-muted-foreground">
                                        CO₂ Emission at Sea
                                    </div>
                                    <div className="text-xl font-bold text-card-foreground">
                                        {results.euETS.co2EmissionSea}
                                    </div>
                                </div>
                                <div className="p-4 bg-accent/10 rounded-lg">
                                    <div className="text-sm text-muted-foreground">
                                        CO₂ Emission at Port
                                    </div>
                                    <div className="text-xl font-bold text-card-foreground">
                                        {results.euETS.co2EmissionPort}
                                    </div>
                                </div>
                                <div className="p-4 bg-accent/10 rounded-lg">
                                    <div className="text-sm text-muted-foreground">
                                        Coverage Required
                                    </div>
                                    <div className="text-xl font-bold text-card-foreground">
                                        {results.euETS.coverageRequired}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case "fuel-eu-ghg":
                return (
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-card-foreground">
                                Fuel EU GHG Parameters
                            </h3>
                            <div className="space-y-2">
                                <Label>Anticipated Fuel Type (Yearly)</Label>
                                <Select
                                    value={simulationInputs.anticipatedFuelType}
                                    onValueChange={value =>
                                        handleSimulationInputChange("anticipatedFuelType", value)
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {fuelTypes.map(fuel => (
                                            <SelectItem key={fuel} value={fuel}>
                                                {fuel}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>RF Wind (%)</Label>
                                        <Input
                                            type="number"
                                            step="0.1"
                                            value={simulationInputs.rfWind}
                                            onChange={e =>
                                                handleSimulationInputChange(
                                                    "rfWind",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>RF OPS (%)</Label>
                                        <Input
                                            type="number"
                                            step="0.1"
                                            value={simulationInputs.rfOps}
                                            onChange={e =>
                                                handleSimulationInputChange("rfOps", e.target.value)
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-card-foreground">
                                Fuel EU Results
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="p-4 bg-purple-500/10 rounded-lg">
                                    <div className="text-sm text-muted-foreground">
                                        GHG Intensity
                                    </div>
                                    <div className="text-xl font-bold text-purple-600">
                                        {results.fuelEUGHG.ghgIntensity}
                                    </div>
                                </div>
                                <div className="p-4 bg-accent/10 rounded-lg">
                                    <div className="text-sm text-muted-foreground">
                                        Compliance Balance
                                    </div>
                                    <div className="text-xl font-bold text-card-foreground">
                                        {results.fuelEUGHG.complianceBalance}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Vessel & Voyage Inputs */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Ship className="h-5 w-5 mr-2" />
                        Vessel & Voyage Inputs
                    </CardTitle>
                    <CardDescription>
                        Select from planned voyages or enter new vessel details and voyage
                        information
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Voyage Source Selection */}
                    <div className="mb-6 p-4 bg-accent/10 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="voyageSource">Voyage Source</Label>
                                <Select
                                    value={voyageSource}
                                    onValueChange={(value: "new" | "planned") => {
                                        setVoyageSource(value);
                                        setSelectedPlannedVoyage("");
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="new">Plan New Voyage</SelectItem>
                                        <SelectItem value="planned">
                                            Select Existing Voyage
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {voyageSource === "planned" && (
                                <div className="space-y-2 -ml-6">
                                    <Label htmlFor="plannedVoyage">Select Planned Voyage</Label>
                                    <Select
                                        value={selectedPlannedVoyage}
                                        onValueChange={setSelectedPlannedVoyage}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose a planned voyage" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {plannedVoyages.map(voyage => (
                                                <SelectItem key={voyage.id} value={voyage.id}>
                                                    <div className="flex items-center space-x-2">
                                                        <MapPin className="h-4 w-4" />
                                                        <span>{voyage.name}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>

                        {voyageSource === "planned" && (
                            <div className="mt-3 p-3 bg-primary/10 rounded-lg">
                                <p className="text-sm text-primary">
                                    ✓ Using planned voyage data. Fields below are auto-populated and
                                    read-only.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="imo">Vessel IMO</Label>
                            <Input
                                id="imo"
                                value={vesselData.imo}
                                onChange={e => handleVesselInputChange("imo", e.target.value)}
                                placeholder="9000002"
                                disabled={isFieldDisabled}
                                className={
                                    isFieldDisabled ? "bg-muted/50 text-muted-foreground" : ""
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name">Vessel Name</Label>
                            <Input
                                id="name"
                                value={vesselData.name}
                                onChange={e => handleVesselInputChange("name", e.target.value)}
                                placeholder="Demo 3"
                                disabled={isFieldDisabled}
                                className={
                                    isFieldDisabled ? "bg-muted/50 text-muted-foreground" : ""
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="vesselType">Vessel Type</Label>
                            <Select
                                value={vesselData.type}
                                onValueChange={value => handleVesselInputChange("type", value)}
                                disabled={isFieldDisabled}
                            >
                                <SelectTrigger
                                    className={
                                        isFieldDisabled ? "bg-muted/50 text-muted-foreground" : ""
                                    }
                                >
                                    <SelectValue placeholder="Select vessel type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {vesselTypes.map(type => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="deadWeight">Dead Weight (MT)</Label>
                            <Input
                                id="deadWeight"
                                type="number"
                                value={vesselData.deadWeight}
                                onChange={e =>
                                    handleVesselInputChange("deadWeight", e.target.value)
                                }
                                placeholder="55000"
                                disabled={isFieldDisabled}
                                className={
                                    isFieldDisabled ? "bg-muted/50 text-muted-foreground" : ""
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="originPort">Origin Port</Label>
                            <Input
                                id="originPort"
                                value={vesselData.originPort}
                                onChange={e =>
                                    handleVesselInputChange("originPort", e.target.value)
                                }
                                placeholder="SGSIN"
                                disabled={isFieldDisabled}
                                className={
                                    isFieldDisabled ? "bg-muted/50 text-muted-foreground" : ""
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="destinationPort">Destination Port</Label>
                            <Input
                                id="destinationPort"
                                value={vesselData.destinationPort}
                                onChange={e =>
                                    handleVesselInputChange("destinationPort", e.target.value)
                                }
                                placeholder="NLRTM"
                                disabled={isFieldDisabled}
                                className={
                                    isFieldDisabled ? "bg-muted/50 text-muted-foreground" : ""
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="totalDistance">Total Distance (nm)</Label>
                            <Input
                                id="totalDistance"
                                type="number"
                                value={vesselData.totalDistance}
                                onChange={e =>
                                    handleVesselInputChange("totalDistance", e.target.value)
                                }
                                placeholder="12500"
                                disabled={isFieldDisabled}
                                className={
                                    isFieldDisabled ? "bg-muted/50 text-muted-foreground" : ""
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="seaHours">Sea Hours</Label>
                            <Input
                                id="seaHours"
                                type="number"
                                value={vesselData.seaHours}
                                onChange={e => handleVesselInputChange("seaHours", e.target.value)}
                                placeholder="850"
                                disabled={isFieldDisabled}
                                className={
                                    isFieldDisabled ? "bg-muted/50 text-muted-foreground" : ""
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="portHours">Port Hours</Label>
                            <Input
                                id="portHours"
                                type="number"
                                value={vesselData.portHours}
                                onChange={e => handleVesselInputChange("portHours", e.target.value)}
                                placeholder="120"
                                disabled={isFieldDisabled}
                                className={
                                    isFieldDisabled ? "bg-muted/50 text-muted-foreground" : ""
                                }
                            />
                        </div>
                    </div>

                    {/* Fuel Inputs */}
                    <div className="mt-6 pt-6 border-t border-border">
                        <h3 className="text-lg font-medium text-card-foreground mb-4 flex items-center">
                            <Fuel className="h-4 w-4 mr-2" />
                            Fuel Configuration
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h4 className="font-medium text-card-foreground">
                                    Fuel Type at Sea
                                </h4>
                                <div className="space-y-2">
                                    <Label>Select fuel type</Label>
                                    <Select
                                        value={vesselData.fuelTypeAtSea}
                                        onValueChange={value =>
                                            handleVesselInputChange("fuelTypeAtSea", value)
                                        }
                                        disabled={isFieldDisabled}
                                    >
                                        <SelectTrigger
                                            className={
                                                isFieldDisabled
                                                    ? "bg-muted/50 text-muted-foreground"
                                                    : ""
                                            }
                                        >
                                            <SelectValue placeholder="Select fuel type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {fuelTypes.map(fuel => (
                                                <SelectItem key={fuel} value={fuel}>
                                                    {fuel}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Amount at Sea (mt/hr)</Label>
                                    <Input
                                        type="number"
                                        step="0.1"
                                        value={vesselData.amountAtSea}
                                        onChange={e =>
                                            handleVesselInputChange("amountAtSea", e.target.value)
                                        }
                                        placeholder="0.0"
                                        disabled={isFieldDisabled}
                                        className={
                                            isFieldDisabled
                                                ? "bg-muted/50 text-muted-foreground"
                                                : ""
                                        }
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-medium text-card-foreground">
                                    Fuel Type at Port
                                </h4>
                                <div className="space-y-2">
                                    <Label>Select fuel type</Label>
                                    <Select
                                        value={vesselData.fuelTypeAtPort}
                                        onValueChange={value =>
                                            handleVesselInputChange("fuelTypeAtPort", value)
                                        }
                                        disabled={isFieldDisabled}
                                    >
                                        <SelectTrigger
                                            className={
                                                isFieldDisabled
                                                    ? "bg-muted/50 text-muted-foreground"
                                                    : ""
                                            }
                                        >
                                            <SelectValue placeholder="Select fuel type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {fuelTypes.map(fuel => (
                                                <SelectItem key={fuel} value={fuel}>
                                                    {fuel}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Amount at Port (mt/hr)</Label>
                                    <Input
                                        type="number"
                                        step="0.1"
                                        value={vesselData.amountAtPort}
                                        onChange={e =>
                                            handleVesselInputChange("amountAtPort", e.target.value)
                                        }
                                        placeholder="0.0"
                                        disabled={isFieldDisabled}
                                        className={
                                            isFieldDisabled
                                                ? "bg-muted/50 text-muted-foreground"
                                                : ""
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Run Simulation Button */}
                    <div className="flex justify-center mt-8">
                        <Button
                            onClick={simulateResults}
                            disabled={isSimulating}
                            className="px-8 py-3 text-lg"
                        >
                            {isSimulating ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Simulating...
                                </>
                            ) : (
                                <>
                                    <Calculator className="h-5 w-5 mr-2" />
                                    Run Simulation
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Interactive Summary Cards */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Calculator className="h-5 w-5 mr-2" />
                        Emission Simulators
                    </CardTitle>
                    <CardDescription>
                        Select a simulator to view detailed inputs and results
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {simulators.map(simulator => (
                            <div
                                key={simulator.id}
                                onClick={() => setActiveSimulator(simulator.id)}
                                className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 hover:scale-105 ${
                                    activeSimulator === simulator.id
                                        ? `${simulator.color} ring-2 ring-offset-2 ring-current`
                                        : "border-border hover:bg-accent/5"
                                }`}
                            >
                                <div className="flex flex-col justify-between items-center text-center gap-2">
                                    <div
                                        className={`p-2 rounded-lg ${simulator.iconColor} bg-current/10`}
                                    >
                                        <simulator.icon
                                            className={`h-5 w-5 ${simulator.iconColor}`}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0 ">
                                        <h3 className="font-medium text-card-foreground text-sm">
                                            {simulator.title}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Dynamic Detail View */}
                    <div className="border border-border rounded-xl p-6 bg-accent/5">
                        <div className="flex items-center space-x-3 mb-6">
                            {(() => {
                                const simulator = simulators.find(s => s.id === activeSimulator);
                                return simulator ? (
                                    <>
                                        <div
                                            className={`p-3 rounded-lg ${simulator.iconColor} bg-current/10`}
                                        >
                                            <simulator.icon
                                                className={`h-6 w-6 ${simulator.iconColor}`}
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-card-foreground">
                                                {simulator.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {simulator.description}
                                            </p>
                                        </div>
                                    </>
                                ) : null;
                            })()}
                        </div>

                        {renderDetailView()}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
