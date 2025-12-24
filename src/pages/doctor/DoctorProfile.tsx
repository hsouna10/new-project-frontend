import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRole } from "@/contexts/RoleContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DoctorProfile() {
    const { user } = useRole();

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Mon Profil Professionnel</h1>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Left Column - Avatar & Basic Info */}
                    <Card className="md:col-span-1">
                        <CardContent className="pt-6 flex flex-col items-center text-center">
                            <Avatar className="w-32 h-32 mb-4">
                                <AvatarImage src={user?.avatar} />
                                <AvatarFallback className="text-2xl bg-medical-teal text-white">
                                    {user?.name?.charAt(0) || 'D'}
                                </AvatarFallback>
                            </Avatar>
                            <h2 className="text-xl font-bold mb-1">{user?.name || 'Dr. Utilisateur'}</h2>
                            <p className="text-sm text-muted-foreground mb-4">Cardiologue</p>
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
                                    <Input defaultValue="Karim" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Nom</Label>
                                    <Input defaultValue="Mansour" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input defaultValue={user?.email} type="email" />
                            </div>

                            <div className="space-y-2">
                                <Label>Téléphone</Label>
                                <Input defaultValue="+216 22 123 456" />
                            </div>

                            <div className="space-y-2">
                                <Label>Adresse Cabinet</Label>
                                <Input defaultValue="12 Av. Habib Bourguiba, Tunis" />
                            </div>

                            <div className="space-y-2">
                                <Label>Spécialité</Label>
                                <Input defaultValue="Cardiologie" disabled />
                            </div>

                            <div className="pt-4 flex justify-end">
                                <Button className="bg-medical-teal hover:bg-medical-teal/90">
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
