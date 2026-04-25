import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { 
    CreditCard, 
    Plus, 
    Trash2, 
    Check, 
    DollarSign, 
    Clock, 
    Star,
    Loader2,
    TrendingUp,
    ShieldCheck
} from "lucide-react";
import api from "@/services/api";
import { useRole } from "@/contexts/RoleContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function AdminSubscriptions() {
    const { toast } = useToast();
    const { user } = useRole();
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    
    const [newPlan, setNewPlan] = useState({
        name: "",
        price: "",
        duration: "1",
        features: ["Accès 24/7", "Cours Collectifs"]
    });

    const fetchPlans = async () => {
        if (!user) return;
        try {
            const res = await api.get(`/admin/plans?gymId=${user.id}`);
            if (res.data.status === 'success') {
                setPlans(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching plans:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, [user]);

    const handleAddPlan = async () => {
        try {
            const res = await api.post('/admin/plans', {
                ...newPlan,
                gymId: user.id,
                price: Number(newPlan.price),
                duration: Number(newPlan.duration)
            });
            if (res.data.status === 'success') {
                toast({ title: "Plan créé !", className: "bg-green-600 text-white" });
                setIsAddDialogOpen(false);
                fetchPlans();
            }
        } catch (error) {
            toast({ title: "Erreur", description: "Impossible de créer le plan.", variant: "destructive" });
        }
    };

    const handleDeletePlan = async (id: string) => {
        if (!window.confirm("Désactiver ce plan ?")) return;
        try {
            await api.delete(`/admin/plans/${id}`);
            toast({ title: "Plan désactivé" });
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
                            <CreditCard className="text-primary" />
                            Abonnements & Offres
                        </h1>
                        <p className="text-muted-foreground">Créez et gérez les tarifs de votre salle de sport.</p>
                    </div>
                    
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2 h-12 px-6 font-bold shadow-lg">
                                <Plus className="w-5 h-5" />
                                NOUVELLE OFFRE
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Créer une Offre</DialogTitle>
                                <DialogDescription>Définissez les détails de votre nouvel abonnement.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Nom de l'Offre</Label>
                                    <Input value={newPlan.name} onChange={e => setNewPlan({...newPlan, name: e.target.value})} placeholder="Mensuel VIP, Annuel, etc." />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Prix (DT)</Label>
                                        <Input type="number" value={newPlan.price} onChange={e => setNewPlan({...newPlan, price: e.target.value})} placeholder="80" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Durée (Mois)</Label>
                                        <Input type="number" value={newPlan.duration} onChange={e => setNewPlan({...newPlan, duration: e.target.value})} placeholder="1" />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleAddPlan} className="w-full">PUBLIER L'OFFRE</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                        <Card key={plan._id} className="relative overflow-hidden group hover:shadow-xl transition-all border-none shadow-lg">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Star className="w-20 h-20 rotate-12" />
                            </div>
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <Badge variant="outline" className="text-xs uppercase border-primary text-primary font-bold">
                                        {plan.duration} MOIS
                                    </Badge>
                                    <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-500 hover:bg-red-50" onClick={() => handleDeletePlan(plan._id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                                <CardTitle className="text-2xl font-black uppercase tracking-tight mt-2">{plan.name}</CardTitle>
                                <div className="flex items-baseline gap-1 mt-1">
                                    <span className="text-4xl font-black text-primary">{plan.price}</span>
                                    <span className="text-lg font-bold text-muted-foreground uppercase">DT</span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    {plan.features.map((feature: string, idx: number) => (
                                        <div key={idx} className="flex items-center gap-2 text-sm font-medium text-slate-600">
                                            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                <Check className="w-3 h-3" />
                                            </div>
                                            {feature}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter className="bg-slate-50 mt-auto">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    <ShieldCheck className="w-4 h-4" />
                                    Plan Actif
                                </div>
                            </CardFooter>
                        </Card>
                    ))}

                    {/* Placeholder for Revenue Tracking */}
                    <Card className="bg-primary text-white border-none shadow-lg flex flex-col justify-center items-center p-8 text-center">
                        <TrendingUp className="w-12 h-12 mb-4 opacity-50" />
                        <h3 className="text-2xl font-bold">Revenus Mensuels</h3>
                        <p className="text-primary-foreground/70 mb-4 uppercase tracking-widest text-xs font-bold">Estimation Basée sur les membres</p>
                        <div className="text-5xl font-black">1 450 <span className="text-xl">DT</span></div>
                    </Card>
                </div>

                {plans.length === 0 && !loading && (
                    <div className="text-center py-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 mt-8">
                        <DollarSign className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                        <h3 className="text-xl font-bold text-slate-500">Aucune offre configurée</h3>
                        <p className="text-slate-400">Commencez par définir vos tarifs pour vos membres.</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
