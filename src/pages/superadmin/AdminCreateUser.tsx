import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, UserPlus, Stethoscope, User } from "lucide-react";
import api from "@/services/api";

export default function AdminCreateUser() {
    const { toast } = useToast();
    const [role, setRole] = useState<"medecin" | "patient">("patient");
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "password123",
        nom: "",
        prenom: "",
        specialite: "",
        telephone: "",
        city: "",
        gender: "M",
        age: ""
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const endpoint = role === "medecin" ? "/admin/create-doctor" : "/admin/create-patient";
            const res = await api.post(endpoint, formData);
            
            if (res.data.status === "success") {
                toast({
                    title: "Succès",
                    description: `${role === "medecin" ? "Médecin" : "Patient"} créé avec succès.`,
                    className: "bg-green-600 text-white"
                });
                // Reset form partially
                setFormData({
                    ...formData,
                    email: "",
                    nom: "",
                    prenom: "",
                    telephone: ""
                });
            }
        } catch (error: any) {
            console.error("Error creating user:", error);
            toast({
                title: "Erreur",
                description: error.response?.data?.message || "Erreur lors de la création.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                        <UserPlus className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Ajouter un Utilisateur</h1>
                        <p className="text-muted-foreground">Création manuelle d'un compte sur la plateforme.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <Card 
                        className={`cursor-pointer transition-all border-2 ${role === 'patient' ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'hover:border-primary/50'}`}
                        onClick={() => setRole('patient')}
                    >
                        <CardHeader className="flex flex-row items-center gap-4 py-4">
                            <div className={`p-2 rounded-lg ${role === 'patient' ? 'bg-primary text-white' : 'bg-muted'}`}>
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Patient</CardTitle>
                                <CardDescription>Ajouter un nouveau patient</CardDescription>
                            </div>
                        </CardHeader>
                    </Card>

                    <Card 
                        className={`cursor-pointer transition-all border-2 ${role === 'medecin' ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'hover:border-primary/50'}`}
                        onClick={() => setRole('medecin')}
                    >
                        <CardHeader className="flex flex-row items-center gap-4 py-4">
                            <div className={`p-2 rounded-lg ${role === 'medecin' ? 'bg-primary text-white' : 'bg-muted'}`}>
                                <Stethoscope className="w-6 h-6" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Médecin</CardTitle>
                                <CardDescription>Ajouter un professionel de santé</CardDescription>
                            </div>
                        </CardHeader>
                    </Card>
                </div>

                <Card className="glass-panel border-0 shadow-xl overflow-hidden">
                    <CardHeader className="bg-primary/5 border-b">
                        <CardTitle>Informations Personnelles</CardTitle>
                        <CardDescription>Remplissez les détails du {role === 'medecin' ? 'médecin' : 'patient'}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="prenom">Prénom</Label>
                                    <Input id="prenom" placeholder="Ex: Jean" value={formData.prenom} onChange={handleInputChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nom">Nom</Label>
                                    <Input id="nom" placeholder="Ex: Dupont" value={formData.nom} onChange={handleInputChange} required />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Adresse Email</Label>
                                    <Input id="email" type="email" placeholder="email@exemple.com" value={formData.email} onChange={handleInputChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Mot de passe provisoire</Label>
                                    <Input id="password" type="text" value={formData.password} onChange={handleInputChange} required />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="telephone">Téléphone</Label>
                                    <Input id="telephone" placeholder="+216 12 345 678" value={formData.telephone} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="city">Ville / Région</Label>
                                    <Input id="city" placeholder="Ex: Tunis, Sfax..." value={formData.city} onChange={handleInputChange} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="gender">Genre</Label>
                                    <Select value={formData.gender} onValueChange={(val) => setFormData({...formData, gender: val})}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="M">Masculin</SelectItem>
                                            <SelectItem value="F">Féminin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                
                                {role === 'patient' ? (
                                    <div className="space-y-2">
                                        <Label htmlFor="age">Âge</Label>
                                        <Input id="age" type="number" placeholder="25" value={formData.age} onChange={handleInputChange} />
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <Label htmlFor="specialite">Spécialité</Label>
                                        <Input id="specialite" placeholder="Ex: Cardiologie" value={formData.specialite} onChange={handleInputChange} required />
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 border-t flex justify-end">
                                <Button type="submit" size="lg" className="px-12" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Création en cours...
                                        </>
                                    ) : (
                                        `Créer le compte ${role === 'medecin' ? 'Médecin' : 'Patient'}`
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
