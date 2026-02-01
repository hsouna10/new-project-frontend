import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Phone, FileText } from "lucide-react";
import { appointmentService } from "@/services/api";

import { JournalEntryDialog } from "@/components/doctor/JournalEntryDialog";

export default function DoctorPatients() {
    const navigate = useNavigate();
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPatient, setSelectedPatient] = useState<{ id: string; name: string } | null>(null);
    const [isJournalDialogOpen, setIsJournalDialogOpen] = useState(false);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await appointmentService.getCompletedAppointments();
                console.log("API Response:", response);
                if (response.data?.appointments) {
                    // Extract unique patients from completed appointments
                    const uniquePatientsMap = new Map();
                    response.data.appointments.forEach((app: any) => {
                        if (app.patient && !uniquePatientsMap.has(app.patient._id)) {
                            uniquePatientsMap.set(app.patient._id, {
                                ...app.patient,
                                lastVisit: app.date
                            });
                        }
                    });
                    setPatients(Array.from(uniquePatientsMap.values()));
                }
            } catch (error) {
                console.error("Failed to fetch patients", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, []);

    const handleOpenJournal = (patientId: string, firstName: string, lastName: string) => {
        setSelectedPatient({ id: patientId, name: `${firstName} ${lastName}` });
        setIsJournalDialogOpen(true);
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Mes Patients</h1>
                    <p className="text-muted-foreground">Liste des patients que vous avez traités</p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Rechercher un patient..." className="pl-9" />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : patients.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground">
                    Aucun patient traité pour le moment.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {patients.map((patient) => (
                        <Card key={patient._id} className="hover:shadow-lg transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold">
                                    {patient.prenom?.[0]}{patient.nom?.[0]}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleOpenJournal(patient._id, patient.prenom, patient.nom)}
                                    title="Ajouter une note au journal"
                                >
                                    <FileText className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <h3 className="font-bold text-lg mb-1">{patient.prenom} {patient.nom}</h3>
                                <p className="text-sm text-muted-foreground mb-4">Patient</p>

                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <MapPin className="h-4 w-4" />
                                        {patient.city || 'Ville non renseignée'}
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Phone className="h-4 w-4" />
                                        {patient.telephone || 'Non renseigné'}
                                    </div>
                                    <div className="pt-2 border-t mt-3 flex justify-between items-center text-xs">
                                        <span>Dernière visite:</span>
                                        <span className="font-medium text-foreground">
                                            {new Date(patient.lastVisit).toLocaleDateString('fr-FR')}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-4">
                                    <Button
                                        className="flex-1"
                                        variant="outline"
                                        onClick={() => navigate(`/dashboard/doctor/patient/${patient._id}`)}
                                    >
                                        Voir Dossier
                                    </Button>
                                    <Button
                                        className="flex-1"
                                        variant="default"
                                        onClick={() => handleOpenJournal(patient._id, patient.prenom, patient.nom)}
                                    >
                                        <FileText className="w-4 h-4 mr-2" />
                                        Journal
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {selectedPatient && (
                <JournalEntryDialog
                    isOpen={isJournalDialogOpen}
                    onClose={() => setIsJournalDialogOpen(false)}
                    patientId={selectedPatient.id}
                    patientName={selectedPatient.name}
                />
            )}
        </DashboardLayout>
    );
}
