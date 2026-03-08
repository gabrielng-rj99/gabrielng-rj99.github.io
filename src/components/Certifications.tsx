import { motion } from "framer-motion";
import { HiExternalLink, HiBadgeCheck } from "react-icons/hi";
import { FiClock } from "react-icons/fi";
import certificationsData from "../content/certifications.json";
import certificatesData from "../content/certificates.json";
import styles from "./Certifications.module.css";

interface Certification {
    id: string;
    title: string;
    issuer: string;
    date: string;
    badgeImage: string;
    credentialUrl: string;
    status: "earned" | "planned";
}

interface Certificate {
    id: string;
    title: string;
    issuer: string;
    date: string;
    credentialUrl: string;
    description: string;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.15,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut" as const,
        },
    },
};

/* ─── Certification Badge Card ────────────────────────────────────── */

function CertificationCard({
    certification,
}: {
    certification: Certification;
}) {
    const isEarned = certification.status === "earned";
    const hasCredential =
        certification.credentialUrl && certification.credentialUrl.length > 0;

    const Wrapper = hasCredential ? motion.a : motion.div;
    const wrapperProps = hasCredential
        ? {
              href: certification.credentialUrl,
              target: "_blank",
              rel: "noopener noreferrer",
          }
        : {};

    return (
        <Wrapper
            {...(wrapperProps as Record<string, string>)}
            variants={cardVariants}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`${styles.certCard} ${hasCredential ? styles.certCardClickable : styles.certCardStatic}`}
        >
            {/* Status Badge */}
            <div
                className={styles.statusBadge}
                style={{
                    background: isEarned
                        ? "rgba(0, 200, 83, 0.1)"
                        : "rgba(159, 0, 255, 0.1)",
                    color: isEarned ? "#00c853" : "var(--accent-purple)",
                    border: `1px solid ${
                        isEarned
                            ? "rgba(0, 200, 83, 0.2)"
                            : "rgba(159, 0, 255, 0.2)"
                    }`,
                }}
            >
                {isEarned ? (
                    <>
                        <HiBadgeCheck size={12} />
                        <span>Earned</span>
                    </>
                ) : (
                    <>
                        <FiClock size={10} />
                        <span>Planned</span>
                    </>
                )}
            </div>

            {/* Badge Image */}
            <div
                className={styles.badgeImageContainer}
                style={{
                    background: "var(--bg-tertiary)",
                }}
            >
                {/* Glow on hover */}
                <div
                    className={styles.badgeGlow}
                    style={{
                        background:
                            "radial-gradient(circle, rgba(159, 0, 255, 0.15) 0%, transparent 70%)",
                    }}
                />
                <img
                    src={certification.badgeImage}
                    alt={`${certification.title} badge`}
                    className={`${styles.badgeImage} ${!isEarned ? styles.badgeImageUnearned : ""}`}
                    loading="lazy"
                    onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = "none";
                        const parent = target.parentElement;
                        if (
                            parent &&
                            !parent.querySelector("[data-badge-fallback]")
                        ) {
                            const fallback = document.createElement("div");
                            fallback.setAttribute(
                                "data-badge-fallback",
                                "true",
                            );
                            fallback.className = styles.badgeFallback;
                            fallback.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent-purple); opacity: 0.4;"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.77 4 4 0 0 1 0 6.76 4 4 0 0 1-4.78 4.77 4 4 0 0 1-6.74 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/></svg>`;
                            parent.appendChild(fallback);
                        }
                    }}
                />
            </div>

            {/* Title */}
            <h3
                className={styles.certTitle}
                style={{ color: "var(--text-primary)" }}
            >
                {certification.title}
            </h3>

            {/* Issuer */}
            <p
                className={styles.certIssuer}
                style={{ color: "var(--text-muted)" }}
            >
                {certification.issuer}
            </p>

            {/* Date (if earned) */}
            {isEarned && certification.date && (
                <p
                    className={styles.certDate}
                    style={{ color: "var(--text-tertiary)" }}
                >
                    {certification.date}
                </p>
            )}

            {/* Credential link indicator */}
            {hasCredential && (
                <div
                    className={styles.credentialLink}
                    style={{ color: "var(--accent-purple)" }}
                >
                    <span>Verify</span>
                    <HiExternalLink size={12} />
                </div>
            )}

            {/* Hover accent line */}
            <div
                className={styles.accentLine}
                style={{
                    background:
                        "linear-gradient(to right, var(--accent-gradient-start), var(--accent-gradient-end))",
                }}
            />
        </Wrapper>
    );
}

/* ─── Certificate List Item ───────────────────────────────────────── */

