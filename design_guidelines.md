# Bricks Design Guidelines

## Design Approach
**Reference-Based Dark Minimal with Neon Accent System** - Inspired by premium fitness apps with dark, sophisticated interfaces combined with high-energy neon elements. Think intimate, refined, and sporty simultaneously.

---

## Color Palette (EXACT COLORS - DO NOT DEVIATE)

### Primary Colors
- **Deep Background**: `#002c2b` (dark petrol green) - Use for main backgrounds, deep areas, card backgrounds, and primary blocks
- **Neon Accent**: `#b6ff00` (vibrant neon green) - Use for buttons, titles, highlights, CTAs, and key interactive elements
- **Light Text/Borders**: `#f7f7f7` (ice white) - Use for subtitles, body text, subtle borders, and secondary information

### Color Usage Rules
- Strong contrast between #002c2b and #b6ff00 is essential
- Generous white/negative space to reinforce premium feel
- Text on dark backgrounds uses #f7f7f7
- All primary CTAs and interactive elements in #b6ff00
- Never use additional colors outside this palette

---

## Typography

### Font Family
Use one of: **Inter**, **Poppins**, **Montserrat**, or **Sora** (choose one and apply consistently)

### Hierarchy
- **Headings/Titles**: Weight 600-700, larger sizes, color #b6ff00 for emphasis or #f7f7f7 for subtlety
- **Body Text**: Weight 300-400, color #f7f7f7
- **Subheadings**: Weight 500, color #f7f7f7 with reduced opacity if needed

### Sizes (responsive)
- Hero titles: Large and bold
- Section headings: Medium-large
- Card titles: Medium
- Body text: Optimized for readability on dark backgrounds

---

## Layout System

### Spacing Units
Use Tailwind spacing: primarily 4, 6, 8, 12, 16, 20, 24 for consistent rhythm

### Responsive Breakpoints
- **Mobile-first approach**
- Mobile: Single column, full-width components
- Desktop: Multi-column where appropriate (2-3 columns max)

### Mobile Layout (< 768px)
- **Navigation**: Bottom bar with minimalist outline icons
- **Cards**: Large, touch-friendly blocks with generous padding (p-6 to p-8)
- **Buttons**: Full-width or near-full-width (w-full)
- **Content**: Focused, one primary element per screen section
- **Spacing**: Generous vertical spacing between sections (py-8 to py-12)

### Desktop Layout (≥ 768px)
- **Navigation**: Fixed left sidebar with vertical menu
- **Layout**: 2-3 column grids where logical (list + details pattern)
- **Cards**: Wider with more horizontal space
- **Content**: More information density, utilize horizontal space
- **Spacing**: Wider sections (py-12 to py-20)

---

## Component Library

### Buttons
- **Primary CTA**: Background #b6ff00, text #002c2b, weight 600, rounded corners (rounded-lg), padding px-8 py-3
- **Secondary**: Outline style with #f7f7f7 border, text #f7f7f7, same padding
- **Hover**: Subtle brightness increase on neon buttons (soft glow effect)
- **Size**: Large and accessible, especially on mobile

