import { Icon } from '@iconify/react'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'

const LAST_UPDATED = 'June 12, 2025'

export default function TermsPage() {
  const navigate = useNavigate()

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 font-bold text-[14px] mb-8 transition-colors hover:text-[#D97757]"
          style={{ color: '#9c8b7e' }}
        >
          <Icon icon="ph:arrow-left-bold" />
          Back to Home
        </button>

        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5" style={{ background: 'rgba(217,119,87,0.08)', border: '1px solid rgba(217,119,87,0.2)' }}>
            <Icon icon="ph:file-text-bold" style={{ color: '#D97757', fontSize: 14 }} />
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#D97757' }}>Legal</span>
          </div>
          <h1 className="text-[2.4rem] md:text-[2.8rem] font-black text-[#2C1810] leading-tight mb-3" style={{ fontFamily: "'Nunito', sans-serif" }}>
            Terms of Service
          </h1>
          <p className="text-[14px] text-[#9c8b7e] font-semibold">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="space-y-8">
          <section>
            <p className="text-[16px] leading-relaxed text-[#6b5c50]">
              Welcome to Pariverse, operated by Mummaverse Private Limited. By accessing or using the Pariverse mobile application or website (pariverse.in), you agree to be bound by these Terms of Service. Please read them carefully.
            </p>
          </section>

          {[
            {
              title: '1. Acceptance of Terms',
              content: `By creating an account or using Pariverse, you confirm that you are at least 18 years old, have the legal capacity to enter into these terms, and agree to comply with all applicable laws and these Terms of Service.

If you use Pariverse on behalf of a family unit, you represent that all family members using the app are subject to these terms.`,
            },
            {
              title: '2. Description of Service',
              content: `Pariverse is a family management application providing:

- **Meal Planning:** AI-assisted weekly meal planning and grocery list generation
- **Nutrition Tracking:** Nutritional intake monitoring for family members
- **First Aid Guidance:** Doctor-reviewed first-response guidance for common household emergencies
- **Chore Management:** Family chore assignment and tracking
- **Mom Community:** A social platform for Indian moms to share, discuss, and support each other

Services are provided "as is" and may be updated, modified, or discontinued at any time with reasonable notice.`,
            },
            {
              title: '3. User Accounts',
              content: `You are responsible for:

- Maintaining the confidentiality of your account credentials
- All activity that occurs under your account
- Providing accurate and up-to-date information
- Notifying us immediately of any unauthorised use at pariverse94@gmail.com

We reserve the right to suspend or terminate accounts that violate these terms.`,
            },
            {
              title: '4. Acceptable Use',
              content: `You agree NOT to:

- Post content that is abusive, harassing, hateful, obscene, or harmful to others
- Share false or misleading health/medical information
- Impersonate other users, medical professionals, or Mummaverse staff
- Use the platform for commercial solicitation without our permission
- Attempt to access other users' accounts or data
- Use automated bots or scrapers on our platform
- Violate any applicable Indian or international law

We reserve the right to remove content and suspend accounts that violate these guidelines.`,
            },
            {
              title: '5. Medical & Health Disclaimer',
              content: `**Pariverse is not a medical service.**

First aid guidance provided on Pariverse is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always:

- Consult a qualified healthcare professional for medical concerns
- Call emergency services (108) in life-threatening situations
- Follow the advice of your doctor over any app guidance

Mummaverse is not liable for any health outcomes resulting from reliance on app content.`,
            },
            {
              title: '6. Community Guidelines',
              content: `The Pariverse Mom Community is a safe space. All users must:

- Be respectful and supportive of other moms
- Not share personally identifiable information of others without consent
- Not post spam, advertisements, or promotional content
- Not share unverified medical advice as fact — clearly mark opinions as opinions
- Report harmful content using the in-app reporting feature

Mummaverse moderates community content and may remove posts or restrict accounts that violate community guidelines.`,
            },
            {
              title: '7. Intellectual Property',
              content: `All content on Pariverse — including the app design, logo, features, AI-generated suggestions, and written content — is owned by Mummaverse Private Limited or its licensors.

You retain ownership of content you post in the community. By posting, you grant Mummaverse a non-exclusive, royalty-free licence to display and distribute your content within the platform.

You may not copy, reproduce, or distribute Pariverse's proprietary content without written permission.`,
            },
            {
              title: '8. Pricing & Subscriptions',
              content: `Core features of Pariverse are free. If we introduce premium features in the future:

- Pricing will be clearly communicated before any charges
- Subscriptions can be cancelled at any time
- Refunds will be handled per the platform's refund policy (App Store / Play Store)
- Free tier users will always have access to core features`,
            },
            {
              title: '9. Limitation of Liability',
              content: `To the maximum extent permitted by Indian law, Mummaverse shall not be liable for:

- Indirect, incidental, or consequential damages
- Loss of data, profits, or business opportunities
- Health outcomes from reliance on app content
- Service interruptions or technical failures

Our total liability to you shall not exceed the amount you have paid to us in the past 12 months (if any).`,
            },
            {
              title: '10. Governing Law & Disputes',
              content: `These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in India.

We encourage you to first contact us at pariverse94@gmail.com to resolve any disputes informally before pursuing legal action.`,
            },
            {
              title: '11. Changes to Terms',
              content: `We may update these Terms at any time. We will provide at least 15 days' notice for significant changes via email or in-app notification. Continued use of Pariverse after changes take effect constitutes acceptance of the new Terms.`,
            },
            {
              title: '12. Contact',
              content: `For questions about these Terms:

**Mummaverse Private Limited**
Email: pariverse94@gmail.com

We aim to respond within 7 business days.`,
            },
          ].map(({ title, content }) => (
            <section key={title}>
              <h2 className="text-[1.3rem] font-black text-[#2C1810] mb-3 mt-8" style={{ fontFamily: "'Nunito', sans-serif" }}>{title}</h2>
              {content.split('\n\n').map((para, i) => (
                <p
                  key={i}
                  className="text-[15px] leading-relaxed text-[#6b5c50] mb-3"
                  dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.+?)\*\*/g, '<strong class="text-[#2C1810]">$1</strong>').replace(/^- /gm, '• ').replace(/\n- /g, '\n• ').replace(/\n/g, '<br/>') }}
                />
              ))}
            </section>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  )
}
