import { AlertTriangle, Droplets, Target } from "lucide-react";
import { Linechart } from "../components/FuelConsumptionChart";

export function Overview() {
    const summaryCards = [
        {
            title: "Anomalies Detected",
            value: "3",
            subtitle: "Requires attention",
            icon: AlertTriangle,
            color: "bg-destructive/10 border-destructive/20",
            iconColor: "text-destructive",
            trend: "+2 from yesterday",
        },
        {
            title: "Average Fuel Consumption",
            value: "24.5",
            subtitle: "MT/day",
            icon: Droplets,
            color: "bg-orange-500/10 border-orange-500/20",
            iconColor: "text-orange-500",
            trend: "-2.3% vs last week",
        },
        {
            title: "Average Speed",
            value: "21",
            subtitle: "knots",
            icon: Target,
            color: "bg-purple-500/10 border-purple-500/20",
            iconColor: "text-purple-500",
            trend: "+0.5 knots from last week",
        },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

            <div className="space-y-6">
                <Linechart />
            </div>
        </div>
    );
}
