import { useRef, useMemo, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, PresentationControls, Sparkles, Torus, Cylinder, Ring, Box } from '@react-three/drei'
import {
  Shield, Brain, Repeat, BarChart3, Wallet,
  ArrowRight, Lock, ChevronRight, Terminal,
  CheckCircle2, ArrowUpRight, Cpu, Activity, Zap
} from 'lucide-react'
import { useStore } from '../store/useStore'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import * as THREE from 'three'

// ── High-Resolution In-Memory Minted Currency Textures ──────────────────────

function createMintedCoinTexture(
  symbol: string,
  topArch: string,
  bottomArch: string,
  primaryColor: string,
  accentColor: string
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 1024
  const ctx = canvas.getContext('2d')!

  // Deep brushed titanium & emerald radial metallic gradient
  const bgGrad = ctx.createRadialGradient(512, 512, 30, 512, 512, 500)
  bgGrad.addColorStop(0, '#22352A')
  bgGrad.addColorStop(0.5, '#131E17')
  bgGrad.addColorStop(0.85, '#0B130E')
  bgGrad.addColorStop(1, '#050907')
  ctx.fillStyle = bgGrad
  ctx.beginPath()
  ctx.arc(512, 512, 500, 0, Math.PI * 2)
  ctx.fill()

  // Fine sunburst guilloche rays
  ctx.save()
  ctx.translate(512, 512)
  ctx.strokeStyle = 'rgba(112, 224, 160, 0.12)'
  ctx.lineWidth = 2.5
  for (let i = 0; i < 72; i++) {
    ctx.rotate((Math.PI * 2) / 72)
    ctx.beginPath()
    ctx.moveTo(110, 0)
    ctx.lineTo(465, 0)
    ctx.stroke()
  }
  ctx.restore()

  // Outer minted bezel border
  ctx.strokeStyle = primaryColor
  ctx.lineWidth = 16
  ctx.beginPath()
  ctx.arc(512, 512, 475, 0, Math.PI * 2)
  ctx.stroke()

  // Milled security beads
  ctx.fillStyle = accentColor
  for (let i = 0; i < 64; i++) {
    const angle = (i / 64) * Math.PI * 2
    const x = 512 + Math.cos(angle) * 448
    const y = 512 + Math.sin(angle) * 448
    ctx.beginPath()
    ctx.arc(x, y, 5, 0, Math.PI * 2)
    ctx.fill()
  }

  // Inner concentric ring
  ctx.strokeStyle = 'rgba(163, 255, 208, 0.45)'
  ctx.lineWidth = 6
  ctx.beginPath()
  ctx.arc(512, 512, 390, 0, Math.PI * 2)
  ctx.stroke()

  // Central currency medallion crest circle
  const crestGrad = ctx.createRadialGradient(512, 512, 20, 512, 512, 280)
  crestGrad.addColorStop(0, '#2B4234')
  crestGrad.addColorStop(0.8, '#142119')
  crestGrad.addColorStop(1, '#0A120E')
  ctx.fillStyle = crestGrad
  ctx.beginPath()
  ctx.arc(512, 512, 275, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = primaryColor
  ctx.lineWidth = 8
  ctx.stroke()

  // Giant Bold Embossed Currency Symbol (Rupee or Dollar)
  ctx.fillStyle = primaryColor
  ctx.font = 'bold 360px "Space Grotesk", "Inter", sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.shadowColor = primaryColor
  ctx.shadowBlur = 30
  ctx.fillText(symbol, 512, 520)
  ctx.shadowBlur = 0

  // Top Curved Inscription
  ctx.fillStyle = '#F1F5F2'
  ctx.font = 'bold 44px "Space Grotesk", sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(topArch, 512, 205)

  // Bottom Inscription
  ctx.fillStyle = accentColor
  ctx.font = 'bold 36px "JetBrains Mono", monospace'
  ctx.textAlign = 'center'
  ctx.fillText(bottomArch, 512, 835)

  const texture = new THREE.CanvasTexture(canvas)
  texture.anisotropy = 16
  return texture
}

function createBullionTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 256
  const ctx = canvas.getContext('2d')!

  const grad = ctx.createLinearGradient(0, 0, 512, 256)
  grad.addColorStop(0, '#2A3F33')
  grad.addColorStop(0.5, '#1B2920')
  grad.addColorStop(1, '#101A14')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 512, 256)

  ctx.strokeStyle = '#70E0A0'
  ctx.lineWidth = 8
  ctx.strokeRect(16, 16, 480, 224)

  ctx.fillStyle = '#70E0A0'
  ctx.font = 'bold 44px "Space Grotesk", sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('FINORA GOLD', 256, 85)

  ctx.fillStyle = '#A3FFD0'
  ctx.font = 'bold 34px "JetBrains Mono", monospace'
  ctx.fillText('999.9 PURE WEALTH', 256, 145)

  ctx.fillStyle = '#AEBBB4'
  ctx.font = '22px "JetBrains Mono", monospace'
  ctx.fillText('SAVINGS VAULT', 256, 195)

  const texture = new THREE.CanvasTexture(canvas)
  texture.anisotropy = 16
  return texture
}

// ── Tasteful Peripheral Floating Currency Badge ────────────────────────────

