# Product Requirements Document: Developer Portfolio Redesign

## 1. Overview
A premium, award-worthy portfolio website designed to showcase expertise in AI-powered web applications. The design focuses on a minimalist, futuristic, and high-performance dark-themed UI.

## 2. Global Design System
- **Theme**: Ultra-dark (#050505), high-contrast.
- **Glassmorphism**: `bg: rgba(255, 255, 255, 0.03)`, `backdrop-filter: blur(12px)`, `border: 1px solid rgba(255, 255, 255, 0.1)`.
- **Typography**:
    - Display: *Geist*
    - Body: *Inter*
    - Mono: *IBM Plex Mono*
- **Accents**: Purple (#A855F7), Cyan (#2BC8EC), White.

## 3. Core Components
| Component | Responsibility |
| :--- | :--- |
| **Navbar** | Sticky glassmorphism header with navigation links. |
| **Hero** | Impactful headline, gradient backgrounds, and an integrated AI Assistant voice console. |
| **About** | Professional journey, background, and coding expertise. |
| **Skills** | Categorized technical skills presented in interactive cards. |
| **Projects** | Showcase of work with hover tilt effects, tech badges, and details. |
| **Contact** | Direct contact information (email & phone). |
| **AgentConsole** | Voice interaction interface with real-time waveform feedback. |

## 4. Interaction & UX
- **Animations**: Powered by *Framer Motion* for fluid, high-fidelity transitions.
- **Interactions**: Magnetic buttons, card tilt effects, and smooth scroll behaviors.
- **Accessibility**: High contrast, keyboard navigation support, and optimized `prefers-reduced-motion`.

## 5. Performance
- **Framework**: Next.js 14 (App Router).
- **Goal**: Lighthouse score > 95 through lazy loading and optimized assets.
