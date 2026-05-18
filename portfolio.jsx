import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";

/* ─── GOOGLE FONTS ─────────────────────────────────────────── */
const FontLoader = () => (
    <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=Space+Mono:wght@400;700&family=Outfit:wght@300;400;500;600;700;800&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: #F3F4F6; color: #0D0D0D; font-family: 'DM Sans', sans-serif; overflow-x: hidden; }

    ::selection { background: #059669; color: #fff; }

    .font-display { font-family: 'Syne', sans-serif; }
    .font-mono    { font-family: 'Space Mono', monospace; }

    /* Outline → Fill hero animation */
    @keyframes fillText {
      0%   { -webkit-text-stroke: 2px #0D0D0D; color: transparent; }
      60%  { -webkit-text-stroke: 2px #0D0D0D; color: transparent; }
      100% { -webkit-text-stroke: 0px transparent; color: #0D0D0D; }
    }
    .hero-name {
      animation: fillText 2.4s cubic-bezier(0.16,1,0.3,1) forwards;
      -webkit-text-stroke: 2px #0D0D0D;
      color: transparent;
    }

    /* Pulsing dot */
    @keyframes pulse-emerald {
      0%,100% { box-shadow: 0 0 0 0 rgba(5,150,105,0.5); }
      50%      { box-shadow: 0 0 0 6px rgba(5,150,105,0); }
    }
    .pulse-dot { animation: pulse-emerald 2s ease infinite; }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 99px; }

    /* Work card hover */
    .work-card:hover .card-overlay { opacity: 1; }
    .work-card:hover img { transform: scale(1.04); }

    /* Underline link */
    .fancy-link { position: relative; }
    .fancy-link::after { content:''; position:absolute; bottom:-2px; left:0; width:0; height:1px; background:#0D0D0D; transition: width .3s ease; }
    .fancy-link:hover::after { width:100%; }
  `}</style>
);

/* ─── CONSTANTS ─────────────────────────────────────────────── */
const NAV_LINKS = ["Work", "Service", "Experience", "Achievements", "Contact"];

const PROJECTS = [
    {
        id: "fossee",
        title: "FOSSEE Internship",
        subtitle: "UI/UX Redesign",
        tag: "Landing Page",
        color: "#E5E7EB",
        accent: "#059669",
        desc: "Complete visual and UX overhaul of FOSSEE's public-facing portal — restructured information architecture, modernized component library, and improved conversion funnel from landing through signup.",
        tech: ["Figma", "React", "Tailwind CSS"],
        year: "2024",
        // UI/UX design workspace
        thumb: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&h=500&fit=crop&auto=format",
        detailImg: "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=900&h=600&fit=crop&auto=format",
        gallery: [
            "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=600&h=400&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=600&h=400&fit=crop&auto=format",
        ],
    },
    {
        id: "bluebus",
        title: "Blue Bus",
        subtitle: "Bus Reservation System",
        tag: "Java / OOP Application",
        color: "#DBEAFE",
        accent: "#1D4ED8",
        desc: "A full-featured bus reservation system built with Java and OOP principles — featuring seat management, booking flows, cancellation logic, and a terminal-based interface with persistent data.",
        tech: ["Java", "OOP", "File I/O"],
        year: "2024",
        // Bus / transit
        thumb: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=500&fit=crop&auto=format",
        detailImg: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=900&h=600&fit=crop&auto=format",
        gallery: [
            "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=600&h=400&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1505522661891-641f1a9f1e76?w=600&h=400&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&h=400&fit=crop&auto=format",
        ],
    },
    {
        id: "shell",
        title: "Shell Script Toolkit",
        subtitle: "Automation Framework",
        tag: "Systems & Bash Automation",
        color: "#F3F4F6",
        accent: "#374151",
        desc: "A modular collection of bash scripts for system administration — log rotation, environment bootstrapping, automated backups, and CI-ready shell orchestration for Linux environments.",
        tech: ["Bash", "Linux", "Cron"],
        year: "2024",
        // Terminal / code / linux
        thumb: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&h=500&fit=crop&auto=format",
        detailImg: "https://images.unsplash.com/photo-1640552435388-a54879e72b28?w=900&h=600&fit=crop&auto=format",
        gallery: [
            "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&h=400&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600&h=400&fit=crop&auto=format",
        ],
    },
    {
        id: "shopflow",
        title: "ShopFlow",
        subtitle: "Smart Inventory System",
        tag: "Web App",
        color: "#FEF3C7",
        accent: "#D97706",
        desc: "A web-based inventory management platform with real-time stock tracking, supplier management, auto-reorder triggers, and analytics dashboards built for small-to-mid retail operations.",
        tech: ["React", "FastAPI", "PostgreSQL"],
        year: "2025",
        // Retail / inventory / warehouse
        thumb: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&h=500&fit=crop&auto=format",
        detailImg: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=900&h=600&fit=crop&auto=format",
        gallery: [
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=400&fit=crop&auto=format",
        ],
    },
];

const SERVICES = [
    {
        id: "fullstack",
        label: "Full-Stack Development",
        number: "01",
        body: "Building modular React frontends with robust Python (FastAPI/Django) and Java backend systems. From design system to database schema — clean, maintainable, and production-ready.",
        skills: ["React", "Python", "FastAPI", "Django", "Java", "REST APIs"],
        // Code editor, UI components, web dev
        images: [
            "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=500&h=340&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1547658719-da2b51169166?w=500&h=340&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&h=340&fit=crop&auto=format",
        ],
    },
    {
        id: "aiml",
        label: "AI / ML Specialization",
        number: "02",
        body: "Integrating generative AI capabilities, structured data analytics pipelines, and data models. Turning raw datasets into actionable intelligence — from ETL to inference.",
        skills: ["TensorFlow", "scikit-learn", "LangChain", "Pandas", "Jupyter"],
        // Neural network, data science, AI
        images: [
            "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=500&h=340&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500&h=340&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=500&h=340&fit=crop&auto=format",
        ],
    },
    {
        id: "systems",
        label: "Systems & Automation",
        number: "03",
        body: "Developing custom bash toolkits, shell orchestration systems, and automated CI/CD-ready environments. Reliable infrastructure scripting that scales with your workflows.",
        skills: ["Bash", "Linux", "Docker", "GitHub Actions", "Cron"],
        // Terminal, server, infrastructure
        images: [
            "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=500&h=340&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=500&h=340&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&h=340&fit=crop&auto=format",
        ],
    },
];

const EXPERIENCES = [
    {
        id: "sdc",
        role: "Core Member",
        org: "Software Development Club",
        loc: "VIT Bhopal",
        period: "Feb 2026 – Present",
        color: "#ECFDF5",
        desc: "Leading frontend initiatives, mentoring juniors, and driving collaborative open-source contributions across the club's project pipeline.",
    },
    {
        id: "edc",
        role: "Campus Ambassador Intern",
        org: "eDC IIT Delhi",
        loc: "Entrepreneurship Development Cell",
        period: "Dec 2025 – Feb 2026",
        color: "#EFF6FF",
        desc: "Represented IIT Delhi's EDC at VIT Bhopal — organizing workshops, onboarding student founders, and bridging the startup ecosystem between campuses.",
    },
];

/* ─── TINY HELPERS ──────────────────────────────────────────── */
const Tag = ({ children, color }) => (
    <span
        className="font-mono"
        style={{
            fontSize: 10,
            letterSpacing: "0.08em",
            padding: "3px 10px",
            borderRadius: 99,
            border: "1px solid #D1D5DB",
            background: color || "#F9FAFB",
            color: "#374151",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
        }}
    >
        {children}
    </span>
);

const SectionLabel = ({ children }) => (
    <p
        className="font-mono"
        style={{ fontSize: 11, letterSpacing: "0.16em", color: "#6B7280", marginBottom: 32, textTransform: "uppercase" }}
    >
        {children}
    </p>
);

/* ─── NAVBAR ────────────────────────────────────────────────── */
const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", fn);
        return () => window.removeEventListener("scroll", fn);
    }, []);

    return (
        <motion.header
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                background: scrolled ? "rgba(243,244,246,0.92)" : "transparent",
                backdropFilter: scrolled ? "blur(12px)" : "none",
                borderBottom: scrolled ? "1px solid #E5E7EB" : "1px solid transparent",
                transition: "all 0.4s ease",
                padding: "0 32px",
                height: 64,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
            }}
        >
            {/* Status */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                    className="pulse-dot"
                    style={{ width: 8, height: 8, borderRadius: "50%", background: "#059669", display: "inline-block" }}
                />
                <span className="font-mono" style={{ fontSize: 11, letterSpacing: "0.1em", color: "#059669", textTransform: "uppercase" }}>
                    Available for New Project
                </span>
            </div>

            {/* Nav links */}
            <nav style={{ display: "flex", gap: 36 }}>
                {NAV_LINKS.map((l) => (
                    <a
                        key={l}
                        href={`#${l.toLowerCase()}`}
                        className="fancy-link font-mono"
                        style={{ fontSize: 12, letterSpacing: "0.08em", color: "#374151", textDecoration: "none", textTransform: "uppercase" }}
                    >
                        {l}
                    </a>
                ))}
            </nav>

            {/* CTA */}
            <motion.a
                href="#contact"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                    fontSize: 13,
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 500,
                    padding: "8px 20px",
                    background: "#0D0D0D",
                    color: "#F9FAFB",
                    borderRadius: 6,
                    textDecoration: "none",
                    letterSpacing: "0.02em",
                }}
            >
                Let's Talk ↗
            </motion.a>
        </motion.header>
    );
};

