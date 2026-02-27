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
    hidden: {
        opacity: 0,
        y: 20,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut" as const,
        },
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
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-20 md:mb-32"
                >
                    <h2 className="section-heading">Experience</h2>
                    <div className="section-divider mt-3" />
                </motion.div>

                {/* Timeline Container */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="relative"
                >
                    {/* Vertical line — slightly offset to mimic the Bootstrap 5/7 split */}
                    <div
                        className="hidden md:block absolute top-0 bottom-0 w-px"
                        style={{
                            background: "var(--border-primary)",
                            left: "35%", /* Roughly where col-md-5 ends */
                        }}
                    />

                    {/* Vertical line — mobile only */}
                    <div
                        className="block md:hidden absolute left-6 top-0 bottom-0 w-px"
                        style={{ background: "var(--border-primary)" }}
                    />

                    {experienceData.map((job, index) => (
                        <div key={job.id} className="relative mb-14 last:mb-0">
                            {/* ===== Desktop Layout (Always Header Left, Body Right) ===== */}
                            <motion.div
                                variants={itemVariants}
                                className="hidden md:flex items-start"
                            >
                                {/* Left side (Header) - approx 35% width */}
                                <div className="w-[35%] text-right pr-10 flex flex-col items-end">
                                    <h2 className="text-xl font-bold tracking-tight mb-1" style={{ color: "var(--text-primary)" }}>
                                        {job.role}
                                    </h2>
                                    <h3 className="text-base font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>
                                        {job.company}
                                    </h3>
                                    <h4 className="text-sm font-medium mb-1" style={{ color: "var(--accent-purple)" }}>
                                        {job.period}
                                    </h4>
                                    <h5 className="text-sm" style={{ color: "var(--text-muted)" }}>
                                        {job.location}
                                    </h5>
                                </div>

                                {/* Center dot — desktop */}
                                <div
                                    className="absolute w-4 h-4 rounded-full border-2 flex items-center justify-center z-10"
                                    style={{
                                        borderColor: "var(--accent-purple)",
                                        background: "var(--bg-secondary)",
                                        left: "35%",
                                        transform: "translateX(-50%)",
                                        top: "6px"
                                    }}
                                >
                                    <div
                                        className="w-2 h-2 rounded-full"
                                        style={{ background: "var(--accent-purple)" }}
                                    />
                                </div>

                                {/* Right side (Body) - approx 65% width */}
                                <div className="w-[65%] pl-12">
                                    <ul className="space-y-3 list-none p-0 m-0">
                                        {job.description.map((item, i) => {
                                            const isSubItem = item.startsWith("  -") || item.startsWith("  ");
                                            const cleanText = item.replace(/^\s+-\s*/, "").trim();

                                            return (
                                                <li
                                                    key={i}
                                                    className="text-[15px] leading-relaxed flex items-start gap-3"
                                                    style={{
                                                        color: "var(--text-secondary)",
                                                        paddingLeft: isSubItem ? "1.5rem" : "0",
                                                    }}
                                                >
                                                    <span
                                                        className="mt-2 w-1.5 h-1.5 rounded-full shrink-0"
                                                        style={{
                                                            background: isSubItem
                                                                ? "var(--accent-magenta)"
                                                                : "var(--accent-purple)",
                                                        }}
                                                    />
                                                    <span>{cleanText}</span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </motion.div>

                            {/* ===== Mobile Layout (single column) ===== */}
                            <motion.div
                                variants={mobileItemVariants}
                                className="md:hidden relative pl-14"
                            >
                                {/* Left dot — mobile */}
                                <div
                                    className="absolute left-6 top-2 w-4 h-4 rounded-full border-2 flex items-center justify-center z-10 -translate-x-1/2"
                                    style={{
                                        borderColor: "var(--accent-purple)",
                                        background: "var(--bg-secondary)",
                                    }}
                                >
                                    <div
                                        className="w-2 h-2 rounded-full"
                                        style={{ background: "var(--accent-purple)" }}
                                    />
                                </div>

                                {/* Content */}
                                <div className="mb-4">
                                    <h2 className="text-lg font-bold mb-1" style={{ color: "var(--text-primary)" }}>
                                        {job.role}
                                    </h2>
                                    <h3 className="text-base font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>
                                        {job.company}
                                    </h3>
                                    <div className="flex gap-4 mb-4 text-sm font-medium">
                                        <span style={{ color: "var(--accent-purple)" }}>{job.period}</span>
                                        <span style={{ color: "var(--text-muted)" }}>{job.location}</span>
                                    </div>
                                    <ul className="space-y-3 list-none p-0 m-0">
                                        {job.description.map((item, i) => {
                                            const isSubItem = item.startsWith("  -") || item.startsWith("  ");
                                            const cleanText = item.replace(/^\s+-\s*/, "").trim();

                                            return (
                                                <li
                                                    key={i}
                                                    className="text-sm leading-relaxed flex items-start gap-2.5"
                                                    style={{
                                                        color: "var(--text-secondary)",
                                                        paddingLeft: isSubItem ? "1rem" : "0",
                                                    }}
                                                >
                                                    <span
                                                        className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                                                        style={{
                                                            background: isSubItem
                                                                ? "var(--accent-magenta)"
                                                                : "var(--accent-purple)",
                                                        }}
                                                    />
                                                    <span>{cleanText}</span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}


