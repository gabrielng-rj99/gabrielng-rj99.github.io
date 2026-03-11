import { motion } from "framer-motion";
import { HiExternalLink, HiBadgeCheck, HiEye } from "react-icons/hi";
import { FiClock } from "react-icons/fi";
import certificationsData from "../content/certifications.json";
import certificatesData from "../content/certificates.json";
import certificatePreviewsData from "../content/certificate_previews.json";
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
            staggerChildren: 0.08,
            delayChildren: 0.1,
        },
    },
};

const hoverCardVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95, pointerEvents: "none" as const },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        pointerEvents: "auto" as const,
        transition: {
            duration: 0.2,
            ease: "easeOut" as const
        }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.4,
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
                    border: `1px solid ${isEarned
                        ? "rgba(0, 200, 83, 0.2)"
                        : "rgba(159, 0, 255, 0.2)"
                        }`,
                }}
            >
                {isEarned ? (
                    <>
                        <HiBadgeCheck size={12} />
                    </>
                ) : (
                    <>
                        <FiClock size={10} />
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

/* ─── Certificate Card (direct open on tap) ───────────────────────── */

function CertificateCard({
    certificate,
}: {
    certificate: Certificate;
}) {
    const hasCredential =
        certificate.credentialUrl && certificate.credentialUrl.length > 0;

    // Desktop: hover shows tooltip with URL preview
    // Mobile: tap directly opens URL (single click)
    const handleClick = (e: React.MouseEvent) => {
        if (hasCredential) {
            e.preventDefault();
            e.stopPropagation();
            window.open(certificate.credentialUrl, "_blank", "noopener,noreferrer");
        }
    };

    return (
        <motion.div
            variants={cardVariants}
            whileHover={{ y: -2 }}
            className={styles.certificateCard}
            onClick={handleClick}
        >
            {/* Rich Hovercard - Desktop only */}
            {hasCredential && (
                <motion.div 
                    className={styles.hovercardContainer}
                    initial="hidden"
                    whileHover="visible"
                >
                    <div className={styles.hovercardHitbox} />
                    <motion.div 
                        variants={hoverCardVariants} 
                        className={styles.hovercard}
                    >
                        {certificatePreviewsData[certificate.id as keyof typeof certificatePreviewsData] ? (
                            <>
                                <div className={styles.hovercardImageOverlay}>
                                    <img 
                                        src={(certificatePreviewsData[certificate.id as keyof typeof certificatePreviewsData] as any).image} 
                                        alt="" 
                                        className={styles.hovercardImage} 
                                    />
                                    <div className={styles.hovercardTypeBadge}>
                                        <HiEye size={12} style={{ marginRight: "4px" }} />
                                        Preview
                                    </div>
                                </div>
                                <div className={styles.hovercardContent}>
                                    <h5 className={styles.hovercardTitle}>{(certificatePreviewsData[certificate.id as keyof typeof certificatePreviewsData] as any).title}</h5>
                                    <p className={styles.hovercardDesc}>{(certificatePreviewsData[certificate.id as keyof typeof certificatePreviewsData] as any).description}</p>
                                    <div className={styles.hovercardDomain}>
                                        <HiExternalLink size={10} style={{ marginRight: "4px" }} /> 
                                        {new URL(certificate.credentialUrl).hostname}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className={styles.hovercardContent}>
                                <span className={styles.tooltipLabel}>
                                    <HiEye size={12} style={{ marginRight: "4px" }} />
                                    {certificate.credentialUrl.includes("ude.my") ? "Udemy Certificate" : "View Credential"}
                                </span>
                                <span className={styles.tooltipText}>
                                    {certificate.credentialUrl}
                                </span>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}

            {/* Title */}
            <h4 className={styles.certName}>{certificate.title}</h4>

            {/* Issuer */}
            <p className={styles.certIssuingOrg}>{certificate.issuer}</p>

            {/* Date */}
            {certificate.date && (
                <p className={styles.certDate2}>{certificate.date}</p>
            )}

            {/* Description */}
            {certificate.description && (
                <p className={styles.certDescription}>
                    {certificate.description}
                </p>
            )}

            {/* Hover accent line */}
            <div className={styles.certAccentLine} />
        </motion.div>
    );
}

/* ─── Main Section ────────────────────────────────────────────────── */

export default function Certifications() {
    const certifications = certificationsData as Certification[];
    const certificates = certificatesData as Certificate[];

    const hasCertifications = certifications.length > 0;
    const hasCertificates = certificates.length > 0;

    // Calculate columns
    const calcCols = (count: number, maxCols: number) => {
        if (count <= maxCols) return count;
        const rows = Math.ceil(count / maxCols);
        return Math.ceil(count / rows);
    };

    const badgeCols = calcCols(certifications.length, 6);
    const certCols = calcCols(certificates.length, 4);

    const badgeGridStyle = {
        "--grid-cols": badgeCols,
    } as React.CSSProperties;

    const certGridStyle = {
        "--grid-cols": certCols,
    } as React.CSSProperties;

    return (
        <>
            {/* ─── Certifications (Badges) ───────────────────────────── */}
            {hasCertifications && (
                <section
                    id="certifications"
                    className="section-wrapper section-glow-bg"
                >
                    <div className="section-container">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.5 }}
                            className="section-header-lg"
                        >
                            <h2 className="section-heading">Certifications</h2>
                            <div className="section-divider" />
                            <p
                                className="description-text"
                                style={{ color: "var(--text-tertiary)" }}
                            >
                                Industry certifications and professional badges
                                that validate my skills and knowledge.
                            </p>
                        </motion.div>

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
                    className="section-wrapper section-glow-bg"
                >
                    <div className="section-container">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.5 }}
                            className="section-header-lg"
                        >
                            <h2 className="section-heading">Certificates</h2>
                            <div className="section-divider" />

                            <p
                                className="description-text"
                                style={{ color: "var(--text-tertiary)" }}
                            >
                                Courses, programs, and training completed
                                throughout my career.
                            </p>
                        </motion.div>

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
