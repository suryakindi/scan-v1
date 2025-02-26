import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/main.css";
// import "./assets/bs-to-tw.css";
import Routes from "./Routes";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Routes />
  </StrictMode>
);
