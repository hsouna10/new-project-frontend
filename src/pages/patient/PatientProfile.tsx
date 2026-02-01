import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Mail, MapPin, Save, Loader2, Calendar, Shield } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { authService, patientService } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';

export default function PatientProfile() {
    const [patientProfile, setPatientProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { toast } = useToast();

    // Form data state
    const [formData, setFormData] = useState({
        prenom: '',
        nom: '',
        telephone: '',
        email: '',
        city: '',
        role: 'patient'
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const currentUser = authService.getCurrentUser();
            if (!currentUser) {
                setLoading(false);
                return;
            }

            // Fetch all patients and match by user ID
            const patients = await patientService.getAllPatients();
            // Assuming response is array of patients or { data: doctors }? 
            // patientController.getAllPatients returns `res.json(patients)`. So it's an array.
            // But let's be safe.
            const patientList = Array.isArray(patients) ? patients : (patients.data || []);

            const myProfile = patientList.find((p: any) =>
                p.user?._id === currentUser._id || p.user === currentUser._id
            );

            if (myProfile) {
                setPatientProfile(myProfile);
                setFormData({
                    prenom: myProfile.prenom || '',
                    nom: myProfile.nom || '',
                    telephone: myProfile.telephone || '',
                    email: myProfile.user?.email || currentUser.email || '',
                    city: myProfile.city || '',
                    role: myProfile.user?.rôle || 'patient'
                });
            } else {
                // Fallback: use Auth User data
                setFormData(prev => ({
                    ...prev,
                    prenom: currentUser.prenom || '',
                    nom: currentUser.nom || '',
                    email: currentUser.email || '',
                    role: currentUser.rôle || 'patient'
                }));
            }
        } catch (error) {
            console.error("Failed to load profile", error);
            toast({
                title: "Erreur",
                description: "Impossible de charger le profil patient.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!patientProfile?._id) {
            toast({
                title: "Erreur",
                description: "Profil patient introuvable pour la mise à jour.",
                variant: "destructive"
            });
            return;
        }

        setSaving(true);
        try {
            // Update call
            // Patient model fields: nom, prenom, gender, age, city, telephone.
            const updatePayload = {
                nom: formData.nom,
                prenom: formData.prenom,
                telephone: formData.telephone,
                city: formData.city
            };

            await patientService.updatePatient(patientProfile._id, updatePayload);

            toast({
                title: "Profil mis à jour",
                description: "Vos informations ont été enregistrées avec succès.",
                className: "bg-green-500 text-white border-none"
            });

            fetchProfile(); // Refresh data

        } catch (error) {
            console.error(error);
            toast({
                title: "Erreur",
                description: "Impossible de mettre à jour le profil.",
                variant: "destructive"
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex justify-center items-center h-screen">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Mon Profil</h1>
                <p className="text-muted-foreground">Gérez vos informations personnelles et vos préférences.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Sidebar Info Card */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-1"
                >
                    <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl relative group">
                        {/* Header Background */}
                        <div className="h-32 bg-gradient-to-br from-medical-teal/20 to-medical-blue/20 relative overflow-hidden">
                            <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
                            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
                                <div className="w-32 h-32 rounded-full border-[6px] border-background bg-background shadow-2xl flex items-center justify-center text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-medical-teal to-medical-blue relative z-10">
                                    {formData.prenom?.[0] || '?'}{formData.nom?.[0] || '?'}
                                </div>
                            </div>
                        </div>

                        <div className="pt-20 pb-8 px-6 text-center space-y-4">
                            <div>
                                <h2 className="text-2xl font-bold">{formData.prenom} {formData.nom}</h2>
                                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-medical-teal/10 to-medical-blue/10 border border-medical-teal/20 text-medical-teal text-xs font-bold uppercase tracking-wider mt-3 shadow-sm">
                                    <Shield className="w-3.5 h-3.5" />
                                    {formData.role}
                                </span>
                            </div>

                            <div className="space-y-3 pt-6 text-left">
                                <div className="flex items-center gap-4 text-sm text-foreground/80 p-4 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors border border-white/5">
                                    <div className="p-2 rounded-lg bg-medical-blue/10 text-medical-blue">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <span className="truncate font-medium">{formData.email}</span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-foreground/80 p-4 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors border border-white/5">
                                    <div className="p-2 rounded-lg bg-medical-teal/10 text-medical-teal">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <span className="font-medium">{formData.telephone || 'Non renseigné'}</span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-foreground/80 p-4 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors border border-white/5">
                                    <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                                        <Calendar className="w-4 h-4" />
                                    </div>
                                    <span className="font-medium">Membre depuis {patientProfile?.createdAt ? new Date(patientProfile.createdAt).getFullYear() : '2024'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Main Edit Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-2"
                >
                    <div className="glass-panel rounded-3xl p-8 shadow-xl">
                        <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
                            <div>
                                <h3 className="text-xl font-bold">Informations Personnelles</h3>
                                <p className="text-sm text-muted-foreground mt-1">Mettez à jour vos coordonnées et informations de contact.</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center">
                                <User className="w-5 h-5 text-muted-foreground" />
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Prénom</Label>
                                    <div className="relative group">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-medical-teal transition-colors" />
                                        <Input
                                            name="prenom"
                                            value={formData.prenom}
                                            onChange={handleChange}
                                            className="pl-10 h-12 bg-muted/30 border-white/10 focus:border-medical-teal/50 focus:bg-background transition-all rounded-xl"
                                            placeholder="Votre prénom"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Nom</Label>
                                    <div className="relative group">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-medical-teal transition-colors" />
                                        <Input
                                            name="nom"
                                            value={formData.nom}
                                            onChange={handleChange}
                                            className="pl-10 h-12 bg-muted/30 border-white/10 focus:border-medical-teal/50 focus:bg-background transition-all rounded-xl"
                                            placeholder="Votre nom"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        name="email"
                                        value={formData.email}
                                        readOnly
                                        className="pl-10 h-12 bg-muted/50 border-transparent text-muted-foreground cursor-not-allowed rounded-xl"
                                        placeholder="votre@email.com"
                                        title="Email non modifiable"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Numéro de téléphone</Label>
                                    <div className="relative group">
                                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-medical-teal transition-colors" />
                                        <Input
                                            name="telephone"
                                            value={formData.telephone}
                                            onChange={handleChange}
                                            className="pl-10 h-12 bg-muted/30 border-white/10 focus:border-medical-teal/50 focus:bg-background transition-all rounded-xl"
                                            placeholder="+216 00 000 000"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Ville</Label>
                                    <div className="relative group">
                                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-medical-teal transition-colors" />
                                        <Input
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="pl-10 h-12 bg-muted/30 border-white/10 focus:border-medical-teal/50 focus:bg-background transition-all rounded-xl"
                                            placeholder="Non spécifié"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={saving}
                                    className="h-12 px-8 bg-gradient-to-r from-medical-teal to-medical-blue hover:from-medical-teal/90 hover:to-medical-blue/90 text-white shadow-lg shadow-medical-teal/20 rounded-xl transition-all hover:scale-[1.02]"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            Enregistrement...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5 mr-2" />
                                            Enregistrer les modifications
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-8"
                    >
                        <div className="border border-red-200/50 dark:border-red-900/30 bg-red-50/50 dark:bg-red-950/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-sm">
                            <div>
                                <h4 className="text-red-600 dark:text-red-400 font-bold flex items-center gap-2">
                                    <Shield className="w-4 h-4" />
                                    Zone de danger
                                </h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Une fois votre compte supprimé, toutes vos données seront définitivement effacées.
                                </p>
                            </div>
                            <Button variant="destructive" size="sm" className="whitespace-nowrap bg-red-500/90 hover:bg-red-600 border-0 shadow-lg shadow-red-500/20">
                                Supprimer le compte
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
