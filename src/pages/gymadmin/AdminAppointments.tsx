import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Loader2, AlertCircle, Calendar } from "lucide-react";
import api from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import Swal from "sweetalert2";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Appointment {
    _id: string;
    patient: {
        nom: string;
        prenom: string;
        user: { email: string };
    };
    doctor: {
        nom: string;
        prenom: string;
        specialite: string;
        user: { email: string };
    };
    date: string;
    description: string;
    state: string;
    createdAt: string;
}

export default function AdminAppointments() {
    const { toast } = useToast();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAppointments = async () => {
        try {
            const res = await api.get('/admin/appointments');
            if (res.data.status === 'success') {
                setAppointments(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching appointments:", error);
            toast({
                title: "Erreur",
                description: "Impossible de charger les rendez-vous.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: 'Êtes-vous sûr ?',
            text: "Voulez-vous vraiment supprimer ce rendez-vous ? Cette action est irréversible.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Oui, supprimer',
            cancelButtonText: 'Annuler'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/admin/appointments/${id}`);
                toast({
                    title: "Succès",
                    description: "Rendez-vous supprimé avec succès.",
                    className: "bg-green-600 text-white"
                });
                fetchAppointments();
            } catch (error) {
                console.error("Error deleting appointment:", error);
                toast({
                    title: "Erreur",
                    description: "Erreur lors de la suppression.",
                    variant: "destructive",
                });
            }
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex justify-center items-center h-[50vh]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-xl bg-orange-100 text-orange-600">
                    <Calendar className="w-8 h-8" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">Rendez-vous Globaux</h1>
                    <p className="text-muted-foreground">Gestion de tous les rendez-vous de la plateforme.</p>
                </div>
            </div>

            <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="font-semibold">Patient</TableHead>
                            <TableHead className="font-semibold">Médecin</TableHead>
                            <TableHead className="font-semibold">Date & Heure</TableHead>
                            <TableHead className="font-semibold">Description</TableHead>
                            <TableHead className="font-semibold">Statut</TableHead>
                            <TableHead className="text-right font-semibold">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {appointments.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                                    <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-20" />
                                    Aucun rendez-vous trouvé.
                                </TableCell>
                            </TableRow>
                        ) : (
                            appointments.map((app) => (
                                <TableRow key={app._id} className="hover:bg-muted/5 transition-colors">
                                    <TableCell>
                                        <div className="font-medium">{app.patient?.prenom} {app.patient?.nom}</div>
                                        <div className="text-xs text-muted-foreground">{app.patient?.user?.email}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">Dr. {app.doctor?.prenom} {app.doctor?.nom}</div>
                                        <div className="text-xs text-medical-teal font-medium">{app.doctor?.specialite}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            {format(new Date(app.date), 'dd MMM yyyy', { locale: fr })}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {format(new Date(app.date), 'HH:mm', { locale: fr })}
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-[200px] truncate">
                                        <span className="text-sm">{app.description}</span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={app.state === 'accepted' ? 'default' : app.state === 'rejected' ? 'destructive' : 'outline'}
                                              className={app.state === 'pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : ''}>
                                            {app.state === 'accepted' ? 'Confirmé' : app.state === 'rejected' ? 'Annulé' : 'En attente'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(app._id)}
                                            className="hover:bg-red-50 hover:text-red-600 transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </DashboardLayout>
    );
}
