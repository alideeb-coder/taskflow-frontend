import { Canvas } from '@react-three/fiber';
import { Float, MeshDistortMaterial, OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';

function FloatingSphere({
  position,
  color,
  speed = 1,
  distort = 0.4,
  scale = 1,
}: {
  position: [number, number, number];
  color: string;
  speed?: number;
  distort?: number;
  scale?: number;
}) {
  return (
    <Float speed={speed} rotationIntensity={1.5} floatIntensity={2}>
      <mesh position={position} scale={scale}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color={color}
          distort={distort}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
}

export function HeroScene() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} />
          <pointLight position={[-5, -5, -5]} color="#818cf8" intensity={2} />

          <FloatingSphere position={[-2.2, 0.5, 0]} color="#6366f1" speed={1.2} />
          <FloatingSphere
            position={[2.2, -0.5, 0]}
            color="#a855f7"
            speed={0.9}
            distort={0.5}
          />
          <FloatingSphere
            position={[0, 1.5, -2]}
            color="#ec4899"
            speed={1.5}
            scale={0.7}
            distort={0.3}
          />
          <FloatingSphere
            position={[0.5, -1.8, -1]}
            color="#06b6d4"
            speed={1.1}
            scale={0.5}
          />

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.3}
            maxPolarAngle={Math.PI / 1.8}
            minPolarAngle={Math.PI / 2.4}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}