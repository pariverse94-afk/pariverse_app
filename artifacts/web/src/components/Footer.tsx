import { Icon } from '@iconify/react'
import { useNavigate } from 'react-router-dom'

export default function Footer() {
  const navigate = useNavigate()

  const scrollTo = (id: string) => {
    const isSubPage = ['/blogs', '/faq', '/privacy', '/terms'].some(p => window.location.pathname.includes(p))
    if (isSubPage) {
      navigate('/')
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 350)
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const goTo = (path: string) => {
    navigate(path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const SOCIAL = [
    { icon: 'ph:instagram-logo-bold', label: 'Instagram', href: 'https://www.instagram.com/mummaverse' },
    { icon: 'ph:facebook-logo-bold', label: 'Facebook', href: 'https://www.facebook.com/mummaverse' },
    { icon: 'ph:youtube-logo-bold', label: 'YouTube', href: 'https://www.youtube.com/@mummaverse' },
    { icon: 'ph:x-logo-bold', label: 'X', href: 'https://x.com/mummaverse' },
    { icon: 'ph:linkedin-logo-bold', label: 'LinkedIn', href: 'https://www.linkedin.com/company/mummaverse' },
  ]

  const QUICK_LINKS = [
    { label: 'Home', action: () => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }) } },
    { label: 'Blogs', action: () => goTo('/blogs') },
    { label: 'FAQ', action: () => goTo('/faq') },
    { label: 'Privacy Policy', action: () => goTo('/privacy') },
    { label: 'Terms of Service', action: () => goTo('/terms') },
  ]

  return (
    <footer className="relative border-t bg-white/70" style={{ borderColor: 'rgba(217,119,87,0.1)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #e8895a, #c9603a)' }}>
                <Icon icon="ph:planet-bold" className="text-white text-lg" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-lg font-extrabold tracking-wide text-[#2C1810]" style={{ fontFamily: "'Nunito', sans-serif" }}>Mummaverse</span>
                <span className="text-[9px] uppercase tracking-[.15em] text-[#8B7355] font-bold">Apps for Indian moms</span>
              </div>
            </div>
            <p className="text-[14px] text-[#9c8b7e] leading-relaxed max-w-xs">Building a suite of apps for urban Indian moms. Pariverse is our first product.</p>
          </div>

          <nav>
            <h4 className="text-[11px] uppercase tracking-widest font-extrabold text-[#8B7355] mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map(({ label, action }) => (
                <li key={label}>
                  <button onClick={action} className="text-[15px] font-semibold text-[#6b5c50] hover:text-[#D97757] transition-colors">
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <nav>
            <h4 className="text-[11px] uppercase tracking-widest font-extrabold text-[#8B7355] mb-4">Features</h4>
            <ul className="space-y-2.5">
              {[
                ['features', 'Meal Planning'],
                ['features', 'Nutrition'],
                ['features', 'First Aid'],
                ['features', 'Community'],
                ['features', 'Chore Board'],
              ].map(([id, label]) => (
                <li key={label}>
                  <button onClick={() => scrollTo(id)} className="text-[15px] font-semibold text-[#6b5c50] hover:text-[#D97757] transition-colors">{label}</button>
                </li>
              ))}
            </ul>
          </nav>

          <nav>
            <h4 className="text-[11px] uppercase tracking-widest font-extrabold text-[#8B7355] mb-4">Our Apps</h4>
            <ul className="space-y-2.5">
              <li><button onClick={() => scrollTo('features')} className="text-[15px] font-semibold text-[#6b5c50] hover:text-[#D97757] transition-colors">Pariverse</button></li>
              <li><span className="text-[15px] font-semibold text-[#9c8b7e]">Eduverse — Soon</span></li>
              <li><span className="text-[15px] font-semibold text-[#9c8b7e]">Selfverse — Soon</span></li>
              <li><a href="mailto:pariverse94@gmail.com" className="text-[15px] font-semibold text-[#6b5c50] hover:text-[#D97757] transition-colors">Contact</a></li>
            </ul>
          </nav>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-5 pt-8 border-t" style={{ borderColor: 'rgba(217,119,87,0.1)' }}>
          <p className="text-[13px] font-semibold text-[#9c8b7e]">© 2026 Pariverse. Made with love for Indian moms.</p>
          <div className="flex items-center gap-4">
            {SOCIAL.map(({ icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                style={{ background: 'rgba(217,119,87,0.08)', color: '#8B7355' }}
                aria-label={label}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#D97757'; (e.currentTarget as HTMLElement).style.background = 'rgba(217,119,87,0.15)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#8B7355'; (e.currentTarget as HTMLElement).style.background = 'rgba(217,119,87,0.08)' }}
              >
                <Icon icon={icon} className="text-lg" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
