import { useReducer, useCallback } from "react";
import type { Slide } from "@/types/data";

// ─── State ─────────────────────────────────────────────────────

interface SlidesState {
  slides: Slide[];
  currentIndex: number;
}

// ─── Actions ───────────────────────────────────────────────────

type SlidesAction =
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "GO_TO"; index: number };

// ─── Reducer ───────────────────────────────────────────────────

function slidesReducer(state: SlidesState, action: SlidesAction): SlidesState {
  switch (action.type) {
    case "NEXT":
      return {
        ...state,
        currentIndex: Math.min(state.currentIndex + 1, state.slides.length - 1),
      };

    case "PREV":
      return {
        ...state,
        currentIndex: Math.max(state.currentIndex - 1, 0),
      };

    case "GO_TO":
      return {
        ...state,
        currentIndex: Math.max(
          0,
          Math.min(action.index, state.slides.length - 1),
        ),
      };
  }
}

// ─── Hook ──────────────────────────────────────────────────────

export function useSlides(slides: Slide[]) {
  const [state, dispatch] = useReducer(slidesReducer, {
    slides,
    currentIndex: 0,
  });

  const currentSlide = state.slides[state.currentIndex];
  const totalSlides = state.slides.length;
  const isFirst = state.currentIndex === 0;
  const isLast = state.currentIndex === totalSlides - 1;

  const next = useCallback(() => dispatch({ type: "NEXT" }), []);
  const prev = useCallback(() => dispatch({ type: "PREV" }), []);
  const goTo = useCallback(
    (index: number) => dispatch({ type: "GO_TO", index }),
    [],
  );

  return {
    ...state,
    currentSlide,
    totalSlides,
    isFirst,
    isLast,
    next,
    prev,
    goTo,
  };
}
