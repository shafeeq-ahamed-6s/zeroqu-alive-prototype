import { useState } from "react";
import { Search } from "lucide-react";

export function SearchBar() {
    const [query, setQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="relative max-w-2xl mx-auto">
            <div
                className={`relative glass-morphism rounded-xl transition-all duration-300 ${isFocused ? "scale-105" : ""}`}
            >
                <div className="flex items-center p-4">
                    <Search className="h-5 w-5 text-muted-foreground mr-3" />
                    <input
                        type="text"
                        placeholder="Ask me anything..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        className="flex-1 bg-transparent text-card-foreground placeholder:text-card-foreground focus:outline-none"
                    />
                </div>
            </div>
        </div>
    );
}
