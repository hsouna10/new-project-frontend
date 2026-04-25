import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, User, Calendar, FileText, Camera, Plus, Loader2, Stethoscope, Activity, Pill, ClipboardList } from "lucide-react";
import { ReportScanner } from "@/components/doctor/ReportScanner";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { appointmentService, journalService } from '@/services/api';

export default function DoctorPatientDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    // Determine initial patient object structure, will refine with real data or proper types
    const [patient, setPatient] = useState<any>(null);
    const [activeTab, setActiveTab] = useState("overview");
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [scannedDocuments, setScannedDocuments] = useState<{ id: string, url: string, date: Date }[]>([]);

    const [journalEntries, setJournalEntries] = useState<any[]>([]);
    const [loadingJournal, setLoadingJournal] = useState(false);
    
    const { toast } = useToast();
    
    const [isNewEntryOpen, setIsNewEntryOpen] = useState(false);
    const [newEntryLoading, setNewEntryLoading] = useState(false);
    const [newEntryData, setNewEntryData] = useState({
        type: 'visite',
        titre: '',
        description: ''
    });

    useEffect(() => {
        // Mock fetching patient details or use an API
        // For now, we'll try to find the patient in the appointment list or fetch by ID if available
        // If no direct API for single patient, we might need to rely on passed state or fetch all and find

        const fetchJournal = async (patientId: string) => {
            setLoadingJournal(true);
            try {
                const res = await journalService.getPatientJournal(patientId);
                if (res?.data?.journal) {
                    setJournalEntries(res.data.journal);
                }
            } catch (error) {
                console.error("Error fetching journal", error);
            } finally {
                setLoadingJournal(false);
            }
        };

        const fetchPatientDetails = async () => {
            try {
                const response = await appointmentService.getCompletedAppointments();
                if (response.data?.appointments) {
                    const found = response.data.appointments.find((app: any) => app.patient?._id === id);
                    if (found) {
                        setPatient(found.patient);
                        fetchJournal(found.patient._id || id);
                    } else {
                        setPatient({
                            _id: id,
                            prenom: "Patient",
                            nom: "Inconnu",
                            email: "patient@example.com",
                            telephone: "+216 00 000 000",
                            city: "Tunis"
                        });
                        fetchJournal(id as string);
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

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'visite': return <Stethoscope className="w-4 h-4" />;
            case 'symptome': return <Activity className="w-4 h-4" />;
            case 'medicament': return <Pill className="w-4 h-4" />;
            default: return <ClipboardList className="w-4 h-4" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'visite': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'symptome': return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'medicament': return 'bg-green-500/10 text-green-500 border-green-500/20';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    const handleCreateEntry = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;
        setNewEntryLoading(true);
        try {
            await journalService.createJournalEntry({
                type: newEntryData.type,
                title: newEntryData.titre,
                description: newEntryData.description
            }, id);
            
            toast({ title: 'Succès', description: 'Entrée ajoutée au journal.' });
            setIsNewEntryOpen(false);
            setNewEntryData({ type: 'visite', titre: '', description: '' });
            
            const res = await journalService.getPatientJournal(id);
            if (res?.data?.journal) {
                setJournalEntries(res.data.journal);
            }
        } catch(error) {
            toast({ title: 'Erreur', description: "Impossible d'ajouter l'entrée", variant: 'destructive' });
        } finally {
            setNewEntryLoading(false);
        }
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

                        <TabsContent value="journal" className="space-y-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">Historique des consultations</h3>
                                <Dialog open={isNewEntryOpen} onOpenChange={setIsNewEntryOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="bg-primary hover:bg-primary/90">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Nouvelle entrée
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[500px] border-white/10 bg-background/95 backdrop-blur-xl">
                                        <form onSubmit={handleCreateEntry}>
                                            <DialogHeader>
                                                <DialogTitle>Ajouter au Journal</DialogTitle>
                                                <DialogDescription>
                                                    Ajouter une note de consultation, symptôme ou médicament pour ce patient.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                <div className="flex flex-col gap-2">
                                                    <Label htmlFor="type">Type d'entrée</Label>
                                                    <select
                                                        id="type"
                                                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all disabled:cursor-not-allowed disabled:opacity-50"
                                                        value={newEntryData.type}
                                                        onChange={(e) => setNewEntryData({...newEntryData, type: e.target.value})}
                                                        required
                                                    >
                                                        <option value="visite">Visite / Consultation</option>
                                                        <option value="symptome">Symptôme</option>
                                                        <option value="medicament">Médicament</option>
                                                    </select>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <Label htmlFor="titre">Titre</Label>
                                                    <Input
                                                        id="titre"
                                                        value={newEntryData.titre}
                                                        onChange={(e) => setNewEntryData({...newEntryData, titre: e.target.value})}
                                                        placeholder="Ex: Consultation de suivi post-opératoire"
                                                        required
                                                        className="bg-background/50"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <Label htmlFor="desc">Description détaillée</Label>
                                                    <textarea
                                                        id="desc"
                                                        value={newEntryData.description}
                                                        onChange={(e) => setNewEntryData({...newEntryData, description: e.target.value})}
                                                        className="flex min-h-[120px] w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus:border-primary transition-all disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                                                        placeholder="Notes de la consultation..."
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button type="button" variant="ghost" onClick={() => setIsNewEntryOpen(false)}>Annuler</Button>
                                                <Button type="submit" disabled={newEntryLoading} className="bg-primary text-primary-foreground">
                                                    {newEntryLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                                                    Enregistrer
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            {loadingJournal ? (
                                <div className="flex justify-center py-10">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                </div>
                            ) : journalEntries.length === 0 ? (
                                <Card className="border-dashed bg-transparent shadow-none">
                                    <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                        <ClipboardList className="w-12 h-12 mb-4 opacity-20" />
                                        <p>Aucune entrée dans le journal de ce patient.</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="space-y-4">
                                    {journalEntries.map((entry: any) => (
                                        <Card key={entry._id} className="glass-panel border-white/10 overflow-hidden hover:border-primary/20 transition-colors">
                                            <CardContent className="p-4 sm:p-6">
                                                <div className="flex flex-col sm:flex-row gap-4">
                                                    <div className="sm:w-40 flex-shrink-0">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Badge variant="outline" className={getTypeColor(entry.type)}>
                                                                {getTypeIcon(entry.type)}
                                                                <span className="ml-1 capitalize">{entry.type}</span>
                                                            </Badge>
                                                        </div>
                                                        <div className="text-sm font-medium">
                                                            {format(new Date(entry.date), 'dd MMMM yyyy', { locale: fr })}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground uppercase mt-1">
                                                            {format(new Date(entry.date), 'HH:mm')}
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-base font-bold mb-1 truncate">{entry.titre}</h4>
                                                        <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap break-words">
                                                            {entry.description}
                                                        </p>
                                                        {entry.docteur && (
                                                            <div className="mt-4 pt-3 border-t border-border/50 text-xs text-muted-foreground italic flex items-center gap-2">
                                                                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary not-italic">
                                                                    {entry.docteur.prenom[0]}{entry.docteur.nom[0]}
                                                                </div>
                                                                Ajouté par Dr. {entry.docteur.prenom} {entry.docteur.nom}
                                                                {entry.docteur.specialite && (
                                                                    <span className="opacity-70">({entry.docteur.specialite})</span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
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
