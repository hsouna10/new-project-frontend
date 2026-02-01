import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';

interface Patient {
    _id: string;
    nom: string;
    prenom: string;
}

interface ReportCreationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: ReportData) => void;
    patients: Patient[];
    loading?: boolean;
}

export interface ReportData {
    patientId: string;
    title: string; // Not in backend model explicitly but maybe mapped to 'diagnostic' or extra? Using 'diagnostic' as main title/summary
    diagnostic: string;
    diagnosticDarija?: string;
    recommandations: Array<{ text: string; completed?: boolean }>;
}

export function ReportCreationDialog({
    open,
    onOpenChange,
    onSubmit,
    patients,
    loading
}: ReportCreationDialogProps) {
    const [patientId, setPatientId] = useState('');
    const [diagnostic, setDiagnostic] = useState('');
    const [diagnosticDarija, setDiagnosticDarija] = useState('');
    const [recommandations, setRecommandations] = useState<string[]>(['']);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            patientId,
            title: diagnostic, // Mapping diagnostic as title for now if needed, or just using diagnostic
            diagnostic,
            diagnosticDarija,
            recommandations: recommandations.filter(r => r.trim() !== '').map(text => ({ text, completed: false }))
        });
    };

    const addRecommendation = () => {
        setRecommandations([...recommandations, '']);
    };

    const removeRecommendation = (index: number) => {
        setRecommandations(recommandations.filter((_, i) => i !== index));
    };

    const updateRecommendation = (index: number, value: string) => {
        const newRecs = [...recommandations];
        newRecs[index] = value;
        setRecommandations(newRecs);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Nouveau Rapport Médical</DialogTitle>
                    <DialogDescription>
                        Remplissez les détails ci-dessous pour créer un nouveau rapport.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Patient</Label>
                        <Select value={patientId} onValueChange={setPatientId} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un patient" />
                            </SelectTrigger>
                            <SelectContent>
                                {patients.map((p) => (
                                    <SelectItem key={p._id} value={p._id}>
                                        {p.prenom} {p.nom}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Diagnostic (Français)</Label>
                        <Textarea
                            value={diagnostic}
                            onChange={(e) => setDiagnostic(e.target.value)}
                            placeholder="Détails du diagnostic..."
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Diagnostic (Darija - Optionnel)</Label>
                        <Textarea
                            value={diagnosticDarija}
                            onChange={(e) => setDiagnosticDarija(e.target.value)}
                            placeholder="Diagnostic en Darija..."
                            className="text-right"
                            dir="rtl"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="flex justify-between items-center">
                            Recommandations
                            <Button type="button" variant="outline" size="sm" onClick={addRecommendation}>
                                <Plus className="h-4 w-4 mr-1" /> Ajouter
                            </Button>
                        </Label>
                        <div className="space-y-2">
                            {recommandations.map((rec, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        value={rec}
                                        onChange={(e) => updateRecommendation(index, e.target.value)}
                                        placeholder={`Recommandation ${index + 1}`}
                                        required={index === 0}
                                    />
                                    {recommandations.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeRecommendation(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Annuler
                        </Button>
                        <Button type="submit" disabled={loading} className="bg-medical-teal hover:bg-medical-teal/90">
                            {loading ? 'Création...' : 'Créer le Rapport'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
