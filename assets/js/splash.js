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
    const enter   = splash.querySelector( '.ark-splash__enter' )
    const line    = splash.querySelector( '.ark-splash__enter-line' )

    // Imposta stato iniziale esplicito prima di animare
    gsap.set( [ logo, tagline, enter ], { opacity: 0, y: 30 } )
    gsap.set( line, { scaleY: 0 } )

    // ── Animazione ingresso ───────────────────────────────────────────────
    const tl = gsap.timeline({ delay: 0.5 })

    tl.to( logo,    { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' } )
      .to( tagline, { opacity: 0.6, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.6' )
      .to( enter,   { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.4' )
      .to( line,    { scaleY: 1, duration: 1, ease: 'power2.inOut' }, '-=0.4' )
      .then( () => {
          // Loop linea solo dopo che l'animazione ingresso è completata
          gsap.to( line, {
              scaleY:   1.3,
              duration: 1.5,
              ease:     'sine.inOut',
              repeat:   -1,
              yoyo:     true,
          })
      })

    // ── Animazione uscita al click ────────────────────────────────────────
    enter.addEventListener( 'click', ( e ) => {
        e.preventDefault()
        const href = enter.getAttribute( 'href' )

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
