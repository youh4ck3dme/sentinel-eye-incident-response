
import React, { useState } from 'react';
import linesSvg from '../assets/lines.svg';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b border-zinc-900 bg-black/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 md:gap-4 group cursor-pointer">
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tighter text-white leading-none">
              SENTINEL<span className="text-red-600">EYE</span>
            </h1>
            <div className="flex items-center gap-2 text-[8px] md:text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full animate-pulse"></span>
              System Online
            </div>
          </div>
          <div className="relative">
            <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
              <img src={linesSvg} alt="Sentinel Logo" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-zinc-400 hover:text-white p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {['LIVESCAN', 'THREAT MAP', 'ARCHIVE', 'SETTINGS'].map((item) => (
            <a key={item} href="#" className="text-xs font-bold text-zinc-500 hover:text-red-500 transition-colors uppercase tracking-[0.15em] relative group">
              {item}
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full opacity-0 group-hover:opacity-100"></span>
            </a>
          ))}
          <div className="text-xs font-black text-red-500 border border-red-500/30 px-3 py-1.5 rounded bg-red-500/10 animate-pulse">
            DEFCON 4
          </div>
        </nav>
      </div>

      {/* Mobile Navigation */}
      {
        isMenuOpen && (
          <nav className="md:hidden border-t border-zinc-900 bg-black p-4 flex flex-col gap-4 animate-in slide-in-from-top-5">
            {['LIVESCAN', 'THREAT MAP', 'ARCHIVE', 'SETTINGS'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm font-bold text-zinc-400 hover:text-red-500 transition-colors uppercase tracking-[0.15em] py-2 border-b border-zinc-900 last:border-0"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <div className="text-xs font-black text-red-500 border border-red-500/30 px-3 py-2 rounded bg-red-500/10 text-center">
              DEFCON 4
            </div>
          </nav>
        )
      }
    </header >
  );
};

export default Header;