/* ─── HERO ──────────────────────────────────────────────────── */
const Hero = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <section
            ref={ref}
            style={{ paddingTop: 120, paddingBottom: 80, paddingLeft: 32, paddingRight: 32, position: "relative", overflow: "hidden" }}
        >
            {/* Big name */}
            <div style={{ position: "relative", marginBottom: 0 }}>
                <h1
                    className="hero-name font-display"
                    style={{
                        fontSize: "clamp(72px, 14vw, 196px)",
                        fontWeight: 800,
                        lineHeight: 0.88,
                        letterSpacing: "-0.03em",
                        userSelect: "none",
                    }}
                >
                    ABHIJOY
                    <br />
                    PAUL
                </h1>

                {/* Portrait — real photo */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 1.1, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                        position: "absolute",
                        right: "3%",
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: "clamp(200px, 28vw, 380px)",
                        aspectRatio: "3/4",
                        borderRadius: 12,
                        overflow: "hidden",
                        border: "1px solid #E5E7EB",
                        boxShadow: "0 24px 64px rgba(0,0,0,0.12)",
                    }}
                >
                    <img
                        src="/portrait.jpeg"
                        alt="Abhijoy Paul"
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            objectPosition: "top center",
                            display: "block",
                        }}
                    />
                </motion.div>
            </div>

            {/* Bottom row */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    marginTop: 48,
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 32,
                    maxWidth: "70%",
                }}
            >
                <div>
                    <p style={{ fontSize: 17, lineHeight: 1.6, color: "#374151", fontWeight: 300, maxWidth: 380 }}>
                        UI/UX &amp; Full-Stack Developer. Designing and building digital products that are{" "}
                        <em>clear</em>, reusable, and conversion-focused.
                    </p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingTop: 4 }}>
                    {[
                        { label: "GitHub", url: "https://github.com/abhijoypaul" },
                        { label: "LinkedIn", url: "https://www.linkedin.com/in/abhijoypaul/" },
                    ].map(({ label, url }) => (
                        <a
                            key={label}
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="fancy-link font-mono"
                            style={{ fontSize: 13, letterSpacing: "0.06em", color: "#0D0D0D", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}
                        >
                            {label} ↗
                        </a>
                    ))}
                </div>
            </motion.div>

            {/* Horizontal rule */}
            <motion.div
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{ height: 1, background: "#E5E7EB", marginTop: 64, transformOrigin: "left" }}
            />
        </section>
    );
};

