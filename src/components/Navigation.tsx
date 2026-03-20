import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenuAlt3, HiX, HiDownload } from "react-icons/hi";
import ThemeToggle from "./ThemeToggle";
import styles from "./Navigation.module.css";

// ─── Navigation links ────────────────────────────────────────────────────────

// Links do menu de navegação (rótulo visível + hash da seção)
const navLinks = [
    { label: "About", href: "#about-me" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Experience", href: "#experience" },
    { label: "Certs", href: "#certifications" },
    { label: "Education", href: "#education" },
    { label: "Contact", href: "#contact" },
];

// Media query para detectar desktop (>= 768px)
// Evita animações layoutId em elementos hidden que causam scrollTo(0,0)
const DESKTOP_MQ = "(min-width: 768px)";

// ─── Tunable constants ───────────────────────────────────────────────────────
// Formato: NOME = valor // O que muda ao alterar este valor

const SCROLL_THRESHOLD = 500; // px de scroll antes da navbar ganhar box-shadow
const TOP_POSITION_THRESHOLD = 50; // scrollY abaixo disto → short-circuit (Home)
const BOTTOM_MARGIN = 50; // px do fundo da página para forçar ativação do "Contact"

// Fração da altura da viewport onde a "linha de trigger" é definida
// 0.0 = topo da tela, 1.0 = fundo da tela
// Quanto menor, mais cedo a seção seguinte é ativada ao scrollar para baixo
const TRIGGER_LINE_RATIO = 0.5;

// Altura da navbar usada como offset ao scrollar para uma seção via clique
// Deve corresponder à altura real da nav (5rem = 80px no desktop)
const NAV_HEIGHT_OFFSET = 50; // px subtraídos ao scrollar para uma seção

// Tempo antes do glass effect (backdrop-blur) aparecer na navbar
const BLUR_LOAD_DELAY = 500; // ms antes do efeito glass surgir

// Duração da animação de entrada da navbar (slide-down)
const NAV_ENTRANCE_DURATION = 0.7; // segundos

// Delay entre itens do menu mobile (stagger animation)
const MOBILE_MENU_ITEM_DELAY = 0.05; // segundos por item

// Spring para indicador visual do link ativo (underline animado)
const SPRING_TRANSITION = {
    type: "spring" as const,
    stiffness: 350, // maior = mais rápido o indicador se move
    damping: 30, // maior = menos "bounce" na animação
};

// ─── Scroll restoration ──────────────────────────────────────────────────────

const SCROLL_POS_KEY = "nav-scroll-pos"; // chave do sessionStorage
const SCROLL_RESTORE_TIMEOUT = 5000; // ms máximo de espera por lazy components

export default function Navigation() {
    // ── Estado: UI ──────────────────────────────────────────────────────────

    // true quando usuário scrollou além de SCROLL_THRESHOLD (ativa box-shadow)
    const [isScrolled, setIsScrolled] = useState(false);

    // true quando menu mobile está aberto
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // true após BLUR_LOAD_DELAY ms (aplica glass effect na navbar)
    const [isBlurLoaded, setIsBlurLoaded] = useState(false);

    // ── Estado: navegação ───────────────────────────────────────────────────

    // ID da seção ativa no momento ("" = Home no topo)
    const [activeSection, setActiveSection] = useState("");

    // true quando viewport >= 768px (mostra links desktop + indicador)
    const [isDesktop, setIsDesktop] = useState(() =>
        typeof window !== "undefined"
            ? window.matchMedia(DESKTOP_MQ).matches
            : true,
    );

    // Flag para impedir scroll-spy durante restauração de posição
    const isRestoringRef = useRef(false);

    // true quando scroll-spy determinou a seção correta após mount/restauração.
    // Previne animação FLIP do layoutId que causa scrollTo(0,0) no reload.
    const [layoutReady, setLayoutReady] = useState(false);

    // ── Effect: media query desktop ─────────────────────────────────────────

    useEffect(() => {
        const mql = window.matchMedia(DESKTOP_MQ);
        const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
        mql.addEventListener("change", onChange);
        return () => mql.removeEventListener("change", onChange);
    }, []);

    // ── Effect: glass effect delay ──────────────────────────────────────────

    useEffect(() => {
        const timer = setTimeout(() => setIsBlurLoaded(true), BLUR_LOAD_DELAY);
        return () => clearTimeout(timer);
    }, []);

    // ── Effect: scroll position restoration on reload ───────────────────────
    // Salva scrollY antes do unload e restaura após lazy components carregarem.
    //
    // Correções:
    // 1. A chave do sessionStorage só é removida dentro de restore(), para que
    //    o StrictMode (double-mount) ainda a encontre no 2º mount.
    // 2. layoutReady só é true DEPOIS que scroll-spy detectou a seção correta,
    //    prevenindo a animação FLIP do layoutId que causa scrollTo(0,0).
    // 3. Todos os rAFs pendentes são cancelados no cleanup.

    useEffect(() => {
        // Desabilita restauração automática do browser (falha com lazy loading)
        if ("scrollRestoration" in history) {
            history.scrollRestoration = "manual";
        }

        // Salva posição antes de fechar/recarregar
        const saveScrollPos = () => {
            sessionStorage.setItem(SCROLL_POS_KEY, String(window.scrollY));
        };
        window.addEventListener("beforeunload", saveScrollPos);

        // Tenta restaurar posição salva.
        // NÃO remove a chave aqui — espera restore() consumir com sucesso.
        // Isso garante que StrictMode (double-mount) encontre a chave no 2º mount.
        const raw = sessionStorage.getItem(SCROLL_POS_KEY);

        let restoreObserver: ResizeObserver | null = null;
        let restoreTimeout: ReturnType<typeof setTimeout> | null = null;
        let restoreRaf: number | null = null;
        let readyRaf: number | null = null;
        let willRestore = false;

        if (raw !== null) {
            const targetY = parseInt(raw, 10);

            if (!isNaN(targetY) && targetY > 0) {
                willRestore = true;
                isRestoringRef.current = true;

                const restore = () => {
                    // Consumido: remove chave agora que restauração vai completar
                    sessionStorage.removeItem(SCROLL_POS_KEY);

                    // Desativa scroll suave temporariamente para restauração
                    // instantânea (sem animação visível)
                    const html = document.documentElement;
                    html.style.scrollBehavior = "auto";
                    window.scrollTo(0, targetY);
                    restoreRaf = requestAnimationFrame(() => {
                        restoreRaf = null;
                        html.style.scrollBehavior = "";
                        // Libera scroll-spy após a restauração
                        isRestoringRef.current = false;
                        // Re-dispara scroll-spy para detectar a seção correta
                        // (o rAF inicial já rodou enquanto isRestoringRef era true)
                        window.dispatchEvent(new Event("scroll"));
                        // Espera re-render do scroll-spy estabilizar antes de
                        // habilitar layoutId (evita FLIP animation → scrollTo(0,0))
                        readyRaf = requestAnimationFrame(() => {
                            readyRaf = null;
                            setLayoutReady(true);
                        });
                    });
                };

                const canRestore = () =>
                    document.documentElement.scrollHeight >=
                    targetY + window.innerHeight * 0.5;

                if (canRestore()) {
                    // Página já é alta o suficiente — restaura imediatamente
                    restore();
                } else {
                    // Espera lazy components crescerem a página
                    restoreObserver = new ResizeObserver(() => {
                        if (canRestore()) {
                            restoreObserver?.disconnect();
                            restoreObserver = null;
                            if (restoreTimeout) {
                                clearTimeout(restoreTimeout);
                                restoreTimeout = null;
                            }
                            restore();
                        }
                    });
                    restoreObserver.observe(document.documentElement);

                    // Timeout: tenta mesmo se a página não cresceu o suficiente
                    restoreTimeout = setTimeout(() => {
                        restoreObserver?.disconnect();
                        restoreObserver = null;
                        restoreTimeout = null;
                        restore();
                    }, SCROLL_RESTORE_TIMEOUT);
                }
            }
        }

        // Sem restauração — habilita indicador após scroll-spy inicial estabilizar
        if (!willRestore) {
            readyRaf = requestAnimationFrame(() => {
                readyRaf = null;
                setLayoutReady(true);
            });
        }

        return () => {
            // Reset para StrictMode re-mount ter estado limpo
            isRestoringRef.current = false;
            window.removeEventListener("beforeunload", saveScrollPos);
            restoreObserver?.disconnect();
            if (restoreTimeout) clearTimeout(restoreTimeout);
            if (restoreRaf) cancelAnimationFrame(restoreRaf);
            if (readyRaf) cancelAnimationFrame(readyRaf);
        };
    }, []);

    // ── Scroll-spy ──────────────────────────────────────────────────────────

    useEffect(() => {
        // IDs das seções para iterar (extraídos dos hrefs dos navLinks)
        const sectionIds = navLinks.map((link) => link.href.replace("#", ""));

        const handleScroll = () => {
            // Ignora durante restauração de posição
            if (isRestoringRef.current) return;

            // Posição atual do scroll vertical
            const scrollY = window.scrollY;

            // Ativa box-shadow quando scrollou além do threshold
            setIsScrolled(scrollY > SCROLL_THRESHOLD);

            // No topo da página → Home ativo
            if (scrollY < TOP_POSITION_THRESHOLD) {
                setActiveSection("");
                return;
            }

            // Linha horizontal na tela onde seção é considerada "ativa"
            // getBoundingClientRect é mais confiável que offsetTop
            // (não afetado por lazy-loading de imagens/componentes)
            const triggerLine = window.innerHeight * TRIGGER_LINE_RATIO;

            // Detecta se está no final da página (para ativar Contact)
            const atBottom =
                window.innerHeight + scrollY >=
                document.documentElement.scrollHeight - BOTTOM_MARGIN;

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

            // Percorre seções de cima para baixo;
            // seleciona a última cuja borda superior passou da triggerLine
            let closest = "";
            for (const id of sectionIds) {
                const el = document.getElementById(id);
                if (!el) continue;
                const rect = el.getBoundingClientRect();
                if (rect.top <= triggerLine) {
                    closest = id;
                }
            }
            // Sempre atualiza — se nenhuma seção cruzou a triggerLine,
            // limpa o estado (volta para Home) em vez de manter valor antigo
            setActiveSection(closest);
        };

        // Listener passivo para não bloquear rolagem
        window.addEventListener("scroll", handleScroll, { passive: true });

        // Execução inicial para matching com scroll position atual
        // (lida com reload e scroll-restore)
        const initialRaf = requestAnimationFrame(() => {
            handleScroll();
        });

        // Re-detecta quando altura da página muda (lazy loading, imagens)
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

    // ── Handler: clique em link do nav ────────────────────────────────────

    const handleNavClick = (
        e: React.MouseEvent<HTMLAnchorElement>,
        href: string,
    ) => {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            // Calcula posição do elemento subtraindo altura da navbar
            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                NAV_HEIGHT_OFFSET;

            // Fecha menu mobile (dispara AnimatePresence exit)
            setIsMobileMenuOpen(false);

            // Double-rAF: garante que scroll ocorre DEPOIS que framer-motion
            // commita o exit do menu mobile (evita override do scrollTo)
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

    // ── Derivada: Home ativo quando no topo e sem seção ativa ─────────────

    // Home fica ativo enquanto nenhuma seção cruzar a triggerLine.
    // Sem threshold fixo — a transição Home→About é controlada pelo
    // TRIGGER_LINE_RATIO, adaptando-se a qualquer altura de hero/viewport.
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
                            {isHomeActive && isDesktop && layoutReady && (
                                <motion.span
                                    layoutId="nav-indicator"
                                    className={styles.navIndicator}
                                    transition={SPRING_TRANSITION}
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

                    {/* Mobile: Tools*/}
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
