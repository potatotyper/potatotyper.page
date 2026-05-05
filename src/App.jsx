import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import {
  Briefcase,
  Code,
  ExternalLink,
  GraduationCap,
  Home as HomeIcon,
  Mail,
  Map,
  Network,
  Package,
  Wrench,
} from 'lucide-react'
import {
  BrowserRouter,
  Link,
  NavLink,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom'
import './App.css'

const PANORAMA_IMAGE = '/assets/pano.jpg'

const profileLinks = [
  {
    label: 'Modrinth',
    href: 'https://modrinth.com/user/potatotyper',
    icon: Package,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/potatotyper',
    icon: Code,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/james-johnson-tjhin/',
    icon: Network,
  },
]

const contactLinks = [
  {
    label: 'Email',
    value: 'jamesj.tjhin@gmail.com',
    href: 'mailto:jamesj.tjhin@gmail.com',
    icon: Mail,
  },
  {
    label: 'LinkedIn',
    value: 'james-johnson-tjhin',
    href: 'https://www.linkedin.com/in/james-johnson-tjhin/',
    icon: Network,
  },
  {
    label: 'GitHub',
    value: 'potatotyper',
    href: 'https://github.com/potatotyper',
    icon: Code,
  },
]

const workRecaps = [
  {
    title: 'SAP',
    subtitle: 'Data Visualization Container Team',
    dates: 'Sep 2025 - Present',
    icon: Briefcase,
    summary:
      'Working on loading and caching in enterprise analytics. Cut load times up to 42%, improved deletion workflows up to 58%, and fixed SQL leaks across 60% of team-owned workflows.',
    tags: ['JavaScript', 'React', 'Redux', 'Node.js', 'SQL', 'Dynatrace'],
  },
  {
    title: 'UBC',
    subtitle: 'Lead TA for CPSC 213',
    dates: 'Jan 2025 - Present',
    icon: GraduationCap,
    summary:
      'Teaching low-level programming to 400+ students, covering C, assembly, and multithreading. I also build grading and misconduct-detection automation in Bash and Python.',
    tags: ['C', 'Assembly', 'Python', 'Docker', 'Bash', 'Teaching'],
  },
  {
    title: 'Vidio',
    subtitle: 'Discovery Page Team',
    dates: 'May 2024 - Aug 2024',
    icon: Code,
    summary:
      'Built tooling that connected Figma localization to Rails i18n, saving 2+ hours weekly, plus a GCP media upload tool that saved another 3+ hours weekly.',
    tags: ['Ruby on Rails', 'GCP', 'Figma', 'RSpec', 'Selenium'],
  },
]

const projectItems = [
  {
    name: 'Generative Cache for LLM',
    stack: 'C++, gRPC, CMake, Python',
    href: 'https://github.com/potatotyper',
    bullets: [
      'Reduced LLM API latency by 34% with a C++ cache based on NeurIPS 2025 research from Microsoft Research.',
      'Reached 83-98% cache hit rates by matching prompts through cosine similarity on sentence-transformer embeddings.',
      'Architected a 3-tier LRU cache with gRPC that synthesizes Python programs from prompt clusters to skip LLM calls.',
    ],
  },
  {
    name: 'Threadpool with Visualizer',
    stack: 'C++, CMake, React, TypeScript, D3',
    href: 'https://github.com/potatotyper',
    bullets: [
      'Implemented a C++ threadpool with submit()/shutdown() APIs, std::future results, and timestamped JSON lifecycle tracing.',
      'Visualized task and worker activity as thread swimlanes in React and D3.',
      'Built a mutex-protected FIFO queue with condition variable wait/signal and an atomic flag spinlock.',
    ],
  },
  {
    name: 'Personal Marketplace',
    stack: 'Ruby on Rails, WebSockets, Redis',
    href: 'https://github.com/potatotyper',
    bullets: [
      'Built a marketplace with OAuth and JWT authentication, real-time WebSocket chat, ActiveRecord data management, and Redis caching.',
    ],
  },
]

const minecraftMods = [
  {
    name: 'Minecraft Street View',
    href: 'https://github.com/potatotyper/Minecraft-Street-View',
    detail: 'Maps and Street View, but for Minecraft. In progress.',
  },
  {
    name: 'Minecraft Mods Collection',
    href: 'https://github.com/potatotyper/minecraft-mods',
    detail:
      'Server-side Fabric mods for shared waypoints, dimension-based Elytra restrictions, and automated server actions.',
  },
]

const skillGroups = [
  {
    label: 'Languages',
    items: ['C/C++', 'JavaScript', 'Ruby', 'Python', 'Java', 'SQL', 'HTML', 'CSS'],
  },
  {
    label: 'Frameworks',
    items: ['TypeScript', 'React', 'Node.js', 'Flask', 'Rails', 'Selenium', 'JUnit', 'Jest', 'Jasmine'],
  },
  {
    label: 'Developer Tools',
    items: ['Git', 'Docker', 'Google Cloud Platform', 'Claude Code', 'Figma', 'AWS', 'GCP', 'Redis', 'gRPC'],
  },
]

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

function PanoramaIntro({ onEnterHome }) {
  const mountRef = useRef(null)
  const labelRef = useRef(null)
  const didDragRef = useRef(false)
  const [isReady, setIsReady] = useState(false)

  const handleLabelClick = (event) => {
    if (didDragRef.current) {
      event.preventDefault()
      event.stopPropagation()
      didDragRef.current = false
      return
    }

    onEnterHome()
  }

  useEffect(() => {
    const mount = mountRef.current
    const label = labelRef.current

    if (!mount || !label) {
      return undefined
    }

    let frameId = 0
    let disposed = false
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true,
    })
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.domElement.className = 'panorama-canvas'
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(70, 1, 0.1, 1100)
    camera.rotation.order = 'YXZ'

    const sphereGeometry = new THREE.SphereGeometry(500, 96, 48)
    sphereGeometry.scale(-1, 1, 1)
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
    })
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    scene.add(sphere)

    const pointer = {
      id: null,
      isDragging: false,
      hasMoved: false,
      startX: 0,
      startY: 0,
      lastX: 0,
      lastY: 0,
    }
    const cameraState = {
      yaw: Math.PI / 2,
      pitch: -0.035,
      fov: 70,
    }
    const pitchLimit = Math.PI / 2 - 0.08
    const labelPosition = new THREE.Vector3(-95, 4.6, 0)
    const projectedLabel = new THREE.Vector3()
    const cameraDirection = new THREE.Vector3()
    const labelDirection = new THREE.Vector3()

    const resize = () => {
      const width = Math.max(1, mount.clientWidth)
      const height = Math.max(1, mount.clientHeight)

      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    const updateCamera = () => {
      camera.rotation.x = cameraState.pitch
      camera.rotation.y = cameraState.yaw
      camera.fov = cameraState.fov
      camera.updateProjectionMatrix()
    }

    const updateLabel = () => {
      const width = mount.clientWidth
      const height = mount.clientHeight

      camera.getWorldDirection(cameraDirection)
      labelDirection.copy(labelPosition).normalize()
      const isFacingLabel = cameraDirection.dot(labelDirection) > 0.2

      projectedLabel.copy(labelPosition).project(camera)
      const isInFrustum =
        projectedLabel.z > -1 &&
        projectedLabel.z < 1 &&
        projectedLabel.x > -1.25 &&
        projectedLabel.x < 1.25 &&
        projectedLabel.y > -1.25 &&
        projectedLabel.y < 1.25

      if (!isFacingLabel || !isInFrustum) {
        label.style.visibility = 'hidden'
        label.style.pointerEvents = 'none'
        return
      }

      const x = (projectedLabel.x * 0.5 + 0.5) * width
      const y = (-projectedLabel.y * 0.5 + 0.5) * height
      const focusAmount = clamp((cameraDirection.dot(labelDirection) - 0.2) / 0.8, 0, 1)
      const scale = 0.88 + focusAmount * 0.12

      label.style.visibility = 'visible'
      label.style.pointerEvents = 'auto'
      label.style.opacity = String(0.28 + focusAmount * 0.72)
      label.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`
    }

    const render = () => {
      updateCamera()
      updateLabel()
      renderer.render(scene, camera)
      frameId = window.requestAnimationFrame(render)
    }

    const onPointerDown = (event) => {
      pointer.id = event.pointerId
      pointer.isDragging = true
      pointer.hasMoved = false
      pointer.startX = event.clientX
      pointer.startY = event.clientY
      pointer.lastX = event.clientX
      pointer.lastY = event.clientY
      didDragRef.current = false
      event.currentTarget.setPointerCapture?.(event.pointerId)
    }

    const onPointerMove = (event) => {
      if (!pointer.isDragging || event.pointerId !== pointer.id) return

      const deltaX = event.clientX - pointer.lastX
      const deltaY = event.clientY - pointer.lastY
      pointer.lastX = event.clientX
      pointer.lastY = event.clientY

      if (
        Math.hypot(event.clientX - pointer.startX, event.clientY - pointer.startY) > 4
      ) {
        pointer.hasMoved = true
        didDragRef.current = true
      }

      cameraState.yaw -= deltaX * 0.004
      cameraState.pitch = clamp(
        cameraState.pitch - deltaY * 0.004,
        -pitchLimit,
        pitchLimit,
      )
    }

    const stopDragging = (event) => {
      if (event.pointerId !== pointer.id) return

      pointer.id = null
      pointer.isDragging = false
      didDragRef.current = pointer.hasMoved

      if (pointer.hasMoved) {
        window.setTimeout(() => {
          didDragRef.current = false
        }, 0)
      }
    }

    const onWheel = (event) => {
      event.preventDefault()
      cameraState.fov = clamp(cameraState.fov + event.deltaY * 0.035, 46, 86)
    }

    const onKeyDown = (event) => {
      const turnStep = prefersReducedMotion ? 0.08 : 0.12

      if (event.key === 'ArrowLeft') {
        cameraState.yaw += turnStep
      } else if (event.key === 'ArrowRight') {
        cameraState.yaw -= turnStep
      } else if (event.key === 'ArrowUp') {
        cameraState.pitch = clamp(cameraState.pitch + turnStep, -pitchLimit, pitchLimit)
      } else if (event.key === 'ArrowDown') {
        cameraState.pitch = clamp(cameraState.pitch - turnStep, -pitchLimit, pitchLimit)
      } else if (event.key === 'Home') {
        cameraState.yaw = Math.PI / 2
        cameraState.pitch = -0.035
        cameraState.fov = 70
      } else {
        return
      }

      event.preventDefault()
    }

    const textureLoader = new THREE.TextureLoader()
    textureLoader.load(
      PANORAMA_IMAGE,
      (texture) => {
        if (disposed) {
          texture.dispose()
          return
        }

        texture.colorSpace = THREE.SRGBColorSpace
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
        sphereMaterial.map?.dispose()
        sphereMaterial.map = texture
        sphereMaterial.needsUpdate = true
        setIsReady(true)
      },
      undefined,
      (error) => {
        console.error(`Unable to load panorama image at ${PANORAMA_IMAGE}`, error)
        setIsReady(true)
      },
    )

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(mount)
    resize()
    render()

    renderer.domElement.addEventListener('pointerdown', onPointerDown)
    renderer.domElement.addEventListener('pointermove', onPointerMove)
    renderer.domElement.addEventListener('pointerup', stopDragging)
    renderer.domElement.addEventListener('pointercancel', stopDragging)
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false })
    label.addEventListener('pointerdown', onPointerDown)
    label.addEventListener('pointermove', onPointerMove)
    label.addEventListener('pointerup', stopDragging)
    label.addEventListener('pointercancel', stopDragging)
    label.addEventListener('wheel', onWheel, { passive: false })
    mount.addEventListener('keydown', onKeyDown)

    return () => {
      disposed = true
      window.cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      renderer.domElement.removeEventListener('pointerdown', onPointerDown)
      renderer.domElement.removeEventListener('pointermove', onPointerMove)
      renderer.domElement.removeEventListener('pointerup', stopDragging)
      renderer.domElement.removeEventListener('pointercancel', stopDragging)
      renderer.domElement.removeEventListener('wheel', onWheel)
      label.removeEventListener('pointerdown', onPointerDown)
      label.removeEventListener('pointermove', onPointerMove)
      label.removeEventListener('pointerup', stopDragging)
      label.removeEventListener('pointercancel', stopDragging)
      label.removeEventListener('wheel', onWheel)
      mount.removeEventListener('keydown', onKeyDown)
      mount.removeChild(renderer.domElement)
      sphereGeometry.dispose()
      sphereMaterial.map?.dispose()
      sphereMaterial.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <section
      className={`panorama-intro ${isReady ? 'is-ready' : ''}`}
      aria-label="Minecraft panorama"
    >
      <div
        className="panorama-rig"
        ref={mountRef}
        tabIndex={0}
        aria-label="360 degree Minecraft home panorama"
      />
      <button
        className="minecraft-floating-label"
        type="button"
        ref={labelRef}
        onClick={handleLabelClick}
      >
        <span>Look around and view my minecraft home, or</span>
        <strong>"click me"</strong>
        <span>to go to my website home :)</span>
      </button>
      <div
        className={`panorama-loader ${isReady ? 'is-hidden' : ''}`}
        aria-hidden={isReady}
      >
        Loading world
      </div>
    </section>
  )
}

function SiteShell({ children, variant = 'light' }) {
  return (
    <div className={`site-shell ${variant === 'dark' ? 'site-shell-dark' : ''}`}>
      <header className="site-header">
        <Link className="brand" to="/" aria-label="Potatotyper landing">
          Potatotyper
        </Link>
        <nav className="site-nav" aria-label="Primary navigation">
          <NavLink to="/home">
            <HomeIcon size={18} aria-hidden="true" />
            Home
          </NavLink>
          <NavLink to="/professional">
            <Briefcase size={18} aria-hidden="true" />
            Professional
          </NavLink>
          <NavLink to="/street-view">
            <Map size={18} aria-hidden="true" />
            Street View
          </NavLink>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  )
}

function ContactAction({ link }) {
  const Icon = link.icon

  return (
    <a className="contact-action" href={link.href} target="_blank" rel="noreferrer">
      <Icon size={18} aria-hidden="true" />
      <span>
        <strong>{link.label}</strong>
        {link.value}
      </span>
    </a>
  )
}

function SectionHeading({ icon: Icon, eyebrow, title, titleId }) {
  return (
    <div className="professional-section-heading">
      <Icon size={20} aria-hidden="true" />
      <div>
        <p>{eyebrow}</p>
        <h2 id={titleId}>{title}</h2>
      </div>
    </div>
  )
}

function ProfessionalPage() {
  return (
    <SiteShell variant="dark">
      <section className="professional-page professional-recap-page">
        <section className="professional-readme-hero" aria-labelledby="professional-title">
          <p className="professional-eyebrow">Hello, I am a CS TA & Software Engineer</p>
          <h1 id="professional-title">James Johnson Tjhin</h1>
          <p className="professional-lede">
            Currently teaching and studying Computer Science at UBC and building
            performant systems at SAP. When I am not coding or teaching
            low-level programming, I am probably building Minecraft mods or
            hanging out on my SMP server.
          </p>
          <div className="professional-contact-list" aria-label="Contact links">
            {contactLinks.map((link) => (
              <ContactAction key={link.label} link={link} />
            ))}
          </div>
        </section>

        <section className="professional-section" aria-labelledby="work-recap-title">
          <SectionHeading
            icon={Briefcase}
            eyebrow="What I have been up to"
            title="Work Recap"
            titleId="work-recap-title"
          />
          <div className="recap-card-grid">
            {workRecaps.map((item) => {
              const Icon = item.icon

              return (
                <article className="recap-card" key={item.title}>
                  <header>
                    <Icon size={20} aria-hidden="true" />
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.subtitle}</p>
                    </div>
                    <span>{item.dates}</span>
                  </header>
                  <p>{item.summary}</p>
                  <div className="recap-tags" aria-label={`${item.title} technologies`}>
                    {item.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <section className="professional-section" aria-labelledby="systems-projects-title">
          <SectionHeading
            icon={Code}
            eyebrow="Projects"
            title="Systems & Tools"
            titleId="systems-projects-title"
          />
          <div className="project-grid recap-project-grid">
            {projectItems.map((project) => (
              <article className="project-card" key={project.name}>
                <header>
                  <div>
                    <h3>{project.name}</h3>
                    <p>{project.stack}</p>
                  </div>
                  <a href={project.href} target="_blank" rel="noreferrer">
                    <Code size={18} aria-hidden="true" />
                    <span className="sr-only">Open {project.name} on GitHub</span>
                  </a>
                </header>
                <ul>
                  {project.bullets.slice(0, 2).map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="professional-section recap-two-column">
          <div aria-labelledby="minecraft-title">
            <SectionHeading
              icon={Package}
              eyebrow="Minecraft Mods"
              title="Side Quests"
              titleId="minecraft-title"
            />
            <p className="panel-copy">
              I love playing Minecraft and occasionally build server-side Fabric
              mods. My SMP server is where friends make fun builds, including
              recreating offices we worked in before.
            </p>
            <div className="mod-list">
              {minecraftMods.map((mod) => (
                <a href={mod.href} target="_blank" rel="noreferrer" key={mod.name}>
                  <span>
                    <strong>{mod.name}</strong>
                    {mod.detail}
                  </span>
                  <ExternalLink size={16} aria-hidden="true" />
                </a>
              ))}
              <a href="https://modrinth.com/user/potatotyper" target="_blank" rel="noreferrer">
                <span>
                  <strong>Modrinth</strong>
                  Browse my public Minecraft mod profile.
                </span>
                <ExternalLink size={16} aria-hidden="true" />
              </a>
            </div>
          </div>

          <div aria-labelledby="skills-title">
            <SectionHeading
              icon={Wrench}
              eyebrow="Tech Stack"
              title="Tools I Reach For"
              titleId="skills-title"
            />
            <div className="skill-group-list">
              {skillGroups.map((group) => (
                <div className="skill-group" key={group.label}>
                  <h3>{group.label}</h3>
                  <div>
                    {group.items.map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </section>
    </SiteShell>
  )
}

function MinecraftLandingPage() {
  const navigate = useNavigate()

  return <PanoramaIntro onEnterHome={() => navigate('/home')} />
}

function HomePage() {
  return (
    <SiteShell>
      <section className="home-brief reveal-content">
        <p className="eyebrow">Personal site</p>
        <h1>Hi, I am building things that feel useful, playful, and mine.</h1>
        <p className="brief-copy">
          This is a starter home for my projects, professional work, Minecraft
          ideas, and experiments. The details are placeholders for now, but the
          panorama knows the way in.
        </p>
        <div className="profile-links" aria-label="Profile links">
          {profileLinks.map(({ label, href, icon: Icon }) => (
            <a key={label} href={href} target="_blank" rel="noreferrer">
              <Icon size={20} aria-hidden="true" />
              {label}
              <ExternalLink size={16} aria-hidden="true" />
            </a>
          ))}
        </div>
      </section>
    </SiteShell>
  )
}

function PlaceholderPage({ title, kicker, body }) {
  return (
    <SiteShell>
      <section className="placeholder-page">
        <p className="eyebrow">{kicker}</p>
        <h1>{title}</h1>
        <p>{body}</p>
      </section>
    </SiteShell>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MinecraftLandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route
          path="/professional"
          element={<ProfessionalPage />}
        />
        <Route
          path="/street-view"
          element={
            <PlaceholderPage
              title="Street View"
              kicker="Coming soon"
              body="This page is reserved for the future street-view experience."
            />
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
