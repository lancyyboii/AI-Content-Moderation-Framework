import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

// Console watermark
console.log(
  "%c🚀 Lancyy AI Content Moderation System",
  "color: #3b82f6; font-size: 20px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);"
);
console.log(
  "%c💻 Built with ❤️ by Lancyy",
  "color: #10b981; font-size: 14px; font-weight: bold;"
);
console.log(
  "%c🔒 Powered by AI • Secured by Design",
  "color: #8b5cf6; font-size: 12px; font-style: italic;"
);
console.log(
  "%c⚡ React + Node.js + AI Models",
  "color: #f59e0b; font-size: 12px;"
);
console.log(
  "%c🌟 Visit: https://github.com/lancyy",
  "color: #ef4444; font-size: 12px; text-decoration: underline;"
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
