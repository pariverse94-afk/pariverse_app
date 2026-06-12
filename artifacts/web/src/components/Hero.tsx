import { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'

const WAITLIST_URL = 'https://forms.gle/9zS6uNDvP1udzYqJ8'

function SceneChores({ visible }: { visible: boolean }) {
  const members = [
    { name: 'Mama', color: '#D97757', tasks: ['Cooking', 'Bills'] },
    { name: 'Papa', color: '#5B9BD5', tasks: ['School Run', 'Groceries'] },
    { name: 'Aanya', color: '#7AA874', tasks: ['Homework', 'Room'] },
  ]
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (!visible) { setChecked({}); return }
    const items = ['Cooking', 'School Run', 'Homework', 'Groceries']
    const timers: ReturnType<typeof setTimeout>[] = []
    items.forEach((item, i) => {
      timers.push(setTimeout(() => setChecked(c => ({ ...c, [item]: true })), 600 + i * 700))
    })
    return () => timers.forEach(clearTimeout)
  }, [visible])

  return (
    <div className="w-full h-full flex flex-col p-3 sm:p-5 select-none" style={{ background: 'linear-gradient(135deg, #FFF8F2 0%, #F4E7DA 100%)' }}>
      <div className="flex items-center gap-2 mb-2 sm:mb-4">
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl flex items-center justify-center" style={{ background: '#D97757' }}>
          <Icon icon="ph:clipboard-text-bold" className="text-white text-sm" />
        </div>
        <span className="text-[11px] sm:text-[13px] font-bold text-[#7C3A1A]">Family Chore Board</span>
        <span className="ml-auto text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">Today</span>
      </div>
      <div className="flex-1 grid grid-cols-3 gap-2">
        {members.map(({ name, color, tasks }) => (
          <div key={name} className="rounded-xl p-3 flex flex-col gap-2" style={{ background: `${color}12`, border: `1px solid ${color}30` }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center mx-auto font-bold text-sm text-white" style={{ background: color }}>
              {name[0]}
            </div>
            <p className="text-[10px] font-bold text-center" style={{ color }}>{name}</p>
            {tasks.map(task => (
              <div key={task} className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-500" style={{ borderColor: color, background: checked[task] ? color : 'transparent' }}>
                  {checked[task] && <Icon icon="ph:check-bold" className="text-white" style={{ fontSize: 8 }} />}
                </div>
                <span className="text-[9px] font-semibold transition-all duration-300" style={{ color: checked[task] ? color : '#9c8b7e', textDecoration: checked[task] ? 'line-through' : 'none' }}>{task}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <div className="flex-1 h-2 rounded-full bg-orange-100">
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Object.keys(checked).length * 25}%`, background: '#D97757' }} />
        </div>
        <span className="text-[10px] font-bold text-[#D97757]">{Object.keys(checked).length}/4</span>
      </div>
    </div>
  )
}

function SceneMeals({ visible }: { visible: boolean }) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const meals = ['Poha', 'Dal Roti', 'Idli', 'Upma', 'Rajma', 'Biryani', 'Khichdi']
  const [lit, setLit] = useState(-1)

  useEffect(() => {
    if (!visible) { setLit(-1); return }
    const t = setTimeout(() => setLit(0), 400)
    const id = setInterval(() => setLit(l => (l + 1) % 7), 700)
    return () => { clearTimeout(t); clearInterval(id) }
  }, [visible])

  return (
    <div className="w-full h-full flex flex-col p-3 sm:p-5 select-none" style={{ background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)' }}>
      <div className="flex items-center gap-2 mb-2 sm:mb-4">
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl flex items-center justify-center bg-amber-500">
          <Icon icon="ph:cooking-pot-bold" className="text-white text-sm" />
        </div>
        <span className="text-[11px] sm:text-[13px] font-bold text-amber-900">Weekly Meal Plan</span>
        <span className="ml-auto text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">AI ✨</span>
      </div>
      <div className="grid grid-cols-7 gap-1 flex-1">
        {days.map((day, i) => (
          <div key={day} className="flex flex-col items-center gap-1">
            <span className="text-[8px] font-bold text-amber-600 uppercase">{day}</span>
            <div
              className="w-full rounded-xl flex flex-col items-center justify-center p-1 gap-1 transition-all duration-500"
              style={{
                flex: 1,
                background: i === lit ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.65)',
                border: `1px solid ${i === lit ? 'rgba(245,158,11,0.5)' : 'rgba(245,158,11,0.2)'}`,
                transform: i === lit ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              <Icon icon="ph:bowl-food-bold" className="text-amber-500 text-sm" />
              <span className="text-[7px] text-amber-800 text-center leading-tight font-bold">{meals[i]}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 px-1">
        <Icon icon="ph:shopping-cart-bold" className="text-amber-600 text-sm flex-shrink-0" />
        <span className="text-[10px] text-amber-700 font-bold">Grocery list auto-generated · 12 items</span>
      </div>
    </div>
  )
}

function SceneFirstAid({ visible }: { visible: boolean }) {
  const steps = [
    'Cool under running water 10–20 min',
    'No toothpaste or butter',
    'Clean cloth dressing',
  ]
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!visible) { setStep(0); return }
    const id = setInterval(() => setStep(s => (s >= steps.length ? 0 : s + 1)), 900)
    return () => clearInterval(id)
  }, [visible])

  return (
    <div className="w-full h-full flex flex-col p-3 sm:p-5 select-none" style={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)' }}>
      <div className="flex items-center gap-2 mb-2 sm:mb-4">
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl flex items-center justify-center bg-blue-500">
          <Icon icon="ph:first-aid-kit-bold" className="text-white text-sm" />
        </div>
        <span className="text-[11px] sm:text-[13px] font-bold text-blue-900">First Aid Guide</span>
        <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold">2:04 AM</span>
      </div>
      <div className="flex-1 flex flex-col gap-3">
        <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.75)', border: '1px solid rgba(59,130,246,0.2)' }}>
          <div className="flex items-center gap-2 mb-3">
            <Icon icon="ph:fire-bold" className="text-red-500 text-lg" />
            <span className="text-[13px] font-bold text-blue-800">Minor Burns</span>
          </div>
          <div className="space-y-2">
            {steps.map((s, i) => (
              <div key={i} className="flex items-start gap-2 transition-all duration-500" style={{ opacity: i < step ? 1 : 0.35 }}>
                <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-500" style={{ background: i < step ? '#3b82f6' : 'rgba(59,130,246,0.2)' }}>
                  {i < step
                    ? <Icon icon="ph:check-bold" className="text-white" style={{ fontSize: 8 }} />
                    : <span className="text-[8px] font-bold text-blue-400">{i + 1}</span>}
                </div>
                <span className="text-[10px] text-blue-700 font-semibold leading-tight">{s}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl px-3 py-2 flex items-center gap-2" style={{ background: 'rgba(239,246,255,0.8)', border: '1px solid rgba(59,130,246,0.15)' }}>
          <Icon icon="ph:phone-bold" className="text-blue-500 text-sm flex-shrink-0" />
          <span className="text-[9px] text-blue-600 font-bold">Emergency: 108 · Helpline: 1800-180-1104</span>
        </div>
      </div>
    </div>
  )
}

function SceneCommunity({ visible }: { visible: boolean }) {
  const msgs = [
    { text: "My 3yo won't eat dal 😩", from: 'left', color: '#D97757', name: 'Priya' },
    { text: 'Add ghee + tadka! Works every time 🙌', from: 'right', color: '#9333ea', name: 'Deepika' },
    { text: 'Mix with rice, they never notice!', from: 'left', color: '#0891b2', name: 'Ananya' },
    { text: '❤️ Thank you both so much!', from: 'right', color: '#7AA874', name: 'Priya' },
  ]
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!visible) { setCount(0); return }
    if (count < msgs.length) {
      const id = setTimeout(() => setCount(c => c + 1), 700)
      return () => clearTimeout(id)
    }
    const id = setTimeout(() => setCount(0), 2200)
    return () => clearTimeout(id)
  }, [visible, count])

  return (
    <div className="w-full h-full flex flex-col p-3 sm:p-5 select-none" style={{ background: 'linear-gradient(135deg, #FAF5FF 0%, #EDE9FE 100%)' }}>
      <div className="flex items-center gap-2 mb-2 sm:mb-4">
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl flex items-center justify-center bg-purple-600">
          <Icon icon="ph:users-three-bold" className="text-white text-sm" />
        </div>
        <span className="text-[11px] sm:text-[13px] font-bold text-purple-900">Mom Community</span>
        <span className="ml-auto text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">50+ online</span>
      </div>
      <div className="flex-1 overflow-hidden space-y-2">
        {msgs.slice(0, count).map((msg, i) => (
          <div key={i} className={`flex ${msg.from === 'right' ? 'justify-end' : 'justify-start'}`} style={{ animation: 'bubbleIn .4s ease-out both' }}>
            <div className="max-w-[80%]">
              <p className="text-[8px] mb-0.5 font-bold" style={{ color: msg.color, textAlign: msg.from === 'right' ? 'right' : 'left' }}>{msg.name}</p>
              <div className="rounded-2xl px-3 py-1.5 text-[10px] font-semibold leading-snug" style={{ background: `${msg.color}15`, color: msg.color, border: `1px solid ${msg.color}25` }}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(147,51,234,0.15)' }}>
        <span className="text-[10px] text-purple-400 flex-1 font-medium">Share with your village…</span>
        <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
          <Icon icon="ph:arrow-up-bold" className="text-white" style={{ fontSize: 9 }} />
        </div>
      </div>
    </div>
  )
}

const SCENES = [
  { label: 'Family Chores', icon: 'ph:clipboard-text-bold', color: '#D97757', Comp: SceneChores },
  { label: 'Meal Planning', icon: 'ph:cooking-pot-bold', color: '#d97706', Comp: SceneMeals },
  { label: 'First Aid', icon: 'ph:first-aid-kit-bold', color: '#3b82f6', Comp: SceneFirstAid },
  { label: 'Community', icon: 'ph:users-three-bold', color: '#9333ea', Comp: SceneCommunity },
]

export default function Hero() {
  const [active, setActive] = useState(0)
  const [blocked, setBlocked] = useState(false)

  const goTo = (idx: number) => {
    if (idx === active || blocked) return
    setBlocked(true)
    setActive(idx)
    setTimeout(() => setBlocked(false), 700)
  }

  useEffect(() => {
    const id = setInterval(() => {
      if (!blocked) {
        setActive(a => (a + 1) % SCENES.length)
      }
    }, 3800)
    return () => clearInterval(id)
  }, [blocked])

  return (
    <section className="relative min-h-screen flex items-center pt-20 md:pt-24 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-[0.18]" style={{ background: 'radial-gradient(circle, #D97757 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 -left-20 w-[400px] h-[400px] rounded-full opacity-[0.12]" style={{ background: 'radial-gradient(circle, #7AA874 0%, transparent 70%)' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left — headline + CTAs */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <div className="anim-in inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6" style={{ background: 'rgba(217,119,87,0.08)', border: '1px solid rgba(217,119,87,0.2)' }}>
              <Icon icon="ph:planet-bold" style={{ color: '#D97757', fontSize: 14 }} />
              <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#D97757' }}>From Mummaverse</span>
            </div>

            <h1 className="anim-in-d1 text-[2rem] sm:text-[2.8rem] lg:text-[3.6rem] font-black leading-[1.1] tracking-tight text-[#2C1810] mb-6" style={{ fontFamily: "'Nunito', sans-serif" }}>
              Making Family Life{' '}
              <span className="relative" style={{ color: '#D97757' }}>
                Easier,
                <svg className="absolute -bottom-1 left-0 w-full overflow-visible" viewBox="0 0 200 8" fill="none">
                  <path d="M2 6C50 1.5 100 1.5 198 5.5" stroke="#D97757" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
                </svg>
              </span>{' '}
              Together.
            </h1>

            <p className="anim-in-d2 text-[17px] md:text-[18px] leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0" style={{ color: '#6b5c50' }}>
              The one app every urban Indian family needs — meal planning, chore sharing, first aid guidance, and a village of moms who truly get it.
            </p>

            <div className="anim-in-d3 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8">
              <a href={WAITLIST_URL} target="_blank" rel="noreferrer" className="btn-primary font-extrabold text-[15px] px-7 py-3.5 rounded-2xl inline-flex items-center justify-center gap-2">
                <Icon icon="ph:hand-waving-bold" className="text-lg" />
                Join Waitlist — Free
              </a>
              <a href="#" className="btn-outline font-extrabold text-[15px] px-7 py-3.5 rounded-2xl inline-flex items-center justify-center gap-2">
                <Icon icon="ph:google-play-logo-bold" className="text-lg" />
                Play Store (Beta)
              </a>
            </div>

            <div className="anim-in-d4 flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2">
              {[
                { text: 'Free forever' },
                { text: '1,000+ moms waiting' },
                { text: 'No spam ever' },
              ].map(({ text }) => (
                <span key={text} className="flex items-center gap-1.5 text-[13px] font-bold" style={{ color: '#9c8b7e' }}>
                  <Icon icon="ph:check-circle-fill" style={{ color: '#7AA874', fontSize: 15 }} />
                  {text}
                </span>
              ))}
            </div>
          </div>

          {/* Right — animated scene cards */}
          <div className="order-1 lg:order-2 anim-in-d2">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[240px] sm:h-[290px] md:h-[340px]" style={{ boxShadow: '0 30px 80px -20px rgba(44,24,16,0.16), 0 0 0 1px rgba(217,119,87,0.1)' }}>
              {SCENES.map(({ Comp }, idx) => (
                <div
                  key={idx}
                  className="absolute inset-0 transition-opacity duration-700"
                  style={{ opacity: idx === active ? 1 : 0, zIndex: idx === active ? 2 : 1 }}
                >
                  <Comp visible={idx === active} />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 mt-4">
              {SCENES.map(({ label, icon, color }, idx) => (
                <button
                  key={idx}
                  onClick={() => goTo(idx)}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-all duration-300 font-extrabold"
                  style={{
                    background: idx === active ? `${color}15` : 'rgba(217,119,87,0.05)',
                    border: `1.5px solid ${idx === active ? color : 'rgba(217,119,87,0.12)'}`,
                    color: idx === active ? color : '#9c8b7e',
                    fontSize: 11,
                    transform: idx === active ? 'scale(1.05)' : 'scale(1)',
                  }}
                >
                  <Icon icon={icon} style={{ fontSize: 12 }} />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
