# Formad-caset på infrakust.se

Design, 2026-10-16. Det här dokumentet beskriver vad som ska byggas och varför, så att en byggare kan planera utan att fråga om. Infrakust-repot: `C:\Users\zania\dev\Infrakust`. Formads repo (källan till allt material): `C:\Users\zania\dev\skiftrutin`. Animationsprojektet: `C:\Users\zania\dev\Animation`.

## Avsikt

Infrakust ska visa Formad som sitt andra app-case, bredvid Grand Hotel. Caset är en verkstadsberättelse, inte en produktsida: det ska sälja **byrån**, genom att visa hur vi tog en idé hela vägen till en app i Google Play och vad vi brottades med på vägen. Själva produkten säljs senare på en egen sida.

Besökaren ska gå därifrån med tanken: "De här kan bygga något lika genomarbetat åt oss." Besökaren ska **inte** i första hand ladda ner appen.

Det som gör caset unikt är materialet. Vi har hela resan dokumenterad i bilder: marmorblocket, den huggna statyn, 3D-kroppen, muskelatlasen, riggens punktmoln, fellistorna och de 344 färdiga klippen. Ingen annan byrå kan visa det, så sidan ska visa det stort och rått i stället för att beskriva det.

## Mål

1. En egen casesida, `/case/formad`, byggd på samma mall och i samma ton som `/case/grand-hotel`.
2. Formad syns på startsidan och på sidan App-utveckling, med länk till caset.
3. Sidan berättar sanningen om hur det gick till, inklusive det som gick fel, för det är det mest trovärdiga en byrå kan visa.
4. Sidan ser ut och känns som Infrakust (mörk, DM Serif Display, guld), inte som appen och inte som ett AI-genererat mallblad.

## Icke-mål

- Ingen prislista, ingen nedladdningsknapp i fokus, ingen Play-badge. Formad lanseras på egen sida senare; här räcker en diskret rad längst ner.
- Ingen ny navigationspunkt. Caset nås från startsidan, App-utveckling och sitemapen.
- Inga ändringar i Formads repo. Material kopieras eller renderas till Infrakust-repot.
- Projekträlsen "Hemsidor som konverterar" rörs inte. Formad är en app, inte en hemsida.

## Anti-mål

Det här gör sidan misslyckad även om den tekniskt fungerar:

- **AI-look.** Symmetriska treradiga kortgrid, kapitelstämplar ("01 · UPPRINNELSEN"), generiska ikoner, rubriker som slogans. Varje avsnitt ska ha egen rytm och riktiga bilder.
- **Att överdriva.** Vi skriver inte att statyn skulpterades för hand. Vi skriver inte att mentorn tränades på riktiga intervjuer om det var simuleringar. Se "Sanningen om varje del".
- **Att nämna Hevy.** Varken som förebild eller import.
- **Att nämna PED-stödet** i appen.
- **En sida som laggar.** 3D och video får aldrig göra sidan långsam på telefon. Allt tungt laddas lat och har stillbild som reserv.

## Begränsningar

- Stacken är Infrakusts: React 18, Vite, TypeScript, Tailwind, Framer Motion, react-router, prerendering via `scripts/prerender.mjs`. Casesidan är en lazy route som Grand Hotel-sidan.
- Designtokens finns i `tailwind.config.js` och `tech-spec.md`: `bg-primary #0C0D0E`, `bg-secondary #141516`, `accent-gold #C9A96E`, `font-serif` DM Serif Display, `font-sans` Inter, `tracking-section` för guldrader. Återanvänd klasserna som `CaseGrandHotel.tsx` använder.
- Infrakust har ingen three.js i dag. För 3D-visaren läggs `three` till som beroende (version låst). Ingen annan ny tung beroende.
- Vercel bygger från `main`. Inget CI att vänta på; lokalt `npm run build` (tsc + vite + prerender) måste gå igenom före push.
- Material från Formad som är CC0 eller eget får användas fritt. Den äldre CC BY-utrustningen från riggens del 1 används inte (den finns inte i de aktuella klippen).

## Berättelsen, avsnitt för avsnitt

Ordningen är låst. Rubrikerna är förslag i rätt ton; byggaren får vässa ord men inte byta budskap. Texten skrivs på svenska i vi-form, korta meningar, konkreta detaljer, som på Grand Hotel-sidan. Inga tankstreck.

