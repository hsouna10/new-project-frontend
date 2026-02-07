import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useRole } from "@/contexts/RoleContext";
import { Stethoscope, Lock, Mail } from "lucide-react";
import { authService } from "@/services/api";

export default function Login() {
    const navigate = useNavigate();
    const { setRole, setUser } = useRole();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const data = await authService.login(email, password);

            // Backend returns { status, token, data: { user } }
            const user = data.data.user;
            let role = user.rôle;

            // Map backend role to frontend role if necessary
            // Backend: 'medecin', 'patient', 'admin'
            // Frontend: 'doctor', 'patient', 'admin'
            if (role === 'medecin') role = 'doctor';

            setRole(role);
            setUser({
                name: user.email, // We might want to fetch profile to get name
                email: user.email,
                role: role
            });

            navigate(`/dashboard/${role}`);
        } catch (err: any) {
            console.error("Login failed", err);
            setError(err.response?.data?.message || "Échec de la connexion. Vérifiez vos identifiants ou le serveur.");
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
                    <h1 className="text-4xl font-bold mb-4">Bienvenue sur sahtyy</h1>
                    <p className="text-lg text-muted-foreground">
                        Votre plateforme de santé connectée pour une gestion simplifiée de vos soins et de votre pratique médicale.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex items-center justify-center p-8">
                <Card className="w-full max-w-md border-0 shadow-none">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
                        <CardDescription>
                            Entrez vos identifiants pour accéder à votre compte
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            {error && (
                                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                                    {error}
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="exemple@email.com"
                                        className="pl-10"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Mot de passe</Label>
                                    <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                                        Mot de passe oublié ?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type="password"
                                        className="pl-10"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full bg-medical-teal hover:bg-medical-teal/90" disabled={isLoading}>
                                {isLoading ? "Connexion..." : "Se connecter"}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <div className="relative w-full">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Ou
                                </span>
                            </div>
                        </div>
                        <div className="text-center text-sm">
                            Vous n'avez pas de compte ?{" "}
                            <Link to="/signup" className="text-primary hover:underline font-medium">
                                S'inscrire
                            </Link>
                        </div>

                        <div className="relative w-full">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Ou continuer avec
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-center w-full">
                            <CustomGoogleLogin
                                onSuccess={async (tokenResponse) => {
                                    console.log("Token Google reçu :", tokenResponse.access_token);
                                    try {
                                        setIsLoading(true);
                                        // Send access_token to backend
                                        const data = await authService.googleLogin(tokenResponse.access_token);

                                        const user = data.data.user;
                                        let role = user.rôle;
                                        if (role === 'medecin') role = 'doctor';

                                        setRole(role);
                                        setUser({
                                            name: user.email,
                                            email: user.email,
                                            role: role
                                        });

                                        navigate(`/dashboard/${role}`);
                                    } catch (err: any) {
                                        console.error("Google Login failed", err);
                                        setError("Échec de la connexion Google.");
                                    } finally {
                                        setIsLoading(false);
                                    }
                                }}
                                onError={() => {
                                    setError("La connexion Google a échoué.");
                                }}
                            />
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}

// Custom Component for logic separation
import { useGoogleLogin } from '@react-oauth/google';

function CustomGoogleLogin({ onSuccess, onError }: { onSuccess: (res: any) => void, onError: () => void }) {
    const login = useGoogleLogin({
        onSuccess: onSuccess,
        onError: onError,
    });

    return (
        <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2 h-11"
            onClick={() => login()}
        >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                />
                <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                />
                <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
                    fill="#FBBC05"
                />
                <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                />
            </svg>
            Continuer avec Google
        </Button>
    );
}
