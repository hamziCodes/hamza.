
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

// App bootstrap: mount the single-page portfolio at #root.
createRoot(document.getElementById("root")!).render(<App />);
  