import { useCallback, useEffect, useRef } from "react";
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
    sizeOscillationPhase: number;
    opacityOscillationPhase: number;
}

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
                sizeOscillationPhase: Math.random() * Math.PI * 2,
                opacityOscillationPhase: Math.random() * Math.PI * 2,
            };
        },
        [],
    );

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d", { alpha: true });
        if (!context) return;

        const motionQuery = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        );
        if (motionQuery.matches) {
            canvas.style.display = "none";
            return;
        }

        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        const resize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            dimensionsRef.current = { width, height };
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            context.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        resize();

        const particleCount = getParticleCount();
        const { width, height } = dimensionsRef.current;
        const particles: Particle[] = [];
        for (let index = 0; index < particleCount; index++) {
            particles.push(
                createParticle(Math.random() * width, Math.random() * height),
            );
        }
        particlesRef.current = particles;

        const animate = (timestamp: number) => {
            animationRef.current = requestAnimationFrame(animate);

            const elapsed = timestamp - lastFrameTimeRef.current;
            if (elapsed < FRAME_INTERVAL) return;
            lastFrameTimeRef.current = timestamp - (elapsed % FRAME_INTERVAL);

            const { width, height } = dimensionsRef.current;
            const colors = getColors();
            const mouseX = mouseRef.current.x;
            const mouseY = mouseRef.current.y;
            const hasMouse = mouseX > -999 && mouseY > -999;

            context.clearRect(0, 0, width, height);

            const linkDistanceSquared = LINK_DISTANCE * LINK_DISTANCE;
            const grabDistanceSquared =
                MOUSE_GRAB_DISTANCE * MOUSE_GRAB_DISTANCE;
            const bubbleDistanceSquared =
                MOUSE_BUBBLE_DISTANCE * MOUSE_BUBBLE_DISTANCE;
            const slowRadiusSquared = MOUSE_SLOW_RADIUS * MOUSE_SLOW_RADIUS;

            for (let index = 0; index < particles.length; index++) {
                const particle = particles[index];

                particle.sizeOscillationPhase += 0.02;
                particle.opacityOscillationPhase += 0.01;
                particle.size =
                    particle.baseSize +
                    Math.sin(particle.sizeOscillationPhase) * 0.3;
                particle.opacity =
                    particle.baseOpacity +
                    Math.sin(particle.opacityOscillationPhase) * 0.05;

                let speedFactor = 1;
                if (hasMouse) {
                    const deltaX = particle.x - mouseX;
                    const deltaY = particle.y - mouseY;
                    const mouseDistanceSquared =
                        deltaX * deltaX + deltaY * deltaY;

                    if (mouseDistanceSquared < slowRadiusSquared) {
                        const proximity =
                            1 -
                            Math.sqrt(mouseDistanceSquared) /
                                MOUSE_SLOW_RADIUS;
                        speedFactor = 1 - proximity * (1 - MOUSE_SLOW_FACTOR);
                    }
                }

                particle.x += particle.vx * speedFactor;
                particle.y += particle.vy * speedFactor;

                if (particle.x <= 0 || particle.x >= width) {
                    particle.vx *= -1;
                    particle.x = Math.max(0, Math.min(width, particle.x));
                }

                if (particle.y <= 0 || particle.y >= height) {
                    particle.vy *= -1;
                    particle.y = Math.max(0, Math.min(height, particle.y));
                }
            }

            context.lineWidth = LINK_WIDTH;
            for (let index = 0; index < particles.length; index++) {
                const source = particles[index];
                for (let targetIndex = index + 1; targetIndex < particles.length; targetIndex++) {
                    const target = particles[targetIndex];
                    const deltaX = source.x - target.x;
                    const deltaY = source.y - target.y;
                    const distanceSquared = deltaX * deltaX + deltaY * deltaY;

                    if (distanceSquared < linkDistanceSquared) {
                        const distance = Math.sqrt(distanceSquared);
                        const opacity =
                            colors.lineBaseOpacity *
                            LINK_OPACITY *
                            (1 - distance / LINK_DISTANCE);
                        context.beginPath();
                        context.moveTo(source.x, source.y);
                        context.lineTo(target.x, target.y);
                        context.strokeStyle = `rgba(${colors.lineRgb}, ${opacity})`;
                        context.stroke();
                    }
                }
            }

            for (let index = 0; index < particles.length; index++) {
                const particle = particles[index];
                let drawSize = particle.size;
                let drawOpacity = particle.opacity;

                if (hasMouse) {
                    const deltaX = particle.x - mouseX;
                    const deltaY = particle.y - mouseY;
                    const mouseDistanceSquared = deltaX * deltaX + deltaY * deltaY;

                    if (mouseDistanceSquared < bubbleDistanceSquared) {
                        const distance = Math.sqrt(mouseDistanceSquared);
                        const factor = 1 - distance / MOUSE_BUBBLE_DISTANCE;
                        drawSize =
                            particle.size +
                            (MOUSE_BUBBLE_SIZE - particle.size) * factor;
                        drawOpacity =
                            particle.opacity +
                            (MOUSE_BUBBLE_OPACITY - particle.opacity) * factor;
                    }
                }

                context.beginPath();
                context.arc(
                    particle.x,
                    particle.y,
                    Math.max(0.5, drawSize),
                    0,
                    Math.PI * 2,
                );
                context.fillStyle = `rgba(${colors.particleRgb}, ${drawOpacity})`;
                context.fill();
            }

            if (hasMouse) {
                context.lineWidth = LINK_WIDTH;
                for (let index = 0; index < particles.length; index++) {
                    const particle = particles[index];
                    const deltaX = particle.x - mouseX;
                    const deltaY = particle.y - mouseY;
                    const distanceSquared = deltaX * deltaX + deltaY * deltaY;

                    if (distanceSquared < grabDistanceSquared) {
                        const distance = Math.sqrt(distanceSquared);
                        const opacity =
                            MOUSE_GRAB_LINK_OPACITY *
                            (1 - distance / MOUSE_GRAB_DISTANCE);
                        context.beginPath();
                        context.moveTo(particle.x, particle.y);
                        context.lineTo(mouseX, mouseY);
                        context.strokeStyle = `rgba(${colors.particleRgb}, ${opacity})`;
                        context.stroke();
                    }
                }
            }
        };

        animationRef.current = requestAnimationFrame(animate);

        const handleMouseMove = (event: MouseEvent) => {
            mouseRef.current = { x: event.clientX, y: event.clientY };
        };

        const handleMouseLeave = () => {
            mouseRef.current = { x: -9999, y: -9999 };
        };

        const handleClick = (event: MouseEvent) => {
            const spreadRadians = (CLICK_PUSH_SPREAD_DEG * Math.PI) / 180;
            const baseAngle = Math.random() * Math.PI * 2;

            for (let index = 0; index < CLICK_PUSH_COUNT; index++) {
                const angle = baseAngle + index * spreadRadians;
                const speed = 1 + Math.random() * MOVE_SPEED;
                particles.push(
                    createParticle(
                        event.clientX,
                        event.clientY,
                        Math.cos(angle) * speed,
                        Math.sin(angle) * speed,
                    ),
                );
            }

            while (particles.length > MAX_PARTICLES) {
                particles.shift();
            }
        };

        const handleResize = () => {
            resize();
        };

        const handleMotionChange = (event: MediaQueryListEvent) => {
            if (event.matches) {
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
    }, [createParticle, getColors]);

    return (
        <canvas
            ref={canvasRef}
            id="tsparticles"
            className="no-theme-transition"
        />
    );
}
