import { useState } from "react";
import {
    Bell,
    X,
    AlertTriangle,
    Info,
    AlertCircle,
    Ship,
    TrendingUp,
    FileText,
} from "lucide-react";

interface Notification {
    id: string;
    title: string;
    message: string;
    type: "warning" | "destructive" | "info";
    timestamp: Date;
    isRead: boolean;
    vessel?: string;
    category: string;
}

export function Notifications() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: "1",
            title: "CII Compliance Alert",
            message: "MV Aurora approaching CII threshold in 14 days. Immediate action required.",
            type: "destructive",
            timestamp: new Date(Date.now() - 5 * 60 * 1000),
            isRead: false,
            vessel: "MV Aurora",
            category: "Compliance",
        },
        {
            id: "2",
            title: "Route Optimization Available",
            message: "MV Orion can save 30% fuel by reducing speed 1.2 knots on current route.",
            type: "info",
            timestamp: new Date(Date.now() - 15 * 60 * 1000),
            isRead: false,
            vessel: "MV Orion",
            category: "Optimization",
        },
        {
            id: "3",
            title: "Fuel Efficiency Improved",
            message: "MV Phoenix achieved 12% fuel efficiency improvement this week.",
            type: "info",
            timestamp: new Date(Date.now() - 30 * 60 * 1000),
            isRead: true,
            vessel: "MV Phoenix",
            category: "Performance",
        },
        {
            id: "4",
            title: "Weather Alert",
            message: "Severe weather conditions expected on Rotterdam-Singapore route.",
            type: "warning",
            timestamp: new Date(Date.now() - 45 * 60 * 1000),
            isRead: false,
            category: "Weather",
        },
        {
            id: "5",
            title: "Maintenance Due",
            message: "MV Vega scheduled maintenance due in 3 days.",
            type: "warning",
            timestamp: new Date(Date.now() - 60 * 60 * 1000),
            isRead: false,
            vessel: "MV Vega",
            category: "Maintenance",
        },
        {
            id: "6",
            title: "Emissions Report Ready",
            message: "Q4 2024 emissions report has been generated and is ready for review.",
            type: "info",
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            isRead: true,
            category: "Reports",
        },
        {
            id: "7",
            title: "Critical Engine Alert",
            message: "MV Odyssey main engine temperature exceeding normal limits.",
            type: "destructive",
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
            isRead: false,
            vessel: "MV Odyssey",
            category: "Engine",
        },
        {
            id: "8",
            title: "Port Arrival Confirmed",
            message: "MV Titan successfully arrived at Hamburg Port ahead of schedule.",
            type: "info",
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
            isRead: true,
            vessel: "MV Titan",
            category: "Navigation",
        },
    ]);

    const unreadCount = notifications.filter(n => !n.isRead).length;
    const readCount = notifications.filter(n => n.isRead).length;
    const unreadNotifications = notifications.filter(n => !n.isRead);

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case "destructive":
                return AlertCircle;
            case "warning":
                return AlertTriangle;
            case "info":
                return Info;
            default:
                return Info;
        }
    };

    const getNotificationColors = (type: string) => {
        switch (type) {
            case "destructive":
                return {
                    bg: "bg-destructive/10 border-destructive/20",
                    icon: "text-destructive",
                    dot: "bg-destructive",
                };
            case "warning":
                return {
                    bg: "bg-orange-500/10 border-orange-500/20",
                    icon: "text-orange-500",
                    dot: "bg-orange-500",
                };
            case "info":
                return {
                    bg: "bg-primary/10 border-primary/20",
                    icon: "text-primary",
                    dot: "bg-primary",
                };
            default:
                return {
                    bg: "bg-muted/10 border-muted/20",
                    icon: "text-muted-foreground",
                    dot: "bg-muted-foreground",
                };
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "Compliance":
            case "Engine":
                return AlertTriangle;
            case "Optimization":
            case "Performance":
                return TrendingUp;
            case "Navigation":
                return Ship;
            case "Reports":
                return FileText;
            default:
                return Info;
        }
    };

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(notification =>
                notification.id === id ? { ...notification, isRead: true } : notification
            )
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(notification => ({ ...notification, isRead: true })));
    };

    const formatTimeAgo = (timestamp: Date) => {
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return "Just now";
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;

        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays}d ago`;
    };

    return (
        <>
            {/* Notification Bell Button */}
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 hover:bg-accent rounded-lg transition-colors relative"
                >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 bg-destructive rounded-full flex items-center justify-center text-xs text-destructive-foreground font-bold animate-pulse">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                </button>

                {/* Notification Panel */}
                {isOpen && (
                    <div className="absolute top-full right-0 mt-2 w-96 max-h-[600px] bg-card border border-border rounded-xl shadow-xl z-50 slide-up overflow-hidden">
                        {/* Header */}
                        <div className="p-4 border-b border-border bg-marine-gradient text-white">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-2">
                                    <Bell className="h-5 w-5" />
                                    <h3 className="text-lg font-semibold">Notifications</h3>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 hover:bg-white/20 rounded transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex space-x-4">
                                    <div className="flex items-center space-x-1">
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                        <span>{unreadCount} Unread</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                                        <span>{readCount} Read</span>
                                    </div>
                                </div>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-xs hover:bg-white/20 px-2 py-1 rounded transition-colors"
                                    >
                                        Mark all read
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Unread Notifications Section */}
                        {unreadNotifications.length > 0 && (
                            <div className="p-4 border-b border-border bg-accent/20">
                                <h4 className="text-sm font-semibold text-card-foreground mb-3 flex items-center">
                                    <div className="w-2 h-2 bg-destructive rounded-full mr-2 animate-pulse"></div>
                                    Unread Messages ({unreadCount})
                                </h4>
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {unreadNotifications.map(notification => {
                                        const colors = getNotificationColors(notification.type);
                                        const Icon = getNotificationIcon(notification.type);
                                        const CategoryIcon = getCategoryIcon(notification.category);

                                        return (
                                            <div
                                                key={notification.id}
                                                className={`p-3 rounded-lg border cursor-pointer hover:scale-[1.02] transition-all duration-200 ${colors.bg}`}
                                                onClick={() => markAsRead(notification.id)}
                                            >
                                                <div className="flex items-start space-x-3">
                                                    <div
                                                        className={`p-1 rounded ${colors.icon} bg-current/10 flex-shrink-0`}
                                                    >
                                                        <Icon className="h-4 w-4" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <h5 className="text-sm font-medium text-card-foreground truncate">
                                                                {notification.title}
                                                            </h5>
                                                            <div
                                                                className={`w-2 h-2 rounded-full ${colors.dot} flex-shrink-0`}
                                                            ></div>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                                                            {notification.message}
                                                        </p>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center space-x-2">
                                                                {notification.vessel && (
                                                                    <div className="flex items-center space-x-1">
                                                                        <Ship className="h-3 w-3 text-muted-foreground" />
                                                                        <span className="text-xs text-muted-foreground">
                                                                            {notification.vessel}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                <div className="flex items-center space-x-1">
                                                                    <CategoryIcon className="h-3 w-3 text-muted-foreground" />
                                                                    <span className="text-xs text-muted-foreground">
                                                                        {notification.category}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <span className="text-xs text-muted-foreground">
                                                                {formatTimeAgo(
                                                                    notification.timestamp
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="p-4 border-t border-border bg-accent/10">
                            <div className="text-center">
                                <button className="text-sm text-primary hover:text-primary/80 transition-colors">
                                    View All Notifications
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
