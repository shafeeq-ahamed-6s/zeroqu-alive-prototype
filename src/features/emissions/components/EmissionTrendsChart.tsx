"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartData = [
    { month: "Jan", cii: 4.2, co2: 2847, euEts: 1138, fuelEu: 89.3 },
    { month: "Feb", cii: 4.1, co2: 2756, euEts: 1102, fuelEu: 88.7 },
    { month: "Mar", cii: 4.3, co2: 2923, euEts: 1169, fuelEu: 90.1 },
    { month: "Apr", cii: 3.9, co2: 2634, euEts: 1054, fuelEu: 87.2 },
    { month: "May", cii: 4.0, co2: 2698, euEts: 1079, fuelEu: 88.1 },
    { month: "Jun", cii: 3.8, co2: 2567, euEts: 1027, fuelEu: 86.5 },
    { month: "Jul", cii: 4.1, co2: 2789, euEts: 1116, fuelEu: 88.9 },
    { month: "Aug", cii: 3.7, co2: 2498, euEts: 999, fuelEu: 85.8 },
    { month: "Sep", cii: 3.9, co2: 2645, euEts: 1058, fuelEu: 87.4 },
    { month: "Oct", cii: 4.0, co2: 2712, euEts: 1085, fuelEu: 88.2 },
    { month: "Nov", cii: 3.8, co2: 2589, euEts: 1036, fuelEu: 86.9 },
    { month: "Dec", cii: 3.6, co2: 2456, euEts: 982, fuelEu: 85.1 },
];

const chartConfig = {
    cii: {
        label: "CII Rating",
        color: "hsl(var(--chart-1))",
    },
    co2: {
        label: "CO₂ Emissions (MT)",
        color: "hsl(var(--chart-2))",
    },
    euEts: {
        label: "EU ETS (MT)",
        color: "hsl(var(--chart-3))",
    },
    fuelEu: {
        label: "Fuel EU GHG",
        color: "hsl(var(--chart-4))",
    },
} satisfies ChartConfig;

export function EmissionTrendsChart() {
    const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>("co2");

    const total = React.useMemo(
        () => ({
            cii: chartData.reduce((acc, curr) => acc + curr.cii, 0) / chartData.length,
            co2: chartData.reduce((acc, curr) => acc + curr.co2, 0),
            euEts: chartData.reduce((acc, curr) => acc + curr.euEts, 0),
            fuelEu: chartData.reduce((acc, curr) => acc + curr.fuelEu, 0) / chartData.length,
        }),
        []
    );

    const getUnit = (chart: keyof typeof chartConfig) => {
        switch (chart) {
            case "cii":
                return "avg";
            case "co2":
                return "MT";
            case "euEts":
                return "MT";
            case "fuelEu":
                return "avg";
            default:
                return "";
        }
    };

    const getDisplayValue = (chart: keyof typeof chartConfig) => {
        const value = total[chart];
        switch (chart) {
            case "cii":
            case "fuelEu":
                return value.toFixed(1);
            default:
                return Math.round(value).toLocaleString();
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
                    <CardTitle>Emission Trends</CardTitle>
                    <CardDescription>
                        Monthly emission metrics and compliance indicators for 2024
                    </CardDescription>
                </div>
                <div className="flex">
                    {["cii", "co2", "euEts", "fuelEu"].map(key => {
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
                                    {getDisplayValue(chart)}
                                    <span className="text-sm text-muted-foreground ml-1">
                                        {getUnit(chart)}
                                    </span>
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
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Line
                            dataKey={activeChart}
                            type="monotone"
                            stroke={chartConfig[activeChart].color}
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}