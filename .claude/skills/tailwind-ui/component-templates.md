# Tailwind UI Component Templates

Ready-to-use templates for common UI patterns in Job-EZ.

## Modal Dialog

```html
<!-- Modal overlay -->
<div id="modal-overlay" class="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 hidden">
  <!-- Modal container -->
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
    <!-- Modal header -->
    <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
      <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100">Modal Title</h2>
      <button id="close-modal" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
        <i class="bi bi-x-lg text-xl text-gray-500 dark:text-gray-400"></i>
      </button>
    </div>

    <!-- Modal body -->
    <div class="p-6 space-y-4">
      <p class="text-gray-600 dark:text-gray-300">Modal content goes here.</p>
    </div>

    <!-- Modal footer -->
    <div class="flex gap-3 p-6 bg-gray-50 dark:bg-gray-900">
      <button class="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-semibold rounded-lg transition-colors">
        Cancel
      </button>
      <button class="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold rounded-lg transition-colors">
        Confirm
      </button>
    </div>
  </div>
</div>
```

```javascript
// Modal controller (ES6 module)
export class ModalManager {
  constructor(modalId) {
    this.modal = document.getElementById(modalId);
    this.overlay = this.modal.querySelector('.fixed');
    this.closeBtn = this.modal.querySelector('[id*="close"]');

    this.closeBtn?.addEventListener('click', () => this.hide());
    this.overlay?.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.hide();
    });
  }

  show() {
    this.modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  hide() {
    this.modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}
```

## Notification/Toast

```html
<div id="toast" class="fixed top-4 right-4 z-50 transform translate-x-full transition-transform duration-300">
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl border-l-4 border-indigo-500 p-4 flex items-start gap-3 max-w-sm">
    <i class="bi bi-check-circle-fill text-2xl text-indigo-500 flex-shrink-0"></i>
    <div class="flex-1">
      <h4 class="font-semibold text-gray-900 dark:text-gray-100">Success!</h4>
      <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">Your action completed successfully.</p>
    </div>
    <button class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
      <i class="bi bi-x text-gray-500"></i>
    </button>
  </div>
</div>
```

```javascript
// Toast notification utility
export function showToast(message, type = 'success', duration = 3000) {
  const toast = document.getElementById('toast');
  const iconMap = {
    success: 'bi-check-circle-fill text-green-500',
    error: 'bi-x-circle-fill text-red-500',
    warning: 'bi-exclamation-triangle-fill text-yellow-500',
    info: 'bi-info-circle-fill text-indigo-500'
  };

  const icon = toast.querySelector('i');
  const text = toast.querySelector('p');

  icon.className = `bi ${iconMap[type]} text-2xl flex-shrink-0`;
  text.textContent = message;

  // Show toast
  toast.classList.remove('translate-x-full');

  // Hide after duration
  setTimeout(() => {
    toast.classList.add('translate-x-full');
  }, duration);
}
```

## Loading Spinner

```html
<!-- Inline spinner -->
<div class="inline-flex items-center gap-2">
  <div class="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
  <span class="text-gray-600 dark:text-gray-300">Loading...</span>
</div>

<!-- Full-page loader -->
<div id="loader" class="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50">
  <div class="text-center space-y-4">
    <div class="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
    <p class="text-gray-600 dark:text-gray-300 font-medium">Loading quiz...</p>
  </div>
</div>
```

## Dropdown Menu

```html
<div class="relative inline-block">
  <!-- Dropdown button -->
  <button id="dropdown-btn" class="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
    <span class="text-gray-900 dark:text-gray-100">Options</span>
    <i class="bi bi-chevron-down text-sm"></i>
  </button>

  <!-- Dropdown menu -->
  <div id="dropdown-menu" class="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 hidden z-10">
    <a href="#" class="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors">
      <i class="bi bi-pencil"></i>
      <span>Edit</span>
    </a>
    <a href="#" class="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors">
      <i class="bi bi-share"></i>
      <span>Share</span>
    </a>
    <hr class="my-2 border-gray-200 dark:border-gray-700">
    <a href="#" class="flex items-center gap-3 px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors">
      <i class="bi bi-trash"></i>
      <span>Delete</span>
    </a>
  </div>
</div>
```

