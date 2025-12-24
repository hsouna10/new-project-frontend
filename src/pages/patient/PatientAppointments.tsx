import { useState, useEffect } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock, MapPin, Video, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { appointmentService, authService } from "@/services/api";

export default function PatientAppointments() {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const currentUser = authService.getCurrentUser();
            if (currentUser) {
                const response = await appointmentService.getMyAppointments(currentUser._id || currentUser.id);
                if (response?.data?.app) {
                    setAppointments(response.data.app);
                } else if (Array.isArray(response)) {
                    setAppointments(response);
                }
            }
        } catch (error) {
            console.error("Failed to fetch appointments", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Mes Rendez-vous</h1>
                <p className="text-muted-foreground">Historique et rendez-vous à venir</p>
            </div>

            {loading ? (
                <p>Chargement...</p>
            ) : appointments.length === 0 ? (
                <div className="text-center py-12 bg-muted/20 rounded-xl">
                    <p className="text-muted-foreground">Vous n'avez aucun rendez-vous planifié.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {appointments.map((app) => (
                        <Card key={app._id}>
                            <CardContent className="p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <CalendarIcon className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">Dr. {app.medecin?.prenom} {app.medecin?.nom}</h3>
                                        <p className="text-muted-foreground">{app.medecin?.specialite}</p>
                                        <div className="flex flex-wrap gap-4 mt-2 text-sm">
                                            <span className="flex items-center gap-1">
                                                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                                {new Date(app.date).toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-4 w-4 text-muted-foreground" />
                                                {new Date(app.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FileText className="h-4 w-4 text-muted-foreground" />
                                                {app.sujet}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                                    <Badge
                                        variant={app.status === 'confirmed' ? 'default' : app.status === 'pending' ? 'secondary' : 'outline'}
                                        className={app.status === 'confirmed' ? 'bg-green-500 hover:bg-green-600' : app.status === 'pending' ? 'bg-yellow-500 hover:bg-yellow-600 text-yellow-950' : ''}
                                    >
                                        {app.status === 'confirmed' ? 'Confirmé' : app.status === 'pending' ? 'En attente' : app.status === 'completed' ? 'Terminé' : 'Annulé'}
                                    </Badge>
                                    {app.status !== 'completed' && app.status !== 'cancelled' && (
                                        <div className="flex gap-2 w-full md:w-auto mt-2">
                                            <Button size="sm" variant="destructive" className="w-full md:w-auto">Annuler</Button>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
}
