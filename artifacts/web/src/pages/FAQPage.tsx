import { useState } from 'react'
import { Icon } from '@iconify/react'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'

const FAQS = [
  {
    category: 'About Pariverse',
    items: [
      { q: 'What is Pariverse?', a: "India's first home management app by Mummaverse, built for urban moms in nuclear families. It brings together meal planning, nutrition tracking, AI-powered first aid guidance, and a judgment-free mom community — all in one app." },
      { q: 'What is Mummaverse?', a: 'Mummaverse is a product company building apps for urban Indian moms. Pariverse is our first app. Eduverse (for children\'s learning) and Selfverse (for mom\'s personal wellbeing) are coming next.' },
      { q: 'Who is Pariverse for?', a: 'Primarily urban Indian moms in nuclear families — whether working or stay-at-home. But the whole family benefits: partners can use the chore board, kids earn streaks, and everyone eats better.' },
    ],
  },
  {
    category: 'Features',
    items: [
      { q: 'What does the meal planner do?', a: 'It generates weekly Indian meal plans based on your family\'s preferences, dietary needs, and what\'s in your pantry. It also auto-generates a shopping list sorted by store section, and suggests ways to use leftovers.' },
      { q: 'How does the first aid guide work?', a: 'You select a symptom or condition (burns, fever, cuts, choking, etc.), enter your child\'s age and severity, and get calm, doctor-reviewed step-by-step guidance. It also shows emergency helpline numbers for India (108, 1800-180-1104).' },
      { q: 'What is the Mom Community?', a: 'A safe, topic-based community for Indian moms. Categories include Recipes, Parenting, Health, and General. You can post, like, save, and respond to other moms\' posts. Anonymous posting is supported.' },
      { q: 'What is the chore board?', a: 'A visual board that assigns household chores to family members — parents and children. It includes reminders, family streaks to gamify tasks for kids, and a weekly fairness check showing if the load is balanced.' },
    ],
  },
  {
    category: 'Pricing & Access',
    items: [
      { q: 'Is Pariverse free?', a: 'Yes, core features will always be free. We believe every Indian mom deserves support, regardless of budget. Optional premium features may come later, but the essentials stay free.' },
      { q: 'When will Pariverse launch?', a: 'We\'re in beta. Join the waitlist at pariverse.in and you\'ll be among the first to get access. Waitlist members get early access and help shape the product.' },
      { q: 'Is it available on iOS?', a: 'We\'re launching on Android first (Play Store). iOS is on our roadmap. Join the waitlist and we\'ll notify you when iOS is available.' },
    ],
  },
  {
    category: 'Privacy & Safety',
    items: [
      { q: 'Is my data safe?', a: 'Yes. We use end-to-end encryption for sensitive data, never sell your data to third parties, and are DPDPA (India\'s Digital Personal Data Protection Act) compliant. You can delete your account and all data at any time.' },
      { q: 'Can my partner use the same account?', a: 'Yes. Family accounts allow multiple members. Partners can see and contribute to the chore board, and the app shifts household responsibility from "helping mom" to "sharing responsibility."' },
      { q: 'Is the first aid advice medically approved?', a: 'All first aid content is reviewed by medical professionals and follows standard guidelines. However, Pariverse provides first-response guidance, not a substitute for professional medical advice. Always consult a doctor for serious concerns.' },
    ],
  },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="faq-item rounded-2xl overflow-hidden">
      <button className="w-full flex items-center justify-between p-5 text-left" onClick={() => setOpen(o => !o)}>
        <span className="text-[16px] font-extrabold pr-4 text-[#2C1810]" style={{ fontFamily: "'Nunito', sans-serif" }}>{q}</span>
        <Icon icon="ph:caret-down-bold" className={`faq-chevron text-[#9c8b7e] text-xl flex-shrink-0 ${open ? 'rotated' : ''}`} />
      </button>
      <div className={`faq-answer px-5 ${open ? 'open' : ''}`}>
        <p className="text-[15px] text-[#6b5c50] leading-relaxed pb-5">{a}</p>
      </div>
    </div>
  )
}

