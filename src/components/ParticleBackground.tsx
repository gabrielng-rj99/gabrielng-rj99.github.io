import { useEffect, useRef, useCallback } from "react";
import { useTheme } from "../hooks/useTheme";

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    baseSize: number;
    opacity: number;
    baseOpacity: number;
    // For subtle size/opacity animation
    sizePhase: number;
    opacityPhase: number;
}

// ============================================================
// Configuration — mirrors the original tsParticles settings
// ============================================================
const LINK_DISTANCE = 150;
const LINK_OPACITY = 1;
const LINK_WIDTH = 1;
const MOUSE_GRAB_DISTANCE = 180;
const MOUSE_GRAB_LINK_OPACITY = 0.5;
const MOUSE_BUBBLE_DISTANCE = 200;
const MOUSE_BUBBLE_SIZE = 8;
const MOUSE_BUBBLE_OPACITY = 0.8;
const MOUSE_SLOW_RADIUS = 150;
const MOUSE_SLOW_FACTOR = 0.6;
const MOVE_SPEED = 1;
const PARTICLE_SIZE_MIN = 1;
const PARTICLE_SIZE_MAX = 3;
const PARTICLE_OPACITY_MIN = 0.3;
const PARTICLE_OPACITY_MAX = 0.8;
const CLICK_PUSH_COUNT = 3;
const CLICK_PUSH_SPREAD_DEG = 120;
const MAX_PARTICLES = 180;
const FPS_LIMIT = 60;
const FRAME_INTERVAL = 1000 / FPS_LIMIT;

function getParticleCount(): number {
    if (typeof window === "undefined") return 100;
    return window.innerWidth < 768 ? 60 : 150;
}

