import { useLocation } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";

const PlaceholderPage = ({ title }: { title: string }) => {
    const location = useLocation();

    return (
        <DashboardLayout>
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
                <h1 className="text-3xl font-bold mb-4">{title}</h1>
                <p className="text-muted-foreground mb-8">
                    This page is currently under construction.
                    <br />
                    Path: <code>{location.pathname}</code>
                </p>
            </div>
        </DashboardLayout>
    );
};

export default PlaceholderPage;
