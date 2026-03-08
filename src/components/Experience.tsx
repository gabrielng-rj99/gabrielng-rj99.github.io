import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import experienceData from "../content/experience.json";
import styles from "./Experience.module.css";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.1,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" as const },
    },
};

const mobileItemVariants: Variants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.5, ease: "easeOut" as const },
    },
};

export default function Experience() {
    return (
        <section
            id="experience"
            className="section-wrapper section-glow-bg"
        >
            <div className="section-container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5 }}
                    className="section-header"
                >
                    <h2 className="section-heading">Experience</h2>
                    <div className="section-divider" />
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className={`${styles.timeline}`}
                >
                    <div className={styles.timelineLineDesktop} />
                    <div className={styles.timelineLineMobile} />

                    {experienceData.map((job) => (
                        <motion.div
                            key={job.id}
                            variants={itemVariants}
                            className={styles.job}
                        >
                            <div className={styles.jobDesktop}>
                                <div className={`${styles.jobLeft}`}>
                                    <h3 className="role-title">
                                        {job.role}
                                    </h3>
                                    <h4 className="text-secondary">
                                        {job.company}
                                    </h4>
                                    <h5 className="period-text">
                                        {job.period}
                                    </h5>
                                    <h6 className={styles.jobLocation}>
                                        {job.location}
                                    </h6>
                                </div>

                                <div className={`timeline-dot ${styles.timelineDot}`}>
                                    <span className={styles.timelineDotInner} />
                                </div>
                                <div className={`${styles.jobRight}`}>
                                    <div className={styles.highlight} />
                                    <ul className={styles.jobList}>
                                        {job.description.map((item, i) => {
                                            const isSubItem =
                                                item.startsWith("  -") ||
                                                item.startsWith("  ");
                                            const cleanText = item
                                                .replace(/^\s+-\s*/, "")
                                                .trim();

                                            return (
                                                <li
                                                    key={i}
                                                    className={`list-item-bullet ${isSubItem ? styles.subItem : ""}`}
                                                >
                                                    <span
                                                        className={`list-bullet ${isSubItem ? styles.subBullet : ""}`}
                                                    />
                                                    <span
                                                        className={
                                                            styles.jobText
                                                        }
                                                    >
                                                        {cleanText}
                                                    </span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </div>

                            <motion.div
                                variants={mobileItemVariants}
                                className={styles.jobMobile}
                            >
                                <div className={`timeline-dot ${styles.timelineDotMobile}`}>
                                    <span className={styles.timelineDotInner} />
                                </div>
                                <div className={styles.jobContentMobile}>
                                    <div className={styles.highlightMobile} />
                                    <h3 className="role-title">
                                        {job.role}
                                    </h3>
                                    <h4 className="text-secondary">
                                        {job.company}
                                    </h4>
                                    <div className={styles.jobMetaMobile}>
                                        <span
                                            className="period-text"
                                        >
                                            {job.period}
                                        </span>
                                        <span
                                            className={styles.jobLocationMobile}
                                        >
                                            {job.location}
                                        </span>
                                    </div>
                                    <ul className={styles.jobListMobile}>
                                        {job.description.map((item, i) => {
                                            const isSubItem =
                                                item.startsWith("  -") ||
                                                item.startsWith("  ");
                                            const cleanText = item
                                                .replace(/^\s+-\s*/, "")
                                                .trim();

                                            return (
                                                <li
                                                    key={i}
                                                    className={`list-item-bullet ${isSubItem ? styles.subItem : ""}`}
                                                >
                                                    <span
                                                        className={`list-bullet ${isSubItem ? styles.subBullet : ""}`}
                                                    />
                                                    <span
                                                        className={
                                                            styles.jobTextMobile
                                                        }
                                                    >
                                                        {cleanText}
                                                    </span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
