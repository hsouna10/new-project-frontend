import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, User, Calendar, FileText, Camera, Plus, Loader2 } from "lucide-react";
import { ReportScanner } from "@/components/doctor/ReportScanner";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { appointmentService } from '@/services/api';

export default function DoctorPatientDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    // Determine initial patient object structure, will refine with real data or proper types
    const [patient, setPatient] = useState<any>(null);
    const [activeTab, setActiveTab] = useState("overview");
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [scannedDocuments, setScannedDocuments] = useState<{ id: string, url: string, date: Date }[]>([]);

    useEffect(() => {
        // Mock fetching patient details or use an API
        // For now, we'll try to find the patient in the appointment list or fetch by ID if available
        // If no direct API for single patient, we might need to rely on passed state or fetch all and find

        const fetchPatientDetails = async () => {
            try {
                // Ideally: await patientService.getPatientById(id);
                // Fallback: Fetch appointments to find patient (temporary workaround)
                const response = await appointmentService.getCompletedAppointments();
                if (response.data?.appointments) {
                    const found = response.data.appointments.find((app: any) => app.patient?._id === id);
                    if (found) {
                        setPatient(found.patient);
                    } else {
                        // Mock data if not found in recent appointments
                        setPatient({
                            _id: id,
                            prenom: "Patient",
                            nom: "Inconnu",
                            email: "patient@example.com",
                            telephone: "+216 00 000 000",
                            city: "Tunis"
                        });
                    }
                }
            } catch (error) {
                console.error("Error fetching patient", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchPatientDetails();
    }, [id]);

    const handleSaveScan = (imageDataUrl: string) => {
        const newDoc = {
            id: Date.now().toString(),
            url: imageDataUrl,
            date: new Date()
        };
        setScannedDocuments([newDoc, ...scannedDocuments]);
        setIsScannerOpen(false);
        setActiveTab("documents");
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex justify-center items-center h-[50vh]">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        );
    }

    if (!patient) {
        return (
            <DashboardLayout>
                <div className="text-center py-10">
                    <h2 className="text-xl font-bold">Patient introuvable</h2>
                    <Button variant="link" onClick={() => navigate('/dashboard/doctor/patients')}>
                        Retour à la liste
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout
            title={`Dossier Médical: ${patient.prenom} ${patient.nom}`}
            subtitle="Vue détaillée et gestion des documents"
        >
            <Button variant="ghost" className="mb-4 pl-0 hover:bg-transparent hover:text-primary" onClick={() => navigate('/dashboard/doctor/patients')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux patients
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar Info */}
                <Card className="lg:col-span-1 h-fit">
                    <CardHeader className="text-center">
                        <div className="mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary mb-2">
                            {patient.prenom?.[0]}{patient.nom?.[0]}
                        </div>
                        <CardTitle>{patient.prenom} {patient.nom}</CardTitle>
                        <CardDescription>Patient</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-sm">
                            <div className="text-muted-foreground mb-1">Contact</div>
                            <div className="font-medium">{patient.email}</div>
                            <div className="font-medium">{patient.telephone || "N/A"}</div>
                        </div>
                        <div className="text-sm">
                            <div className="text-muted-foreground mb-1">Ville</div>
                            <div className="font-medium">{patient.city || "Non renseignée"}</div>
                        </div>
                        <div className="pt-4 border-t">
                            <Button className="w-full" variant="outline">
                                <User className="w-4 h-4 mr-2" />
                                Modifier Profil
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Content Info */}
                <div className="lg:col-span-3">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-6">
                            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                            <TabsTrigger value="journal">Journal Médical</TabsTrigger>
                            <TabsTrigger value="documents">Documents & Scans</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">Dernière Visite</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold flex items-center gap-2">
                                            <Calendar className="w-5 h-5 text-primary" />
                                            {new Date().toLocaleDateString('fr-FR')} {/* Mock date */}
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">Documents</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold flex items-center gap-2">
                                            <FileText className="w-5 h-5 text-primary" />
                                            {scannedDocuments.length}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Notes rapides</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">Aucune note épinglée pour ce patient.</p>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="journal">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle>Historique des consultations</CardTitle>
                                    <Button size="sm">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Nouvelle entrée
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center py-8 text-muted-foreground">
                                        Le journal est vide pour le moment.
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="documents" className="space-y-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">Rapports et Analyses</h3>
                                <Dialog open={isScannerOpen} onOpenChange={setIsScannerOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="bg-primary hover:bg-primary/90">
                                            <Camera className="w-4 h-4 mr-2" />
                                            Scanner un rapport
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-3xl p-0 bg-black border-0 overflow-hidden">
                                        <ReportScanner
                                            onSave={handleSaveScan}
                                            onCancel={() => setIsScannerOpen(false)}
                                        />
                                    </DialogContent>
                                </Dialog>
                            </div>

                            {scannedDocuments.length === 0 ? (
                                <Card className="border-dashed">
                                    <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                        <FileText className="w-12 h-12 mb-4 opacity-50" />
                                        <p>Aucun document scanné.</p>
                                        <Button variant="link" onClick={() => setIsScannerOpen(true)}>
                                            Scanner maintenant
                                        </Button>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {scannedDocuments.map((doc) => (
                                        <Card key={doc.id} className="overflow-hidden group">
                                            <div className="aspect-[3/4] relative bg-muted">
                                                <img
                                                    src={doc.url}
                                                    alt="Scanned Report"
                                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Button variant="secondary" size="sm">Voir</Button>
                                                </div>
                                            </div>
                                            <div className="p-2 text-xs text-center border-t bg-muted/20">
                                                {doc.date.toLocaleDateString()} - {doc.date.toLocaleTimeString()}
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </DashboardLayout>
    );
}
