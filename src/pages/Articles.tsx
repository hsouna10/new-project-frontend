import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Clock, User, ChevronRight, X, ArrowLeft } from 'lucide-react';
import RoleNav from '@/components/ui/RoleNav';

const articles = [
  {
    id: 1,
    title: 'Les bienfaits de la méditation sur la santé mentale',
    excerpt: 'Découvrez comment la méditation peut améliorer votre bien-être quotidien et réduire le stress.',
    content: `La méditation est une pratique millénaire qui gagne en popularité dans notre société moderne. Des études scientifiques récentes ont démontré ses nombreux bienfaits sur la santé mentale et physique.

Réduction du stress et de l'anxiété
La méditation régulière aide à diminuer les niveaux de cortisol, l'hormone du stress. En pratiquant seulement 10 minutes par jour, vous pouvez observer une réduction significative de votre anxiété.

Amélioration de la concentration
La méditation de pleine conscience renforce notre capacité à nous concentrer sur une tâche. Elle nous apprend à ramener notre attention au moment présent, une compétence précieuse dans notre monde de distractions constantes.

Meilleur sommeil
En calmant l'esprit avant le coucher, la méditation facilite l'endormissement et améliore la qualité du sommeil. Elle est particulièrement efficace pour les personnes souffrant d'insomnie.`,
    author: 'Dr. Sarah Benali',
    date: '15 Jan 2024',
    readTime: '5 min',
    category: 'Bien-être',
    color: 'from-primary/20 to-secondary/20',
  },
  {
    id: 2,
    title: 'Prévention des maladies cardiovasculaires',
    excerpt: 'Les habitudes alimentaires et le mode de vie pour un cœur en bonne santé.',
    content: `Les maladies cardiovasculaires restent la première cause de mortalité dans le monde. Heureusement, de nombreux facteurs de risque peuvent être contrôlés par des changements de mode de vie.

Alimentation équilibrée
Privilégiez une alimentation riche en fruits, légumes, céréales complètes et poissons gras. Limitez les graisses saturées, le sel et les sucres ajoutés.

Activité physique régulière
L'Organisation Mondiale de la Santé recommande au moins 150 minutes d'activité physique modérée par semaine. La marche rapide, la natation ou le vélo sont d'excellents choix.

Arrêt du tabac
Le tabagisme est l'un des principaux facteurs de risque cardiovasculaire. Arrêter de fumer réduit considérablement le risque de crise cardiaque dès les premières semaines.`,
    author: 'Dr. Karim Mansour',
    date: '12 Jan 2024',
    readTime: '7 min',
    category: 'Cardiologie',
    color: 'from-accent/20 to-primary/20',
  },
  {
    id: 3,
    title: 'L\'importance du sommeil pour la santé',
    excerpt: 'Comprendre les cycles du sommeil et optimiser votre repos nocturne.',
    content: `Le sommeil est un pilier fondamental de notre santé, au même titre que l'alimentation et l'exercice physique. Pourtant, de nombreuses personnes négligent cette nécessité biologique.

Les cycles du sommeil
Une nuit de sommeil complète comprend 4 à 6 cycles d'environ 90 minutes chacun. Chaque cycle inclut des phases de sommeil léger, profond et paradoxal (REM).

Durée recommandée
Les adultes ont besoin de 7 à 9 heures de sommeil par nuit. Les adolescents nécessitent 8 à 10 heures, tandis que les enfants ont besoin de plus de sommeil encore.

Conséquences du manque de sommeil
Un sommeil insuffisant affecte la concentration, la mémoire, le système immunitaire et augmente le risque de maladies chroniques comme le diabète et l'obésité.`,
    author: 'Dr. Leila Trabelsi',
    date: '10 Jan 2024',
    readTime: '6 min',
    category: 'Sommeil',
    color: 'from-secondary/20 to-medical-purple/20',
  },
  {
    id: 4,
    title: 'Vaccination : ce qu\'il faut savoir',
    excerpt: 'Guide complet sur les vaccins essentiels et leur importance pour la santé publique.',
    content: `La vaccination est l'une des avancées médicales les plus importantes de l'histoire. Elle a permis d'éradiquer ou de contrôler de nombreuses maladies mortelles.

Comment fonctionnent les vaccins
Les vaccins stimulent notre système immunitaire à produire des anticorps contre des agents pathogènes spécifiques, sans provoquer la maladie elle-même.

Calendrier vaccinal
Il est important de suivre le calendrier vaccinal recommandé par les autorités de santé. Certains vaccins nécessitent des rappels pour maintenir une protection optimale.

Sécurité des vaccins
Les vaccins sont rigoureusement testés avant leur mise sur le marché. Les effets secondaires graves sont extrêmement rares comparés aux risques des maladies qu'ils préviennent.`,
    author: 'Dr. Mohamed Sassi',
    date: '8 Jan 2024',
    readTime: '8 min',
    category: 'Prévention',
    color: 'from-medical-purple/20 to-accent/20',
  },
];

export default function Articles() {
  const [selectedArticle, setSelectedArticle] = useState<typeof articles[0] | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <RoleNav />

      <main className="pt-28 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Articles <span className="gradient-text">Médicaux</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Restez informé avec nos articles rédigés par des professionnels de santé
            </p>
          </motion.div>

          {/* Articles Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {articles.map((article, index) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-panel rounded-2xl overflow-hidden group cursor-pointer"
                onClick={() => setSelectedArticle(article)}
              >
                {/* Card Header with Gradient */}
                <div className={`h-32 bg-gradient-to-br ${article.color} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                  <div className="absolute bottom-4 left-6">
                    <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-sm font-medium">
                      {article.category}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{article.readTime}</span>
                      </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </main>

      {/* Article Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/90 backdrop-blur-md z-50 overflow-y-auto"
          >
            <div className="min-h-screen py-12 px-6">
              <div className="max-w-3xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="glass-panel rounded-2xl overflow-hidden"
                >
                  {/* Modal Header */}
                  <div className={`h-48 bg-gradient-to-br ${selectedArticle.color} relative`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                    <button
                      onClick={() => setSelectedArticle(null)}
                      className="absolute top-6 left-6 flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      <span>Retour</span>
                    </button>
                    <button
                      onClick={() => setSelectedArticle(null)}
                      className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Modal Content */}
                  <div className="p-8 -mt-12 relative">
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">
                      {selectedArticle.category}
                    </span>

                    <h1 className="text-3xl font-bold mb-4">{selectedArticle.title}</h1>

                    <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8 pb-8 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <span>{selectedArticle.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{selectedArticle.readTime} de lecture</span>
                      </div>
                      <span>{selectedArticle.date}</span>
                    </div>

                    <div className="prose prose-invert max-w-none">
                      {selectedArticle.content.split('\n\n').map((paragraph, index) => (
                        <p key={index} className="text-foreground/80 leading-relaxed mb-4">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
