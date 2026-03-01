import { useMemo } from "react";
import {
  Stack,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import type { MatchingQuestion as MatchingQuestionType } from "../../../../types/data";
import type { UserAnswer } from "../../../../types/storage";
import { shuffle } from "../../../../utils/shuffle";

interface MatchingQuestionProps {
  question: MatchingQuestionType;
  answer: UserAnswer | undefined;
  onAnswer: (answer: UserAnswer) => void;
}

export default function MatchingQuestion({
  question,
  answer,
  onAnswer,
}: Readonly<MatchingQuestionProps>) {
  const selections = answer?.type === "matching" ? answer.selections : {};

  const rightOptions = useMemo(() => {
    const opts = question.rightOptions ?? question.pairs.map((p) => p.right);
    return shuffle([...new Set(opts)]);
  }, [question]);

  const handleSelect = (pairIndex: number, value: string) => {
    onAnswer({
      type: "matching",
      selections: { ...selections, [pairIndex]: value },
    });
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
        {question.emoji} {question.question}
      </Typography>
      {question.pairs.map((pair, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            flexWrap: "wrap",
          }}
        >
          <Box
            sx={{
              minWidth: 120,
              flex: "1 1 120px",
              bgcolor: "#E3F2FD",
              border: "2px solid #90CAF9",
              borderRadius: "12px",
              p: "10px 14px",
              color: "#1565C0",
              fontWeight: 600,
              fontSize: "0.95rem",
              textAlign: "center",
            }}
          >
            {pair.left}
          </Box>
          <Typography sx={{ color: "text.disabled", fontSize: "1.2rem" }}>
            →
          </Typography>
          <FormControl size="small" sx={{ flex: "1 1 200px" }}>
            <Select
              value={selections[index] ?? ""}
              displayEmpty
              onChange={(e) => handleSelect(index, e.target.value)}
              sx={{
                borderRadius: "12px",
                bgcolor: selections[index] ? "#C8E6C9" : "#E8F5E9",
                border: "2px solid",
                borderColor: selections[index] ? "#66BB6A" : "#C8E6C9",
                fontSize: "0.95rem",
                fontWeight: selections[index] ? 600 : 400,
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                "&:hover": { bgcolor: "#C8E6C9" },
                "&.Mui-focused": {
                  borderColor: "#66BB6A",
                  boxShadow: "0 0 0 3px rgba(102,187,106,0.3)",
                },
              }}
            >
              <MenuItem value="" disabled>
                Selecciona...
              </MenuItem>
              {rightOptions.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      ))}
    </Stack>
  );
}
