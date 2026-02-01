import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, UserPlus, MessageSquare, MapPin, Building, GraduationCap, Star } from 'lucide-react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { doctorService } from '@/services/api';

const specialties = ['Toutes', 'Généraliste', 'Cardiologue', 'Dermatologue', 'Pédiatre', 'Gynécologue', 'Ophtalmologue', 'Neurologue', 'Orthopédiste'];

export default function DoctorNetwork() {
    const [doctors, setDoctors] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState('Toutes');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                // In a real app, we might want to exclude the current doctor from this list
                const response = await doctorService.getAllDoctors();
                if (response?.data?.doctors) {
                    setDoctors(response.data.doctors);
                } else if (Array.isArray(response)) {
                    setDoctors(response);
                }
            } catch (error) {
                console.error("Failed to fetch doctors", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    const filteredDoctors = doctors.filter(doctor => {
        const matchesSearch = (
            doctor.nom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doctor.prenom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doctor.specialite?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        const matchesSpecialty = selectedSpecialty === 'Toutes' || doctor.specialite === selectedSpecialty;

        return matchesSearch && matchesSpecialty;
    });

    return (
        <DashboardLayout title="Réseau Professionnel" subtitle="Connectez-vous avec vos confrères et développez votre synergie médicale">

            {/* Search and Filter Section */}
            <div className="glass-panel p-6 rounded-2xl mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher un confrère par nom ou spécialité..."
                            className="pl-10 h-10 bg-background/50 border-white/10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                        <SelectTrigger className="w-full md:w-[200px] h-10 bg-background/50 border-white/10">
                            <Filter className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Spécialité" />
                        </SelectTrigger>
                        <SelectContent>
                            {specialties.map((spec) => (
                                <SelectItem key={spec} value={spec}>
                                    {spec}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Doctors Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDoctors.map((doctor, index) => (
                    <motion.div
                        key={doctor.id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="glass-panel p-6 rounded-2xl hover:border-primary/30 transition-all duration-300 group"
                    >
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center text-2xl font-bold text-primary group-hover:scale-105 transition-transform duration-300">
                                {doctor.prenom?.[0]}{doctor.nom?.[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-lg truncate text-foreground group-hover:text-primary transition-colors">
                                    Dr. {doctor.prenom} {doctor.nom}
                                </h3>
                                <div className="flex items-center gap-1.5 text-primary text-sm font-medium mb-1">
                                    <GraduationCap className="w-4 h-4" />
                                    {doctor.specialite || 'Médecin Généraliste'}
                                </div>
                                <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                                    <MapPin className="w-3 h-3" />
                                    {doctor.city || 'Tunis'}, Tunisie
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats or Info could go here */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <div className="bg-background/40 rounded-xl p-2 text-center">
                                <div className="text-xs text-muted-foreground mb-0.5">Expérience</div>
                                <div className="font-semibold text-sm">15 ans</div>
                            </div>
                            <div className="bg-background/40 rounded-xl p-2 text-center">
                                <div className="text-xs text-muted-foreground mb-0.5">Avis</div>
                                <div className="flex items-center justify-center gap-1 font-semibold text-sm">
                                    <span>4.9</span>
                                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary border-0" variant="outline">
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Message
                            </Button>
                            <Button className="flex-1">
                                <UserPlus className="w-4 h-4 mr-2" />
                                Connecter
                            </Button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {!isLoading && filteredDoctors.length === 0 && (
                <div className="text-center py-20">
                    <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Aucun confrère trouvé</h3>
                    <p className="text-muted-foreground">
                        Essayez de modifier vos critères de recherche ou de filtre.
                    </p>
                </div>
            )}
        </DashboardLayout>
    );
}
