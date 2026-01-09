import { useState, useEffect, useRef } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import './App.css'
import profileImage from './assets/images/profile.jpg'
import quizmeImage from './assets/images/quizme_logo.png'
import quizmeScreenshot from './assets/images/quizme/quizme.jpg'
import gamaImage from './assets/images/GAMA_logo.png'
import gamaScreenshot from './assets/images/gama/GAMA.jpg'
import emuklatImage from './assets/images/E-Muklat_logo.jpg'
import emuklatScreenshot from './assets/images/emuklat/E-Muklat.jpg'
import ariceImage from './assets/images/Arice_logo.png'
import ariceScreenshot from './assets/images/arice/Arice.jpg'
import caciImage from './assets/images/caci_logo.jpg'
import caciDesign1 from './assets/images/design/caci/caci1.jpg'
import caciDesign2 from './assets/images/design/caci/caci2.jpg'
import caciDesign3 from './assets/images/design/caci/caci3.jpg'
import caciDesign4 from './assets/images/design/caci/caci4.jpg'
import caciDesign5 from './assets/images/design/caci/caci5.jpg'
import caciDesign6 from './assets/images/design/caci/caci6.jpg'
import caciDesign7 from './assets/images/design/caci/caci7.jpg'
import likhainImage from './assets/images/likhain_logo.png'
import eduvisionImage from './assets/images/eduvision_logo.png'
import trinovaImage from './assets/images/Trinova.jpg'
import motowashImage from './assets/images/motrorwash_logo.jpg'
import rccarImage from './assets/images/rccar_logo.jpg'
import ancestralhouseImage from './assets/images/ancestralhouse_logo.jpg'
import chessImage from './assets/images/chess_logo.jpg'
import tesdaImage from './assets/images/tesda.jpg'
import jannaProfileImage from './assets/images/clients/emuklat/janna_profile.png'
import lykaProfileImage from './assets/images/clients/emuklat/lyka_profile.png'
// Collaborator images
import quizmeJoe from './assets/images/collaborators/quizme/Joe.jpg'
import quizmeJohnLoyd from './assets/images/collaborators/quizme/John Loyd.jpg'
import quizmeJohnMichael from './assets/images/collaborators/quizme/John Michael.jpg'
import motowashJoe from './assets/images/collaborators/motowash/Joe.jpg'
import motowashJohnLoyd from './assets/images/collaborators/motowash/John Loyd.jpg'
import motowashLeah from './assets/images/collaborators/motowash/Leah.jpg'
import rccarJoe from './assets/images/collaborators/rccar/Joe.jpg'
import rccarJohnLoyd from './assets/images/collaborators/rccar/John Loyd.jpg'
import rccarLeah from './assets/images/collaborators/rccar/Leah.jpg'
import ancestralhouseJoe from './assets/images/collaborators/ancestralhouse/Joe.jpg'
import ancestralhouseJohnLoyd from './assets/images/collaborators/ancestralhouse/John Loyd.jpg'
import ancestralhouseLeah from './assets/images/collaborators/ancestralhouse/Leah.jpg'

