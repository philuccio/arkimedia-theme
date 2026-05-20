/**
 * Customizer Preview — aggiorna CSS variables in tempo reale.
 *
 * @package Arkimedia
 */

( function( $ ) {

    const root = document.documentElement

    // ── Colori ────────────────────────────────────────────────────────────
    const colorMap = {
        'ark_color_primary':    '--color-primary',
        'ark_color_accent':     '--color-accent',
        'ark_color_text':       '--color-text',
        'ark_color_text_light': '--color-text-light',
        'ark_color_bg':         '--color-bg',
        'ark_color_bg_alt':     '--color-bg-alt',
        'ark_color_border':     '--color-border',
        'ark_color_footer_bg':  '--color-footer-bg',
    }

    Object.entries( colorMap ).forEach( ( [ setting, prop ] ) => {
        wp.customize( setting, ( value ) => {
            value.bind( ( newVal ) => {
                root.style.setProperty( prop, newVal )
            } )
        } )
    } )

    // ── Tipografia ────────────────────────────────────────────────────────
    wp.customize( 'ark_font_heading', ( value ) => {
        value.bind( ( newVal ) => {
            root.style.setProperty( '--font-heading', `'${ newVal }', system-ui, sans-serif` )
        } )
    } )

    wp.customize( 'ark_font_body', ( value ) => {
        value.bind( ( newVal ) => {
            root.style.setProperty( '--font-base', `'${ newVal }', system-ui, sans-serif` )
            document.body.style.fontFamily = `'${ newVal }', system-ui, sans-serif`
        } )
    } )

    wp.customize( 'ark_font_size_base', ( value ) => {
        value.bind( ( newVal ) => {
            root.style.setProperty( '--font-size-base', newVal + 'px' )
        } )
    } )

    wp.customize( 'ark_font_weight_heading', ( value ) => {
        value.bind( ( newVal ) => {
            root.style.setProperty( '--font-weight-heading', newVal )
        } )
    } )

    wp.customize( 'ark_line_height_body', ( value ) => {
        value.bind( ( newVal ) => {
            root.style.setProperty( '--line-height-base', newVal )
        } )
    } )

} )( jQuery )
