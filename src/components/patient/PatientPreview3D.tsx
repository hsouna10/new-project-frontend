import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, MessageSquare, Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import HumanBody3D from '@/components/three/HumanBody3D';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { PainPoint, DoctorNote, mockPainPoints } from '@/data/mockHealthData';

interface PatientPreview3DProps {
    patientName: string;
    painPoints: PainPoint[];
    onAddNote?: (note: DoctorNote) => void;
}

export default function PatientPreview3D({
    patientName,
    painPoints = mockPainPoints,
    onAddNote,
}: PatientPreview3DProps) {
    const [selectedPoint, setSelectedPoint] = useState<PainPoint | null>(null);
    const [isAddingNote, setIsAddingNote] = useState(false);
    const [newNote, setNewNote] = useState('');
    const [timelineIndex, setTimelineIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    // Simuler une timeline d'évolution
    const timelineData = [
        { date: '2024-11-15', painPoints: painPoints.map(p => ({ ...p, intensity: Math.min(10, p.intensity + 3) })) },
        { date: '2024-12-01', painPoints: painPoints.map(p => ({ ...p, intensity: Math.min(10, p.intensity + 1) })) },
        { date: '2024-12-15', painPoints },
        { date: '2024-12-22', painPoints: painPoints.map(p => ({ ...p, intensity: Math.max(1, p.intensity - 1) })) },
    ];

    const currentTimelineData = timelineData[timelineIndex];

    const handleAddNote = () => {
        if (!newNote.trim() || !selectedPoint) return;

        const doctorNote: DoctorNote = {
            id: `note-${Date.now()}`,
            text: newNote,
            date: new Date().toISOString().split('T')[0],
            doctorName: 'Dr. Mansouri',
        };

        onAddNote?.(doctorNote);
        setNewNote('');
        setIsAddingNote(false);
    };

    const handleTimelineChange = (value: number[]) => {
        setTimelineIndex(value[0]);
        setIsPlaying(false);
    };

    const playTimeline = () => {
        setIsPlaying(true);
        const interval = setInterval(() => {
            setTimelineIndex((prev) => {
                if (prev >= timelineData.length - 1) {
                    setIsPlaying(false);
                    clearInterval(interval);
                    return prev;
                }
                return prev + 1;
            });
        }, 1500);
    };

    return (
        <div className="grid lg:grid-cols-3 gap-6">
            {/* 3D Model */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="lg:col-span-2 glass-panel rounded-2xl p-6 relative min-h-[500px]"
            >
                <div className="absolute top-4 left-4 z-10">
                    <h3 className="text-lg font-semibold">Profil 3D - {patientName}</h3>
                    <p className="text-sm text-muted-foreground">
                        {currentTimelineData.date} • {currentTimelineData.painPoints.length} zones
                    </p>
                </div>

                <div className="h-[400px]">
                    <HumanBody3D
                        painPoints={currentTimelineData.painPoints}
                        selectedPart={selectedPoint?.bodyPart}
                        onPartClick={(partId) => {
                            const point = painPoints.find(p =>
                                p.bodyPart.toLowerCase().includes(partId.toLowerCase())
                            );
                            setSelectedPoint(point || null);
                        }}
                        isInteractive={true}
                    />
                </div>

                {/* Timeline Controls */}
                <div className="absolute bottom-4 left-4 right-4 glass-panel rounded-xl p-4">
                    <div className="flex items-center gap-4 mb-3">
                        <Button
                            variant="outline"
                            size="icon"
                            className="glass-button"
                            onClick={() => setTimelineIndex(Math.max(0, timelineIndex - 1))}
                            disabled={timelineIndex === 0}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>

                        <Button
                            variant="outline"
                            size="icon"
                            className="glass-button"
                            onClick={isPlaying ? () => setIsPlaying(false) : playTimeline}
                        >
                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>

                        <Button
                            variant="outline"
                            size="icon"
                            className="glass-button"
                            onClick={() => setTimelineIndex(Math.min(timelineData.length - 1, timelineIndex + 1))}
                            disabled={timelineIndex === timelineData.length - 1}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>

                        <div className="flex-1">
                            <Slider
                                value={[timelineIndex]}
                                onValueChange={handleTimelineChange}
                                min={0}
                                max={timelineData.length - 1}
                                step={1}
                            />
                        </div>
                    </div>

                    <div className="flex justify-between text-xs text-muted-foreground">
                        {timelineData.map((item, i) => (
                            <span
                                key={item.date}
                                className={i === timelineIndex ? 'text-primary font-medium' : ''}
                            >
                                {item.date}
                            </span>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Pain Details & Notes */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
            >
                {/* Selected Point Details */}
                <div className="glass-panel rounded-2xl p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        Détails de la zone
                    </h3>

                    {selectedPoint ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Zone</span>
                                <span className="font-medium text-primary">{selectedPoint.bodyPart}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Intensité</span>
                                <span className={`font-bold text-lg ${selectedPoint.intensity <= 3 ? 'text-green-400' :
                                        selectedPoint.intensity <= 6 ? 'text-yellow-400' : 'text-red-400'
                                    }`}>
                                    {selectedPoint.intensity}/10
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Date</span>
                                <span>{selectedPoint.date}</span>
                            </div>

                            {selectedPoint.notes && (
                                <div className="p-3 rounded-lg bg-muted/30">
                                    <p className="text-sm text-muted-foreground">Note du patient</p>
                                    <p className="text-sm mt-1">{selectedPoint.notes}</p>
                                </div>
                            )}

                            {/* Doctor Notes */}
                            {selectedPoint.doctorNotes && selectedPoint.doctorNotes.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">Notes médicales</p>
                                    {selectedPoint.doctorNotes.map((note) => (
                                        <div key={note.id} className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                                            <p className="text-sm">{note.text}</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {note.doctorName} • {note.date}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Add Note */}
                            {isAddingNote ? (
                                <div className="space-y-2">
                                    <Input
                                        placeholder="Ajouter une note médicale..."
                                        value={newNote}
                                        onChange={(e) => setNewNote(e.target.value)}
                                        className="bg-muted/50"
                                    />
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => setIsAddingNote(false)}
                                        >
                                            Annuler
                                        </Button>
                                        <Button size="sm" className="flex-1" onClick={handleAddNote}>
                                            Ajouter
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <Button
                                    variant="outline"
                                    className="w-full glass-button"
                                    onClick={() => setIsAddingNote(true)}
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Ajouter une note 3D
                                </Button>
                            )}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-8">
                            Cliquez sur une zone du modèle 3D pour voir les détails
                        </p>
                    )}
                </div>

                {/* All Pain Points Summary */}
                <div className="glass-panel rounded-2xl p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-primary" />
                        Résumé des zones ({painPoints.length})
                    </h3>

                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                        {painPoints.map((point) => (
                            <button
                                key={point.id}
                                onClick={() => setSelectedPoint(point)}
                                className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${selectedPoint?.id === point.id
                                        ? 'bg-primary/20 border border-primary/30'
                                        : 'bg-muted/30 hover:bg-muted/50'
                                    }`}
                            >
                                <span className="text-sm">{point.bodyPart}</span>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{
                                            background: point.intensity <= 3 ? '#22c55e' :
                                                point.intensity <= 6 ? '#eab308' : '#ef4444',
                                        }}
                                    />
                                    <span className="text-sm font-medium">{point.intensity}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
