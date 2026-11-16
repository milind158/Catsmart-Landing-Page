import ContactSection from "./ContactSection";
import { DetailHero, DetailSection, ExploreLinks, MarkedList, NumberedGrid, bodyText } from "./detailParts";
import NextCard from "./NextCard";
import SiteFooter from "./SiteFooter";
import SiteNavigation from "./SiteNavigation";
import { type Technology, technologies, technologyRoute } from "./technologies";
import { technologyDetails, technologyHeroImages } from "./technologyDetails";

export default function TechnologyPage({ technology }: { technology: Technology }) {
  const detail = technologyDetails[technology.id];
  const nextIndex = (technologies.findIndex((item) => item.id === technology.id) + 1) % technologies.length;
  const next = technologies[nextIndex];

  return (
    <>
      <SiteNavigation showBack />
      <main className="bg-paper text-ink">
        {/* PLACEHOLDER image until real photography is supplied. */}
        <DetailHero
          kind="Technology"
          title={technology.heading}
          tagline={technology.supportingText}
          introduction={detail.introduction}
          image={{ src: technologyHeroImages[technology.id].src, alt: "" }}
        />

        {detail.sections.map((section, index) => (
          <DetailSection key={section.label} label={section.label} heading={section.heading} banded={index % 2 === 0}>
            {section.paragraphs && (
              <div className={`mt-8 max-w-3xl space-y-5 ${bodyText}`}>
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            )}
            {section.features && <NumberedGrid items={section.features} columns={2} />}
            {section.groups && (
              <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
                {section.groups.map((group) => (
                  <article key={group.title} className="border-t border-line pt-5">
                    <h3 className="text-lg font-semibold text-ink">{group.title}</h3>
                    <MarkedList items={group.items} className="mt-4" />
                  </article>
                ))}
              </div>
            )}
            {section.items && <MarkedList items={section.items} className="mt-8 sm:grid-cols-2" />}
          </DetailSection>
        ))}

        <section className="section-band">
          <div className="site-container">
            <NextCard
              kind="technology"
              position={nextIndex + 1}
              total={technologies.length}
              href={technologyRoute(next.id)}
              name={next.heading}
              tagline={next.supportingText}
              image={{ src: technologyHeroImages[next.id].src }}
            />
            <ExploreLinks
              label="All technologies"
              links={[
                ...technologies.filter((item) => item.id !== technology.id).map((item) => ({ href: technologyRoute(item.id), text: item.heading })),
                { href: "/", text: "CATS homepage" },
              ]}
            />
          </div>
        </section>

        <ContactSection />
      </main>
      <SiteFooter />
    </>
  );
}
