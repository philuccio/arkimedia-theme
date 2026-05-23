/**
 * Animazioni GSAP + ScrollTrigger + Lenis
 *
 * @package Arkimedia
 */

document.addEventListener( 'DOMContentLoaded', () => {

    // ── Lenis smooth scroll ───────────────────────────────────────────────
    const lenis = new Lenis({
        lerp:      0.1,
        duration:  1.2,
        smoothWheel: true,
    });

    lenis.on( 'scroll', ScrollTrigger.update );

    gsap.ticker.add( ( time ) => {
        lenis.raf( time * 1000 );
    });

    gsap.ticker.lagSmoothing( 0 );

    // ── GSAP defaults ─────────────────────────────────────────────────────
    gsap.registerPlugin( ScrollTrigger );

    gsap.defaults({
        ease:     'power3.out',
        duration: 0.8,
    });

    // ── Rispetta prefers-reduced-motion ───────────────────────────────────
    const prefersReduced = window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;
    if ( prefersReduced ) return;

    // ── Hero animation ────────────────────────────────────────────────────
    const heroTl = gsap.timeline();

    if ( document.querySelector( '.hero__eyebrow' ) ) {
        heroTl
            .from( '.hero__eyebrow', { opacity: 0, y: 20, duration: 0.5 } )
            .from( '.hero__title',   { opacity: 0, y: 50, duration: 0.8 }, '-=0.2' )
            .from( '.hero__text',    { opacity: 0, y: 30, duration: 0.6 }, '-=0.3' )
            .from( '.hero__cta',     { opacity: 0, scale: 0.9, duration: 0.5 }, '-=0.2' );
    }

    // ── Scroll reveal generico ────────────────────────────────────────────
    gsap.utils.toArray( '.reveal' ).forEach( el => {
        gsap.from( el, {
            scrollTrigger: {
                trigger:      el,
                start:        'top 85%',
                toggleActions: 'play none none none',
            },
            opacity:  0,
            y:        40,
            duration: 0.7,
            clearProps: 'all',
        });
    });

    // ── Stagger card ──────────────────────────────────────────────────────
    ScrollTrigger.batch( '.card', {
        onEnter: batch => gsap.from( batch, {
            opacity:  0,
            y:        50,
            stagger:  0.12,
            duration: 0.7,
            clearProps: 'all',
        }),
        start: 'top 88%',
    });

    // ── Parallax immagini ─────────────────────────────────────────────────
    gsap.utils.toArray( '.parallax' ).forEach( el => {
        gsap.to( el, {
            scrollTrigger: {
                trigger: el,
                start:   'top bottom',
                end:     'bottom top',
                scrub:   1,
            },
            y: 80,
        });
    });

});

// ── Container GSAP animations ─────────────────────────────────────────────────
document.addEventListener( 'DOMContentLoaded', () => {

    document.querySelectorAll( '.ark-container[data-animation]' ).forEach( el => {
        const raw = el.dataset.animation
        if ( ! raw ) return

        let config
        try { config = JSON.parse( raw ) } catch { return }
        if ( ! config || config.type === 'none' ) return

        const { type, delay, duration, trigger, scrub } = config
        const dur = duration / 1000
        const del = delay / 1000

        const fromVars = { opacity: 0, duration: dur, delay: del, ease: 'power3.out', clearProps: 'all' }

        switch ( type ) {
            case 'fadeUp':    fromVars.y = 60; break
            case 'fadeIn':    break
            case 'slideLeft': fromVars.x = -80; break
            case 'slideRight':fromVars.x = 80; break
            case 'scaleUp':   fromVars.scale = 0.85; break
            case 'flip':      fromVars.rotationX = 90; fromVars.transformOrigin = 'top'; break
        }

        if ( trigger === 'onLoad' ) {
            gsap.from( el, fromVars )
        } else {
            if ( scrub ) {
                gsap.to( el, {
                    scrollTrigger: { trigger: el, start: 'top bottom', end: 'top top', scrub: 1 },
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
        }
    })
})