function CertificateCard({ certificate }: { certificate: Certificate }) {
    const hasCredential =
        certificate.credentialUrl && certificate.credentialUrl.length > 0;

    return (
        <motion.div
            variants={cardVariants}
            whileHover={{ y: -3 }}
            className={`${styles.certificateCard}`}
            style={{
                background: "var(--bg-card)",
                borderColor: "var(--border-primary)",
            }}
        >
            {/* Title */}
            <h4
                className={styles.certName}
                style={{ color: "var(--text-primary)" }}
            >
                {certificate.title}
            </h4>

            {/* Issuer */}
            <p
                className={styles.certIssuingOrg}
                style={{ color: "var(--accent-purple)" }}
            >
                {certificate.issuer}
            </p>

            {/* Date */}
            {certificate.date && (
                <p
                    className={styles.certDate2}
                    style={{ color: "var(--text-muted)" }}
                >
                    {certificate.date}
                </p>
            )}

            {/* Description */}
            {certificate.description && (
                <p
                    className={styles.certDescription}
                    style={{ color: "var(--text-tertiary)" }}
                >
                    {certificate.description}
                </p>
            )}

            {/* Credential link indicator */}
            {hasCredential && (
                <a
                    href={certificate.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.certCredentialLink}
                    style={{ color: "var(--accent-purple)" }}
                >
                    <span>View</span>
                    <HiExternalLink size={12} />
                </a>
            )}

            {/* Hover accent line */}
            <div
                className={styles.certAccentLine}
                style={{
                    background:
                        "linear-gradient(to right, var(--accent-gradient-start), var(--accent-gradient-end))",
                }}
            />
        </motion.div>
    );
}

/* ─── Main Section ────────────────────────────────────────────────── */

export default function Certifications() {
    const certifications = certificationsData as Certification[];
    const certificates = certificatesData as Certificate[];

    const hasCertifications = certifications.length > 0;
    const hasCertificates = certificates.length > 0;

    // Calculate columns: max 6, but use actual count if less
    // If more than 6, calculate equal distribution across rows
    const MAX_COLS = 6;
    const calcCols = (count: number) => {
        if (count <= MAX_COLS) return count;
        // For 7-8 items: use 4 cols (4+3 or 4+4)
        // For 9-12 items: use 6 cols (distribute evenly)
        const rows = Math.ceil(count / MAX_COLS);
        return Math.ceil(count / rows);
    };

    const badgeCols = calcCols(certifications.length);
    const certCols = calcCols(certificates.length);

    // Build grid style dynamically
    const badgeGridStyle = {
        gridTemplateColumns: `repeat(${badgeCols}, 1fr)`,
    } as React.CSSProperties;

    const certGridStyle = {
        gridTemplateColumns: `repeat(${certCols}, 1fr)`,
    } as React.CSSProperties;

    return (
        <>
            {/* ─── Certifications (Badges) ───────────────────────────── */}
            {hasCertifications && (
                <section
                    id="certifications"
                    className={`${styles.section} section-glow-bg`}
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
                            <h2 className="section-heading">Certifications</h2>
                            <div className="section-divider" />
                            <p
                                className={`${styles.descriptionText}`}
                                style={{ color: "var(--text-tertiary)" }}
                            >
                                Industry certifications and professional badges
                                that validate my skills and knowledge.
                            </p>
                        </motion.div>

                        {/* Badges Grid */}
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                            className={`${styles.badgesGrid}`}
                            style={badgeGridStyle}
                        >
                            {certifications.map((cert) => (
                                <CertificationCard
                                    key={cert.id}
                                    certification={cert}
                                />
                            ))}
                        </motion.div>

                        {/* Legend */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className={`${styles.legend} section-glow-bg`}
                        >
                            <div className={styles.legendItem}>
                                <span
                                    className={`${styles.legendBadge} ${styles.legendBadgeEarned}`}
                                >
                                    <HiBadgeCheck size={10} />
                                    Earned
                                </span>
                                <span className={`${styles.legendText}`}>
                                    — certified
                                </span>
                            </div>
                            <div className={styles.legendItem}>
                                <span
                                    className={`${styles.legendBadge} ${styles.legendBadgePlanned}`}
                                >
                                    <FiClock size={10} />
                                    Planned
                                </span>
                                <span className={`${styles.legendText}`}>
                                    — in progress or next goal
                                </span>
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* ─── Certificates (List) ───────────────────────────────── */}
            {hasCertificates && (
                <section
                    id="certificates"
                    className={`${styles.section} section-glow-bg`}
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
                            <h2 className="section-heading">Certificates</h2>
                            <div className="section-divider" />

                            <p
                                className={`${styles.descriptionText}`}
                                style={{ color: "var(--text-tertiary)" }}
                            >
                                Courses, programs, and training completed
                                throughout my career.
                            </p>
                        </motion.div>

                        {/* Certificates Grid */}
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                            className={styles.certificatesGrid}
                            style={certGridStyle}
                        >
                            {certificates.map((cert) => (
                                <CertificateCard
                                    key={cert.id}
                                    certificate={cert}
                                />
                            ))}
                        </motion.div>
                    </div>
                </section>
            )}
        </>
    );
}
