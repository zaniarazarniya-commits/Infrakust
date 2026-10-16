# Formad-caset på infrakust.se: byggplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** En casesida `/case/formad` på infrakust.se som berättar hur Formad byggdes, med riktigt material (bilder, klipp, 3D-staty), plus länkar från startsidan och App-utveckling.

**Architecture:** En ny lazy route `CaseFormad.tsx` byggd som `CaseGrandHotel.tsx`: en sida, sektion för sektion, med tre små återanvändbara komponenter (bildremsa, klipprutnät, 3D-visare) i `src/components/formad/`. Allt material kopieras in under `public/formad/` av ett skript som dokumenterar källorna. SEO-komponenten och prerenderingen får `og:image` per sida. Kontrollen är ett `node:test`-skript som läser `dist/` efter bygget.

**Tech Stack:** React 19, Vite 7, TypeScript, Tailwind 3, react-router 7, three (ny), gltfpack (finns i `C:\Users\zania\dev\scratch-marmor\gltfpack`), ffmpeg 9 (i PATH), Node 24 (`node:test`).

**Spec:** `docs/superpowers/specs/2026-10-16-formad-case-design.md`

## Global Constraints

- Repot: `C:\Users\zania\dev\Infrakust`, branch `formad-case` (finns, innehåller spec-commiten). Alla kommandon körs därifrån.
- Formads repo `C:\Users\zania\dev\skiftrutin` ändras inte. Kör `git -C C:\Users\zania\dev\skiftrutin pull` på `main` först (lokalt står på #358, `origin/main` på #361 med alla 344 klipp).
- Designtokens: `bg-primary #0C0D0E`, `bg-secondary #141516`, `accent-gold #C9A96E`, `font-serif` (DM Serif Display), `font-sans` (Inter), `tracking-section` på guldrader. Återanvänd exakt de klassföljder `CaseGrandHotel.tsx` använder för guldrad, h1/h2, `dl`-faktarad, punktlista med guldstreck och avslut.
- `ScrollReveal` är avanimerad (ren `div`) och används bara för bakåtkompatibilitet; nya sektioner behöver den inte.
- Text på svenska, vi-form, inga tankstreck. Ordet "Hevy" och PED-stödet förekommer inte. Statyns ursprung: "skulpterades med ett AI-verktyg ur referensbilder". Mentorns träning: "AI-agenter som spelade användare", aldrig "intervjuer". Årtal: 2026.
- Inga priser, ingen Play-badge, ingen ny navigationspunkt, projekträlsen rörs inte.
- Allt under hero laddas lat. Sidvikt före scroll under 2 MB. 3D-modellen under 3 MB och laddas först nära viewporten.
- Material får inte innehålla riktiga användares namn, foton eller mått.
- Grönt lokalt = `npm run build` (tsc + vite + prerender) går igenom, `npm run lint` utan nya fel, `node --test scripts/` grönt. Då pushas, PR skapas och squash-mergas direkt utan att fråga (användarens huvudregel). GitHub Actions finns inte att vänta på.
- Commit-meddelanden på svenska, avslutade med `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.

## Review Focus

1. **Prerendering utan `window`.** `renderToString` kör `CaseFormad` i Node. 3D-visaren och klipprutnätet får inte röra `window`, `navigator` eller `IntersectionObserver` utanför `useEffect`, och `three` får aldrig importeras statiskt. Test i Task 7: `dist/case/formad/index.html` innehåller reservbilden `<img ... src="/formad/herkules-still.webp"`.
2. **`prefers-reduced-motion`.** Klippen får inte autospela och visaren får inte rotera. Test i Task 8 och 7: manuell kontroll i webbläsarpanelen med emulerad reduced motion (DevTools Rendering), plus att `<video>`-elementen saknar `autoplay` när hooken säger reduced.
3. **Svag telefon eller `saveData`.** Visaren ska visa stillbilden och aldrig hämta modellen. Test i Task 7: enhetstest av `shouldLoad3d(nav)` med `{ connection: { saveData: true } }`, `{ deviceMemory: 2 }`, `{ hardwareConcurrency: 2 }` → `false`.
4. **Modellen misslyckas att laddas** (nätfel, 404). Stillbilden ska stå kvar och inget ohanterat fel i konsolen. Test i Task 7: visaren fångar `loadAsync`-fel och sätter `state = 'still'`; kontroll i webbläsaren genom att tillfälligt byta till en felaktig sökväg.
5. **Klipp som spelar utanför bild.** Sex loopande videor samtidigt drar batteri. Test i Task 8: IntersectionObserver pausar klipp utanför viewporten; kontroll i webbläsaren att `video.paused` är `true` för klipp under vecket.

---

### Task 1: Materialet in i repot

**Files:**
- Create: `scripts/material/formad.mjs` (kopierar och konverterar; dokumenterar källorna)
- Create: `public/formad/` (resultatet, committas)
- Test: `scripts/formad.test.mjs`

**Interfaces:**
- Produces: filerna nedan, exakt dessa namn under `public/formad/`:
  - Telefoner (webp, 1080 px breda): `tel-traning.webp`, `tel-idag.webp`, `tel-vecka.webp`, `tel-mat.webp`
  - Resan: `resa-01-block.webp`, `resa-02-huggen.webp`, `resa-03-gra.webp`, `resa-04-tre-kroppar.webp`, `resa-05-muskelatlas.webp`, `resa-06-marklyft.webp`
  - `sisyfos.webp`, `punktmoln.webp`, `herkules-still.webp`
  - Intro: `intro-01.webp` … `intro-08.webp`
  - Klipp: `klipp/{marklyft,knaboj,banpress,militarpress,skivstangsrodd,bicepscurl-hantel}-muskler.mp4` + `.webp`

- [ ] **Steg 1: Skriv testet**

`scripts/formad.test.mjs`, med `node:test` och `node:assert/strict`. Ett test `material finns och är inom storleksgränserna` som för varje fil i listan ovan kontrollerar `fs.existsSync` och storlek: webp under 400 kB (`resa-04`, `resa-05`, `punktmoln` under 700 kB), mp4 under 120 kB.

- [ ] **Steg 2: Kör testet, se att det fallerar**

Kör: `node --test scripts/`
Förväntat: FAIL, filerna saknas.

- [ ] **Steg 3: Skriv `scripts/material/formad.mjs`**

Ett Node-skript utan beroenden som kör `ffmpeg` via `child_process.execFileSync` för varje rad i en tabell `{ from, to, width?, frame? }`. Källor (absoluta sökvägar, `SKIFTRUTIN` = `C:\Users\zania\dev\skiftrutin`, `ANIM` = `C:\Users\zania\dev\Animation`):

| to | from | åtgärd |
|---|---|---|
| `tel-traning/idag/vecka/mat` | `SKIFTRUTIN/design/play/skarmbilder/2-traning.png`, `1-idag.png`, `3-vecka.png`, `4-mat.png` | `-vf scale=1080:-1` → webp q 82 |
| `resa-01-block`, `resa-02-huggen` | `SKIFTRUTIN/public/statyn/steg-01.webp`, `steg-10.webp` | kopia |
| `resa-03-gra` | `C:\Users\zania\dev\statyn-work\look\snett.png` | webp, bredd 1200 |
| `resa-04-tre-kroppar` | `ANIM/production/base2/previews/jamfor_v3_fram.png` | webp, bredd 1600 |
| `resa-05-muskelatlas` | `ANIM/production/base2/previews/muskelatlas.png` | webp, bredd 2000 (legenden behålls) |
| `resa-06-marklyft` | `SKIFTRUTIN/public/klipp/marklyft-muskler.mp4` | en ruta vid 1,4 s (`-ss 1.4 -frames:v 1`) → webp |
| `sisyfos` | `SKIFTRUTIN/design/backe/vecka-herkules-appen.png` | webp, bredd 1600 |
| `punktmoln` | `ANIM/production/previews/plot_joints2.png` | webp, bredd 1800 |
| `herkules-still` | `C:\Users\zania\dev\statyn-work\look\snett.png` | webp, bredd 900 |
| `intro-01..08` | `SKIFTRUTIN/public/intro/01.webp` … `08.webp` | kopia |
| `klipp/*` | `SKIFTRUTIN/public/klipp/<namn>-muskler.mp4` och `.webp` | kopia |

ffmpeg-webp: `-c:v libwebp -quality 82 -y`. Skriptet skriver ut varje fil och dess storlek.

- [ ] **Steg 4: Kör skriptet och testet**

Kör: `git -C C:\Users\zania\dev\skiftrutin pull` (på `main`), sedan `node scripts/material/formad.mjs`, sedan `node --test scripts/`
Förväntat: PASS. Titta på `resa-06-marklyft.webp` och byt `-ss` om rutan inte visar bottenläget med heatmapen.

- [ ] **Steg 5: Commit**

```bash
git add scripts/material/formad.mjs scripts/formad.test.mjs public/formad
git commit -m "Formad-caset: materialet in i repot, med skriptet som gjorde det"
```

---

### Task 2: Skärmbilder ur appen

**Files:**
- Create: `public/formad/tel-pass.webp`, `public/formad/tel-ovning.webp`, `public/formad/tel-mentor.webp`, `public/formad/klocka.webp`
- Modify: `scripts/formad.test.mjs` (lägg till de fyra filerna i listan)

**Interfaces:**
- Produces: fyra webp, telefonerna 1080 px breda (9:19.5), klockan kvadratisk 900×900.

- [ ] **Steg 1: Lägg till filerna i testet, kör, se FAIL**

- [ ] **Steg 2: Passvyn och övningsbladet**

Starta Formad lokalt: `cd C:\Users\zania\dev\skiftrutin && npm start` (port enligt `server.js`). Öppna i webbläsarpanelen med telefonbredd 390 px och enhetsskala 2, logga in på ägarens konto (användaren loggar in i panelen), öppna ett pass med loggade set (RPE syns) och ett övningsblad med Hercules-klipp. Skärmbild, beskär till appens yta, spara som webp 1080 px bred. Namn på personer får inte synas; välj vyer utan namn eller täck över i efterhand.

- [ ] **Steg 3: Mentor-samtalet**

Samma sätt: öppna Mentor, välj ett samtal om ett pass eller en dag utan personuppgifter. Skärmbild → `tel-mentor.webp`.

- [ ] **Steg 4: Klockan**

Bygg och starta Wear-appen i Wear OS-emulatorn (`C:\Users\zania\dev\skiftrutin\android\wear`, Gradle enligt `android-build`-anteckningarna i minnet). Skärmbild av Idag med lagerkransen → `klocka.webp` 900×900. Går emulatorn inte att få upp inom rimlig tid: gör `klocka.webp` av `SKIFTRUTIN/design/ikon/lagerkrans.webp` centrerad på `#0C0D0E`, och skriv i commit-meddelandet att det är reserven.

- [ ] **Steg 5: Kör testet, PASS, commit**

```bash
git add public/formad scripts/formad.test.mjs
git commit -m "Formad-caset: skärmbilder ur appen och klockan"
```

---

### Task 3: `og:image` per sida

**Files:**
- Modify: `src/lib/head.ts` (lägg till `image?: string` i `HeadData`)
- Modify: `src/components/SEO.tsx` (klient: sätt `og:image`, `twitter:image` när `image` finns)
- Modify: `scripts/prerender.mjs` (`applyHead`: sätt `og:image`, `twitter:image` och `og:image:alt` = titeln när `head.image` finns)
- Test: `scripts/formad.test.mjs`

**Interfaces:**
- Produces: `SEO` tar `image?: string` (absolut URL). Utan `image` behålls `index.html`:s standardbild.

- [ ] **Steg 1: Skriv testet**

Test `prerenderade sidor har rätt og:image`: läs `dist/index.html` och `dist/case/grand-hotel/index.html`, assert att `og:image` är `https://www.infrakust.se/og-image.png` i båda (standard orörd). Lägg till en rad för `/case/formad` först i Task 4 (där ska den vara `https://www.infrakust.se/formad/og.jpg`).

- [ ] **Steg 2: `npm run build && node --test scripts/`**

Förväntat: PASS redan nu för de två befintliga (det bekräftar att standardbilden inte förstörs av ändringen efteråt).

- [ ] **Steg 3: Implementera**

`HeadData.image?: string`. I `SEO.tsx`: `if (image) { setMeta('meta[property="og:image"]', 'content', image); setMeta('meta[name="twitter:image"]', 'content', image); }`. I `prerender.mjs` `applyHead`: samma två plus `og:image:alt` = `head.title`, bara när `head.image` finns.

- [ ] **Steg 4: `npm run build && node --test scripts/`, PASS, `npm run lint` utan nya fel. Commit**

```bash
git add src/lib/head.ts src/components/SEO.tsx scripts/prerender.mjs scripts/formad.test.mjs
git commit -m "SEO: og:image per sida i både klient och prerendering"
```

---

### Task 4: Routen och sidans skelett med textavsnitten

**Files:**
- Create: `src/pages/CaseFormad.tsx`
- Modify: `src/App.tsx` (lazy route `/case/formad`)
- Modify: `src/entry-server.tsx` (synkron route)
- Modify: `scripts/prerender.mjs` (`routes` + `sitemapMeta` med `priority 0.8`, `changefreq monthly`)
- Test: `scripts/formad.test.mjs`

**Interfaces:**
- Produces: `export default function CaseFormad()`. Sektionerna i spec-ordning; de som byggs i senare tasks lämnas som tomma `<section>` med en kommentar `{/* Task N */}`.

- [ ] **Steg 1: Skriv testet**

Test `casesidan prerenderas`: `dist/case/formad/index.html` finns, `<title>` är `Formad: från idé till app i Google Play — Infrakust`, canonical `https://www.infrakust.se/case/formad`, `og:image` `https://www.infrakust.se/formad/og.jpg`, HTML:en innehåller `En app som vet` och `Sluten beta i Google Play`. `dist/sitemap.xml` innehåller `<loc>https://www.infrakust.se/case/formad</loc>`.

