import axios from 'axios';

const API_URL = 'https://new-project-backend-3v94.onrender.com/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the token in requests
api.interceptors.request.use(
    (config) => {
        const user = localStorage.getItem('user');
        if (user) {
            const parsedUser = JSON.parse(user);
            if (parsedUser.token) {
                config.headers.Authorization = `Bearer ${parsedUser.token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const authService = {
    register: async (userData: any) => {
        const response = await api.post('/auth/register', userData);
        if (response.data.token) {
            const userWithToken = { ...response.data.data.user, token: response.data.token };
            localStorage.setItem('user', JSON.stringify(userWithToken));
        }
        return response.data;
    },
    login: async (email: string, motdepasse: string) => {
        const response = await api.post('/auth/login', { email, motdepasse });
        if (response.data.token) {
            const userWithToken = { ...response.data.data.user, token: response.data.token };
            localStorage.setItem('user', JSON.stringify(userWithToken));
        }
        return response.data;
    },
    logout: () => {
        localStorage.removeItem('user');
    },
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
};

export const doctorService = {
    getAllDoctors: async () => {
        const response = await api.get('/doctors');
        return response.data;
    },
    update: async (id: string, doctorData: any) => {
        return api.patch(`/doctors/${id}`, doctorData);
    },
    async delete(id: string) {
        return api.delete(`/doctors/${id}`);
    },
    async getStats() {
        return api.get('/doctors/dashboard/stats');
    }
};

export const patientService = {
    getAllPatients: async () => {
        const response = await api.get('/patients');
        return response.data;
    },
    updatePatient: async (id: string, patientData: any) => {
        const response = await api.put(`/patients/${id}`, patientData);
        return response.data;
    },
};

export const appointmentService = {
    createAppointment: async (appointmentData: any) => {
        const response = await api.post('/appointments', appointmentData);
        return response.data;
    },
    getMyAppointments: async (patientId: string) => {
        const response = await api.get(`/appointments/patient/${patientId}`);
        return response.data;
    },
    getDoctorAppointments: async (doctorId: string) => {
        const response = await api.get(`/appointments/doctor/${doctorId}`);
        return response.data;
    },
    updateAppointmentStatus: async (appointmentId: string, status: string) => {
        const response = await api.patch(`/appointments/${appointmentId}/status`, { status });
        return response.data;
    },
    getCompletedAppointments: async () => {
        const response = await api.get('/appointments/accepte');
        return response.data;
    },
};

export const painPointService = {
    createPainPoint: async (painPointData: any) => {
        const response = await api.post('/painpoints', painPointData);
        return response.data;
    },
    getMyPainPoints: async () => {
        const response = await api.get('/painpoints/my');
        return response.data;
    },
};

export const rapportService = {
    createRapport: async (rapportData: any) => {
        const response = await api.post('/rapports', rapportData);
        return response.data;
    },
    getMyRapports: async () => {
        const response = await api.get('/rapports/mes');
        return response.data;
    },
    getDoctorReports: async () => {
        const response = await api.get('/rapports/docteur');
        return response.data;
    },
    generateAIReport: async (painPoints: any[]) => {
        const response = await api.post('/rapports/generer-ia', { painPoints });
        return response.data;
    },
};

export const journalService = {
    createJournalEntry: async (entryData: any, patientId?: string) => {
        const payload = {
            type: entryData.type,
            titre: entryData.title,
            description: entryData.description,
            // Add other fields if needed for creation
            urlMemoVocal: entryData.voiceMemoUrl,
            recommandations: entryData.recommendations,
            patientId: patientId
        };
        const response = await api.post('/journal', payload);
        return response.data;
    },
    getMyJournal: async () => {
        const response = await api.get('/journal/mes');
        return response.data;
    },
    generateSummary: async () => {
        const response = await api.post('/journal/resume-ia');
        return response.data;
    },
};

export const userService = {
    getAllUsers: async () => {
        const response = await api.get('/users');
        return response.data;
    },
    deleteUser: async (id: string) => {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    }
};

export default api;
