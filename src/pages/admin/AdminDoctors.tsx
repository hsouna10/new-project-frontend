import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react";
import Swal from "sweetalert2";
import api from "@/services/api"; // Assuming we'll add requests endpoints here or call directly
import { useToast } from "@/components/ui/use-toast";

interface DoctorRequest {
    _id: string;
    senderId: {
        _id: string;
        nom: string;
        prenom: string;
        email: string;
    };
    specialite: string;
    experience: number;
    description: string;
    state: string; // 'pending', 'accepted', 'rejected'
    createdAt: string;
}

export default function AdminDoctors() {
    const { toast } = useToast();
    const [requests, setRequests] = useState<DoctorRequest[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const res = await api.get('/doctor-requests');
            setRequests(res.data);
        } catch (error) {
            console.error("Error fetching requests:", error);
            toast({
                title: "Erreur",
                description: "Impossible de charger les demandes.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleAction = async (id: string, action: 'accepted' | 'rejected', doctorName: string) => {
        const result = await Swal.fire({
            title: `Êtes-vous sûr de vouloir ${action === 'accepted' ? 'accepter' : 'refuser'} ?`,
            text: `Médecin concerné : ${doctorName}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: action === 'accepted' ? '#10b981' : '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: action === 'accepted' ? 'Oui, Accepter' : 'Oui, Refuser',
            cancelButtonText: 'Annuler'
        });

        if (result.isConfirmed) {
            try {
                // Determine logged in admin ID (optional based on backend req)
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                // Assuming admin ID logic is handled or we pass user._id if needed

                await api.put(`/doctor-requests/${id}/state`, {
                    state: action,
                    adminId: "admin_action" // Simplification: backend should ideally take from req.user
                });

                toast({
                    title: "Succès",
                    description: `La demande a été ${action === 'accepted' ? 'acceptée' : 'refusée'}.`,
                    className: "bg-green-600 text-white"
                });
                fetchRequests();
            } catch (error) {
                console.error("Error updating request:", error);
                toast({
                    title: "Erreur",
                    description: "Erreur lors de la mise à jour.",
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
            <h1 className="text-3xl font-bold mb-2">Demandes d'Inscription Médecins</h1>
            <p className="text-muted-foreground mb-8">Gérez les demandes d'accès à la plateforme.</p>

            <div className="rounded-md border bg-white overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Médecin</TableHead>
                            <TableHead>Spécialité</TableHead>
                            <TableHead>Expérience</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requests.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-20" />
                                    Aucune demande en attente.
                                </TableCell>
                            </TableRow>
                        ) : (
                            requests.map((req) => (
                                <TableRow key={req._id}>
                                    <TableCell className="font-medium">
                                        <div>
                                            {req.senderId.prenom} {req.senderId.nom}
                                        </div>
                                        <div className="text-xs text-muted-foreground">{req.senderId.email}</div>
                                    </TableCell>
                                    <TableCell>{req.specialite}</TableCell>
                                    <TableCell>{req.experience} ans</TableCell>
                                    <TableCell>
                                        {format(new Date(req.createdAt), 'dd MMMM yyyy', { locale: fr })}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={req.state === 'pending' ? 'outline' : req.state === 'accepted' ? 'default' : 'destructive'}
                                            className={req.state === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
                                        >
                                            {req.state === 'pending' ? 'En Attente' : req.state === 'accepted' ? 'Accepté' : 'Refusé'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {req.state === 'pending' && (
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    className="bg-green-600 hover:bg-green-700 h-8"
                                                    onClick={() => handleAction(req._id, 'accepted', `${req.senderId.prenom} ${req.senderId.nom}`)}
                                                >
                                                    <CheckCircle className="h-4 w-4 mr-1" /> Accepter
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    className="h-8"
                                                    onClick={() => handleAction(req._id, 'rejected', `${req.senderId.prenom} ${req.senderId.nom}`)}
                                                >
                                                    <XCircle className="h-4 w-4 mr-1" /> Refuser
                                                </Button>
                                            </div>
                                        )}
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
