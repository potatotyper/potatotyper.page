import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import {
  Award,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  Code,
  ExternalLink,
  Github,
  GraduationCap,
  Home as HomeIcon,
  Linkedin,
  Mail,
  Map,
  MapPin,
  Network,
  Package,
  Server,
  Wrench,
} from 'lucide-react'
import {
  BrowserRouter,
  Link,
  NavLink,
  Route,
  Routes,
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
    icon: Linkedin,
  },
  {
    label: 'GitHub',
    value: 'potatotyper',
    href: 'https://github.com/potatotyper',
    icon: Github,
  },
]

const highlights = [
  { value: '42%', label: 'faster story load workflows at SAP' },
  { value: '58%', label: 'faster private model deletion flow' },
  { value: '400+', label: 'students supported each term at UBC' },
  { value: '83-98%', label: 'cache hit rate on LLM prompt matching' },
]

const experienceItems = [
  {
    company: 'SAP',
    role: 'Software Engineer Intern',
    team: 'Data Visualization Container Team',
    location: 'Vancouver, BC',
    dates: 'Sep 2025 - Present',
    bullets: [
      'Led redesign of story caching workflows, improving load times by up to 42% by reducing metadata calls and improving user-side cache re-persistence logic in JavaScript.',
      'Increased story loading up to 22% overall and 58% for private model deletion by refactoring APIs and introducing asynchronous job processing.',
      'Resolved SQL database leaks and dangling references on 60% of team-owned workflows by implementing robust query handling across the Node.js backend.',
      'Implemented API monitoring with Dynatrace and endpoint stress testing with Apache JMeter.',
      'Debugged React and Redux issues while adding Jest and Jasmine unit and integration tests.',
    ],
  },
  {
    company: 'University of British Columbia',
    role: 'Lead Teaching Assistant',
    team: 'CPSC 213, low-level programming',
    location: 'Vancouver, BC',
    dates: 'Jan 2025 - Present',
    bullets: [
      'Managed a team of 5 teaching assistants developing C, assembly, and multithreading course content.',
      'Built Bash and Python scripts to collect grades and detect misconduct for over 400 students each term.',
      'Created auto-graded coding and theory questions for assignments and exams using Python, Docker, and HTML for assembly, C, and Java.',
    ],
  },
  {
    company: 'Vidio',
    role: 'Software Engineer Intern',
    team: 'Discovery Page Team',
    location: 'Remote',
    dates: 'May 2024 - Aug 2024',
    bullets: [
      'Built a text localization flow between Figma designs and Rails i18n, saving 2+ hours weekly with an automatic translation layer between design and code.',
      'Saved 3+ hours weekly by developing a Google Cloud Platform tool in Ruby on Rails for batch Drive-to-Cloud-Storage media uploads with Google Sheets logging.',
      'Created Rails RSpec unit and integration tests, plus end-to-end tests using Selenium.',
    ],
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
        <Link className="brand" to="/" aria-label="PotatoTyper home">
          PotatoTyper
        </Link>
        <nav className="site-nav" aria-label="Primary navigation">
          <NavLink to="/" end>
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

function SectionHeading({ icon: Icon, eyebrow, title }) {
  return (
    <div className="professional-section-heading">
      <Icon size={20} aria-hidden="true" />
      <div>
        <p>{eyebrow}</p>
        <h2>{title}</h2>
      </div>
    </div>
  )
}

function ProfessionalPage() {
  return (
    <SiteShell variant="dark">
      <section className="professional-page">
        <section className="professional-intro" aria-labelledby="professional-title">
          <div className="professional-intro-copy">
            <p className="professional-eyebrow">CS TA & Software Engineer</p>
            <h1 id="professional-title">James Johnson Tjhin</h1>
            <p className="professional-lede">
              I am studying Computer Science at UBC, teaching low-level
              programming, and building performant systems at SAP. My work sits
              around caching, backend reliability, developer tools, and the
              useful little automations that save teams real time.
            </p>
            <div className="professional-contact-list" aria-label="Contact links">
              {contactLinks.map((link) => (
                <ContactAction key={link.label} link={link} />
              ))}
            </div>
          </div>

          <aside className="professional-current" aria-label="Current focus">
            <div>
              <Briefcase size={18} aria-hidden="true" />
              <span>SAP Data Visualization Container Team</span>
            </div>
            <div>
              <GraduationCap size={18} aria-hidden="true" />
              <span>UBC Computer Science, 4.1 GPA</span>
            </div>
            <div>
              <MapPin size={18} aria-hidden="true" />
              <span>Vancouver, BC</span>
            </div>
            <div>
              <Server size={18} aria-hidden="true" />
              <span>Minecraft mods and systems projects on the side</span>
            </div>
          </aside>
        </section>

        <section className="metric-grid" aria-label="Selected impact">
          {highlights.map((highlight) => (
            <div className="metric-card" key={highlight.label}>
              <strong>{highlight.value}</strong>
              <span>{highlight.label}</span>
            </div>
          ))}
        </section>

        <div className="professional-layout">
          <div className="professional-main-column">
            <section className="professional-section" aria-labelledby="experience-title">
              <SectionHeading
                icon={Briefcase}
                eyebrow="Experience"
                title="Recent Work"
              />
              <div className="experience-list" id="experience-title">
                {experienceItems.map((item) => (
                  <article className="experience-entry" key={item.company}>
                    <header>
                      <div>
                        <h3>{item.company}</h3>
                        <p>
                          {item.role}
                          <span>{item.team}</span>
                        </p>
                      </div>
                      <div className="entry-meta">
                        <span>
                          <CalendarDays size={15} aria-hidden="true" />
                          {item.dates}
                        </span>
                        <span>
                          <MapPin size={15} aria-hidden="true" />
                          {item.location}
                        </span>
                      </div>
                    </header>
                    <ul>
                      {item.bullets.map((bullet) => (
                        <li key={bullet}>
                          <CheckCircle2 size={16} aria-hidden="true" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </section>

            <section className="professional-section" aria-labelledby="projects-title">
              <SectionHeading icon={Code} eyebrow="Projects" title="Systems & Tools" />
              <div className="project-grid" id="projects-title">
                {projectItems.map((project) => (
                  <article className="project-card" key={project.name}>
                    <header>
                      <div>
                        <h3>{project.name}</h3>
                        <p>{project.stack}</p>
                      </div>
                      <a href={project.href} target="_blank" rel="noreferrer">
                        <Github size={18} aria-hidden="true" />
                        <span className="sr-only">Open {project.name} on GitHub</span>
                      </a>
                    </header>
                    <ul>
                      {project.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <aside className="professional-side-column">
            <section className="professional-panel" aria-labelledby="education-title">
              <SectionHeading
                icon={GraduationCap}
                eyebrow="Education"
                title="University of British Columbia"
              />
              <div className="education-block" id="education-title">
                <p>BSc, Computer Science</p>
                <span>Sep 2023 - Nov 2027</span>
                <ul>
                  <li>4.1 GPA</li>
                  <li>Faculty of Science International Student Scholarship</li>
                  <li>Charles and Jane Banks Scholarship Award, faculty nominated</li>
                  <li>Top 1 in Indonesia for Cambridge International AS Level Computer Science</li>
                </ul>
              </div>
            </section>

            <section className="professional-panel" aria-labelledby="skills-title">
              <SectionHeading icon={Wrench} eyebrow="Technical Skills" title="Stack" />
              <div className="skill-group-list" id="skills-title">
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
            </section>

            <section className="professional-panel" aria-labelledby="minecraft-title">
              <SectionHeading
                icon={Package}
                eyebrow="Minecraft"
                title="Mods & Server Projects"
              />
              <p className="panel-copy" id="minecraft-title">
                I build server-side Fabric mods and run SMP projects where
                friends make practical, funny builds, including recreating
                offices we have worked in.
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
            </section>

            <section className="professional-panel compact-panel" aria-label="Awards">
              <Award size={20} aria-hidden="true" />
              <p>
                Faculty-nominated scholarship recipient with national-level
                Cambridge International AS Level Computer Science recognition.
              </p>
            </section>
          </aside>
        </div>
      </section>
    </SiteShell>
  )
}

function HomePage() {
  const [introComplete, setIntroComplete] = useState(false)

  if (!introComplete) {
    return <PanoramaIntro onEnterHome={() => setIntroComplete(true)} />
  }

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
        <Route path="/" element={<HomePage />} />
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
