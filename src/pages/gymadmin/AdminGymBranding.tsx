import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Palette, Building2, Phone, MapPin, Upload, Save, Loader2, Sparkles } from "lucide-react";
import api from "@/services/api";
import { useRole } from "@/contexts/RoleContext";
import { motion } from "framer-motion";

export default function AdminGymBranding() {
    const { toast } = useToast();
    const { user } = useRole();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [branding, setBranding] = useState({
        name: "",
        logo: "",
        primaryColor: "#1B5E20",
        secondaryColor: "#66BB6A",
        accentColor: "#FFD600",
        address: "",
        phone: "",
        email: user?.email || "",
        password: ""
    });

    useEffect(() => {
        const fetchBranding = async () => {
            if (!user) return;
            try {
                const res = await api.get(`/admin/branding?adminId=${user.id}`);
                if (res.data.status === 'success' && res.data.data) {
                    setBranding(prev => ({
                        ...prev,
                        ...res.data.data,
                        email: user.email // Keep current email from context for initialization
                    }));
                }
            } catch (error) {
                console.error("Error fetching branding:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBranding();
    }, [user]);

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);
        try {
            const res = await api.post('/admin/update-branding', {
                ...branding,
                adminId: user.id
            });
            if (res.data.status === 'success') {
                toast({
                    title: "Profil & Accès mis à jour !",
                    description: "Vos paramètres et vos identifiants ont été enregistrés.",
                    className: "bg-green-600 text-white"
                });
                
                // If password was changed, maybe suggest logging in again
                if (branding.password) {
                    toast({
                        title: "Sécurité",
                        description: "N'oubliez pas d'utiliser votre nouveau mot de passe à la prochaine connexion.",
                    });
                }
                
                // Reset password field after save
                setBranding(prev => ({ ...prev, password: "" }));
            }
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Impossible d'enregistrer les paramètres.",
                variant: "destructive"
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex justify-center items-center h-[5vh]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="mb-8 px-4">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Sparkles className="text-yellow-500" />
                    Configuration de la Salle
                </h1>
                <p className="text-muted-foreground">Gérez votre identité visuelle et vos accès administrateur.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 p-4">
                {/* Configuration Form */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="shadow-xl border-t-4" style={{ borderColor: branding.primaryColor }}>
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Building2 className="w-5 h-5" style={{ color: branding.primaryColor }} />
                                Informations Générales
                            </CardTitle>
                            <CardDescription>Ces informations apparaîtront sur votre interface.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nom de la Salle</Label>
                                    <Input 
                                        id="name" 
                                        placeholder="Ex: Fitness Park Tunis" 
                                        value={branding.name}
                                        onChange={e => setBranding({...branding, name: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Téléphone</Label>
                                    <Input 
                                        id="phone" 
                                        placeholder="+216 -- --- ---" 
                                        value={branding.phone}
                                        onChange={e => setBranding({...branding, phone: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Adresse Complète</Label>
                                <Input 
                                    id="address" 
                                    placeholder="Rue, Ville, Code Postal" 
                                    value={branding.address}
                                    onChange={e => setBranding({...branding, address: e.target.value})}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* NEW: Security & Access */}
                    <Card className="shadow-xl border-t-4 border-t-slate-800">
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Lock className="w-5 h-5 text-slate-800" />
                                Sécurité & Accès
                            </CardTitle>
                            <CardDescription>Modifiez vos identifiants de connexion.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Modifier l'Email</Label>
                                    <Input 
                                        id="email" 
                                        type="email"
                                        placeholder="admin@salle.com" 
                                        value={branding.email}
                                        onChange={e => setBranding({...branding, email: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Nouveau Mot de Passe</Label>
                                    <Input 
                                        id="password" 
                                        type="password"
                                        placeholder="Laissez vide pour ne pas changer" 
                                        value={branding.password}
                                        onChange={e => setBranding({...branding, password: e.target.value})}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Identité Visuelle */}
                    <Card className="shadow-xl border-t-4" style={{ borderColor: branding.secondaryColor }}>
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Palette className="w-5 h-5" style={{ color: branding.secondaryColor }} />
                                Identité Visuelle
                            </CardTitle>
                            <CardDescription>Personnalisez les couleurs de votre espace.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <Label>Couleur Principale</Label>
                                        <div className="flex gap-3 items-center">
                                            <Input 
                                                type="color" 
                                                className="w-12 h-12 p-1 rounded-lg cursor-pointer border-none bg-transparent"
                                                value={branding.primaryColor}
                                                onChange={e => setBranding({...branding, primaryColor: e.target.value})}
                                            />
                                            <span className="text-xs font-mono uppercase">{branding.primaryColor}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Couleur Secondaire</Label>
                                        <div className="flex gap-3 items-center">
                                            <Input 
                                                type="color" 
                                                className="w-12 h-12 p-1 rounded-lg cursor-pointer border-none bg-transparent"
                                                value={branding.secondaryColor}
                                                onChange={e => setBranding({...branding, secondaryColor: e.target.value})}
                                            />
                                            <span className="text-xs font-mono uppercase">{branding.secondaryColor}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Couleur d'Accent</Label>
                                        <div className="flex gap-3 items-center">
                                            <Input 
                                                type="color" 
                                                className="w-12 h-12 p-1 rounded-lg cursor-pointer border-none bg-transparent"
                                                value={branding.accentColor}
                                                onChange={e => setBranding({...branding, accentColor: e.target.value})}
                                            />
                                            <span className="text-xs font-mono uppercase">{branding.accentColor}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-muted/50 py-4">
                            <Button 
                                className="w-full md:w-auto ml-auto gap-2" 
                                onClick={handleSave}
                                disabled={saving}
                                style={{ backgroundColor: branding.primaryColor }}
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Enregistrer la Configuration
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

                {/* Live Preview */}
                <div className="space-y-6">
                    <Card className="overflow-hidden border-none shadow-2xl sticky top-24">
                        <div 
                            className="h-32 flex items-center justify-center relative"
                            style={{ background: `linear-gradient(135deg, ${branding.primaryColor}, ${branding.secondaryColor})` }}
                        >
                            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-white rounded-2xl shadow-lg border-4 border-white flex items-center justify-center text-primary overflow-hidden">
                                {branding.logo ? (
                                    <img src={branding.logo} alt="Logo" className="w-full h-full object-cover" />
                                ) : (
                                    <Building2 className="w-10 h-10" style={{ color: branding.primaryColor }} />
                                )}
                            </div>
                        </div>
                        <CardContent className="pt-14 pb-8 text-center">
                            <h3 className="text-2xl font-bold">{branding.name || "Votre Salle"}</h3>
                            <div className="flex items-center justify-center gap-2 mt-2 text-muted-foreground text-sm">
                                <MapPin className="w-3 h-3" />
                                {branding.address || "Adresse non définie"}
                            </div>
                            <div className="flex items-center justify-center gap-2 mt-1 text-muted-foreground text-sm">
                                <Phone className="w-3 h-3" />
                                {branding.phone || "Téléphone non défini"}
                            </div>

                            <div className="mt-8 pt-6 border-t space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Aperçu Thème</span>
                                    <div className="flex gap-1">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: branding.primaryColor }} />
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: branding.secondaryColor }} />
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: branding.accentColor }} />
                                    </div>
                                </div>
                                <Button 
                                    className="w-full shadow-lg"
                                    style={{ backgroundColor: branding.primaryColor }}
                                >
                                    Bouton Primaire
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="w-full shadow-sm"
                                    style={{ color: branding.primaryColor, borderColor: branding.accentColor, borderLeftWidth: '4px' }}
                                >
                                    Style avec Accent
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
