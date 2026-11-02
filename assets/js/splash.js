/**
 * Splash Page — Animazioni GSAP
 *
 * @package Arkimedia
 */

document.addEventListener( 'DOMContentLoaded', () => {

    const splash = document.querySelector( '.ark-splash' )
    if ( ! splash ) return

    const logo    = splash.querySelector( '.ark-splash__logo, .ark-splash__site-name' )
    const tagline = splash.querySelector( '.ark-splash__tagline' )
    const langs   = splash.querySelector( '.ark-splash__langs' )

    // Imposta stato iniziale esplicito prima di animare
    gsap.set( [ logo, tagline, langs ], { opacity: 0, y: 30 } )

    // ── Animazione ingresso ───────────────────────────────────────────────
    const tl = gsap.timeline({ delay: 0.5 })

    tl.to( logo,    { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' } )
      .to( tagline, { opacity: 0.6, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.6' )
      .to( langs,   { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.4' )

    // ── Animazione uscita al click ────────────────────────────────────────
    splash.querySelectorAll( 'a.ark-splash__lang' ).forEach( ( link ) => {
        link.addEventListener( 'click', ( e ) => {
            e.preventDefault()
            const href = link.getAttribute( 'href' )

            gsap.to( splash, {
                opacity:  0,
                duration: 0.8,
                ease:     'power2.inOut',
                onComplete: () => {
                    window.location.href = href
                }
            })
        })
    })

})
