# Progetto: Arkimedia Theme — WordPress
Sviluppo del tema WordPress premium Arkimedia per agenzia OOH (Out-of-Home advertising).
Stack: PHP 8.1+, WordPress 6.4+, GSAP 3.12.5, Lenis, Swiper 11, Fancybox 5, Vanilla CSS con custom properties.
Ambiente: LocalWP (arkimediatest.local) → produzione (www.arkimedia.org). Repository: github.com/philuccio/arkimedia-theme.
Versione stabile: v2.0.2-stable

---

## Blocchi Gutenberg custom (categoria Arkimedia)
Hero, Testata, Services, Clienti, Gallery+CTA, Gallery Servizio, Slider, Contact, Mappa, Container, Riga Avanzata, Portfolio Meta, Testo, Immagine, Card (4 layout A/B/C/E), CTA (3 layout A/B/C).

---

## Pattern standard editor — OBBLIGATORI su ogni blocco

### useLocalText — TextControl senza perdita di focus
```js
function useLocalText( value, onChange ) {
    const [ local, setLocal ] = useState( value ?? '' )
    useEffect( () => { setLocal( value ?? '' ) }, [ value ] )
    return {
        value:    local,
        onChange: setLocal,
        onBlur:   useCallback( () => onChange( local ), [ local, onChange ] ),
    }
}
// Uso: <TextControl label="Titolo" { ...useLocalText( title, v => setAttributes({ title: v }) ) } />
```

### LocalRange — RangeControl senza scatti
```js
function LocalRange( { label, value, onChange, min = 0, max = 200, step = 1 } ) {
    const [ local, setLocal ] = useState( value ?? 0 )
    const committed = useRef( value ?? 0 )
    useEffect( () => { setLocal( value ?? 0 ); committed.current = value ?? 0 }, [ value ] )
    const commit = useCallback( () => {
        if ( committed.current !== local ) { committed.current = local; onChange( local ) }
    }, [ local, onChange ] )
    return (
        <div onPointerUp={ commit } onKeyUp={ commit }>
            <RangeControl label={label} value={local} onChange={ setLocal } min={min} max={max} step={step} />
        </div>
    )
}
// Uso: <LocalRange label="Padding" value={paddingTop} onChange={ v => setAttributes({ paddingTop: v }) } max={300} />
```

### wp.media() — selezione immagini in array di oggetti
```js
const openMediaFrame = ( index ) => {
    const frame = wp.media({ title: 'Seleziona immagine', button: { text: 'Seleziona' }, multiple: false })
    frame.on( 'select', function() {
        const att = frame.state().get('selection').first().toJSON()
        const updated = cards.map( ( c, i ) => i === index ? { ...c, mediaUrl: att.url, mediaAlt: att.alt || '' } : c )
        setAttributes({ cards: [ ...updated ] })
    })
    frame.open()
}
```
Import necessari: `import { useState, useEffect, useCallback, useRef } from '@wordpress/element'`

---

## Regole CSS critiche

- `overflow-x: clip` (MAI `hidden`) su `html`/`body` — `hidden` crea scroll container e causa scatti su macOS
- `.container` su tutti i blocchi complessi per allineamento orizzontale
- `--container-width: 1200px` — larghezza max contenuto
- `--container-pad: 0` su desktop, `1.5rem` su mobile (≤1200px)
- Blocchi fullwidth: `width: 100vw; margin-left: calc(50% - 50vw); margin-right: calc(50% - 50vw)`
- `background-attachment: fixed` incompatibile con Lenis → usare GSAP `backgroundPositionY` per parallax

---

## Regole di sviluppo blocchi

**Blocco complesso** (hero, sezioni fullwidth):
- Wrapper esterno fullwidth (`width: 100vw`) per sfondo a tutto schermo
- Inner con classe `.container` per allineare il contenuto a 1200px

**Blocco semplice** (card, testo, immagine):
- Si adatta al contenitore — nessuna larghezza fissa

**Responsive**:
- Tablet ≤1024px: griglia → 1 colonna, padding laterale
- Mobile ≤768px: flex → colonna, blocchi semplici adattivi

---

## Struttura menu

```
header.php
├── #ark-menu-overlay — hamburger fullscreen (mobile)
│   └── .ark-menu__nav → wp_nav_menu (primary)
│       └── sottomenu: toggle JS con max-height animato, bottone .ark-submenu-toggle
├── .site-header
│   ├── .site-header__logo → link a /home/
│   ├── #site-navigation.main-navigation → wp_nav_menu (primary) ← MENU DESKTOP
│   │   └── sottomenu: display:none → block su :hover, padding-bottom sul li per evitare gap
│   └── .ark-hamburger → toggle hamburger
```

**Regola menu**: `menu.js` deve avere un solo `DOMContentLoaded`. Non usare `cat >>` per aggiungere codice.

---

## Animazioni

- GSAP + ScrollTrigger + Lenis (smooth scroll attivo)
- `initLenis()` → `initScrollAnimations()` → `initParallax()` → `initBlockAnimations()` → `initLenisParallax()`
- La funzione `initParallax()` DEVE essere chiusa con `}` prima di `initBlockAnimations()`
- Parallax hero: `gsap.fromTo( el, { backgroundPositionY: '0%' }, { backgroundPositionY: '40%', scrub: true } )`

---

## Workflow di sviluppo

- Build blocco: `npm run build:[blockname]`
- Modifiche file: usare script Python (MAI `cat >>`, MAI `perl`/`sed` per file JS/PHP complessi)
- Verifica sintassi JS: contare `{` e `}` con Python prima del commit
- Commit: `git add . && git commit -m "..." && git push origin main`
- Tag stabile: `git tag -a vX.X.X-stable -m "..." --force && git push origin vX.X.X-stable --force`
- ZIP tema: `zip -r arkimedia_theme.zip arkimedia_theme/ --exclude "*/node_modules/*" --exclude "*/.git/*"`
- Dopo aggiornamento produzione: svuotare cache WP Fastest Cache

---

## File di progetto
- `arkimedia-tema-riepilogo-v2.0.2.md` — riepilogo tecnico completo con note critiche
- `arkimedia-roadmap-v2.md` — roadmap step 1/2/3
- `arkimedia-export-procedure.md` — procedura export/import demo
