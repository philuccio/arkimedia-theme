<?php
/**
 * Customizer — Colori, Tipografia, Splash Page.
 *
 * @package Arkimedia
 */

if ( ! defined( 'ABSPATH' ) ) exit;

function ark_customizer( WP_Customize_Manager $wp_customize ): void {

    // ════════════════════════════════════════════════════════════════════
    // PANNELLO IDENTITÀ VISIVA
    // ════════════════════════════════════════════════════════════════════
    $wp_customize->add_panel( 'ark_identity', [
        'title'    => __( 'Identità visiva', 'arkimedia' ),
        'priority' => 25,
    ] );

    // ── SEZIONE: Colori ──────────────────────────────────────────────────
    $wp_customize->add_section( 'ark_colors', [
        'title'    => __( 'Colori', 'arkimedia' ),
        'panel'    => 'ark_identity',
        'priority' => 10,
    ] );

    $color_settings = [
        'ark_color_primary'    => [ __( 'Colore primario',            'arkimedia' ), '#1a1a2e' ],
        'ark_color_accent'     => [ __( 'Colore accent',              'arkimedia' ), '#e94560' ],
        'ark_color_text'       => [ __( 'Colore testo',               'arkimedia' ), '#1a1a1a' ],
        'ark_color_text_light' => [ __( 'Colore testo secondario',    'arkimedia' ), '#555555' ],
        'ark_color_bg'         => [ __( 'Colore sfondo',              'arkimedia' ), '#ffffff' ],
        'ark_color_bg_alt'     => [ __( 'Colore sfondo alternativo',  'arkimedia' ), '#f5f5f5' ],
        'ark_color_border'     => [ __( 'Colore bordi',               'arkimedia' ), '#e5e5e5' ],
        'ark_color_footer_bg'  => [ __( 'Colore sfondo footer',       'arkimedia' ), '#1a1a2e' ],
    ];

    foreach ( $color_settings as $id => [ $label, $default ] ) {
        $wp_customize->add_setting( $id, [
            'default'           => $default,
            'sanitize_callback' => 'sanitize_hex_color',
            'transport'         => 'postMessage',
        ] );
        $wp_customize->add_control(
            new WP_Customize_Color_Control( $wp_customize, $id, [
                'label'   => $label,
                'section' => 'ark_colors',
            ] )
        );
    }

    // ── SEZIONE: Tipografia ──────────────────────────────────────────────
    $wp_customize->add_section( 'ark_typography', [
        'title'    => __( 'Tipografia', 'arkimedia' ),
        'panel'    => 'ark_identity',
        'priority' => 20,
    ] );

    $google_fonts = [
        'Inter'              => 'Inter',
        'Roboto'             => 'Roboto',
        'Open Sans'          => 'Open Sans',
        'Lato'               => 'Lato',
        'Montserrat'         => 'Montserrat',
        'Raleway'            => 'Raleway',
        'Poppins'            => 'Poppins',
        'Nunito'             => 'Nunito',
        'Playfair Display'   => 'Playfair Display',
        'Merriweather'       => 'Merriweather',
        'Lora'               => 'Lora',
        'PT Serif'           => 'PT Serif',
        'Source Serif 4'     => 'Source Serif 4',
        'DM Sans'            => 'DM Sans',
        'DM Serif Display'   => 'DM Serif Display',
        'Fraunces'           => 'Fraunces',
        'Syne'               => 'Syne',
        'Space Grotesk'      => 'Space Grotesk',
        'Outfit'             => 'Outfit',
        'Plus Jakarta Sans'  => 'Plus Jakarta Sans',
    ];

    $font_options = array_map( fn( $f ) => [ 'label' => $f, 'value' => $f ], array_keys( $google_fonts ) );

    // Font titoli
    $wp_customize->add_setting( 'ark_font_heading', [
        'default'           => 'Inter',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ] );
    $wp_customize->add_control( 'ark_font_heading', [
        'label'   => __( 'Font titoli', 'arkimedia' ),
        'section' => 'ark_typography',
        'type'    => 'select',
        'choices' => array_combine( array_keys( $google_fonts ), array_keys( $google_fonts ) ),
    ] );

    // Font corpo
    $wp_customize->add_setting( 'ark_font_body', [
        'default'           => 'Inter',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ] );
    $wp_customize->add_control( 'ark_font_body', [
        'label'   => __( 'Font corpo', 'arkimedia' ),
        'section' => 'ark_typography',
        'type'    => 'select',
        'choices' => array_combine( array_keys( $google_fonts ), array_keys( $google_fonts ) ),
    ] );

    // Dimensione testo base
    $wp_customize->add_setting( 'ark_font_size_base', [
        'default'           => '16',
        'sanitize_callback' => 'absint',
        'transport'         => 'postMessage',
    ] );
    $wp_customize->add_control( 'ark_font_size_base', [
        'label'       => __( 'Dimensione testo base (px)', 'arkimedia' ),
        'section'     => 'ark_typography',
        'type'        => 'range',
        'input_attrs' => [ 'min' => 14, 'max' => 20, 'step' => 1 ],
    ] );

    // Peso font titoli
    $wp_customize->add_setting( 'ark_font_weight_heading', [
        'default'           => '700',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ] );
    $wp_customize->add_control( 'ark_font_weight_heading', [
        'label'   => __( 'Peso font titoli', 'arkimedia' ),
        'section' => 'ark_typography',
        'type'    => 'select',
        'choices' => [
            '300' => __( 'Light (300)',    'arkimedia' ),
            '400' => __( 'Regular (400)', 'arkimedia' ),
            '500' => __( 'Medium (500)',  'arkimedia' ),
            '600' => __( 'SemiBold (600)','arkimedia' ),
            '700' => __( 'Bold (700)',    'arkimedia' ),
            '800' => __( 'ExtraBold (800)','arkimedia' ),
            '900' => __( 'Black (900)',   'arkimedia' ),
        ],
    ] );

    // Interlinea corpo
    $wp_customize->add_setting( 'ark_line_height_body', [
        'default'           => '1.6',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ] );
    $wp_customize->add_control( 'ark_line_height_body', [
        'label'       => __( 'Interlinea testo corpo', 'arkimedia' ),
        'section'     => 'ark_typography',
        'type'        => 'range',
        'input_attrs' => [ 'min' => '1.2', 'max' => '2.0', 'step' => '0.1' ],
    ] );

    // ════════════════════════════════════════════════════════════════════
    // SEZIONE: Splash Page
    // ════════════════════════════════════════════════════════════════════
    $wp_customize->add_section( 'ark_splash', [
        'title'    => __( 'Splash Page', 'arkimedia' ),
        'priority' => 30,
    ] );

    $wp_customize->add_setting( 'ark_splash_link', [
        'default'           => home_url( '/home/' ),
        'sanitize_callback' => 'esc_url_raw',
        'transport'         => 'refresh',
    ] );
    $wp_customize->add_control( 'ark_splash_link', [
        'label'   => __( 'URL destinazione', 'arkimedia' ),
        'section' => 'ark_splash',
        'type'    => 'url',
    ] );

    $wp_customize->add_setting( 'ark_splash_label', [
        'default'           => __( 'Entra nel sito', 'arkimedia' ),
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'refresh',
    ] );
    $wp_customize->add_control( 'ark_splash_label', [
        'label'   => __( 'Testo invito', 'arkimedia' ),
        'section' => 'ark_splash',
        'type'    => 'text',
    ] );

    $wp_customize->add_setting( 'ark_splash_bg', [
        'default'           => '#1a1a2e',
        'sanitize_callback' => 'sanitize_hex_color',
        'transport'         => 'refresh',
    ] );
    $wp_customize->add_control(
        new WP_Customize_Color_Control( $wp_customize, 'ark_splash_bg', [
            'label'   => __( 'Colore sfondo splash', 'arkimedia' ),
            'section' => 'ark_splash',
        ] )
    );

    $wp_customize->add_setting( 'ark_splash_color', [
        'default'           => '#ffffff',
        'sanitize_callback' => 'sanitize_hex_color',
        'transport'         => 'refresh',
    ] );
    $wp_customize->add_control(
        new WP_Customize_Color_Control( $wp_customize, 'ark_splash_color', [
            'label'   => __( 'Colore testo splash', 'arkimedia' ),
            'section' => 'ark_splash',
        ] )
    );
}
add_action( 'customize_register', 'ark_customizer' );


// ── Preview in tempo reale (postMessage) ──────────────────────────────────────
function ark_customizer_preview_js(): void {
    wp_enqueue_script(
        'arkimedia-customizer-preview',
        ARK_URI . '/assets/js/customizer-preview.js',
        [ 'customize-preview' ],
        ARK_VERSION,
        true
    );
}
add_action( 'customize_preview_init', 'ark_customizer_preview_js' );
