import { useState } from "react";
import { Search } from "lucide-react";

export function SearchBar() {
    const [query, setQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const suggestions = [
        "MV Aurora emissions review",
        "Fleet compliance status",
        "Route optimization available",
        "CII performance trends",
    ];

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

            {isFocused && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-20 slide-up">
                    <div className="p-2">
                        <div className="text-xs font-medium text-muted-foreground mb-2 px-3">
                            Recent Searches
                        </div>
                        {suggestions.map((suggestion, index) => (
                            <button
                                key={index}
                                className="w-full text-left p-3 hover:bg-accent rounded-lg transition-colors text-sm"
                                onClick={() => setQuery(suggestion)}
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
