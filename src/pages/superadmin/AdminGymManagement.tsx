import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { 
    Building2, 
    Plus, 
    Trash2, 
    Search, 
    Mail, 
    Phone, 
    MapPin, 
    ExternalLink, 
    Loader2,
    Calendar
} from "lucide-react";
import { Input } from "@/components/ui/input";
import api from "@/services/api";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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

export default function AdminGymManagement() {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [gyms, setGyms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    
    const [newGym, setNewGym] = useState({
        gymName: "",
        email: "",
        password: "",
        address: "",
        phone: "",
        website: "",
        primaryColor: "#1B5E20",
        secondaryColor: "#66BB6A",
        accentColor: "#FFD600",
        maxCapacity: 100,
        description: "",
        logo: "",
        openingHours: [
            { day: "Lundi - Vendredi", hours: "06:00 - 22:00" },
            { day: "Samedi - Dimanche", hours: "08:00 - 20:00" }
        ],
        socialLinks: {
            facebook: "",
            instagram: ""
        }
    });

    const fetchGyms = async () => {
        try {
            const res = await api.get('/superadmin/gyms');
            if (res.data.status === 'success') {
                setGyms(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching gyms:", error);
            toast({
                title: "Erreur",
                description: "Impossible de charger la liste des salles.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGyms();
    }, []);

    const handleCreateGym = async () => {
        try {
            const res = await api.post('/superadmin/gyms', newGym);
            if (res.data.status === 'success') {
                toast({ title: "Succès", description: "La salle et son admin ont été créés !", className: "bg-green-600 text-white" });
                setIsAddDialogOpen(false);
                fetchGyms();
                setNewGym({
                    gymName: "", email: "", password: "", address: "", phone: "", website: "",
                    primaryColor: "#1B5E20", secondaryColor: "#66BB6A", accentColor: "#FFD600",
                    maxCapacity: 100, description: "", logo: "",
                    openingHours: [{ day: "Lundi - Vendredi", hours: "06:00 - 22:00" }, { day: "Samedi - Dimanche", hours: "08:00 - 20:00" }],
                    socialLinks: { facebook: "", instagram: "" }
                });
            }
        } catch (error) {
            toast({ title: "Erreur", description: "Échec de la création.", variant: "destructive" });
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette salle ? Cette action est irréversible.")) return;
        
        try {
            await api.delete(`/superadmin/gyms/${id}`);
            toast({ title: "Succès", description: "La salle a été supprimée." });
            fetchGyms();
        } catch (error) {
            toast({ title: "Erreur", description: "Échec de la suppression.", variant: "destructive" });
        }
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewGym({ ...newGym, logo: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const filteredGyms = gyms.filter(gym => 
        gym.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gym.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gym.adminId?.email?.toLowerCase().includes(searchTerm.toLowerCase())
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
            <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <Building2 className="text-primary" />
                            Gestion Maître des Salles
                        </h1>
                        <p className="text-muted-foreground">Créez et administrez les accès des gérants de salle.</p>
                    </div>

                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-12 px-6 font-bold gap-2 shadow-lg">
                                <Plus className="w-5 h-5" />
                                CRÉER UNE SALLE
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Nouvel Accès Salle</DialogTitle>
                                <DialogDescription>Générez un profil complet pour une nouvelle salle de sport.</DialogDescription>
                            </DialogHeader>
                            
                            <div className="space-y-8 py-4">
                                {/* Section 1: Informations de base */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-primary border-b pb-1">Informations de base</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2 col-span-2 md:col-span-1">
                                            <Label htmlFor="name">Nom de la Salle</Label>
                                            <Input id="name" value={newGym.gymName} onChange={e => setNewGym({...newGym, gymName: e.target.value})} placeholder="Ex: Iron Gym" />
                                        </div>
                                        <div className="space-y-2 col-span-2 md:col-span-1">
                                            <Label htmlFor="phone">Numéro de téléphone</Label>
                                            <Input id="phone" value={newGym.phone} onChange={e => setNewGym({...newGym, phone: e.target.value})} placeholder="+216 -- --- ---" />
                                        </div>
                                        <div className="space-y-2 col-span-2 md:col-span-1">
                                            <Label htmlFor="email">Email de contact / Admin</Label>
                                            <Input id="email" type="email" value={newGym.email} onChange={e => setNewGym({...newGym, email: e.target.value})} placeholder="admin@gym.com" />
                                        </div>
                                        <div className="space-y-2 col-span-2 md:col-span-1">
                                            <Label htmlFor="password">Mot de passe initial</Label>
                                            <Input id="password" type="password" value={newGym.password} onChange={e => setNewGym({...newGym, password: e.target.value})} placeholder="••••••••" />
                                        </div>
                                        <div className="space-y-2 col-span-2">
                                            <Label htmlFor="address">Adresse complète</Label>
                                            <Input id="address" value={newGym.address} onChange={e => setNewGym({...newGym, address: e.target.value})} placeholder="Rue, Ville, Code Postal" />
                                        </div>
                                        <div className="space-y-2 col-span-2">
                                            <Label htmlFor="website">Site Web (Optionnel)</Label>
                                            <Input id="website" value={newGym.website} onChange={e => setNewGym({...newGym, website: e.target.value})} placeholder="https://www.gym.com" />
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2: Identité visuelle */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-primary border-b pb-1">Identité visuelle</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-4 col-span-1 md:col-span-1">
                                            <Label>Logo de la salle</Label>
                                            <div className="border-2 border-dashed rounded-xl p-4 text-center hover:bg-slate-50 transition-colors relative cursor-pointer group">
                                                <input type="file" accept="image/*" onChange={handleLogoChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                                {newGym.logo ? (
                                                    <img src={newGym.logo} className="mx-auto w-24 h-24 object-contain rounded-lg" alt="Logo preview" />
                                                ) : (
                                                    <div className="py-4">
                                                        <Building2 className="w-8 h-8 mx-auto text-muted-foreground group-hover:scale-110 transition-transform" />
                                                        <p className="text-[10px] mt-2 text-muted-foreground uppercase font-bold">Upload PNG/JPG</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-4 col-span-1 md:col-span-2 grid grid-cols-1 gap-4">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Couleur Principale</Label>
                                                    <div className="flex items-center gap-2">
                                                        <Input type="color" value={newGym.primaryColor} onChange={e => setNewGym({...newGym, primaryColor: e.target.value})} className="w-12 p-1 h-10" />
                                                        <span className="text-xs font-mono">{newGym.primaryColor}</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Secondaire</Label>
                                                    <div className="flex items-center gap-2">
                                                        <Input type="color" value={newGym.secondaryColor} onChange={e => setNewGym({...newGym, secondaryColor: e.target.value})} className="w-12 p-1 h-10" />
                                                        <span className="text-xs font-mono">{newGym.secondaryColor}</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Accent</Label>
                                                    <div className="flex items-center gap-2">
                                                        <Input type="color" value={newGym.accentColor} onChange={e => setNewGym({...newGym, accentColor: e.target.value})} className="w-12 p-1 h-10" />
                                                        <span className="text-xs font-mono">{newGym.accentColor}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 3: Options supplémentaires */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-primary border-b pb-1">Options & Configuration</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2 col-span-2 md:col-span-1">
                                            <Label htmlFor="capacity">Capacité membres</Label>
                                            <Input id="capacity" type="number" value={newGym.maxCapacity} onChange={e => setNewGym({...newGym, maxCapacity: parseInt(e.target.value)})} />
                                        </div>
                                        <div className="space-y-2 col-span-2">
                                            <Label htmlFor="desc">Description de la salle</Label>
                                            <textarea 
                                                id="desc" 
                                                className="w-full h-24 p-3 rounded-md border border-input bg-background" 
                                                value={newGym.description} 
                                                onChange={e => setNewGym({...newGym, description: e.target.value})}
                                                placeholder="Quelques mots sur cette salle..."
                                            />
                                        </div>
                                        
                                        {/* Social Links */}
                                        <div className="space-y-2 col-span-2 grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <Label className="text-xs">Facebook URL</Label>
                                                <Input value={newGym.socialLinks.facebook} onChange={e => setNewGym({...newGym, socialLinks: {...newGym.socialLinks, facebook: e.target.value}})} placeholder="facebook.com/gym" />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs">Instagram URL</Label>
                                                <Input value={newGym.socialLinks.instagram} onChange={e => setNewGym({...newGym, socialLinks: {...newGym.socialLinks, instagram: e.target.value}})} placeholder="instagram.com/gym" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <DialogFooter className="mt-8 border-t pt-6 bg-slate-50 -mx-6 px-6 -mb-6 pb-6 sticky bottom-0 z-10">
                                <Button onClick={handleCreateGym} className="w-full h-12 text-lg font-bold">LANCER LA CRÉATION</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Search Bar */}
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                        placeholder="Rechercher par nom, email..." 
                        className="pl-10 h-12 shadow-sm bg-white border-primary/20"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredGyms.map((gym) => (
                            <motion.div
                                key={gym._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Card className="h-full hover:shadow-xl transition-shadow border-none shadow-md overflow-hidden flex flex-col group">
                                    <div 
                                        className="h-24 flex items-center justify-center relative p-4"
                                        style={{ background: `linear-gradient(135deg, ${gym.primaryColor || '#1B5E20'}, ${gym.secondaryColor || '#66BB6A'})` }}
                                    >
                                        <div className="bg-white p-2 rounded-xl shadow-lg w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            {gym.logo ? (
                                                <img src={gym.logo} className="w-full h-full object-contain" />
                                            ) : (
                                                <Building2 className="w-8 h-8" style={{ color: gym.primaryColor }} />
                                            )}
                                        </div>
                                        <Badge className="absolute top-3 right-3 bg-white/20 text-white border-none backdrop-blur-md">
                                            {gym.status === 'approved' ? 'Vérifié' : 'En attente'}
                                        </Badge>
                                    </div>
                                    <CardHeader className="pt-8 pb-4">
                                        <CardTitle className="text-xl font-bold uppercase tracking-tight line-clamp-1">{gym.name}</CardTitle>
                                        <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                                            <Mail className="w-3 h-3" />
                                            {gym.adminId?.email || "Pas d'admin"}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4 flex-1">
                                        <div className="flex items-start gap-2 text-sm text-muted-foreground italic line-clamp-2 min-h-[2.5rem]">
                                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                            {gym.address || "Adresse non renseignée"}
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground uppercase font-bold">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(gym.createdAt).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-1 justify-end">
                                                Capacité: {gym.maxCapacity || 100}
                                            </div>
                                        </div>
                                        
                                        <div className="flex gap-1 pt-2">
                                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: gym.primaryColor }} />
                                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: gym.secondaryColor }} />
                                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: gym.accentColor }} />
                                        </div>
                                    </CardContent>
                                    <CardFooter className="pt-4 border-t bg-slate-50/50 flex justify-between gap-2">
                                        <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50" onClick={() => handleDelete(gym._id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                        <Button className="flex-1 gap-2" variant="outline" onClick={() => toast({ title: "Bientôt disponible", description: "L'édition complète arrive." })}>
                                            Gérer Profil
                                            <ExternalLink className="w-4 h-4" />
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredGyms.length === 0 && (
                    <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                        <Building2 className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                        <h3 className="text-xl font-bold text-slate-500">Aucune salle trouvée</h3>
                        <p className="text-slate-400">Commencez par en créer une nouvelle.</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