- [ ] **Steg 2: Build + test, se FAIL**

- [ ] **Steg 3: Skriv `CaseFormad.tsx` med hero, Varför, Under huven och Avslut**

Följ `CaseGrandHotel.tsx` rad för rad för struktur och klasser. Innehåll ur specen:

- `SEO` med titel ovan, description: `Formad är vår egen produkt: en dagsplanerare för skiftarbetare. Här är berättelsen om hur vi byggde den, från idé till app i Google Play, med kropparna, mentorn och klockan.`, canonical, `image: 'https://www.infrakust.se/formad/og.jpg'`, `jsonLd` som Grand Hotels men `@type: 'CreativeWork'`, `name: 'Formad: från idé till app i Google Play'`, `datePublished: '2026-10-17'`, `dateModified` samma.
- Hero: tillbaka-länk, guldrad `CASE · EGEN PRODUKT`, h1 `En app som vet<br />när du <em className="italic text-accent-gold">jobbar.</em>`, ingress ur spec 1, `dl` med tre fält (Plattformar `Webb · Android · Wear OS`, Status `Sluten beta i Google Play`, Tid `2026`), och till höger `<img src="/formad/tel-traning.webp" alt="Formad, Träning-sidan med lagerkransen" width={1080} height={2340} loading="eager" fetchPriority="high">` i en telefonram som `AppTeaserSection` (rundad 2rem, guldkant 20 %, skugga).
- Varför: guldrad `VARFÖR`, h2 ur spec 2, två textspalter ur spec 2. Ingen bild.
- Under huven: guldrad `UNDER HUVEN`, h2 `Ett team, hela kedjan.`, punktlistan med guldstreck (sju rader ur spec 10).
- Avslut: pull-citat ur spec 11 som `<p className="font-serif text-[clamp(28px,3.5vw,44px)] ...">`, länk `Hör av dig →` till `mailto:hello@infrakust.se` med `gold-underline`, rad `Formad får en egen sida när den lanseras.` i `text-text-muted`.