function FloatingCurrencyToken({
  position,
  scale = 1,
  texture,
  rimColor = '#70E0A0',
  speed = 0.3,
  rotOffset = 0,
}: {
  position: [number, number, number]
  scale?: number
  texture: THREE.CanvasTexture
  rimColor?: string
  speed?: number
  rotOffset?: number
}) {
  const ref = useRef<THREE.Group>(null!)

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed + rotOffset
    if (ref.current) {
      ref.current.rotation.y = t * 0.85
      ref.current.rotation.x = Math.sin(t * 0.65) * 0.22
      ref.current.position.y = position[1] + Math.sin(t * 1.15) * 0.16
    }
  })

  return (
    <group ref={ref} position={position} scale={scale}>
      <Cylinder args={[0.78, 0.78, 0.09, 36]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#16221A" metalness={0.96} roughness={0.16} />
      </Cylinder>
      <mesh position={[0, 0, 0.047]}>
        <circleGeometry args={[0.77, 36]} />
        <meshStandardMaterial map={texture} metalness={0.92} roughness={0.18} />
      </mesh>
      <mesh position={[0, 0, -0.047]} rotation={[0, Math.PI, 0]}>
        <circleGeometry args={[0.77, 36]} />
        <meshStandardMaterial map={texture} metalness={0.92} roughness={0.18} />
      </mesh>
      <Torus args={[0.77, 0.022, 16, 36]} position={[0, 0, 0.048]}>
        <meshStandardMaterial color={rimColor} metalness={0.98} roughness={0.1} />
      </Torus>
      <Torus args={[0.77, 0.022, 16, 36]} position={[0, 0, -0.048]}>
        <meshStandardMaterial color={rimColor} metalness={0.98} roughness={0.1} />
      </Torus>
    </group>
  )
}

function FloatingBullionBar({
  position,
  scale = 1,
  texture,
  speed = 0.3,
}: {
  position: [number, number, number]
  scale?: number
  texture: THREE.CanvasTexture
  speed?: number
}) {
  const ref = useRef<THREE.Group>(null!)

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(t * 1.3) * 0.1
      ref.current.rotation.y = Math.sin(t * 0.6) * 0.3
      ref.current.rotation.x = 0.2 + Math.cos(t * 0.5) * 0.08
    }
  })

  return (
    <group ref={ref} position={position} scale={scale}>
      <Box args={[1.5, 0.42, 0.18]}>
        <meshStandardMaterial map={texture} metalness={0.95} roughness={0.15} />
      </Box>
    </group>
  )
}

// ── 3D Master Sovereign Currency Medallion & Money Scene ─────────────────────

