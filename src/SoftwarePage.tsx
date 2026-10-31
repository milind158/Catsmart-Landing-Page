import { useEffect, useState } from "react";
import { softwareDetails, softwareProducts } from "./softwareProducts";
import ContactSection from "./ContactSection";
import ProductPageNavigation from "./ProductPageNavigation";

const sectionClass = "mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28";
const workflowSectionClass = "mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-20";
const eyebrowClass = "text-[10px] font-bold uppercase tracking-[0.35em] text-[var(--accent-red)]";

function isDescribedItem(item: string | { title: string; description: string }): item is { title: string; description: string } {
  return typeof item !== "string";
}

export default function SoftwarePage({ product }: { product: typeof softwareProducts[number] }) {
  const detail = softwareDetails[product.id];
  const [imageFailed, setImageFailed] = useState(false);
  const overviewParagraphs = typeof detail.overview === "string" ? [detail.overview] : detail.overview;
  const workflowIntroduction = detail.workflowIntroduction
    ? typeof detail.workflowIntroduction === "string" ? [detail.workflowIntroduction] : detail.workflowIntroduction
    : [];
  const hasDetailedApplications = detail.applications?.some(isDescribedItem) ?? false;

  useEffect(() => setImageFailed(false), [product.image.src]);

  useEffect(() => {
    document.title = `${product.name} | CATS Software`;
    let description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!description) {
      description = document.createElement("meta");
      description.name = "description";
      document.head.appendChild(description);
    }
    description.content = detail.introduction;
  }, [detail.introduction, product.name]);

  return (
    <main className="product-page min-h-screen bg-[var(--site-background)] text-white">
      <ProductPageNavigation />

      <section className="relative border-y border-white/10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_78%_48%,rgba(226,58,50,0.10),transparent_36%)]" />
        <div className="relative mx-auto grid min-h-[72vh] max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-[0.9fr_1.1fr] md:px-10 md:py-28">
          <div className="min-w-0">
            <h1 className="text-gradient-primary detail-hero-title break-words text-5xl font-black md:text-7xl lg:text-8xl">{product.name}</h1>
            <p className="mt-6 max-w-2xl break-words text-xl font-semibold leading-snug text-[var(--subheading)] md:text-2xl">{detail.heroTagline ?? product.tagline}</p>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--body-copy)]">{detail.introduction}</p>
          </div>
          <div aria-label={`${product.name} product image`} className="w-full min-w-0">
            {!imageFailed && <img
              src={product.image.src}
              alt=""
              onError={() => setImageFailed(true)}
              className="block h-auto w-full"
              style={{ objectFit: "contain", objectPosition: product.image.position ?? "center" }}
            />}
          </div>
        </div>
      </section>

      <section id="overview" className={sectionClass}>
        <p className={eyebrowClass}>Overview</p>
        <div className="mt-6 grid min-w-0 gap-8 md:grid-cols-[0.7fr_1.3fr]">
          <h2 className="min-w-0 break-words text-3xl font-bold tracking-tight md:text-4xl">{detail.overviewHeading ?? `About ${product.name}.`}</h2>
          <div className="max-w-3xl space-y-5 text-lg leading-8 text-[var(--body-copy)]">
            {overviewParagraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
          </div>
        </div>
      </section>

      {detail.features && <section className="border-y border-white/10 bg-[#070707]">
        <div className={sectionClass}>
          <p className={eyebrowClass}>Core capabilities</p>
          <h2 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl">{detail.capabilitiesHeading ?? `Capabilities for ${product.name}.`}</h2>
          <div className="mt-10 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {detail.features.map((feature, index) => <article key={feature.title} className="min-h-44 min-w-0 bg-[#070707] p-6 md:p-8">
              <span className="text-[10px] font-bold tracking-[0.2em] text-[var(--accent-red)]">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="mt-5 text-lg font-bold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--body-copy)]">{feature.description}</p>
            </article>)}
          </div>
        </div>
      </section>}

      {(detail.workflow?.length || workflowIntroduction.length > 0) && <section className={workflowSectionClass}>
        <p className={eyebrowClass}>How it works</p>
        <h2 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl">{detail.workflowHeading ?? `How ${product.name} works.`}</h2>
        {workflowIntroduction.length > 0 && <div className="mt-5 max-w-4xl space-y-4 text-base leading-7 text-[var(--body-copy)]">
          {workflowIntroduction.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        </div>}
        {detail.workflow && <ol className="mt-10 grid gap-0 sm:grid-cols-2 lg:grid-cols-3">
          {detail.workflow.map((step, index) => <li key={typeof step === "string" ? `${step}-${index}` : step.title} className="relative flex min-w-0 gap-5 border-t border-white/15 py-6 pr-5">
            <span className="text-xs font-bold text-[var(--accent-red)]">{String(index + 1).padStart(2, "0")}</span>
            {isDescribedItem(step)
              ? <div className="min-w-0">
                <h3 className="text-base font-semibold text-[var(--subheading)]">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--body-copy)]">{step.description}</p>
              </div>
              : <span className="min-w-0 text-base font-semibold text-[var(--subheading)]">{step}</span>}
          </li>)}
        </ol>}
      </section>}

      {detail.applications && <section className="border-y border-white/10 bg-[#070707]">
        <div className={sectionClass}>
          <p className={eyebrowClass}>Applications</p>
          <h2 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl">{detail.applicationsHeading ?? `Applications for ${product.name}.`}</h2>
          <div className={hasDetailedApplications ? "mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" : "mt-8 flex flex-wrap gap-3"}>
            {detail.applications.map((application, index) => isDescribedItem(application)
              ? <article key={application.title} className="min-w-0 border border-white/15 p-5">
                <h3 className="font-bold text-white">{application.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--body-copy)]">{application.description}</p>
              </article>
              : <span key={`${application}-${index}`} className="border border-white/15 px-4 py-3 text-sm text-white/75">{application}</span>)}
          </div>
        </div>
      </section>}

      {detail.audience && <section className={sectionClass}>
        <p className={eyebrowClass}>{detail.audienceHeading ?? "For the teams doing the work"}</p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {detail.audience.map((item, index) => isDescribedItem(item)
            ? <article key={item.title} className="min-w-0">
              <h3 className="text-lg font-semibold text-white/90">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--body-copy)]">{item.description}</p>
            </article>
            : <span key={`${item}-${index}`} className="text-lg font-semibold text-white/80">{item}</span>)}
        </div>
      </section>}

      {detail.benefits && <section className="border-y border-white/10 bg-[#070707]">
        <div className={sectionClass}>
          <p className={eyebrowClass}>Benefits</p>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {detail.benefits.map((benefit, index) => <article key={isDescribedItem(benefit) ? benefit.title : `${benefit}-${index}`} className="min-w-0 border-l border-[var(--accent-red)]/60 pl-5">
              <span className="mb-3 block text-[10px] font-bold tracking-[0.2em] text-[var(--accent-red)]">{String(index + 1).padStart(2, "0")}</span>
              {isDescribedItem(benefit)
                ? <>
                  <h3 className="text-base font-semibold leading-6 text-white/95">{benefit.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--body-copy)]">{benefit.description}</p>
                </>
                : <p className="text-lg font-medium leading-7 text-white/90">{benefit}</p>}
            </article>)}
          </div>
        </div>
      </section>}

      <section className={sectionClass}>
        <p className={eyebrowClass}>Continue exploring</p>
        <h2 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl">Software for a more intelligent world.</h2>
        <nav aria-label="Other software products" className="mt-8 flex flex-wrap gap-x-7 gap-y-4">
          {softwareProducts.filter((item) => item.enabled && item.id !== product.id).sort((a, b) => a.displayOrder - b.displayOrder).map((item) => <a key={item.id} href={item.route} className="text-sm font-semibold text-white/70 transition-colors hover:text-[var(--accent-red)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent-red)]">{item.name} <span aria-hidden="true">→</span></a>)}
          <a href="/" className="text-sm font-semibold text-white/70 transition-colors hover:text-[var(--accent-red)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent-red)]">CATS homepage <span aria-hidden="true">→</span></a>
        </nav>
      </section>
      <ContactSection />
      <footer className="border-t border-white/10 px-6 py-7 text-center text-[9px] uppercase tracking-[0.3em] text-white/35">Castle Advanced Technologies &amp; Systems</footer>
    </main>
  );
}
