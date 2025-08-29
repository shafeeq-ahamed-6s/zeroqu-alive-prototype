import * as React from "react";
import { ChevronRight, type LucideIcon } from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import ThemeToggle from "@/components/theme/theme-toggle";
import { useNavigate } from "react-router";

type NavMainItem = {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
    items: { title: string; url: string }[];
};

type Brand = {
    href: string;
    imgSrc: string;
    imgAlt: string;
    title: string;
    subtitle?: string;
};

export default function SideBar({
    data,
    ...props
}: { data?: { navMain: NavMainItem[]; brand?: Brand } } & React.ComponentProps<typeof Sidebar>) {
    const navigate = useNavigate();

    return (
        <Sidebar variant="floating" collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                            className="flex items-center justify-between"
                        >
                            <a href={data?.brand?.href}>
                                <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                    <img
                                        src={data?.brand?.imgSrc}
                                        alt={data?.brand?.imgAlt}
                                        className="w-8 h-8 ml-2"
                                    />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold text-lg">
                                        {data?.brand?.title}
                                    </span>
                                    <span className="truncate text-sm opacity-70">
                                        {data?.brand?.subtitle}
                                    </span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Platform</SidebarGroupLabel>
                    <SidebarMenu>
                        {data?.navMain.map(item => (
                            <Collapsible
                                key={item.title}
                                asChild
                                defaultOpen={item.isActive}
                                className="group/collapsible"
                            >
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton tooltip={item.title}>
                                            {item.icon && (
                                                <item.icon
                                                    className="ml-0.5"
                                                    onClick={() => navigate(item.url)}
                                                    style={{ cursor: "pointer" }}
                                                />
                                            )}
                                            <span>{item.title}</span>
                                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.items?.map(subItem => (
                                                <SidebarMenuSubItem key={subItem.title}>
                                                    <SidebarMenuSubButton asChild>
                                                        <a href={subItem.url}>
                                                            <span>{subItem.title}</span>
                                                        </a>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="flex items-center justify-center">
                <ThemeToggle />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
