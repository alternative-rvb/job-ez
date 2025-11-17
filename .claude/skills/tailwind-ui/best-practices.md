# Tailwind CSS Best Practices & Anti-Patterns

## Golden Rules

### 1. Utility-First, Always
Use Tailwind utilities instead of custom CSS whenever possible.

**Good:**
```html
<div class="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
```

**Bad:**
```html
<div class="custom-container" style="display: flex; padding: 1rem;">
```

### 2. Responsive by Default
Always design mobile-first and add responsive variants.

**Good:**
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
```

**Bad:**
```html
<div class="grid grid-cols-4 gap-4"> <!-- Breaks on mobile -->
```

### 3. Dark Mode is Not Optional
Every component MUST include dark mode variants.

**Good:**
```html
<div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
```

**Bad:**
```html
<div class="bg-white text-gray-900"> <!-- No dark mode -->
```

### 4. Consistent Spacing
Use Tailwind's spacing scale, don't use arbitrary values unless absolutely necessary.

**Good:**
```html
<div class="p-6 space-y-4 gap-3">
```

**Bad:**
```html
<div class="p-[23px]"> <!-- Arbitrary values break consistency -->
```

## Common Anti-Patterns

### ❌ Anti-Pattern: Inline Styles

**Wrong:**
```html
<div style="margin-top: 20px; color: blue;">
```

**Right:**
```html
<div class="mt-5 text-blue-600 dark:text-blue-400">
```

### ❌ Anti-Pattern: Mixing Custom CSS with Tailwind

**Wrong:**
```css
.my-button {
  background-color: blue;
  padding: 10px 20px;
}
```

**Right:**
```html
<button class="bg-blue-600 px-5 py-2.5">
```

### ❌ Anti-Pattern: Hardcoded Colors

**Wrong:**
```html
<div class="bg-[#3B82F6]"> <!-- Hardcoded hex color -->
```

**Right:**
```html
<div class="bg-blue-500"> <!-- Use Tailwind palette -->
```

### ❌ Anti-Pattern: Missing Interactive States

**Wrong:**
```html
<button class="bg-indigo-600 text-white rounded-lg px-4 py-2">
  Click me
</button>
```

**Right:**
```html
<button class="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-white rounded-lg px-4 py-2 transition-colors">
  Click me
</button>
```

### ❌ Anti-Pattern: Poor Accessibility

**Wrong:**
```html
<div class="cursor-pointer" onclick="doSomething()">Click me</div>
```

**Right:**
```html
<button class="cursor-pointer" aria-label="Perform action">Click me</button>
```

### ❌ Anti-Pattern: Not Using Space Utilities

**Wrong:**
```html
<div>
  <p class="mb-4">First</p>
  <p class="mb-4">Second</p>
  <p class="mb-4">Third</p>
</div>
```

**Right:**
```html
<div class="space-y-4">
  <p>First</p>
  <p>Second</p>
  <p>Third</p>
</div>
```

## Optimization Techniques

### 1. Use Flexbox and Grid Smartly

**Flexbox for One-Dimensional Layouts:**
```html
<!-- Horizontal navigation -->
<nav class="flex items-center gap-4">
  <a href="#">Link 1</a>
  <a href="#">Link 2</a>
</nav>

<!-- Vertical stack -->
<div class="flex flex-col gap-3">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

**Grid for Two-Dimensional Layouts:**
```html
<!-- Responsive card grid -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
</div>
```

### 2. Leverage Transition Utilities

Add smooth transitions for better UX:
```html
<button class="bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200">
  Button
</button>

<div class="opacity-0 hover:opacity-100 transition-opacity duration-300">
  Appears on hover
</div>

<div class="transform scale-100 hover:scale-105 transition-transform duration-200">
  Grows on hover
</div>
```

### 3. Group Related Utilities

Keep classes organized and readable:
```html
<!-- Layout -->
<div class="flex items-center justify-between">
  <!-- Spacing -->
  <div class="p-4 m-2 space-y-3">
    <!-- Colors & Typography -->
    <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
      <!-- Borders & Effects -->
      <span class="border-b-2 border-indigo-500 shadow-sm">
        Title
      </span>
    </h1>
  </div>
</div>
```

### 4. Extract Repeated Patterns

If you're repeating the same class combination:

**Before:**
```html
<button class="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
  Button 1
</button>
<button class="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
  Button 2
</button>
```

**After:**
Create a reusable component or JavaScript function that generates the HTML.

### 5. Use Appropriate Semantic HTML

**Good:**
```html
<nav class="flex gap-4">
  <a href="#" class="hover:text-indigo-600">Link</a>
</nav>

<main class="container mx-auto">
  <article class="prose dark:prose-invert">
    <h1>Title</h1>
    <p>Content</p>
  </article>
</main>
```

**Bad:**
```html
<div class="flex gap-4">
  <div onclick="navigate()">Link</div> <!-- Not semantic -->
</div>
```

