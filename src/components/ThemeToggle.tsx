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
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
            {/* Track de fundo */}
            <div className={styles.track}>
                {/* Indicador deslizante */}
                <motion.div
                    className={styles.indicator}
                    animate={{
                        x: isDark ? 28 : 0,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                    }}
                />
            </div>

            {/* Ícones - sempre visíveis mas com opacidade variável */}
            <div className={styles.icons}>
                <span className={`${styles.icon} ${!isDark ? styles.iconActive : ''}`}>
                    <FiSun size={16} />
                </span>
                <span className={`${styles.icon} ${isDark ? styles.iconActive : ''}`}>
                    <FiMoon size={16} />
                </span>
            </div>
        </motion.button>
    );
}
