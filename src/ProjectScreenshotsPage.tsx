import { useEffect } from 'react'
import './App.css'

interface ProjectScreenshotsPageProps {
  screenshots: string[]
  title: string
  onBack: () => void
  darkMode: boolean
}

function ProjectScreenshotsPage({ screenshots, title, onBack, darkMode }: ProjectScreenshotsPageProps) {
  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className={`portfolio ${darkMode ? 'dark-mode' : ''}`}>
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div 
            className="logo" 
            role="banner" 
            onClick={onBack} 
            style={{ cursor: 'pointer' }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onBack()
              }
            }}
            tabIndex={0}
            aria-label="Back to portfolio"
          >
            Clarence Portugal
          </div>
          <div className="nav-right">
            <button 
              className="back-to-projects-btn"
              onClick={onBack}
              aria-label="Back to projects"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back to Projects
            </button>
          </div>
        </div>
      </nav>

      {/* Screenshots Section */}
      <section className="project-screenshots-page">
        <div className="container">
          <div className="project-screenshots-header">
            <button 
              className="back-button-mobile"
              onClick={onBack}
              aria-label="Back to projects"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <h1 className="project-screenshots-page-title">{title}</h1>
            <p className="project-screenshots-subtitle">App Screenshots & Design</p>
          </div>

          <div className="project-screenshots-grid">
            {screenshots.map((screenshot, index) => (
              <div key={index} className="project-screenshot-card">
                <img 
                  src={screenshot} 
                  alt={`${title} screenshot ${index + 1}`}
                  className="project-screenshot-full"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          <div className="project-screenshots-footer">
            <button 
              className="btn btn-primary"
              onClick={onBack}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back to Projects
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ProjectScreenshotsPage

