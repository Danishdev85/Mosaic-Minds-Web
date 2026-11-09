import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX } from 'react-icons/hi';
import { FaLeaf } from 'react-icons/fa';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/therapists', label: 'Our Therapists' },
  { to: '/lookup', label: 'My Session' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 glass-nav transition-shadow duration-500 ease-calm ${
        scrolled ? 'shadow-warm-sm' : ''
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <motion.span
            whileHover={{ rotate: [0, -8, 8, -4, 0] }}
            transition={{ duration: 0.7 }}
            className="text-amber text-2xl"
          >
            <FaLeaf />
          </motion.span>
          <span className="font-display text-xl font-semibold text-umber tracking-tight">
            Mosaic <span className="text-rust">Minds</span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-9">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `link-underline text-sm font-medium transition-colors duration-300 ${
                    isActive ? 'text-rust' : 'text-umber/75 hover:text-rust'
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="hidden lg:block">
          <Link to="/book">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="breathe-cta bg-rust text-white font-medium px-6 py-2.5 rounded-full shadow-warm-sm"
            >
              Book a Session
            </motion.button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden text-2xl text-umber"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <HiX /> : <HiMenu />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
            className="lg:hidden glass-nav overflow-hidden border-t border-rust/10"
          >
            <ul className="flex flex-col px-6 py-5 gap-4">
              {links.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `block text-base font-medium ${isActive ? 'text-rust' : 'text-umber/75'}`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
              <li>
                <Link to="/book" onClick={() => setOpen(false)}>
                  <button className="w-full bg-rust text-white font-medium px-6 py-3 rounded-full shadow-warm-sm">
                    Book a Session
                  </button>
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}