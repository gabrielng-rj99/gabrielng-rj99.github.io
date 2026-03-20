import { motion } from "framer-motion";
import { HiExternalLink } from "react-icons/hi";
import { useRef, useState } from "react";
import portfolioData from "../content/portfolio.json";
import styles from "./Portfolio.module.css";

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
    media: { type: string; src: string; fit?: string };
    title: string;
    featured?: boolean;
}) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const heightClass = featured ? styles.mediaFeatured : styles.mediaRegular;
    const fitMode = media.fit || "fill";
    const objectPosition = fitMode === "cover" ? "top" : "center";

    const mediaStyle = {
        objectFit: fitMode as "fill" | "cover" | "contain",
        objectPosition,
    };

    if (media.type === "video") {
        return (
            <div className={`${styles.mediaContainer} ${heightClass}`}>
                {!isLoaded && (
                    <div
                        className={`${styles.mediaPlaceholder} ${styles.pulse}`}
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
                    className={styles.media}
                    style={mediaStyle}
                />
            </div>
        );
    }

    return (
        <div className={`${styles.mediaContainer} ${heightClass}`}>
            {!isLoaded && (
                <div
                    className={`${styles.mediaPlaceholder} ${styles.pulse}`}
                    style={{ background: "var(--bg-tertiary)" }}
                />
            )}
            <img
                src={media.src}
                alt={title}
                loading="lazy"
                onLoad={() => setIsLoaded(true)}
                className={styles.media}
                style={mediaStyle}
            />
        </div>
    );
}

/* ─── Tag Pill ────────────────────────────────────────────────────── */

function TagPill({ label }: { label: string }) {
    return (
        <span
            style={{
                display: "inline-block",
                padding: "0.25rem 0.65rem",
                fontSize: "0.75rem",
                fontWeight: 500,
                color: "var(--accent-purple)",
                background: "rgba(159, 0, 255, 0.1)",
                border: "1px solid rgba(159, 0, 255, 0.25)",
                borderRadius: "9999px",
                transition: "all 0.2s ease",
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
            className={`${styles.card} ${styles.cardFeatured}`}
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
                className={`${styles.overlay} ${styles.overlayFeatured}`}
                style={{
                    background:
                        "linear-gradient(to top, rgba(10, 10, 20, 0.92) 0%, rgba(10, 10, 20, 0.6) 50%, rgba(10, 10, 20, 0.3) 100%)",
                }}
            >
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    className={styles.overlayContent}
                >
                    <div
                        className="icon-btn"
                        style={{
                            background: "rgba(159, 0, 255, 0.2)",
                            borderColor: "var(--accent-purple)",
                        }}
                    >
                        <HiExternalLink size={22} color="white" />
                    </div>
                    <p className={styles.overlayText}>{project.description}</p>
                </motion.div>
            </div>

            {/* Bottom info bar */}
            <div
                className={`${styles.cardInfo} ${styles.cardInfoFeatured}`}
                style={{
                    background: "var(--bg-card)",
                    borderColor: "var(--border-secondary)",
                }}
            >
                <div
                    className={`${styles.titleRow} ${styles.titleRowFeatured}`}
                >
                    <h3
                        className={`${styles.title} ${styles.titleFeatured}`}
                        style={{ color: "var(--text-primary)" }}
                    >
                        {project.title}
                    </h3>
                    <HiExternalLink
                        size={18}
                        className={styles.externalIcon}
                        style={{ color: "var(--accent-purple)" }}
                    />
                </div>

                <p
                    className={`${styles.description} ${styles.descriptionFeatured}`}
                    style={{ color: "var(--text-tertiary)" }}
                >
                    {project.description}
                </p>

                <div className={styles.tags}>
                    {project.tags.map((tag) => (
                        <TagPill key={tag} label={tag} />
                    ))}
                </div>

                {/* Featured badge */}
                <div
                    className={styles.featuredBadge}
                    style={{
                        background:
                            "linear-gradient(135deg, var(--accent-gradient-start), var(--accent-gradient-end))",
                        color: "#ffffff",
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
            className={`${styles.card} ${styles.cardRegular}`}
            style={{
                background: "var(--bg-card)",
                borderColor: "var(--border-primary)",
            }}
        >
            {/* Media */}
            <ProjectMedia media={project.media} title={project.title} />

            {/* Hover overlay */}
            <div
                className={`${styles.overlay} ${styles.overlayRegular}`}
                style={{
                    background:
                        "linear-gradient(to top, rgba(10, 10, 20, 0.9) 0%, rgba(10, 10, 20, 0.5) 60%, transparent 100%)",
                }}
            >
                <div
                    className="icon-btn"
                    style={{
                        background: "rgba(159, 0, 255, 0.2)",
                        borderColor: "var(--accent-purple)",
                    }}
                >
                    <HiExternalLink size={18} color="white" />
                </div>
            </div>

            {/* Info */}
            <div
                className={`${styles.cardInfo} ${styles.cardInfoRegular}`}
                style={{
                    background: "var(--bg-card)",
                    borderColor: "var(--border-secondary)",
                }}
            >
                <div className={`${styles.titleRow} ${styles.titleRowRegular}`}>
                    <h3
                        className={`${styles.title} ${styles.titleRegular}`}
                        style={{ color: "var(--text-primary)" }}
                    >
                        {project.title}
                    </h3>
                    <HiExternalLink
                        size={16}
                        className={styles.externalIcon}
                        style={{ color: "var(--accent-purple)" }}
                    />
                </div>

                <p
                    className={`${styles.description} ${styles.descriptionRegular}`}
                    style={{ color: "var(--text-tertiary)" }}
                >
                    {project.description}
                </p>

                <div className={styles.tags}>
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
        <section id="portfolio" className="section-wrapper section-glow-bg">
            <div className="section-container">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5 }}
                    className="section-header"
                >
                    <h2 className="section-heading">Portfolio</h2>
                    <div className={`section-divider ${styles.mt3}`} />
                    <p
                        className="description-text"
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
                        className={styles.featuredGrid}
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
                        className={styles.regularGrid}
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
                    className={styles.viewMore}
                >
                    <a
                        href="https://github.com/gabrielng-rj99"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${styles.btnOutline} ${styles.textSm}`}
                        style={{
                            borderColor: "var(--border-primary)",
                            color: "var(--text-primary)",
                        }}
                    >
                        View More on GitHub
                        <HiExternalLink size={16} />
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
