import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Save } from "lucide-react";
import api from "@/services/api";

export default function AdminSettings() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        motdepasse: "", // Optional
        confirmPassword: ""
    });

    // We could fetch current user data on mount if we want to prefill email
    // but for security/simplicity we'll leave it blank or fetch from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.motdepasse && formData.motdepasse !== formData.confirmPassword) {
            toast({
                title: "Erreur",
                description: "Les mots de passe ne correspondent pas.",
                variant: "destructive"
            });
            return;
        }

        setLoading(true);
        try {
            const payload: any = { email: formData.email };
            if (formData.motdepasse) payload.motdepasse = formData.motdepasse;

            const res = await api.put('/auth/updateMe', payload);

            if (res.data.status === 'success') {
                toast({
                    title: "Succès",
                    description: "Vos informations ont été mises à jour.",
                    className: "bg-green-600 text-white"
                });
                // Update local storage if email changed
                const updatedUser = { ...user, ...res.data.data.user };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }
        } catch (error) {
            console.error("Update error:", error);
            toast({
                title: "Erreur",
                description: "Impossible de mettre à jour le profil.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <h1 className="text-3xl font-bold mb-6">Paramètres Administrateur</h1>

            <div className="max-w-xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Profil & Sécurité</CardTitle>
                        <CardDescription>Mettez à jour vos informations de connexion.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Nouvel Email (Optionnel)</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder={user.email}
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-2 pt-4">
                                <Label htmlFor="motdepasse">Nouveau Mot de Passe (Optionnel)</Label>
                                <Input
                                    id="motdepasse"
                                    type="password"
                                    value={formData.motdepasse}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirmer Mot de Passe</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                            </div>

                            <Button type="submit" className="w-full mt-4 bg-medical-teal hover:bg-medical-teal/90" disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                Enregistrer les modifications
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
