<?php
/**
 * Shortcode [ark_slider].
 *
 * Uso: [ark_slider group="hero"]
 *      [ark_slider group="portfolio" effect="fade" autoplay="0"]
 *
 * @package Arkimedia
 */

if ( ! defined( 'ABSPATH' ) ) exit;

function ark_slider_shortcode( array $atts ): string {
    $atts = shortcode_atts( [
        'group'      => '',
        'autoplay'   => '1',
        'speed'      => '800',
        'delay'      => '4000',
        'loop'       => '1',
        'navigation' => '1',
        'pagination' => '1',
        'effect'     => 'slide',
    ], $atts, 'ark_slider' );

    if ( empty( $atts['group'] ) ) return '';

    return ark_get_slider( $atts['group'], [
        'autoplay'   => (bool) $atts['autoplay'],
        'speed'      => (int)  $atts['speed'],
        'delay'      => (int)  $atts['delay'],
        'loop'       => (bool) $atts['loop'],
        'navigation' => (bool) $atts['navigation'],
        'pagination' => (bool) $atts['pagination'],
        'effect'     => sanitize_text_field( $atts['effect'] ),
    ] );
}
add_shortcode( 'ark_slider', 'ark_slider_shortcode' );
