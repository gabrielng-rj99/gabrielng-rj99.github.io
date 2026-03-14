import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenuAlt3, HiX, HiDownload } from "react-icons/hi";
import ThemeToggle from "./ThemeToggle";
import styles from "./Navigation.module.css";

const navLinks = [
    { label: "About", href: "#about-me" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Experience", href: "#experience" },
    { label: "Certs", href: "#certifications" },
    { label: "Education", href: "#education" },
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
            if (
                window.innerHeight + window.scrollY >=
                document.documentElement.scrollHeight - 50
            ) {
                setActiveSection("contact");
            }
            // Forcehome "" active when at top (before hero ends)
            else if (window.scrollY < 300) {
                setActiveSection("");
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Track active section via IntersectionObserver
    useEffect(() => {
        const sectionIds = navLinks.map((link) => link.href.replace("#", ""));
        const observers: IntersectionObserver[] = [];

        // Don't set About as active when hero is visible
        const heroEl = document.getElementById("hero");
        let heroVisible = true;

        if (heroEl) {
            const heroObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        heroVisible = entry.isIntersecting;
                        // If hero is visible, don't mark About as active
                        if (heroVisible) {
                            setActiveSection("");
                        }
                    });
                },
                { rootMargin: "0px 0px -70% 0px", threshold: 0 },
            );
            heroObserver.observe(heroEl);
            observers.push(heroObserver);
        }

        sectionIds.forEach((id) => {
            const el = document.getElementById(id);
            if (!el) return;

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        // Don't mark About when hero is still visible
                        if (id === "#" && heroVisible) {
                            return;
                        }
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
            const navHeight = window.innerWidth >= 768 ? 30 : 30;
            const targetPosition =
                target.getBoundingClientRect().top + window.scrollY - navHeight;
            window.scrollTo({ top: targetPosition, behavior: "smooth" });
            // For Home link, set activeSection to empty to show it's active
            if (href === "#") {
                setActiveSection("");
            }
        }
        setIsMobileMenuOpen(false);
    };

    // Check if Home should be active (when at top of page)
    const isHomeActive =
        activeSection === "" &&
        typeof window !== "undefined" &&
        window.scrollY < 300;

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`${styles.nav} glass ${isScrolled ? styles.navScrolled : ""}`}
        >
            <div className={styles.navContainer}>
                {/* Use a simple CSS Grid with 3 equal columns for perfect centering */}
                <div className={styles.navGrid}>
                    {/* Column 1: Logo / Home */}
                    <div className={styles.navHome}>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                window.scrollTo({ top: 0, behavior: "smooth" });
                                setIsMobileMenuOpen(false);
                            }}
                            className={`${styles.logo} ${isHomeActive ? styles.navItemActive : ""}`}
                        >
                            Home
                            {isHomeActive && (
                                <motion.span
                                    layoutId="nav-indicator"
                                    className={styles.navIndicator}
                                    transition={{
                                        type: "spring",
                                        stiffness: 350,
                                        damping: 30,
                                    }}
                                />
                            )}
                        </a>
                    </div>

                    {/* Column 2: Centered Nav Links (Desktop) */}
                    <div className={styles.navLinks}>
                        {navLinks.map((link) => {
                            const sectionId = link.href.replace("#", "");
                            const isActive = activeSection === sectionId;

                            return (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={(e) =>
                                        handleNavClick(e, link.href)
                                    }
                                    className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
                                >
                                    {link.label}
                                    {isActive && (
                                        <motion.span
                                            layoutId="nav-indicator"
                                            className={styles.navIndicator}
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
                    <div className={styles.navTools}>
                        <a
                            href="/assets/download/Gabriel-Gomes_Curriculum-En.pdf"
                            download
                            className={styles.downloadBtn}
                            title="Download CV"
                            aria-label="Download curriculum"
                        >
                            <HiDownload size={16} />
                            <span>CV</span>
                        </a>

                        <div className={styles.themeToggle}>
                            <ThemeToggle />
                        </div>
                    </div>

                    {/* Mobile: Tools + Hamburger */}
                    <div className={styles.mobileTools}>
                        <a
                            href="/assets/download/Gabriel-Gomes_Curriculum-En.pdf"
                            download
                            className={styles.downloadBtn}
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
                            className={styles.menuToggle}
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
                        className={styles.mobileMenu}
                    >
                        <div className={styles.mobileMenuContent}>
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
                                        className={`${styles.mobileNavItem} ${isActive ? styles.mobileNavItemActive : ""}`}
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
