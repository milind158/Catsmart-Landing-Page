import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";

export const renderPage = (page: string) => renderToString(<StrictMode><App page={page} /></StrictMode>);
