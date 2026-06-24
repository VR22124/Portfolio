import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import SectionLabel from '@/components/ui/SectionLabel';
import GlowButton from '@/components/ui/GlowButton';
import data from '@/data/data.json';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [focused, setFocused] = useState('');
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Simulate send
    await new Promise((r) => setTimeout(r, 1500));
    setSending(false);
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(data.meta.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="relative py-[120px]" ref={ref}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-12">
        <SectionLabel text="CONTACT" />
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-[clamp(1.75rem,3vw,2.5rem)] font-semibold text-text-primary mt-4 mb-2"
        >
          {data.contact.headline}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-text-secondary mb-12"
        >
          {data.contact.subtext}
        </motion.p>

        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12">
          {/* Left — Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            {/* Email */}
            <div className="mb-6">
              <label className="text-xs uppercase tracking-wider text-text-muted mb-2 block">Email</label>
              <button
                onClick={copyEmail}
                className="text-text-primary hover:text-cyan transition-colors text-lg flex items-center gap-2"
              >
                {data.meta.email}
                {copied && <span className="text-xs text-green-400 ml-2">Copied!</span>}
              </button>
            </div>

            {/* Location */}
            <div className="mb-6">
              <label className="text-xs uppercase tracking-wider text-text-muted mb-2 block">Location</label>
              <p className="text-text-primary flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {data.meta.location}
              </p>
            </div>

            {/* Availability */}
            <div className="mb-8 flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
              </span>
              <span className="text-sm text-text-secondary">{data.contact.availabilityMessage}</span>
            </div>

            {/* Social links */}
            <div className="flex gap-3">
              {[
                { name: 'GitHub', href: data.meta.social.github },
                { name: 'LinkedIn', href: data.meta.social.linkedin },
                { name: 'Twitter', href: data.meta.social.twitter },
                { name: 'Resume', href: data.meta.resumeUrl },
              ].map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl border border-cyan/20 text-sm text-text-secondary hover:text-cyan hover:border-cyan/40 hover:shadow-glow transition-all duration-300"
                  style={{ background: 'var(--bg-card)' }}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.form
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className="grid md:grid-cols-2 gap-5">
              <FloatingLabelInput
                label="Name"
                value={formData.name}
                onChange={(v) => setFormData({ ...formData, name: v })}
                focused={focused}
                setFocused={setFocused}
                required
              />
              <FloatingLabelInput
                label="Email"
                type="email"
                value={formData.email}
                onChange={(v) => setFormData({ ...formData, email: v })}
                focused={focused}
                setFocused={setFocused}
                required
              />
            </div>
            <FloatingLabelInput
              label="Subject"
              value={formData.subject}
              onChange={(v) => setFormData({ ...formData, subject: v })}
              focused={focused}
              setFocused={setFocused}
              required
            />
            <FloatingLabelTextarea
              label="Message"
              value={formData.message}
              onChange={(v) => setFormData({ ...formData, message: v })}
              focused={focused}
              setFocused={setFocused}
              required
            />

            <GlowButton type="submit" className="w-full" disabled={sending || sent}>
              {sending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending...
                </span>
              ) : sent ? (
                <span className="flex items-center justify-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Message Sent!
                </span>
              ) : (
                'Send Message'
              )}
            </GlowButton>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

function FloatingLabelInput({
  label,
  value,
  onChange,
  focused,
  setFocused,
  type = 'text',
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  focused: string;
  setFocused: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  const isActive = focused === label || value.length > 0;

  return (
    <div className="relative">
      <label
        className="absolute left-4 transition-all duration-200 pointer-events-none font-mono text-xs"
        style={{
          top: isActive ? '6px' : '50%',
          transform: isActive ? 'translateY(0)' : 'translateY(-50%)',
          fontSize: isActive ? '10px' : '13px',
          color: isActive ? '#00d4ff' : '#3d5a73',
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(label)}
        onBlur={() => setFocused('')}
        required={required}
        className="w-full pt-5 pb-2.5 px-4 rounded-lg border text-sm text-text-primary outline-none transition-all duration-300"
        style={{
          background: 'rgba(255,255,255,0.03)',
          borderColor: focused === label ? 'rgba(0,212,255,0.4)' : 'rgba(0,212,255,0.08)',
          boxShadow: focused === label ? '0 0 20px rgba(0,212,255,0.08)' : 'none',
        }}
      />
    </div>
  );
}

function FloatingLabelTextarea({
  label,
  value,
  onChange,
  focused,
  setFocused,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  focused: string;
  setFocused: (v: string) => void;
  required?: boolean;
}) {
  const isActive = focused === label || value.length > 0;

  return (
    <div className="relative">
      <label
        className="absolute left-4 transition-all duration-200 pointer-events-none font-mono text-xs"
        style={{
          top: isActive ? '6px' : '16px',
          fontSize: isActive ? '10px' : '13px',
          color: isActive ? '#00d4ff' : '#3d5a73',
        }}
      >
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(label)}
        onBlur={() => setFocused('')}
        required={required}
        rows={5}
        className="w-full pt-5 pb-2.5 px-4 rounded-lg border text-sm text-text-primary outline-none transition-all duration-300 resize-none"
        style={{
          background: 'rgba(255,255,255,0.03)',
          borderColor: focused === label ? 'rgba(0,212,255,0.4)' : 'rgba(0,212,255,0.08)',
          boxShadow: focused === label ? '0 0 20px rgba(0,212,255,0.08)' : 'none',
        }}
      />
    </div>
  );
}
