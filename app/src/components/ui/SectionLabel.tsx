import { motion } from 'framer-motion';

interface SectionLabelProps {
  text: string;
}

export default function SectionLabel({ text }: SectionLabelProps) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5 }}
      className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.12em] uppercase text-cyan/70"
    >
      <span className="text-cyan">&#9670;</span>
      {text}
    </motion.span>
  );
}
