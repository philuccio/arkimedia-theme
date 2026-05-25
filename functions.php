<?php
/**
 * Funzioni e definizioni del tema Arkimedia.
 *
 * @package Arkimedia
 */

if ( ! defined( 'ABSPATH' ) ) exit;

// ── Costanti ──────────────────────────────────────────────────────────────────
define( 'ARK_VERSION',  wp_get_theme()->get( 'Version' ) );
define( 'ARK_DIR',      get_template_directory() );
define( 'ARK_URI',      get_template_directory_uri() );

// ── Theme Setup ───────────────────────────────────────────────────────────────
function ark_setup(): void {

    load_theme_textdomain( 'arkimedia', ARK_DIR . '/languages' );

    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'custom-logo' );
    add_theme_support( 'html5', [
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'style',
        'script',
    ] );
    add_theme_support( 'wp-block-styles' );
    add_theme_support( 'responsive-embeds' );
    add_theme_support( 'align-wide' );

    register_nav_menus( [
        'primary' => __( 'Menu principale', 'arkimedia' ),
        'footer'  => __( 'Menu footer', 'arkimedia' ),
    ] );

    add_image_size( 'arkimedia-hero',  1920, 1080, true );
    add_image_size( 'arkimedia-card',   800,  600, true );
    add_image_size( 'arkimedia-thumb',  400,  300, true );
}
add_action( 'after_setup_theme', 'ark_setup' );

// ── Enqueue Assets ────────────────────────────────────────────────────────────
function ark_enqueue_assets(): void {

    // CSS principale
    wp_enqueue_style(
        'arkimedia-style',
        ARK_URI . '/assets/css/main.css',
        [],
        ARK_VERSION
    );

    wp_enqueue_style(
        'arkimedia-responsive',
        ARK_URI . '/assets/css/responsive.css',
        [ 'arkimedia-style' ],
        ARK_VERSION
    );

    // Lenis (smooth scroll)
    wp_enqueue_style(
        'lenis-css',
        'https://unpkg.com/lenis@1.3.23/dist/lenis.css',
        [],
        '1.3.23'
    );

    // GSAP
    wp_enqueue_script(
        'gsap',
        'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js',
        [],
        '3.12.5',
        true
    );
    wp_enqueue_script(
        'gsap-scrolltrigger',
        'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js',
        [ 'gsap' ],
        '3.12.5',
        true
    );

    // Lenis JS
    wp_enqueue_script(
        'lenis-js',
        'https://unpkg.com/lenis@1.3.23/dist/lenis.min.js',
        [],
        '1.3.23',
        true
    );

    // Swiper (solo se la pagina ha uno slider)
    if ( ark_page_has_slider() ) {
        wp_enqueue_style(
            'swiper-css',
            'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css',
            [],
            '11'
        );
        wp_enqueue_script(
            'swiper-js',
            'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js',
            [],
            '11',
            true
        );
        wp_enqueue_script(
            'arkimedia-slider',
            ARK_URI . '/assets/js/slider.js',
            [ 'swiper-js' ],
            ARK_VERSION,
            true
        );
    }

    // Animazioni GSAP
    wp_enqueue_script(
        'arkimedia-animations',
        ARK_URI . '/assets/js/animations.js',
        [ 'gsap', 'gsap-scrolltrigger', 'lenis-js' ],
        ARK_VERSION,
        true
    );

    // Script principale
    wp_enqueue_script(
        'arkimedia-main',
        ARK_URI . '/assets/js/main.js',
        [ 'arkimedia-animations' ],
        ARK_VERSION,
        true
    );

    // Passa dati PHP → JS
    wp_localize_script( 'arkimedia-main', 'Arkimedia', [
        'ajaxUrl' => admin_url( 'admin-ajax.php' ),
        'nonce'   => wp_create_nonce( 'arkimedia_nonce' ),
        'homeUrl' => home_url(),
    ] );
}
add_action( 'wp_enqueue_scripts', 'ark_enqueue_assets' );

// ── Helper: la pagina ha uno slider? ─────────────────────────────────────────
function ark_page_has_slider(): bool {
    // Controlla se esiste almeno una slide per questa pagina
    // (espandibile con meta box o tassonomia)
    return is_front_page() || is_page( 'portfolio' ) || has_block( 'arkimedia/slider' );
}

