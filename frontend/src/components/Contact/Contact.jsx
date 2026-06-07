import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { submitContact } from '../../services/api';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const CONTACT_EMAIL = 'ankitenterprises0001@gmail.com';

const buildMailtoLink = ({ name, email, message }) => {
  const subject = encodeURIComponent(`Portfolio contact from ${name}`);
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
  );
  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
};

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ref, isVisible] = useScrollAnimation();

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.message.trim().length < 10) {
      setStatus('short');
      return;
    }

    setLoading(true);
    setStatus(null);
    try {
      await submitContact(form);
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch {
      window.location.href = buildMailtoLink(form);
      setStatus('email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section-padding" ref={ref}>
      <motion.div
        className="mx-auto max-w-xl"
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <p className="font-mono text-sm text-[#00d4ff] text-center">{'// Get In Touch'}</p>
        <h2 className="mt-2 text-center text-3xl font-bold md:text-4xl">
          Let&apos;s <span className="neon-text">Connect</span>
        </h2>
        <p className="mt-4 text-center text-zinc-400">
          Have a project in mind or want to collaborate? Drop me a message.
        </p>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="mx-auto mt-4 block w-fit rounded-full border border-[#00d4ff33] bg-[#00d4ff10] px-4 py-2 text-sm font-medium text-[#00d4ff] transition-colors hover:border-[#00d4ff66] hover:bg-[#00d4ff18]"
        >
          {CONTACT_EMAIL}
        </a>

        <motion.form
          onSubmit={handleSubmit}
          className="mt-10 space-y-5"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
        >
          <div>
            <label htmlFor="name" className="mb-2 block text-sm text-zinc-400">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              className="glass w-full rounded-xl px-4 py-3 text-white outline-none focus:ring-1 focus:ring-[#00d4ff]"
              placeholder="Your name"
            />
          </div>
          <motion.div>
            <label htmlFor="email" className="mb-2 block text-sm text-zinc-400">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="glass w-full rounded-xl px-4 py-3 text-white outline-none focus:ring-1 focus:ring-[#00d4ff]"
              placeholder="you@email.com"
            />
          </motion.div>
          <motion.div>
            <label htmlFor="message" className="mb-2 block text-sm text-zinc-400">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              minLength={10}
              rows={5}
              value={form.message}
              onChange={handleChange}
              className="glass w-full resize-none rounded-xl px-4 py-3 text-white outline-none focus:ring-1 focus:ring-[#00d4ff]"
              placeholder="Tell me about your project..."
            />
          </motion.div>

          {status === 'success' && (
            <motion.p
              className="flex items-center gap-2 text-sm text-emerald-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <CheckCircle size={16} />
              Message sent! I&apos;ll get back to you soon.
            </motion.p>
          )}
          {status === 'short' && (
            <motion.p
              className="flex items-center gap-2 text-sm text-amber-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <AlertCircle size={16} />
              Please write at least 10 characters in your message.
            </motion.p>
          )}
          {status === 'error' && (
            <motion.p
              className="flex items-center gap-2 text-sm text-red-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <AlertCircle size={16} />
              Something went wrong. Please try again.
            </motion.p>
          )}
          {status === 'email' && (
            <motion.p
              className="flex items-center gap-2 text-sm text-amber-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <AlertCircle size={16} />
              Backend is unavailable, so I opened an email draft instead.
            </motion.p>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#a855f7] py-3 font-semibold text-black disabled:opacity-60"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            <Send size={18} />
            {loading ? 'Sending...' : 'Send Message'}
          </motion.button>
        </motion.form>
      </motion.div>
    </section>
  );
};

export default Contact;
