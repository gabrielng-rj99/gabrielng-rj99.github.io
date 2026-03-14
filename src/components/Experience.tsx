import React from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import experienceData from "../content/experience.json";
import styles from "./Experience.module.css";

// Keywords to bold in lines without colons
const KEYWORDS = [
    // Technologies
    "AWS",
    "EC2",
    "S3",
    "RDS",
    "CloudWatch",
    "Docker",
    "Kubernetes",
    "Nginx",
    "Apache",
    "Grafana",
    "Zabbix",
    "Prometheus",
    "Graylog",
    "Wazuh",
    "Active Directory",
    "Python",
    "Shell",
    "SQL",
    "ETL",
    "CI/CD",
    "API",
    "LGPD",
    "TSE",
    "FTP",
    "VBA",
    "Excel",
    // Actions
    "Implemented",
    "Developed",
    "Created",
    "Architected",
    "Managed",
    "Configured",
    "Built",
    "Executed",
    "Automated",
    "Designed",
    "Analyzed",
    "Secured",
    "Deployed",
    "Data analysis",
    // Domain terms
    "Monitoring",
    "Security",
    "Observability",
    "Load Balancing",
    "Database",
    "Server",
    "Web Application",
    "Containerization",
    // Metrics/percentages
    "1500%",
    "(NEW)",
];

/**
 * Parses description text and returns JSX with appropriate bold styling:
 * - Lines with ":" bold the text before the colon
 * - Lines without ":" bold identified keywords
 */
function parseDescription(text: string): React.ReactNode {
    // Check if line has a colon divider
    const colonIndex = text.indexOf(":");
    if (colonIndex > 0 && colonIndex < text.length - 1) {
        const beforeColon = text.slice(0, colonIndex).trim();
        const afterColon = text.slice(colonIndex + 1).trim();
        return (
            <>
                <strong>{beforeColon}</strong>
                {afterColon && `: ${afterColon}`}
            </>
        );
    }

    // No colon - bold keywords
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    // Sort keywords by length (longest first) to avoid partial matches
    const sortedKeywords = [...KEYWORDS].sort((a, b) => b.length - a.length);

    // Find all keyword matches
    const matches: { start: number; end: number; keyword: string }[] = [];
    for (const keyword of sortedKeywords) {
        // Escape special regex chars, but handle parentheses specially
        const escaped = keyword.replace(/[.*+?^${}|[\]\\]/g, "\\$&");
        // Use word boundary for normal words, or lookbehind/lookahead for special chars like (NEW)
        const hasParens = keyword.includes("(") || keyword.includes(")");
        const regex = hasParens
            ? new RegExp(keyword.replace(/[()]/g, "\\$&"), "gi")
            : new RegExp("\\b" + escaped + "\\b", "gi");
        let match;
        while ((match = regex.exec(text)) !== null) {
            matches.push({
                start: match.index,
                end: match.index + keyword.length,
                keyword,
            });
        }
    }

    // Sort matches by position and filter overlaps
    matches.sort((a, b) => a.start - b.start);
    const filteredMatches = matches.filter((m, i) => {
        if (i === 0) return true;
        const prev = matches[i - 1];
        return m.start >= prev.end;
    });

    // Build parts array
    for (const match of filteredMatches) {
        if (match.start > lastIndex) {
            parts.push(text.slice(lastIndex, match.start));
        }
        parts.push(<strong key={match.start}>{match.keyword}</strong>);
        lastIndex = match.end;
    }

    // Add remaining text
    if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : text;
}

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
        <section id="experience" className="section-wrapper section-glow-bg">
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
                                    <h3 className="role-title">{job.role}</h3>
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

                                <div
                                    className={`timeline-dot ${styles.timelineDot}`}
                                >
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
                                                        {parseDescription(
                                                            cleanText,
                                                        )}
                                                    </span>
                                                </li>
                                            );
                                        })}
                                    </ul>

                                    {/* Skills for this role */}
                                    {job.skills && job.skills.length > 0 && (
                                        <div className={styles.jobSkills}>
                                            <span className={styles.skillsLabel}>Skills:</span>
                                            <div className={styles.skillsList}>
                                                {job.skills.map((skill, index) => (
                                                    <span key={index} className={styles.skillPill}>
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <motion.div
                                variants={mobileItemVariants}
                                className={styles.jobMobile}
                            >
                                <div
                                    className={`timeline-dot ${styles.timelineDotMobile}`}
                                >
                                    <span className={styles.timelineDotInner} />
                                </div>
                                <div className={styles.jobContentMobile}>
                                    <div className={styles.highlightMobile} />
                                    <h3 className="role-title">{job.role}</h3>
                                    <h4 className="text-secondary">
                                        {job.company}
                                    </h4>
                                    <div className={styles.jobMetaMobile}>
                                        <span className="period-text">
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
                                                        {parseDescription(
                                                            cleanText,
                                                        )}
                                                    </span>
                                                </li>
                                            );
                                        })}
                                    </ul>

                                    {/* Skills for this role - Mobile */}
                                    {job.skills && job.skills.length > 0 && (
                                        <div className={styles.jobSkillsMobile}>
                                            <span className={styles.skillsLabel}>Skills:</span>
                                            <div className={styles.skillsList}>
                                                {job.skills.map((skill, index) => (
                                                    <span key={index} className={styles.skillPill}>
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
