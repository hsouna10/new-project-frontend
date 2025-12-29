import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    Clock,
    Play,
    Pause,
    Volume2,
    Stethoscope,
    AlertCircle,
    Pill,
    Check,
    Circle,
    Sparkles,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import {
    HealthJournalEntry,
    mockHealthJournal,
    mockAISummary
} from '@/data/mockHealthData';

interface TimelineNodeProps {
    position: [number, number, number];
    isActive: boolean;
    type: HealthJournalEntry['type'];
    onClick: () => void;
}

function TimelineNode({ position, isActive, type, onClick }: TimelineNodeProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);

    const getColor = () => {
        switch (type) {
            case 'visit': return '#4DD9E5';
            case 'symptom': return '#F87171';
            case 'medication': return '#A78BFA';
        }
    };

    useFrame((state) => {
        if (meshRef.current && isActive) {
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.1} floatIntensity={0.3}>
            <mesh
                ref={meshRef}
                position={position}
                onClick={onClick}
                onPointerEnter={() => setHovered(true)}
                onPointerLeave={() => setHovered(false)}
                scale={isActive || hovered ? 1.3 : 1}
            >
                <dodecahedronGeometry args={[0.15, 0]} />
                <meshStandardMaterial
                    color={getColor()}
                    emissive={getColor()}
                    emissiveIntensity={isActive ? 0.8 : hovered ? 0.5 : 0.2}
                    metalness={0.6}
                    roughness={0.3}
                />
            </mesh>
            {isActive && (
                <mesh position={position} scale={1.5}>
                    <dodecahedronGeometry args={[0.15, 0]} />
                    <meshBasicMaterial color={getColor()} transparent opacity={0.2} />
                </mesh>
            )}
        </Float>
    );
}

function Timeline3D({
    entries,
    activeIndex,
    onSelectEntry
}: {
    entries: HealthJournalEntry[];
    activeIndex: number;
    onSelectEntry: (index: number) => void;
}) {
    return (
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <ambientLight intensity={0.4} />
            <pointLight position={[5, 5, 5]} intensity={0.8} color="#4DD9E5" />

            <Stars radius={50} depth={30} count={500} factor={3} saturation={0} fade speed={0.5} />

            {/* Timeline line */}
            <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.01, 0.01, entries.length * 0.8, 8]} />
                <meshStandardMaterial color="#4DD9E5" transparent opacity={0.3} />
            </mesh>

            {/* Timeline nodes */}
            {entries.map((entry, index) => (
                <TimelineNode
                    key={entry.id}
                    position={[(index - (entries.length - 1) / 2) * 0.8, 0, 0]}
                    isActive={index === activeIndex}
                    type={entry.type}
                    onClick={() => onSelectEntry(index)}
                />
            ))}
        </Canvas>
    );
}

interface HealthJournalProps {
    entries?: HealthJournalEntry[];
    showAISummary?: boolean;
}

