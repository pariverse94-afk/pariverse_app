export interface FaqItem {
  q: string
  a: string
}

export interface FaqGroup {
  category: string
  items: FaqItem[]
}

export const FAQS: FaqGroup[] = [
  {
    category: 'About Pariverse',
    items: [
      { q: 'What is Pariverse?', a: "India's first home management app by Mummaverse, built for urban moms in nuclear families. It brings together meal planning, nutrition tracking, AI-powered first aid guidance, and a judgment-free mom community — all in one app." },
      { q: 'What is Mummaverse?', a: "Mummaverse is a product company building apps for urban Indian moms. Pariverse is our first app. Eduverse (for children's learning) and Selfverse (for mom's personal wellbeing) are coming next." },
      { q: 'Who is Pariverse for?', a: 'Primarily urban Indian moms in nuclear families — whether working or stay-at-home. But the whole family benefits: partners can use the chore board, kids earn streaks, and everyone eats better.' },
    ],
  },
  {
    category: 'Features',
    items: [
      { q: 'What does the meal planner do?', a: "It generates weekly Indian meal plans based on your family's preferences, dietary needs, and what's in your pantry. It also auto-generates a shopping list sorted by store section, and suggests ways to use leftovers." },
      { q: 'How does the first aid guide work?', a: 'You select a symptom or condition (burns, fever, cuts, choking, etc.), enter your child\'s age and severity, and get calm, doctor-reviewed step-by-step guidance. It also shows emergency helpline numbers for India (108, 1800-180-1104).' },
      { q: 'What is the Mom Community?', a: "A safe, topic-based community for Indian moms. Categories include Recipes, Parenting, Health, and General. You can post, like, save, and respond to other moms' posts. Anonymous posting is supported." },
      { q: 'What is the chore board?', a: 'A visual board that assigns household chores to family members — parents and children. It includes reminders, family streaks to gamify tasks for kids, and a weekly fairness check showing if the load is balanced.' },
    ],
  },
  {
    category: 'Pricing & Access',
    items: [
      { q: 'Is Pariverse free?', a: 'Yes, core features will always be free. We believe every Indian mom deserves support, regardless of budget. Optional premium features may come later, but the essentials stay free.' },
      { q: 'When will Pariverse launch?', a: "We're in beta. Join the waitlist and you'll be among the first to get access. Waitlist members get early access and help shape the product." },
      { q: 'Is it available on iOS?', a: "We're launching on Android first (Play Store). iOS is on our roadmap. Join the waitlist and we'll notify you when iOS is available." },
    ],
  },
  {
    category: 'Privacy & Safety',
    items: [
      { q: 'Is my data safe?', a: "Yes. We use end-to-end encryption for sensitive data, never sell your data to third parties, and are DPDPA (India's Digital Personal Data Protection Act) compliant. You can delete your account and all data at any time." },
      { q: 'Can my partner use the same account?', a: 'Yes. Family accounts allow multiple members. Partners can see and contribute to the chore board, and the app shifts household responsibility from "helping mom" to "sharing responsibility."' },
      { q: 'Is the first aid advice medically approved?', a: 'All first aid content is reviewed by medical professionals and follows standard guidelines. However, Pariverse provides first-response guidance, not a substitute for professional medical advice. Always consult a doctor for serious concerns.' },
    ],
  },
]
