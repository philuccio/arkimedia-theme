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

// ── Portfolio filter ──────────────────────────────────────────────────────────
const filterBtns = document.querySelectorAll( '.portfolio-filter__btn' )
const portfolioItems = document.querySelectorAll( '.portfolio-item' )

if ( filterBtns.length ) {
    filterBtns.forEach( btn => {
        btn.addEventListener( 'click', () => {

            filterBtns.forEach( b => b.classList.remove( 'is-active' ) )
            btn.classList.add( 'is-active' )

            const filter = btn.dataset.filter

            portfolioItems.forEach( item => {
                if ( filter === '*' || item.dataset.category.includes( filter ) ) {
                    item.classList.remove( 'is-hidden' )
                    gsap.from( item, { opacity: 0, y: 20, duration: 0.4, ease: 'power2.out' } )
                } else {
                    item.classList.add( 'is-hidden' )
                }
            })
        })
    })
}
