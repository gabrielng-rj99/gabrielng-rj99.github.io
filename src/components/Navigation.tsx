import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenuAlt3, HiX, HiDownload } from "react-icons/hi";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
    { label: "About", href: "#about" },
    { label: "Experience", href: "#experience" },
    { label: "Certs", href: "#certifications" },
    { label: "Skills", href: "#skills" },
    { label: "Education", href: "#education" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Contact", href: "#contact" },
];

export default function Navigation() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("");

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);

            // Force contact as active if user scrolled to the absolute bottom
            if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50) {
                setActiveSection("contact");
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Track active section via IntersectionObserver
    useEffect(() => {
        const sectionIds = navLinks.map((link) => link.href.replace("#", ""));
        const observers: IntersectionObserver[] = [];

        sectionIds.forEach((id) => {
            const el = document.getElementById(id);
            if (!el) return;

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setActiveSection(id);
                        }
                    });
                },
                { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
            );

            observer.observe(el);
            observers.push(observer);
        });

        return () => observers.forEach((obs) => obs.disconnect());
    }, []);

    const handleNavClick = (
        e: React.MouseEvent<HTMLAnchorElement>,
        href: string,
    ) => {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const navHeight = window.innerWidth >= 768 ? 80 : 64;
            const targetPosition =
                target.getBoundingClientRect().top + window.scrollY - navHeight;
            window.scrollTo({ top: targetPosition, behavior: "smooth" });
        }
        setIsMobileMenuOpen(false);
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`app-nav fixed top-0 left-0 right-0 z-50 w-full flex justify-center transition-all duration-300 ${isScrolled ? "glass shadow-lg" : "bg-transparent"
                }`}
        >
            <div className="app-nav-container w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Use a simple CSS Grid with 3 equal columns for perfect centering */}
                <div className="app-nav-grid grid grid-cols-2 md:grid-cols-3 items-center h-16 md:h-20">

                    {/* Column 1: Logo / Home */}
                    <div className="app-nav-home flex justify-start">
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                window.scrollTo({ top: 0, behavior: "smooth" });
                                setIsMobileMenuOpen(false);
                            }}
                            className="text-lg font-bold tracking-tight no-theme-transition"
                            style={{ color: "var(--accent-purple)" }}
                        >
                            Home
                        </a>
                    </div>

                    {/* Column 2: Centered Nav Links (Desktop) */}
                    <div className="app-nav-links hidden md:flex justify-center gap-4 lg:gap-8">
                        {navLinks.map((link) => {
                            const sectionId = link.href.replace("#", "");
                            const isActive = activeSection === sectionId;

                            return (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={(e) => handleNavClick(e, link.href)}
                                    className={`app-nav-item relative px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 whitespace-nowrap ${isActive
                                        ? "text-accent-purple"
                                        : "text-text-tertiary hover:text-text-primary hover:bg-bg-card-hover"
                                        }`}
                                >
                                    {link.label}
                                    {isActive && (
                                        <motion.span
                                            layoutId="nav-indicator"
                                            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full"
                                            style={{
                                                background: "var(--accent-purple)",
                                            }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 350,
                                                damping: 30,
                                            }}
                                        />
                                    )}
                                </a>
                            );
                        })}
                    </div>

                    {/* Column 3: Right-aligned Tools (Desktop) */}
                    <div className="app-nav-tools hidden md:flex justify-end items-center gap-4">
                        <a
                            href="/assets/download/Gabriel-Gomes_Curriculum-En.pdf"
                            download
                            className="nav-download-btn"
                            title="Download CV"
                            aria-label="Download curriculum"
                        >
                            <HiDownload size={16} />
                            <span>CV</span>
                        </a>

                        <div className="ml-1">
                            <ThemeToggle />
                        </div>
                    </div>

                    {/* Mobile: Tools + Hamburger */}
                    <div className="flex md:hidden justify-end items-center gap-3">
                        <a
                            href="/assets/download/Gabriel-Gomes_Curriculum-En.pdf"
                            download
                            className="nav-download-btn"
                            title="Download CV"
                            aria-label="Download curriculum"
                        >
                            <HiDownload size={14} />
                            <span>CV</span>
                        </a>
                        <ThemeToggle />
                        <button
                            onClick={() =>
                                setIsMobileMenuOpen(!isMobileMenuOpen)
                            }
                            className="p-1 rounded-lg transition-colors"
                            style={{ color: "var(--text-secondary)" }}
                            aria-label="Toggle mobile menu"
                        >
                            {isMobileMenuOpen ? (
                                <HiX size={26} />
                            ) : (
                                <HiMenuAlt3 size={26} />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="md:hidden glass border-t overflow-hidden"
                        style={{ borderColor: "var(--border-primary)" }}
                    >
                        <div className="px-4 py-4 space-y-1">
                            {navLinks.map((link, index) => {
                                const sectionId = link.href.replace("#", "");
                                const isActive = activeSection === sectionId;

                                return (
                                    <motion.a
                                        key={link.href}
                                        href={link.href}
                                        onClick={(e) =>
                                            handleNavClick(e, link.href)
                                        }
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                            ? "text-accent-purple bg-bg-card-hover"
                                            : "text-text-tertiary hover:text-text-primary hover:bg-bg-card-hover"
                                            }`}
                                    >
                                        {link.label}
                                    </motion.a>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
