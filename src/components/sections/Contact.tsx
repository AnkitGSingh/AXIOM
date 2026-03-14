'use client';
import { useState } from 'react';

export function Contact() {
  const [formStatus, setFormStatus] = useState<'IDLE' | 'SUBMITTING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    if (!name || !email || !message) return;

    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
    if (!accessKey) {
      setFormStatus('ERROR');
      return;
    }

    setFormStatus('SUBMITTING');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('message', message);
    formData.append('access_key', accessKey);

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      });

      if (res.status === 200) {
        setFormStatus('SUCCESS');
        setName(''); setEmail(''); setMessage('');
      } else {
        setFormStatus('ERROR');
      }
    } catch (err) {
      setFormStatus('ERROR');
    }
  };

  return (
    <section id="contact" className="min-h-[80vh] relative z-10 bg-[#080808] text-white flex items-center justify-center p-8 border-t border-[#C9A84C]/20 border-b-8 border-b-[#C9A84C]">
      <div className="max-w-2xl w-full">
        <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-[#C9A84C] mb-8 tracking-wider text-center">
          INITIATE_COMMS
        </h2>
        
        <div className="bg-[#00141e] border border-[#C9A84C]/50 p-8 relative flex flex-col gap-6 font-rajdhani text-lg">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-[#4FC3F7] font-orbitron text-xs tracking-widest uppercase">Operator Name</label>
            <input 
              required
              type="text" 
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-black border border-gray-700 p-3 text-white focus:outline-none focus:border-[#C9A84C] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-[#4FC3F7] font-orbitron text-xs tracking-widest uppercase">Return Frequency (Email)</label>
            <input 
              required
              type="email" 
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-black border border-gray-700 p-3 text-white focus:outline-none focus:border-[#C9A84C] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="message" className="text-[#4FC3F7] font-orbitron text-xs tracking-widest uppercase">Encrypted Transmission</label>
            <textarea 
              required
              id="message"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-black border border-gray-700 p-3 text-white focus:outline-none focus:border-[#C9A84C] transition-colors resize-none"
            ></textarea>
          </div>

          <button 
            onClick={handleSubmit}
            disabled={formStatus === 'SUBMITTING' || formStatus === 'SUCCESS'}
            className="mt-4 bg-[#C9A84C] text-[#080808] font-orbitron font-bold p-4 hover:bg-white transition-colors uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {formStatus === 'IDLE' && 'Transmit Message'}
            {formStatus === 'SUBMITTING' && 'Encrypting...'}
            {formStatus === 'SUCCESS' && 'Transmission Secure'}
            {formStatus === 'ERROR' && 'Transmission Failed - Retry'}
          </button>
        </div>
      </div>
    </section>
  );
}
