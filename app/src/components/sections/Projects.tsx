import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionLabel from '@/components/ui/SectionLabel';
import data from '@/data/data.json';

const tagColors: Record<string, string> = {
  n8n: '#ff6d5a',
  'Node.js': '#339933',
  MongoDB: '#47a248',
  Azure: '#0078d4',
  'AI Agents': '#00d4ff',
  React: '#61dafb',
  'Azure DevOps': '#0078d4',
  Docker: '#2496ed',
  'Express.js': '#ffffff',
  Redis: '#dc382d',
  'Stripe': '#635bff',
  JWT: '#d63aff',
};

const allTags = ['All', ...Array.from(new Set(data.projects.flatMap((p) => p.tags)))];

export default function Projects() {
  const [activeTag, setActiveTag] = useState('All');
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = activeTag === 'All'
    ? data.projects
    : data.projects.filter((p) => p.tags.includes(activeTag));

  const featured = filtered.filter((p) => p.featured);
  const regular = filtered.filter((p) => !p.featured);

  return (
    <section id="projects" className="relative py-[120px]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12" ref={containerRef}>
        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <SectionLabel text="FEATURED PROJECTS" />
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-[clamp(1.75rem,3vw,2.5rem)] font-semibold text-text-primary mt-4"
            >
              Things I've Shipped
            </motion.h2>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-300 flex-shrink-0"
                style={{
                  background: activeTag === tag ? 'rgba(0,212,255,0.15)' : 'transparent',
                  color: activeTag === tag ? '#00d4ff' : '#8ba8c4',
                  border: activeTag === tag ? '1px solid rgba(0,212,255,0.3)' : '1px solid rgba(255,255,255,0.05)',
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTag}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Featured project spotlight */}
            {featured.length > 0 && (
              <div className="mb-8">
                <FeaturedProjectCard project={featured[0]} />
              </div>
            )}

            {/* Regular project grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regular.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </div>

            {filtered.length === 0 && (
              <p className="text-text-muted text-center py-12">No projects found for this filter.</p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function FeaturedProjectCard({ project }: { project: typeof data.projects[0] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="featured-card rounded-2xl overflow-hidden"
    >
      <div className="grid lg:grid-cols-2 gap-0">
        <div className="relative h-[250px] lg:h-[350px] overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium bg-magenta/90 text-white">
            FEATURED
          </div>
        </div>
        <div className="p-6 md:p-8 flex flex-col justify-center">
          <div className="flex flex-wrap gap-2 mb-3">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                style={{
                  background: `${tagColors[tag] || '#00d4ff'}15`,
                  color: tagColors[tag] || '#00d4ff',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-text-primary mb-2">{project.title}</h3>
          <p className="text-sm text-text-muted mb-3">{project.tagline}</p>
          <p className="text-sm text-text-secondary leading-relaxed mb-4">{project.description}</p>
          <div className="flex gap-4 mb-4">
            {Object.entries(project.stats).map(([key, val]) => (
              <div key={key} className="text-center">
                <div className="text-lg font-bold text-cyan tabular-nums">{val}</div>
                <div className="text-[10px] text-text-muted uppercase">{key}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <a href={project.liveUrl} className="text-sm text-cyan hover:underline flex items-center gap-1">
              View Live ↗
            </a>
            <a href={project.githubUrl} className="text-sm text-text-secondary hover:text-cyan transition-colors flex items-center gap-1">
              GitHub →
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProjectCard({ project, index }: { project: typeof data.projects[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
    setMousePos({ x, y });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setMousePos({ x: 0, y: 0 }); }}
      onMouseMove={handleMouseMove}
      className="group rounded-xl overflow-hidden border border-cyan/8 transition-all duration-500"
      style={{
        background: 'var(--bg-card)',
        boxShadow: hovered
          ? '0 0 40px rgba(0,212,255,0.15), inset 0 0 20px rgba(0,212,255,0.03)'
          : 'none',
        transform: hovered
          ? `perspective(800px) rotateX(${mousePos.y}deg) rotateY(${mousePos.x}deg) translateY(-4px)`
          : 'perspective(800px) rotateX(0) rotateY(0)',
      }}
    >
      {/* Image area with scan line */}
      <div className="relative h-[200px] overflow-hidden">
        <motion.img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500"
          style={{ transform: hovered ? 'scale(1.05)' : 'scale(1)' }}
          loading="lazy"
        />
        {/* Scan line on hover */}
        {hovered && (
          <motion.div
            initial={{ top: '0%' }}
            animate={{ top: '100%' }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="absolute left-0 right-0 h-[2px]"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.6), transparent)',
            }}
          />
        )}
        {project.featured && (
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-medium bg-magenta/90 text-white">
            FEATURED
          </div>
        )}
      </div>

      <div className="p-5">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3 transition-transform duration-300"
          style={{ transform: hovered ? 'translateY(-4px)' : 'translateY(0)' }}
        >
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full text-[10px] font-medium"
              style={{
                background: `${tagColors[tag] || '#00d4ff'}15`,
                color: tagColors[tag] || '#00d4ff',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        <h3 className="text-lg font-bold text-text-primary mb-1">{project.title}</h3>
        <p className="text-xs text-text-muted mb-2">{project.tagline}</p>
        <p className="text-sm text-text-secondary leading-relaxed mb-4 line-clamp-3">{project.description}</p>

        {/* Stats */}
        <div className="flex gap-3 mb-4">
          {Object.entries(project.stats).map(([key, val]) => (
            <span key={key} className="text-[10px] font-mono text-text-muted bg-space-card px-2 py-1 rounded">
              {val} {key}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <motion.a
            href={project.liveUrl}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: hovered ? 1 : 0.7, y: hovered ? 0 : 5 }}
            className="text-xs text-cyan hover:underline flex items-center gap-1"
          >
            View Live ↗
          </motion.a>
          <motion.a
            href={project.githubUrl}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: hovered ? 1 : 0.7, y: hovered ? 0 : 5 }}
            className="text-xs text-text-secondary hover:text-cyan transition-colors flex items-center gap-1"
          >
            GitHub →
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}
