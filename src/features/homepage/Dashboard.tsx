import { DashboardHeader } from "./components/header/DashboardHeader";
import { ActionCards } from "./components/actions/ActionCards";

const Dashboard = () => {
    return (
        <div className="flex items-center justify-center min-h-full">
            <main className="container mx-auto px-4 py-6 space-y-6">
                <DashboardHeader />
                <ActionCards />
            </main>
        </div>
    );
};

export default Dashboard;
