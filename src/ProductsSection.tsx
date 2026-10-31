import { softwareProducts } from "./softwareProducts";

export default function ProductsSection() {
  const products = softwareProducts
    .filter((product) => product.enabled)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <section id="products" className="border-t border-white/10 bg-[var(--site-background)] px-6 py-20 text-white md:px-10 md:py-28">
      <div className="mx-auto max-w-6xl">
        <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[var(--accent-red)]">CATS Software</p>
        <h2 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">Our Software</h2>
        <div className="mt-10">
          {products.map((product) => (
            <a
              key={product.id}
              href={product.route}
              aria-label={`View ${product.name} details`}
              className="group grid cursor-pointer gap-5 border-t border-white/10 py-8 transition-colors hover:border-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-red)] md:grid-cols-[0.9fr_1.1fr] md:items-center md:gap-12 md:py-10"
            >
              <div>
                <h3 className="text-gradient-primary text-3xl font-black tracking-tight transition-transform duration-300 group-hover:translate-x-1 md:text-4xl">{product.name}</h3>
                <p className="mt-3 text-base font-semibold leading-snug text-[var(--subheading)] md:text-lg">{product.tagline}</p>
              </div>
              <p className="max-w-2xl text-sm leading-6 text-[var(--body-copy)]">{product.description}</p>
            </a>
          ))}
          <div className="border-t border-white/10" />
        </div>
      </div>
    </section>
  );
}