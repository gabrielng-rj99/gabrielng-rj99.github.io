import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
    HiBadgeCheck,
    HiChevronLeft,
    HiChevronRight,
    HiExternalLink,
} from "react-icons/hi";
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
    previewImage?: string;
    logo?: string;
}

const BADGE_GRID_MAX_COLUMNS = 6;
const CARDS_PER_ROW = 4;
const CARDS_PER_SLIDE = CARDS_PER_ROW * 2;
const CAROUSEL_DRAG_MULTIPLIER = 2;
const CAROUSEL_SCROLL_STEP = 950;

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

const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.2,
            ease: "easeOut" as const,
        },
    },
};

function CertificationCard({ certification }: { certification: Certification }) {
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
                {isEarned ? <HiBadgeCheck size={12} /> : <FiClock size={10} />}
            </div>

            <div className={styles.badgeImageContainer}>
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
                    onError={(event) => {
                        const target = event.currentTarget;
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

            <h3
                className={styles.certTitle}
                style={{ color: "var(--text-primary)" }}
            >
                {certification.title.split("\n").map((line, index, lines) => (
                    <React.Fragment key={index}>
                        {line}
                        {index < lines.length - 1 && <br />}
                    </React.Fragment>
                ))}
            </h3>

            <p
                className={styles.certIssuer}
                style={{ color: "var(--text-muted)" }}
            >
                {certification.issuer}
            </p>

            {isEarned && certification.date && (
                <p
                    className={styles.certDate}
                    style={{ color: "var(--text-tertiary)" }}
                >
                    {certification.date}
                </p>
            )}

            {hasCredential && (
                <div
                    className={styles.credentialLink}
                    style={{ color: "var(--accent-purple)" }}
                >
                    <span>Verify</span>
                    <HiExternalLink size={12} />
                </div>
            )}

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

function CertificateCard({ certificate }: { certificate: Certificate }) {
    const hasCredential =
        certificate.credentialUrl && certificate.credentialUrl.length > 0;
    const hasImage =
        certificate.previewImage &&
        !certificate.previewImage.includes("PLACEHOLDER");

    const Wrapper = hasCredential ? motion.a : motion.div;
    const wrapperProps = hasCredential
        ? {
              href: certificate.credentialUrl,
              target: "_blank",
              rel: "noopener noreferrer",
          }
        : {};

    return (
        <Wrapper
            {...(wrapperProps as Record<string, string>)}
            variants={cardVariants}
            className={`${styles.certificateCard} ${hasCredential ? styles.certCardClickable : styles.certCardStatic}`}
        >
            <div className={styles.certImageContainer}>
                {hasImage ? (
                    <img
                        src={certificate.previewImage}
                        alt={`${certificate.title} preview`}
                        className={styles.certImage}
                        loading="lazy"
                    />
                ) : (
                    <div className={styles.certImagePlaceholder}>
                        <HiBadgeCheck size={32} style={{ opacity: 0.3 }} />
                    </div>
                )}
                {hasCredential && (
                    <div className={styles.certDomainBadge}>
                        <HiExternalLink
                            size={12}
                            style={{ marginRight: "4px" }}
                        />
                        {new URL(certificate.credentialUrl).hostname}
                    </div>
                )}
            </div>

            <div className={styles.certContent}>
                <h4 className={styles.certName}>{certificate.title}</h4>

                <div className={styles.certMeta}>
                    <div className={styles.certIssuingOrgWrapper}>
                        <p className={styles.certIssuingOrg}>
                            {certificate.issuer}
                        </p>
                        {certificate.date && (
                            <p className={styles.certDate2}>
                                {certificate.date}
                            </p>
                        )}
                    </div>
                    {certificate.logo && (
                        <div className={styles.certLogoContainer}>
                            <img
                                src={certificate.logo}
                                alt=""
                                className={styles.certLogo}
                            />
                        </div>
                    )}
                </div>

                {certificate.description && (
                    <p className={styles.certDescription}>
                        {certificate.description
                            .split("\n")
                            .map((line, index, lines) => (
                                <React.Fragment key={index}>
                                    {line}
                                    {index < lines.length - 1 && <br />}
                                </React.Fragment>
                            ))}
                    </p>
                )}
            </div>

            <div className={styles.certAccentLine} />
        </Wrapper>
    );
}

function getGridColumns(count: number, maxColumns: number) {
    if (count <= maxColumns) return count;
    const rows = Math.ceil(count / maxColumns);
    return Math.ceil(count / rows);
}

export default function Certifications() {
    const certifications = certificationsData as Certification[];
    const certificates = certificatesData as Certificate[];

    const hasCertifications = certifications.length > 0;
    const hasCertificates = certificates.length > 0;
    const carouselRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartX, setDragStartX] = useState(0);
    const [dragStartScrollLeft, setDragStartScrollLeft] = useState(0);

    const handleMouseDown = (event: React.MouseEvent) => {
        if (!carouselRef.current) return;
        setIsDragging(true);
        setDragStartX(event.pageX - carouselRef.current.offsetLeft);
        setDragStartScrollLeft(carouselRef.current.scrollLeft);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (event: React.MouseEvent) => {
        if (!isDragging || !carouselRef.current) return;
        event.preventDefault();
        const pointerX = event.pageX - carouselRef.current.offsetLeft;
        const dragOffset =
            (pointerX - dragStartX) * CAROUSEL_DRAG_MULTIPLIER;
        carouselRef.current.scrollLeft = dragStartScrollLeft - dragOffset;
    };

    const scrollCarousel = (direction: "left" | "right") => {
        if (!carouselRef.current) return;
        carouselRef.current.scrollBy({
            left:
                direction === "left"
                    ? -CAROUSEL_SCROLL_STEP
                    : CAROUSEL_SCROLL_STEP,
            behavior: "smooth",
        });
    };

    const badgeColumns = getGridColumns(
        certifications.length,
        BADGE_GRID_MAX_COLUMNS,
    );
    const badgeGridStyle = {
        "--grid-cols": badgeColumns,
    } as React.CSSProperties;
    const slideCount = Math.ceil(certificates.length / CARDS_PER_SLIDE);

    return (
        <>
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
                            className={styles.badgesGrid}
                            style={badgeGridStyle}
                        >
                            {certifications.map((certification) => (
                                <CertificationCard
                                    key={certification.id}
                                    certification={certification}
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
                                <span className={styles.legendText}>
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
                                <span className={styles.legendText}>
                                    — in progress or next goal
                                </span>
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}

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

                        <div className={styles.carouselWrapper}>
                            <button
                                className={`${styles.carouselBtn} ${styles.prevBtn}`}
                                onClick={() => scrollCarousel("left")}
                                aria-label="Previous certificates"
                            >
                                <HiChevronLeft size={24} />
                            </button>

                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-50px" }}
                                className={styles.carouselContainer}
                                ref={carouselRef}
                                onMouseDown={handleMouseDown}
                                onMouseLeave={handleMouseLeave}
                                onMouseUp={handleMouseUp}
                                onMouseMove={handleMouseMove}
                            >
                                {Array.from({ length: slideCount }).map(
                                    (_, slideIndex) => {
                                        const slideStart =
                                            slideIndex * CARDS_PER_SLIDE;
                                        const topRowCertificates =
                                            certificates.slice(
                                                slideStart,
                                                slideStart + CARDS_PER_ROW,
                                            );
                                        const bottomRowCertificates =
                                            certificates.slice(
                                                slideStart + CARDS_PER_ROW,
                                                slideStart + CARDS_PER_SLIDE,
                                            );

                                        return (
                                            <div
                                                key={slideIndex}
                                                className={styles.carouselSlide}
                                            >
                                                <div
                                                    className={styles.carouselRow}
                                                >
                                                    {topRowCertificates.map(
                                                        (certificate) => (
                                                            <CertificateCard
                                                                key={
                                                                    certificate.id
                                                                }
                                                                certificate={
                                                                    certificate
                                                                }
                                                            />
                                                        ),
                                                    )}
                                                </div>
                                                <div
                                                    className={styles.carouselRow}
                                                >
                                                    {bottomRowCertificates.map(
                                                        (certificate) => (
                                                            <CertificateCard
                                                                key={
                                                                    certificate.id
                                                                }
                                                                certificate={
                                                                    certificate
                                                                }
                                                            />
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    },
                                )}
                            </motion.div>

                            <button
                                className={`${styles.carouselBtn} ${styles.nextBtn}`}
                                onClick={() => scrollCarousel("right")}
                                aria-label="Next certificates"
                            >
                                <HiChevronRight size={24} />
                            </button>
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}
