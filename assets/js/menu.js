/**
 * Menu — Arkimedia Theme
 */

document.addEventListener( 'DOMContentLoaded', function() {

    // ── Hamburger open/close ──────────────────────────────
    const hamburger = document.getElementById( 'ark-hamburger' )
    const overlay   = document.getElementById( 'ark-menu-overlay' )
    const close     = document.getElementById( 'ark-menu-close' )

    if ( hamburger && overlay ) {
        hamburger.addEventListener( 'click', function() {
            overlay.classList.add( 'is-open' )
            overlay.setAttribute( 'aria-hidden', 'false' )
            hamburger.setAttribute( 'aria-expanded', 'true' )
            document.body.style.overflow = 'hidden'
        })
    }

    if ( close && overlay ) {
        close.addEventListener( 'click', function() {
            overlay.classList.remove( 'is-open' )
            overlay.setAttribute( 'aria-hidden', 'true' )
            hamburger && hamburger.setAttribute( 'aria-expanded', 'false' )
            document.body.style.overflow = ''
        })
    }

    // Chiudi cliccando fuori
    if ( overlay ) {
        overlay.addEventListener( 'click', function( e ) {
            if ( e.target === overlay ) {
                overlay.classList.remove( 'is-open' )
                overlay.setAttribute( 'aria-hidden', 'true' )
                hamburger && hamburger.setAttribute( 'aria-expanded', 'false' )
                document.body.style.overflow = ''
            }
        })
    }

    // ── Sottomenu nel menu hamburger ──────────────────────
    document.querySelectorAll( '.ark-menu__list .menu-item-has-children' ).forEach( function( item ) {
        var submenu = item.querySelector( '.sub-menu' )
        if ( ! submenu ) return

        // Crea bottone toggle
        var toggle = document.createElement( 'button' )
        toggle.className = 'ark-submenu-toggle'
        toggle.innerHTML = '+'
        toggle.type      = 'button'
        item.appendChild( toggle )

        toggle.addEventListener( 'click', function( e ) {
            e.preventDefault()
            e.stopPropagation()

            var isOpen = item.classList.contains( 'is-open' )

            // Chiudi tutti gli altri
            document.querySelectorAll( '.ark-menu__list .menu-item-has-children.is-open' ).forEach( function( el ) {
                if ( el !== item ) {
                    el.classList.remove( 'is-open' )
                    var s = el.querySelector( '.sub-menu' )
                    var t = el.querySelector( '.ark-submenu-toggle' )
                    if ( s ) s.style.maxHeight = '0'
                    if ( t ) { t.innerHTML = '+'; t.setAttribute( 'aria-expanded', 'false' ) }
                }
            })

            // Toggle questo
            if ( isOpen ) {
                item.classList.remove( 'is-open' )
                submenu.style.maxHeight = '0'
                toggle.innerHTML = '+'
                toggle.setAttribute( 'aria-expanded', 'false' )
            } else {
                item.classList.add( 'is-open' )
                submenu.style.maxHeight = submenu.scrollHeight + 'px'
                toggle.innerHTML = '−'
                toggle.setAttribute( 'aria-expanded', 'true' )
            }
        })
    })

})
