import { Icon } from '@iconify/react'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'

const LAST_UPDATED = 'June 12, 2025'

export default function PrivacyPage() {
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
            <Icon icon="ph:shield-check-bold" style={{ color: '#D97757', fontSize: 14 }} />
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#D97757' }}>Legal</span>
          </div>
          <h1 className="text-[2.4rem] md:text-[2.8rem] font-black text-[#2C1810] leading-tight mb-3" style={{ fontFamily: "'Nunito', sans-serif" }}>
            Privacy Policy
          </h1>
          <p className="text-[14px] text-[#9c8b7e] font-semibold">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="prose max-w-none space-y-8 text-[#4A4A4A]">
          <section>
            <p className="text-[16px] leading-relaxed text-[#6b5c50]">
              Mummaverse Private Limited ("Mummaverse", "we", "our", or "us") operates the Pariverse mobile application and website (pariverse.in). This Privacy Policy explains how we collect, use, disclose, and protect your information when you use our services.
            </p>
            <p className="text-[16px] leading-relaxed text-[#6b5c50] mt-3">
              By using Pariverse, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          {[
            {
              title: '1. Information We Collect',
              content: `We collect the following types of information:

**Account Information:** When you register, we collect your name, email address, and optionally your phone number.

**Family Profile Data:** Information about your family members (names, ages, dietary preferences, health conditions) that you voluntarily provide to personalise your experience.

**Usage Data:** How you interact with the app — features used, content viewed, actions taken — to improve the product.

**Device Information:** Device type, operating system, and app version for technical support and compatibility.

**Community Content:** Posts, comments, and reactions you share in the Pariverse community. Anonymous content is stored without linking to your identity.`,
            },
            {
              title: '2. How We Use Your Information',
              content: `We use your information to:

- Provide and personalise the Pariverse app features (meal planning, chore board, first aid guidance, community)
- Generate AI-powered meal suggestions and first aid guidance relevant to your family
- Send important service updates, feature announcements, and support communications
- Improve and develop new features based on usage patterns
- Ensure platform safety and prevent misuse
- Comply with legal obligations under Indian law, including the Digital Personal Data Protection Act (DPDPA) 2023`,
            },
            {
              title: '3. Data Sharing',
              content: `We do not sell your personal data.

We may share your information with:

- **Service Providers:** Trusted third parties who assist in operating our platform (cloud hosting, analytics, customer support) under strict confidentiality agreements.
- **AI Services:** Anonymised query data may be processed by AI providers (such as Anthropic Claude) to generate meal and first aid responses. We do not share identifying information.
- **Legal Requirements:** If required by law, court order, or government authority in India or applicable jurisdictions.
- **Business Transfers:** In the event of a merger or acquisition, user data may be transferred to the new entity, with prior notice to users.`,
            },
            {
              title: '4. Data Security',
              content: `We implement industry-standard security measures:

- Encryption in transit (TLS) and at rest for sensitive data
- Secure authentication with session management
- Regular security audits and vulnerability assessments
- Access controls limiting employee access to your data

While we strive to use commercially acceptable means to protect your data, no method of transmission over the internet is 100% secure.`,
            },
            {
              title: '5. Your Rights (DPDPA 2023)',
              content: `Under India's Digital Personal Data Protection Act 2023, you have the right to:

- **Access:** Know what personal data we hold about you
- **Correction:** Request correction of inaccurate data
- **Erasure:** Delete your account and all associated data at any time
- **Grievance Redressal:** File a complaint with our Data Protection Officer
- **Nomination:** Nominate another person to exercise your rights in case of death or incapacity

To exercise any of these rights, contact us at pariverse94@gmail.com.`,
            },
            {
              title: '6. Children\'s Privacy',
              content: `Pariverse is designed for adults (parents/guardians). We do not knowingly collect personal information from children under 13 years of age directly. Children's profiles within family accounts are created and managed by parents.

If you believe we have inadvertently collected information from a child under 13, please contact us immediately at pariverse94@gmail.com.`,
            },
            {
              title: '7. Data Retention',
              content: `We retain your data for as long as your account is active or as needed to provide services. When you delete your account:

- Personal profile data is deleted within 30 days
- Community posts may be anonymised rather than deleted to preserve community context
- Legal records may be retained as required by applicable law`,
            },
            {
              title: '8. Cookies & Tracking',
              content: `Our website (pariverse.in) may use cookies and similar tracking technologies to:

- Remember your preferences (such as dark/light mode)
- Analyse website traffic and usage patterns
- Improve website performance

You can control cookies through your browser settings. Disabling cookies may affect some website functionality.`,
            },
            {
              title: '9. Changes to This Policy',
              content: `We may update this Privacy Policy from time to time. We will notify you of significant changes via email or in-app notification at least 15 days before changes take effect. Continued use of Pariverse after changes constitutes acceptance of the updated policy.`,
            },
            {
              title: '10. Contact Us',
              content: `For privacy concerns, data requests, or grievances:

**Mummaverse Private Limited**
Email: pariverse94@gmail.com
Data Protection Officer: pariverse94@gmail.com

We aim to respond to all queries within 7 business days.`,
            },
          ].map(({ title, content }) => (
            <section key={title}>
              <h2 className="text-[1.3rem] font-black text-[#2C1810] mb-3 mt-8" style={{ fontFamily: "'Nunito', sans-serif" }}>{title}</h2>
              {content.split('\n\n').map((para, i) => (
                <p key={i} className="text-[15px] leading-relaxed text-[#6b5c50] mb-3"
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
