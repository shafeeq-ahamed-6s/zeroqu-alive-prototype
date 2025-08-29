import * as React from "react";
import SideBar from "@/components/navigation/sidebar";
import TopBar from "@/components/navigation/topbar";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Shield, Users, Wrench, UserCheck, ShoppingCart, Settings2 } from "lucide-react";
import { Outlet } from "react-router";
import DewDropSmall from "@/assets/dewdropSmall.png";

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
    onAskAI,
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
                title: "Governance",
                url: "/coming-soon",
                icon: Shield,
                isActive: true,
                items: [
                    {
                        title: "Policies",
                        url: "/coming-soon",
                    },
                    {
                        title: "Compliance",
                        url: "/coming-soon",
                    },
                    {
                        title: "Risk Management",
                        url: "/coming-soon",
                    },
                ],
            },
            {
                title: "Advisory",
                url: "/coming-soon",
                icon: Users,
                items: [
                    {
                        title: "Consultants",
                        url: "/coming-soon",
                    },
                    {
                        title: "Expert Network",
                        url: "/coming-soon",
                    },
                    {
                        title: "Strategy",
                        url: "/coming-soon",
                    },
                ],
            },
            {
                title: "Implementation",
                url: "/coming-soon",
                icon: Wrench,
                items: [
                    {
                        title: "Projects",
                        url: "/coming-soon",
                    },
                    {
                        title: "Workflows",
                        url: "/coming-soon",
                    },
                    {
                        title: "Deployment",
                        url: "/coming-soon",
                    },
                ],
            },
            {
                title: "Talent",
                url: "/coming-soon",
                icon: UserCheck,
                items: [
                    {
                        title: "Recruitment",
                        url: "/coming-soon",
                    },
                    {
                        title: "Team Management",
                        url: "/coming-soon",
                    },
                    {
                        title: "Performance",
                        url: "/coming-soon",
                    },
                ],
            },
            {
                title: "Marketplace",
                url: "/coming-soon",
                icon: ShoppingCart,
                items: [
                    {
                        title: "Services",
                        url: "/coming-soon",
                    },
                    {
                        title: "Solutions",
                        url: "/coming-soon",
                    },
                    {
                        title: "Partners",
                        url: "/coming-soon",
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
            imgSrc: DewDropSmall,
            imgAlt: "DewDrop Logo",
            title: "DewDrop",
            subtitle: "Pilot MVP",
        },
    };

    return (
        <SidebarProvider defaultOpen={sidebarDefaultOpen} enableHovering={enableSidebarHovering}>
            <SideBar data={data} />
            <SidebarInset className={className}>
                <TopBar breadcrumbs={breadcrumbs} onAskAI={onAskAI} />

                {/* Main content area */}
                <main className="flex-1 overflow-auto">
                    <Outlet />
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
