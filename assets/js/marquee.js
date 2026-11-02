/**
 * Marquee — riempie la larghezza con copie del testo e calcola la durata
 * dalla velocità in px/s. Usato dal sito e dall'anteprima dell'editor.
 *
 * @package Arkimedia
 */

( function() {

    function init( el ) {
        const track = el.querySelector( '.ark-marquee__track' )
        const group = track.querySelector( '.ark-marquee__group' )
        let lastWidth = 0
        let lastGroup = 0

        const removeClones = () => track.querySelectorAll( '[data-clone]' ).forEach( c => c.remove() )

        const build = () => {
            const groupWidth = group.getBoundingClientRect().width
            const width      = el.clientWidth
            if ( ! groupWidth || ! width ) return

            removeClones()

            const copies = Math.ceil( width / groupWidth ) + 1
            for ( let i = 0; i < copies; i++ ) {
                const clone = group.cloneNode( true )
                clone.setAttribute( 'aria-hidden', 'true' )
                clone.setAttribute( 'data-clone', '' )
                track.appendChild( clone )
            }

            const speed = parseFloat( el.dataset.speed ) || 60
            el.style.setProperty( '--ark-marquee-shift', `-${ groupWidth }px` )
            el.style.setProperty( '--ark-marquee-duration', `${ groupWidth / speed }s` )
            el.classList.add( 'is-ready' )
            lastWidth = width
            lastGroup = groupWidth
        }

        build()

        const observer = new ResizeObserver( () => {
            if ( el.clientWidth !== lastWidth || group.getBoundingClientRect().width !== lastGroup ) build()
        })
        observer.observe( el )
        observer.observe( group )

        // I font web cambiano la larghezza del testo
        el.ownerDocument.fonts?.ready.then( build )

        return () => {
            observer.disconnect()
            removeClones()
            el.classList.remove( 'is-ready' )
        }
    }

    window.arkMarquee = { init }

    document.addEventListener( 'DOMContentLoaded', () => {
        document.querySelectorAll( '.ark-marquee' ).forEach( init )
    })

} )()
