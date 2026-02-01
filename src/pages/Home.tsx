import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Activity, Shield, Clock, Users, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { mockMedicalArticles } from "@/data/mockMedicalArticles";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Home() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Navbar */}
            <header className="border-b sticky top-0 bg-background/80 backdrop-blur-md z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-gradient-to-tr from-medical-teal to-medical-blue p-2 rounded-lg">
                            <Activity className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-medical-teal to-medical-blue bg-clip-text text-transparent">
                            sahtyy
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login">
                            <Button variant="ghost">Connexion</Button>
                        </Link>
                        <Link to="/signup">
                            <Button className="bg-medical-teal hover:bg-medical-teal/90">S'inscrire</Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-20 pb-32">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-30 pointer-events-none">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-medical-teal rounded-full blur-[100px]" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-medical-blue rounded-full blur-[100px]" />
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                            Votre Santé, <br />
                            <span className="bg-gradient-to-r from-medical-teal to-medical-blue bg-clip-text text-transparent">
                                Notre Priorité
                            </span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                            Une plateforme unifiée pour gérer vos rendez-vous, vos dossiers médicaux et communiquer avec vos professionnels de santé en toute sécurité.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/signup">
                                <Button size="lg" className="h-12 px-8 text-lg bg-medical-teal hover:bg-medical-teal/90">
                                    Commencer maintenant <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link to="/login">
                                <Button size="lg" variant="outline" className="h-12 px-8 text-lg">
                                    Accéder à mon espace
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={Clock}
                            title="Prise de RDV 24/7"
                            description="Réservez vos consultations en ligne à tout moment, sans attente téléphonique."
                        />
                        <FeatureCard
                            icon={Shield}
                            title="Données Sécurisées"
                            description="Vos informations médicales sont cryptées et protégées selon les normes les plus strictes."
                        />
                        <FeatureCard
                            icon={Users}
                            title="Réseau d'Experts"
                            description="Accédez à un large réseau de médecins généralistes et spécialistes qualifiés."
                        />
                    </div>
                </div>
            </section>

            {/* Doctor Publications Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Publications de nos <span className="bg-gradient-to-r from-medical-teal to-medical-blue bg-clip-text text-transparent">Experts</span>
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Restez informé avec les derniers articles et conseils santé rédigés par nos médecins spécialistes.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {mockMedicalArticles.map((article, index) => (
                            <motion.div
                                key={article.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Card className="h-full hover:shadow-lg transition-all duration-300 border-none bg-card/50 backdrop-blur-sm ring-1 ring-border/50">
                                    <div className="aspect-video w-full overflow-hidden rounded-t-xl bg-muted relative group">
                                        <img
                                            src={article.imageUrl}
                                            alt={article.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute top-2 right-2">
                                            <Badge variant="secondary" className="bg-background/80 backdrop-blur-md">
                                                {article.category}
                                            </Badge>
                                        </div>
                                    </div>
                                    <CardHeader className="p-4">
                                        <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                                            <Calendar className="w-3 h-3" />
                                            <span>{article.date}</span>
                                        </div>
                                        <CardTitle className="line-clamp-2 text-lg hover:text-medical-teal transition-colors text-left">
                                            {article.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0">
                                        <p className="text-muted-foreground text-sm line-clamp-3 mb-4 text-left">
                                            {article.excerpt}
                                        </p>
                                        <div className="flex items-center gap-3 pt-4 border-t">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={article.author.image} />
                                                <AvatarFallback>{article.author.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="text-sm text-left">
                                                <p className="font-medium leading-none">{article.author.name}</p>
                                                <p className="text-muted-foreground text-xs">{article.author.specialty}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="p-4 pt-0">
                                        <Link to="/articles" className="w-full">
                                            <Button variant="ghost" className="w-full justify-between group-hover:text-medical-teal">
                                                Lire l'article
                                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                            </Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t py-12 mt-auto">
                <div className="container mx-auto px-4 text-center text-muted-foreground">
                    <p>&copy; 2024 sahtyy. Tous droits réservés.</p>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
    return (
        <div className="bg-background p-8 rounded-2xl border hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-medical-teal/10 rounded-xl flex items-center justify-center mb-4">
                <Icon className="h-6 w-6 text-medical-teal" />
            </div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
        </div>
    );
}
