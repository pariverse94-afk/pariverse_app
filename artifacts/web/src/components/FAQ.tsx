import { useState } from 'react'
import { Icon } from '@iconify/react'
import { useReveal } from '../hooks/useReveal'
import { useNavigate } from 'react-router-dom'

const FAQS = [
  { q: 'What is Pariverse?', a: "India's first home management app by Mummaverse, for urban moms in nuclear families. Meal planning, nutrition tracking, first aid, and a mom community." },
  { q: 'What is Mummaverse?', a: 'A product company building apps for urban Indian moms. Pariverse is the first. Eduverse and Selfverse are coming next.' },
  { q: 'Is it free?', a: 'Yes. Core features will always be free. Optional premium may come later.' },
  { q: 'Can my partner use it?', a: 'Absolutely. Chore delegation shifts from "helping mom" to "sharing responsibility."' },
  { q: 'Is my data safe?', a: 'End-to-end encryption. No data selling. DPDPA compliant. Delete anytime.' },
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

export default function FAQ() {
  const headRef = useReveal()
  const listRef = useReveal()
  const navigate = useNavigate()

  return (
    <section id="faq" className="relative py-24 md:py-32 bg-transparent">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headRef} className="text-center mb-14 reveal">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-6" style={{ borderColor: 'rgba(217,119,87,0.25)', background: 'rgba(217,119,87,0.06)' }}>
            <Icon icon="ph:chat-circle-text-bold" style={{ color: '#D97757', fontSize: 15 }} />
            <span className="text-[12px] font-extrabold uppercase tracking-widest" style={{ color: '#D97757' }}>Questions</span>
          </div>
          <h2 className="text-3xl md:text-[2.75rem] font-black leading-tight tracking-tight text-[#2C1810]" style={{ fontFamily: "'Nunito', sans-serif" }}>
            Frequently Asked
          </h2>
        </div>
        <div ref={listRef} className="space-y-3 reveal">
          {FAQS.map(f => <FaqItem key={f.q} {...f} />)}
        </div>
        <div className="mt-10 text-center">
          <button
            onClick={() => { navigate('/faq'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            className="inline-flex items-center gap-2 font-extrabold text-[14px] px-6 py-3 rounded-xl transition-all hover:scale-105"
            style={{ background: 'rgba(217,119,87,0.08)', color: '#D97757', border: '1.5px solid rgba(217,119,87,0.2)' }}
          >
            View all questions
            <Icon icon="ph:arrow-right-bold" />
          </button>
        </div>
      </div>
    </section>
  )
}
