import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Footer } from './Index';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#e0f7fa] via-[#f8feff] to-[#e0f7fa]">
      <Navbar onLogoClick={() => {}} isInInterview={false} onRequestLeave={() => {}} />
      <div className="flex-1 flex items-center justify-center py-8 px-2 mt-16 md:mt-24">
        <div className="relative w-full max-w-md md:max-w-lg">
          {/* Animated Gradient Border */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-[#4fd1c5] via-[#7fe3e0] to-[#18404a] blur-lg opacity-60 animate-pulse z-0" />
          <div className="relative z-10 bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl p-6 md:p-10 flex flex-col items-center border border-[#e0f7fa]" style={{boxShadow: '0 8px 40px #4fd1c555, 0 2px 24px #13b5b155'}}>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#18404a] mb-1 text-center tracking-tight" style={{fontFamily: 'Montserrat, Poppins, sans-serif'}}>Contact Us</h1>
            <p className="text-gray-500 mb-6 text-center text-base md:text-lg">Have a question, suggestion, or just want to say hi? Fill out the form below and we'll get back to you soon!</p>
            {submitted ? (
              <div className="text-center text-lg text-[#4fd1c5] font-semibold py-10">
                Thank you for reaching out! We'll get back to you soon.
              </div>
            ) : (
              <form className="w-full flex flex-col gap-4 md:gap-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="block text-base font-semibold text-[#18404a] mb-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4fd1c5] text-base bg-white/70 shadow-sm"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-base font-semibold text-[#18404a] mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4fd1c5] text-base bg-white/70 shadow-sm"
                    placeholder="you@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-base font-semibold text-[#18404a] mb-1">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4fd1c5] text-base bg-white/70 shadow-sm resize-none"
                    placeholder="Type your message here..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#4fd1c5] via-[#7fe3e0] to-[#18404a] text-white font-bold py-2.5 rounded-xl hover:from-[#5ff5e0] hover:to-[#18404a] transition text-base shadow-lg mt-1 tracking-wide"
                  style={{letterSpacing: '0.03em'}}
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer isInInterview={false} onRequestLeave={() => {}} />
    </div>
  );
};

export default Contact; 