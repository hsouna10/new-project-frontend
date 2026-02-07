import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    Hotel,
    Plane,
    Stethoscope,
    ShieldCheck,
    Globe,
    Handshake,
    CheckCircle,
    MapPin,
    Phone,
    Heart,
    Baby,
    Smile,
    Activity
} from "lucide-react";
import { motion } from "framer-motion";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from 'react-i18next';


export default function MedicalTourism() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Navbar (Identical to Home for consistency) */}
            <header className="border-b sticky top-0 bg-background/80 backdrop-blur-md z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="bg-gradient-to-tr from-medical-teal to-medical-blue p-2 rounded-lg">
                            <Activity className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-medical-teal to-medical-blue bg-clip-text text-transparent">
                            sahtyy
                        </span>
                    </Link>
                    <div className="flex items-center gap-4">

                        <Link to="/login">
                            <Button variant="ghost">{t('nav.login')}</Button>
                        </Link>
                        <Link to="/signup">
                            <Button className="bg-medical-teal hover:bg-medical-teal/90">{t('nav.signup')}</Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Section 1: Medical Trip (Hero) */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-medical-teal/5 to-transparent pointer-events-none" />
                <div className="container mx-auto px-4 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Badge className="mb-4 bg-medical-blue/10 text-medical-blue hover:bg-medical-blue/20 border-none px-4 py-1.5 text-sm">
                            {t('medical_tourism.hero_badge')}
                        </Badge>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight" dangerouslySetInnerHTML={{ __html: t('medical_tourism.hero_title') }}>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
                            {t('medical_tourism.hero_desc')}
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
                            {[
                                t('medical_tourism.items.consultation'),
                                t('medical_tourism.items.clinic'),
                                t('medical_tourism.items.hotel'),
                                t('medical_tourism.items.transport')
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-2 justify-center bg-card border px-4 py-3 rounded-xl shadow-sm">
                                    <CheckCircle className="h-5 w-5 text-medical-teal shrink-0" />
                                    <span className="text-sm font-medium">{item}</span>
                                </div>
                            ))}
                        </div>

                        <Button size="lg" className="bg-medical-teal hover:bg-medical-teal/90 text-lg px-8 h-14 rounded-full shadow-lg hover:shadow-xl transition-all">
                            {t('medical_tourism.cta_plan')} <ArrowRight className="ml-2 h-5 w-5 rtl:rotate-180" />
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* Section 2: Hôtels partenaires */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <Badge variant="outline" className="mb-4 border-medical-teal text-medical-teal">
                            <Hotel className="w-3 h-3 mr-1" /> {t('medical_tourism.hotels.badge')}
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('medical_tourism.hotels.title')}</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            {t('medical_tourism.hotels.desc')}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: t('medical_tourism.hotels.cards.comfort.title'), icon: Hotel, desc: t('medical_tourism.hotels.cards.comfort.desc') },
                            { title: t('medical_tourism.hotels.cards.proximity.title'), icon: MapPin, desc: t('medical_tourism.hotels.cards.proximity.desc') },
                            { title: t('medical_tourism.hotels.cards.services.title'), icon: Heart, desc: t('medical_tourism.hotels.cards.services.desc') },
                        ].map((feature, i) => (
                            <Card key={i} className="border-none shadow-md hover:shadow-xl transition-all duration-300">
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4 text-green-600">
                                        <feature.icon className="h-6 w-6" />
                                    </div>
                                    <CardTitle>{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{feature.desc}</p>
                                </CardContent>
                                <CardFooter>
                                    <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200">
                                        🟢 {t('medical_tourism.hotels.partner_badge')}
                                    </Badge>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 3: Transport & Assistance */}
            <section className="py-20 text-white bg-gradient-to-br from-slate-900 to-slate-800">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <Badge className="mb-6 bg-blue-500/20 text-blue-300 border-none">
                                {t('medical_tourism.transport.badge')}
                            </Badge>
                            <h2 className="text-3xl md:text-5xl font-bold mb-6" dangerouslySetInnerHTML={{ __html: t('medical_tourism.transport.title') }}>
                            </h2>
                            <p className="text-slate-300 text-lg mb-8">
                                {t('medical_tourism.transport.desc')}
                            </p>
                            <ul className="space-y-4">
                                {[
                                    { text: t('medical_tourism.transport.items.vip'), icon: Plane },
                                    { text: t('medical_tourism.transport.items.private'), icon: MapPin },
                                    { text: t('medical_tourism.transport.items.assistance'), icon: Phone },
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-4 text-lg">
                                        <div className="bg-blue-500/20 p-2 rounded-full">
                                            <item.icon className="h-5 w-5 text-blue-400" />
                                        </div>
                                        {item.text}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-500 rounded-full blur-[100px] opacity-20" />
                            <img
                                src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=1000"
                                alt="Transport"
                                className="relative rounded-2xl shadow-2xl border border-slate-700/50"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 4: Cliniques & Médecins Certifiés */}
            <section className="py-20">
                <div className="container mx-auto px-4 text-center">
                    <Badge variant="outline" className="mb-4 border-blue-200 text-blue-600 bg-blue-50">
                        <Stethoscope className="w-3 h-3 mr-1" /> {t('medical_tourism.clinics.badge')}
                    </Badge>
                    <h2 className="text-3xl md:text-4xl font-bold mb-12">{t('medical_tourism.clinics.title')}</h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { title: t('medical_tourism.clinics.items.degrees.title'), desc: t('medical_tourism.clinics.items.degrees.desc'), icon: CheckCircle },
                            { title: t('medical_tourism.clinics.items.experience.title'), desc: t('medical_tourism.clinics.items.experience.desc'), icon: Globe },
                            { title: t('medical_tourism.clinics.items.equipment.title'), desc: t('medical_tourism.clinics.items.equipment.desc'), icon: Activity },
                            { title: t('medical_tourism.clinics.items.standards.title'), desc: t('medical_tourism.clinics.items.standards.desc'), icon: ShieldCheck },
                        ].map((item, i) => (
                            <div key={i} className="bg-card border p-6 rounded-xl hover:border-medical-blue transition-colors group">
                                <item.icon className="w-10 h-10 text-medical-blue mb-4 group-hover:scale-110 transition-transform" />
                                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                                <p className="text-muted-foreground text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12">
                        <Badge className="bg-blue-600 hover:bg-blue-700 text-lg py-2 px-6 shadow-lg">
                            🔵 {t('medical_tourism.clinics.certified_badge')}
                        </Badge>
                    </div>
                </div>
            </section>

            {/* Section 5: Medical Packages */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('medical_tourism.packages.title')}</h2>
                        <p className="text-muted-foreground">{t('medical_tourism.packages.desc')}</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { title: t('medical_tourism.packages.items.dental'), icon: Smile, items: ["Implants", "Facettes", "Blanchiment"] },
                            { title: t('medical_tourism.packages.items.fertility'), icon: Baby, items: ["Diagnostic", "FIV", "Suivi"] },
                            { title: t('medical_tourism.packages.items.heart'), icon: Heart, items: ["ECG", "Echographie", "Tests d'effort"] },
                            { title: t('medical_tourism.packages.items.aesthetic'), icon: Stethoscope, items: ["Chirurgie", "Soins visage", "Botox"] },
                        ].map((pkg, i) => (
                            <Card key={i} className="hover:-translate-y-2 transition-transform duration-300 border-none shadow-lg">
                                <div className="h-2 w-full bg-gradient-to-r from-medical-teal to-medical-blue rounded-t-xl" />
                                <CardHeader>
                                    <pkg.icon className="w-10 h-10 text-medical-teal mb-2" />
                                    <CardTitle>{pkg.title}</CardTitle>
                                    <CardDescription>Package complet</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {pkg.items.map((item, j) => (
                                            <li key={j} className="flex items-center text-sm text-muted-foreground">
                                                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button variant="outline" className="w-full">{t('medical_tourism.packages.cta_view')}</Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Button className="bg-medical-blue hover:bg-medical-blue/90" size="lg">
                            {t('medical_tourism.packages.cta_all')}
                        </Button>
                    </div>
                </div>
            </section>

            {/* Section 6: International Patients */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="order-2 md:order-1">
                            <img
                                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1000"
                                alt="International Patients"
                                className="rounded-2xl shadow-xl"
                            />
                        </div>
                        <div className="order-1 md:order-2">
                            <Badge variant="outline" className="mb-4">{t('medical_tourism.international.badge')}</Badge>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('medical_tourism.international.title')}</h2>
                            <p className="text-muted-foreground mb-8">
                                {t('medical_tourism.international.desc')}
                            </p>
                            <div className="space-y-6">
                                {[
                                    { title: t('medical_tourism.international.items.online.title'), desc: t('medical_tourism.international.items.online.desc') },
                                    { title: t('medical_tourism.international.items.translation.title'), desc: t('medical_tourism.international.items.translation.desc') },
                                    { title: t('medical_tourism.international.items.followup.title'), desc: t('medical_tourism.international.items.followup.desc') },
                                ].map((service, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="bg-medical-teal/10 p-3 h-fit rounded-lg">
                                            <Globe className="w-6 h-6 text-medical-teal" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg">{service.title}</h4>
                                            <p className="text-muted-foreground">{service.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 7: Become a Partner */}
            <section className="py-20 bg-medical-blue text-white">
                <div className="container mx-auto px-4 text-center">
                    <Handshake className="w-16 h-16 mx-auto mb-6 text-white/80" />
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('medical_tourism.partner.title')}</h2>
                    <p className="text-blue-100 max-w-2xl mx-auto mb-10 text-lg">
                        {t('medical_tourism.partner.desc')}
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 mb-10">
                        {[
                            t('medical_tourism.partner.types.hotels'),
                            t('medical_tourism.partner.types.clinics'),
                            t('medical_tourism.partner.types.centers'),
                            t('medical_tourism.partner.types.agencies')
                        ].map((type, i) => (
                            <span key={i} className="bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
                                {type}
                            </span>
                        ))}
                    </div>
                    <Button size="lg" variant="secondary" className="font-bold text-medical-blue hover:bg-white/90">
                        {t('medical_tourism.partner.cta')} <ArrowRight className="ml-2 w-5 h-5 rtl:rotate-180" />
                    </Button>
                </div>
            </section>

            {/* Section 8: Trust & Security */}
            <section className="py-16 border-t">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div>
                            <h3 className="text-2xl font-bold mb-2">{t('medical_tourism.trust.title')}</h3>
                            <p className="text-muted-foreground">{t('medical_tourism.trust.desc')}</p>
                        </div>
                        <div className="flex gap-8">
                            {[
                                { label: t('medical_tourism.trust.items.data'), icon: ShieldCheck },
                                { label: t('medical_tourism.trust.items.reviews'), icon: CheckCircle },
                                { label: t('medical_tourism.trust.items.transparency'), icon: Activity },
                            ].map((trust, i) => (
                                <div key={i} className="flex flex-col items-center gap-2 text-center">
                                    <trust.icon className="w-8 h-8 text-muted-foreground/50" />
                                    <span className="text-sm font-medium text-muted-foreground">{trust.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t py-12 bg-muted/20">
                <div className="container mx-auto px-4 text-center text-muted-foreground">
                    <p>{t('footer.rights')}</p>
                </div>
            </footer>
        </div>
    );
}
