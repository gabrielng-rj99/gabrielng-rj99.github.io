import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiChevronRight } from "react-icons/hi";
import { FiBookOpen } from "react-icons/fi";
import skillsData from "../content/skills.json";
import styles from "./Skills.module.css";

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
            className={styles.tag}
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
                <FiBookOpen size={12} className={styles.tagIcon} />
            )}
        </span>
    );
}

/* ─── Collapsible Tree Node (for Detailed Breakdown) ─────────────── */

function SkillNode({ item, depth = 0 }: { item: SkillItem; depth?: number }) {
    const hasChildren = item.children && item.children.length > 0;
    const [isOpen, setIsOpen] = useState(depth < 1);

    return (
        <li className={styles.skillNode}>
            <div className={styles.skillNodeContent}>
                <button
                    type="button"
                    onClick={() => hasChildren && setIsOpen(!isOpen)}
                    className={`${styles.skillButton} ${
                        hasChildren ? styles.skillButtonCursor : styles.skillButtonCursorDisabled
                    }`}
                    disabled={!hasChildren}
                    aria-expanded={hasChildren ? isOpen : undefined}
                >
                    {hasChildren ? (
                        <motion.span
                            initial={false}
                            animate={{ rotate: isOpen ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                            className={styles.skillChevron}
                            style={{ color: "var(--accent-purple)" }}
                        >
                            <HiChevronRight size={16} />
                        </motion.span>
                    ) : (
                        <span
                            className={styles.skillDot}
                            style={{
                                background: "var(--accent-purple)",
                                opacity: 0.8,
                            }}
                        />
                    )}

                    <span
                        className={`${styles.skillName} ${
                            hasChildren ? styles.skillNameBold : ""
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
                            className={styles.nestedContainer}
                            style={{
                                paddingLeft: `${(depth + 1) * 12 + 8}px`,
                                marginLeft: depth < 2 ? "12px" : "0",
                            }}
                        >
                            <div className={styles.nestedTags}>
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
                                            className={styles.nestedSkillNode}
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
            className={styles.card}
            style={{
                background: "var(--bg-card)",
                borderColor: "var(--border-primary)",
            }}
        >
            <div
                className={styles.cardHeader}
                style={{ borderColor: "var(--border-secondary)" }}
            >
                <div
                    className={styles.cardAccent}
                    style={{
                        background:
                            "linear-gradient(to bottom, var(--accent-gradient-start), var(--accent-gradient-end))",
                    }}
                />
                <h3
                    className={styles.cardTitle}
                    style={{ color: "var(--text-primary)" }}
                >
                    {category.title}
                </h3>
            </div>

            {/* Structured Breakdown containing Badges */}
            <div>
                <ul className={styles.skillList}>
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
            className={styles.section}
        >
            <div className={styles.container}>
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5 }}
                    className={styles.header}
                >
                    <h2 className={styles.heading}>Skills</h2>
                    <div className={styles.divider} />
                </motion.div>

                {/* Skills Grid — unified cards */}
                <div className={styles.grid}>
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
                    className={styles.legend}
                >
                    <span
                        className={styles.legendTag}
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
                        className={styles.legendText}
                        style={{ color: "var(--text-muted)" }}
                    >
                        — currently learning or never applied in production
                    </span>
                </motion.div>
            </div>
        </section>
    );
}
