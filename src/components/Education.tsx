import { motion } from "framer-motion";
import { HiAcademicCap, HiLocationMarker } from "react-icons/hi";
import educationData from "../content/education.json";
import styles from "./Education.module.css";

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.35,
            delay: index * 0.08,
            ease: "easeOut" as const,
        },
    }),
};

export default function Education() {
    return (
        <section id="education" className="section-wrapper section-glow-bg">
            <div className="section-container section-glow-bg">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5 }}
                    className="section-header-lg"
                >
                    <h2 className="section-heading">Education</h2>
                    <div className="section-divider" />
                </motion.div>

                {/* Horizontal Timeline */}
                <div className={styles.timelineContainer}>
                    {/* Horizontal line connecting cards — desktop */}
                    <div
                        className={styles.horizontalLine}
                        style={{ background: "var(--border-muted)" }}
                    />
                    {/* Vertical line connecting cards — mobile */}
                    <div
                        className={styles.verticalLine}
                        style={{ background: "var(--border-muted)" }}
                    />

                    {/* Cards Grid */}
                    <div className={styles.cardsGrid}>
                        {educationData.map((edu, index) => (
                            <motion.div
                                key={edu.id}
                                custom={index}
                                variants={cardVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-60px" }}
                                className={styles.cardWrapper}
                            >
                                {/* Header Area to align heights */}
                                <div className={styles.cardHeader}>
                                    {/* Period Badge */}
                                    <div
                                        className={`badge period-text ${styles.periodBadge}`}
                                        style={{
                                            background: "var(--accent-purple)",
                                            color: "#ffffff",
                                        }}
                                    >
                                        <HiAcademicCap size={16} />
                                        {edu.period}
                                    </div>

                                    {/* Degree */}
                                    <h3
                                        className={styles.degree}
                                        style={{ color: "var(--accent-purple)" }}
                                    >
                                        {edu.degree}
                                    </h3>
                                </div>

                                {/* Timeline Dot — desktop only */}
                                <div className={styles.timelineDotContainer}>
                                    <div
                                        className={styles.timelineDotOuter}
                                        style={{
                                            borderColor: "var(--accent-purple)",
                                            background: "var(--bg-secondary)",
                                        }}
                                    >
                                        <div
                                            className={styles.timelineDotInner}
                                            style={{
                                                background:
                                                    "var(--accent-purple)",
                                            }}
                                        />
                                    </div>
                                    <div
                                        className={styles.timelineConnector}
                                        style={{
                                            background: "var(--border-muted)",
                                        }}
                                    />
                                </div>

                                {/* Card */}
                                <div
                                    className="card-base"
                                    style={{
                                        background: "var(--bg-card)",
                                        borderColor: "var(--border-primary)",
                                    }}
                                >
                                    {/* Institution */}
                                    <h4
                                        className="text-secondary"
                                        style={{ color: "var(--text-primary)" }}
                                    >
                                        {edu.institution}
                                    </h4>

                                    {/* Location */}
                                    <div
                                        className={styles.location}
                                        style={{ color: "var(--text-muted)" }}
                                    >
                                        <HiLocationMarker size={14} />
                                        <span className={styles.locationText}>
                                            {edu.location}
                                        </span>
                                    </div>

                                    {/* Description */}
                                    <ul className={styles.descriptionList}>
                                        {edu.description.map((item, i) => (
                                            <li
                                                key={i}
                                                className="list-item-bullet"
                                                style={{
                                                    color: "var(--text-tertiary)",
                                                }}
                                            >
                                                <span
                                                    className="list-bullet"
                                                    style={{
                                                        background:
                                                            "var(--accent-purple)",
                                                    }}
                                                />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