// ── Widget Areas ──────────────────────────────────────────────────────────────
function ark_widgets_init(): void {
    register_sidebar( [
        'name'          => __( 'Sidebar principale', 'arkimedia' ),
        'id'            => 'sidebar-1',
        'description'   => __( 'Aggiungi widget alla sidebar.', 'arkimedia' ),
        'before_widget' => '<section id="%1$s" class="widget %2$s">',
        'after_widget'  => '</section>',
        'before_title'  => '<h2 class="widget-title">',
        'after_title'   => '</h2>',
    ] );

    register_sidebar( [
        'name'          => __( 'Footer', 'arkimedia' ),
        'id'            => 'footer-1',
        'description'   => __( 'Aggiungi widget al footer.', 'arkimedia' ),
        'before_widget' => '<section id="%1$s" class="widget %2$s">',
        'after_widget'  => '</section>',
        'before_title'  => '<h2 class="widget-title">',
        'after_title'   => '</h2>',
    ] );
}
add_action( 'widgets_init', 'ark_widgets_init' );

// ── Include moduli ────────────────────────────────────────────────────────────
$ark_includes = [
    '/inc/cpt-slider.php',
    '/inc/meta-slide.php',
    '/inc/slider-query.php',
    '/inc/shortcodes.php',
    '/inc/cpt-portfolio.php',
    '/inc/meta-portfolio.php',
    '/inc/customizer.php',
    '/inc/custom-css.php',
    '/inc/contact-form.php',
    '/inc/gallery-api.php',
];

foreach ( $ark_includes as $file ) {
    $path = ARK_DIR . $file;
    if ( file_exists( $path ) ) {
        require_once $path;
    }
}

// ── Blocchi Gutenberg custom ──────────────────────────────────────────────────
function ark_register_blocks(): void {
    register_block_type( ARK_DIR . '/blocks/hero' );
    register_block_type( ARK_DIR . '/blocks/services' );
    register_block_type( ARK_DIR . '/blocks/clients' );
    register_block_type( ARK_DIR . '/blocks/gallery-cta' );
    register_block_type( ARK_DIR . '/blocks/slider' );
    register_block_type( ARK_DIR . '/blocks/container' );
    register_block_type( ARK_DIR . '/blocks/contact' );
    register_block_type( ARK_DIR . '/blocks/testata' );
    register_block_type( ARK_DIR . '/blocks/map' );
    register_block_type( ARK_DIR . '/blocks/gallery' );
}
add_action( 'init', 'ark_register_blocks' );

// ── Enqueue assets splash page ────────────────────────────────────────────────
function ark_enqueue_splash_assets(): void {
    if ( ! is_front_page() ) return;

    wp_enqueue_script(
        'arkimedia-splash',
        ARK_URI . '/assets/js/splash.js',
        [ 'gsap' ],
        ARK_VERSION,
        true
    );
}
add_action( 'wp_enqueue_scripts', 'ark_enqueue_splash_assets' );

// ── Categoria blocchi Arkimedia ───────────────────────────────────────────────
function ark_register_block_category( array $categories ): array {
    return array_merge(
        [
            [
                'slug'  => 'arkimedia',
                'title' => __( 'Arkimedia', 'arkimedia' ),
                'icon'  => 'layout',
            ],
        ],
        $categories
    );
}
add_filter( 'block_categories_all', 'ark_register_block_category' );

// ── Enqueue menu hamburger ────────────────────────────────────────────────────
function ark_enqueue_menu_assets(): void {
    wp_enqueue_script(
        'arkimedia-menu',
        ARK_URI . '/assets/js/menu.js',
        [ 'gsap' ],
        ARK_VERSION,
        true
    );
}
add_action( 'wp_enqueue_scripts', 'ark_enqueue_menu_assets' );

// ── Enqueue contact form JS ───────────────────────────────────────────────────
function ark_enqueue_contact_assets(): void {
    if ( ! has_block( 'arkimedia/contact' ) ) return;

    wp_enqueue_script(
        'arkimedia-contact',
        ARK_URI . '/assets/js/contact.js',
        [ 'gsap' ],
        ARK_VERSION,
        true
    );
}
add_action( 'wp_enqueue_scripts', 'ark_enqueue_contact_assets' );

// ── Enqueue Fancybox ──────────────────────────────────────────────────────────
function ark_enqueue_fancybox(): void {
    wp_enqueue_style(
        'fancybox-css',
        'https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.css',
        [],
        '5.0'
    );
    wp_enqueue_script(
        'fancybox-js',
        'https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.umd.js',
        [],
        '5.0',
        true
    );
}
add_action( 'wp_enqueue_scripts', 'ark_enqueue_fancybox' );
