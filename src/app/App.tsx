import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useInView } from "motion/react";
import {
  Github,
  Linkedin,
  Mail,
  Phone,
  Copy,
  PhoneCall,
  MessageCircle,
  ArrowRight,
  ArrowDown,
  FileDown,
  Code2,
  Brain,
  Database,
  ExternalLink,
  Apple,
  X,
  Cpu,
  Wrench,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════════════════ */
interface Metric { label: string; value: string }
interface Project {
  number: string;
  title: string;
  subtitle: string;
  pitch: string;
  stack: string[];
  metrics: Metric[];
  pipeline: string[];
  accent: string;
  github?: string;
  appStore?: string;
  live?: string;
  tags: string[];
}

const CONTACT_EMAIL = "hamza05sultan@gmail.com";
const GITHUB_URL = "https://github.com/hamziCodes";
const LINKEDIN_URL = "https://www.linkedin.com/in/hamzasultan-dev/";
const PHONE_NUMBER = "+92 320 2929511";
const WHATSAPP_URL = "https://wa.me/923202929511";

/* ═══════════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════════ */
const FEATURED_PROJECTS: Project[] = [
  {
    number: "01",
    title: "VertexClassify",
    subtitle: "NLP · iOS · ML Pipeline",
    tags: ["NLP", "iOS", "Academic"],
    pitch:
      "End-to-end ML pipeline that classifies Software Requirement Specifications into Functional, Non-Functional, and Outlier categories — deployed as a fully functional iOS application.",
    stack: ["Python", "Scikit-learn", "TensorFlow", "FastAPI", "CoreML", "iOS"],
    metrics: [
      { label: "Accuracy", value: "94.2%" },
      { label: "F1 Score", value: "0.91" },
      { label: "Platform", value: "iOS" },
      { label: "Status", value: "Prototype" },
    ],
    pipeline: ["Requirement Input", "Split Into Items", "Outlier Gate", "Text Cleaning + TF-IDF", "FR/NFR + NFR Models", "Grouped Result"],
    accent: "#4AFFD4",
    github: "https://github.com/hamziCodes/IDS_PROJECT-SRS_CLASSIFICATION",
    live: "https://vertexclassifyweb.vercel.app/",
  },
  {
    number: "02",
    title: "Spice Hut - Full-Stack Multi-Platform Suite",
    subtitle: "Full-Stack · Commercial · Production",
    tags: ["Full-Stack", "Commercial", "B2B2C"],
    pitch:
      "Commercial-grade, multi-platform digital ordering and restaurant management ecosystem — POS system, customer ordering app, and public website — deployed for a live food chain in Canada.",
    stack: ["React", "Flutter", "Node.js", "Firebase", "MySQL"],
    metrics: [
      { label: "Platforms", value: "3" },
      { label: "Status", value: "Live" },
      { label: "Market", value: "Canada" },
      { label: "Type", value: "B2B2C" },
    ],
    pipeline: ["Mobile App", "POS System", "Web Portal", "Node API", "Database"],
    accent: "#7B61FF",
    appStore: "https://apps.apple.com/pk/app/spice-hut/id6759828497",
    live: "https://spicehutcanada.com/",
  },
  {
    number: "03",
    title: "Food Image Classifier",
    subtitle: "Computer Vision · Deep Learning · Transfer Learning",
    tags: ["CV", "Deep Learning", "Transfer Learning"],
    pitch:
      "Deep learning project for automated detection and classification of food items from raw images using CNN architectures and transfer learning for robust visual recognition.",
    stack: ["Python", "PyTorch", "OpenCV", "ResNet-50", "CNN"],
    metrics: [
      { label: "Test Accuracy", value: "89.7%" },
      { label: "Classes", value: "101" },
      { label: "Architecture", value: "ResNet-50" },
      { label: "Inference", value: "45ms" },
    ],
    pipeline: ["Image Input", "Preprocess", "ResNet-50", "Softmax", "Label Out"],
    accent: "#FF6B6B",
  },
];

/* ═══════════════════════════════════════════════════════════════════
   SHARED PRIMITIVES
═══════════════════════════════════════════════════════════════════ */

/** Gradient border wrapper — 1px gradient outline */
function GradientBorder({
  children,
  from = "#4AFFD4",
  via = "#7B61FF",
  to = "transparent",
  className = "",
}: {
  children: React.ReactNode;
  from?: string;
  via?: string;
  to?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative p-px ${className}`}
      style={{ background: `linear-gradient(135deg, ${from}80, ${via}50, ${to})` }}
    >
      {children}
    </div>
  );
}

/** Cursor-tracking glow overlay — add this as first child of a `relative` container */
function CursorGlow({
  mouse,
  hovered,
  accent = "#4AFFD4",
  size = 500,
}: {
  mouse: { x: number; y: number };
  hovered: boolean;
  accent?: string;
  size?: number;
}) {
  return (
    <div
      className="absolute inset-0 pointer-events-none transition-opacity duration-500"
      style={{
        opacity: hovered ? 1 : 0,
        background: `radial-gradient(${size}px circle at ${mouse.x * 100}% ${mouse.y * 100}%, ${accent}14, transparent 55%)`,
      }}
    />
  );
}

/** Hook: track mouse position normalised [0,1] within a ref element */
function useMouseTrack() {
  const ref = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const [hovered, setHovered] = useState(false);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setMouse({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
  }, []);

  const onEnter = useCallback(() => setHovered(true), []);
  const onLeave = useCallback(() => { setHovered(false); setMouse({ x: 0.5, y: 0.5 }); }, []);

  return { ref, mouse, hovered, onMove, onEnter, onLeave };
}

function PipelineLoop({
  nodes,
  accent,
  compact = false,
}: {
  nodes: string[];
  accent: string;
  compact?: boolean;
}) {
  const loopNodes = [...nodes, ...nodes];

  return (
    <div className="relative overflow-hidden">
      <div
        className="absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, #090909, transparent)" }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, #090909, transparent)" }}
      />

      <motion.div
        className="flex items-center w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {loopNodes.map((node, i) => (
          <div key={`${node}-${i}`} className="flex items-center flex-shrink-0">
            <div
              className={`${compact ? "px-2.5 py-1 text-[11px]" : "px-2.5 sm:px-3 py-1.5 text-[10px] sm:text-xs"} border font-['DM_Mono'] whitespace-nowrap`}
              style={{ borderColor: `${accent}35`, color: accent, backgroundColor: `${accent}09` }}
            >
              {node}
            </div>
            {i < loopNodes.length - 1 && <div className={`${compact ? "w-4" : "w-4 sm:w-6"} h-px bg-white/10 flex-shrink-0`} />}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   APP ROOT
═══════════════════════════════════════════════════════════════════ */
export default function App() {
  const [typewriterText, setTypewriterText] = useState("");
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [resumeOpen, setResumeOpen] = useState(false);
  const fullText = "I build intelligent systems and ship them.";

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      if (i <= fullText.length) { setTypewriterText(fullText.slice(0, i)); i++; }
      else clearInterval(t);
    }, 50);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    document.body.style.overflow = activeProject || resumeOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [activeProject, resumeOpen]);

  const openResumeModal = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.setTimeout(() => setResumeOpen(true), 450);
  }, []);

  return (
    <div className="min-h-screen bg-[#090909] text-[#F0F0F0] overflow-x-hidden">
      {/* Global layout flow: top nav -> landing -> content sections -> overlays */}
      <Nav onResumeClick={openResumeModal} />

      {/* Primary content sections */}
      <HeroSection typewriterText={typewriterText} />
      <AboutSection />
      <FeaturedProjects onOpen={setActiveProject} />
      <OtherProjects />
      <SkillsCarousel />
      <ExperienceSection />
      <ContactSection />

      {/* Global overlays */}
      {activeProject && (
        <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
      )}
      {resumeOpen && <ResumeModal onClose={() => setResumeOpen(false)} />}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   NAV
═══════════════════════════════════════════════════════════════════ */
function Nav({ onResumeClick }: { onResumeClick: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = ["About", "Projects", "Skills", "Experience", "Contact"];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      scrolled ? "bg-[#090909]/95 backdrop-blur-sm border-b border-white/5" : ""
    }`}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-16 h-14 sm:h-16 flex items-center justify-between">
        <a href="#" className="font-['Syne'] font-extrabold text-white text-lg tracking-tight hover:text-[#4AFFD4] transition-colors">
          hamza<span className="text-[#4AFFD4]">.</span>
        </a>

        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {links.map((item, i) => (
            <a key={item} href={`#${item.toLowerCase()}`}
              className="font-['DM_Mono'] text-xs text-[#888] hover:text-[#4AFFD4] transition-colors tracking-wider">
              <span className="text-[#4AFFD4] mr-1">{String(i + 1).padStart(2, "0")}.</span>{item}
            </a>
          ))}
          <button type="button" onClick={onResumeClick} className="flex items-center gap-2 px-4 py-2 border border-[#4AFFD4] text-[#4AFFD4] font-['DM_Mono'] text-xs hover:bg-[#4AFFD4]/10 transition-colors">
            <FileDown className="w-3 h-3" />Resume
          </button>
        </div>

        <button className="md:hidden flex flex-col gap-1.5 p-2 text-[#888]" onClick={() => setMobileOpen(!mobileOpen)}>
          <span className={`block w-5 h-0.5 bg-current transition-all duration-300 origin-center ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${mobileOpen ? "opacity-0 scale-x-0" : ""}`} />
          <span className={`block w-5 h-0.5 bg-current transition-all duration-300 origin-center ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? "max-h-80 border-b border-white/5" : "max-h-0"}`}>
        <div className="bg-[#090909] px-5 py-5 space-y-1">
          {links.map((item, i) => (
            <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 py-3 font-['DM_Mono'] text-sm text-[#888] hover:text-[#4AFFD4] transition-colors border-b border-white/4 last:border-0">
              <span className="text-[#4AFFD4] text-xs">{String(i + 1).padStart(2, "0")}.</span>{item}
            </a>
          ))}
          <div className="pt-3">
            <button type="button" onClick={() => { setMobileOpen(false); onResumeClick(); }} className="flex items-center gap-2 px-4 py-2.5 border border-[#4AFFD4] text-[#4AFFD4] font-['DM_Mono'] text-xs hover:bg-[#4AFFD4]/10 transition-colors w-fit">
              <FileDown className="w-3 h-3" />Download Resume
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════════════════════ */
function HeroSection({ typewriterText }: { typewriterText: string }) {
  const [heroPhoneMenuOpen, setHeroPhoneMenuOpen] = useState(false);
  const heroPhoneMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (event: MouseEvent) => {
      if (heroPhoneMenuRef.current && !heroPhoneMenuRef.current.contains(event.target as Node)) {
        setHeroPhoneMenuOpen(false);
      }
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, []);

  const copyHeroPhoneNumber = useCallback(async () => {
    await navigator.clipboard.writeText(PHONE_NUMBER);
    setHeroPhoneMenuOpen(false);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-14 sm:pt-16 px-5 sm:px-8 md:px-16 lg:px-24">
      <div className="max-w-7xl w-full mx-auto">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-12 xl:gap-20 items-center py-16 lg:py-0">

          {/* ── Left column ── */}
          <div className="space-y-6 sm:space-y-8">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="font-['Space_Mono'] text-[#4AFFD4] text-sm sm:text-base tracking-widest uppercase">
              Hi, my name is
            </motion.div>

            {/* 3-line name */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.1 }}>
              <h1 className="font-['Syne'] font-extrabold leading-[0.95] tracking-tight text-white">
                <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] xl:text-[5.5rem]">Syed M.</span>
                <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] xl:text-[5.5rem] text-[#4AFFD4]">Hamza</span>
                <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] xl:text-[5.5rem]">Sultan</span>
              </h1>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="font-['DM_Mono'] text-base sm:text-lg text-[#888] min-h-[2rem] flex items-center">
              {typewriterText}
              <motion.span
                aria-hidden="true"
                className="inline-block w-0.5 h-5 bg-[#4AFFD4] ml-1"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap items-center gap-3 sm:gap-4">
              <a href="#projects" className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-[#4AFFD4] text-[#090909] font-['DM_Mono'] text-xs sm:text-sm font-medium hover:bg-[#3de8c0] transition-colors">
                View Work<ArrowRight className="w-3.5 h-3.5" />
              </a>
              <a href="#contact" className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 border border-[#4AFFD4] text-[#4AFFD4] font-['DM_Mono'] text-xs sm:text-sm hover:bg-[#4AFFD4]/10 transition-colors">
                Get In Touch
              </a>
              <div className="flex items-center gap-4 pl-1 flex-wrap">
                {[{ Icon: Github, href: GITHUB_URL }, { Icon: Linkedin, href: LINKEDIN_URL }, { Icon: Mail, href: `mailto:${CONTACT_EMAIL}` }].map(({ Icon, href }, i) => (
                  <a key={i} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                    className="text-[#555] hover:text-[#4AFFD4] transition-colors"><Icon className="w-5 h-5" /></a>
                ))}
                <div ref={heroPhoneMenuRef} className="relative">
                  <button type="button" onClick={() => setHeroPhoneMenuOpen((value) => !value)} className="text-[#555] hover:text-[#4AFFD4] transition-colors">
                    <Phone className="w-5 h-5" />
                  </button>
                  {heroPhoneMenuOpen && (
                    <div className="absolute left-1/2 top-[calc(100%+0.75rem)] -translate-x-1/2 w-56 border border-white/8 bg-[#0d0d0d]/95 backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.55)] z-20">
                      <button type="button" onClick={copyHeroPhoneNumber} className="w-full flex items-center gap-2 px-4 py-3 text-left text-[#bbb] hover:text-[#4AFFD4] hover:bg-[#4AFFD4]/5 transition-colors font-['DM_Mono'] text-[11px] border-b border-white/6">
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Number</span>
                      </button>
                      <a href={`tel:${PHONE_NUMBER.replace(/\s/g, "")}`} className="w-full flex items-center gap-2 px-4 py-3 text-[#bbb] hover:text-[#4AFFD4] hover:bg-[#4AFFD4]/5 transition-colors font-['DM_Mono'] text-[11px] border-b border-white/6">
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Make a Phone Call</span>
                      </a>
                      <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="w-full flex items-center gap-2 px-4 py-3 text-[#bbb] hover:text-[#4AFFD4] hover:bg-[#4AFFD4]/5 transition-colors font-['DM_Mono'] text-[11px]">
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Drop a WhatsApp Message</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── Right column: floating terminal ── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="hidden lg:block"
          >
            <FloatingTerminal />
          </motion.div>
        </div>
      </div>

      <motion.div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
        <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5 text-[#4AFFD4]/40" />
      </motion.div>
    </section>
  );
}

function FloatingTerminal() {
  return (
    <motion.div
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      className="relative"
    >
      {/* Drop shadow */}
      <div className="absolute inset-0 translate-y-4 bg-[#4AFFD4]/10 blur-2xl rounded-none" />
      {/* Gradient border */}
      <GradientBorder from="#4AFFD4" via="#7B61FF" to="#7B61FF00">
        {/* Terminal inner */}
        <div
          className="relative overflow-hidden"
          style={{
            background: "radial-gradient(ellipse at top right, rgba(74,255,212,0.06) 0%, transparent 60%), radial-gradient(ellipse at bottom left, rgba(123,97,255,0.06) 0%, transparent 60%), #0d0d0d",
          }}
        >
          {/* Dot grid */}
          <div className="absolute inset-0 opacity-30"
            style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

          {/* Window chrome */}
          <div className="relative flex items-center gap-2 px-4 py-3 border-b border-white/6">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF6B6B]/60" />
              <div className="w-3 h-3 rounded-full bg-[#FFD166]/60" />
              <div className="w-3 h-3 rounded-full bg-[#4AFFD4]/60" />
            </div>
            <span className="ml-2 font-['DM_Mono'] text-xs text-[#333]">hamza.config.js</span>
          </div>

          {/* Code body */}
          <div className="relative p-6 sm:p-7 font-['DM_Mono'] text-sm leading-7">
            <div><span className="text-[#7B61FF]">const </span><span className="text-[#4AFFD4]">hamza</span><span className="text-[#666]"> = </span><span className="text-[#888]">{"{"}</span></div>
            <div className="pl-5 space-y-0.5">
              <CL k="role" v={`"AI Engineer & Data Scientist"`} />
              <CL k="university" v={`"Bahria University"`} />
              <div><span className="text-[#fff]">semester</span><span className="text-[#666]">: </span><span className="text-[#FFB36B]">6</span><span className="text-[#666]">,</span></div>
              <div><span className="text-[#fff]">shipped</span><span className="text-[#666]">: [</span></div>
              <div className="pl-5 space-y-0.5">
                {[`"VertexClassify - iOS NLP App"`, `"Spice Hut - Production Apps + Website"`, `"Fool Classifier ML Model"`].map((v, i, a) => (
                  <div key={i}><span className="text-[#FFB36B]">{v}</span>{i < a.length - 1 && <span className="text-[#666]">,</span>}</div>
                ))}
              </div>
              <div><span className="text-[#666]">],</span></div>
              <CL k="openTo" v={`"Internships & Collabs"`} last />
            </div>
            <div><span className="text-[#888]">{"}"}</span></div>
            <div className="pt-4 space-y-1">
              <div><span className="text-[#444]">// </span><span className="text-[#4AFFD4]/50">currently building Vertex Solutions</span></div>
              <div className="flex items-center gap-1 flex-wrap">
                <span className="text-[#444]">// </span>
                <span className="text-[#4AFFD4]/50">Kult Agency loading</span>
                <span className="inline-flex items-center gap-0.5 text-[#4AFFD4]/50" aria-hidden="true">
                  <motion.span animate={{ opacity: [0.25, 1, 0.25] }} transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}>.</motion.span>
                  <motion.span animate={{ opacity: [0.25, 1, 0.25] }} transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}>.</motion.span>
                  <motion.span animate={{ opacity: [0.25, 1, 0.25] }} transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}>.</motion.span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </GradientBorder>
    </motion.div>
  );
}

function CL({ k, v, last }: { k: string; v: string; last?: boolean }) {
  return (
    <div>
      <span className="text-[#fff]">{k}</span>
      <span className="text-[#666]">: </span>
      <span className="text-[#FFB36B]">{v}</span>
      {!last && <span className="text-[#666]">,</span>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ABOUT
═══════════════════════════════════════════════════════════════════ */
function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const learningItems = ["Deep Learning", "MLOps", "LLMs", "RAG Systems", "Data Engineering", "Advanced ML Architectures"];

  return (
    <section id="about" ref={ref} className="py-20 sm:py-32 px-5 sm:px-8 md:px-16 lg:px-24">
      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <motion.div initial={{ opacity: 0, x: -16 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.5 }}
          className="mb-8 sm:mb-12">
          <div className="font-['Space_Mono'] text-xs text-[#4AFFD4] uppercase tracking-widest flex items-center gap-3 mb-2">
            <span>01.</span><div className="flex-1 h-px bg-white/5" />
          </div>
          <div className="font-['Syne'] font-extrabold text-[60px] sm:text-[80px] leading-none text-white/4 select-none">About</div>
        </motion.div>

        {/* Two-column layout — stacks naturally on mobile */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          {/* Body text — always flows below heading */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.1 }}
            className="flex-1 space-y-4 sm:space-y-5 font-['DM_Mono'] text-sm sm:text-[15px] text-[#888] leading-7">
            <p>
              6th-semester BSCS student at Bahria University Islamabad, specializing in Data Science and Machine Learning. My work sits at the intersection of applied AI, full-stack engineering, and product deployment — I don't stop at model training; I ship.
            </p>
            <p>
              Learning style is project-driven: build systems, experiment with technologies, solve real problems, iterate. This has produced an uncommon combination for a student at this level — NLP pipelines, iOS deployment, production SaaS, and startup-grade client work, all before graduating.
            </p>
            <p>
              Core interests span NLP & text classification, computer vision, intelligent application architecture, end-to-end ML pipelines, and modern frontend development with immersive interactions.
            </p>
          </motion.div>

          {/* Sidebar: education card + ticker */}
          <div className="lg:w-80 xl:w-96 space-y-6 sm:space-y-7 flex-shrink-0">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.2 }}>
              <div className="border border-white/6 bg-[#111] p-5 flex items-start gap-4">
                <div className="w-px self-stretch bg-[#4AFFD4] min-h-[2.5rem] flex-shrink-0" />
                <div>
                  <div className="font-['Space_Mono'] text-[10px] text-[#4AFFD4] uppercase tracking-widest mb-1">Education</div>
                  <div className="font-['DM_Mono'] text-sm text-white">BS Computer Science · Bahria University Islamabad</div>
                  <div className="font-['DM_Mono'] text-xs text-[#555] mt-0.5">6th Semester · Data Science & ML Track</div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.3 }}>
              <div className="font-['Space_Mono'] text-[10px] text-[#555] uppercase tracking-widest mb-3">Currently Learning</div>
              <div className="overflow-hidden">
                <motion.div className="flex gap-3 w-max" animate={{ x: ["0%", "-50%"] }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }}>
                  {[...learningItems, ...learningItems].map((item, i) => (
                    <div key={i} className="px-3 py-1.5 border border-white/6 bg-[#111] font-['DM_Mono'] text-xs text-[#555] whitespace-nowrap hover:border-[#4AFFD4]/40 hover:text-[#4AFFD4] transition-colors cursor-default">
                      {item}
                    </div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   FEATURED PROJECTS
═══════════════════════════════════════════════════════════════════ */
function FeaturedProjects({ onOpen }: { onOpen: (p: Project) => void }) {
  return (
    <section id="projects" className="py-20 sm:py-32 px-5 sm:px-8 md:px-16 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <div className="font-['Space_Mono'] text-xs text-[#4AFFD4] uppercase tracking-widest flex items-center gap-3 mb-12 sm:mb-20">
          <span>02.</span><span>Featured Projects</span><div className="flex-1 h-px bg-white/5" />
        </div>
        <div className="space-y-px">
          {FEATURED_PROJECTS.map((p, i) => (
            <ProjectRow key={i} project={p} index={i} onOpen={onOpen} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectRow({ project, index, onOpen }: { project: Project; index: number; onOpen: (p: Project) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const track = useMouseTrack();

  const tiltX = track.hovered ? (track.mouse.y - 0.5) * -4 : 0;
  const tiltY = track.hovered ? (track.mouse.x - 0.5) * 4 : 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, scale: 0.98 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.75, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        ref={track.ref}
        onMouseMove={track.onMove}
        onMouseEnter={track.onEnter}
        onMouseLeave={track.onLeave}
        className="relative group border border-white/6 bg-[#0d0d0d] overflow-hidden"
        style={{
          transform: `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
          transition: track.hovered ? "transform 0.12s ease" : "transform 0.5s ease",
        }}
      >
        <CursorGlow mouse={track.mouse} hovered={track.hovered} accent={project.accent} size={600} />

        <div className="relative z-10 grid lg:grid-cols-12">
          {/* Visual panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.12 + 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-4 relative min-h-[160px] sm:min-h-[200px] lg:min-h-[280px] overflow-hidden border-b border-white/6 lg:border-b-0"
            style={{ background: `radial-gradient(ellipse at 30% 50%, ${project.accent}14 0%, transparent 70%)` }}
          >
            <div className="absolute inset-0 opacity-25"
              style={{ backgroundImage: `radial-gradient(circle, ${project.accent}35 1px, transparent 1px)`, backgroundSize: "22px 22px" }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="font-['Syne'] font-extrabold text-[80px] sm:text-[100px] leading-none select-none transition-transform duration-500 group-hover:scale-105"
                style={{ color: `${project.accent}14` }}>{project.number}</div>
            </div>
            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6">
              <div className="font-['Space_Mono'] text-[9px] sm:text-[10px] uppercase tracking-widest" style={{ color: project.accent }}>
                {project.subtitle}
              </div>
            </div>
          </motion.div>

          {/* Content panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.12 + 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-8 p-5 sm:p-7 lg:p-10 lg:border-l border-white/6 min-w-0 w-full"
          >
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <h3 className="font-['Syne'] font-extrabold text-xl sm:text-2xl md:text-3xl text-white leading-tight">
                {project.title}
              </h3>
              <button onClick={() => onOpen(project)}
                className="p-2 text-[#333] hover:text-[#4AFFD4] transition-colors flex-shrink-0 ml-3 border border-transparent hover:border-white/10">
                <ExternalLink className="w-4 h-4" style={{ color: track.hovered ? project.accent : undefined }} />
              </button>
            </div>

            <p className="font-['DM_Mono'] text-xs sm:text-sm text-[#888] leading-6 mb-5 sm:mb-6">{project.pitch}</p>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px mb-5 sm:mb-6 border border-white/6 bg-white/4 w-full">
              {project.metrics.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: index * 0.12 + 0.3 + i * 0.06 }}
                  className="p-3 sm:p-3.5 bg-[#090909]">
                  <div className="font-['Syne'] font-extrabold text-base sm:text-lg text-white transition-colors duration-300"
                    style={{ color: track.hovered ? project.accent : "white" }}>{m.value}</div>
                  <div className="font-['DM_Mono'] text-[9px] sm:text-[10px] text-[#555] uppercase tracking-wider mt-0.5">{m.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Pipeline */}
            <div className="mb-5 sm:mb-6 w-full">
              <PipelineLoop nodes={project.pipeline} accent={project.accent} />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   PROJECT MODAL
═══════════════════════════════════════════════════════════════════ */
function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}
        className="absolute inset-0 bg-[#090909]/85 backdrop-blur-md" onClick={onClose} />

      {/* Modal panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{ boxShadow: `0 40px 80px rgba(0,0,0,0.6), 0 0 60px ${project.accent}18` }}
      >
        <GradientBorder from={project.accent} via="#7B61FF" to="#7B61FF00">
          <div className="bg-[#0d0d0d]"
            style={{ background: `radial-gradient(ellipse at top right, ${project.accent}08 0%, transparent 50%), #0d0d0d` }}>

            {/* Header */}
            <div className="flex items-start justify-between p-5 sm:p-6 border-b border-white/6">
              <div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {project.tags.map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 border font-['Space_Mono'] text-[9px] uppercase tracking-widest"
                      style={{ borderColor: `${project.accent}40`, color: project.accent, backgroundColor: `${project.accent}10` }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="font-['Syne'] font-extrabold text-2xl sm:text-3xl text-white">{project.title}</h2>
                <p className="font-['DM_Mono'] text-xs text-[#555] mt-1">{project.subtitle}</p>
              </div>
              <button onClick={onClose} className="p-2 text-[#444] hover:text-white transition-colors border border-transparent hover:border-white/10 flex-shrink-0 ml-4">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Visual placeholder */}
            <div className="mx-5 sm:mx-6 mt-5 sm:mt-6 relative h-44 sm:h-56 overflow-hidden border border-white/6"
              style={{ background: `radial-gradient(ellipse at 30% 50%, ${project.accent}10 0%, transparent 70%)` }}>
              <div className="absolute inset-0 opacity-20"
                style={{ backgroundImage: `radial-gradient(circle, ${project.accent}40 1px, transparent 1px)`, backgroundSize: "20px 20px" }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-['Syne'] font-extrabold text-[120px] leading-none select-none"
                  style={{ color: `${project.accent}10` }}>{project.number}</span>
              </div>
              <div className="absolute bottom-3 left-4 font-['Space_Mono'] text-[10px] uppercase tracking-widest" style={{ color: project.accent }}>
                Project Preview
              </div>
            </div>

            {/* Body */}
            <div className="p-5 sm:p-6 space-y-6">
              {/* Description */}
              <p className="font-['DM_Mono'] text-sm text-[#888] leading-6">{project.pitch}</p>

              {/* Metrics */}
              <div>
                <div className="font-['Space_Mono'] text-[10px] text-[#444] uppercase tracking-widest mb-3">Metrics</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-px border border-white/6 bg-white/4">
                  {project.metrics.map((m, i) => (
                    <div key={i} className="p-3 bg-[#090909]">
                      <div className="font-['Syne'] font-extrabold text-lg" style={{ color: project.accent }}>{m.value}</div>
                      <div className="font-['DM_Mono'] text-[9px] text-[#555] uppercase tracking-wider mt-0.5">{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <div className="font-['Space_Mono'] text-[10px] text-[#444] uppercase tracking-widest mb-3">Tech Stack</div>
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((tech, i) => (
                    <span key={i} className="px-3 py-1.5 border border-white/8 bg-[#111] font-['DM_Mono'] text-xs text-[#666]">{tech}</span>
                  ))}
                </div>
              </div>

              {/* Pipeline */}
              <div>
                <div className="font-['Space_Mono'] text-[10px] text-[#444] uppercase tracking-widest mb-3">Architecture</div>
                <PipelineLoop nodes={project.pipeline} accent={project.accent} compact />
              </div>

              {/* Links */}
              <div className="flex flex-wrap gap-3 pt-2">
                {project.appStore && (
                  <a href={project.appStore} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 border font-['DM_Mono'] text-xs hover:bg-white/5 transition-colors"
                    style={{ borderColor: `${project.accent}50`, color: project.accent }}>
                    <Apple className="w-3.5 h-3.5" />App Download
                  </a>
                )}
                {project.live && (
                  <a href={project.live} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 border font-['DM_Mono'] text-xs hover:bg-white/5 transition-colors"
                    style={{ borderColor: `${project.accent}50`, color: project.accent }}>
                    <ExternalLink className="w-3.5 h-3.5" />Live Website
                  </a>
                )}
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 border font-['DM_Mono'] text-xs hover:bg-white/5 transition-colors"
                    style={{ borderColor: `${project.accent}50`, color: project.accent }}>
                    <Github className="w-3.5 h-3.5" />GitHub
                  </a>
                )}
              </div>
            </div>
          </div>
        </GradientBorder>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   OTHER PROJECTS
═══════════════════════════════════════════════════════════════════ */
// Compact project cards rendered in the "Other Projects" grid section.
interface OtherProject {
  title: string;
  type: string;
  description: string;
  stack: string[];
  repo?: string;
}

const OTHER_PROJECTS: OtherProject[] = [
  { title: "Medical Practice SaaS", type: "Prototype · Research", description: "Prototype platform for clinic operations, built to validate scheduling, records, and workflow automation before production deployment.", stack: ["Prototype", "Research", "React", "Node.js", "PostgreSQL"] },
  { title: "Compiler Construction", type: "Semester Project · Systems", description: "Compiler pipeline implementation covering lexical analysis, syntax parsing, AST generation, and backend fundamentals.", stack: ["C++", "Compiler Design", "Parsing", "x86"] },
  { title: "HCI Analysis System", type: "Semester Project · HCI", description: "Human-Computer Interaction analysis project focused on usability evaluation, interaction patterns, and design recommendations.", stack: ["HCI", "Usability", "UX Research", "Evaluation"] },
  { title: "Flappy Bird Clone", type: "Semester Project · OOP", description: "Object-Oriented Programming project with gameplay loop, collision detection, and persistent score records using SFML.", stack: ["C++", "SFML", "OOP", "Game Loop"], repo: "https://github.com/hamziCodes/Flappy-Bird-SFML_Project" },
  { title: "Plate & Fork", type: "Semester Project · CP Lab", description: "Desktop recipe and inventory manager developed as the Computer Programming Lab semester project at Bahria University.", stack: ["C++", "Qt Widgets", "File I/O", "Cook Timer"], repo: "https://github.com/hamziCodes/Plate-Fork-QT_Project" },
  { title: "Qt Compression App (ZIPIFY)", type: "Semester Project · DSA", description: "Data Structures and Algorithms project implementing Huffman coding with compression/decompression and tree visualization.", stack: ["C++", "Qt", "Huffman Coding", "Priority Queue"], repo: "https://github.com/hamziCodes/Huffman-Compression-QT_Project" },
];

function OtherProjects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="py-16 sm:py-20 px-5 sm:px-8 md:px-16 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <div className="font-['Space_Mono'] text-xs text-[#4AFFD4] uppercase tracking-widest flex items-center gap-3 mb-10 sm:mb-12">
          <span>03.</span><span>Other Projects</span><div className="flex-1 h-px bg-white/5" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/4">
          {OTHER_PROJECTS.map((project, index) => (
            <OtherProjectCard key={index} project={project} index={index} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function OtherProjectCard({ project, index, isInView }: { project: OtherProject; index: number; isInView: boolean }) {
  const track = useMouseTrack();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: index * 0.08 }}
    >
      <div
        ref={track.ref}
        onMouseMove={track.onMove}
        onMouseEnter={track.onEnter}
        onMouseLeave={track.onLeave}
        className="relative group transition-colors overflow-hidden h-full"
        style={{
          background:
            "radial-gradient(160% 120% at 12% -10%, rgba(74,255,212,0.14) 0%, rgba(74,255,212,0.02) 32%, rgba(11,11,11,1) 76%), linear-gradient(140deg, #121212 0%, #0d0d0d 55%, #0a0a0a 100%)",
        }}
      >
        {/* Gradient border glow on hover */}
        <div className="absolute inset-0 pointer-events-none transition-opacity duration-500"
          style={{
            opacity: track.hovered ? 1 : 0,
            background: `radial-gradient(420px circle at ${track.mouse.x * 100}% ${track.mouse.y * 100}%, rgba(74,255,212,0.14), transparent 62%)`,
          }} />
        {/* Hover top-border accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4AFFD4]/60 to-transparent transition-opacity duration-500"
          style={{ opacity: track.hovered ? 1 : 0 }} />

        <div className="relative z-10 p-5 sm:p-6 flex flex-col h-full min-h-[200px]">
          <div className="flex items-start justify-between mb-4">
            <span className="font-['Space_Mono'] text-[9px] text-[#444] uppercase tracking-widest border border-white/6 px-2 py-1">
              {project.type}
            </span>
          </div>
          <h3 className="font-['Syne'] font-extrabold text-base sm:text-lg text-white mb-2 sm:mb-3">{project.title}</h3>
          <p className="font-['DM_Mono'] text-xs text-[#555] leading-5 mb-4 sm:mb-5 flex-1">{project.description}</p>
          <div className="flex flex-wrap gap-x-2 gap-y-1">
            {project.stack.map((t, i) => <span key={i} className="font-['Space_Mono'] text-[10px] text-[#333]">{t}</span>)}
          </div>
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 self-start font-['Space_Mono'] text-[10px] uppercase tracking-widest text-[#4AFFD4] hover:text-white transition-colors"
            >
              <Github className="w-3 h-3" />
              Git Repo
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SKILLS CAROUSEL
═══════════════════════════════════════════════════════════════════ */
const SKILL_GROUPS = [
  {
    title: "Machine Learning & AI",
    Icon: Brain,
    accent: "#4AFFD4",
    skills: ["Python", "Scikit-learn", "TensorFlow", "PyTorch", "NLP", "Computer Vision", "Feature Engineering", "Transfer Learning", "RAG"],
  },
  {
    title: "Development & Engineering",
    Icon: Code2,
    accent: "#7B61FF",
    skills: ["React", "Flutter", "Swift", "Node.js", "FastAPI", "Firebase", "Supabase", "n8n", "Three.js"],
  },
  {
    title: "CS Fundamentals",
    Icon: Database,
    accent: "#FF6B6B",
    skills: ["OOP", "DSA", "DBMS", "Compiler Construction", "Software Engineering", "HCI", "System Design"],
  },
  {
    title: "Tools & Workflow",
    Icon: Wrench,
    accent: "#FFD166",
    skills: ["Git", "UI/UX Prototyping", "VS Code", "Cursor", "GitHub Copilot", "Claude", "Android Studio"],
  },
];

function SkillsCarousel() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  // Duplicate for seamless loop
  const cards = [...SKILL_GROUPS, ...SKILL_GROUPS];

  return (
    <section id="skills" ref={ref} className="py-20 sm:py-32">
      {/* Section header */}
      <div className="px-5 sm:px-8 md:px-16 lg:px-24 max-w-6xl mx-auto mb-12 sm:mb-16">
        <div className="font-['Space_Mono'] text-xs text-[#4AFFD4] uppercase tracking-widest flex items-center gap-3">
          <span>04.</span><span>Skills & Technologies</span><div className="flex-1 h-px bg-white/5" />
        </div>
      </div>

      {/* Carousel — full-bleed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden"
      >
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, #090909, transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, #090909, transparent)" }} />

        <motion.div
          className="flex gap-4 sm:gap-5 w-max py-2"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        >
          {cards.map((group, i) => (
            <SkillCard key={i} group={group} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

function SkillCard({ group }: { group: typeof SKILL_GROUPS[0] }) {
  const track = useMouseTrack();

  return (
    <div
      ref={track.ref}
      onMouseMove={track.onMove}
      onMouseEnter={track.onEnter}
      onMouseLeave={track.onLeave}
      className="relative w-64 sm:w-72 flex-shrink-0 border border-white/6 bg-[#0d0d0d] overflow-hidden transition-colors duration-300"
      style={{
        borderColor: track.hovered ? `${group.accent}40` : undefined,
        boxShadow: track.hovered ? `0 8px 40px ${group.accent}15, 0 2px 8px rgba(0,0,0,0.4)` : undefined,
        transform: `perspective(800px) rotateX(${track.hovered ? (track.mouse.y - 0.5) * -3 : 0}deg) rotateY(${track.hovered ? (track.mouse.x - 0.5) * 3 : 0}deg)`,
        transition: track.hovered ? "transform 0.12s ease, border-color 0.3s, box-shadow 0.3s" : "transform 0.5s ease, border-color 0.3s, box-shadow 0.3s",
      }}
    >
      {/* Cursor glow */}
      <CursorGlow mouse={track.mouse} hovered={track.hovered} accent={group.accent} size={350} />
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px transition-opacity duration-300"
        style={{ background: `linear-gradient(to right, transparent, ${group.accent}80, transparent)`, opacity: track.hovered ? 1 : 0 }} />

      <div className="relative z-10 p-5 sm:p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <group.Icon className="w-4 h-4 flex-shrink-0" style={{ color: group.accent }} />
          <h3 className="font-['Syne'] font-extrabold text-xs text-white uppercase tracking-wide">{group.title}</h3>
        </div>
        <div className="space-y-2">
          {group.skills.map((skill, si) => (
            <div key={si} className="flex items-center gap-2">
              <div className="w-1 h-1 flex-shrink-0 transition-colors duration-200"
                style={{ backgroundColor: track.hovered ? group.accent : "rgba(255,255,255,0.15)" }} />
              <span className="font-['DM_Mono'] text-xs text-[#555] transition-colors duration-200"
                style={{ color: track.hovered ? "#aaa" : undefined }}>{skill}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   EXPERIENCE
═══════════════════════════════════════════════════════════════════ */
const TIMELINE = [
  {
    date: "2025 – Present",
    title: "Founder / Lead Architect",
    org: "Vertex Solutions",
    description: "End-to-end software delivery, AI-integrated product development, ultra-minimalist corporate branding and design systems.",
    tags: ["React", "Flutter", "Python", "ML", "n8n"],
  },
  {
    date: "2023 – Present",
    title: "BS Computer Science",
    org: "Bahria University Islamabad",
    description: "6th Semester, specializing in Data Science and Machine Learning with a project-driven learning approach.",
    tags: ["Data Science", "ML", "Engineering"],
  },
  {
    date: "2025 – Present",
    title: "Member",
    org: "Team WorthAWhile",
    description: "Spearheaded community service outreach, organizing and managing large-scale events including food and clothing drives.",
    tags: ["Leadership", "Community"],
  },
];

function ExperienceSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="experience" ref={ref} className="py-20 sm:py-32 px-5 sm:px-8 md:px-16 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <div className="font-['Space_Mono'] text-xs text-[#4AFFD4] uppercase tracking-widest flex items-center gap-3 mb-12 sm:mb-16">
          <span>05.</span><span>Experience</span><div className="flex-1 h-px bg-white/5" />
        </div>

        <div className="relative pl-6 sm:pl-10">
          <div className="absolute left-0 top-2 bottom-2 w-px bg-gradient-to-b from-[#4AFFD4] via-[#7B61FF]/50 to-transparent" />

          <div className="space-y-px">
            {TIMELINE.map((item, index) => (
              <ExperienceCard key={index} item={item} index={index} isInView={isInView} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ExperienceCard({ item, index, isInView }: { item: typeof TIMELINE[0]; index: number; isInView: boolean }) {
  const track = useMouseTrack();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="relative group mb-px"
    >
      {/* Timeline dot */}
      <div className="absolute left-[-1.55rem] sm:left-[-2.6rem] top-5 w-2.5 h-2.5 border-2 border-[#4AFFD4] bg-[#090909] group-hover:bg-[#4AFFD4] transition-colors" />

      <div
        ref={track.ref}
        onMouseMove={track.onMove}
        onMouseEnter={track.onEnter}
        onMouseLeave={track.onLeave}
        className="relative border border-white/6 bg-[#0d0d0d] overflow-hidden"
        style={{
          transform: track.hovered ? "scale(1.01)" : "scale(1)",
          boxShadow: track.hovered ? "0 12px 40px rgba(0,0,0,0.4), 0 0 30px rgba(74,255,212,0.07)" : "none",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
        }}
      >
        <CursorGlow mouse={track.mouse} hovered={track.hovered} accent="#4AFFD4" size={400} />
        {/* Hover accent border */}
        <div className="absolute top-0 left-0 right-0 h-px transition-opacity duration-300"
          style={{ background: "linear-gradient(to right, transparent, rgba(74,255,212,0.6), transparent)", opacity: track.hovered ? 1 : 0 }} />

        <div className="relative z-10 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-2 sm:mb-3">
            <div>
              <h3 className="font-['Syne'] font-extrabold text-base sm:text-lg text-white">{item.title}</h3>
              <div className="font-['DM_Mono'] text-xs sm:text-sm text-[#4AFFD4] mt-0.5">{item.org}</div>
            </div>
            <div className="font-['Space_Mono'] text-[10px] sm:text-xs text-[#444] sm:text-right flex-shrink-0">{item.date}</div>
          </div>
          <p className="font-['DM_Mono'] text-xs sm:text-sm text-[#555] leading-5 sm:leading-6 mb-4">{item.description}</p>
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag, i) => (
              <span key={i} className="px-2 py-0.5 border border-white/6 font-['Space_Mono'] text-[9px] sm:text-[10px] text-[#444] uppercase tracking-wider">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   CONTACT
═══════════════════════════════════════════════════════════════════ */
function ContactSection() {
  const [blink, setBlink] = useState(true);
  const [phoneMenuOpen, setPhoneMenuOpen] = useState(false);
  const phoneMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => setBlink(v => !v), 530);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const onDown = (event: MouseEvent) => {
      if (phoneMenuRef.current && !phoneMenuRef.current.contains(event.target as Node)) {
        setPhoneMenuOpen(false);
      }
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, []);

  const copyPhoneNumber = useCallback(async () => {
    await navigator.clipboard.writeText(PHONE_NUMBER);
    setPhoneMenuOpen(false);
  }, []);

  return (
    <section id="contact" className="py-20 sm:py-32 px-5 sm:px-8 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="font-['Space_Mono'] text-xs text-[#4AFFD4] uppercase tracking-widest flex items-center gap-3 mb-10 sm:mb-12">
          <span>06.</span><span>Get In Touch</span><div className="flex-1 h-px bg-white/5" />
        </div>

        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="space-y-10 sm:space-y-12">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 xl:gap-16 items-start">
            <div className="space-y-6 sm:space-y-8 pr-0 xl:pr-8">
              <h2 className="font-['Syne'] font-extrabold text-3xl sm:text-4xl md:text-5xl text-white leading-tight">
                {"Let's build\nsomething."}
              </h2>
              <p className="font-['DM_Mono'] text-xs sm:text-sm text-[#555] leading-6 max-w-sm">
                Open to internships, freelance projects, and meaningful collaborations. If you have something in mind, reach out.
              </p>
            </div>

            {/* Floating terminal — matches hero style */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative lg:justify-self-end w-full max-w-[460px] xl:max-w-[540px]"
            >
              <div className="absolute inset-0 translate-y-3 bg-[#4AFFD4]/8 blur-xl" />
              <GradientBorder from="#4AFFD4" via="#7B61FF" to="#7B61FF00">
                <div className="relative overflow-hidden"
                  style={{ background: "radial-gradient(ellipse at top right, rgba(74,255,212,0.05) 0%, transparent 60%), radial-gradient(ellipse at bottom left, rgba(123,97,255,0.05) 0%, transparent 60%), #0d0d0d" }}>
                  <div className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

                  <div className="relative flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-white/6">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B6B]/50" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#FFD166]/50" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#4AFFD4]/50" />
                    </div>
                    <span className="font-['DM_Mono'] text-[10px] text-[#333] ml-2">terminal</span>
                  </div>
                  <div className="relative p-5 sm:p-6 xl:p-7 font-['DM_Mono'] text-xs sm:text-sm space-y-2 leading-6">
                    <div className="flex items-center gap-2">
                      <span className="text-[#7B61FF]">➜</span>
                      <span className="text-[#4AFFD4]">hamza.</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                      <span className="text-[#fff]">status</span>
                      <span className="text-[#666]">:</span>
                      <span className="text-[#FFB36B] break-all">open to internships & collaborations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#fff]">location</span>
                      <span className="text-[#666]">:</span>
                      <span className="text-[#FFB36B]">Islamabad, PK</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                      <span className="text-[#fff]">email</span>
                      <span className="text-[#666]">:</span>
                      <span className="text-[#FFB36B]">{CONTACT_EMAIL}</span>
                      <span className={`inline-block w-1.5 sm:w-2 h-3.5 sm:h-4 bg-[#4AFFD4] flex-shrink-0 transition-opacity ${blink ? "opacity-100" : "opacity-0"}`} />
                    </div>
                  </div>
                </div>
              </GradientBorder>
            </motion.div>
          </div>

          {/* Social row */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-3 border border-white/6 text-[#444] hover:text-[#4AFFD4] hover:border-[#4AFFD4]/30 hover:bg-[#4AFFD4]/5 transition-all font-['DM_Mono'] text-[10px] sm:text-xs">
              <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>GitHub</span>
            </a>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-3 border border-white/6 text-[#444] hover:text-[#4AFFD4] hover:border-[#4AFFD4]/30 hover:bg-[#4AFFD4]/5 transition-all font-['DM_Mono'] text-[10px] sm:text-xs">
              <Linkedin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>LinkedIn</span>
            </a>
            <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-2 px-4 py-3 border border-white/6 text-[#444] hover:text-[#4AFFD4] hover:border-[#4AFFD4]/30 hover:bg-[#4AFFD4]/5 transition-all font-['DM_Mono'] text-[10px] sm:text-xs">
              <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Email</span>
            </a>
            <div ref={phoneMenuRef} className="relative">
              <button type="button" onClick={() => setPhoneMenuOpen((value) => !value)} className="flex items-center gap-2 px-4 py-3 border border-white/6 text-[#444] hover:text-[#4AFFD4] hover:border-[#4AFFD4]/30 hover:bg-[#4AFFD4]/5 transition-all font-['DM_Mono'] text-[10px] sm:text-xs">
                <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Phone Number</span>
              </button>
              {phoneMenuOpen && (
                <div className="absolute left-1/2 bottom-[calc(100%+0.75rem)] -translate-x-1/2 w-56 border border-white/8 bg-[#0d0d0d]/95 backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.55)] z-20">
                  <button type="button" onClick={copyPhoneNumber} className="w-full flex items-center gap-2 px-4 py-3 text-left text-[#bbb] hover:text-[#4AFFD4] hover:bg-[#4AFFD4]/5 transition-colors font-['DM_Mono'] text-[11px] border-b border-white/6">
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Number</span>
                  </button>
                  <a href={`tel:${PHONE_NUMBER.replace(/\s/g, "")}`} className="w-full flex items-center gap-2 px-4 py-3 text-[#bbb] hover:text-[#4AFFD4] hover:bg-[#4AFFD4]/5 transition-colors font-['DM_Mono'] text-[11px] border-b border-white/6">
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Make a Phone Call</span>
                  </a>
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="w-full flex items-center gap-2 px-4 py-3 text-[#bbb] hover:text-[#4AFFD4] hover:bg-[#4AFFD4]/5 transition-colors font-['DM_Mono'] text-[11px]">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Drop a WhatsApp Message</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <div className="mt-16 sm:mt-24 pt-6 sm:pt-8 border-t border-white/5">
          <p className="font-['DM_Mono'] text-[10px] sm:text-xs text-[#2a2a2a] text-center">
            © 2026 Syed Muhammad Hamza Sultan. Vertex Solutions.
          </p>
        </div>
      </div>
    </section>
  );
}

function ResumeModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }} className="absolute inset-0 bg-[#090909]/85 backdrop-blur-xl" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-5xl h-[88vh] overflow-hidden border border-white/10 bg-[#0d0d0d]/95 backdrop-blur-2xl shadow-[0_40px_100px_rgba(0,0,0,0.65)]"
      >
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-white/8 bg-white/3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B6B]/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#FFD166]/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#4AFFD4]/60" />
          </div>
          <div className="font-['DM_Mono'] text-[10px] sm:text-xs text-[#555]">Hamza_CV.pdf</div>
          <button type="button" onClick={onClose} className="p-2 text-[#555] hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="h-[calc(88vh-49px)] bg-[#090909]">
          <iframe
            title="Resume PDF"
            src="/Hamza_CV.pdf#view=FitH"
            className="h-full w-full border-0"
          />
        </div>
      </motion.div>
    </div>
  );
}
