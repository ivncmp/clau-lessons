import type { Slide } from "@/types/data";
import ConceptSlideCard from "./slides/ConceptSlideCard";
import StorySlideCard from "./slides/StorySlideCard";
import ExampleSlideCard from "./slides/ExampleSlideCard";
import SummarySlideCard from "./slides/SummarySlideCard";

interface SlideRendererProps {
  slide: Slide;
}

export default function SlideRenderer({ slide }: Readonly<SlideRendererProps>) {
  switch (slide.type) {
    case "concept":
      return <ConceptSlideCard slide={slide} />;
    case "story":
      return <StorySlideCard slide={slide} />;
    case "example":
      return <ExampleSlideCard slide={slide} />;
    case "summary":
      return <SummarySlideCard slide={slide} />;
  }
}