Registrera routen i `App.tsx` (lazy) och `entry-server.tsx` (synkron), lägg till i `prerender.mjs`.

- [ ] **Steg 4: Build + test, PASS. Lint. Commit**

```bash
git add src/pages/CaseFormad.tsx src/App.tsx src/entry-server.tsx scripts/prerender.mjs scripts/formad.test.mjs
git commit -m "Formad-caset: routen, hero, varför, under huven och avslut"
```

---

### Task 5: Dagen runt passet

**Files:**
- Modify: `src/pages/CaseFormad.tsx`

- [ ] **Steg 1: Lägg till i testet** att HTML:en innehåller `Passet är` och `src="/formad/sisyfos.webp"`. Build + test → FAIL.

- [ ] **Steg 2: Bygg sektionen**

Guldrad `DAGEN RUNT PASSET`, h2 `Passet är <em>axeln.</em> Allt annat snurrar runt det.`, text ur spec 3, punktlista med de tre raderna. Under: `<img src="/formad/sisyfos.webp" loading="lazy" width={1098} height={1104}>` i full bredd av `max-w-[1280px]` med bildtexten `Varje hel dag lyfter han stenen lite högre. Sju dagar och han står i guld.` i `text-text-muted`. Två telefoner (`tel-idag.webp`, `tel-vecka.webp`) i samma ram som hero, `loading="lazy"`.

