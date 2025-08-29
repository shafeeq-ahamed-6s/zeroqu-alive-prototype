"use client";
import { cn } from "@/lib/utils";
import "./lighthouse-icon.css";

export function LighthouseIcon({ className }: { className?: string }) {
    return (
        <div className={cn("lighthouse-wrapper", className)}>
            <div className="lighthouse">
                <div className="lighthouse-top-section">
                    <div className="lighthouse-roof"></div>
                    <div className="lighthouse-lantern">
                        <div className="lighthouse-light-container">
                            <div className="lighthouse-light"></div>
                        </div>
                    </div>
                    <div className="lighthouse-gallery"></div>
                    <div className="lighthouse-support"></div>
                </div>
                <div className="lighthouse-base"></div>
                <div className="lighthouse-foundation"></div>
            </div>
        </div>
    );
}
