'use client';

const skillCategories = [
  {
    title: 'AI / ML',
    skills: ['Python', 'LangChain', 'AWS Bedrock', 'Deep Learning', 'RAG']
  },
  {
    title: 'Frontend',
    skills: ['TypeScript', 'React', 'Next.js 14', 'Three.js / R3F', 'Tailwind CSS']
  },
  {
    title: 'Backend',
    skills: ['FastAPI', 'Node.js', 'PostgreSQL', 'API Design']
  },
  {
    title: 'DevOps & Tools',
    skills: ['Docker', 'GitHub Actions', 'Vercel', 'Git']
  }
];

export function Skills() {
  return (
    <section id="skills" className="min-h-screen relative z-10 bg-[#080808] text-white flex items-center justify-center p-8 border-t border-[#C9A84C]/20">
      <div className="max-w-5xl w-full">
        <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-[#C9A84C] mb-12 tracking-wider text-right">
          TECHNICAL_SPECS &lt;
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skillCategories.map((category) => (
            <div 
              key={category.title} 
              className="bg-[#00141e] border border-[#C9A84C]/50 p-6 relative group hover:border-[#4FC3F7] transition-colors duration-300"
            >
              <h3 className="font-orbitron text-xl text-[#4FC3F7] mb-6 uppercase tracking-widest border-b border-[#4FC3F7]/30 pb-2">
                {category.title}
              </h3>
              
              <div className="flex flex-wrap gap-3">
                {category.skills.map(skill => (
                  <span 
                    key={skill}
                    className="font-jetbrains text-sm bg-black border border-gray-700 text-gray-300 px-3 py-1.5 rounded-sm group-hover:block transition-all hover:bg-[#C9A84C] hover:text-black hover:border-[#C9A84C] cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
