import * as React from "react";
import { hydrateRoot } from "react-dom/client";

import Root from "./root";

// This mimics a browser extension injecting a custom stylesheet into the page.
const styleElement = document.createElement("style");
styleElement.setAttribute("rel", "stylesheet");
styleElement.setAttribute("href", "https://unpkg.com/mvp.css");
document.head.insertBefore(styleElement, document.head.lastChild);

hydrateRoot(document, <Root />);
