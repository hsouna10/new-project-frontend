import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Star } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = new Icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

// City coordinates mapping for Tunisia
const cityCoordinates: { [key: string]: [number, number] } = {
    'Tunis': [36.8065, 10.1815],
    'Sfax': [34.7478, 10.7662],
    'Sousse': [35.8256, 10.6370],
    'Bizerte': [37.2744, 9.8739],
    'Gabès': [33.8815, 10.0982],
    'Kairouan': [35.6781, 10.0963],
    'Ariana': [36.8625, 10.1956],
    'Monastir': [35.7780, 10.8262],
    'Nabeul': [36.4561, 10.7376],
    // Default fallback
    'Toutes': [34.0, 9.0],
};

// Component to handle map center updates
function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

interface DoctorMapProps {
    doctors: any[];
    selectedRegion: string;
    onBookAppointment: (doctor: any) => void;
}

export default function DoctorMap({ doctors, selectedRegion, onBookAppointment }: DoctorMapProps) {
    // Determine center based on selected region
    let center: [number, number] = [36.8065, 10.1815]; // Default Tunis
    let zoom = 12;

    if (selectedRegion && selectedRegion !== 'Toutes' && cityCoordinates[selectedRegion]) {
        center = cityCoordinates[selectedRegion];
        zoom = 13;
    } else {
        // Center of Tunisia (adjusted for better visibility)
        center = [34.5, 9.5];
        zoom = 7;
    }

    // Generate coordinates for doctors if missing (mocking based on City)
    const doctorsWithCoords = doctors.map((doc, index) => {
        if (doc.lat && doc.lng) return doc;

        const city = doc.city || 'Tunis'; // Default to Tunis if no city
        const baseCoords = cityCoordinates[city] || cityCoordinates['Tunis'];

        // Add random jitter to avoid overlap
        // Pseudo-random based on index to keep it consistent-ish
        const lat = baseCoords[0] + (Math.sin(index) * 0.02);
        const lng = baseCoords[1] + (Math.cos(index) * 0.02);

        return { ...doc, lat, lng };
    });

    return (
        <div className="h-[500px] w-full rounded-2xl overflow-hidden border border-white/10 shadow-xl relative z-0">
            <MapContainer
                center={center}
                zoom={zoom}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MapUpdater center={center} zoom={zoom} />

                {doctorsWithCoords.map((doctor, idx) => (
                    <Marker
                        key={doctor.id || doctor._id || idx}
                        position={[doctor.lat, doctor.lng]}
                        icon={DefaultIcon}
                    >
                        <Popup className="glass-popup">
                            <div className="p-1 min-w-[200px]">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                        {doctor.prenom?.[0]}{doctor.nom?.[0]}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm">Dr. {doctor.prenom} {doctor.nom}</h3>
                                        <p className="text-xs text-muted-foreground">{doctor.specialite}</p>
                                    </div>
                                </div>
                                <div className="space-y-1 mb-3 text-xs">
                                    <div className="flex items-center gap-1 text-muted-foreground">
                                        <MapPin className="w-3 h-3" />
                                        <span>{doctor.city}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-yellow-500">
                                        <Star className="w-3 h-3 fill-current" />
                                        <span>4.8 (120 avis)</span>
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    className="w-full h-8 text-xs"
                                    onClick={() => onBookAppointment(doctor)}
                                >
                                    Prendre RDV
                                </Button>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
