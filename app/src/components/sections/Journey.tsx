import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import SectionLabel from '@/components/ui/SectionLabel';
import data from '@/data/data.json';

const typeColors: Record<string, string> = {
  education: '#7b61ff',
  project: '#00d4ff',
  achievement: '#ff2d9b',
  skill: '#00ff9d',
};

export default function Journey() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => setIsDragging(false);

  // Touch support
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollRef.current) return;
    setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!scrollRef.current) return;
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section id="journey" className="relative py-[120px]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12">
        <SectionLabel text="MY JOURNEY" />
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-[clamp(1.75rem,3vw,2.5rem)] font-semibold text-text-primary mt-4 mb-2"
        >
          From Zero to Engineer
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-text-secondary mb-12"
        >
          The path that led here
        </motion.p>

        {/* Desktop: Horizontal draggable */}
        <div className="hidden md:block">
          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            className="overflow-x-auto cursor-grab active:cursor-grabbing no-scrollbar pb-8"
            style={{ scrollBehavior: isDragging ? 'auto' : 'smooth' }}
          >
            <div className="relative" style={{ width: `${Math.max(data.journey.length * 280, 1000)}px` }}>
              {/* Horizontal line */}
              <div
                className="absolute top-[60px] left-0 right-0 h-[2px]"
                style={{
                  background: 'linear-gradient(90deg, #00d4ff, #7b61ff)',
                  boxShadow: '0 0 12px rgba(0,212,255,0.3)',
                }}
              />

              <div className="flex gap-6">
                {data.journey.map((event, i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 w-[240px]"
                    style={{ marginTop: i % 2 === 0 ? '0' : '140px' }}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: i % 2 === 0 ? -20 : 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className="relative"
                    >
                      {/* Connector dot */}
                      <div
                        className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2"
                        style={{
                          borderColor: typeColors[event.type] || '#00d4ff',
                          background: 'var(--bg-void)',
                          boxShadow: `0 0 12px ${typeColors[event.type] || '#00d4ff'}60`,
                          top: i % 2 === 0 ? '52px' : '-28px',
                        }}
                      />

                      {/* Year label */}
                      <div
                        className="text-center mb-3 font-mono text-xs tracking-wider"
                        style={{ color: typeColors[event.type] || '#00d4ff' }}
                      >
                        {event.month} {event.year}
                      </div>

                      {/* Card */}
                      <div
                        className="p-4 rounded-xl border transition-all duration-300 hover:border-opacity-50"
                        style={{
                          background: 'var(--bg-card)',
                          borderColor: `${typeColors[event.type] || '#00d4ff'}20`,
                        }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ background: typeColors[event.type] || '#00d4ff' }}
                          />
                          <span className="text-[10px] uppercase tracking-wider text-text-muted">
                            {event.type}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-text-primary mb-1">{event.title}</h4>
                        <p className="text-xs text-text-secondary leading-relaxed">{event.description}</p>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-text-muted mt-4">← Drag to explore →</p>
        </div>

        {/* Mobile: Vertical timeline */}
        <div className="md:hidden">
          <div className="relative">
            <div
              className="absolute left-4 top-0 bottom-0 w-[2px]"
              style={{
                background: 'linear-gradient(180deg, #00d4ff, #7b61ff)',
              }}
            />
            {data.journey.map((event, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="relative ml-12 mb-8"
              >
                <div
                  className="absolute -left-[34px] top-4 w-3 h-3 rounded-full border-2"
                  style={{
                    borderColor: typeColors[event.type] || '#00d4ff',
                    background: 'var(--bg-void)',
                  }}
                />
                <div
                  className="text-xs font-mono mb-1"
                  style={{ color: typeColors[event.type] || '#00d4ff' }}
                >
                  {event.month} {event.year}
                </div>
                <div
                  className="p-4 rounded-xl border"
                  style={{
                    background: 'var(--bg-card)',
                    borderColor: `${typeColors[event.type] || '#00d4ff'}20`,
                  }}
                >
                  <span className="text-[10px] uppercase tracking-wider text-text-muted">{event.type}</span>
                  <h4 className="text-sm font-bold text-text-primary mt-1 mb-1">{event.title}</h4>
                  <p className="text-xs text-text-secondary">{event.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
