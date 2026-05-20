<?php
/**
 * Template: Front Page (Splash Page)
 *
 * @package Arkimedia
 */

get_header();

$custom_logo_id = get_theme_mod( 'custom_logo' );
$logo_url       = $custom_logo_id
    ? wp_get_attachment_image_url( $custom_logo_id, 'full' )
    : '';
$logo_alt       = get_bloginfo( 'name' );

$splash_link    = get_theme_mod( 'ark_splash_link',  home_url( '/home/' ) );
$splash_label   = get_theme_mod( 'ark_splash_label', __( 'Entra nel sito', 'arkimedia' ) );
$splash_bg      = get_theme_mod( 'ark_splash_bg',    '#1a1a2e' );
$splash_color   = get_theme_mod( 'ark_splash_color', '#ffffff' );
?>

<main id="splash" class="ark-splash"
    style="background:<?php echo esc_attr( $splash_bg ); ?>;">

    <div class="ark-splash__inner" style="color:<?php echo esc_attr( $splash_color ); ?>;">

        <?php if ( $logo_url ) : ?>
            <figure class="ark-splash__logo">
                <img src="<?php echo esc_url( $logo_url ); ?>"
                     alt="<?php echo esc_attr( $logo_alt ); ?>">
            </figure>
        <?php else : ?>
            <p class="ark-splash__site-name"><?php bloginfo( 'name' ); ?></p>
        <?php endif; ?>

        <p class="ark-splash__tagline"><?php bloginfo( 'description' ); ?></p>

        <a class="ark-splash__enter"
           href="<?php echo esc_url( $splash_link ); ?>"
           style="color:<?php echo esc_attr( $splash_color ); ?>;">
            <span class="ark-splash__enter-label">
                <?php echo esc_html( $splash_label ); ?>
            </span>
            <span class="ark-splash__enter-line"
                  style="background:<?php echo esc_attr( $splash_color ); ?>;"></span>
        </a>

    </div>

    <div class="ark-splash__bg-effect" aria-hidden="true"></div>

</main>

<?php get_footer(); ?>
