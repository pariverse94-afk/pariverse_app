import { useState } from 'react'
import { Icon } from '@iconify/react'
import { useNavigate } from 'react-router-dom'
import { ARTICLES } from '../data/articles'
import Footer from '../components/Footer'

const CATEGORIES = ['All', 'Mental Load', 'Meal Planning', 'First Aid', 'Nutrition', 'Mental Health']

export default function BlogPage() {
  const navigate = useNavigate()
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = ARTICLES.filter(a => {
    const matchCat = category === 'All' || a.category === category
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.summary.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <>
      <main className="min-h-screen pt-24 pb-16">
        {/* Header */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-[#9c8b7e] hover:text-[#D97757] transition-colors mb-8 font-bold text-[14px]"
          >
            <Icon icon="ph:arrow-left-bold" />
            Back to Home
          </button>

          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5" style={{ background: 'rgba(217,119,87,0.08)', border: '1px solid rgba(217,119,87,0.2)' }}>
              <Icon icon="ph:book-open-bold" style={{ color: '#D97757', fontSize: 14 }} />
              <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#D97757' }}>Pariverse Blog</span>
            </div>
            <h1 className="text-[2.4rem] md:text-[3rem] font-black text-[#2C1810] leading-tight mb-4" style={{ fontFamily: "'Nunito', sans-serif" }}>
              Stories for Indian Moms
            </h1>
            <p className="text-[17px] text-[#6b5c50] leading-relaxed">
              Real research, warm advice, and practical tips — for the urban mom navigating it all.
            </p>
          </div>

          {/* Search */}
          <div className="max-w-lg mx-auto mb-8">
            <div className="relative">
              <Icon icon="ph:magnifying-glass-bold" className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9c8b7e] text-lg" />
              <input
                type="text"
                placeholder="Search articles…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-[15px] font-semibold outline-none transition-all"
                style={{
                  background: 'rgba(255,253,249,0.9)',
                  border: '1.5px solid rgba(217,119,87,0.2)',
                  color: '#2C1810',
                }}
              />
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className="px-4 py-2 rounded-full text-[13px] font-extrabold transition-all duration-200"
                style={{
                  background: category === cat ? '#D97757' : 'rgba(217,119,87,0.07)',
                  color: category === cat ? '#fff' : '#8B7355',
                  border: `1.5px solid ${category === cat ? '#D97757' : 'rgba(217,119,87,0.15)'}`,
                  transform: category === cat ? 'scale(1.04)' : 'scale(1)',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Articles grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <Icon icon="ph:books-bold" className="text-5xl text-[#D97757] opacity-40 mb-4 mx-auto" />
              <p className="text-[17px] font-bold text-[#9c8b7e]">No articles found. Try a different search.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(article => (
                <article
                  key={article.id}
                  className="blog-card rounded-2xl overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/blogs/${article.slug}`)}
                >
                  <div
                    className="h-44 flex items-center justify-center relative overflow-hidden blog-img"
                    style={{ background: `linear-gradient(135deg, ${article.gradientFrom}, ${article.gradientTo})` }}
                  >
                    <Icon icon={article.icon} style={{ color: article.iconColor, fontSize: 64, opacity: 0.25 }} />
                    <div className="absolute inset-0 flex flex-col justify-between p-4">
                      <span className={`self-start px-2.5 py-1 rounded-full text-[11px] font-extrabold ${article.categoryColor}`} style={{ background: 'rgba(255,255,255,0.7)' }}>
                        {article.category}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-white/80">{article.date}</span>
                        <span className="text-white/50">·</span>
                        <span className="text-[11px] font-semibold text-white/80">{article.readTime} read</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-5 bg-white/70">
                    <h2 className="text-[16px] font-black text-[#2C1810] leading-snug mb-2" style={{ fontFamily: "'Nunito', sans-serif" }}>
                      {article.title}
                    </h2>
                    <p className="text-[14px] text-[#6b5c50] leading-relaxed line-clamp-2">{article.summary}</p>
                    <div className="flex items-center gap-1.5 mt-4 font-extrabold text-[13px]" style={{ color: '#D97757' }}>
                      Read article
                      <Icon icon="ph:arrow-right-bold" className="text-sm" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center rounded-3xl p-10 md:p-14" style={{ background: 'linear-gradient(135deg, rgba(217,119,87,0.08), rgba(247,197,159,0.12))', border: '1px solid rgba(217,119,87,0.15)' }}>
            <Icon icon="ph:house-simple-bold" className="text-5xl mx-auto mb-4" style={{ color: '#D97757' }} />
            <h2 className="text-[1.8rem] md:text-[2.2rem] font-black text-[#2C1810] mb-3" style={{ fontFamily: "'Nunito', sans-serif" }}>
              Ready to simplify family life?
            </h2>
            <p className="text-[16px] text-[#6b5c50] mb-7 max-w-md mx-auto">
              Join 1,000+ Indian moms already on the waitlist for Pariverse.
            </p>
            <a
              href="https://forms.gle/9zS6uNDvP1udzYqJ8"
              target="_blank"
              rel="noreferrer"
              className="btn-primary font-extrabold text-[16px] px-8 py-4 rounded-2xl inline-flex items-center gap-2"
            >
              <Icon icon="ph:hand-waving-bold" className="text-lg" />
              Join the Waitlist
            </a>
          </div>
        </section>

        <Footer />
      </main>
    </>
  )
}
