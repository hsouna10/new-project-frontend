import { useRef, useState } from 'react';
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import { Float, Environment, PerspectiveCamera, useTexture, Html, Stars } from '@react-three/drei';
import * as THREE from 'three';

interface FloatingIconProps {
  position: [number, number, number];
  color: string;
  icon: string;
  label: string;
  onClick: () => void;
  delay?: number;
}

function FloatingIcon({ position, color, icon, label, onClick, delay = 0 }: FloatingIconProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={1} floatingRange={[-0.2, 0.2]}>
      <group position={position}>
        <mesh
          ref={meshRef}
          onClick={onClick}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          scale={hovered ? 1.2 : 1}
        >
          <dodecahedronGeometry args={[0.6, 0]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={hovered ? 0.8 : 0.3}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        
        {/* Glow effect */}
        <mesh scale={hovered ? 1.5 : 1.2}>
          <dodecahedronGeometry args={[0.6, 0]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={hovered ? 0.3 : 0.1}
          />
        </mesh>

        {/* Label */}
        <Html
          position={[0, -1.2, 0]}
          center
          style={{
            transition: 'all 0.3s ease',
            opacity: hovered ? 1 : 0.7,
            transform: `scale(${hovered ? 1.1 : 1})`,
          }}
        >
          <div className="glass-panel px-4 py-2 rounded-xl text-center whitespace-nowrap">
            <span className="text-2xl mb-1 block">{icon}</span>
            <span className="text-sm font-medium text-foreground">{label}</span>
          </div>
        </Html>
      </group>
    </Float>
  );
}

function CentralStructure() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Central medical cross */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.3, 1.5, 0.3]} />
        <meshStandardMaterial
          color="#4DD9E5"
          emissive="#4DD9E5"
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[1, 0.3, 0.3]} />
        <meshStandardMaterial
          color="#4DD9E5"
          emissive="#4DD9E5"
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Orbiting rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2, 0.02, 16, 100]} />
        <meshStandardMaterial
          color="#6366F1"
          emissive="#6366F1"
          emissiveIntensity={0.5}
          transparent
          opacity={0.6}
        />
      </mesh>
      <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <torusGeometry args={[2.5, 0.02, 16, 100]} />
        <meshStandardMaterial
          color="#4DD9E5"
          emissive="#4DD9E5"
          emissiveIntensity={0.5}
          transparent
          opacity={0.4}
        />
      </mesh>
      <mesh rotation={[Math.PI / 4, Math.PI / 3, Math.PI / 6]}>
        <torusGeometry args={[3, 0.02, 16, 100]} />
        <meshStandardMaterial
          color="#F87171"
          emissive="#F87171"
          emissiveIntensity={0.3}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Small orbiting spheres */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Float key={i} speed={1.5} rotationIntensity={0} floatIntensity={0.5}>
          <mesh
            position={[
              Math.cos((i * Math.PI * 2) / 6) * 2.5,
              Math.sin((i * Math.PI * 2) / 6) * 0.5,
              Math.sin((i * Math.PI * 2) / 6) * 2.5,
            ]}
          >
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? "#4DD9E5" : "#6366F1"}
              emissive={i % 2 === 0 ? "#4DD9E5" : "#6366F1"}
              emissiveIntensity={0.8}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function GridFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
      <planeGeometry args={[50, 50, 50, 50]} />
      <meshStandardMaterial
        color="#0a1628"
        wireframe
        transparent
        opacity={0.15}
      />
    </mesh>
  );
}

interface ClinicSceneProps {
  onNavigate: (section: string) => void;
}

export default function ClinicScene({ onNavigate }: ClinicSceneProps) {
  const icons = [
    { position: [-3, 0.5, 0] as [number, number, number], color: "#4DD9E5", icon: "🩺", label: "Médecin", route: "doctor" },
    { position: [3, 0.5, 0] as [number, number, number], color: "#6366F1", icon: "👤", label: "Patient", route: "patient" },
    { position: [0, 0.5, -3] as [number, number, number], color: "#F87171", icon: "📅", label: "Rendez-vous", route: "appointments" },
    { position: [0, 0.5, 3] as [number, number, number], color: "#A78BFA", icon: "🤖", label: "Chatbot", route: "chatbot" },
  ];

  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={60} />
        
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#4DD9E5" />
        <pointLight position={[-10, 10, -10]} intensity={0.5} color="#6366F1" />
        <spotLight
          position={[0, 10, 0]}
          angle={0.3}
          penumbra={1}
          intensity={0.5}
          color="#4DD9E5"
        />

        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />

        <CentralStructure />

        {icons.map((item, index) => (
          <FloatingIcon
            key={item.route}
            position={item.position}
            color={item.color}
            icon={item.icon}
            label={item.label}
            onClick={() => onNavigate(item.route)}
            delay={index * 0.2}
          />
        ))}

        <GridFloor />

        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
