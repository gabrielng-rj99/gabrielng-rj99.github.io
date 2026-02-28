import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import experienceData from "../content/experience.json";

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
            className="experience-section section-glow-bg relative mt-32 md:mt-48 py-20 md:py-32"
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5 }}
                    className="experience-header"
                >
                    <h2 className="section-heading">Experience</h2>
                    <div className="section-divider" />
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="experience-timeline"
                >
                    <div className="timeline-line-desktop" />
                    <div className="timeline-line-mobile" />

                    {experienceData.map((job) => (
                        <motion.div
                            key={job.id}
                            variants={itemVariants}
                            className="experience-job"
                        >
                            <div className="experience-job-desktop">
                                <div className="experience-job-left">
                                    <h3 className="job-role">{job.role}</h3>
                                    <h4 className="job-company">
                                        {job.company}
                                    </h4>
                                    <h5 className="job-period">{job.period}</h5>
                                    <h6 className="job-location">
                                        {job.location}
                                    </h6>
                                </div>

                                <div className="experience-job-right">
                                    <div className="experience-timeline-dot">
                                        <span className="experience-timeline-dot-inner" />
                                    </div>
                                    <div className="experience-highlight" />
                                    <ul className="experience-list">
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
                                                    className={`experience-list-item ${isSubItem ? "sub-item" : ""}`}
                                                >
                                                    <span
                                                        className={`experience-bullet ${isSubItem ? "sub-bullet" : ""}`}
                                                    />
                                                    <span className="experience-text">
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
                                className="experience-job-mobile"
                            >
                                <div className="experience-timeline-dot-mobile">
                                    <span className="experience-timeline-dot-inner" />
                                </div>
                                <div className="experience-job-content-mobile">
                                    <div className="experience-highlight-mobile" />
                                    <h3 className="job-role-mobile">
                                        {job.role}
                                    </h3>
                                    <h4 className="job-company-mobile">
                                        {job.company}
                                    </h4>
                                    <div className="job-meta-mobile">
                                        <span className="job-period-mobile">
                                            {job.period}
                                        </span>
                                        <span className="job-location-mobile">
                                            {job.location}
                                        </span>
                                    </div>
                                    <ul className="experience-list-mobile">
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
                                                    className={`experience-list-item-mobile ${isSubItem ? "sub-item" : ""}`}
                                                >
                                                    <span
                                                        className={`experience-bullet-mobile ${isSubItem ? "sub-bullet" : ""}`}
                                                    />
                                                    <span className="experience-text-mobile">
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
