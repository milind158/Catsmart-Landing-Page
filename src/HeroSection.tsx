import { useRef, useMemo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { useIsMobile } from "./use-mobile";
import { technologies } from "./technologies";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const text3DStyle = {
  textShadow:
    "1px 1px 0px #330000, 2px 2px 0px #330000, 3px 3px 0px #330000, " +
    "4px 4px 0px #330000, 5px 5px 0px #330000, 6px 6px 0px #330000, 7px 7px 0px #330000",
};

const shatterTemplates = Array.from({ length: 20 }).map(() => ({
  x: Math.random(),
  y: Math.random(),
  r: Math.random(),
  s: Math.random(),
}));

const renderTechnologyHeading = (heading: string) => {
  const lines = heading === "Command & Control"
    ? ["Command &", "Control"]
    : heading === "Research & Customisation"
      ? ["Research &", "Customisation"]
      : null;

  return lines ? lines.map((line) => <span key={line} className="block">{line}</span>) : heading;
};

// ─────────────────────────────────────────────────────────────────────────────


// ─────────────────────────────────────────────────────────────────────────────
// SHATTER LETTER — DOM span, active AFTER engraving, handles scroll V-explosion
// ─────────────────────────────────────────────────────────────────────────────

const ShatterLetter = ({ char, progress, index, totalLength, isMobile, reduceMotion }: { char: string, progress: any, index: number, totalLength: number, isMobile?: boolean, reduceMotion: boolean | null }) => {
  const isLeft = isMobile ? true : index < totalLength / 2;
  const middle = Math.floor(totalLength / 2);
  const distFromCenter = Math.abs(isLeft ? middle - 1 - index : index - middle);

  // Clamp index and ensure it is non-negative to avoid undefined template lookups
  const templateIndex = Math.max(0, Math.min(distFromCenter, shatterTemplates.length - 1));
  const template = shatterTemplates[templateIndex] || shatterTemplates[0];

  const randomX = useMemo(() => {
    const d = template.x * 90;
    return isLeft ? `-${d}vw` : `${d}vw`;
  }, [isLeft, template]);

  const randomY = useMemo(() => `-${template.y * 100 + 20}vh`, [template]);

  const randomRotate = useMemo(() => {
    const angle = (template.r - 0.5) * 720;
    return isLeft ? `${angle}deg` : `${-angle}deg`;
  }, [isLeft, template]);

  const randomScale = useMemo(() => template.s * 2 + 0.5, [template]);

  const x = useTransform(progress, [0, 0.1], ["0vw", randomX]);
  const y = useTransform(progress, [0, 0.1], ["0vh", randomY]);
  const rotate = useTransform(progress, [0, 0.1], ["0deg", randomRotate]);
  const shatterScale = useTransform(progress, [0, 0.1], [1, randomScale]);
  const shatterOpacity = useTransform(progress, [0, 0.08, 0.12], [1, 1, 0]);

  if (char === " ") return <span className="w-4 md:w-8 inline-block" />;

  return (
    <motion.span
      style={{
        x: reduceMotion ? 0 : x,
        y: reduceMotion ? 0 : y,
        rotate: reduceMotion ? 0 : rotate,
        scale: reduceMotion ? 1 : shatterScale,
        opacity: reduceMotion ? 1 : shatterOpacity,
        display: "inline-block",
        position: "relative",
        willChange: "transform, opacity"
      }}
      className=""
    >
      <span
        className="absolute left-0 top-0 -z-10 select-none"
        style={{
          ...text3DStyle,
          color: "transparent",
          display: isMobile ? "none" : "block"
        }}
      >
        {char}
      </span>
      <span
        className="relative z-10"
        style={{
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundImage: "linear-gradient(180deg, #d93630, #e26135)",
        }}
      >
        {char}
      </span>
    </motion.span>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// HERO SECTION
// ─────────────────────────────────────────────────────────────────────────────

const HeroSection = () => {
  const isMobile = useIsMobile();
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 45,
    mass: 0.5,
    restDelta: 0.001,
  });

  const scrollProgress = reduceMotion ? scrollYProgress : smoothScrollProgress;
  const headerOpacity = useTransform(scrollProgress, [0, 0.08], [1, 0]);
  const headerScale = useTransform(scrollProgress, [0, 0.08], [1, 0.9]);

  return (
    <section ref={containerRef} className="homepage-hero-background relative h-[250vh] z-0">
      <div className="relative sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden font-outfit z-10">


        <motion.div
          style={{ opacity: headerOpacity, scale: reduceMotion ? 1 : headerScale }}
          className="absolute z-20 text-center flex flex-col items-center w-full will-change-transform"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "circOut" }}
            className="mb-8"
          >
            <p className="text-muted-foreground text-[10px] uppercase tracking-[0.5em] font-bold">
              Castle Advanced Technologies &amp; Systems
            </p>
          </motion.div>

        <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-7xl lg:text-[7.5rem] font-black tracking-tighter mb-10 flex flex-col items-center text-center leading-[1] md:leading-[0.85] w-full px-4"
          >
            <div className="flex w-full justify-center flex-wrap gap-x-[0.3em]">
              {(() => {
                const text = "Beyond Sensing,";
                const words = text.split(" ");
                let charCount = 0;
                return words.map((word, wIdx) => {
                  const result = (
                    <div key={wIdx} className="flex flex-nowrap">
                      {word.split("").map((c, i) => (
                        <ShatterLetter key={charCount + i} char={c} progress={scrollProgress} index={charCount + i} totalLength={text.length} isMobile={isMobile} reduceMotion={reduceMotion} />
                      ))}
                    </div>
                  );
                  charCount += word.length + 1;
                  return result;
                });
              })()}
            </div>

            <div className="flex w-full justify-center mt-2 md:mt-4 flex-wrap gap-x-[0.3em]">
              {(() => {
                const text = "Into Intelligence.";
                const chars = text.split("");
                return (
                  <div className="flex flex-nowrap">
                    {chars.map((c, i) => (
                      <ShatterLetter key={i} char={c} progress={scrollProgress} index={i} totalLength={text.length} isMobile={isMobile} reduceMotion={reduceMotion} />
                    ))}
                  </div>
                );
              })()}
            </div>

            <motion.span
              style={{ opacity: headerOpacity }}
              className="text-[10px] sm:text-xs md:text-3xl lg:text-4xl font-bold text-white mt-4 md:mt-10 tracking-[0.08em] md:tracking-tight leading-normal"
            >
              From data to decisions. From insights to action.
            </motion.span>
          </motion.h1>
        </motion.div>

        <motion.div
          style={{ top: useTransform(scrollProgress, [0, 0.1], ["70%", "0%"]), }}
          className="absolute bottom-0 right-4 translate-x-1/2 md:right-auto md:left-1/2 md:-translate-x-1/2 w-4 z-50 flex flex-col items-center will-change-transform"
        >
          <motion.div
            style={{
              height: useTransform(scrollProgress, [0, 0.05, 0.95, 1], ["0%", "100%", "100%", "100%"]),
              opacity: useTransform(scrollProgress, [0, 0.02, 0.96, 1], [0, 1, 1, 0])
            }}
            className="w-[2px] bg-[var(--accent-red)] relative overflow-visible"
          >
            <div className="absolute inset-0 bg-[var(--accent-red)] blur-[1px] opacity-80" />
            <div className="absolute inset-y-0 -left-10 -right-10 bg-[var(--accent-red)]/5 blur-[16px] pointer-events-none" />
            <motion.div
              animate={reduceMotion ? undefined : { boxShadow: ["0px 0px 8px rgba(226,58,50,0.35)", "0px 0px 28px rgba(226,58,50,0.58)", "0px 0px 8px rgba(226,58,50,0.35)"] }}
              transition={reduceMotion ? undefined : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
            />
            {!reduceMotion && <motion.div
              animate={{ top: ["0%", "100%"] }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="absolute w-2 h-10 bg-gradient-to-b from-white to-transparent blur-[2px] -left-[3px] opacity-20"
            />}
          </motion.div>
        </motion.div>

        <div className="absolute inset-0 z-30 pointer-events-none">
          {technologies.map((technology, index) => (
            <ContentSegment key={technology.id} technology={technology} index={index} total={technologies.length} progress={scrollProgress} reduceMotion={reduceMotion} />
          ))}
        </div>

        <motion.div
          style={{ opacity: useTransform(smoothScrollProgress, [0, 0.05], [1, 0]) }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-[var(--accent-red)]/40 to-transparent" />
          <p className="text-[9px] uppercase tracking-[0.3em] text-[#B8B8B8] font-bold">Scroll to Explore</p>
        </motion.div>
      </div>
    </section>
  );
};

function TechnologyDescription({ technology, compact = false }: { technology: typeof technologies[number]; compact?: boolean }) {
  return (
    <>
      <p className={compact ? "text-[13px] leading-5 text-[var(--body-copy)]" : "text-sm leading-6 text-[var(--body-copy)] lg:text-base lg:leading-7"}>
        {technology.introduction}
      </p>
      <ul className={compact ? "mt-3 grid gap-1.5 pl-4 text-[13px] leading-5 text-[var(--body-copy)] marker:text-[var(--accent-red)]" : "mt-5 grid gap-2 pl-5 text-sm leading-6 text-[var(--body-copy)] marker:text-[var(--accent-red)] lg:text-base lg:leading-7"}>
        {technology.capabilities.map((capability) => <li key={capability}>{capability}</li>)}
      </ul>
    </>
  );
}

const ContentSegment = ({ technology, index, total, progress, reduceMotion }: { technology: typeof technologies[number]; index: number; total: number; progress: any; reduceMotion: boolean | null }) => {
  const sectionStart = 0.04;
  const start = sectionStart + (index * (1 - sectionStart)) / total;
  const end = sectionStart + ((index + 1) * (1 - sectionStart)) / total;
  const mid = (start + end) / 2;
  const plateau = 3 / 150;
  const exitOpacity = index === total - 1 ? 1 : 0;

  const opacity = useTransform(progress, [start, mid - plateau, mid + plateau, end], [0, 1, 1, exitOpacity]);
  const leftX = useTransform(progress, [start, mid - plateau, mid + plateau, end], reduceMotion ? [0, 0, 0, 0] : [-100, 0, 0, -100]);
  const rightX = useTransform(progress, [start, mid - plateau, mid + plateau, end], reduceMotion ? [0, 0, 0, 0] : [100, 0, 0, 100]);
  const y = useTransform(progress, [start, mid - plateau, mid + plateau, end], reduceMotion ? [0, 0, 0, 0] : [50, 0, 0, -50]);
  return (
    <div className="pointer-events-none absolute inset-0 z-40">
      <motion.div
        style={{ opacity, x: leftX, y }}
        className={cn(
          "absolute inset-y-0 left-4 right-16 flex flex-col items-start justify-start pt-16 text-left md:left-[12vw] md:right-auto md:max-w-[35vw] md:justify-center md:pt-0"
        )}
      >
        <h2 className="text-gradient-primary overflow-visible pb-1 text-3xl sm:text-4xl md:text-5xl font-black tracking-[-0.01em] leading-[1.1] break-words mb-3">
          {renderTechnologyHeading(technology.heading)}
        </h2>
        <p className="text-[var(--subheading)] text-sm sm:text-base md:text-lg leading-snug font-semibold break-words w-full">
          {technology.supportingText}
        </p>
        <div className="mt-4 md:hidden">
          <div className="[@media(max-height:640px)]:hidden">
            <TechnologyDescription technology={technology} compact />
          </div>
          <a href={`/technologies/${technology.id}`} className="pointer-events-auto relative z-50 mt-3 inline-flex min-h-10 items-center py-2 text-xs font-semibold text-[#d8d8d8] underline underline-offset-4 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d8d8d8]">Learn More <span className="ml-1" aria-hidden="true">→</span></a>
        </div>
      </motion.div>

      <motion.div
        style={{ opacity, x: rightX, y }}
        className="absolute inset-y-0 right-[12vw] hidden flex-col justify-center md:flex md:max-w-[35vw]"
      >
        <TechnologyDescription technology={technology} />
        <a href={`/technologies/${technology.id}`} className="pointer-events-auto relative z-50 mt-4 inline-flex min-h-10 items-center py-2 text-sm font-semibold text-[#d8d8d8] underline underline-offset-4 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d8d8d8]">Learn More <span className="ml-1" aria-hidden="true">→</span></a>
      </motion.div>

    </div>
  );
};

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");
export default HeroSection;
