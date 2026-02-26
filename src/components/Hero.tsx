import { motion } from 'framer-motion';
import { HiDownload } from 'react-icons/hi';
import aboutData from '../content/about.json';

export default function Hero() {
  const headlineParts = aboutData.headline.split('\n');

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Parallax */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${aboutData.bannerImage})`,
          backgroundAttachment: 'fixed',
        }}
      />

      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{ background: 'var(--bg-hero-overlay)' }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight text-white mb-6">
            {headlineParts.map((part, index) => (
              <span key={index} className="block">
                {part.split(/(-)/g).map((segment, i) =>
                  segment === '-' ? (
                    <span
                      key={i}
                      style={{ color: 'var(--accent-purple)' }}
                    >
                      {segment}
                    </span>
                  ) : (
                    <span key={i}>{segment}</span>
                  )
                )}
              </span>
            ))}
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: 'var(--accent-neon)' }}
          >
            {aboutData.subheadline}
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href={aboutData.resumeUrl}
              download
              className="btn-accent text-base"
            >
              <HiDownload size={18} />
              Download Resume
            </a>

            <a
              href="#portfolio"
              onClick={(e) => {
                e.preventDefault();
                document
                  .querySelector('#portfolio')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-outline text-base"
            >
              View Portfolio
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-6 h-10 rounded-full border-2 flex items-start justify-center pt-2"
            style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}
          >
            <motion.div
              animate={{ opacity: [1, 0.3, 1], y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1.5 h-1.5 rounded-full bg-white"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
