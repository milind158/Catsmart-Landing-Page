import SiteFooter from "./SiteFooter";
import SiteNavigation from "./SiteNavigation";

const linkClass = "motion-hover link-draw text-sm font-medium text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-ink";

export default function NotFoundPage() {
  return (
    <>
      <SiteNavigation showBack />
      <main className="flex min-h-[80vh] flex-col bg-paper text-ink">
        <section className="site-container flex w-full flex-1 flex-col justify-center pb-20 pt-32">
          <p className="eyebrow text-gold-ink">Error 404</p>
          <h1 className="detail-heading mt-5">Page not found.</h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-ink-soft">The page you were looking for could not be found.</p>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
            <a href="/" className={linkClass}>CATS homepage <span aria-hidden="true">→</span></a>
            <a href="/#products" className={linkClass}>Our software <span aria-hidden="true">→</span></a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
