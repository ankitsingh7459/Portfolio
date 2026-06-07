import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Eye, BarChart3 } from 'lucide-react';
import { getAnalytics } from '../../services/api';

const DEFAULT_STATS = {
  totalVisitors: 1284,
  pageViews: 4521,
  topSections: [
    { name: 'Projects', views: 892 },
    { name: 'Skills', views: 654 },
    { name: 'About', views: 521 },
  ],
};

const VisitorStats = () => {
  const [stats, setStats] = useState(DEFAULT_STATS);

  useEffect(() => {
    getAnalytics()
      .then((res) => {
        const data = res.data?.data || res.data;
        if (data) {
          setStats({
            ...data,
            pageViews: data.pageViews ?? data.totalPageViews,
            topSections: (data.topSections || []).map((section) => ({
              name: section.name ?? section.section,
              views: section.views ?? section.visits,
            })),
          });
        }
      })
      .catch(() => {});
  }, []);

  const cards = [
    { icon: Users, label: 'Total Visitors', value: stats.totalVisitors },
    { icon: Eye, label: 'Page Views', value: stats.pageViews },
  ];

  return (
    <motion.section
      className="section-padding !pt-0"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <motion.div className="glass rounded-2xl p-6 md:p-8">
        <motion.div className="flex items-center gap-2 mb-6">
          <BarChart3 className="text-[#00d4ff]" size={22} />
          <h3 className="font-semibold text-white">Visitor Insights</h3>
        </motion.div>

        <motion.div className="grid gap-4 sm:grid-cols-2 mb-8">
          {cards.map((card) => (
            <motion.div
              key={card.label}
              className="rounded-xl bg-white/5 p-4"
              whileHover={{ scale: 1.02 }}
            >
              <card.icon className="mb-2 text-[#a855f7]" size={20} />
              <p className="text-2xl font-bold neon-text">
                {card.value?.toLocaleString?.() ?? card.value}
              </p>
              <p className="text-xs text-zinc-500 mt-1">{card.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {(stats.topSections?.length > 0) && (
          <motion.div>
            <p className="text-sm text-zinc-400 mb-3">Top Sections</p>
            <motion.div className="space-y-2">
              {stats.topSections.map((section, i) => {
                const max = stats.topSections[0]?.views || 1;
                const pct = (section.views / max) * 100;
                return (
                  <motion.div key={section.name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-zinc-300">{section.name}</span>
                      <span className="text-[#00d4ff]">{section.views}</span>
                    </div>
                    <motion.div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-[#00d4ff] to-[#a855f7]"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 * i, duration: 0.6 }}
                      />
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </motion.section>
  );
};

export default VisitorStats;
