import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRole } from "@/contexts/RoleContext";
import { Stethoscope, Lock, Mail, Phone, MapPin } from "lucide-react";
import { authService } from "@/services/api";

export default function Signup() {
    const navigate = useNavigate();
    const { setRole, setUser } = useRole();
    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        email: "",
        password: "",
        role: "patient",
        telephone: "",
        localisation: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const payload = {
                email: formData.email,
                motdepasse: formData.password,
                rôle: "patient",
                nom: formData.nom,
                prenom: formData.prenom,
                telephone: formData.telephone,
                localisation: formData.localisation
            };

            const response = await authService.register(payload);

            const user = response.data?.user || response.user;
            const role = user.rôle === 'medecin' ? 'doctor' : user.rôle;

            setRole(role);
            setUser({
                name: `${user.prenom} ${user.nom}`,
                email: user.email,
                role: role
            });

            navigate(`/dashboard/${role}`);
        } catch (err: any) {
            console.error("Signup failed", err);
            setError(err.response?.data?.message || "Échec de l'inscription. Vérifiez les champs ou le serveur.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left Side - Hero */}
            <div className="hidden lg:flex flex-col justify-center bg-muted/30 p-12">
                <div className="mb-8">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-medical-teal to-medical-blue flex items-center justify-center mb-4">
                        <Stethoscope className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Rejoignez sahtyy</h1>
                    <p className="text-lg text-muted-foreground">
                        Créez votre compte pour accéder à une gestion simplifiée de vos soins.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex items-center justify-center p-8 overflow-y-auto max-h-screen">
                <Card className="w-full max-w-md border-0 shadow-none">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold">Inscription</CardTitle>
                        <CardDescription>
                            Créez un nouveau compte pour commencer
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSignup} className="space-y-4">
                            {error && (
                                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="prenom">Prénom</Label>
                                    <Input
                                        id="prenom"
                                        placeholder="Prénom"
                                        value={formData.prenom}
                                        onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nom">Nom</Label>
                                    <Input
                                        id="nom"
                                        placeholder="Nom"
                                        value={formData.nom}
                                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="exemple@email.com"
                                        className="pl-10"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="telephone">Téléphone</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        id="telephone"
                                        placeholder="0612345678"
                                        className="pl-10"
                                        value={formData.telephone}
                                        onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="localisation">Localisation</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        id="localisation"
                                        placeholder="Ville ou adresse"
                                        className="pl-10"
                                        value={formData.localisation}
                                        onChange={(e) => setFormData({ ...formData, localisation: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="role">Je suis</Label>
                                <Select
                                    value={formData.role}
                                    onValueChange={(value) => setFormData({ ...formData, role: value })}
                                    disabled
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Patient" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="patient">Patient</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Mot de passe</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type="password"
                                        className="pl-10"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="w-full bg-medical-teal hover:bg-medical-teal/90" disabled={isLoading}>
                                {isLoading ? "Création du compte..." : "S'inscrire"}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter>
                        <div className="w-full text-center text-sm">
                            Vous avez déjà un compte ?{" "}
                            <Link to="/login" className="text-primary hover:underline font-medium">
                                Se connecter
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}