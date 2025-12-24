import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Star, Calendar, ChevronRight, MessageCircle, Send, X, Bot, Clock, DollarSign, FileText } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRole } from '@/contexts/RoleContext';
import { doctorService, appointmentService, authService } from '@/services/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";



const chatMessages = [
  { id: 1, type: 'bot', message: "Bonjour ! Je suis votre assistant médical. Comment puis-je vous aider aujourd'hui ?" },
];

export default function DashboardPatient() {
  const { user } = useRole();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState('Toutes');
  const [selectedRegion, setSelectedRegion] = useState('Toutes');
  const [searchQuery, setSearchQuery] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState(chatMessages);
  const [inputMessage, setInputMessage] = useState('');

  // Booking State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    duree: 60,
    tarif: 50,
    sujet: ''
  });
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // My Appointments
  const [myAppointments, setMyAppointments] = useState<any[]>([]);

  // Derived filters
  const [availableSpecialties, setAvailableSpecialties] = useState<string[]>(['Toutes']);
  const [availableRegions, setAvailableRegions] = useState<string[]>(['Toutes']);

  useEffect(() => {
    fetchDoctors();
    fetchMyAppointments();
  }, []);

  const fetchMyAppointments = async () => {
    try {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        const response = await appointmentService.getMyAppointments(currentUser._id || currentUser.id);
        if (response?.data?.app) {
          setMyAppointments(response.data.app);
        }
      }
    } catch (error) {
      console.error("Failed to fetch appointments", error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await doctorService.getAllDoctors();
      let docs = [];
      if (response?.data?.doctors) {
        docs = response.data.doctors;
      } else if (Array.isArray(response)) {
        docs = response;
      }
      setDoctors(docs);

      // Update filters dynamically
      const specs = new Set(docs.map((d: any) => d.specialite).filter(Boolean));
      const regs = new Set(docs.map((d: any) => d.city).filter(Boolean));
      setAvailableSpecialties(['Toutes', ...Array.from(specs) as string[]]);
      setAvailableRegions(['Toutes', ...Array.from(regs) as string[]]);

    } catch (error) {
      console.error("Failed to fetch doctors", error);
    }
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSpecialty = selectedSpecialty === 'Toutes' || doctor.specialite === selectedSpecialty;
    const matchesRegion = selectedRegion === 'Toutes' || doctor.city === selectedRegion;
    const matchesSearch =
      (doctor.nom?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (doctor.prenom?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    return matchesSpecialty && matchesRegion && matchesSearch;
  });

  const handleOpenBooking = (doctor: any) => {
    setSelectedDoctor(doctor);
    setBookingData({ ...bookingData, tarif: 50 }); // Reset or set default
    setIsBookingOpen(true);
    setBookingStatus('idle');
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingStatus('loading');

    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser || !selectedDoctor) return;

      // Combine date and time
      const fullDate = new Date(`${bookingData.date}T${bookingData.time}`);

      const payload = {
        date: fullDate.toISOString(),
        durée: Number(bookingData.duree),
        medecin: selectedDoctor.id || selectedDoctor._id, // Handle likely _id from mongo
        patient: currentUser._id || currentUser.id,
        tarif: Number(bookingData.tarif),
        sujet: bookingData.sujet
      };

      await appointmentService.createAppointment(payload);
      setBookingStatus('success');
      setTimeout(() => {
        setIsBookingOpen(false);
        setBookingStatus('idle');
      }, 2000);
    } catch (error) {
      console.error("Booking failed", error);
      setBookingStatus('error');
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), type: 'user', message: inputMessage },
    ]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: 'bot',
          message: "Je comprends votre question. Laissez-moi vous aider à trouver les meilleures options de soins disponibles pour vous.",
        },
      ]);
    }, 1000);

    setInputMessage('');
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Bienvenue, <span className="gradient-text">{user?.name || 'Patient'}</span>
        </h1>
        <p className="text-muted-foreground">
          Recherchez parmi nos professionnels de santé qualifiés
        </p>
      </motion.div>

      {/* Search & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-panel rounded-2xl p-6 mb-8"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Rechercher un médecin..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-muted/50 border-white/10 h-12 rounded-xl"
            />
          </div>

          {/* Specialty Filter */}
          <div className="flex gap-2 flex-wrap">
            {availableSpecialties.map((specialty) => (
              <button
                key={specialty}
                onClick={() => setSelectedSpecialty(specialty)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${selectedSpecialty === specialty
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                  }`}
              >
                {specialty}
              </button>
            ))}
          </div>

          {/* Region Filter */}
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-muted-foreground" />
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-muted/50 border border-white/10 rounded-xl px-4 py-2 text-sm"
            >
              {availableRegions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Doctors Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredDoctors.map((doctor, index) => (
          <motion.div
            key={doctor.id || doctor._id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="glass-panel rounded-2xl p-6 group hover:border-primary/30 transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xl font-bold text-primary-foreground">
                {doctor.prenom?.[0]}{doctor.nom?.[0]}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Dr. {doctor.prenom} {doctor.nom}</h3>
                    <p className="text-primary text-sm font-medium">{doctor.specialite}</p>
                  </div>
                  {/* Rating placeholder since backend doesn't have it yet */}
                  <div className="flex items-center gap-1 bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-lg">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-medium">4.8</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{doctor.city || 'Non renseigné'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{doctor.workTime || 'Non renseigné'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-sm text-green-400">Disponible</span>
                  </div>

                  <Button
                    size="sm"
                    className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                    onClick={() => handleOpenBooking(doctor)}
                  >
                    Réserver
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <p className="text-muted-foreground text-lg">
            Aucun médecin trouvé avec ces critères
          </p>
        </motion.div>
      )}

      {/* Booking Dialog */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="sm:max-w-[500px] border-none shadow-2xl bg-white dark:bg-zinc-950/95 backdrop-blur-xl">
          <DialogHeader className="space-y-4 pb-4 border-b border-border/10">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <Calendar className="w-6 h-6" />
              </div>
              Prendre Rendez-vous
            </DialogTitle>
            <DialogDescription className="flex items-center gap-4 pt-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {selectedDoctor?.prenom?.[0]}{selectedDoctor?.nom?.[0]}
              </div>
              <div>
                <div className="font-semibold text-foreground text-lg">Dr. {selectedDoctor?.prenom} {selectedDoctor?.nom}</div>
                <div className="text-primary text-sm font-medium">{selectedDoctor?.specialite}</div>
                <div className="text-muted-foreground text-xs flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" /> {selectedDoctor?.city}
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>

          {bookingStatus === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 text-center space-y-6"
            >
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Star className="w-12 h-12 text-green-600 fill-green-600 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-green-600">Réservation confirmée !</h3>
                <p className="text-muted-foreground max-w-[250px] mx-auto text-sm">
                  Votre rendez-vous a été enregistré avec succès. Vous recevrez une confirmation sous peu.
                </p>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleBookingSubmit} className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">Date du rendez-vous</Label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <Input
                      type="date"
                      className="pl-10 h-11 bg-muted/30 border-muted-foreground/20 focus:bg-background transition-all"
                      required
                      value={bookingData.date}
                      onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">Heure souhaitée</Label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                      <Clock className="h-4 w-4" />
                    </div>
                    <Input
                      type="time"
                      className="pl-10 h-11 bg-muted/30 border-muted-foreground/20 focus:bg-background transition-all"
                      required
                      value={bookingData.time}
                      onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">Sujet / Motif de consultation</Label>
                <div className="relative group">
                  <div className="absolute top-3 left-3 flex items-start pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                    <FileText className="h-4 w-4" />
                  </div>
                  <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-muted-foreground/20 bg-muted/30 px-3 py-2 pl-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus:bg-background transition-all resize-none"
                    placeholder="Décrivez brièvement le motif de votre visite..."
                    required
                    value={bookingData.sujet}
                    onChange={(e) => setBookingData({ ...bookingData, sujet: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Tarif de consultation</p>
                    <p className="text-xs text-muted-foreground">Estimation standard</p>
                  </div>
                </div>
                <span className="text-xl font-bold font-mono">{bookingData.tarif} <span className="text-sm font-normal text-muted-foreground">TND</span></span>
              </div>

              {bookingStatus === 'error' && (
                <div className="p-3 rounded-lg bg-red-500/10 text-red-600 text-sm font-medium text-center flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-600 inline-block animate-pulse" />
                  Erreur lors de la réservation. Veuillez réessayer.
                </div>
              )}

              <DialogFooter className="pt-2">
                <Button
                  type="submit"
                  disabled={bookingStatus === 'loading'}
                  className="w-full h-12 text-lg font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all bg-gradient-to-r from-primary to-blue-600"
                >
                  {bookingStatus === 'loading' ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Traitement en cours...</span>
                    </div>
                  ) : (
                    <span>Confirmer le Rendez-vous</span>
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* ... keeping chat button ... */}
      {/* Chatbot Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 flex items-center justify-center z-40 hover:scale-110 transition-transform"
      >
        {isChatOpen ? <X className="w-6 h-6" /> : <Bot className="w-7 h-7" />}
      </motion.button>
      {/* ... chat panel ... */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-96 glass-panel rounded-2xl overflow-hidden z-40"
          >
            {/* Chat Header */}
            <div className="bg-primary/20 px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Assistant Médical</h4>
                  <p className="text-xs text-green-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    En ligne
                  </p>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl ${msg.type === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-md'
                      : 'bg-muted rounded-bl-md'
                      }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Écrivez votre message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="bg-muted/50 border-white/10 rounded-xl"
                />
                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  className="bg-primary text-primary-foreground rounded-xl"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
