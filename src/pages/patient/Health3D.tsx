import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Activity, FileText, History, User, Loader2 } from 'lucide-react';
import AutoDiagnostic from '@/components/patient/AutoDiagnostic';
import HolographicReport from '@/components/patient/HolographicReport';
import HealthJournal from '@/components/patient/HealthJournal';
import PatientPreview3D from '@/components/patient/PatientPreview3D';
import { mockHealthJournal } from '@/data/mockHealthData';
import { painPointService, rapportService, journalService } from '@/services/api';
import { PainPoint, MedicalReport, HealthJournalEntry } from '@/data/mockHealthData';
import { useToast } from '@/hooks/use-toast';

export default function Health3D() {
    const [activeTab, setActiveTab] = useState('diagnostic');
    const [painPoints, setPainPoints] = useState<PainPoint[]>([]);
    const [rapports, setRapports] = useState<MedicalReport[]>([]);
    const [journalEntries, setJournalEntries] = useState<HealthJournalEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    // Load all data from backend on mount
    useEffect(() => {
        loadAllData();
    }, []);

    const loadAllData = async () => {
        setIsLoading(true);
        await Promise.all([
            loadPainPoints(),
            loadRapports(),
            loadJournal()
        ]);
        setIsLoading(false);
    };

    const loadPainPoints = async () => {
        try {
            const response = await painPointService.getMyPainPoints();
            if (response.status === 'success' && response.data?.points) {
                // Map backend pain points to include 'id' field from '_id'
                const mappedPoints = response.data.points.map((point: any) => ({
                    ...point,
                    id: point._id || point.id,
                }));
                setPainPoints(mappedPoints);
            }
        } catch (error: any) {
            console.error('Error loading pain points:', error);
        }
    };

    const loadRapports = async () => {
        try {
            const response = await rapportService.getMyRapports();
            if (response.status === 'success' && response.data?.rapports) {
                setRapports(response.data.rapports);
            }
        } catch (error: any) {
            console.error('Error loading rapports:', error);
        }
    };

    const loadJournal = async () => {
        try {
            const response = await journalService.getMyJournal();
            if (response.status === 'success' && response.data?.journal) {
                setJournalEntries(response.data.journal);
            }
        } catch (error: any) {
            console.error('Error loading journal:', error);
        }
    };

    const handleDiagnosticComplete = async (newPainPoints: PainPoint[]) => {
        try {
            // Save each pain point to backend
            const savePromises = newPainPoints.map(point =>
                painPointService.createPainPoint({
                    bodyPart: point.bodyPart,
                    position: point.position,
                    intensity: point.intensity,
                })
            );

            await Promise.all(savePromises);

            toast({
                title: 'Succès',
                description: 'Votre auto-diagnostic a été enregistré',
            });

            // Reload pain points from backend
            await loadPainPoints();

            // Generate AI medical report automatically
            toast({
                title: '🤖 Génération du rapport IA...',
                description: 'L\'IA analyse vos symptômes',
            });

            try {
                await rapportService.generateAIReport(newPainPoints);

                toast({
                    title: '✅ Rapport médical généré',
                    description: 'Consultez l\'onglet "Rapport 3D" pour voir votre diagnostic',
                });

                // Reload reports to show the new AI-generated one
                await loadRapports();

                // Switch to report tab to show the result
                setActiveTab('report');
            } catch (aiError: any) {
                console.error('Error generating AI report:', aiError);
                toast({
                    title: 'Erreur IA',
                    description: 'Impossible de générer le rapport automatique',
                    variant: 'destructive',
                });
            }
        } catch (error: any) {
            console.error('Error saving pain points:', error);
            toast({
                title: 'Erreur',
                description: 'Impossible d\'enregistrer vos points de douleur',
                variant: 'destructive',
            });
        }
    };

    // Current active report (use first one or create empty one)
    const mockReport: MedicalReport = rapports.length > 0 ? {
        ...rapports[0],
        recommendations: (rapports[0] as any).recommandations || rapports[0].recommendations || []
    } : {
        id: 'temp-report',
        date: new Date().toISOString().split('T')[0],
        doctorName: 'En attente',
        diagnosis: "Aucun rapport médical disponible.",
        diagnosisDarija: "Ma kaynch rapport tibbi.",
        painPoints: painPoints,
        recommendations: []
    };

    return (
        <DashboardLayout>
            <div className="container mx-auto p-6 max-w-7xl animate-in fade-in duration-500">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
                            Espace Santé 3D
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Visualisez votre santé en trois dimensions
                        </p>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 p-1 glass-panel">
                        <TabsTrigger value="diagnostic" className="data-[state=active]:bg-primary/20">
                            <Activity className="w-4 h-4 mr-2" />
                            Auto-Diagnostic
                        </TabsTrigger>
                        <TabsTrigger value="report" className="data-[state=active]:bg-primary/20">
                            <FileText className="w-4 h-4 mr-2" />
                            Rapport 3D
                        </TabsTrigger>
                        <TabsTrigger value="journal" className="data-[state=active]:bg-primary/20">
                            <History className="w-4 h-4 mr-2" />
                            Historique & Timeline
                        </TabsTrigger>
                        <TabsTrigger value="preview" className="data-[state=active]:bg-primary/20">
                            <User className="w-4 h-4 mr-2" />
                            Aperçu Patient
                        </TabsTrigger>
                    </TabsList>

                    <div className="min-h-[600px]">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-[600px]">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        ) : (
                            <>
                                <TabsContent value="diagnostic" className="h-full m-0">
                                    <AutoDiagnostic
                                        initialPainPoints={painPoints}
                                        onComplete={handleDiagnosticComplete}
                                    />
                                </TabsContent>

                                <TabsContent value="report" className="h-full m-0">
                                    <HolographicReport report={mockReport} />
                                </TabsContent>

                                <TabsContent value="journal" className="h-full m-0">
                                    <HealthJournal entries={journalEntries.length > 0 ? journalEntries : mockHealthJournal} />
                                </TabsContent>

                                <TabsContent value="preview" className="h-full m-0">
                                    <PatientPreview3D patientName="Moi" painPoints={painPoints} />
                                </TabsContent>
                            </>
                        )}
                    </div>
                </Tabs>
            </div>
        </DashboardLayout>
    );
}
