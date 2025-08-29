import { WaveAnimation } from "./WaveAnimation";
import { SearchBar } from "./SearchBar";
import { getTimeBasedGreeting } from "@/utlis/timeGreeting";

export function DashboardHeader() {
    const greeting = getTimeBasedGreeting();

    return (
        <div className="relative bg-card rounded-xl shadow-md overflow-hidden">
            <WaveAnimation />

            <div className="relative z-10 p-6 md:p-8">
                <div className="text-center space-y-4">
                    <div className="space-y-2">
                        <h1 className="text-3xl md:text-4xl font-bold text-card-foreground">
                            {greeting}, Captain
                        </h1>
                        <p className="text-muted-foreground">
                            Welcome back... Your fleet is performing exceptionally well today
                        </p>
                    </div>

                    <SearchBar />
                </div>
            </div>
        </div>
    );
}
