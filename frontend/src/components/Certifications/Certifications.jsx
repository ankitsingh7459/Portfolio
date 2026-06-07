import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Cloud } from 'lucide-react';
import { getCertifications } from '../../services/api';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const DEFAULT_CERTS = [
  {
    _id: '1',
    title: 'AWS Cloud Practitioner',
    issuer: 'Amazon Web Services',
    date: '2025',
    category: 'AWS',
    credentialUrl: '#',
  },
  {
    _id: '2',
    title: 'Machine Learning Foundations',
    issuer: 'Coursera',
    date: '2024',
    category: 'AI/ML',
    credentialUrl: '#',
  },
  {
    _id: '3',
    title: 'Python for Everybody',
    issuer: 'University of Michigan',
    date: '2024',
    category: 'Programming',
    credentialUrl: '#',
  },
];

const normalizeCertification = (cert) => ({
  ...cert,
  _id: cert._id ?? cert.id,
  issuer: cert.issuer ?? cert.provider,
  date: cert.date ?? (cert.issue_date ? new Date(cert.issue_date).getFullYear().toString() : ''),
  credentialUrl: cert.credentialUrl ?? cert.certificate_url,
});

const Certifications = () => {
  const [certs, setCerts] = useState(DEFAULT_CERTS);
  const [ref, isVisible] = useScrollAnimation();

  useEffect(() => {
    getCertifications()
      .then((res) => {
        const data = res.data?.data || res.data?.certifications || res.data;
        if (Array.isArray(data) && data.length) setCerts(data.map(normalizeCertification));
      })
      .catch(() => {});
  }, []);

  const awsCerts = certs.filter(
    (c) =>
      c.category === 'AWS' ||
      c.issuer?.toLowerCase().includes('aws') ||
      c.title?.toLowerCase().includes('aws')
  );
  const otherCerts = certs.filter((c) => !awsCerts.includes(c));

  const CertCard = ({ cert, delay }) => (
    <motion.div
      className="glass rounded-2xl p-6 hover:border-[#00d4ff33] transition-colors"
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ delay }}
      whileHover={{ y: -4 }}
    >
      <Award className="mb-3 text-[#a855f7]" size={28} />
      <h3 className="font-semibold text-white">{cert.title}</h3>
      <p className="mt-1 text-sm text-zinc-400">{cert.issuer}</p>
      <p className="mt-2 font-mono text-xs text-[#00d4ff]">{cert.date}</p>
      {cert.credentialUrl && cert.credentialUrl !== '#' && (
        <a
          href={cert.credentialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-xs text-[#a855f7] hover:underline"
        >
          View Credential {'->'}
        </a>
      )}
    </motion.div>
  );

  return (
    <section id="certifications" className="section-padding" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <p className="font-mono text-sm text-[#00d4ff]">{'// Credentials'}</p>
        <h2 className="mt-2 text-3xl font-bold md:text-4xl">
          <span className="neon-text">Certifications</span>
        </h2>
      </motion.div>

      {awsCerts.length > 0 && (
        <motion.div
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className="glass mb-6 flex items-center gap-3 rounded-xl px-5 py-3 w-fit"
            whileHover={{ scale: 1.02 }}
          >
            <Cloud className="text-[#f59e0b]" size={24} />
            <span className="font-semibold text-white">AWS Cloud</span>
            <span className="rounded-full bg-[#f59e0b22] px-2 py-0.5 text-xs text-[#f59e0b]">
              {awsCerts.length}
            </span>
          </motion.div>
          <motion.div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {awsCerts.map((cert, i) => (
              <CertCard key={cert._id || cert.title} cert={cert} delay={0.1 * i} />
            ))}
          </motion.div>
        </motion.div>
      )}

      {otherCerts.length > 0 && (
        <motion.div
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
        >
          <h3 className="mb-6 text-lg font-medium text-zinc-400">Other Certifications</h3>
          <motion.div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {otherCerts.map((cert, i) => (
              <CertCard key={cert._id || cert.title} cert={cert} delay={0.1 * i} />
            ))}
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default Certifications;
