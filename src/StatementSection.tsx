import { useEffect, useRef } from "react";
import { watchScroll } from "./scrollProgress";

// PLACEHOLDER: draft statement of what CATS does, awaiting approval.
const statement = "CATS builds sensing hardware and software that turn optical, visual and audio signals into decisions.";
const words = statement.split(" ");

// The line lights up word by word as it is scrolled through.
export default function StatementSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current!;
    return watchScroll(section, "pinned", (progress) => section.style.setProperty("--p", String(Math.min(1, progress * 1.25))));
  }, []);

  return (
    <section ref={sectionRef} id="statement" className="statement" aria-label="What CATS does">
      <div className="statement-pin">
        <div className="site-container">
          <p className="eyebrow text-gold-ink">What we do</p>
          <p className="statement-text mt-6" style={{ "--n": words.length } as React.CSSProperties}>
            {words.map((word, index) => <span key={index} style={{ "--i": index } as React.CSSProperties}>{word} </span>)}
          </p>
        </div>
      </div>
    </section>
  );
}
