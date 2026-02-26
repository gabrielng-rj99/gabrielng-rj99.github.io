import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { HiBriefcase } from "react-icons/hi";
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

const itemVariants = (index: number): Variants => ({
    hidden: {
        opacity: 0,
        x: index % 2 === 0 ? -50 : 50,
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut" as const,
        },
    },
});

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
            className="relative py-20 md:py-28"
            style={{ background: "var(--bg-secondary)" }}
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="section-heading">Experience</h2>
                    <div className="section-divider mt-3" />
                </motion.div>

                {/* Timeline */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="relative"
                >
                    {/* Vertical line — desktop only */}
                    <div
                        className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
                        style={{ background: "var(--border-muted)" }}
                    />

                    {/* Vertical line — mobile only */}
                    <div
                        className="block md:hidden absolute left-6 top-0 bottom-0 w-px"
                        style={{ background: "var(--border-muted)" }}
                    />

                    {experienceData.map((job, index) => (
                        <div key={job.id} className="relative mb-12 last:mb-0">
                            {/* ===== Desktop Layout (alternating sides) ===== */}
                            <motion.div
                                variants={itemVariants(index)}
                                className="hidden md:grid md:grid-cols-[1fr_auto_1fr] items-start"
                            >
                                {index % 2 === 0 ? (
                                    <>
                                        <TimelineHeader
                                            job={job}
                                            align="right"
                                        />
                                        {/* Center dot — desktop */}
                                        <TimelineDot />
                                        <TimelineBody job={job} />
                                    </>
                                ) : (
                                    <>
                                        <TimelineBody job={job} align="right" />
                                        {/* Center dot — desktop */}
                                        <TimelineDot />
                                        <TimelineHeader
                                            job={job}
                                            align="left"
                                        />
                                    </>
                                )}
                            </motion.div>

                            {/* ===== Mobile Layout (single column) ===== */}
                            <motion.div
                                variants={mobileItemVariants}
                                className="md:hidden relative pl-14"
                            >
                                {/* Left dot — mobile */}
                                <div
                                    className="absolute left-4 top-2 w-5 h-5 rounded-full border-2 flex items-center justify-center z-10 -translate-x-1/2"
                                    style={{
                                        borderColor: "var(--accent-purple)",
                                        background: "var(--bg-secondary)",
                                    }}
                                >
                                    <div
                                        className="w-2.5 h-2.5 rounded-full"
                                        style={{
                                            background: "var(--accent-purple)",
                                        }}
                                    />
                                </div>

                                {/* Card */}
                                <div
                                    className="rounded-xl p-5 border card-hover"
                                    style={{
                                        background: "var(--bg-card)",
                                        borderColor: "var(--border-primary)",
                                    }}
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <HiBriefcase
                                            size={16}
                                            style={{
                                                color: "var(--accent-purple)",
                                            }}
                                        />
                                        <span
                                            className="text-xs font-medium"
                                            style={{
                                                color: "var(--accent-purple)",
                                            }}
                                        >
                                            {job.period}
                                        </span>
                                    </div>

                                    <h3
                                        className="text-base font-bold mb-0.5"
                                        style={{ color: "var(--text-primary)" }}
                                    >
                                        {job.role}
                                    </h3>
                                    <h4
                                        className="text-sm font-semibold mb-1"
                                        style={{
                                            color: "var(--text-secondary)",
                                        }}
                                    >
                                        {job.company}
                                    </h4>
                                    <p
                                        className="text-xs mb-3"
                                        style={{ color: "var(--text-muted)" }}
                                    >
                                        {job.location}
                                    </p>

                                    <ul className="space-y-1.5 list-none p-0 m-0">
                                        {job.description.map((item, i) => (
                                            <li
                                                key={i}
                                                className="text-xs leading-relaxed flex items-start gap-2"
                                                style={{
                                                    color: "var(--text-tertiary)",
                                                    paddingLeft:
                                                        item.startsWith("  -")
                                                            ? "1rem"
                                                            : "0",
                                                }}
                                            >
                                                <span
                                                    className="mt-1.5 w-1 h-1 rounded-full shrink-0"
                                                    style={{
                                                        background:
                                                            "var(--accent-purple)",
                                                    }}
                                                />
                                                {item.replace(/^\s+-\s*/, "")}
                                            </li>
                                        ))}
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

/* ─── Sub-components ────────────────────────────────────────────────── */

function TimelineDot() {
    return (
        <div className="flex justify-center px-4 pt-1">
            <div
                className="w-4 h-4 rounded-full border-2 flex items-center justify-center z-10"
                style={{
                    borderColor: "var(--accent-purple)",
                    background: "var(--bg-secondary)",
                }}
            >
                <div
                    className="w-2 h-2 rounded-full"
                    style={{
                        background: "var(--accent-purple)",
                    }}
                />
            </div>
        </div>
    );
}

interface TimelineHeaderProps {
    job: (typeof experienceData)[number];
    align?: "left" | "right";
}

function TimelineHeader({ job, align = "left" }: TimelineHeaderProps) {
    const isRight = align === "right";

    return (
        <div className={`${isRight ? "text-right pr-4" : "text-left pl-4"}`}>
            <div
                className={`flex items-center gap-2 mb-2 ${
                    isRight ? "justify-end" : "justify-start"
                }`}
            >
                {!isRight && (
                    <HiBriefcase
                        size={16}
                        style={{ color: "var(--accent-purple)" }}
                    />
                )}
                <span
                    className="text-xs font-medium tracking-wide uppercase"
                    style={{ color: "var(--accent-purple)" }}
                >
                    {job.period}
                </span>
                {isRight && (
                    <HiBriefcase
                        size={16}
                        style={{ color: "var(--accent-purple)" }}
                    />
                )}
            </div>

            <h3
                className="text-xl font-bold mb-1"
                style={{ color: "var(--text-primary)" }}
            >
                {job.role}
            </h3>
            <h4
                className="text-base font-semibold mb-1"
                style={{ color: "var(--text-secondary)" }}
            >
                {job.company}
            </h4>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                {job.location}
            </p>
        </div>
    );
}

interface TimelineBodyProps {
    job: (typeof experienceData)[number];
    align?: "left" | "right";
}

function TimelineBody({ job, align = "left" }: TimelineBodyProps) {
    const isRight = align === "right";

    return (
        <div className={`${isRight ? "pr-4" : "pl-4"}`}>
            <div
                className="rounded-xl p-6 border card-hover"
                style={{
                    background: "var(--bg-card)",
                    borderColor: "var(--border-primary)",
                }}
            >
                <ul className="space-y-2 list-none p-0 m-0">
                    {job.description.map((item, i) => {
                        const isSubItem =
                            item.startsWith("  -") || item.startsWith("  ");
                        const cleanText = item.replace(/^\s+-\s*/, "").trim();

                        return (
                            <li
                                key={i}
                                className="text-sm leading-relaxed flex items-start gap-2.5"
                                style={{
                                    color: "var(--text-tertiary)",
                                    paddingLeft: isSubItem ? "1.25rem" : "0",
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
                                {cleanText}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}
