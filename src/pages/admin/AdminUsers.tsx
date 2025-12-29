import DashboardLayout from "@/components/layout/DashboardLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Trash2, Edit } from "lucide-react";

const mockUsers = [
    { id: 1, name: "Ahmed Ben Ali", email: "ahmed@example.com", role: "Patient", status: "Actif", lastActive: "Il y a 2h" },
    { id: 2, name: "Dr. Karim Mansour", email: "dr.mansour@hospital.com", role: "Docteur", status: "Actif", lastActive: "Il y a 5min" },
    { id: 3, name: "Admin System", email: "admin@mediconnect.com", role: "Admin", status: "Actif", lastActive: "Maintenant" },
    { id: 4, name: "Sarra Jaziri", email: "sarra@example.com", role: "Patient", status: "Suspendu", lastActive: "Il y a 3j" },
];

export default function AdminUsers() {
    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Gestion des Utilisateurs</h1>
                <Button>Ajouter des utilisateurs</Button>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nom</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Rôle</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead>Dernière activité</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockUsers.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Badge variant={user.role === 'Admin' ? 'default' : user.role === 'Docteur' ? 'default' : 'secondary'}>
                                        {user.role}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${user.status === 'Actif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {user.status}
                                    </span>
                                </TableCell>
                                <TableCell className="text-muted-foreground">{user.lastActive}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon">
                                        <Edit className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                    <Button variant="ghost" size="icon">
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </DashboardLayout>
    );
}
