import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, PerspectiveCamera, OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { bodyParts, PainPoint } from '@/data/mockHealthData';

interface BodyPartMeshProps {
    part: typeof bodyParts[0];
    isSelected: boolean;
    painIntensity?: number;
    onClick: () => void;
    isInteractive: boolean;
}

function BodyPartMesh({ part, isSelected, painIntensity, onClick, isInteractive }: BodyPartMeshProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);

    // Couleur basée sur l'intensité de la douleur
    const color = useMemo(() => {
        if (painIntensity) {
            const intensity = painIntensity / 10;
            return new THREE.Color().lerpColors(
                new THREE.Color('#FFEB3B'), // Jaune pour faible
                new THREE.Color('#F44336'), // Rouge pour intense
                intensity
            );
        }
        if (isSelected) return new THREE.Color('#4DD9E5');
        if (hovered && isInteractive) return new THREE.Color('#6366F1');
        return new THREE.Color('#2a3a5e');
    }, [painIntensity, isSelected, hovered, isInteractive]);

    // Animation de pulsation pour les zones douloureuses
    useFrame((state) => {
        if (meshRef.current && painIntensity) {
            const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.05;
            meshRef.current.scale.setScalar(scale);
        }
    });

    // Taille selon la partie du corps
    const getSize = () => {
        if (part.id === 'head') return 0.2;
        if (part.id.includes('Shoulder') || part.id === 'chest' || part.id === 'back') return 0.15;
        if (part.id.includes('Knee') || part.id.includes('Hip')) return 0.1;
        if (part.id.includes('Hand') || part.id.includes('Foot') || part.id.includes('Ankle')) return 0.08;
        return 0.12;
    };

    return (
        <group position={[part.position.x, part.position.y, part.position.z]}>
            <mesh
                ref={meshRef}
                onClick={(e) => {
                    e.stopPropagation();
                    if (isInteractive) onClick();
                }}
                onPointerEnter={() => isInteractive && setHovered(true)}
                onPointerLeave={() => setHovered(false)}
            >
                <sphereGeometry args={[getSize(), 16, 16]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={painIntensity ? 0.5 : isSelected ? 0.3 : hovered ? 0.2 : 0.05}
                    transparent
                    opacity={0.85}
                    metalness={0.3}
                    roughness={0.4}
                />
            </mesh>

            {/* Glow effect for pain points */}
            {painIntensity && (
                <mesh scale={1.5}>
                    <sphereGeometry args={[getSize(), 16, 16]} />
                    <meshBasicMaterial color={color} transparent opacity={0.2} />
                </mesh>
            )}

            {/* Label on hover */}
            {(hovered || isSelected) && isInteractive && (
                <Html position={[0, getSize() + 0.1, 0]} center>
                    <div className="glass-panel px-3 py-1.5 rounded-lg text-xs whitespace-nowrap bg-background/80 backdrop-blur-sm border border-white/10 text-foreground">
                        {part.name}
                    </div>
                </Html>
            )}
        </group>
    );
}

