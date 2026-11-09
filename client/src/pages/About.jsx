import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaLeaf, FaUserMd, FaLock, FaHandsHelping, FaArrowRight, FaBrain,
  FaComments, FaBalanceScale, FaSeedling, FaCalendarCheck, FaVideo,
  FaClipboardCheck, FaHeartbeat, FaCertificate, FaShieldAlt, FaEye,
} from 'react-icons/fa';

const stats = [
  { value: '8+', label: 'Years of Care' },
  { value: '7', label: 'Specialties' },
  { value: '2,500+', label: 'Sessions Held' },
  { value: '4.9/5', label: 'Client Rating' },
];

const modalities = [
  {
    icon: FaBrain,
    name: 'Cognitive Behavioral Therapy (CBT)',
    text: 'Identifies and reshapes unhelpful thought patterns that drive anxiety, depression, and stress — one of the most evidence-backed approaches in modern psychology.',
  },
  {
    icon: FaComments,
    name: 'Person-Centered Therapy',
    text: 'A non-directive approach built on empathy and unconditional positive regard, giving you space to lead the conversation at your own pace.',
  },
  {
    icon: FaBalanceScale,
    name: 'Dialectical Behavior Therapy (DBT)',
    text: 'Combines mindfulness with practical emotional-regulation skills — especially effective for intense emotions and relationship difficulties.',
  },
  {
    icon: FaSeedling,
    name: 'Psychodynamic Therapy',
    text: 'Explores how past experiences and unconscious patterns shape present behavior, aiming for deeper, lasting self-understanding.',
  },
];

const process = [
  { icon: FaCalendarCheck, title: 'Book a Session', text: 'Pick a therapist and a time that works for you — no account or waiting list required.' },
  { icon: FaClipboardCheck, title: 'Share What Brings You Here', text: 'A short optional note helps your therapist prepare, but you can also share nothing at all.' },
  { icon: FaVideo, title: 'Meet Securely, Online', text: 'Join your therapist through a private video session, right from your browser.' },
  { icon: FaHeartbeat, title: 'Continue at Your Pace', text: 'Book follow-up sessions whenever you\'re ready — therapy works best without pressure.' },
];

const milestones = [
  { year: '2018', text: 'Mosaic Minds began as a single therapist\'s private practice, focused on anxiety and stress counseling.' },
  { year: '2020', text: 'Expanded to a small team of licensed therapists across five specialties, as demand grew during a difficult year for mental health.' },
  { year: '2023', text: 'Introduced secure online sessions, removing geography as a barrier to consistent care.' },
  { year: 'Today', text: 'A growing practice built around one principle: therapy should be easy to start and comfortable to continue.' },
];

const values = [
  { icon: FaLeaf, title: 'Compassion First', text: 'Every session starts with genuine care — you are heard, not judged.' },
  { icon: FaUserMd, title: 'Licensed Experts', text: 'Our therapists bring real clinical training across a range of specialties.' },
  { icon: FaLock, title: 'Complete Privacy', text: 'Your sessions and information are confidential, always.' },
  { icon: FaHandsHelping, title: 'Accessible Support', text: 'No account needed to book — just pick a time and show up.' },
];

const commitments = [
  { icon: FaCertificate, title: 'Verified Credentials', text: 'Every therapist\'s license and training is verified before they join our practice.' },
  { icon: FaShieldAlt, title: 'Confidentiality by Design', text: 'Session notes are visible only to the therapist who wrote them — not even our admin team can access them.' },
  { icon: FaEye, title: 'Transparent Practice', text: 'Clear session fees, clear cancellation policies, no hidden terms.' },
];

