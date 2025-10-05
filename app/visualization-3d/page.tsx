"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Stars, Text } from "@react-three/drei"
import { Suspense, useState, useRef, useMemo } from "react"
import * as THREE from "three"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

class PerlinNoise {
  private permutation: number[]

  constructor(seed = 0) {
    this.permutation = []
    for (let i = 0; i < 256; i++) {
      this.permutation[i] = i
    }
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(((((seed + i) * 9301 + 49297) % 233280) / 233280) * (i + 1))
      const temp = this.permutation[i]
      this.permutation[i] = this.permutation[j]
      this.permutation[j] = temp
    }
    this.permutation = [...this.permutation, ...this.permutation]
  }

  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10)
  }

  private lerp(t: number, a: number, b: number): number {
    return a + t * (b - a)
  }

  private grad(hash: number, x: number, y: number): number {
    const h = hash & 15
    const u = h < 8 ? x : y
    const v = h < 4 ? y : h === 12 || h === 14 ? x : 0
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v)
  }

  noise(x: number, y: number): number {
    const X = Math.floor(x) & 255
    const Y = Math.floor(y) & 255

    x -= Math.floor(x)
    y -= Math.floor(y)

    const u = this.fade(x)
    const v = this.fade(y)

    const a = this.permutation[X] + Y
    const b = this.permutation[X + 1] + Y

    return this.lerp(
      v,
      this.lerp(u, this.grad(this.permutation[a], x, y), this.grad(this.permutation[b], x - 1, y)),
      this.lerp(u, this.grad(this.permutation[a + 1], x, y - 1), this.grad(this.permutation[b + 1], x - 1, y - 1)),
    )
  }

  octaveNoise(x: number, y: number, octaves: number, persistence: number): number {
    let total = 0
    let frequency = 1
    let amplitude = 1
    let maxValue = 0

    for (let i = 0; i < octaves; i++) {
      total += this.noise(x * frequency, y * frequency) * amplitude
      maxValue += amplitude
      amplitude *= persistence
      frequency *= 2
    }

    return total / maxValue
  }
}

type PlanetType = {
  name: string
  color: string
  emissiveColor: string
  atmosphereColor: string
  size: number
  hasRings: boolean
  ringColor?: string
  metalness: number
  roughness: number
  emissiveIntensity: number
  description: string
}

const PLANET_TYPES: Record<string, PlanetType> = {
  gasGiant: {
    name: "Gas Giant",
    color: "#f5c77e",
    emissiveColor: "#d4a574",
    atmosphereColor: "#ffd9a0",
    size: 1.5,
    hasRings: true,
    ringColor: "#e8c9a0",
    metalness: 0.4,
    roughness: 0.5,
    emissiveIntensity: 0.3,
    description: "Large planets similar to Jupiter",
  },
  hotJupiter: {
    name: "Hot Jupiter",
    color: "#ff7f50",
    emissiveColor: "#ff4500",
    atmosphereColor: "#ffb380",
    size: 1.4,
    hasRings: false,
    metalness: 0.3,
    roughness: 0.3,
    emissiveIntensity: 0.6,
    description: "Gas giants close to their star",
  },
  superEarth: {
    name: "Super-Earth",
    color: "#5fa777",
    emissiveColor: "#3d7a52",
    atmosphereColor: "#90d4b0",
    size: 1.1,
    hasRings: false,
    metalness: 0.2,
    roughness: 0.7,
    emissiveIntensity: 0.2,
    description: "Rocky planets larger than Earth",
  },
  iceGiant: {
    name: "Ice Giant",
    color: "#5eb3ff",
    emissiveColor: "#3d8fd9",
    atmosphereColor: "#a0d8ff",
    size: 1.3,
    hasRings: true,
    ringColor: "#80c5ff",
    metalness: 0.6,
    roughness: 0.2,
    emissiveIntensity: 0.35,
    description: "Planets similar to Neptune",
  },
  rockyPlanet: {
    name: "Rocky Planet",
    color: "#b8956f",
    emissiveColor: "#8b7355",
    atmosphereColor: "#d4b89a",
    size: 0.9,
    hasRings: false,
    metalness: 0.3,
    roughness: 0.8,
    emissiveIntensity: 0.15,
    description: "Small rocky planets",
  },
  binaryStar: {
    name: "Binary Star",
    color: "#ff5555",
    emissiveColor: "#ff0000",
    atmosphereColor: "#ff9999",
    size: 1.2,
    hasRings: false,
    metalness: 0.9,
    roughness: 0.1,
    emissiveIntensity: 1.2,
    description: "Misidentified as a planet",
  },
  stellarActivity: {
    name: "Stellar Activity",
    color: "#ffaa33",
    emissiveColor: "#ff8800",
    atmosphereColor: "#ffd480",
    size: 1.0,
    hasRings: false,
    metalness: 0.8,
    roughness: 0.2,
    emissiveIntensity: 0.9,
    description: "Stellar flares",
  },
}