## Progress Bar

```html
<!-- Linear progress -->
<div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
  <div class="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all duration-300" style="width: 75%"></div>
</div>

<!-- Progress with label -->
<div class="space-y-2">
  <div class="flex justify-between text-sm">
    <span class="text-gray-600 dark:text-gray-300">Progress</span>
    <span class="font-semibold text-gray-900 dark:text-gray-100">75%</span>
  </div>
  <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
    <div class="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full transition-all duration-300" style="width: 75%"></div>
  </div>
</div>

<!-- Circular progress (SVG) -->
<div class="relative inline-flex items-center justify-center">
  <svg class="transform -rotate-90 w-32 h-32">
    <!-- Background circle -->
    <circle cx="64" cy="64" r="56" stroke="currentColor" class="text-gray-200 dark:text-gray-700" stroke-width="8" fill="none" />
    <!-- Progress circle -->
    <circle cx="64" cy="64" r="56" stroke="currentColor" class="text-indigo-600 dark:text-indigo-500" stroke-width="8" fill="none"
      stroke-dasharray="352" stroke-dashoffset="88" stroke-linecap="round" />
  </svg>
  <span class="absolute text-2xl font-bold text-gray-900 dark:text-gray-100">75%</span>
</div>
```

## Badge/Pill

```html
<!-- Default badge -->
<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300">
  Badge
</span>

<!-- Badge with icon -->
<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
  <i class="bi bi-check-circle-fill"></i>
  <span>Completed</span>
</span>

<!-- Removable badge -->
<span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
  <span>Tag name</span>
  <button class="hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full p-0.5 transition-colors">
    <i class="bi bi-x text-sm"></i>
  </button>
</span>
```

## Alert/Banner

```html
<!-- Info alert -->
<div class="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4 flex items-start gap-3">
  <i class="bi bi-info-circle-fill text-indigo-600 dark:text-indigo-400 text-xl flex-shrink-0 mt-0.5"></i>
  <div class="flex-1">
    <h4 class="font-semibold text-indigo-900 dark:text-indigo-200">Information</h4>
    <p class="text-sm text-indigo-800 dark:text-indigo-300 mt-1">This is an informational message.</p>
  </div>
  <button class="p-1 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded transition-colors">
    <i class="bi bi-x text-indigo-600 dark:text-indigo-400"></i>
  </button>
</div>

<!-- Error alert -->
<div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
  <i class="bi bi-exclamation-triangle-fill text-red-600 dark:text-red-400 text-xl flex-shrink-0 mt-0.5"></i>
  <div class="flex-1">
    <h4 class="font-semibold text-red-900 dark:text-red-200">Error</h4>
    <p class="text-sm text-red-800 dark:text-red-300 mt-1">Something went wrong. Please try again.</p>
  </div>
</div>
```

## Toggle Switch

```html
<!-- Toggle switch -->
<label class="relative inline-flex items-center cursor-pointer">
  <input type="checkbox" class="sr-only peer">
  <div class="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
  <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-100">Toggle me</span>
</label>
```

## Tabs

```html
<div class="space-y-4">
  <!-- Tab navigation -->
  <div class="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
    <button class="flex-1 px-4 py-2 text-sm font-medium rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm">
      Tab 1
    </button>
    <button class="flex-1 px-4 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
      Tab 2
    </button>
    <button class="flex-1 px-4 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
      Tab 3
    </button>
  </div>

  <!-- Tab content -->
  <div class="p-6 bg-white dark:bg-gray-800 rounded-lg">
    <p class="text-gray-600 dark:text-gray-300">Tab content goes here.</p>
  </div>
</div>
```

## Empty State

```html
<div class="flex flex-col items-center justify-center py-12 px-4 text-center">
  <div class="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
    <i class="bi bi-inbox text-4xl text-gray-400 dark:text-gray-500"></i>
  </div>
  <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No data yet</h3>
  <p class="text-gray-600 dark:text-gray-400 mb-6 max-w-sm">
    Get started by creating your first item.
  </p>
  <button class="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors">
    Create Item
  </button>
</div>
```