/* ─── PROJECT CARD ──────────────────────────────────────────── */
const ProjectCard = ({ project, isSelected, onSelect }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });

    return (
        <motion.div
            ref={ref}
            layoutId={`card-${project.id}`}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => onSelect(isSelected ? null : project.id)}
            className="work-card"
            style={{
                cursor: "pointer",
                borderRadius: 8,
                border: "1px solid #E5E7EB",
                overflow: "hidden",
                background: "#fff",
                position: "relative",
            }}
        >
            {/* Thumbnail */}
            <div style={{ aspectRatio: "16/10", background: project.color, position: "relative", overflow: "hidden" }}>
                <motion.img
                    src={project.thumb}
                    alt={project.title}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        filter: "grayscale(15%)",
                        transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
                    }}
                />
                {/* Overlay */}
                <div
                    className="card-overlay"
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(13,13,13,0.5)",
                        opacity: 0,
                        transition: "opacity 0.3s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <span style={{ color: "#fff", fontSize: 13, letterSpacing: "0.1em", fontFamily: "'Space Mono', monospace" }}>VIEW →</span>
                </div>
            </div>

            {/* Meta */}
            <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                    <p className="font-display" style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em" }}>
                        {project.title}
                    </p>
                    <p style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>{project.subtitle}</p>
                </div>
                <Tag>{project.tag}</Tag>
            </div>
        </motion.div>
    );
};

