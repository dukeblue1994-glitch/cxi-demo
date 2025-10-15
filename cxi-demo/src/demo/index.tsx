import React from 'react';
import { createRoot } from 'react-dom/client';
import CxiMagicDemo from './CxiMagicDemo';
import '../boot/guardrails';

const el = document.getElementById('cxi-magic');
if (el) createRoot(el).render(<CxiMagicDemo />);
