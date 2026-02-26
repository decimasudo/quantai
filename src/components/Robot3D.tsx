'use client'
import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

function OrangeRobot() {
  const robotRef = useRef<THREE.Group>(null)
  const chestLightRef = useRef<THREE.MeshStandardMaterial>(null)
  const scannerRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    if (robotRef.current) {
      robotRef.current.rotation.y = THREE.MathUtils.lerp(
        robotRef.current.rotation.y,
        (state.mouse.x * Math.PI) / 4,
        0.05
      )
      robotRef.current.rotation.x = THREE.MathUtils.lerp(
        robotRef.current.rotation.x,
        (-state.mouse.y * Math.PI) / 8,
        0.05
      )
    }

    // Animasi Pulse Navy Gelap di dada
    if (chestLightRef.current) {
      chestLightRef.current.emissiveIntensity = 0.1 + Math.sin(t * 2) * 0.05
    }

    // Animasi Scanner (Sistem Berjalan - Mencolok)
    if (scannerRef.current) {
      scannerRef.current.position.y = -0.8 + Math.sin(t * 1.5) * 0.25
    }
  })

  return (
    <group ref={robotRef} scale={[0.75, 0.75, 0.75]}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={1}>
        {/* Kepala (Orange) */}
        <RoundedBox args={[2.5, 1.8, 1.8]} radius={0.3} position={[0, 1.5, 0]}>
          <meshStandardMaterial color="#FF8C00" roughness={0.3} metalness={0.2} />
        </RoundedBox>

        {/* Layar Wajah (Hitam) */}
        <RoundedBox args={[2.2, 1.3, 0.2]} radius={0.2} position={[0, 1.5, 0.85]}>
          <meshStandardMaterial color="#111111" roughness={0.1} metalness={0.8} />
        </RoundedBox>

        {/* Mata Kiri (Cyan Menyala) */}
        <mesh position={[-0.5, 1.5, 0.96]}>
          <capsuleGeometry args={[0.15, 0.3, 4, 16]} />
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2} />
        </mesh>

        {/* Mata Kanan (Cyan Menyala) */}
        <mesh position={[0.5, 1.5, 0.96]}>
          <capsuleGeometry args={[0.15, 0.3, 4, 16]} />
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2} />
        </mesh>

        {/* Tiang Antena */}
        <mesh position={[0, 2.6, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.6]} />
          <meshStandardMaterial color="#333333" />
        </mesh>

        {/* Bola Antena */}
        <mesh position={[0, 2.9, 0]}>
          <sphereGeometry args={[0.25]} />
          <meshStandardMaterial color="#FF8C00" roughness={0.2} metalness={0.5} />
        </mesh>

        {/* Leher */}
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color="#333333" />
        </mesh>

        {/* Badan (Orange) */}
        <RoundedBox args={[2.8, 2, 1.5]} radius={0.4} position={[0, -0.8, 0]}>
          <meshStandardMaterial color="#FF8C00" roughness={0.3} metalness={0.2} />
        </RoundedBox>

        {/* Layar Dada (Hitam ke Navy Gelap) */}
        <RoundedBox args={[2.2, 0.8, 0.2]} radius={0.1} position={[0, -0.8, 0.7]}>
          <meshStandardMaterial 
            ref={chestLightRef}
            color="#000000" 
            emissive="#000510" 
            emissiveIntensity={0.2} 
            roughness={0.05} 
            metalness={0.95} 
          />
        </RoundedBox>

        {/* Scanner Line (System Running Effect - Cyan Mencolok) */}
        <mesh ref={scannerRef} position={[0, -0.8, 0.81]}>
          <boxGeometry args={[1.8, 0.04, 0.04]} />
          <meshStandardMaterial color="#00f2ff" emissive="#00f2ff" emissiveIntensity={2} />
        </mesh>

        {/* Static data bars - Cyan Mencolok */}
        <mesh position={[-0.6, -0.8, 0.8]}>
          <boxGeometry args={[0.3, 0.1, 0.02]} />
          <meshStandardMaterial color="#00f2ff" emissive="#00f2ff" emissiveIntensity={1} />
        </mesh>
        <mesh position={[0.6, -0.8, 0.8]}>
          <boxGeometry args={[0.3, 0.1, 0.02]} />
          <meshStandardMaterial color="#00f2ff" emissive="#00f2ff" emissiveIntensity={1} />
        </mesh>

        {/* Tangan Kiri */}
        <RoundedBox args={[0.6, 1.5, 0.6]} radius={0.3} position={[-1.8, -0.5, 0]}>
          <meshStandardMaterial color="#FF8C00" />
        </RoundedBox>

        {/* Tangan Kanan (Simetris & Statis) */}
        <RoundedBox args={[0.6, 1.5, 0.6]} radius={0.3} position={[1.8, -0.5, 0]}>
          <meshStandardMaterial color="#FF8C00" />
        </RoundedBox>
      </Float>
    </group>
  )
}

export default function RobotCanvas() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="w-full h-full" />

  return (
    <div className="w-full h-full absolute inset-0 cursor-move bg-white">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#FF8C00" />
        <OrangeRobot />
        <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 3} />
      </Canvas>
    </div>
  )
}