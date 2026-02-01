import { useState, useEffect } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Share2, Plus, Loader2 } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ReportCreationDialog, ReportData } from "@/components/ReportCreationDialog";
import { rapportService, appointmentService } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Swal from 'sweetalert2';

interface MedicalReport {
    _id: string;
    diagnostic: string;
    diagnosticDarija?: string;
    date: string;
    patient?: {
        nom: string;
        prenom: string;
    };
    generatedByAI: boolean;
    patientName?: string;
    patientSurname?: string;
    recommandations?: any[];
}

interface Patient {
    _id: string;
    nom: string;
    prenom: string;
}

export default function DoctorReports() {
    const { toast } = useToast();
    const [reports, setReports] = useState<MedicalReport[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [creating, setCreating] = useState(false);

    // ... fetchData logic omitted (unchanged) ...
    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch reports created by doctor
            const reportsRes = await rapportService.getDoctorReports();
            if (reportsRes.data?.rapports) {
                setReports(reportsRes.data.rapports);
            }

            // Fetch distinct patients from completed appointments (similar to DoctorPatients)
            const appointmentsRes = await appointmentService.getCompletedAppointments();
            if (appointmentsRes.data?.appointments) {
                const uniqueDeviceMap = new Map();
                appointmentsRes.data.appointments.forEach((app: any) => {
                    if (app.patient && !uniqueDeviceMap.has(app.patient._id)) {
                        uniqueDeviceMap.set(app.patient._id, app.patient);
                    }
                });
                setPatients(Array.from(uniqueDeviceMap.values()));
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            toast({
                title: "Erreur",
                description: "Impossible de charger les données.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateReport = async (data: ReportData) => {
        // ... (unchanged)
        setCreating(true);
        try {
            await rapportService.createRapport(data);
            toast({
                title: "Succès",
                description: "Rapport médical créé avec succès.",
                className: "bg-green-600 text-white border-green-700",
            });
            setIsDialogOpen(false);
            fetchData(); // Refresh list
        } catch (error) {
            console.error("Error creating report:", error);
            toast({
                title: "Erreur",
                description: "Erreur lors de la création du rapport.",
                variant: "destructive",
            });
        } finally {
            setCreating(false);
        }
    };

    const handleRowClick = (report: MedicalReport) => {
        const dateStr = format(new Date(report.date), 'dd MMMM yyyy', { locale: fr });
        const patientName = report.patientName
            ? `${report.patientSurname} ${report.patientName}`
            : report.patient
                ? `${report.patient.prenom} ${report.patient.nom}`
                : 'Inconnu';

        // Format recommendations list with custom styling
        let recommendationsHtml = '<div class="text-center py-4 text-gray-500 italic">Aucune recommandation enregistrée.</div>';
        if (Array.isArray(report.recommandations) && report.recommandations.length > 0) {
            recommendationsHtml = `<ul class="space-y-3 text-left">
                ${report.recommandations.map((rec: any) => {
                const text = typeof rec === 'string' ? rec : rec.text;
                const darija = typeof rec === 'object' && rec.textDarija ? `<div class="text-xs text-medical-teal/80 font-medium ml-6 mt-1">${rec.textDarija}</div>` : '';
                return `
                    <li class="flex items-start group">
                        <div class="flex-shrink-0 w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center mt-0.5 mr-3 group-hover:bg-teal-200 transition-colors">
                            <svg class="w-3 h-3 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <div class="text-gray-700 text-sm leading-relaxed">${text}${darija}</div>
                    </li>`;
            }).join('')}
            </ul>`;
        }

        Swal.fire({
            html: `
                <div class="text-left font-sans">
                    <!-- Header Section -->
                    <div class="bg-gradient-to-r from-teal-50 to-white -mx-5 -mt-5 p-6 border-b border-teal-100 mb-6 flex items-start gap-4">
                        <div class="p-3 bg-white rounded-xl shadow-sm border border-teal-50">
                             <svg class="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        </div>
                        <div>
                            <h3 class="text-xl font-bold text-gray-900 leading-tight">${report.diagnostic}</h3>
                            <p class="text-sm text-teal-600 font-medium mt-1">Rapport Médical</p>
                        </div>
                    </div>

                    <!-- Info Grid -->
                    <div class="grid grid-cols-2 gap-4 mb-6">
                        <div class="bg-gray-50 p-3 rounded-lg border border-gray-100 hover:border-teal-200 transition-colors">
                            <span class="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Patient</span>
                            <div class="flex items-center gap-2">
                                <span class="font-semibold text-gray-800">${patientName}</span>
                            </div>
                        </div>
                        <div class="bg-gray-50 p-3 rounded-lg border border-gray-100 hover:border-teal-200 transition-colors">
                            <span class="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Date</span>
                            <div class="flex items-center gap-2">
                                <span class="font-semibold text-gray-800">${dateStr}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Darija Section (if exists) -->
                    ${report.diagnosticDarija ? `
                    <div class="mb-6 relative overflow-hidden group rounded-lg bg-teal-50/50 border border-teal-100 p-4">
                        <div class="absolute top-0 right-0 p-2 opacity-10">
                            <svg class="w-16 h-16 text-teal-900" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"></path></svg>
                        </div>
                        <div class="relative z-10">
                            <h4 class="text-sm font-bold text-teal-800 mb-2 flex items-center gap-2">
                                <span class="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                                Diagnostic en Darija
                            </h4>
                            <p class="text-gray-700 italic leading-relaxed text-sm bg-white/60 p-2 rounded border border-teal-50/50">
                                "${report.diagnosticDarija}"
                            </p>
                        </div>
                    </div>` : ''}

                    <!-- Recommendations Section -->
                    <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div class="bg-gray-50/80 px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                            <h4 class="font-semibold text-gray-800 flex items-center gap-2 text-sm">
                                <svg class="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                Traitement & Recommandations
                            </h4>
                            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${report.generatedByAI ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}">
                                ${report.generatedByAI ? 'Suggestion IA' : 'Prescription'}
                            </span>
                        </div>
                        <div class="p-4 max-h-[250px] overflow-y-auto custom-scrollbar">
                            ${recommendationsHtml}
                        </div>
                    </div>
                </div>
            `,
            showCloseButton: true,
            showConfirmButton: false,
            width: '600px',
            padding: '0',
            customClass: {
                popup: 'rounded-2xl shadow-2xl overflow-hidden',
                closeButton: 'text-gray-400 hover:text-gray-600 focus:outline-none'
            }
        });
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
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Rapports Médicaux</h1>
                    <p className="text-muted-foreground">Consultez et gérez les documents médicaux</p>
                </div>
                <Button
                    className="bg-medical-teal hover:bg-medical-teal/90"
                    onClick={() => setIsDialogOpen(true)}
                >
                    <Plus className="h-4 w-4 mr-2" /> Nouveau Rapport
                </Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Titre / Diagnostic</TableHead>
                                <TableHead>Patient</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Type</TableHead>
                                {/* <TableHead>Statut</TableHead> */}
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reports.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        Aucun rapport trouvé.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                reports.map((report) => (
                                    <TableRow
                                        key={report._id}
                                        className="cursor-pointer hover:bg-slate-50 transition-colors"
                                        onClick={() => handleRowClick(report)}
                                    >
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-muted-foreground" />
                                                <span className="truncate max-w-[200px]" title={report.diagnostic}>
                                                    {report.diagnostic}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {report.patientName ?
                                                `${report.patientSurname} ${report.patientName}` :
                                                report.patient ? `${report.patient.prenom} ${report.patient.nom}` :
                                                    'Inconnu'
                                            }
                                        </TableCell>
                                        <TableCell>
                                            {format(new Date(report.date), 'dd MMMM yyyy', { locale: fr })}
                                        </TableCell>
                                        <TableCell>
                                            {report.generatedByAI ? 'IA' : 'Manuel'}
                                        </TableCell>
                                        {/* <TableCell>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Finalisé
                                            </span>
                                        </TableCell> */}
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                                <Button variant="ghost" size="icon">
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon">
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

            <ReportCreationDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSubmit={handleCreateReport}
                patients={patients}
                loading={creating}
            />
        </DashboardLayout>
    );
}
