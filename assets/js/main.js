/**
 * Script principale tema Arkimedia.
 *
 * @package Arkimedia
 */

document.addEventListener( 'DOMContentLoaded', () => {

    // ── Mobile nav toggle ─────────────────────────────────────────────────
    const toggle = document.querySelector( '.nav__toggle' );
    const menu   = document.querySelector( '.nav__list' );

    if ( toggle && menu ) {
        toggle.addEventListener( 'click', () => {
            const expanded = toggle.getAttribute( 'aria-expanded' ) === 'true';
            toggle.setAttribute( 'aria-expanded', String( ! expanded ) );
            menu.classList.toggle( 'is-open' );
        });
    }

    // ── Header sticky ─────────────────────────────────────────────────────
    const header = document.querySelector( '.site-header' );

    if ( header ) {
        window.addEventListener( 'scroll', () => {
            header.classList.toggle( 'is-sticky', window.scrollY > 80 );
        }, { passive: true });
    }

});
