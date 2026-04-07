'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const NewFooter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface-800 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } }
          }}
        >
          {/* Company Info */}
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <h3 className="text-xl font-bold text-white mb-4">
              ConvertViral
            </h3>
            <p className="text-surface-400 text-sm mb-4">
              Fast, secure file conversion. No registration required.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com/convertviral" target="_blank" rel="noopener noreferrer" className="text-surface-400 hover:text-primary-400 transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/></svg>
              </a>
              <a href="https://facebook.com/convertviral" target="_blank" rel="noopener noreferrer" className="text-surface-400 hover:text-primary-400 transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
              </a>
              <a href="https://instagram.com/convertviral" target="_blank" rel="noopener noreferrer" className="text-surface-400 hover:text-primary-400 transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            </div>
          </motion.div>

          {/* Popular Conversions */}
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <h3 className="text-lg font-semibold text-white mb-4">Popular</h3>
            <ul className="space-y-2 text-surface-400">
              <li><Link href="/convert/pdf-to-docx" className="hover:text-primary-400 transition-colors text-sm">PDF to Word</Link></li>
              <li><Link href="/convert/jpg-to-pdf" className="hover:text-primary-400 transition-colors text-sm">JPG to PDF</Link></li>
              <li><Link href="/convert/mp4-to-mp3" className="hover:text-primary-400 transition-colors text-sm">MP4 to MP3</Link></li>
              <li><Link href="/convert" className="hover:text-primary-400 transition-colors text-sm font-medium">All Conversions</Link></li>
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2 text-surface-400">
              <li><Link href="/about" className="hover:text-primary-400 transition-colors text-sm">About</Link></li>
              <li><Link href="/features" className="hover:text-primary-400 transition-colors text-sm">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-primary-400 transition-colors text-sm">Pricing</Link></li>
              <li><Link href="/contact" className="hover:text-primary-400 transition-colors text-sm">Contact</Link></li>
              <li><Link href="/faq" className="hover:text-primary-400 transition-colors text-sm">FAQ</Link></li>
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <h3 className="text-lg font-semibold text-white mb-4">Stay Updated</h3>
            <p className="text-surface-400 text-sm mb-4">Get the latest news.</p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="w-full px-4 py-2 rounded-lg bg-surface-700 border border-surface-600 text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                required
              />
              <button type="submit" className="w-full btn-primary text-sm">
                Subscribe
              </button>
              {subscribed && (
                <p className="text-accent-400 text-sm">Thanks for subscribing!</p>
              )}
            </form>
          </motion.div>
        </motion.div>

        {/* Bottom */}
        <div className="pt-8 mt-8 border-t border-surface-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-surface-400 text-sm">
              © {currentYear} ConvertViral
            </p>
            <div className="flex space-x-6">
              <Link href="/terms" className="text-surface-400 hover:text-white text-sm transition-colors">Terms</Link>
              <Link href="/privacy" className="text-surface-400 hover:text-white text-sm transition-colors">Privacy</Link>
              <Link href="/cookies" className="text-surface-400 hover:text-white text-sm transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default NewFooter;
