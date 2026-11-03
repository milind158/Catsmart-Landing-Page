import type { CSSProperties, ReactNode } from "react";

export const delayStyle = (milliseconds: number) => ({ "--delay": `${milliseconds}ms` }) as CSSProperties;

type Trigger = "load" | "scroll";

// Load entrances are CSS keyframes, so slow or blocked JavaScript cannot hold back hero text.
// Scroll entrances are started by reveal.ts.
const triggerProps = (trigger: Trigger, kind: string) => (trigger === "load" ? { "data-enter": kind } : { "data-reveal": kind });

// The signature hairline: draws in from the left.
export function Rule({ trigger, delay = 0, className = "" }: { trigger: Trigger; delay?: number; className?: string }) {
  return <span aria-hidden="true" {...triggerProps(trigger, "rule")} style={delayStyle(delay)} className={`rule ${className}`} />;
}

// The signature transition: a headline line rises from behind its own edge.
export function MaskedLine({ trigger, delay = 0, children }: { trigger: Trigger; delay?: number; children: ReactNode }) {
  return <span {...triggerProps(trigger, "mask")} style={delayStyle(delay)} className="line-mask"><span>{children}</span></span>;
}
