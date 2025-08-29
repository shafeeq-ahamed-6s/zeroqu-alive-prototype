import Dashboard from "@/features/homepage/Dashboard";

const HomePage = () => {
    return (
        <div className="flex items-center justify-center min-h-full">
            <main className="container mx-auto px-4 py-6 space-y-6">
                <Dashboard />
            </main>
        </div>
    );
};

export default HomePage;
