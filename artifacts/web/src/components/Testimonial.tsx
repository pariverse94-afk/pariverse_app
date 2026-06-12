import { Icon } from '@iconify/react'
import { useState } from 'react'
import { useReveal } from '../hooks/useReveal'

const TESTIMONIALS = [
  {
    quote: "I manage cooking, cleaning, my kid's classes, and my in-laws' medicines. Pariverse made me realise",
    highlight: "I was doing five people's jobs alone.",
    name: 'Priya S.',
    role: 'Working mom, Pune',
    avatar: 'P',
    bg: 'rgba(217,119,87,0.07)',
    border: 'rgba(217,119,87,0.15)',
    avatarBg: 'linear-gradient(135deg, #e8895a, #c9603a)',
  },
  {
    quote: "Mere husband ko lagta tha ghar khud chal jaata hai. Chore board dekhke pehli baar bola —",
    highlight: '"yaar, itna sab tum karti ho?"',
    name: 'Deepika R.',
    role: 'Stay-at-home mom, Bengaluru',
    avatar: 'D',
    bg: 'rgba(212,60,90,0.06)',
    border: 'rgba(212,60,90,0.15)',
    avatarBg: 'linear-gradient(135deg, #e8608a, #c93060)',
  },
  {
    quote: "Bacche ko raat ko 102°F bukhar aaya. Pariverse ka first aid guide khola — no Google rabbit hole, no panic.",
    highlight: "Sab kuch ek jagah, doctor ki tarah samjhaya.",
    name: 'Ananya M.',
    role: 'Mom of two, Delhi NCR',
    avatar: 'A',
    bg: 'rgba(91,155,213,0.07)',
    border: 'rgba(91,155,213,0.18)',
    avatarBg: 'linear-gradient(135deg, #5B9BD5, #3a7ab5)',
  },
  {
    quote: "Joint family mein saas ki help thi. Nuclear family mein sab akele. Pariverse meri",
    highlight: "digital saas ban gayi — bina judgement ke.",
    name: 'Kavitha N.',
    role: 'IT professional & mom, Chennai',
    avatar: 'K',
    bg: 'rgba(122,168,116,0.07)',
    border: 'rgba(122,168,116,0.18)',
    avatarBg: 'linear-gradient(135deg, #7AA874, #4d8a47)',
  },
  {
    quote: "Meal planning ke liye main 30 min roz spend karti thi. Ab Pariverse weekly plan bana deta hai —",
    highlight: "ingredients list ke saath, waste bhi zero.",
    name: 'Ritu K.',
    role: 'Mom & entrepreneur, Mumbai',
    avatar: 'R',
    bg: 'rgba(247,197,159,0.12)',
    border: 'rgba(247,197,159,0.3)',
    avatarBg: 'linear-gradient(135deg, #F7C59F, #e8a070)',
  },
  {
    quote: "The community tab is what I didn't know I needed. Real moms, real advice,",
    highlight: "no unsolicited opinions from aunties.",
    name: 'Shreya P.',
    role: 'New mom, Hyderabad',
    avatar: 'S',
    bg: 'rgba(168,122,168,0.07)',
    border: 'rgba(168,122,168,0.18)',
    avatarBg: 'linear-gradient(135deg, #a87aa8, #885588)',
  },
]

export default function Testimonial() {
  const headRef = useReveal()
  const gridRef = useReveal()
  const [carouselIdx, setCarouselIdx] = useState(0)

  const prev = () => setCarouselIdx(i => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
  const next = () => setCarouselIdx(i => (i + 1) % TESTIMONIALS.length)

  return (
    <section className="relative py-20 md:py-28 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headRef} className="text-center mb-14 reveal">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-6" style={{ borderColor: 'rgba(217,119,87,0.25)', background: 'rgba(217,119,87,0.06)' }}>
            <Icon icon="ph:quotes-bold" style={{ color: '#D97757', fontSize: 14 }} />
            <span className="text-[12px] font-extrabold uppercase tracking-widest" style={{ color: '#D97757' }}>Real moms, real stories</span>
          </div>
          <h2 className="text-3xl md:text-[2.75rem] font-black leading-tight tracking-tight text-[#2C1810]" style={{ fontFamily: "'Nunito', sans-serif" }}>
            Moms Who Get It
          </h2>
          <p className="mt-3 text-[17px] text-[#6b5c50] max-w-xl mx-auto">
            From Pune to Chennai, these are the stories that built Pariverse.
          </p>
        </div>

        {/* Desktop / tablet: 3-col grid */}
        <div ref={gridRef} className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5 reveal">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl p-6 flex flex-col gap-4 transition-transform hover:-translate-y-1"
              style={{ background: t.bg, border: `1.5px solid ${t.border}` }}
            >
              <Icon icon="ph:quotes-bold" className="text-2xl" style={{ color: t.border.replace('0.15', '0.6').replace('0.18', '0.6').replace('0.3', '0.7') }} />
              <p className="text-[15px] leading-relaxed text-[#4A3728] flex-1">
                {t.quote}{' '}
                <span className="font-extrabold" style={{ color: '#D97757' }}>{t.highlight}</span>
              </p>
              <div className="flex items-center gap-3 mt-2">
                <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-[15px] font-black text-white shadow-sm" style={{ background: t.avatarBg }}>
                  {t.avatar}
                </div>
                <div>
                  <div className="text-[14px] font-extrabold text-[#2C1810]">{t.name}</div>
                  <div className="text-[12px] text-[#8B7355]">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: single card carousel */}
        <div className="sm:hidden">
          <div
            className="rounded-2xl p-6 flex flex-col gap-4 mx-1"
            style={{ background: TESTIMONIALS[carouselIdx].bg, border: `1.5px solid ${TESTIMONIALS[carouselIdx].border}` }}
          >
            <Icon icon="ph:quotes-bold" className="text-2xl text-[#D97757]/50" />
            <p className="text-[16px] leading-relaxed text-[#4A3728]">
              {TESTIMONIALS[carouselIdx].quote}{' '}
              <span className="font-extrabold text-[#D97757]">{TESTIMONIALS[carouselIdx].highlight}</span>
            </p>
            <div className="flex items-center gap-3 mt-2">
              <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-[15px] font-black text-white shadow-sm" style={{ background: TESTIMONIALS[carouselIdx].avatarBg }}>
                {TESTIMONIALS[carouselIdx].avatar}
              </div>
              <div>
                <div className="text-[14px] font-extrabold text-[#2C1810]">{TESTIMONIALS[carouselIdx].name}</div>
                <div className="text-[12px] text-[#8B7355]">{TESTIMONIALS[carouselIdx].role}</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-5 px-1">
            <button onClick={prev} className="w-9 h-9 rounded-full flex items-center justify-center transition-all" style={{ background: 'rgba(217,119,87,0.1)', color: '#D97757' }}>
              <Icon icon="ph:caret-left-bold" />
            </button>
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCarouselIdx(i)}
                  className="rounded-full transition-all duration-300"
                  style={{ width: i === carouselIdx ? 20 : 7, height: 7, background: i === carouselIdx ? '#D97757' : '#D4C4B0' }}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button onClick={next} className="w-9 h-9 rounded-full flex items-center justify-center transition-all" style={{ background: 'rgba(217,119,87,0.1)', color: '#D97757' }}>
              <Icon icon="ph:caret-right-bold" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
