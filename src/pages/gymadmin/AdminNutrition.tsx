import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { 
    Salad, 
    Plus, 
    Trash2, 
    Utensils, 
    Flame, 
    PieChart, 
    ChevronRight,
    Loader2,
    Calendar,
    Clock,
    Timer,
    Scale
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
import api from "@/services/api";
import { useRole } from "@/contexts/RoleContext";

export default function AdminNutrition() {
    const { toast } = useToast();
    const { user } = useRole();
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    
    const [newPlan, setNewPlan] = useState({
        name: "",
        totalCalories: 2500,
        macros: { proteins: 30, carbs: 40, fats: 30 },
        meals: [
            { time: "08:00", name: "Petit-déjeuner", items: [{ foodName: "", quantity: "", calories: 0 }] },
            { time: "13:00", name: "Déjeuner", items: [{ foodName: "", quantity: "", calories: 0 }] }
        ]
    });

    const fetchPlans = async () => {
        if (!user) return;
        try {
            const res = await api.get(`/admin/nutrition?gymId=${user.id}`);
            if (res.data.status === 'success') {
                setPlans(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching nutrition:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, [user]);

    const handleCreatePlan = async () => {
        try {
            const res = await api.post('/admin/nutrition', {
                ...newPlan,
                gymId: user.id
            });
            if (res.data.status === 'success') {
                toast({ title: "Plan nutritionnel créé !", className: "bg-green-600 text-white" });
                setIsAddDialogOpen(false);
                fetchPlans();
            }
        } catch (error) {
            toast({ title: "Erreur", description: "Impossible de créer le plan.", variant: "destructive" });
        }
    };

    const handleDeletePlan = async (id: string) => {
        if (!window.confirm("Supprimer ce plan ?")) return;
        try {
            await api.delete(`/admin/nutrition/${id}`);
            toast({ title: "Plan supprimé" });
            fetchPlans();
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
                            <Salad className="text-primary" />
                            Guide Nutritionnel
                        </h1>
                        <p className="text-muted-foreground">Pilotez les apports caloriques et macros de vos membres.</p>
                    </div>

                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2 h-12 px-6 font-bold shadow-lg">
                                <Plus className="w-5 h-5" />
                                NOUVEAU PLAN REPAS
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar">
                            <DialogHeader>
                                <DialogTitle>Création de Plan Alimentaire</DialogTitle>
                                <DialogDescription>Établissez les objectifs nutritionnels et les repas d'une journée type.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Nom du Plan</Label>
                                        <Input value={newPlan.name} onChange={e => setNewPlan({...newPlan, name: e.target.value})} placeholder="Sèche musculaire, Prise de masse..." />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Calories Totales (kcal)</Label>
                                        <Input type="number" value={newPlan.totalCalories} onChange={e => setNewPlan({...newPlan, totalCalories: Number(e.target.value)})} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border">
                                    <div className="space-y-2">
                                        <Label className="text-blue-600 font-bold">% Protéines</Label>
                                        <Input type="number" value={newPlan.macros.proteins} onChange={e => setNewPlan({...newPlan, macros: {...newPlan.macros, proteins: Number(e.target.value)}})} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-emerald-600 font-bold">% Glucides</Label>
                                        <Input type="number" value={newPlan.macros.carbs} onChange={e => setNewPlan({...newPlan, macros: {...newPlan.macros, carbs: Number(e.target.value)}})} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-orange-600 font-bold">% Lipides</Label>
                                        <Input type="number" value={newPlan.macros.fats} onChange={e => setNewPlan({...newPlan, macros: {...newPlan.macros, fats: Number(e.target.value)}})} />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-lg font-bold uppercase tracking-widest text-primary">Repas de la journée</Label>
                                    <div className="space-y-2">
                                        {newPlan.meals.map((meal, idx) => (
                                            <div key={idx} className="p-4 border rounded-xl space-y-4 relative bg-white shadow-sm hover:shadow-md transition-shadow">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 space-y-1">
                                                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Heure</Label>
                                                        <Input type="time" value={meal.time} onChange={e => {
                                                            const updated = [...newPlan.meals];
                                                            updated[idx].time = e.target.value;
                                                            setNewPlan({...newPlan, meals: updated});
                                                        }} className="h-9 px-2" />
                                                    </div>
                                                    <div className="flex-1 space-y-1">
                                                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Nom du Repas</Label>
                                                        <Input value={meal.name} onChange={e => {
                                                            const updated = [...newPlan.meals];
                                                            updated[idx].name = e.target.value;
                                                            setNewPlan({...newPlan, meals: updated});
                                                        }} className="h-9" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleCreatePlan} className="w-full h-12 font-extrabold uppercase tracking-widest shadow-xl">PUBLIER LE PLAN ALIMENTAIRE</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                        <Card key={plan._id} className="group relative overflow-hidden hover:shadow-2xl transition-all border-none shadow-lg bg-white">
                            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-center">
                                    <Badge className="bg-emerald-500 hover:bg-emerald-600 uppercase text-[10px] font-black">{plan.totalCalories} KCAL</Badge>
                                    <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-500" onClick={() => handleDeletePlan(plan._id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                                <CardTitle className="text-2xl font-black mt-2 uppercase tracking-tighter text-slate-800">{plan.name}</CardTitle>
                                <div className="flex gap-4 mt-2 border-t pt-4">
                                    <div className="flex-1 text-center">
                                        <p className="text-[10px] font-black text-blue-500 uppercase">Protéines</p>
                                        <p className="text-lg font-black text-slate-700">{plan.macros.proteins}%</p>
                                    </div>
                                    <div className="flex-1 text-center border-x">
                                        <p className="text-[10px] font-black text-emerald-500 uppercase">Glucides</p>
                                        <p className="text-lg font-black text-slate-700">{plan.macros.carbs}%</p>
                                    </div>
                                    <div className="flex-1 text-center">
                                        <p className="text-[10px] font-black text-orange-500 uppercase">Lipides</p>
                                        <p className="text-lg font-black text-slate-700">{plan.macros.fats}%</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="space-y-4">
                                    {plan.meals.map((meal: any, i: number) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                                <Clock className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-400">{meal.time}</p>
                                                <p className="text-sm font-bold text-slate-700 uppercase tracking-tight">{meal.name}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter className="bg-slate-50 p-4 border-t">
                                <Button className="w-full gap-2 font-black uppercase tracking-widest text-[10px] h-10 shadow-md">
                                    <Scale className="w-4 h-4" /> Assigner aux Membres
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {plans.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl border-4 border-dashed border-slate-100 shadow-sm mt-8">
                        <Utensils className="w-20 h-20 mx-auto text-slate-100 mb-4" />
                        <h3 className="text-2xl font-black text-slate-300 uppercase tracking-tighter">Votre Cuisine est Vide</h3>
                        <p className="text-slate-400 font-medium">Commencez à planifier les apports nutritionnels pour vos membres.</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
