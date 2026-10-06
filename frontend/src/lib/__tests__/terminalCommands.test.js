import { describe, it, expect } from 'vitest';
import {
  runCommand,
  complete,
  addHistory,
  COMMAND_NAMES,
  MAX_HISTORY_ENTRIES,
} from '../terminalCommands';
import { VALID_OPEN_TARGETS, NAV_TARGETS, getNavTarget } from '../navTargets';

describe('navTargets registry', () => {
  it('defines valid navigation targets with expected structure', () => {
    expect(NAV_TARGETS.length).toBeGreaterThan(0);
    NAV_TARGETS.forEach((target) => {
      expect(target).toHaveProperty('id');
      expect(target).toHaveProperty('label');
      expect(target).toHaveProperty('type');
      expect(target).toHaveProperty('target');
      expect(target).toHaveProperty('description');
    });
  });

  it('retrieves nav targets case-insensitively', () => {
    expect(getNavTarget('PROJECTS')?.id).toBe('projects');
    expect(getNavTarget('printapm')?.target).toBe('/projects/printapm');
    expect(getNavTarget('invalid-target')).toBeNull();
    expect(getNavTarget(null)).toBeNull();
  });
});

describe('terminalCommands pure parser', () => {
  it('handles empty and whitespace-only input without output', () => {
    expect(runCommand('').lines).toEqual([]);
    expect(runCommand('   ').lines).toEqual([]);
    expect(runCommand(null).lines).toEqual([]);
  });

  it('rejects input longer than 200 characters', () => {
    const longInput = 'a'.repeat(201);
    const result = runCommand(longInput);
    expect(result.kind).toBe('output');
    expect(result.lines).toEqual(['input too long']);

    const fiveHundredChars = 'echo ' + 'x'.repeat(500);
    const result500 = runCommand(fiveHundredChars);
    expect(result500.kind).toBe('output');
    expect(result500.lines).toEqual(['input too long']);
  });

  it('returns help listing all commands and open targets', () => {
    const result = runCommand('help');
    expect(result.kind).toBe('output');
    expect(result.lines[0]).toBe('Available commands:');
    COMMAND_NAMES.forEach((cmd) => {
      expect(result.lines.some((line) => line.includes(cmd))).toBe(true);
    });
    VALID_OPEN_TARGETS.forEach((target) => {
      expect(result.lines.some((line) => line.includes(target))).toBe(true);
    });
  });

  it('runs whoami command and outputs identity lines', () => {
    const customCtx = {
      hero: {
        name: 'test_user',
        descriptor: 'Systems Engineer',
        heroLine: 'Building reliable distributed software',
      },
    };
    const result = runCommand('whoami', customCtx);
    expect(result.kind).toBe('output');
    expect(result.lines).toContain('test_user - Systems Engineer');
    expect(result.lines).toContain('Building reliable distributed software');
  });

  it('runs about command and returns about lines', () => {
    const customCtx = {
      about: ['First line of background', 'Second line of background'],
    };
    const result = runCommand('about', customCtx);
    expect(result.kind).toBe('output');
    expect(result.lines).toEqual([
      'First line of background',
      'Second line of background',
    ]);
  });

  it('runs projects command and outputs project titles', () => {
    const customCtx = {
      projects: [
        { title: 'Project Alpha', description: 'Alpha system description' },
        { title: 'Project Beta', description: 'Beta system description' },
      ],
    };
    const result = runCommand('projects', customCtx);
    expect(result.kind).toBe('output');
    expect(result.lines[0]).toBe('Featured Projects:');
    expect(result.lines).toContain('* Project Alpha - Alpha system description');
    expect(result.lines).toContain('* Project Beta - Beta system description');
  });

  it('runs stack command and outputs grouped skills', () => {
    const customCtx = {
      stack: {
        languages: ['Rust', 'TypeScript'],
        databases: ['PostgreSQL'],
      },
    };
    const result = runCommand('stack', customCtx);
    expect(result.kind).toBe('output');
    expect(result.lines).toContain('languages: Rust, TypeScript');
    expect(result.lines).toContain('databases: PostgreSQL');
  });

  it('runs resume command and outputs file and availability status', () => {
    const customCtx = {
      resume: {
        filePath: '/resume.pdf',
        available: true,
        description: 'Verified engineering background',
      },
    };
    const result = runCommand('resume', customCtx);
    expect(result.kind).toBe('output');
    expect(result.lines[0]).toContain('File: /resume.pdf (available: yes)');
    expect(result.lines[1]).toContain('Description: Verified engineering background');
    expect(result.lines[2]).toContain('open resume');
  });

  it('runs contact command and outputs contact links', () => {
    const customCtx = {
      contact: {
        email: 'developer@example.com',
        githubUrl: 'https://github.com/ankitsingh7459',
      },
    };
    const result = runCommand('contact', customCtx);
    expect(result.kind).toBe('output');
    expect(result.lines).toContain('Email: developer@example.com');
    expect(result.lines).toContain('GitHub: https://github.com/ankitsingh7459');
  });

  it('runs clear command and returns clear kind', () => {
    const result = runCommand('clear');
    expect(result.kind).toBe('clear');
    expect(result.lines).toEqual([]);
  });

  it('runs open command with valid section and route targets', () => {
    const navCaseStudy = runCommand('open printapm');
    expect(navCaseStudy.kind).toBe('navigate');
    expect(navCaseStudy.target).toBe('/projects/printapm');

    const navProjects = runCommand('open projects');
    expect(navProjects.kind).toBe('navigate');
    expect(navProjects.target).toBe('#projects');

    const navAbout = runCommand('open about');
    expect(navAbout.kind).toBe('navigate');
    expect(navAbout.target).toBe('#about');
  });

  it('handles open command with missing or invalid targets', () => {
    const emptyOpen = runCommand('open');
    expect(emptyOpen.kind).toBe('output');
    expect(emptyOpen.lines[0]).toContain('Usage: open <target>');

    const invalidOpen = runCommand('open invalid-target');
    expect(invalidOpen.kind).toBe('output');
    expect(invalidOpen.lines[0]).toContain('Unknown target: "invalid-target"');
    expect(invalidOpen.lines[0]).toContain('Available targets:');
  });

  it('handles case-insensitivity and extra whitespace', () => {
    expect(runCommand('  HELP  ').kind).toBe('output');
    expect(runCommand('WHOAMI').kind).toBe('output');
    const openWithSpaces = runCommand('   OPEN    PRINTAPM   ');
    expect(openWithSpaces.kind).toBe('navigate');
    expect(openWithSpaces.target).toBe('/projects/printapm');
  });

  it('handles unknown commands with helpful suggestion', () => {
    const result = runCommand('unknowncommand123');
    expect(result.kind).toBe('output');
    expect(result.lines).toEqual([
      'command not found: unknowncommand123. Type help.',
    ]);
  });

  it('treats HTML or script injection strings strictly as plain text', () => {
    const xss = '<img src=x onerror=alert(1)>';
    const result = runCommand(xss);
    expect(result.kind).toBe('output');
    expect(result.lines).toEqual([
      'command not found: <img. Type help.',
    ]);
    expect(typeof result.lines[0]).toBe('string');
  });
});

