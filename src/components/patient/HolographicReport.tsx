import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Volume2, VolumeX, Check, Circle, Sparkles, Download } from 'lucide-react';
import HumanBody3D from '@/components/three/HumanBody3D';
import { Button } from '@/components/ui/button';
import { MedicalReport, Recommendation } from '@/data/mockHealthData';

interface HolographicReportProps {
    report: MedicalReport;
    onSpeakDarija?: (text: string) => void;
}

export default function HolographicReport({ report, onSpeakDarija }: HolographicReportProps) {
    const [activeRecommendation, setActiveRecommendation] = useState<Recommendation | null>(null);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [showDarija, setShowDarija] = useState(false);
    const [completedItems, setCompletedItems] = useState<string[]>([]);

    const handleSpeak = (text: string) => {
        if ('speechSynthesis' in window) {
            setIsSpeaking(true);
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'ar-TN';
            utterance.onend = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
        }
        onSpeakDarija?.(text);
    };

    const stopSpeaking = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };

    const toggleComplete = (id: string) => {
        setCompletedItems((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const getRecommendationIcon = (type: Recommendation['type']) => {
        switch (type) {
            case 'medication': return '💊';
            case 'exercise': return '🏃';
            case 'lifestyle': return '🌿';
            case 'follow-up': return '📅';
        }
    };

    return (
        <div className="grid lg:grid-cols-2 gap-6">
            {/* 3D Model with Recommendations */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel rounded-2xl p-6 relative min-h-[500px]"
            >
                <div className="absolute top-4 left-4 z-10">
                    <h3 className="text-lg font-semibold">Rapport Holographique</h3>
                    <p className="text-sm text-muted-foreground">
                        {report.date} • {report.doctorName}
                    </p>
                </div>

                <div className="h-[400px]">
                    <HumanBody3D
                        painPoints={report.painPoints}
                        highlightedRecommendation={activeRecommendation?.bodyPart}
                        isInteractive={false}
                    />
                </div>

                {/* Active Recommendation Overlay */}
                <AnimatePresence>
                    {activeRecommendation && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="absolute bottom-4 left-4 right-4 glass-panel rounded-xl p-4 border border-primary/30 bg-background/90"
                        >
                            <div className="flex items-start gap-3">
                                <div className="text-2xl">{getRecommendationIcon(activeRecommendation.type)}</div>
                                <div className="flex-1">
                                    <p className="font-medium">{activeRecommendation.text}</p>
                                    {activeRecommendation.bodyPart && (
                                        <p className="text-sm text-primary mt-1">
                                            Zone: {activeRecommendation.bodyPart}
                                        </p>
                                    )}
                                </div>
                                <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Report Details */}
            <div className="space-y-6">
                {/* Diagnosis */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-panel rounded-2xl p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary" />
                            Diagnostic
                        </h3>
                        <Button
                            variant="outline"
                            size="sm"
                            className="glass-button"
                            onClick={() => setShowDarija(!showDarija)}
                        >
                            <Sparkles className="w-4 h-4 mr-2" />
                            {showDarija ? 'Français' : 'Fahmouni'}
                        </Button>
                    </div>

                    <div className="p-4 rounded-xl bg-muted/30 mb-4">
                        <p className={showDarija ? 'text-right font-medium' : ''}>
                            {showDarija ? report.diagnosisDarija : report.diagnosis}
                        </p>
                    </div>

                    {/* Audio Controls */}
                    {showDarija && report.diagnosisDarija && (
                        <Button
                            variant="outline"
                            className="w-full glass-button"
                            onClick={() => isSpeaking ? stopSpeaking() : handleSpeak(report.diagnosisDarija!)}
                        >
                            {isSpeaking ? (
                                <>
                                    <VolumeX className="w-4 h-4 mr-2" />
                                    Arrêter la lecture
                                </>
                            ) : (
                                <>
                                    <Volume2 className="w-4 h-4 mr-2" />
                                    Écouter en Darija
                                </>
                            )}
                        </Button>
                    )}
                </motion.div>

                {/* Recommendations Checklist */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-panel rounded-2xl p-6"
                >
                    <h3 className="font-semibold mb-4">Ce que je dois faire</h3>

                    <div className="space-y-3">
                        {report.recommendations.map((rec, index) => (
                            <motion.div
                                key={rec.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                                className={`p-4 rounded-xl transition-all cursor-pointer ${activeRecommendation?.id === rec.id
                                        ? 'bg-primary/20 border border-primary/30'
                                        : 'bg-muted/30 hover:bg-muted/50'
                                    } ${completedItems.includes(rec.id) ? 'opacity-60' : ''}`}
                                onClick={() => setActiveRecommendation(
                                    activeRecommendation?.id === rec.id ? null : rec
                                )}
                            >
                                <div className="flex items-start gap-3">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleComplete(rec.id);
                                        }}
                                        className={`mt-0.5 transition-colors ${completedItems.includes(rec.id)
                                                ? 'text-primary'
                                                : 'text-muted-foreground hover:text-primary'
                                            }`}
                                    >
                                        {completedItems.includes(rec.id) ? (
                                            <Check className="w-5 h-5" />
                                        ) : (
                                            <Circle className="w-5 h-5" />
                                        )}
                                    </button>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span>{getRecommendationIcon(rec.type)}</span>
                                            <span className={`text-sm ${completedItems.includes(rec.id) ? 'line-through' : ''}`}>
                                                {showDarija && rec.textDarija ? rec.textDarija : rec.text}
                                            </span>
                                        </div>
                                        {rec.bodyPart && (
                                            <span className="text-xs text-primary mt-1 block">
                                                📍 {rec.bodyPart}
                                            </span>
                                        )}
                                    </div>

                                    {showDarija && rec.textDarija && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSpeak(rec.textDarija!);
                                            }}
                                        >
                                            <Volume2 className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Progress */}
                    <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Progression</span>
                            <span className="font-medium">
                                {completedItems.length}/{report.recommendations.length}
                            </span>
                        </div>
                        <div className="h-2 rounded-full bg-muted/50 overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-primary to-secondary"
                                initial={{ width: 0 }}
                                animate={{
                                    width: `${(completedItems.length / report.recommendations.length) * 100}%`,
                                }}
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Download Button */}
                <Button variant="outline" className="w-full glass-button">
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger le rapport PDF
                </Button>
            </div>
        </div>
    );
}
