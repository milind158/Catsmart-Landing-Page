import FilmScene from "./film/FilmScene";
import { chapterTiming } from "./film/scenes";
import { softwareProducts } from "./softwareProducts";

export default function ProductsSection() {
  const products = softwareProducts
    .filter((product) => product.enabled)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <>
      <FilmScene chapter="screen" group="software" anchorId="products" poster="screen" timing={chapterTiming.screen}>
        <div data-film-text data-in="0.02" data-out="0.8" className="film-copy justify-end">
          <div className="film-container w-full pb-14">
            <p className="eyebrow text-brass">CATS Software</p>
            <h2 className="film-display mt-4">Our Software</h2>
          </div>
        </div>
      </FilmScene>

      {products.map((product, index) => (
        <FilmScene key={product.id} chapter={`product-${index}`} group="software" timing={chapterTiming.product}>
          <img
            data-film-text
            data-in="0.02"
            data-out="0.9"
            src={product.image.src}
            alt=""
            width={product.image.width}
            height={product.image.height}
            loading="lazy"
            decoding="async"
            className="film-product-screen"
          />
          <div data-film-text data-in="0.08" data-out="0.86" data-scrim="side" className="film-copy justify-end">
            <div className="film-container w-full pb-10 md:pb-14">
              <h3 className="film-product-name">{product.name}</h3>
              <div className="film-product-text max-w-md">
                <p className="mt-3 text-lg font-medium leading-7 text-ivory">{product.tagline}</p>
                <p className="film-extra mt-3 text-[0.9375rem] leading-6 text-ivory/85">{product.description}</p>
                <a href={product.route} className="group mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass">
                  <span className="link-draw">Learn More<span className="sr-only"> about {product.name}</span></span>
                  <span aria-hidden="true" className="motion-hover group-hover:translate-x-1">→</span>
                </a>
              </div>
            </div>
          </div>
        </FilmScene>
      ))}

      <FilmScene chapter="screen-exit" group="software" timing={chapterTiming.screenExit}>
        <span aria-hidden="true" />
      </FilmScene>

      <FilmScene chapter="close" group="contact" poster="close" timing={chapterTiming.close}>
        <div data-film-text data-in="0.18" data-out="0.72" data-scrim="top" className="film-copy justify-start">
          <div className="film-container w-full pt-32 md:pt-36">
            <p className="film-heading max-w-[20ch]">From data to decisions. From insights to action.</p>
          </div>
        </div>
      </FilmScene>
    </>
  );
}
