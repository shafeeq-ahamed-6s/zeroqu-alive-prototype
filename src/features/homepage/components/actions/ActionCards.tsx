import { AlertTriangle, TrendingUp, Bell } from "lucide-react";

export function ActionCards() {
    const cards = [
        {
            title: "Attention Needed",
            subtitle: "2 vessels approaching CII thresholds",
            icon: AlertTriangle,
            color: "bg-red-500/10 border-red-500/20",
            iconColor: "text-red-500",
        },
        {
            title: "Continue Where You Left Off",
            subtitle: "Continue MV Aurora emissions review",
            icon: TrendingUp,
            color: "bg-blue-500/10 border-blue-500/20",
            iconColor: "text-blue-500",
        },
        {
            title: "Insights, Alerts & Notifications",
            subtitle: "5 new insights available",
            icon: Bell,
            color: "bg-amber-500/10 border-amber-500/20",
            iconColor: "text-amber-500",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cards.map((card, index) => (
                <div
                    key={index}
                    className={`p-6 mx-2 rounded-xl border ${card.color} hover:scale-105 transition-all duration-300 cursor-pointer`}
                >
                    <div className="flex items-start space-x-3">
                        <div className={`p-2 mt-1.5 rounded-lg ${card.iconColor} bg-current/10`}>
                            <card.icon className={`h-5 w-5 ${card.iconColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-card-foreground text-lg">
                                {card.title}
                            </h3>
                            <p className="text-muted-foreground text-sm mt-1">{card.subtitle}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
