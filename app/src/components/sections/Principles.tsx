import { motion } from 'framer-motion';
import SectionLabel from '@/components/ui/SectionLabel';
import data from '@/data/data.json';

export default function Principles() {
  return (
    <section id="principles" className="relative py-[120px]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12">
        <SectionLabel text="MY PRINCIPLES" />
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-[clamp(1.75rem,3vw,2.5rem)] font-semibold text-text-primary mt-4 mb-12"
        >
          What I Believe About Building Software
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {data.principles.map((principle, i) => (
            <motion.div
              key={principle.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              whileHover={{
                y: -6,
                transition: { duration: 0.3 },
              }}
              className="group p-6 rounded-xl border border-cyan/10 transition-all duration-500 hover:border-cyan/30"
              style={{
                background: 'var(--bg-card)',
              }}
            >
              {/* Icon orb */}
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-4 transition-all duration-300 group-hover:shadow-glow"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,212,255,0.1), rgba(123,97,255,0.1))',
                }}
              >
                {principle.icon}
              </div>

              <h3 className="text-base font-bold text-text-primary mb-2">{principle.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{principle.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
