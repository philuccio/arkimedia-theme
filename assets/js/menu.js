/**
 * Menu hamburger fullscreen — GSAP
 *
 * @package Arkimedia
 */

document.addEventListener( 'DOMContentLoaded', () => {

    const hamburger  = document.getElementById( 'ark-hamburger' )
    const closeBtn   = document.getElementById( 'ark-menu-close' )
    const overlay    = document.getElementById( 'ark-menu-overlay' )
    const lineTop    = hamburger?.querySelector( '.ark-hamburger__line--top' )
    const lineMid    = hamburger?.querySelector( '.ark-hamburger__line--mid' )
    const lineBot    = hamburger?.querySelector( '.ark-hamburger__line--bot' )
    const menuItems  = overlay?.querySelectorAll( '.ark-menu__list a' )
    const menuFooter = overlay?.querySelector( '.ark-menu__footer' )
    const menuLogo   = overlay?.querySelector( '.ark-menu__logo' )

    if ( ! hamburger || ! overlay ) return

    let isOpen = false

    // ── Hamburger → X ────────────────────────────────────────────────
    const tlHamburger = gsap.timeline({ paused: true })

    tlHamburger
        .to( lineMid, { opacity: 0, duration: 0.15, ease: 'power2.out' } )
        .to( lineTop, { y: 8,  duration: 0.2, ease: 'power2.out' }, '<' )
        .to( lineBot, { y: -8, duration: 0.2, ease: 'power2.out' }, '<' )
        .to( lineTop, { rotation: 45,  duration: 0.2, ease: 'power2.out' } )
        .to( lineBot, { rotation: -45, duration: 0.2, ease: 'power2.out' }, '<' )

    // ── Apertura ──────────────────────────────────────────────────────
    function openMenu() {
        isOpen = true
        hamburger.setAttribute( 'aria-expanded', 'true' )
        overlay.classList.add( 'is-open' )
        overlay.setAttribute( 'aria-hidden', 'false' )
        document.body.style.overflow = 'hidden'

        // Sfondo clip-path
        gsap.fromTo( overlay, {
            clipPath: 'circle(0% at calc(100% - 44px) 40px)',
        }, {
            clipPath: 'circle(150% at calc(100% - 44px) 40px)',
            duration: 0.7,
            ease:     'power3.inOut',
        })

        // Hamburger → X
        tlHamburger.play()

        // Voci menu
        const items = [ ...( menuItems || [] ) ]
        if ( menuFooter ) items.push( menuFooter )
        if ( menuLogo )   items.push( menuLogo )

        gsap.from( Array.from( menuItems || [] ), {
            y:        60,
            opacity:  0,
            duration: 0.5,
            stagger:  0.08,
            ease:     'power3.out',
            delay:    0.3,
        })

        if ( menuFooter ) {
            gsap.from( menuFooter, { opacity: 0, y: 20, duration: 0.4, delay: 0.5 })
        }
        if ( menuLogo ) {
            gsap.from( menuLogo, { opacity: 0, y: 20, duration: 0.4, delay: 0.5 })
        }
    }

    // ── Chiusura ──────────────────────────────────────────────────────
    function closeMenu() {
        isOpen = false
        hamburger.setAttribute( 'aria-expanded', 'false' )
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

    // ── Event listeners ───────────────────────────────────────────────
    hamburger.addEventListener( 'click', () => {
        isOpen ? closeMenu() : openMenu()
    })

    // Tasto X di chiusura
    closeBtn?.addEventListener( 'click', closeMenu )

    // ESC
    document.addEventListener( 'keydown', ( e ) => {
        if ( e.key === 'Escape' && isOpen ) closeMenu()
    })

    // Click su link
    menuItems?.forEach( link => {
        link.addEventListener( 'click', closeMenu )
    })

})

// ── Sottomenu nel menu fullscreen ─────────────────────────
document.addEventListener( 'DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll( '.ark-menu__list .menu-item-has-children' )

    menuItems.forEach( item => {
        const link    = item.querySelector( ':scope > a' )
        const submenu = item.querySelector( ':scope > .sub-menu' )

        if ( ! link || ! submenu ) return

        // Aggiungi freccia
        const arrow = document.createElement( 'span' )
        arrow.className = 'ark-submenu-arrow'
        arrow.innerHTML = '›'
        link.appendChild( arrow )

        // Toggle al click sulla freccia
        arrow.addEventListener( 'click', ( e ) => {
            e.preventDefault()
            e.stopPropagation()
            const isOpen = item.classList.contains( 'ark-submenu-open' )
            // Chiudi tutti
            menuItems.forEach( i => {
                i.classList.remove( 'ark-submenu-open' )
                i.querySelector( '.sub-menu' )?.removeAttribute( 'style' )
            })
            // Apri questo se era chiuso
            if ( ! isOpen ) {
                item.classList.add( 'ark-submenu-open' )
                submenu.style.display = 'block'
            }
        })
    })
})

// ── Sottomenu menu fullscreen ─────────────────────────────
( function() {
    document.addEventListener( 'DOMContentLoaded', function() {
        document.querySelectorAll( '.ark-menu__list .menu-item-has-children > a' ).forEach( function( link ) {
            // Aggiungi toggle
            const toggle = document.createElement( 'button' )
            toggle.className   = 'ark-submenu-toggle'
            toggle.innerHTML   = '+'
            toggle.setAttribute( 'aria-expanded', 'false' )
            link.parentElement.appendChild( toggle )

            toggle.addEventListener( 'click', function(e) {
                e.stopPropagation()
                const item    = this.parentElement
                const submenu = item.querySelector( '.sub-menu' )
                const isOpen  = item.classList.contains( 'is-open' )

                // Chiudi tutti gli altri
                document.querySelectorAll( '.ark-menu__list .menu-item-has-children.is-open' ).forEach( function(el) {
                    if ( el !== item ) {
                        el.classList.remove( 'is-open' )
                        el.querySelector( '.sub-menu' ).style.maxHeight = '0'
                        el.querySelector( '.ark-submenu-toggle' ).innerHTML = '+'
                        el.querySelector( '.ark-submenu-toggle' ).setAttribute( 'aria-expanded', 'false' )
                    }
                })

                // Toggle questo
                if ( isOpen ) {
                    item.classList.remove( 'is-open' )
                    submenu.style.maxHeight = '0'
                    this.innerHTML = '+'
                    this.setAttribute( 'aria-expanded', 'false' )
                } else {
                    item.classList.add( 'is-open' )
                    submenu.style.maxHeight = submenu.scrollHeight + 'px'
                    this.innerHTML = '−'
                    this.setAttribute( 'aria-expanded', 'true' )
                }
            })
        })
    })
})()
