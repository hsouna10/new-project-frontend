import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Shield, Clock, Users } from 'lucide-react';
import ClinicScene from '@/components/three/ClinicScene';
import GlassNav from '@/components/ui/GlassNav';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: Shield,
    title: 'Sécurité Maximale',
    description: 'Vos données médicales sont protégées avec un cryptage de niveau bancaire.',
  },
  {
    icon: Clock,
    title: 'Disponible 24/7',
    description: 'Accédez à vos informations et prenez rendez-vous à tout moment.',
  },
  {
    icon: Users,
    title: 'Réseau de Médecins',
    description: 'Connectez-vous avec des professionnels de santé qualifiés.',
  },
];

export default function Index() {
  const navigate = useNavigate();

  const handleNavigate = (section: string) => {
    switch (section) {
      case 'doctor':
        navigate('/dashboard/doctor');
        break;
      case 'patient':
        navigate('/dashboard/patient');
        break;
      case 'appointments':
        navigate('/dashboard/patient');
        break;
      case 'chatbot':
        navigate('/dashboard/patient');
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <GlassNav />

      {/* Hero Section with 3D Scene */}
      <section className="relative h-screen">
        {/* 3D Background */}
        <ClinicScene onNavigate={handleNavigate} />

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent pointer-events-none" />

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center max-w-4xl px-6 pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-sm font-medium">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-primary">Plateforme Médicale Immersive</span>
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            >
              <span className="text-foreground">La Santé en</span>
              <br />
              <span className="gradient-text glow-text">3 Dimensions</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              Explorez une nouvelle façon de gérer votre santé. Naviguez dans notre 
              clinique virtuelle et accédez à tous vos services médicaux en un clic.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button
                size="lg"
                onClick={() => navigate('/dashboard/patient')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-xl shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:scale-105"
              >
                Commencer
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/articles')}
                className="glass-button px-8 py-6 text-lg rounded-xl"
              >
                Découvrir les Articles
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <span className="text-sm">Scroll pour explorer</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2"
            >
              <div className="w-1.5 h-3 bg-primary rounded-full" />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Pourquoi nous choisir?</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Notre plateforme combine innovation technologique et excellence médicale 
              pour vous offrir la meilleure expérience de santé digitale.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="glass-panel rounded-2xl p-8 group hover:border-primary/30 transition-all duration-500"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto glass-panel rounded-3xl p-12 text-center relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-secondary/20 rounded-full blur-3xl" />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Prêt à transformer votre expérience médicale?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Rejoignez des milliers de patients qui ont déjà adopté notre plateforme 
              pour une gestion de santé plus intelligente.
            </p>
            <Button
              size="lg"
              onClick={() => navigate('/dashboard/patient')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 text-lg rounded-xl shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:scale-105"
            >
              S'inscrire Gratuitement
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © 2024 MediCare 3D. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Confidentialité
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Conditions
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
