import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X } from 'lucide-react';
import { executeCommand } from '../../utils/terminalCommands';

const TerminalMode = ({ open, onClose }) => {
  const [history, setHistory] = useState([
  { type: 'output', text: 'Welcome to Ankit Singh\'s terminal. Type "help" for commands.' },
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [open, history]);

  const runCommand = (cmd) => {
    if (!cmd.trim()) return;
    setHistory((h) => [...h, { type: 'input', text: cmd }]);
    const result = executeCommand(cmd);
    if (result.type === 'clear') {
      setHistory([]);
    } else {
      setHistory((h) => [...h, { type: 'output', text: result.text }]);
    }
    setInput('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    runCommand(input);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="flex h-[min(500px,80vh)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#00d4ff33] bg-[#0a0a0f] shadow-2xl"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <motion.div className="flex items-center gap-2">
                <Terminal size={18} className="text-[#00d4ff]" />
                <span className="font-mono text-sm text-zinc-300">
                  ankit@portfolio ~ $
                </span>
              </motion.div>
              <button
                type="button"
                onClick={onClose}
                className="text-zinc-500 hover:text-white"
                aria-label="Close terminal"
              >
                <X size={18} />
              </button>
            </div>

            <motion.div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
              {history.map((line, i) => (
                <motion.div
                  key={i}
                  className={
                    line.type === 'input'
                      ? 'text-[#00d4ff] mb-1'
                      : 'text-zinc-400 mb-3 whitespace-pre-wrap'
                  }
                >
                  {line.type === 'input' ? `$ ${line.text}` : line.text}
                </motion.div>
              ))}
              <motion.div ref={bottomRef} />
            </motion.div>

            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 border-t border-white/10 px-4 py-3"
            >
              <span className="font-mono text-[#00d4ff]">$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent font-mono text-sm text-white outline-none"
                placeholder="Type a command..."
                autoComplete="off"
                spellCheck={false}
              />
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TerminalMode;
