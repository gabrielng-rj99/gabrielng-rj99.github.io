import { motion } from "framer-motion";
import aboutData from "../content/about.json";
import styles from "./Contact.module.css";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.5, ease: "easeOut" as const },
    },
};

export default function Contact() {
    return (
        <>
            {/* Contact Section */}
            <section id="contact" className={`${styles.section} section-glow-bg`}>
                <div className={styles.wrapper}>
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.5 }}
                        className={styles.header}
                    >
                        <h2 className="section-heading">Contact Me</h2>
                        <div className={`section-divider ${styles.divider}`} />
                        <p
                            className={styles.description}
                            style={{ color: "var(--text-tertiary)" }}
                        >
                            Feel free to reach out — whether it's about a
                            project, collaboration, or just to say hello.
                        </p>
                    </motion.div>

                    {/* Contact Cards Grid */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-60px" }}
                        className={styles.grid}
                    >
                        {aboutData.socials.map((social) => (
                            <motion.a
                                key={social.name}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                variants={cardVariants}
                                whileHover={{ y: -6, scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={styles.card}
                            >
                                <img
                                    src={social.image}
                                    alt={`${social.name} icon`}
                                    className={styles.icon}
                                    loading="lazy"
                                />

                                {/* Label */}
                                <span
                                    className={styles.label}
                                    style={{ color: "var(--text-secondary)" }}
                                >
                                    {social.name}
                                </span>
                            </motion.a>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className={styles.footer}>
                <div className={styles.footerWrapper}>
                    <div className={styles.footerContent}>
                        {/* Copyright */}
                        <p
                            className={styles.copyright}
                            style={{ color: "var(--text-muted)" }}
                        >
                            &copy; {new Date().getFullYear()} Gabriel Gomes. All
                            Rights Reserved.
                        </p>
                    </div>

                    {/* Scroll to Top */}
                    <div className={styles.scrollButtonContainer}>
                        <motion.button
                            onClick={() =>
                                window.scrollTo({ top: 0, behavior: "smooth" })
                            }
                            whileHover={{ y: -3, scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={styles.scrollButton}
                            aria-label="Scroll to top"
                            title="Back to top"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2.5}
                                stroke="currentColor"
                                className={styles.arrowIcon}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4.5 15.75l7.5-7.5 7.5 7.5"
                                />
                            </svg>
                        </motion.button>
                    </div>
                </div>
            </footer>
        </>
    );
}
