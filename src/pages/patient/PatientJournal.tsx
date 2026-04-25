import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Book, 
    Calendar, 
    User, 
    Activity, 
    Pill, 
    Stethoscope, 
    ClipboardList,
    Sparkles,
    Loader2,
    ChevronRight,
    PlayCircle,
    Download
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { journalService } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface JournalEntry {
    _id: string;
    type: 'visite' | 'symptome' | 'medicament';
    titre: string;
    description: string;
    date: string;
    fichierJoint?: string;
    urlMemoVocal?: string;
    recommandations?: {
        id: string;
        text: string;
        completed: boolean;
    }[];
    docteur?: {
        nom: string;
        prenom: string;
        specialite: string;
    };
}

interface AISummary {
    synthesis: string;
    synthesisDarija?: string;
}

export default function PatientJournal() {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [summary, setSummary] = useState<AISummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingSummary, setLoadingSummary] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        fetchJournal();
        fetchSummary();
    }, []);

    const fetchJournal = async () => {
        try {
            const response = await journalService.getMyJournal();
            if (response.status === 'success') {
                setEntries(response.data.journal);
            }
        } catch (error) {
            console.error("Error fetching journal:", error);
            toast({
                title: "Erreur",
                description: "Impossible de charger votre journal de santé.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchSummary = async () => {
        setLoadingSummary(true);
        try {
            const response = await journalService.generateSummary();
            if (response.status === 'success') {
                setSummary(response.data);
            }
        } catch (error) {
            console.error("Error generating summary:", error);
        } finally {
            setLoadingSummary(false);
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'visite': return <Stethoscope className="w-5 h-5" />;
            case 'symptome': return <Activity className="w-5 h-5" />;
            case 'medicament': return <Pill className="w-5 h-5" />;
            default: return <ClipboardList className="w-5 h-5" />;
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

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">Mon Journal de Santé</h1>
                        <p className="text-muted-foreground">
                            Suivez votre historique médical et vos recommandations personnalisées
                        </p>
                    </div>
                </motion.div>

                {/* AI Summary Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="glass-panel border-primary/20 bg-primary/5 overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Sparkles className="w-24 h-24 text-primary" />
                        </div>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                                Synthèse Intelligente (IA)
                            </CardTitle>
                            <CardDescription>
                                Un résumé automatique de votre état de santé basé sur vos dernières entrées
                             </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loadingSummary ? (
                                <div className="flex items-center gap-2 text-muted-foreground py-4">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Génération de la synthèse en cours...
                                </div>
                            ) : summary ? (
                                <div className="space-y-4">
                                    <div className="p-4 rounded-xl bg-background/50 border border-white/10 backdrop-blur-sm">
                                        <p className="text-foreground leading-relaxed italic">
                                            "{summary.synthesis}"
                                        </p>
                                    </div>
                                    {summary.synthesisDarija && (
                                        <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                                            <p className="text-primary font-medium text-right font-arabic">
                                                {summary.synthesisDarija}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-muted-foreground italic">
                                    Ajoutez plus d'entrées pour générer une synthèse.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Journal Content */}
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        Historique des Entrées
                    </h2>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : entries.length === 0 ? (
                        <Card className="glass-panel border-dashed border-white/20">
                            <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                                <Book className="w-12 h-12 mb-4 opacity-20" />
                                <p>Votre journal est vide.</p>
                                <p className="text-sm">Les notes de vos médecins apparaîtront ici.</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-6">
                            {entries.map((entry, index) => (
                                <motion.div
                                    key={entry._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 + index * 0.05 }}
                                >
                                    <Card className="glass-panel border-white/10 hover:border-primary/30 transition-all duration-300">
                                        <CardContent className="p-6">
                                            <div className="flex flex-col md:flex-row gap-6">
                                                {/* Date & Type Header */}
                                                <div className="md:w-48 flex-shrink-0">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Badge variant="outline" className={getTypeColor(entry.type)}>
                                                            {getTypeIcon(entry.type)}
                                                            <span className="ml-1 capitalize">{entry.type}</span>
                                                        </Badge>
                                                    </div>
                                                    <div className="text-sm text-muted-foreground font-medium">
                                                        {format(new Date(entry.date), 'dd MMMM yyyy', { locale: fr })}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground/60 uppercase tracking-wider mt-1">
                                                        {format(new Date(entry.date), 'HH:mm')}
                                                    </div>
                                                </div>

                                                {/* Entry Content */}
                                                <div className="flex-1 space-y-4">
                                                    <div>
                                                        <h3 className="text-xl font-bold mb-2">{entry.titre}</h3>
                                                        <p className="text-muted-foreground whitespace-pre-wrap">
                                                            {entry.description}
                                                        </p>
                                                    </div>

                                                    {/* Doctor Info */}
                                                    {entry.docteur && (
                                                        <div className="flex items-center gap-3 bg-muted/30 p-3 rounded-xl border border-white/5 w-fit">
                                                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                                                                {entry.docteur.prenom[0]}{entry.docteur.nom[0]}
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-semibold">Dr. {entry.docteur.prenom} {entry.docteur.nom}</div>
                                                                <div className="text-[10px] text-muted-foreground uppercase">{entry.docteur.specialite}</div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Recommendations */}
                                                    {entry.recommandations && entry.recommandations.length > 0 && (
                                                        <div className="space-y-2 pt-2">
                                                            <h4 className="text-sm font-semibold flex items-center gap-2 text-primary">
                                                                <ClipboardList className="w-4 h-4" />
                                                                Recommandations :
                                                            </h4>
                                                            <ul className="grid gap-2">
                                                                {entry.recommandations.map((rec) => (
                                                                    <li key={rec.id} className="flex items-start gap-3 p-3 rounded-lg bg-background/40 border border-white/5">
                                                                        <div className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${rec.completed ? 'bg-green-500' : 'bg-primary'}`} />
                                                                        <span className={`text-sm ${rec.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                                                            {rec.text}
                                                                        </span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}

                                                    {/* Files/Audio */}
                                                    <div className="flex flex-wrap gap-3 pt-2">
                                                        {entry.urlMemoVocal && (
                                                            <Button variant="outline" size="sm" className="rounded-full gap-2 border-primary/20 hover:bg-primary/5">
                                                                <PlayCircle className="w-4 h-4 text-primary" />
                                                                Note Vocale
                                                            </Button>
                                                        )}
                                                        {entry.fichierJoint && (
                                                            <Button variant="outline" size="sm" className="rounded-full gap-2 border-primary/20 hover:bg-primary/5">
                                                                <Download className="w-4 h-4 text-primary" />
                                                                Document Joint
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