- [ ] **Steg 3: Build + test PASS, commit** `Formad-caset: dagen runt passet`

---

### Task 6: Kropparna

**Files:**
- Create: `src/components/formad/JourneyStrip.tsx`
- Create: `src/components/formad/FaultTable.tsx`
- Modify: `src/pages/CaseFormad.tsx`

**Interfaces:**
- Produces: `JourneyStrip({ steps }: { steps: { src: string; alt: string; caption: string; width: number; height: number }[] })`: en horisontellt scrollbar remsa (`overflow-x-auto`, `snap-x`, `scrollbar-width: none`), varje steg `w-[min(640px,80vw)]`, bild `loading="lazy"`, bildtext under i `text-text-muted`, en tunn guldlinje som binder ihop stegen. Drag med musen som i `ProjectsRailSection` (kopiera `onPointerDown/Move/endDrag`-mönstret, inte hela filen).
- `FaultTable({ rows }: { rows: { saw: string; cause: string; fix: string }[] })`: tre spalter `Vi såg` / `Orsaken` / `Lösningen`, rubrikerna i guldrad-stil, raderna delade av `divide-text-muted/10`, på telefon staplas spalterna med etikett.

- [ ] **Steg 1: Lägg till i testet** att HTML:en innehåller `Vi hade kunnat köpa en 3D-modell`, `24 % för lång`, `src="/formad/punktmoln.webp"`, `176 601 trianglar`. Build + test → FAIL.

