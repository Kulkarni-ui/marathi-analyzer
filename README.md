# Marathi Literature Analyzer — मराठी साहित्य विश्लेषक

> AI-powered deep reading of Marathi proverbs, ovis & sentences — literary analysis, cross-language echoes & geographic origins across Maharashtra.
---

**Live Demo → [marathi-analyzer-c1rycifhz.vercel.app](https://marathi-analyzer-c1rycifhz.vercel.app)**

---

---

## Features

### Literary Analysis
- **Meaning** — deep contextual interpretation
- **Literal Meaning** — word-for-word breakdown
- **Literary Type** — proverb / ovi / metaphor / idiom
- **Philosophical Insight** — the wisdom behind the words
- **Cultural Importance** — role in Marathi society
- **Moral Lesson** — the takeaway message
- **Linguistic Richness Score** — lexical diversity index

### Cross-Language Echo
Finds equivalent proverbs in **4 languages**:
- Hindi
- Tamil
- English
- Swahili

Each with translation and similarity classification (near-identical / thematic / conceptual).

### Geography of Wisdom
- Interactive **SVG map of Maharashtra** with all 34+ districts
- Highlights the **primary origin district** with animated pulse
- Shows **regional variants** and cultural context per district

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React + Vite |
| **AI Model** | LLaMA 3.3 70B Versatile (Meta) |
| **AI Provider** | Groq (free, ultra-fast inference) |
| **Styling** | Inline CSS — no external UI library |
| **Deployment** | Vercel |

---

## Run Locally

### Prerequisites
- Node.js v18+
- Free Groq API key from [console.groq.com](https://console.groq.com)

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/Kulkarni-ui/marathi-analyzer.git
cd marathi-analyzer

# 2. Install dependencies
npm install

# 3. Add your API key
echo "VITE_GROQ_API_KEY=your_key_here" > .env

# 4. Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) 

---

## Project Structure

```
marathi-analyzer/
├── index.html          # Vite entry point
├── .env                # API key (never commit this!)
├── .gitignore
├── package.json
└── src/
    ├── App.jsx         # Main component (all logic + UI)
    ├── main.jsx        # React entry point
    └── index.css       # Global reset styles
```
---

## 📸 Screenshots

> <img width="701" height="909" alt="image" src="https://github.com/user-attachments/assets/1a386c8e-0f12-4ebe-af74-d19aa18164ed" />


| Input | Literary Analysis | Geography |
|---|---|---|
| Type any म्हण or ओवी | 7-field breakdown | Interactive Maharashtra map |

---

## Sample Proverbs to Try

```
आंधळा मागतो एक डोळा, देव देतो दोन
जसा राजा तशी प्रजा
नाव मोठे लक्षण खोटे
दगडावर डोके आपटण्यापेक्षा दगड सरकवा
```

---

## 📄 License

MIT License — free to use, modify and distribute.

---

<div align="center">
  <p>Made with ❤️ for Marathi literature</p>
  <p><strong>◆ MARATHI LITERARY INTELLIGENCE</strong></p>
</div>
