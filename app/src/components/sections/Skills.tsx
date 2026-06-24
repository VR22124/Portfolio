import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import SectionLabel from '@/components/ui/SectionLabel';
import data from '@/data/data.json';

const categories = ['All', 'Frontend', 'Backend', 'Cloud & DevOps', 'Databases', 'Automation & AI'];

const categoryColors: Record<string, string> = {
  Frontend: '#00d4ff',
  Backend: '#7b61ff',
  'Cloud & DevOps': '#00ff9d',
  Databases: '#ff9d00',
  'Automation & AI': '#ff2d9b',
};

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState('All');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const filtered = activeCategory === 'All'
    ? data.skills
    : data.skills.filter((s) => s.category === activeCategory);

  // Split for two marquee rows
  const half = Math.ceil(data.skills.length / 2);
  const marqueeRow1 = data.skills.slice(0, half);
  const marqueeRow2 = data.skills.slice(half);

  return (
    <section id="skills" className="relative py-[120px]" ref={ref}>
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,212,255,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="max-w-[1280px] mx-auto px-6 md:px-12 relative">
        <SectionLabel text="TECHNICAL SKILLS" />
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-[clamp(1.75rem,3vw,2.5rem)] font-semibold text-text-primary mt-4 mb-2"
        >
          The Arsenal
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-text-secondary mb-10"
        >
          Technologies I use to build the future
        </motion.p>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-300 flex-shrink-0"
              style={{
                background: activeCategory === cat
                  ? 'linear-gradient(135deg, #00d4ff, #7b61ff)'
                  : 'transparent',
                color: activeCategory === cat ? '#020408' : '#8ba8c4',
                border: activeCategory === cat ? 'none' : '1px solid rgba(0,212,255,0.2)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Hex grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4 mb-16"
          >
            {filtered.map((skill, i) => (
              <SkillHexCard
                key={skill.name}
                skill={skill}
                index={i}
                inView={isInView}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Skills Marquee */}
        <div className="space-y-4 overflow-hidden">
          <MarqueeRow skills={marqueeRow1} direction="left" />
          <MarqueeRow skills={marqueeRow2} direction="right" />
        </div>
      </div>
    </section>
  );
}

function SkillHexCard({ skill, index, inView }: { skill: typeof data.skills[0]; index: number; inView: boolean }) {
  const [hovered, setHovered] = useState(false);
  const circumference = 2 * Math.PI * 40;
  const strokeOffset = circumference - (skill.level / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.04, duration: 0.5 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative group cursor-pointer"
    >
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="flex flex-col items-center justify-center p-3 md:p-4 rounded-xl border border-cyan/10 transition-all duration-300"
        style={{
          background: hovered ? `rgba(${hexToRgb(categoryColors[skill.category] || '#00d4ff')}, 0.08)` : 'var(--bg-card)',
          boxShadow: hovered ? `0 0 30px rgba(${hexToRgb(categoryColors[skill.category] || '#00d4ff')}, 0.15)` : 'none',
        }}
      >
        {/* Hex shape visual */}
        <div className="relative w-14 h-14 md:w-16 md:h-16 flex items-center justify-center mb-2">
          {/* Progress ring on hover */}
          {hovered && (
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(0,212,255,0.1)" strokeWidth="3" />
              <motion.circle
                cx="50" cy="50" r="40" fill="none"
                stroke={categoryColors[skill.category] || '#00d4ff'}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: strokeOffset }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </svg>
          )}
          <img
            src={skill.logoUrl}
            alt={skill.name}
            className="w-8 h-8 md:w-9 md:h-9 object-contain"
            loading="lazy"
          />
        </div>

        <span className="font-mono text-[10px] md:text-xs text-text-secondary text-center transition-transform duration-300"
          style={{ transform: hovered ? 'translateY(-2px)' : 'translateY(0)' }}
        >
          {skill.name}
        </span>

        {/* Level percentage on hover */}
        {hovered && (
          <motion.span
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-mono mt-1"
            style={{ color: categoryColors[skill.category] || '#00d4ff' }}
          >
            {skill.level}%
          </motion.span>
        )}
      </motion.div>
    </motion.div>
  );
}

function MarqueeRow({ skills, direction }: { skills: typeof data.skills; direction: 'left' | 'right' }) {
  const doubled = [...skills, ...skills];
  return (
    <div className="relative overflow-hidden group">
      <div
        className="flex gap-6 w-max"
        style={{
          animation: `${direction === 'left' ? 'marquee-left' : 'marquee-right'} 30s linear infinite`,
        }}
      >
        {doubled.map((skill, i) => (
          <div
            key={`${skill.name}-${i}`}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-cyan/10 bg-space-card/50 flex-shrink-0"
          >
            <img src={skill.logoUrl} alt={skill.name} className="w-5 h-5 object-contain" loading="lazy" />
            <span className="text-xs font-mono text-text-secondary whitespace-nowrap">{skill.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 212, 255';
}
