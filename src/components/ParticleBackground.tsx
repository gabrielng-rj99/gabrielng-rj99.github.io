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
            typeof window !== "undefined" && window.innerWidth < 768 ? 60 : 150;

        // Configurações de limite de partículas
        const limitValue = 180; // Limite máximo de partículas
        const limitMode = "delete" as const; // "delete" ou "bounce"

        // ============================================================
        // MOVIMENTO (attract - efeito gravitacional/elástico)
        // ============================================================
        // O attract cria um campo de força que atrai partículas para o
        // centro da tela, criando um movimento orbital/elástico.
        //
        // MATEMÁTICA DO ATTRACT:
        // - Usa coordenadas polares: cada partícula tem um ângulo (θ) e raio (r)
        // - O movimento é calculado com:
        //   x = centerX + r * cos(θ + speed * t) * (rotateX / maxDistance)
        //   y = centerY + r * sin(θ + speed * t) * (rotateY / maxDistance)
        // - rotateX/rotateY = raio máximo de oscilação em cada eixo (px)
        // - moveSpeed = velocidade angular (quanto maior = mais rápido gira)
        //
        // EXEMPLO (Monitor 500x-500y, rotateX=250, rotateY=250, speed=1.5):
        // - Partícula a 100px do centro (θ = 45° = π/4 rad)
        // - Em t=0:  x = 250 + 100 * cos(π/4) = 320.7,  y = 320.7
        // - Em t=1:  x = 250 + 100 * cos(π/4 + 1.5) = 176.3, y = 323.7
        // - Em t=2:  x = 250 + 100 * cos(π/4 + 3.0) = 100.0, y = 250.0
        // - Resultado: a partícula gira 1.5 radianos (~86°) por segundo
        //   Completando uma volta (2π rad) em ~4.2 segundos
        // ============================================================
        const moveSpeed = 2; // Velocidade angular da órbita (1-2 = divertido, não muito rápido)
        const attractEnable = false; // true = ativa / false = desativa
        const attractRotateX = 1200; // Raio máximo de oscilação no eixo X (px)
        const attractRotateY = 600; // Raio máximo de oscilação no eixo Y (px)

        return {
            fullScreen: {
                enable: false,
            },
            fpsLimit: 60,
            interactivity: {
                events: {
                    onHover: {
                        enable: true,
                        mode: ["grab", "bubble", "slow"] as string[],
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
                        scatter: {
                            enable: true,
                            spread: 120, // Espalha em 120° entre cada partícula
                        },
                    },
                    repulse: {
                        distance: 150,
                        duration: 0.4,
                    },
                    slow: {
                        factor: 1.1,
                        radius: 100,
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
                    speed: moveSpeed,
                    direction: "none" as const,
                    random: true,
                    straight: false,
                    outModes: {
                        default: "bounce" as const,
                    },
                    attract: {
                        enable: attractEnable,
                        rotate: {
                            x: attractRotateX,
                            y: attractRotateY,
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
                    limit: {
                        value: limitValue,
                        mode: limitMode,
                    },
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
