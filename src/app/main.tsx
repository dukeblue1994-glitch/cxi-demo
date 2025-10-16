import React from "react";
import { createRoot } from "react-dom/client";
import MagicCanvas from "./magic/MagicCanvas";

const el = document.getElementById("root")!;
createRoot(el).render(<MagicCanvas />);
