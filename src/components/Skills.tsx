import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiChevronRight } from "react-icons/hi";
import { FiBookOpen } from "react-icons/fi";
import skillsData from "../content/skills.json";

/* ─── Types ───────────────────────────────────────────────────────── */

interface SkillItem {
    name: string;
    learning?: boolean;
    children?: SkillItem[];
}

interface SkillCategory {
    id: string;
    title: string;
    items: SkillItem[];
}

/* ─── Inline Tag Badge ────────────────────────────────────────────── */

function SkillTag({ item }: { item: SkillItem }) {
    return (
        <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold leading-none select-none shadow-sm transition-all hover:scale-105 hover:shadow-md"
            style={{
                background: item.learning
                    ? "var(--bg-card)"
                    : "var(--bg-tertiary)",
                color: item.learning
                    ? "var(--accent-purple)"
                    : "var(--text-primary)",
                border: item.learning
                    ? "1px dashed rgba(159, 0, 255, 0.4)"
                    : "1px solid var(--border-primary)",
            }}
            title={item.learning ? `${item.name} (learning)` : item.name}
        >
            {item.name}
            {item.learning && (
                <FiBookOpen size={12} style={{ opacity: 0.8, flexShrink: 0 }} />
            )}
        </span>
    );
}

/* ─── Collapsible Tree Node (for Detailed Breakdown) ─────────────── */

function SkillNode({ item, depth = 0 }: { item: SkillItem; depth?: number }) {
    const hasChildren = item.children && item.children.length > 0;
    const [isOpen, setIsOpen] = useState(depth < 1);

    return (
        <li className="list-none mb-3 last:mb-0">
            <div className="flex flex-col gap-2">
                <button
                    type="button"
                    onClick={() => hasChildren && setIsOpen(!isOpen)}
                    className={`flex items-center gap-2 w-full text-left transition-colors duration-200 ${
                        hasChildren ? "cursor-pointer" : "cursor-default"
                    }`}
                    disabled={!hasChildren}
                    aria-expanded={hasChildren ? isOpen : undefined}
                >
                    {hasChildren ? (
                        <motion.span
                            initial={false}
                            animate={{ rotate: isOpen ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="shrink-0"
                            style={{ color: "var(--accent-purple)" }}
                        >
                            <HiChevronRight size={16} />
                        </motion.span>
                    ) : (
                        <span
                            className="shrink-0 w-2 h-2 rounded-full ml-0.5 mr-1"
                            style={{
                                background: "var(--accent-purple)",
                                opacity: 0.8,
                            }}
                        />
                    )}

                    <span
                        className={`text-sm md:text-base leading-snug ${
                            hasChildren ? "font-bold" : "font-medium"
                        }`}
                        style={{
                            color: hasChildren
                                ? "var(--text-primary)"
                                : "var(--text-secondary)",
                        }}
                    >
                        {item.name}
                    </span>
                </button>

                <AnimatePresence initial={false}>
                    {hasChildren && isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="overflow-hidden"
                            style={{
                                paddingLeft: `${(depth + 1) * 12 + 8}px`,
                                marginLeft: depth < 2 ? "12px" : "0",
                            }}
                        >
                            <div className="flex flex-wrap gap-2 pt-1 pb-2">
                                {item.children!.map((child, i) => {
                                    if (
                                        !child.children ||
                                        child.children.length === 0
                                    ) {
                                        return (
                                            <SkillTag
                                                key={`${child.name}-${i}`}
                                                item={child}
                                            />
                                        );
                                    }
                                    return (
                                        <div
                                            key={`${child.name}-${i}`}
                                            className="w-full mt-2"
                                        >
                                            <SkillNode
                                                item={child}
                                                depth={depth + 1}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </li>
    );
}

/* ─── Unified Skill Card ──────────────────────────────────────────── */

function SkillCard({ category }: { category: SkillCategory }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="rounded-xl border p-5 md:p-6 flex flex-col gap-4"
            style={{
                background: "var(--bg-card)",
                borderColor: "var(--border-primary)",
            }}
        >
            <div
                className="flex items-center gap-3 pb-4 border-b mb-2"
                style={{ borderColor: "var(--border-secondary)" }}
            >
                <div
                    className="w-1.5 h-6 rounded-full shrink-0"
                    style={{
                        background:
                            "linear-gradient(to bottom, var(--accent-gradient-start), var(--accent-gradient-end))",
                    }}
                />
                <h3
                    className="text-lg md:text-xl font-bold"
                    style={{ color: "var(--text-primary)" }}
                >
                    {category.title}
                </h3>
            </div>

            {/* Structured Breakdown containing Badges */}
            <div className="pt-2">
                <ul className="space-y-1">
                    {category.items.map((item, i) => (
                        <SkillNode
                            key={`${item.name}-${i}`}
                            item={item}
                            depth={0}
                        />
                    ))}
                </ul>
            </div>
        </motion.div>
    );
}

/* ─── Main Section ────────────────────────────────────────────────── */

export default function Skills() {
    const categories = skillsData as SkillCategory[];

    return (
        <section
            id="skills"
            className="skills-section section-glow-bg relative mt-32 md:mt-48 py-20 md:py-32"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-20 md:mb-32"
                >
                    <h2 className="section-heading">Skills</h2>
                    <div className="section-divider mt-3" />
                </motion.div>

                {/* Skills Grid — unified cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {categories.map((category) => (
                        <SkillCard key={category.title} category={category} />
                    ))}
                </div>

                {/* Legend */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex flex-wrap items-center justify-center gap-3 mt-10"
                >
                    <span
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium"
                        style={{
                            background: "rgba(159, 0, 255, 0.07)",
                            color: "var(--accent-purple)",
                            border: "1px solid rgba(159, 0, 255, 0.2)",
                        }}
                    >
                        <FiBookOpen size={10} />
                        learning
                    </span>
                    <span
                        className="text-xs"
                        style={{ color: "var(--text-muted)" }}
                    >
                        — currently learning or never applied in production
                    </span>
                </motion.div>
            </div>
        </section>
    );
}
