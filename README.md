# 🪸 Reef Riot

> *Remove the systems causing harm, and life can return.*

An interactive web game built at a hackathon where players bring a corrupted reef back to life by removing 3 pollution threats — in under 90 seconds.

---

## 🎮 What It Is

Reef Riot is a single-page interactive experience that makes environmental damage visible, tangible, and reversible. The reef starts dark, polluted, and machine-dominated. Players remove three threats one by one and watch the reef visually restore itself in real time.

**One page. Three threats. One visible restoration loop.**

---

## 🌊 The Three Threats

| Threat | Description |
|--------|-------------|
| 🏭 **Plastic Compactor** | A machine flooding the reef with plastic waste — disrupt it to clear the water |
| 🕸️ **Ghost Net** | Abandoned netting trapping marine life — cut it free |
| ⛏️ **Extraction Drill** | Industrial drilling tearing into the reef floor — shut it down |

Each interaction triggers an immediate visual change: water clears, coral regains color, marine life reappears.

---

## ✨ Features

- Before/after reef transformation with visible state changes after each threat removed
- Progress tracking (1 of 3 → 2 of 3 → 3 of 3 threats removed)
- Full restoration payoff with final impact message
- Completable demo flow in 60–90 seconds
- Ocean-inspired dark-to-bright visual design

---

## 🛠️ Tech Stack

- **Frontend:** React (Vite), JavaScript, CSS
- **Backend:** Python
- **Styling:** Custom CSS with ocean-themed design system

---

## 🎨 Design System

The visual direction moves from corrupted to restored:

| State | Vibe |
|-------|------|
| **Corrupted** | Dark navy, glitch overlay, angular machines, dead coral |
| **Restored** | Bright aqua, soft organic shapes, colorful coral, living reef |

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/chelseanguyenn/Oil-Spill-Detection.git
cd ReefRiot

# Install frontend dependencies
cd reef-riot
npm install
npm run dev

# Run the backend
cd ../backend
pip install -r requirements.txt
python app.py
```

---

## 👥 Team

Built with [@hrishitaa-p](https://github.com/hrishitaa-p) as part of a hackathon.

---

## 💡 The Idea

Pollution systems are easier to ignore when they stay abstract. Reef Riot makes three real threats — plastic waste, ghost nets, and industrial extraction — concrete and interactive. When you remove each one, you see the reef respond. The goal isn't mechanical complexity; it's emotional clarity.

*Simple enough to understand immediately. Clear enough to remember.*
