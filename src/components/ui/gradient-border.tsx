import React from "react";
import { cn } from "@/lib/utils";

export interface GradientBorderProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * The width of the gradient border
     * @default "2px"
     */
    borderWidth?: string;

    /**
     * The border radius of the component
     * @default "12px"
     */
    borderRadius?: string;

    /**
     * Duration of the animation
     * @default "3s"
     */
    animationDuration?: string;

    /**
     * Children to render inside the border
     */
    children: React.ReactNode;
}

/**
 * A component that renders content with an animated gradient border
 */
export default function GradientBorder({
    borderWidth = "2px",
    borderRadius = "0.5rem",
    animationDuration = "3s",
    className,
    children,
    ...props
}: GradientBorderProps) {
    return (
        <div
            className={cn("gradient-border", className)}
            style={
                {
                    "--gradient-border-width": borderWidth,
                    "--gradient-border-radius": borderRadius,
                    "--gradient-animation-duration": animationDuration,
                } as React.CSSProperties
            }
            {...props}
        >
            {children}
        </div>
    );
}