- [ ] **Steg 2: Skriv komponenterna och sektionen**

Sektionen i ordning: guldrad `KROPPARNA`, h2 `Vi hade kunnat köpa en 3D-modell. Vi byggde en <em>egen kropp.</em>`, `JourneyStrip` med de sex stegen och bildtexterna ur spec 4, brödtext "Sanningen om starten", underrubrik `Den första kroppen gick inte att böja.` med texten ur spec 4, `FaultTable` med de fem raderna ur spec 4, punktmolnet i full bredd med raden `Så här ser arbetet ut innan det blir snyggt.`, sist siffrorna som en rad `<p className="font-serif text-[clamp(18px,2.2vw,28px)] text-accent-gold">` med `·` mellan: `176 601 trianglar · 23 muskler · 172 övningar · 344 klipp · ~2 min per klipp i renderkön · 19 MB totalt`. Bakgrund `bg-bg-secondary`.

- [ ] **Steg 3: Build + test PASS, lint, commit** `Formad-caset: kropparna, från block till marklyft`

---

### Task 7: Statyn i 3D

**Files:**
- Create: `public/formad/3d/herkules.glb` (packad)
- Create: `src/components/formad/HerculesViewer.tsx`
- Create: `src/components/formad/shouldLoad3d.ts`
- Modify: `src/pages/CaseFormad.tsx`
- Modify: `package.json` (`three` och `@types/three`, låsta versioner)
- Test: `scripts/formad.test.mjs`, `scripts/shouldLoad3d.test.mjs`

