import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import SectionLabel from '@/components/ui/SectionLabel';
import data from '@/data/data.json';

const terminalLines = data.about.terminal;

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [typedLines, setTypedLines] = useState(0);
  const [currentLineText, setCurrentLineText] = useState('');
  const targetLine = typedLines < terminalLines.length ? terminalLines[typedLines] : '';

  // Terminal typing effect
  useEffect(() => {
    if (!isInView || typedLines >= terminalLines.length) return;
    let charIndex = 0;
    const interval = setInterval(() => {
      charIndex++;
      setCurrentLineText(targetLine.slice(0, charIndex));
      if (charIndex >= targetLine.length) {
        clearInterval(interval);
        setTimeout(() => {
          setTypedLines((prev) => prev + 1);
          setCurrentLineText('');
        }, 300);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [isInView, typedLines, targetLine]);

  return (
    <section id="about" className="relative py-[120px] md:py-[120px]" ref={ref}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-12 items-start">
        {/* Left — Terminal */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div
            className="rounded-xl overflow-hidden border border-cyan/10"
            style={{ background: 'var(--bg-card)' }}
          >
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-cyan/10">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="font-mono text-xs text-text-muted ml-2">
                ~/vishnu-rohith $ whoami
              </span>
            </div>
            {/* Terminal body */}
            <div className="p-4 md:p-6 font-mono text-xs md:text-sm min-h-[240px]">
              {terminalLines.slice(0, typedLines).map((line, i) => (
                <div key={i} className="mb-2 text-text-secondary">
                  <span className="text-cyan mr-2">&gt;</span>
                  {line.includes('✓') ? (
                    <>
                      {line.split('✓')[0]}
                      <span className="text-green-400">✓</span>
                    </>
                  ) : line}
                </div>
              ))}
              {typedLines < terminalLines.length && (
                <div className="text-text-secondary">
                  <span className="text-cyan mr-2">&gt;</span>
                  {currentLineText}
                  <span className="inline-block w-[6px] h-3.5 bg-cyan ml-0.5 animate-[blink_1s_step-end_infinite]" />
                </div>
              )}
            </div>
          </div>

          {/* Status indicator */}
          <div className="mt-4 flex items-center gap-3 px-4">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
            </span>
            <span className="text-sm text-text-secondary">
              {data.meta.availableForWork ? 'Available for work' : 'Not available'}
            </span>
          </div>
        </motion.div>

        {/* Right — Text */}
        <div>
          <SectionLabel text="ABOUT ME" />
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-[clamp(1.75rem,3vw,2.5rem)] font-semibold text-text-primary mt-4 mb-6"
          >
            {data.about.headline}
          </motion.h2>

          {data.about.paragraphs.map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
              className="text-text-secondary leading-relaxed mb-4"
            >
              {para}
            </motion.p>
          ))}

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            {data.about.stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="p-4 rounded-xl border border-cyan/10"
                style={{ background: 'rgba(10,22,40,0.5)' }}
              >
                <div className="text-2xl md:text-3xl font-bold text-gradient tabular-nums">
                  <CountUpNumber value={stat.value} suffix={stat.suffix} inView={isInView} delay={i} />
                </div>
                <div className="text-xs text-text-muted mt-1 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CountUpNumber({ value, suffix, inView, delay }: { value: string; suffix: string; inView: boolean; delay: number }) {
  const [display, setDisplay] = useState('0');
  const isInfinity = value === '∞';
  const numericValue = parseInt(value) || 0;

  useEffect(() => {
    if (!inView || isInfinity) return;
    let frame = 0;
    const totalFrames = 45; // ~1.5s at 30fps
    const startDelay = delay * 10;

    const animate = () => {
      frame++;
      if (frame < startDelay) {
        requestAnimationFrame(animate);
        return;
      }
      const progress = Math.min((frame - startDelay) / totalFrames, 1);
      // Ease out
      const eased = 1 - Math.pow(1 - progress, 3);
      if (progress < 0.7) {
        // Shuffling phase
        setDisplay(String(Math.floor(Math.random() * numericValue * 1.5)));
      } else {
        setDisplay(String(Math.floor(eased * numericValue)));
      }
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplay(String(numericValue));
      }
    };
    requestAnimationFrame(animate);
  }, [inView, numericValue, delay, isInfinity]);

  if (isInfinity) return <span>∞</span>;

  return (
    <span>
      {inView ? display : '0'}
      {suffix}
    </span>
  );
}