function createPlanetTexture(baseColor: string, secondaryColor: string, type: string, seed: number) {
  console.log("[v0] Creating texture for", type, "with seed", seed)

  const canvas = document.createElement("canvas")
  canvas.width = 1024
  canvas.height = 1024
  const ctx = canvas.getContext("2d")!

  const perlin = new PerlinNoise(seed)
  const imageData = ctx.createImageData(1024, 1024)

  const base = Number.parseInt(baseColor.slice(1), 16)
  const baseR = (base >> 16) & 255
  const baseG = (base >> 8) & 255
  const baseB = base & 255

  const secondary = Number.parseInt(secondaryColor.slice(1), 16)
  const secR = (secondary >> 16) & 255
  const secG = (secondary >> 8) & 255
  const secB = secondary & 255

  for (let y = 0; y < 1024; y++) {
    for (let x = 0; x < 1024; x++) {
      const idx = (y * 1024 + x) * 4

      const noise = perlin.octaveNoise(x / 80, y / 80, 5, 0.6)
      let value = (noise + 1) / 2

      if (type === "gasGiant" || type === "hotJupiter") {
        const bands = Math.sin((y / 1024) * Math.PI * 16 + noise * 3)
        const turbulence = perlin.octaveNoise(x / 60, y / 60, 3, 0.5)
        value = value * 0.5 + (bands * 0.5 + 0.5) * 0.4 + turbulence * 0.1
      } else if (type === "iceGiant") {
        const swirl = Math.sin(Math.atan2(y - 512, x - 512) * 8 + noise * 3)
        const depth = perlin.octaveNoise(x / 100, y / 100, 4, 0.5)
        value = value * 0.5 + (swirl * 0.5 + 0.5) * 0.3 + depth * 0.2
      } else if (type === "superEarth" || type === "rockyPlanet") {
        const continent = perlin.octaveNoise(x / 120, y / 120, 4, 0.6)
        const mountains = perlin.octaveNoise(x / 40, y / 40, 3, 0.5)
        value = continent > 0.1 ? 0.8 + mountains * 0.2 : 0.2 + mountains * 0.1
      } else if (type === "binaryStar" || type === "stellarActivity") {
        const plasma = Math.sin(x / 50 + noise * 4) * Math.cos(y / 50 + noise * 4)
        const flares = perlin.octaveNoise(x / 70, y / 70, 4, 0.6)
        value = plasma * 0.4 + 0.5 + flares * 0.3
      }

      value = Math.pow(Math.max(0, Math.min(1, value)), 0.7)

      imageData.data[idx] = Math.floor(baseR + (secR - baseR) * value)
      imageData.data[idx + 1] = Math.floor(baseG + (secG - baseG) * value)
      imageData.data[idx + 2] = Math.floor(baseB + (secB - baseB) * value)
      imageData.data[idx + 3] = 255
    }
  }

  ctx.putImageData(imageData, 0, 0)

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.anisotropy = 16

  console.log("[v0] Texture created successfully for", type)
  return texture
}

function createBumpMap(seed: number) {
  const canvas = document.createElement("canvas")
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext("2d")!

  const perlin = new PerlinNoise(seed + 1000)
  const imageData = ctx.createImageData(512, 512)

  for (let y = 0; y < 512; y++) {
    for (let x = 0; x < 512; x++) {
      const idx = (y * 512 + x) * 4
      const height = perlin.octaveNoise(x / 40, y / 40, 4, 0.6)
      const value = Math.floor(Math.pow((height + 1) / 2, 0.6) * 255)

      imageData.data[idx] = value
      imageData.data[idx + 1] = value
      imageData.data[idx + 2] = value
      imageData.data[idx + 3] = 255
    }
  }

  ctx.putImageData(imageData, 0, 0)

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  return texture
}

