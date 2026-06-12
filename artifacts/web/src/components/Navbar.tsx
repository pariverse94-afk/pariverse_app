import { useState } from 'react'
import { Icon } from '@iconify/react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const WAITLIST_URL = 'https://forms.gle/9zS6uNDvP1udzYqJ8'

export default function Navbar({ onLogoClick }: { onLogoClick: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { theme, toggle } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  const closeMenu = () => setMenuOpen(false)

  const handleNav = (target: string) => {
    closeMenu()
    if (target.startsWith('/')) {
      navigate(target)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 350)
    } else {
      document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const NAV_LINKS = [
    { label: 'Why Pariverse', target: 'problem' },
    { label: 'Features', target: 'features' },
    { label: 'Village', target: 'village' },
    { label: 'Blog', target: '/blogs' },
    { label: 'FAQ', target: '/faq' },
  ]

  return (
    <>
      <nav className="nav-glass fixed top-0 left-0 right-0 z-50" role="navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <button
              onClick={() => { onLogoClick(); handleNav('/') }}
              className="flex items-center gap-2.5 anim-in"
              aria-label="Home"
            >
              <img
                src={`${import.meta.env.BASE_URL}images/pariverse-logo.png`}
                alt="Pariverse logo"
                className="w-10 h-10 rounded-xl object-cover shadow-md"
              />
              <div className="flex flex-col leading-tight">
                <span className="text-lg font-extrabold tracking-wide text-[#2C1810]" style={{ fontFamily: "'Nunito', sans-serif" }}>Mummaverse</span>
                <span className="text-[9px] uppercase tracking-[.15em] text-[#8B7355] hidden sm:block font-bold">Presents Pariverse</span>
              </div>
            </button>

            <div className="hidden md:flex items-center gap-7 anim-in-d1">
              {NAV_LINKS.map(({ label, target }) => (
                <button
                  key={label}
                  onClick={() => handleNav(target)}
                  className="text-[15px] font-bold transition-colors hover:text-[#D97757]"
                  style={{ color: '#6b5c50' }}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 anim-in-d2">
              <button
                onClick={toggle}
                aria-label="Toggle dark mode"
                className="w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-300"
                style={{
                  background: theme === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(217,119,87,0.07)',
                  borderColor: theme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(217,119,87,0.2)',
                  color: theme === 'dark' ? '#fb923c' : '#92400e',
                }}
              >
                <Icon icon={theme === 'dark' ? 'ph:sun-bold' : 'ph:moon-bold'} className="text-lg" />
              </button>
              <a
                href={WAITLIST_URL}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex btn-primary text-[14px] font-extrabold px-5 py-2.5 rounded-xl"
              >
                Join Waitlist
              </a>
              <button
                className="md:hidden p-2 text-[#2C1810] dark:text-[#F0E6DC]"
                onClick={() => setMenuOpen(o => !o)}
                aria-label="Menu"
              >
                <Icon icon={menuOpen ? 'ph:x-bold' : 'ph:list-bold'} className="text-2xl" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div
        className={`mobile-menu fixed inset-0 z-40 backdrop-blur-xl flex flex-col items-center justify-center gap-7 bg-white/95 ${menuOpen ? 'open' : ''}`}
        role="dialog"
      >
        {NAV_LINKS.map(({ label, target }) => (
          <button
            key={label}
            onClick={() => handleNav(target)}
            className="text-2xl font-black uppercase tracking-wider transition-colors text-[#2C1810] hover:text-[#D97757]"
            style={{ fontFamily: "'Nunito', sans-serif" }}
          >
            {label}
          </button>
        ))}
        <a
          href={WAITLIST_URL}
          target="_blank"
          rel="noreferrer"
          onClick={closeMenu}
          className="btn-primary text-[16px] font-extrabold px-9 py-3.5 rounded-2xl mt-3 flex items-center justify-center gap-2"
        >
          <Icon icon="ph:hand-waving-bold" className="text-lg" />
          Join Waitlist
        </a>
      </div>
    </>
  )
}
