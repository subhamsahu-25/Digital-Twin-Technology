# ⛏ Digital Twins in Mining
### Rock-On-Pap 2026 · NIT Rourkela · Technical Paper Presentation

> A fully interactive, scroll-snapping presentation built with vanilla HTML, CSS, and JavaScript — no frameworks, no dependencies, no build step required.

---

## 📁 Project Structure

```
rock-on-pap/
├── index.html       # All slide markup — 13 slides, config panel, nav UI
├── style.css        # All styles — variables, layout, components, animations
├── script.js        # All logic — slide engine, canvas charts, interactivity
└── README.md        # You are here
```

---

## 🚀 Getting Started

No installation or build process needed. Just open the file.

```bash
# Option 1 — open directly in browser
open index.html

# Option 2 — serve locally (recommended for YouTube iframes)
npx serve .
# or
python -m http.server 8080
```

> **Note:** YouTube embeds require a local server or live URL due to browser iframe policies. The canvas animations and all other features work fine with direct file open.

---

## 🎮 Controls

| Action | Input |
|---|---|
| Next slide | `↓` `→` `Space` or click **↓** button |
| Previous slide | `↑` `←` or click **↑** button |
| Jump to slide | Click any **dot** on the right sidebar |
| Add images | Click **⚙** button (top-left) |
| Add videos | Click **⚙** button → paste YouTube video ID |

---

## 📊 Slide Index

| # | Slide | Key Feature |
|---|---|---|
| 01 | **Title** | Animated particle network canvas |
| 02 | **The Problem** | Animated counters + fatalities bar chart |
| 03 | **What is a Digital Twin?** | Live mine simulation canvas + video embed |
| 04 | **Mining Applications** | 6-pillar hover grid |
| 05 | **Why India Needs This** | Animated progress bars |
| 06 | **4-Layer Framework** | Doughnut chart + particle flow animation |
| 07 | **Key Components** | 6-component detail grid |
| 08 | **Implementation Roadmap** | Phased timeline + animated ROI line chart |
| 09 | **International Case Studies** | 4 cases with animated metric bars + image slots |
| 10 | **Expected Benefits** | Animated radar chart (With DT vs Without) |
| 11 | **Limitations & Challenges** | 6-item limitation grid |
| 12 | **Future Scope** | Staggered reveal list + video embed |
| 13 | **Conclusion** | Takeaways + full reference list |

---

## 🎨 Customisation

### CSS Variables
All colours are defined as CSS custom properties in `style.css`. Change them once to retheme the entire presentation:

```css
:root {
  --amber:      #F59E0B;   /* Primary highlight colour */
  --amber-glow: #FCD34D;   /* Secondary glow colour */
  --bg:         #080808;   /* Slide background */
  --surface:    #141414;   /* Card/panel background */
  --surface2:   #1e1e1e;   /* Input/secondary surface */
  --border:     #252525;   /* Border colour */
  --text:       #E8E0D0;   /* Body text */
  --muted:      #6b6560;   /* Subdued/label text */
  --accent:     #FF6B35;   /* Orange accent */
}
```

### Adding Your Own Images
Click the **⚙ gear icon** (top-left corner) during the presentation to open the Image Config panel. Paste any direct image URL into the relevant slot and click **Apply**.

Alternatively, set images directly in `index.html` by replacing the `src=""` on any `<img>` tag:

```html
<!-- Example: Slide 1 background -->
<img id="bg-s1" src="https://your-image-url.com/mine.jpg" ...>
```

**Suggested searches for images:**
- `"digital twin 3D visualization mine"` → Slide 1 background
- `"Coal India underground mine Jharia"` → Case study 4
- `"BHP Olympic Dam mine"` → Case study 1
- `"Boliden Garpenberg mine Sweden"` → Case study 3

### Adding YouTube Videos
In the ⚙ config panel, paste only the **video ID** (the part after `?v=` in a YouTube URL).

For example, for `https://www.youtube.com/watch?v=dQw4w9WgXcQ`, paste: `dQw4w9WgXcQ`

Or set it directly in `index.html`:
```html
<iframe id="vid-s3" src="https://www.youtube.com/embed/YOUR_VIDEO_ID?rel=0&modestbranding=1" ...>
```

---

## ⚙️ How It Works

