import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Share2, Plus } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const mockReports = [
    { id: 1, title: 'Bilan Sanguin - A. Ben Ali', date: '2024-03-20', type: 'Laboratoire', status: 'Finalisé' },
    { id: 2, title: 'Compte Rendu Radio - F. Trabelsi', date: '2024-03-19', type: 'Imagerie', status: 'En attente' },
    { id: 3, title: 'Prescription - M. Sassi', date: '2024-03-18', type: 'Ordonnance', status: 'Finalisé' },
    { id: 4, title: 'Certificat Médical - L. Bouaziz', date: '2024-03-18', type: 'Certificat', status: 'Finalisé' },
    { id: 5, title: 'Bilan Cardiaque - K. Hamdi', date: '2024-03-15', type: 'Cardiologie', status: 'Revue requise' },
];

export default function DoctorReports() {
    return (
        <DashboardLayout>
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Rapports Médicaux</h1>
                    <p className="text-muted-foreground">Consultez et gérez les documents médicaux</p>
                </div>
                <Button className="bg-medical-teal hover:bg-medical-teal/90">
                    <Plus className="h-4 w-4 mr-2" /> Nouveau Rapport
                </Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Titre du Document</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockReports.map((report) => (
                                <TableRow key={report.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                            {report.title}
                                        </div>
                                    </TableCell>
                                    <TableCell>{report.date}</TableCell>
                                    <TableCell>{report.type}</TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${report.status === 'Finalisé' ? 'bg-green-100 text-green-800' :
                                                report.status === 'En attente' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {report.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon">
                                                <Download className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon">
                                                <Share2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </DashboardLayout>
    );
}
