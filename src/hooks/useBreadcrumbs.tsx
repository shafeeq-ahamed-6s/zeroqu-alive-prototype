import { useMemo } from "react";
import { useLocation } from "react-router";
import type { BreadcrumbItem } from "@/layouts/MainLayout";
import extractPaths from "@/utlis/extractRoutes";
import { routes } from "@/routes/routes";

export function useBreadcrumbs(): BreadcrumbItem[] {
    const location = useLocation();

    const breadcrumbs = useMemo(() => {
        // Skip empty paths and remove trailing slashes
        const pathnames = location.pathname.split("/").filter(x => x);

        // Generate breadcrumb items from path segments
        const breadcrumbItems: BreadcrumbItem[] = [];

        // If we're at root, show Home
        if (pathnames.length === 0) {
            return [{ title: "Home", isCurrentPage: true }];
        }

        if (!extractPaths(routes).includes(location.pathname)) {
            return [
                { title: "Home", href: "/", isCurrentPage: false },
                { title: "Not Found", isCurrentPage: true },
            ];
        }

        // Add Home as first breadcrumb if not at root
        breadcrumbItems.push({
            title: "Home",
            href: "/",
        });

        // Add remaining path segments as breadcrumbs
        pathnames.forEach((segment, index) => {
            const isLastItem = index === pathnames.length - 1;
            const href = `/${pathnames.slice(0, index + 1).join("/")}`;

            // Format the title: convert kebab-case or snake_case to Title Case
            const formattedTitle = segment
                .replace(/-|_/g, " ")
                .replace(/\b\w/g, char => char.toUpperCase());

            breadcrumbItems.push({
                title: formattedTitle,
                href: isLastItem ? undefined : href,
                isCurrentPage: isLastItem,
            });
        });

        return breadcrumbItems;
    }, [location.pathname]);

    return breadcrumbs;
}
