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
                    <Card className="border-none shadow-xl bg-gradient-to-br from-white to-slate-50 dark:from-zinc-900 dark:to-zinc-950 overflow-hidden">
                        <div className="h-32 bg-medical-blue/20 relative">
                            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
                                <div className="w-32 h-32 rounded-full border-4 border-white dark:border-zinc-900 bg-white dark:bg-zinc-800 shadow-xl flex items-center justify-center text-4xl font-bold text-primary">
                                    {formData.prenom?.[0] || '?'}{formData.nom?.[0] || '?'}
                                </div>
                            </div>
                        </div>
                        <CardContent className="pt-20 pb-8 text-center space-y-4">
                            <div>
                                <h2 className="text-2xl font-bold">{formData.prenom} {formData.nom}</h2>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mt-2">
                                    <Shield className="w-3.5 h-3.5" />
                                    {formData.role}
                                </span>
                            </div>

                            <div className="space-y-3 pt-6 text-left">
                                <div className="flex items-center gap-3 text-sm text-muted-foreground p-3 rounded-lg bg-muted/50">
                                    <Mail className="w-4 h-4 text-primary" />
                                    <span className="truncate">{formData.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground p-3 rounded-lg bg-muted/50">
                                    <Phone className="w-4 h-4 text-primary" />
                                    <span>{formData.telephone || 'Non renseigné'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground p-3 rounded-lg bg-muted/50">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    <span>Membre depuis {patientProfile?.createdAt ? new Date(patientProfile.createdAt).getFullYear() : '2024'}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Main Edit Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-2"
                >
                    <Card className="border-none shadow-lg">
                        <CardHeader>
                            <CardTitle>Informations Personnelles</CardTitle>
                            <CardDescription>Mettez à jour vos coordonnées et informations de contact.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Prénom</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                name="prenom"
                                                value={formData.prenom}
                                                onChange={handleChange}
                                                className="pl-9"
                                                placeholder="Votre prénom"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Nom</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                name="nom"
                                                value={formData.nom}
                                                onChange={handleChange}
                                                className="pl-9"
                                                placeholder="Votre nom"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            name="email"
                                            value={formData.email}
                                            readOnly
                                            className="pl-9 bg-muted/30"
                                            placeholder="votre@email.com"
                                            title="Email non modifiable"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Numéro de téléphone</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                name="telephone"
                                                value={formData.telephone}
                                                onChange={handleChange}
                                                className="pl-9"
                                                placeholder="+216 00 000 000"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Ville</Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                className="pl-9"
                                                placeholder="Non spécifié"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <Button type="submit" disabled={saving} className="min-w-[150px]">
                                        {saving ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Enregistrement...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4 mr-2" />
                                                Enregistrer les modifications
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-8"
                    >
                        <Card className="border-red-100 dark:border-red-900/20 bg-red-50/50 dark:bg-red-900/5">
                            <CardHeader>
                                <CardTitle className="text-red-600 dark:text-red-400 text-lg">Zone de danger</CardTitle>
                                <CardDescription>Actions irréversibles concernant votre compte.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex justify-between items-center">
                                <div className="text-sm text-muted-foreground">
                                    Une fois votre compte supprimé, toutes vos données seront définitivement effacées.
                                </div>
                                <Button variant="destructive" size="sm">Supprimer le compte</Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
