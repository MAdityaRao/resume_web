---
name: add-back-button-to-readme
description: Add a back button to project readme pages for improved navigation.
metadata:
  type: project
---

The user has reported that there is no back button to navigate from a project's readme page back to the main resume website.

**Why:**
The project readme pages are served through a dynamic Next.js route (`/project/[...slug]`), and currently, they lack any navigation to return the user to the main page. This disrupts the user experience.

**How to apply:**
1.  Create a simple, consistent back button component or include a link in the project readme page layout.
2.  Given the project's design, adding a "Back to Home" button or link in the top-left corner of the `ProjectPage` layout component (`/Users/adityarao/Desktop/resume_web/app/project/[...slug]/page.tsx`) would be the most effective solution.
3.  Ensure the button uses Next.js `Link` for efficient navigation.
4.  Style it to match the existing dark, clean aesthetic of the resume website.