### Cards
- **Background**: #002c2b with subtle border in #f7f7f7 (or no border for cleaner look)
- **Padding**: p-6 to p-8
- **Rounded**: rounded-lg to rounded-xl
- **Shadow**: Minimal or none (dark aesthetic doesn't need heavy shadows)
- **Content**: Title in #b6ff00 or #f7f7f7, body text in #f7f7f7

### Forms/Inputs
- **Background**: Transparent or slightly lighter than #002c2b
- **Border**: Subtle #f7f7f7 borders (border-2)
- **Focus State**: Border color shifts to #b6ff00
- **Placeholder**: #f7f7f7 with reduced opacity
- **Labels**: #f7f7f7, weight 500

### Navigation
- **Mobile Bottom Bar**: 
  - Fixed bottom position
  - 4-5 icons max (Home, Workouts, Schedule, Profile)
  - Active state: #b6ff00, inactive: #f7f7f7
  - Outline icons, monochromatic
  
- **Desktop Sidebar**:
  - Fixed left, dark background (#002c2b)
  - Vertical menu items with #f7f7f7 text
  - Active state highlighted with #b6ff00
  - Logo/brand at top

### Icons
- **Style**: Simple, outline, monochromatic
- **Library**: Use Heroicons or similar clean icon set
- **Colors**: #f7f7f7 default, #b6ff00 for active/highlighted states
- **Size**: Generous (24px-32px) for touch targets on mobile

---

## Specific Screen Guidelines

### 1. Landing Page
- **Hero Section**: 
  - Dark background (#002c2b)
  - Large title in #b6ff00 with strong typography
  - Subtitle in #f7f7f7
  - Primary CTA button (neon #b6ff00)
  - Minimal, clean composition with ample negative space
- **Feature Sections**: Cards explaining Personal → Student → Marketplace flow
- **Overall**: Premium, intimate feel with high contrast

### 2. Login/Register
- **Dark minimal screen** with centered form
- Inputs with subtle #f7f7f7 borders
- Primary button in #b6ff00
- Toggle between login/register modes
- User type selection (Personal/Student) clearly displayed

### 3. Personal Dashboard
- **Stats Cards**: Total students, upcoming appointments, active workouts
- Card backgrounds: #002c2b, text: #f7f7f7, accents: #b6ff00
- **Quick Actions**: Neon buttons for key functions (Manage Workouts, Manage Students, View Schedule)
- Desktop: Grid layout, Mobile: Stacked cards

### 4. Student Dashboard
- **Active Workouts List**: Cards with workout name, status, progress
- **Workout Details**: Exercise cards with video thumbnail, sets, reps, weight, time
- **"Mark Complete" button**: Prominent #b6ff00 CTA
- **Feedback section**: Text area for student comments

### 5. Marketplace
- **Personal Cards**:
  - Photo placeholder
  - Name in bold (#f7f7f7 or #b6ff00)
  - Star ratings, location, specialties
  - Student count
  - Clean, minimal card design
- **Filters**: Neon-accented filter buttons (#b6ff00)
- Desktop: 2-3 column grid, Mobile: Single column list

### 6. Schedule/Appointments
- **Calendar**: Stylized with #002c2b base
- **Time Slots**: Clear visual distinction:
  - Available: #b6ff00 accent
  - Reserved: #f7f7f7 with opacity
  - Completed: Muted
- **Booking CTA**: Neon button

### 7. Workout Screens
- **Exercise Cards**: Large, clear layout
  - Video thumbnail (if available)
  - Exercise name (bold, #f7f7f7)
  - Technical data: Sets, reps, weight, time (#f7f7f7 smaller text)
  - Observations section
- **Completion Button**: Full-width neon CTA at bottom

---

## Animations & Microinteractions

### Button Interactions
- **Hover**: Subtle brightness increase on #b6ff00 buttons (glow effect)
- **Active/Click**: Slight scale down (scale-95) for tactile feedback
- **NO complex hover states** - keep minimal

### Card Animations
- **Load**: Fade-in entrance (duration-300)
- **Transition**: Smooth when changing content (fade between states)

### Navigation
- **Tab Switch**: Minimal motion, simple fade or slide
- **Page Transitions**: Quick fade (duration-200)

### Overall Philosophy
- Moderate, purposeful animations
- Never distracting
- Enhance premium feel without being flashy
- Prioritize smooth, polished micro-moments

---

## Images

### Hero Image
- **Landing Page Hero**: Use abstract fitness/training imagery with dark tones that complement #002c2b
- Apply overlay to ensure text readability
- Keep image minimal and supportive, not overwhelming

### Profile/Marketplace Photos
- **Personal Profile Photos**: Circular or rounded-lg avatars
- Placeholder: Simple icon or gradient in #002c2b with #b6ff00 accent

### Workout Videos
- **Exercise Thumbnails**: Video preview images where applicable
- Maintain aspect ratio, use rounded corners (rounded-lg)

---

## Accessibility & UX Principles

- **Touch Targets**: Minimum 44px on mobile (buttons, icons)
- **Contrast**: Always maintain strong contrast between #002c2b and #b6ff00/#f7f7f7
- **Text Readability**: Ensure #f7f7f7 text on #002c2b is always readable
- **Navigation**: Maximum 2 clicks to reach any feature
- **Gym-Friendly UX**: Large, clear components for users on-the-go, tired, or in motion
- **Loading States**: Subtle spinners or skeleton screens in #b6ff00

---

## Final Design Philosophy

Create an **intimate, sophisticated, premium dark experience** with strategic neon energy. Every element should feel intentional, refined, and effortlessly modern. The contrast between deep petrol green and vibrant neon creates a unique, memorable identity that stands out in the fitness app space.