# Rebuild-plan: showcase med storyline (2026-10-30)

## Riktning

- Sajten är en **gokart-sportprofil-showcase**, inte en webbyrå.
- **Svincool hero** som sätter tonen direkt.
- **Bakgrund som hänger med hela sidan** (fixed/sticky) så att sidan känns som en sammanhållen upplevelse.
- **Storyline i kapitel**, t.ex. start, karriär, säsonger, resultat, sponsorer, media, kontakt.
- Syfte: andra profiler ska se sajten och vilja ha en egen som Rickard bygger.
- Ton: ödmjuk, inte kaxig.

## Referens och ägarskap

- Känslo-referens: `design/refs/benkaluza/` (se README där). Inte en klon.
- **Designern äger den visuella DNA:n.** Referensen är underlag, inte facit.

## Innehåll

Inga resultat, titlar eller andra fakta om Rickard får hittas på. Allt faktainnehåll i kapitlen kommer från Rickard eller befintligt innehåll i repot och markeras som platshållare tills det är bekräftat.

## Skills i `.claude/skills`

accessibility, ai-seo, animation-vocabulary, brand-dna, brand-guidelines, brand-voice-guidelines, brandkit, copy-editing, copywriting, core-web-vitals, design-taste-frontend, design-taste-frontend-v1, emil-design-eng, extract-design, frontend-design, gpt-taste, gsap-core, gsap-frameworks, gsap-performance, gsap-plugins, gsap-react, gsap-scrolltrigger, gsap-timeline, gsap-utils, high-end-visual-design, humanizer, image-to-code, impeccable, minimalist-ui, rea-analysis-optimization, rea-changelog-update, rea-ci-tests-audit, rea-tool-design, redesign-existing-projects, reverse-engineer-anything, schema, seo-audit, shared, threejs-animation, threejs-fundamentals, top-design, ui-ux-pro-max, web-typography.

## Nästa steg

1. Designern tar fram visuell DNA och kapitelstruktur utifrån referensen och Rickards önskemål.
2. Rickard bekräftar vilka fakta och bilder som får användas per kapitel.
3. Spec per kapitel som pipeline-issues (ett issue per kapitel/komponent).
4. Bygg hero och den fasta bakgrunden först (GSAP/ScrollTrigger, respektera `prefers-reduced-motion`), sedan kapitlen.
5. Textpass med copywriting, seo-audit, ai-seo och humanizer enligt projektreglerna.
6. Kontrollera Core Web Vitals och tillgänglighet på 1440 px och 390 px.
