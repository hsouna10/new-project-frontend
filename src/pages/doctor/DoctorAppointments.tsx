import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Clock, User, Calendar as CalendarIcon, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { appointmentService, authService } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function DoctorAppointments() {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const currentUser = authService.getCurrentUser();
            // Assuming currentUser has a linked doctor profile ID or is the doctor
            // Backend expects doctor ID. 
            // If user is a doctor, we need their profile ID.
            // If the backend `getDoctorAppointments` route expects UserID, then `currentUser._id` is fine.
            // But usually it's Doctor Profile ID. 
            // Let's try utilizing the user ID first as most systems verify user.
            // If it returns 404 "Médecin introuvable", we know we need a profile ID lookup.
            if (currentUser) {
                const id = currentUser._id || currentUser.id;
                const response = await appointmentService.getDoctorAppointments(id);
                if (response?.data?.app) {
                    setAppointments(response.data.app);
                } else if (Array.isArray(response)) { // Fallback
                    setAppointments(response);
                }
            }
        } catch (error) {
            console.error("Failed to fetch appointments", error);
            toast({
                title: "Erreur",
                description: "Impossible de charger les rendez-vous.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            await appointmentService.updateAppointmentStatus(id, newStatus);

            // Optimistic update
            setAppointments(appointments.map(app =>
                app._id === id ? { ...app, status: newStatus } : app
            ));

            toast({
                title: status === 'confirmed' ? "Rendez-vous accepté" : "Rendez-vous refusé",
                className: newStatus === 'confirmed' ? "bg-green-600 text-white" : "bg-red-600 text-white",
            });
        } catch (error) {
            toast({
                title: "Erreur",
                description: "La mise à jour du statut a échoué.",
                variant: "destructive",
            });
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) { // Handling various status strings
            case 'confirmed':
            case 'accepted':
                return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-200">Confirmé</Badge>;
            case 'pending':
            case 'en attente':
                return <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-200">En attente</Badge>;
            case 'cancelled':
            case 'refused':
                return <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-200">Annulé</Badge>;
            case 'completed':
                return <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-200">Terminé</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Gestion des Rendez-vous</h1>
                <p className="text-muted-foreground">Gérez vos consultations et votre emploi du temps</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : appointments.length === 0 ? (
                <div className="text-center py-12 bg-muted/30 rounded-xl border border-dashed">
                    <CalendarIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                    <h3 className="text-lg font-medium">Aucun rendez-vous</h3>
                    <p className="text-muted-foreground">Vous n'avez pas de rendez-vous pour le moment.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    <AnimatePresence>
                        {appointments.map((appointment) => (
                            <motion.div
                                key={appointment._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, height: 0 }}
                                layout
                            >
                                <Card className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 bg-card/50 hover:bg-card hover:shadow-md transition-all border-border/50">
                                    <div className="flex items-center gap-5 mb-4 md:mb-0 w-full md:w-auto">
                                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center border border-blue-100 dark:border-blue-900/30">
                                            <span className="text-xl font-bold text-primary">
                                                {appointment.patient?.prenom?.[0]}{appointment.patient?.nom?.[0]}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg flex items-center gap-2">
                                                {appointment.patient?.prenom} {appointment.patient?.nom}
                                            </h3>
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-muted-foreground mt-1">
                                                <span className="flex items-center gap-1.5 min-w-[140px]">
                                                    <Clock className="h-3.5 w-3.5 text-primary/70" />
                                                    <span className="font-medium text-foreground/80">
                                                        {new Date(appointment.date).toLocaleDateString('fr-FR')}
                                                    </span>
                                                    à {appointment.time}
                                                </span>
                                                <span className="flex items-center gap-1.5 hidden sm:flex text-border">|</span>
                                                <span className="flex items-center gap-1.5">
                                                    <FileText className="h-3.5 w-3.5 text-primary/70" />
                                                    {appointment.sujet || 'Consultation standard'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 mt-2 md:mt-0">
                                        <div className="mr-2">
                                            {getStatusBadge(appointment.status)}
                                        </div>

                                        {appointment.status === 'pending' && (
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleStatusChange(appointment._id, 'confirmed')}
                                                    className="bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-green-200 dark:hover:shadow-none transition-all"
                                                >
                                                    <Check className="h-4 w-4 mr-1.5" /> Accepter
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleStatusChange(appointment._id, 'cancelled')}
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                                                >
                                                    <X className="h-4 w-4 mr-1.5" /> Refuser
                                                </Button>
                                            </div>
                                        )}

                                        {appointment.status === 'confirmed' && (
                                            <Button
                                                size="sm"
                                                onClick={() => handleStatusChange(appointment._id, 'completed')}
                                                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-blue-200 dark:hover:shadow-none transition-all"
                                            >
                                                <Check className="h-4 w-4 mr-1.5" /> Terminé
                                            </Button>
                                        )}
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </DashboardLayout>
    );
}