### Slide Engine (`script.js`)
The deck uses native CSS `scroll-snap` for slide transitions — no animation library needed. An `IntersectionObserver` watches which slide is in view and fires the appropriate canvas/animation initialiser exactly once per slide.

```
scroll-snap-type: y mandatory  →  CSS handles snapping
IntersectionObserver            →  triggers animations on entry
inited Set                      →  ensures each canvas draws only once
```

### Canvas Charts
All charts are drawn with the **Canvas 2D API** — no Chart.js or other libraries. Each chart animates on first entry using `requestAnimationFrame` with an **ease-out cubic** function:

```js
const ease = 1 - Math.pow(1 - progress, 3);
```

| Canvas ID | Slide | Chart Type |
|---|---|---|
| `c-title` | S1 | Particle network (nodes + connecting lines) |
| `c-fatal` | S2 | Animated bar chart (DGMS fatality data) |
| `c-twin` | S3 | Split-screen mine simulation (physical vs digital) |
| `c-dflow` | S6 | Animated doughnut chart (data volume by layer) |
| `c-roi` | S8 | Dual-line ROI trajectory chart |
| `c-radar` | S10 | Radar/spider chart (With DT vs Without DT) |

### Entry Animations
Slide content fades up on entry using CSS transitions with staggered `transition-delay` values. The `.vis` class is added to the slide by the IntersectionObserver:

```css
.slide.vis .sc > *:nth-child(1) { opacity: 1; transform: none; transition-delay: .08s; }
.slide.vis .sc > *:nth-child(2) { opacity: 1; transform: none; transition-delay: .16s; }
/* ...and so on up to child 7 */
```

---

## 📚 Academic Content

### Core Theory
**Grieves' Product Lifecycle Management Model (2002)** — the foundational Digital Twin concept, consisting of three spaces: Physical, Virtual, and the Data Connection linking them bidirectionally.

### Data Sources
| Statistic | Source |
|---|---|
| Mine fatality data (2016–2022) | DGMS Annual Reports, Govt. of India |
| 90% DT adoption in mining | Bentley Systems Industry Survey, 2024 |
| $48B global DT market | McKinsey Global Institute |
| Ventilation savings (35%) | Codelco El Teniente case, 2022 |
| Radar benchmark data | CSIRO / Gartner Mining Analytics, 2023 |

### Full Reference List
1. Grieves, M. (2014). *Digital Twin: Manufacturing Excellence through Virtual Factory Replication.*
2. DGMS Annual Report (2022). Directorate General of Mines Safety, Government of India.
3. Cai, P. et al. (2021). Digital twin for coal mines: review and prospects. *Journal of Mining & Safety Engineering.*
4. Bentley Systems (2024). *State of Digital Twins in Mining — Annual Industry Survey.*
5. BHP Insights (2025). The role of digital twins and AI in enhancing decision-making. bhp.com
6. National Mineral Policy (2019). Ministry of Mines, Government of India.
7. Coal India Limited Technology Innovation Report (2023). CIL Corporate Affairs.

---

## 🌐 Browser Compatibility

| Browser | Support |
|---|---|
| Chrome 90+ | ✅ Full |
| Firefox 88+ | ✅ Full |
| Edge 90+ | ✅ Full |
| Safari 14+ | ✅ Full |
| Mobile Chrome/Safari | ✅ Responsive (scroll navigation) |

> Keyboard arrow navigation works on desktop only. Touch/swipe scroll works on mobile.

---

## 📝 Notes for Presenters

- **Run from a local server** (`npx serve .`) for the best experience — YouTube iframes load reliably and there are no CORS restrictions.
- **Hide the ⚙ button** before presenting by setting `display:none` on the gear button in `index.html` if you don't want it visible.
- **Pre-add all images** via the config panel before your presentation slot — don't fumble with URLs on stage.
- **Rehearse timing** — each slide is designed for approximately 60–90 seconds of speaking time.
- The **progress bar** at the top and **slide counter** (top-right of each slide) help you track pacing during the Q&A window.

---

## 🏆 Event Details

**Event:** Rock-On-Pap — Technical Paper Presentation  
**Institution:** NIT Rourkela, Department of Mining Engineering  
**Year:** 2026  
**Duration:** 6–8 min presentation + 5 min Q&A  
**Topic:** Digital Twin Technology in Mining — Framework for Indian Underground Mines

---

*Built with vanilla HTML · CSS · JavaScript — zero dependencies.*
