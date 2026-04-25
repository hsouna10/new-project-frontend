import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Building2, Mail, Lock, Palette, ArrowRight, ArrowLeft, Upload, Loader2, CheckCircle2 } from "lucide-react";
import api from "@/services/api";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminSignup() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        gymName: "",
        logo: "", // Base64 or URL
        primaryColor: "#1B5E20",
        secondaryColor: "#66BB6A",
        accentColor: "#FFD600",
        address: "",
        phone: ""
    });

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, logo: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSignup = async () => {
        setIsLoading(true);
        try {
            const res = await api.post('/admin/register-gym', formData);
            if (res.data.status === 'success') {
                toast({
                    title: "Compte créé !",
                    description: "Votre espace salle de sport est prêt.",
                    className: "bg-green-600 text-white"
                });
                navigate('/login');
            }
        } catch (err: any) {
            toast({
                title: "Erreur",
                description: err.response?.data?.message || "Échec de l'inscription.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                {/* Progress Bar */}
                <div className="mb-8 px-4">
                    <div className="flex justify-between mb-2">
                        <span className={`text-xs font-bold uppercase tracking-wider ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>Compte</span>
                        <span className={`text-xs font-bold uppercase tracking-wider ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>Branding</span>
                        <span className={`text-xs font-bold uppercase tracking-wider ${step >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>Finalisation</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                        <motion.div 
                            className="h-full bg-primary" 
                            initial={{ width: "33.33%" }}
                            animate={{ width: `${(step / 3) * 100}%` }}
                        />
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card className="shadow-2xl border-none">
                            {step === 1 && (
                                <>
                                    <CardHeader className="text-center">
                                        <CardTitle className="text-3xl font-extrabold tracking-tight">Créer votre Espace</CardTitle>
                                        <CardDescription>Étape 1 : Vos identifiants de connexion</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Professionnel</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                                                <Input 
                                                    id="email" 
                                                    type="email" 
                                                    className="pl-10" 
                                                    placeholder="admin@salle.com"
                                                    value={formData.email}
                                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="password">Mot de passe</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                                                <Input 
                                                    id="password" 
                                                    type="password" 
                                                    className="pl-10" 
                                                    value={formData.password}
                                                    onChange={e => setFormData({...formData, password: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button className="w-full h-12 text-lg font-bold" onClick={() => setStep(2)}>
                                            Continuer au Branding
                                            <ArrowRight className="ml-2 w-5 h-5" />
                                        </Button>
                                    </CardFooter>
                                </>
                            )}

                            {step === 2 && (
                                <>
                                    <CardHeader className="text-center">
                                        <CardTitle className="text-3xl font-extrabold tracking-tight flex items-center justify-center gap-2">
                                            <Palette className="text-primary" />
                                            Identité Visuelle
                                        </CardTitle>
                                        <CardDescription>Étape 2 : Couleurs et Logo</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {/* Logo Upload */}
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50 overflow-hidden relative group">
                                                {formData.logo ? (
                                                    <img src={formData.logo} alt="Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <Upload className="w-8 h-8 text-slate-400" />
                                                )}
                                                <Input 
                                                    type="file" 
                                                    className="absolute inset-0 opacity-0 cursor-pointer" 
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                />
                                            </div>
                                            <span className="text-sm font-medium text-slate-500">Choisir un logo (PNG/JPG/SVG)</span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <Label className="text-xs uppercase font-bold tracking-wider text-slate-500">Principale</Label>
                                                <div className="flex gap-2 items-center">
                                                    <Input 
                                                        type="color" 
                                                        className="w-12 h-12 p-1 border-none bg-transparent cursor-pointer"
                                                        value={formData.primaryColor}
                                                        onChange={e => setFormData({...formData, primaryColor: e.target.value})}
                                                    />
                                                    <span className="text-xs font-mono">{formData.primaryColor}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs uppercase font-bold tracking-wider text-slate-500">Secondaire</Label>
                                                <div className="flex gap-2 items-center">
                                                    <Input 
                                                        type="color" 
                                                        className="w-12 h-12 p-1 border-none bg-transparent cursor-pointer"
                                                        value={formData.secondaryColor}
                                                        onChange={e => setFormData({...formData, secondaryColor: e.target.value})}
                                                    />
                                                    <span className="text-xs font-mono">{formData.secondaryColor}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs uppercase font-bold tracking-wider text-slate-500">Accent</Label>
                                                <div className="flex gap-2 items-center">
                                                    <Input 
                                                        type="color" 
                                                        className="w-12 h-12 p-1 border-none bg-transparent cursor-pointer"
                                                        value={formData.accentColor}
                                                        onChange={e => setFormData({...formData, accentColor: e.target.value})}
                                                    />
                                                    <span className="text-xs font-mono">{formData.accentColor}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Preview Frame */}
                                        <div className="p-4 rounded-xl border bg-white shadow-inner flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg flex items-center justify-center p-1" style={{ background: `linear-gradient(135deg, ${formData.primaryColor}, ${formData.secondaryColor})` }}>
                                                {formData.logo ? <img src={formData.logo} className="w-full h-full object-contain" /> : <Building2 className="text-white" />}
                                            </div>
                                            <div className="flex-1 h-3 rounded-full bg-slate-100 overflow-hidden relative">
                                                <div className="absolute inset-y-0 left-0 w-1/3" style={{ backgroundColor: formData.accentColor }} />
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex gap-4">
                                        <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                                            <ArrowLeft className="mr-2 w-4 h-4" />
                                            Retour
                                        </Button>
                                        <Button className="flex-[2] h-12 font-bold" onClick={() => setStep(3)}>
                                            Dernière Étape
                                            <ArrowRight className="ml-2 w-5 h-5" />
                                        </Button>
                                    </CardFooter>
                                </>
                            )}

                            {step === 3 && (
                                <>
                                    <CardHeader className="text-center">
                                        <CardTitle className="text-3xl font-extrabold tracking-tight">Vérification Finale</CardTitle>
                                        <CardDescription>Détails de votre salle de sport</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="gymName">Nom de la Salle</Label>
                                            <Input 
                                                id="gymName" 
                                                placeholder="Ex: Power Gym Premium"
                                                value={formData.gymName}
                                                onChange={e => setFormData({...formData, gymName: e.target.value})}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="address">Ville / Adresse</Label>
                                            <Input 
                                                id="address" 
                                                placeholder="Tunis, Lac 2"
                                                value={formData.address}
                                                onChange={e => setFormData({...formData, address: e.target.value})}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Téléphone</Label>
                                            <Input 
                                                id="phone" 
                                                placeholder="+216 -- --- ---"
                                                value={formData.phone}
                                                onChange={e => setFormData({...formData, phone: e.target.value})}
                                            />
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex flex-col gap-4">
                                        <Button 
                                            className="w-full h-14 text-lg font-extrabold gap-2" 
                                            onClick={handleSignup}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? <Loader2 className="animate-spin" /> : <CheckCircle2 />}
                                            {isLoading ? "Création en cours..." : "LANCER MON ESPACE"}
                                        </Button>
                                        <Button variant="link" className="text-slate-500" onClick={() => setStep(2)}>
                                            Modifier le style
                                        </Button>
                                    </CardFooter>
                                </>
                            )}
                        </Card>
                    </motion.div>
                </AnimatePresence>

                <p className="text-center mt-8 text-slate-400 text-sm">
                    Déjà inscrit ? <Link to="/login" className="text-primary font-bold hover:underline">Se connecter</Link>
                </p>
            </div>
        </div>
    );
}
