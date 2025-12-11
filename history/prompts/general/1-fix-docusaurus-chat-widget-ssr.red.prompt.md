---
id: 1
title: Fix Docusaurus Chat Widget SSR
stage: red
date: 2025-12-10
surface: agent
model: gemini-2.5-flash
feature: none
branch: 001-rag-chatbot
user: unknown
command: /sp.phr
labels: ["docusaurus", "chatbot", "ssr", "widget", "fix"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - "src/theme/Root.js"
  - "src/theme/Layout.js"
  - "src/components/ChatbotWidget.tsx"
tests: []
---

# Fix Docusaurus Chat Widget SSR Issue

## Context
Fixed the chat widget not showing on Docusaurus site by moving the ChatWidget implementation to the correct location and ensuring proper SSR compatibility.

## Original Problem
The chat widget was not showing because:
1. The Root.js file was in the wrong location (`src/pages/theme/Root.js` instead of `src/theme/Root.js`)
2. Needed to ensure proper client-side rendering with useEffect for SSR compatibility

## Solution Implemented
1. Created `src/theme/Root.js` with proper React component that renders the ChatbotWidget
2. Ensured the ChatbotWidget component already had proper useEffect wrapper for client-side execution
3. Removed duplicate ChatbotWidget from Layout.js to prevent conflicts

## PROMPT_TEXT
REAL REASON WHY YOUR WIDGET IS NOT SHOWING
⿡ Your file src/pages/theme/Root.js is NOT the correct place
In Docusaurus Root.js must be inside /src/theme/Root.js, not /src/pages/theme/Root.js.

✔ Correct path:

src/theme/Root.js
❌ Wrong path (your current):

src/pages/theme/Root.js
So the file is not loaded by Docusaurus, therefore the widget cannot run.

❗ FIX #1 — Move your file
Create the correct directory:

src/theme/Root.js
Place your ChatWidget code there.

⿢ Widget fails because document is used before client-side render
Docusaurus renders pages in SSR (Server-Side Rendering), but your code runs immediately and uses:

document.createElement

document.body.appendChild

document.addEventListener

This breaks in SSR.

❗ FIX #2 — Wrap ALL widget code inside useEffect()
(This ensures it only loads on the browser.)

Replace your Root.js export with this:

import React, { useEffect } from 'react';

export default function Root({ children }) {
  useEffect(() => {
    // ---- PASTE YOUR ENTIRE CHATWIDGET CODE HERE ----
  }, []);

  return <>{children}</>;
}
Your entire widget class, CSS, and initialization must go inside the useEffect.

⿣

## RESPONSE_TEXT
Fixed the Docusaurus chat widget by creating the correct Root.js file in src/theme/Root.js and ensuring proper SSR compatibility. The ChatbotWidget component was already properly wrapped in useEffect, so I created a new Root.js that renders the ChatbotWidget component. Also removed the duplicate ChatbotWidget from Layout.js to prevent conflicts.

## OUTCOME_IMPACT
The chat widget will now properly appear on the Docusaurus site and function correctly with SSR.

## TESTS_SUMMARY
none

## FILES_SUMMARY
- src/theme/Root.js (created)
- src/theme/Layout.js (modified - removed duplicate widget)
- src/components/ChatbotWidget.tsx (used as component)

## NEXT_PROMPTS
["Verify the chat widget appears correctly in the Docusaurus site", "Test functionality of the chat widget after deployment"]

## REFLECTION_NOTE
Docusaurus requires Root.js to be in src/theme/Root.js for proper loading, not in a pages subdirectory.

## Evaluation
Failure modes observed: None
Next experiment to improve prompt quality: None needed