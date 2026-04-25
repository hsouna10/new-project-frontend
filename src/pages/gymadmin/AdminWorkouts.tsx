import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { 
    Dumbbell, 
    Plus, 
    Trash2, 
    PlayCircle, 
    Clock, 
    UserPlus, 
    ChevronRight,
    Loader2,
    Search,
    Timer
} from "lucide-react";
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger,
    DialogFooter 
} from "@/components/ui/dialog";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import api from "@/services/api";
import { useRole } from "@/contexts/RoleContext";

export default function AdminWorkouts() {
    const { toast } = useToast();
    const { user } = useRole();
    const [programs, setPrograms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    
    const [newProgram, setNewProgram] = useState({
        name: "",
        description: "",
        level: "Débutant",
        exercises: [{ name: "", sets: 3, reps: "12", restTimer: 60 }]
    });

    const fetchPrograms = async () => {
        if (!user) return;
        try {
            const res = await api.get(`/admin/workouts?gymId=${user.id}`);
            if (res.data.status === 'success') {
                setPrograms(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching workouts:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrograms();
    }, [user]);

    const addExerciseRow = () => {
        setNewProgram({
            ...newProgram,
            exercises: [...newProgram.exercises, { name: "", sets: 3, reps: "12", restTimer: 60 }]
        });
    };

    const removeExerciseRow = (index: number) => {
        const updated = [...newProgram.exercises];
        updated.splice(index, 1);
        setNewProgram({ ...newProgram, exercises: updated });
    };

    const handleCreateProgram = async () => {
        try {
            const res = await api.post('/admin/workouts', {
                ...newProgram,
                gymId: user.id
            });
            if (res.data.status === 'success') {
                toast({ title: "Programme créé !", className: "bg-green-600 text-white" });
                setIsAddDialogOpen(false);
                fetchPrograms();
            }
        } catch (error) {
            toast({ title: "Erreur", description: "Impossible de créer le programme.", variant: "destructive" });
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex justify-center items-center h-[50vh]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="p-4 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <Dumbbell className="text-primary" />
                            Programmes d'Entraînement
                        </h1>
                        <p className="text-muted-foreground">Concevez des routines sportives pour vos membres.</p>
                    </div>

                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2 h-12 px-6 font-bold shadow-lg">
                                <Plus className="w-5 h-5" />
                                CRÉER UN PROGRAMME
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
                            <DialogHeader>
                                <DialogTitle>Nouveau Programme</DialogTitle>
                                <DialogDescription>Définissez les exercices et séries de votre routine.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Nom du Programme</Label>
                                        <Input value={newProgram.name} onChange={e => setNewProgram({...newProgram, name: e.target.value})} placeholder="PPL - Push Day, Cardio Blast..." />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Niveau</Label>
                                        <Select onValueChange={v => setNewProgram({...newProgram, level: v})}>
                                            <SelectTrigger><SelectValue placeholder="Niveau" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Débutant">Débutant</SelectItem>
                                                <SelectItem value="Intermédiaire">Intermédiaire</SelectItem>
                                                <SelectItem value="Avancé">Avancé</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-lg font-bold">Exercices</Label>
                                        <Button type="button" variant="outline" size="sm" onClick={addExerciseRow} className="gap-1">
                                            <Plus className="w-4 h-4" /> Ajouter
                                        </Button>
                                    </div>
                                    
                                    {newProgram.exercises.map((ex, idx) => (
                                        <div key={idx} className="grid grid-cols-12 gap-2 p-3 bg-slate-50 rounded-lg border items-end">
                                            <div className="col-span-5 space-y-1">
                                                <Label className="text-[10px] uppercase opacity-60">Nom</Label>
                                                <Input value={ex.name} onChange={e => {
                                                    const updated = [...newProgram.exercises];
                                                    updated[idx].name = e.target.value;
                                                    setNewProgram({...newProgram, exercises: updated});
                                                }} placeholder="Développé couché" className="h-9 px-2" />
                                            </div>
                                            <div className="col-span-2 space-y-1">
                                                <Label className="text-[10px] uppercase opacity-60">Sets</Label>
                                                <Input type="number" value={ex.sets} onChange={e => {
                                                    const updated = [...newProgram.exercises];
                                                    updated[idx].sets = Number(e.target.value);
                                                    setNewProgram({...newProgram, exercises: updated});
                                                }} className="h-9 px-2" />
                                            </div>
                                            <div className="col-span-2 space-y-1">
                                                <Label className="text-[10px] uppercase opacity-60">Reps</Label>
                                                <Input value={ex.reps} onChange={e => {
                                                    const updated = [...newProgram.exercises];
                                                    updated[idx].reps = e.target.value;
                                                    setNewProgram({...newProgram, exercises: updated});
                                                }} className="h-9 px-2" />
                                            </div>
                                            <div className="col-span-2 space-y-1">
                                                <Label className="text-[10px] uppercase opacity-60">Repos(s)</Label>
                                                <Input type="number" value={ex.restTimer} onChange={e => {
                                                    const updated = [...newProgram.exercises];
                                                    updated[idx].restTimer = Number(e.target.value);
                                                    setNewProgram({...newProgram, exercises: updated});
                                                }} className="h-9 px-2" />
                                            </div>
                                            <div className="col-span-1 pb-1">
                                                <Button variant="ghost" size="icon" onClick={() => removeExerciseRow(idx)} className="text-red-500 h-8 w-8 hover:bg-red-50">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleCreateProgram} className="w-full h-12 font-bold uppercase tracking-widest">PUBLIER LE PROGRAMME</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Programs Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {programs.map((program) => (
                        <Card key={program._id} className="group overflow-hidden hover:shadow-xl transition-all border-none shadow-lg bg-white">
                            <div className="h-3 bg-primary/20 group-hover:bg-primary transition-colors" />
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <Badge variant={
                                        program.level === 'Débutant' ? 'secondary' : 
                                        program.level === 'Intermédiaire' ? 'default' : 'destructive'
                                    } className="uppercase text-[10px] font-black">
                                        {program.level}
                                    </Badge>
                                    <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></Button>
                                </div>
                                <CardTitle className="text-xl font-bold mt-2 uppercase tracking-tight">{program.name}</CardTitle>
                                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{program.description || "Aucune description fournie."}</p>
                            </CardHeader>
                            <CardContent className="pt-2">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2">
                                        <span>Exercices Principaux</span>
                                        <span className="text-primary">{program.exercises.length} EX</span>
                                    </div>
                                    {program.exercises.slice(0, 3).map((ex: any, i: number) => (
                                        <div key={i} className="flex items-center justify-between py-1 border-b border-slate-50 last:border-none">
                                            <span className="text-sm font-medium text-slate-700">{ex.name}</span>
                                            <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-full">
                                                {ex.sets} x {ex.reps}
                                            </span>
                                        </div>
                                    ))}
                                    {program.exercises.length > 3 && (
                                        <p className="text-[10px] text-center text-muted-foreground italic">+ {program.exercises.length - 3} autres exercices</p>
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter className="bg-slate-50/80 p-4 border-t">
                                <Button variant="outline" className="w-full gap-2 font-bold group-hover:bg-primary group-hover:text-white transition-all border-primary text-primary">
                                    <UserPlus className="w-4 h-4" /> ASSIGNER AUX MEMBRES
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {programs.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200 shadow-sm mt-8">
                        <Dumbbell className="w-16 h-16 mx-auto text-slate-200 mb-4" />
                        <h3 className="text-xl font-bold text-slate-500 uppercase tracking-widest">Aucun Programme</h3>
                        <p className="text-slate-400">Commencez à créer des bibliothèques d'exercices pour vos membres.</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
