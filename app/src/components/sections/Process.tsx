import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import SectionLabel from '@/components/ui/SectionLabel';
import data from '@/data/data.json';

export default function Process() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section id="process" className="relative py-[120px]" ref={ref}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-12">
        <SectionLabel text="MY PROCESS" />
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-[clamp(1.75rem,3vw,2.5rem)] font-semibold text-text-primary mt-4 mb-4"
        >
          How I Turn Ideas Into Reality
        </motion.h2>

        {/* Timeline */}
        <div className="relative mt-16">
          {/* Vertical line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] md:-translate-x-1/2">
            <motion.div
              initial={{ scaleY: 0 }}
              animate={isInView ? { scaleY: 1 } : {}}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="w-full h-full origin-top"
              style={{
                background: 'linear-gradient(180deg, #00d4ff, #7b61ff)',
                boxShadow: '0 0 12px rgba(0,212,255,0.4)',
              }}
            />
          </div>

          {data.process.map((step, i) => (
            <ProcessStep
              key={step.step}
              step={step}
              index={i}
              isLeft={i % 2 === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessStep({ step, index, isLeft }: {
  step: typeof data.process[0];
  index: number;
  isLeft: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`relative flex items-start mb-12 md:mb-16 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
    >
      {/* Content card */}
      <div className={`ml-12 md:ml-0 md:w-[45%] ${isLeft ? 'md:pr-12' : 'md:pl-12'}`}>
        <div
          className="p-5 md:p-6 rounded-xl border border-cyan/10 relative overflow-hidden"
          style={{ background: 'rgba(10,22,40,0.6)', backdropFilter: 'blur(10px)' }}
        >
          {/* Step number watermark */}
          <span
            className="absolute top-2 right-4 text-6xl font-bold opacity-[0.04] select-none"
            style={{ color: step.color }}
          >
            {step.step}
          </span>

          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{step.icon}</span>
            <h3 className="text-lg font-bold text-text-primary">{step.title}</h3>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">{step.description}</p>
        </div>
      </div>

      {/* Center node */}
      <div className="absolute left-4 md:left-1/2 top-5 md:-translate-x-1/2">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: [0, 1.3, 1] }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
          className="w-8 h-8 rounded-full flex items-center justify-center border-2"
          style={{
            borderColor: step.color,
            background: 'var(--bg-void)',
            boxShadow: `0 0 16px ${step.color}40`,
          }}
        >
          <span className="text-[10px] font-bold font-mono" style={{ color: step.color }}>
            {step.step}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}
