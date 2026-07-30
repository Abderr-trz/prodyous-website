'use client';

import { motion, useScroll, useTransform, useInView, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';

/* ------------------------------------------------------------------ */
/*  REUSABLE ANIMATION HELPERS                                       */
/* ------------------------------------------------------------------ */

function FadeInWhenVisible({ children, delay = 0, direction = 'up', className = '' }: {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const dirs = {
    up: { y: 50, x: 0 },
    down: { y: -50, x: 0 },
    left: { y: 0, x: 50 },
    right: { y: 0, x: -50 },
  };
  const d = dirs[direction];
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: d.y, x: d.x }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ text }: { text: string }) {
  return (
    <span className="inline-block font-oswald text-accent text-[11px] sm:text-xs tracking-ultra-wide uppercase mb-4 sm:mb-6">
      {text}
    </span>
  );
}

function SectionHeading({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={`font-oswald text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] font-bold uppercase leading-[1.05] ${className}`}>
      {children}
    </h2>
  );
}

/* ------------------------------------------------------------------ */
/*  CUSTOM CURSOR                                                     */
/* ------------------------------------------------------------------ */

function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const ringX = useSpring(cursorX, { stiffness: 150, damping: 20 });
  const ringY = useSpring(cursorY, { stiffness: 150, damping: 20 });
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [cursorX, cursorY]);

  if (isTouch) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-accent rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%' }}
      />
      <motion.div
        className="fixed top-0 left-0 w-9 h-9 rounded-full border border-accent/60 pointer-events-none z-[9998] mix-blend-difference"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  NAVIGATION                                                        */
