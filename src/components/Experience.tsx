import React from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import experienceData from "../content/experience.json";
import styles from "./Experience.module.css";

const BOLD_TERMS = [
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
    "Monitoring",
    "Security",
    "Observability",
    "Load Balancing",
    "Database",
    "Server",
    "Web Application",
    "Containerization",
    "1500%",
    "(NEW)",
];

const SORTED_BOLD_TERMS = [...BOLD_TERMS].sort((a, b) => b.length - a.length);

function parseDescription(text: string): React.ReactNode {
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

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    const matches: { start: number; end: number; term: string }[] = [];

    for (const term of SORTED_BOLD_TERMS) {
        const escaped = term.replace(/[.*+?^${}|[\]\\]/g, "\\$&");
        const hasParentheses = term.includes("(") || term.includes(")");
        const regex = hasParentheses
            ? new RegExp(term.replace(/[()]/g, "\\$&"), "gi")
            : new RegExp(`\\b${escaped}\\b`, "gi");

        let match: RegExpExecArray | null;
        while ((match = regex.exec(text)) !== null) {
            matches.push({
                start: match.index,
                end: match.index + term.length,
                term,
            });
        }
    }

    matches.sort((a, b) => a.start - b.start);
    const filteredMatches = matches.filter((currentMatch, index) => {
        if (index === 0) return true;
        const previousMatch = matches[index - 1];
        return currentMatch.start >= previousMatch.end;
    });

    for (const match of filteredMatches) {
        if (match.start > lastIndex) {
            parts.push(text.slice(lastIndex, match.start));
        }
        parts.push(<strong key={match.start}>{match.term}</strong>);
        lastIndex = match.end;
    }

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
                    className={styles.timeline}
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
                                <div className={styles.jobLeft}>
                                    <h3 className="role-title">{job.role}</h3>
                                    <h4 className="text-secondary">
                                        {job.company}
                                    </h4>
                                    <h5 className="period-text">{job.period}</h5>
                                    <h6 className={styles.jobLocation}>
                                        {job.location}
                                    </h6>

                                    {job.skills && job.skills.length > 0 && (
                                        <div className={styles.jobSkills}>
                                            <span className={styles.skillsLabel}>
                                                Skills:
                                            </span>
                                            <div className={styles.skillsList}>
                                                {job.skills.map((skill, index) => (
                                                    <span
                                                        key={index}
                                                        className={styles.skillPill}
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div
                                    className={`timeline-dot ${styles.timelineDot}`}
                                >
                                    <span className={styles.timelineDotInner} />
                                </div>
                                <div className={styles.jobRight}>
                                    <div className={styles.highlight} />
                                    <ul className={styles.jobList}>
                                        {job.description.map((item, index) => {
                                            const isSubItem =
                                                item.startsWith("  -") ||
                                                item.startsWith("  ");
                                            const cleanText = item
                                                .replace(/^\s+-\s*/, "")
                                                .trim();

                                            return (
                                                <li
                                                    key={index}
                                                    className={`list-item-bullet ${isSubItem ? styles.subItem : ""}`}
                                                >
                                                    <span
                                                        className={`list-bullet ${isSubItem ? styles.subBullet : ""}`}
                                                    />
                                                    <span
                                                        className={styles.jobText}
                                                    >
                                                        {parseDescription(
                                                            cleanText,
                                                        )}
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

                                    {job.skills && job.skills.length > 0 && (
                                        <div className={styles.jobSkillsMobile}>
                                            <span className={styles.skillsLabel}>
                                                Skills:
                                            </span>
                                            <div className={styles.skillsList}>
                                                {job.skills.map((skill, index) => (
                                                    <span
                                                        key={index}
                                                        className={styles.skillPill}
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <ul className={styles.jobListMobile}>
                                        {job.description.map((item, index) => {
                                            const isSubItem =
                                                item.startsWith("  -") ||
                                                item.startsWith("  ");
                                            const cleanText = item
                                                .replace(/^\s+-\s*/, "")
                                                .trim();

                                            return (
                                                <li
                                                    key={index}
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
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
