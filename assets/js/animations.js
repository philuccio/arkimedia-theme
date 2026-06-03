/**
 * Animazioni GSAP + Lenis — Arkimedia Theme
 *
 * @package Arkimedia
 */

// ── Impostazioni globali ─────────────────────────────────────────────────────
const prefersReduced   = window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches
const animEnabled      = window.ArkAnimations?.enabled  !== false
const parallaxEnabled  = window.ArkAnimations?.parallax !== false
const lenisEnabled     = window.ArkAnimations?.lenis    !== false

// ── Init Lenis ────────────────────────────────────────────────────────────────
let lenis

function initLenis() {
    if ( typeof Lenis === 'undefined' ) return
    if ( ! lenisEnabled ) return

    lenis = new Lenis({
        duration:        0.8,
        easing:          t => Math.min( 1, 1.001 - Math.pow( 2, -10 * t ) ),
        smoothWheel:     true,
        smoothTouch:     false,
        wheelMultiplier: 1,
        touchMultiplier: 1,
    })

    function raf( time ) {
        lenis.raf( time )
        requestAnimationFrame( raf )
    }
    requestAnimationFrame( raf )

    // Sincronizza Lenis con ScrollTrigger
    if ( typeof ScrollTrigger !== 'undefined' ) {
        lenis.on( 'scroll', () => ScrollTrigger.update() )

        gsap.ticker.add( ( time ) => {
            lenis.raf( time * 1000 )
        })
        gsap.ticker.lagSmoothing( 0 )


    }
}