/* ------------------------------------------------------------------ */

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const scrollToSection = (id: string) => {
    setMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        const offset = 80;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }, 300);
  };

  const links = ['Services', 'Work', 'About', 'Contact'];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5' : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 flex items-center justify-between h-16 sm:h-20">
        <a href="#hero" className="flex items-center gap-2.5 sm:gap-3 group">
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-white/10 group-hover:border-accent/40 transition-colors">
            <Image src="/logo.jpg" alt="PRODYOUS" fill className="object-cover" />
          </div>
          <span className="font-oswald text-base sm:text-lg font-semibold tracking-wide-custom uppercase">
            Prodyous
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="font-oswald text-[11px] sm:text-xs tracking-ultra-wide uppercase text-white/60 hover:text-accent transition-colors duration-300"
            >
              {link}
            </a>
          ))}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col items-center justify-center gap-1.5 w-11 h-11 -mr-2"
          aria-label="Toggle menu"
        >
          <motion.span
            animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            className="block w-6 h-[1.5px] bg-white"
          />
          <motion.span
            animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
            className="block w-6 h-[1.5px] bg-white"
          />
          <motion.span
            animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            className="block w-6 h-[1.5px] bg-white"
          />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0a0a0a]/95 backdrop-blur-lg border-t border-white/5 overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-5">
              {links.map((link) => (
                <button
                  key={link}
                  onClick={() => scrollToSection(link.toLowerCase())}
                  className="font-oswald text-sm tracking-ultra-wide uppercase text-white/70 hover:text-accent transition-colors text-left"
                >
                  {link}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

/* ------------------------------------------------------------------ */
/*  HERO SECTION                                                      */
/* ------------------------------------------------------------------ */

function useVideoTimecode(ref: React.RefObject<HTMLVideoElement | null>) {
  const [timecode, setTimecode] = useState('00:00:00:00');
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const update = () => {
      if (!video.paused) {
        const t = video.currentTime;
        const h = Math.floor(t / 3600);
        const m = Math.floor((t % 3600) / 60);
        const s = Math.floor(t % 60);
        const f = Math.floor((t % 1) * 30);
        setTimecode(
          `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}:${String(f).padStart(2, '0')}`
        );
      }
      rafRef.current = requestAnimationFrame(update);
    };

    rafRef.current = requestAnimationFrame(update);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [ref]);

  return timecode;
}

function HeroSection() {
  const ref = useRef(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timecode = useVideoTimecode(videoRef);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 80]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {});
  }, []);

  return (
    <section
      id="hero"
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        crossOrigin="anonymous"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="https://res.cloudinary.com/cxbbvqvr/video/upload/v1785413087/agadir_g2qoo2.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 gradient-glow noise-overlay" />

      <motion.div style={{ opacity, y }} className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-28 pb-16">
        <FadeInWhenVisible delay={0.2}>
          <div className="flex items-center gap-3 mb-8 sm:mb-12">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="font-mono text-[10px] sm:text-xs text-white/40 tracking-widest">
              REC ——— {timecode}
            </span>
          </div>
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={0.4}>
          <h1 className="font-oswald text-[2.5rem] xs:text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] xl:text-[7.5rem] font-bold uppercase leading-[0.95] mb-2 sm:mb-3">
            VISION.
          </h1>
        </FadeInWhenVisible>
        <FadeInWhenVisible delay={0.55}>
          <h1 className="font-oswald text-[2.5rem] xs:text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] xl:text-[7.5rem] font-bold uppercase leading-[0.95] text-accent-outline italic">
            EXECUTED.
          </h1>
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={0.7}>
          <p className="mt-6 sm:mt-8 max-w-xl text-sm sm:text-base text-white/50 leading-relaxed">
            We don&apos;t just capture footage , we architect cinematic experiences. 
            From aerial cinematography to razor-sharp editing, every frame is engineered for maximum impact.
          </p>
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={1}>
          <div className="mt-10 sm:mt-14 flex items-center gap-3 cursor-pointer group">
            <a href="#showreel" className="flex items-center gap-3 group/link">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/20 flex items-center justify-center group-hover/link:border-accent/50 transition-colors">
                <motion.div
                  animate={{ y: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-white/60 group-hover/link:text-accent transition-colors">
                    <path d="M7 1v12M1 7l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>
              </div>
              <span className="font-oswald text-[10px] sm:text-xs tracking-ultra-wide uppercase text-white/40 group-hover/link:text-white/70 transition-colors">
                Scroll to Explore
              </span>
            </a>
          </div>
        </FadeInWhenVisible>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  SHOWREEL SECTION                                                  */
/* ------------------------------------------------------------------ */

function ShowreelSection() {
  const [showFullscreen, setShowFullscreen] = useState(false);
  const fullscreenVideoRef = useRef<HTMLVideoElement | null>(null);
  const previewVideoRef = useRef<HTMLVideoElement | null>(null);
  const MAX_DURATION = 120;

  useEffect(() => {
    const video = previewVideoRef.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {});
  }, []);

  useEffect(() => {
    const video = fullscreenVideoRef.current;
    if (!video || !showFullscreen) return;

    video.currentTime = 0;
    video.play();

    const checkTime = () => {
      if (video.currentTime >= MAX_DURATION) {
        video.pause();
        video.currentTime = 0;
        setShowFullscreen(false);
      }
    };

    video.addEventListener('timeupdate', checkTime);
    return () => video.removeEventListener('timeupdate', checkTime);
  }, [showFullscreen]);

  return (
    <>
      <section id="showreel" className="relative py-20 sm:py-28 lg:py-36">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <FadeInWhenVisible>
            <div
              onClick={() => setShowFullscreen(true)}
              className="relative w-full aspect-video max-h-[70vh] rounded-sm overflow-hidden bg-[#111] group cursor-pointer"
            >
              <video
                key="preview-video"
                ref={previewVideoRef}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                crossOrigin="anonymous"
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source src="https://res.cloudinary.com/cxbbvqvr/video/upload/v1785418606/SSMT_ads_1_1_q3zral.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/70 to-[#0a0a0a]/40" />

              <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.96 }}
                  className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full bg-accent flex items-center justify-center mb-6 sm:mb-8 group-hover:shadow-[0_0_60px_rgba(255,215,0,0.3)] transition-shadow duration-500"
                >
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="ml-1">
                    <path d="M10 6.5L22 14L10 21.5V6.5Z" fill="#0a0a0a" />
                  </svg>
                </motion.div>
                <span className="font-oswald text-xl sm:text-2xl lg:text-3xl font-bold uppercase tracking-wider">
                  Play Showreel
                </span>
                <span className="font-inter text-[10px] sm:text-xs text-accent/70 tracking-wide-custom uppercase mt-2">
                  2 Minutes of Pure Adrenaline
                </span>
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>

      <AnimatePresence>
        {showFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl"
            onClick={() => setShowFullscreen(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative w-full max-w-[95vw] max-h-[95vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                ref={fullscreenVideoRef}
                autoPlay
                muted
                playsInline
                preload="metadata"
                crossOrigin="anonymous"
                className="w-full h-full rounded-lg shadow-2xl"
                style={{ maxHeight: '90vh' }}
              >
                <source src="https://res.cloudinary.com/cxbbvqvr/video/upload/v1785418606/SSMT_ads_1_1_q3zral.mp4" type="video/mp4" />
              </video>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.3 }}
                onClick={() => setShowFullscreen(false)}
                className="absolute -top-10 right-0 sm:-top-12 sm:right-0 text-white/60 hover:text-white transition-colors p-2 z-20"
              >
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M6 6l16 16M22 6L6 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  SERVICES SECTION                                                  */
/* ------------------------------------------------------------------ */

const services = [
  {
    num: '01',
    title: 'VIDEO PRODUCTION',
    description:
      'We turn your ideas into high-quality videos that tell your story and capture attention .',
    tags: 'COMMERCIALS / BRAND FILMS',
  },
  {
    num: '02',
    title: 'CREATIVE DIRECTION',
    description:
      'We guide the vision, style, and concept to make sure your project looks and feels unique.',
    tags: 'CONCEPT / STORYBOARDS',
  },
  {
    num: '03',
    title: 'PHOTOGRAPHY & VIDEOGRAPHY',
    description:
      'Professional camera and lighting setups to capture stunning photos and video for any occasion.',
    tags: 'HIGH-END GEAR / LIGHTING',
  },
  {
    num: '04',
    title: 'PROFESSIONAL EDITING',
    description:
      'We clean, cut, and color-grade your raw footage into smooth, polished videos.',
    tags: 'DAVINCI RESOLVE / EDITING',
  },
  {
    num: '05',
    title: 'REELS & SOCIAL CONTENT',
    description:
      'Fast, trendy vertical videos designed to stop people from scrolling on TikTok and Instagram.',
    tags: 'VERTICAL VIDEO / REELS',
  },
  {
    num: '06',
    title: 'BRANDING CONTENT',
    description:
      'Tailored visual packages that make your brand look professional and consistent everywhere online.',
    tags: 'BRAND ASSETS / MEDIA',
  },
];

function ServicesSection() {
  return (
    <section id="services" className="relative py-20 sm:py-28 lg:py-36">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="text-center mb-14 sm:mb-20">
          <FadeInWhenVisible>
            <SectionLabel text="Core Disciplines" />
          </FadeInWhenVisible>
          <FadeInWhenVisible delay={0.1}>
            <SectionHeading>
              We don&apos;t just point and shoot.{' '}
              <span className="text-accent-outline">We architect every frame.</span>
            </SectionHeading>
          </FadeInWhenVisible>
        </div>

        <div className="space-y-0">
          {services.map((svc, i) => (
            <FadeInWhenVisible key={svc.num} delay={0.1 + i * 0.1}>
              <div className="group border-t border-white/5 py-6 sm:py-7 lg:py-8 first:border-t-0 transition-colors duration-300 hover:bg-white/[0.01]">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start">
                  <div className="lg:col-span-1 flex lg:block items-center gap-3">
                    <span className="font-oswald text-xs sm:text-sm text-accent/50 font-medium">
                      {svc.num}
                    </span>
                  </div>
                  <div className="lg:col-span-3">
                    <h3 className="font-oswald text-base sm:text-lg lg:text-xl font-bold uppercase tracking-wide-custom">
                      {svc.title}
                    </h3>
                  </div>
                  <div className="lg:col-span-5">
                    <p className="text-xs sm:text-sm text-white/45 leading-relaxed">
                      {svc.description}
                    </p>
                  </div>
                  <div className="lg:col-span-3 lg:text-right">
                    <span className="font-mono text-[10px] sm:text-[11px] text-accent/50 tracking-wider uppercase">
                      {svc.tags}
                    </span>
                  </div>
                </div>
              </div>
            </FadeInWhenVisible>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  FEATURED WORK / ARCHIVES                                          */
/* ------------------------------------------------------------------ */

const projects = [
  {
    title: 'LDK',
    category: 'Commercial',
    video: 'https://res.cloudinary.com/cxbbvqvr/video/upload/v1785413750/snackads_qxv8t4.mp4',
    aspect: 'aspect-[4/3] lg:aspect-auto lg:row-span-2 lg:h-full',
    span: 'lg:col-span-2',
  },
  {
    title: 'IS & MALL',
    category: 'Brand Film',
    video: 'https://res.cloudinary.com/cxbbvqvr/video/upload/v1785412893/ismallClothes_ppahuz.mp4',
    aspect: 'aspect-[4/3] lg:aspect-[3/4]',
    span: 'lg:col-span-1',
  },
  {
    title: 'MIAAMAR',
    category: 'Showreel',
    video: 'https://res.cloudinary.com/cxbbvqvr/video/upload/v1785418189/REEL_1_1_lkzet5.mp4',
    aspect: 'aspect-[4/3] lg:aspect-[3/4]',
    span: 'lg:col-span-1',
  },
];

function ProjectCard({ project, index }: { project: (typeof projects)[0]; index: number }) {
  const previewRef = useRef<HTMLVideoElement | null>(null);
  const fullscreenRef = useRef<HTMLVideoElement | null>(null);
  const [showFullscreen, setShowFullscreen] = useState(false);

  useEffect(() => {
    const video = previewRef.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {});
  }, [project.video]);

  useEffect(() => {
    const video = fullscreenRef.current;
    if (!video || !showFullscreen) return;
    video.currentTime = 0;
    video.play().catch(() => {});
  }, [showFullscreen]);

  return (
    <>
      <FadeInWhenVisible delay={0.15 + index * 0.15}>
        <div
          onClick={() => setShowFullscreen(true)}
          className={`group relative ${project.aspect} ${project.span} rounded-sm overflow-hidden cursor-pointer bg-[#111]`}
        >
          <video
            ref={previewRef}
            key={project.video}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            crossOrigin="anonymous"
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={project.video} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/70" />

          <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-7 lg:p-8 z-10">
            <h3 className="font-oswald text-xl sm:text-2xl lg:text-3xl font-bold uppercase tracking-wide-custom">
              {project.title}
            </h3>
            <span className="font-inter text-[11px] sm:text-xs text-accent/60 tracking-wide-custom uppercase mt-1.5">
              {project.category}
            </span>
          </div>

          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:border-accent/50 z-10">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-white/70 group-hover:text-accent transition-colors">
              <path d="M1 13L13 1M13 1H3M13 1V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </FadeInWhenVisible>

      <AnimatePresence>
        {showFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl"
            onClick={() => setShowFullscreen(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative w-full max-w-[95vw] max-h-[95vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                ref={fullscreenRef}
                key={`fullscreen-${project.video}`}
                autoPlay
                muted
                playsInline
                preload="metadata"
                crossOrigin="anonymous"
                className="w-full h-full rounded-lg shadow-2xl"
                style={{ maxHeight: '90vh' }}
              >
                <source src={project.video} type="video/mp4" />
              </video>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.3 }}
                onClick={() => setShowFullscreen(false)}
                className="absolute -top-10 right-0 sm:-top-12 sm:right-0 text-white/60 hover:text-white transition-colors p-2 z-20"
              >
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M6 6l16 16M22 6L6 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function FeaturedWorkSection() {
  return (
    <section id="work" className="relative py-20 sm:py-28 lg:py-36">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12 sm:mb-16">
          <div>
            <FadeInWhenVisible>
              <SectionLabel text="Featured Work" />
            </FadeInWhenVisible>
            <FadeInWhenVisible delay={0.1}>
              <SectionHeading>The Archives</SectionHeading>
            </FadeInWhenVisible>
          </div>
          <FadeInWhenVisible delay={0.15}>
            <a href="#contact" className="font-oswald text-[11px] sm:text-xs tracking-ultra-wide uppercase text-white/40 hover:text-accent transition-colors flex items-center gap-2 shrink-0">
              View All Projects
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 13L13 1M13 1H3M13 1V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </FadeInWhenVisible>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  METHODOLOGY SECTION                                               */
/* ------------------------------------------------------------------ */

const steps = [
  {
    num: '01',
    title: 'Pre-Production / Scouting',
    description:
      'Every great shot begins long before the camera rolls. We map locations, study light cycles, and develop detailed shot lists that eliminate guesswork and maximize creative potential on shoot day.',
  },
  {
    num: '02',
    title: 'The Shoot / Execution',
    description:
      'Armed with cinema-grade rigs and aerial platforms, our crew executes with surgical precision. Every angle, every lens choice, every movement is orchestrated to serve the story.',
  },
  {
    num: '03',
    title: 'The Cut / Final Polish',
    description:
      'In the editing suite, raw footage becomes art. Color grading, sound design, motion graphics — we layer every element until the final piece hits with unmistakable impact.',
  },
];

function MethodologySection() {
  return (
    <section id="methodology" className="relative py-20 sm:py-28 lg:py-36 gradient-glow-right">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="text-center mb-14 sm:mb-20">
          <FadeInWhenVisible>
            <SectionLabel text="The Methodology" />
          </FadeInWhenVisible>
          <FadeInWhenVisible delay={0.1}>
            <SectionHeading>Systematic Creativity</SectionHeading>
          </FadeInWhenVisible>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step, i) => (
            <FadeInWhenVisible key={step.num} delay={0.15 + i * 0.15}>
              <div className="relative bg-white/[0.02] border border-white/5 rounded-sm p-8 sm:p-10 h-full group hover:border-accent/10 hover:bg-white/[0.04] transition-all duration-500">
                <span className="absolute top-0 right-0 font-oswald text-[6rem] sm:text-[7rem] font-bold text-white/[0.03] leading-none select-none pointer-events-none">
                  {step.num}
                </span>
                <span className="font-oswald text-xs text-accent/50 font-medium mb-4 block relative z-10">
                  STEP {step.num}
                </span>
                <h3 className="font-oswald text-lg sm:text-xl font-bold uppercase tracking-wide-custom mb-4 relative z-10">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-[15px] text-white/40 leading-relaxed relative z-10">
                  {step.description}
                </p>
              </div>
            </FadeInWhenVisible>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  IMAGE CAROUSEL                                                    */
/* ------------------------------------------------------------------ */

const carouselImages = [
  { src: '/videos/POST%203.jpg.jpeg', alt: 'POST 3' },
  { src: '/Artboard%201.jpg.jpeg', alt: 'Artboard 1' },
];

function ImageCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const goTo = (index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  const goNext = () => {
    const next = (current + 1) % carouselImages.length;
    setDirection(1);
    setCurrent(next);
  };

  const goPrev = () => {
    const prev = (current - 1 + carouselImages.length) % carouselImages.length;
    setDirection(-1);
    setCurrent(prev);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      goNext();
    }, 4000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -200 : 200, opacity: 0 }),
  };

  return (
    <div className="relative w-full max-w-lg mx-auto px-1">
      <div
        className="relative w-full rounded-sm bg-[#0a0a0a] p-[3px] select-none"
        style={{ aspectRatio: '4/5' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="absolute inset-0 pointer-events-none z-10" style={{ boxShadow: 'inset 0 0 0 1px rgba(255,215,0,0.15), inset 0 0 30px rgba(0,0,0,0.5)' }} />
        <div className="relative w-full h-full overflow-hidden rounded-[1px] bg-black">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute inset-0"
            >
              <Image
                src={carouselImages[current].src}
                alt={carouselImages[current].alt}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)' }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-0 left-0 right-0 h-9 sm:h-10 bg-gradient-to-t from-black/80 to-transparent z-10 flex items-end justify-between px-3 sm:px-4 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent/80" />
              <span className="font-oswald text-[9px] sm:text-[10px] tracking-ultra-wide uppercase text-white/40">
                Frame {current + 1}/{carouselImages.length}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {carouselImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`transition-all duration-300 rounded-full ${i === current
                    ? 'w-4 h-1 bg-accent shadow-[0_0_6px_rgba(255,215,0,0.4)]'
                    : 'w-1 h-1 bg-white/20 hover:bg-white/40'
                    }`}
                  aria-label={`Frame ${i + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex items-center gap-1.5 z-10">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="font-mono text-[8px] sm:text-[9px] text-white/30 tracking-widest uppercase">CINEMATIC</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ABOUT / STUDIO SECTION                                            */
/* ------------------------------------------------------------------ */

function AboutSection() {
  return (
    <section id="about" className="relative py-20 sm:py-28 lg:py-36">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center">
          <div>
            <FadeInWhenVisible>
              <SectionLabel text="SPECIALIZED STUDIO" />
            </FadeInWhenVisible>
            <FadeInWhenVisible delay={0.1}>
              <SectionHeading className="mb-6 sm:mb-8">
                We are the{' '}
                <span className="text-accent-outline">bridge</span>{' '}
                between technical mastery and cinematic artistry.
              </SectionHeading>
            </FadeInWhenVisible>
            <FadeInWhenVisible delay={0.2}>
              <p className="text-sm sm:text-[15px] text-white/45 leading-relaxed mb-5">
                PRODYOUS is not an agency — it&apos;s a specialized unit.
                We deliver professional solutions in photography, video production,
                editing, and visual identity management — creating social media content with full focus on quality, precision, and creativity in every detail.
              </p>
            </FadeInWhenVisible>
            <FadeInWhenVisible delay={0.25}>
              <p className="text-sm sm:text-[15px] text-white/45 leading-relaxed mb-10 sm:mb-14">
                From Fortune 500 brands to ambitious startups, every client gets the same
                obsessive attention to detail, the same cinema-grade equipment, and the same
                relentless pursuit of the perfect shot.
              </p>
            </FadeInWhenVisible>

            <FadeInWhenVisible delay={0.3}>
              <div className="flex gap-10 sm:gap-14 lg:gap-16">
                <div>
                  <span className="font-oswald text-3xl sm:text-4xl lg:text-5xl font-bold">400+</span>
                  <p className="font-oswald text-[10px] sm:text-xs text-white/40 tracking-ultra-wide uppercase mt-1.5">
                    Projects Delivered
                  </p>
                </div>
                <div>
                  <span className="font-oswald text-3xl sm:text-4xl lg:text-5xl font-bold text-accent">4K</span>
                  <p className="font-oswald text-[10px] sm:text-xs text-white/40 tracking-ultra-wide uppercase mt-1.5">
                    Resolution Standard
                  </p>
                </div>
              </div>
            </FadeInWhenVisible>
          </div>

          <FadeInWhenVisible delay={0.2} direction="left">
            <ImageCarousel />
          </FadeInWhenVisible>
        </div>

        <div className="mt-16 sm:mt-20 lg:mt-24 pt-12 sm:pt-16 lg:pt-20 border-t border-white/5">
          <div dir="rtl" className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center">
            <div dir="rtl">
              <FadeInWhenVisible>
                <span className="inline-block font-arabic text-accent text-[11px] sm:text-xs tracking-ultra-wide uppercase mb-4 sm:mb-6">
                  الاستوديو المتخصص
                </span>
              </FadeInWhenVisible>
              <FadeInWhenVisible delay={0.1}>
                <h2 className="font-arabic text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] font-bold leading-[1.2] mb-6 sm:mb-8">
                  نحن <span className="text-accent-outline">الجسر</span> بين الإتقان التقني والفن السينمائي
                </h2>
              </FadeInWhenVisible>
              <FadeInWhenVisible delay={0.2}>
                <p className="font-arabic text-sm sm:text-[15px] text-white/45 leading-relaxed mb-5">
                  بروديوس ليست مجرد وكالة — إنها وحدة متخصصة. نقدم حلولاً احترافية في التصوير الفوتوغرافي،
                  وإنتاج الفيديو، والمونتاج، وإدارة الهوية البصرية — لنصنع محتوى لوسائل التواصل الاجتماعي
                  بتركيز كامل على الجودة والدقة والإبداع في كل تفصيل.
                </p>
              </FadeInWhenVisible>
              <FadeInWhenVisible delay={0.25}>
                <p className="font-arabic text-sm sm:text-[15px] text-white/45 leading-relaxed mb-10 sm:mb-14">
                  من العلامات التجارية الكبرى إلى الشركات الناشئة الطموحة — كل عميل يحصل على نفس الاهتمام
                  المهووس بالتفاصيل، ونفس المعدات السينمائية، ونفس السعي الدؤوب للحصول على اللقطة المثالية.
                </p>
              </FadeInWhenVisible>
              <FadeInWhenVisible delay={0.3}>
                <div className="flex gap-10 sm:gap-14 lg:gap-16">
                  <div>
                    <span className="font-arabic text-3xl sm:text-4xl lg:text-5xl font-bold">٤٠٠+</span>
                    <p className="font-arabic text-[10px] sm:text-xs text-white/40 mt-1.5">
                      مشروع منجز
                    </p>
                  </div>
                  <div>
                    <span className="font-arabic text-3xl sm:text-4xl lg:text-5xl font-bold text-accent-outline">4K</span>
                    <p className="font-arabic text-[10px] sm:text-xs text-white/40 mt-1.5">
                      دقة التصوير
                    </p>
                  </div>
                </div>
              </FadeInWhenVisible>
            </div>

            <div>
              <FadeInWhenVisible>
                <ImageCarousel />
              </FadeInWhenVisible>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  CONTACT SECTION                                                   */
/* ------------------------------------------------------------------ */

function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="relative py-20 sm:py-28 lg:py-36 gradient-glow noise-overlay">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20">
          <div>
            <FadeInWhenVisible>
              <h2 className="font-oswald text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold uppercase leading-[1]">
                Start The
              </h2>
            </FadeInWhenVisible>
            <FadeInWhenVisible delay={0.1}>
              <h2 className="font-oswald text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold uppercase leading-[1] text-accent-outline italic mt-1">
                Production
              </h2>
            </FadeInWhenVisible>
            <FadeInWhenVisible delay={0.2}>
              <p className="mt-6 sm:mt-8 text-sm sm:text-[15px] text-white/45 leading-relaxed max-w-md">
                Ready to elevate your brand with cinematic content? Tell us about your vision
                and let&apos;s build something extraordinary together.
              </p>
            </FadeInWhenVisible>
            <FadeInWhenVisible delay={0.3}>
              <div className="mt-10 sm:mt-12 space-y-5">
                <div>
                  <span className="font-oswald text-[10px] sm:text-xs text-accent/50 tracking-ultra-wide uppercase block mb-1.5">
                    Direct Line
                  </span>
                  <a href="mailto:director@prodyous.com" className="text-sm sm:text-[15px] text-white/70 hover:text-accent transition-colors">
                    director@prodyous.com
                  </a>
                </div>
                <div>
                  <span className="font-oswald text-[10px] sm:text-xs text-accent/50 tracking-ultra-wide uppercase block mb-1.5">
                    Base of Operations
                  </span>
                  <span className="text-sm sm:text-[15px] text-white/70">
                    Available Worldwide
                  </span>
                </div>
              </div>
            </FadeInWhenVisible>
          </div>

          <FadeInWhenVisible delay={0.2} direction="left">
            <div className="bg-[#111]/60 backdrop-blur-sm border border-white/5 rounded-sm p-5 sm:p-9 lg:p-10">
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <div>
                  <label className="font-oswald text-[10px] sm:text-xs tracking-ultra-wide uppercase text-white/40 block mb-2">
                    Name / Company
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full bg-white/[0.04] border border-white/8 rounded-sm px-4 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-accent/40 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="font-oswald text-[10px] sm:text-xs tracking-ultra-wide uppercase text-white/40 block mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@company.com"
                    className="w-full bg-white/[0.04] border border-white/8 rounded-sm px-4 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-accent/40 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="font-oswald text-[10px] sm:text-xs tracking-ultra-wide uppercase text-white/40 block mb-2">
                    Project Scope
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about the vision..."
                    rows={4}
                    className="w-full bg-white/[0.04] border border-white/8 rounded-sm px-4 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-accent/40 transition-colors resize-none"
                    required
                  />
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full bg-white text-[#0a0a0a] font-oswald text-xs sm:text-sm tracking-ultra-wide uppercase font-semibold py-4 rounded-sm flex items-center justify-center gap-3 hover:bg-accent transition-colors duration-300"
                >
                  {submitted ? (
                    <span>Message Sent</span>
                  ) : (
                    <>
                      <span>Submit Inquiry</span>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M1 13L13 1M13 1H3M13 1V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </FadeInWhenVisible>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  LOCATION SECTION                                                  */
/* ------------------------------------------------------------------ */

const mapUrl = 'https://www.google.com/maps?q=PHOTOGRAPHE+AGADIR+PRODYOUS&output=embed';
const mapLink = 'https://www.google.com/maps/search/?api=1&query=PHOTOGRAPHE+AGADIR+PRODYOUS';

function LocationSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section ref={sectionRef} className="relative py-20 sm:py-28 lg:py-36 overflow-hidden">
      <div className="absolute inset-0 gradient-glow pointer-events-none opacity-60" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/5 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <FadeInWhenVisible>
          <SectionLabel text="Find Us" />
        </FadeInWhenVisible>
        <FadeInWhenVisible delay={0.1}>
          <SectionHeading className="mb-4">
            Our <span className="text-accent-outline">Studio</span>
          </SectionHeading>
        </FadeInWhenVisible>
        <FadeInWhenVisible delay={0.15}>
          <p className="font-arabic text-sm sm:text-[15px] text-white/40 leading-relaxed max-w-xl mb-2">
            في قلب أكادير — مستعدون لالتقاط قصتك أينما كنت
          </p>
        </FadeInWhenVisible>
        <FadeInWhenVisible delay={0.18}>
          <p className="text-sm sm:text-[15px] text-white/40 leading-relaxed max-w-xl mb-10 sm:mb-14">
            Based in the heart of Agadir — ready to capture your story wherever it takes us.
          </p>
        </FadeInWhenVisible>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative group"
        >
          <div className="relative rounded-sm overflow-hidden bg-[#0a0a0a] p-[2px]"
            style={{ boxShadow: '0 0 0 1px rgba(255,215,0,0.08), 0 30px 80px rgba(0,0,0,0.6), 0 0 60px rgba(255,215,0,0.03)' }}
          >
            <div className="relative w-full aspect-[4/3] lg:aspect-[21/9]">
              <iframe
                src={mapUrl}
                className="absolute inset-0 w-full h-full"
                style={{ filter: 'grayscale(0.7) sepia(0.15) hue-rotate(160deg) saturate(0.4) brightness(0.45) contrast(1.3)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="PRODYOUS Studio Location"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a] pointer-events-none" />

              <div className="absolute inset-0" style={{
                background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(10,10,10,0.6) 100%)',
                pointerEvents: 'none',
              }} />

              <div className="absolute inset-0" style={{
                background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.01) 3px, rgba(255,255,255,0.01) 4px)',
                pointerEvents: 'none',
              }} />

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="absolute top-6 sm:top-8 lg:top-10 left-6 sm:left-8 lg:left-10 z-10"
              >
                <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md rounded-full px-4 py-2 border border-white/5">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_10px_rgba(255,215,0,0.5)]" />
                  <span className="font-mono text-[9px] sm:text-[10px] text-white/50 tracking-[0.2em] uppercase">
                    LIVE • AGADIR
                  </span>
                </div>
              </motion.div>

              <div className="absolute bottom-0 left-0 right-0 z-20 flex items-end justify-center pb-2 sm:pb-6 lg:pb-8 px-3 sm:px-6">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="w-full max-w-lg"
                >
                  <div className="bg-black/60 backdrop-blur-xl rounded-sm border border-white/5 p-2 sm:p-5 lg:p-6"
                    style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)' }}
                  >
                    <div className="flex items-start gap-2 sm:gap-4">
                      <div className="hidden sm:flex w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 mt-0.5"
                        style={{ boxShadow: '0 0 20px rgba(255,215,0,0.1)' }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="sm:w-[20px] sm:h-[20px]">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-1 sm:gap-2">
                          <div>
                            <h3 className="font-oswald text-[10px] sm:text-sm font-bold uppercase tracking-wide-custom">
                              PRODYOUS Studio
                            </h3>
                            <p className="font-arabic text-[8px] sm:text-xs text-white/40 mt-0.5 hidden xs:block">
                              أكادير، المغرب — PHOTOGRAPHE AGADIR (PRODYOUS)
                            </p>
                          </div>
                          <a
                            href={mapLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 font-oswald text-[9px] sm:text-[10px] tracking-ultra-wide uppercase text-accent hover:text-white transition-colors duration-300 group shrink-0"
                          >
                            <span>Open Maps</span>
                            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" className="group-hover:translate-x-0.5 transition-transform">
                              <path d="M1 13L13 1M13 1H3M13 1V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="absolute top-6 sm:top-8 lg:top-10 right-6 sm:right-8 lg:right-10 z-10 opacity-40">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-[40px] sm:h-[40px]">
                  <circle cx="16" cy="16" r="15" stroke="rgba(255,215,0,0.3)" strokeWidth="0.5" />
                  <circle cx="16" cy="16" r="10" stroke="rgba(255,215,0,0.2)" strokeWidth="0.5" />
                  <circle cx="16" cy="16" r="5" stroke="rgba(255,215,0,0.15)" strokeWidth="0.5" />
                  <path d="M16 1V5M16 27V31M1 16H5M27 16H31" stroke="rgba(255,215,0,0.3)" strokeWidth="0.5" />
                  <circle cx="16" cy="16" r="2" fill="rgba(255,215,0,0.15)" />
                </svg>
              </div>

              <div className="absolute bottom-6 sm:bottom-8 lg:bottom-10 right-6 sm:right-8 lg:right-10 z-10 opacity-30">
                <div className="font-mono text-[8px] sm:text-[9px] text-white/30 tracking-[0.3em] uppercase leading-relaxed text-right">
                  <div>30°24&apos;N</div>
                  <div>9°36&apos;W</div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-4 -right-4 w-32 h-32 sm:w-40 sm:h-40 border border-accent/5 rounded-sm pointer-events-none -z-10" />
          <div className="absolute -top-4 -left-4 w-24 h-24 sm:w-32 sm:h-32 border border-accent/5 rounded-sm pointer-events-none -z-10" />
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  FOOTER                                                            */
/* ------------------------------------------------------------------ */

function Footer() {
  return (
    <footer className="relative border-t border-white/5 pt-8 sm:pt-12 pb-5 sm:pb-6 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="font-oswald text-[8rem] sm:text-[12rem] lg:text-[18rem] font-bold text-white/[0.015] uppercase whitespace-nowrap tracking-widest">
          PRODYOUS
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-white/10">
              <Image src="/logo.jpg" alt="PRODYOUS" fill className="object-cover" />
            </div>
            <div>
              <span className="font-oswald text-sm sm:text-base font-semibold tracking-wide-custom uppercase block">
                Prodyous
              </span>
              <span className="font-inter text-[10px] text-white/30 tracking-wider uppercase">
                Cinematic Studio
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-end flex-wrap gap-x-5 gap-y-2 sm:gap-x-8">
            {[
              { name: 'Instagram', url: 'https://instagram.com/prodyous' },
              { name: 'Facebook', url: 'https://web.facebook.com/prodyous/?ref=PROFILE_EDIT_xav_ig_profile_page_web#' },
              { name: 'WhatsApp', url: 'https://wa.me/212706801105' },
            ].map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-oswald text-[10px] sm:text-xs tracking-ultra-wide uppercase text-white/40 hover:text-accent transition-colors"
              >
                {social.name}
              </a>
            ))}
          </div>
        </div>

        <div className="line-gradient mb-4 sm:mb-5" />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <span className="font-inter text-[11px] text-white/20">
            &copy; {new Date().getFullYear()} PRODYOUS. All rights reserved.
          </span>
          <div className="flex gap-5">
            <a href="#" className="font-inter text-[11px] text-white/20 hover:text-white/40 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="font-inter text-[11px] text-white/20 hover:text-white/40 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN PAGE                                                         */
/* ------------------------------------------------------------------ */

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <CustomCursor />
      <Navbar />
      <HeroSection />
      <ShowreelSection />
      <ServicesSection />
      <FeaturedWorkSection />
      <MethodologySection />
      <AboutSection />
      <LocationSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
