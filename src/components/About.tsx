import { motion } from "framer-motion";
import { FaLinkedinIn, FaGithub, FaDiscord } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
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
    const greetingLines = aboutData.greeting.split("\n");
    const bioParas = aboutData.bio.split("\n\n");

    return (
        <section
            id="about"
            className="relative py-20 md:py-28"
            style={{ background: "var(--bg-primary)" }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                    className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
                >
                    {/* Text Column */}
                    <motion.div
                        variants={itemVariants}
                        className="order-2 lg:order-1"
                    >
                        {/* Greeting */}
                        <div className="mb-6">
                            {greetingLines.map((line, i) => (
                                <h3
                                    key={i}
                                    className="text-lg md:text-xl font-semibold leading-snug"
                                    style={{ color: "var(--text-primary)" }}
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
                                    style={{ color: "var(--text-tertiary)" }}
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
                        className="order-1 lg:order-2 flex justify-center"
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
                                    maxWidth: "380px",
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

                                {/* Overlay gradient on bottom for style */}
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
        </section>
    );
}
