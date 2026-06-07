import { motion } from 'framer-motion';
import { BookOpen, Code2, Database, GraduationCap } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const JOURNEY_NOTES = [
  {
    icon: GraduationCap,
    period: '2024',
    title: 'Started B.Tech CSE',
    description:
      'Took admission in Computer Science Engineering and began building a strong base in programming, logic, and problem solving.',
    note: 'Admission year',
  },
  {
    icon: Code2,
    period: '2024 - 2025',
    title: 'Built my first serious apps',
    description:
      'Worked on Java and database-heavy projects like Bank Management System while getting comfortable with full-stack development.',
    note: 'Java, MySQL, React',
  },
  {
    icon: Database,
    period: '2025',
    title: 'Backend and RAG work',
    description:
      'Contributed to CoSupport as a backend member and helped with RAG implementation for better knowledge retrieval.',
    note: 'APIs, retrieval, AI workflows',
  },
];

const Timeline = () => {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <section id="journey" className="section-padding" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-5xl"
      >
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.4fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p className="font-mono text-sm text-[#00d4ff]">{'// Learning log'}</p>
            <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
              My engineering journey
            </h2>
            <p className="mt-5 max-w-md text-base leading-7 text-zinc-400">
              I started my B.Tech in 2024. This is a simple snapshot of what I
              have actually been learning and building, without the resume buzz.
            </p>
            <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center gap-3">
                <BookOpen className="text-[#a855f7]" size={20} />
                <span className="text-sm font-medium text-white">Current focus</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Backend development, databases, AI integrations, and making
                practical projects that solve clear problems.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {JOURNEY_NOTES.map((item, index) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 18 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.12 * index, duration: 0.45 }}
                className="group rounded-xl border border-white/10 bg-[#101014]/80 p-5 transition-colors hover:border-[#00d4ff55] sm:p-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-[#00d4ff]">
                    <item.icon size={21} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-md bg-[#00d4ff14] px-2.5 py-1 font-mono text-xs text-[#00d4ff]">
                        {item.period}
                      </span>
                      <span className="text-xs text-zinc-500">{item.note}</span>
                    </div>
                    <h3 className="mt-3 text-xl font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-zinc-400">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Timeline;