// Set up PDF.js worker - use local worker file
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage first, then system preference
    const saved = localStorage.getItem('darkMode')
    if (saved !== null) {
      return saved === 'true'
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedCertificate, setSelectedCertificate] = useState<string | null>(null)
  const [projectFilter, setProjectFilter] = useState<string>('all')
  const [projectSearch, setProjectSearch] = useState<string>('')
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [enlargedImage, setEnlargedImage] = useState<{ url: string; project: any; index: number } | null>(null)
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [selectedScreenshotIndex, setSelectedScreenshotIndex] = useState<number>(0)
  const [isModalClosing, setIsModalClosing] = useState(false)
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const [typewriterName, setTypewriterName] = useState('')
  const [typewriterTitle, setTypewriterTitle] = useState('')
  const [typewriterDescription, setTypewriterDescription] = useState('')
  const typewriterIndexRef = useRef(0)
  const currentTextRef = useRef<'name' | 'title' | 'description'>('name')
  const typewriterFullName = 'Hi, I am Clarence Portugal'
  const typewriterFullTitle = 'Junior Full-Stack & IoT Developer'
  const typewriterFullDescription = 'Creating mobile applications, web platforms, and IoT systems using modern technologies and innovative solutions'

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString())
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('menu-open')
    } else {
      document.body.classList.remove('menu-open')
    }
    return () => {
      document.body.classList.remove('menu-open')
    }
  }, [mobileMenuOpen])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const navMenu = document.querySelector('.nav-menu')
      const menuToggle = document.querySelector('.mobile-menu-toggle')
      
      if (
        mobileMenuOpen &&
        navMenu &&
        menuToggle &&
        !navMenu.contains(target) &&
        !menuToggle.contains(target)
      ) {
        setMobileMenuOpen(false)
      }
    }

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [mobileMenuOpen])

  // Back to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Scroll animations with Intersection Observer
  useEffect(() => {
    // Immediately check and show elements already in viewport
    const checkInitialVisibility = () => {
      const fadeInElements = document.querySelectorAll('.fade-in:not(.fade-in-visible)')
      fadeInElements.forEach((el) => {
        const rect = el.getBoundingClientRect()
        // More lenient check - if any part is visible or close to viewport
        const isInViewport = rect.top < window.innerHeight + 100 && rect.bottom > -100
        if (isInViewport) {
          el.classList.add('fade-in-visible')
        }
      })
    }
    
    // Check immediately
    checkInitialVisibility()
    
    // Also check after a short delay to catch elements that load late
    const timer = setTimeout(checkInitialVisibility, 100)
    
    // Use more lenient observer options, especially for mobile
    const isMobile = window.innerWidth <= 768
    const observerOptions = {
      threshold: isMobile ? 0.05 : 0.1, // Lower threshold for mobile
      rootMargin: isMobile ? '50px 0px 50px 0px' : '0px 0px -50px 0px' // More margin on mobile
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-visible')
        }
      })
    }, observerOptions)

    const elementsToObserve = document.querySelectorAll('.fade-in')
    elementsToObserve.forEach(el => observer.observe(el))

    // Also listen to scroll events on mobile for better detection
    const handleScroll = () => {
      checkInitialVisibility()
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      clearTimeout(timer)
      elementsToObserve.forEach(el => observer.unobserve(el))
      window.removeEventListener('scroll', handleScroll)
    }
  }, [projectFilter, projectSearch])


  // Typewriter effect for name, title, and description
  useEffect(() => {
    typewriterIndexRef.current = 0
    currentTextRef.current = 'name'
    let timeoutId: ReturnType<typeof setTimeout>
    const typingSpeed = 25 // milliseconds per character
    const delayBetweenTexts = 500 // Delay after completing one text before starting next
    
    const getCurrentText = () => {
      switch (currentTextRef.current) {
        case 'name':
          return typewriterFullName
        case 'title':
          return typewriterFullTitle
        case 'description':
          return typewriterFullDescription
        default:
          return ''
      }
    }
    
    const getCurrentSetter = () => {
      switch (currentTextRef.current) {
        case 'name':
          return setTypewriterName
        case 'title':
          return setTypewriterTitle
        case 'description':
          return setTypewriterDescription
        default:
          return () => {}
      }
    }
    
    const isCurrentTextComplete = () => {
      const currentText = getCurrentText()
      return typewriterIndexRef.current >= currentText.length
    }
    
    const moveToNextText = () => {
      // Wait a bit after completing current text, then move to next
      setTimeout(() => {
        if (currentTextRef.current === 'name') {
          currentTextRef.current = 'title'
          typewriterIndexRef.current = 0
          typeNextChar()
        } else if (currentTextRef.current === 'title') {
          currentTextRef.current = 'description'
          typewriterIndexRef.current = 0
          typeNextChar()
        }
      }, delayBetweenTexts)
    }
    
    const typeNextChar = () => {
      const currentText = getCurrentText()
      const currentSetter = getCurrentSetter()
      
      // Check if current text is complete
      if (isCurrentTextComplete()) {
        // Current text is fully complete, move to next
        moveToNextText()
        return
      }
      
      // Continue typing current character
      currentSetter(currentText.substring(0, typewriterIndexRef.current + 1))
      typewriterIndexRef.current++
      timeoutId = setTimeout(typeNextChar, typingSpeed)
    }
    
    // Start typing after a shorter delay
    const startTimer = setTimeout(() => {
      typeNextChar()
    }, 300)
    
    return () => {
      clearTimeout(startTimer)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  const openCertificate = (certificateUrl: string) => {
    setSelectedCertificate(certificateUrl)
  }

  // Load and render PDF when modal opens
  useEffect(() => {
    if (selectedCertificate && selectedCertificate.endsWith('.pdf') && canvasContainerRef.current) {
      const loadPDF = async () => {
        try {
          // Show loading
          if (canvasContainerRef.current) {
            canvasContainerRef.current.innerHTML = '<div class="certificate-loading">Loading certificate...</div>'
          }
          
          // Fetch PDF as array buffer to bypass restrictions
          const response = await fetch(selectedCertificate)
          const arrayBuffer = await response.arrayBuffer()
          
          // Load PDF document from array buffer - this bypasses permission restrictions
          const loadingTask = pdfjsLib.getDocument({
            data: arrayBuffer,
            verbosity: 0
          })
          
          const pdf = await loadingTask.promise
          
          // Clear container
          if (canvasContainerRef.current) {
            canvasContainerRef.current.innerHTML = ''
          }
          
          // Render all pages
          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum)
            const viewport = page.getViewport({ scale: 2.0 })
            
            const canvas = document.createElement('canvas')
            canvas.width = viewport.width
            canvas.height = viewport.height
            canvas.className = 'certificate-pdf-canvas'
            canvas.style.width = '100%'
            canvas.style.height = 'auto'
            canvas.style.display = 'block'
            canvas.style.marginBottom = '1rem'
            
            const context = canvas.getContext('2d')
            if (context) {
              await page.render({
                canvas: canvas,
                canvasContext: context,
                viewport: viewport
              }).promise
            }
            
            const div = document.createElement('div')
            div.appendChild(canvas)
            if (canvasContainerRef.current) {
              canvasContainerRef.current.appendChild(div)
            }
          }
          
          // Remove any permission messages that might appear - aggressive cleanup
          const removePermissionMessages = () => {
            if (!canvasContainerRef.current) return
            
            // Check the entire modal content, not just the container
            const modalContent = document.querySelector('.certificate-modal-content')
            if (modalContent) {
              const allElements = modalContent.querySelectorAll('*')
              allElements.forEach(el => {
                const text = (el.textContent || '').trim()
                const lowerText = text.toLowerCase()
                if (lowerText.includes('permission') || 
                    lowerText.includes('limited') ||
                    lowerText.includes('view permissions') ||
                    lowerText.includes('this file has limited') ||
                    lowerText.includes('may not have access')) {
                  const htmlEl = el as HTMLElement
                  htmlEl.style.display = 'none'
                  htmlEl.style.visibility = 'hidden'
                  htmlEl.style.opacity = '0'
                  htmlEl.style.height = '0'
                  htmlEl.style.width = '0'
                  htmlEl.style.overflow = 'hidden'
                  el.remove()
                }
              })
            }
            
            // Also check canvas container
            const allElements = canvasContainerRef.current.querySelectorAll('*')
            allElements.forEach(el => {
              const text = (el.textContent || '').trim()
              const lowerText = text.toLowerCase()
              if (lowerText.includes('permission') || 
                  lowerText.includes('limited') ||
                  lowerText.includes('view permissions') ||
                  lowerText.includes('this file has limited')) {
                const htmlEl = el as HTMLElement
                htmlEl.style.display = 'none'
                el.remove()
              }
            })
            
            // Remove any iframes, objects, or embeds
            const mediaElements = canvasContainerRef.current.querySelectorAll('iframe, object, embed')
            mediaElements.forEach(el => el.remove())
          }
          
          // Run cleanup multiple times to catch any dynamically added elements
          removePermissionMessages()
          setTimeout(removePermissionMessages, 50)
          setTimeout(removePermissionMessages, 100)
          setTimeout(removePermissionMessages, 200)
          setTimeout(removePermissionMessages, 500)
          
          // Use MutationObserver to continuously watch for permission messages
          if (canvasContainerRef.current) {
            const observer = new MutationObserver(() => {
              removePermissionMessages()
            })
            
            observer.observe(canvasContainerRef.current, {
              childList: true,
              subtree: true,
              characterData: true
            })
            
            // Also observe the modal content
            const modalContent = document.querySelector('.certificate-modal-content')
            if (modalContent) {
              observer.observe(modalContent, {
                childList: true,
                subtree: true,
                characterData: true
              })
            }
            
            // Disconnect after 2 seconds to avoid performance issues
            setTimeout(() => {
              observer.disconnect()
            }, 2000)
          }
        } catch (error) {
          console.error('Error loading PDF:', error)
          if (canvasContainerRef.current) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown error'
            canvasContainerRef.current.innerHTML = `<div class="certificate-loading">Error loading certificate: ${errorMsg}</div>`
          }
        }
      }
      
      // Small delay to ensure modal is rendered
      const timer = setTimeout(() => {
        loadPDF()
      }, 100)
      
      return () => clearTimeout(timer)
    }
  }, [selectedCertificate])

  const closeCertificate = () => {
    setSelectedCertificate(null)
    if (canvasContainerRef.current) {
      canvasContainerRef.current.innerHTML = ''
    }
  }

  // Close enlarged image on ESC key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (enlargedImage) {
          setEnlargedImage(null)
        }
        if (selectedProject) {
          closeProjectModal()
        }
      }
    }

    if (enlargedImage || selectedProject) {
      document.addEventListener('keydown', handleEsc)
    }

    return () => {
      document.removeEventListener('keydown', handleEsc)
    }
  }, [enlargedImage, selectedProject])

  // Handle browser back button for modal
  useEffect(() => {
    const handlePopState = () => {
      // If modal is open and back button is pressed, close it smoothly
      if (selectedProject && !isModalClosing) {
        setIsModalClosing(true)
        setTimeout(() => {
          setSelectedProject(null)
          setSelectedScreenshotIndex(0)
          setIsModalClosing(false)
          document.body.style.overflow = ''
        }, 300) // Match animation duration
      }
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [selectedProject, isModalClosing])


  const openProjectModal = (project: any) => {
    setSelectedProject(project)
    setSelectedScreenshotIndex(0)
    document.body.style.overflow = 'hidden'
    // Add to browser history for back button support
    window.history.pushState({ modalOpen: true, projectId: project.id }, '', `#project-${project.id}`)
  }

  const closeProjectModal = () => {
    setIsModalClosing(true)
    setTimeout(() => {
      setSelectedProject(null)
      setSelectedScreenshotIndex(0)
      setIsModalClosing(false)
      document.body.style.overflow = ''
      // Go back in history if we pushed a state
      if (window.history.state && window.history.state.modalOpen) {
        window.history.back()
      }
    }, 300) // Match animation duration
  }

  const truncateDescription = (text: string, maxLength: number = 100): string => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + '...'
  }

  // Main portfolio page
  return (
    <div className={`portfolio ${darkMode ? 'dark-mode' : ''}`} key="main-portfolio">
      {/* Skip to main content for accessibility */}
      <a href="#home" className="skip-to-main" aria-label="Skip to main content">
        Skip to main content
      </a>
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo" role="banner">Clarence Portugal</div>
          <div className="nav-right">
            <ul className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`} role="navigation" aria-label="Main navigation">
              <div className="mobile-menu-header">
                <button className="theme-toggle theme-toggle-mobile" onClick={toggleDarkMode} aria-label="Toggle dark mode">
                  {darkMode ? '☀️' : '🌙'}
                </button>
      </div>
            <li><a href="#home" onClick={closeMobileMenu}>Home</a></li>
            <li><a href="#about" onClick={closeMobileMenu}>About</a></li>
            <li><a href="#projects" onClick={closeMobileMenu}>Projects</a></li>
            <li><a href="#skills" onClick={closeMobileMenu}>Skills</a></li>
            <li><a href="#certificates" onClick={closeMobileMenu}>Certificates</a></li>
            <li><a href="#contact" onClick={closeMobileMenu}>Contact</a></li>
            </ul>
            <button className="theme-toggle theme-toggle-desktop" onClick={toggleDarkMode} aria-label="Toggle dark mode">
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button className="mobile-menu-toggle" onClick={toggleMobileMenu} aria-label="Toggle menu">
              <span className={mobileMenuOpen ? 'hamburger open' : 'hamburger'}>
                <span></span>
                <span></span>
                <span></span>
              </span>
        </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero fade-in" aria-label="Home section">
        <div className="hero-content">
          <div className="hero-image">
            <div className="image-placeholder">
              <img 
                src={profileImage} 
                alt="Clarence Portugal" 
                className="profile-img" 
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
          <div className="hero-text">
            <h1 className="hero-name">
              {typewriterName}
            </h1>
            <p className="hero-title">
              {typewriterTitle}
            </p>
            <p className="hero-description">
              {typewriterDescription}
            </p>
            <div className="hero-buttons">
              <a href="#projects" className="btn btn-primary" aria-label="View my projects">View My Work</a>
              <a href="#contact" className="btn btn-outline" aria-label="Get in touch">Get In Touch</a>
              <a href="/resume.pdf" download className="btn btn-outline" aria-label="Download resume">
                <svg className="btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Download Resume
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about fade-in" aria-label="About section">
        <div className="container">
          <h2 className="section-title">About Me</h2>
          <div className="about-content">
            <div className="about-text">
              <p>
                I'm a 4th year college student at Camarines Norte State College (CNSC), currently pursuing 
                my degree while building websites and mobile applications. I also take on freelance projects 
                to gain real-world experience and work with different clients.
              </p>
              <p>
                I love the process of turning ideas into reality through code. From creating responsive websites 
                to developing mobile apps and even working with IoT systems, I enjoy the challenge of solving 
                problems and building solutions that people actually use.
              </p>
              <p>
                When I'm not working on school projects or client work, I spend my time exploring new 
                technologies, experimenting with different frameworks, and working on personal projects that 
                spark my interest. I believe in continuous learning and always staying curious about what's 
                next in tech.
        </p>
      </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="projects fade-in" aria-label="Projects section">
        <div className="container">
          <h2 className="section-title">My Projects</h2>
          <div className="project-search-container">
            <input
              type="text"
              className="project-search"
              placeholder="Search projects by name or technology..."
              value={projectSearch}
              onChange={(e) => setProjectSearch(e.target.value)}
              aria-label="Search projects"
            />
          </div>
          <div className="project-filters" role="tablist" aria-label="Project filters">
            <button 
              className={`filter-btn ${projectFilter === 'all' ? 'active' : ''}`}
              onClick={() => setProjectFilter('all')}
              aria-label="Show all projects"
              role="tab"
              aria-selected={projectFilter === 'all'}
            >
              All
            </button>
            <button 
              className={`filter-btn ${projectFilter === 'app' ? 'active' : ''}`}
              onClick={() => setProjectFilter('app')}
              aria-label="Show mobile app projects"
              role="tab"
              aria-selected={projectFilter === 'app'}
            >
              Mobile App
            </button>
            <button 
              className={`filter-btn ${projectFilter === 'iot' ? 'active' : ''}`}
              onClick={() => setProjectFilter('iot')}
              aria-label="Show IoT and robotics projects"
              role="tab"
              aria-selected={projectFilter === 'iot'}
            >
              IOT/Robotics
            </button>
            <button 
              className={`filter-btn ${projectFilter === 'website' ? 'active' : ''}`}
              onClick={() => setProjectFilter('website')}
              aria-label="Show website projects"
              role="tab"
              aria-selected={projectFilter === 'website'}
            >
              Website
            </button>
          </div>
          <div className="projects-grid">
            {[
              {
                id: 'arice',
                image: ariceImage,
                title: 'ARICE',
                description: 'Digital Automated Rice Dispenser and Sealing with AI-Assistance and Smart Storage Notification. ARICE is a comprehensive IoT-enabled mobile application that revolutionizes rice purchasing through automation. Users can make secure online payments through the mobile app, and after payment confirmation, the application controls Arduino-based dispensers to automatically dispense the exact amount purchased. Features AI assistance for intelligent inventory management and smart storage notifications. Built with Flutter, Dart, MongoDB, and Arduino.',
                tags: ['Flutter', 'Dart', 'VS Code', 'MongoDB', 'Arduino', 'IoT', 'Mobile App', 'Payment Integration'],
                category: ['app', 'iot'],
                github: 'https://github.com/clarenceportugal/Arice',
                screenshots: [ariceScreenshot],
                startDate: 'November 20, 2024',
                endDate: 'November 27, 2024',
                collaborators: [
                  { name: 'Clarence Portugal', image: profileImage }
                ]
              },
              {
                id: 'caci',
                image: caciImage,
                title: 'CACI',
                description: 'CACI is a comprehensive quiz game application designed for grade 10 students to test their knowledge across various subjects. Features engaging gameplay mechanics, progress tracking with detailed statistics, daily goals, level progression, achievements, and competitive elements. The gamified learning approach makes studying fun and interactive. Built with Flutter and Dart.',
                tags: ['Flutter', 'Dart', 'VS Code', 'Mobile App', 'Educational'],
                category: 'app',
                github: 'https://github.com/clarenceportugal/CACI',
                screenshots: [caciDesign1, caciDesign2, caciDesign3, caciDesign4, caciDesign5, caciDesign6, caciDesign7],
                startDate: 'November 2025',
                endDate: 'December 2025',
                collaborators: [
                  { name: 'Clarence Portugal', image: profileImage }
                ]
              },
              {
                id: 'eduvision',
                image: eduvisionImage,
                title: 'EduVision',
                description: 'An AI-powered facial recognition attendance system for the College of Computing and Multimedia Studies (CCMS) at CNSC. Utilizes IoT-based smart cameras and cloud-based database to automate faculty attendance tracking. Features contactless verification, real-time monitoring, and secure record-keeping through web and mobile applications. Built with Python, React, TypeScript, and C++.',
                tags: ['Python', 'React', 'TypeScript', 'C++', 'Cython', 'IoT', 'Website', 'System', 'AI', 'Facial Recognition'],
                category: 'website',
                github: 'https://github.com/clarenceportugal/facerecog',
                startDate: 'April 2025',
                endDate: 'December 2025',
                collaborators: [
                  { name: 'Clarence Portugal', image: profileImage }
                ]
              },
              {
                id: 'emuklat',
                image: emuklatImage,
                title: 'E-Muklat',
                description: 'E-Muklat is a mobile application designed to celebrate and preserve the local culture and stories of Labo, Camarines Norte. The app serves as a digital platform where users can upload videos and stories about places, creating a rich repository of local experiences. Features secure user authentication, comprehensive content sharing, and community engagement. Built with Java, XML, Android Studio, and Firebase.',
                tags: ['Java', 'XML', 'Android Studio', 'Firebase', 'Mobile App'],
                category: 'app',
                github: 'https://github.com/clarenceportugal/e-muklat',
                screenshots: [emuklatScreenshot],
                startDate: 'April 2025',
                endDate: 'March 2025',
                collaborators: [
                  { name: 'Clarence Portugal', image: profileImage }
                ],
                clients: [
                  { name: 'Janna', image: jannaProfileImage },
                  { name: 'Lyka', image: lykaProfileImage }
                ]
              },
              {
                id: 'gama',
                image: gamaImage,
                title: 'GAMA',
                description: 'Geometry and Algebra Adventures (GAMA) is an innovative educational mobile application that transforms mathematics learning into an exciting adventure. The app makes learning geometry and algebra concepts fun through engaging gameplay and visual learning techniques. Features interactive exercises, puzzles, challenges, and cloud-based progress tracking. Built with Flutter, Dart, and Firebase.',
                tags: ['Flutter', 'Dart', 'VS Code', 'Firebase', 'Mobile App'],
                category: 'app',
                github: 'https://github.com/clarenceportugal/GAMA',
                screenshots: [gamaScreenshot],
                startDate: 'March 2025',
                endDate: 'May 2025',
                collaborators: [
                  { name: 'Clarence Portugal', image: profileImage }
                ]
              },
              {
                id: 'likhain',
                image: likhainImage,
                title: 'Likhain',
                description: 'Likhain is a comprehensive creative platform designed for poem writers to express their thoughts and creativity through poetry. The platform serves as a digital sanctuary where writers can share original poems, discover inspiring works, and connect with a supportive community. Features poem publishing, commenting, real-time interactions, and community engagement. Built with React, TypeScript, and Firebase.',
                tags: ['React', 'TypeScript', 'Firebase', 'Website', 'VS Code'],
                category: 'website',
                github: 'https://github.com/clarenceportugal/Likhain',
                startDate: 'December 2025',
                endDate: 'Present',
                collaborators: [
                  { name: 'Clarence Portugal', image: profileImage }
                ]
              },
              {
                id: 'quizme',
                image: quizmeImage,
                title: 'QuizMe',
                description: 'A comprehensive mobile quiz application designed to make learning and knowledge testing fun and interactive. QuizMe allows users to test their knowledge across various topics and challenge friends in competitive quiz sessions. Features modern UI, gamified learning, and cross-platform compatibility. Built with Flutter, Dart, and MongoDB.',
                tags: ['Flutter', 'Dart', 'VS Code', 'MongoDB', 'Mobile App', 'UI/UX'],
                category: 'app',
                github: 'https://github.com/clarenceportugal/QuizMe',
                screenshots: [quizmeScreenshot],
                startDate: 'June 2025',
                endDate: 'July 2025',
                collaborators: [
                  { name: 'Clarence Portugal', image: profileImage },
                  { name: 'Joe', image: quizmeJoe },
                  { name: 'John Loyd', image: quizmeJohnLoyd },
                  { name: 'John Michael', image: quizmeJohnMichael }
                ]
              },
              {
                id: 'trinova',
                image: trinovaImage,
                title: 'Trinova',
                description: 'Trinova is an innovative educational device designed to help students learn mathematical functions and topics, with a special focus on trigonometry. This Arduino-based IoT device features an interactive keypad interface and LCD display showing trigonometric functions, laws of sines and cosines, and the SOH CAH TOA mnemonic. Offers hands-on, tactile learning experience. Built with Arduino and C++.',
                tags: ['Arduino', 'IoT', 'Educational', 'Embedded System', 'C++'],
                category: 'robotics',
                startDate: 'November 1, 2025',
                endDate: 'November 3, 2025',
                collaborators: [
                  { name: 'Clarence Portugal', image: profileImage }
                ]
              },
              {
                id: 'motowash',
                image: motowashImage,
                title: 'Motowash 360',
                description: 'Motowash 360 is a radically innovative vendo machine solution for automating motor cleaning. This IoT-enabled system uses Arduino Uno with sensors and motors for vehicle detection and automated cleaning operations. Features coin-operated and mobile payment systems, React Native app for remote control and monitoring, and Firebase for data management. Combines hardware automation with modern mobile technology.',
                tags: ['Arduino', 'IoT', 'React Native', 'Firebase', 'Sensors', 'Mobile App', 'Automation', 'Robotics'],
                category: ['app', 'iot'],
                startDate: 'March 2024',
                endDate: 'July 2024',
                collaborators: [
                  { name: 'Clarence Portugal', image: profileImage },
                  { name: 'Joe', image: motowashJoe },
                  { name: 'John Loyd', image: motowashJohnLoyd },
                  { name: 'Leah', image: motowashLeah }
                ]
              },
              {
                id: 'rccar',
                image: rccarImage,
                title: 'RC Car Robot',
                description: 'An Arduino-based robotics project featuring a remote-controlled car with advanced autonomous capabilities. Can be controlled remotely via Bluetooth and includes line following with infrared sensors, obstacle avoidance with ultrasonic sensors, and environmental detection with light sensors. Built with Arduino Uno, L298N Motor Driver, HC-05 Bluetooth module, and various sensors.',
                tags: ['Arduino', 'Robotics', 'IoT', 'Bluetooth', 'Sensors', 'Line Following', 'Obstacle Avoidance', 'Automation', 'C++'],
                category: 'iot',
                startDate: 'March 13, 2024',
                endDate: 'March 13, 2024',
                collaborators: [
                  { name: 'Clarence Portugal', image: profileImage },
                  { name: 'Joe', image: rccarJoe },
                  { name: 'John Loyd', image: rccarJohnLoyd },
                  { name: 'Leah', image: rccarLeah }
                ]
              },
              {
                id: 'ancestralhouse',
                image: ancestralhouseImage,
                title: 'Rufino Pabico Ancestral House',
                description: 'An IoT smart home automation system for the Rufino Pabico Ancestral House model. Features a React Native mobile application for remote control and monitoring of fountain, lighting systems, motion sensors, and light sensors. Enables automated and manual control through mobile app interface. Built with Arduino, IoT sensors, React Native, and Firebase.',
                tags: ['Arduino', 'IoT', 'React Native', 'Firebase', 'Sensors', 'Motion Sensor', 'Light Sensor', 'Smart Home', 'Mobile App', 'Automation'],
                category: 'iot',
                startDate: 'September 2024',
                endDate: 'October 2024',
                collaborators: [
                  { name: 'Clarence Portugal', image: profileImage },
                  { name: 'Joe', image: ancestralhouseJoe },
                  { name: 'John Loyd', image: ancestralhouseJohnLoyd },
                  { name: 'Leah', image: ancestralhouseLeah }
                ]
              },
              {
                id: 'chess',
                image: chessImage,
                title: 'Learn with Heinz Chess Beginners Guide',
                description: 'Mobile application designed to teach chess fundamentals to beginners. Features step-by-step guides, tutorials, practice exercises, and detailed explanations of chess pieces and strategies. Built with Java, XML, and Android Studio.',
                tags: ['Java', 'XML', 'Android Studio', 'Mobile App', 'Educational'],
                category: 'app',
                startDate: 'October 2023',
                endDate: 'November 2023',
                collaborators: [
                  { name: 'Clarence Portugal', image: profileImage }
                ]
              }
            ]
              .filter(project => {
                // Filter by category
                let categoryMatch = true
                if (projectFilter !== 'all') {
                  if (projectFilter === 'iot') {
                    // IOT/Robotics filter should show both iot and robotics
                    if (Array.isArray(project.category)) {
                      categoryMatch = project.category.includes('iot') || project.category.includes('robotics')
                    } else {
                      categoryMatch = project.category === 'iot' || project.category === 'robotics'
                    }
                  } else {
                    if (Array.isArray(project.category)) {
                      categoryMatch = project.category.includes(projectFilter)
                    } else {
                      categoryMatch = project.category === projectFilter
                    }
                  }
                }
                
                // Filter by search
                const searchLower = projectSearch.toLowerCase()
                const searchMatch = !projectSearch || 
                  project.title.toLowerCase().includes(searchLower) ||
                  project.description.toLowerCase().includes(searchLower) ||
                  project.tags.some(tag => tag.toLowerCase().includes(searchLower))
                
                return categoryMatch && searchMatch
              })
              .map(project => {
                // Ensure we have a valid description
                const description = String(project.description || '') // Ensure it's a string
                
                // Always show summarized description
                // For chess project, truncate to end exactly at "Features" (78 characters)
                const maxLength = project.id === 'chess' ? 78 : 100
                const displayDescription = truncateDescription(description, maxLength)
                
                return (
                  <article 
                    id={`project-${project.id}`}
                    key={project.id} 
                    className="project-card fade-in"
                    aria-label={`${project.title} project`}
                    onClick={(e) => {
                      // Don't trigger if clicking on links, collaborators, or client
                      const target = e.target as HTMLElement
                      if (target.closest('.project-link') || 
                          target.closest('a') ||
                          target.closest('.collaborator-item') ||
                          target.closest('.client-item') ||
                          target.closest('.project-collaborators') ||
                          target.closest('.project-client') ||
                          target.closest('.clients-list')) {
                        return
                      }
                      openProjectModal(project)
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="project-image">
                      <img 
                        src={project.image} 
                        alt={`${project.title} logo`} 
                        className="project-img" 
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="project-info">
                      <h3>{project.title}</h3>
                      <div className="project-description-wrapper">
                        <p>{displayDescription}</p>
                      </div>
                      <div className="project-tags">
                        {project.tags.map((tag, index) => (
                          <span key={index} className={index >= 3 ? 'project-tag-hidden-desktop' : ''}>{tag}</span>
                        ))}
                        {project.tags.length > 3 && (
                          <span className="project-tag-more project-tag-more-desktop">+{project.tags.length - 3}</span>
                        )}
                      </div>
                    </div>
                  </article>
                )
              })}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="skills fade-in" aria-label="Skills section">
        <div className="container">
          <h2 className="section-title">Skills</h2>
          <div className="skills-grid">
            <div className="skill-category">
              <h3>Frontend & Mobile</h3>
              <div className="skill-items">
                <span className="skill-item">
                  <svg className="skill-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="2" fill="currentColor"/>
                    <ellipse cx="12" cy="12" rx="11" ry="4.2" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                    <ellipse cx="12" cy="12" rx="11" ry="4.2" fill="none" stroke="currentColor" strokeWidth="1.5" transform="rotate(60 12 12)"/>
                    <ellipse cx="12" cy="12" rx="11" ry="4.2" fill="none" stroke="currentColor" strokeWidth="1.5" transform="rotate(-60 12 12)"/>
                  </svg>
                  React
                </span>
                <span className="skill-item">
                  <svg className="skill-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="2" y="2" width="20" height="20" rx="2" fill="currentColor" opacity="0.2"/>
                    <path d="M8 8h8v2h-3v6h3v2H8V8zm9 0h2v8h-2V8z" fill="currentColor"/>
                  </svg>
                  TypeScript
                </span>
                <span className="skill-item">
                  <svg className="skill-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14.314 0L2.3 12 6 15.7 21.684 0zm-8.128 12L13.542 24l8.142-8.3L14.314 3.7z" fill="currentColor"/>
                  </svg>
                  Flutter
                </span>
                <span className="skill-item">
                  <svg className="skill-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4.105 4.105S9.158 1.58 11.684 1.58c2.525 0 7.579 2.525 7.579 2.525l-7.579 7.579-7.579-7.579zm0 0L1.58 6.658v10.526l2.525 2.525 7.579-7.579-7.579-7.579zm14.316 0L24 6.658v10.526l-2.525 2.525-5.474-5.474 5.474-5.474zM9.158 19.737l-2.525 2.525L1.58 19.737v-2.525l5.053-5.053 2.525 2.525v5.053z" fill="currentColor"/>
                  </svg>
                  Dart
                </span>
                <span className="skill-item">
                  <svg className="skill-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.851 18.56s-.908.602.778.851c1.562.24 2.441.24 4.285.12 1.845-.12 3.125-.24 4.285-.24 1.562 0 2.281.24 2.281.24l-1.562-1.08s-1.08-.24-2.281-.24c-1.2 0-2.521.12-3.965.12-1.443 0-2.762-.12-3.841-.36zm-.24-2.521s-1.08.72.72.96c1.562.24 2.881.36 4.525.36 1.443 0 3.125-.12 4.525-.36 1.2-.24 2.281-.48 2.881-.48l-1.443-1.08s-1.08-.24-2.281-.24c-1.2 0-2.521.12-3.965.12-1.443 0-2.762-.12-3.841-.36zm1.443-2.641s-1.08.72.72.96c1.562.24 2.881.36 4.525.36 1.443 0 3.125-.12 4.525-.36 1.2-.24 2.281-.48 2.881-.48l-1.443-1.08s-1.08-.24-2.281-.24c-1.2 0-2.521.12-3.965.12-1.443 0-2.762-.12-3.841-.36z" fill="currentColor"/>
                    <path d="M15.236 2.4c-1.443 0-2.521.24-3.125.72l-.48.36s.36-.24 1.08-.48c1.08-.36 2.281-.36 3.125-.24.72.12 1.443.24 1.443.24l-.48-.36c-.36-.24-1.2-.48-1.924-.48z" fill="currentColor"/>
                  </svg>
                  Java
                </span>
                <span className="skill-item">
                  <svg className="skill-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 8l2 2-2 2M18 8l-2 2 2 2M13 7l-2 5 2 5" fill="currentColor"/>
                  </svg>
                  XML
                </span>
                <span className="skill-item">
                  <svg className="skill-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13.5 2L2 7l11.5 5L25 7 13.5 2zm0 10L2 17l11.5 5L25 17l-11.5-5z" fill="currentColor"/>
                  </svg>
                  React Native
                </span>
                <span className="skill-item">
                  <svg className="skill-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622h10.125l-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.955-.81-.188-2.11h-2.61l.29 3.855L12 19.288l5.373-1.53L18.59 4.414z" fill="currentColor"/>
                  </svg>
                  HTML/CSS
                </span>
              </div>
            </div>
            <div className="skill-category">
              <h3>Backend & Database</h3>
              <div className="skill-items">
                <span className="skill-item">
                  <svg className="skill-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14.985 3.752v3.64c0 1.107-.896 2.005-2.005 2.005H7.995C5.76 9.397 3.752 7.39 3.752 5.155c0-1.107.896-2.005 2.005-2.005h9.228zm-1.337 0c.552 0 1 .448 1 1s-.448 1-1 1-1-.448-1-1 .448-1 1-1z" fill="currentColor"/>
                    <path d="M9.015 20.248v-3.64c0-1.107.896-2.005 2.005-2.005h4.985c2.235 0 4.243-2.007 4.243-4.243 0-1.107-.896-2.005-2.005-2.005H9.015zm1.337 0c-.552 0-1-.448-1-1s.448-1 1-1 1 .448 1 1-.448 1-1 1z" fill="currentColor"/>
                  </svg>
                  Python
                </span>
                <span className="skill-item">
                  <svg className="skill-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.394 6c-.167-.29-.398-.543-.652-.69L12.926.92c-.508-.293-1.34-.293-1.848 0L2.26 5.31c-.508.293-.923 1.024-.923 1.616v9.148c0 .592.415 1.323.923 1.616l8.818 5.39c.508.293 1.34.293 1.848 0l8.818-5.39c.254-.147.485-.4.652-.69.167-.29.252-.618.252-.926V6.926c0-.308-.085-.636-.252-.926z" fill="currentColor"/>
                    <path d="M6.396 11.4v1.2H5.1v-1.2H3.9V9h1.2V7.8h1.296V9h1.2v2.4zm6.6 0h-1.2l1.8-2.4H12.6V9h2.4v.6h-1.8l1.8 2.4h-1.2zm5.304 0c-.6 0-1.2-.3-1.5-.9l1.2-.6c.15.3.45.45.75.3.3-.15.45-.45.3-.75-.15-.3-.45-.45-.75-.3l-1.2-.6c.3-.6.9-.9 1.5-.9.6 0 1.2.3 1.5.9l-1.2.6c-.15-.3-.45-.45-.75-.3-.3.15-.45.45-.3.75.15.3.45.45.75.3l1.2.6c-.3.6-.9.9-1.5.9z" fill="#fff"/>
                  </svg>
                  C++
                </span>
                <span className="skill-item">
                  <svg className="skill-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14.985 3.752v3.64c0 1.107-.896 2.005-2.005 2.005H7.995C5.76 9.397 3.752 7.39 3.752 5.155c0-1.107.896-2.005 2.005-2.005h9.228zm-1.337 0c.552 0 1 .448 1 1s-.448 1-1 1-1-.448-1-1 .448-1 1-1z" fill="currentColor"/>
                    <path d="M9.015 20.248v-3.64c0-1.107.896-2.005 2.005-2.005h4.985c2.235 0 4.243-2.007 4.243-4.243 0-1.107-.896-2.005-2.005-2.005H9.015zm1.337 0c-.552 0-1-.448-1-1s.448-1 1-1 1 .448 1 1-.448 1-1 1z" fill="currentColor"/>
                    <text x="12" y="16" fontSize="6" fill="currentColor" textAnchor="middle" fontWeight="bold">C</text>
                  </svg>
                  Cython
                </span>
                <span className="skill-item">
                  <svg className="skill-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.89 15.672L6.255.461A.542.542 0 017.27.288l2.543 4.771zm16.794 3.696l-2.25-14a.54.54 0 00-.919-.295L3.316 19.365l7.856 4.427a1.621 1.621 0 001.588 0zM14.3 7.147l-1.82-3.482a.542.542 0 00-.96 0L3.53 17.984z" fill="currentColor"/>
                  </svg>
                  Firebase
                </span>
                <span className="skill-item">
                  <svg className="skill-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.193 9.555c-1.264-5.58-4.252-7.414-4.823-8.96-.294-.776-.449-1.4-1.151-1.4-.701 0-.908.658-1.151 1.4-.572 1.546-3.559 3.38-4.823 8.96-1.264 5.58.242 9.689.937 10.999.694 1.31 2.545 1.855 4.037 1.855s3.342-.545 4.037-1.855c.695-1.31 2.201-5.419.937-10.999zm-5.597 8.034c-1.219 0-2.4-.616-2.4-2.4 0-1.784 1.181-2.4 2.4-2.4 1.219 0 2.4.616 2.4 2.4 0 1.784-1.181 2.4-2.4 2.4z" fill="currentColor"/>
                  </svg>
                  MongoDB
                </span>
              </div>
            </div>
            <div className="skill-category">
              <h3>Tools & Technologies</h3>
              <div className="skill-items">
                <span className="skill-item">
                  <svg className="skill-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.94a1.5 1.5 0 0 0-.85-1.353zm-5.146 14.861L10.826 12l7.178-5.448v10.896z" fill="currentColor"/>
                  </svg>
                  VS Code
                </span>
                <span className="skill-item">
                  <svg className="skill-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5508 0 .9993.4485.9993.9993.0001.5511-.4485.9997-.9993.9997m-11.0225 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5508 0 .9993.4485.9993.9993 0 .5511-.4485.9997-.9993.9997m11.0225-6.2136H6.5008c-.2764 0-.5004-.2242-.5004-.5006 0-.2761.224-.5004.5004-.5004h11.0225c.2764 0 .5004.2243.5004.5004.0001.2764-.224.5006-.5004.5006M12 20.5896c-4.1246 0-7.4782-3.354-7.4782-7.4782s3.3536-7.4782 7.4782-7.4782 7.4782 3.354 7.4782 7.4782-3.3536 7.4782-7.4782 7.4782M12 3.8361c-5.0797 0-9.2109 4.1312-9.2109 9.2109s4.1312 9.2109 9.2109 9.2109 9.2109-4.1312 9.2109-9.2109S17.0797 3.8361 12 3.8361" fill="currentColor"/>
                  </svg>
                  Android Studio
                </span>
                <span className="skill-item">
                  <svg className="skill-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.424 5.595c-.552 0-.999.448-.999 1s.447 1 .999 1c.551 0 .998-.448.998-1s-.447-1-.998-1m-11.848 0c-.551 0-.998.448-.998 1s.447 1 .998 1c.552 0 .999-.448.999-1s-.447-1-.999-1m11.848 4.001H6.424c-.276 0-.5.224-.5.5s.224.5.5.5h11.152c.276 0 .5-.224.5-.5s-.224-.5-.5-.5M12 20.354c-3.905 0-7.09-3.186-7.09-7.09 0-3.905 3.185-7.09 7.09-7.09 3.904 0 7.09 3.185 7.09 7.09 0 3.904-3.186 7.09-7.09 7.09M12 3.754c-5.238 0-9.5 4.262-9.5 9.5s4.262 9.5 9.5 9.5 9.5-4.262 9.5-9.5-4.262-9.5-9.5-9.5" fill="currentColor"/>
                  </svg>
                  Arduino
                </span>
                <span className="skill-item">
                  <svg className="skill-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="2" x2="12" y2="6"></line>
                    <line x1="12" y1="18" x2="12" y2="22"></line>
                    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                    <line x1="2" y1="12" x2="6" y2="12"></line>
                    <line x1="18" y1="12" x2="22" y2="12"></line>
                    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                  </svg>
                  IoT
                </span>
                <span className="skill-item">
                  <svg className="skill-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44L2 22"></path>
                    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44L22 22"></path>
                  </svg>
                  AI
                </span>
                <span className="skill-item">
                  <svg className="skill-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  Facial Recognition
                </span>
                <span className="skill-item">
                  <svg className="skill-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                    <line x1="8" y1="21" x2="16" y2="21"></line>
                    <line x1="12" y1="17" x2="12" y2="21"></line>
                  </svg>
                  UI/UX
                </span>
                <span className="skill-item">
                  <svg className="skill-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"></path>
                  </svg>
                  Sensors
                </span>
                <span className="skill-item">
                  <svg className="skill-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"></path>
                  </svg>
                  Bluetooth
                </span>
                <span className="skill-item">
                  <svg className="skill-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                    <circle cx="8" cy="10" r="2"></circle>
                    <path d="M18 10l-4 4 4 4"></path>
                  </svg>
                  Robotics
                </span>
                <span className="skill-item">
                  <svg className="skill-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 6v6l4 2"></path>
                  </svg>
                  Automation
                </span>
                <span className="skill-item">
                  <svg className="skill-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                  Payment Integration
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certificates Section */}
      <section id="certificates" className="certificates fade-in" aria-label="Certificates section">
        <div className="container">
          <h2 className="section-title">Certificates</h2>
          <div className="certificates-grid">
            <div className="certificate-card" onClick={() => openCertificate('/certificates/CERTIFICATE.pdf')}>
              <div className="certificate-preview">
                <object 
                  data="/certificates/CERTIFICATE.pdf#toolbar=0&navpanes=0&scrollbar=0"
                  type="application/pdf"
                  className="certificate-preview-pdf"
                  aria-label="TOPCIT Certificate Preview"
                >
                  <embed 
                    src="/certificates/CERTIFICATE.pdf#toolbar=0&navpanes=0&scrollbar=0"
                    type="application/pdf"
                    className="certificate-preview-pdf"
                  />
                </object>
                <div className="certificate-overlay">
                  <span className="certificate-view-text">Click to view full size</span>
                </div>
              </div>
              <div className="certificate-info">
                <h3>TOPCIT Certificate</h3>
                <p>Institute for Information & Communications Technology Promotion (IITP)</p>
                <p className="certificate-date">Date: June 2025</p>
              </div>
            </div>
            <div className="certificate-card" onClick={() => openCertificate(tesdaImage)}>
              <div className="certificate-preview">
                <img 
                  src={tesdaImage} 
                  alt="TESDA Certificate Preview" 
                  className="certificate-preview-image"
                  loading="lazy"
                  decoding="async"
                />
                <div className="certificate-overlay">
                  <span className="certificate-view-text">Click to view full size</span>
                </div>
              </div>
              <div className="certificate-info">
                <h3>Computer Systems Servicing NC II</h3>
                <p>St. Claire Institute of Arts and Technology Inc. - TESDA</p>
                <p className="certificate-date">Date: September 5, 2025</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certificate Modal */}
      {selectedCertificate && (
        <div className="certificate-modal" onClick={closeCertificate}>
          <div className="certificate-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="certificate-modal-close" onClick={closeCertificate}>×</button>
            {selectedCertificate.endsWith('.pdf') ? (
              <div className="certificate-pdf-container" ref={canvasContainerRef}>
                {/* PDF will be rendered here via canvas - no permission messages */}
              </div>
            ) : (
              <img 
                src={selectedCertificate} 
                alt="Certificate" 
                className="certificate-image"
              />
            )}
          </div>
        </div>
      )}

      {/* Contact Section */}
      <section id="contact" className="contact fade-in" aria-label="Contact section">
        <div className="container">
          <h2 className="section-title">Get In Touch</h2>
          <div className="contact-content">
            <p className="contact-description">
              I'm always open to discussing new projects, creative ideas, or opportunities
              to be part of your visions.
            </p>
            <div className="contact-info">
              <a href="mailto:portugalclarence15@gmail.com?subject=Contact%20from%20Clarence%20Portugal%20Portfolio" className="contact-item">
                <svg className="contact-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2-2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span>portugalclarence15@gmail.com</span>
              </a>
              <a href="https://www.facebook.com/renz42gal" target="_blank" rel="noopener noreferrer" className="contact-item">
                <svg className="contact-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </a>
              <a href="https://www.linkedin.com/in/clarence-portugal-0984643a1?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="contact-item">
                <svg className="contact-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Top Button */}
      <button 
        className={`back-to-top ${showBackToTop ? 'show' : ''}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
        title="Back to top"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 15l-6-6-6 6"/>
        </svg>
      </button>

      {/* Footer */}
      <footer className="footer fade-in" aria-label="Footer">
        <div className="container">
          <p>&copy; 2025 Clarence Portugal. All rights reserved.</p>
        </div>
      </footer>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div 
          className={`project-modal-overlay ${isModalClosing ? 'closing' : ''}`}
          onClick={closeProjectModal}
          aria-label="Close project details"
        >
          <div className={`project-modal-content ${isModalClosing ? 'closing' : ''}`} onClick={(e) => e.stopPropagation()}>
            <div className="project-modal-body">
              {/* Left Side - Logo and Screenshots */}
              <div className="project-modal-screenshots">
                {/* Logo */}
                <div className="project-modal-logo">
                  <img 
                    src={selectedProject.image} 
                    alt={`${selectedProject.title} logo`}
                    className="project-modal-logo-image"
                  />
                </div>
                
                {/* Screenshot Thumbnails */}
                {selectedProject.screenshots && selectedProject.screenshots.length > 0 && (
                  <div className="project-modal-thumbnails">
                    {selectedProject.screenshots.map((screenshot: string, index: number) => (
                      <div
                        key={index}
                        className={`project-modal-thumbnail ${selectedScreenshotIndex === index ? 'active' : ''}`}
                        onClick={() => setEnlargedImage({ url: screenshot, project: selectedProject, index: index })}
                      >
                        <img 
                          src={screenshot} 
                          alt={`${selectedProject.title} thumbnail ${index + 1}`}
                          className="project-modal-thumbnail-image"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Side - Details */}
              <div className="project-modal-details">
                <h2 className="project-modal-title">{selectedProject.title}</h2>
                {selectedProject.startDate && selectedProject.endDate && (
                  <div className="project-modal-date">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span>{selectedProject.startDate} - {selectedProject.endDate}</span>
                  </div>
                )}
                <p className="project-modal-description">{selectedProject.description}</p>
                
                <div className="project-modal-technologies">
                  <h3 className="project-modal-technologies-title">TECHNOLOGIES</h3>
                  <div className="project-modal-tags">
                    {selectedProject.tags.map((tag: string, index: number) => (
                      <span key={index} className="project-modal-tag">{tag}</span>
                    ))}
                  </div>
                </div>

                {(selectedProject as any).collaborators && (selectedProject as any).collaborators.length > 0 && (
                  <div className="project-modal-collaborators">
                    <h3 className="project-modal-section-title">COLLABORATORS</h3>
                    <div className="project-modal-collaborators-list">
                      {(selectedProject as any).collaborators.map((collaborator: { name: string; image: string }, index: number) => (
                        <div 
                          key={index} 
                          className="project-modal-collaborator-item" 
                          title={collaborator.name}
                          onClick={() => setEnlargedImage({ url: collaborator.image, project: null, index: -1 })}
                        >
                          <img 
                            src={collaborator.image} 
                            alt={collaborator.name}
                            className="project-modal-collaborator-image"
                            loading="lazy"
                          />
                          <span className="project-modal-collaborator-name">{collaborator.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(selectedProject as any).clients && (selectedProject as any).clients.length > 0 && (
                  <div className="project-modal-clients">
                    <h3 className="project-modal-section-title">CLIENTS</h3>
                    <div className="project-modal-clients-list">
                      {(selectedProject as any).clients.map((client: { name: string; image: string }, index: number) => (
                        <div 
                          key={index}
                          className="project-modal-client-item" 
                          title={client.name}
                          onClick={() => setEnlargedImage({ url: client.image, project: null, index: -1 })}
                        >
                          <img 
                            src={client.image} 
                            alt={client.name}
                            className="project-modal-client-image"
                            loading="lazy"
                          />
                          <span className="project-modal-client-name">{client.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="project-modal-actions">
                  {selectedProject.liveUrl && (
                    <a 
                      href={selectedProject.liveUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="project-modal-btn project-modal-btn-primary"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                      Visit Live Site
                    </a>
                  )}
                  {selectedProject.github && (
                    <a 
                      href={selectedProject.github} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="project-modal-btn project-modal-btn-secondary"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                      </svg>
                      View on GitHub
                    </a>
                  )}
                  <button 
                    className="project-modal-btn project-modal-btn-close"
                    onClick={closeProjectModal}
                  >
                    Close Project
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enlarged Image Modal */}
      {enlargedImage && (
        <div 
          className="image-modal-overlay" 
          onClick={() => setEnlargedImage(null)}
          aria-label="Close enlarged image"
        >
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="image-modal-close"
              onClick={() => setEnlargedImage(null)}
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            {enlargedImage.project && enlargedImage.project.screenshots && enlargedImage.index >= 0 && enlargedImage.index > 0 && (
              <button 
                className="image-modal-nav image-modal-prev"
                onClick={(e) => {
                  e.stopPropagation()
                  const prevIndex = enlargedImage.index - 1
                  setEnlargedImage({ 
                    url: enlargedImage.project.screenshots[prevIndex], 
                    project: enlargedImage.project, 
                    index: prevIndex 
                  })
                }}
                aria-label="Previous image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
            )}
            {enlargedImage.project && enlargedImage.project.screenshots && enlargedImage.index >= 0 && enlargedImage.index < enlargedImage.project.screenshots.length - 1 && (
              <button 
                className="image-modal-nav image-modal-next"
                onClick={(e) => {
                  e.stopPropagation()
                  const nextIndex = enlargedImage.index + 1
                  setEnlargedImage({ 
                    url: enlargedImage.project.screenshots[nextIndex], 
                    project: enlargedImage.project, 
                    index: nextIndex 
                  })
                }}
                aria-label="Next image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            )}
            <img 
              src={enlargedImage.url} 
              alt={enlargedImage.project ? `${enlargedImage.project.title} screenshot ${enlargedImage.index + 1}` : 'Enlarged image'}
              className="enlarged-image"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
