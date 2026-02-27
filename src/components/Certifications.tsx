import { motion } from "framer-motion";
import { HiExternalLink, HiBadgeCheck } from "react-icons/hi";
import { FiClock } from "react-icons/fi";
import certificationsData from "../content/certifications.json";
import certificatesData from "../content/certificates.json";

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
            className={`group relative flex flex-col items-center gap-3 p-4 text-center ${hasCredential ? "cursor-pointer" : "cursor-default"
                }`}
        >
            {/* Status Badge */}
            <div
                className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide"
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
                className="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:shadow-lg"
                style={{
                    background: "var(--bg-tertiary)",
                }}
            >
                {/* Glow on hover */}
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                        background:
                            "radial-gradient(circle, rgba(159, 0, 255, 0.15) 0%, transparent 70%)",
                    }}
                />
                <img
                    src={certification.badgeImage}
                    alt={`${certification.title} badge`}
                    className={`w-16 h-16 md:w-20 md:h-20 object-contain relative z-10 transition-all duration-300 group-hover:scale-110 ${!isEarned ? "opacity-40 grayscale" : ""
                        }`}
                    loading="lazy"
                    onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = "none";
                        const parent = target.parentElement;
                        if (parent && !parent.querySelector(".badge-fallback")) {
                            const fallback = document.createElement("div");
                            fallback.className =
                                "badge-fallback flex items-center justify-center w-16 h-16 md:w-20 md:h-20 relative z-10";
                            fallback.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent-purple); opacity: 0.4;"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.77 4 4 0 0 1 0 6.76 4 4 0 0 1-4.78 4.77 4 4 0 0 1-6.74 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/></svg>`;
                            parent.appendChild(fallback);
                        }
                    }}
                />
            </div>

            {/* Title */}
            <h3
                className="text-sm md:text-base font-bold leading-snug"
                style={{ color: "var(--text-primary)" }}
            >
                {certification.title}
            </h3>

            {/* Issuer */}
            <p
                className="text-xs font-medium -mt-2"
                style={{ color: "var(--text-muted)" }}
            >
                {certification.issuer}
            </p>

            {/* Date (if earned) */}
            {isEarned && certification.date && (
                <p
                    className="text-xs -mt-2"
                    style={{ color: "var(--text-tertiary)" }}
                >
                    {certification.date}
                </p>
            )}

            {/* Credential link indicator */}
            {hasCredential && (
                <div
                    className="flex items-center gap-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ color: "var(--accent-purple)" }}
                >
                    <span>Verify</span>
                    <HiExternalLink size={12} />
                </div>
            )}

            {/* Hover accent line */}
            <div
                className="w-0 group-hover:w-10 h-0.5 rounded-full transition-all duration-300"
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
            className="group rounded-xl border p-5 md:p-6 card-hover"
            style={{
                background: "var(--bg-card)",
                borderColor: "var(--border-primary)",
            }}
        >
            <div className="flex items-start justify-between gap-3 mb-2">
                <h4
                    className="text-sm md:text-base font-bold leading-snug"
                    style={{ color: "var(--text-primary)" }}
                >
                    {certificate.title}
                </h4>
                {hasCredential && (
                    <a
                        href={certificate.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full transition-all duration-300 opacity-50 group-hover:opacity-100"
                        style={{
                            background: "var(--bg-tertiary)",
                            color: "var(--accent-purple)",
                        }}
                        title="View credential"
                    >
                        <HiExternalLink size={14} />
                    </a>
                )}
            </div>

            <p
                className="text-xs font-medium mb-1"
                style={{ color: "var(--accent-purple)" }}
            >
                {certificate.issuer}
            </p>

            {certificate.date && (
                <p
                    className="text-xs mb-3"
                    style={{ color: "var(--text-muted)" }}
                >
                    {certificate.date}
                </p>
            )}

            {certificate.description && (
                <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--text-tertiary)" }}
                >
                    {certificate.description}
                </p>
            )}
        </motion.div>
    );
}

/* ─── Main Section ────────────────────────────────────────────────── */

export default function Certifications() {
    const certifications = certificationsData as Certification[];
    const certificates = certificatesData as Certificate[];

    const hasCertifications = certifications.length > 0;
    const hasCertificates = certificates.length > 0;

    return (
        <>
            {/* ─── Certifications (Badges) ───────────────────────────── */}
            {hasCertifications && (
                <section
                    id="certifications"
                    className="certifications-section section-glow-bg relative mt-32 md:mt-48 py-20 md:py-32"
                    
                >
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Section Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.5 }}
                            className="text-center mb-20 md:mb-32"
                        >
                            <h2 className="section-heading">Certifications</h2>
                            <div className="section-divider mt-3" />
                            <p
                                className="mt-4 text-sm md:text-base max-w-xl mx-auto leading-relaxed"
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
                            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
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
                            className="flex flex-wrap items-center justify-center gap-4 mt-10"
                        >
                            <div className="flex items-center gap-1.5">
                                <span
                                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold"
                                    style={{
                                        background: "rgba(0, 200, 83, 0.1)",
                                        color: "#00c853",
                                        border: "1px solid rgba(0, 200, 83, 0.2)",
                                    }}
                                >
                                    <HiBadgeCheck size={10} />
                                    Earned
                                </span>
                                <span
                                    className="text-xs"
                                    style={{ color: "var(--text-muted)" }}
                                >
                                    — certified
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span
                                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold"
                                    style={{
                                        background: "rgba(159, 0, 255, 0.1)",
                                        color: "var(--accent-purple)",
                                        border: "1px solid rgba(159, 0, 255, 0.2)",
                                    }}
                                >
                                    <FiClock size={10} />
                                    Planned
                                </span>
                                <span
                                    className="text-xs"
                                    style={{ color: "var(--text-muted)" }}
                                >
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
                    className="certifications-section section-glow-bg relative mt-32 md:mt-48 py-20 md:py-32"
                    
                >
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Section Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.5 }}
                            className="text-center mb-20 md:mb-32"
                        >
                            <h2 className="section-heading">Certificates</h2>
                            <div className="section-divider mt-3" />
                            <p
                                className="mt-4 text-sm md:text-base max-w-xl mx-auto leading-relaxed"
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
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
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
