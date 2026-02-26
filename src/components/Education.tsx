import { motion } from "framer-motion";
import { HiAcademicCap, HiLocationMarker } from "react-icons/hi";
import educationData from "../content/education.json";

const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: (index: number) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.6,
            delay: index * 0.15,
            ease: "easeOut" as const,
        },
    }),
};

export default function Education() {
    return (
        <section
            id="education"
            className="relative py-20 md:py-28"
            style={{ background: "var(--bg-secondary)" }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="section-heading">Education</h2>
                    <div className="section-divider mt-3" />
                </motion.div>

                {/* Horizontal Timeline */}
                <div className="relative">
                    {/* Horizontal line connecting cards — desktop */}
                    <div
                        className="hidden lg:block absolute top-[72px] left-[10%] right-[10%] h-px z-0"
                        style={{ background: "var(--border-muted)" }}
                    />

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-6 relative z-10">
                        {educationData.map((edu, index) => (
                            <motion.div
                                key={edu.id}
                                custom={index}
                                variants={cardVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-60px" }}
                                className="flex flex-col items-center"
                            >
                                {/* Period Badge */}
                                <div
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-sm"
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
                                    className="text-center text-sm font-bold uppercase tracking-wide mb-4"
                                    style={{ color: "var(--accent-purple)" }}
                                >
                                    {edu.degree}
                                </h3>

                                {/* Timeline Dot — desktop only */}
                                <div className="hidden lg:flex flex-col items-center mb-4">
                                    <div
                                        className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                                        style={{
                                            borderColor: "var(--accent-purple)",
                                            background: "var(--bg-secondary)",
                                        }}
                                    >
                                        <div
                                            className="w-2 h-2 rounded-full"
                                            style={{
                                                background:
                                                    "var(--accent-purple)",
                                            }}
                                        />
                                    </div>
                                    <div
                                        className="w-px h-5"
                                        style={{
                                            background: "var(--border-muted)",
                                        }}
                                    />
                                </div>

                                {/* Card */}
                                <div
                                    className="w-full rounded-xl border p-5 md:p-6 card-hover flex-1"
                                    style={{
                                        background: "var(--bg-card)",
                                        borderColor: "var(--border-primary)",
                                    }}
                                >
                                    {/* Institution */}
                                    <h4
                                        className="text-base font-bold mb-1"
                                        style={{ color: "var(--text-primary)" }}
                                    >
                                        {edu.institution}
                                    </h4>

                                    {/* Location */}
                                    <div
                                        className="flex items-center gap-1.5 mb-4"
                                        style={{ color: "var(--text-muted)" }}
                                    >
                                        <HiLocationMarker size={14} />
                                        <span className="text-xs">
                                            {edu.location}
                                        </span>
                                    </div>

                                    {/* Description */}
                                    <ul className="space-y-2 list-none p-0 m-0">
                                        {edu.description.map((item, i) => (
                                            <li
                                                key={i}
                                                className="text-sm leading-relaxed flex items-start gap-2.5"
                                                style={{
                                                    color: "var(--text-tertiary)",
                                                }}
                                            >
                                                <span
                                                    className="mt-2 w-1.5 h-1.5 rounded-full shrink-0"
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
