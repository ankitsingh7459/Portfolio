export const chatbotResponses = {
  who: `I'm Ask Ankit — your guide to Ankit Singh's world! Ankit is a second-year CSE student, AI/ML Engineer, Vibe Coder, and Tech Enthusiast passionate about building intelligent solutions.`,
  projects: `Ankit has worked on projects including **Portfolio**, **CoSupport** (backend development and RAG implementation support), and **Bank Management System**. Check the Projects section for GitHub links!`,
  skills: `Ankit's tech stack spans **Java, Python, C**, web technologies, **MySQL & Appwrite**, **AWS** cloud services, and **Git**. Explore the Skill Galaxy for an interactive view!`,
  education: `Ankit took admission in B.Tech Computer Science Engineering in 2024 and is actively learning backend development, databases, AI/ML, and cloud fundamentals.`,
  interests: `Current interests: Artificial Intelligence, Machine Learning, Cloud Computing, AWS, Backend Development, Developer Tools, Cybersecurity, and Intelligent Systems.`,
  contact: `Reach Ankit via the Contact section, or connect on GitHub and LinkedIn. Email is available in the footer!`,
  default: `I can help with: who Ankit is, projects, skills, education, interests, and contact info. Just ask!`,
};

export const getChatbotReply = (input) => {
  const msg = input.toLowerCase();
  if (msg.includes('who') || msg.includes('ankit') || msg.includes('about')) return chatbotResponses.who;
  if (msg.includes('project')) return chatbotResponses.projects;
  if (msg.includes('skill') || msg.includes('tech')) return chatbotResponses.skills;
  if (msg.includes('educat') || msg.includes('student') || msg.includes('cse')) return chatbotResponses.education;
  if (msg.includes('interest') || msg.includes('passion')) return chatbotResponses.interests;
  if (msg.includes('contact') || msg.includes('email') || msg.includes('reach')) return chatbotResponses.contact;
  return chatbotResponses.default;
};