### 1. Hero: telefonen först

- Guldrad: `CASE · EGEN PRODUKT`
- Rubrik: *En app som vet när du jobbar.* (sista ordet i guld-kursiv)
- Ingress: Formad är vår egen produkt. En dagsplanerare för skiftarbetare som lägger rutin, träning och mat runt passen, med en mentor som läser hela dagen. Vi byggde den för att vi behövde den själva. Så här gick det till.
- Faktarad (som Grand Hotels `dl`): Plattformar: Webb · Android · Wear OS. Status: Sluten beta i Google Play. Tid: 2026.
- Höger: en telefon med Träning-sidan (lagerkransen, ΓΥΜΝΑΣΙΟΝ-rubriken). Källa: `skiftrutin/design/play/skarmbilder/2-traning.png`. Telefonen bläddrar inte; en stilla bild räcker här.
- Bakgrund: samma ambienta guldglöd som AppTeaserSection använder, inget mer.

### 2. Varför

- Guldrad: `VARFÖR`
- Rubrik: *Fem appar, en AI och ett schema som aldrig var detsamma.*
- Text, två spalter: Skiftjobb gör vanliga hälsoappar meningslösa, de antar att dagen börjar på morgonen. Rutinen låg i en app, träningen i en annan, maten i en tredje, och en AI-assistent utanför alltihop som inte visste något om passen. Vi ville ha ett ställe som visste när vi jobbade och planerade resten.
- Andra spalten: tonen kom från ett intresse för stoikerna, Iliaden, Sokrates och Marcus Aurelius. Ordning utan pekpinnar. Det blev appens hållning och till slut dess utseende.
- Ingen bild. Det här avsnittet är text.

### 3. Dagen runt passet

- Guldrad: `DAGEN RUNT PASSET`
- Rubrik: *Passet är axeln. Allt annat snurrar runt det.*
- Text: dag-, kvälls- och nattpass läggs in först, sedan rutin, träning och måltider runt dem. Ett nattpass delas i två block så att "idag" betyder något klockan tre på natten. Planen räknas om när ett pass flyttas. Nya konton får en färdig startrutin.
- Bild: **veckan som Sisyfos**, sexbildssekvensen där Herkules puttar stenen uppför veckan och är förgylld på söndagen. Källa: `skiftrutin/design/backe/vecka-herkules-appen.png`. Visas brett, med raden under: "Varje hel dag lyfter han stenen lite högre. Sju dagar och han står i guld."
- Telefoner: Idag-sidan och Kommande pass (`design/play/skarmbilder/1-idag.png`, `3-vecka.png`).

### 4. Kropparna: från block till marklyft

Det tyngsta avsnittet. Det får ta plats.

- Guldrad: `KROPPARNA`
- Rubrik: *Vi hade kunnat köpa en 3D-modell. Vi byggde en egen kropp.*
- **Resan som remsa.** En bred, horisontellt scrollbar remsa med riktiga bilder i ordning, var och en med en rad under:
  1. Marmorblocket (`public/statyn/steg-01.webp`): "Statyn finns redan där inne."
  2. Halvhuggen (`steg-10.webp`): "Formen kom ur en AI-skulptur av referensbilder."
  3. Grå 3D-kropp (`statyn-work/look/snett.png`): "Statyn som mesh: 176 601 trianglar."
  4. Tre kroppar bredvid varandra (`Animation/production/base2/previews/jamfor_v3_fram.png`): "Statyn, den nya kroppen, och formen överförd."
  5. Muskelatlasen (`Animation/production/base2/previews/muskelatlas.png`): "23 muskler målade på kroppen."
  6. Herkules i marklyft med heatmap: en ruta ur det aktuella klippet `public/klipp/marklyft-muskler.mp4` (720×900) eller själva klippet som loop: "Varje övning visar vad den tränar." Inte `anim_oversikt_heat.png`: den är renderad före base2 och visar den gamla kroppen med de utdragna armarna. (Mitt beslut efter granskningen.)
