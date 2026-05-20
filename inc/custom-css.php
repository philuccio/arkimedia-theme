<?php
/**
 * Genera CSS custom properties dinamiche dal Customizer.
 *
 * @package Arkimedia
 */

if ( ! defined( 'ABSPATH' ) ) exit;

function ark_output_custom_css(): void {
    $font_heading        = get_theme_mod( 'ark_font_heading',        'Inter' );
    $font_body           = get_theme_mod( 'ark_font_body',           'Inter' );
    $font_size_base      = get_theme_mod( 'ark_font_size_base',      '16' );
    $font_weight_heading = get_theme_mod( 'ark_font_weight_heading', '700' );
    $line_height_body    = get_theme_mod( 'ark_line_height_body',    '1.6' );

    $color_primary    = get_theme_mod( 'ark_color_primary',    '#1a1a2e' );
    $color_accent     = get_theme_mod( 'ark_color_accent',     '#e94560' );
    $color_text       = get_theme_mod( 'ark_color_text',       '#1a1a1a' );
    $color_text_light = get_theme_mod( 'ark_color_text_light', '#555555' );
    $color_bg         = get_theme_mod( 'ark_color_bg',         '#ffffff' );
    $color_bg_alt     = get_theme_mod( 'ark_color_bg_alt',     '#f5f5f5' );
    $color_border     = get_theme_mod( 'ark_color_border',     '#e5e5e5' );
    $color_footer_bg  = get_theme_mod( 'ark_color_footer_bg',  '#1a1a2e' );

    ?>
    <style id="arkimedia-custom-props">
    :root {
        --color-primary:     <?php echo esc_attr( $color_primary ); ?>;
        --color-accent:      <?php echo esc_attr( $color_accent ); ?>;
        --color-text:        <?php echo esc_attr( $color_text ); ?>;
        --color-text-light:  <?php echo esc_attr( $color_text_light ); ?>;
        --color-bg:          <?php echo esc_attr( $color_bg ); ?>;
        --color-bg-alt:      <?php echo esc_attr( $color_bg_alt ); ?>;
        --color-border:      <?php echo esc_attr( $color_border ); ?>;
        --color-footer-bg:   <?php echo esc_attr( $color_footer_bg ); ?>;
        --font-heading:      '<?php echo esc_attr( $font_heading ); ?>', system-ui, sans-serif;
        --font-base:         '<?php echo esc_attr( $font_body ); ?>', system-ui, sans-serif;
        --font-size-base:    <?php echo absint( $font_size_base ); ?>px;
        --font-weight-heading: <?php echo esc_attr( $font_weight_heading ); ?>;
        --line-height-base:  <?php echo esc_attr( $line_height_body ); ?>;
    }

    body {
        font-family:  var(--font-base);
        font-size:    var(--font-size-base);
        line-height:  var(--line-height-base);
        color:        var(--color-text);
        background:   var(--color-bg);
    }

    h1, h2, h3, h4, h5, h6 {
        font-family:  var(--font-heading);
        font-weight:  var(--font-weight-heading);
    }

    .site-footer {
        background: var(--color-footer-bg);
    }
    </style>
    <?php
}
add_action( 'wp_head', 'ark_output_custom_css' );


// ── Google Fonts dinamici ─────────────────────────────────────────────────────
function ark_enqueue_google_fonts(): void {
    $font_heading = get_theme_mod( 'ark_font_heading', 'Inter' );
    $font_body    = get_theme_mod( 'ark_font_body',    'Inter' );

    $fonts = array_unique( [ $font_heading, $font_body ] );
    $families = implode( '&family=', array_map(
        fn( $f ) => str_replace( ' ', '+', $f ) . ':wght@300;400;500;600;700;800',
        $fonts
    ) );

    wp_enqueue_style(
        'arkimedia-google-fonts',
        'https://fonts.googleapis.com/css2?family=' . $families . '&display=swap',
        [],
        null
    );
}
add_action( 'wp_enqueue_scripts', 'ark_enqueue_google_fonts' );
