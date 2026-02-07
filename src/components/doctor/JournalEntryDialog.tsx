import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Loader2, Check, Mic, FileText, ChevronLeft, StopCircle, User } from "lucide-react";
import { journalService } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import { io, Socket } from "socket.io-client";

interface JournalEntryDialogProps {
    isOpen: boolean;
    onClose: () => void;
    patientId: string;
    patientName: string;
}

export function JournalEntryDialog({ isOpen, onClose, patientId, patientName }: JournalEntryDialogProps) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [entryMode, setEntryMode] = useState<"selection" | "text" | "voice">("selection");
    const [title, setTitle] = useState("");
    const [type, setType] = useState<"visite" | "symptome" | "medicament">("visite");
    const [description, setDescription] = useState("");
    const [voiceMemoUrl, setVoiceMemoUrl] = useState("");
    const [recommendations, setRecommendations] = useState<{ id: string; text: string; completed: boolean }[]>([]);
    const [newRec, setNewRec] = useState("");

    // Voice specific
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState("");

    // Socket and MediaRecorder refs
    const socketRef = useRef<Socket | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    // Initialize Socket.io connection
    useEffect(() => {
        socketRef.current = io("http://localhost:5000");

        socketRef.current.on("connect", () => {
            console.log("🎤 Connecté au serveur vocal");
        });

        socketRef.current.on("transcription", (data: { text: string }) => {
            console.log("📝 Transcription reçue:", data.text);
            setTranscript(data.text);
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = []; // Reset chunks

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                    console.log(`📦 Chunk enregistré: ${event.data.size} bytes`);
                }
            };

            mediaRecorder.start(1000); // Collect chunks every 1 second
            setIsRecording(true);
        } catch (error) {
            console.error("Erreur d'accès au microphone:", error);
            toast({
                title: "Erreur",
                description: "Impossible d'accès au microphone.",
                variant: "destructive"
            });
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.stop();

            // Wait for final chunks and send complete audio
            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                console.log(`📦 Audio complet: ${audioBlob.size} bytes`);

                // Convert to base64 and send
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64 = reader.result as string;
                    console.log("📤 Envoi de l'audio au serveur...");
                    socketRef.current?.emit("audio", base64);
                    socketRef.current?.emit("transcribe");
                };
                reader.readAsDataURL(audioBlob);
            };
        }

        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }

        setIsRecording(false);
    };

    const handleReset = () => {
        stopRecording();
        setEntryMode("selection");
        setTitle("");
        setDescription("");
        setRecommendations([]);
        setTranscript("");
    };

    const handleAddRec = () => {
        if (!newRec.trim()) return;
        setRecommendations([...recommendations, { id: Date.now().toString(), text: newRec, completed: false }]);
        setNewRec("");
    };

    const handleRemoveRec = (id: string) => {
        setRecommendations(recommendations.filter(r => r.id !== id));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await journalService.createJournalEntry({
                title,
                type,
                description,
                voiceMemoUrl,
                recommendations
            }, patientId);

            toast({
                title: "Entrée ajoutée",
                description: "Le journal du patient a été mis à jour.",
                className: "bg-green-600 text-white"
            });
            onClose();
            handleReset();
        } catch (error) {
            console.error(error);
            toast({
                title: "Erreur",
                description: "Impossible de créer l'entrée.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto transition-all duration-300">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {entryMode !== 'selection' && (
                            <Button variant="ghost" size="icon" className="h-6 w-6 mr-2" onClick={() => setEntryMode('selection')}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                        )}
                        Ajouter au journal de {patientName}
                    </DialogTitle>
                </DialogHeader>

                {entryMode === 'selection' && (
                    <div className="py-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <button
                            onClick={() => setEntryMode('text')}
                            className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-muted-foreground/20 hover:border-primary hover:bg-primary/5 transition-all group gap-4"
                        >
                            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <FileText className="w-8 h-8 text-blue-600" />
                            </div>
                            <div className="text-center">
                                <h3 className="font-bold text-lg mb-1">Écrire le journal</h3>
                                <p className="text-sm text-muted-foreground">Saisie manuelle classique</p>
                            </div>
                        </button>

                        <button
                            onClick={() => setEntryMode('voice')}
                            className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-muted-foreground/20 hover:border-primary hover:bg-primary/5 transition-all group gap-4"
                        >
                            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Mic className="w-8 h-8 text-purple-600" />
                            </div>
                            <div className="text-center">
                                <h3 className="font-bold text-lg mb-1">Dicter le journal</h3>
                                <p className="text-sm text-muted-foreground">Transcription vocale</p>
                            </div>
                        </button>
                    </div>
                )}

                {entryMode === 'voice' && (
                    <div className="py-6 space-y-6">
                        <div className="flex flex-col items-center justify-center gap-6">
                            <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 ${isRecording ? 'bg-red-100 animate-pulse' : 'bg-muted'}`}>
                                <Mic className={`w-10 h-10 ${isRecording ? 'text-red-500' : 'text-muted-foreground'}`} />
                            </div>

                            <div className="flex gap-4">
                                {!isRecording ? (
                                    <Button onClick={startRecording} className="bg-red-500 hover:bg-red-600 text-white min-w-[150px]">
                                        <Mic className="w-4 h-4 mr-2" />
                                        Commencer
                                    </Button>
                                ) : (
                                    <Button onClick={stopRecording} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 min-w-[150px]">
                                        <StopCircle className="w-4 h-4 mr-2" />
                                        Arrêter
                                    </Button>
                                )}
                            </div>

                            <p className="text-sm text-muted-foreground">
                                {isRecording ? "Enregistrement en cours... Parlez clairement." : "Appuyez sur 'Commencer' pour dicter."}
                            </p>
                        </div>

                        <div className="bg-muted/30 p-4 rounded-xl">
                            <Label className="mb-2 block">Transcription</Label>
                            <Textarea
                                value={transcript}
                                onChange={(e) => setTranscript(e.target.value)}
                                placeholder="Le texte apparaîtra ici..."
                                className="min-h-[150px] bg-background"
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button variant="ghost" onClick={() => setEntryMode('selection')}>Retour</Button>
                            <Button
                                onClick={() => {
                                    setDescription(prev => prev ? prev + "\n" + transcript : transcript);
                                    setEntryMode('text');
                                }}
                                disabled={!transcript.trim()}
                            >
                                Valider et Éditer
                            </Button>
                        </div>
                    </div>
                )}

                {entryMode === 'text' && (
                    <form onSubmit={handleSubmit} className="space-y-4 py-4 animate-in fade-in duration-300">
                        <div className="space-y-2">
                            <Label>Type d'entrée</Label>
                            <Select value={type} onValueChange={(v: any) => setType(v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="visite">Visite / Consultation</SelectItem>
                                    <SelectItem value="symptome">Symptôme</SelectItem>
                                    <SelectItem value="medicament">Prescription / Médicament</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Titre</Label>
                            <Input
                                placeholder="Ex: Consultation cardiologie"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                placeholder="Détails de la consultation, observations..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="min-h-[100px]"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>URL Mémo Vocal (Optionnel)</Label>
                            <Input
                                placeholder="https://..."
                                value={voiceMemoUrl}
                                onChange={(e) => setVoiceMemoUrl(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Recommandations / Tâches</Label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Ex: Prendre médicament le matin"
                                    value={newRec}
                                    onChange={(e) => setNewRec(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRec())}
                                />
                                <Button type="button" size="icon" onClick={handleAddRec}>
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="space-y-2 mt-2">
                                {recommendations.map(rec => (
                                    <div key={rec.id} className="flex items-center justify-between bg-muted/30 p-2 rounded text-sm">
                                        <span>{rec.text}</span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                            onClick={() => handleRemoveRec(rec.id)}
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Sauvegarder
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