/* ─── PROJECT DETAIL PANEL ──────────────────────────────────── */
const ProjectDetail = ({ project, onClose }) => (
    <motion.div
        layoutId={`card-${project.id}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
            gridColumn: "1 / -1",
            background: "#fff",
            borderRadius: 10,
            border: "1px solid #E5E7EB",
            overflow: "hidden",
        }}
    >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 400 }}>
            {/* Left: image + gallery strip */}
            <div style={{ background: project.color, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                {/* Hero image */}
                <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
                    <img
                        src={project.detailImg}
                        alt={project.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(10%)", display: "block" }}
                    />
                    {/* Gradient scrim */}
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, background: "linear-gradient(to top, rgba(0,0,0,0.35), transparent)" }} />
                    {/* Year badge */}
                    <span
                        className="font-mono"
                        style={{
                            position: "absolute",
                            top: 14,
                            left: 14,
                            background: "rgba(0,0,0,0.55)",
                            color: "#fff",
                            fontSize: 10,
                            letterSpacing: "0.12em",
                            padding: "4px 10px",
                            borderRadius: 99,
                            backdropFilter: "blur(6px)",
                        }}
                    >
                        {project.year}
                    </span>
                </div>

                {/* Gallery strip */}
                <div
                    style={{
                        display: "flex",
                        gap: 6,
                        padding: "8px 10px",
                        background: "rgba(0,0,0,0.06)",
                        backdropFilter: "blur(4px)",
                    }}
                >
                    {project.gallery.map((src, i) => (
                        <div
                            key={i}
                            style={{
                                flex: 1,
                                aspectRatio: "3/2",
                                borderRadius: 5,
                                overflow: "hidden",
                                border: "1px solid rgba(255,255,255,0.3)",
                            }}
                        >
                            <img
                                src={src}
                                alt={`${project.title} screenshot ${i + 1}`}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Right: info */}
            <div style={{ padding: 40, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                        <div>
                            <p className="font-mono" style={{ fontSize: 11, color: "#6B7280", letterSpacing: "0.1em", marginBottom: 6 }}>
                                {project.year}
                            </p>
                            <h3 className="font-display" style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em" }}>
                                {project.title}
                            </h3>
                            <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>{project.subtitle}</p>
                        </div>
                        <button
                            onClick={onClose}
                            style={{ background: "none", border: "1px solid #E5E7EB", borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontSize: 18, color: "#374151" }}
                        >
                            ×
                        </button>
                    </div>

                    <p style={{ fontSize: 15, lineHeight: 1.7, color: "#374151", marginBottom: 24 }}>{project.desc}</p>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {project.tech.map((t) => (
                            <Tag key={t}>{t}</Tag>
                        ))}
                    </div>
                </div>

                <div style={{ paddingTop: 24, borderTop: "1px solid #E5E7EB", marginTop: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Tag color={project.color}>{project.tag}</Tag>
                    <span className="font-mono" style={{ fontSize: 10, color: "#9CA3AF", letterSpacing: "0.1em" }}>
                        {project.gallery.length + 1} IMAGES
                    </span>
                </div>
            </div>
        </div>
    </motion.div>
);

/* ─── WORK SECTION ──────────────────────────────────────────── */
const WorkSection = () => {
    const [filter, setFilter] = useState("All");
    const [selected, setSelected] = useState(null);
    const filters = ["All", "Real Project", "Exploration"];

    const filtered =
        filter === "All"
            ? PROJECTS
            : filter === "Real Project"
                ? PROJECTS.filter((p) => ["fossee", "shopflow"].includes(p.id))
                : PROJECTS.filter((p) => ["shell", "bluebus"].includes(p.id));

    return (
        <section id="work" style={{ padding: "80px 32px" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 40 }}>
                <div>
                    <SectionLabel>/Selected Work</SectionLabel>
                    <h2 className="font-display" style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-0.03em" }}>
                        Things I've Built
                    </h2>
                </div>
                {/* Filters */}
                <div style={{ display: "flex", gap: 8 }}>
                    {filters.map((f) => (
                        <motion.button
                            key={f}
                            onClick={() => { setFilter(f); setSelected(null); }}
                            whileTap={{ scale: 0.96 }}
                            className="font-mono"
                            style={{
                                fontSize: 11,
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                padding: "7px 16px",
                                borderRadius: 99,
                                border: "1px solid",
                                borderColor: filter === f ? "#0D0D0D" : "#E5E7EB",
                                background: filter === f ? "#0D0D0D" : "transparent",
                                color: filter === f ? "#fff" : "#6B7280",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                            }}
                        >
                            {f}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <motion.div
                layout
                style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
            >
                <AnimatePresence mode="popLayout">
                    {selected && (
                        <ProjectDetail
                            key="detail"
                            project={PROJECTS.find((p) => p.id === selected)}
                            onClose={() => setSelected(null)}
                        />
                    )}
                    {filtered
                        .filter((p) => p.id !== selected)
                        .map((project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                isSelected={selected === project.id}
                                onSelect={setSelected}
                            />
                        ))}
                </AnimatePresence>
            </motion.div>
        </section>
    );
};

/* ─── SERVICE ACCORDION ─────────────────────────────────────── */
const ServiceRow = ({ service, isOpen, onToggle }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-60px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ borderBottom: "1px solid #E5E7EB" }}
        >
            <button
                onClick={onToggle}
                style={{
                    width: "100%",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "28px 0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    <span className="font-mono" style={{ fontSize: 11, color: "#9CA3AF", letterSpacing: "0.1em" }}>
                        {service.number}
                    </span>
                    <span
                        className="font-display"
                        style={{
                            fontSize: "clamp(18px, 3vw, 32px)",
                            fontWeight: 700,
                            letterSpacing: "-0.02em",
                            textAlign: "left",
                            textTransform: "uppercase",
                        }}
                    >
                        {service.label}
                    </span>
                </div>
                <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    style={{ fontSize: 24, color: "#374151", flexShrink: 0 }}
                >
                    +
                </motion.span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="body"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        style={{ overflow: "hidden" }}
                    >
                        <div
                            style={{
                                paddingBottom: 36,
                                paddingLeft: 52,
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: 40,
                                alignItems: "start",
                            }}
                        >
                            {/* Left: description + skills */}
                            <div>
                                <p style={{ fontSize: 16, lineHeight: 1.7, color: "#374151", marginBottom: 20 }}>
                                    {service.body}
                                </p>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                    {service.skills.map((s) => (
                                        <Tag key={s}>{s}</Tag>
                                    ))}
                                </div>
                            </div>

                            {/* Right: 3-image photo grid */}
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gridTemplateRows: "auto auto",
                                    gap: 8,
                                }}
                            >
                                {/* Large image spanning full width on top */}
                                <div
                                    style={{
                                        gridColumn: "1 / -1",
                                        borderRadius: 10,
                                        overflow: "hidden",
                                        aspectRatio: "16/7",
                                        border: "1px solid #E5E7EB",
                                    }}
                                >
                                    <img
                                        src={service.images[0]}
                                        alt={`${service.label} preview`}
                                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                                    />
                                </div>
                                {/* Two smaller images below */}
                                {service.images.slice(1).map((src, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            borderRadius: 8,
                                            overflow: "hidden",
                                            aspectRatio: "4/3",
                                            border: "1px solid #E5E7EB",
                                        }}
                                    >
                                        <img
                                            src={src}
                                            alt={`${service.label} example ${i + 2}`}
                                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const ServiceSection = () => {
    const [open, setOpen] = useState(null);

    return (
        <section id="service" style={{ padding: "80px 32px", background: "#fff" }}>
            <SectionLabel>/Service</SectionLabel>
            <h2 className="font-display" style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 48 }}>
                What I Do
            </h2>

            <div style={{ borderTop: "1px solid #E5E7EB" }}>
                {SERVICES.map((s) => (
                    <ServiceRow
                        key={s.id}
                        service={s}
                        isOpen={open === s.id}
                        onToggle={() => setOpen(open === s.id ? null : s.id)}
                    />
                ))}
            </div>
        </section>
    );
};

/* ─── EXPERIENCE SECTION ────────────────────────────────────── */
const ExperienceRow = ({ exp, index }) => {
    const [hovered, setHovered] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-60px" });

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onMouseMove={handleMouseMove}
            style={{
                borderBottom: "1px solid #E5E7EB",
                padding: "28px 0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "default",
                position: "relative",
                background: hovered ? "#FAFAFA" : "transparent",
                transition: "background 0.2s ease",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                <span className="font-mono" style={{ fontSize: 11, color: "#9CA3AF", letterSpacing: "0.1em", minWidth: 24 }}>
                    {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                    <h3 className="font-display" style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.01em" }}>
                        {exp.org}
                    </h3>
                    <p style={{ fontSize: 14, color: "#6B7280", marginTop: 2 }}>
                        {exp.loc} — {exp.role}
                    </p>
                </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span className="font-mono" style={{ fontSize: 12, color: "#9CA3AF", letterSpacing: "0.06em" }}>
                    {exp.period}
                </span>
                <Tag>{exp.role.split(" ")[0]}</Tag>
            </div>

            {/* Floating preview */}
            <AnimatePresence>
                {hovered && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 8 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                            position: "absolute",
                            left: Math.min(mousePos.x + 16, window.innerWidth - 300),
                            top: mousePos.y - 80,
                            zIndex: 50,
                            background: exp.color,
                            border: "1px solid #E5E7EB",
                            borderRadius: 10,
                            padding: 16,
                            width: 260,
                            pointerEvents: "none",
                            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                        }}
                    >
                        <p className="font-display" style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
                            {exp.org}
                        </p>
                        <p style={{ fontSize: 12, lineHeight: 1.6, color: "#374151" }}>{exp.desc}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const ExperienceSection = () => (
    <section id="experience" style={{ padding: "80px 32px" }}>
        <SectionLabel>/Experience</SectionLabel>
        <h2 className="font-display" style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 48 }}>
            Where I've Worked
        </h2>
        <div style={{ borderTop: "1px solid #E5E7EB" }}>
            {EXPERIENCES.map((exp, i) => (
                <ExperienceRow key={exp.id} exp={exp} index={i} />
            ))}
        </div>
    </section>
);

/* ─── FOOTER / CONTACT ──────────────────────────────────────── */
const Footer = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });

    return (
        <section
            id="contact"
            ref={ref}
            style={{
                padding: "100px 32px 60px",
                background: "#0D0D0D",
                color: "#F9FAFB",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Background texture lines */}
            <div style={{ position: "absolute", inset: 0, opacity: 0.04, pointerEvents: "none" }}>
                {Array.from({ length: 8 }).map((_, i) => (
                    <div
                        key={i}
                        style={{ position: "absolute", top: `${i * 14}%`, left: 0, right: 0, height: 1, background: "#fff" }}
                    />
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                style={{ position: "relative", zIndex: 2 }}
            >
                <p className="font-mono" style={{ fontSize: 11, letterSpacing: "0.16em", color: "#6B7280", marginBottom: 24 }}>
                    /CONTACT
                </p>
                <h2
                    className="font-display"
                    style={{ fontSize: "clamp(36px, 7vw, 96px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 0.9, marginBottom: 32 }}
                >
                    HAVE A PROJECT
                    <br />
                    IN MIND?
                </h2>
                <p style={{ fontSize: 16, color: "#9CA3AF", maxWidth: 460, lineHeight: 1.7, marginBottom: 48 }}>
                    Together, we can create something clear and impactful. Let's collaborate to bring our ideas to life.
                </p>

                <motion.a
                    href="mailto:abhijoypaul@example.com"
                    whileHover={{ scale: 1.03, background: "#059669" }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "16px 32px",
                        background: "#F9FAFB",
                        color: "#0D0D0D",
                        borderRadius: 8,
                        textDecoration: "none",
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 500,
                        fontSize: 15,
                        letterSpacing: "0.01em",
                        transition: "background 0.3s ease, color 0.3s ease",
                    }}
                >
                    Contact Me ↗
                </motion.a>

                {/* Bottom bar */}
                <div
                    style={{
                        marginTop: 80,
                        paddingTop: 24,
                        borderTop: "1px solid #1F2937",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <p className="font-mono" style={{ fontSize: 11, color: "#4B5563", letterSpacing: "0.06em" }}>
                        © 2025 ABHIJOY PAUL
                    </p>
                    <p className="font-mono" style={{ fontSize: 11, color: "#4B5563", letterSpacing: "0.06em" }}>
                        DESIGNED & BUILT WITH ♥
                    </p>
                </div>
            </motion.div>
        </section>
    );
};

/* ─── ACHIEVEMENTS ─────────────────────────────────────────── */
const ACHIEVEMENTS = [
    { id: "udemy", title: "Full-Stack Web Dev", issuer: "Udemy · Dr. Angela Yu", date: "Dec 2025", color: "#FEF3C7", accent: "#D97706", icon: "🌐" },
    { id: "nptel1", title: "Cloud Computing", issuer: "NPTEL", date: "Top 5% Topper", color: "#ECFDF5", accent: "#059669", icon: "☁️" },
    { id: "coursera1", title: "HTML / CSS / JS", issuer: "Coursera", date: "Dec 2025", color: "#EFF6FF", accent: "#1D4ED8", icon: "💻" },
    { id: "google", title: "Data, Data, Everywhere", issuer: "Coursera · Google", date: "Dec 2025", color: "#FEF2F2", accent: "#DC2626", icon: "📊" },
    { id: "nptel2", title: "Programming with Gen AI", issuer: "NPTEL", date: "Oct 2025", color: "#F5F3FF", accent: "#7C3AED", icon: "🤖" },
    { id: "jpm", title: "J.P. Morgan SE Simulation", issuer: "Forage", date: "Aug 2025", color: "#FFF7ED", accent: "#EA580C", icon: "🏦" },
    { id: "aws", title: "AWS Solutions Architect", issuer: "Forage", date: "Aug 2025", color: "#FFFBEB", accent: "#B45309", icon: "☁" },
    { id: "java", title: "Java Basics", issuer: "HackerRank", date: "Jul 2025", color: "#F0FDF4", accent: "#16A34A", icon: "☕" },
    { id: "ds", title: "Data Science Fundamentals", issuer: "Scalar", date: "Sep 2025", color: "#EFF6FF", accent: "#2563EB", icon: "🔬" },
    { id: "dbms", title: "DBMS", issuer: "Cursa", date: "Sep 2025", color: "#FDF4FF", accent: "#9333EA", icon: "🗄️" },
    { id: "matlab", title: "Fundamentals of AI & ML", issuer: "MATLAB", date: "", color: "#ECFDF5", accent: "#059669", icon: "🧮" },
    { id: "c", title: "C Programming Basics", issuer: "Certified", date: "", color: "#F8FAFC", accent: "#475569", icon: "⚙️" },
    { id: "python", title: "Python Essentials", issuer: "Certified", date: "", color: "#FEFCE8", accent: "#CA8A04", icon: "🐍" },
    { id: "matlab2", title: "MATLAB Certified", issuer: "MATLAB", date: "", color: "#FFF1F2", accent: "#E11D48", icon: "📐" },
    { id: "java2", title: "Java – Mastering the Fundamentals", issuer: "Certified", date: "", color: "#F0FDF4", accent: "#15803D", icon: "☕" },
];

const AchievementCard = ({ item, index }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-60px" });
    const [hovered, setHovered] = useState(false);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 28 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: (index % 5) * 0.07, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                position: "relative",
                background: "#fff",
                borderRadius: 12,
                border: "1px solid",
                borderColor: hovered ? item.accent + "66" : "#E5E7EB",
                boxShadow: hovered
                    ? `0 8px 32px rgba(0,0,0,0.09), 0 0 0 1px ${item.accent}22`
                    : "0 1px 4px rgba(0,0,0,0.04)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                cursor: "default",
                transition: "border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease",
                transform: hovered ? "translateY(-3px)" : "translateY(0)",
            }}
        >
            {/* Left accent strip */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: 3,
                    background: item.accent,
                    opacity: hovered ? 1 : 0.4,
                    transition: "opacity 0.25s ease",
                    borderTopLeftRadius: 12,
                    borderBottomLeftRadius: 12,
                }}
            />

            <div style={{ padding: "18px 18px 18px 22px" }}>
                {/* Top row: icon chip + index */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <div
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 36,
                            height: 36,
                            borderRadius: 8,
                            background: item.accent + "18",
                            fontSize: 18,
                            lineHeight: 1,
                            flexShrink: 0,
                        }}
                    >
                        {item.icon}
                    </div>
                    <span
                        className="font-mono"
                        style={{ fontSize: 10, color: "#D1D5DB", letterSpacing: "0.12em" }}
                    >
                        {String(index + 1).padStart(2, "0")}
                    </span>
                </div>

                {/* Title */}
                <p
                    style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: 14,
                        fontWeight: 700,
                        letterSpacing: "-0.01em",
                        color: "#111827",
                        lineHeight: 1.3,
                        marginBottom: 5,
                    }}
                >
                    {item.title}
                </p>

                {/* Issuer */}
                <p
                    style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: 11,
                        fontWeight: 500,
                        letterSpacing: "0.04em",
                        color: item.accent,
                        textTransform: "uppercase",
                        marginBottom: item.date ? 12 : 0,
                    }}
                >
                    {item.issuer}
                </p>

                {/* Date badge */}
                {item.date && (
                    <span
                        className="font-mono"
                        style={{
                            fontSize: 9,
                            letterSpacing: "0.1em",
                            color: "#6B7280",
                            background: "#F3F4F6",
                            padding: "3px 9px",
                            borderRadius: 99,
                            textTransform: "uppercase",
                            display: "inline-block",
                            border: "1px solid #E5E7EB",
                        }}
                    >
                        {item.date}
                    </span>
                )}
            </div>
        </motion.div>
    );
};

const AchievementsSection = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });

    return (
        <section id="achievements" ref={ref} style={{ padding: "80px 32px", background: "#F3F4F6" }}>
            <SectionLabel>/Certifications &amp; Achievements</SectionLabel>
            <motion.h2
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="font-display"
                style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 12 }}
            >
                What I've Earned
            </motion.h2>
            <motion.p
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                style={{ fontSize: 15, color: "#6B7280", marginBottom: 48, maxWidth: 480, lineHeight: 1.7 }}
            >
                Certifications, simulations, and specialisations from top global platforms.
            </motion.p>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                    gap: 14,
                }}
            >
                {ACHIEVEMENTS.map((item, i) => (
                    <AchievementCard key={item.id} item={item} index={i} />
                ))}
            </div>
        </section>
    );
};

/* ─── ROOT APP ──────────────────────────────────────────────── */
export default function App() {
    return (
        <>
            <FontLoader />
            <Navbar />
            <main>
                <Hero />
                <WorkSection />
                <ServiceSection />
                <ExperienceSection />
                <AchievementsSection />
                <Footer />
            </main>
        </>
    );
}
