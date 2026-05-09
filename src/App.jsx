import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
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
const PROFILE_IMAGE = '/assets/icon/profilepic.jpeg'
const HOBBY_REEL_CENTER_PANEL = 1
const HOBBY_REEL_SCROLL_SETTLE_MS = 280
const HOBBY_HORIZONTAL_SWIPE_THRESHOLD = 56
const HOBBY_HORIZONTAL_SWIPE_DOMINANCE = 1.2

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
    href: 'https://github.com/t-cacheoracle/cacheoracle-v1',
    bullets: [
      'Reduced LLM API latency by 34% with a C++ cache based on NeurIPS 2025 research from Microsoft Research.',
      'Reached 83-98% cache hit rates by matching prompts through cosine similarity on sentence-transformer embeddings.',
      'Architected a 3-tier LRU cache with gRPC that synthesizes Python programs from prompt clusters to skip LLM calls.',
    ],
  },
  {
    name: 'Threadpool with Visualizer',
    stack: 'C++, CMake, React, TypeScript, D3',
    href: 'https://github.com/potatotyper/jthreads',
    bullets: [
      'Implemented a C++ threadpool with submit()/shutdown() APIs, std::future results, and timestamped JSON lifecycle tracing.',
      'Visualized task and worker activity as thread swimlanes in React and D3.',
      'Built a mutex-protected FIFO queue with condition variable wait/signal and an atomic flag spinlock.',
    ],
  },
  {
    name: 'Personal Marketplace',
    stack: 'Ruby on Rails, WebSockets, Redis',
    href: 'https://github.com/potatotyper/marketplacecopy',
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

const featuredProjectSections = [
  {
    slug: 'jthreads',
    title: 'jthreads',
    eyebrow: 'Threading demo',
    icon: Code,
    description:
      'A threading-focused project with a live demo for exploring the behavior without cloning the repo.',
    tags: ['C++', 'Threads', 'Demo'],
    links: [
      {
        label: 'Live Demo',
        href: 'https://potatotyper.page/jthreads',
        icon: ExternalLink,
      },
      {
        label: 'GitHub',
        href: 'https://github.com/potatotyper/jthreads',
        icon: Code,
      },
    ],
  },
  {
    slug: 'minecraft-mods',
    title: 'Minecraft Mods',
    eyebrow: 'Mod collection',
    icon: Package,
    description:
      'A home for my Minecraft mod work, with source on GitHub and public releases/profile details on Modrinth.',
    tags: ['Minecraft', 'Fabric', 'Modrinth'],
    links: [
      {
        label: 'Modrinth',
        href: 'https://modrinth.com/user/potatotyper',
        icon: Package,
      },
      {
        label: 'GitHub',
        href: 'https://github.com/potatotyper/minecraft-mods',
        icon: Code,
      },
    ],
  },
  {
    slug: 'streetview',
    title: 'Minecraft Street View',
    eyebrow: 'In progress',
    icon: Map,
    description:
      'A street-view style Minecraft project that is still being built out.',
    tags: ['Minecraft', 'Maps', 'Street View'],
    warning: 'In-progress project.',
    links: [
      {
        label: 'GitHub',
        href: 'https://github.com/potatotyper/Minecraft-Street-View',
        icon: Code,
      },
    ],
  },
]

const otherProjectLinks = [
  {
    name: 'cacheoracle-v1',
    href: 'https://github.com/t-cacheoracle/cacheoracle-v1',
  },
  {
    name: 'Syllabyte',
    href: 'https://github.com/FabianoGLentini/Syllabyte',
  },
  {
    name: 'twapgame',
    href: 'https://github.com/potatotyper/twapgame',
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

const hobbyPhotoPath = (folder, fileName) => (
  `/assets/${folder}/${encodeURIComponent(fileName)}`
)

const golfPhotoFiles = [
  'WhatsApp Image 2026-05-04 at 6.35.40 PM (4).jpeg',
  'WhatsApp Image 2026-05-04 at 7.27.56 PM.jpeg',
  'WhatsApp Image 2026-05-04 at 7.27.574 PM.jpeg',
  'WhatsApp Image 2026-05-04 at 6.35.40 PM (3).jpeg',
  'WhatsApp Image 2026-05-04 at 7.27.573 PM.jpeg',
  'WhatsApp Image 2026-05-04 at 7.27.561 PM.jpeg',
  'WhatsApp Image 2026-05-04 at 6.35.40 PM (2).jpeg',
  'WhatsApp Image 2026-05-04 at 6.35.40 PM (6).jpeg',
  'WhatsApp Image 2026-05-04 at 6.35.41 PM.jpeg',
  'WhatsApp Image 2026-05-04 at 6.35.41 PM (2).jpeg',
  'WhatsApp Image 2026-05-04 at 6.35.40 PM (5).jpeg',
  'WhatsApp Image 2026-05-04 at 7.27.572 PM.jpeg',
  'WhatsApp Image 2026-05-04 at 6.35.41 PM (1).jpeg',
]

const snowboardPhotoFiles = [
  'WhatsApp Image 2026-05-04 at 6.35.41 PM (8).jpeg',
  'WhatsApp Image 2026-05-04 at 6.35.41 PM (9).jpeg',
  'WhatsApp Image 2026-05-04 at 6.35.41 PM (6).jpeg',
  'WhatsApp Image 2026-05-04 at 6.35.41 PM (4).jpeg',
  'WhatsApp Image 2026-05-04 at 6.35.41 PM (3).jpeg',
  'WhatsApp Image 2026-05-04 at 6.35.41 PM (7).jpeg',
  'XLast.jpeg',
]

const hobbyReelItems = [
  {
    title: 'Golf',
    description:
      'I usually play in the municipals in Vancouver, though I also frequent the driving range in Musqueam. Not that good of a golfer, but I really enjoy it. \n Message me on linkedin! I\'m down to teach or play with anyone :)',
    colors: ['#2f7244', '#d6e69f'],
    photos: golfPhotoFiles.map((fileName, index) => ({
      image: hobbyPhotoPath('golf', fileName),
      placeholder: `Golf photo ${index + 1}`,
      imageAlt: 'playing golf',
    })),
  },
  {
    title: 'Snowboarding',
    description:
      'Beginner boarder, but I’ve already committed to the bit with a Seymour season pass for next season. :)',
    colors: ['#2d5f83', '#d9edf7'],
    photos: snowboardPhotoFiles.map((fileName, index) => ({
      image: hobbyPhotoPath('snowboard', fileName),
      placeholder: `Snowboarding photo ${index + 1}`,
      imageAlt: 'snowboarding',
    })),
  }
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
  const navRef = useRef(null)
  const navToggleRef = useRef(null)
  const [isNavCollapsed, setIsNavCollapsed] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useLayoutEffect(() => {
    const nav = navRef.current
    if (!nav) return undefined

    const updateNavLayout = () => {
      const firstLink = nav.querySelector('a')
      if (!firstLink) return

      const linkHeight = firstLink.getBoundingClientRect().height
      const isWrapped = nav.scrollHeight > linkHeight + 4
      setIsNavCollapsed(isWrapped)
      if (!isWrapped) {
        setIsMenuOpen(false)
      }
    }

    updateNavLayout()
    window.addEventListener('resize', updateNavLayout)

    return () => {
      window.removeEventListener('resize', updateNavLayout)
    }
  }, [])

  return (
    <div className={`site-shell ${variant === 'dark' ? 'site-shell-dark' : ''}`}>
      <header
        className={`site-header ${isNavCollapsed ? 'is-collapsed' : ''} ${
          isMenuOpen ? 'is-open' : ''
        }`}
      >
        <div className="site-header-left">
          <Link className="brand" to="/" aria-label="Potatotyper landing">
            Potatotyper
          </Link>
          <button
            type="button"
            className="site-nav-toggle"
            ref={navToggleRef}
            onClick={() => setIsMenuOpen((current) => !current)}
            aria-expanded={isMenuOpen}
            aria-controls="site-nav"
          >
            Menu
          </button>
        </div>
        <nav className="site-nav" id="site-nav" ref={navRef} aria-label="Primary navigation">
          <NavLink to="/home">
            <HomeIcon size={18} aria-hidden="true" />
            Home
          </NavLink>
          <NavLink to="/professional">
            <Briefcase size={18} aria-hidden="true" />
            Professional
          </NavLink>
          <NavLink to="/projects">
            <Code size={18} aria-hidden="true" />
            Projects
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

function ProjectActionLink({ link }) {
  const Icon = link.icon

  return (
    <a className="project-action-link" href={link.href} target="_blank" rel="noreferrer">
      <Icon size={18} aria-hidden="true" />
      <span>{link.label}</span>
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
          <div className="title-with-avatar">
            <img
              className="profile-avatar"
              src={PROFILE_IMAGE}
              alt="James Johnson Tjhin profile photo"
              loading="eager"
            />
            <div className="title-stack">
              <h1 id="professional-title">James Johnson Tjhin</h1>
              <p className="professional-lede">
                Currently teaching and studying Computer Science at UBC and building
                performant systems at SAP. When I am not coding or teaching
                low-level programming, I am probably building Minecraft mods or
                hanging out on my SMP server.
              </p>
            </div>
          </div>
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
            <article className="project-card project-demo-card">
              <header>
                <div>
                  <h3>Project Demos</h3>
                  <p>Live demos and public project links</p>
                </div>
                <Link to="/projects">
                  <ExternalLink size={18} aria-hidden="true" />
                  <span className="sr-only">Open project demos page</span>
                </Link>
              </header>
              <ul>
                <li>Try jthreads and browse my Minecraft mod links from one projects hub.</li>
                <li>Includes the Minecraft Street View status and other project repos.</li>
              </ul>
            </article>
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

        <section className="professional-fun-mode" aria-labelledby="fun-mode-title">
          <p className="professional-eyebrow">You made it</p>
          <h2 id="fun-mode-title">Thank you for reading to the end.</h2>
          <p>
            Reach out to me via{' '}
            <a href="https://www.linkedin.com/in/james-johnson-tjhin/" target="_blank" rel="noreferrer">
              LinkedIn
            </a>{' '}
            or{' '}
            <a href="mailto:jamesj.tjhin@gmail.com">
              email
            </a>
            .
          </p>
          <Link className="fun-mode-link" to="/">
            Fun Mode
          </Link>
        </section>
      </section>
    </SiteShell>
  )
}

function MinecraftLandingPage() {
  const navigate = useNavigate()

  return <PanoramaIntro onEnterHome={() => navigate('/home')} />
}

function HobbyPhotoPanel({ photo, isLoaded, isCurrent = false, onLoad }) {
  return (
    <figure className={`hobby-photo-panel ${isLoaded ? 'is-loaded' : ''}`}>
      {!isLoaded && <span className="hobby-photo-buffer" aria-hidden="true" />}
      <img
        src={photo.image}
        alt={isCurrent ? photo.imageAlt : ''}
        loading="eager"
        decoding="async"
        onLoad={() => onLoad(photo.image)}
      />
    </figure>
  )
}

function HomePage() {
  const [activeHobbyIndex, setActiveHobbyIndex] = useState(0)
  const [photoIndices, setPhotoIndices] = useState(() => (
    hobbyReelItems.map(() => 0)
  ))
  const [loadedPhotoImages, setLoadedPhotoImages] = useState(() => ({}))
  const [hobbyDragOffset, setHobbyDragOffset] = useState(0)
  const [hobbySlideDirection, setHobbySlideDirection] = useState(0)
  const [hobbyRailMode, setHobbyRailMode] = useState('idle')
  const hobbyFrameRef = useRef(null)
  const hobbyScrollRef = useRef(null)
  const isRecenteringReelRef = useRef(false)
  const scrollSettleTimerRef = useRef(0)
  const hobbyReturnTimerRef = useRef(0)
  const hobbySwipeRef = useRef({
    pointerId: null,
    startX: 0,
    startY: 0,
    isHorizontalSwipe: false,
  })
  const isHobbyRailMoving = hobbyRailMode !== 'idle'
  const activeHobby = hobbyReelItems[activeHobbyIndex]
  const activePhotoCount = activeHobby.photos.length
  const activePhotoIndex = photoIndices[activeHobbyIndex] ?? 0
  const activePhoto =
    activeHobby.photos[activePhotoIndex % activePhotoCount]
  const previousPhotoIndex =
    (activePhotoIndex - 1 + activePhotoCount) % activePhotoCount
  const nextPhotoIndex = (activePhotoIndex + 1) % activePhotoCount
  const reelPhotos = [
    {
      position: -1,
      photo: activeHobby.photos[previousPhotoIndex],
    },
    {
      position: 0,
      photo: activePhoto,
    },
    {
      position: 1,
      photo: activeHobby.photos[nextPhotoIndex],
    },
  ]
  const hobbyPanelItems = [-1, 0, 1].map((position) => {
    const hobbyIndex =
      (activeHobbyIndex + position + hobbyReelItems.length) % hobbyReelItems.length
    const hobby = hobbyReelItems[hobbyIndex]
    const photoIndex = photoIndices[hobbyIndex] ?? 0
    const photo = hobby.photos[photoIndex % hobby.photos.length]

    return {
      hobby,
      hobbyIndex,
      photo,
      position,
    }
  })

  const selectHobby = (index) => {
    setHobbyDragOffset(0)
    setHobbySlideDirection(0)
    setHobbyRailMode('idle')
    setActiveHobbyIndex(index)
  }

  const moveHobby = useCallback((direction) => {
    setActiveHobbyIndex((currentIndex) => (
      (currentIndex + direction + hobbyReelItems.length) % hobbyReelItems.length
    ))
  }, [])

  const markPhotoLoaded = useCallback((image) => {
    setLoadedPhotoImages((currentImages) => {
      if (currentImages[image]) return currentImages

      return {
        ...currentImages,
        [image]: true,
      }
    })
  }, [])

  const recenterHobbyReel = useCallback(() => {
    const scrollElement = hobbyScrollRef.current

    if (!scrollElement) return

    isRecenteringReelRef.current = true
    const previousScrollBehavior = scrollElement.style.scrollBehavior
    scrollElement.style.scrollBehavior = 'auto'
    scrollElement.scrollTop = scrollElement.clientHeight * HOBBY_REEL_CENTER_PANEL

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        scrollElement.style.scrollBehavior = previousScrollBehavior
        isRecenteringReelRef.current = false
      })
    })
  }, [])

  const movePhoto = useCallback((direction) => {
    setPhotoIndices((currentIndices) => {
      const nextIndices = [...currentIndices]
      const currentIndex = currentIndices[activeHobbyIndex] ?? 0
      nextIndices[activeHobbyIndex] =
        (currentIndex + direction + activePhotoCount) % activePhotoCount
      return nextIndices
    })
  }, [activeHobbyIndex, activePhotoCount])

  useLayoutEffect(() => {
    recenterHobbyReel()
  }, [activeHobbyIndex, activePhotoIndex, recenterHobbyReel])

  useEffect(() => () => {
    window.clearTimeout(scrollSettleTimerRef.current)
    window.clearTimeout(hobbyReturnTimerRef.current)
  }, [])

  const handleHobbyScroll = useCallback(() => {
    if (isRecenteringReelRef.current) return

    window.clearTimeout(scrollSettleTimerRef.current)
    scrollSettleTimerRef.current = window.setTimeout(() => {
      const scrollElement = hobbyScrollRef.current

      if (!scrollElement || isRecenteringReelRef.current) return

      const panelHeight = scrollElement.clientHeight || 1
      const snappedPanel = Math.round(scrollElement.scrollTop / panelHeight)

      if (snappedPanel < HOBBY_REEL_CENTER_PANEL) {
        movePhoto(-1)
      } else if (snappedPanel > HOBBY_REEL_CENTER_PANEL) {
        movePhoto(1)
      } else {
        recenterHobbyReel()
      }
    }, HOBBY_REEL_SCROLL_SETTLE_MS)
  }, [movePhoto, recenterHobbyReel])

  const scrollToAdjacentPhoto = useCallback((direction) => {
    const scrollElement = hobbyScrollRef.current

    if (!scrollElement) return

    scrollElement.scrollTo({
      top: scrollElement.clientHeight * (direction > 0 ? 2 : 0),
      behavior: 'smooth',
    })
  }, [])

  const startHobbySlide = useCallback((direction) => {
    window.clearTimeout(hobbyReturnTimerRef.current)
    setHobbyDragOffset(0)
    setHobbySlideDirection(direction > 0 ? 1 : -1)
    setHobbyRailMode('sliding')
  }, [])

  const handleHobbyRailTransitionEnd = (event) => {
    if (event.target !== event.currentTarget || event.propertyName !== 'transform') {
      return
    }

    window.clearTimeout(hobbyReturnTimerRef.current)

    if (hobbyRailMode === 'sliding') {
      moveHobby(hobbySlideDirection)
    }

    setHobbyDragOffset(0)
    setHobbySlideDirection(0)
    setHobbyRailMode('idle')
  }

  const returnHobbyRailToCenter = useCallback(() => {
    window.clearTimeout(hobbyReturnTimerRef.current)
    setHobbyRailMode('returning')
    setHobbyDragOffset(0)
    hobbyReturnTimerRef.current = window.setTimeout(() => {
      setHobbyRailMode((currentMode) => (
        currentMode === 'returning' ? 'idle' : currentMode
      ))
    }, 380)
  }, [])

  const resetHobbySwipe = useCallback(() => {
    hobbySwipeRef.current = {
      pointerId: null,
      startX: 0,
      startY: 0,
      isHorizontalSwipe: false,
    }
  }, [])

  const handleHobbyPointerDown = (event) => {
    if (isHobbyRailMoving) return
    if (event.pointerType === 'mouse' && event.button !== 0) return

    hobbySwipeRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      isHorizontalSwipe: false,
    }

    if (event.pointerType === 'mouse') {
      event.currentTarget.setPointerCapture?.(event.pointerId)
      event.preventDefault()
    }
  }

  const handleHobbyPointerMove = (event) => {
    const swipe = hobbySwipeRef.current

    if (event.pointerId !== swipe.pointerId) return

    if (event.pointerType === 'mouse' && event.buttons !== 1) {
      if (swipe.isHorizontalSwipe) {
        returnHobbyRailToCenter()
      }

      resetHobbySwipe()
      return
    }

    const deltaX = event.clientX - swipe.startX
    const deltaY = event.clientY - swipe.startY
    const absX = Math.abs(deltaX)
    const absY = Math.abs(deltaY)

    if (swipe.isHorizontalSwipe) {
      const frameWidth = hobbyFrameRef.current?.clientWidth || 1
      setHobbyDragOffset(clamp(deltaX, -frameWidth, frameWidth))
      return
    }

    if (
      absX > 18 &&
      absX > absY * HOBBY_HORIZONTAL_SWIPE_DOMINANCE
    ) {
      swipe.isHorizontalSwipe = true
      setHobbyDragOffset(deltaX)
    }
  }

  const handleHobbyPointerUp = (event) => {
    const swipe = hobbySwipeRef.current

    if (event.pointerId !== swipe.pointerId) return

    const deltaX = event.clientX - swipe.startX
    const deltaY = event.clientY - swipe.startY
    const absX = Math.abs(deltaX)
    const absY = Math.abs(deltaY)

    if (
      swipe.isHorizontalSwipe &&
      absX >= HOBBY_HORIZONTAL_SWIPE_THRESHOLD &&
      absX > absY * HOBBY_HORIZONTAL_SWIPE_DOMINANCE
    ) {
      startHobbySlide(deltaX < 0 ? 1 : -1)
    } else if (swipe.isHorizontalSwipe) {
      returnHobbyRailToCenter()
    }

    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture?.(event.pointerId)
    }
    resetHobbySwipe()
  }

  const handleHobbyPointerCancel = (event) => {
    const swipe = hobbySwipeRef.current

    if (event.pointerId === swipe.pointerId && swipe.isHorizontalSwipe) {
      returnHobbyRailToCenter()
    }

    resetHobbySwipe()
  }

  const handleHobbyLostPointerCapture = (event) => {
    const swipe = hobbySwipeRef.current

    if (event.pointerId === swipe.pointerId && swipe.isHorizontalSwipe) {
      returnHobbyRailToCenter()
    }

    resetHobbySwipe()
  }

  const handleHobbyKeyDown = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'PageDown') {
      event.preventDefault()
      scrollToAdjacentPhoto(1)
    } else if (event.key === 'ArrowUp' || event.key === 'PageUp') {
      event.preventDefault()
      scrollToAdjacentPhoto(-1)
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      startHobbySlide(1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      startHobbySlide(-1)
    }
  }

  const hobbyRailTransform = (() => {
    if (hobbyRailMode === 'sliding') {
      return `translate3d(${hobbySlideDirection > 0 ? '-200%' : '0%'}, 0, 0)`
    }

    return `translate3d(calc(-100% + ${hobbyDragOffset}px), 0, 0)`
  })()

  return (
    <SiteShell>
      <div className="home-page reveal-content">
        <section className="home-brief">
          <p className="eyebrow">Personal site</p>
          <div className="title-with-avatar">
            <img
              className="profile-avatar"
              src={PROFILE_IMAGE}
              alt="James Johnson Tjhin profile photo"
              loading="eager"
            />
            <h1>Hi, I'm James.</h1>
            <p className="brief-copy">
              This is a starter home for my hobbies, projects, and experiments.
              More always on the way!
            </p>
          </div>
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

        <section className="minecraft-server-section">
          <div className="minecraft-server-copy">
            <p className="eyebrow">Minecraft SMP</p>
            <h2>Come see the server builds.</h2>
            <p>
              I spend a lot of time on my SMP server with friends. We make fun
              builds, including trying to rebuild offices we worked in before.
              If that sounds like your kind of chaos, DM me on LinkedIn to join.
            </p>
          </div>
          <div className="minecraft-server-actions">
            <a
              className="minecraft-server-link"
              href="https://www.linkedin.com/in/james-johnson-tjhin/"
              target="_blank"
              rel="noreferrer"
            >
              <Network size={20} aria-hidden="true" />
              Message me on LinkedIn
              <ExternalLink size={16} aria-hidden="true" />
            </a>
            <Link className="minecraft-server-link is-secondary" to="/">
              View Panorama
            </Link>
          </div>
        </section>

        <section className="hobby-reel-section" aria-labelledby="hobbies-title">
          <div className="hobby-reel-heading">
            <p className="eyebrow">Hobbies</p>
            <h2 id="hobbies-title">Scroll the reel.</h2>
          </div>

          <div className="hobby-reel">
            <div
              ref={hobbyFrameRef}
              className="hobby-phone-frame has-photo"
              onPointerDown={handleHobbyPointerDown}
              onPointerMove={handleHobbyPointerMove}
              onPointerUp={handleHobbyPointerUp}
              onPointerCancel={handleHobbyPointerCancel}
              onLostPointerCapture={handleHobbyLostPointerCapture}
              style={{
                '--photo-from': activeHobby.colors[0],
                '--photo-to': activeHobby.colors[1],
              }}
            >
              <div
                className={`hobby-hobby-rail is-${hobbyRailMode}`}
                onTransitionEnd={handleHobbyRailTransitionEnd}
                style={{ transform: hobbyRailTransform }}
              >
                {hobbyPanelItems.map(({ hobby, hobbyIndex, photo, position }) => (
                  <div
                    className="hobby-hobby-panel"
                    key={`${hobby.title}-${position}`}
                    style={{
                      '--photo-from': hobby.colors[0],
                      '--photo-to': hobby.colors[1],
                    }}
                  >
                    {position === 0 ? (
                      <div
                        ref={hobbyScrollRef}
                        className="hobby-photo-scroll"
                        onScroll={handleHobbyScroll}
                        onKeyDown={handleHobbyKeyDown}
                        role="region"
                        tabIndex={0}
                        aria-label={`${activePhoto.imageAlt}. Scroll vertically to change photos. Swipe left or right to change hobbies.`}
                      >
                        {reelPhotos.map(({ photo: reelPhoto, position: reelPosition }) => (
                          <HobbyPhotoPanel
                            key={`${reelPhoto.image}-${reelPosition}`}
                            photo={reelPhoto}
                            isLoaded={Boolean(loadedPhotoImages[reelPhoto.image])}
                            isCurrent={reelPosition === 0}
                            onLoad={markPhotoLoaded}
                          />
                        ))}
                      </div>
                    ) : (
                      <div
                        className="hobby-static-photo"
                        aria-hidden="true"
                      >
                        <HobbyPhotoPanel
                          photo={photo}
                          isLoaded={Boolean(loadedPhotoImages[photo.image])}
                          isCurrent={hobbyIndex === activeHobbyIndex}
                          onLoad={markPhotoLoaded}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <span className="hobby-click-hint">Scroll photos, swipe sideways for hobbies</span>
            </div>

            <div className="hobby-reel-copy">
              <span>
                {activeHobbyIndex + 1} / {hobbyReelItems.length}
              </span>
              <h3>{activeHobby.title}</h3>
              <p>{activeHobby.description}</p>
              <p className="hobby-photo-caption">
                <strong>
                  Photo {(activePhotoIndex % activeHobby.photos.length) + 1} of{' '}
                  {activeHobby.photos.length}
                </strong>
                {activePhoto.caption}
              </p>
              <div className="hobby-reel-controls" aria-label="Choose a hobby">
                {hobbyReelItems.map((item, index) => (
                  <button
                    type="button"
                    key={item.title}
                    className={index === activeHobbyIndex ? 'is-active' : ''}
                    onClick={() => selectHobby(index)}
                    aria-label={`Show ${item.title}`}
                    aria-pressed={index === activeHobbyIndex}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </SiteShell>
  )
}

function ProjectsPage() {
  return (
    <SiteShell>
      <section className="projects-page reveal-content">
        <section className="projects-hero" aria-labelledby="projects-title">
          <p className="eyebrow">Projects</p>
          <h1 id="projects-title">Things I am building.</h1>
          <p className="projects-lede">
            A quick launchpad for the projects I want people to try first, plus
            a few other repos worth keeping close by.
          </p>
        </section>

        <div className="featured-project-list">
          {featuredProjectSections.map((project) => {
            const Icon = project.icon
            const titleId = `project-${project.slug}-title`

            return (
              <section
                className="featured-project-section"
                aria-labelledby={titleId}
                key={project.slug}
              >
                <div className="featured-project-header">
                  <span className="featured-project-icon" aria-hidden="true">
                    <Icon size={24} />
                  </span>
                  <div>
                    <p className="eyebrow">{project.eyebrow}</p>
                    <h2 id={titleId}>{project.title}</h2>
                  </div>
                </div>
                <p className="featured-project-copy">{project.description}</p>
                {project.warning && (
                  <p className="project-warning">
                    <Wrench size={18} aria-hidden="true" />
                    <span>{project.warning}</span>
                  </p>
                )}
                <div className="recap-tags" aria-label={`${project.title} tags`}>
                  {project.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                {project.links.length > 0 && (
                  <div className="project-actions" aria-label={`${project.title} links`}>
                    {project.links.map((link) => (
                      <ProjectActionLink link={link} key={link.label} />
                    ))}
                  </div>
                )}
              </section>
            )
          })}
        </div>

        <section className="other-projects-section" aria-labelledby="other-projects-title">
          <SectionHeading
            icon={Code}
            eyebrow="More repos"
            title="Other Projects"
            titleId="other-projects-title"
          />
          <div className="other-project-grid">
            {otherProjectLinks.map((project) => (
              <a
                className="other-project-link"
                href={project.href}
                target="_blank"
                rel="noreferrer"
                key={project.name}
              >
                <span>
                  <strong>{project.name}</strong>
                  GitHub repository
                </span>
                <ExternalLink size={17} aria-hidden="true" />
              </a>
            ))}
          </div>
        </section>
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
          path="/projects"
          element={<ProjectsPage />}
        />
        <Route
          path="/street-view"
          element={<ProjectsPage />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