export default function HealthJournal({
    entries = mockHealthJournal,
    showAISummary = true
}: HealthJournalProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showDarija, setShowDarija] = useState(false);
    const [expandedEntry, setExpandedEntry] = useState<string | null>(entries[0]?.id || null);
    const [completedTasks, setCompletedTasks] = useState<string[]>([]);

    const activeEntry = entries[activeIndex];

    const getTypeIcon = (type: HealthJournalEntry['type']) => {
        switch (type) {
            case 'visit': return <Stethoscope className="w-4 h-4" />;
            case 'symptom': return <AlertCircle className="w-4 h-4" />;
            case 'medication': return <Pill className="w-4 h-4" />;
        }
    };

    const getTypeColor = (type: HealthJournalEntry['type']) => {
        switch (type) {
            case 'visit': return 'text-primary';
            case 'symptom': return 'text-destructive';
            case 'medication': return 'text-medical-purple';
        }
    };

    const handlePlayVoiceMemo = () => {
        // Simulate voice memo playback
        setIsPlaying(!isPlaying);
    };

    const toggleTask = (id: string) => {
        setCompletedTasks((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const speakText = (text: string) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'ar-TN';
            window.speechSynthesis.speak(utterance);
        }
    };

    return (
        <div className="space-y-6">
            {/* 3D Timeline */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel rounded-2xl p-6"
            >
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    Timeline de Santé
                </h3>

                <div className="h-[200px] rounded-xl overflow-hidden bg-background/50">
                    <Timeline3D
                        entries={entries}
                        activeIndex={activeIndex}
                        onSelectEntry={setActiveIndex}
                    />
                </div>

                {/* Date indicators */}
                <div className="flex justify-between mt-4 px-4">
                    {entries.map((entry, index) => (
                        <button
                            key={entry.id}
                            onClick={() => setActiveIndex(index)}
                            className={`text-xs transition-colors ${index === activeIndex ? 'text-primary font-medium' : 'text-muted-foreground'
                                }`}
                        >
                            {entry.date.split('-').slice(1).join('/')}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* AI Summary */}
            {showAISummary && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-panel rounded-2xl p-6 border-primary/20"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-primary" />
                            Synthèse IA de l'historique
                        </h3>
                        <Button
                            variant="outline"
                            size="sm"
                            className="glass-button"
                            onClick={() => setShowDarija(!showDarija)}
                        >
                            {showDarija ? 'Français' : 'Darija'}
                        </Button>
                    </div>

                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                        <p className={`text-sm leading-relaxed ${showDarija ? 'text-right' : ''}`}>
                            {showDarija ? mockAISummary.synthesisDarija : mockAISummary.synthesis}
                        </p>
                    </div>

                    {showDarija && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-3 glass-button"
                            onClick={() => speakText(mockAISummary.synthesisDarija)}
                        >
                            <Volume2 className="w-4 h-4 mr-2" />
                            Écouter
                        </Button>
                    )}
                </motion.div>
            )}

            {/* Entry Details */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-3"
            >
                {entries.map((entry, index) => (
                    <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className={`glass-panel rounded-xl overflow-hidden transition-all ${index === activeIndex ? 'ring-2 ring-primary/50' : ''
                            }`}
                    >
                        <button
                            onClick={() => {
                                setActiveIndex(index);
                                setExpandedEntry(expandedEntry === entry.id ? null : entry.id);
                            }}
                            className="w-full p-4 flex items-center justify-between text-left"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg bg-muted/50 ${getTypeColor(entry.type)}`}>
                                    {getTypeIcon(entry.type)}
                                </div>
                                <div>
                                    <h4 className="font-medium">{entry.title}</h4>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                        <Clock className="w-3 h-3" />
                                        <span>{entry.date}</span>
                                        {entry.doctorName && (
                                            <>
                                                <span>•</span>
                                                <span>{entry.doctorName}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {expandedEntry === entry.id ? (
                                <ChevronUp className="w-5 h-5 text-muted-foreground" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-muted-foreground" />
                            )}
                        </button>

                        <AnimatePresence>
                            {expandedEntry === entry.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="border-t border-white/10"
                                >
                                    <div className="p-4 space-y-4">
                                        <p className="text-sm text-muted-foreground">{entry.description}</p>

                                        {/* Voice Memo */}
                                        {entry.voiceMemoUrl && (
                                            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-10 w-10 rounded-full"
                                                    onClick={handlePlayVoiceMemo}
                                                >
                                                    {isPlaying ? (
                                                        <Pause className="w-4 h-4" />
                                                    ) : (
                                                        <Play className="w-4 h-4" />
                                                    )}
                                                </Button>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">Mémo vocal du docteur</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Résumé de la consultation
                                                    </p>
                                                </div>
                                                <Volume2 className="w-4 h-4 text-muted-foreground" />
                                            </div>
                                        )}

                                        {/* Recommendations Checklist */}
                                        {entry.recommendations && entry.recommendations.length > 0 && (
                                            <div>
                                                <h5 className="text-sm font-medium mb-2">Ce que je dois faire</h5>
                                                <div className="space-y-2">
                                                    {entry.recommendations.map((rec) => (
                                                        <button
                                                            key={rec.id}
                                                            onClick={() => toggleTask(rec.id)}
                                                            className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors ${completedTasks.includes(rec.id)
                                                                    ? 'bg-primary/10'
                                                                    : 'bg-muted/20 hover:bg-muted/30'
                                                                }`}
                                                        >
                                                            {completedTasks.includes(rec.id) ? (
                                                                <Check className="w-4 h-4 text-primary" />
                                                            ) : (
                                                                <Circle className="w-4 h-4 text-muted-foreground" />
                                                            )}
                                                            <span className={`text-sm ${completedTasks.includes(rec.id) ? 'line-through text-muted-foreground' : ''
                                                                }`}>
                                                                {rec.text}
                                                            </span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
