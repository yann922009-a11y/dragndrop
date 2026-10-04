# STRUCTURE — Game Drag and Drop Lingkunganku

```text
client/src/
  App.tsx                 top-level route shell
  pages/Home.tsx          game UI and screen state machine
  game/data.ts            data-driven subthemes, levels, objects, and destinations
  game/interaction.ts     pure drag/drop correctness helpers
  index.css               visual system, layout, responsive states, motion
```

## Ownership
- React owns the screen state machine and accessible UI.
- `game/data.ts` owns all content; UI never hardcodes level-specific rules.
- `game/interaction.ts` contains framework-agnostic matching and progress helpers.
- Pointer events are handled in the page layer because the game is a DOM-first HTML5 drag-and-drop experience and must support touch screens.
- Browser SpeechSynthesis and Web Audio are optional enhancements; the game remains playable when either is unavailable.

## Screen states
`cover → menu → levels → play → level-success → complete`

Utility screens `about` and `instructions` are reachable from the cover and menu and always expose a menu escape route.
