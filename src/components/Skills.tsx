import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiChevronRight } from "react-icons/hi";
import { FiBookOpen } from "react-icons/fi";
import skillsData from "../content/skills.json";

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

function SkillNode({ item, depth = 0 }: { item: SkillItem; depth?: number }) {
    const hasChildren = item.children && item.children.length > 0;
    const [isOpen, setIsOpen] = useState(depth < 1);

    return (
        <li className="list-none">
            <button
                type="button"
                onClick={() => hasChildren && setIsOpen(!isOpen)}
                className={`flex items-center gap-2 w-full text-left py-1.5 px-2 rounded-md transition-colors duration-200 ${
                    hasChildren
                        ? "cursor-pointer hover:bg-(--bg-card-hover)"
                        : "cursor-default"
                }`}
                disabled={!hasChildren}
                aria-expanded={hasChildren ? isOpen : undefined}
            >
                {/* Expand/collapse chevron or bullet */}
                {hasChildren ? (
                    <motion.span
                        initial={false}
                        animate={{ rotate: isOpen ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="shrink-0"
                        style={{ color: "var(--accent-purple)" }}
                    >
                        <HiChevronRight size={14} />
                    </motion.span>
                ) : (
                    <span
                        className="shrink-0 w-1.5 h-1.5 rounded-full ml-0.5 mr-0.5"
                        style={{
                            background: "var(--accent-purple)",
                            opacity: 0.6,
                        }}
                    />
                )}

                {/* Skill name */}
                <span
                    className={`text-sm leading-snug ${
                        hasChildren ? "font-medium" : "font-normal"
                    }`}
                    style={{
                        color: hasChildren
                            ? "var(--text-primary)"
                            : "var(--text-secondary)",
                    }}
                >
                    {item.name}
                </span>

                {/* Learning badge */}
                {item.learning && (
                    <span
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium shrink-0"
                        style={{
                            background: "rgba(159, 0, 255, 0.1)",
                            color: "var(--accent-purple)",
                            border: "1px solid rgba(159, 0, 255, 0.2)",
                        }}
                        title="Learning or never applied"
                    >
                        <FiBookOpen size={10} />
                        <span className="hidden sm:inline">learning</span>
                        <span className="sm:hidden">*</span>
                    </span>
                )}
            </button>

            {/* Children */}
            <AnimatePresence initial={false}>
                {hasChildren && isOpen && (
                    <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                        style={{
                            paddingLeft: `${(depth + 1) * 12 + 8}px`,
                            borderLeft:
                                depth < 2
                                    ? "1px solid var(--border-secondary)"
                                    : "none",
                            marginLeft: depth < 2 ? "14px" : "0",
                        }}
                    >
                        {item.children!.map((child, i) => (
                            <SkillNode
                                key={`${child.name}-${i}`}
                                item={child}
                                depth={depth + 1}
                            />
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </li>
    );
}

function SkillCard({
    category,
    index,
}: {
    category: SkillCategory;
    index: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="rounded-xl border p-5 md:p-6 card-hover h-full"
            style={{
                background: "var(--bg-card)",
                borderColor: "var(--border-primary)",
            }}
        >
            {/* Category Title */}
            <div
                className="flex items-center gap-2 mb-5 pb-3 border-b"
                style={{ borderColor: "var(--border-secondary)" }}
            >
                <div
                    className="w-1 h-6 rounded-full"
                    style={{
                        background:
                            "linear-gradient(to bottom, var(--accent-gradient-start), var(--accent-gradient-end))",
                    }}
                />
                <h3
                    className="text-base md:text-lg font-bold"
                    style={{ color: "var(--text-primary)" }}
                >
                    {category.title}
                </h3>
            </div>

            {/* Skill Tree */}
            <ul className="space-y-0.5">
                {category.items.map((item, i) => (
                    <SkillNode
                        key={`${item.name}-${i}`}
                        item={item}
                        depth={0}
                    />
                ))}
            </ul>
        </motion.div>
    );
}

export default function Skills() {
    return (
        <section
            id="skills"
            className="relative py-20 md:py-28"
            style={{ background: "var(--bg-primary)" }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-14"
                >
                    <h2 className="section-heading">Skills</h2>
                    <div className="section-divider mt-3" />
                </motion.div>

                {/* Skills Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {(skillsData as SkillCategory[]).map((category, index) => (
                        <SkillCard
                            key={category.id}
                            category={category}
                            index={index}
                        />
                    ))}
                </div>

                {/* Legend */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex items-center justify-center gap-2 mt-10"
                >
                    <span
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                        style={{
                            background: "rgba(159, 0, 255, 0.1)",
                            color: "var(--accent-purple)",
                            border: "1px solid rgba(159, 0, 255, 0.2)",
                        }}
                    >
                        <FiBookOpen size={12} />
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
