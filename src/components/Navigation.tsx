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

const DESKTOP_MQ = "(min-width: 768px)";

export default function Navigation() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("");
    const [isBlurLoaded, setIsBlurLoaded] = useState(false);

    // ── Track whether we are on desktop (>= 768 px) ──
    // layoutId animations on hidden (display:none) desktop nav items cause
    // framer-motion to call scrollTo(0,0) during measurement.  We only
    // render the shared layoutId indicator when the desktop nav is visible.
    const [isDesktop, setIsDesktop] = useState(() =>
        typeof window !== "undefined"
            ? window.matchMedia(DESKTOP_MQ).matches
            : true,
    );

    useEffect(() => {
        const mql = window.matchMedia(DESKTOP_MQ);
        const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
        mql.addEventListener("change", onChange);
        return () => mql.removeEventListener("change", onChange);
    }, []);

    // Apply glass effect after nav entrance animation completes
    useEffect(() => {
        const timer = setTimeout(() => setIsBlurLoaded(true), 500);
        return () => clearTimeout(timer);
    }, []);

    // ── Scroll-spy logic ──
    useEffect(() => {
        const sectionIds = navLinks.map((link) => link.href.replace("#", ""));

        const handleScroll = () => {
            const scrollY = window.scrollY;
            setIsScrolled(scrollY > 50);

            // At top → Home
            if (scrollY < 50) {
                setActiveSection("");
                return;
            }

            // Use getBoundingClientRect for reliable detection regardless
            // of lazy-load state or image loading affecting offsetTop.
            const triggerLine = window.innerHeight * 0.35;

            // At bottom → last section (Contact)
            // Only if the contact section is actually rendered and visible.
            const atBottom =
                window.innerHeight + scrollY >=
                document.documentElement.scrollHeight - 50;

            if (atBottom) {
                const contactEl = document.getElementById("contact");
                if (
                    contactEl &&
                    contactEl.getBoundingClientRect().top < window.innerHeight
                ) {
                    setActiveSection("contact");
                    return;
                }
            }

            // Walk sections top-to-bottom; pick the last one whose top has
            // scrolled past the trigger line (i.e. rect.top <= triggerLine).
            let closest = "";
            for (const id of sectionIds) {
                const el = document.getElementById(id);
                if (!el) continue;
                const rect = el.getBoundingClientRect();
                if (rect.top <= triggerLine) {
                    closest = id;
                }
            }
            if (closest) {
                setActiveSection(closest);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });

        // ── Run detection on mount so the active section matches the
        // current scroll position (handles reload / scroll-restore). ──
        // We use rAF + short delay to let lazy-loaded Suspense children
        // and images settle before the first measurement.
        const initialRaf = requestAnimationFrame(() => {
            handleScroll();
        });

        // Also re-detect when page height changes (lazy components
        // loading, images finishing, etc.) via ResizeObserver.
        let resizeObserver: ResizeObserver | null = null;
        if (typeof ResizeObserver !== "undefined") {
            resizeObserver = new ResizeObserver(() => {
                handleScroll();
            });
            resizeObserver.observe(document.documentElement);
        }

        return () => {
            window.removeEventListener("scroll", handleScroll);
            cancelAnimationFrame(initialRaf);
            resizeObserver?.disconnect();
        };
    }, []);

    const handleNavClick = (
        e: React.MouseEvent<HTMLAnchorElement>,
        href: string,
    ) => {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const navHeight = 30;
            // Capture position before any layout changes
            const targetPosition =
                target.getBoundingClientRect().top + window.scrollY - navHeight;

            // Close mobile menu (triggers AnimatePresence exit)
            setIsMobileMenuOpen(false);

            // framer-motion's measureAllKeyframes calls scrollTo(0,0)
            // synchronously during React's commit / AnimatePresence exit.
            // A double-rAF guarantees we fire AFTER that batch completes,
            // so our smooth scroll is never overridden.
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    window.scrollTo({
                        top: targetPosition,
                        behavior: "smooth",
                    });
                });
            });

            if (href === "#") {
                setActiveSection("");
            }
        } else {
            setIsMobileMenuOpen(false);
        }
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
            transition={{ duration: 0.7, ease: "easeOut" }}
            className={`${styles.nav} ${isBlurLoaded ? "glass" : ""} ${isScrolled ? styles.navScrolled : ""}`}
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
                            {isHomeActive && isDesktop && (
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
                                    {isActive && isDesktop && (
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
                            href="/assets/download/CV-Gabriel_Gomes-Software_Engineer.pdf"
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
                            href="/assets/download/CV-Gabriel_Gomes-Software_Engineer.pdf"
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
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className={styles.mobileMenu}
                        style={{ overflow: "hidden" }}
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
