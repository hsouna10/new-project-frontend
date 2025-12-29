export interface BodyPart {
    id: string;
    name: string;
    position: { x: number; y: number; z: number };
}

export interface PainPoint {
    id: string;
    bodyPart: string;
    position: { x: number; y: number; z: number };
    intensity: number;
    date: string;
    notes?: string;
    doctorNotes?: DoctorNote[];
}

export interface DoctorNote {
    id: string;
    text: string;
    date: string;
    doctorName: string;
}

export interface Recommendation {
    id: string;
    type: 'medication' | 'exercise' | 'lifestyle' | 'follow-up';
    text: string;
    textDarija?: string;
    bodyPart?: string;
    completed: boolean;
}

export interface MedicalReport {
    id: string;
    date: string;
    doctorName: string;
    diagnosis: string;
    diagnosisDarija?: string;
    painPoints: PainPoint[];
    recommendations: Recommendation[];
}

export interface HealthJournalEntry {
    id: string;
    date: string;
    type: 'visit' | 'symptom' | 'medication';
    title: string;
    description: string;
    doctorName?: string;
    voiceMemoUrl?: string;
    recommendations?: { id: string; text: string }[];
}

export const bodyParts: BodyPart[] = [
    { id: 'head', name: 'Tête', position: { x: 0, y: 1.4, z: 0 } },
    { id: 'neck', name: 'Cou', position: { x: 0, y: 1.15, z: 0 } },
    { id: 'leftShoulder', name: 'Épaule G', position: { x: -0.4, y: 1.0, z: 0 } },
    { id: 'rightShoulder', name: 'Épaule D', position: { x: 0.4, y: 1.0, z: 0 } },
    { id: 'chest', name: 'Poitrine', position: { x: 0, y: 0.8, z: 0.15 } },
    { id: 'stomach', name: 'Ventre', position: { x: 0, y: 0.4, z: 0.15 } },
    { id: 'back', name: 'Dos', position: { x: 0, y: 0.6, z: -0.15 } },
    { id: 'leftArm', name: 'Bras G', position: { x: -0.5, y: 0.6, z: 0 } },
    { id: 'rightArm', name: 'Bras D', position: { x: 0.5, y: 0.6, z: 0 } },
    { id: 'leftHand', name: 'Main G', position: { x: -0.7, y: 0.3, z: 0 } },
    { id: 'rightHand', name: 'Main D', position: { x: 0.7, y: 0.3, z: 0 } },
    { id: 'hips', name: 'Hanches', position: { x: 0, y: 0.1, z: 0 } },
    { id: 'leftThigh', name: 'Cuisse G', position: { x: -0.15, y: -0.3, z: 0 } },
    { id: 'rightThigh', name: 'Cuisse D', position: { x: 0.15, y: -0.3, z: 0 } },
    { id: 'leftKnee', name: 'Genou G', position: { x: -0.15, y: -0.6, z: 0 } },
    { id: 'rightKnee', name: 'Genou D', position: { x: 0.15, y: -0.6, z: 0 } },
    { id: 'leftLeg', name: 'Jambe G', position: { x: -0.15, y: -0.85, z: 0 } },
    { id: 'rightLeg', name: 'Jambe D', position: { x: 0.15, y: -0.85, z: 0 } },
    { id: 'leftFoot', name: 'Pied G', position: { x: -0.18, y: -1.1, z: 0.1 } },
    { id: 'rightFoot', name: 'Pied D', position: { x: 0.18, y: -1.1, z: 0.1 } },
];

export const mockPainPoints: PainPoint[] = [
    {
        id: 'p1',
        bodyPart: 'Dos',
        position: { x: 0, y: 0.6, z: -0.15 },
        intensity: 7,
        date: '2024-12-15',
        notes: 'Douleur aiguë après avoir soulevé une charge',
        doctorNotes: [
            { id: 'n1', text: 'Hernie discale possible', date: '2024-12-16', doctorName: 'Dr. Mansouri' }
        ]
    },
    {
        id: 'p2',
        bodyPart: 'Genou D',
        position: { x: 0.15, y: -0.6, z: 0 },
        intensity: 4,
        date: '2024-12-20',
        notes: 'Gêne en montant les escaliers'
    }
];

export const mockHealthJournal: HealthJournalEntry[] = [
    {
        id: 'j1',
        date: '2024-12-15',
        type: 'symptom',
        title: 'Douleur lombaire',
        description: 'Apparition soudaine d\'une douleur dans le bas du dos.',
    },
    {
        id: 'j2',
        date: '2024-12-16',
        type: 'visit',
        title: 'Consultation Dr. Mansouri',
        description: 'Examen physique du dos. Prescription de repos et d\'anti-inflammatoires.',
        doctorName: 'Dr. Mansouri',
        voiceMemoUrl: 'mock-audio.mp3',
        recommendations: [
            { id: 'r1', text: 'Prendre Doliprane 1000mg 3x/jour' },
            { id: 'r2', text: 'Éviter de porter des charges lourdes' }
        ]
    },
    {
        id: 'j3',
        date: '2024-12-20',
        type: 'medication',
        title: 'Début Kinésithérapie',
        description: 'Première séance de rééducation.',
    }
];

export const mockAISummary = {
    synthesis: "Le patient présente des douleurs lombaires récurrentes depuis le 15 décembre, aggravées par l'effort. Une consultation a confirmé une lombalgie mécanique. L'évolution est stable sous traitement symptomatique.",
    synthesisDarija: "El mrid 3andou wji3a fi dahrou mill 15 décembre, zedit ki hez 7aja hqila. Tbib gallou 3andek lombalgie. El 7ala mte3ou stable bel dwe."
};
