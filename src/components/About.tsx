import { motion } from "framer-motion";
import { FaLinkedinIn, FaGithub, FaDiscord } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import aboutData from "../content/about.json";
import Hero from "./Hero";
import styles from "./About.module.css";

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
        <section className={styles.section}>
            {/* Hero Section */}
            <Hero />

            {/* About Me Content */}
            <div
                id="about-me"
                className={`${styles.aboutMeContainer} section-glow-bg`}
            >
                <div className={styles.aboutMeInner}>
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.5 }}
                        className={styles.aboutHeader}
                    >
                        <h2 className="section-heading">About Me</h2>
                        <div
                            className={`${styles.sectionDivider} section-divider`}
                        />
                    </motion.div>

                    {/* Content Grid */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-80px" }}
                        className={styles.aboutGrid}
                    >
                        {/* Text Column — wider */}
                        <motion.div
                            variants={itemVariants}
                            className={styles.aboutTextColumn}
                        >
                            {/* Greeting */}
                            <div className={`${styles.aboutGreeting}`}>
                                {greetingLines.map((line, i) => (
                                    <h3
                                        key={i}
                                        className={styles.aboutGreetingText}
                                    >
                                        {i === 0 ? (
                                            <>
                                                {line.split(",")[0]},
                                                <span
                                                    className={
                                                        styles.textGradient
                                                    }
                                                >
                                                    {line
                                                        .split(",")
                                                        .slice(1)
                                                        .join(",")}
                                                </span>
                                            </>
                                        ) : (
                                            <span
                                                className={
                                                    i ===
                                                    greetingLines.length - 1
                                                        ? styles.aboutGreetingAccent
                                                        : undefined
                                                }
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
                            <div className={styles.aboutBio}>
                                {bioParas.map((para, i) => (
                                    <p
                                        key={i}
                                        className={`${styles.aboutBioText}`}
                                    >
                                        {para}
                                    </p>
                                ))}
                            </div>

                            {/* Social Icons */}
                            <motion.div
                                variants={itemVariants}
                                className={styles.aboutSocials}
                            >
                                {aboutData.socials.map((social) => (
                                    <motion.a
                                        key={social.name}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.name}
                                        title={social.name}
                                        className={styles.aboutSocialLink}
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
                            className={styles.aboutImageColumn}
                        >
                            <div className={styles.aboutImageWrapper}>
                                {/* Decorative border/glow */}
                                <div className={styles.aboutImageGlow} />

                                {/* Image container */}
                                <div className={styles.aboutImageContainer}>
                                    <motion.img
                                        src={aboutData.profileImage}
                                        alt={`${aboutData.name} profile photo`}
                                        className={styles.aboutProfileImage}
                                        loading="lazy"
                                        whileHover={{ scale: 1.03 }}
                                        transition={{
                                            duration: 0.4,
                                            ease: "easeOut",
                                        }}
                                    />

                                    {/* Overlay gradient on bottom */}
                                    <div className={styles.aboutImageOverlay} />
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
