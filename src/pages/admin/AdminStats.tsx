import { useState, useEffect } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Stethoscope, Calendar, FileText, Activity } from "lucide-react";
import api from "@/services/api";

export default function AdminStats() {
    const [stats, setStats] = useState({
        users: 0,
        doctors: 0,
        patients: 0,
        appointments: 0,
        pendingRequests: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/admin/stats');
                if (res.data.status === 'success') {
                    setStats(res.data.data);
                }
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        {
            title: "Utilisateurs Total",
            value: stats.users,
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-100"
        },
        {
            title: "Médecins Actifs",
            value: stats.doctors,
            icon: Stethoscope,
            color: "text-green-600",
            bg: "bg-green-100"
        },
        {
            title: "Patients Inscrits",
            value: stats.patients,
            icon: Activity,
            color: "text-purple-600",
            bg: "bg-purple-100"
        },
        {
            title: "Rendez-vous",
            value: stats.appointments,
            icon: Calendar,
            color: "text-orange-600",
            bg: "bg-orange-100"
        },
        {
            title: "Demandes en Attente",
            value: stats.pendingRequests,
            icon: FileText,
            color: "text-red-600",
            bg: "bg-red-100"
        }
    ];

    return (
        <DashboardLayout>
            <h1 className="text-3xl font-bold mb-6">Tableau de Bord Administrateur</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {statCards.map((stat, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-2 rounded-full ${stat.bg}`}>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {loading ? "..." : stat.value}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </DashboardLayout>
    );
}
