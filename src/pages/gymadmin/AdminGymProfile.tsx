import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { 
    User, 
    Clock, 
    Globe, 
    Facebook, 
    Instagram, 
    Dumbbell, 
    Save, 
    Loader2, 
    Plus, 
    Trash2,
    Info
} from "lucide-react";
import api from "@/services/api";
import { useRole } from "@/contexts/RoleContext";

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

const COMMON_SERVICES = [
    "Musculation", "Cardio", "Yoga", "Crossfit", "Zumba", 
    "Piscine", "Sauna", "Boxe", "Spinning", "Pilates", "Coaching Perso"
];

export default function AdminGymProfile() {
    const { toast } = useToast();
    const { user } = useRole();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    const [profile, setProfile] = useState({
        description: "",
        openingHours: DAYS.map(day => ({ day, hours: "08:00 - 22:00" })),
        services: [] as string[],
        socialLinks: {
            facebook: "",
            instagram: "",
            website: ""
        },
        images: [] as string[]
    });

    const [branding, setBranding] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            try {
                const res = await api.get(`/admin/branding?adminId=${user.id}`);
                if (res.data.status === 'success' && res.data.data) {
                    setBranding(res.data.data);
                    // Merging profile data if it exists
                    setProfile(prev => ({
                        ...prev,
                        description: res.data.data.description || "",
                        openingHours: res.data.data.openingHours?.length > 0 
                            ? res.data.data.openingHours 
                            : prev.openingHours,
                        services: res.data.data.services || [],
                        socialLinks: {
                            facebook: res.data.data.socialLinks?.facebook || "",
                            instagram: res.data.data.socialLinks?.instagram || "",
                            website: res.data.data.socialLinks?.website || ""
                        },
                        images: res.data.data.images || []
                    }));
                }
            } catch (error) {
                console.error("Error fetching gym data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await api.post('/admin/update-profile', {
                adminId: user.id,
                ...profile
            });
            if (res.data.status === 'success') {
                toast({
                    title: "Profil mis à jour !",
                    description: "Les informations de votre salle ont été enregistrées.",
                    className: "bg-green-600 text-white"
                });
            }
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Impossible d'enregistrer le profil.",
                variant: "destructive"
            });
        } finally {
            setSaving(false);
        }
    };

    const toggleService = (service: string) => {
        setProfile(prev => ({
            ...prev,
            services: prev.services.includes(service)
                ? prev.services.filter(s => s !== service)
                : [...prev.services, service]
        }));
    };

    const updateHours = (day: string, value: string) => {
        setProfile(prev => ({
            ...prev,
            openingHours: prev.openingHours.map(oh => oh.day === day ? { ...oh, hours: value } : oh)
        }));
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
            <div className="mb-8 px-4">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <User className="text-primary" />
                    Profil de la Salle
                </h1>
                <p className="text-muted-foreground">Rédigez la présentation de votre salle pour attirer de nouveaux membres.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 p-4">
                <div className="space-y-8">
                    {/* Bio Section */}
                    <Card className="shadow-lg border-t-4 border-t-primary">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Info className="w-5 h-5 text-primary" />
                                À propos de la Salle
                            </CardTitle>
                            <CardDescription>Décrivez l'ambiance, vos équipements et votre vision.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Textarea 
                                placeholder="Bienvenue chez Power Gym, l'espace ultime pour transformer votre corps..."
                                className="min-h-[200px] text-lg leading-relaxed"
                                value={profile.description}
                                onChange={e => setProfile({...profile, description: e.target.value})}
                            />
                        </CardContent>
                    </Card>

                    {/* Services Section */}
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Dumbbell className="w-5 h-5 text-primary" />
                                Services & Activités
                            </CardTitle>
                            <CardDescription>Sélectionnez les disciplines disponibles dans votre salle.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {COMMON_SERVICES.map(service => (
                                    <Button
                                        key={service}
                                        variant={profile.services.includes(service) ? "default" : "outline"}
                                        size="sm"
                                        className="rounded-full transition-all"
                                        onClick={() => toggleService(service)}
                                        style={profile.services.includes(service) ? { backgroundColor: branding?.primaryColor } : {}}
                                    >
                                        {service}
                                    </Button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-8">
                    {/* Opening Hours */}
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Clock className="w-5 h-5 text-primary" />
                                Horaires d'Ouverture
                            </CardTitle>
                            <CardDescription>Précisez vos heures d'accès pour chaque jour.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {profile.openingHours.map((oh) => (
                                <div key={oh.day} className="flex items-center justify-between gap-4 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                                    <Label className="w-24 font-bold">{oh.day}</Label>
                                    <Input 
                                        className="h-9 font-mono text-center"
                                        value={oh.hours}
                                        onChange={e => updateHours(oh.day, e.target.value)}
                                        placeholder="08:00 - 22:00"
                                    />
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Social Links */}
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Globe className="w-5 h-5 text-primary" />
                                Réseaux Sociaux
                            </CardTitle>
                            <CardDescription>Restez connecté avec vos membres.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-600 text-white flex-shrink-0">
                                    <Facebook className="w-5 h-5" />
                                </div>
                                <Input 
                                    placeholder="Lien Facebook"
                                    value={profile.socialLinks.facebook}
                                    onChange={e => setProfile({...profile, socialLinks: {...profile.socialLinks, facebook: e.target.value}})}
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 text-white flex-shrink-0">
                                    <Instagram className="w-5 h-5" />
                                </div>
                                <Input 
                                    placeholder="Lien Instagram"
                                    value={profile.socialLinks.instagram}
                                    onChange={e => setProfile({...profile, socialLinks: {...profile.socialLinks, instagram: e.target.value}})}
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-slate-800 text-white flex-shrink-0">
                                    <Globe className="w-5 h-5" />
                                </div>
                                <Input 
                                    placeholder="Site Web"
                                    value={profile.socialLinks.website}
                                    onChange={e => setProfile({...profile, socialLinks: {...profile.socialLinks, website: e.target.value}})}
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="pt-2">
                             <Button 
                                className="w-full h-12 gap-2 text-lg font-bold shadow-lg" 
                                onClick={handleSave}
                                disabled={saving}
                                style={{ backgroundColor: branding?.primaryColor }}
                            >
                                {saving ? <Loader2 className="animate-spin" /> : <Save />}
                                {saving ? "Enregistrement..." : "ENREGISTRER LE PROFIL"}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
