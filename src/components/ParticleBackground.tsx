import { useEffect, useMemo, useState } from "react";
import Particles from "@tsparticles/react";
import { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";
import { useTheme } from "../hooks/useTheme";

export default function ParticleBackground() {
    const { theme } = useTheme();
    const [engineReady, setEngineReady] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setEngineReady(true);
        });
    }, []);

    const options: ISourceOptions = useMemo(() => {
        const isDark = theme === "dark";
        const particleColor = isDark ? "#b44dff" : "#9f00ff";
        const lineColor = isDark
            ? "rgba(180, 77, 255, 0.12)"
            : "rgba(159, 0, 255, 0.15)";
        const particleCount =
            typeof window !== "undefined" && window.innerWidth < 768 ? 30 : 60;

        return {
            fullScreen: {
                enable: false,
            },
            fpsLimit: 60,
            interactivity: {
                events: {
                    onHover: {
                        enable: true,
                        mode: ["grab", "bubble"] as string[],
                    },
                    onClick: {
                        enable: true,
                        mode: "push",
                    },
                    resize: {
                        enable: true,
                    },
                },
                modes: {
                    grab: {
                        distance: 180,
                        links: {
                            opacity: 0.4,
                            color: particleColor,
                        },
                    },
                    bubble: {
                        distance: 200,
                        size: 6,
                        duration: 0.4,
                        opacity: 0.8,
                    },
                    push: {
                        quantity: 3,
                    },
                    repulse: {
                        distance: 150,
                        duration: 0.4,
                    },
                },
            },
            particles: {
                color: {
                    value: particleColor,
                },
                links: {
                    color: lineColor,
                    distance: 150,
                    enable: true,
                    opacity: 0.3,
                    width: 1,
                },
                move: {
                    enable: true,
                    speed: 0.8,
                    direction: "none" as const,
                    random: true,
                    straight: false,
                    outModes: {
                        default: "bounce" as const,
                    },
                    attract: {
                        enable: true,
                        rotate: {
                            x: 600,
                            y: 1200,
                        },
                    },
                },
                number: {
                    density: {
                        enable: true,
                        width: 1920,
                        height: 1080,
                    },
                    value: particleCount,
                },
                opacity: {
                    value: { min: 0.2, max: 0.5 },
                    animation: {
                        enable: true,
                        speed: 0.5,
                        sync: false,
                    },
                },
                shape: {
                    type: "circle",
                },
                size: {
                    value: { min: 1, max: 3 },
                    animation: {
                        enable: true,
                        speed: 1,
                        sync: false,
                    },
                },
            },
            detectRetina: true,
            smooth: true,
        };
    }, [theme]);

    if (!engineReady) {
        return null;
    }

    return (
        <Particles
            id="tsparticles"
            options={options}
            className="no-theme-transition"
        />
    );
}
