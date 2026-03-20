import React from "react";
import { motion } from "framer-motion";
import { HiDownload } from "react-icons/hi";
import aboutData from "../content/about.json";
import { NAV_HEIGHT_OFFSET } from "./navigation.constants";
import styles from "./Hero.module.css";

export default function Hero() {
    const headlineParts = aboutData.headline.split("\n");

    return (
        <div className={styles.hero}>
            <div className={styles.heroContent}>
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h1 className={styles.heroHeadline}>
                        {headlineParts.map((part, index) => (
                            <React.Fragment key={index}>
                                {index > 0 && <br />}
                                <span className="text-gradient-animated">
                                {part.split(/(-)/g).map((segment, i) =>
                                    segment === "-" ? (
                                        <span
                                            key={i}
                                            style={{
                                                color: "var(--accent-purple)",
                                                WebkitTextFillColor:
                                                    "var(--accent-purple)",
                                            }}
                                        >
                                            {segment}
                                        </span>
                                    ) : (
                                        <span key={i}>{segment}</span>
                                    ),
                                )}
                            </span>
                            </React.Fragment>
                        ))}
                    </h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.8,
                            delay: 0.3,
                            ease: "easeOut",
                        }}
                        className={styles.heroSubtitle}
                    >
                        {aboutData.subheadline}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.8,
                            delay: 0.6,
                            ease: "easeOut",
                        }}
                        className={styles.heroButtons}
                    >
                        <a
                            href={aboutData.resumeUrl}
                            download
                            className={`btn-accent ${styles.heroBtn}`}
                        >
                            <HiDownload size={18} />
                            Download Resume
                        </a>

                        <a
                            href="#portfolio"
                            onClick={(e) => {
                                e.preventDefault();
                                const target = document.querySelector("#portfolio");
                                if (target) {
                                    const targetPosition =
                                        target.getBoundingClientRect().top +
                                        window.scrollY -
                                        NAV_HEIGHT_OFFSET;
                                    window.scrollTo({
                                        top: targetPosition,
                                        behavior: "smooth",
                                    });
                                }
                            }}
                            className={`btn-outline ${styles.heroBtn}`}
                        >
                            View Portfolio
                        </a>
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                    className={styles.heroScrollIndicator}
                >
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className={styles.heroScrollMouse}
                    >
                        <motion.div
                            animate={{
                                opacity: [1, 0.3, 1],
                                y: [0, 8, 0],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className={styles.heroScrollDot}
                        />
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
