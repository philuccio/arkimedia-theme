<?php
/**
 * Customizer — Colori, Tipografia, Splash Page, Footer.
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
        'ark_color_primary'    => [ __( 'Colore primario',           'arkimedia' ), '#1a1a2e' ],
        'ark_color_accent'     => [ __( 'Colore accent',             'arkimedia' ), '#e94560' ],
        'ark_color_text'       => [ __( 'Colore testo',              'arkimedia' ), '#1a1a1a' ],
        'ark_color_text_light' => [ __( 'Colore testo secondario',   'arkimedia' ), '#555555' ],
        'ark_color_bg'         => [ __( 'Colore sfondo',             'arkimedia' ), '#ffffff' ],
        'ark_color_bg_alt'     => [ __( 'Colore sfondo alternativo', 'arkimedia' ), '#f5f5f5' ],
        'ark_color_border'     => [ __( 'Colore bordi',              'arkimedia' ), '#e5e5e5' ],
        'ark_color_footer_bg'  => [ __( 'Colore sfondo footer', 'arkimedia' ), '#0a0a0a' ],
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
        'Inter'             => 'Inter',
        'Roboto'            => 'Roboto',
        'Open Sans'         => 'Open Sans',
        'Lato'              => 'Lato',
        'Montserrat'        => 'Montserrat',
        'Raleway'           => 'Raleway',
        'Poppins'           => 'Poppins',
        'Nunito'            => 'Nunito',
        'Playfair Display'  => 'Playfair Display',
        'Merriweather'      => 'Merriweather',
        'Lora'              => 'Lora',
        'PT Serif'          => 'PT Serif',
        'Source Serif 4'    => 'Source Serif 4',
        'DM Sans'           => 'DM Sans',
        'DM Serif Display'  => 'DM Serif Display',
        'Fraunces'          => 'Fraunces',
        'Syne'              => 'Syne',
        'Space Grotesk'     => 'Space Grotesk',
        'Outfit'            => 'Outfit',
        'Plus Jakarta Sans' => 'Plus Jakarta Sans',
    ];

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
            '300' => __( 'Light (300)',     'arkimedia' ),
            '400' => __( 'Regular (400)',   'arkimedia' ),
            '500' => __( 'Medium (500)',    'arkimedia' ),
            '600' => __( 'SemiBold (600)', 'arkimedia' ),
            '700' => __( 'Bold (700)',      'arkimedia' ),
            '800' => __( 'ExtraBold (800)','arkimedia' ),
            '900' => __( 'Black (900)',     'arkimedia' ),
        ],
    ] );

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
    // SEZIONE: Header
    // ════════════════════════════════════════════════════════════════════
    $wp_customize->add_section( 'ark_header', [
        'title'    => __( 'Header', 'arkimedia' ),
        'priority' => 28,
    ] );

    $wp_customize->add_setting( 'ark_header_sticky_bg', [
        'default'           => '#1a1a2e',
        'sanitize_callback' => 'sanitize_hex_color',
        'transport'         => 'postMessage',
    ] );
    $wp_customize->add_control(
        new WP_Customize_Color_Control( $wp_customize, 'ark_header_sticky_bg', [
            'label'       => __( 'Colore sfondo header on scroll', 'arkimedia' ),
            'description' => __( 'Colore che appare quando l\'header diventa sticky.', 'arkimedia' ),
            'section'     => 'ark_header',
        ] )
    );

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

    // ════════════════════════════════════════════════════════════════════
    // SEZIONE: Contatti
    // ════════════════════════════════════════════════════════════════════
    // SEZIONE: Contatti
    // ════════════════════════════════════════════════════════════════════
    $wp_customize->add_section( 'ark_contact', [
        'title'    => __( 'Form Contatti', 'arkimedia' ),
        'priority' => 32,
    ] );

    $wp_customize->add_setting( 'ark_contact_email', [
        'default'           => get_option( 'admin_email' ),
        'sanitize_callback' => 'sanitize_email',
        'transport'         => 'refresh',
    ] );
    $wp_customize->add_control( 'ark_contact_email', [
        'label'       => __( 'Email destinatario', 'arkimedia' ),
        'description' => __( 'Email che riceve i messaggi del form contatti.', 'arkimedia' ),
        'section'     => 'ark_contact',
        'type'        => 'email',
    ] );

    // ════════════════════════════════════════════════════════════════════
    // SEZIONE: Footer
    // ════════════════════════════════════════════════════════════════════
    // SEZIONE: Footer
    // ════════════════════════════════════════════════════════════════════
    $wp_customize->add_section( 'ark_footer', [
        'title'    => __( 'Footer', 'arkimedia' ),
        'priority' => 35,
    ] );

    $wp_customize->add_setting( 'ark_footer_piva', [
        'default'           => '',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'refresh',
    ] );
    $wp_customize->add_control( 'ark_footer_piva', [
        'label'       => __( 'Partita IVA', 'arkimedia' ),
        'description' => __( 'Es. P.IVA 01234567890', 'arkimedia' ),
        'section'     => 'ark_footer',
        'type'        => 'text',
    ] );
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

// ── Animazioni globali ────────────────────────────────────────────────────────
function ark_register_animations_customizer( WP_Customize_Manager $wp_customize ): void {

    $wp_customize->add_section( 'ark_animations', [
        'title'    => __( 'Animazioni', 'arkimedia' ),
        'priority' => 35,
    ] );

    $wp_customize->add_setting( 'ark_animations_enabled', [
        'default'           => true,
        'sanitize_callback' => 'rest_sanitize_boolean',
        'transport'         => 'refresh',
    ] );
    $wp_customize->add_control( 'ark_animations_enabled', [
        'label'   => __( 'Abilita animazioni on-scroll', 'arkimedia' ),
        'section' => 'ark_animations',
        'type'    => 'checkbox',
    ] );

    $wp_customize->add_setting( 'ark_parallax_enabled', [
        'default'           => true,
        'sanitize_callback' => 'rest_sanitize_boolean',
        'transport'         => 'refresh',
    ] );
    $wp_customize->add_control( 'ark_parallax_enabled', [
        'label'   => __( 'Abilita effetti parallax', 'arkimedia' ),
        'section' => 'ark_animations',
        'type'    => 'checkbox',
    ] );

    $wp_customize->add_setting( 'ark_lenis_enabled', [
        'default'           => true,
        'sanitize_callback' => 'rest_sanitize_boolean',
        'transport'         => 'refresh',
    ] );
    $wp_customize->add_control( 'ark_lenis_enabled', [
        'label'   => __( 'Abilita smooth scroll (Lenis)', 'arkimedia' ),
        'section' => 'ark_animations',
        'type'    => 'checkbox',
    ] );
}
add_action( 'customize_register', 'ark_register_animations_customizer' );
