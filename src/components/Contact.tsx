import { motion } from "framer-motion";
import aboutData from "../content/about.json"; const containerVariants = {
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
            {/* ─── Contact Section ─────────────────────────────────────── */}
            <section
                id="contact"
                className="contact-section section-glow-bg relative mt-32 md:mt-48 py-20 md:py-32"
            >
                <div className="contact-wrapper max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-20 md:mb-32"
                    >
                        <h2 className="section-heading">Contact Me</h2>
                        <div className="section-divider mt-3" />
                        <p
                            className="mt-4 text-sm md:text-base max-w-lg mx-auto leading-relaxed"
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
                        className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6"
                    >
                        {aboutData.socials.map((social) => (
                            <motion.a
                                key={social.name}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                variants={cardVariants}
                                whileHover={{ y: -4, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="group flex items-center justify-center gap-4 p-5 md:p-6 rounded-2xl border cursor-pointer transition-all duration-300 hover:shadow-xl relative overflow-hidden"
                                style={{
                                    background: "var(--bg-card)",
                                    borderColor: "var(--border-primary)",
                                }}
                            >
                                {/* Hover background light sweep */}
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    style={{
                                        background: "linear-gradient(135deg, rgba(159,0,255,0.05) 0%, transparent 100%)"
                                    }}
                                />

                                <img
                                    src={social.image}
                                    alt={`${social.name} icon`}
                                    className="w-8 h-8 md:w-10 md:h-10 object-contain relative z-10 transition-transform duration-300 group-hover:scale-110"
                                    loading="lazy"
                                />

                                {/* Label */}
                                <span
                                    className="text-base md:text-lg font-semibold relative z-10 transition-colors duration-300 group-hover:text-(--accent-purple)"
                                    style={{ color: "var(--text-primary)" }}
                                >
                                    {social.name}
                                </span>
                            </motion.a>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ─── Footer ──────────────────────────────────────────────── */}
            <footer
                className="relative py-8 md:py-10 border-t"
                style={{
                    background: "var(--bg-primary)",
                    borderColor: "var(--border-primary)",
                }}
            >
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        {/* Copyright */}
                        <p
                            className="text-xs md:text-sm text-center md:text-left leading-relaxed"
                            style={{ color: "var(--text-muted)" }}
                        >
                            &copy; {new Date().getFullYear()} Gabriel Gomes. All
                            Rights Reserved.
                        </p>

                        {/* Social Icons in Footer */}
                        <div className="flex items-center gap-3">
                            {aboutData.socials.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.name}
                                    title={social.name}
                                    className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 hover:scale-110"
                                    style={{
                                        background: "var(--bg-tertiary)",
                                    }}
                                >
                                    <img
                                        src={social.image}
                                        alt={social.name}
                                        className="w-4 h-4 object-contain opacity-50 hover:opacity-100 transition-opacity duration-300"
                                    />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Scroll to Top */}
                    <div className="flex justify-center mt-6">
                        <motion.button
                            onClick={() =>
                                window.scrollTo({ top: 0, behavior: "smooth" })
                            }
                            whileHover={{ y: -3, scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="flex items-center justify-center w-10 h-10 rounded-full border cursor-pointer transition-all duration-300"
                            style={{
                                borderColor: "var(--border-muted)",
                                color: "var(--text-muted)",
                                background: "var(--bg-card)",
                            }}
                            aria-label="Scroll to top"
                            title="Back to top"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2.5}
                                stroke="currentColor"
                                className="w-4 h-4"
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