- **Sanningen om starten**, i brödtext: statyn skulpterades först med ett AI-verktyg ur referensbilder. Den var vacker och gick inte att böja. Allt efter det är vårt: riggen, den nya kroppen, musklerna och klippen.
- **Den första kroppen gick inte att böja.** Eget underavsnitt. Vi satte ett skelett rakt in i statyn, målade vikter, delade de hopvuxna fingrarna, byggde korrektiv för armbågar och axlar, skrev en volymbevarande lösare och renderade 28 rörelser. Armarna såg utdragna ut, armbågarna böjde fel i nästan varje klipp, och axeln blev aldrig rätt. Orsaken var meshen själv: en skannad triangelmesh utan kantslingor runt lederna. Så vi byggde om kroppen på en animationsfärdig bas (MPFB2) och flyttade statyns form till den.
- **Felen som tabell.** Tre spalter: *Vi såg* / *Orsaken* / *Lösningen*. Fem rader, hämtade ur `HERCULES_SUMMARY.md` och `FEL_LISTA.md`:
  1. Utdragna armar, tunna handleder / Armlängderna mättes från axelspetsen, inte mellan ledcentra. Överarmen var 24 % för lång / de Levas mått mellan ledcentra, hårda regler i passningen
  2. Armbågen böjde fel i nästan varje klipp / IK-kedjan hade statyns gamla längder, så armbågen hamnade 5–10 cm från meshens / IK-benen satta lika med deformbenen
  3. Ansiktet sönderrivet / Projektion längs normalerna missade 46 % av punkterna / ICP som bara fäster arm mot arm, bål mot bål
  4. Axeln blev aldrig rätt / Riggen saknade skulderblad, så all rörelse kom ur en led / Skulderbladsben som följer forskningens skulderrytm, efter sex kasserade försök
  5. 15 klipp gick inte att spela till slutet / Två renderare skrev samma fil samtidigt / Varje klipp avkodas i testet innan det går in i appen
- **Punktmolnet.** Bilden med ledmarkörerna, `Animation/production/previews/plot_joints2.png`: sex paneler där statyns yta är ett punktmoln och lederna röda prickar. Visas stort med raden: "Så här ser arbetet ut innan det blir snyggt."
- **Siffrorna**, en rad i guld: 176 601 trianglar · 23 muskler · 172 övningar · 344 klipp · ~2 min per klipp i renderkön · 19 MB totalt.

### 5. Statyn i 3D

- Guldrad: `DRA RUNT HONOM`
- Herkules som gltf med marmortextur, i en egen three.js-visare på sidan. Besökaren drar för att rotera; ingen zoom, ingen pan. Autorotation långsamt tills första interaktionen.
- Källa: `skiftrutin/public/statyn/3d/herkules-v2.gltf` + `.bin` (13 MB) + `herkules-farg-v2.webp` + `herkules-normal-v2.webp`. 13 MB är för mycket för en webbsida. Byggaren packar om modellen till en lättare variant (mål under 3 MB, Draco eller meshopt via `gltfpack`, som redan finns i `scratch-marmor/gltfpack`) och lägger den under `public/formad/3d/`.
- Reserv: en stillbild (`statyn-work/look/snett.png` eller en render med marmor) visas tills modellen laddats, och alltid när `saveData`, `deviceMemory < 3`, `hardwareConcurrency < 4` eller `prefers-reduced-motion`. Samma regler som appens `herkules3d.js`.
- Laddas först när avsnittet närmar sig viewporten (IntersectionObserver). `three` importeras dynamiskt så att startsidan inte bär det.
- Rad under: "Samma kropp som visar varje övning i appen."

### 6. Övningarna

- Guldrad: `ÖVNINGARNA`
- Rubrik: *Varje övning är ett klipp ur samma kropp.*
- Text: övningsklippen renderas ur riggen ovan, så kroppen som visar marklyftet är samma kropp som lyser i heatmapen. Omkring 40 rörelseklasser med parametrar (grepp, redskap, bänkvinkel, en eller två armar) täcker 172 övningar. Passet loggas set för set med RPE, dropset och set till failure. Superset körs övning efter övning utan vila, vilan kommer efter varvet.
- **Klippen som rör sig.** Ett rutnät (2×3 på telefon, 3×2 på desktop) med sex muskelklipp som tysta loopar: marklyft, knäböj, bänkpress, militärpress, skivstångsrodd, hantelcurl. Källa: `skiftrutin/public/klipp/<övning>-muskler.mp4` med `-muskler.webp` som poster. Cirka 50 kB styck. `autoplay muted loop playsinline`, pausade när de är utanför viewporten, stillbild vid reduced motion.
- Telefon: passvyn med set och RPE (byggaren tar en skärmbild ur appen, se Material).

