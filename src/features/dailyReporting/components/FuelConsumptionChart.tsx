"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart";
// This function marks anomalies directly in the data

const chartData = [
    { date: "2025-08-01", mainEngine: 1200, auxiliaryEngine: 350, boiler: 80 },
    { date: "2025-08-02", mainEngine: 1150, auxiliaryEngine: 320, boiler: 75 },
    { date: "2025-08-03", mainEngine: 1250, auxiliaryEngine: 360, boiler: 85 },
    {
        date: "2025-08-04",
        mainEngine: 1180,
        auxiliaryEngine: 330,
        boiler: 70,
        mainEngineAnomaly: false,
        auxiliaryEngineAnomaly: false,
        boilerAnomaly: false,
    },
    { date: "2025-08-05", mainEngine: 1300, auxiliaryEngine: 380, boiler: 90 },
    {
        date: "2025-08-06",
        mainEngine: 1500, // Anomaly
        auxiliaryEngine: 350,
        boiler: 82,
        mainEngineAnomaly: true,
        auxiliaryEngineAnomaly: false,
        boilerAnomaly: false,
    },
    { date: "2025-08-07", mainEngine: 1220, auxiliaryEngine: 340, boiler: 78 },
    { date: "2025-08-08", mainEngine: 1350, auxiliaryEngine: 370, boiler: 95 },
    {
        date: "2025-08-09",
        mainEngine: 1100,
        auxiliaryEngine: 510, // Anomaly
        boiler: 65,
        mainEngineAnomaly: false,
        auxiliaryEngineAnomaly: true,
        boilerAnomaly: false,
    },
    { date: "2025-08-10", mainEngine: 1240, auxiliaryEngine: 345, boiler: 80 },
    { date: "2025-08-11", mainEngine: 1280, auxiliaryEngine: 355, boiler: 83 },
    { date: "2025-08-12", mainEngine: 1230, auxiliaryEngine: 335, boiler: 76 },
    {
        date: "2025-08-13",
        mainEngine: 1320,
        auxiliaryEngine: 365,
        boiler: 140, // Anomaly
        mainEngineAnomaly: false,
        auxiliaryEngineAnomaly: false,
        boilerAnomaly: true,
    },
    { date: "2025-08-14", mainEngine: 1190, auxiliaryEngine: 325, boiler: 72 },
    { date: "2025-08-15", mainEngine: 1210, auxiliaryEngine: 340, boiler: 79 },
    { date: "2025-08-16", mainEngine: 1260, auxiliaryEngine: 350, boiler: 84 },
    { date: "2025-08-17", mainEngine: 1340, auxiliaryEngine: 375, boiler: 93 },
    {
        date: "2025-08-18",
        mainEngine: 980, // Anomaly
        auxiliaryEngine: 360,
        boiler: 87,
        mainEngineAnomaly: true,
        auxiliaryEngineAnomaly: false,
        boilerAnomaly: false,
    },
    { date: "2025-08-19", mainEngine: 1170, auxiliaryEngine: 330, boiler: 74 },
    { date: "2025-08-20", mainEngine: 1130, auxiliaryEngine: 315, boiler: 68 },
    { date: "2025-08-21", mainEngine: 1200, auxiliaryEngine: 340, boiler: 77 },
    {
        date: "2025-08-22",
        mainEngine: 1250,
        auxiliaryEngine: 450, // Anomaly
        boiler: 81,
        mainEngineAnomaly: false,
        auxiliaryEngineAnomaly: true,
        boilerAnomaly: false,
    },
    { date: "2025-08-23", mainEngine: 1180, auxiliaryEngine: 330, boiler: 75 },
    { date: "2025-08-24", mainEngine: 1310, auxiliaryEngine: 365, boiler: 89 },
    {
        date: "2025-08-25",
        mainEngine: 1570, // Anomaly
        auxiliaryEngine: 350,
        boiler: 125, // Anomaly
        mainEngineAnomaly: true,
        auxiliaryEngineAnomaly: false,
        boilerAnomaly: true,
    },
    { date: "2025-08-26", mainEngine: 1150, auxiliaryEngine: 320, boiler: 70 },
    { date: "2025-08-27", mainEngine: 1290, auxiliaryEngine: 370, boiler: 90 },
    { date: "2025-08-28", mainEngine: 1170, auxiliaryEngine: 325, boiler: 73 },
    { date: "2025-08-29", mainEngine: 1270, auxiliaryEngine: 355, boiler: 85 },
    { date: "2025-08-30", mainEngine: 1330, auxiliaryEngine: 380, boiler: 94 },
];

