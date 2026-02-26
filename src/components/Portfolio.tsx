import { motion } from "framer-motion";
import { HiExternalLink } from "react-icons/hi";
import { useRef, useState } from "react";
import portfolioData from "../content/portfolio.json";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.15,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut" as const,
        },
    },
};

/* ─── Media Component ─────────────────────────────────────────────── */

function ProjectMedia({
    media,
    title,
    featured = false,
}: {
    media: { type: string; src: string };
    title: string;
    featured?: boolean;
}) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const heightClass = featured
        ? "h-64 sm:h-72 md:h-80 lg:h-96"
        : "h-48 sm:h-56 md:h-64";

    if (media.type === "video") {
        return (
            <div className={`relative w-full overflow-hidden ${heightClass}`}>
                {!isLoaded && (
                    <div
                        className="absolute inset-0 animate-pulse"
                        style={{ background: "var(--bg-tertiary)" }}
                    />
                )}
                <video
                    ref={videoRef}
                    src={media.src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    onLoadedData={() => setIsLoaded(true)}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>
        );
    }

    return (
        <div className={`relative w-full overflow-hidden ${heightClass}`}>
            {!isLoaded && (
                <div
                    className="absolute inset-0 animate-pulse"
                    style={{ background: "var(--bg-tertiary)" }}
                />
            )}
            <img
                src={media.src}
                alt={title}
                loading="lazy"
                onLoad={() => setIsLoaded(true)}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
        </div>
    );
}

/* ─── Tag Pill ────────────────────────────────────────────────────── */

function TagPill({ label }: { label: string }) {
    return (
        <span
            className="inline-block px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide"
            style={{
                background: "rgba(159, 0, 255, 0.1)",
                color: "var(--accent-purple)",
                border: "1px solid rgba(159, 0, 255, 0.15)",
            }}
        >
            {label}
        </span>
    );
}

/* ─── Featured Card ───────────────────────────────────────────────── */

function FeaturedCard({
    project,
}: {
    project: (typeof portfolioData)[number];
}) {
    return (
        <motion.a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            variants={cardVariants}
            whileHover={{ y: -6 }}
            className="group relative block rounded-2xl overflow-hidden border shadow-lg cursor-pointer"
            style={{
                background: "var(--bg-card)",
                borderColor: "var(--border-primary)",
            }}
        >
            {/* Media */}
            <ProjectMedia
                media={project.media}
                title={project.title}
                featured
            />

            {/* Hover overlay */}
            <div
                className="absolute inset-0 flex flex-col items-center justify-center text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                    background:
                        "linear-gradient(to top, rgba(10, 10, 20, 0.92) 0%, rgba(10, 10, 20, 0.6) 50%, rgba(10, 10, 20, 0.3) 100%)",
                }}
            >
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    className="flex flex-col items-center gap-3 px-6"
                >
                    <div
                        className="w-12 h-12 rounded-full flex items-center justify-center border"
                        style={{
                            background: "rgba(159, 0, 255, 0.2)",
                            borderColor: "var(--accent-purple)",
                        }}
                    >
                        <HiExternalLink size={22} className="text-white" />
                    </div>
                    <p className="text-white text-base font-semibold max-w-xs">
                        {project.description}
                    </p>
                </motion.div>
            </div>

            {/* Bottom info bar */}
            <div
                className="relative z-10 p-5 md:p-6 border-t"
                style={{
                    background: "var(--bg-card)",
                    borderColor: "var(--border-secondary)",
                }}
            >
                <div className="flex items-center justify-between gap-4 mb-3">
                    <h3
                        className="text-lg md:text-xl font-bold truncate"
                        style={{ color: "var(--text-primary)" }}
                    >
                        {project.title}
                    </h3>
                    <HiExternalLink
                        size={18}
                        className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ color: "var(--accent-purple)" }}
                    />
                </div>

                <p
                    className="text-sm mb-4 line-clamp-2 leading-relaxed"
                    style={{ color: "var(--text-tertiary)" }}
                >
                    {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                        <TagPill key={tag} label={tag} />
                    ))}
                </div>

                {/* Featured badge */}
                <div
                    className="absolute top-0 right-0 -translate-y-1/2 mr-5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase"
                    style={{
                        background:
                            "linear-gradient(135deg, var(--accent-gradient-start), var(--accent-gradient-end))",
                        color: "#ffffff",
                        boxShadow: "0 2px 12px rgba(159, 0, 255, 0.3)",
                    }}
                >
                    Featured
                </div>
            </div>
        </motion.a>
    );
}

