import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StarFieldCanvas from '@/components/canvas/StarFieldCanvas';
import Loader from '@/components/layout/Loader';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Skills from '@/components/sections/Skills';
import Projects from '@/components/sections/Projects';
import Process from '@/components/sections/Process';
import Principles from '@/components/sections/Principles';
import Journey from '@/components/sections/Journey';
import Contact from '@/components/sections/Contact';
import { useLenis } from '@/hooks/useLenis';

export default function App() {
  const [isLoading, setIsLoading] = useState(() => {
    // Check if loader already played this session
    return sessionStorage.getItem('loaded') !== 'true';
  });
  const [loaderExited, setLoaderExited] = useState(!isLoading);

  // Initialize Lenis smooth scroll
  useLenis();

  const handleLoaderComplete = useCallback(() => {
    sessionStorage.setItem('loaded', 'true');
    setLoaderExited(true);
    // Small delay before removing loader from DOM
    setTimeout(() => setIsLoading(false), 100);
  }, []);

  return (
    <>
      {/* Global Star Field Background */}
      <StarFieldCanvas />

      {/* Noise grain overlay */}
      <div className="grain-overlay" />

      {/* Loader */}
      <AnimatePresence>
        {isLoading && (
          <Loader onComplete={handleLoaderComplete} />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loaderExited ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        style={{ pointerEvents: loaderExited ? 'auto' : 'none' }}
      >
        <Navbar />

        <main>
          <Hero />

          {/* About */}
          <div style={{ background: 'var(--bg-space)' }}>
            <About />
          </div>

          {/* Skills */}
          <div style={{ background: 'var(--bg-void)' }}>
            <Skills />
          </div>

          {/* Projects */}
          <div style={{ background: 'var(--bg-space)' }}>
            <Projects />
          </div>

          {/* Process */}
          <div style={{ background: 'var(--bg-void)' }}>
            <Process />
          </div>

          {/* Principles */}
          <div style={{ background: 'var(--bg-space)' }}>
            <Principles />
          </div>

          {/* Journey */}
          <div style={{ background: 'var(--bg-void)' }}>
            <Journey />
          </div>

          {/* Contact */}
          <div style={{ background: 'var(--bg-space)' }}>
            <Contact />
          </div>
        </main>

        <Footer />
      </motion.div>
    </>
  );
}