const chartConfig = {
    consumption: {
        label: "Fuel Consumption",
    },
    mainEngine: {
        label: "Main Engine",
        color: "var(--chart-1)",
    },
    auxiliaryEngine: {
        label: "Auxiliary Engine",
        color: "var(--chart-1)",
    },
    boiler: {
        label: "Boiler",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig;

// Custom dot renderer for showing anomalies
interface DotProps {
    cx?: number;
    cy?: number;
    payload?: Record<string, unknown>;
    dataKey?: string;
}

const CustomDot = (props: DotProps) => {
    const { cx, cy, payload, dataKey } = props;
    if (!cx || !cy || !payload || !dataKey) return null;

    const anomalyKey = `${dataKey}Anomaly`;
    const isAnomaly = payload[anomalyKey] as boolean;

    if (isAnomaly) {
        return (
            <g transform={`translate(${cx},${cy})`}>
                <circle r={6} fill="var(--destructive)" stroke="white" strokeWidth={2} />
            </g>
        );
    }

    return null; // Don't render dots for normal points
};

export function Linechart() {
    const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>("mainEngine");

    const total = React.useMemo(
        () => ({
            mainEngine: chartData.reduce((acc, curr) => acc + curr.mainEngine, 0),
            auxiliaryEngine: chartData.reduce((acc, curr) => acc + curr.auxiliaryEngine, 0),
            boiler: chartData.reduce((acc, curr) => acc + curr.boiler, 0),
        }),
        []
    );

    return (
        <Card className="py-4 sm:py-0">
            <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
                    <CardTitle>Fuel Consumption Anomaly Detection</CardTitle>
                    <CardDescription>
                        Daily consumption for August 2025 (in liters) with anomaly detection
                    </CardDescription>
                    <div className="flex items-center mt-2 gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <span className="inline-block w-3 h-3 rounded-full bg-destructive"></span>
                            Anomaly Detected
                        </span>
                    </div>
                </div>
                <div className="flex">
                    {["mainEngine", "auxiliaryEngine", "boiler"].map(key => {
                        const chart = key as keyof typeof chartConfig;
                        return (
                            <button
                                key={chart}
                                data-active={activeChart === chart}
                                className="data-[active=true]:bg-muted/50 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                                onClick={() => setActiveChart(chart)}
                            >
                                <span className="text-muted-foreground text-xs">
                                    {chartConfig[chart].label}
                                </span>
                                <span className="text-lg leading-none font-bold sm:text-3xl">
                                    {Math.round(
                                        total[key as keyof typeof total] / chartData.length
                                    ).toLocaleString()}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </CardHeader>
            <CardContent className="px-2 sm:p-6">
                <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                    <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={value => {
                                const date = new Date(value);
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                });
                            }}
                        />
                        <ChartTooltip
                            content={props => {
                                const { active, payload, label } = props;

                                if (active && payload && payload.length) {
                                    const dataKey = payload[0].dataKey as string;
                                    const anomalyKey = `${dataKey}Anomaly`;
                                    const isAnomaly = payload[0].payload[anomalyKey];

                                    return (
                                        <div className="rounded-md border bg-background p-2 shadow-md">
                                            <div className="mb-2 font-medium">
                                                {new Date(label).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center justify-between gap-8">
                                                    <span className="text-muted-foreground">
                                                        {
                                                            chartConfig[
                                                                dataKey as keyof typeof chartConfig
                                                            ].label
                                                        }
                                                        :
                                                    </span>
                                                    <span>
                                                        {Number(payload[0].value).toLocaleString()}{" "}
                                                        liters
                                                    </span>
                                                </div>
                                                {isAnomaly && (
                                                    <div className="mt-1 text-xs text-destructive font-semibold">
                                                        ⚠️ Anomaly Detected
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Line
                            dataKey={activeChart}
                            type="monotone"
                            stroke={
                                activeChart === "consumption"
                                    ? "var(--chart-1)"
                                    : (chartConfig[activeChart].color as string)
                            }
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 6 }}
                            // @ts-expect-error - recharts typing issue
                            dot={<CustomDot />}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