function Planet({
  planetType,
  position = [0, 0, 0],
  label,
  seed,
  typeKey,
}: {
  planetType: PlanetType
  position?: [number, number, number]
  label: string
  seed: number
  typeKey: string
}) {
  const planetRef = useRef<THREE.Mesh>(null)
  const atmosphereRef = useRef<THREE.Mesh>(null)
  const ringsRef = useRef<THREE.Mesh>(null)

  const { texture, bumpMap } = useMemo(() => {
    console.log("[v0] Generating textures for planet:", label)

    const getSecondaryColor = (baseColor: string) => {
      const base = Number.parseInt(baseColor.slice(1), 16)
      const r = (base >> 16) & 255
      const g = (base >> 8) & 255
      const b = base & 255

      const newR = Math.min(255, Math.floor(r * 1.5))
      const newG = Math.min(255, Math.floor(g * 1.4))
      const newB = Math.min(255, Math.floor(b * 1.3))

      return `#${((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1)}`
    }

    const secondaryColor = getSecondaryColor(planetType.color)

    return {
      texture: createPlanetTexture(planetType.color, secondaryColor, typeKey, seed),
      bumpMap: createBumpMap(seed),
    }
  }, [planetType.color, typeKey, seed, label])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    if (planetRef.current) {
      planetRef.current.rotation.y = time * 0.1
    }

    if (ringsRef.current) {
      ringsRef.current.rotation.z = time * 0.15
    }
  })

  return (
    <group position={position}>
      <mesh ref={planetRef} castShadow receiveShadow>
        <sphereGeometry args={[planetType.size, 128, 128]} />
        <meshStandardMaterial
          map={texture}
          bumpMap={bumpMap}
          bumpScale={0.2}
          roughness={planetType.roughness}
          metalness={planetType.metalness}
          emissive={planetType.emissiveColor}
          emissiveIntensity={planetType.emissiveIntensity * 0.5}
        />
      </mesh>

      <mesh ref={atmosphereRef} scale={1.2}>
        <sphereGeometry args={[planetType.size, 64, 64]} />
        <meshBasicMaterial
          color={planetType.atmosphereColor}
          transparent
          opacity={0.4}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {planetType.hasRings && (
        <mesh ref={ringsRef} rotation={[Math.PI / 2.3, 0, 0]}>
          <ringGeometry args={[planetType.size * 1.4, planetType.size * 2.0, 128]} />
          <meshStandardMaterial
            color={planetType.ringColor}
            transparent
            opacity={0.85}
            emissive={planetType.ringColor}
            emissiveIntensity={0.4}
            side={THREE.DoubleSide}
            metalness={0.5}
            roughness={0.5}
          />
        </mesh>
      )}

      <Text
        position={[0, planetType.size * 2.2, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#000000"
      >
        {label}
      </Text>
      <Text
        position={[0, planetType.size * 1.8, 0]}
        fontSize={0.2}
        color="#aaaaaa"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {planetType.name}
      </Text>
    </group>
  )
}

function PlanetScene({ selectedType }: { selectedType: "both" | "confirmed" | "false-positive" }) {
  console.log("[v0] Rendering PlanetScene with selectedType:", selectedType)

  const confirmedPlanets = [
    {
      type: PLANET_TYPES.gasGiant,
      position: [-12, 0, -8] as [number, number, number],
      label: "Kepler-7b",
      typeKey: "gasGiant",
    },
    {
      type: PLANET_TYPES.hotJupiter,
      position: [-8, 1, 6] as [number, number, number],
      label: "HD 209458b",
      typeKey: "hotJupiter",
    },
    {
      type: PLANET_TYPES.superEarth,
      position: [0, -0.5, -10] as [number, number, number],
      label: "Kepler-22b",
      typeKey: "superEarth",
    },
    {
      type: PLANET_TYPES.iceGiant,
      position: [10, 0.5, 4] as [number, number, number],
      label: "HAT-P-11b",
      typeKey: "iceGiant",
    },
    {
      type: PLANET_TYPES.rockyPlanet,
      position: [12, -1, -6] as [number, number, number],
      label: "Kepler-186f",
      typeKey: "rockyPlanet",
    },
  ]

  const falsePlanets = [
    {
      type: PLANET_TYPES.binaryStar,
      position: [-6, 0, 0] as [number, number, number],
      label: "KOI-1234",
      typeKey: "binaryStar",
    },
    {
      type: PLANET_TYPES.stellarActivity,
      position: [6, 0, 8] as [number, number, number],
      label: "KOI-5678",
      typeKey: "stellarActivity",
    },
  ]

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[15, 15, 15]} intensity={3.5} color="#ffffff" castShadow />
      <pointLight position={[-10, 8, -8]} intensity={1.8} color="#4a90e2" />
      <pointLight position={[8, -5, 10]} intensity={1.4} color="#ff8c42" />

      <Stars radius={200} depth={100} count={8000} factor={6} saturation={0} fade speed={0.3} />

      {(selectedType === "both" || selectedType === "confirmed") &&
        confirmedPlanets.map((planet, i) => (
          <Planet
            key={`confirmed-${i}`}
            planetType={planet.type}
            position={planet.position}
            label={planet.label}
            seed={i * 1000}
            typeKey={planet.typeKey}
          />
        ))}

      {(selectedType === "both" || selectedType === "false-positive") &&
        falsePlanets.map((planet, i) => (
          <Planet
            key={`false-${i}`}
            planetType={planet.type}
            position={planet.position}
            label={planet.label}
            seed={i * 1000 + 5000}
            typeKey={planet.typeKey}
          />
        ))}
      <gridHelper args={[60, 60, "#4a90e2", "#0f1729"]} position={[0, -5, 0]} />

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={8}
        maxDistance={50}
        maxPolarAngle={Math.PI / 1.4}
        minPolarAngle={Math.PI / 8}
      />
    </>
  )
}

