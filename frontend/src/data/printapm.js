export const printApmProject = {
  _id: 'printapm',
  slug: 'printapm',
  title: 'PrintAPM',
  description: 'Automated campus document printing kiosk management platform with IoT hardware integration.',
  techStack: ['React', 'Node.js', 'Express', 'IoT', 'Hardware'],
  githubUrl: null,
  liveUrl: 'https://printapm.online',
  caseStudyUrl: '/projects/printapm',
  featured: true,
};

export const printApmCaseStudy = {
  slug: 'printapm',
  title: 'PrintAPM',
  tagline: 'Automated campus document printing kiosk management system',
  liveUrl: 'https://printapm.online',
  problemText: "[FILL: PrintAPM problem statement in Ankit's words]",
  solutionText: "[FILL: PrintAPM solution description in Ankit's words]",
  statsJson: {
    totalPrints: '[FILL: database metric]',
    activeUsers: '[FILL: database metric]',
    kiosksDeployed: '[FILL: database metric]',
    avgPrintTimeSeconds: '[FILL: database metric]',
    launchDate: '[FILL: launch date]',
  },
  architectureSteps: [
    {
      step: 1,
      title: 'Client Web Upload',
      description: '[FILL: confirm - User uploads document via responsive mobile/web interface]',
    },
    {
      step: 2,
      title: 'Backend Queue & Validation',
      description: '[FILL: confirm - Document queueing and job verification service]',
    },
    {
      step: 3,
      title: 'IoT Kiosk Gateway',
      description: '[FILL: confirm - Kiosk hardware controller polls authenticated print queue]',
    },
    {
      step: 4,
      title: 'Automated Hardware Dispense',
      description: '[FILL: confirm - Secure physical printing and collection confirmation]',
    },
  ],
  decisions: [
    {
      title: 'ADR-1: Dedicated IoT Hardware Bridge',
      decision: '[FILL: confirm - Isolated kiosk microcontroller interface from public web APIs for hardware reliability]',
    },
    {
      title: 'ADR-2: Ephemeral Document Retention',
      decision: '[FILL: confirm - Automatic purge of uploaded documents post-print to protect user privacy]',
    },
    {
      title: 'ADR-3: Resilient Offline Queueing',
      decision: '[FILL: confirm - Local job queueing and reconnect fallback on campus network drops]',
    },
  ],
  lessonsText: "[FILL: Key architectural and product lessons learned in Ankit's words]",
  screenshots: [
    {
      id: 'kiosk-ui',
      alt: 'PrintAPM kiosk release code screen placeholder',
      caption: 'Kiosk Terminal Interface',
      src: '/printapm/kiosk-ui.webp',
    },
    {
      id: 'upload-flow',
      alt: 'PrintAPM document upload flow placeholder',
      caption: 'Mobile Web Upload Experience',
      src: '/printapm/upload-flow.webp',
    },
  ],
};

export default printApmCaseStudy;
