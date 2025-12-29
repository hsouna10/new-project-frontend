import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Activity, FileText, History, User } from 'lucide-react';
import AutoDiagnostic from '@/components/patient/AutoDiagnostic';
import HolographicReport from '@/components/patient/HolographicReport';
import HealthJournal from '@/components/patient/HealthJournal';
import PatientPreview3D from '@/components/patient/PatientPreview3D';
import { mockHealthJournal, mockPainPoints } from '@/data/mockHealthData';

export default function Health3D() {
    const [activeTab, setActiveTab] = useState('diagnostic');

    // Pour la démo, on utilise des rapports statiques
    const mockReport = {
        id: 'r1',
        date: '2024-12-16',
        doctorName: 'Dr. Mansouri',
        diagnosis: "Lombalgie mécanique aiguë. Inflammation modérée.",
        diagnosisDarija: "Wji3a fi dhar. Inflamation 5fifa.",
        painPoints: mockPainPoints,
        recommendations: [
            { id: 'rec1', type: 'medication' as const, text: 'Prendre Doliprane 1000mg', textDarija: 'Ochrob doliprane 1000', completed: false },
            { id: 'rec2', type: 'exercise' as const, text: 'Repos strict 2 jours', textDarija: 'Arte7 youmein', completed: true },
        ]
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
                        <TabsContent value="diagnostic" className="h-full m-0">
                            <AutoDiagnostic onComplete={(points) => console.log('Diagnostic complet:', points)} />
                        </TabsContent>

                        <TabsContent value="report" className="h-full m-0">
                            <HolographicReport report={mockReport} />
                        </TabsContent>

                        <TabsContent value="journal" className="h-full m-0">
                            <HealthJournal entries={mockHealthJournal} />
                        </TabsContent>

                        <TabsContent value="preview" className="h-full m-0">
                            <PatientPreview3D patientName="Moi" painPoints={mockPainPoints} />
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </DashboardLayout>
    );
}
