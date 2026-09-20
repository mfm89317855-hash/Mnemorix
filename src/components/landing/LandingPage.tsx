import React from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { ArrowRight, Check, FileCheck2, Fingerprint, Radar, Search, ShieldCheck } from 'lucide-react';
import { LandingNavbar } from './LandingNavbar';
import { LandingHero } from './LandingHero';
import { AuthModal } from '../auth/AuthModal';
import { soundClick } from '../../lib/sound';

interface LandingPageProps { onLaunchConsole: () => void; }

const events = [
  { time: '14:32:08', event: 'Instruction override detected', source: 'support-agent', status: 'Blocked', tone: 'blocked' },
  { time: '14:31:54', event: 'Customer preference updated', source: 'concierge-agent', status: 'Verified', tone: 'verified' },
  { time: '14:31:21', event: 'Vector drift above policy threshold', source: 'research-agent', status: 'Review', tone: 'review' },
  { time: '14:30:46', event: 'Session summary committed', source: 'support-agent', status: 'Verified', tone: 'verified' },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchConsole }) => {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.25 });

  return (
  <div className="site-shell min-h-screen">
    <motion.div className="site-scroll-progress" style={{ scaleX: progress }} />
    <LandingNavbar onLaunchConsole={onLaunchConsole} />
    <main>
      <LandingHero onLaunchConsole={onLaunchConsole} />

      <motion.section id="platform" className="site-section" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .45 }}>
        <div className="site-container">
          <div className="section-heading">
            <span className="section-label">Platform</span>
            <h2>One security boundary for every memory write.</h2>
            <p>Mnemorix evaluates content before storage, records the decision, and preserves a verifiable history for investigation.</p>
          </div>
          <div className="feature-grid">
            {[
              { icon: Search, title: 'Inspect before commit', copy: 'Check known attack patterns, semantic distance, and instruction intent before context enters persistent storage.', meta: 'L1 / L2 / L3 INSPECTION' },
              { icon: Radar, title: 'Monitor memory drift', copy: 'Track changes against an agent’s established memory profile and route unusual writes for review.', meta: 'CONTINUOUS POSTURE' },
              { icon: Fingerprint, title: 'Prove what changed', copy: 'Link signed memory blocks so mutations and missing history are immediately visible during an audit.', meta: 'SHA-256 / ED25519' },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.article key={feature.title} className="feature-card" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -5 }} viewport={{ once: true, amount: .25 }} transition={{ delay: index * .08, duration: .4 }}>
                  <div className="feature-icon"><Icon /></div>
                  <h3>{feature.title}</h3><p>{feature.copy}</p><span className="feature-meta">{feature.meta}</span>
                </motion.article>
              );
            })}
          </div>
        </div>
      </motion.section>

      <motion.section id="workflow" className="site-section alt" initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .12 }} transition={{ duration: .55 }}>
        <div className="site-container">
          <div className="section-heading">
            <span className="section-label">Operations</span>
            <h2>See the event, decision, and evidence together.</h2>
            <p>A focused operational view for triage, filtering, and investigation without decorative dashboard noise.</p>
          </div>
          <motion.div className="product-frame" initial={{ opacity: 0, scale: .985 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: .25 }} transition={{ duration: .5 }}>
            <aside className="product-side">
              <strong>Mnemorix</strong>
              <span className="active">Memory events</span><span>Threat queue</span><span>Agent fleet</span><span>Policies</span><span>Audit evidence</span>
            </aside>
            <div className="product-main">
              <div className="product-toolbar">
                <div><h3>Memory events</h3><p>Writes inspected across connected agents</p></div>
                <button className="ui-button-secondary"><Search className="h-4 w-4" /> Filter events</button>
              </div>
              <div className="event-list">
                {events.map((event, index) => (
                  <motion.div className="event-row" key={`${event.time}-${event.event}`} initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * .07, duration: .32 }} whileHover={{ x: 3, backgroundColor: 'rgba(255,255,255,.025)' }}>
                    <code>{event.time}</code><strong>{event.event}</strong><span>{event.source}</span><span className={`status-pill ${event.tone}`}>{event.status}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section id="integrity" className="site-section" initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .12 }} transition={{ duration: .55 }}>
        <div className="site-container">
          <div className="section-heading">
            <span className="section-label">Integrity and governance</span>
            <h2>Designed for investigation and proof.</h2>
            <p>Security teams can follow a memory from its source through inspection, policy enforcement, signature, and audit history.</p>
          </div>
          <div className="evidence-grid">
            <motion.article className="evidence-card" initial={{ opacity: 0, x: -18 }} whileInView={{ opacity: 1, x: 0 }} whileHover={{ y: -4 }} viewport={{ once: true }} transition={{ duration: .4 }}>
              <div className="feature-icon"><ShieldCheck /></div><h3 className="mt-5">Tamper-evident history</h3>
              <p>Verify the canonical chain, inspect individual blocks, and identify the first invalid mutation.</p>
              <div className="evidence-list"><div><span>Block signatures</span><Check /></div><div><span>Root verification</span><Check /></div><div><span>Canonical restore</span><Check /></div></div>
            </motion.article>
            <motion.article id="compliance" className="evidence-card" initial={{ opacity: 0, x: 18 }} whileInView={{ opacity: 1, x: 0 }} whileHover={{ y: -4 }} viewport={{ once: true }} transition={{ duration: .4, delay: .08 }}>
              <div className="feature-icon"><FileCheck2 /></div><h3 className="mt-5">Exportable evidence</h3>
              <p>Keep policy decisions, remediation activity, and ledger verification available for review.</p>
              <div className="evidence-list"><div><span>NIST AI RMF mapping</span><Check /></div><div><span>ISO 42001 controls</span><Check /></div><div><span>Signed audit records</span><Check /></div></div>
            </motion.article>
          </div>
        </div>
      </motion.section>

      <section className="site-section alt">
        <div className="site-container flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="section-heading !mb-0"><span className="section-label">Command center</span><h2>Review the live security posture.</h2><p>Open the console to inspect memory traffic, policies, agents, and audit evidence.</p></div>
          <motion.button className="ui-button shrink-0" onClick={() => { soundClick(); onLaunchConsole(); }} whileHover={{ y: -2 }} whileTap={{ scale: .97 }}>Open console <ArrowRight className="h-4 w-4" /></motion.button>
        </div>
      </section>
    </main>
    <footer className="site-footer"><div className="site-container flex flex-col sm:flex-row justify-between gap-2"><span>MNEMORIX / Agent memory security</span><span>Zero-trust inspection and tamper evidence</span></div></footer>
    <AuthModal />
  </div>
  );
};

export default LandingPage;
