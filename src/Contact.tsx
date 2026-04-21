import React from 'react';

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#0A0A0C] text-white p-8 md:p-16 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-cyan-400">Contact Us</h1>
      
      <div className="space-y-6 text-gray-300 leading-relaxed text-lg">
        <p>
          We would love to hear from you! Whether you have a suggestion, found a bug, or just want to say hello, feel free to reach out.
        </p>

        <div className="bg-white/5 border border-white/10 p-6 rounded-xl mt-8">
          <h2 className="text-2xl font-semibold text-blue-300 mb-4">Get In Touch</h2>
          <p className="mb-2"><strong>Email Support:</strong> <a href="mailto:assadrizik2011@gmail.com" className="text-cyan-400 hover:underline">assadrizik2011@gmail.com</a></p>
          <p className="mb-2"><strong>Developer:</strong> Abu Saqr</p>
          <p className="mt-4 border-t border-white/10 pt-4">
            <strong>Community:</strong> We warmly welcome you to join our official Discord server! Come hang out with us, share your high scores, report bugs, or just chat with the developer Abu Saqr and other amazing players.
            <br />
            <a href="https://discord.gg/BJ5kYUNutq" target="_blank" rel="noreferrer" className="inline-block mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium transition cursor-pointer">
              Join Our Discord
            </a>
          </p>
        </div>

        <p className="mt-8 text-sm opacity-70">
          We usually respond to inquiries within 48 hours. Thank you for your support and for playing ChromaFall!
        </p>
      </div>
    </div>
  );
}
