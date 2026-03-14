export type ProjectStatus = 'LIVE' | 'DEMO' | 'WIP';

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  techStack: string[];
  status: ProjectStatus;
  boneName: string;
  demoUrl?: string;
  githubUrl: string;
}

export const projects: Project[] = [
  {
    id: 'first-aid-buddy',
    title: 'First Aid Buddy Bot',
    tagline: 'AI-driven emergency assistance',
    description: 'An intelligent medical assistant powered by LangChain and Claude API, providing real-time trauma guidance retrieved using RAG.',
    techStack: ['Python', 'LangChain', 'FastAPI', 'Claude API', 'RAG'],
    status: 'LIVE',
    boneName: 'mixamorigHead', // 🧠 Head
    githubUrl: 'https://github.com/AnkitGSingh/first-aid-buddy',
  },
  {
    id: 'maze-runner',
    title: 'Maze Runner Robot',
    tagline: 'Autonomous navigation system',
    description: 'A robotic simulation using Webots that implements BFS/DFS pathfinding algorithms and sensor fusion for navigating complex mazes.',
    techStack: ['Python', 'Webots', 'BFS/DFS', 'Sensor Fusion'],
    status: 'DEMO',
    boneName: 'mixamorigSpine2', // ⚙️ Chest
    githubUrl: 'https://github.com/AnkitGSingh/maze-runner',
  },
  {
    id: 'digit-recognition',
    title: 'Digit Recognition',
    tagline: 'Deep learning vision model',
    description: 'A Convolutional Neural Network trained on the MNIST dataset to predict handwritten digits with high accuracy using TensorFlow and Keras.',
    techStack: ['Python', 'TensorFlow', 'CNN', 'MNIST', 'Keras'],
    status: 'LIVE',
    boneName: 'mixamorigLeftArm', // 💪 Left Arm
    githubUrl: 'https://github.com/AnkitGSingh/digit-recognition',
  },
  {
    id: 'ipl-scraper',
    title: 'IPL Score Scraper',
    tagline: 'Real-time sports data pipeline',
    description: 'Automated data scraping utility leveraging BeautifulSoup to parse IPL scores, applying Pandas and Matplotlib for deeper statistical analysis.',
    techStack: ['Python', 'BeautifulSoup', 'Pandas', 'Matplotlib'],
    status: 'DEMO',
    boneName: 'mixamorigRightArm', // 🔩 Right Arm
    githubUrl: 'https://github.com/AnkitGSingh/ipl-scraper',
  },
  {
    id: 'godl1ke',
    title: 'GODL1KE',
    tagline: 'Custom search utility',
    description: 'A high-performance search AI interface utilizing the SHU API to quickly index and retrieve content with a responsive vanilla JS frontend.',
    techStack: ['JavaScript', 'CSS', 'HTML', 'Search AI', 'SHU API'],
    status: 'LIVE',
    boneName: 'mixamorigLeftUpLeg', // 🦿 Left Leg
    githubUrl: 'https://github.com/AnkitGSingh/godl1ke',
  },
  {
    id: 'medical-imaging',
    title: 'ML Medical Imaging',
    tagline: 'Advanced diagnostic CNN',
    description: 'Deep learning model designed to analyze and classify medical imaging from the NIH dataset, using CNNs and NLP for report parsing.',
    techStack: ['Python', 'Deep Learning', 'CNN', 'NLP', 'NIH Dataset'],
    status: 'WIP',
    boneName: 'mixamorigRightUpLeg', // 🦿 Right Leg
    githubUrl: 'https://github.com/AnkitGSingh/medical-imaging',
  }
];