describe('terminal autocomplete (complete)', () => {
  it('returns all commands when prefix is empty or whitespace', () => {
    expect(complete('')).toEqual(COMMAND_NAMES);
    expect(complete('   ')).toEqual(COMMAND_NAMES);
  });

  it('returns matching commands for prefix', () => {
    expect(complete('h')).toEqual(['help']);
    expect(complete('p')).toEqual(['projects']);
    expect(complete('cl')).toEqual(['clear']);
    expect(complete('xyz')).toEqual([]);
  });

  it('completes open command targets when prefix begins with open ', () => {
    expect(complete('open p')).toEqual(['open printapm', 'open projects']);
    expect(complete('open pr')).toEqual(['open printapm', 'open projects']);
    expect(complete('open print')).toEqual(['open printapm']);
    expect(complete('open ab')).toEqual(['open about']);
    expect(complete('open nonexisting')).toEqual([]);
  });
});

describe('terminal history helper (addHistory)', () => {
  it('ignores empty and whitespace commands', () => {
    const initial = ['help'];
    expect(addHistory(initial, '')).toEqual(initial);
    expect(addHistory(initial, '   ')).toEqual(initial);
  });

  it('appends valid commands into history in-memory', () => {
    let history = [];
    history = addHistory(history, 'help');
    history = addHistory(history, 'whoami');
    expect(history).toEqual(['help', 'whoami']);
  });

  it('caps history at maxEntries (50) and discards oldest', () => {
    let history = [];
    for (let i = 1; i <= 60; i++) {
      history = addHistory(history, `cmd-${i}`);
    }
    expect(history.length).toBe(MAX_HISTORY_ENTRIES);
    expect(history[0]).toBe('cmd-11');
    expect(history[history.length - 1]).toBe('cmd-60');
  });
});
