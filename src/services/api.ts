import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

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
    updateDoctor: async (id: string, doctorData: any) => {
        const response = await api.patch(`/doctors/${id}`, doctorData);
        return response.data;
    },
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

export default api;
