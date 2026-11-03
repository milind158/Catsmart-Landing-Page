export default function SiteFooter() {
  return (
    <footer className="overflow-hidden bg-ivory text-navy">
      <div className="site-container flex flex-col gap-2 border-t border-line-ivory py-6 text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-on-ivory">
        <p>Castle Advanced Technologies &amp; Systems</p>
      </div>
      {/* PLACEHOLDER: text wordmark until a logo is supplied. */}
      <p aria-hidden="true" className="film-wordmark">CATS</p>
    </footer>
  );
}