## Performance Tips

### 1. Minimize Class Bloat

Don't add classes you don't need:
```html
<!-- Too many unnecessary classes -->
<div class="block relative static inline-block"> <!-- Conflicting utilities -->

<!-- Clean and minimal -->
<div class="relative">
```

### 2. Use Container Queries When Appropriate

For components that need to respond to their container size:
```html
<div class="@container">
  <div class="@sm:flex @md:grid">
    <!-- Responds to container, not viewport -->
  </div>
</div>
```

### 3. Prefer Transform Over Position

Transforms are GPU-accelerated:
```html
<!-- Better performance -->
<div class="transform translate-x-4 translate-y-2">

<!-- Slower -->
<div style="position: relative; left: 1rem; top: 0.5rem;">
```

## Accessibility Best Practices

### Focus States

Always include visible focus states:
```html
<button class="focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900">
  Accessible Button
</button>
```

### Color Contrast

Ensure sufficient contrast for text:
```html
<!-- Good contrast -->
<p class="text-gray-900 dark:text-gray-100">High contrast text</p>

<!-- Poor contrast - avoid -->
<p class="text-gray-400 dark:text-gray-500">Low contrast text</p>
```

### Screen Reader Support

Use sr-only for screen reader text:
```html
<button>
  <i class="bi bi-search"></i>
  <span class="sr-only">Search</span>
</button>
```

### ARIA Attributes

Add appropriate ARIA attributes:
```html
<button aria-label="Close dialog" aria-expanded="false">
  <i class="bi bi-x"></i>
</button>

<div role="alert" aria-live="polite">
  Notification message
</div>
```

## Dark Mode Patterns

### Always Pair Light and Dark

Every light color should have a dark equivalent:
```html
<div class="bg-white dark:bg-gray-800
            text-gray-900 dark:text-gray-100
            border-gray-200 dark:border-gray-700
            shadow-lg dark:shadow-gray-900/50">
```

### Use Semantic Dark Colors

Don't just invert colors—choose appropriate dark mode colors:
```html
<!-- Good dark mode design -->
<div class="bg-gray-50 dark:bg-gray-900"> <!-- Light gray to dark gray -->
<div class="bg-indigo-100 dark:bg-indigo-900/30"> <!-- Tinted backgrounds -->

<!-- Poor dark mode -->
<div class="bg-white dark:bg-black"> <!-- Too harsh contrast -->
```

## Animation Best Practices

### Respect User Preferences

Use motion-safe and motion-reduce:
```html
<div class="motion-safe:animate-bounce motion-reduce:animate-none">
```

### Keep Animations Subtle

```html
<!-- Subtle hover effect -->
<div class="hover:shadow-lg transition-shadow duration-300">

<!-- Too aggressive -->
<div class="hover:rotate-180 hover:scale-150"> <!-- Avoid this -->
```

### Use Appropriate Timing

```html
<!-- Quick interactions -->
<button class="hover:bg-gray-100 transition-colors duration-150">

<!-- Smooth transitions -->
<div class="transition-all duration-300 ease-in-out">

<!-- Longer animations -->
<div class="animate-pulse"> <!-- Built-in animation -->
```

## Testing Checklist

Before considering a component complete:

- [ ] Works on mobile (< 640px)
- [ ] Works on tablet (640px - 1024px)
- [ ] Works on desktop (> 1024px)
- [ ] Dark mode looks good
- [ ] All interactive elements have hover states
- [ ] All interactive elements have focus states
- [ ] Touch targets are at least 44x44px
- [ ] Text has sufficient contrast (WCAG AA minimum)
- [ ] Works with keyboard navigation
- [ ] Screen reader announces correctly
- [ ] No layout shift on interaction
- [ ] Animations respect prefers-reduced-motion
- [ ] No horizontal scroll on any screen size
- [ ] Loading states are handled
- [ ] Error states are handled

## Quick Reference: Common Patterns

### Centering

```html
<!-- Horizontal center -->
<div class="mx-auto max-w-7xl">

<!-- Vertical center -->
<div class="flex items-center min-h-screen">

<!-- Both -->
<div class="flex items-center justify-center min-h-screen">
```

### Truncating Text

```html
<!-- Single line -->
<p class="truncate">Long text that will be cut off with ellipsis...</p>

<!-- Multiple lines -->
<p class="line-clamp-3">Long text that will be limited to 3 lines...</p>
```

### Aspect Ratios

```html
<!-- 16:9 ratio -->
<div class="aspect-video">
  <img src="..." class="w-full h-full object-cover">
</div>

<!-- Square -->
<div class="aspect-square">
```

### Sticky Elements

```html
<!-- Sticky header -->
<header class="sticky top-0 z-50 bg-white dark:bg-gray-900">

<!-- Sticky sidebar -->
<aside class="sticky top-4">
```
