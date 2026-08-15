'use client'

import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sparkles, Float } from '@react-three/drei'

/**
 * 3D 数字知识树（Biomorphic Digital Tree）：
 * 玻璃质感树干 + 有机分枝（递归生成，不对称）+ 树内知识网络（小球/细线）
 * + 主干光流粒子 + 淡紫 Sparkles。growth 0→1 驱动枝条逐层生长。
 */

/* ── 树的结构参数 ── */
interface BranchSpec {
  origin: [number, number, number] // 起点（相对父枝末端）
  dir: [number, number, number] // 方向（单位向量近似）
  length: number
  bend: number // 弯曲量
  radius: number
  depth: number
  delay: number
  fruit?: boolean // 是否果实枝头
}

const BRANCHES: BranchSpec[] = [
  // 主干
  { origin: [0, -1.7, 0], dir: [0, 1, 0], length: 2.9, bend: 0.12, radius: 0.075, depth: 0, delay: 0.1 },
  // 一层分支
  { origin: [0, -0.45, 0], dir: [-0.55, 0.62, 0.18], length: 1.15, bend: 0.2, radius: 0.035, depth: 1, delay: 0.45 },
  { origin: [0, -0.25, 0], dir: [0.5, 0.7, -0.22], length: 1.2, bend: 0.16, radius: 0.036, depth: 1, delay: 0.6 },
  { origin: [0, 0.15, 0], dir: [-0.3, 0.78, 0.28], length: 0.9, bend: 0.1, radius: 0.028, depth: 1, delay: 0.75 },
  // 二层分支（较细）
  { origin: [-0.62, -0.12, 0.2], dir: [-0.72, 0.4, -0.3], length: 0.85, bend: 0.24, radius: 0.02, depth: 2, delay: 0.95 },
  { origin: [-0.62, -0.12, 0.2], dir: [-0.2, 0.62, 0.5], length: 0.75, bend: 0.18, radius: 0.019, depth: 2, delay: 1.1 },
  { origin: [0.6, 0.35, -0.26], dir: [0.7, 0.3, -0.15], length: 0.9, bend: 0.2, radius: 0.021, depth: 2, delay: 1.25, fruit: true },
  { origin: [0.6, 0.35, -0.26], dir: [0.15, 0.5, 0.75], length: 0.7, bend: 0.14, radius: 0.019, depth: 2, delay: 1.4 },
  { origin: [-0.27, 0.85, 0.25], dir: [-0.5, 0.32, -0.1], length: 0.62, bend: 0.1, radius: 0.016, depth: 2, delay: 1.55 },
  { origin: [-0.27, 0.85, 0.25], dir: [0.35, 0.42, 0.2], length: 0.66, bend: 0.12, radius: 0.017, depth: 2, delay: 1.7, fruit: true },
  // 顶部小枝
  { origin: [0, 1.05, 0], dir: [-0.3, 0.42, -0.12], length: 0.55, bend: 0.08, radius: 0.014, depth: 3, delay: 1.9, fruit: true },
  { origin: [0, 1.05, 0], dir: [0.35, 0.38, 0.15], length: 0.6, bend: 0.09, radius: 0.015, depth: 3, delay: 2.05, fruit: true },
]

/* 知识网络节点（树内，近看可见） */
const KNOTS: [number, number, number][] = [
  [0, -0.9, 0], [0, -0.3, 0], [0, 0.4, 0], [0, 0.9, 0],
  [-0.25, -0.55, 0.08], [0.28, -0.15, -0.1], [-0.18, 0.25, 0.12], [0.22, 0.6, -0.08],
]
const KEDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [0, 4], [4, 1], [1, 5], [5, 2], [2, 6], [6, 3], [2, 7], [7, 3],
]

/* 玻璃材质 */
function GlassMat() {
  return (
    <meshPhysicalMaterial
      color="#c9b8f7"
      transmission={0.92}
      thickness={0.7}
      roughness={0.16}
      ior={1.45}
      iridescence={0.35}
      iridescenceIOR={1.3}
      attenuationColor="#bfa7ff"
      attenuationDistance={2.5}
      transparent
      opacity={0.9}
    />
  )
}

