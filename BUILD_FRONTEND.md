# Frontend Build Guide: XAI Skin Lesion Analysis Platform

**Step-by-step instructions to build the Next.js frontend from absolute zero. Every command included, every concept explained.**

---

## How This Guide Relates To The Root Docs

This file is the beginner-friendly frontend tutorial. Keep it in the frontend repo because it teaches React/Next.js concepts and the first components to build.

For production decisions, also read these root guides:

- `../docs/BUILD_PHASE_3_FRONTEND.md` - production frontend sequence
- `../docs/SYSTEM_DESIGN_LEARNING_GUIDE.md` - why Next.js, PWA-first mobile web, and separate repos are used
- `../docs/PRODUCTION_BUILD_REVIEW.md` - current implementation gaps and production blockers

If this file and the root docs disagree, treat the root docs as the production source of truth and update this file.

## Current Reality

The frontend repo is currently a clean Next.js scaffold. Do not rerun `create-next-app` if the scaffold already exists.

Research notebooks and training scripts now belong in `../Skin_Lesion_XAI_research`. If a local frontend checkout still contains `notebooks/`, `train_backbones.py`, or `train_epoch_checkpoints.py`, treat those as migration leftovers. Do not build new frontend work around them.

Start with this learning slice:

1. Make the scaffold build cleanly.
2. Create `lib/api.ts` with a mocked predict call.
3. Build `ImageUploader`.
4. Build `PredictionDisplay`.
5. Connect to the real backend `/predict`.
6. Add `XAIViewer` after `/explain` exists.

Build mobile-first from the beginning. The native Expo app should wait until this web flow and the backend API contract are stable.

---

## Table of Contents

