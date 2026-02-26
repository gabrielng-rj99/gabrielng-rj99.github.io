import { motion } from "framer-motion";
import { FaLinkedinIn, FaGithub, FaDiscord } from "react-icons/fa";
import { HiOutlineMail, HiDownload } from "react-icons/hi";
import aboutData from "../content/about.json";

const iconMap: Record<string, React.ReactNode> = {
    linkedin: <FaLinkedinIn size={18} />,
    email: <HiOutlineMail size={18} />,
    github: <FaGithub size={18} />,
    discord: <FaDiscord size={18} />,
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" as const },
    },
};

export default function About() {
    const headlineParts = aboutData.headline.split("\n");
    const greetingLines = aboutData.greeting.split("\n");
    const bioParas = aboutData.bio.split("\n\n");

    return (
        <section id="about" className="relative">
            {/* ─── Hero Banner (no image, particles show through) ─── */}
            <div
                className="relative min-h-[85vh] flex items-center justify-center overflow-hidden"
                style={{ background: "transparent" }}
            >
                <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-28 md:py-36">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        {/* Headline */}
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-6">
                            {headlineParts.map((part, index) => (
                                <span
                                    key={index}
                                    className="block text-gradient-animated"
                                >
                                    {part.split(/(-)/g).map((segment, i) =>
                                        segment === "-" ? (
                                            <span
                                                key={i}
                                                style={{
                                                    color: "var(--accent-purple)",
                                                    WebkitTextFillColor:
                                                        "var(--accent-purple)",
                                                }}
                                            >
                                                {segment}
                                            </span>
                                        ) : (
                                            <span key={i}>{segment}</span>
                                        ),
                                    )}
                                </span>
                            ))}
                        </h1>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.8,
                                delay: 0.3,
                                ease: "easeOut",
                            }}
                            className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
                            style={{ color: "var(--text-secondary)" }}
                        >
                            {aboutData.subheadline}
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.8,
                                delay: 0.6,
                                ease: "easeOut",
                            }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <a
                                href={aboutData.resumeUrl}
                                download
                                className="btn-accent text-base"
                            >
                                <HiDownload size={18} />
                                Download Resume
                            </a>

                            <a
                                href="#portfolio"
                                onClick={(e) => {
                                    e.preventDefault();
                                    document
                                        .querySelector("#portfolio")
                                        ?.scrollIntoView({
                                            behavior: "smooth",
                                        });
                                }}
                                className="btn-outline text-base"
                            >
                                View Portfolio
                            </a>
                        </motion.div>
                    </motion.div>

                    {/* Scroll indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                        className="mt-16 flex justify-center"
                    >
                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="w-6 h-10 rounded-full border-2 flex items-start justify-center pt-2"
                            style={{
                                borderColor: "var(--border-muted)",
                            }}
                        >
                            <motion.div
                                animate={{
                                    opacity: [1, 0.3, 1],
                                    y: [0, 8, 0],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="w-1.5 h-1.5 rounded-full"
                                style={{
                                    background: "var(--accent-purple)",
                                }}
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* ─── About Me Content ──────────────────────────────── */}
            <div style={{ background: "var(--bg-primary)" }}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-14"
                    >
                        <h2 className="section-heading">About Me</h2>
                        <div className="section-divider mt-3" />
                    </motion.div>

                    {/* Content Grid */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-80px" }}
                        className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center"
                    >
                        {/* Text Column — wider */}
                        <motion.div
                            variants={itemVariants}
                            className="order-2 lg:order-1 lg:col-span-3"
                        >
                            {/* Greeting */}
                            <div className="mb-6">
                                {greetingLines.map((line, i) => (
                                    <h3
                                        key={i}
                                        className="text-lg md:text-xl font-semibold leading-snug"
                                        style={{
                                            color: "var(--text-primary)",
                                        }}
                                    >
                                        {i === 0 ? (
                                            <>
                                                {line.split(",")[0]},
                                                <span className="text-gradient">
                                                    {line
                                                        .split(",")
                                                        .slice(1)
                                                        .join(",")}
                                                </span>
                                            </>
                                        ) : (
                                            <span
                                                style={{
                                                    color:
                                                        i ===
                                                        greetingLines.length - 1
                                                            ? "var(--accent-purple)"
                                                            : "var(--text-secondary)",
                                                }}
                                            >
                                                {line}
                                            </span>
                                        )}
                                    </h3>
                                ))}
                            </div>

                            {/* Bio */}
                            <div className="space-y-4">
                                {bioParas.map((para, i) => (
                                    <p
                                        key={i}
                                        className="text-sm md:text-base leading-relaxed"
                                        style={{
                                            color: "var(--text-tertiary)",
                                        }}
                                    >
                                        {para}
                                    </p>
                                ))}
                            </div>

                            {/* Social Icons */}
                            <motion.div
                                variants={itemVariants}
                                className="flex items-center gap-3 mt-8"
                            >
                                {aboutData.socials.map((social) => (
                                    <motion.a
                                        key={social.name}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.name}
                                        title={social.name}
                                        className="flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-300"
                                        style={{
                                            borderColor: "var(--border-muted)",
                                            color: "var(--text-muted)",
                                        }}
                                        whileHover={{
                                            scale: 1.15,
                                            borderColor: "var(--accent-purple)",
                                            color: "var(--accent-purple)",
                                        }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {iconMap[social.icon] ?? (
                                            <HiOutlineMail size={18} />
                                        )}
                                    </motion.a>
                                ))}
                            </motion.div>
                        </motion.div>

                        {/* Image Column */}
                        <motion.div
                            variants={itemVariants}
                            className="order-1 lg:order-2 lg:col-span-2 flex justify-center"
                        >
                            <div className="relative group">
                                {/* Decorative border/glow */}
                                <div
                                    className="absolute -inset-2 rounded-2xl opacity-40 blur-xl transition-opacity duration-500 group-hover:opacity-60"
                                    style={{
                                        background:
                                            "linear-gradient(135deg, var(--accent-gradient-start), var(--accent-gradient-end))",
                                    }}
                                />

                                {/* Image container */}
                                <div
                                    className="relative overflow-hidden rounded-2xl border-2 shadow-xl"
                                    style={{
                                        borderColor: "var(--border-primary)",
                                        maxWidth: "340px",
                                    }}
                                >
                                    <motion.img
                                        src={aboutData.profileImage}
                                        alt={`${aboutData.name} profile photo`}
                                        className="w-full h-auto object-cover"
                                        loading="lazy"
                                        whileHover={{ scale: 1.03 }}
                                        transition={{
                                            duration: 0.4,
                                            ease: "easeOut",
                                        }}
                                    />

                                    {/* Overlay gradient on bottom */}
                                    <div
                                        className="absolute inset-x-0 bottom-0 h-1/4 pointer-events-none"
                                        style={{
                                            background:
                                                "linear-gradient(to top, var(--bg-primary), transparent)",
                                        }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
