# Plan: Add a 'Back' button to project readme pages

## Context
The project readme pages (`/app/project/[...slug]/page.tsx`) currently do not provide a mechanism to navigate back to the main resume website. This design plan addresses this by adding a consistent navigation link to return to the home page.

## Proposed Changes
1.  **Modify** `/app/project/[...slug]/page.tsx`:
    - Add a `Link` component from `next/link`.
    - Insert a "Back to Home" navigation element at the top of the readme page.
    - Style the button to match the project's overall look (likely using standard HTML/Tailwind classes similar to the existing components).

## Implementation Details
- Import: `import Link from 'next/link';`
- Element: 
  ```tsx
  <div className="max-w-4xl mx-auto px-6 pt-12">
    <Link href="/" className="inline-flex items-center text-sm font-semibold text-slate-400 hover:text-white transition-colors">
      <span className="mr-2">←</span> Back to Home
    </Link>
  </div>
  ```
- Placement: Add this immediately before the `<article>` tag in `ProjectPage`.

## Verification
- Run the development server (`npm run dev`).
- Navigate to a project's readme page.
- Click the "Back to Home" button.
- Verify that it successfully redirects to the main resume website (`/`).
