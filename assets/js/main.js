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
            header.classList.toggle( 'is-sticky', window.scrollY > 50 );
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

// ── Gallery Servizio — filtro città ──────────────────────────────────────────
// Le foto escluse vengono tolte dal DOM: così il bento si ricompone
// e il lightbox scorre solo quelle della città scelta.
document.querySelectorAll( '.ark-gallery__filter' ).forEach( filter => {
    const grid  = filter.parentElement.querySelector( '.ark-gallery__grid' )
    const items = Array.from( grid.querySelectorAll( '.ark-gallery__item' ) )
    const btns  = filter.querySelectorAll( '.ark-gallery__filter-btn' )

    btns.forEach( btn => {
        btn.addEventListener( 'click', () => {

            btns.forEach( b => {
                b.classList.toggle( 'is-active', b === btn )
                b.setAttribute( 'aria-pressed', b === btn )
            })

            const city    = btn.dataset.city
            const visible = items.filter( item => city === 'all' || item.dataset.city === city )

            grid.replaceChildren( ...visible )

            gsap.killTweensOf( items )
            gsap.fromTo( visible,
                { opacity: 0, y: 20 },
                {
                    opacity:    1,
                    y:          0,
                    duration:   window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches ? 0 : 0.4,
                    ease:       'power2.out',
                    clearProps: 'transform,opacity',
                }
            )

            ScrollTrigger.refresh()
        })
    })
})

// ── Fancybox init ─────────────────────────────────────────────────────────────
document.addEventListener( 'DOMContentLoaded', () => {
    if ( typeof Fancybox !== 'undefined' ) {
        Fancybox.bind( '[data-fancybox]', {
            animated:  true,
            closeButton: true,
            Toolbar: {
                display: {
                    left:   [ 'infobar' ],
                    middle: [],
                    right:  [ 'slideshow', 'fullscreen', 'close' ],
                },
            },
        })
    }
})