/* 单根枝条：Tube 沿曲线，从起点向外生长（scale 0→1） */
function Branch({ spec, growth }: { spec: BranchSpec; growth: number }) {
  const meshRef = useRef<THREE.Mesh>(null)

  const { geometry, end } = useMemo(() => {
    const [ox, oy, oz] = spec.origin
    const [dx, dy, dz] = spec.dir
    const len = spec.length
    // 起点 → 弯曲中点 → 终点
    const mx = ox + dx * len * 0.45 + (dz * len * spec.bend) / 2
    const my = oy + dy * len * 0.45 + len * spec.bend * 0.3
    const mz = oz + dz * len * 0.45 - (dx * len * spec.bend) / 2
    const ex = ox + dx * len
    const ey = oy + dy * len
    const ez = oz + dz * len
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(ox, oy, oz),
      new THREE.Vector3(mx, my, mz),
      new THREE.Vector3(ex, ey, ez),
    ])
    const geo = new THREE.TubeGeometry(curve, 14, spec.radius, 8, false)
    // 平移到起点为原点（便于 scale 生长）
    geo.translate(-ox, -oy, -oz)
    return { geometry: geo, end: new THREE.Vector3(ex, ey, ez) }
  }, [spec])

  const localGrowth = Math.max(0, Math.min(1, (growth - spec.delay) / 0.45))
  const s = 0.0001 + localGrowth * (1 - 0.0001)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, s, 0.08))
      // 完全生长后可见
      meshRef.current.visible = meshRef.current.scale.x > 0.01
    }
  })

  return (
    <group position={spec.origin}>
      <mesh ref={meshRef} geometry={geometry} scale={0.0001}>
        <GlassMat />
      </mesh>
      {spec.fruit && growth > spec.delay + 0.5 && (
        <mesh position={[end.x - spec.origin[0], end.y - spec.origin[1], end.z - spec.origin[2]]}>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshBasicMaterial color="#a78bfa" transparent opacity={0.85} />
        </mesh>
      )}
    </group>
  )
}

/* 树内知识网络 */
function KnowledgeLattice({ growth }: { growth: number }) {
  const ref = useRef<THREE.Group>(null)
  const linePositions = useMemo(() => {
    const pts: number[] = []
    KEDGES.forEach(([a, b]) => {
      pts.push(...KNOTS[a], ...KNOTS[b])
    })
    return new Float32Array(pts)
  }, [])

  const visible = growth > 0.45
  const opacity = Math.min(1, Math.max(0, (growth - 0.45) / 0.3))

  return (
    <group ref={ref}>
      {visible && (
        <>
          <lineSegments>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
            </bufferGeometry>
            <lineBasicMaterial color="#a78bfa" transparent opacity={0.22 * opacity} />
          </lineSegments>
          {KNOTS.map((p, i) => (
            <mesh key={i} position={p}>
              <sphereGeometry args={[0.016, 8, 8]} />
              <meshBasicMaterial color="#8b5cf6" transparent opacity={0.5 * opacity} />
            </mesh>
          ))}
        </>
      )}
    </group>
  )
}

/* 主干光流粒子 */
function TrunkFlow({ growth }: { growth: number }) {
  const ref = useRef<THREE.Mesh>(null)
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -1.55, 0),
        new THREE.Vector3(0.08, -0.4, 0.03),
        new THREE.Vector3(-0.06, 0.5, -0.04),
        new THREE.Vector3(0, 1.15, 0),
      ]),
    [],
  )

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = (clock.elapsedTime * 0.16) % 1
    const p = curve.getPointAt(t)
    ref.current.position.copy(p)
    const mat = ref.current.material as THREE.MeshBasicMaterial
    mat.opacity = growth > 0.2 ? Math.sin(t * Math.PI) * 0.8 : 0
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.03, 10, 10]} />
      <meshBasicMaterial color="#d8ccf7" transparent opacity={0} />
    </mesh>
  )
}

/* 整树 */
function Tree({ growth }: { growth: number }) {
  const group = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (!group.current) return
    // 极缓慢的 3/4 视角摆动（呼吸感）
    group.current.rotation.y = Math.sin(clock.elapsedTime * 0.14) * 0.22 - 0.35
    group.current.rotation.x = Math.sin(clock.elapsedTime * 0.1) * 0.03
    group.current.position.y = Math.sin(clock.elapsedTime * 0.5) * 0.04
  })

  return (
    <group ref={group} rotation={[0, -0.35, 0]}>
      {BRANCHES.map((b, i) => (
        <Branch key={i} spec={b} growth={growth} />
      ))}
      <KnowledgeLattice growth={growth} />
      <TrunkFlow growth={growth} />
      {/* 地面淡影 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.78, 0]}>
        <circleGeometry args={[0.9, 32]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.08 * growth} />
      </mesh>
    </group>
  )
}

export default function KnowledgeTree({ growth }: { growth: number }) {
  return (
    <Canvas
      camera={{ position: [1.6, 0.6, 3.4], fov: 38 }}
      dpr={[1, 1.8]}
      gl={{ alpha: true, antialias: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.75} />
      <directionalLight position={[3, 5, 4]} intensity={1.4} />
      <directionalLight position={[-3, 2, -2]} intensity={0.5} color="#d8ccf7" />
      <pointLight position={[0, 1.4, 1.2]} intensity={6} color="#a78bfa" distance={5} />
      <Float speed={0.6} rotationIntensity={0.06} floatIntensity={0.08}>
        <Tree growth={growth} />
      </Float>
      <Sparkles count={26} scale={[3.4, 3.2, 1.6]} position={[0, 0.1, 0]} size={1.6} speed={0.25} color="#bfa7ff" opacity={0.5} />
    </Canvas>
  )
}