**Interfaces:**
- Produces: `shouldLoad3d(nav: Pick<Navigator, 'connection' | 'deviceMemory' | 'hardwareConcurrency'> & { connection?: { saveData?: boolean } }, reducedMotion: boolean): boolean`. `false` om `saveData`, `deviceMemory < 3`, `hardwareConcurrency < 4` eller `reducedMotion`.
- `HerculesViewer({ still, model }: { still: string; model: string })`: renderar alltid `<img src={still}>` först; när elementet är inom 600 px från viewporten och `shouldLoad3d` är `true` importeras `three` dynamiskt (`import('three')`, `import('three/examples/jsm/loaders/GLTFLoader.js')`, `import('three/examples/jsm/libs/meshopt_decoder.module.js')`), modellen laddas, canvas tonas in över bilden. Drag roterar runt Y, ingen zoom, autorotation 0,15 rad/s tills första pointerdown. Fel vid laddning → bilden står kvar, `console.warn`, inget kastas.

- [ ] **Steg 1: Enhetstest för `shouldLoad3d`**

`scripts/shouldLoad3d.test.mjs` med `node:test`, som importerar `../src/components/formad/shouldLoad3d.ts` direkt (Node 24 kör `.ts` med typerna avskalade; håll filen fri från enums och parameter-properties). Fem fall: `{ connection: { saveData: true } }`, `{ deviceMemory: 2 }`, `{ hardwareConcurrency: 2 }` och `reducedMotion = true` → `false`; `{ deviceMemory: 8, hardwareConcurrency: 8 }, false` → `true`. Kommandot förblir `node --test scripts/`.

- [ ] **Steg 2: Lägg till i `formad.test.mjs`**: `public/formad/3d/herkules.glb` finns och är under 3 000 000 byte; `dist/case/formad/index.html` innehåller `src="/formad/herkules-still.webp"`; ingen `.js`-fil i `dist/assets/` som refereras från `dist/index.html` innehåller strängen `THREE.WebGLRenderer` (startsidan bär inte three). Kör → FAIL.

- [ ] **Steg 3: Packa modellen**

```bash
ffmpeg -i C:\Users\zania\dev\skiftrutin\public\statyn\3d\herkules-farg-v2.webp -vf scale=1024:-1 -c:v libwebp -quality 80 -y public/formad/3d/herkules-farg.webp
ffmpeg -i C:\Users\zania\dev\skiftrutin\public\statyn\3d\herkules-normal-v2.webp -vf scale=1024:-1 -c:v libwebp -quality 80 -y public/formad/3d/herkules-normal.webp
```

Kopiera `herkules-v2.gltf` + `.bin` till en scratchmapp, peka gltf:ens `images[].uri` på de två nya webp-filerna, kör
`C:\Users\zania\dev\scratch-marmor\gltfpack\node_modules\.bin\gltfpack -i <scratch>/herkules.gltf -o public/formad/3d/herkules.glb -si 0.25 -cc -kn`.
Kontrollera storleken; höj eller sänk `-si` tills glb:n är under 3 MB och statyn fortfarande ser bra ut i visaren (steg 5). Ta bort de två lösa webp-filerna om gltfpack bäddade in dem; annars behåll dem bredvid glb:n.

- [ ] **Steg 4: `npm i three@0.170.0 @types/three@0.170.0 --save-exact`, skriv `shouldLoad3d.ts` och `HerculesViewer.tsx`**

Ljus: `AmbientLight(0xffffff, 0.6)` + `DirectionalLight(0xffffff, 1.2)` snett ovanifrån, transparent bakgrund (`alpha: true`), `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))`. `GLTFLoader.setMeshoptDecoder(MeshoptDecoder)`. Kameran så att hela statyn ryms i en `aspect-[3/4]`-yta. Städa upp renderer, loop och lyssnare i `useEffect`-returen. Lägg sektionen i `CaseFormad.tsx` efter Kropparna: guldrad `DRA RUNT HONOM`, visaren, rad `Samma kropp som visar varje övning i appen.`

- [ ] **Steg 5: Build, test PASS, lint. Öppna `npm run preview` i webbläsarpanelen**, scrolla till visaren: bilden visas först, modellen tonar in, drag roterar, ingen zoom. Byt tillfälligt `model`-sökvägen till en som inte finns: bilden står kvar och bara en `warn` i konsolen. Återställ.