// ── Animazioni on-scroll ──────────────────────────────────────────────────────
function initScrollAnimations() {
    if ( typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' ) return
    if ( prefersReduced || ! animEnabled ) return

    gsap.registerPlugin( ScrollTrigger )

    // ── Fade Up generico ──────────────────────────────────────────────────────
    document.querySelectorAll( '[data-animation="fadeUp"]' ).forEach( el => {
        const delay    = parseFloat( el.dataset.delay    || 0 )
        const duration = parseFloat( el.dataset.duration || 0.8 )

        gsap.from( el, {
            y:        60,
            opacity:  0,
            duration,
            delay,
            ease:     'power3.out',
            scrollTrigger: {
                trigger:      el,
                start:        'top 85%',
                toggleActions: 'play none none none',
            }
        })
    })

    // ── Fade In ───────────────────────────────────────────────────────────────
    document.querySelectorAll( '[data-animation="fadeIn"]' ).forEach( el => {
        const delay    = parseFloat( el.dataset.delay    || 0 )
        const duration = parseFloat( el.dataset.duration || 0.8 )

        gsap.from( el, {
            opacity:  0,
            duration,
            delay,
            ease:     'power2.out',
            scrollTrigger: {
                trigger:      el,
                start:        'top 85%',
                toggleActions: 'play none none none',
            }
        })
    })

    // ── Slide Left ────────────────────────────────────────────────────────────
    document.querySelectorAll( '[data-animation="slideLeft"]' ).forEach( el => {
        gsap.from( el, {
            x:        -80,
            opacity:  0,
            duration: parseFloat( el.dataset.duration || 0.8 ),
            delay:    parseFloat( el.dataset.delay    || 0 ),
            ease:     'power3.out',
            scrollTrigger: {
                trigger:      el,
                start:        'top 85%',
                toggleActions: 'play none none none',
            }
        })
    })

    // ── Slide Right ───────────────────────────────────────────────────────────
    document.querySelectorAll( '[data-animation="slideRight"]' ).forEach( el => {
        gsap.from( el, {
            x:        80,
            opacity:  0,
            duration: parseFloat( el.dataset.duration || 0.8 ),
            delay:    parseFloat( el.dataset.delay    || 0 ),
            ease:     'power3.out',
            scrollTrigger: {
                trigger:      el,
                start:        'top 85%',
                toggleActions: 'play none none none',
            }
        })
    })

    // ── Scale In ──────────────────────────────────────────────────────────────
    document.querySelectorAll( '[data-animation="scaleIn"]' ).forEach( el => {
        gsap.from( el, {
            scale:    0.85,
            opacity:  0,
            duration: parseFloat( el.dataset.duration || 0.8 ),
            delay:    parseFloat( el.dataset.delay    || 0 ),
            ease:     'power3.out',
            scrollTrigger: {
                trigger:      el,
                start:        'top 85%',
                toggleActions: 'play none none none',
            }
        })
    })

    // ── Clip Reveal ───────────────────────────────────────────────────────────
    document.querySelectorAll( '[data-animation="clipReveal"]' ).forEach( el => {
        gsap.from( el, {
            clipPath: 'inset(0 100% 0 0)',
            opacity:  1,
            duration: parseFloat( el.dataset.duration || 1 ),
            delay:    parseFloat( el.dataset.delay    || 0 ),
            ease:     'power4.inOut',
            scrollTrigger: {
                trigger:      el,
                start:        'top 85%',
                toggleActions: 'play none none none',
            }
        })
    })

    // ── Stagger generico ──────────────────────────────────────────────────────
    document.querySelectorAll( '[data-animation="stagger"]' ).forEach( el => {
        const children = el.querySelectorAll( '[data-stagger-item]' )
        if ( ! children.length ) return

        gsap.from( children, {
            y:        50,
            opacity:  0,
            duration: parseFloat( el.dataset.duration || 0.6 ),
            stagger:  parseFloat( el.dataset.stagger  || 0.1 ),
            ease:     'power3.out',
            scrollTrigger: {
                trigger:      el,
                start:        'top 85%',
                toggleActions: 'play none none none',
            }
        })
    })

    // ── Container Arkimedia con data-animation ────────────────────────────────
    document.querySelectorAll( '.ark-container[data-animation], .ark-row[data-animation]' ).forEach( el => {
        const raw = el.dataset.animation
        if ( ! raw ) return

        let config
        try { config = JSON.parse( raw ) } catch { return }
        if ( ! config || config.type === 'none' ) return

        const { type, delay, duration, trigger, scrub } = config
        const dur = ( duration || 800 ) / 1000
        const del = ( delay    || 0 )   / 1000

        const fromVars = {
            opacity:  0,
            duration: dur,
            delay:    del,
            ease:     'power3.out',
            clearProps: 'all',
        }

        switch ( type ) {
            case 'fadeUp':    fromVars.y = 60;  break
            case 'fadeIn':    break
            case 'slideLeft': fromVars.x = -80; break
            case 'slideRight':fromVars.x = 80;  break
            case 'scaleUp':   fromVars.scale = 0.85; break
            case 'flip':      fromVars.rotationX = 90; fromVars.transformOrigin = 'top'; break
        }

        if ( trigger === 'onLoad' ) {
            gsap.from( el, fromVars )
        } else if ( scrub ) {
            gsap.to( el, {
                scrollTrigger: {
                    trigger: el,
                    start:   'top bottom',
                    end:     'top top',
                    scrub:   1,
                },
                y: -60,
            })
        } else {
            gsap.from( el, {
                ...fromVars,
                scrollTrigger: {
                    trigger:      el,
                    start:        'top 85%',
                    toggleActions: 'play none none none',
                }
            })
        }
    })
}

// ── Parallax ──────────────────────────────────────────────────────────────────
function initParallax() {
    if ( typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' ) return
    if ( prefersReduced || ! parallaxEnabled ) return

    // Parallax su elementi con data-parallax
    document.querySelectorAll( '[data-parallax]' ).forEach( el => {
        const speed  = el.dataset.parallaxSpeed || 0.3
        const dir    = el.dataset.parallaxDir   || 'up'
        const yVal   = dir === 'up' ? `-${ speed * 100 }px` : `${ speed * 100 }px`

        gsap.to( el, {
            y: yVal,
            ease: 'none',
            scrollTrigger: {
                trigger: el,
                start:   'top bottom',
                end:     'bottom top',
                scrub:   true,
            }
        })
    })

    // Parallax sfondo Hero e Testata — scroll listener
    const heroEls    = document.querySelectorAll( '.ark-hero' )
    const testataEls = document.querySelectorAll( '.ark-testata' )




// ── Animazioni blocchi specifici ──────────────────────────────────────────────
function initBlockAnimations() {
    if ( typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' ) return
    if ( prefersReduced || ! animEnabled ) return

    // ── Services — stagger card ───────────────────────────────────────────────
    document.querySelectorAll( '.ark-services__grid' ).forEach( grid => {
        const cards = grid.querySelectorAll( '.ark-services__card' )
        if ( ! cards.length ) return

        gsap.from( cards, {
            y:        60,
            opacity:  0,
            duration: 0.7,
            stagger:  0.12,
            ease:     'power3.out',
            scrollTrigger: {
                trigger:      grid,
                start:        'top 80%',
                toggleActions: 'play none none none',
            }
        })
    })

    // ── Services — titolo ─────────────────────────────────────────────────────
    document.querySelectorAll( '.ark-services__header' ).forEach( el => {
        gsap.from( el, {
            y:        40,
            opacity:  0,
            duration: 0.8,
            ease:     'power3.out',
            scrollTrigger: {
                trigger:      el,
                start:        'top 85%',
                toggleActions: 'play none none none',
            }
        })
    })

    // ── Clients — loghi ───────────────────────────────────────────────────────
    document.querySelectorAll( '.ark-clients__item' ).forEach( ( item, i ) => {
        gsap.from( item, {
            opacity:  0,
            scale:    0.9,
            duration: 0.5,
            delay:    i * 0.05,
            ease:     'power2.out',
            scrollTrigger: {
                trigger:      item,
                start:        'top 90%',
                toggleActions: 'play none none none',
            }
        })
    })

    // ── Gallery CTA — immagini ────────────────────────────────────────────────
    document.querySelectorAll( '.ark-gallery-cta__cell' ).forEach( ( cell, i ) => {
        gsap.from( cell, {
            y:        40,
            opacity:  0,
            duration: 0.6,
            delay:    i * 0.06,
            ease:     'power3.out',
            scrollTrigger: {
                trigger:      cell,
                start:        'top 90%',
                toggleActions: 'play none none none',
            }
        })
    })

    // ── Gallery Servizio — immagini ───────────────────────────────────────────
    document.querySelectorAll( '.ark-gallery__item' ).forEach( ( item, i ) => {
        gsap.from( item, {
            y:        30,
            opacity:  0,
            duration: 0.6,
            delay:    ( i % 3 ) * 0.1,
            ease:     'power3.out',
            scrollTrigger: {
                trigger:      item,
                start:        'top 90%',
                toggleActions: 'play none none none',
            }
        })
    })

    // ── Contact Section ───────────────────────────────────────────────────────
    document.querySelectorAll( '.ark-contact__info' ).forEach( el => {
        gsap.from( el, {
            x:        -60,
            opacity:  0,
            duration: 0.9,
            ease:     'power3.out',
            scrollTrigger: {
                trigger:      el,
                start:        'top 80%',
                toggleActions: 'play none none none',
            }
        })
    })

    document.querySelectorAll( '.ark-contact__form-wrap' ).forEach( el => {
        gsap.from( el, {
            x:        60,
            opacity:  0,
            duration: 0.9,
            ease:     'power3.out',
            scrollTrigger: {
                trigger:      el,
                start:        'top 80%',
                toggleActions: 'play none none none',
            }
        })
    })

    // ── Gallery CTA — testo ──────────────────────────────────────────────────
    document.querySelectorAll( '.ark-gallery-cta__header' ).forEach( el => {
        const children = [
            el.querySelector( '.ark-gallery-cta__eyebrow' ),
            el.querySelector( '.ark-gallery-cta__title' ),
        ].filter( Boolean )

        if ( children.length ) {
            gsap.from( children, {
                y:        40,
                opacity:  0,
                duration: 0.7,
                stagger:  0.15,
                ease:     'power3.out',
                scrollTrigger: {
                    trigger:      el,
                    start:        'top 85%',
                    toggleActions: 'play none none none',
                }
            })
        }
    })

    // ── Gallery CTA — pannello CTA ────────────────────────────────────────────
    document.querySelectorAll( '.ark-gallery-cta__cta' ).forEach( el => {
        gsap.from( el, {
            x:        60,
            opacity:  0,
            duration: 0.8,
            ease:     'power3.out',
            scrollTrigger: {
                trigger:      el,
                start:        'top 85%',
                toggleActions: 'play none none none',
            }
        })
    })

    // ── Map pannello info ─────────────────────────────────────────────────────
    document.querySelectorAll( '.ark-map__panel' ).forEach( el => {
        gsap.from( el, {
            x:        -50,
            opacity:  0,
            duration: 0.8,
            ease:     'power3.out',
            scrollTrigger: {
                trigger:      el,
                start:        'top 80%',
                toggleActions: 'play none none none',
            }
        })
    })

    // ── Hero — on-load ────────────────────────────────────────────────────────
    const heroContent = document.querySelector( '.ark-hero .ark-hero__content' )
    if ( heroContent ) {
        const els = [
            heroContent.querySelector( '.ark-hero__eyebrow' ),
            heroContent.querySelector( '.ark-hero__title--1' ),
            heroContent.querySelector( '.ark-hero__title--2' ),
            heroContent.querySelector( '.ark-hero__subtitle' ),
            heroContent.querySelector( '.ark-hero__ctas' ),
        ].filter( Boolean )

        gsap.from( els, {
            y:        40,
            opacity:  0,
            duration: 0.8,
            stagger:  0.12,
            delay:    0.3,
            ease:     'power3.out',
        })
    }
}

// ── Parallax elementi generici con Lenis ──────────────────────────────────────
function initLenisParallax() {
    if ( ! lenis || typeof gsap === 'undefined' ) return
    if ( prefersReduced || ! parallaxEnabled ) return

    // Velocità differenziate per sezioni
    // Fix background-attachment: fixed non funziona con Lenis
    // Sostituiamo con parallax GSAP sulle immagini di sfondo degli hero
    document.querySelectorAll( '.ark-hero[style*="background-image"]' ).forEach( el => {
        gsap.to( el, {
            backgroundPositionY: '30%',
            ease: 'none',
            scrollTrigger: {
                trigger: el,
                start:   'top top',
                end:     'bottom top',
                scrub:   true,
                invalidateOnRefresh: true,
            }
        })
    })

    const sections = [
        { selector: '.ark-services',    speed: 0.05 },
        { selector: '.ark-clients',     speed: 0.08 },
        { selector: '.ark-gallery-cta', speed: 0.06 },
        { selector: '.ark-contact',     speed: 0.04 },
    ]

    sections.forEach( ( { selector, speed } ) => {
        document.querySelectorAll( selector ).forEach( el => {
            gsap.to( el, {
                y:    () => -el.offsetHeight * speed,
                ease: 'none',
                scrollTrigger: {
                    trigger: el,
                    start:   'top bottom',
                    end:     'bottom top',
                    scrub:   1.5,
                    invalidateOnRefresh: true,
                }
            })
        })
    })
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener( 'DOMContentLoaded', () => {
    initLenis()
    initScrollAnimations()
    initParallax()
    initBlockAnimations()
    initLenisParallax()
})