1. [What Are We Building?](#1-what-are-we-building)
2. [Understanding the Architecture](#2-understanding-the-architecture)
3. [Step 1: Set Up Your Computer](#step-1-set-up-your-computer)
4. [Step 2: Create the Next.js Project](#step-2-create-the-nextjs-project)
5. [Step 3: Understand the Project Structure](#step-3-understand-the-project-structure)
6. [Step 4: Create Your First Route (Page)](#step-4-create-your-first-route-page)
7. [Step 5: Build the ImageUploader Component](#step-5-build-the-imageuploader-component)
8. [Step 6: Build the PredictionDisplay Component](#step-6-build-the-predictiondisplay-component)
9. [Step 7: Build the XAIViewer Component](#step-7-build-the-xaiviewer-component)
10. [Step 8: Build the MethodSelector Component](#step-8-build-the-methodselector-component)
11. [Step 9: Build the FeedbackConsent Component](#step-9-build-the-feedbackconsent-component)
12. [Step 10: Connect Everything to the API](#step-10-connect-everything-to-the-api)
13. [Step 11: Run and Test](#step-11-run-and-test)

---

## 1. What Are We Building?

We're building a web application where:
1. Users upload a skin lesion image (dermoscopy photo)
2. The AI analyzes it and says "benign" (not cancer) or "malignant" (cancer)
3. The AI shows a heatmap explaining which parts of the image made it think that
4. Users can optionally consent to share their image for training (to make the AI better)

The "frontend" is what the user sees and interacts with in their browser. It talks to the "backend" (a server) to do the actual AI analysis.

---

## 2. Understanding the Architecture

### What is a "Route"?

A route is simply a URL path that shows a different page. In Next.js:
- `/` (root) shows the main page (upload + results)
- `/privacy` shows the privacy policy page

Think of it like a restaurant menu:
- `/` is the main dining room (upload page)
- `/privacy` is a private room (privacy policy)

### What is a "Component"?

A component is a reusable piece of UI. Instead of writing the same code multiple times, you write it once as a component and use it anywhere.

Think of components like LEGO blocks:
- ImageUploader is a LEGO block for uploading images
- PredictionDisplay is a LEGO block for showing results
- Each block does one thing and can be placed anywhere

### What is an "API"?

An API (Application Programming Interface) is how two programs talk to each other. Your frontend (browser) asks the backend (server) to do something, and the backend responds.

It's like ordering food:
1. You (frontend) tell the waiter what you want
2. Waiter (API) carries your order to the kitchen (backend)
3. Kitchen prepares the food (AI analysis)
4. Waiter brings the food back to you

### The Flow of Our Application

```
User uploads image
       ↓
Frontend sends image to Backend via POST /api/v1/predict
       ↓
Backend analyzes image with AI model
       ↓
Backend returns: "Malignant, 87% confidence"
       ↓
Frontend displays result
       ↓
User clicks "Show heatmap"
       ↓
Frontend asks Backend for heatmap via POST /api/v1/explain
       ↓
Backend generates Grad-CAM heatmap
       ↓
Backend returns three images (original, heatmap, overlay)
       ↓
Frontend displays the triple-panel visualization
```

---

## Step 1: Set Up Your Computer

### What You Need

Before we start coding, you need to install some software. Think of this like gathering tools before building furniture.

**1. Install Node.js (required for Next.js)**

Go to https://nodejs.org/ and download the LTS version (the big green button).

After installing, open a new terminal and verify:
```bash
node --version
npm --version
```

You should see numbers like `v20.10.0` and `10.2.0`.

**2. Install VS Code (recommended text editor)**

Download from https://code.visualstudio.com/

This is where we'll write all our code. It's free and has great features for beginners.

---

## Step 2: Create the Next.js Project

### What is Next.js?

Next.js is a framework built on top of React. It makes building web applications easier by handling routing, page generation, and optimization automatically.

Think of it like:
- React = raw ingredients (flexible but lots of work)
- Next.js = microwave meal (same result, much easier)

### Create the Project

Open your terminal and run these commands:

```bash
# Navigate to your projects folder
cd C:/Users/saiyu/Desktop/projects/KI_projects

# Create a new Next.js app called "Skin_Lesion_Classification_frontend"
# The --typescript flag adds TypeScript (helps catch errors)
# The --tailwind flag adds Tailwind CSS (easy styling)
# The --app flag uses the new App Router (modern way to build pages)
npx create-next-app@latest Skin_Lesion_Classification_frontend --typescript --tailwind --app

# When it asks questions, answer:
# - Would you like to customize the import alias "@/*"? → No (just press Enter)
# - Use src/ directory? → No (we'll keep files at root level)
# - Would you like to customize the default import alias? → No (just press Enter)
```

Wait for it to finish (may take 2-3 minutes).

### What Just Happened?

`npx create-next-app@latest` downloaded a tool that created a new folder called `Skin_Lesion_Classification_frontend`. Inside that folder is a complete working Next.js project - like ordering a prefab house that arrives with all walls built.

---

## Step 3: Understand the Project Structure

After creating the project, your folder structure looks like this:

```
Skin_Lesion_Classification_frontend/
├── app/                    ← "App Router" - where all pages live
│   ├── page.tsx           ← The main page (/)
│   ├── layout.tsx         ← Shared layout for all pages
│   └── globals.css        ← Global styles (Tailwind)
├── public/                ← Static files (images, icons)
├── components/            ← Your reusable UI components (we'll add here)
├── lib/                   ← Utility code (we'll add API client here)
├── package.json           ← List of dependencies
├── tsconfig.json          ← TypeScript configuration
├── next.config.js         ← Next.js configuration
└── tailwind.config.ts     ← Tailwind CSS configuration
```

### What is the `app/` Directory?

In Next.js 14's App Router, every file in `app/` becomes a route:
- `app/page.tsx` → the page at `/`
- `app/about/page.tsx` → the page at `/about`
- `app/privacy/page.tsx` → the page at `/privacy`

The file name `page.tsx` is special - it tells Next.js "this file represents a page."

### What is a Component?

A component in React is a function that returns UI elements. They're reusable - you can use the same component in multiple places.

Example:
```tsx
// This is a component named "Greeting"
// It returns a <p> element with "Hello!"
function Greeting() {
  return <p>Hello!</p>;
}

// You can use it anywhere: <Greeting />
```

### What is the `public/` Directory?

Files in `public/` are served as-is. If you put `logo.png` in `public/`, you can access it at `http://localhost:3000/logo.png`. Use this for images that don't change.

---

## Step 4: Create Your First Route (Page)

### What is a Route?

A route is a URL path. `app/page.tsx` is the route for `/` (the homepage). `app/about/page.tsx` would be the route for `/about`.

The word "route" comes from the French word for "road" - it's the path you take to get to a page.

### Create the Privacy Page

First, let's create a simple privacy policy page so you understand how routes work:

**1. Create the directory:**
```bash
cd Skin_Lesion_Classification_frontend
mkdir -p app/privacy
```

**2. Create the page file:**
Create `app/privacy/page.tsx` with this content:

```tsx
export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
        
        <div className="prose prose-gray">
          <h2 className="text-xl font-semibold mt-4 mb-2">Data Collection</h2>
          <p className="text-gray-600 mb-4">
            We only collect image data that you voluntarily submit through our 
            prediction service. No personal information is stored without explicit consent.
          </p>
          
          <h2 className="text-xl font-semibold mt-4 mb-2">Consent for Training</h2>
          <p className="text-gray-600 mb-4">
            If you opt-in to share your image for training, it will be securely 
            stored in an AWS S3 bucket and may be used to improve our model.
          </p>
          
          <h2 className="text-xl font-semibold mt-4 mb-2">Your Rights</h2>
          <p className="text-gray-600">
            You can request deletion of your contributed data at any time by 
            contacting our support team.
          </p>
        </div>
      </div>
    </div>
  );
}
```

**3. Run and see it work:**
```bash
npm run dev
```

Open your browser to http://localhost:3000/privacy

You should see your privacy policy page!

### What Just Happened?

1. We created `app/privacy/page.tsx`
2. Next.js saw the file and automatically created a route at `/privacy`
3. When you visit `/privacy`, Next.js renders this component and sends HTML to your browser

This is the magic of Next.js - file-based routing. The file path determines the URL.

### What is `export default`?

In TypeScript/JavaScript, `export default` means "this is the main thing this file exports." When Next.js renders a page, it looks for the default export of `page.tsx`.

It's like the main entrance to a building - every building needs one main entrance.

---

## Step 5: Build the ImageUploader Component

### What is a Component?

A component is a reusable piece of UI. Think of it like a LEGO block - each block does one thing and can be combined with other blocks to build something bigger.

### Create the ImageUploader

Create `components/ImageUploader.tsx`:

```tsx
"use client";

import { useState, useCallback } from "react";

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
}

export default function ImageUploader({ onImageSelect }: ImageUploaderProps) {
  // state = "memory" that persists across re-renders
  // isDragging tracks if user is dragging a file over the drop zone
  const [isDragging, setIsDragging] = useState(false);

  // handleFile is called when user selects a file
  const handleFile = useCallback((file: File) => {
    // Validate file type - only accept images
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file (JPG, PNG, or WEBP)");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("File too large. Maximum size is 10MB.");
      return;
    }

    // Tell the parent component about the selected file
    onImageSelect(file);
  }, [onImageSelect]);

  // handleDrop is called when user drops a file
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  // handleDragOver prevents browser from opening dropped files
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  // handleInputChange is called when user clicks the file input
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div
      className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer
        ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => document.getElementById("file-input")?.click()}
    >
      <input
        id="file-input"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleInputChange}
      />

      <div className="space-y-4">
        {/* Upload icon */}
        <div className="text-6xl">📤</div>

        <div>
          <p className="text-lg font-medium text-gray-700">
            Drag and drop your image here
          </p>
          <p className="text-sm text-gray-500 mt-1">
            or click to browse (JPG, PNG, WEBP - max 10MB)
          </p>
        </div>
      </div>
    </div>
  );
}
```

### Understanding the Code

**`"use client"`** at the top tells Next.js this is a client component (runs in the browser, not on the server). We need this because we use `useState` and handle browser events.

**`useState`** is a React hook that adds "memory" to our component. Every time the component re-renders, `isDragging` keeps its value. It's like a sticky note that doesn't forget.

**`useCallback`** wraps functions to prevent unnecessary re-creations. It memoizes the function so it only changes when its dependencies change. Don't worry too much about this - just know it's needed for event handlers.

**Props** (the `{ onImageSelect }` parameter) are data passed from parent to child. Here, we expect the parent to give us a function that we call when the user selects an image.

### Add to Main Page

Now let's add the ImageUploader to our main page. Open `app/page.tsx` and replace everything with:

```tsx
"use client";

import { useState } from "react";
import ImageUploader from "@/components/ImageUploader";

export default function HomePage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Skin Lesion Analysis
          </h1>
          <p className="text-lg text-gray-600">
            Upload a dermoscopy image for AI-powered analysis
          </p>
        </div>

        {/* Upload Area */}
        <ImageUploader onImageSelect={handleImageSelect} />

        {/* Preview selected image */}
        {selectedImage && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Selected: {selectedImage.name}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
```

### Test It

```bash
npm run dev
```

Open http://localhost:3000/. You should see the upload area. Try dragging an image onto it or clicking to select one.

---

## Step 6: Build the PredictionDisplay Component

### What We're Building

After the user uploads an image and it gets sent to the backend, we need to show the result. PredictionDisplay shows:
- Whether the lesion is "Benign" or "Malignant"
- How confident the AI is (like "87% confident")

### Create the Component

Create `components/PredictionDisplay.tsx`:

```tsx
"use client";

interface PredictionDisplayProps {
  diagnosis: "benign" | "malignant";
  confidence: number;
  classProbabilities: {
    benign: number;
    malignant: number;
  };
}

export default function PredictionDisplay({
  diagnosis,
  confidence,
  classProbabilities,
}: PredictionDisplayProps) {
  // Color logic: green for benign, red for malignant, yellow for uncertain
  const isBenign = diagnosis === "benign";
  const highConfidence = confidence >= 70;

  const colorClass = isBenign
    ? "text-green-600 bg-green-50 border-green-200"
    : "text-red-600 bg-red-50 border-red-200";

  const confidenceColor = isBenign ? "bg-green-500" : "bg-red-500";

  return (
    <div className={`rounded-2xl border-2 p-6 ${colorClass}`}>
      {/* Diagnosis Badge */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-2xl font-bold uppercase tracking-wide">
          {diagnosis}
        </span>
        <span className="text-lg font-semibold">
          {confidence}% confidence
        </span>
      </div>

      {/* Confidence Bar */}
      <div className="mb-6">
        <div className="h-4 w-full bg-white rounded-full overflow-hidden">
          <div
            className={`h-full ${confidenceColor} transition-all duration-500`}
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>

      {/* Probability Breakdown */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-white/50 rounded-lg p-3">
          <p className="text-gray-500 mb-1">Benign Probability</p>
          <p className="font-semibold text-lg">
            {(classProbabilities.benign * 100).toFixed(1)}%
          </p>
        </div>
        <div className="bg-white/50 rounded-lg p-3">
          <p className="text-gray-500 mb-1">Malignant Probability</p>
          <p className="font-semibold text-lg">
            {(classProbabilities.malignant * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Warning for low confidence */}
      {!highConfidence && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            ⚠️ Low confidence prediction. Consider consulting a dermatologist
            for professional evaluation.
          </p>
        </div>
      )}
    </div>
  );
}
```

### Understanding the Code

**Interface** (`PredictionDisplayProps`) defines the shape of data this component expects. It's like a contract - the parent must provide these fields. TypeScript uses this to catch errors before you run the code.

**Destructuring** (`{ diagnosis, confidence }`) is a shortcut to extract values from an object. Instead of `props.diagnosis`, you can write `diagnosis` directly.

**Conditional Styling** - We use ternary operators (`isBenign ? X : Y`) to pick different colors based on the diagnosis. This is common in React.

**The Confidence Bar** - It's a `div` with `width: ${confidence}%`. The `%` sign in style interpolation lets us set a CSS value dynamically.

### Add to Main Page

Update `app/page.tsx` to include the PredictionDisplay and mock data:

```tsx
"use client";

import { useState } from "react";
import ImageUploader from "@/components/ImageUploader";
import PredictionDisplay from "@/components/PredictionDisplay";

export default function HomePage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [prediction, setPrediction] = useState<{
    diagnosis: "benign" | "malignant";
    confidence: number;
    classProbabilities: { benign: number; malignant: number };
  } | null>(null);

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    // For now, set mock data to see the component
    setPrediction({
      diagnosis: "malignant",
      confidence: 87,
      classProbabilities: { benign: 0.13, malignant: 0.87 },
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Skin Lesion Analysis
          </h1>
          <p className="text-lg text-gray-600">
            Upload a dermoscopy image for AI-powered analysis
          </p>
        </div>

        {/* Upload Area */}
        <ImageUploader onImageSelect={handleImageSelect} />

        {/* Show prediction result */}
        {prediction && (
          <div className="mt-8">
            <PredictionDisplay {...prediction} />
          </div>
        )}
      </div>
    </main>
  );
}
```

### Test It

Save the files and refresh your browser. You should see the prediction display with mock data.

---

## Step 7: Build the XAIViewer Component

### What We're Building

XAI (Explainable AI) is about showing why the AI made its decision. We display three images:
1. **Original** - the skin lesion image as-is
2. **Heatmap** - a colorful map showing which areas influenced the decision (red = high importance, blue = low importance)
3. **Overlay** - the heatmap blended on top of the original image so you can see exactly which part of the lesion the AI was looking at

### Create the Component

Create `components/XAIViewer.tsx`:

```tsx
"use client";

interface XAIViewerProps {
  original: string;    // base64 encoded image
  heatmap: string;     // base64 encoded image
  overlay: string;     // base64 encoded image
  method: string;
  focusAreaPercentage: number;
}

export default function XAIViewer({
  original,
  heatmap,
  overlay,
  method,
  focusAreaPercentage,
}: XAIViewerProps) {
  return (
    <div className="space-y-6">
      {/* Method and Metrics Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Explanation: {method.toUpperCase()}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Focus area: {focusAreaPercentage.toFixed(2)}%
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">
            Red = high importance
          </p>
          <p className="text-xs text-gray-400">
            Blue = low importance
          </p>
        </div>
      </div>

      {/* Triple Panel Visualization */}
      <div className="grid grid-cols-3 gap-4">
        {/* Original Image */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 text-center">Original</p>
          <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-square">
            <img
              src={`data:image/png;base64,${original}`}
              alt="Original dermoscopy image"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Heatmap */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 text-center">Heatmap</p>
          <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-square">
            <img
              src={`data:image/png;base64,${heatmap}`}
              alt="Grad-CAM heatmap"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Overlay */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 text-center">Overlay</p>
          <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-square">
            <img
              src={`data:image/png;base64,${overlay}`}
              alt="Heatmap overlay on original"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>

      {/* Interpretation Guide */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="font-semibold text-blue-900 mb-2">How to Read This</h3>
        <p className="text-sm text-blue-800">
          The <span className="font-medium">red regions</span> indicate where the AI
          focused most heavily when making its prediction. A smaller focus area
          suggests the model is confident about a specific region. A larger focus
          area may indicate the model is uncertain or considers the entire lesion.
        </p>
      </div>
    </div>
  );
}
```

### Understanding the Code

**Base64 Images** - The backend sends images encoded as base64 strings. This is a way to send binary image data as text. To display it, we prepend `data:image/png;base64,` and then the base64 string.

**Aspect Square** - `aspect-square` in Tailwind makes the div square regardless of its width. We use this so all three images are the same size.

**Props Interface** - We define what data XAIViewer expects: three base64 images, the method used, and the focus area percentage.

---

## Step 8: Build the MethodSelector Component

### What We're Building

There are different algorithms for generating heatmaps (Grad-CAM, Grad-CAM++, EigenCAM, LayerCAM). The user should be able to switch between them to compare.

### Create the Component

Create `components/MethodSelector.tsx`:

```tsx
"use client";

const METHODS = [
  { id: "gradcam", name: "Grad-CAM", description: "Standard gradient-weighted CAM" },
  { id: "gradcam_pp", name: "Grad-CAM++", description: "Improved version with better localization" },
  { id: "eigencam", name: "EigenCAM", description: "Uses eigenvectors for activation maps" },
  { id: "layercam", name: "LayerCAM", description: "Layer-wise gradient aggregation" },
] as const;

interface MethodSelectorProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
  disabled?: boolean;
}

export default function MethodSelector({
  selectedMethod,
  onMethodChange,
  disabled = false,
}: MethodSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        XAI Method
      </label>

      <div className="grid grid-cols-2 gap-3">
        {METHODS.map((method) => {
          const isSelected = selectedMethod === method.id;
          return (
            <button
              key={method.id}
              onClick={() => onMethodChange(method.id)}
              disabled={disabled}
              className={`p-4 rounded-xl border-2 text-left transition-all
                ${isSelected
                  ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                  : "border-gray-200 bg-white hover:border-gray-300"
                }
                ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <p className="font-semibold text-gray-900">{method.name}</p>
              <p className="text-sm text-gray-500 mt-1">{method.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { METHODS };
```

### Understanding the Code

**`as const`** - This TypeScript assertion tells TypeScript these values are never changing. It makes the type more specific, which helps catch errors.

**Grid Layout** - `grid grid-cols-2` creates a 2-column grid. Each button goes in one cell.

**Conditional Classes** - We use template literals with ternary operators to apply different styles based on whether a method is selected.

**`disabled` Prop** - Sometimes we want to prevent the user from changing the method (e.g., while loading). The disabled prop handles this.

---

## Step 9: Build the FeedbackConsent Component

### What We're Building

For the AI to improve over time, we need users to voluntarily share their images for training. But consent must be explicit - users must actively opt-in.

This component shows a checkbox and submit button. The submit button is disabled until the user checks the consent box.

### Create the Component

Create `components/FeedbackConsent.tsx`:

```tsx
"use client";

import { useState } from "react";

interface FeedbackConsentProps {
  predictionId: string;
  onSubmit: (consent: boolean) => void;
  disabled?: boolean;
}

export default function FeedbackConsent({
  predictionId,
  onSubmit,
  disabled = false,
}: FeedbackConsentProps) {
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!consent) return;

    setIsSubmitting(true);
    try {
      await onSubmit(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <div className="flex-shrink-0 mt-1">
          <input
            type="checkbox"
            id="consent-checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            disabled={disabled}
            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
        </div>

        {/* Text */}
        <div className="flex-1">
          <label
            htmlFor="consent-checkbox"
            className="text-sm font-medium text-gray-900 cursor-pointer"
          >
            I consent to share my image for AI training
          </label>
          <p className="text-xs text-gray-500 mt-1">
            Your image will be securely stored and may be used to improve the
            classification model. You can request deletion at any time.
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={!consent || disabled || isSubmitting}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors
            ${consent && !disabled && !isSubmitting
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
        >
          {isSubmitting ? "Submitting..." : "Submit Feedback"}
        </button>
      </div>
    </div>
  );
}
```

### Understanding the Code

**Checkbox State** - We use `useState(false)` to track whether the user checked the consent box. The checkbox is only checked when `consent === true`.

**Disabled Button** - The submit button's disabled state depends on three things: `!consent` (not checked), `disabled` (passed from parent), or `isSubmitting` (currently submitting).

**Controlled Input** - The checkbox is "controlled" because its value comes from React state. Every change calls `setConsent` to update the state.

---

## Step 10: Connect Everything to the API

### What is an API Client?

An API client is code that handles communication with the backend. Instead of scattering `fetch()` calls throughout your components, you put them in one place (`lib/api.ts`).

### Create the API Client

First, create the `lib` directory and the API client:

```bash
mkdir -p lib
```

Create `lib/api.ts`:

```typescript
// Types matching the backend response schemas

export interface PredictionResponse {
  prediction_id: string;
  diagnosis: "benign" | "malignant";
  confidence: number;
  class_probabilities: {
    benign: number;
    malignant: number;
  };
  model_version: string;
  processing_time_ms: number;
}

export interface ExplainResponse {
  explanation_id: string;
  method: string;
  heatmaps: {
    original: string;
    heatmap: string;
    overlay: string;
  };
  metrics: {
    focus_area_percentage: number;
    cam_max: number;
    cam_mean: number;
  };
}

export interface FeedbackResponse {
  feedback_id: string;
  status: "queued";
  message: string;
}

export interface HealthResponse {
  model_version: string;
  device: string;
  status: "healthy";
}

export interface MethodsResponse {
  methods: string[];
}

// API client functions

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error ${response.status}: ${error}`);
  }
  return response.json();
}

export async function getHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/health`);
  return handleResponse<HealthResponse>(response);
}

export async function getMethods(): Promise<MethodsResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/methods`);
  return handleResponse<MethodsResponse>(response);
}

export async function predict(imageFile: File): Promise<PredictionResponse> {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await fetch(`${API_BASE_URL}/api/v1/predict`, {
    method: "POST",
    body: formData,
  });

  return handleResponse<PredictionResponse>(response);
}

export async function explain(
  predictionId: string,
  method: string
): Promise<ExplainResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/explain`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prediction_id: predictionId,
      method,
    }),
  });

  return handleResponse<ExplainResponse>(response);
}

export async function submitFeedback(
  predictionId: string,
  consent: true
): Promise<FeedbackResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/feedback`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prediction_id: predictionId,
      consent,
    }),
  });

  return handleResponse<FeedbackResponse>(response);
}
```

### Understanding the Code

**FormData** - When uploading files, we can't use JSON. We use `FormData` to package the file as multipart form data.

**process.env.NEXT_PUBLIC_API_URL** - This reads an environment variable. In development, it's `http://localhost:8000`. In production on Vercel, you'd set it to your backend's URL.

**handleResponse Helper** - This function checks if the request succeeded. If not, it throws an error with the status code and message.

**Return Types** - Each function has a return type (e.g., `Promise<PredictionResponse>`). This helps TypeScript catch errors.

### Create Types File

Create `lib/types.ts`:

```typescript
// Re-export all types from api.ts for cleaner imports
export type {
  PredictionResponse,
  ExplainResponse,
  FeedbackResponse,
  HealthResponse,
  MethodsResponse,
} from "./api";
```

---

## Step 11: Run and Test

### Put It All Together

Update `app/page.tsx` to wire everything together with real API calls:

```tsx
"use client";

import { useState, useEffect } from "react";
import ImageUploader from "@/components/ImageUploader";
import PredictionDisplay from "@/components/PredictionDisplay";
import XAIViewer from "@/components/XAIViewer";
import MethodSelector, { METHODS } from "@/components/MethodSelector";
import FeedbackConsent from "@/components/FeedbackConsent";
import { predict, explain, submitFeedback } from "@/lib/api";
import type { PredictionResponse, ExplainResponse } from "@/lib/types";

export default function HomePage() {
  // Image selection state
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  // Prediction state
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionError, setPredictionError] = useState<string | null>(null);

  // XAI state
  const [selectedMethod, setSelectedMethod] = useState<string>("gradcam");
  const [explanation, setExplanation] = useState<ExplainResponse | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);

  // Handle image selection
  const handleImageSelect = async (file: File) => {
    setSelectedImage(file);
    setPrediction(null);
    setExplanation(null);
    setPredictionError(null);

    setIsPredicting(true);
    try {
      const result = await predict(file);
      setPrediction(result);
    } catch (error) {
      setPredictionError(
        error instanceof Error ? error.message : "Prediction failed"
      );
    } finally {
      setIsPredicting(false);
    }
  };

  // Handle explanation request
  const handleExplain = async () => {
    if (!prediction) return;

    setIsExplaining(true);
    try {
      const result = await explain(prediction.prediction_id, selectedMethod);
      setExplanation(result);
    } catch (error) {
      console.error("Explanation failed:", error);
    } finally {
      setIsExplaining(false);
    }
  };

  // Fetch explanation when method changes (if we already have a prediction)
  useEffect(() => {
    if (prediction && !isPredicting) {
      handleExplain();
    }
  }, [selectedMethod]);

  // Handle feedback submission
  const handleFeedbackSubmit = async (consent: boolean) => {
    if (!prediction) return;

    try {
      await submitFeedback(prediction.prediction_id, true);
      alert("Thank you for your contribution!");
    } catch (error) {
      alert("Feedback submission failed. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Skin Lesion Analysis
          </h1>
          <p className="text-lg text-gray-600">
            Upload a dermoscopy image for AI-powered analysis
          </p>
        </div>

        {/* Upload Area */}
        <ImageUploader onImageSelect={handleImageSelect} />

        {/* Loading state */}
        {isPredicting && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin text-4xl">⏳</div>
            <p className="text-gray-600 mt-4">Analyzing image...</p>
          </div>
        )}

        {/* Error state */}
        {predictionError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-800 font-medium">Prediction Failed</p>
            <p className="text-red-600 text-sm mt-1">{predictionError}</p>
            <p className="text-red-500 text-xs mt-2">
              Make sure the backend is running at http://localhost:8000
            </p>
          </div>
        )}

        {/* Prediction Result */}
        {prediction && !isPredicting && (
          <div className="space-y-6">
            <PredictionDisplay
              diagnosis={prediction.diagnosis}
              confidence={prediction.confidence}
              classProbabilities={prediction.class_probabilities}
            />

            {/* XAI Section */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Explainability
              </h2>

              <div className="mb-6">
                <MethodSelector
                  selectedMethod={selectedMethod}
                  onMethodChange={(method) => setSelectedMethod(method)}
                  disabled={isExplaining}
                />
              </div>

              {isExplaining && (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin text-3xl">🔄</div>
                  <p className="text-gray-600 mt-2">Generating heatmap...</p>
                </div>
              )}

              {explanation && !isExplaining && (
                <XAIViewer
                  original={explanation.heatmaps.original}
                  heatmap={explanation.heatmaps.heatmap}
                  overlay={explanation.heatmaps.overlay}
                  method={explanation.method}
                  focusAreaPercentage={explanation.metrics.focus_area_percentage}
                />
              )}
            </div>

            {/* Feedback Section */}
            <FeedbackConsent
              predictionId={prediction.prediction_id}
              onSubmit={handleFeedbackSubmit}
            />
          </div>
        )}
      </div>
    </main>
  );
}
```

### Create Environment File

Create `.env.local` in the project root:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

This tells the frontend where to find the backend.

### Run the Frontend

```bash
npm run dev
```

Open http://localhost:3000/

### What's Next?

The frontend is now complete! At this point:
- The UI is fully functional
- It makes API calls to `http://localhost:8000`
- But the backend isn't running yet, so predictions will fail

To make everything work, you need to build the backend. See the **Backend Build Guide (BUILD_BACKEND.md)** for step-by-step instructions.

---

## Frontend Summary

### What You Built

1. **Routes** (`app/` directory)
   - `/` (page.tsx) - main upload page
   - `/privacy` (privacy/page.tsx) - privacy policy

2. **Components** (`components/` directory)
   - `ImageUploader.tsx` - drag/drop file upload
   - `PredictionDisplay.tsx` - shows diagnosis and confidence
   - `XAIViewer.tsx` - triple-panel heatmap visualization
   - `MethodSelector.tsx` - dropdown for XAI method selection
   - `FeedbackConsent.tsx` - opt-in checkbox for training data

3. **API Client** (`lib/api.ts`)
   - `predict()` - POST /api/v1/predict
   - `explain()` - POST /api/v1/explain
   - `submitFeedback()` - POST /api/v1/feedback

### Key Concepts Learned

- **Routes**: URL paths that map to pages (file-based routing in Next.js)
- **Components**: Reusable UI pieces (like LEGO blocks)
- **Props**: Data passed from parent to child components
- **State**: Data that persists across re-renders (useState hook)
- **API Client**: Centralized place for all backend communication
- **TypeScript Interfaces**: Contracts defining expected data shapes

### Run Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run type checking
npm run type-check

# Lint code
npm run lint
```

---

## Common Errors and Fixes

**"Module not found" errors**
→ Run `npm install` to install all dependencies

**"Cannot find file" errors**
→ Check the import path uses `@/` which means `src/` or root

**API calls failing**
→ Make sure backend is running at `http://localhost:8000`
→ Check `.env.local` has the correct `NEXT_PUBLIC_API_URL`

**TypeScript errors**
→ Hover over the red underline to see what's wrong
→ Check that your interfaces match what the API returns
