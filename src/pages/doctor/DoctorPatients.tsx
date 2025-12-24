import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Phone, FileText } from "lucide-react";

const mockPatients = [
    { id: 1, name: 'Ahmed Ben Ali', age: 45, city: 'Tunis', phone: '98 123 456', lastVisit: '2024-03-15', condition: 'Hypertension' },
    { id: 2, name: 'Fatima Trabelsi', age: 32, city: 'Sfax', phone: '55 654 321', lastVisit: '2024-02-28', condition: 'Diabète Type 2' },
    { id: 3, name: 'Mohamed Sassi', age: 68, city: 'Sousse', phone: '22 333 444', lastVisit: '2024-03-10', condition: 'Cardiopathie' },
    { id: 4, name: 'Leila Bouaziz', age: 28, city: 'Bizerte', phone: '50 111 222', lastVisit: '2024-01-20', condition: 'Suivi grossesse' },
    { id: 5, name: 'Karim Hamdi', age: 52, city: 'Gabès', phone: '99 888 777', lastVisit: '2024-03-01', condition: 'Asthme' },
];

export default function DoctorPatients() {
    return (
        <DashboardLayout>
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Mes Patients</h1>
                    <p className="text-muted-foreground">Liste complète de votre patientèle</p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Rechercher un patient..." className="pl-9" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockPatients.map((patient) => (
                    <Card key={patient.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div className="w-10 h-10 rounded-full bg-medical-teal/10 flex items-center justify-center text-medical-teal font-bold">
                                {patient.name.charAt(0)}
                            </div>
                            <Button variant="ghost" size="icon">
                                <FileText className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <h3 className="font-bold text-lg mb-1">{patient.name}</h3>
                            <p className="text-sm text-muted-foreground mb-4">{patient.age} ans • {patient.condition}</p>

                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    {patient.city}
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Phone className="h-4 w-4" />
                                    {patient.phone}
                                </div>
                                <div className="pt-2 border-t mt-3 flex justify-between items-center text-xs">
                                    <span>Dernière visite:</span>
                                    <span className="font-medium text-foreground">{patient.lastVisit}</span>
                                </div>
                            </div>

                            <Button className="w-full mt-4" variant="outline">Voir Dossier</Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </DashboardLayout>
    );
}
