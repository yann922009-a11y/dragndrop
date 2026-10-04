# PLAN — Game Drag and Drop Lingkunganku

## Product goal
Build a cheerful Indonesian HTML5 learning game for kindergarten children aged 5–6. The core loop is: choose a subtheme → choose any level → hear an object name → drag the object into a natural visual destination → receive gentle feedback.

## Design direction
- Warm, playful learning-room palette: sky blue, leaf green, sunny yellow, coral, and cream.
- Rounded display type (Baloo 2) with readable supporting type (Nunito).
- Generated neighborhood illustration for the cover and a generated celebration character for success.
- UI uses large touch targets, soft shadows, simple shapes, and short delight animations.

## Risk slices
1. **Touch drag-and-drop** — implement pointer events with `elementFromPoint()` drop detection, plus keyboard/click-to-place fallback.
2. **Data-driven 5 × 5 levels** — keep all level content in `client/src/game/data.ts` so each subtheme has five levels and difficulty scales by item count.
3. **Audio feedback** — use browser speech synthesis for object labels, plus lightweight Web Audio beeps; no external audio files required.
4. **Progress persistence** — store completed levels in localStorage while keeping every level freely selectable.

## Verification criteria
- Cover has title and buttons for play, material, and instructions.
- Menu visibly contains all five named subthemes.
- Each subtheme exposes Level 1 through Level 5.
- A level visibly contains object cards and abstract/natural destination zones.
- Click/tap speaks object name; dragging works with pointer/touch and clicking an object then a zone works as fallback.
- Correct placement gives gentle success feedback; wrong placement returns the object with a soft retry message.
- Navigation can return to menu from every screen.
- Completion state exists for a finished level and for all five subthemes.
- Desktop and narrow mobile layouts remain usable.

## Demo verification
The app supports `?demo=1`, which opens the first playable level with a short hint banner so screenshot verification can show the core game board.
