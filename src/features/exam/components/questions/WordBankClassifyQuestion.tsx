import { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { Stack, Typography, Chip, Box } from "@mui/material";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import type { WordBankClassifyQuestion as WordBankClassifyType } from "../../../../types/data";
import type { UserAnswer } from "../../../../types/storage";
import { shuffle } from "../../../../utils/shuffle";

interface WordBankClassifyQuestionProps {
  question: WordBankClassifyType;
  answer: UserAnswer | undefined;
  onAnswer: (answer: UserAnswer) => void;
}

/* ── Draggable word chip ── */
interface DraggableWordProps {
  word: string;
  placed?: boolean;
}

function DraggableWord({ word, placed }: Readonly<DraggableWordProps>) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: word,
    disabled: placed,
  });

  return (
    <Box
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      sx={{
        bgcolor: placed ? "#F5F5F5" : "#FFF9C4",
        border: "2px solid",
        borderColor: placed ? "#E0E0E0" : "#FDD835",
        borderRadius: "14px",
        px: 2,
        py: 0.8,
        color: placed ? "#BDBDBD" : "#F57F17",
        fontWeight: 700,
        fontSize: "0.95rem",
        cursor: placed ? "default" : isDragging ? "grabbing" : "grab",
        opacity: placed ? 0.35 : isDragging ? 0.4 : 1,
        userSelect: "none",
        transition: "all 0.2s",
        pointerEvents: placed ? "none" : "auto",
        touchAction: "none",
        "&:hover": placed
          ? {}
          : {
              bgcolor: "#FFF176",
              transform: "scale(1.05)",
            },
      }}
    >
      {word}
    </Box>
  );
}

/* ── Droppable slot zone ── */
interface DroppableSlotProps {
  id: string;
  label: string;
  words: string[];
  onRemove: (word: string) => void;
}

function DroppableSlot({
  id,
  label,
  words,
  onRemove,
}: Readonly<DroppableSlotProps>) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        p: 2,
        borderRadius: "16px",
        border: isOver ? "3px solid #2E86C1" : "2px solid #AED6F1",
        bgcolor: isOver ? "#D6EAF8" : "#F5FBFF",
        transition: "all 0.2s",
        minHeight: 70,
      }}
    >
      <Typography
        variant="subtitle2"
        fontWeight={700}
        sx={{ mb: 1, color: isOver ? "#1B4F72" : "#546E7A" }}
      >
        {label}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 0.5,
          minHeight: 36,
        }}
      >
        {words.map((word) => (
          <Chip
            key={word}
            label={word}
            size="small"
            onDelete={() => onRemove(word)}
            sx={{
              fontSize: "0.9rem",
              fontWeight: 600,
              bgcolor: "#C8E6C9",
              color: "#2E7D32",
              "& .MuiChip-deleteIcon": {
                color: "#558B2F",
                "&:hover": { color: "#D32F2F" },
              },
            }}
          />
        ))}
        {words.length === 0 && (
          <Typography
            variant="caption"
            sx={{ color: "#B0BEC5", fontStyle: "italic" }}
          >
            {isOver ? "Suelta aquí..." : "Arrastra palabras aquí"}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

/* ── Main component ── */
export default function WordBankClassifyQuestion({
  question,
  answer,
  onAnswer,
}: Readonly<WordBankClassifyQuestionProps>) {
  const placements =
    answer?.type === "word-bank-classify" ? answer.placements : {};
  const [activeWord, setActiveWord] = useState<string | null>(null);

  const shuffledWords = useMemo(() => shuffle(question.words), [question]);
  const placedWords = new Set(Object.values(placements).flat());

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveWord(event.active.id as string);
    document.body.classList.add("dragging");
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveWord(null);
    document.body.classList.remove("dragging");
    const { active, over } = event;
    if (!over) return;

    const word = active.id as string;
    const slotId = over.id as string;
    const slotIndex = parseInt(slotId.replace("slot-", ""), 10);
    if (isNaN(slotIndex)) return;

    const current = placements[slotIndex] ?? [];
    if (current.includes(word)) return;

    const newPlacements = {
      ...placements,
      [slotIndex]: [...current, word],
    };
    onAnswer({ type: "word-bank-classify", placements: newPlacements });
  };

  const handleRemoveWord = (slotIndex: number, word: string) => {
    const current = placements[slotIndex] ?? [];
    const newPlacements = {
      ...placements,
      [slotIndex]: current.filter((w) => w !== word),
    };
    onAnswer({ type: "word-bank-classify", placements: newPlacements });
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => {
        setActiveWord(null);
        document.body.classList.remove("dragging");
      }}
    >
      <Stack spacing={2}>
        <Typography variant="h6" fontWeight={600}>
          {question.emoji} {question.question}
        </Typography>
        <Typography variant="body2" sx={{ color: "#78909C" }}>
          Arrastra cada palabra a su categoría
        </Typography>

        {/* Word bank */}
        <Box
          sx={{
            p: 2,
            bgcolor: "white",
            border: "2px solid #E0E0E0",
            borderRadius: "16px",
          }}
        >
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {shuffledWords.map((word) => (
              <DraggableWord
                key={word}
                word={word}
                placed={placedWords.has(word)}
              />
            ))}
          </Box>
        </Box>

        {/* Slots */}
        {question.slots.map((slot, index) => (
          <DroppableSlot
            key={index}
            id={`slot-${index}`}
            label={slot.label}
            words={placements[index] ?? []}
            onRemove={(word) => handleRemoveWord(index, word)}
          />
        ))}
      </Stack>

      {/* Drag overlay — portal to body to avoid transform offset issues */}
      {createPortal(
        <DragOverlay dropAnimation={null}>
          {activeWord ? (
            <Box
              sx={{
                bgcolor: "#FFF9C4",
                border: "2px solid #FDD835",
                borderRadius: "14px",
                px: 2,
                py: 0.8,
                color: "#F57F17",
                fontWeight: 700,
                fontSize: "0.95rem",
                boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                transform: "scale(1.1)",
              }}
            >
              {activeWord}
            </Box>
          ) : null}
        </DragOverlay>,
        document.body,
      )}
    </DndContext>
  );
}
