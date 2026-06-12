export interface Article {
  id: number
  slug: string
  category: string
  categoryColor: string
  date: string
  readTime: string
  icon: string
  iconColor: string
  gradientFrom: string
  gradientTo: string
  alt: string
  title: string
  summary: string
  ctaBg: string
  ctaText: string
  content: string
}

export const ARTICLES: Article[] = [
  {
    id: 1,
    slug: 'why-indian-moms-carry-mental-load',
    category: 'Mental Load',
    categoryColor: 'text-orange-600',
    date: 'June 10, 2025',
    readTime: '8 min',
    icon: 'ph:brain-bold',
    iconColor: '#ea580c',
    gradientFrom: '#FFF3E8',
    gradientTo: '#FFE4C8',
    alt: 'Mental load illustration',
    title: 'Why Indian Moms Carry 95% of the Mental Load',
    summary: 'Research shows Indian mothers shoulder an overwhelming share of invisible household management. Here is the data and five steps to redistribute it.',
    ctaBg: 'bg-orange-50/30 border-orange-200/30',
    ctaText: 'Want to see how Pariverse makes mental load visible?',
    content: `
      <p>If you have ever woken up at 3 AM thinking about whether you bought enough milk, or felt anxiety because you cannot remember if you switched off the gas - you already know what mental load is.</p>
      <h2>What Exactly Is Mental Load?</h2>
      <p>Mental load is the invisible work of managing a household. It is not the physical act of cooking - it is the mental process of deciding what to cook, checking ingredients, remembering who does not eat onions, adjusting for a school trip tomorrow. It is planning, anticipating, remembering, and adjusting - constantly, endlessly, without recognition.</p>
      <p>A 2019 study found that women shoulder significantly more cognitive household labour than men - even in dual-income households. In India, where gender role norms are stronger and joint family support is eroding, this gap is even wider.</p>
      <h2>Why It Is Worse for Indian Nuclear Families</h2>
      <p>In a joint family, mental load was distributed. Your mother-in-law remembered puja items. Your sister-in-law tracked homework. In a nuclear family, all of that lands on one person - almost always the mother.</p>
      <ul>
        <li><strong>Meal management:</strong> Planning three meals for 3-5 people with different preferences, seasonal ingredients, festival fasting days.</li>
        <li><strong>Health monitoring:</strong> Doctor appointments, medicine refills, vaccination schedules, blood pressure checks.</li>
        <li><strong>School logistics:</strong> Exam schedules, permission slips, sports day vs annual day, uniform prep, bag packing.</li>
        <li><strong>Social obligations:</strong> Birthdays, festival gifting, neighbour relations, maintaining family ties.</li>
        <li><strong>Household maintenance:</strong> Water purifier filters, deep cleaning, AC servicing, maid coordination.</li>
      </ul>
      <p>None of this shows up on a to-do list. None of it gets "done" in a visible way. That is what makes it so exhausting.</p>
      <h2>The Data</h2>
      <p>A 2023 survey found 78% of urban Indian moms reported being the sole household planner. 64% could not remember the last day they did not think about household tasks. 52% said their partner was unaware of the mental load they carried.</p>
      <h2>Five Steps to Redistribute</h2>
      <h3>1. Name It</h3>
      <p>Say: "The work is not doing the dishes. The work is knowing the dishes need to be done, when, and whether detergent exists."</p>
      <h3>2. Make It Visible</h3>
      <p>Write down everything you manage mentally for one week. The list will shock both of you.</p>
      <h3>3. Divide by Category, Not Task</h3>
      <p>Assign "own all things laundry - detergent to folding to dry-clean items." That is the whole mental load for that category.</p>
      <h3>4. Use a Tool</h3>
      <p>Pariverse creates visual boards, reminders, and a weekly fairness check showing whether the load is balanced.</p>
      <h3>5. Accept Imperfection</h3>
      <p>The rice might be overcooked. Let it go. A badly-done chore by someone else is still one less chore for you.</p>
      <h2>Final Word</h2>
      <p>Carrying 95% of the mental load does not make you a supermom. It makes you an unsupported mom. You deserve tools and a partner who shares the invisible work - not because you cannot handle it, but because you were never supposed to handle it alone.</p>
    `,
  },
  {
    id: 2,
    slug: 'end-the-aaj-kya-banau-struggle',
    category: 'Meal Planning',
    categoryColor: 'text-amber-600',
    date: 'June 5, 2025',
    readTime: '7 min',
    icon: 'ph:cooking-pot-bold',
    iconColor: '#d97706',
    gradientFrom: '#FFFBEB',
    gradientTo: '#FEF3C7',
    alt: 'Meal planning illustration',
    title: 'Aaj Kya Banau? End the Daily Struggle',
    summary: 'Decision fatigue by 6 PM is real. This five-step Sunday system ends the "aaj kya banau" spiral and cuts daily cooking stress in half.',
    ctaBg: 'bg-orange-50/30 border-orange-200/30',
    ctaText: 'Let Pariverse handle "aaj kya banau" for you.',
    content: `
      <p>"Aaj kya banau" is not about food. It is about decision fatigue. By 6 PM you have already made fifty decisions. This one - what four people will eat, whether it is nutritious, whether anyone will complain - feels like the heaviest.</p>
      <h2>The Weekly System</h2>
      <h3>Step 1: Take Inventory (5 min)</h3>
      <p>Open fridge and pantry. Write what you have.</p>
      <h3>Step 2: Pick Backbone (5 min)</h3>
      <p>Plan dal + sabzi combos: Monday (moong dal + aloo gobi), Tuesday (rajma + bhindi), Wednesday (toor dal + palak paneer).</p>
      <h3>Step 3: Fill Breakfast (5 min)</h3>
      <p>Rotate 5-7 standards: poha, upma, paratha, idli, oats, eggs, toast.</p>
      <h3>Step 4: Grocery List (10 min)</h3>
      <p>Compare plan against inventory. Write missing items sorted by store section.</p>
      <h3>Step 5: Prep Night Before (5 min)</h3>
      <p>Soak dal, chop vegetables. Cuts cooking time 30-40%.</p>
      <h2>How Pariverse Does This</h2>
      <p>Enter preferences once. Pariverse generates weekly plans, auto-generates grocery lists, suggests leftover recycling. Swap with one tap.</p>
    `,
  },
  {
    id: 3,
    slug: 'first-aid-at-home-what-every-mom-should-know',
    category: 'First Aid',
    categoryColor: 'text-blue-600',
    date: 'May 28, 2025',
    readTime: '9 min',
    icon: 'ph:first-aid-kit-bold',
    iconColor: '#2563eb',
    gradientFrom: '#EFF6FF',
    gradientTo: '#DBEAFE',
    alt: 'First aid illustration',
    title: 'First Aid at Home: What Every Mom Should Know',
    summary: 'Burns, fevers, choking, head bumps — a doctor-reviewed Indian home guide so you never have to Google at 2 AM again.',
    ctaBg: 'bg-blue-50/30 border-blue-200/30',
    ctaText: 'No more Googling at 2 AM.',
    content: `
      <p>Your 4-year-old wakes up at 11 PM with 102F fever. You Google and get conflicting results. This happens in thousands of Indian homes every night.</p>
      <p><strong>Disclaimer: First-response guidance, not medical advice.</strong></p>
      <h2>Top 6 Emergencies</h2>
      <h3>1. Kitchen Burns</h3>
      <p>Cool water 10-20 min. No toothpaste, turmeric, butter, or oil. Clean dressing. See doctor if larger than a coin, on face, or blistering.</p>
      <h3>2. Child Fever Below 103F</h3>
      <p>Paracetamol by weight. Hydrate with ORS. Dress lightly. <strong>Red flags:</strong> above 103F not responding, lasting 3+ days, unusual drowsiness.</p>
      <h3>3. Cuts</h3>
      <p>Running water (not dettol directly). Pressure with clean cloth. Povidone-iodine + band-aid. <strong>Red flags:</strong> bleeding 10+ min pressure, deep cut.</p>
      <h3>4. Choking</h3>
      <p>If coughing, let them. If not: face-down, 5 back blows between shoulder blades. Call emergency if no improvement.</p>
      <h3>5. Head Bump</h3>
      <p>Ice pack in cloth, 10 min. Observe 24 hrs. <strong>Red flags:</strong> unconsciousness, repeated vomiting, unequal pupils.</p>
      <h3>6. Mosquito Bites</h3>
      <p>Soap + calamine. Fever + body aches 2-7 days after bite = dengue test immediately.</p>
      <h2>Your Kit</h2>
      <ul>
        <li>Paracetamol syrup + tablets</li>
        <li>ORS packets</li>
        <li>Povidone-iodine, band-aids, gauze</li>
        <li>Digital thermometer</li>
        <li>Scissors, tweezers</li>
        <li>Burnol, antihistamine</li>
        <li>Doctor + hospital contact card</li>
      </ul>
    `,
  },
  {
    id: 4,
    slug: 'child-nutrition-gaps-no-one-talks-about',
    category: 'Nutrition',
    categoryColor: 'text-emerald-600',
    date: 'May 20, 2025',
    readTime: '6 min',
    icon: 'ph:leaf-bold',
    iconColor: '#059669',
    gradientFrom: '#ECFDF5',
    gradientTo: '#D1FAE5',
    alt: 'Nutrition illustration',
    title: "Your Child's Nutrition: The Gaps No One Talks About",
    summary: '"My child eats well" can still mean iron, vitamin D, calcium or B12 deficiency. Here are the signs to spot and the simple kitchen fixes.',
    ctaBg: 'bg-emerald-50/30 border-emerald-200/30',
    ctaText: 'Know what your family eats - without obsessing.',
    content: `
      <p>"My child eats well" is dangerous. Your child might finish roti but still be deficient in iron, calcium, vitamin D, or B12.</p>
      <h2>The Big Four</h2>
      <h3>1. Iron (50%+ Indian Kids)</h3>
      <p>Signs: tiredness, pale lower eyelids, frequent infections. Fix: iron foods (spinach, jaggery, ragi) + vitamin C (lemon, amla). Avoid tea/milk with iron meals.</p>
      <h3>2. Vitamin D (70-90%)</h3>
      <p>Despite sunshine, urban kids are severely deficient. Fix: 15-20 min morning sun. Fortified milk. Ask paediatrician about supplementation.</p>
      <h3>3. Calcium</h3>
      <p>Milk only has ~300mg (need 600-1000mg). Fix: ragi, sesame, curd, paneer, almonds.</p>
      <h3>4. B12 (Vegetarian Families)</h3>
      <p>Signs: tingling, memory issues, fatigue. Fix: daily dairy. Fortified cereals. B12 blood test if symptoms.</p>
      <h2>How Pariverse Helps</h2>
      <p>Not obsessive tracking - gentle awareness. "Iron was low this week, here are three dishes to fix it."</p>
    `,
  },
  {
    id: 5,
    slug: 'nuclear-family-guilt-why-you-feel-like-failing',
    category: 'Mental Health',
    categoryColor: 'text-purple-600',
    date: 'May 15, 2025',
    readTime: '7 min',
    icon: 'ph:heart-bold',
    iconColor: '#9333ea',
    gradientFrom: '#FAF5FF',
    gradientTo: '#EDE9FE',
    alt: 'Mental health illustration',
    title: 'Nuclear Family Guilt: Why You Feel Like Failing',
    summary: 'That constant feeling of not doing enough — it is not a personal failure. It is a structural problem. Here is why, and what actually helps.',
    ctaBg: 'bg-purple-50/30 border-purple-200/30',
    ctaText: 'You deserve systems that support you, not guilt that drains you.',
    content: `
      <p>Seen a mom posting organic snacks on Instagram and felt inadequate? This is for you.</p>
      <h2>What It Actually Is</h2>
      <p>A cocktail: not doing enough for your child, your in-laws, not earning enough if home or not present enough if working, house not clean enough, meals not healthy enough. The belief that if you tried harder, you could manage everything perfectly.</p>
      <h2>The Structural Problem</h2>
      <p>In a joint family, emotional labour was shared. A crying baby was handed to three people. In a nuclear family, that entire load lands on one person. Society still judges by joint-family standards while removing the infrastructure that made those standards achievable.</p>
      <h2>The Guilt Traps</h2>
      <h3>"I should cook from scratch"</h3>
      <p>In a joint family, three women cooked together. Pre-cut vegetables and ready-made rotis are not failure - it is resource management.</p>
      <h3>"I should spend more time with my child"</h3>
      <p>30 minutes of fully present, phone-free playtime beats 3 hours of distracted, guilty presence.</p>
      <h3>"My house should always be clean"</h3>
      <p>A lived-in house with a happy mom beats a spotless house with an exhausted one.</p>
      <h3>"I should handle this alone"</h3>
      <p>Your grandmother was not self-sufficient. She had support. You deserve support too - your partner, tools like Pariverse, or a community of moms.</p>
      <h2>Final Thought</h2>
      <p>The guilt is not because you are inadequate. It is because you are adequate in an inadequate system. You are doing the job of three people with recognition of zero.</p>
    `,
  },
  {
    id: 6,
    slug: 'getting-kids-to-do-chores-without-a-fight',
    category: 'Mental Load',
    categoryColor: 'text-orange-600',
    date: 'May 8, 2025',
    readTime: '6 min',
    icon: 'ph:broom-bold',
    iconColor: '#ea580c',
    gradientFrom: '#FFF3E8',
    gradientTo: '#FDDCBC',
    alt: 'Chores illustration',
    title: 'Getting Kids to Do Chores Without a Fight',
    summary: 'Age-appropriate chore systems that Indian kids actually follow — no nagging, no guilt, just a visual chart and one simple rule.',
    ctaBg: 'bg-orange-50/30 border-orange-200/30',
    ctaText: 'Let Pariverse turn chore charts into a family habit.',
    content: `
      <p>Every Indian mom has said some version of "how many times do I have to tell you?" The answer is not more repetition. The answer is a system.</p>
      <h2>Why Kids Do Not Do Chores</h2>
      <p>They do not know what is expected. Instructions change daily. There is no consistent consequence. They see one parent doing everything, so there is no modelled sharing culture.</p>
      <p>None of this is the child's fault. It is a missing system problem.</p>
      <h2>Age-Appropriate Chores That Actually Work</h2>
      <h3>Ages 3–5</h3>
      <ul>
        <li>Put toys in the bin after playtime</li>
        <li>Place their plate in the sink after meals</li>
        <li>Help sort socks by colour</li>
        <li>Water one small plant</li>
      </ul>
      <h3>Ages 6–9</h3>
      <ul>
        <li>Set and clear the dining table</li>
        <li>Pack their own school bag</li>
        <li>Fold and put away their own clothes</li>
        <li>Feed a pet if you have one</li>
        <li>Sweep their room with a small broom</li>
      </ul>
      <h3>Ages 10–14</h3>
      <ul>
        <li>Do their own laundry (load + fold)</li>
        <li>Prepare one simple meal per week</li>
        <li>Mop or vacuum a room</li>
        <li>Manage their own schedule and reminders</li>
      </ul>
      <h2>The One Rule That Changes Everything</h2>
      <p>Make it visual, not verbal. A physical chore chart — or a digital one on the family's shared screen — removes "I forgot" as an excuse. The child sees it. You do not have to say it.</p>
      <p>Research on habit formation shows visual cues increase follow-through by over 60% compared to verbal reminders alone.</p>
      <h2>Rewards vs Responsibility</h2>
      <p>Avoid tying chores to pocket money for every task. It creates a transactional mindset where kids do nothing without payment. Instead, frame it as: "We all live here, we all take care of it." Keep pocket money separate from household contribution.</p>
      <p>That said, occasional treats for consistent effort work well. A movie outing or favourite meal when the whole family completes their week without reminders is powerful positive reinforcement.</p>
      <h2>When They Resist</h2>
      <p>Start small. One chore. Non-negotiably. Every day. For two weeks. Consistency matters more than scope. Once that habit is formed, add the next chore.</p>
      <p>Never redo their work in front of them. If the table is slightly crooked, leave it. Fixing their work teaches them their effort does not matter.</p>
      <h2>The Long Game</h2>
      <p>Children raised with chore responsibility are better at managing themselves, more empathetic partners, and more capable adults. The short-term resistance is worth the long-term outcome.</p>
    `,
  },
  {
    id: 7,
    slug: 'indian-superfoods-your-kitchen-already-has',
    category: 'Nutrition',
    categoryColor: 'text-emerald-600',
    date: 'April 29, 2025',
    readTime: '5 min',
    icon: 'ph:bowl-food-bold',
    iconColor: '#059669',
    gradientFrom: '#ECFDF5',
    gradientTo: '#A7F3D0',
    alt: 'Indian superfoods illustration',
    title: 'Indian Superfoods Already in Your Kitchen',
    summary: 'Ragi, methi, amla, turmeric — the most nutrient-dense foods for growing kids are not expensive imports. They are already in your pantry.',
    ctaBg: 'bg-emerald-50/30 border-emerald-200/30',
    ctaText: 'Let Pariverse plan meals around what you already have.',
    content: `
      <p>The global "superfood" industry sells you blueberries, chia seeds, and açaí bowls. Meanwhile, your grandmother's kitchen had ingredients that outperform all of them — and cost a fraction of the price.</p>
      <h2>The Indian Pantry Superfood List</h2>
      <h3>Ragi (Finger Millet)</h3>
      <p>The single best calcium source in Indian cooking. 100g of ragi has more calcium than 100g of milk. It is also rich in iron and amino acids. Use it for rotis, porridge, dosas, and ladoos.</p>
      <p><strong>Best for:</strong> Bone development in children under 10, toddler weaning foods.</p>
      <h3>Methi (Fenugreek)</h3>
      <p>Regulates blood sugar, aids digestion, and is particularly beneficial for nursing mothers. Fresh methi leaves are rich in iron, calcium, and vitamins A, C, and K. Seeds soaked overnight and consumed in the morning support gut health.</p>
      <p><strong>Best for:</strong> New mothers, children with digestion issues.</p>
      <h3>Amla (Indian Gooseberry)</h3>
      <p>One amla has as much vitamin C as 20 oranges. Vitamin C is not just about immunity — it dramatically improves iron absorption, making it the perfect pairing with iron-rich foods. Eat it raw, as murabba, juice, or churna.</p>
      <p><strong>Best for:</strong> Iron-deficient children, immunity support during monsoon.</p>
      <h3>Til (Sesame Seeds)</h3>
      <p>A tablespoon of sesame seeds provides about 88mg of calcium. Til ladoos, chikki, and til rice are traditional ways to include it. White and black sesame are both nutritious.</p>
      <p><strong>Best for:</strong> Children who do not drink enough milk.</p>
      <h3>Haldi (Turmeric)</h3>
      <p>Curcumin, the active compound in turmeric, has anti-inflammatory properties backed by hundreds of studies. The key is absorption — it needs fat and black pepper (piperine) to be bioavailable. Haldi doodh with a pinch of pepper and ghee is scientifically sound.</p>
      <p><strong>Best for:</strong> Children with frequent infections, joint inflammation in adults.</p>
      <h3>Ghee</h3>
      <p>Not the villain it was made out to be. Ghee is rich in fat-soluble vitamins A, D, E, and K. It supports brain development and is the carrier fat that helps absorb turmeric, ragi, and other nutrients. One teaspoon per meal for children is sufficient.</p>
      <p><strong>Best for:</strong> Children under 5, brain development phase.</p>
      <h2>Simple Ways to Include These Daily</h2>
      <ul>
        <li>Ragi porridge with jaggery and banana for breakfast</li>
        <li>Methi thepla instead of plain roti twice a week</li>
        <li>Amla murabba or fresh amla with lunch</li>
        <li>Til sprinkled on rice, poha, or salads</li>
        <li>Haldi doodh at bedtime, especially in winter</li>
        <li>A small teaspoon of ghee on dal and sabzi</li>
      </ul>
      <h2>The Bottom Line</h2>
      <p>You do not need to buy imported superfoods. Your dadi's cooking was already optimised for your family's nutritional needs. The best diet for Indian children is the traditional Indian diet — eaten consistently.</p>
    `,
  },
  {
    id: 8,
    slug: 'recognising-mom-burnout-before-it-breaks-you',
    category: 'Mental Health',
    categoryColor: 'text-purple-600',
    date: 'April 18, 2025',
    readTime: '8 min',
    icon: 'ph:flame-bold',
    iconColor: '#9333ea',
    gradientFrom: '#FAF5FF',
    gradientTo: '#DDD6FE',
    alt: 'Mom burnout illustration',
    title: 'Recognising Mom Burnout Before It Breaks You',
    summary: 'Exhaustion, resentment, and emotional numbness are not normal parenting — they are burnout signals. Here is how to catch it early and recover.',
    ctaBg: 'bg-purple-50/30 border-purple-200/30',
    ctaText: 'Pariverse helps distribute the load so burnout stays away.',
    content: `
      <p>Burnout does not announce itself. It creeps in. You start snapping at your child for things that never used to bother you. You feel nothing when your baby laughs. You dread Sunday because it means another week.</p>
      <p>This is not being a bad mother. This is burnout — a clinical state of chronic exhaustion caused by sustained overload without recovery.</p>
      <h2>What Parental Burnout Actually Is</h2>
      <p>Parental burnout is distinct from general burnout. It is specifically tied to the parenting role. Researcher Isabelle Roskam defines it as a state of intense exhaustion related to one's parental role, emotional distance from one's children, and loss of fulfilment as a parent.</p>
      <p>Indian mothers face a particularly high-risk profile: dual mental load (household + career), eroded joint family support, high cultural expectations for self-sacrifice, and stigma around admitting struggle.</p>
      <h2>The Early Warning Signs</h2>
      <h3>Physical</h3>
      <ul>
        <li>Persistent fatigue that does not improve with sleep</li>
        <li>Frequent illness (immune suppression from chronic stress)</li>
        <li>Headaches, back pain, or jaw clenching</li>
        <li>Disrupted sleep even when exhausted</li>
      </ul>
      <h3>Emotional</h3>
      <ul>
        <li>Irritability out of proportion to the trigger</li>
        <li>Emotional numbness — not feeling connected to your child</li>
        <li>Resentment toward your partner, in-laws, or even your child</li>
        <li>Crying without a clear reason</li>
      </ul>
      <h3>Cognitive</h3>
      <ul>
        <li>Forgetting things you would normally remember</li>
        <li>Difficulty making small decisions</li>
        <li>Inability to concentrate or be present</li>
        <li>Catastrophising or worst-case thinking</li>
      </ul>
      <h2>What Does Not Help (Common Advice That Misses the Point)</h2>
      <p><strong>"Take a break."</strong> A two-hour spa visit does not fix a structural overload. The laundry is still waiting when you return.</p>
      <p><strong>"Sleep when the baby sleeps."</strong> You cannot sleep when there are three other things only you can do during that window.</p>
      <p><strong>"Just ask for help."</strong> Asking requires emotional energy you do not have. It also requires knowing what to ask for — which itself is part of the mental load.</p>
      <h2>What Actually Helps</h2>
      <h3>Reduce the Load, Not Just the Person</h3>
      <p>The solution is not rest — it is redistribution. Which tasks are you doing that someone else could own completely? Not help with. Own. Including the remembering.</p>
      <h3>Name the Breaking Points</h3>
      <p>Identify the specific moments that drain you most. Evening meal + homework + bath routine all at once? That is a design problem, not a stamina problem. Can homework happen before you reach home? Can bath happen before dinner?</p>
      <h3>Lower the Bar Deliberately</h3>
      <p>Pick three things that matter most this week. Everything else is optional. Not "lower than your usual standard" — actually optional. This is not giving up. It is triage.</p>
      <h3>Talk to Someone Who Gets It</h3>
      <p>Not for advice — just to be heard. A mom friend, a therapist, a community where no one will tell you to be grateful. The isolation of nuclear family parenting is itself a burnout accelerant.</p>
      <h2>When to Seek Professional Help</h2>
      <p>If burnout has lasted more than two weeks, is affecting your relationship with your child, includes thoughts of harming yourself or disappearing, or feels like more than stress — please speak to a mental health professional. Parental burnout is treatable. It is not weakness. It is a clinical condition that responds to the right support.</p>
      <p>iCall (India): 9152987821. Vandrevala Foundation: 1860-2662-345 (24/7).</p>
      <h2>The Bigger Picture</h2>
      <p>Burnout is not a sign that you are failing at motherhood. It is a sign that you are doing too much of it alone. The goal is not to become superhuman. The goal is to build a system where you do not need to be.</p>
    `,
  },
]
