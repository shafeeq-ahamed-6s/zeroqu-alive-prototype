import { Monitor, Moon, Sun, ChevronUp } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import useTheme from "@/hooks/useTheme";

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const { isMobile } = useSidebar();

    const getThemeIcon = () => {
        switch (theme) {
            case "light":
                return <Sun className="h-4 w-4" />;
            case "dark":
                return <Moon className="h-4 w-4" />;
            case "system":
                return <Monitor className="h-4 w-4" />;
            default:
                return <Monitor className="h-4 w-4" />;
        }
    };

    const getThemeLabel = () => {
        switch (theme) {
            case "light":
                return "Light";
            case "dark":
                return "Dark";
            case "system":
                return "System";
            default:
                return "System";
        }
    };

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            tooltip={getThemeLabel() + " theme"}
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex"
                        >
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground ml-1">
                                {getThemeIcon()}
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">Theme</span>
                                <span className="truncate text-xs">{getThemeLabel()}</span>
                            </div>
                            <ChevronUp className="size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    {getThemeIcon()}
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">Theme</span>
                                    <span className="truncate text-xs">
                                        Current: {getThemeLabel()}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setTheme("light")} className="gap-2">
                            <Sun className="h-4 w-4" />
                            Light
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")} className="gap-2">
                            <Moon className="h-4 w-4" />
                            Dark
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")} className="gap-2">
                            <Monitor className="h-4 w-4" />
                            System
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
