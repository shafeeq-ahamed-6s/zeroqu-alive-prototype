import * as React from "react";
import { Calculator, Calendar, CreditCard, Sparkles, Settings, Smile, User } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command";
import { Button } from "./ui/button";
import GradientBorder from "./ui/gradient-border";

export interface AskAIButtonProps {
    onAskAI?: () => void;
    className?: string;
}

export default function AskAI({ onAskAI, className }: AskAIButtonProps) {
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen(!open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, [open]);

    const handleAskAI = () => {
        setOpen(true);
        if (onAskAI) {
            onAskAI();
        }
    };

    return (
        <>
            <GradientBorder
                borderRadius="0.5rem"
                animationDuration="3s"
                className={cn(className)}
                onClick={handleAskAI}
            >
                <Button
                    variant="outline"
                    className={cn(
                        "w-full flex-1 bg-transparent text-card-foreground placeholder:text-muted-foreground focus:outline-none"
                    )}
                >
                    <Sparkles className="h-4 w-4" />
                    <span>Ask DewDrop</span>
                    <CommandShortcut>⌘K</CommandShortcut>
                </Button>
            </GradientBorder>

            <div
                className="command-dialog-wrapper"
                style={{
                    position: "relative",
                }}
            >
                <CommandDialog
                    open={open}
                    onOpenChange={setOpen}
                    className="overflow-hidden p-0 border-0"
                >
                    <CommandInput placeholder="Type a command or search..." className="border-0" />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup heading="Suggestions">
                            <CommandItem>
                                <Calendar />
                                <span>Calendar</span>
                            </CommandItem>
                            <CommandItem>
                                <Smile />
                                <span>Search Emoji</span>
                            </CommandItem>
                            <CommandItem>
                                <Calculator />
                                <span>Calculator</span>
                            </CommandItem>
                        </CommandGroup>
                        <CommandSeparator />
                        <CommandGroup heading="Settings">
                            <CommandItem>
                                <User />
                                <span>Profile</span>
                                <CommandShortcut>⌘P</CommandShortcut>
                            </CommandItem>
                            <CommandItem>
                                <CreditCard />
                                <span>Billing</span>
                                <CommandShortcut>⌘B</CommandShortcut>
                            </CommandItem>
                            <CommandItem>
                                <Settings />
                                <span>Settings</span>
                                <CommandShortcut>⌘S</CommandShortcut>
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </CommandDialog>
            </div>
        </>
    );
}