### 7. Mentorn

- Guldrad: `MENTORN`
- Rubrik: *En mentor vi fick uppfostra innan den fick prata.*
- Text: Mentorn bygger på Anthropics modell och ser det appen ser: pass, sömn, mat, vikt och träning. De första versionerna var för pratiga, räknade fel på avlastningar och bytte program tre gånger i samma samtal.
- **Hur vi tränade fram den.** Vi tränade den med AI-agenter som spelade användare. Varje agent fick ett liv: skiftarbetare efter ett nattpass, ledig dag, mitt i en viktnedgång, ny i gymmet, van lyftare. De tog samtalen med mentorn, och en bedömare gick igenom varje svar: vad hjälpte, vad irriterade, vad var fel. Bedömningarna blev regler i prompten. Färre uppslag i taget. Inga frågor som lämnas hängande. Tider i timmar och minuter som i resten av appen. Mentorn tänker längre innan den svarar och säger mindre. Sedan fick betatestarna ta över. Skriv det som det är: simuleringar med AI-agenter, inte intervjuer. Det är en styrka, så det får stå tydligt.
- **Matfotot** nämns bara i förbifarten, en halv mening: maten loggas med foto, streckkod eller sökning. Inget om hur fototolkningen tränades.
- Bild: en telefon med Mentor-samtalet. Byggaren tar skärmbilden ur appen i Android-emulatorn eller på webben, inloggad på ägarens konto, och anonymiserar namn. Ingen matfoto-bild behövs.

### 8. Klockan och kroppsdatan

- Guldrad: `KLOCKAN OCH KROPPSDATAN`
- Rubrik: *På handleden, och in från Samsung Health.*
- Text: en egen Wear OS-app visar dagens rutin som en krans runt urtavlan, så nästa moment syns utan telefonen. Health Connect hämtar steg, sömn, aktiva kalorier och vikt från vågen. Förbränningen räknas från vikttrenden mot det som loggats, inte från en tabell.
- Bild: en rund klockbild med lagerkransen. Byggaren tar skärmbilden i Wear OS-emulatorn (Wear-koden ligger i `skiftrutin/android/wear`, byggs med Gradle som i `android-build`-anteckningarna). Reserv om emulatorn inte går att få upp: `design/ikon/lagerkrans.webp` i en rund ram.

### 9. Formen

- Guldrad: `FORMEN`
- Rubrik: *Marmor, guld och ett stoiskt lugn.*
- Text: temat är inte dekor. Statyn i marmor är användarens egen vecka och förändras med den. Typografin (Cinzel för grekiska rubriker, EB Garamond, Hanken Grotesk) och färgerna är lånade ur samma värld. Varje skärm är ritad för en tumme och den information som behövs just där. Det som ser enkelt ut tog längst tid.
- Bild: introbilderna, åtta steg från block till guld (`skiftrutin/public/intro/01.webp` till `08.webp`), som en tät remsa. Plus Mat-sidan (`design/play/skarmbilder/4-mat.png`).

### 10. Under huven

- Guldrad: `UNDER HUVEN`
- Rubrik: *Ett team, hela kedjan.*
- Lista (streck i guld, som Grand Hotels punktlistor): Webbapp och Android-app ur samma kodbas, egen Wear OS-app · Supabase för konton och data, funktionerna körs i Dublin bredvid databasen · Health Connect mot Samsung Health · Anthropic bakom mentorn och matfotona · Blender, MPFB2 och en egen renderkö för kropparna och klippen · Stripe för Bas, Pro och Max på webben · Vercel.

### 11. Avslut

- Pull-citat: *Vi byggde Formad för att vi behövde den. Det är samma sätt vi bygger åt andra: från ett riktigt problem, hela vägen till en app folk har i fickan.*
- Länk: Hör av dig → (`mailto:hello@infrakust.se`, som övriga sidor)
- Diskret rad: "Formad får en egen sida när den lanseras."

## Startsidan och App-utveckling