function SovereignMoneyCore() {
  const { width } = useThree((state) => state.viewport)
  const isDesktop = width >= 7.0
  const responsiveX = isDesktop ? Math.min(width * 0.22, 1.45) : 0
  const responsiveY = isDesktop ? 0 : 0.2
  const responsiveScale = isDesktop ? 1.05 : Math.max(0.75, Math.min(1.0, width / 6.8))

  const worldGroupRef = useRef<THREE.Group>(null!)
  const masterCoinRef = useRef<THREE.Group>(null!)
  const satelliteCoin1Ref = useRef<THREE.Group>(null!)
  const satelliteCoin2Ref = useRef<THREE.Group>(null!)
  const satelliteCoin3Ref = useRef<THREE.Group>(null!)
  const bullionRef = useRef<THREE.Group>(null!)
  const orbitRingRef = useRef<THREE.Group>(null!)

  const frontCoinTex = useMemo(() => createMintedCoinTexture('₹', 'FINORA WEALTH TRACKER', '★ PERSONAL FINANCE ★ 2026 ★', '#70E0A0', '#A3FFD0'), [])
  const backCoinTex  = useMemo(() => createMintedCoinTexture('$', 'SMART AI PROTOCOL', '★ AUTOMATED INSIGHTS ★', '#A3FFD0', '#70E0A0'), [])
  const euroCoinTex  = useMemo(() => createMintedCoinTexture('€', 'EURO CAPITAL', '★ SAVINGS RESERVE ★', '#AEBBB4', '#70E0A0'), [])
  const btcCoinTex   = useMemo(() => createMintedCoinTexture('₿', 'DIGITAL WEALTH', '★ BITCOIN PROTOCOL ★', '#70E0A0', '#A3FFD0'), [])
  const poundCoinTex = useMemo(() => createMintedCoinTexture('£', 'STERLING ASSET', '★ SECURITY VAULT ★', '#A3FFD0', '#AEBBB4'), [])
  const yenCoinTex   = useMemo(() => createMintedCoinTexture('¥', 'GLOBAL COMMERCE', '★ PACIFIC CAPITAL ★', '#70E0A0', '#A3FFD0'), [])
  const bullionTex   = useMemo(() => createBullionTexture(), [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    // Smooth scroll synchronization: lift the 3D world as user scrolls down the landing page
    const scrollY = typeof window !== 'undefined' ? (window.pageYOffset || document.documentElement.scrollTop || 0) : 0
    const maxScroll = typeof document !== 'undefined' ? Math.max(1, document.documentElement.scrollHeight - window.innerHeight) : 1
    const scrollPct = Math.min(1, Math.max(0, scrollY / maxScroll))

    if (worldGroupRef.current) {
      worldGroupRef.current.position.y = THREE.MathUtils.lerp(
        worldGroupRef.current.position.y,
        scrollPct * 20.8,
        0.08
      )
    }

    if (masterCoinRef.current) {
      masterCoinRef.current.rotation.y = t * 0.42
      masterCoinRef.current.rotation.x = Math.sin(t * 0.3) * 0.14
    }

    if (satelliteCoin1Ref.current) {
      satelliteCoin1Ref.current.position.x = Math.cos(t * 0.75) * 2.3
      satelliteCoin1Ref.current.position.z = Math.sin(t * 0.75) * 1.7
      satelliteCoin1Ref.current.position.y = Math.sin(t * 1.1) * 0.4
      satelliteCoin1Ref.current.rotation.y = t * 1.4
    }

    if (satelliteCoin2Ref.current) {
      satelliteCoin2Ref.current.position.x = Math.cos(t * 0.65 + (Math.PI * 2) / 3) * 2.2
      satelliteCoin2Ref.current.position.z = Math.sin(t * 0.65 + (Math.PI * 2) / 3) * 1.9
      satelliteCoin2Ref.current.position.y = Math.cos(t * 0.9) * 0.45
      satelliteCoin2Ref.current.rotation.y = -t * 1.3
    }

    if (satelliteCoin3Ref.current) {
      satelliteCoin3Ref.current.position.x = Math.cos(t * 0.7 + (Math.PI * 4) / 3) * 2.25
      satelliteCoin3Ref.current.position.z = Math.sin(t * 0.7 + (Math.PI * 4) / 3) * 1.6
      satelliteCoin3Ref.current.position.y = Math.sin(t * 0.85) * 0.38
      satelliteCoin3Ref.current.rotation.y = t * 1.2
    }

    if (bullionRef.current) {
      bullionRef.current.position.y = -1.68 + Math.sin(t * 1.2) * 0.05
      bullionRef.current.rotation.y = Math.sin(t * 0.5) * 0.25
      bullionRef.current.rotation.x = 0.2 + Math.cos(t * 0.4) * 0.08
    }

    if (orbitRingRef.current) {
      orbitRingRef.current.rotation.z = t * 0.3
      orbitRingRef.current.rotation.x = Math.PI / 3 + Math.sin(t * 0.2) * 0.1
    }
  })

  return (
    <group ref={worldGroupRef}>
      {/* ── SECTION 1: HERO (Y = 0) ── */}
      <group position={[responsiveX, responsiveY, 0]} scale={responsiveScale}>
        <group ref={masterCoinRef}>
          <Cylinder args={[1.52, 1.52, 0.2, 64]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#18251D" metalness={0.97} roughness={0.14} />
          </Cylinder>

          {/* Front Minted Coin Face (₹ Rupee) */}
          <mesh position={[0, 0, 0.102]}>
            <circleGeometry args={[1.51, 64]} />
            <meshStandardMaterial map={frontCoinTex} metalness={0.92} roughness={0.18} />
          </mesh>

          {/* Back Minted Coin Face ($ Dollar) */}
          <mesh position={[0, 0, -0.102]} rotation={[0, Math.PI, 0]}>
            <circleGeometry args={[1.51, 64]} />
            <meshStandardMaterial map={backCoinTex} metalness={0.92} roughness={0.18} />
          </mesh>

          {/* Front Outer Reeded Coin Rim */}
          <Torus args={[1.50, 0.045, 24, 64]} position={[0, 0, 0.104]}>
            <meshStandardMaterial color="#70E0A0" metalness={0.98} roughness={0.08} />
          </Torus>

          {/* Back Outer Reeded Coin Rim */}
          <Torus args={[1.50, 0.045, 24, 64]} position={[0, 0, -0.104]}>
            <meshStandardMaterial color="#70E0A0" metalness={0.98} roughness={0.08} />
          </Torus>

          {/* Inner Security Rings */}
          <Ring args={[1.22, 1.25, 64]} position={[0, 0, 0.105]}>
            <meshStandardMaterial color="#A3FFD0" metalness={0.95} roughness={0.12} side={THREE.DoubleSide} />
          </Ring>
          <Ring args={[1.22, 1.25, 64]} position={[0, 0, -0.105]}>
            <meshStandardMaterial color="#A3FFD0" metalness={0.95} roughness={0.12} side={THREE.DoubleSide} />
          </Ring>
        </group>

        {/* Orbiting Currency Coins ($ Dollar, ₿ Bitcoin, € Euro) */}
        <group ref={satelliteCoin1Ref}>
          <Cylinder args={[0.38, 0.38, 0.07, 32]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#1B2920" metalness={0.96} roughness={0.16} />
          </Cylinder>
          <mesh position={[0, 0, 0.038]}>
            <circleGeometry args={[0.37, 32]} />
            <meshStandardMaterial map={backCoinTex} metalness={0.9} roughness={0.2} />
          </mesh>
          <Torus args={[0.37, 0.018, 16, 32]} position={[0, 0, 0.039]}>
            <meshStandardMaterial color="#A3FFD0" metalness={0.95} roughness={0.1} />
          </Torus>
        </group>

        <group ref={satelliteCoin2Ref}>
          <Cylinder args={[0.34, 0.34, 0.06, 32]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#1B2920" metalness={0.96} roughness={0.16} />
          </Cylinder>
          <mesh position={[0, 0, 0.032]}>
            <circleGeometry args={[0.33, 32]} />
            <meshStandardMaterial map={btcCoinTex} metalness={0.9} roughness={0.2} />
          </mesh>
          <Torus args={[0.33, 0.016, 16, 32]} position={[0, 0, 0.033]}>
            <meshStandardMaterial color="#70E0A0" metalness={0.95} roughness={0.1} />
          </Torus>
        </group>

        <group ref={satelliteCoin3Ref}>
          <Cylinder args={[0.32, 0.32, 0.06, 32]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#1B2920" metalness={0.96} roughness={0.16} />
          </Cylinder>
          <mesh position={[0, 0, 0.032]}>
            <circleGeometry args={[0.31, 32]} />
            <meshStandardMaterial map={euroCoinTex} metalness={0.9} roughness={0.2} />
          </mesh>
          <Torus args={[0.31, 0.015, 16, 32]} position={[0, 0, 0.033]}>
            <meshStandardMaterial color="#AEBBB4" metalness={0.95} roughness={0.1} />
          </Torus>
        </group>

        {/* 3. Floating FINORA Bullion Ingot */}
        <group ref={bullionRef} position={[0, -1.68, 0]}>
          <Box args={[1.5, 0.42, 0.18]}>
            <meshStandardMaterial map={bullionTex} metalness={0.95} roughness={0.15} />
          </Box>
        </group>

        {/* 4. Holographic Wealth Orbit Ring */}
        <group ref={orbitRingRef}>
          <Torus args={[2.35, 0.022, 16, 80]}>
            <meshStandardMaterial
              color="#70E0A0"
              emissive="#70E0A0"
              emissiveIntensity={0.35}
              metalness={0.95}
              roughness={0.1}
            />
          </Torus>
        </group>
      </group>

      {/* ── SECTION 2: LIVE DASHBOARD PREVIEW (Y ≈ -4.6) ── */}
      <FloatingCurrencyToken
        position={[-3.8, -4.5, -0.4]}
        scale={1.15}
        texture={euroCoinTex}
        rimColor="#A3FFD0"
        speed={0.25}
        rotOffset={0.8}
      />
      <FloatingCurrencyToken
        position={[3.9, -4.8, -0.5]}
        scale={1.1}
        texture={backCoinTex}
        rimColor="#70E0A0"
        speed={0.28}
        rotOffset={2.1}
      />

      {/* ── SECTION 3: AI ASSISTANT SECTION (Y ≈ -8.8) ── */}
      <FloatingCurrencyToken
        position={[3.8, -8.8, -0.4]}
        scale={1.2}
        texture={btcCoinTex}
        rimColor="#70E0A0"
        speed={0.26}
        rotOffset={1.4}
      />
      <FloatingCurrencyToken
        position={[-3.9, -9.1, -0.5]}
        scale={1.1}
        texture={poundCoinTex}
        rimColor="#AEBBB4"
        speed={0.22}
        rotOffset={3.2}
      />

      {/* ── SECTION 4: FEATURES GRID (Y ≈ -13.0) ── */}
      <FloatingCurrencyToken
        position={[-3.8, -13.0, -0.4]}
        scale={1.15}
        texture={yenCoinTex}
        rimColor="#A3FFD0"
        speed={0.24}
        rotOffset={0.5}
      />
      <FloatingCurrencyToken
        position={[3.9, -13.3, -0.5]}
        scale={1.15}
        texture={frontCoinTex}
        rimColor="#70E0A0"
        speed={0.27}
        rotOffset={2.6}
      />

      {/* ── SECTION 5: HOW IT WORKS & SECURITY (Y ≈ -17.2) ── */}
      <FloatingBullionBar
        position={[-3.7, -17.2, -0.4]}
        scale={1.2}
        texture={bullionTex}
        speed={0.3}
      />
      <FloatingCurrencyToken
        position={[3.8, -17.4, -0.5]}
        scale={1.15}
        texture={euroCoinTex}
        rimColor="#A3FFD0"
        speed={0.23}
        rotOffset={1.7}
      />

      {/* ── SECTION 6: CALL TO ACTION & FOOTER (Y ≈ -20.6) ── */}
      <FloatingCurrencyToken
        position={[0, -20.6, -0.5]}
        scale={1.4}
        texture={frontCoinTex}
        rimColor="#70E0A0"
        speed={0.35}
        rotOffset={0.0}
      />

      {/* ── Multi-Depth Sparkles Along Full Scroll Height ── */}
      <Sparkles count={130} scale={[14, 28, 8]} size={2.2} speed={0.35} color="#70E0A0" opacity={0.8} />
      <Sparkles count={90} scale={[14, 28, 8]} size={1.8} speed={0.25} color="#A3FFD0" opacity={0.65} />
      <Sparkles count={60} scale={[12, 28, 6]} size={1.5} speed={0.2} color="#F1F5F2" opacity={0.5} />
    </group>
  )
}

function SceneCanvas() {
  return (
    <div className="w-full h-full">
      <Suspense fallback={
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-48 h-48 rounded-full border border-[#1F2E25] bg-[#131D17] animate-pulse" />
        </div>
      }>
        <Canvas
          camera={{ position: [0, 0, 6.2], fov: 45 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          className="w-full h-full touch-pan-y"
        >
          <ambientLight intensity={0.9} color="#0D1410" />
          <directionalLight position={[6, 9, 6]} intensity={2.6} color="#FFFFFF" />
          <pointLight position={[-8, -5, -3]} intensity={2.8} color="#70E0A0" />
          <pointLight position={[7, -4, 4]} intensity={2.2} color="#A3FFD0" />
          <pointLight position={[0, 6, -5]} intensity={1.5} color="#AEBBB4" />
          
          <PresentationControls
            global
            snap
            speed={1.8}
            zoom={1}
            rotation={[0, 0, 0]}
            polar={[-0.45, 0.45]}
            azimuth={[-0.8, 0.8]}
          >
            <Float speed={1.8} rotationIntensity={0.3} floatIntensity={0.6}>
              <SovereignMoneyCore />
            </Float>
          </PresentationControls>
        </Canvas>
      </Suspense>
    </div>
  )
}

// ── Friendly, Clear Feature Matrix Data ──────────────────────────────────────

const FEATURES = [
  {
    icon: Brain,
    title: 'Smart AI Finance Assistant',
    desc: 'Ask questions in plain English like "Where did I spend the most?" and get clear, instant answers backed by your actual numbers.',
    tag: 'Plain-English AI',
    color: 'text-[#70E0A0]',
  },
  {
    icon: Repeat,
    title: 'Subscription Radar',
    desc: 'Automatically track Netflix, Spotify, AWS, and software seats. Receive proactive renewal alerts before charges hit your card.',
    tag: 'Save On Subscriptions',
    color: 'text-[#A3FFD0]',
  },
  {
    icon: Wallet,
    title: 'Visual Spending Budgets',
    desc: 'Set simple monthly spending limits for dining, shopping, and travel. Visual progress bars show you exactly how much is left.',
    tag: 'Overspend Prevention',
    color: 'text-[#70E0A0]',
  },
  {
    icon: BarChart3,
    title: 'Interactive Cashflow Charts',
    desc: 'Understand your monthly money flow at a glance with beautiful, interactive income vs expense bar charts and category breakdowns.',
    tag: 'Clear Visuals',
    color: 'text-[#A3FFD0]',
  },
  {
    icon: Shield,
    title: '100% Private & Safe',
    desc: 'All your financial data stays stored safely on your device. We never move funds, touch your bank accounts, or sell your data.',
    tag: 'Private & Secure',
    color: 'text-[#70E0A0]',
  },
  {
    icon: Cpu,
    title: 'One-Click CSV Export',
    desc: 'Easily export your complete transaction history to Excel or Google Sheets whenever you need records for taxes or accounting.',
    tag: 'Instant Export',
    color: 'text-[#A3FFD0]',
  },
]

const MCP_TOOLS_PREVIEW = [
  { name: 'finora_mcp.get_monthly_spending', status: 'ACTIVE', desc: 'Calculates your total income, expenses, and net savings for the month' },
  { name: 'finora_mcp.get_subscription_list', status: 'ACTIVE', desc: 'Finds all your active recurring subscriptions and monthly costs' },
  { name: 'finora_mcp.get_upcoming_payments', status: 'ACTIVE', desc: 'Scans for any bills or subscription renewals coming up in the next 14 days' },
  { name: 'finora_mcp.analyse_spending', status: 'ACTIVE', desc: 'Groups your spending by category so you see exactly where money goes' },
  { name: 'finora_mcp.compare_monthly_expenses', status: 'ACTIVE', desc: 'Compares this month with previous months to highlight trends' },
]

export default function LandingPage() {
  const { isAuthenticated, login } = useStore()

  const handleLaunchDemo = () => {
    login('Aryan Patel', 'aryan@finora.io')
  }

  return (
    <div className="min-h-screen bg-[#070B09] text-[#F1F5F2] overflow-x-hidden selection:bg-[#70E0A0]/20 selection:text-[#A3FFD0] future-grid relative">
      {/* ── Fixed Global 3D Background Canvas (Spans Entire Landing Page) ── */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-auto">
        <SceneCanvas />
      </div>

      {/* ── Page Content Container (Z-10 over the 3D Canvas) ────────────────── */}
      <div className="relative z-10 pointer-events-none">
        {/* ── Navigation ──────────────────────────────────────────────────────── */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#070B09]/80 backdrop-blur-md border-b border-[#1F2E25]/80 pointer-events-auto">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#1B2920] border border-[#2A3F33] flex items-center justify-center shadow-[0_0_12px_rgba(112,224,160,0.15)]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#70E0A0] shadow-[0_0_10px_#70E0A0] animate-pulse" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-sm font-heading tracking-widest text-[#F1F5F2] uppercase">FINORA</span>
                <span className="text-[10px] text-[#89978F] font-mono hidden sm:inline">Smart Finance Tracker</span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-6 text-xs text-[#89978F] font-medium">
              <a href="#features" className="hover:text-[#F1F5F2] transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-[#F1F5F2] transition-colors">How It Works</a>
              <a href="#ai-assistant" className="hover:text-[#F1F5F2] transition-colors">AI Assistant</a>
              <a href="#security" className="hover:text-[#F1F5F2] transition-colors">Security</a>
            </div>

            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button size="sm">Go to Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm">Sign In</Button>
                  </Link>
                  <Link to="/dashboard" onClick={handleLaunchDemo}>
                    <Button size="sm">Open Dashboard</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* ── Hero Section ───────────────────────────────────────────────────── */}
        <section className="relative min-h-[92vh] flex items-center pt-24 pb-16 px-6 border-b border-[#1F2E25]/50 overflow-hidden pointer-events-none">
          {/* Subtle gradient vignette on the left to ensure crystal-clear text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#070B09]/95 via-[#070B09]/65 to-transparent pointer-events-none lg:w-3/5" />
          {/* Subtle bottom fade into next section */}
          <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#070B09] to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-12 items-center pointer-events-none">
          
          {/* Left Hero Column: Text & Buttons */}
          <div className="lg:col-span-7 space-y-6 pointer-events-auto">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#131D17]/90 backdrop-blur-sm border border-[#1F2E25] mb-4">
                <span className="w-2 h-2 rounded-full bg-[#70E0A0] animate-pulse shadow-[0_0_8px_#70E0A0]" />
                <span className="text-xs text-[#A3FFD0] font-mono tracking-wide">✨ SMART PERSONAL FINANCE & SUBSCRIPTION TRACKER</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-extrabold text-[#F1F5F2] font-heading leading-[1.08] tracking-tight">
                MASTER YOUR MONEY.<br />
                <span className="gradient-emerald-hologram">TRACK, SAVE & GROW</span><br />
                EFFORTLESSLY.
              </h1>

              <p className="text-base sm:text-lg text-[#89978F] max-w-xl font-normal leading-relaxed pt-2">
                The modern personal finance dashboard that helps you understand where your money goes, cancel unused subscriptions, and hit your savings goals with smart AI assistance.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link to="/dashboard" onClick={handleLaunchDemo}>
                  <Button size="lg" className="shadow-[0_0_24px_rgba(112,224,160,0.3)]">
                    Open Free Dashboard <ArrowRight size={16} />
                  </Button>
                </Link>
                <a href="#interactive-preview">
                  <Button size="lg" variant="hologram">
                    Explore Features <ChevronRight size={16} />
                  </Button>
                </a>
              </div>

              {/* Trust Metric Strip */}
              <div className="grid grid-cols-3 gap-6 pt-10 border-t border-[#1F2E25]/80">
                <div>
                  <p className="text-2xl font-bold text-[#F1F5F2] font-heading tabular-nums">₹24.5 Lakh</p>
                  <p className="text-[11px] text-[#89978F] uppercase font-mono tracking-wider mt-0.5">Total Tracked</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#70E0A0] font-heading tabular-nums">7 Smart Tools</p>
                  <p className="text-[11px] text-[#89978F] uppercase font-mono tracking-wider mt-0.5">Built-in AI</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#A3FFD0] font-heading tabular-nums">100% Private</p>
                  <p className="text-[11px] text-[#89978F] uppercase font-mono tracking-wider mt-0.5">Browser Only</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Hero Column: Spatial Floating Telemetry Cards */}
          <div className="lg:col-span-5 relative flex flex-col items-end justify-between min-h-[380px] pointer-events-none">
            {/* Interactive Telemetry Card 1: Top Right */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="pointer-events-auto bg-[#131D17]/85 backdrop-blur-md border border-[#1F2E25] p-3.5 rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.6)] mb-6 sm:mb-14"
            >
              <div className="flex items-center gap-2 mb-1">
                <Activity size={14} className="text-[#70E0A0]" />
                <span className="text-[10px] text-[#89978F] uppercase font-mono">Saved This Month</span>
              </div>
              <p className="text-base font-bold text-[#70E0A0] font-heading tabular-nums">+₹75,495</p>
              <p className="text-[10px] text-[#89978F] mt-0.5 font-mono">75.5% of income retained</p>
            </motion.div>

            {/* Interactive Telemetry Card 2: Bottom Right */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="pointer-events-auto bg-[#131D17]/85 backdrop-blur-md border border-[#1F2E25] p-3.5 rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.6)] mb-4"
            >
              <div className="flex items-center gap-2 mb-1">
                <Zap size={14} className="text-[#A3FFD0]" />
                <span className="text-[10px] text-[#89978F] uppercase font-mono">Active Subscriptions</span>
              </div>
              <p className="text-base font-bold text-[#F1F5F2] font-heading tabular-nums">₹2,406 / mo</p>
              <p className="text-[10px] text-[#70E0A0] mt-0.5 font-mono">8 Tracked • 0 Overcharges</p>
            </motion.div>

            {/* Drag/Orbit helper pill */}
            <div className="pointer-events-auto text-[9px] text-[#89978F] font-mono tracking-wider flex items-center gap-1.5 bg-[#070B09]/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-[#1F2E25] shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-[#70E0A0] animate-ping" />
              DRAG ANYWHERE TO ROTATE 3D COIN
            </div>
          </div>
        </div>
      </section>

      {/* ── Interactive Live Dashboard Preview Section ─────────────────────── */}
      <section id="interactive-preview" className="py-24 px-6 border-b border-[#1F2E25]/30 bg-transparent pointer-events-auto">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-xs text-[#70E0A0] uppercase font-mono tracking-widest mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#70E0A0]" />
                Simple & Beautiful Interface
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#F1F5F2] font-heading tracking-tight">
                Everything you need in one clean dashboard.
              </h2>
            </div>
            
            <div className="flex bg-[#131D17] border border-[#1F2E25] p-1 rounded-xl text-xs font-mono">
              <button
                className="px-4 py-1.5 rounded-lg font-medium transition-all cursor-pointer bg-[#1B2920] text-[#F1F5F2] border border-[#2A3F33]"
              >
                Live Preview
              </button>
            </div>
          </div>

          {/* Embedded Device Window Frame */}
          <div className="bg-[#131D17] border border-[#1F2E25] rounded-3xl p-4 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden relative">
            <div className="flex items-center justify-between pb-5 mb-6 border-b border-[#1F2E25]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#D98989]/60" />
                <span className="w-3 h-3 rounded-full bg-[#D4A373]/60" />
                <span className="w-3 h-3 rounded-full bg-[#70E0A0]/60" />
                <span className="text-xs text-[#89978F] font-mono ml-3">finora.app // personal-dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="hologram">LIVE DEMO</Badge>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-[#1B2920] border border-[#2A3F33]">
                  <p className="text-[10px] text-[#89978F] uppercase font-mono">Total Net Worth</p>
                  <p className="text-xl font-bold text-[#F1F5F2] font-heading tabular-nums mt-1">₹24,50,000</p>
                  <p className="text-[11px] text-[#70E0A0] mt-1 font-mono">↑ 12.4% this year</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#1B2920] border border-[#2A3F33]">
                  <p className="text-[10px] text-[#89978F] uppercase font-mono">Monthly Income</p>
                  <p className="text-xl font-bold text-[#70E0A0] font-heading tabular-nums mt-1">₹1,00,000</p>
                  <p className="text-[11px] text-[#89978F] mt-1 font-mono">2 Income streams</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#1B2920] border border-[#2A3F33]">
                  <p className="text-[10px] text-[#89978F] uppercase font-mono">Monthly Expenses</p>
                  <p className="text-xl font-bold text-[#D98989] font-heading tabular-nums mt-1">₹24,505</p>
                  <p className="text-[11px] text-[#D98989] mt-1 font-mono">↓ 5.2% less than last month</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#1B2920] border border-[#2A3F33]">
                  <p className="text-[10px] text-[#89978F] uppercase font-mono">Money Saved</p>
                  <p className="text-xl font-bold text-[#F1F5F2] font-heading tabular-nums mt-1">₹75,495</p>
                  <p className="text-[11px] text-[#70E0A0] mt-1 font-mono">Ready to invest</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-[#0D1410] rounded-2xl p-5 border border-[#1F2E25] space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#1F2E25]">
                    <span className="text-xs font-bold text-[#F1F5F2] font-heading">Recent Transactions</span>
                    <span className="text-[11px] text-[#70E0A0] font-mono">Live Sync</span>
                  </div>
                  {[
                    { title: 'Salary & Client Retainer', cat: 'Income', amt: '+₹85,000', pos: true },
                    { title: 'Weekend Travel & Flight', cat: 'Travel', amt: '-₹5,500', pos: false },
                    { title: 'Cloud Storage 2TB', cat: 'Software', amt: '-₹130', pos: false },
                  ].map(tx => (
                    <div key={tx.title} className="flex items-center justify-between py-2 border-b border-[#1F2E25] last:border-0 text-xs">
                      <div>
                        <p className="font-medium text-[#F1F5F2]">{tx.title}</p>
                        <p className="text-[10px] text-[#89978F] font-mono">{tx.cat}</p>
                      </div>
                      <span className={`font-bold font-heading tabular-nums ${tx.pos ? 'text-[#70E0A0]' : 'text-[#F1F5F2]'}`}>{tx.amt}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-[#0D1410] rounded-2xl p-5 border border-[#1F2E25] space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#1F2E25]">
                    <span className="text-xs font-bold text-[#F1F5F2] font-heading">Active Subscriptions</span>
                    <span className="text-[11px] text-[#89978F] font-mono">8 Tracked</span>
                  </div>
                  {[
                    { name: 'Netflix Premium 4K', logo: '🎬', amt: '₹649 / mo', due: 'in 4 days' },
                    { name: 'Spotify Master Hi-Fi', logo: '🎵', amt: '₹119 / mo', due: 'in 5 days' },
                    { name: 'OpenAI ChatGPT Plus', logo: '🤖', amt: '₹1,999 / mo', due: 'in 11 days' },
                  ].map(s => (
                    <div key={s.name} className="flex items-center justify-between py-2 border-b border-[#1F2E25] last:border-0 text-xs">
                      <div className="flex items-center gap-2.5">
                        <span>{s.logo}</span>
                        <div>
                          <p className="font-medium text-[#F1F5F2]">{s.name}</p>
                          <p className="text-[10px] text-[#89978F] font-mono">{s.due}</p>
                        </div>
                      </div>
                      <span className="font-bold text-[#F1F5F2] font-heading tabular-nums">{s.amt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Built-in AI Assistant Section ──────────────────────────────────── */}
      <section id="ai-assistant" className="py-24 px-6 border-b border-[#1F2E25]/30 bg-transparent pointer-events-auto">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-xs text-[#70E0A0] uppercase font-mono tracking-widest mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#70E0A0] animate-ping" />
                Smart AI Finance Helper
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#F1F5F2] font-heading tracking-tight">
                Ask questions in plain English. Get instant answers.
              </h2>
              <p className="text-sm text-[#89978F] max-w-xl mt-2 font-normal leading-relaxed">
                FINORA connects directly to your local expenses and subscriptions so you can ask real questions and get clear, honest insights without doing manual math.
              </p>
            </div>
            <Link to="/ai">
              <Button size="sm" variant="hologram">
                Try AI Assistant <ArrowRight size={14} />
              </Button>
            </Link>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#1F2E25] text-xs font-mono text-[#89978F]">
                <span>Automated Financial Tools</span>
                <span className="text-[#70E0A0]">READY TO QUERY</span>
              </div>
              {MCP_TOOLS_PREVIEW.map(tool => (
                <div key={tool.name} className="p-3.5 rounded-2xl bg-[#131D17] border border-[#1F2E25] hover:border-[#2A3F33] transition-all">
                  <div className="flex items-center justify-between font-mono text-xs mb-1">
                    <span className="text-[#70E0A0] font-bold">{tool.name.replace('finora_mcp.', '')}</span>
                    <span className="text-[#89978F] text-[10px]">{tool.status}</span>
                  </div>
                  <p className="text-xs text-[#89978F] font-sans leading-relaxed">{tool.desc}</p>
                </div>
              ))}
            </div>

            <div className="lg:col-span-5 space-y-4">
              <Card elevated className="space-y-4 border-[#2A3F33]">
                <div className="flex items-center gap-2 pb-3 border-b border-[#1F2E25]">
                  <Terminal size={16} className="text-[#70E0A0]" />
                  <h3 className="text-xs font-bold text-[#F1F5F2] font-heading uppercase tracking-wider">Example Questions You Can Ask</h3>
                </div>
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 bg-[#070B09] rounded-xl border border-[#1F2E25] space-y-1">
                    <p className="text-[#89978F]">// Question 1</p>
                    <p className="text-[#F1F5F2]">"Where is most of my money going this month?"</p>
                    <p className="text-[#70E0A0]">"Your highest category is Software & Cloud (₹1,21,800), followed by Housing."</p>
                  </div>
                  <div className="p-3 bg-[#070B09] rounded-xl border border-[#1F2E25] space-y-1">
                    <p className="text-[#89978F]">// Question 2</p>
                    <p className="text-[#F1F5F2]">"Which subscriptions renew this week?"</p>
                    <p className="text-[#A3FFD0]">"Bloomberg Terminal renews in 4 days (₹45,000) and AWS Cloud in 5 days."</p>
                  </div>
                  <div className="p-3 bg-[#070B09] rounded-xl border border-[#1F2E25] space-y-1">
                    <p className="text-[#89978F]">// Question 3</p>
                    <p className="text-[#F1F5F2]">"How much am I saving this month?"</p>
                    <p className="text-[#70E0A0]">"You have earned ₹8,45,000 and spent ₹2,98,700, retaining ₹5,46,300 (65%)."</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Grid ─────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-6 border-b border-[#1F2E25]/30 bg-transparent pointer-events-auto">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <p className="text-xs text-[#70E0A0] uppercase font-mono tracking-widest">Built For Everyday Clarity</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#F1F5F2] font-heading tracking-tight">
              Features that make managing money simple and stress-free.
            </h2>
            <p className="text-sm text-[#89978F] font-normal leading-relaxed">
              No complicated spreadsheets. No hidden fees. Just clean insights and total peace of mind.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <Card key={f.title} hover spatial className="h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="p-2.5 rounded-xl bg-[#1B2920] border border-[#2A3F33] text-[#70E0A0]">
                      <f.icon size={20} className={f.color} />
                    </div>
                    <span className="text-[10px] font-mono text-[#A3FFD0] px-2.5 py-0.5 rounded-full bg-[#1B2920] border border-[#2A3F33]">
                      {f.tag}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#F1F5F2] font-heading mb-2">{f.title}</h3>
                  <p className="text-xs text-[#89978F] leading-relaxed font-normal">{f.desc}</p>
                </div>
                <div className="pt-6 mt-6 border-t border-[#1F2E25] flex items-center justify-between text-xs text-[#70E0A0] font-mono">
                  <span>Included Free</span>
                  <ArrowUpRight size={14} />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works Section ───────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-6 border-b border-[#1F2E25]/30 bg-transparent pointer-events-auto">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <p className="text-xs text-[#70E0A0] uppercase font-mono tracking-widest">How It Works</p>
            <h2 className="text-3xl font-bold text-[#F1F5F2] font-heading">
              Three simple steps to take charge of your finances.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Open Your Free Dashboard',
                desc: 'Get started immediately. Explore pre-loaded sample data or add your own income and expenses in seconds.',
              },
              {
                step: '02',
                title: 'Track Expenses & Subscriptions',
                desc: 'Log your daily spending and subscriptions. FINORA alerts you before bills renew so you can cancel unused services.',
              },
              {
                step: '03',
                title: 'Grow Your Monthly Savings',
                desc: 'Ask FINORA AI questions about your money, keep spending below budget limits, and watch your savings grow month by month.',
              },
            ].map(s => (
              <div key={s.step} className="bg-[#131D17] border border-[#1F2E25] rounded-2xl p-6 space-y-4 spatial-panel">
                <span className="text-2xl font-bold text-[#70E0A0] font-heading block">{s.step}</span>
                <h3 className="text-base font-bold text-[#F1F5F2] font-heading">{s.title}</h3>
                <p className="text-xs text-[#89978F] leading-relaxed font-normal">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Security & Privacy Section ─────────────────────────────────────── */}
      <section id="security" className="py-24 px-6 border-b border-[#1F2E25]/30 bg-transparent pointer-events-auto">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <p className="text-xs text-[#70E0A0] uppercase font-mono tracking-widest">Privacy Guarantees</p>
            <h2 className="text-3xl font-bold text-[#F1F5F2] font-heading">
              Your financial data stays 100% private.
            </h2>
          </div>

          <Card elevated className="p-8 border-[#2A3F33] space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { title: 'Stored Strictly on Your Device', desc: 'All transactions, subscriptions, and budgets remain in your own browser storage. Nothing is shared with third parties.' },
                { title: 'Zero Bank Credentials Needed', desc: 'FINORA does not connect to bank APIs or require your bank login. You are always in complete control.' },
                { title: 'Transparent AI Reasoning', desc: 'Every calculation made by the AI helper is shown clearly with zero hidden assumptions or black boxes.' },
                { title: 'Free to Export Anytime', desc: 'Export your data to CSV format with a single click whenever you need your records for taxes or spreadsheets.' },
              ].map(sec => (
                <div key={sec.title} className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-[#70E0A0] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-[#F1F5F2] font-heading">{sec.title}</h4>
                    <p className="text-[11px] text-[#89978F] mt-1 leading-relaxed">{sec.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* ── Call to Action ─────────────────────────────────────────────────── */}
      <section className="py-28 px-6 relative overflow-hidden bg-transparent pointer-events-auto">
        <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-[#F1F5F2] font-heading tracking-tight">
            Ready to take complete control of your money?
          </h2>
          <p className="text-sm text-[#89978F] max-w-lg mx-auto font-normal leading-relaxed">
            Join thousands of users tracking their money with clarity and confidence. 100% free to explore.
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <Link to="/dashboard" onClick={handleLaunchDemo}>
              <Button size="lg" className="shadow-[0_0_24px_rgba(112,224,160,0.3)]">
                Open Free Dashboard <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="py-10 px-6 border-t border-[#1F2E25]/80 bg-[#070B09]/90 backdrop-blur-md pointer-events-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#89978F]">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#70E0A0]" />
            <span className="font-bold text-[#F1F5F2] font-heading tracking-widest uppercase">FINORA</span>
            <span>— Smart Personal Finance & Subscription Tracker</span>
          </div>
          <div className="flex items-center gap-6 font-mono text-[11px]">
            <span>Model Context Protocol Enabled</span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-[#70E0A0]">
              <Lock size={12} /> 100% Private Client Storage
            </span>
          </div>
        </div>
      </footer>
      </div>
    </div>
  )
}
