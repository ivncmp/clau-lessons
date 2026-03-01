# Skill: new-lesson-provided

Convert curriculum material (temario images) into structured JSON data files for Clau Lessons.

## When to use

When the user provides temario images (typically PNG scans of textbook pages) for a specific unit and wants to generate the `topic.json` and `exam.json` files.

## Input

The user will point to a directory containing temario images, e.g.:
```
material/{curso-slug}/{subject}/{temario|content}/{topicId}/
```

Example: `material/2-primaria/lengua/temario/005/`

## Process

### Step 1: Read all images

Read every image in the directory to understand the full unit content. Typical temario pages cover:
- **Unit intro** — theme, title, key vocabulary
- **Oral communication** — speaking/listening activities
- **Reading text** — the main narrative or informational text (key for `refText` questions)
- **Comprehension** — questions about the reading
- **Vocabulary** — word families, synonyms, antonyms
- **Orthography** — spelling rules (za/ce/ci/zo/zu, mp/mb, etc.)
- **Grammar** — noun, adjective, verb concepts
- **Writing** — descriptions, letters, stories
- **Review/Portfolio** — summary exercises

### Step 2: Generate topic.json

Path: `public/data/{curso-slug}/{subject}/{topicId}/topic.json`

```json
{
  "id": "{topicId}",
  "subjectId": "{subject}",
  "title": "Unidad {N}",
  "description": "Short description with key topics",
  "icon": "🎯",
  "texts": {
    "{textKey}": {
      "title": "📖 Title of the reading",
      "html": "<p>Full reading text with <span class='hl'>highlighted key words</span>.</p>"
    }
  },
  "images": {}
}
```

Rules for `texts`:
- Transcribe the main reading text faithfully from the images
- Use `<span class='hl'>keyword</span>` to highlight important vocabulary
- Use `<p>` tags for paragraphs, `<br/>` for line breaks within paragraphs
- The key (e.g., "labota") should be a short slug identifying the text
- Multiple texts are allowed if the unit has several readings

### Step 3: Generate exam.json

Path: `public/data/{curso-slug}/{subject}/{topicId}/exam.json`

```json
{
  "topicId": "{topicId}",
  "subjectId": "{subject}",
  "questions": [ ... ]
}
```

Target: **25-30 questions** covering ALL unit topics. Distribute across question types:

#### Question types and JSON format

**choice** — Multiple choice (3-4 options, 0-indexed answer)
```json
{
  "id": "q01", "type": "choice", "emoji": "📖",
  "question": "¿Qué cayó al fondo del mar?",
  "options": ["Un zapato", "Una bota vieja", "Un sombrero"],
  "answer": 1,
  "refText": "labota"
}
```

**true-false** — True or false statement
```json
{
  "id": "q02", "type": "true-false", "emoji": "✅",
  "question": "Los adjetivos describen cualidades de los sustantivos.",
  "answer": true
}
```

**matching** — Match left items to right items. `rightOptions` adds distractors.
```json
{
  "id": "q03", "type": "matching", "emoji": "🔗",
  "question": "Une cada palabra con su familia",
  "pairs": [
    { "left": "mar", "right": "marinero" },
    { "left": "zapato", "right": "zapatero" }
  ],
  "rightOptions": ["marinero", "zapatero", "panadero"]
}
```

**word-bank-classify** — Sort words into labeled slots
```json
{
  "id": "q04", "type": "word-bank-classify", "emoji": "📦",
  "question": "Clasifica estos adjetivos",
  "words": ["bonito", "horrible", "amable", "feo"],
  "slots": [
    { "label": "Positivos", "accepts": ["bonito", "amable"] },
    { "label": "Negativos", "accepts": ["horrible", "feo"] }
  ]
}
```

**word-bank-fill** — Fill blanks in a sentence. `_____` marks each blank. `blanks` are the correct words in order. `wordBank` includes blanks + distractors.
```json
{
  "id": "q05", "type": "word-bank-fill", "emoji": "✏️",
  "question": "Completa con za, ce, ci, zo o zu",
  "sentence": "El _____ato come cere_____as en la pla_____a.",
  "blanks": ["zap", "z", "z"],
  "wordBank": ["zap", "z", "c", "s"]
}
```

**word-bank-order** — Arrange words/syllables to form a word or sentence. `answer` is the concatenation of `words` in correct order.
```json
{
  "id": "q06", "type": "word-bank-order", "emoji": "🧩",
  "question": "Ordena las sílabas para formar una palabra",
  "words": ["ri", "ma", "ne", "ro"],
  "answer": "marinero"
}
```

#### Distribution guidelines
- **6-8** choice questions (comprehension, vocabulary, grammar concepts)
- **4-5** true-false questions (grammar rules, reading comprehension facts)
- **3-4** matching questions (word families, definitions, adjective-noun pairing)
- **3-4** word-bank-classify (positive/negative adjectives, spelling categories, word families)
- **3-4** word-bank-fill (spelling rules, fill-in sentences from reading)
- **3-4** word-bank-order (syllable ordering, sentence construction)

#### Content coverage
Ensure questions cover ALL sections from the temario:
- Reading comprehension (use `refText` to link to the reading)
- Vocabulary / word families
- Orthography / spelling rules
- Grammar concepts (adjective, noun, verb — whatever the unit teaches)
- Writing-related concepts if applicable

#### ID format
Use sequential IDs: `q01`, `q02`, ..., `q25`, etc.

#### Emoji guide
- 📖 Reading comprehension
- 🔤 Vocabulary / word families
- ✏️ Orthography / spelling
- 📝 Grammar
- ✅ True/false
- 🔗 Matching
- 📦 Classify
- 🧩 Word order

### Step 4: Update subject.json

Update `questionCount` in the topic entry at:
`public/data/{curso-slug}/{subject}/subject.json`

Set it to the actual number of questions generated.

### Step 5: Verify

Run `npm run build` to ensure no type errors.

## Important notes

- All user-facing text must be in **Spanish** (Castellano)
- Content must be age-appropriate for the target curso (e.g., 2º Primaria = 7-8 years old)
- Questions should be directly derived from the temario content, not invented
- For `refText` questions, the reading text MUST exist in `topic.json` `texts`
- `explanation` field is optional but encouraged for wrong answers
- `wordBank` in word-bank-fill should include 1-2 distractors beyond the correct blanks
- Keep vocabulary and sentence complexity appropriate for the grade level
