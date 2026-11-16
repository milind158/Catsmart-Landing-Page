import ContactSection from "./ContactSection";
import { DetailHero, DetailSection, ExploreLinks, MarkedList, NumberedGrid, bodyText } from "./detailParts";
import NextCard from "./NextCard";
import SiteFooter from "./SiteFooter";
import SiteNavigation from "./SiteNavigation";
import { type SoftwareProduct, softwareDetails, softwareProducts } from "./softwareProducts";

type DescribedItem = { title: string; description: string };

function isDescribedItem(item: string | DescribedItem): item is DescribedItem {
  return typeof item !== "string";
}

const asParagraphs = (value: string | string[] | undefined) => (value === undefined ? [] : typeof value === "string" ? [value] : value);

export default function SoftwarePage({ product }: { product: SoftwareProduct }) {
  const detail = softwareDetails[product.id];
  const overviewParagraphs = asParagraphs(detail.overview);
  const workflowIntroduction = asParagraphs(detail.workflowIntroduction);

  const products = softwareProducts.filter((item) => item.enabled).sort((a, b) => a.displayOrder - b.displayOrder);
  const nextIndex = (products.findIndex((item) => item.id === product.id) + 1) % products.length;
  const next = products[nextIndex];

  // Sections alternate between the page colour and a lighter band.
  let sectionCount = 0;
  const banded = () => sectionCount++ % 2 === 0;

  return (
    <>
      <SiteNavigation showBack />
      <main className="bg-paper text-ink">
        {/* PLACEHOLDER image until real product screenshots are supplied. */}
        <DetailHero
          kind="Software"
          title={product.name}
          tagline={detail.heroTagline ?? product.tagline}
          introduction={detail.introduction}
          image={{ src: product.image.src, alt: `${product.name} screen`, width: product.image.width, height: product.image.height, fit: product.image.fit }}
        />

        <DetailSection label="Overview" heading={detail.overviewHeading ?? `About ${product.name}.`} banded={banded()}>
          <div className={`mt-8 max-w-3xl space-y-5 ${bodyText}`}>
            {overviewParagraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
          </div>
        </DetailSection>

        {detail.features && (
          <DetailSection label="Core capabilities" heading={detail.capabilitiesHeading ?? `Capabilities for ${product.name}.`} banded={banded()}>
            <NumberedGrid items={detail.features} />
          </DetailSection>
        )}

        {(detail.workflow?.length || workflowIntroduction.length > 0) && (
          <DetailSection label="How it works" heading={detail.workflowHeading ?? `How ${product.name} works.`} banded={banded()}>
            {workflowIntroduction.length > 0 && (
              <div className={`mt-6 max-w-3xl space-y-4 ${bodyText}`}>
                {workflowIntroduction.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
              </div>
            )}
            {detail.workflow && (
              <ol className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3">
                {detail.workflow.map((step, index) => (
                  <li key={isDescribedItem(step) ? step.title : `${step}-${index}`} className="flex min-w-0 gap-5 border-t border-line py-6 pr-6">
                    <span className="text-xs font-semibold tracking-[0.18em] text-gold-ink">{String(index + 1).padStart(2, "0")}</span>
                    {isDescribedItem(step) ? (
                      <div className="min-w-0">
                        <h3 className="font-semibold text-ink">{step.title}</h3>
                        <p className="mt-2 text-[0.9375rem] leading-6 text-ink-soft">{step.description}</p>
                      </div>
                    ) : (
                      <span className="min-w-0 font-semibold text-ink">{step}</span>
                    )}
                  </li>
                ))}
              </ol>
            )}
          </DetailSection>
        )}

        {detail.applications && (
          <DetailSection label="Applications" heading={detail.applicationsHeading ?? `Applications for ${product.name}.`} banded={banded()}>
            {detail.applications.some(isDescribedItem) ? (
              <NumberedGrid items={detail.applications.filter(isDescribedItem)} />
            ) : (
              <ul className="mt-8 flex flex-wrap gap-3">
                {detail.applications.map((application, index) => (
                  <li key={`${application}-${index}`} className="border border-line bg-surface px-4 py-3 text-sm text-ink">{isDescribedItem(application) ? application.title : application}</li>
                ))}
              </ul>
            )}
          </DetailSection>
        )}

        {detail.audience && (
          <DetailSection label={detail.audienceHeading ?? "For the teams doing the work"} banded={banded()}>
            <div className="mt-8 grid gap-8 sm:grid-cols-2">
              {detail.audience.map((item, index) => isDescribedItem(item) ? (
                <article key={item.title} className="min-w-0 border-t border-line pt-5">
                  <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-6 text-ink-soft">{item.description}</p>
                </article>
              ) : (
                <p key={`${item}-${index}`} className="border-t border-line pt-5 text-lg font-semibold text-ink">{item}</p>
              ))}
            </div>
          </DetailSection>
        )}

        {detail.benefits && (
          <DetailSection label="Benefits" banded={banded()}>
            {detail.benefits.some(isDescribedItem) ? (
              <NumberedGrid items={detail.benefits.filter(isDescribedItem)} />
            ) : (
              <MarkedList items={detail.benefits.filter((benefit): benefit is string => !isDescribedItem(benefit))} className="mt-8 sm:grid-cols-2" />
            )}
          </DetailSection>
        )}

        <section className="section-band">
          <div className="site-container">
            <NextCard
              kind="product"
              position={nextIndex + 1}
              total={products.length}
              href={next.route}
              name={next.name}
              tagline={next.tagline}
              image={{ src: next.image.src, width: next.image.width, height: next.image.height, fit: next.image.fit }}
            />
            <ExploreLinks
              label="All software"
              links={[
                ...products.filter((item) => item.id !== product.id).map((item) => ({ href: item.route, text: item.name })),
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
