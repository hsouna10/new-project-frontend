import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRole } from "@/contexts/RoleContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { doctorService, authService } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export default function DoctorProfile() {
    const { user: contextUser } = useRole();
    const [doctorProfile, setDoctorProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { toast } = useToast();

    // Form state
    const [formData, setFormData] = useState({
        prenom: "",
        nom: "",
        email: "",
        telephone: "",
        address: "", // 'city' in backend
        specialite: "",
        workTime: ""
    });

    useEffect(() => {
        fetchProfile();
    }, [contextUser]);

    const fetchProfile = async () => {
        try {
            const currentUser = authService.getCurrentUser();
            if (!currentUser) {
                setLoading(false);
                return;
            }

            // Fetch all doctors and find match
            // Ideally backend should provide /me endpoint, but we are restricted to existing controllers.
            const response = await doctorService.getAllDoctors();
            // response should be { status: 'success', data: { doctors: [] } }
            const doctors = response?.data?.doctors || [];

            const myProfile = doctors.find((doc: any) =>
                doc.user?._id === currentUser._id || doc.user === currentUser._id
            );

            if (myProfile) {
                setDoctorProfile(myProfile);
                setFormData({
                    prenom: myProfile.prenom || "",
                    nom: myProfile.nom || "",
                    email: myProfile.user?.email || currentUser.email || "",
                    telephone: myProfile.telephone || "",
                    address: myProfile.city || "",
                    specialite: myProfile.specialite || "",
                    workTime: myProfile.workTime || ""
                });
            } else {
                // Fallback if no specific doctor profile found yet (should verify this case)
                setFormData(prev => ({
                    ...prev,
                    email: currentUser.email || "",
                    prenom: currentUser.prenom || "",
                    nom: currentUser.nom || ""
                }));
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
            toast({
                title: "Erreur",
                description: "Impossible de charger le profil.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!doctorProfile?._id) {
            toast({
                title: "Erreur",
                description: "Profil médecin introuvable.",
                variant: "destructive"
            });
            return;
        }

        setSaving(true);
        try {
            // Update doctor fields
            // Note: Email belongs to User model. If we need to update email, we need a User update endpoint.
            // existing updateDoctor updates the Doctor model. Doctor model has nom, prenom, specialite, telephone, city, workTime.
            // We'll update what we can.

            const updatePayload = {
                nom: formData.nom,
                prenom: formData.prenom,
                telephone: formData.telephone,
                city: formData.address,
                specialite: formData.specialite,
                workTime: formData.workTime
            };

            await doctorService.update(doctorProfile._id, updatePayload);

            toast({
                title: "Succès",
                description: "Profil mis à jour avec succès.",
                className: "bg-green-500 text-white"
            });

            // Refresh
            fetchProfile();

        } catch (error) {
            console.error("Update failed", error);
            toast({
                title: "Erreur",
                description: "Échec de la mise à jour.",
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

    // Use display name from form or context
    const displayName = `${formData.prenom} ${formData.nom}`.trim() || contextUser?.name || "Dr.";
    const displayAvatar = contextUser?.avatar;

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                        Mon Profil <span className="gradient-text">Professionnel</span>
                    </h1>
                    <p className="text-muted-foreground">Gérez vos informations publiques et privées.</p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Left Column - Avatar & Basic Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="md:col-span-1"
                    >
                        <div className="glass-panel rounded-2xl p-6 flex flex-col items-center text-center relative overflow-hidden group">
                            {/* Decorative background glow */}
                            <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-medical-teal/20 to-transparent" />

                            <div className="relative mb-4">
                                <div className="absolute inset-0 bg-medical-teal blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                                <Avatar className="w-32 h-32 border-4 border-background shadow-xl relative z-10">
                                    <AvatarImage src={displayAvatar} />
                                    <AvatarFallback className="text-4xl font-bold bg-gradient-to-br from-medical-teal to-medical-blue text-white">
                                        {displayName.charAt(0) || 'D'}
                                    </AvatarFallback>
                                </Avatar>
                            </div>

                            <h2 className="text-xl font-bold mb-1">{displayName}</h2>
                            <p className="text-sm text-medical-teal font-medium mb-4">{formData.specialite || "Spécialité non définie"}</p>

                            <div className="w-full space-y-3 mt-2">
                                <div className="p-3 rounded-xl bg-muted/40 text-sm text-muted-foreground flex items-center justify-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    Compte Vérifié
                                </div>
                                <Button variant="outline" className="w-full border-white/10 hover:bg-white/5">
                                    Changer Photo
                                </Button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column - Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="md:col-span-2"
                    >
                        <div className="glass-panel rounded-2xl p-6 md:p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold">Informations Personnelles</h3>
                                <div className="px-3 py-1 rounded-full bg-medical-blue/10 text-medical-blue text-xs font-bold border border-medical-blue/20">
                                    Mode Édition
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Prénom</Label>
                                        <Input
                                            name="prenom"
                                            value={formData.prenom}
                                            onChange={handleChange}
                                            className="bg-muted/30 border-white/10 focus:border-medical-teal/50 transition-colors h-11"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Nom</Label>
                                        <Input
                                            name="nom"
                                            value={formData.nom}
                                            onChange={handleChange}
                                            className="bg-muted/30 border-white/10 focus:border-medical-teal/50 transition-colors h-11"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">Email</Label>
                                    <Input
                                        name="email"
                                        value={formData.email}
                                        disabled
                                        className="bg-muted/50 border-transparent text-muted-foreground cursor-not-allowed h-11"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Téléphone</Label>
                                        <Input
                                            name="telephone"
                                            value={formData.telephone}
                                            onChange={handleChange}
                                            className="bg-muted/30 border-white/10 focus:border-medical-teal/50 transition-colors h-11"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Spécialité</Label>
                                        <Input
                                            name="specialite"
                                            value={formData.specialite}
                                            onChange={handleChange}
                                            className="bg-muted/30 border-white/10 focus:border-medical-teal/50 transition-colors h-11"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">Adresse Cabinet</Label>
                                    <Input
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Ville / Adresse"
                                        className="bg-muted/30 border-white/10 focus:border-medical-teal/50 transition-colors h-11"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">Horaires de travail</Label>
                                    <Input
                                        name="workTime"
                                        value={formData.workTime}
                                        onChange={handleChange}
                                        placeholder="ex: 09:00 - 17:00"
                                        className="bg-muted/30 border-white/10 focus:border-medical-teal/50 transition-colors h-11"
                                    />
                                </div>

                                <div className="pt-6 flex justify-end">
                                    <Button
                                        className="bg-gradient-to-r from-medical-teal to-medical-blue hover:from-medical-teal/90 hover:to-medical-blue/90 text-white shadow-lg shadow-medical-teal/20 h-12 px-8"
                                        onClick={handleSubmit}
                                        disabled={saving}
                                    >
                                        {saving ? (
                                            <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                Enregistrement...
                                            </>
                                        ) : (
                                            "Enregistrer les modifications"
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </DashboardLayout>
    );
}