- **Startsidan.** `AppTeaserSection` byggs om från ett case till två. Rubriken "Två appar. Två hotell." behålls för Grand Hotel-delen; under den läggs ett andra block med samma uppbyggnad (guldrad `EGEN PRODUKT`, rubrik *En app som vet när du jobbar.*, tre faktafält, kort text, länk "Läs hela caset →" till `/case/formad`, och en telefon med Träning-sidan). Alternativt växlar sektionen mellan de två casen med samma telefonkomponent. Byggaren väljer det som blir lugnast; två block under varandra är förstahandsvalet.
- **App-utveckling** (`AppdevPage.tsx`). Efter Grand Hotel-stycket läggs ett stycke om Formad som egen produkt, med länk till caset. Samma tonläge som befintlig text på sidan.
- **Prerender och sitemap.** `/case/formad` läggs till i `routes` och i sitemap-listan i `scripts/prerender.mjs`, prioritet 0.8, changefreq monthly, som Grand Hotel.
- **SEO.** Titel: "Formad: från idé till app i Google Play — Infrakust". Beskrivning i en mening om att det är vår egen produkt och berättelsen om hur den byggdes. Canonical `https://www.infrakust.se/case/formad`. OG-bild: Herkules i marklyft med heatmap eller hero-telefonen; byggaren gör en 1200×630.

## Material

Allt material kopieras in i Infrakust-repot under `public/formad/`, i webbformat (webp för bilder, mp4 för klipp, gltf+bin för 3D). Inget länkas från skiftrutin.infrakust.se.

| Behov | Källa | Åtgärd |
|---|---|---|
| Hero-telefon, Idag, Vecka, Mat | `skiftrutin/design/play/skarmbilder/1–4.png` | Konvertera till webp, max 1080 px bred |
| Passvy med set och RPE, övningsblad | Finns inte som färdiga bilder | Byggaren tar skärmbilder ur appen (lokal server med testdata, eller emulatorn) i telefonbredd 390 px, 2× |
| Mentor-samtal | Kräver inloggning med AI-plan | Byggaren tar skärmbilden i Android-emulatorn eller på webben inloggad på ägarens konto; namn anonymiseras |
| Veckan som Sisyfos | `skiftrutin/design/backe/vecka-herkules-appen.png` | webp |
| Block, huggen staty | `skiftrutin/public/statyn/steg-01.webp`, `steg-10.webp` | kopieras |
| Grå 3D-kropp | `statyn-work/look/snett.png` | webp |
| Tre kroppar | `Animation/production/base2/previews/jamfor_v3_fram.png` | webp |
| Muskelatlas | `Animation/production/base2/previews/muskelatlas.png` | webp, legenden kan beskäras bort eller behållas |
| Marklyft heatmap | En ruta ur `public/klipp/marklyft-muskler.mp4` (ffmpeg, bottenläget), 720×900 | webp. `anim_oversikt_heat.png` används inte, den visar den gamla kroppen |
| Formads repo | Den lokala utcheckningen står på #358 med 234 klipp; `origin/main` har #361 med alla 344 | Kör `git pull` på `main` i `skiftrutin` innan material hämtas |
| Punktmolnet | `Animation/production/previews/plot_joints2.png` (sex paneler med ledmarkörer; `plot_joints1.png` är en variant) | webp, vit bakgrund behålls (det är poängen) |
| Sex muskelklipp | `skiftrutin/public/klipp/{marklyft,knaboj,banpress,militarpress,skivstangsrodd,bicepscurl-hantel}-muskler.mp4` + `.webp` (filnamnen är verifierade) | kopieras |
| Herkules 3D | `skiftrutin/public/statyn/3d/herkules-v2.*` | packas om till under 3 MB, se avsnitt 5 |
| Introbilder | `skiftrutin/public/intro/01–08.webp` | kopieras |
| Klockbild | Skärmbild från Wear-emulator eller klocka | Byggaren tar den; reserv `design/ikon/lagerkrans.webp` |
| OG-bild | Görs av byggaren: rutan ur marklyftsklippet på mörk botten (`bg-primary`), med rubriken i DM Serif Display | 1200×630 jpg. `SEO`-komponenten och `prerender.mjs` saknar `og:image` per sida i dag; byggs ut så att varje sida kan ange sin egen |

