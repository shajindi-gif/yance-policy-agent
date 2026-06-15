# Background Music Prompts — YanCe Policy Agent

Background music generation prompts for Suno / Udio, one for each video.
Style direction: modern, professional, tech-forward, optimistic.
Exclusions: no aggressive beats, no heavy bass drops, no vocal tracks, no dark/melancholic tones.

---

## Music Track 1 — 30-Second Elevator Pitch

**Video:** "30秒了解衍策政策Agent"
**Duration:** 30 seconds (loop-friendly)
**Tempo:** 110-120 BPM
**Mood:** Energetic, clean, modern corporate

### Suno / Udio Prompt
```
Modern corporate tech background music, 30 seconds, 115 BPM. Clean electronic production
with soft synth pads, gentle arpeggiated patterns, and a light, driving beat. Bright and
optimistic mood. Instruments: soft analog synth, light electronic drums, subtle piano
melody, warm bass. Structure: quick 4-bar intro with synth pad swell, 16-bar main section
with arpeggio and beat, 4-bar outro with fade. No vocals. No heavy bass drops. Professional,
clean, suitable for a tech product demo video. Think: Apple keynote background music meets
modern SaaS product video. Key: C major or G major.
```

### Alternative Prompt (more minimal)
```
Minimal tech corporate music, 30 seconds, 110 BPM. Soft marimba-like plucked synth notes
in a repeating pattern, warm sub-bass, light brushed electronic percussion. Clean, modern,
professional. No vocals. Suitable for a short product explainer video. Bright, optimistic,
forward-moving. Think: Notion or Linear product launch music. Key: D major.
```

### Technical Notes
- **Loudness:** -14 LUFS (streaming standard)
- **Dynamic Range:** Moderate compression, consistent energy level
- **Fade:** 2-second fade-out at end
- **Loop Point:** Bars 4-20 should loop cleanly

---

## Music Track 2 — 60-Second Product Walkthrough

**Video:** "衍策政策Agent产品演示"
**Duration:** 60 seconds
**Tempo:** 100-110 BPM
**Mood:** Focused, intelligent, confident

### Suno / Udio Prompt
```
Modern intelligent tech background music, 60 seconds, 105 BPM. Clean electronic production
with evolving layers. Starts with soft ambient synth pads and gentle piano notes (intro,
8 bars). Builds with a light electronic beat, arpeggiated synth patterns, and warm bass
(main section, 24 bars). Adds a subtle string-like pad for emotional depth (climax, 16 bars).
Resolves to a calm outro with piano and pad fade (8 bars). No vocals. Professional, focused,
confident mood. Think: documentary about technology innovation. Instruments: analog synth,
electric piano, light electronic drums, warm bass, subtle string pad. Key: A minor to
C major (modulates for optimism). No aggressive elements.
```

### Alternative Prompt (more ambient)
```
Ambient tech background music, 60 seconds, 100 BPM. Ethereal synth pads with slow evolution,
gentle plucked guitar-like synths, very light electronic percussion entering at bar 9.
Building layers of subtle arpeggios and warm textures. Professional, intelligent, calm.
No vocals. Suitable for a product walkthrough or demo video. Think: Vercel or Stripe
product page background music. Gradual build from minimal to full, then gentle resolution.
Key: E major.
```

### Technical Notes
- **Loudness:** -14 LUFS
- **Dynamic Range:** Wider than Track 1, allow natural dynamics
- **Build Structure:** Intro (0-8s) → Build (8-32s) → Peak (32-48s) → Resolve (48-60s)
- **Sync Points:** Beat hits at 0:15 (demo start), 0:35 (report reveal), 0:52 (split screen)

---

## Music Track 3 — 90-Second Brand Story

**Video:** "从徐汇出发 — 衍策政策Agent的品牌故事"
**Duration:** 90 seconds
**Tempo:** 90-100 BPM (slower, more cinematic)
**Mood:** Cinematic, hopeful, inspiring, grounded

### Suno / Udio Prompt
```
Cinematic tech brand music, 90 seconds, 95 BPM. Modern orchestral-electronic hybrid.
Opens with solo piano melody over ambient synth pad (intro, 16 bars, emotional and
hopeful). Adds warm strings and gentle electronic beat (build, 16 bars). Full arrangement
with orchestral strings, brass swells, electronic arpeggios, and driving percussion
(main, 24 bars, inspiring and confident). Bridge section strips back to piano and strings
(reflection, 8 bars). Final climax with full arrangement and soaring strings (climax,
16 bars). Gentle outro with piano melody and pad fade (8 bars). No vocals. Cinematic,
hopeful, inspiring. Think: Google or Microsoft brand film music. Key: D major.
Instruments: piano, orchestral strings, french horn, electronic synths, electronic drums,
warm bass.
```

### Alternative Prompt (more electronic)
```
Cinematic electronic brand music, 90 seconds, 92 BPM. Modern electronic production with
orchestral touches. Starts with ethereal vocal-like synth pads and gentle piano chords
(intro). Builds with layered arpeggios, warm analog bass, and cinematic percussion
(build). Peak section features soaring synth leads, orchestral string stabs, and a
driving beat (climax). Emotional breakdown with piano solo (bridge). Final build to
triumphant resolution. No actual vocals. Professional, cinematic, forward-looking.
Think: Apple "Shot on iPhone" campaign music or Tesla brand film. Key: Bb major.
```

### Technical Notes
- **Loudness:** -14 LUFS (allow dynamic range for cinematic feel)
- **Dynamic Range:** Wide, from quiet piano intro to full climax
- **Structure Map:**
  - 0:00-0:16 — Intro (piano + pad, aerial Xuhui)
  - 0:16-0:32 — Build (problem statement, insight)
  - 0:32-0:56 — Main (solution demo, features)
  - 0:56-1:04 — Bridge (traceability, human in loop)
  - 1:04-1:20 — Climax (vision map, impact stats)
  - 1:20-1:30 — Outro (CTA, logo reveal)
- **Emotional Arc:** Curiosity → Understanding → Confidence → Inspiration → Action

---

## General Music Guidelines

### Brand Sound Identity
- **Core Sound:** Clean electronic + warm organic elements
- **Tempo Range:** 90-120 BPM (never frantic, never sluggish)
- **Key Preference:** Major keys for optimism, minor-to-major modulation for storytelling
- **Signature Element:** Soft arpeggiated synth patterns (the "YanCe sound")

### Exclusions
- No aggressive EDM/dubstep elements
- No heavy 808 bass drops
- No vocal tracks or vocal samples
- No dark, melancholic, or ominous tones
- No royalty-at-risk samples (use original generation only)
- No culturally insensitive musical elements

### Technical Specifications
- **Format:** WAV (48kHz, 24-bit) for video, MP3 (320kbps) for web
- **Loudness:** -14 LUFS integrated, -1 dBTP true peak
- **Stems:** Request individual stems (drums, bass, synths, piano) for mixing flexibility
- **License:** Ensure full commercial usage rights for generated tracks
