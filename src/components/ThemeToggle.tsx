import { motion } from "framer-motion";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../hooks/useTheme";
import styles from "./ThemeToggle.module.css";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    return (
        <motion.button
            onClick={toggleTheme}
            className={styles.button}
            whileHover={{ scale: 1.1, background: "rgba(159, 0, 255, 0.1)" }}
            whileTap={{ scale: 0.9 }}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
            <motion.div
                initial={false}
                animate={{
                    scale: isDark ? 1 : 0,
                    opacity: isDark ? 1 : 0,
                    rotate: isDark ? 0 : 90
                }}
                transition={{ duration: 0.3 }}
                className={styles.iconContainer}
            >
                <FiMoon size={20} />
            </motion.div>

            <motion.div
                initial={false}
                animate={{
                    scale: isDark ? 0 : 1,
                    opacity: isDark ? 0 : 1,
                    rotate: isDark ? -90 : 0
                }}
                transition={{ duration: 0.3 }}
                className={styles.iconContainer}
            >
                <FiSun size={20} />
            </motion.div>
        </motion.button>
    );
}
