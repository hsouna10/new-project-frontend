import { useState, useEffect } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Share2, Loader2, Calendar, User } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { rapportService } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";

interface MedicalReport {
    _id: string;
    diagnostic: string;
    diagnosticDarija?: string;
    date: string;
    docteur?: {
        nom: string;
        prenom: string;
        specialite: string;
    };
    generatedByAI: boolean;
    doctorName?: string;
    doctorSurname?: string;
    doctorSpecialite?: string;
}

export default function PatientReports() {
    const { toast } = useToast();
    const [reports, setReports] = useState<MedicalReport[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const response = await rapportService.getMyRapports();
            if (response.data?.rapports) {
                setReports(response.data.rapports);
            }
        } catch (error) {
            console.error("Error fetching reports:", error);
            toast({
                title: "Erreur",
                description: "Impossible de charger vos rapports médicaux.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

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
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Mes Rapports Médicaux</h1>
                <p className="text-muted-foreground">
                    Consultez l'historique de vos bilans et diagnostics
                </p>
            </motion.div>

            <Card className="glass-panel border-white/10">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-white/10">
                                <TableHead className="text-primary">Diagnostic / Titre</TableHead>
                                <TableHead className="text-primary">Médecin</TableHead>
                                <TableHead className="text-primary">Date</TableHead>
                                <TableHead className="text-primary">Type</TableHead>
                                <TableHead className="text-right text-primary">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reports.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                                        <div className="flex flex-col items-center gap-3">
                                            <FileText className="h-12 w-12 opacity-20" />
                                            <p>Aucun rapport médical disponible pour le moment.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                reports.map((report) => (
                                    <TableRow key={report._id} className="hover:bg-white/5 border-white/5 cursor-pointer transition-colors">
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                                    <FileText className="h-4 w-4" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold">{report.diagnostic}</span>
                                                    {report.diagnosticDarija && (
                                                        <span className="text-xs text-muted-foreground">{report.diagnosticDarija}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {report.doctorSurname ? (
                                                <div className="flex items-center gap-2">
                                                    <User className="h-3 w-3 text-muted-foreground" />
                                                    <span className="text-sm">Dr. {report.doctorSurname} {report.doctorName}</span>
                                                </div>
                                            ) : report.docteur ? (
                                                <div className="flex items-center gap-2">
                                                    <User className="h-3 w-3 text-muted-foreground" />
                                                    <span className="text-sm">Dr. {report.docteur.prenom} {report.docteur.nom}</span>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground italic">Non spécifié</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Calendar className="h-3 w-3" />
                                                {format(new Date(report.date), 'dd MMM yyyy', { locale: fr })}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${report.generatedByAI
                                                ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                                : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                                }`}>
                                                {report.generatedByAI ? '🤖 IA Assisté' : '👨‍⚕️ Standard'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" className="hover:bg-white/10 hover:text-primary">
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="hover:bg-white/10 hover:text-primary">
                                                    <Share2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </DashboardLayout>
    );
}