- [ ] **Steg 6: Commit** `Formad-caset: Herkules i 3D, packad under 3 MB med stillbild som reserv`

---

### Task 8: Övningarna

**Files:**
- Create: `src/components/formad/ClipGrid.tsx`
- Modify: `src/pages/CaseFormad.tsx`
- Modify: `src/hooks/useReducedMotion.ts` (ingen ändring väntas; använd den)

**Interfaces:**
- Produces: `ClipGrid({ clips }: { clips: { name: string; label: string }[] })`: rutnät `grid-cols-2 md:grid-cols-3`, varje ruta `<video src="/formad/klipp/${name}-muskler.mp4" poster="/formad/klipp/${name}-muskler.webp" muted loop playsInline preload="none">`, `autoPlay` bara när `!reducedMotion`; en IntersectionObserver spelar (`play()`) när rutan är minst 50 % synlig och pausar annars; etikett under i `text-text-muted`.

- [ ] **Steg 1: Lägg till i testet** att HTML:en innehåller `Varje övning är ett klipp` och sex `<video` med `/formad/klipp/`. Build + test → FAIL.

- [ ] **Steg 2: Skriv `ClipGrid` och sektionen**

Guldrad `ÖVNINGARNA`, h2 `Varje övning är ett klipp ur samma kropp.`, text ur spec 6, `ClipGrid` med `[marklyft 'Marklyft', knaboj 'Knäböj', banpress 'Bänkpress', militarpress 'Militärpress', skivstangsrodd 'Skivstångsrodd', bicepscurl-hantel 'Hantelcurl']`, telefon `tel-pass.webp` och `tel-ovning.webp`.

- [ ] **Steg 3: Build + test PASS. I webbläsarpanelen: klipp under vecket har `paused === true` (kör `document.querySelectorAll('video')` i konsolen); med emulerad reduced motion spelar inget. Commit** `Formad-caset: övningarna med sex klipp som rör sig`

---

### Task 9: Mentorn, klockan och formen

**Files:**
- Modify: `src/pages/CaseFormad.tsx`

- [ ] **Steg 1: Lägg till i testet** att HTML:en innehåller `AI-agenter som spelade användare`, `Anthropics modell`, `Health Connect`, `src="/formad/klocka.webp"`, `src="/formad/intro-08.webp"`, och **inte** innehåller `Hevy` eller `intervju`. Build + test → FAIL.

- [ ] **Steg 2: Bygg tre sektioner**

- Mentorn: guldrad `MENTORN`, h2 `En mentor vi fick <em>uppfostra</em> innan den fick prata.`, texten ur spec 7 i två stycken (de första versionerna; hur vi tränade fram den), en halv mening om maten (`Maten loggas med foto, streckkod eller sökning.`), telefon `tel-mentor.webp`.
- Klockan: guldrad `KLOCKAN OCH KROPPSDATAN`, h2 `På handleden, och in från Samsung Health.`, text ur spec 8, `klocka.webp` i en rund ram (`rounded-full`, `w-[min(360px,70vw)]`, guldkant 20 %).
- Formen: guldrad `FORMEN`, h2 `Marmor, guld och ett <em>stoiskt</em> lugn.`, text ur spec 9, `JourneyStrip` återanvänd med de åtta introbilderna (bildtexter: `Blocket`, `Första huggen`, `Formen syns`, `Detaljerna`, `Fri ur stenen`, `Polerad`, `Guldet börjar`, `Förgylld`), telefon `tel-mat.webp`. Bakgrund `bg-bg-secondary`.

- [ ] **Steg 3: Build + test PASS, lint, commit** `Formad-caset: mentorn, klockan och formen`

---

### Task 10: Startsidan och App-utveckling

**Files:**
- Modify: `src/sections/AppTeaserSection.tsx`
- Modify: `src/pages/AppdevPage.tsx:109-142`
- Test: `scripts/formad.test.mjs`

- [ ] **Steg 1: Lägg till i testet**: `dist/index.html` innehåller `href="/case/formad"` och `EGEN PRODUKT`; `dist/tjanster/apputveckling/index.html` innehåller `href="/case/formad"`. Build + test → FAIL.

