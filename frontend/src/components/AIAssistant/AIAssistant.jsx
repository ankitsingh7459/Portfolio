import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';
import { getChatbotReply } from '../../utils/chatbotKnowledge';

const AIAssistant = ({ open, onToggle }) => {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: "Hi! I'm Ask Ankit — ask me about projects, skills, education, or how to reach Ankit!",
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages((m) => [...m, { role: 'user', text: trimmed }]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const reply = getChatbotReply(trimmed);
      setMessages((m) => [...m, { role: 'bot', text: reply }]);
      setTyping(false);
    }, 800 + Math.random() * 600);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      <motion.button
        type="button"
        onClick={onToggle}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[#00d4ff] to-[#a855f7] text-black shadow-lg neon-glow"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Ask Ankit"
      >
        <MessageCircle size={24} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 flex h-[420px] w-[360px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl glass shadow-2xl"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
          >
            <motion.div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div>
                <h3 className="font-semibold text-white">Ask Ankit</h3>
                <p className="text-xs text-zinc-500">AI Portfolio Assistant</p>
              </div>
              <button
                type="button"
                onClick={onToggle}
                className="rounded-lg p-1 text-zinc-400 hover:text-white"
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </motion.div>

            <motion.div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <motion.div
                  key={`${msg.role}-${i}`}
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                    msg.role === 'user'
                      ? 'ml-auto bg-[#00d4ff22] text-white'
                      : 'bg-white/5 text-zinc-300'
                  }`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {msg.text}
                </motion.div>
              ))}
              {typing && (
                <motion.div
                  className="flex gap-1 rounded-xl bg-white/5 px-4 py-3 w-fit"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {[0, 1, 2].map((d) => (
                    <motion.span
                      key={d}
                      className="h-2 w-2 rounded-full bg-[#00d4ff]"
                      animate={{ y: [0, -6, 0] }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        delay: d * 0.15,
                      }}
                    />
                  ))}
                </motion.div>
              )}
              <div ref={bottomRef} />
            </motion.div>

            <form
              onSubmit={handleSubmit}
              className="flex gap-2 border-t border-white/10 p-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about projects, skills..."
                className="flex-1 rounded-xl bg-white/5 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:ring-1 focus:ring-[#00d4ff]"
              />
              <button
                type="submit"
                className="rounded-xl bg-[#00d4ff] p-2 text-black"
                aria-label="Send"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;
