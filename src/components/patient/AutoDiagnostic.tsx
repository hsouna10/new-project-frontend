import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Check, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import HumanBody3D from '@/components/three/HumanBody3D';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { bodyParts, PainPoint } from '@/data/mockHealthData';

interface AutoDiagnosticProps {
    initialPainPoints?: PainPoint[];
    onComplete?: (painPoints: PainPoint[]) => void | Promise<void>;
}

export default function AutoDiagnostic({ initialPainPoints = [], onComplete }: AutoDiagnosticProps) {
    const [selectedPart, setSelectedPart] = useState<string | null>(null);
    const [painIntensity, setPainIntensity] = useState(5);
    const [painPoints, setPainPoints] = useState<PainPoint[]>(initialPainPoints);
    const [step, setStep] = useState<'select' | 'intensity' | 'complete'>('select');
    const [isSaving, setIsSaving] = useState(false);

    const selectedPartData = bodyParts.find((p) => p.id === selectedPart);

    const handlePartClick = (partId: string) => {
        setSelectedPart(partId);
        setStep('intensity');
        setPainIntensity(5);
    };

    const handleConfirmPain = () => {
        if (!selectedPart || !selectedPartData) return;

        const newPainPoint: PainPoint = {
            id: `pain-${Date.now()}`,
            bodyPart: selectedPartData.name,
            position: selectedPartData.position,
            intensity: painIntensity,
            date: new Date().toISOString().split('T')[0],
        };

        setPainPoints((prev) => [...prev, newPainPoint]);
        setSelectedPart(null);
        setStep('select');
    };

    const handleRemovePain = (id: string) => {
        setPainPoints((prev) => prev.filter((p) => p.id !== id));
    };

    const handleComplete = async () => {
        setStep('complete');
        setIsSaving(true);
        try {
            await onComplete?.(painPoints);
        } finally {
            setIsSaving(false);
        }
    };

    const getIntensityColor = (intensity: number) => {
        if (intensity <= 3) return 'text-green-400';
        if (intensity <= 6) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getIntensityLabel = (intensity: number) => {
        if (intensity <= 2) return 'Légère';
        if (intensity <= 4) return 'Modérée';
        if (intensity <= 6) return 'Significative';
        if (intensity <= 8) return 'Intense';
        return 'Très intense';
    };

    return (
        <div className="grid lg:grid-cols-2 gap-6 h-full">
            {/* 3D Model */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel rounded-2xl p-6 relative min-h-[500px]"
            >
                <div className="absolute top-4 left-4 z-10">
                    <h3 className="text-lg font-semibold">Modèle Anatomique 3D</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Cliquez sur la zone douloureuse
                    </p>
                </div>

                <div className="absolute top-4 right-4 z-10">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            setSelectedPart(null);
                            setStep('select');
                        }}
                        className="glass-button"
                    >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Réinitialiser vue
                    </Button>
                </div>

                <div className="h-full pt-16">
                    <HumanBody3D
                        painPoints={painPoints}
                        selectedPart={selectedPart}
                        onPartClick={handlePartClick}
                        isInteractive={step === 'select' || step === 'intensity'}
                    />
                </div>

                {/* Selected part info overlay */}
                <AnimatePresence>
                    {step === 'intensity' && selectedPartData && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="absolute bottom-4 left-4 right-4 glass-panel rounded-xl p-4 bg-background/90"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Zone sélectionnée</p>
                                    <h4 className="text-lg font-semibold text-primary">
                                        {selectedPartData.name}
                                    </h4>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-muted-foreground">Intensité</p>
                                    <p className={`text-2xl font-bold ${getIntensityColor(painIntensity)}`}>
                                        {painIntensity}/10
                                    </p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <p className="text-sm text-muted-foreground mb-2">
                                    {getIntensityLabel(painIntensity)}
                                </p>
                                <Slider
                                    value={[painIntensity]}
                                    onValueChange={([value]) => setPainIntensity(value)}
                                    min={1}
                                    max={10}
                                    step={1}
                                    className="py-2"
                                />
                                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                    <span>Faible</span>
                                    <span>Intense</span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    className="flex-1 glass-button"
                                    onClick={() => {
                                        setSelectedPart(null);
                                        setStep('select');
                                    }}
                                >
                                    Annuler
                                </Button>
                                <Button className="flex-1" onClick={handleConfirmPain}>
                                    <Check className="w-4 h-4 mr-2" />
                                    Confirmer
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Pain Points List & Actions */}
            <div className="space-y-6">
                {/* Instructions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-panel rounded-2xl p-6"
                >
                    <div className="flex items-start gap-3 mb-4">
                        <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                            <h3 className="font-semibold">Auto-diagnostic guidé</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Identifiez précisément vos zones de douleur en cliquant sur le modèle 3D.
                                Cette information aidera votre médecin à mieux comprendre votre état.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-400" />
                            <span className="text-muted-foreground">Douleur légère (1-3)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-orange-400" />
                            <span className="text-muted-foreground">Douleur modérée (4-6)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <span className="text-muted-foreground">Douleur intense (7-10)</span>
                        </div>
                    </div>
                </motion.div>

                {/* Pain Points List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-panel rounded-2xl p-6"
                >
                    <h3 className="font-semibold mb-4">
                        Zones identifiées ({painPoints.length})
                    </h3>

                    {painPoints.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">
                            Aucune zone de douleur identifiée.
                            <br />
                            Cliquez sur le modèle 3D pour commencer.
                        </p>
                    ) : (
                        <div className="space-y-3 max-h-[300px] overflow-y-auto">
                            {painPoints.map((point, index) => (
                                <motion.div
                                    key={point.id || point._id || `pain-point-${index}`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center justify-between p-3 rounded-xl bg-muted/30"
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-10 h-10 rounded-full flex items-center justify-center"
                                            style={{
                                                background: `linear-gradient(135deg, 
                          ${point.intensity <= 3 ? '#22c55e' : point.intensity <= 6 ? '#eab308' : '#ef4444'},
                          ${point.intensity <= 3 ? '#16a34a' : point.intensity <= 6 ? '#ca8a04' : '#dc2626'}
                        )`,
                                            }}
                                        >
                                            <span className="text-white font-bold text-sm">
                                                {point.intensity}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-medium">{point.bodyPart}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {getIntensityLabel(point.intensity)}
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemovePain(point.id)}
                                        className="text-destructive hover:text-destructive"
                                    >
                                        ×
                                    </Button>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Complete Button */}
                {painPoints.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Button
                            className="w-full h-14 text-lg"
                            onClick={handleComplete}
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Enregistrement...
                                </>
                            ) : (
                                <>
                                    Terminer l'auto-diagnostic
                                    <ChevronRight className="w-5 h-5 ml-2" />
                                </>
                            )}
                        </Button>
                    </motion.div>
                )}

                {/* Completion Message */}
                <AnimatePresence>
                    {step === 'complete' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-panel rounded-2xl p-6 border-primary/30"
                        >
                            <div className="flex items-center gap-3 text-primary">
                                <Check className="w-6 h-6" />
                                <div>
                                    <h3 className="font-semibold">Auto-diagnostic terminé</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Vos informations seront transmises à votre médecin
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