/* ─── Regular Card ────────────────────────────────────────────────── */

function ProjectCard({ project }: { project: (typeof portfolioData)[number] }) {
    return (
        <motion.a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            variants={cardVariants}
            whileHover={{ y: -4 }}
            className="group relative block rounded-xl overflow-hidden border cursor-pointer"
            style={{
                background: "var(--bg-card)",
                borderColor: "var(--border-primary)",
            }}
        >
            {/* Media */}
            <ProjectMedia media={project.media} title={project.title} />

            {/* Hover overlay */}
            <div
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                    background:
                        "linear-gradient(to top, rgba(10, 10, 20, 0.9) 0%, rgba(10, 10, 20, 0.5) 60%, transparent 100%)",
                }}
            >
                <div
                    className="w-10 h-10 rounded-full flex items-center justify-center border"
                    style={{
                        background: "rgba(159, 0, 255, 0.2)",
                        borderColor: "var(--accent-purple)",
                    }}
                >
                    <HiExternalLink size={18} className="text-white" />
                </div>
            </div>

            {/* Info */}
            <div
                className="p-4 md:p-5 border-t"
                style={{
                    background: "var(--bg-card)",
                    borderColor: "var(--border-secondary)",
                }}
            >
                <div className="flex items-center justify-between gap-3 mb-2">
                    <h3
                        className="text-base font-bold truncate"
                        style={{ color: "var(--text-primary)" }}
                    >
                        {project.title}
                    </h3>
                    <HiExternalLink
                        size={16}
                        className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ color: "var(--accent-purple)" }}
                    />
                </div>

                <p
                    className="text-xs mb-3 line-clamp-2 leading-relaxed"
                    style={{ color: "var(--text-tertiary)" }}
                >
                    {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                        <TagPill key={tag} label={tag} />
                    ))}
                </div>
            </div>
        </motion.a>
    );
}

/* ─── Main Portfolio Section ──────────────────────────────────────── */

export default function Portfolio() {
    const featured = portfolioData.filter((p) => p.featured);
    const regular = portfolioData.filter((p) => !p.featured);

    return (
        <section
            id="portfolio"
            className="relative py-20 md:py-28"
            style={{ background: "var(--bg-secondary)" }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-6"
                >
                    <h2 className="section-heading">Portfolio</h2>
                    <div className="section-divider mt-3" />
                    <p
                        className="mt-4 text-sm md:text-base max-w-2xl mx-auto leading-relaxed"
                        style={{ color: "var(--text-tertiary)" }}
                    >
                        A selection of projects that showcase my skills across
                        different domains — from CLI tools and data analysis to
                        full-stack applications and creative design.
                    </p>
                </motion.div>

                {/* Featured Projects */}
                {featured.length > 0 && (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-8 lg:mb-10"
                    >
                        {featured.map((project) => (
                            <FeaturedCard key={project.id} project={project} />
                        ))}
                    </motion.div>
                )}

                {/* Regular Projects */}
                {regular.length > 0 && (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6"
                    >
                        {regular.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </motion.div>
                )}

                {/* View more link */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="text-center mt-12"
                >
                    <a
                        href="https://github.com/gabrielng-rj99"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline text-sm"
                    >
                        View More on GitHub
                        <HiExternalLink size={16} />
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
