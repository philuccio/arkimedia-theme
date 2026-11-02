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

$splash_langs   = [
    'it' => 'Italiano',
    'en' => 'English',
    'es' => 'Español',
];
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

        <nav class="ark-splash__langs" aria-label="<?php esc_attr_e( 'Scegli la lingua', 'arkimedia' ); ?>">
            <?php foreach ( $splash_langs as $lang => $lang_name ) :
                $lang_url = ark_splash_lang_url( $lang );
                $lang_tag = $lang_url ? 'a' : 'span';
            ?>
                <<?php echo $lang_tag; ?> class="ark-splash__lang"
                    <?php if ( $lang_url ) : ?>href="<?php echo esc_url( $lang_url ); ?>"<?php endif; ?>
                    lang="<?php echo esc_attr( $lang ); ?>">
                    <img src="<?php echo esc_url( ARK_URI . '/assets/images/flags/' . $lang . '.svg' ); ?>"
                         alt="<?php echo esc_attr( $lang_name ); ?>" width="48" height="32">
                </<?php echo $lang_tag; ?>>
            <?php endforeach; ?>
        </nav>

    </div>

    <div class="ark-splash__bg-effect" aria-hidden="true"></div>

</main>

<?php get_footer(); ?>
