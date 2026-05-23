/**
 * Menu hamburger fullscreen — GSAP
 *
 * @package Arkimedia
 */

document.addEventListener( 'DOMContentLoaded', () => {

    const hamburger = document.getElementById( 'ark-hamburger' )
    const overlay   = document.getElementById( 'ark-menu-overlay' )
    const lineTop   = hamburger?.querySelector( '.ark-hamburger__line--top' )
    const lineMid   = hamburger?.querySelector( '.ark-hamburger__line--mid' )
    const lineBot   = hamburger?.querySelector( '.ark-hamburger__line--bot' )
    const menuItems = overlay?.querySelectorAll( '.ark-menu__list a' )
    const menuFooter = overlay?.querySelector( '.ark-menu__footer' )

    if ( ! hamburger || ! overlay ) return

    let isOpen = false

    // ── Timeline apertura ─────────────────────────────────────────────
    const tlOpen = gsap.timeline({ paused: true })

    tlOpen
        // Apre overlay con clip-path
        .to( overlay, {
            duration:  0,
            onStart: () => {
                overlay.classList.add( 'is-open' )
                overlay.setAttribute( 'aria-hidden', 'false' )
                document.body.style.overflow = 'hidden'
            }
        })
        .fromTo( overlay, {
            '--clip': 'circle(0% at calc(100% - 44px) 44px)',
        }, {
            '--clip': 'circle(150% at calc(100% - 44px) 44px)',
            duration: 0,
        })
        // Animazione sfondo con CSS
        .call( () => {
            overlay.style.setProperty( '--menu-open', '1' )
        })

    // Hamburger → X
    const tlHamburger = gsap.timeline({ paused: true })

    tlHamburger
        .to( lineMid, { opacity: 0, duration: 0.15, ease: 'power2.out' } )
        .to( lineTop, { y: 8, duration: 0.2, ease: 'power2.out' }, '<' )
        .to( lineBot, { y: -8, duration: 0.2, ease: 'power2.out' }, '<' )
        .to( lineTop, { rotation: 45, duration: 0.2, ease: 'power2.out' } )
        .to( lineBot, { rotation: -45, duration: 0.2, ease: 'power2.out' }, '<' )

    // Voci menu — entrata
    const tlItems = gsap.timeline({ paused: true })

    if ( menuItems?.length ) {
        tlItems.from( Array.from( menuItems ), {
            y:        60,
            opacity:  0,
            duration: 0.5,
            stagger:  0.08,
            ease:     'power3.out',
        }, 0.2 )
    }

    if ( menuFooter ) {
        tlItems.from( menuFooter, {
            opacity:  0,
            y:        20,
            duration: 0.4,
        }, 0.5 )
    }

    // ── Toggle ────────────────────────────────────────────────────────
    function openMenu() {
        isOpen = true
        hamburger.setAttribute( 'aria-expanded', 'true' )
        hamburger.setAttribute( 'aria-label', 'Chiudi menu' )
        overlay.classList.add( 'is-open' )
        overlay.setAttribute( 'aria-hidden', 'false' )
        document.body.style.overflow = 'hidden'

        // Anima sfondo
        gsap.fromTo( overlay, {
            clipPath: 'circle(0% at calc(100% - 44px) 40px)',
        }, {
            clipPath: 'circle(150% at calc(100% - 44px) 40px)',
            duration: 0.7,
            ease:     'power3.inOut',
        })

        tlHamburger.play()
        tlItems.restart()
    }

    function closeMenu() {
        isOpen = false
        hamburger.setAttribute( 'aria-expanded', 'false' )
        hamburger.setAttribute( 'aria-label', 'Apri menu' )
        document.body.style.overflow = ''

        gsap.to( overlay, {
            clipPath: 'circle(0% at calc(100% - 44px) 40px)',
            duration: 0.5,
            ease:     'power3.inOut',
            onComplete: () => {
                overlay.classList.remove( 'is-open' )
                overlay.setAttribute( 'aria-hidden', 'true' )
            }
        })

        tlHamburger.reverse()
    }

    hamburger.addEventListener( 'click', () => {
        isOpen ? closeMenu() : openMenu()
    })

    // Chiudi con ESC
    document.addEventListener( 'keydown', ( e ) => {
        if ( e.key === 'Escape' && isOpen ) closeMenu()
    })

    // Chiudi al click su link
    menuItems?.forEach( link => {
        link.addEventListener( 'click', closeMenu )
    })

})
