export const terminalData = {
  whoami: `ankit-singh
Role: AI/ML Engineer | Vibe Coder | Tech Enthusiast
Status: Building the future, one commit at a time.`,
  skills: `Languages:  Java, Python, C
Web:        HTML, CSS, React
Database:   MySQL, Appwrite
Cloud:      AWS (EC2, S3, Lambda)
Tools:      Git, VS Code, Docker`,
  projects: `1. Portfolio              - Personal portfolio website and API
2. CoSupport              - Backend and RAG implementation support
3. Bank Management System - Secure banking application
Type 'open projects' in browser to see more.`,
  resume: `Resume available for download.
Navigate to Hero section -> "Download Resume" button.`,
  contact: `Email:    ankitenterprises0001@gmail.com
GitHub:   github.com/ankitsingh7459
LinkedIn: www.linkedin.com/in/ankit-singh-tech`,
  education: `Degree: B.Tech Computer Science Engineering
Year:   Second Year
Focus:  AI/ML, Cloud Computing, Backend Development`,
  certifications: `- AWS Cloud Practitioner - Amazon Web Services
- Machine Learning Foundations - Coursera`,
  help: `Available commands:
  whoami  skills  projects  resume
  contact education certifications  clear  help`,
};

export const executeCommand = (cmd) => {
  const c = cmd.trim().toLowerCase();
  if (c === 'clear') return { type: 'clear' };
  if (c === 'help') return { type: 'output', text: terminalData.help };
  if (terminalData[c]) return { type: 'output', text: terminalData[c] };
  return { type: 'output', text: `Command not found: ${cmd}. Type 'help' for available commands.` };
};
