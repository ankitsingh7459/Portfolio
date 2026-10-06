import { VALID_OPEN_TARGETS, getNavTarget } from './navTargets';
import { heroData } from '../data/hero';
import { aboutLines } from '../data/about';
import { DEFAULT_PROJECTS } from '../data/projects';
import { stackData } from '../data/stack';
import { resumeData } from '../data/resume';
import { contactData } from '../data/contact';

export const COMMAND_NAMES = [
  'help',
  'whoami',
  'about',
  'projects',
  'stack',
  'resume',
  'contact',
  'clear',
  'open',
];

export const MAX_COMMAND_LENGTH = 200;
export const MAX_HISTORY_ENTRIES = 50;

/**
 * Pure command executor for the interactive terminal.
 * No DOM, no eval, no network, no storage.
 * User inputs are returned as plain text strings only.
 *
 * @param {string} input - Raw string input from user
 * @param {object} [ctx] - Optional contextual data from data/
 * @returns {{ kind: 'output' | 'clear' | 'navigate', lines: string[], target?: string }}
 */
export const runCommand = (input = '', ctx = {}) => {
  if (typeof input !== 'string') {
    return { kind: 'output', lines: [] };
  }

  if (input.length > MAX_COMMAND_LENGTH) {
    return { kind: 'output', lines: ['input too long'] };
  }

  const trimmed = input.trim();
  if (trimmed === '') {
    return { kind: 'output', lines: [] };
  }

  const tokens = trimmed.split(/\s+/);
  const firstToken = tokens[0];
  const command = firstToken.toLowerCase();
  const args = tokens.slice(1);

  switch (command) {
    case 'help': {
      return {
        kind: 'output',
        lines: [
          'Available commands:',
          '  help       - list available terminal commands',
          '  whoami     - display developer identity and role',
          '  about      - read background and focus areas',
          '  projects   - list featured engineering projects',
          '  stack      - view languages and technology stack',
          '  resume     - display resume status and actions',
          '  contact    - view contact details and links',
          '  clear      - clear terminal log',
          '  open <id>  - navigate to section or case study',
          '',
          `Available targets for open: ${VALID_OPEN_TARGETS.join(', ')}`,
        ],
      };
    }

    case 'whoami': {
      const hero = ctx?.hero || heroData;
      const lines = [];
      if (hero?.name) {
        lines.push(`${hero.name}${hero.descriptor ? ` - ${hero.descriptor}` : ''}`);
      }
      if (hero?.heroLine) {
        lines.push(hero.heroLine);
      }
      return {
        kind: 'output',
        lines: lines.length > 0 ? lines : ['ankit_singh'],
      };
    }

    case 'about': {
      const about = ctx?.about || aboutLines;
      const lines = Array.isArray(about) ? about : (about?.bioLines || []);
      return {
        kind: 'output',
        lines: lines.length > 0 ? lines : ['// About information'],
      };
    }

    case 'projects': {
      const projects = ctx?.projects || DEFAULT_PROJECTS;
      const lines = ['Featured Projects:'];
      projects.forEach((p) => {
        lines.push(`* ${p.title}${p.description ? ` - ${p.description}` : ''}`);
      });
      return { kind: 'output', lines };
    }

    case 'stack': {
      const stack = ctx?.stack || stackData;
      const lines = Object.entries(stack).map(([group, items]) => {
        const list = Array.isArray(items) ? items.join(', ') : String(items);
        return `${group}: ${list}`;
      });
      return { kind: 'output', lines };
    }

    case 'resume': {
      const resume = ctx?.resume || resumeData;
      const lines = [
        `File: ${resume?.filePath || 'resume.pdf'} (available: ${resume?.available ? 'yes' : 'no'})`,
      ];
      if (resume?.description) {
        lines.push(`Description: ${resume.description}`);
      }
      lines.push('Type "open resume" to navigate to the resume section.');
      return { kind: 'output', lines };
    }

    case 'contact': {
      const contact = ctx?.contact || contactData;
      const lines = [];
      if (contact?.email) {
        lines.push(`Email: ${contact.email}`);
      }
      if (contact?.githubUrl) {
        lines.push(`GitHub: ${contact.githubUrl}`);
      }
      lines.push('Type "open contact" to jump to the contact form.');
      return { kind: 'output', lines };
    }

    case 'clear': {
      return { kind: 'clear', lines: [] };
    }

    case 'open': {
      if (args.length === 0) {
        return {
          kind: 'output',
          lines: [`Usage: open <target>. Available targets: ${VALID_OPEN_TARGETS.join(', ')}`],
        };
      }

      const targetArg = args[0].toLowerCase();
      if (!VALID_OPEN_TARGETS.includes(targetArg)) {
        return {
          kind: 'output',
          lines: [
            `Unknown target: "${args[0]}". Available targets: ${VALID_OPEN_TARGETS.join(', ')}.`,
          ],
        };
      }

      const nav = getNavTarget(targetArg);
      return {
        kind: 'navigate',
        lines: [`Navigating to ${targetArg}...`],
        target: nav ? nav.target : `#${targetArg}`,
      };
    }

    default: {
      return {
        kind: 'output',
        lines: [`command not found: ${firstToken}. Type help.`],
      };
    }
  }
};

/**
 * Autocompletion helper for terminal inputs.
 *
 * @param {string} prefix
 * @returns {string[]}
 */
export const complete = (prefix = '') => {
  if (typeof prefix !== 'string') return [];
  const trimmed = prefix.trimStart();
  if (!trimmed) return [...COMMAND_NAMES];

  const lower = trimmed.toLowerCase();
  if (lower.startsWith('open ')) {
    const targetPart = lower.slice(5).trimStart();
    return VALID_OPEN_TARGETS
      .filter((t) => t.startsWith(targetPart))
      .map((t) => `open ${t}`);
  }

  return COMMAND_NAMES.filter((cmd) => cmd.startsWith(lower));
};

/**
 * In-memory history helper capping at maxEntries (default 50).
 *
 * @param {string[]} history
 * @param {string} command
 * @param {number} [maxEntries=50]
 * @returns {string[]}
 */
export const addHistory = (history = [], command = '', maxEntries = MAX_HISTORY_ENTRIES) => {
  if (!Array.isArray(history) || typeof command !== 'string') return history;
  const trimmed = command.trim();
  if (!trimmed) return history;
  const next = [...history, trimmed];
  if (next.length > maxEntries) {
    return next.slice(next.length - maxEntries);
  }
  return next;
};