function FadeIn({ children, delay = 0, direction = 'up', className = '' }) {
  const offsets = { up: { y: 24, x: 0 }, left: { x: -24, y: 0 }, right: { x: 24, y: 0 }, none: { x: 0, y: 0 } };
  const { x, y } = offsets[direction];
  return (
    <motion.div
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function About() {
  return (
    <div>
      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="blob w-96 h-96 bg-amber -top-32 -left-24 animate-blobFloat" />
        <div className="blob w-72 h-72 bg-clay top-40 right-0 animate-blobFloatSlow" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <span className="inline-block bg-amber/15 text-umber text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
              About Mosaic Minds
            </span>
            <h1 className="font-display text-4xl lg:text-6xl font-semibold text-umber mb-6 leading-tight">
              Every Mind Has <span className="text-rust">Many Pieces.</span>
            </h1>
            <p className="text-umber/60 text-base lg:text-lg leading-relaxed">
              Mosaic Minds was founded on a simple belief: mental health
              support should be easy to access, free of stigma, and built
              around you — not the other way around.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ---------------- MISSION & VISION ---------------- */}
      <section className="max-w-6xl mx-auto px-6 lg:px-10 pb-16">
        <div className="grid md:grid-cols-2 gap-6">
          <FadeIn direction="left" className="warm-card p-8 lg:p-10">
            <span className="inline-flex w-12 h-12 rounded-2xl bg-rust/10 text-rust items-center justify-center text-xl mb-5">
              <FaHeartbeat />
            </span>
            <h3 className="font-display text-2xl font-semibold text-umber mb-3">Our Mission</h3>
            <p className="text-umber/60 leading-relaxed">
              To remove every unnecessary barrier between someone who needs
              support and the therapist who can provide it — starting with
              how easy it is to simply book a first session.
            </p>
          </FadeIn>
          <FadeIn direction="right" delay={0.1} className="rounded-3xl shadow-warm border border-rust/10 p-8 lg:p-10 bg-umber text-white">
            <span className="inline-flex w-12 h-12 rounded-2xl bg-white/10 text-amber items-center justify-center text-xl mb-5">
              <FaLeaf />
            </span>
            <h3 className="font-display text-2xl font-semibold mb-3">Our Vision</h3>
            <p className="text-white/65 leading-relaxed">
              A world where reaching out for mental health support feels as
              ordinary — and as welcome — as seeing any other doctor.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ---------------- STATS ---------------- */}
      <section className="max-w-6xl mx-auto px-6 lg:px-10 pb-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="warm-card text-center py-8 px-4"
            >
              <p className="font-display text-3xl lg:text-4xl font-semibold text-rust mb-1">{stat.value}</p>
              <p className="text-xs text-umber/55 uppercase tracking-wide font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------------- THERAPEUTIC APPROACHES ---------------- */}
      <section className="relative bg-amber/[0.04] py-20 overflow-hidden">
        <div className="blob w-80 h-80 bg-rust -bottom-20 -left-20 animate-blobFloatSlow" />
        <div className="relative max-w-6xl mx-auto px-6 lg:px-10">
          <FadeIn className="text-center mb-14 max-w-2xl mx-auto">
            <span className="inline-block bg-rust/10 text-rust text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
              Our Approach
            </span>
            <h2 className="font-display text-3xl lg:text-4xl font-semibold text-umber mb-4">
              Grounded in Real Clinical Practice
            </h2>
            <p className="text-umber/55 leading-relaxed">
              Our therapists draw from established, evidence-based
              modalities — matched to what actually fits your situation, not
              a one-size-fits-all script.
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 gap-6">
            {modalities.map((m, i) => {
              const Icon = m.icon;
              return (
                <motion.div
                  key={m.name}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="warm-card p-7 flex gap-5"
                >
                  <div className="w-12 h-12 rounded-xl bg-rust/10 text-rust flex items-center justify-center text-xl shrink-0">
                    <Icon />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-umber mb-1.5">{m.name}</h3>
                    <p className="text-sm text-umber/60 leading-relaxed">{m.text}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------- HOW IT WORKS ---------------- */}
      <section className="max-w-6xl mx-auto px-6 lg:px-10 py-20">
        <FadeIn className="text-center mb-16 max-w-2xl mx-auto">
          <span className="inline-block bg-amber/15 text-umber text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            How It Works
          </span>
          <h2 className="font-display text-3xl lg:text-4xl font-semibold text-umber">
            From First Click to First Session
          </h2>
        </FadeIn>

        <div className="relative">
          {/* connecting line */}
          <div className="hidden lg:block absolute top-8 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-rust/20 to-transparent" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className="relative text-center"
                >
                  <div className="relative z-10 w-16 h-16 rounded-2xl bg-rust text-white flex items-center justify-center text-2xl mx-auto mb-5 shadow-warm">
                    <Icon />
                  </div>
                  <span className="text-xs font-semibold text-amber uppercase tracking-wide">Step {i + 1}</span>
                  <h3 className="font-display font-semibold text-umber mt-1 mb-2">{step.title}</h3>
                  <p className="text-sm text-umber/55 leading-relaxed">{step.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------- OUR STORY / TIMELINE ---------------- */}
      <section className="relative bg-umber py-20 overflow-hidden">
        <div className="blob w-96 h-96 bg-rust -top-20 -right-24 animate-blobFloat" />
        <div className="relative max-w-4xl mx-auto px-6 lg:px-10">
          <FadeIn className="text-center mb-16">
            <span className="inline-block bg-amber/15 text-amber text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
              Our Story
            </span>
            <h2 className="font-display text-3xl lg:text-4xl font-semibold text-white">
              How We Got Here
            </h2>
          </FadeIn>

          <div className="relative pl-8 lg:pl-0">
            {/* vertical line */}
            <div className="absolute left-[7px] lg:left-1/2 top-0 bottom-0 w-[2px] bg-white/10 lg:-translate-x-1/2" />

            <div className="space-y-10 lg:space-y-16">
              {milestones.map((m, i) => (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className={`relative lg:grid lg:grid-cols-2 lg:gap-10 items-center ${i % 2 === 0 ? '' : ''}`}
                >
                  <div className="absolute -left-8 lg:left-1/2 top-1 w-4 h-4 rounded-full bg-amber lg:-translate-x-1/2 ring-4 ring-umber" />
                  <div className={`${i % 2 === 0 ? 'lg:text-right lg:pr-12' : 'lg:col-start-2 lg:pl-12'}`}>
                    <span className="font-display text-xl font-semibold text-amber">{m.year}</span>
                    <p className="text-white/65 leading-relaxed mt-2">{m.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- VALUES ---------------- */}
      <section className="max-w-6xl mx-auto px-6 lg:px-10 py-20">
        <FadeIn className="text-center mb-14 max-w-lg mx-auto">
          <h2 className="font-display text-3xl font-semibold text-umber mb-3">What We Stand For</h2>
          <p className="text-umber/55">The principles behind every session, every interaction.</p>
        </FadeIn>

        <div className="grid sm:grid-cols-2 gap-6">
          {values.map((val, i) => {
            const Icon = val.icon;
            return (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="warm-card p-7 flex gap-5"
              >
                <div className="w-12 h-12 rounded-xl bg-rust/10 text-rust flex items-center justify-center text-xl shrink-0">
                  <Icon />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-umber mb-1.5">{val.title}</h3>
                  <p className="text-sm text-umber/55 leading-relaxed">{val.text}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ---------------- OUR COMMITMENTS ---------------- */}
      <section className="relative bg-amber/[0.04] py-20 overflow-hidden">
        <div className="blob w-72 h-72 bg-clay bottom-0 -right-16 animate-blobFloatSlow" />
        <div className="relative max-w-6xl mx-auto px-6 lg:px-10">
          <FadeIn className="text-center mb-14 max-w-2xl mx-auto">
            <span className="inline-block bg-rust/10 text-rust text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
              Our Commitment
            </span>
            <h2 className="font-display text-3xl lg:text-4xl font-semibold text-umber">
              Trust Is the Whole Foundation
            </h2>
          </FadeIn>

          <div className="grid sm:grid-cols-3 gap-6">
            {commitments.map((c, i) => {
              const Icon = c.icon;
              return (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: i * 0.12 }}
                  className="warm-card p-7 text-center"
                >
                  <span className="inline-flex w-14 h-14 rounded-2xl bg-rust/10 text-rust items-center justify-center text-2xl mb-5">
                    <Icon />
                  </span>
                  <h3 className="font-display font-semibold text-umber mb-2">{c.title}</h3>
                  <p className="text-sm text-umber/55 leading-relaxed">{c.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="max-w-5xl mx-auto px-6 lg:px-10 py-24">
        <FadeIn>
          <div className="text-center bg-rust/5 rounded-3xl py-14 px-8 border border-rust/10">
            <h2 className="font-display text-2xl lg:text-3xl font-semibold text-umber mb-4">
              Ready to talk to someone?
            </h2>
            <p className="text-umber/55 mb-8 max-w-md mx-auto">
              The hardest part is usually just starting. We've tried to make everything after that easy.
            </p>
            <Link to="/book">
              <motion.button
                whileHover={{ scale: 1.04 }}
                className="breathe-cta inline-flex items-center gap-2 bg-rust text-white font-medium px-7 py-3.5 rounded-full shadow-warm-sm"
              >
                Book Your Session <FaArrowRight className="text-sm" />
              </motion.button>
            </Link>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}