import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import HomePage from "./HomePage";
import SoftwarePage from "./SoftwarePage";
import { softwareProducts } from "./softwareProducts";
import TechnologyPage from "./TechnologyPage";
import { technologyByPath } from "./technologyDetails";
import "./index.css";

const currentProduct = softwareProducts.find((product) => product.enabled && product.route === window.location.pathname);
const currentTechnology = technologyByPath(window.location.pathname);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {currentProduct ? <SoftwarePage product={currentProduct} /> : currentTechnology ? <TechnologyPage technology={currentTechnology} /> : <HomePage />}
  </StrictMode>,
);
