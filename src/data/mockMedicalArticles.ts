export interface MedicalArticle {
    id: string;
    title: string;
    excerpt: string;
    author: {
        name: string;
        specialty: string;
        image: string;
    };
    date: string;
    readTime: string;
    category: string;
    imageUrl: string;
}

export const mockMedicalArticles: MedicalArticle[] = [
    {
        id: '1',
        title: 'Prévention des maladies cardiovasculaires : Les gestes qui sauvent',
        excerpt: 'Découvrez les habitudes simples à adopter au quotidien pour protéger votre cœur. Une alimentation équilibrée et une activité physique régulière sont vos meilleurs alliés.',
        author: {
            name: 'Dr. Mansouri',
            specialty: 'Cardiologue',
            image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200&h=200'
        },
        date: '5 Janvier 2025',
        readTime: '5 min',
        category: 'Cardiologie',
        imageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: '2',
        title: 'Les secrets d\'une peau éclatante en hiver',
        excerpt: 'Le froid peut être rude pour votre épiderme. Conseils pratiques pour hydrater et protéger votre peau durant la saison hivernale.',
        author: {
            name: 'Dr. Fatma Khelifi',
            specialty: 'Dermatologue',
            image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200&h=200'
        },
        date: '2 Janvier 2025',
        readTime: '4 min',
        category: 'Dermatologie',
        imageUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: '3',
        title: 'Le développement de l\'enfant : Les étapes clés',
        excerpt: 'Un guide complet pour les jeunes parents sur les phases importantes de la croissance et du développement cognitif de votre enfant.',
        author: {
            name: 'Dr. Sarah Benali',
            specialty: 'Pédiatre',
            image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200&h=200'
        },
        date: '28 Décembre 2024',
        readTime: '6 min',
        category: 'Pédiatrie',
        imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: '4',
        title: 'Migraine ou céphalée : Comment faire la différence ?',
        excerpt: 'Comprendre les symptômes distinctifs pour mieux réagir. Quand faut-il consulter un spécialiste ?',
        author: {
            name: 'Dr. Karim Mansour',
            specialty: 'Neurologue',
            image: 'https://images.unsplash.com/photo-1537368910025-bc008f3416ef?auto=format&fit=crop&q=80&w=200&h=200'
        },
        date: '22 Décembre 2024',
        readTime: '7 min',
        category: 'Neurologie',
        imageUrl: 'https://images.unsplash.com/photo-1544118318-62a265691f42?auto=format&fit=crop&q=80&w=800'
    }
];
