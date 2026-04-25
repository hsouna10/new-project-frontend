import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Loader2, AlertCircle } from "lucide-react";
import { userService } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import Swal from "sweetalert2";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface User {
    _id: string;
    nom: string;
    prenom: string;
    email: string;
    rôle: string;
    createdAt: string;
}

export default function AdminUsers() {
    const { toast } = useToast();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const res = await userService.getAllUsers();
            if (res.status === 'success') {
                setUsers(res.data.users);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            toast({
                title: "Erreur",
                description: "Impossible de charger les utilisateurs.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id: string, name: string) => {
        const result = await Swal.fire({
            title: 'Êtes-vous sûr ?',
            text: `Voulez-vous vraiment supprimer l'utilisateur ${name} ? Cette action est irréversible.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Oui, supprimer',
            cancelButtonText: 'Annuler'
        });

        if (result.isConfirmed) {
            try {
                await userService.deleteUser(id);
                toast({
                    title: "Succès",
                    description: "Utilisateur supprimé avec succès.",
                    className: "bg-green-600 text-white"
                });
                fetchUsers();
            } catch (error) {
                console.error("Error deleting user:", error);
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
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Gestion des Utilisateurs</h1>
            </div>

            <div className="rounded-md border bg-card overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nom</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Rôle</TableHead>
                            <TableHead>Inscrit le</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-20" />
                                    Aucun utilisateur trouvé.
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell className="font-medium">
                                        {user.prenom ? `${user.prenom} ${user.nom}` : user.nom || 'Sans nom'}
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Badge variant={user.rôle === 'admin' ? 'default' : user.rôle === 'medecin' ? 'secondary' : 'outline'}>
                                            {user.rôle}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {user.createdAt ? format(new Date(user.createdAt), 'dd MMM yyyy', { locale: fr }) : '-'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(user._id, user.prenom ? `${user.prenom} ${user.nom}` : user.email)}
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
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
