import { motion } from "framer-motion";

type Props = {
  index?: string;
  eyebrow: string;
  title: string;
  text?: string;
};

export function SectionHeader({ index, eyebrow, title, text }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="mb-12 grid gap-5 md:grid-cols-[160px_1fr] md:items-end md:gap-12"
    >
      <div>
        {index && <span className="font-mono mb-3 block text-xs font-bold tracking-[0.16em] text-slate-400">{index}</span>}
        <p className="text-sm font-bold uppercase tracking-[0.32em] text-violet-700">{eyebrow}</p>
      </div>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-10">
        <h2 className="max-w-3xl text-4xl font-black uppercase leading-[0.92] tracking-tight text-slate-950 md:text-6xl">{title}</h2>
        {text && <p className="max-w-sm text-base leading-8 text-slate-600 md:text-right md:text-lg">{text}</p>}
      </div>
    </motion.div>
  );
}