- [ ] **Steg 2: Startsidan**

I `AppTeaserSection`: behåll Grand Hotel-blocket orört. Under det, inom samma `<section>`, ett andra block med samma grid: guldrad `EGEN PRODUKT`, h2 `En app som vet <em className="italic">när du jobbar.</em>`, `dl` med tre fält (Plattformar, Status, År `2026`), text `En dagsplanerare för skiftarbetare med egna 3D-kroppar, en mentor på Anthropics modell och en klockapp. Vi byggde den för att vi behövde den själva.`, länk `Läs hela caset →` till `/case/formad`, och till höger en stilla telefon med `/formad/tel-traning.webp` i samma ram (ingen bläddring, ingen färgväxling). Avstånd mellan blocken `mt-32 md:mt-40`.

- [ ] **Steg 3: App-utveckling**

Efter Grand Hotel-stycket (före `Tech stack`): en ny `<section>` med guldrad `EGEN PRODUKT`, h2 `Formad`, ett stycke: `Vår egen app för skiftarbetare: dagsplan runt passen, träning med egna 3D-kroppar som visar vad varje övning tränar, en mentor på Anthropics modell och en klockapp för Wear OS. Sluten beta i Google Play sedan oktober 2026. Vi byggde den som vi bygger åt kunder, och berättar hela vägen dit.`, länk `Läs hela caset →` till `/case/formad`.

- [ ] **Steg 4: Build + test PASS, lint, commit** `Startsidan och App-utveckling pekar på Formad-caset`

---

### Task 11: OG-bilden, slutkontroll och merge

**Files:**
- Create: `public/formad/og.jpg` (1200×630)
- Create: `scripts/material/og-formad.mjs`
- Delete: `src/sections/ProjectsSection.tsx`, `src/sections/ToolsSection.tsx` om ingen importerar dem (kontrollera med `grep -rn "ProjectsSection\|ToolsSection" src`)

- [ ] **Steg 1: Lägg till i testet** att `public/formad/og.jpg` finns, är under 300 kB, och (via `ffprobe -show_entries stream=width,height`) är 1200×630. Kör → FAIL.

- [ ] **Steg 2: Gör OG-bilden**

`scripts/material/og-formad.mjs`: ffmpeg komponerar `resa-06-marklyft.webp` till höger på en 1200×630-yta i `#0C0D0E` (`-filter_complex` med `color=`, `scale`, `overlay`), och lägger texten `Formad: från idé till app i Google Play` i vitt med `drawtext` (fontfile: DM Serif Display saknas lokalt, använd `C:/Windows/Fonts/georgia.ttf`) och `infrakust.se` i `#C9A96E` under. Spara som jpg q 85.

- [ ] **Steg 3: Hela kontrollen**

Kör: `npm run lint && npm run build && node --test scripts/`
Förväntat: allt grönt. Öppna `npm run preview` i webbläsarpanelen i 390 px och 1440 px: hela sidan uppifrån och ner, inga konsolfel, remsan scrollar, klipp spelar och pausar, visaren laddar. Mät det som laddas före scroll i Nätverk-fliken: under 2 MB.

- [ ] **Steg 4: Ta bort död kod** (`ProjectsSection.tsx`, `ToolsSection.tsx`) om ingen refererar dem; build igen.

- [ ] **Steg 5: Commit, push, PR, merge**

```bash
git add -A
git commit -m "Formad-caset: OG-bild, död kod borta, slutkontroll"
git push -u origin formad-case
gh pr create --title "Formad-caset: från idé till app i Google Play" --body "<sammanfattning av sidan, vad som kördes lokalt: lint, build, node --test, kontroll i webbläsare 390/1440>

🤖 Generated with [Claude Code](https://claude.com/claude-code)"
gh pr merge --squash --delete-branch
```

- [ ] **Steg 6: Efter deploy**

Öppna `https://www.infrakust.se/case/formad` i webbläsarpanelen: titeln, `og:image` i källkoden, 3D-visaren och klippen fungerar på riktigt. Rapportera kort.