export default function ParticleBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { theme } = useTheme();
    const themeRef = useRef(theme);
    const mouseRef = useRef({ x: -9999, y: -9999 });
    const particlesRef = useRef<Particle[]>([]);
    const animationRef = useRef<number>(0);
    const lastFrameTimeRef = useRef<number>(0);
    const dimensionsRef = useRef({ width: 0, height: 0 });

    // Keep theme ref in sync without re-running the effect
    useEffect(() => {
        themeRef.current = theme;
    }, [theme]);

    const getColors = useCallback(() => {
        const isDark = themeRef.current === "dark";
        return {
            particleRgb: isDark ? "180, 77, 255" : "159, 0, 255",
            lineRgb: isDark ? "180, 77, 255" : "159, 0, 255",
            lineBaseOpacity: isDark ? 0.12 : 0.15,
        };
    }, []);

    const createParticle = useCallback(
        (x: number, y: number, vx?: number, vy?: number): Particle => {
            const size =
                Math.random() * (PARTICLE_SIZE_MAX - PARTICLE_SIZE_MIN) +
                PARTICLE_SIZE_MIN;
            const opacity =
                Math.random() * (PARTICLE_OPACITY_MAX - PARTICLE_OPACITY_MIN) +
                PARTICLE_OPACITY_MIN;
            return {
                x,
                y,
                vx: vx ?? (Math.random() - 0.5) * MOVE_SPEED * 2,
                vy: vy ?? (Math.random() - 0.5) * MOVE_SPEED * 2,
                size,
                baseSize: size,
                opacity,
                baseOpacity: opacity,
                sizePhase: Math.random() * Math.PI * 2,
                opacityPhase: Math.random() * Math.PI * 2,
            };
        },
        [],
    );

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) return;

        // Respect reduced motion preference
        const motionQuery = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        );
        if (motionQuery.matches) {
            canvas.style.display = "none";
            return;
        }

        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        const resize = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            dimensionsRef.current = { width: w, height: h };
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        resize();

        // Initialize particles
        const count = getParticleCount();
        const { width, height } = dimensionsRef.current;
        const particles: Particle[] = [];
        for (let i = 0; i < count; i++) {
            particles.push(
                createParticle(Math.random() * width, Math.random() * height),
            );
        }
        particlesRef.current = particles;

        // ============================================================
        // Animation loop
        // ============================================================
        const animate = (timestamp: number) => {
            animationRef.current = requestAnimationFrame(animate);

            // FPS limiter
            const elapsed = timestamp - lastFrameTimeRef.current;
            if (elapsed < FRAME_INTERVAL) return;
            lastFrameTimeRef.current = timestamp - (elapsed % FRAME_INTERVAL);

            const { width: w, height: h } = dimensionsRef.current;
            const colors = getColors();
            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;
            const mouseActive = mx > -999 && my > -999;

            ctx.clearRect(0, 0, w, h);

            const linkDistSq = LINK_DISTANCE * LINK_DISTANCE;
            const grabDistSq = MOUSE_GRAB_DISTANCE * MOUSE_GRAB_DISTANCE;
            const bubbleDistSq = MOUSE_BUBBLE_DISTANCE * MOUSE_BUBBLE_DISTANCE;
            const slowRadiusSq = MOUSE_SLOW_RADIUS * MOUSE_SLOW_RADIUS;

            // --- Update particles ---
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                // Animate size and opacity subtly
                p.sizePhase += 0.02;
                p.opacityPhase += 0.01;
                p.size = p.baseSize + Math.sin(p.sizePhase) * 0.3;
                p.opacity = p.baseOpacity + Math.sin(p.opacityPhase) * 0.05;

                // Slow effect near mouse
                let speedFactor = 1;
                if (mouseActive) {
                    const dxm = p.x - mx;
                    const dym = p.y - my;
                    const distSqMouse = dxm * dxm + dym * dym;
                    if (distSqMouse < slowRadiusSq) {
                        const proximity =
                            1 - Math.sqrt(distSqMouse) / MOUSE_SLOW_RADIUS;
                        speedFactor = 1 - proximity * (1 - MOUSE_SLOW_FACTOR);
                    }
                }

                // Move
                p.x += p.vx * speedFactor;
                p.y += p.vy * speedFactor;

                // Bounce off edges
                if (p.x <= 0 || p.x >= w) {
                    p.vx *= -1;
                    p.x = Math.max(0, Math.min(w, p.x));
                }
                if (p.y <= 0 || p.y >= h) {
                    p.vy *= -1;
                    p.y = Math.max(0, Math.min(h, p.y));
                }
            }

            // --- Draw links between particles ---
            ctx.lineWidth = LINK_WIDTH;
            for (let i = 0; i < particles.length; i++) {
                const a = particles[i];
                for (let j = i + 1; j < particles.length; j++) {
                    const b = particles[j];
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const distSq = dx * dx + dy * dy;

                    if (distSq < linkDistSq) {
                        const dist = Math.sqrt(distSq);
                        const opacity =
                            colors.lineBaseOpacity *
                            LINK_OPACITY *
                            (1 - dist / LINK_DISTANCE);
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.strokeStyle = `rgba(${colors.lineRgb}, ${opacity})`;
                        ctx.stroke();
                    }
                }
            }

            // --- Draw particles ---
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                let drawSize = p.size;
                let drawOpacity = p.opacity;

                // Bubble effect near mouse
                if (mouseActive) {
                    const dxm = p.x - mx;
                    const dym = p.y - my;
                    const distSqMouse = dxm * dxm + dym * dym;

                    if (distSqMouse < bubbleDistSq) {
                        const dist = Math.sqrt(distSqMouse);
                        const factor = 1 - dist / MOUSE_BUBBLE_DISTANCE;
                        drawSize =
                            p.size + (MOUSE_BUBBLE_SIZE - p.size) * factor;
                        drawOpacity =
                            p.opacity +
                            (MOUSE_BUBBLE_OPACITY - p.opacity) * factor;
                    }
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, Math.max(0.5, drawSize), 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${colors.particleRgb}, ${drawOpacity})`;
                ctx.fill();
            }

            // --- Draw grab lines from mouse to nearby particles ---
            if (mouseActive) {
                ctx.lineWidth = LINK_WIDTH;
                for (let i = 0; i < particles.length; i++) {
                    const p = particles[i];
                    const dx = p.x - mx;
                    const dy = p.y - my;
                    const distSq = dx * dx + dy * dy;

                    if (distSq < grabDistSq) {
                        const dist = Math.sqrt(distSq);
                        const opacity =
                            MOUSE_GRAB_LINK_OPACITY *
                            (1 - dist / MOUSE_GRAB_DISTANCE);
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(mx, my);
                        ctx.strokeStyle = `rgba(${colors.particleRgb}, ${opacity})`;
                        ctx.stroke();
                    }
                }
            }
        };

        animationRef.current = requestAnimationFrame(animate);

        // ============================================================
        // Event handlers
        // ============================================================
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        const handleMouseLeave = () => {
            mouseRef.current = { x: -9999, y: -9999 };
        };

        const handleClick = (e: MouseEvent) => {
            const spreadRad = (CLICK_PUSH_SPREAD_DEG * Math.PI) / 180;
            const baseAngle = Math.random() * Math.PI * 2;

            for (let i = 0; i < CLICK_PUSH_COUNT; i++) {
                const angle = baseAngle + i * spreadRad;
                const speed = 1 + Math.random() * MOVE_SPEED;
                particles.push(
                    createParticle(
                        e.clientX,
                        e.clientY,
                        Math.cos(angle) * speed,
                        Math.sin(angle) * speed,
                    ),
                );
            }

            // Enforce particle limit — remove oldest first
            while (particles.length > MAX_PARTICLES) {
                particles.shift();
            }
        };

        const handleResize = () => {
            resize();
        };

        // Handle reduced motion change
        const handleMotionChange = (e: MediaQueryListEvent) => {
            if (e.matches) {
                cancelAnimationFrame(animationRef.current);
                canvas.style.display = "none";
            } else {
                canvas.style.display = "";
                animationRef.current = requestAnimationFrame(animate);
            }
        };

        window.addEventListener("mousemove", handleMouseMove, {
            passive: true,
        });
        window.addEventListener("mouseleave", handleMouseLeave);
        window.addEventListener("click", handleClick);
        window.addEventListener("resize", handleResize);
        motionQuery.addEventListener("change", handleMotionChange);

        return () => {
            cancelAnimationFrame(animationRef.current);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseleave", handleMouseLeave);
            window.removeEventListener("click", handleClick);
            window.removeEventListener("resize", handleResize);
            motionQuery.removeEventListener("change", handleMotionChange);
        };
    }, [getColors, createParticle]);

    return (
        <canvas
            ref={canvasRef}
            id="tsparticles"
            className="no-theme-transition"
        />
    );
}
