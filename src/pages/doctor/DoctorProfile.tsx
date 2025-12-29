import { useState, useEffect } from "react";
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

            await doctorService.updateDoctor(doctorProfile._id, updatePayload);

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
                <h1 className="text-3xl font-bold mb-8">Mon Profil Professionnel</h1>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Left Column - Avatar & Basic Info */}
                    <Card className="md:col-span-1">
                        <CardContent className="pt-6 flex flex-col items-center text-center">
                            <Avatar className="w-32 h-32 mb-4">
                                <AvatarImage src={displayAvatar} />
                                <AvatarFallback className="text-2xl bg-medical-teal text-white">
                                    {displayName.charAt(0) || 'D'}
                                </AvatarFallback>
                            </Avatar>
                            <h2 className="text-xl font-bold mb-1">{displayName}</h2>
                            <p className="text-sm text-muted-foreground mb-4">{formData.specialite || "Spécialité non définie"}</p>
                            <Button variant="outline" className="w-full">Changer Photo</Button>
                        </CardContent>
                    </Card>

                    {/* Right Column - Form */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Informations Personnelles</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Prénom</Label>
                                    <Input
                                        name="prenom"
                                        value={formData.prenom}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Nom</Label>
                                    <Input
                                        name="nom"
                                        value={formData.nom}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input
                                    name="email"
                                    value={formData.email}
                                    disabled
                                    className="bg-muted"
                                    title="L'email ne peut pas être modifié ici"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Téléphone</Label>
                                <Input
                                    name="telephone"
                                    value={formData.telephone}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Adresse Cabinet</Label>
                                <Input
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Ville / Adresse"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Horaires de travail</Label>
                                <Input
                                    name="workTime"
                                    value={formData.workTime}
                                    onChange={handleChange}
                                    placeholder="ex: 09:00 - 17:00"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Spécialité</Label>
                                <Input
                                    name="specialite"
                                    value={formData.specialite}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="pt-4 flex justify-end">
                                <Button
                                    className="bg-medical-teal hover:bg-medical-teal/90"
                                    onClick={handleSubmit}
                                    disabled={saving}
                                >
                                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Enregistrer les modifications
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}

