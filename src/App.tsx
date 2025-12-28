import { useState, useEffect, useRef } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import './App.css'
import profileImage from './assets/images/profile.jpg'
import quizmeImage from './assets/images/quizme_logo.png'
import gamaImage from './assets/images/GAMA_logo.png'
import emuklatImage from './assets/images/E-Muklat_logo.jpg'
import ariceImage from './assets/images/Arice_logo.png'
import caciImage from './assets/images/caci_logo.jpg'
import likhainImage from './assets/images/likhain_logo.png'
import eduvisionImage from './assets/images/eduvision_logo.png'
import trinovaImage from './assets/images/Trinova.jpg'

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
  const canvasContainerRef = useRef<HTMLDivElement>(null)

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

  return (
    <div className={`portfolio ${darkMode ? 'dark-mode' : ''}`}>
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">Portfolio</div>
          <div className="nav-right">
            <ul className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
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
      <section id="home" className="hero">
        <div className="hero-content">
          <div className="hero-image">
            <div className="image-placeholder">
              <img src={profileImage} alt="Clarence Portugal" className="profile-img" />
            </div>
          </div>
          <div className="hero-text">
            <h1 className="hero-name">Portugal, Clarence A.</h1>
<p className="hero-title">Mobile App Developer, Web Developer & IoT Engineer</p>
            <p className="hero-description">
              Creating mobile applications, web platforms, and IoT systems using modern technologies and innovative solutions
            </p>
            <div className="hero-buttons">
              <a href="#projects" className="btn btn-primary">View My Work</a>
              <a href="#contact" className="btn btn-secondary">Get In Touch</a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
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
      <section id="projects" className="projects">
        <div className="container">
          <h2 className="section-title">My Projects</h2>
          <div className="project-filters">
            <button 
              className={`filter-btn ${projectFilter === 'all' ? 'active' : ''}`}
              onClick={() => setProjectFilter('all')}
            >
              All
            </button>
            <button 
              className={`filter-btn ${projectFilter === 'app' ? 'active' : ''}`}
              onClick={() => setProjectFilter('app')}
            >
              Mobile App
            </button>
            <button 
              className={`filter-btn ${projectFilter === 'iot' ? 'active' : ''}`}
              onClick={() => setProjectFilter('iot')}
            >
              IoT
            </button>
            <button 
              className={`filter-btn ${projectFilter === 'website' ? 'active' : ''}`}
              onClick={() => setProjectFilter('website')}
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
                description: 'Digital Automated Rice Dispenser and Sealing with AI-Assistance and Smart Storage Notification. An IoT-enabled mobile application that allows users to make online payments for rice purchases. After payment confirmation, the app controls IoT devices to automatically dispense rice, providing a seamless and automated purchasing experience.',
                tags: ['Flutter', 'Dart', 'VS Code', 'MongoDB', 'Arduino', 'IoT', 'Mobile App', 'Payment Integration'],
                category: ['app', 'iot']
              },
              {
                id: 'caci',
                image: caciImage,
                title: 'CACI',
                description: 'A quiz game application designed specifically for grade 10 students to test their knowledge. Features engaging gameplay with statistics tracking, daily goals, level progression, and a gamified learning experience to make studying fun and interactive.',
                tags: ['Flutter', 'Dart', 'VS Code', 'Mobile App', 'Educational'],
                category: 'app'
              },
              {
                id: 'eduvision',
                image: eduvisionImage,
                title: 'EduVision',
                description: 'An AI-powered facial recognition attendance system for the College of Computing and Multimedia Studies (CCMS) at CNSC. Utilizes IoT-based smart cameras and cloud-based database to automate faculty attendance tracking. Features contactless verification, real-time monitoring, and secure record-keeping through web and mobile applications. Solves issues with manual attendance methods by eliminating time-consuming processes, reducing errors, and preventing proxy attendance.',
                tags: ['Python', 'React', 'TypeScript', 'C++', 'Cython', 'IoT', 'Website', 'System', 'AI', 'Facial Recognition'],
                category: 'website'
              },
              {
                id: 'emuklat',
                image: emuklatImage,
                title: 'E-Muklat',
                description: 'A mobile application for uploading videos and stories about places, specifically designed for Labo, Camarines Norte. Features user authentication, content sharing, and a warm, welcoming interface for showcasing local stories and experiences.',
                tags: ['Java', 'XML', 'Android Studio', 'Firebase', 'Mobile App'],
                category: 'app'
              },
              {
                id: 'gama',
                image: gamaImage,
                title: 'GAMA',
                description: 'Geometry and Algebra Adventures - An educational mobile app that makes learning math fun and interactive. Features engaging UI with colorful geometric shapes and mathematical symbols for an immersive learning experience.',
                tags: ['Flutter', 'Dart', 'VS Code', 'Firebase', 'Mobile App'],
                category: 'app'
              },
              {
                id: 'likhain',
                image: likhainImage,
                title: 'Likhain',
                description: 'A creative platform designed for poem writers to express their thoughts, emotions, and creativity through poetry. Writers can share their poems, discover inspiring works from others, and connect with fellow poets in a supportive community. Features include poem publishing, commenting, and real-time communication between writers.',
                tags: ['React', 'TypeScript', 'Firebase', 'Website', 'VS Code'],
                category: 'website'
              },
              {
                id: 'quizme',
                image: quizmeImage,
                title: 'QuizMe',
                description: 'A mobile quiz application that allows users to test their knowledge and challenge friends. Features a modern UI with vibrant colors and intuitive design for an engaging quiz experience.',
                tags: ['Flutter', 'Dart', 'VS Code', 'MongoDB', 'Mobile App', 'UI/UX'],
                category: 'app'
              },
              {
                id: 'trinova',
                image: trinovaImage,
                title: 'Trinova',
                description: 'An educational device designed to help students learn mathematical functions and topics, particularly trigonometry. Features an interactive keypad interface and LCD display that displays various mathematical topics including trigonometric functions (sine, cosine, tangent), laws of sines and cosines, and SOH CAH TOA. The device provides an engaging, hands-on learning experience for students studying mathematics.',
                tags: ['Arduino', 'IoT', 'Educational', 'Embedded System', 'C++'],
                category: 'iot'
              }
            ]
              .filter(project => {
                if (projectFilter === 'all') return true
                // Handle both single category string and array of categories
                if (Array.isArray(project.category)) {
                  return project.category.includes(projectFilter)
                }
                return project.category === projectFilter
              })
              .map(project => (
                <div key={project.id} className="project-card">
                  <div className="project-image">
                    <img src={project.image} alt={`${project.title} App`} className="project-img" />
                  </div>
                  <div className="project-info">
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className="project-tags">
                      {project.tags.map((tag, index) => (
                        <span key={index}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="skills">
        <div className="container">
          <h2 className="section-title">Skills</h2>
          <div className="skills-grid">
            <div className="skill-category">
              <h3>Frontend & Mobile</h3>
              <div className="skill-items">
                <span className="skill-item">
                  <svg className="skill-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                  React
                </span>
                <span className="skill-item">
                  <svg className="skill-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"></path>
                    <path d="M18 22h-8a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2z"></path>
                  </svg>
                  TypeScript
                </span>
                <span className="skill-item">
                  <svg className="skill-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                    <line x1="8" y1="21" x2="16" y2="21"></line>
                    <line x1="12" y1="17" x2="12" y2="21"></line>
                    <line x1="7" y1="8" x2="7.01" y2="8"></line>
                    <line x1="17" y1="8" x2="17.01" y2="8"></line>
                  </svg>
                  Flutter
                </span>
                <span className="skill-item">
                  <svg className="skill-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                  Dart
                </span>
                <span className="skill-item">
                  <svg className="skill-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                  Java
                </span>
                <span className="skill-item">
                  <svg className="skill-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="9" y1="15" x2="15" y2="15"></line>
                    <line x1="12" y1="12" x2="12" y2="18"></line>
                  </svg>
                  XML
                </span>
                <span className="skill-item">
                  <svg className="skill-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <path d="M14 2v6h6"></path>
                    <path d="M16 13H8"></path>
                    <path d="M16 17H8"></path>
                    <path d="M10 9H8"></path>
                  </svg>
                  HTML/CSS
                </span>
              </div>
            </div>
            <div className="skill-category">
              <h3>Backend & Database</h3>
              <div className="skill-items">
                <span className="skill-item">
                  <svg className="skill-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                  Python
                </span>
                <span className="skill-item">
                  <svg className="skill-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                  C++
                </span>
                <span className="skill-item">
                  <svg className="skill-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                  Cython
                </span>
                <span className="skill-item">
                  <svg className="skill-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                  </svg>
                  Firebase
                </span>
                <span className="skill-item">
                  <svg className="skill-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                  </svg>
                  MongoDB
                </span>
              </div>
            </div>
            <div className="skill-category">
              <h3>Tools & Technologies</h3>
              <div className="skill-items">
                <span className="skill-item">
                  <svg className="skill-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6"></polyline>
                    <polyline points="8 6 2 12 8 18"></polyline>
                  </svg>
                  VS Code
                </span>
                <span className="skill-item">
                  <svg className="skill-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                    <line x1="12" y1="18" x2="12" y2="18.01"></line>
                  </svg>
                  Android Studio
                </span>
                <span className="skill-item">
                  <svg className="skill-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
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
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                  Payment Integration
                </span>
                <span className="skill-item">
                  <svg className="skill-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                    <line x1="8" y1="21" x2="16" y2="21"></line>
                    <line x1="12" y1="17" x2="12" y2="21"></line>
                  </svg>
                  UI/UX
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certificates Section */}
      <section id="certificates" className="certificates">
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
      <section id="contact" className="contact">
        <div className="container">
          <h2 className="section-title">Get In Touch</h2>
          <div className="contact-content">
            <p className="contact-description">
              I'm always open to discussing new projects, creative ideas, or opportunities
              to be part of your visions.
            </p>
            <div className="contact-info">
              <a href="mailto:portugalclarence15@gmail.com" className="contact-item">
                <svg className="contact-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2-2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span>portugalclarence15@gmail.com</span>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="contact-item">
                <svg className="contact-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
                <span>GitHub</span>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="contact-item">
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

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 Portfolio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
