import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { 
    Users, 
    Search, 
    Plus, 
    Mail, 
    Calendar, 
    MoreVertical, 
    UserPlus,
    Loader2,
    Filter,
    Trash2,
    RefreshCw
} from "lucide-react";
import api from "@/services/api";
import { useRole } from "@/contexts/RoleContext";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminMembers() {
    const { toast } = useToast();
    const { user } = useRole();
    const [members, setMembers] = useState<any[]>([]);
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    
    // Form state
    const [newMember, setNewMember] = useState({
        name: "",
        email: "",
        telephone: "",
        password: "",
        planId: "",
        durationMonths: 1
    });

    const fetchMembers = async () => {
        if (!user) return;
        try {
            const res = await api.get(`/admin/members?gymId=${user.id}`);
            if (res.data.status === 'success') {
                setMembers(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching members:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPlans = async () => {
        if (!user) return;
        try {
            const res = await api.get(`/admin/plans?gymId=${user.id}`);
            if (res.data.status === 'success') {
                setPlans(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching plans:", error);
        }
    };

    useEffect(() => {
        fetchMembers();
        fetchPlans();
    }, [user]);

    const handleAddMember = async () => {
        try {
            const res = await api.post('/admin/members', {
                ...newMember,
                gymId: user.id
            });
            if (res.data.status === 'success') {
                toast({ title: "Membre ajouté", className: "bg-green-600 text-white" });
                setIsAddDialogOpen(false);
                fetchMembers();
            }
        } catch (error) {
            toast({ title: "Erreur", description: "Impossible d'ajouter le membre.", variant: "destructive" });
        }
    };

    const handleDeleteMember = async (id: string) => {
        if (!window.confirm("Supprimer ce membre ?")) return;
        try {
            await api.delete(`/admin/members/${id}`);
            toast({ title: "Membre supprimé" });
            fetchMembers();
        } catch (error) {
            toast({ title: "Erreur", variant: "destructive" });
        }
    };

    const filteredMembers = members.filter(m => 
        m.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.membershipId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                            <Users className="text-primary" />
                            Gestion des Membres
                        </h1>
                        <p className="text-muted-foreground">Pilotez votre communauté et suivez les abonnements.</p>
                    </div>
                    
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2 h-12 px-6 font-bold shadow-lg">
                                <UserPlus className="w-5 h-5" />
                                NOUVEAU MEMBRE
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Ajouter un Membre</DialogTitle>
                                <DialogDescription>Créez manuellement un accès pour un nouveau membre.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Nom Complet</Label>
                                    <Input value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} placeholder="Jean Dupont" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input type="email" value={newMember.email} onChange={e => setNewMember({...newMember, email: e.target.value})} placeholder="jean@exemple.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Téléphone</Label>
                                    <Input type="tel" value={newMember.telephone} onChange={e => setNewMember({...newMember, telephone: e.target.value})} placeholder="12 345 678" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Mot de passe</Label>
                                    <Input type="password" value={newMember.password} onChange={e => setNewMember({...newMember, password: e.target.value})} placeholder="••••••••" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Plan d'Abonnement</Label>
                                    <Select onValueChange={(val) => setNewMember({...newMember, planId: val})}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choisir un plan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {plans.map(plan => (
                                                <SelectItem key={plan._id} value={plan._id}>{plan.name} ({plan.price} DT)</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleAddMember} className="w-full">CRÉER LE COMPTE</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Filters Row */}
                <div className="flex gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input 
                            placeholder="Rechercher un membre (Nom, Email, ID...)" 
                            className="pl-10 h-12 shadow-sm"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" className="h-12 gap-2">
                        <Filter className="w-5 h-5" />
                        Filtres
                    </Button>
                </div>

                {/* Members Table/Grid */}
                <div className="grid gap-4">
                    {filteredMembers.map((member) => (
                        <Card key={member._id} className="overflow-hidden hover:shadow-md transition-shadow border-none shadow-sm bg-white/50 backdrop-blur-sm">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                        {member.userId?.name?.charAt(0) || "M"}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-lg">{member.userId?.name}</h3>
                                            <Badge variant={member.status === 'active' ? 'default' : 'destructive'} className="text-[10px] uppercase font-bold px-2 py-0">
                                                {member.status === 'active' ? 'ACTIF' : 'EXPIRÉ'}
                                            </Badge>
                                        </div>
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                                            <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {member.userId?.email}</span>
                                            <span className="flex items-center gap-1 font-mono font-semibold text-primary/70">{member.membershipId}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="hidden md:flex items-center gap-8">
                                    <div className="text-right">
                                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Abonnement</p>
                                        <p className="font-bold text-slate-700">{member.plan?.name || "Aucun plan"}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Expire le</p>
                                        <p className="font-bold text-slate-700 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(member.endDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon"><MoreVertical className="w-5 h-5" /></Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem className="gap-2"><RefreshCw className="w-4 h-4" /> Renouveler</DropdownMenuItem>
                                            <DropdownMenuItem className="gap-2 text-red-500" onClick={() => handleDeleteMember(member._id)}>
                                                <Trash2 className="w-4 h-4" /> Supprimer
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {filteredMembers.length === 0 && (
                        <div className="text-center py-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                            <Users className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                            <h3 className="text-xl font-bold text-slate-500">Aucun membre trouvé</h3>
                            <p className="text-slate-400">Ajoutez votre premier membre pour commencer.</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
