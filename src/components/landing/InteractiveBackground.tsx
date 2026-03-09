'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as random from 'maath/random/dist/maath-random.esm'

function Stars({ color = "#22d3ee", count = 8000, size = 0.003, speed = 45, ...props }: any) {
  const ref = useRef<any>()
  const [sphere] = useState(() => random.inSphere(new Float32Array(count), { radius: 1.8 }))

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / speed
    ref.current.rotation.y -= delta / (speed * 1.5)
  })

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color={color}
          size={size}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.9}
        />
      </Points>
    </group>
  )
}

function Nebula({ color = "#f59e0b", count = 3000, radius = 1.2 }: any) {
  const ref = useRef<any>()
  const [points] = useState(() => random.inSphere(new Float32Array(count), { radius }))
  
  useFrame((state, delta) => {
    ref.current.rotation.z += delta / 80
    ref.current.rotation.y += delta / 120
  })

  return (
    <group rotation={[Math.PI / 4, 0, 0]}>
       <Points ref={ref} positions={points} stride={3} frustumCulled={false}>
          <PointMaterial
            transparent
            color={color}
            size={0.005}
            sizeAttenuation={true}
            depthWrite={false}
            opacity={0.3}
          />
       </Points>
    </group>
  )
}

import { useState } from 'react'

export function InteractiveBackground() {
  return (
    <div className="absolute inset-0 z-0 bg-[#01030a]">
      {/* Enhanced Deep Space Gradients */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#020617] via-transparent to-stellar/10 z-10 pointer-events-none" />
      
      {/* Dynamic Ambient Glows */}
      <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-stellar/10 rounded-full blur-[150px] pointer-events-none z-10 opacity-20 animate-pulse" />
      <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-nebula/5 rounded-full blur-[180px] pointer-events-none z-10 opacity-10 animate-pulse delay-1000" />
      
      {/* Central Horizon Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-stellar/30 to-transparent z-10 opacity-20" />
      
      <Canvas camera={{ position: [0, 0, 0.8] }}>
        <Stars color="#22d3ee" count={8000} size={0.003} speed={30} />
        <Stars color="#ffffff" count={4000} size={0.0015} speed={50} />
        <Stars color="#f472b6" count={2000} size={0.002} speed={40} />
        <Nebula color="#22d3ee" count={2000} radius={1.5} />
        <Nebula color="#818cf8" count={1500} radius={1.0} />
      </Canvas>
    </div>
  )
}
