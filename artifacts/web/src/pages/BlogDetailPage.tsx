import { useParams, useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { ARTICLES } from '../data/articles'
import Footer from '../components/Footer'

const WAITLIST_URL = 'https://forms.gle/9zS6uNDvP1udzYqJ8'

function ArticleHero({ article }: { article: (typeof ARTICLES)[number] }) {
  return (
    <div
      className="w-full h-full relative overflow-hidden flex items-center justify-center"
      style={{ background: `linear-gradient(135deg, ${article.gradientFrom}, ${article.gradientTo})` }}
    >
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 100 + i * 90,
            height: 100 + i * 90,
            border: `1px solid ${article.iconColor}20`,
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 960 360" fill="none">
        {[
          { cx: 80, cy: 50, r: 3 }, { cx: 880, cy: 70, r: 2 },
          { cx: 900, cy: 280, r: 4 }, { cx: 60, cy: 300, r: 2.5 },
          { cx: 480, cy: 30, r: 2 }, { cx: 720, cy: 320, r: 3 },
          { cx: 200, cy: 340, r: 2 }, { cx: 760, cy: 60, r: 2.5 },
        ].map((dot, i) => (
          <circle key={i} cx={dot.cx} cy={dot.cy} r={dot.r} fill={`${article.iconColor}50`} />
        ))}
      </svg>
      <div className="relative z-10 flex flex-col items-center gap-3">
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-xl"
          style={{ background: `linear-gradient(135deg, ${article.iconColor}90, ${article.iconColor})` }}
        >
          <Icon icon={article.icon} className="text-white" style={{ fontSize: 36 }} />
        </div>
        <div
          className="px-4 py-1.5 rounded-full text-[12px] font-semibold"
          style={{ background: `${article.iconColor}15`, color: article.iconColor, border: `1px solid ${article.iconColor}25` }}
        >
          {article.category}
        </div>
      </div>
    </div>
  )
}

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const article = ARTICLES.find(a => a.slug === slug)

  if (!article) {
    return (
      <main className="min-h-screen pt-24 flex flex-col items-center justify-center gap-6 px-4">
        <Icon icon="ph:books-bold" className="text-6xl" style={{ color: '#D97757', opacity: 0.4 }} />
        <p className="text-[18px] font-bold text-[#6b5c50]">Article not found.</p>
        <button
          onClick={() => navigate('/blogs')}
          className="btn-primary font-extrabold text-[15px] px-6 py-3 rounded-xl"
        >
          Back to Blog
        </button>
      </main>
    )
  }

  const others = ARTICLES.filter(a => a.id !== article.id).slice(0, 3)

  return (
    <>
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <button
            onClick={() => navigate('/blogs')}
            className="flex items-center gap-2 text-[#9c8b7e] hover:text-[#D97757] transition-colors mb-10 font-bold text-[14px]"
          >
            <Icon icon="ph:arrow-left-bold" />
            Back to all articles
          </button>

          {/* Hero image */}
          <div className="rounded-2xl overflow-hidden h-[240px] md:h-[320px] mb-8">
            <ArticleHero article={article} />
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className={`text-[11px] uppercase tracking-widest ${article.categoryColor} font-semibold`}>{article.category}</span>
            <span className="text-[11px] text-[#9c8b7e]">·</span>
            <time className="text-[11px] text-[#9c8b7e]">{article.date}</time>
            <span className="text-[11px] text-[#9c8b7e]">·</span>
            <span className="text-[11px] text-[#9c8b7e]">{article.readTime} read</span>
          </div>

          {/* Title */}
          <h1
            className="text-[2rem] md:text-[2.6rem] font-black text-[#2C1810] leading-tight mb-8"
            style={{ fontFamily: "'Nunito', sans-serif" }}
          >
            {article.title}
          </h1>

          {/* Body */}
          <div
            className="article-body prose max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* CTA */}
          <div className={`mt-12 p-7 rounded-2xl ${article.ctaBg} border text-center`}>
            <p className="text-[15px] text-[#4A3728] mb-5 font-medium">{article.ctaText}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={WAITLIST_URL}
                target="_blank"
                rel="noreferrer"
                className="btn-primary font-extrabold text-[15px] px-6 py-3 rounded-xl inline-flex items-center justify-center gap-2"
              >
                <Icon icon="ph:hand-waving-bold" className="text-base" />
                Join Waitlist — Free
              </a>
              <a
                href="#"
                onClick={e => e.preventDefault()}
                className="btn-outline font-extrabold text-[15px] px-6 py-3 rounded-xl inline-flex items-center justify-center gap-2"
              >
                <Icon icon="ph:google-play-logo-bold" className="text-base" />
                Get it on Play Store
              </a>
            </div>
          </div>

          {/* More articles */}
          {others.length > 0 && (
            <div className="mt-16">
              <h2
                className="text-[1.3rem] font-black text-[#2C1810] mb-6"
                style={{ fontFamily: "'Nunito', sans-serif" }}
              >
                More from Pariverse Blog
              </h2>
              <div className="grid sm:grid-cols-3 gap-5">
                {others.map(a => (
                  <button
                    key={a.id}
                    onClick={() => { navigate(`/blogs/${a.slug}`); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                    className="text-left blog-card rounded-2xl overflow-hidden"
                  >
                    <div
                      className="h-28 flex items-center justify-center relative"
                      style={{ background: `linear-gradient(135deg, ${a.gradientFrom}, ${a.gradientTo})` }}
                    >
                      <Icon icon={a.icon} style={{ color: a.iconColor, fontSize: 40, opacity: 0.3 }} />
                      <span
                        className={`absolute top-3 left-3 text-[10px] font-extrabold px-2 py-0.5 rounded-full ${a.categoryColor}`}
                        style={{ background: 'rgba(255,255,255,0.7)' }}
                      >
                        {a.category}
                      </span>
                    </div>
                    <div className="p-4 bg-white/70">
                      <p className="text-[13px] font-black text-[#2C1810] leading-snug line-clamp-2" style={{ fontFamily: "'Nunito', sans-serif" }}>
                        {a.title}
                      </p>
                      <div className="flex items-center gap-1 mt-2 font-extrabold text-[12px]" style={{ color: '#D97757' }}>
                        Read <Icon icon="ph:arrow-right-bold" className="text-xs" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <Footer />
      </main>
    </>
  )
}