export default function FAQPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = ['All', ...FAQS.map(g => g.category)]

  const filtered = FAQS.map(group => ({
    ...group,
    items: group.items.filter(item =>
      !search || item.q.toLowerCase().includes(search.toLowerCase()) || item.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(group =>
    (activeCategory === 'All' || group.category === activeCategory) && group.items.length > 0
  )

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 font-bold text-[14px] mb-8 transition-colors hover:text-[#D97757]"
          style={{ color: '#9c8b7e' }}
        >
          <Icon icon="ph:arrow-left-bold" />
          Back to Home
        </button>

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5" style={{ background: 'rgba(217,119,87,0.08)', border: '1px solid rgba(217,119,87,0.2)' }}>
            <Icon icon="ph:chat-circle-text-bold" style={{ color: '#D97757', fontSize: 14 }} />
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#D97757' }}>Frequently Asked</span>
          </div>
          <h1 className="text-[2.4rem] md:text-[3rem] font-black text-[#2C1810] leading-tight mb-4" style={{ fontFamily: "'Nunito', sans-serif" }}>
            Questions? We've Got Answers.
          </h1>
          <p className="text-[17px] text-[#6b5c50]">
            Everything you need to know about Pariverse.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Icon icon="ph:magnifying-glass-bold" className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9c8b7e] text-lg" />
          <input
            type="text"
            placeholder="Search questions…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-[15px] font-semibold outline-none"
            style={{ background: 'rgba(255,253,249,0.9)', border: '1.5px solid rgba(217,119,87,0.2)', color: '#2C1810' }}
          />
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-2 rounded-full text-[13px] font-extrabold transition-all duration-200"
              style={{
                background: activeCategory === cat ? '#D97757' : 'rgba(217,119,87,0.07)',
                color: activeCategory === cat ? '#fff' : '#8B7355',
                border: `1.5px solid ${activeCategory === cat ? '#D97757' : 'rgba(217,119,87,0.15)'}`,
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ groups */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Icon icon="ph:magnifying-glass-bold" className="text-5xl mb-4 mx-auto opacity-30" style={{ color: '#D97757' }} />
            <p className="text-[17px] font-bold text-[#9c8b7e]">No results found. Try a different search.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {filtered.map(group => (
              <div key={group.category}>
                <h2 className="text-[18px] font-black text-[#2C1810] mb-4 flex items-center gap-2" style={{ fontFamily: "'Nunito', sans-serif" }}>
                  <span className="inline-block w-2 h-5 rounded-full" style={{ background: '#D97757' }} />
                  {group.category}
                </h2>
                <div className="space-y-3">
                  {group.items.map(item => (
                    <FaqItem key={item.q} {...item} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Still have questions */}
        <div className="mt-16 text-center rounded-3xl p-10" style={{ background: 'linear-gradient(135deg, rgba(217,119,87,0.07), rgba(247,197,159,0.10))', border: '1px solid rgba(217,119,87,0.13)' }}>
          <Icon icon="ph:envelope-bold" className="text-4xl mx-auto mb-3" style={{ color: '#D97757' }} />
          <h3 className="text-[1.4rem] font-black text-[#2C1810] mb-2" style={{ fontFamily: "'Nunito', sans-serif" }}>Still have questions?</h3>
          <p className="text-[15px] text-[#6b5c50] mb-5">We're happy to help. Reach out to us directly.</p>
          <a
            href="mailto:pariverse94@gmail.com"
            className="btn-primary font-extrabold text-[15px] px-7 py-3 rounded-xl inline-flex items-center gap-2"
          >
            <Icon icon="ph:envelope-bold" />
            pariverse94@gmail.com
          </a>
        </div>
      </div>

      <Footer />
    </main>
  )
}
