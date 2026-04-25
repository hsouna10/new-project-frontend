import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { 
    Calendar as CalendarIcon, 
    Plus, 
    Clock, 
    User, 
    Users,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Trash2,
    Info
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/services/api";
import { useRole } from "@/contexts/RoleContext";
import { format, startOfWeek, addDays, isSameDay, addHours, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";

const HOURS = Array.from({ length: 15 }, (_, i) => i + 7); // 7 AM to 9 PM

export default function AdminClasses() {
    const { toast } = useToast();
    const { user } = useRole();
    const [classes, setClasses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    
    const [newClass, setNewClass] = useState({
        name: "",
        coachName: "",
        date: format(new Date(), "yyyy-MM-dd"),
        startTime: "09:00",
        endTime: "10:00",
        capacity: "20",
        color: "#3B82F6"
    });

    const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

    const fetchClasses = async () => {
        if (!user) return;
        try {
            const start = startDate.toISOString();
            const end = addDays(startDate, 7).toISOString();
            const res = await api.get(`/admin/classes?gymId=${user.id}&start=${start}&end=${end}`);
            if (res.data.status === 'success') {
                setClasses(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching classes:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, [user, currentDate]);

    const handleAddClass = async () => {
        try {
            const start = new Date(`${newClass.date}T${newClass.startTime}:00`);
            const end = new Date(`${newClass.date}T${newClass.endTime}:00`);
            
            const res = await api.post('/admin/classes', {
                ...newClass,
                gymId: user.id,
                startTime: start.toISOString(),
                endTime: end.toISOString()
            });
            
            if (res.data.status === 'success') {
                toast({ title: "Cours planifié !", className: "bg-green-600 text-white" });
                setIsAddDialogOpen(false);
                fetchClasses();
            }
        } catch (error) {
            toast({ title: "Erreur", description: "Impossible de créer le cours.", variant: "destructive" });
        }
    };

    const handleDeleteClass = async (id: string) => {
        if (!window.confirm("Supprimer ce cours ?")) return;
        try {
            await api.delete(`/admin/classes/${id}`);
            toast({ title: "Cours supprimé" });
            fetchClasses();
        } catch (error) {
            toast({ title: "Erreur", variant: "destructive" });
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
                            <CalendarIcon className="text-primary" />
                            Planning des Cours
                        </h1>
                        <p className="text-muted-foreground">Gérez l'agenda hebdomadaire de votre salle.</p>
                    </div>

                    <div className="flex items-center gap-2 bg-white rounded-xl shadow-sm p-1 border">
                        <Button variant="ghost" size="icon" onClick={() => setCurrentDate(addDays(currentDate, -7))}>
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                        <span className="px-4 font-bold min-w-[150px] text-center">
                            {format(startDate, "d MMM", { locale: fr })} - {format(addDays(startDate, 6), "d MMM yyyy", { locale: fr })}
                        </span>
                        <Button variant="ghost" size="icon" onClick={() => setCurrentDate(addDays(currentDate, 7))}>
                            <ChevronRight className="w-5 h-5" />
                        </Button>
                    </div>

                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2 h-12 px-6 font-bold shadow-lg">
                                <Plus className="w-5 h-5" />
                                PLANIFIER UN COURS
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Nouveau Créneau</DialogTitle>
                                <DialogDescription>Ajoutez une séance au planning de la salle.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Nom du Cours</Label>
                                    <Input value={newClass.name} onChange={e => setNewClass({...newClass, name: e.target.value})} placeholder="Yoga Vinyasa, Crossfit WOD..." />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Date</Label>
                                        <Input type="date" value={newClass.date} onChange={e => setNewClass({...newClass, date: e.target.value})} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Coach</Label>
                                        <Input value={newClass.coachName} onChange={e => setNewClass({...newClass, coachName: e.target.value})} placeholder="Kevin Coach" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Début</Label>
                                        <Input type="time" value={newClass.startTime} onChange={e => setNewClass({...newClass, startTime: e.target.value})} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Fin</Label>
                                        <Input type="time" value={newClass.endTime} onChange={e => setNewClass({...newClass, endTime: e.target.value})} />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleAddClass} className="w-full">AJOUTER AU PLANNING</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Calendar Grid */}
                <div className="bg-white rounded-2xl border shadow-xl overflow-hidden">
                    <div className="grid grid-cols-8 border-b bg-slate-50/80">
                        <div className="p-4 border-r"></div>
                        {weekDays.map((day) => (
                            <div key={day.toString()} className={cn("p-4 text-center border-r font-bold", isSameDay(day, new Date()) && "text-primary bg-primary/5")}>
                                <p className="uppercase text-[10px] tracking-widest opacity-60 font-black">{format(day, "EEE", { locale: fr })}</p>
                                <p className="text-xl">{format(day, "d")}</p>
                            </div>
                        ))}
                    </div>

                    <div className="relative overflow-y-auto max-h-[600px] custom-scrollbar">
                        {HOURS.map((hour) => (
                            <div key={hour} className="grid grid-cols-8 h-24 border-b group hover:bg-slate-50/30 transition-colors">
                                <div className="p-2 border-r text-[10px] font-black opacity-30 text-right pr-4">
                                    {hour}:00
                                </div>
                                {weekDays.map((day) => {
                                    const dayClasses = classes.filter(c => isSameDay(new Date(c.startTime), day) && new Date(c.startTime).getHours() === hour);
                                    return (
                                        <div key={day.toString()} className="border-r relative p-1 group/day">
                                            {dayClasses.map((gymClass) => (
                                                <div 
                                                    key={gymClass._id}
                                                    className="absolute inset-x-1 top-1 bottom-1 rounded-lg shadow-sm p-2 text-white overflow-hidden transition-all hover:scale-[1.02] cursor-pointer group/item"
                                                    style={{ backgroundColor: gymClass.color || '#3B82F6' }}
                                                    onClick={() => toast({ title: gymClass.name, description: `Coach: ${gymClass.coachName} | ${gymClass.registeredMembers.length}/${gymClass.capacity} inscrits` })}
                                                >
                                                    <div className="flex justify-between items-start">
                                                       <p className="text-[10px] font-black leading-tight uppercase truncate mr-4">{gymClass.name}</p>
                                                       <button 
                                                            className="opacity-0 group-hover/item:opacity-100 transition-opacity hover:text-red-200"
                                                            onClick={(e) => { e.stopPropagation(); handleDeleteClass(gymClass._id); }}
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                       </button>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-[8px] opacity-80 mt-1">
                                                        <User className="w-2 h-2" /> {gymClass.coachName}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-[8px] opacity-80">
                                                        <Users className="w-2 h-2" /> {gymClass.registeredMembers.length}/{gymClass.capacity}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Legend */}
                <div className="mt-6 flex flex-wrap gap-4 items-center text-xs text-muted-foreground">
                    <p className="font-bold flex items-center gap-2 uppercase tracking-widest"><Info className="w-4 h-4" /> Légende :</p>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm" /> Cardio / HIIT</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-indigo-500 shadow-sm" /> Yoga / Pilates</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm" /> Musculation</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-500 shadow-sm" /> Crossfit</div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
