export function About() {
  return (
    <section id="about" className="min-h-screen relative z-10 bg-[#080808] text-white flex items-center justify-center p-8 border-t border-[#C9A84C]/20">
      <div className="max-w-4xl w-full">
        <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-[#C9A84C] mb-8 tracking-wider">
          &gt; WHO_AM_I
        </h2>
        
        <div className="bg-[#0D0D0D] border border-[#C9A84C]/30 p-8 shadow-[0_0_30px_rgba(201,168,76,0.05)] relative font-rajdhani text-lg md:text-xl text-gray-300 leading-relaxed">
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#C9A84C]" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#C9A84C]" />

          <p className="mb-6">
            I'm <span className="text-[#4FC3F7] font-semibold">Ankit Singh</span>. Originally from Surat, India, I'm now based in Sheffield, UK, after completing my MSc in Artificial Intelligence at Sheffield Hallam University.
          </p>
          
          <p className="mb-6">
            Currently, I'm an <span className="text-[#C9A84C] font-semibold">Automation & Workflow Engineer at AdTecher</span> — an NVIDIA Inception Program startup — where I also hold a 0.5% equity stake. I don't just build software; I design autonomous systems that bridge the gap between human intent and machine execution.
          </p>
          
          <p>
            This portfolio, <span className="text-[#C9A84C] font-orbitron text-sm">Project AXIOM</span>, was directly inspired by my childhood hero: Iron Man. It's built to prove that enterprise-grade engineering doesn't have to be sterile. We can — and should — build experiences that are unforgettable.
          </p>
        </div>
      </div>
    </section>
  );
}
