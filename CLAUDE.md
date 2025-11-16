# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Job-EZ is an interactive quiz application built with vanilla JavaScript ES6 modules and Tailwind CSS. It features a modern dark theme UI, player tracking with localStorage, quiz history, and support for multiple game modes (normal/spoiler).

## Development Commands

### Local Development

```bash
# Start development server with auto-generated index (recommended)
npm run dev

# Build the project (generates quiz index)
npm run build

# Generate quiz index manually
npm run generate-index
# or directly:
python3 api.py generate-index
```

### Testing the Application

- Start a local server: `python3 -m http.server 8000` or `npm run dev`
- Navigate to `http://localhost:8000`
- The app uses ES6 modules, so it MUST run through a server (not file://)

## Architecture Overview

### Module Structure (ES6 Modules)

The application follows a clean modular architecture with separation of concerns:

```
js/
├── app.js                    # Main entry point, bootstraps QuizApp
├── modules/
│   ├── core/                 # Core functionality
│   │   ├── config.js        # Global configuration (singleton AppConfig class)
│   │   ├── state.js         # Centralized state management (QuizState class)
│   │   ├── player.js        # Player data & localStorage persistence
│   │   └── utils.js         # Shared utilities (confetti, JSON loading, array shuffle)
│   ├── ui/
│   │   └── dom.js           # DOM manipulation (DOMManager class)
│   └── managers/            # Business logic managers
│       ├── quiz-selector.js  # Quiz selection and filtering
│       ├── question-manager.js # Question display and timer logic
│       ├── results-manager.js  # Results display and navigation
│       └── history-manager.js  # Player history tracking
└── data/                    # Quiz JSON files
    ├── index.json           # Auto-generated quiz index
    └── *.json               # Individual quiz files
```

### Key Design Patterns

**Singleton Pattern**: Core modules (`config.js`, `state.js`, `player.js`, `domManager`) export singleton instances for global state.

**Manager Pattern**: Business logic is encapsulated in manager classes that handle specific concerns (quiz selection, questions, results, history).

**State Centralization**: All quiz state is managed through `quizState` in `state.js`. This includes current question index, score, timer state, user answers, and timing data.

**Event-Driven Architecture**: The main `QuizApp` class coordinates managers through callback functions passed to constructors.

### Data Flow

1. **App Initialization** (`app.js`):
   - Check if player name exists in localStorage
   - Show player name screen OR quiz selection
   - Initialize all manager instances

2. **Quiz Selection** (`quiz-selector.js`):
   - Load quiz list from `index.json` (auto-generated)
   - Apply category filters based on `CONFIG.categoryFilter`
   - Render quiz cards with dynamic metadata
   - Callback to `app.startQuiz()` on selection

3. **Quiz Execution** (`question-manager.js`):
   - Load quiz data from JSON file
   - Shuffle questions (via `utils.shuffleArray()`)
   - Initialize `quizState` with quiz data
   - Display questions one by one with timer
   - Handle answer submission and validation
   - Record answers and correctness in state

4. **Results Display** (`results-manager.js`):
   - Calculate final score from `quizState`
   - Save result to `playerManager` (persisted to localStorage)
   - Show animated SVG progress circle
   - Display personalized messages and confetti

5. **Player Persistence** (`player.js`):
   - Store player name in localStorage
   - Track all quiz results with metadata (score, time, date, category)
   - Provide statistics (average score, best/worst, total time)

## Quiz Data Structure

### Auto-Generated Index (`js/data/index.json`)

The `api.py` script scans `js/data/` and generates this index:

```json
{
  "quizzes": ["quiz-id-1", "quiz-id-2"],
  "categories": ["Développement", "Divertissement"],
  "count": 11,
  "lastUpdated": "ISO-8601-timestamp",
  "generated_by": "api.py"
}
```

### Quiz File Format (`js/data/*.json`)

```json
{
  "config": {
    "title": "Quiz Title",
    "description": "Quiz description",
    "spoilerMode": true,
    "difficulty": "Facile|Moyen|Difficile",
    "questionCount": 20,
    "icon": "bi-icon-name",
    "color": "from-color-to-color",
    "category": "Catégorie"
  },
  "questions": [
    {
      "id": 1,
      "question": "Question text?",
      "choices": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A",
      "imageUrl": "https://example.com/image.jpg"
    }
  ]
}
```

## Important Implementation Details

### Configuration System

The `CONFIG` object in `config.js` is a singleton class instance that:

- Detects if running in `/private/` path (different category filtering)
- Manages global settings: `timeLimit`, `freeMode`, `categoryFilter`, `showResponse`
- Can be updated at runtime (e.g., when user selects different time limit)

### State Management

The `quizState` object in `state.js` manages:

- Current quiz and questions array
- Current question index and score
- Timer state (`timeRemaining`, `timerInterval`)
- User answers tracking (`userAnswers`, `userAnswersCorrect`)
- Timing data for analytics (`questionStartTime`, `totalTime`)

**Important**: Always call `quizState.reset()` before starting a new quiz to clear previous state.

### Player System

The `playerManager` in `player.js`:

- Requires player name before showing quizzes
- Persists all results to localStorage as `playerResults`
- Each result includes: quizId, score, percentage, timeSpent, date, difficulty, category
- Provides `getStats()` for aggregated analytics

### Adding New Quizzes

1. Create a JSON file in `js/data/` following the format above
2. Run `npm run generate-index` to update `index.json`
3. The quiz automatically appears in the UI (no code changes needed)

**Vercel Deployment**: The `vercel.json` buildCommand should run `python3 api.py generate-index` to ensure index is current.

### Free Mode vs Normal Mode

- **Normal Mode**: Questions show answer buttons, user clicks to select
- **Free Mode**: Answer buttons hidden, correct answer revealed when timer expires
- Toggled via game mode selector, stored in `CONFIG.freeMode`
- CSS class `.free-mode` on body controls visibility

### Spoiler Mode

Quiz-specific setting (`config.spoilerMode` in quiz JSON):

- Blurs question images
- Shows eye-slash icon overlay
- Image revealed when answer is selected or time expires

## Technologies & Dependencies

### Frontend Stack

- **Vanilla JavaScript ES6+** (modules, classes, async/await)
- **Tailwind CSS v3** (via CDN, dark mode enabled)
- **Bootstrap Icons** (via CDN)
- **tsparticles-confetti** (loaded dynamically in utils.js)

### Browser APIs Used

- **localStorage**: Player name and results persistence
- **Vibration API**: Haptic feedback on mobile (wrong answers)
- **ES6 Modules**: Native import/export (requires HTTP server)

### Python Tools

- **api.py**: Quiz index generator using Python 3 stdlib (json, os, sys, datetime)

## Code Conventions

### File Organization

- One class per file in managers
- Core modules export singleton instances
- Import paths use relative paths with `.js` extension

### Naming Conventions

- Classes: PascalCase (`QuizApp`, `QuestionManager`)
- Singleton instances: camelCase (`quizState`, `playerManager`, `domManager`)
- Constants: UPPER_CASE in CONFIG object
- CSS classes: Tailwind utility classes + kebab-case for custom classes

### Manager Constructor Pattern

Managers receive callback functions in constructor:

```javascript
new QuestionManager(() => this.showResults())
new ResultsManager(
  () => this.restartQuiz(),
  () => this.backToHome()
)
```

## Common Development Tasks

### Modifying Time Limit Options

Edit the time option buttons in [index.html](index.html) and the `CONFIG.timeLimit` default in [js/modules/core/config.js](js/modules/core/config.js).

### Adding New Question Types

Modify [js/modules/managers/question-manager.js](js/modules/managers/question-manager.js) `showQuestion()` method to handle new question structures.

### Changing Category Filtering

Update `CONFIG.categoryFilter` in [js/modules/core/config.js](js/modules/core/config.js). Set to `null` for all categories, or array like `['Coaching']` to filter.

### Customizing Result Messages

Edit the message logic in [js/modules/managers/results-manager.js](js/modules/managers/results-manager.js) `show()` method.

## Deployment Notes

### Vercel

The project is configured for Vercel deployment via [vercel.json](vercel.json). Ensure the buildCommand generates the quiz index:

```json
{
  "buildCommand": "python3 api.py generate-index",
  "outputDirectory": "."
}
```

### Local Serving

Always use a local HTTP server due to ES6 module CORS restrictions. Python's `http.server` is recommended for simplicity.
