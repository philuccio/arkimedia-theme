/**
 * Swiper — inizializzazione slider
 *
 * @package Arkimedia
 */

document.addEventListener( 'DOMContentLoaded', () => {

    document.querySelectorAll( '.ark-slider' ).forEach( el => {

        const opts = JSON.parse( el.dataset.sliderOptions || '{}' );

        const config = {
            loop:   opts.loop  ?? true,
            speed:  opts.speed ?? 800,
            effect: opts.effect ?? 'slide',
            grabCursor: true,
            a11y: {
                prevSlideMessage: 'Slide precedente',
                nextSlideMessage: 'Slide successiva',
            },
        };

        if ( opts.autoplay ) {
            config.autoplay = {
                delay:                opts.delay ?? 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter:    true,
            };
        }

        if ( opts.navigation ) {
            config.navigation = {
                nextEl: el.querySelector( '.swiper-button-next' ),
                prevEl: el.querySelector( '.swiper-button-prev' ),
            };
        }

        if ( opts.pagination ) {
            config.pagination = {
                el:        el.querySelector( '.swiper-pagination' ),
                clickable: true,
            };
        }

        const swiper = new Swiper( el, config );

        // ── Integrazione GSAP: anima contenuto slide ──────────────────────
        if ( typeof gsap !== 'undefined' ) {

            function animateSlide( slide ) {
                const tl = gsap.timeline();
                const eyebrow = slide.querySelector( '.slide__eyebrow' );
                const title   = slide.querySelector( '.slide__title' );
                const text    = slide.querySelector( '.slide__text' );
                const cta     = slide.querySelector( '.slide__cta' );

                if ( eyebrow ) tl.from( eyebrow, { opacity: 0, y: 20, duration: 0.4, clearProps: 'all' } );
                if ( title )   tl.from( title,   { opacity: 0, y: 50, duration: 0.7, ease: 'power3.out', clearProps: 'all' }, '-=0.2' );
                if ( text )    tl.from( text,     { opacity: 0, y: 30, duration: 0.5, clearProps: 'all' }, '-=0.3' );
                if ( cta )     tl.from( cta,      { opacity: 0, scale: 0.9, duration: 0.4, clearProps: 'all' }, '-=0.2' );
            }

            swiper.on( 'init', s => animateSlide( s.slides[ s.activeIndex ] ) );
            swiper.on( 'slideChangeTransitionStart', s => animateSlide( s.slides[ s.activeIndex ] ) );
        }

        swiper.init();

    });

});
