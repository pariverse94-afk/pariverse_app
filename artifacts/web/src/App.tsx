import { Routes, Route } from 'react-router-dom'
import './index.css'
import { ThemeProvider } from './context/ThemeContext'

import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Stats from './components/Stats'
import Problem from './components/Problem'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import Village from './components/Village'
import Chores from './components/Chores'
import Ecosystem from './components/Ecosystem'
import Testimonial from './components/Testimonial'
import Waitlist from './components/Waitlist'
import Footer from './components/Footer'

import BlogPage from './pages/BlogPage'
import BlogDetailPage from './pages/BlogDetailPage'
import FAQPage from './pages/FAQPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'

function HomePage() {
  return (
    <main id="main-page">
      <Hero />
      <Testimonial />
      <Stats />
      <Problem />
      <Features />
      <HowItWorks />
      <Village />
      <Chores />
      <Ecosystem />
      <Waitlist />
      <Footer />
    </main>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <Navbar onLogoClick={() => {}} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blogs" element={<BlogPage />} />
        <Route path="/blogs/:slug" element={<BlogDetailPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
      </Routes>
    </ThemeProvider>
  )
}
