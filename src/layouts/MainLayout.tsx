import * as React from "react";
import SideBar from "@/components/navigation/sidebar";
import TopBar from "@/components/navigation/topbar";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ChartLine, Settings2, Compass, Target } from "lucide-react";
import { Outlet } from "react-router";
import ZeroquLogo from "@/assets/ZeroquLogo.png";
import { Chatbot } from "@/components/chatbot/chatbot";

export interface BreadcrumbItem {
    title: string;
    href?: string;
    isCurrentPage?: boolean;
}

export interface UserProfile {
    name: string;
    email: string;
    avatarUrl?: string;
    initials: string;
}

export interface MainLayoutProps {
    breadcrumbs?: BreadcrumbItem[];
    user?: UserProfile;
    onAskAI?: () => void;
    onProfileAction?: (action: string) => void;
    sidebarDefaultOpen?: boolean;
    enableSidebarHovering?: boolean;
    className?: string;
    children?: React.ReactNode;
}

export default function MainLayout({
    breadcrumbs: propBreadcrumbs,
    sidebarDefaultOpen = false,
    enableSidebarHovering = false,
    className,
}: MainLayoutProps) {
    // Use automatic breadcrumbs from URL, but allow prop override
    const urlBreadcrumbs = useBreadcrumbs();
    const breadcrumbs = propBreadcrumbs || urlBreadcrumbs;

    const data = {
        navMain: [
            {
                title: "Fleet 360",
                url: "/",
                icon: Compass,
                isActive: true,
                items: [], // Add empty items array
            },
            {
                title: "Fleet Performance Analytics",
                url: "/performance",
                icon: ChartLine,
                items: [
                    {
                        title: "Overview",
                        url: "/performance/overview",
                    },
                    {
                        title: "Energy Management",
                        url: "/performance/energy-management",
                    },
                    {
                        title: "Propulsion",
                        url: "/performance/propulsion",
                    },
                    {
                        title: "Aux Engines",
                        url: "/performance/aux-engines",
                    },
                    {
                        title: "Boiler",
                        url: "/performance/boiler",
                    },
                    {
                        title: "Basic Load",
                        url: "/performance/basic-load",
                    },
                    {
                        title: "CP Performance",
                        url: "/performance/cp-performance",
                    },
                    {
                        title: "Warning & Triggers",
                        url: "/performance/warning-triggers",
                    },
                ],
            },
            {
                title: "Fleet Emissions",
                url: "/emissions",
                icon: Target,
                items: [
                    {
                        title: "Overview",
                        url: "/emissions/overview",
                    },
                    {
                        title: "Vessel",
                        url: "/emissions/vessel",
                    },
                    {
                        title: "CII Analytics",
                        url: "/emissions/cii-analytics",
                    },
                    {
                        title: "EU Emission",
                        url: "/emissions/eu-emission",
                    },
                    {
                        title: "Emission Calculator",
                        url: "/emissions/emission-calculator",
                    },
                    {
                        title: "Reports",
                        url: "/emissions/reports",
                    },
                ],
            },
            {
                title: "Settings",
                url: "/coming-soon",
                icon: Settings2,
                items: [
                    {
                        title: "General",
                        url: "/coming-soon",
                    },
                    {
                        title: "Team",
                        url: "/coming-soon",
                    },
                    {
                        title: "Billing",
                        url: "/coming-soon",
                    },
                    {
                        title: "Limits",
                        url: "/coming-soon",
                    },
                ],
            },
        ],
        brand: {
            href: "/",
            imgSrc: ZeroquLogo,
            imgAlt: "Zeroqu Logo",
            title: "Zeroqu",
            subtitle: "Prototype",
        },
    };

    return (
        <SidebarProvider defaultOpen={sidebarDefaultOpen} enableHovering={enableSidebarHovering}>
            <SideBar data={data} />
            <SidebarInset className={className}>
                <TopBar breadcrumbs={breadcrumbs} />

                {/* Main content area */}
                <main className="flex-1 overflow-auto">
                    <Outlet />
                </main>
                <Chatbot />
            </SidebarInset>
        </SidebarProvider>
    );
}
