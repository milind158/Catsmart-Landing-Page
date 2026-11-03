import SiteNavigation from "./SiteNavigation";

export default function NotFoundPage() {
  return (
    <main className="product-page flex min-h-screen flex-col bg-[var(--site-background)] text-white">
      <SiteNavigation showBack />
      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 py-28 md:px-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[var(--accent-red)]">Error 404</p>
        <h1 className="text-gradient-primary detail-hero-title mt-5 text-5xl font-black md:text-7xl">Page not found.</h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--body-copy)]">The page you were looking for could not be found.</p>
        <a href="/" className="mt-8 text-sm font-semibold text-[#d8d8d8] underline underline-offset-4 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d8d8d8]">CATS homepage <span aria-hidden="true">→</span></a>
      </section>
    </main>
  );
}
