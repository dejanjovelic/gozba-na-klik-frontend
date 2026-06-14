import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { StyledEngineProvider } from "@mui/material/styles";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <App />
    </StyledEngineProvider>
  </React.StrictMode>,
);
