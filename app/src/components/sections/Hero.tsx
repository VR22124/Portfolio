import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import HeroObjectCanvas from '@/components/canvas/HeroObjectCanvas';
import GlowButton from '@/components/ui/GlowButton';
import data from '@/data/data.json';

const taglines = data.hero.taglines;

export default function Hero() {
  const [currentTagline, setCurrentTagline] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showScroll, setShowScroll] = useState(true);
  const taglineRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Typewriter effect
  useEffect(() => {
    const fullText = taglines[currentTagline];
    const typeSpeed = isDeleting ? 40 : 80;

    timerRef.current = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(fullText.slice(0, displayText.length + 1));
        if (displayText.length + 1 === fullText.length) {
          timerRef.current = setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setDisplayText(fullText.slice(0, displayText.length - 1));
        if (displayText.length - 1 === 0) {
          setIsDeleting(false);
          taglineRef.current = (taglineRef.current + 1) % taglines.length;
          setCurrentTagline(taglineRef.current);
        }
      }
    }, typeSpeed);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [displayText, isDeleting, currentTagline]);

  // Scroll indicator
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) setShowScroll(false);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const nameLetters = 'Vishnu Rohith B'.split('');

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Nebula blobs */}
      <div
        className="fixed w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0,212,255,0.08), transparent 70%)',
          filter: 'blur(120px)',
          top: '-20%',
          right: '-10%',
          zIndex: -1,
        }}
      />
      <div
        className="fixed w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(123,97,255,0.06), transparent 70%)',
          filter: 'blur(120px)',
          bottom: '-10%',
          left: '-5%',
          zIndex: -1,
        }}
      />

      <div className="w-full max-w-[1280px] mx-auto px-6 md:px-12 py-20 grid lg:grid-cols-[55%_45%] gap-8 items-center">
        {/* Left — Text */}
        <div className="order-2 lg:order-1">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan/30 text-xs font-medium tracking-[0.12em] uppercase text-cyan mb-6 shimmer-btn"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
            FULL STACK DEVELOPER
            <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
          </motion.div>

          {/* Greeting */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-text-secondary text-sm mb-2"
          >
            {data.hero.greeting}
          </motion.p>

          {/* Name */}
          <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[1.1] mb-4">
            <span className="flex flex-wrap">
              {nameLetters.map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 40, rotate: -5 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{
                    delay: 1.1 + i * 0.05,
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={letter === ' ' ? 'w-[0.3em]' : 'text-gradient inline-block'}
                >
                  {letter === ' ' ? '\u00A0' : letter}
                </motion.span>
              ))}
            </span>
          </h1>

          {/* Typewriter */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8 }}
            className="h-8 mb-6"
          >
            <span className="text-cyan font-mono text-sm md:text-base">
              {displayText}
              <span className="inline-block w-[2px] h-4 bg-cyan ml-0.5 animate-[blink_1s_step-end_infinite]" />
            </span>
          </motion.div>

          {/* Bio */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.0 }}
            className="text-text-secondary text-base max-w-lg mb-8 leading-relaxed"
          >
            {data.hero.bio}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2 }}
            className="flex flex-wrap gap-4 mb-8"
          >
            <GlowButton onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>
              View My Work
            </GlowButton>
            <GlowButton variant="outlined" href={data.meta.resumeUrl}>
              Download Resume
            </GlowButton>
          </motion.div>

          {/* Social icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5 }}
            className="flex gap-3"
          >
            {[
              { name: 'GitHub', href: data.meta.social.github },
              { name: 'LinkedIn', href: data.meta.social.linkedin },
              { name: 'Twitter', href: data.meta.social.twitter },
            ].map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-text-muted/40 flex items-center justify-center text-text-secondary hover:text-cyan hover:border-cyan/50 hover:shadow-glow transition-all duration-300"
                aria-label={social.name}
              >
                <SocialIcon name={social.name} />
              </a>
            ))}
          </motion.div>
        </div>

        {/* Right — 3D Object */}
        <motion.div
          initial={{ opacity: 0, scale: 0.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.2, duration: 1, type: 'spring', stiffness: 100 }}
          className="order-1 lg:order-2 hidden md:block"
        >
          <HeroObjectCanvas />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      {showScroll && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] tracking-[0.2em] uppercase text-text-muted">Scroll to Explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-cyan"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}

function SocialIcon({ name }: { name: string }) {
  if (name === 'GitHub') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    );
  }
  if (name === 'LinkedIn') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
