<?php
/**
 * Marquee — markup condiviso da blocco Marquee e Services.
 *
 * @package Arkimedia
 */

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * @param string $text Testo scorrevole.
 * @param array  $args font_size (CSS), speed (px/s), direction (left|right), pause (bool),
 *                     separator (simbolo tra le voci, vuoto per nessuno), separator_size (CSS),
 *                     font (nome Google Font, vuoto per il font del tema).
 */
function ark_render_marquee( string $text, array $args = [] ): string {
    $args = wp_parse_args( $args, [
        'font_size' => '',
        'speed'     => 60,
        'direction' => 'left',
        'pause'     => false,
        'separator' => '•',
        'separator_size' => '1em',
        'font'      => '',
        'color'     => '',
        'separator_color' => '',
    ] );

    $classes = 'ark-marquee';
    if ( $args['direction'] === 'right' ) $classes .= ' ark-marquee--right';
    if ( $args['pause'] )                 $classes .= ' ark-marquee--pause';

    $group_style = $args['font_size'] ? 'font-size:' . $args['font_size'] . ';' : '';

    $font_family = $args['font'] ? ark_enqueue_google_font( $args['font'] ) : '';
    if ( $font_family ) $group_style .= "font-family:{$font_family};";
    if ( $args['color'] ) $group_style .= 'color:' . $args['color'] . ';';

    $sep_style = 'font-size:' . $args['separator_size'] . ';';
    if ( $args['separator_color'] ) $sep_style .= 'color:' . $args['separator_color'] . ';';

    // Una voce per riga; il • resta valido per i testi già salvati.
    // Il separatore finale fa riprendere il testo con lo stesso spazio delle altre voci
    $items = preg_split( '/\s*[•\r\n]+\s*/u', trim( $text ), -1, PREG_SPLIT_NO_EMPTY );
    $items = array_map( fn( $item ) => esc_html( preg_replace( '/\s+/u', ' ', $item ) ), $items );

    $glue = '    ';
    if ( $args['separator'] !== '' ) {
        $glue = sprintf(
            '&nbsp;<span class="ark-marquee__sep" style="%s">%s</span>&nbsp;',
            esc_attr( $sep_style ),
            esc_html( $args['separator'] )
        );
    }

    return sprintf(
        '<div class="%s" data-speed="%s"><div class="ark-marquee__track"><span class="ark-marquee__group" style="%s">%s</span></div></div>',
        esc_attr( $classes ),
        esc_attr( (string) absint( $args['speed'] ) ),
        esc_attr( $group_style ),
        implode( $glue, $items ) . $glue
    );
}