Material får inte innehålla riktiga användares namn, foton eller mått. Mat-skärmbilden visar demodata.

## Sanningen om varje del

Det här är vad vi får säga, och inte:

- **Statyn:** första formen kom ur ett AI-skulpteringsverktyg (Meshy) med referensbilder. Vi säger "skulpterades med ett AI-verktyg ur referensbilder"; verktygsnamnet behöver inte stå. Allt därefter är vårt.
- **Muskelkartan:** 23 muskler, roller enligt lärobok, inte uppmätt EMG. Vi skriver inte att heatmapen är "uppmätt".
- **Klippen:** 172 övningar, 344 klipp, allt live i appen. Omkring 150 av dem har ännu bara granskats mot bilder, inte av användaren i appen. Det behöver inte stå på sidan, men vi påstår inte att varje klipp är "perfekt".
- **Mentorn:** tränades genom simulerade samtal där AI-agenter spelade användare i olika lägen, bedömda svar för svar, och sedan betatestarnas verkliga användning. Användaren har bekräftat att det är så vi skriver. Inte "intervjuer".
- **Matfotot:** nämns bara som "logga med foto". Hur fototolkningen tränades står inte på sidan (användarens val).
- **Skärmbilder:** byggaren tar alla, ur appen, emulatorn eller webben (användarens val).
- **Status:** sluten beta i Google Play sedan 14 oktober 2026. Webben live.
- **Betalning:** Stripe byggt, nycklar på väg. Vi skriver "Stripe för planerna" utan priser.
- **Anthropic** nämns som modellen bakom mentorn och matfotona.

## Vad som lämnas till byggaren

- Exakt ordval i rubriker och brödtext, inom tonen ovan.
- Komponentindelning: en fil per avsnitt eller en sida med sektioner, som i Grand Hotel-sidan. Återanvänd `SEO`, `Navigation`, `Footer`, `ScrollReveal` (om den finns kvar; senaste commit tog bort scroll-reveals, följ det).
- Hur klippen pausas utanför viewporten (IntersectionObserver räcker).
- Val av gltf-komprimering och exakt three.js-version.
- Om startsidans teaser blir två block eller en växlare.
- Hur skärmbilderna tas (Playwright med `scripts/ui-check.cjs` i skiftrutin som förlaga, eller för hand).

## Leverans och kontroll

- Branch från `main` i Infrakust-repot. Lokalt: `npm run build` måste gå igenom (tsc, vite, prerender). `npm run lint` utan nya fel.
- Kontroll i webbläsare: sidan i 390 px och 1440 px bredd, 3D-visaren laddar och roterar, klippen spelar och pausar, reservbilderna visas med `prefers-reduced-motion`, inga konsolfel. Sidvikt: det som laddas **innan användaren scrollar** (hero och det som syns ovanför vecket) ska vara under 2 MB. Allt under hero laddas lat med `loading="lazy"` respektive IntersectionObserver, så hela sidans samlade vikt får vara större. 3D-modellen räknas inte in; den laddas först när avsnittet närmar sig.
- Push, PR, squash-merge till `main` direkt när det är grönt lokalt, enligt användarens huvudregel. Vercel deployar från `main`.
- Efter deploy: öppna `https://www.infrakust.se/case/formad` och kontrollera att prerenderingen gav rätt titel och OG-taggar.

## Frågor som är avgjorda (2026-10-16)

1. **Mentor-bilden:** byggaren tar den i emulatorn eller på webben, inloggad på ägarens konto. Ingen matfoto-bild.
2. **Årtalet:** 2026. Första commiten i Formads repo är 2026-09-20 och inget tidigare arbete har nämnts.
3. **Mentorns träning:** simuleringar med AI-agenter som spelade användare, sedan betan. Skrivs rakt ut.
4. **Klockbilden:** byggaren tar den i Wear OS-emulatorn.

## Beslut tagna efter granskningen (byggarens egna, kan ändras av användaren)

- Heatmap-bilden i remsan och OG-bilden tas ur det aktuella marklyftsklippet, inte ur den gamla översiktsbilden.
- Sidvikten gäller det som syns före scroll; resten laddas lat.
- `og:image` per sida byggs in i `SEO` och prerenderingen.
- Formads repo pullas till #361 innan materialet hämtas.