function HumanBodySkeleton() {
    return (
        <group>
            {/* Torso */}
            <mesh position={[0, 0.6, 0]}>
                <cylinderGeometry args={[0.25, 0.2, 0.8, 8]} />
                <meshStandardMaterial color="#1a2a4e" transparent opacity={0.3} />
            </mesh>

            {/* Lower body */}
            <mesh position={[0, 0.1, 0]}>
                <cylinderGeometry args={[0.22, 0.18, 0.3, 8]} />
                <meshStandardMaterial color="#1a2a4e" transparent opacity={0.3} />
            </mesh>

            {/* Left leg */}
            <mesh position={[-0.12, -0.4, 0]} rotation={[0, 0, 0.05]}>
                <cylinderGeometry args={[0.08, 0.06, 0.6, 8]} />
                <meshStandardMaterial color="#1a2a4e" transparent opacity={0.3} />
            </mesh>
            <mesh position={[-0.12, -0.9, 0]} rotation={[0, 0, 0.02]}>
                <cylinderGeometry args={[0.06, 0.05, 0.5, 8]} />
                <meshStandardMaterial color="#1a2a4e" transparent opacity={0.3} />
            </mesh>

            {/* Right leg */}
            <mesh position={[0.12, -0.4, 0]} rotation={[0, 0, -0.05]}>
                <cylinderGeometry args={[0.08, 0.06, 0.6, 8]} />
                <meshStandardMaterial color="#1a2a4e" transparent opacity={0.3} />
            </mesh>
            <mesh position={[0.12, -0.9, 0]} rotation={[0, 0, -0.02]}>
                <cylinderGeometry args={[0.06, 0.05, 0.5, 8]} />
                <meshStandardMaterial color="#1a2a4e" transparent opacity={0.3} />
            </mesh>

            {/* Left arm */}
            <mesh position={[-0.45, 0.85, 0]} rotation={[0, 0, 0.4]}>
                <cylinderGeometry args={[0.05, 0.04, 0.35, 8]} />
                <meshStandardMaterial color="#1a2a4e" transparent opacity={0.3} />
            </mesh>
            <mesh position={[-0.6, 0.55, 0]} rotation={[0, 0, 0.2]}>
                <cylinderGeometry args={[0.04, 0.035, 0.35, 8]} />
                <meshStandardMaterial color="#1a2a4e" transparent opacity={0.3} />
            </mesh>

            {/* Right arm */}
            <mesh position={[0.45, 0.85, 0]} rotation={[0, 0, -0.4]}>
                <cylinderGeometry args={[0.05, 0.04, 0.35, 8]} />
                <meshStandardMaterial color="#1a2a4e" transparent opacity={0.3} />
            </mesh>
            <mesh position={[0.6, 0.55, 0]} rotation={[0, 0, -0.2]}>
                <cylinderGeometry args={[0.04, 0.035, 0.35, 8]} />
                <meshStandardMaterial color="#1a2a4e" transparent opacity={0.3} />
            </mesh>

            {/* Neck */}
            <mesh position={[0, 1.15, 0]}>
                <cylinderGeometry args={[0.08, 0.1, 0.15, 8]} />
                <meshStandardMaterial color="#1a2a4e" transparent opacity={0.3} />
            </mesh>

            {/* Head base */}
            <mesh position={[0, 1.4, 0]}>
                <sphereGeometry args={[0.18, 16, 16]} />
                <meshStandardMaterial color="#1a2a4e" transparent opacity={0.2} />
            </mesh>
        </group>
    );
}

interface HumanBody3DProps {
    painPoints?: PainPoint[];
    selectedPart?: string | null;
    onPartClick?: (partId: string) => void;
    isInteractive?: boolean;
    showLabels?: boolean;
    highlightedRecommendation?: string;
}

function Scene({
    painPoints = [],
    selectedPart,
    onPartClick,
    isInteractive = true,
    highlightedRecommendation,
}: HumanBody3DProps) {
    const groupRef = useRef<THREE.Group>(null);

    // Trouver l'intensité de douleur pour chaque partie
    const getPainIntensity = (partId: string) => {
        const point = painPoints.find(
            (p) => p.bodyPart.toLowerCase().includes(partId.toLowerCase()) ||
                partId.toLowerCase().includes(p.bodyPart.toLowerCase().split(' ')[0])
        );
        return point?.intensity;
    };

    // Check if part is highlighted by recommendation
    const isHighlighted = (partId: string) => {
        if (!highlightedRecommendation) return false;
        return highlightedRecommendation.toLowerCase().includes(
            bodyParts.find(p => p.id === partId)?.name.toLowerCase() || ''
        );
    };

    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0.5, 3]} fov={50} />
            <OrbitControls
                enablePan={false}
                minDistance={2}
                maxDistance={5}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI / 1.5}
            />

            <ambientLight intensity={0.4} />
            <pointLight position={[5, 5, 5]} intensity={0.8} color="#4DD9E5" />
            <pointLight position={[-5, 5, -5]} intensity={0.4} color="#6366F1" />
            <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={0.3} />

            <group ref={groupRef}>
                <HumanBodySkeleton />

                {bodyParts.map((part) => (
                    <BodyPartMesh
                        key={part.id}
                        part={part}
                        isSelected={selectedPart === part.id || isHighlighted(part.id)}
                        painIntensity={getPainIntensity(part.id)}
                        onClick={() => onPartClick?.(part.id)}
                        isInteractive={isInteractive}
                    />
                ))}
            </group>

            <Environment preset="city" />
        </>
    );
}

export default function HumanBody3D(props: HumanBody3DProps) {
    return (
        <div className="w-full h-full">
            <Canvas>
                <Scene {...props} />
            </Canvas>
        </div>
    );
}
