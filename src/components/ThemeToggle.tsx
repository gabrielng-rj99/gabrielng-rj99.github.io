import { motion } from "framer-motion";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../hooks/useTheme";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    return (
        <motion.button
            onClick={toggleTheme}
            className="no-theme-transition flex items-center gap-2 rounded-full px-3 py-2 cursor-pointer shadow-lg backdrop-blur-md border"
            style={{
                background: isDark
                    ? "rgba(26, 26, 46, 0.8)"
                    : "rgba(255, 255, 255, 0.8)",
                borderColor: isDark
                    ? "var(--border-muted)"
                    : "var(--border-primary)",
            }}
            initial={false}
            animate={{
                boxShadow: isDark
                    ? "0 4px 24px rgba(180, 77, 255, 0.15)"
                    : "0 4px 24px rgba(159, 0, 255, 0.1)",
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
            <div
                className="relative w-12 h-6 rounded-full overflow-hidden"
                style={{
                    background: isDark
                        ? "linear-gradient(to right, #1a1a40, #2d2d5e)"
                        : "linear-gradient(to right, #f0e6ff, #e6d0ff)",
                }}
            >
                {/* Track background icons */}
                <div className="absolute inset-0 flex items-center justify-between px-1.5">
                    <FiMoon
                        size={12}
                        style={{
                            color: isDark ? "var(--accent-neon)" : "#c4b5fd",
                            opacity: isDark ? 0.4 : 0.3,
                        }}
                    />
                    <FiSun
                        size={12}
                        style={{
                            color: isDark ? "#6b7190" : "#f59e0b",
                            opacity: isDark ? 0.3 : 0.4,
                        }}
                    />
                </div>

                {/* Sliding knob */}
                <motion.div
                    className="absolute top-0.5 w-5 h-5 rounded-full flex items-center justify-center shadow-md"
                    initial={false}
                    animate={{
                        x: isDark ? 26 : 2,
                        background: isDark
                            ? "linear-gradient(135deg, #2d2d5e, #4a3a8a)"
                            : "linear-gradient(135deg, #ffffff, #f3e8ff)",
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                    }}
                >
                    <motion.div
                        initial={false}
                        animate={{ rotate: isDark ? 0 : 180 }}
                        transition={{ duration: 0.4 }}
                    >
                        {isDark ? (
                            <FiMoon
                                size={12}
                                style={{ color: "var(--accent-neon)" }}
                            />
                        ) : (
                            <FiSun size={12} style={{ color: "#f59e0b" }} />
                        )}
                    </motion.div>
                </motion.div>
            </div>
        </motion.button>
    );
}
