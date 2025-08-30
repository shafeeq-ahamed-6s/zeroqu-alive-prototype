import * as React from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Profile from "@/components/ui/profile";
import ThemeToggle from "@/components/theme/theme-toggle";
import { Notifications } from "../notifications";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

export interface AppTopbarProps {
    breadcrumbs?: {
        title: string;
        href?: string;
        isCurrentPage?: boolean;
    }[];
}

export default function TopBar({ breadcrumbs }: AppTopbarProps) {
    // Profile actions are now handled in the Profile component

    return (
        <header
            className="sticky top-0 z-50 flex h-16 shrink-0 items-center 
            gap-2 border-b
            bg-background backdrop-blur supports-[backdrop-filter]:bg-background 
            transition-[width,height] ease-linear 
            group-has-data-[collapsible=icon]/sidebar-wrapper:h-16"
        >
            <div className="flex items-center gap-2 px-4 flex-1">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <SidebarTrigger className="-ml-1" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Open Sidebar</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <Separator
                    orientation="vertical"
                    className="mr-2 data-[orientation=vertical]:h-4"
                />
                {breadcrumbs && breadcrumbs.length > 0 && (
                    <Breadcrumb>
                        <BreadcrumbList className="text-lg">
                            {breadcrumbs.map((item, index) => (
                                <React.Fragment key={index}>
                                    <BreadcrumbItem>
                                        {item.isCurrentPage ? (
                                            <BreadcrumbPage>{item.title}</BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink href={item.href || "#"}>
                                                {item.title}
                                            </BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                    {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                                </React.Fragment>
                            ))}
                        </BreadcrumbList>
                    </Breadcrumb>
                )}
            </div>

            {/* Right side with Ask AI button and Profile */}
            <div className="flex items-center gap-4 px-4">
                <Notifications />
                <ThemeToggle />
                <Profile />
            </div>
        </header>
    );
}