export default function Visualization3DPage() {
  const [selectedType, setSelectedType] = useState<"both" | "confirmed" | "false-positive">("both")

  console.log("[v0] Rendering Visualization3DPage")

  return (
    <div className="fixed inset-0 w-full h-screen overflow-hidden bg-slate-950">
      <div className="absolute top-0 left-0 right-0 z-10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">3D Classification Visualization</h1>
          <div className="w-24" />
        </div>
      </div>

      <div className="absolute top-24 left-6 z-10 bg-slate-900/90 backdrop-blur-md rounded-xl p-5 border border-purple-500/30 shadow-2xl">
        <h3 className="text-white font-bold mb-4 text-lg">Planet Type</h3>
        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => setSelectedType("both")}
            className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
              selectedType === "both"
                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/50"
                : "bg-slate-800/80 text-white/70 hover:text-white hover:bg-slate-700/80"
            }`}
          >
            Both Types
          </button>
          <button
            onClick={() => setSelectedType("confirmed")}
            className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
              selectedType === "confirmed"
                ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/50"
                : "bg-slate-800/80 text-white/70 hover:text-white hover:bg-slate-700/80"
            }`}
          >
            Confirmed
          </button>
          <button
            onClick={() => setSelectedType("false-positive")}
            className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
              selectedType === "false-positive"
                ? "bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg shadow-red-500/50"
                : "bg-slate-800/80 text-white/70 hover:text-white hover:bg-slate-700/80"
            }`}
          >
            False Positives
          </button>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 z-10 bg-slate-900/90 backdrop-blur-md rounded-xl p-5 border border-purple-500/30 shadow-2xl max-w-sm">
        <h3 className="text-white font-bold mb-4 text-lg">Legend</h3>
        <div className="flex flex-col gap-3 text-sm">
          <div className="space-y-2">
            <p className="text-purple-300 font-semibold">Confirmed Exoplanets:</p>
            <div className="flex items-center gap-2 pl-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-600 to-yellow-700 shadow-lg" />
              <span className="text-white/80">Gas Giants</span>
            </div>
            <div className="flex items-center gap-2 pl-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 shadow-lg" />
              <span className="text-white/80">Hot Jupiters</span>
            </div>
            <div className="flex items-center gap-2 pl-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg" />
              <span className="text-white/80">Super-Earths</span>
            </div>
            <div className="flex items-center gap-2 pl-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg" />
              <span className="text-white/80">Ice Giants</span>
            </div>
            <div className="flex items-center gap-2 pl-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-stone-600 to-amber-700 shadow-lg" />
              <span className="text-white/80">Rocky Planets</span>
            </div>
          </div>
          <div className="space-y-2 pt-2 border-t border-white/10">
            <p className="text-red-300 font-semibold">False Positives:</p>
            <div className="flex items-center gap-2 pl-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-600 to-red-700 shadow-lg" />
              <span className="text-white/80">Binary Stars</span>
            </div>
            <div className="flex items-center gap-2 pl-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 shadow-lg" />
              <span className="text-white/80">Stellar Activity</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 z-10 bg-slate-900/80 backdrop-blur-sm rounded-lg p-4 border border-purple-500/20">
        <h3 className="text-white font-semibold mb-2">Controls</h3>
        <div className="flex flex-col gap-1 text-sm text-white/60">
          <p>Left mouse: rotate</p>
          <p>Right mouse: pan</p>
          <p>Mouse wheel: zoom</p>
        </div>
      </div>

      <Canvas
        camera={{ position: [0, 6, 20], fov: 60 }}
        className="absolute inset-0 w-full h-full"
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        onCreated={() => console.log("[v0] Canvas created successfully")}
      >
        <Suspense fallback={null}>
          <PlanetScene selectedType={selectedType} />
        </Suspense>
      </Canvas>
    </div>
  )
}
