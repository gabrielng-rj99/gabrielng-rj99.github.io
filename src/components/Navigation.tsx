import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { HiDownload, HiMenuAlt3, HiX } from "react-icons/hi";
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
const SCROLL_THRESHOLD = 500;
const TOP_POSITION_THRESHOLD = 50;
const BOTTOM_MARGIN = 50;
const TRIGGER_LINE_RATIO = 0.5;
const NAV_HEIGHT_OFFSET = 50;
const BLUR_LOAD_DELAY = 500;
const NAV_ENTRANCE_DURATION = 0.7;
const MOBILE_MENU_ITEM_DELAY = 0.05;
const SPRING_TRANSITION = {
    type: "spring" as const,
    stiffness: 350,
    damping: 30,
};
const SCROLL_POS_KEY = "nav-scroll-pos";
const SCROLL_RESTORE_TIMEOUT = 5000;

export default function Navigation() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isBlurLoaded, setIsBlurLoaded] = useState(false);
    const [activeSection, setActiveSection] = useState("");
    const [isDesktop, setIsDesktop] = useState(() =>
        typeof window !== "undefined"
            ? window.matchMedia(DESKTOP_MQ).matches
            : true,
    );
    const isRestoringRef = useRef(false);
    // Delay the shared underline until scroll-spy has settled.
    const [layoutReady, setLayoutReady] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia(DESKTOP_MQ);
        const handleChange = (event: MediaQueryListEvent) =>
            setIsDesktop(event.matches);

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => setIsBlurLoaded(true), BLUR_LOAD_DELAY);
        return () => clearTimeout(timer);
    }, []);

    // Restore scroll after lazy sections expand, then enable layoutId.
    useEffect(() => {
        if ("scrollRestoration" in history) {
            history.scrollRestoration = "manual";
        }

        const saveScrollPosition = () => {
            sessionStorage.setItem(SCROLL_POS_KEY, String(window.scrollY));
        };
        window.addEventListener("beforeunload", saveScrollPosition);

        const storedScrollY = sessionStorage.getItem(SCROLL_POS_KEY);
        let restoreObserver: ResizeObserver | null = null;
        let restoreTimeoutId: ReturnType<typeof setTimeout> | null = null;
        let restoreFrameId: number | null = null;
        let readyFrameId: number | null = null;
        let willRestore = false;

        if (storedScrollY !== null) {
            const targetY = parseInt(storedScrollY, 10);

            if (!Number.isNaN(targetY) && targetY > 0) {
                willRestore = true;
                isRestoringRef.current = true;

                const restoreScroll = () => {
                    sessionStorage.removeItem(SCROLL_POS_KEY);

                    const root = document.documentElement;
                    root.style.scrollBehavior = "auto";
                    window.scrollTo(0, targetY);
                    restoreFrameId = requestAnimationFrame(() => {
                        restoreFrameId = null;
                        root.style.scrollBehavior = "";
                        isRestoringRef.current = false;
                        window.dispatchEvent(new Event("scroll"));
                        readyFrameId = requestAnimationFrame(() => {
                            readyFrameId = null;
                            setLayoutReady(true);
                        });
                    });
                };

                const canRestoreScroll = () =>
                    document.documentElement.scrollHeight >=
                    targetY + window.innerHeight * 0.5;

                if (canRestoreScroll()) {
                    restoreScroll();
                } else {
                    restoreObserver = new ResizeObserver(() => {
                        if (canRestoreScroll()) {
                            restoreObserver?.disconnect();
                            restoreObserver = null;
                            if (restoreTimeoutId) {
                                clearTimeout(restoreTimeoutId);
                                restoreTimeoutId = null;
                            }
                            restoreScroll();
                        }
                    });
                    restoreObserver.observe(document.documentElement);

                    restoreTimeoutId = setTimeout(() => {
                        restoreObserver?.disconnect();
                        restoreObserver = null;
                        restoreTimeoutId = null;
                        restoreScroll();
                    }, SCROLL_RESTORE_TIMEOUT);
                }
            }
        }

        if (!willRestore) {
            readyFrameId = requestAnimationFrame(() => {
                readyFrameId = null;
                setLayoutReady(true);
            });
        }

        return () => {
            isRestoringRef.current = false;
            window.removeEventListener("beforeunload", saveScrollPosition);
            restoreObserver?.disconnect();
            if (restoreTimeoutId) clearTimeout(restoreTimeoutId);
            if (restoreFrameId) cancelAnimationFrame(restoreFrameId);
            if (readyFrameId) cancelAnimationFrame(readyFrameId);
        };
    }, []);

    useEffect(() => {
        const sectionIds = navLinks.map(({ href }) => href.replace("#", ""));

        const handleScroll = () => {
            if (isRestoringRef.current) return;

            const scrollY = window.scrollY;
            setIsScrolled(scrollY > SCROLL_THRESHOLD);

            if (scrollY < TOP_POSITION_THRESHOLD) {
                setActiveSection("");
                return;
            }

            const triggerLine = window.innerHeight * TRIGGER_LINE_RATIO;
            const atBottom =
                window.innerHeight + scrollY >=
                document.documentElement.scrollHeight - BOTTOM_MARGIN;

            if (atBottom) {
                const contactElement = document.getElementById("contact");
                if (
                    contactElement &&
                    contactElement.getBoundingClientRect().top <
                        window.innerHeight
                ) {
                    setActiveSection("contact");
                    return;
                }
            }

            let nextActiveSection = "";
            for (const sectionId of sectionIds) {
                const sectionElement = document.getElementById(sectionId);
                if (!sectionElement) continue;
                const rect = sectionElement.getBoundingClientRect();
                if (rect.top <= triggerLine) {
                    nextActiveSection = sectionId;
                }
            }

            setActiveSection(nextActiveSection);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        const initialFrameId = requestAnimationFrame(handleScroll);

        let resizeObserver: ResizeObserver | null = null;
        if (typeof ResizeObserver !== "undefined") {
            resizeObserver = new ResizeObserver(handleScroll);
            resizeObserver.observe(document.documentElement);
        }

        return () => {
            window.removeEventListener("scroll", handleScroll);
            cancelAnimationFrame(initialFrameId);
            resizeObserver?.disconnect();
        };
    }, []);

    const handleNavClick = (
        event: React.MouseEvent<HTMLAnchorElement>,
        href: string,
    ) => {
        event.preventDefault();
        const targetElement = document.querySelector<HTMLElement>(href);

        if (targetElement) {
            const targetPosition =
                targetElement.getBoundingClientRect().top +
                window.scrollY -
                NAV_HEIGHT_OFFSET;

            setIsMobileMenuOpen(false);

            // Wait for the mobile menu exit animation before starting the scroll.
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

    const isHomeActive = activeSection === "";

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: NAV_ENTRANCE_DURATION, ease: "easeOut" }}
            className={`${styles.nav} ${isBlurLoaded ? styles.navGlass : ""} ${isScrolled ? styles.navScrolled : ""}`}
        >
            <div className={styles.navContainer}>
                <div className={styles.navGrid}>
                    <div className={styles.navHome}>
                        <a
                            href="#"
                            onClick={(event) => {
                                event.preventDefault();
                                window.scrollTo({ top: 0, behavior: "smooth" });
                                setIsMobileMenuOpen(false);
                            }}
                            className={`${styles.logo} ${isHomeActive ? styles.navItemActive : ""}`}
                        >
                            Home
                            {isHomeActive && isDesktop && layoutReady && (
                                <motion.span
                                    layoutId="nav-indicator"
                                    className={styles.navIndicator}
                                    transition={SPRING_TRANSITION}
                                />
                            )}
                        </a>
                    </div>

                    <div className={styles.navLinks}>
                        {navLinks.map((link) => {
                            const sectionId = link.href.replace("#", "");
                            const isActive = activeSection === sectionId;

                            return (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={(event) =>
                                        handleNavClick(event, link.href)
                                    }
                                    className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
                                >
                                    {link.label}
                                    {isActive && isDesktop && layoutReady && (
                                        <motion.span
                                            layoutId="nav-indicator"
                                            className={styles.navIndicator}
                                            transition={SPRING_TRANSITION}
                                        />
                                    )}
                                </a>
                            );
                        })}
                    </div>

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
                                        onClick={(event) =>
                                            handleNavClick(event, link.href)
                                        }
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                            delay:
                                                index * MOBILE_MENU_ITEM_DELAY,
                                        }}
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
