import { useState, useEffect } from "react";
import { Calculator, Ship, Fuel, Target, Leaf, Euro, Zap } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

export function EmissionSimulation() {
    const [vesselData, setVesselData] = useState<VesselData>({
        imo: "9000002",
        name: "Demo 3",
        type: "Bulk Carrier",
        deadWeight: "55000",
        originPort: "SGSIN",
        destinationPort: "NLRTM",
        totalDistance: "12500",
        seaHours: "850",
        portHours: "120",
        fuelTypeAtSea: "",
        amountAtSea: "0.0",
        fuelTypeAtPort: "",
        amountAtPort: "0.0",
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
    const [activeSimulator, setActiveSimulator] = useState("estimated-cii");

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

    return (
        <div className="space-y-6">
            {/* Vessel & Voyage Inputs */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Ship className="h-5 w-5 mr-2" />
                        Vessel & Voyage Inputs
                    </CardTitle>
                    <CardDescription>
                        Enter vessel details and voyage information for emission calculations
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="imo">Vessel IMO/Name</Label>
                            <Input
                                id="imo"
                                value={`${vesselData.imo} (${vesselData.name})`}
                                onChange={e => {
                                    const [imo, name] = e.target.value.split(" (");
                                    handleVesselInputChange("imo", imo);
                                    handleVesselInputChange("name", name?.replace(")", "") || "");
                                }}
                                placeholder="9000002 (Demo 3)"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="vesselType">Vessel Type</Label>
                            <Select
                                value={vesselData.type}
                                onValueChange={value => handleVesselInputChange("type", value)}
                            >
                                <SelectTrigger>
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
                                placeholder="SGSIN (Singapore)"
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
                                placeholder="NLRTM (Rotterdam)"
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
                                    >
                                        <SelectTrigger>
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
                                    >
                                        <SelectTrigger>
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
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Simulation Types */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Calculator className="h-5 w-5 mr-2" />
                        Emission Simulators
                    </CardTitle>
                    <CardDescription>
                        Unified calculators for CII, EU ETS, and Fuel EU GHG analysis. Enter data
                        once and see all results.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs
                        value={activeSimulator}
                        onValueChange={setActiveSimulator}
                        className="w-full"
                    >
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="estimated-cii" className="flex items-center gap-2">
                                <Target className="h-4 w-4" />
                                Estimated CII
                            </TabsTrigger>
                            <TabsTrigger value="bio-cii" className="flex items-center gap-2">
                                <Leaf className="h-4 w-4" />
                                Bio CII Planner
                            </TabsTrigger>
                            <TabsTrigger value="eu-ets" className="flex items-center gap-2">
                                <Euro className="h-4 w-4" />
                                EU ETS
                            </TabsTrigger>
                            <TabsTrigger value="fuel-eu-ghg" className="flex items-center gap-2">
                                <Zap className="h-4 w-4" />
                                Fuel EU GHG
                            </TabsTrigger>
                        </TabsList>

                        {/* Estimated CII */}
                        <TabsContent value="estimated-cii" className="mt-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                                                handleSimulationInputChange(
                                                    "desiredCII",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter target CII (e.g., A)"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-card-foreground">
                                        Results
                                    </h3>
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
                        </TabsContent>

                        {/* Bio CII Planner */}
                        <TabsContent value="bio-cii" className="mt-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-card-foreground">
                                        Bio Fuel Parameters
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Select Biofuel Supply</Label>
                                            <Select
                                                value={simulationInputs.biofuelSupply}
                                                onValueChange={value =>
                                                    handleSimulationInputChange(
                                                        "biofuelSupply",
                                                        value
                                                    )
                                                }
                                            >
                                                <SelectTrigger>
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
                                                    handleSimulationInputChange(
                                                        "ei",
                                                        e.target.value
                                                    )
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
                                                    handleSimulationInputChange(
                                                        "lcv",
                                                        e.target.value
                                                    )
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
                                            <div className="text-sm text-muted-foreground">
                                                Total FOC
                                            </div>
                                            <div className="text-xl font-bold text-card-foreground">
                                                {results.bioCII.totalFOC}
                                            </div>
                                        </div>
                                        <div className="p-4 bg-accent/10 rounded-lg">
                                            <div className="text-sm text-muted-foreground">
                                                Total CO₂
                                            </div>
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
                        </TabsContent>

                        {/* EU ETS */}
                        <TabsContent value="eu-ets" className="mt-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                                                    handleSimulationInputChange(
                                                        "reportingYear",
                                                        value
                                                    )
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="2024">2024</SelectItem>
                                                    <SelectItem value="2025">2025</SelectItem>
                                                    <SelectItem value="2026">2026</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>EU Relevance at Sea</Label>
                                            <Select
                                                value={simulationInputs.euRelevanceSea}
                                                onValueChange={value =>
                                                    handleSimulationInputChange(
                                                        "euRelevanceSea",
                                                        value
                                                    )
                                                }
                                            >
                                                <SelectTrigger>
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
                                                <SelectTrigger>
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
                        </TabsContent>

                        {/* Fuel EU GHG */}
                        <TabsContent value="fuel-eu-ghg" className="mt-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-card-foreground">
                                        Fuel EU GHG Parameters
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Anticipated Fuel Type (Yearly)</Label>
                                            <Select
                                                value={simulationInputs.anticipatedFuelType}
                                                onValueChange={value =>
                                                    handleSimulationInputChange(
                                                        "anticipatedFuelType",
                                                        value
                                                    )
                                                }
                                            >
                                                <SelectTrigger>
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
                                        </div>
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
                                                    handleSimulationInputChange(
                                                        "rfOps",
                                                        e.target.value
                                                    )
                                                }
                                            />
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
                        </TabsContent>
                    </Tabs>

                    {/* Simulate Button */}
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
        </div>
    );
}
